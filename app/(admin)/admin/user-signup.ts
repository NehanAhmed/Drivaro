import { eq } from "drizzle-orm";
import { auth } from "../../../lib/auth";
import { db } from "../../../lib/db";
import { user } from "../../../lib/db/schema";

export async function createAdmin() {
    const response = await auth.api.signUpEmail({
        body: {
            email: "nehanahmed2k23@gmail.com",
            name: "Nehan Ahmed",
            password: "nehanansari988",
            rememberMe: true
        },

    })

    await db.update(user).set({
        role: 'admin'
    }).where(eq(user.id, response.user.id))

}

