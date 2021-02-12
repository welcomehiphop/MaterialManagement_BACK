const express = require('express')
const router = express.Router()
const path = require('path')
const { QueryTypes } = require('sequelize');
//const upload = multer(multerConfig.config).single(multerConfig.keyUpload)
const db = require('../models');
const uploadFileMiddleware = require("../middleware/upload");
const upload = require("../middleware/uploadfile");

router.get('/get_fe_monitoring', async(req, res) => {
    let sql = "select a.id,a.location_code , qty , c.safe_stock from t_esrc_location_master as a left join t_esrc_in_out as b on a.location_code = b.location left join t_esrc_mold_master as c on b.spare_code = c.spare_code"
    const data = await db.sequelize.query(sql, {
        type: QueryTypes.SELECT
    });
    res.send(data);
})


module.exports = router