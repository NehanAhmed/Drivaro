'use server'

import { auth } from "../auth";

export async function isAuth() {
    try {
        const session = await auth.api.getSession();
        return session?.user ? true : false;

    } catch (error) {
        console.error("Error checking authentication:", error);
        return false;
    }
}