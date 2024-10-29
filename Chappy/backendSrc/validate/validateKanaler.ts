import Joi from "joi"
import { Channel} from "../models/kanaler"

export const ChannelSchema = Joi.defaults(schema => {
    return schema.required()
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
}
).unknown(false)

export function isValidChannel(channel: Channel): boolean {
    let result = ChannelSchema.validate(channel)
    return !result.error
}
