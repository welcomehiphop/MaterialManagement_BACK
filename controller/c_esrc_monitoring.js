const express = require('express')
const router = express.Router()
const path = require('path')
const { QueryTypes } = require('sequelize');
//const upload = multer(multerConfig.config).single(multerConfig.keyUpload)
const db = require('../models');
const uploadFileMiddleware = require("../middleware/upload");
const upload = require("../middleware/uploadfile");
const { response } = require('express');

router.get('/get_fe_monitoring', async(req, res) => {
    const stock = req.query.stock
    let sql = "select a.id,a.location_code from t_esrc_location_master as a where a.location_code like :stock group by a.location_code,a.id"
    const data = await db.sequelize.query(sql, {
        replacements: { stock: stock },
        type: QueryTypes.SELECT
    });
    res.send(data);
})

router.get('/get_fe_spare', async(req, res) => {
    const stock = req.query.stock
    let sql = "select a.location_code,b.spare_code,a.plant,c.safe_stock,qty,CASE WHEN (qty) < c.safe_stock THEN 'NG' WHEN (qty) >= c.safe_stock THEN 'OK' ELSE 'NULL' END AS status from t_esrc_location_master as a left join t_esrc_in_out as b on a.location_code = b.location left join t_esrc_mold_master as c on b.spare_code = c.spare_code where a.location_code like :stock group by a.location_code,b.spare_code,a.plant,c.safe_stock,qty"
    const data = await db.sequelize.query(sql, {
        replacements: { stock: stock },
        type: QueryTypes.SELECT
    })
    res.send(data)
})

router.get('/get_stock_qty', async(req, res) => {
    const spare_code = req.query.spare_code
    const location_code = req.query.location_code
    let sql = "select isnull(qty,0) as qty from t_esrc_stock where spare_code = :spare_code and location_code = :location_code"
    const data = await db.sequelize.query(sql, {
        replacements: { spare_code: spare_code, location_code: location_code },
        type: QueryTypes.SELECT
    })
    res.send(data)
})

router.put('/update_stock_qty', async(req, res) => {
    const spare_code = req.body.spare_code
    const location_code = req.body.location_code
    const qty = req.body.qty
    let sql = "update t_esrc_stock set qty = :qty where spare_code = :spare_code and location_code = :location_code"
    const data = await db.sequelize.query(sql, {
        replacements: { spare_code: spare_code, location_code: location_code, qty: qty },
        type: QueryTypes.UPDATE
    })
    res.send(req.body)
})

module.exports = router