const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const validateCreateUser = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
        phone: Joi.string().required(),
        isAdmin: Joi.boolean(),
        address: Joi.string(),
        postalCode: Joi.string(),
        city: Joi.string(),
        country: Joi.string(),
    });
    return schema.validate(data);
};

module.exports = {
    validateCreateUser,
};
