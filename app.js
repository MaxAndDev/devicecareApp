const express = require('express');
const app = express();
const morgen = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const deviceRoutes = require('./api/routes/device');
const userRoutes = require('./api/routes/user');

//DB
mongoose.connect('mongodb://localhost:27017/API', { useNewUrlParser: true });
mongoose.connection.on('connected', () => {
    console.log("DB Connection Successful to API at " + new Date());
});
mongoose.connection.on('error',(err)=>{
    console.log('database error: '+err);
})

//CORS essential to communicate with the client
app.use(cors());

//Logging 
app.use(morgen('dev'));

//Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Accces-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Accces-Control-Allow-Headers', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({})
    }
    next();
});

//Routes
app.use('/device', deviceRoutes);
app.use('/user', userRoutes);


//Error Handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;