var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/hydra');
mongoose.createConnection('mongodb://localhost/hydra');

var Conf = require('../../model/conf');
var Conf = mongoose.model('conf',Conf);
var express = require('express');
var router = express.Router();
var arm = process.arch === 'arm';

exports.getAllChannels = function getAllChannels() {
    var callback = function() {
        return function(error, data) {
            if(error) {
                console.log("Error: " + error);
            }
            //console.log("Boards from Server (fct): " + data);
        }
    };

    return Conf.find({}, callback());
};

