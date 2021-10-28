const CategoryModel = require('../models/Category');

const {
    validateCreateCategory,
    validateEditCategory,
} = require('../helpers/validators/CategoryValidator');

const getCategories = async (req, res) => {
    const categories = await CategoryModel.find();

    if (!categories) {
        res.status(500).json({ success: false });
    }

    res.status(200).json(categories);
};

const getCategoryById = async (req, res) => {
    const category = await CategoryModel.findById(req.params.id);

    if (!category) {
        res.status(500).json({
            success: false,
            message: 'Category not found!',
        });
    }

    res.status(200).json(category);
};

const addCategory = async (req, res) => {
    try {
        const { error } = validateCreateCategory(req.body);
        if (error) {
            return res.status(400).json({ error: error.message });
        }

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
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error,
        });
    }
};

const editCategory = async (req, res) => {
    try {
        const { error } = validateEditCategory(req.body);
        if (error) {
            return res.status(400).json({ error: error.message });
        }

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
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error,
        });
    }
};

const deleteCategory = (req, res) => {
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
};

module.exports = {
    getCategories,
    getCategoryById,
    addCategory,
    editCategory,
    deleteCategory,
};
