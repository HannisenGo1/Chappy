import Joi from "joi";
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
export function isItValid(chatMessage) {
    const result = ChatMessageSchema.validate(chatMessage);
    return !result.error;
}
