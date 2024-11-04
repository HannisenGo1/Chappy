import Joi from 'joi';


export const messageValidationSchema = Joi.object({
  content: Joi.string()
  .min(1)
  .required()
  .messages({
    'string.empty': 'Meddelandet får inte vara tomt.',
    'string.min': 'Meddelandet måste innehålla minst ett tecken.',
  }),
});

export const validateMessage = (message: string) => {
  const { error } = messageValidationSchema.validate({ content: message });
  return error ? error.details[0].message : null;
};
