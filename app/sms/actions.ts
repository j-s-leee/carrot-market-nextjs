"use server"
import {z} from "zod"
import validator from "validator"
import { redirect } from "next/navigation";
import crypto from "crypto";
import db from "@/lib/db";
import sessionLogin from "@/lib/session-login";

const phoneSchema = z.string()
    .trim()
    .refine(
        (phone) => validator.isMobilePhone(phone, "ko-KR"),
        "Wrong phone format"
    );

async function tokenExists(token:number) {
    const exists = await db.sMSToken.findUnique({
        where: {
            token: token.toString(),
        },
        select: {
            id: true,
        }
    });

    return Boolean(exists);
}

const tokenSchema = z.coerce
    .number()
    .min(100000)
    .max(999999)
    .refine(tokenExists, "This token does not exists.");

async function getToken() {
    const token = crypto.randomInt(100000, 999999).toString();
    const exists = await db.sMSToken.findUnique({
        where: {
            token
        },
        select: {
            id: true
        }
    });
    if (exists) {
        return getToken();
    } else {
        return token;
    }
}

interface ActionState {
    token: boolean;
}

export async function smsLogin(prevState: ActionState, formData: FormData) {
    const phone = formData.get('phone');
    const token = formData.get('token');
    if (!prevState.token) {
        const result = phoneSchema.safeParse(phone);
        if (!result.success) {
            return {
                token: false,
                error: result.error.flatten(),
            }
        } else {
            // trunk token with phone number
            await db.sMSToken.deleteMany({
                where: {
                    user: {
                        phone: result.data
                    }
                }
            });

            // create token
            const token = await getToken();
            
            // save token
            await db.sMSToken.create({
                data: {
                    token,
                    user: {
                        connectOrCreate: {
                            where: {
                                phone: result.data
                            },
                            create: {
                                username: crypto.randomBytes(10).toString("hex"),
                                phone: result.data
                            }
                        }
                    }
                }
            });

            // send token sms
            console.log(`token ${token} is sent to ${phone}`);

            // and  return
            return {
                token: true
            }
        }
    } else {
        const result = await tokenSchema.spa(token);
        if (!result.success) {
            return {
                token: true,
                error: result.error.flatten(),
            }
        } else {
            // validate token
            const token = await db.sMSToken.findUnique({
                where: {
                    token: result.data.toString(),
                },
                select: {
                    id: true,
                    userId: true
                }
            });

            // login
            await sessionLogin(token!.userId);
            await db.sMSToken.delete({
                where: {
                    id: token!.id
                }
            });
            redirect("/profile");
        }
    }
}