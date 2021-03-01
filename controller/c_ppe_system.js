const express = require('express')
const router = express.Router()
const path = require('path')
const { QueryTypes } = require('sequelize')
const db = require('../models')
const uploadFileMiddleware = require("../middleware/upload");


router.post('/post_ppe_mold', uploadFileMiddleware, async(req, res) => {
    const spare_code = req.body.spare_code
    const description = req.body.description
    const price = req.body.price
    const safe_stock = req.body.safe_stock
    const type = req.body.type
    const plant = req.body.plant
    const reg_empno = req.body.reg_empno
    const file = req.file
    let sql = "insert into t_esrc_ppe_mold (spare_code,description,price,safe_stock,type,plant,picture,reg_empno)" +
        "values(:spare_code, :description, :price, :safe_stock, :type,  :plant, :filename,:reg_empno)"
    try {
        const data = await db.sequelize.query(sql, {
            replacements: { spare_code: spare_code, description: description, price: price, safe_stock: safe_stock, type: type, plant: plant, reg_empno: reg_empno, filename: file.filename },
            type: QueryTypes.INSERT
        })
        res.send(req.body)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.delete('/delete_ppe_mold/:id', async(req, res) => {
    const id = req.params.id
    const sql = "delete t_esrc_ppe_mold  where id = :id"
    const data = await db.sequelize.query(sql, {
        replacements: { id: id },
        type: QueryTypes.DELETE
    })
    res.send("Delete sucessfully")
})

router.put('/update_ppe_mold/:id', uploadFileMiddleware, async(req, res) => {
    //await uploadFile(req, res)
    const id = req.params.id
    const plant = req.body.plant
    const spare_code = req.body.spare_code
    const description = req.body.description
    const price = req.body.price
    const safe_stock = req.body.safe_stock
    const type = req.body.type
    const reg_empno = req.body.reg_empno
    let sql = ""
    if (req.file) {
        const filename = req.file.filename
        sql = "Update t_esrc_ppe_mold set plant = :plant, spare_code = :spare_code, description = :description, price = :price, safe_stock = :safe_stock, type = :type, reg_name = :reg_name , picture = :filename where id = :id"
        const [results, metadata] = await db.sequelize.query(sql, {
            replacements: { id: id, plant: plant, spare_code: spare_code, description: description, price: price, safe_stock: safe_stock, type: type, reg_name: reg_name, filename: filename },
            type: QueryTypes.UPDATE
        })
    } else {
        sql = "Update t_esrc_ppe_mold set plant = :plant, spare_code = :spare_code, description = :description, price = :price, safe_stock = :safe_stock, type = :type, reg_empno = :reg_empno where id = :id"
        const [results, metadata] = await db.sequelize.query(sql, {
            replacements: { id: id, plant: plant, spare_code: spare_code, description: description, price: price, safe_stock: safe_stock, type: type, reg_empno: reg_empno },
            type: QueryTypes.UPDATE
        })
    }
    res.send(req.body)
})

router.get('/get_ppe_mold', async(req, res) => {
    const condition = {
        spare_code: "%" + req.query.spare_code + "%",
        plant: "%" + req.query.plant + "%"
    }
    let sql = "select * from t_esrc_ppe_mold where spare_code like :spare_code and plant like :plant"
    try {
        const data = await db.sequelize.query(sql, {
            replacements: { spare_code: condition.spare_code, plant: condition.plant },
            type: QueryTypes.SELECT
        })
        res.send(data)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


router.get('/get_ppe_mold/:id', async(req, res) => {
    const id = req.params.id
    let sql = "select * from t_esrc_ppe_mold where id = :id"
    try {
        const data = await db.sequelize.query(sql, {
            replacements: { id: id },
            type: QueryTypes.SELECT
        })
        res.send(data)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router