import Joi from 'joi'

export default Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8).max(32)
})
