import Joi from "joi";
import { ChatMessage } from "../chats/allChats";


export const ChatMessageSchema = Joi.object({
    sender: Joi.string()
        .min(1)
        .required(),
    receiver: Joi.string()
        .min(1)
        .required(),
    message: Joi.string()
        .min(1)
        .required()
}).required(); 


export function isItValid(chatMessage: ChatMessage): boolean {
    const result = ChatMessageSchema.validate(chatMessage);
    return !result.error;
}
