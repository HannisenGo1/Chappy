import Joi from "joi";

export const schema = Joi.object({
    name: 
    Joi.string()
    .min(3)
    .required()
    .messages({
      'string.min': 'Användarnamn måste vara minst 3 bokstäver.'
     
    }),
    password: 
    Joi.string()
    .min(5)
    .required()
    .messages({
      'string.min': 'Lösenordet måste vara minst 5 tecken.'
    }),
  });