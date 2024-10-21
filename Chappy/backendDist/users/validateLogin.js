import { getUserByname } from "../database/mongodb.js";
export async function validateLogin(username, password) {
    const user = await getUserByname(username);
    if (user && user.password === password) {
        return user._id.toString();
    }
    return null;
}
