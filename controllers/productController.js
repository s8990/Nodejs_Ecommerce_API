const mongoose = require('mongoose');
const ProductModel = require('../models/Product');
const CategoryModel = require('../models/Category');

const {
    validateCreateProduct,
    validateEditProduct,
} = require('../helpers/validators/ProductValidator');

const getProducts = async (req, res) => {
    // Query parameters: /api/v1/products?categories=12,13
    let filter = {};
    if (req.query.categories) {
        filter = { category: req.query.categories.split(',') };
    }

    const products = await ProductModel.find(filter)
        .select('name image')
        .populate('category')
        .exec();

    if (!products) {
        res.status(500).json({ success: false });
    }

    res.status(200).json(products);
};

const getProductById = async (req, res) => {
    const product = await ProductModel.findById(req.params.id)
        .populate('category')
        .exec();

    if (!product) {
        res.status(500).json({ success: false });
    }

    res.status(200).json(product);
};

const addProduct = async (req, res) => {
    try {
        const { error } = validateCreateProduct(req.body);
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        const category = await CategoryModel.findById(req.body.category);
        if (!category) {
            return res.status(400).send('Invalid category!');
        }

        const file = req.file;

        if (!file) {
            return res.status(400).send('No image in the request!');
        }

        const fileName = req.file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        let product = new ProductModel({
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: `${basePath}${fileName}`,
            brand: req.body.brand,
            price: req.body.price,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
            category: req.body.category,
        });

        product = await product.save();

        if (!product) {
            return res
                .status(500)
                .json({ success: false, message: 'Creating product failed!' });
        }

        return res.status(200).json({ success: true, product });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error,
        });
    }
};

const editProduct = async (req, res) => {
    try {
        const { error } = validateCreateProduct(req.body);
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        if (!mongoose.isValidObjectId(req.params.id)) {
            res.status(400).send('Invalid Product Id');
        }

        const category = await CategoryModel.findById(req.body.category);
        if (!category) {
            return res.status(400).send('Invalid category!');
        }

        const product = await ProductModel.findById(req.params.id);
        if (!product) {
            return res.status(400).send('Invalid product!');
        }

        const file = req.file;
        let imagePath;

        if (file) {
            const fileName = req.file.filename;
            const basePath = `${req.protocol}://${req.get(
                'host'
            )}/public/uploads`;
            imagePath = `${basePath}${fileName}`;
        } else {
            imagePath = product.image;
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: imagePath,
                brand: req.body.brand,
                price: req.body.price,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured,
                category: req.body.category,
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(500).send('Updating product failed!');
        }

        res.send(updatedProduct);
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error,
        });
    }
};

const deleteProduct = (req, res) => {
    ProductModel.findByIdAndRemove(req.params.id)
        .then((product) => {
            if (product) {
                return res.status(200).json({
                    success: true,
                    message: 'The product is deleted',
                });
            } else {
                return res
                    .status(404)
                    .json({ success: false, message: 'Product not found!' });
            }
        })
        .catch((error) => {
            return res.status(400).json({ success: false, error: error });
        });
};

const getProductsCount = async (req, res) => {
    try {
        const productCount = await ProductModel.countDocuments(
            (count) => count
        );

        if (!productCount) {
            res.status(500).json({ success: false });
        }

        res.status(200).json({
            productCount: productCount,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error,
        });
    }
};

const getFeaturedProducts = async (req, res) => {
    try {
        const count = req.params.count ? req.params.count : 0;
        const products = await ProductModel.find({ isFeatured: true }).limit(
            +count
        );

        if (!products) {
            res.status(500).json({ success: false });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error,
        });
    }
};

const addImagesToProduct = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Product Id');
    }

    const product = await ProductModel.findById(req.params.id);
    if (!product) {
        return res.status(400).send('Invalid product!');
    }

    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    if (files) {
        files.map((file) => {
            imagesPaths.push(`${basePath}${file.filename}`);
        });
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
        req.params.id,
        {
            images: imagesPaths,
        },
        { new: true }
    );

    if (!updatedProduct) {
        return res.status(500).send('Updating product failed!');
    }

    res.send(updatedProduct);
};

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    editProduct,
    deleteProduct,
    getProductsCount,
    getFeaturedProducts,
    addImagesToProduct,
};
