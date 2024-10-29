import Joi from "joi";
export const ChannelSchema = Joi.defaults(schema => {
    return schema.required();
})
    .object({
    users: Joi.string()
        .min(1)
        .required(),
    name: Joi.string()
        .min(1)
        .required(),
    message: Joi.string()
        .min(1)
        .required()
}).unknown(false);
export function isValidChannel(message) {
    let result = ChannelSchema.validate(message);
    return !result.error;
}
