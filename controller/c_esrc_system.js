const express = require('express')
const router = express.Router()
const path = require('path')
const { QueryTypes } = require('sequelize');
//const upload = multer(multerConfig.config).single(multerConfig.keyUpload)
const db = require('../models');
const uploadFileMiddleware = require("../middleware/upload");

router.get('/get_esrc_list', async(req, res) => {
    let sql = "select * from t_esrc_mold_master"
    const data = await db.sequelize.query(sql, {
        type: QueryTypes.SELECT
    });
    res.send(data);
})

router.get('/get_location', async(req, res) => {
    let sql = "select * from t_esrc_location_master"
    const data = await db.sequelize.query(sql, {
        type: QueryTypes.SELECT
    });
    res.send(data);

})

router.get('/get_location/:id', async(req, res) => {
    const id = req.params.id
    let sql = "select * from t_esrc_location_master where id = :id"
    const data = await db.sequelize.query(sql, {
        replacements: { id: id },
        type: QueryTypes.SELECT
    });
    res.send(data);
})

router.delete('/delete_location/:id', async(req, res) => {
    const id = req.params.id
    let sql = "delete from t_esrc_location_master where id = :id"
    const data = await db.sequelize.query(sql, {
        replacements: { id: id },
        type: QueryTypes.DELETE
    })
    res.send("Delete Successfully")
})

router.put('/update_location/:id', async(req, res) => {
    const id = req.params.id
    const location_name = req.body.location_name
    let sql = "Update t_esrc_location_master set  location_name = :location_name  where id = :id"
    const data = await db.sequelize.query(sql, {
        replacements: { location_name: location_name, id: id },
        type: QueryTypes.UPDATE
    })
    res.send(req.body)
})
router.post('/post_location', async(req, res) => {
    const location_code = req.body.location_code
    const location_name = req.body.location_name
    const plant = req.body.plant
    let sql = "insert into t_esrc_location_master (location_code,location_name,plant) values (:location_code,:location_name,:plant)"
    const data = await db.sequelize.query(sql, {
        replacements: { location_code: location_code, location_name: location_name, plant: plant },
        type: QueryTypes.INSERT
    })
    res.send("Insert Successfully")
})

router.get('/get_esrc_list/:id', async(req, res) => {
    const id = req.params.id
    let sql = "select * from t_esrc_mold_master where id = :id"
    const data = await db.sequelize.query(sql, {
        replacements: { id: id },
        type: QueryTypes.SELECT
    });
    res.send(data);
})

router.get('/image/:filename', async(req, res) => {
    const filename = req.params.filename
        // console.log(path.join(__basedir + "/upload/images/" + filename))
    res.sendFile(path.join(__basedir + "/upload/images/" + filename))

})
router.put('/update_esrc_list/:id', uploadFileMiddleware, async(req, res) => {
    //await uploadFile(req, res)
    const id = req.params.id
    const plant = req.body.plant
    const spare_code = req.body.spare_code
    const description = req.body.description
    const price = req.body.price
    const safe_stock = req.body.safe_stock
    const type = req.body.type
    const reg_name = req.body.reg_name
    let sql = ""
    if (req.file) {
        const filename = req.file.filename
        sql = "Update t_esrc_mold_master set plant = :plant, spare_code = :spare_code, description = :description, price = :price, safe_stock = :safe_stock, type = :type, reg_name = :reg_name , picture = :filename where id = :id"
        const [results, metadata] = await db.sequelize.query(sql, {
            replacements: { id: id, plant: plant, spare_code: spare_code, description: description, price: price, safe_stock: safe_stock, type: type, reg_name: reg_name, filename: filename },
            type: QueryTypes.UPDATE
        })
    } else {
        sql = "Update t_esrc_mold_master set plant = :plant, spare_code = :spare_code, description = :description, price = :price, safe_stock = :safe_stock, type = :type, reg_name = :reg_name where id = :id"
        const [results, metadata] = await db.sequelize.query(sql, {
            replacements: { id: id, plant: plant, spare_code: spare_code, description: description, price: price, safe_stock: safe_stock, type: type, reg_name: reg_name },
            type: QueryTypes.UPDATE
        })
    }

    res.send(req.body)
})

router.delete('/delete_esrc_list/:id', async(req, res) => {
    const id = req.params.id
    const sql = "delete t_esrc_mold_master where id = :id"
    const data = await db.sequelize.query(sql, {
        replacements: { id: id },
        type: QueryTypes.DELETE
    })
    res.send("Delete sucessfully")
})

router.post('/post_esrc_list', uploadFileMiddleware, async(req, res) => {
    const spare_code = req.body.spare_code
    const description = req.body.description
    const price = req.body.price
    const safe_stock = req.body.safe_stock
    const type = req.body.type
    const plant = req.body.plant
    const reg_name = req.body.reg_name
    const file = req.file
    let sql = "insert into t_esrc_mold_master (spare_code,description,price,safe_stock,type,plant,picture,reg_name)" +
        "values(:spare_code, :description, :price, :safe_stock, :type,  :plant, :filename,:reg_name)"
    const data = await db.sequelize.query(sql, {
        replacements: { spare_code: spare_code, description: description, price: price, safe_stock: safe_stock, type: type, plant: plant, reg_name: reg_name, filename: file.filename },
        type: QueryTypes.INSERT
    })

    res.send(req.body)
})



module.exports = router