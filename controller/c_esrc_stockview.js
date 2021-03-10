const express = require('express')
const router = express.Router()
const { QueryTypes } = require('sequelize')
const db = require('../models')

//FE ROOM
router.get('/get_fe_stockview', async(req, res) => {
    const sql = "select a.id,b.spare_code,b.type,b.description,a.qty,c.location_code,b.price,c.plant from t_esrc_fe_stock as a join t_esrc_fe_mold as b on a.spare_code = b.spare_code join t_esrc_fe_location as c on a.location_code = c.location_code order by b.spare_code"

    try {
        const data = await db.sequelize.query(sql, {
            type: QueryTypes.SELECT
        })
        res.send(data)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/get_fe_stock_click', async(req, res) => {
    const condition = {
        location: "%" + req.query.location + "%",
        plant: "%" + req.query.plant + "%"
    }
    const sql = "select a.id,b.spare_code,b.type,b.description,a.qty,c.location_code,b.price,c.plant,b.picture from t_esrc_fe_stock as a join t_esrc_fe_mold as b on a.spare_code = b.spare_code join t_esrc_fe_location as c on a.location_code = c.location_code where a.qty <> 0 and c.location_code like :location and c.plant like :plant"
    try {
        const data = await db.sequelize.query(sql, {
            replacements: { location: condition.location, plant: condition.plant },
            type: QueryTypes.SELECT
        })
        res.send(data)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

//PPE ROOM

router.get('/get_ppe_stockview', async(req, res) => {
    const sql = "select b.spare_code,b.type,b.description,a.qty,c.location_code,b.price,c.plant from t_esrc_ppe_stock as a join t_esrc_ppe_mold as b on a.spare_code = b.spare_code join t_esrc_ppe_location as c on a.location_code = c.location_code order by b.spare_code"
    try {
        const data = await db.sequelize.query(sql, {
            type: QueryTypes.SELECT
        })
        res.send(data)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/get_ppe_stock_click', async(req, res) => {
    const condition = {
        location: "%" + req.query.location + "%",
        plant: "%" + req.query.plant + "%"
    }
    const sql = "select a.id,b.spare_code,b.type,b.description,a.qty,c.location_code,b.price,c.plant,b.picture from t_esrc_ppe_stock as a join t_esrc_ppe_mold as b on a.spare_code = b.spare_code join t_esrc_ppe_location as c on a.location_code = c.location_code where a.qty <> 0 and c.location_code like :location and c.plant like :plant"
    try {
        const data = await db.sequelize.query(sql, {
            replacements: { location: condition.location, plant: condition.plant },
            type: QueryTypes.SELECT
        })
        res.send(data)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

//IT ROOM

router.get('/get_it_stockview', async(req, res) => {
    const sql = "select b.spare_code,b.type,b.description,a.qty,c.location_code,b.price,c.plant from t_esrc_it_stock as a join t_esrc_it_mold as b on a.spare_code = b.spare_code join t_esrc_it_location as c on a.location_code = c.location_code order by b.spare_code"
    try {
        const data = await db.sequelize.query(sql, {
            type: QueryTypes.SELECT
        })
        res.send(data)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/get_it_stock_click', async(req, res) => {
    const condition = {
        location: "%" + req.query.location + "%",
        plant: "%" + req.query.plant + "%"
    }
    const sql = "select a.id,b.spare_code,b.type,b.description,a.qty,c.location_code,b.price,c.plant,b.picture from t_esrc_it_stock as a join t_esrc_it_mold as b on a.spare_code = b.spare_code join t_esrc_it_location as c on a.location_code = c.location_code where a.qty <> 0 and c.location_code like :location and c.plant like :plant"
    try {
        const data = await db.sequelize.query(sql, {
            replacements: { location: condition.location, plant: condition.plant },
            type: QueryTypes.SELECT
        })
        res.send(data)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

module.exports = router