const express = require('express')
const router = express.Router()
const { QueryTypes } = require('sequelize')
const db = require('../models')

router.get('/get_it_location', async(req, res) => {
    const condition = {
        location_code: "%" + req.query.location_code + "%",
        plant: "%" + req.query.plant + "%"
    }
    let sql = "select * from t_esrc_it_location where location_code like :location_code and plant like :plant"
    try {
        const data = await db.sequelize.query(sql, {
            replacements: { location_code: condition.location_code, plant: condition.plant },
            type: QueryTypes.SELECT
        });
        res.send(data);
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/get_it_location/:id', async(req, res) => {
    const id = req.params.id
    let sql = "select * from t_esrc_it_location  where id = :id"
    const data = await db.sequelize.query(sql, {
        replacements: { id: id },
        type: QueryTypes.SELECT
    });
    res.send(data);
})

router.delete('/delete_it_location/:id', async(req, res) => {
    const id = req.params.id
    let sql = "delete from t_esrc_it_location  where id = :id"
    const data = await db.sequelize.query(sql, {
        replacements: { id: id },
        type: QueryTypes.DELETE
    })
    res.send("Delete Successfully")
})

router.put('/update_it_location/:id', async(req, res) => {
    const id = req.params.id
    const location_name = req.body.location_name
    let sql = "Update t_esrc_it_location  set  location_name = :location_name  where id = :id"
    const data = await db.sequelize.query(sql, {
        replacements: { location_name: location_name, id: id },
        type: QueryTypes.UPDATE
    })
    res.send(req.body)
})
router.post('/post_it_location', async(req, res) => {
    const location_code = req.body.location_code
    const location_name = req.body.location_name
    const plant = req.body.plant
    let sql = "insert into t_esrc_it_location  (location_code,location_name,plant) values (:location_code,:location_name,:plant)"
    const data = await db.sequelize.query(sql, {
        replacements: { location_code: location_code, location_name: location_name, plant: plant },
        type: QueryTypes.INSERT
    })
    res.send("Insert Successfully")
})


module.exports = router