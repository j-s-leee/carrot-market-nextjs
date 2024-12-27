"use client"

import Input from "@/components/input";
import Button from "@/components/button";
import { useActionState } from "react";
import { smsLogin } from "./actions";


const initialState = {
    token: false,
    phone: '',
    error: undefined,
}

export default function SMSLogin() {
    const [state, dispatch] = useActionState(smsLogin, initialState);
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">SMS Login</h1>
                <h2 className="text-xl">Verify your phone number.</h2>
            </div>
            <form action={dispatch} className="flex flex-col gap-3">
                <Input
                    name="phone"
                    required
                    type="number"
                    placeholder="Phone number"
                    errors={state.error?.phone}
                /> 
                {state.token && (
                    <Input
                        name="token"
                        required
                        type="number"
                        placeholder="Verification code"
                        min={100000}
                        max={999999}
                        errors={state.error?.token}
                    />
                )}
                <Button text={state.token ? "Verify" : "send verification sms"} />
            </form>
        </div>
    )
}