require('dotenv').config();
const mongoURI = process.env.CONNECTION_STRING;
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI),
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true,
            };

        console.log('MongoDB connection success');
    } catch (error) {
        console.error('MongoDB connection failed');
        process.exit(1);
    }
};

module.exports = connectDB;
