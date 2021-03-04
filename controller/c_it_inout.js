const express = require('express')
const router = express.Router()
const { QueryTypes } = require('sequelize')
const db = require('../models')


router.get('/get_it_inout', async(req, res) => {
    const spare_code = "%" + req.query.spare_code + "%"
    const movement = "%" + req.query.movement + "%"
    const plant = "%" + req.query.plant + "%"
    let sql = "select a.id,a.spare_code,a.movement,b.description,c.location_code,a.qty,(select usrnm from t_user as b where b.usrid = a.reg_empno) as emp_name,a.reg_date,c.plant from t_esrc_it_inout as a join t_esrc_it_mold as b on a.spare_code = b.spare_code join t_esrc_it_location as c on a.location = c.location_code where a.spare_code like :spare_code and a.movement like :movement and c.plant like :plant order by a.id desc"
    try {
        const data = await db.sequelize.query(sql, {
            replacements: { spare_code: spare_code, movement: movement, plant: plant },
            type: QueryTypes.SELECT
        })
        res.send(data)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/get_it_inout/:id', async(req, res) => {
    const id = req.params.id
    let sql = "select a.id,a.reg_empno,a.spare_code,b.type,b.description,a.purpose,a.po,a.reg_date,a.qty,a.location from t_esrc_it_inout as a join t_esrc_it_mold as b on a.spare_code = b.spare_code join t_esrc_it_location as c on a.location = c.location_code where a.id = :id"
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

router.post('/post_it_inout', async(req, res) => {
    const spare_code = req.body.spare_code
    const purpose = req.body.purpose
    const po = req.body.po
    const movement = req.body.movement
    const location = req.body.location
    const qty = req.body.qty
    const reg_empno = req.body.reg_empno
    const reg_date = req.body.reg_date
    let sql = "insert into t_esrc_it_inout (spare_code,purpose,po,movement,location,qty,reg_empno,reg_date) values (:spare_code,:purpose,:po,:movement,:location,:qty,:reg_empno,:reg_date)"
    try {
        const data = await db.sequelize.query(sql, {
            replacements: { spare_code: spare_code, purpose: purpose, po: po, movement: movement, location: location, qty: qty, reg_empno: reg_empno, reg_date: reg_date, },
            type: QueryTypes.INSERT
        })
        res.send("Successfuly")
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/get_it_stock', async(req, res) => {
    const spare_code = req.query.spare_code
    const location_code = req.query.location_code
    let sql = "select spare_code,isnull(qty,0) as qty from t_esrc_it_stock where spare_code = :spare_code and location_code = :location_code"
    const data = await db.sequelize.query(sql, {
        replacements: { spare_code: spare_code, location_code: location_code },
        type: QueryTypes.SELECT
    })
    res.send(data)
})

router.post('/post_it_stock', async(req, res) => {
    const spare_code = req.body.spare_code
    const location_code = req.body.location_code
    const qty = req.body.qty
    let sql = "insert into t_esrc_it_stock (spare_code,location_code,qty) values(:spare_code,:location_code,:qty)"
    try {
        const data = await db.sequelize.query(sql, {
            replacements: { spare_code: spare_code, location_code: location_code, qty: qty },
        })
        res.send("Successfuly")
    } catch (e) {
        res.status(500).send(e.message)
    }


})

router.put('/put_it_stock', async(req, res) => {
    const spare_code = req.body.spare_code
    const location_code = req.body.location_code
    const qty = req.body.qty
    let sql = "update t_esrc_it_stock set qty = :qty where spare_code = :spare_code and location_code = :location_code"
    try {
        const data = await db.sequelize.query(sql, {
            replacements: { spare_code: spare_code, location_code: location_code, qty: qty },
            type: QueryTypes.UPDATE
        })
        res.send("Successfuly")
    } catch (e) {
        res.status(500).send(e.message)
    }


})



module.exports = router