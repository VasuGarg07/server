const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const api = require('./routes/auth.routes');
const connectDb = require('./config/connect');

const port = process.env.PORT || 3000;
const db_url = process.env.MONGO_URI;

const app = express();
app.use(cors());            // CORS Policy
app.use(express.json());     // JSON
app.use('/api', api);        //  Load Routes

// Express error handling
app.use((req, res, next) => {
    setImmediate(() => {
        res.redirect("/api");
    })
})
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    res.status(err.statusCode).send(err.message);
})

// Connect Database
connectDb(db_url).then(
    app.listen(port, () => {
        console.log(`Server listening at localhost:${port}`);
    })
).catch(err => console.log(err));
