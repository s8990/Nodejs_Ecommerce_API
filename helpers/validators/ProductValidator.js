const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const validateCreateProduct = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        richDescription: Joi.string(),
        image: Joi.string(),
        brand: Joi.string(),
        price: Joi.number(),
        countInStock: Joi.number().required(),
        rating: Joi.number(),
        numReviews: Joi.number(),
        isFeatured: Joi.boolean(),
        category: Joi.objectId().required(),
    });
    return schema.validate(data);
};

const validateEditProduct = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        richDescription: Joi.string(),
        image: Joi.string(),
        brand: Joi.string(),
        price: Joi.number(),
        countInStock: Joi.number().required(),
        rating: Joi.number(),
        numReviews: Joi.number(),
        isFeatured: Joi.boolean(),
        category: Joi.objectId().required(),
    });
    return schema.validate(data);
};

module.exports = {
    validateCreateProduct,
    validateEditProduct,
};
