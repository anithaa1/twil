const Joi = require('joi');

const user = Joi.object({

       name: Joi.string()
              .min(5)
              .max(30)
              .required(),

       email: Joi.string()
              .email()
              .min(5)
              .max(50)
              .optional(),

              phone_number: Joi.string()
              .required()
              .min(1)
              .max(15),

       password: Joi.string()
              .optional(),
       salt: Joi.string()
              .optional(),
});
module.exports=user