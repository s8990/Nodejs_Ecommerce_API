const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const validateCreateCategory = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        icon: Joi.string(),
        color: Joi.string(),
    });
    return schema.validate(data);
};

const validateEditCategory = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        icon: Joi.string(),
        color: Joi.string(),
    });
    return schema.validate(data);
};

module.exports = {
    validateCreateCategory,
    validateEditCategory,
};
