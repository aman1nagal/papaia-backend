const { default: mongoose } = require("mongoose");

require("dotenv").config();

const database = process.env.DB_NAME;
const host = process.env.HOST;
const port = process.env.DB_PORT;
const mongo = process.env.DB_TYPE;

const uri = `${mongo}://${host}:${port}/${database}`;

const db = async () => {
    try {
        await mongoose.connect(uri);
    } catch (err) {
        console.error("errrr", err);
    }
};

module.exports = db;
