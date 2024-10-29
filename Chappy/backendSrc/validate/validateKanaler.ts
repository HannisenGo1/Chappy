import Joi from "joi"
import { Message} from "../models/kanaler"

export const ChannelSchema = Joi.defaults(schema => {
    return schema.required()
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
}
).unknown(false)

export function isValidChannel(message: Message): boolean {
    let result = ChannelSchema.validate(message)
    return !result.error
}
