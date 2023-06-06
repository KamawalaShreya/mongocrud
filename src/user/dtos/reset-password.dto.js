import Joi from 'joi'

export default Joi.object().keys({
    email: Joi.string().email().required(),
    newPassword: Joi.string().required().min(8).max(32),
    confirmPassword : Joi.string().valid(Joi.ref('newPassword')).required().min(8).max(32)
})
