"use server"
import {z} from "zod"
import validator from "validator"
import { redirect } from "next/navigation";
import crypto from "crypto";
import db from "@/lib/db";
import sessionLogin from "@/lib/session-login";
import { sendSMSToken } from "@/utils/sms";

const phoneSchema = z.string()
    .trim()
    .refine(
        (phone) => validator.isMobilePhone(phone, "ko-KR"),
        { message: "Wrong phone format" }
    );

async function tokenExists(token:number) {
    const exists = await db.sMSToken.findUnique({
        where: { token: token.toString() },
        select: { id: true }
    });

    return !!exists;
}

const tokenSchema = z.coerce
    .number()
    .min(100000)
    .max(999999)
    .refine(tokenExists, {message: "This token does not exists."});

async function getToken(): Promise<string> {
    const token = crypto.randomInt(100000, 999999).toString();
    const exists = await db.sMSToken.findUnique({
        where: { token },
        select: { id: true }
    });
    return exists ? getToken() : token;
}

interface ActionState {
    token: boolean;
    phone?: string;
    error?: Record<string, string[]>;
}

export async function smsLogin(
    prevState: ActionState, formData: FormData
): Promise<ActionState> {
    const phone = formData.get('phone') as string;
    const token = formData.get('token') as string;

    if (!prevState.token) {
        const phoneValidation = phoneSchema.safeParse(phone);

        if (!phoneValidation.success) {
            return {
                ...prevState,
                error: {phone: phoneValidation.error.errors.map((e) => e.message),}
            }
        }

        // trunk token with phone number
        await db.sMSToken.deleteMany({
            where: {
                phone: phoneValidation.data
            }
        });

        // create token
        const generatedToken = await getToken();
        
        // save token
        await db.sMSToken.create({
            data: {
                token: generatedToken,
                phone: phoneValidation.data,
                user: {
                    connectOrCreate: {
                        where: {
                            phone: phoneValidation.data
                        },
                        create: {
                            username: crypto.randomBytes(5).toString("hex"),
                            phone: phoneValidation.data
                        }
                    }
                }
            }
        });

        // send token sms
        await sendSMSToken(phoneValidation.data, generatedToken);

        // and  return
        return {
            token: true,
            phone: phoneValidation.data
        }
    } else {

        const phoneValidation = phoneSchema.safeParse(phone);
        const tokenValidation = await tokenSchema.spa(token);
        
        if (!phoneValidation.success) {
            return { ...prevState, error: { phone: phoneValidation.error.errors.map((e) => e.message) } };
        }

        if (!tokenValidation.success) {
            return { ...prevState, error: { token: tokenValidation.error.errors.map((e) => e.message) } };
        }


        if (phoneValidation.data !== prevState.phone) {
            return { ...prevState, error: { phone: ["Phone number mismatch"] } };
        }

        // validate token
        const tokenRecord = await db.sMSToken.findUnique({
            where: {
                token: tokenValidation.data.toString(),
            },
            select: {
                id: true,
                userId: true
            }
        });

        if (!tokenRecord) {
            return { ...prevState, error: { token: ["Token Validation failed."] } };
        }

        // login
        await sessionLogin(tokenRecord.userId);
        await db.sMSToken.delete({
            where: {
                id: tokenRecord.id
            }
        });
        redirect("/profile");
    }
}