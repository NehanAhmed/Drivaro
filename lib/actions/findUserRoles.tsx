import { eq } from "drizzle-orm"
import { db } from "../db"
import { user } from "../db/schema"

export const findUserRoles = async (userId: string) => {
    try {
        if (!userId) {
            throw new Error("NO user id Provided")
            return null
        }
        const [userData] = await db.select().from(user).where(eq(user.id, userId)).limit(1)

        return userData.role;
    } catch (error) {
        return error;
    }

}