const express = require('express')
const router = express.Router()
const path = require('path')
const { QueryTypes } = require('sequelize');
//const upload = multer(multerConfig.config).single(multerConfig.keyUpload)
const db = require('../models');


router.get('/get_fe_monitoring', async(req, res) => {
    const stock = "%" + req.query.stock + "%"
    let sql = "select a.id,a.location_code from t_esrc_fe_location as a where a.location_code like :stock group by a.location_code,a.id"
    const data = await db.sequelize.query(sql, {
        replacements: { stock: stock },
        type: QueryTypes.SELECT
    });
    res.send(data);
})

router.get('/get_fe_spare', async(req, res) => {
    const stock = "%" + req.query.stock + "%"
    let sql = "select a.location_code,b.spare_code,a.plant,c.safe_stock,d.qty,CASE WHEN (d.qty) < c.safe_stock THEN 'NG' WHEN (d.qty) >= c.safe_stock THEN 'OK' ELSE 'NULL' END AS status from t_esrc_fe_location as a left join t_esrc_fe_inout as b on a.location_code = b.location left join t_esrc_fe_mold as c on b.spare_code = c.spare_code left join t_esrc_fe_stock as d on a.location_code = d.location_code and b.spare_code = d.spare_code where a.location_code like :stock group by a.location_code,b.spare_code,a.plant,c.safe_stock,d.qty"
    const data = await db.sequelize.query(sql, {
        replacements: { stock: stock },
        type: QueryTypes.SELECT
    })
    res.send(data)
})

router.get('/get_ppe_monitoring', async(req, res) => {
    const stock = "%" + req.query.stock + "%"
    let sql = "select a.id,a.location_code from t_esrc_ppe_location as a where a.location_code like :stock group by a.location_code,a.id"
    const data = await db.sequelize.query(sql, {
        replacements: { stock: stock },
        type: QueryTypes.SELECT
    });
    res.send(data);
})

// router.get('/get_ppe_spare', async(req, res) => {
//     const stock = "%" + req.query.stock + "%"
//     let sql = "select a.location_code,b.spare_code,a.plant,c.safe_stock,d.qty,CASE WHEN (d.qty) < c.safe_stock THEN 'NG' WHEN (d.qty) >= c.safe_stock THEN 'OK' ELSE 'NULL' END AS status from t_esrc_ppe_location as a left join t_esrc_ppe_inout as b on a.location_code = b.location left join t_esrc_ppe_mold as c on b.spare_code = c.spare_code left join t_esrc_ppe_stock as d on a.location_code = d.location_code and b.spare_code = d.spare_code where a.location_code like :stock group by a.location_code,b.spare_code,a.plant,c.safe_stock,d.qty"
//     const data = await db.sequelize.query(sql, {
//         replacements: { stock: stock },
//         type: QueryTypes.SELECT
//     })
//     res.send(data)
// })

router.get('/get_it_monitoring', async(req, res) => {
    const stock = "%" + req.query.stock + "%"
    let sql = "select a.id,a.location_code from t_esrc_it_location as a where a.location_code like :stock group by a.location_code,a.id"
    const data = await db.sequelize.query(sql, {
        replacements: { stock: stock },
        type: QueryTypes.SELECT
    });
    res.send(data);
})

router.get('/get_it_spare', async(req, res) => {
    const stock = "%" + req.query.stock + "%"
    let sql = "select a.location_code,b.spare_code,a.plant,c.safe_stock,d.qty,CASE WHEN (d.qty) < c.safe_stock THEN 'NG' WHEN (d.qty) >= c.safe_stock THEN 'OK' ELSE 'NULL' END AS status from t_esrc_it_location as a left join t_esrc_it_inout as b on a.location_code = b.location left join t_esrc_it_mold as c on b.spare_code = c.spare_code left join t_esrc_it_stock as d on a.location_code = d.location_code and b.spare_code = d.spare_code where a.location_code like :stock group by a.location_code,b.spare_code,a.plant,c.safe_stock,d.qty"
    const data = await db.sequelize.query(sql, {
        replacements: { stock: stock },
        type: QueryTypes.SELECT
    })
    res.send(data)
})

router.get('/get_stock_qty', async(req, res) => {
    const spare_code = req.query.spare_code
    const location_code = req.query.location_code
    let sql = "select spare_code,isnull(qty,0) as qty from t_esrc_fe_stock where spare_code = :spare_code and location_code = :location_code"
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
    let sql = "update t_esrc_fe_stock set qty = :qty where spare_code = :spare_code and location_code = :location_code"
    const data = await db.sequelize.query(sql, {
        replacements: { spare_code: spare_code, location_code: location_code, qty: qty },
        type: QueryTypes.UPDATE
    })
    res.send(req.body)
})

module.exports = router