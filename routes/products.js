const express = require('express');
const CategoryModel = require('../models/Category');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const ProductModel = require('../models/Product');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }

        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const filename = file.originalname.replace(' ', '-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${filename}-${Date.now()}.${extension}`);
    },
});

const uploadOptions = multer({ storage: storage });

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

router.post(`/`, uploadOptions.single('image'), async (req, res) => {
    try {
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
});

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
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
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads`;
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

router.put(
    '/gallery-images/:id',
    uploadOptions.array('images', 10),
    async (req, res) => {
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
    }
);

module.exports = router;
