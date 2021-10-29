const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const validateCreateOrder = (data) => {
    const schema = Joi.object({
        orderItems: Joi.array().items(
            Joi.object({
                quantity: Joi.number().required(),
                product: Joi.string().required(),
            })
        ),
        shippingAddress: Joi.string().required(),
        city: Joi.string().required(),
        postalCode: Joi.string().required(),
        country: Joi.string().required(),
        phone: Joi.string().required(),
        user: Joi.string().required(),
    });
    return schema.validate(data);
};

module.exports = {
    validateCreateOrder,
};
