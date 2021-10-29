const bcrypt = require('bcryptjs');
const UserModel = require('../models/User');

const { validateCreateUser } = require('../helpers/validators/UserValidator');

const getUsers = async (req, res) => {
    const users = await UserModel.find().select('name username phone email');

    if (!users) {
        res.status(500).json({ success: false });
    }

    res.status(200).json(users);
};

const getUserById = async (req, res) => {
    const user = await UserModel.findById(req.params.id).select('-password');

    if (!user) {
        res.status(500).json({
            success: false,
            message: 'User not found!',
        });
    }

    res.status(200).json(user);
};

const getUsersCount = async (req, res) => {
    try {
        const userCount = await UserModel.countDocuments((count) => count);

        if (!userCount) {
            res.status(500).json({ success: false });
        }

        res.status(200).json({
            userCount: userCount,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error,
        });
    }
};

const addUser = async (req, res) => {
    try {
        const { error } = validateCreateUser(req.body);
        if (error) {
            return res.status(400).json({ error: error.message });
        }

        let user = new UserModel({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            address: req.body.address,
            postalCode: req.body.postalCode,
            city: req.body.city,
            country: req.body.country,
        });
        user = await user.save();

        if (!user) {
            return res.status(400).send('Creating user failed!');
        }

        res.status(201).json({
            success: true,
            user: user,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error,
        });
    }
};

const updateUser = (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'The user is updated',
    });
};

const deleteUser = (req, res) => {
    UserModel.findByIdAndRemove(req.params.id)
        .then((user) => {
            if (user) {
                return res.status(200).json({
                    success: true,
                    message: 'The user is deleted',
                });
            } else {
                return res
                    .status(404)
                    .json({ success: false, message: 'User not found!' });
            }
        })
        .catch((error) => {
            return res.status(400).json({ success: false, error: error });
        });
};

module.exports = {
    getUsers,
    getUserById,
    getUsersCount,
    addUser,
    deleteUser,
    updateUser,
};
