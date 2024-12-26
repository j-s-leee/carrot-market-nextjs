import db from "@/lib/db";
import { getAccessToken, getGithubUserEmail, getGithubUserProfile } from "@/lib/github";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import crypto from "crypto";
import sessionLogin from "@/lib/session-login";

async function getUniqueUsername(username:string) {
    const exists = await db.user.findUnique({
        where: {
            username,
        },
        select: {
            id: true
        }
    });
    if (exists) {
        return getUniqueUsername(`${username}-${crypto.randomBytes(5).toString('hex')}`);
    } else {
        return username;
    }
}

export async function GET(request:NextRequest) {
    const access_token = await getAccessToken(request);

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
        await sessionLogin(user.id);
        return redirect("/profile");
    } else {
        const email = await getGithubUserEmail(access_token);

        const newUser = await db.user.create({
            data: {
                username: await getUniqueUsername(login),
                github_id: id,
                avatar: avatar_url,
                email
            },
            select: {
                id: true
            }
        });

        await sessionLogin(newUser.id);
        return redirect("/profile");
    }
}


