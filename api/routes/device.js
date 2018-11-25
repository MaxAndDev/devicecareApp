const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

//Business Logic Functions
const mailer = require('../controller/mailer');

//DB Schema
const Device = require('../model/device');

//GET add parameters via . to find for filters see Video MongoDB and Mongoose
router.get('/', checkAuth , (req, res, next) => {
   Device.find()
   .select('_id model producer status timestamp count')
   .exec()
   .then(docs => {
       const response = {
           count: docs.length,
           devices: docs
       };
       res.status(200).json(response);
   })
   .catch(err => {
       console.log(err);
       res.status(500).json(err);
   })
});

//POST
router.post('/', checkAuth , (req, res, next) => {
    const device = new Device({
        _id: new mongoose.Types.ObjectId(),
        model: req.body.model,
        producer: req.body.producer,
        owner: req.body.owner,
        status: req.body.status,
        timestamp: new Date()
    });
    device.save().then(result => {
        console.log(result);
        mailer(req.headers.authorization.split(" ")[1], result._id);
        res.status(200).json({
        message: "POST Device",
        createDevice: device
    }).catch(err =>{
        console.log(err);
        res.statur(500).json(err);
    });
    })
});


//GET by ID
router.get('/:deviceId', checkAuth , (req, res, next) => {
   const id = req.params.deviceId;
   Device.findById(id)
   .exec()
   .then(doc => {
       console.log("From DB: ",doc);
       if (doc) {
        res.status(200).json(doc);
       } else {
           res.status(404).json({
               message: "Nothing found for this ID"
           })
       }
   }).catch(err => {
       console.log(err);
       res.status(500).json(err);
   });
});

//PATCH by ID
router.patch('/:deviceId', checkAuth, (req, res, next) => {
    const id = req.params.deviceId;
    Device.updateOne({_id:id}, {$set : {status : req.body.status, timestamp: new Date()}})
    .exec()
    .then( result => {
        res.status(200).json(result)
    }).catch( err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

//DELETE by ID
router.delete('/:deviceId', checkAuth,  (req, res, next) => {
    const id = req.params.deviceId;
    Device.deleteOne({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "deleted object",
            obj: result
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
});

module.exports = router;