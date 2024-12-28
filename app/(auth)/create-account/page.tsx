"use client"

import Input from "@/components/input";
import Button from "@/components/button";
import SocialLogin from "@/components/social-login";
import { useActionState } from "react";
import { createAccount } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function CreateAccount() {
    const [state, dispatch] = useActionState(createAccount, null);
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">안녕하세요!</h1>
                <h2 className="text-xl">Fill in the form below to join!</h2>
            </div>
            <form action={dispatch} className="flex flex-col gap-3">
                <Input name="username" required type="text" placeholder="Username" errors={state?.fieldErrors.username} />
                <Input name="email" required type="email" placeholder="Email" errors={state?.fieldErrors.email} />
                <Input name="password" required type="password" placeholder="Password" minLength={PASSWORD_MIN_LENGTH} errors={state?.fieldErrors.password} />
                <Input name="confirm_password" required type="password" placeholder="Confirm Password" minLength={PASSWORD_MIN_LENGTH} errors={state?.fieldErrors.confirm_password} />
                <Button text="Create account" />
            </form>
            <SocialLogin />
    </div>
    )
}