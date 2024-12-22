import db from "@/lib/db";
import { getAccessToken, getGithubUserEmail, getGithubUserProfile } from "@/lib/github";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

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
        const session = await getSession();
        session.id = user.id;
        await session.save();
        return redirect("/profile");
    }

    const email = await getGithubUserEmail(access_token);

    const newUser = await db.user.create({
        data: {
            username: login,
            github_id: id,
            avatar: avatar_url,
            email
        },
        select: {
            id: true
        }
    });

    const session = await getSession();
    session.id = newUser.id;
    await session.save();
    return redirect("/profile");
}


