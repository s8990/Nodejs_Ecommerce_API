const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserModel = require('../models/User');

const register = async (req, res) => {
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

    if (!user) return res.status(400).send('the user cannot be created!');

    res.send(user);
};

const login = async (req, res) => {
    const user = await UserModel.findOne({ username: req.body.username });
    const JWT_SECURITY_KEY = process.env.JWT_SECURITY_KEY;

    if (!user) {
        return res.status(400).json('The user not found!');
    }

    if (user && bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin,
            },
            JWT_SECURITY_KEY,
            { expiresIn: '1d' }
        );

        res.status(200).send({ user: user.username, token: token });
    } else {
        res.status(400).send('password is wrong!');
    }
};

module.exports = {
    register,
    login,
};
