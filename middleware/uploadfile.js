const util = require("util");
const multer = require("multer");


let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, __basedir + '/upload/files');
    },
    filename: (req, file, callback) => {
        var datetimestamp = Date.now();
        callback(null, file.originalname)
    },
})

let upload = multer({ storage: storage }).array("files");

let uploadMultiFile = util.promisify(upload);
module.exports = uploadMultiFile;