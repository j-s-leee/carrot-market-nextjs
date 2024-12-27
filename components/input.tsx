import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement>  {
    name: string;
    errors?: string[];
}

export default function Input({name, errors, ...rest}: InputProps) {
    return <div className="flex flex-col gap-2">
    <input
        name={name}
        {...rest}
        className="bg-transparent rounded-md w-full h-10 
        focus:outline-none ring-2 
        focus:ring-4 ring-neutral-200 
        focus:ring-orange-500 transition border-none placeholder:text-neutral-400"/>
    {errors?.map((error, index) => (
        <span key={index} className="text-red-500 font-medium">{error}</span>
    ))}
</div>
}