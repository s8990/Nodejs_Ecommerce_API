const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    richDescription: { type: String, default: '' },
    image: { type: String, default: '' },
    images: [{ type: String }],
    brand: { type: String, default: '' },
    price: { type: Number, default: 0 },
    countInStock: { type: Number, required: true, min: 0, max: 1000000 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    dateCreated: { type: Date, default: Date.now },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
});

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;
