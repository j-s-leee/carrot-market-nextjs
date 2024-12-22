import { notFound } from "next/navigation";
import { NextRequest } from "next/server";

export async function getAccessToken(request:NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    if (!code) {
        return notFound();
    }
    const baseURL = "https://github.com/login/oauth/access_token";
    const data = {
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
    };

    const {error, access_token} = await (await (await fetch(`${baseURL}?${new URLSearchParams(data).toString()}`, {
        method: "POST",
        headers: {
            Accept: "application/json"
        }
    })).json());

    if (error) {
        return new Response(null, {status: 400});
    }
    return access_token;
}


export async function getGithubUserProfile(access_token: string): Promise<{ login: string; id: number; avatar_url: string; }> {
    return await (await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${access_token}`
        },
        cache: "no-cache"
    })).json();
}

export async function getGithubUserEmail(access_token: string) {
    const emailResponse = await (await fetch("https://api.github.com/user/emails", {
        headers: {
            Authorization: `Bearer ${access_token}`
        },
        cache: "no-cache"
    })).json();
    return emailResponse.find((item: any) => item.primary)?.email || null;
}