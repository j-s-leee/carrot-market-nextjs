"use server"
import {z} from "zod"

const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/);
const checkPasswords = ({password, confirm_password}:{password:string, confirm_password:string}) => password === confirm_password

const formSchema = z.object({
    username: z.string({
        invalid_type_error: "Username must be a string!",
        required_error: "Where is username?",
    }).min(3, "too short").max(10, "too looooooooong")
    .trim().toLowerCase(),
    email: z.string().email(),
    password: z.string().min(10).regex(passwordRegex, "password must contain at least one lowercase, UPPERCASE, number, special characters like !@#$%^&*"),
    confirm_password: z.string().min(10),
}).refine(checkPasswords, {
    message: "wrong password",
    path: ["confirm_password"]
});



export async function handleForm(prevState:any, formData:FormData) {
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