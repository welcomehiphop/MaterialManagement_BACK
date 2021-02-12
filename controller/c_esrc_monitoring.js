const express = require('express')
const router = express.Router()
const path = require('path')
const { QueryTypes } = require('sequelize');
//const upload = multer(multerConfig.config).single(multerConfig.keyUpload)
const db = require('../models');
const uploadFileMiddleware = require("../middleware/upload");
const upload = require("../middleware/uploadfile");

router.get('/get_fe_monitoring', async(req, res) => {
    const stock = req.query.stock
    let sql = "select a.id,a.location_code from t_esrc_location_master as a where a.location_code like :stock group by a.location_code,a.id"
    const data = await db.sequelize.query(sql, {
        replacements: { stock: stock },
        type: QueryTypes.SELECT
    });
    res.send(data);
})



module.exports = router