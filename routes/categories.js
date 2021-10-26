const { response } = require('express');
const express = require('express');
const router = express.Router();

const CategoryModel = require('../models/Category');

router.get(`/`, async (req, res) => {
    const categories = await CategoryModel.find();

    if (!categories) {
        res.status(500).json({ success: false });
    }

    res.status(200).json(categories);
});

router.get(`/:id`, async (req, res) => {
    const category = await CategoryModel.findById(req.params.id);

    if (!category) {
        res.status(500).json({
            success: false,
            message: 'Category not found!',
        });
    }

    res.status(200).json(category);
});

router.post(`/`, async (req, res) => {
    let category = new CategoryModel({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
    });
    category = await category.save();

    if (!category) {
        return res.status(400).send('Creating category failed!');
    }

    res.send(category);
});

router.put('/:id', async (req, res) => {
    const category = await CategoryModel.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color,
        },
        { new: true }
    );

    if (!category) {
        return res.status(500).send('Updating category failed!');
    }

    res.send(category);
});

router.delete('/:id', (req, res) => {
    CategoryModel.findByIdAndRemove(req.params.id)
        .then((category) => {
            if (category) {
                return res.status(200).json({
                    success: true,
                    message: 'The category is deleted',
                });
            } else {
                return res
                    .status(404)
                    .json({ success: false, message: 'Category not found!' });
            }
        })
        .catch((error) => {
            return res.status(400).json({ success: false, error: error });
        });
});

module.exports = router;
