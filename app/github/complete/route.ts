import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request:NextRequest) {
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
    const formattedParams = new URLSearchParams(data).toString();

    const fetchURL = `${baseURL}?${formattedParams}`;
    const {error, access_token} = await getAccessToken(fetchURL);
    if (error) {
        return new Response(null, {status: 400});
    }

    const {login, id, avatar_url} = await getGithubUserProfile(access_token);

    const user = await db.user.findUnique({
        where: {
            github_id: id
        },
        select: {
            id: true
        }
    });

    if (user) {
        const session = await getSession();
        session.id = user.id;
        await session.save();
        return redirect("/profile");
    }

    const newUser = await db.user.create({
        data: {
            username: login,
            github_id: id,
            avatar: avatar_url
        },
        select: {
            id: true
        }
    });
    console.log(newUser);

    const session = await getSession();
    session.id = newUser.id;
    await session.save();
    return redirect("/profile");
}

async function getGithubUserProfile(access_token: string): Promise<{ login: string; id: number; avatar_url: string; }> {
    return await (await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${access_token}`
        },
        cache: "no-cache"
    })).json();
}

async function getAccessToken(fetchURL: string): Promise<{ error: any; access_token: string; }> {
    return await (await fetch(fetchURL, {
        method: "POST",
        headers: {
            Accept: "application/json"
        }
    })).json();
}
