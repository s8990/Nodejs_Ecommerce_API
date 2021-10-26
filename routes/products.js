const express = require('express');
const CategoryModel = require('../models/Category');
const router = express.Router();
const mongoose = require('mongoose');

const ProductModel = require('../models/Product');

router.get(`/`, async (req, res) => {
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
});

router.get(`/:id`, async (req, res) => {
    const product = await ProductModel.findById(req.params.id)
        .populate('category')
        .exec();

    if (!product) {
        res.status(500).json({ success: false });
    }

    res.status(200).json(product);
});

router.post(`/`, async (req, res) => {
    const category = await CategoryModel.findById(req.body.category);
    if (!category) {
        return res.status(400).send('Invalid category!');
    }

    let product = new ProductModel({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
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
});

router.put('/:id', async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Product Id');
    }

    const category = await CategoryModel.findById(req.body.category);
    if (!category) {
        return res.status(400).send('Invalid category!');
    }

    const product = await ProductModel.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
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

    if (!product) {
        return res.status(500).send('Updating product failed!');
    }

    res.send(product);
});

router.delete('/:id', (req, res) => {
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
});

router.get(`/get/count`, async (req, res) => {
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
});

router.get(`/get/featured/:count`, async (req, res) => {
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
});

module.exports = router;
