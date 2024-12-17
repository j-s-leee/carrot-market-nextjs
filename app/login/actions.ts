"use server"

export async function handleForm(prevState: any, data: FormData) {
        console.log(data.get('email'), data.get('password'));
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log('use server');
        return {
            errors: ['wrong password', 'password too short']
        }
    }