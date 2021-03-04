const express = require('express')
const router = express.Router()
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
        sql = "Update t_esrc_ppe_mold set plant = :plant, spare_code = :spare_code, description = :description, price = :price, safe_stock = :safe_stock, type = :type, reg_empno = :reg_empno , picture = :filename where id = :id"
        const [results, metadata] = await db.sequelize.query(sql, {
            replacements: { id: id, plant: plant, spare_code: spare_code, description: description, price: price, safe_stock: safe_stock, type: type, reg_empno: reg_empno, filename: filename },
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

router.get('/get_ppe_location', async(req, res) => {
    const condition = {
        location_code: "%" + req.query.location_code + "%",
        plant: "%" + req.query.plant + "%"
    }
    let sql = "select * from t_esrc_ppe_location where location_code like :location_code and plant like :plant"
    try {
        const data = await db.sequelize.query(sql, {
            replacements: { location_code: condition.location_code, plant: condition.plant },
            type: QueryTypes.SELECT
        })
        res.send(data)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/get_ppe_location/:id', async(req, res) => {
    const id = req.params.id
    let sql = "select * from t_esrc_ppe_location where id = :id"
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

router.put('/put_ppe_location/:id', async(req, res) => {
    const id = req.params.id
    const location_name = req.body.location_name
    let sql = "Update t_esrc_ppe_location set  location_name = :location_name  where id = :id"
    try {
        const data = await db.sequelize.query(sql, {
            replacements: { id: id, location_name: location_name },
            type: QueryTypes.SELECT
        })
        res.send("Update Successfully")
    } catch (e) {
        res.status(500).send(e.message)
    }

})

router.delete('/delete_ppe_location/:id', async(req, res) => {
    const id = req.params.id
    let sql = "delete from t_esrc_ppe_location where id = :id"
    try {
        const data = await db.sequelize.query(sql, {
            replacements: { id: id },
            type: QueryTypes.DELETE
        })
        res.send("Delete Successfully")
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.post('/post_ppe_location', async(req, res) => {
    const body = {
        location_code: req.body.location_code,
        location_name: req.body.location_name,
        plant: req.body.plant
    }
    let sql = "insert into t_esrc_ppe_location (location_code,location_name,plant) values (:location_code,:location_name,:plant)"
    try {
        const data = await db.sequelize.query(sql, {
            replacements: { location_code: body.location_code, location_name: body.location_name, plant: body.plant },
            type: QueryTypes.INSERT
        })
        res.send("Success")
    } catch (e) {
        res.status(500).send(e.message)
    }
})

//inout function
router.get('/get_ppe_inout', async(req, res) => {
    const spare_code = "%" + req.query.spare_code + "%"
    const movement = "%" + req.query.movement + "%"
    const plant = "%" + req.query.plant + "%"
    let sql = "select a.id,a.spare_code,a.movement,b.description,c.location_code,a.qty,(select usrnm from t_user as b where b.usrid = a.reg_empno) as emp_name,a.reg_date,c.plant from t_esrc_ppe_inout as a join t_esrc_ppe_mold as b on a.spare_code = b.spare_code join t_esrc_ppe_location as c on a.location = c.location_code where a.spare_code like :spare_code and a.movement like :movement and c.plant like :plant order by a.id desc"
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

router.get('/get_ppe_inout/:id', async(req, res) => {
    const id = req.params.id
    let sql = "select a.id,a.reg_empno,a.spare_code,b.type,b.description,a.purpose,a.po,a.reg_date,a.qty,a.location from t_esrc_ppe_inout as a join t_esrc_ppe_mold as b on a.spare_code = b.spare_code join t_esrc_ppe_location as c on a.location = c.location_code where a.id = :id"
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

router.post('/post_ppe_inout', async(req, res) => {
    const spare_code = req.body.spare_code
    const purpose = req.body.purpose
    const po = req.body.po
    const movement = req.body.movement
    const location = req.body.location
    const qty = req.body.qty
    const reg_empno = req.body.reg_empno
    const reg_date = req.body.reg_date
    let sql = "insert into t_esrc_ppe_inout (spare_code,purpose,po,movement,location,qty,reg_empno,reg_date) values (:spare_code,:purpose,:po,:movement,:location,:qty,:reg_empno,:reg_date)"
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

router.post('/post_ppe_stock', async(req, res) => {
    const spare_code = req.body.spare_code
    const location_code = req.body.location_code
    const qty = req.body.qty
    let sql = "insert into t_esrc_ppe_stock (spare_code,location_code,qty) values(:spare_code,:location_code,:qty)"
    try {
        const data = await db.sequelize.query(sql, {
            replacements: { spare_code: spare_code, location_code: location_code, qty: qty },
        })
        res.send("Successfuly")
    } catch (e) {
        res.status(500).send(e.message)
    }


})

router.put('/put_ppe_stock', async(req, res) => {
    const spare_code = req.body.spare_code
    const location_code = req.body.location_code
    const qty = req.body.qty
    let sql = "update t_esrc_ppe_stock set qty = :qty where spare_code = :spare_code and location_code = :location_code"
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

router.get('/get_ppe_stock', async(req, res) => {
    const spare_code = req.query.spare_code
    const location_code = req.query.location_code
    let sql = "select spare_code,isnull(qty,0) as qty from t_esrc_ppe_stock where spare_code = :spare_code and location_code = :location_code"
    try {
        const data = await db.sequelize.query(sql, {
            replacements: { spare_code: spare_code, location_code: location_code },
            type: QueryTypes.SELECT
        })
        res.send(data)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


router.get('/get_ppe_spare', async(req, res) => {
    const location = "%" + req.query.location + "%"
    const spare_code = "%" + req.query.spare_code + "%"
    try {
        let sql = "select a.spare_code,b.description,a.location,c.qty,b.price from t_esrc_ppe_inout as a join t_esrc_ppe_mold as b on a.spare_code = b.spare_code join t_esrc_ppe_stock as c on a.spare_code = c.spare_code and a.location = c.location_code where a.location like :location and a.spare_code like :spare_code group by a.spare_code,b.description,a.location,c.qty,b.price"
        const data = await db.sequelize.query(sql, {
            replacements: { location: location, spare_code: spare_code },
            type: QueryTypes.SELECT
        })
        res.send(data)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


module.exports = router