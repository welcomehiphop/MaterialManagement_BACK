const util = require("util");
const multer = require("multer");
const { Dir } = require("fs");
var path = require('path');
const e = require("express");
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, __basedir + '/upload/images');
    },
    filename: (req, file, callback) => {
        var datetimestamp = Date.now();
        callback(null, "image" + '_' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    },
})

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: (req, file, callback) => {
        let ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.PNG' && ext !== '.jpg' && ext !== '.JPG' && ext !== '.gif' && ext !== '.GIF' && ext !== '.jpeg' && ext !== '.JPEG') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    }
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;