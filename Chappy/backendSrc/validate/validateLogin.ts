import { getUserByname } from "../database/mongodb.js"; 
import Joi from "joi";


const userSchema = Joi.object({
    name: Joi.string()
    .min(1)
    .required(),
    password: Joi.string()
    .min(4) 
    .required()
}).unknown(false);

export async function validateLogin(name: string, password: string): Promise<string | null> {
    
    const { error } = userSchema.validate({ name, password });
    
    if (error) {
        console.error('Valideringsfel:', error);
        return null; 
    }
    
    const user = await getUserByname(name); 
    console.log('Hämtad användare:', user);
    
    if (user && user.password === password) { 
        return user._id.toString(); 
    }
    
    return null; 
}
