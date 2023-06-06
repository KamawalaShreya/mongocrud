import Joi from "joi";

export default Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8).max(32),
    // password: Joi.string()
    //   .regex(/^(?=.{8,})(?=.*[A-Z]).*$/)
    //   .required()
    //   .messages({
    //     "string.pattern.base": "Password does not meet the requirements",
    //   }),
    phoneNo: Joi.string()
      .min(7)
      .max(15)
      .regex(/^\+?[1-9]\d{1,14}$/)
      .required(),
    // profileImage: Joi.required()
  });
  