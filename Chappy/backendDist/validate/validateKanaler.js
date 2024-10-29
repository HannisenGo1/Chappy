import Joi from "joi";
export const ChannelSchema = Joi.defaults(schema => {
    return schema.required();
})
    .object({
    users: Joi.string()
        .min(1)
        .required(),
    topic: Joi.string()
        .min(1)
        .required(),
    message: Joi.string()
        .min(1)
        .required(),
    isOpen: Joi.boolean,
    description: Joi.string()
        .min(1)
        .required()
}).unknown(false);
export function isValidChannel(channel) {
    let result = ChannelSchema.validate(channel);
    return !result.error;
}
