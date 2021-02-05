const util = require("util");
const multer = require("multer");


let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, __basedir + '/upload/images');
    },
    filename: (req, file, callback) => {
        var datetimestamp = Date.now();
        callback(null, "image" + '_' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    },
})

var upload = multer({ storage: storage }).single("upload");



let upload2 = util.promisify(upload);
module.exports = upload2;