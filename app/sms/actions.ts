"use server"
import {z} from "zod"
import validator from "validator"
import { redirect } from "next/navigation";
import crypto from "crypto";
import db from "@/lib/db";

const phoneSchema = z.string()
    .trim()
    .refine(
        (phone) => validator.isMobilePhone(phone, "ko-KR"),
        "Wrong phone format"
    );
const tokenSchema = z.coerce.number().min(100000).max(999999);

async function getToken() {
    return crypto.randomInt(100000, 999999).toString();
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
            db.sMSToken.create({
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
            })

            // send token sms

            // and  return
            return {
                token: true
            }
        }
    } else {
        const result = tokenSchema.safeParse(token);
        if (!result.success) {
            return {
                token: true,
                error: result.error.flatten(),
            }
        } else {
            // validate token
            // validate phone number
            // login
            redirect("/");
        }
    }
}