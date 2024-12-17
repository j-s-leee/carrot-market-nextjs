"use client";

import { useFormStatus } from "react-dom";

interface FormButtonProps {
    text: string;
}

export default function FormButton({text}: FormButtonProps) {
    const {pending} = useFormStatus();
    return <button disabled={pending} className="h-10 primary-btn disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed">{pending? "Loading...":text}</button>
}