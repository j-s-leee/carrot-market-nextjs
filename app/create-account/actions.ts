"use server"
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";
import {z} from "zod"

const checkPasswords = ({password, confirm_password}:{password:string, confirm_password:string}) => password === confirm_password

const formSchema = z.object({
    username: z.string({
        invalid_type_error: "Username must be a string!",
        required_error: "Where is username?",
    }).trim().toLowerCase(),
    email: z.string().email(),
    password: z.string().min(PASSWORD_MIN_LENGTH).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
}).refine(checkPasswords, {
    message: "wrong password",
    path: ["confirm_password"]
});



export async function createAccount(prevState:any, formData:FormData) {
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirm_password: formData.get("confirm_password"),
    };

    const result = formSchema.safeParse(data);
    if (!result.success) {
        console.log(result.error.flatten());
        return result.error.flatten();
    }
}