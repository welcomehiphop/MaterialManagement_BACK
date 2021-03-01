const express = require('express')
const router = express.Router()
const path = require('path')
const { QueryTypes } = require('sequelize');
//const upload = multer(multerConfig.config).single(multerConfig.keyUpload)
const db = require('../models');
const uploadFileMiddleware = require("../middleware/upload");
const upload = require("../middleware/uploadfile");


router.get('/get_esrc_list', async(req, res) => {
    const condition = {
        spare_code: req.query.spare_code,
        plant: req.query.plant
    }
    let sql = "select * from t_esrc_mold_master where spare_code like :spare_code and plant like :plant"
    try {
        const data = await db.sequelize.query(sql, {
            replacements: { spare_code: condition.spare_code, plant: condition.plant },
            type: QueryTypes.SELECT
        });
        res.send(data);

    } catch (e) {
        res.status(500).send(e.message)
    }

})

router.get('/get_location', async(req, res) => {
    const condition = {
        location_code: req.query.location_code,
        plant: req.query.plant
    }
    let sql = "select * from t_esrc_location_master where location_code like :location_code and plant like :plant"
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
    const reg_empno = req.body.reg_empno
    let sql = ""
    if (req.file) {
        const filename = req.file.filename
        sql = "Update t_esrc_mold_master set plant = :plant, spare_code = :spare_code, description = :description, price = :price, safe_stock = :safe_stock, type = :type, reg_empno = :reg_empno , picture = :filename where id = :id"
        const [results, metadata] = await db.sequelize.query(sql, {
            replacements: { id: id, plant: plant, spare_code: spare_code, description: description, price: price, safe_stock: safe_stock, type: type, reg_empno: reg_empno, filename: filename },
            type: QueryTypes.UPDATE
        })
    } else {
        sql = "Update t_esrc_mold_master set plant = :plant, spare_code = :spare_code, description = :description, price = :price, safe_stock = :safe_stock, type = :type, reg_empno = :reg_empno where id = :id"
        const [results, metadata] = await db.sequelize.query(sql, {
            replacements: { id: id, plant: plant, spare_code: spare_code, description: description, price: price, safe_stock: safe_stock, type: type, reg_empno: reg_empno },
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
    const reg_empno = req.body.reg_empno
    const file = req.file
    let sql = "insert into t_esrc_mold_master (spare_code,description,price,safe_stock,type,plant,picture,reg_empno)" +
        "values(:spare_code, :description, :price, :safe_stock, :type,  :plant, :filename,:reg_empno)"
    const data = await db.sequelize.query(sql, {
        replacements: { spare_code: spare_code, description: description, price: price, safe_stock: safe_stock, type: type, plant: plant, reg_empno: reg_empno, filename: file.filename },
        type: QueryTypes.INSERT
    })

    res.send(req.body)
})


//inout-management

router.get('/get_inout_list', async(req, res) => {
    const spare_code = req.query.spare_code
    const movement = req.query.movement
    const plant = req.query.plant
    let sql = "select a.id,a.spare_code,a.movement,b.description,c.location_code,a.qty,(select usrnm from t_user as b where b.usrid = a.reg_empno) as emp_name,a.reg_date,c.plant from t_esrc_in_out as a join t_esrc_mold_master as b on a.spare_code = b.spare_code join t_esrc_location_master as c on a.location = c.location_code where a.spare_code like :spare_code and a.movement like :movement and c.plant like :plant order by a.id desc"
    const data = await db.sequelize.query(sql, {
        replacements: { spare_code: spare_code, movement: movement, plant: plant },
        type: QueryTypes.SELECT
    })

    res.send(data)
})

router.get('/get_inout_list/:id', async(req, res) => {
    const id = req.params.id
    let sql = "select a.id,a.reg_empno,a.spare_code,b.type,b.description,a.purpose,a.po,a.reg_date,a.qty,a.location from t_esrc_in_out as a join t_esrc_mold_master as b on a.spare_code = b.spare_code join t_esrc_location_master as c on a.location = c.location_code where a.id = :id"
    const data = await db.sequelize.query(sql, {
        replacements: { id: id },
        type: QueryTypes.SELECT
    })

    res.send(data)
})

router.post('/post_inout_gr', async(req, res) => {
    const spare_code = req.body.spare_code
    const purpose = req.body.purpose
    const po = req.body.po
    const movement = req.body.movement
    const location = req.body.location
    const qty = req.body.qty
    const reg_empno = req.body.reg_empno
    const reg_date = req.body.reg_date
    let sql = "insert into t_esrc_in_out (spare_code,purpose,po,movement,location,qty,reg_empno,reg_date) values (:spare_code,:purpose,:po,:movement,:location,:qty,:reg_empno,:reg_date)"
    const data = await db.sequelize.query(sql, {
        replacements: { spare_code: spare_code, purpose: purpose, po: po, movement: movement, location: location, qty: qty, reg_empno: reg_empno, reg_date: reg_date, },
        type: QueryTypes.INSERT
    })
    res.send({
        status: "Sucess fully",
        data: req.body
    })
})

router.post('/post_inout_stock', async(req, res) => {
    const spare_code = req.body.spare_code
    const location_code = req.body.location_code
    const qty = req.body.qty
    let sql = "insert into t_esrc_stock (spare_code,location_code,qty) values(:spare_code,:location_code,:qty)"
    const data = await db.sequelize.query(sql, {
        replacements: { spare_code: spare_code, location_code: location_code, qty: qty },
    })
    res.send(req.body)
})

router.post('/files/post', upload, async(req, res) => {
    var fileinfo = req.files;
    var title = req.body.title;
    res.send(fileinfo);
})

router.get('/get_depart_list', async(req, res) => {
    try {
        let sql = "SELECT code,name FROM t_dept WHERE code <> '000' AND specflag = 0 ORDER BY name"
        const data = await db.sequelize.query(sql, {
            type: QueryTypes.SELECT
        })
        res.send(data)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/get_approve_list', async(req, res) => {
    try {
        const deptcd = req.query.deptcd
        const usrnm = req.query.usrnm
        let sql = "SELECT u.empno,u.usrnm,p.cdcd poscd,p.cdnm posnm, d.name deptnm FROM t_user u, t_cd_comm p, t_dept d WHERE p.catcd='POS' AND u.poscd *= p.cdcd AND u.deptcd = d.code AND ISNULL(u.resigndate,'')='' and u.poscd  in ('001','005','006','009','010','015','022','003') and u.deptcd LIKE :deptcd AND u.usrnm LIKE :usrnm  ORDER BY usrnm,poscd "
        const data = await db.sequelize.query(sql, {
            replacements: { deptcd: deptcd, usrnm: usrnm },
            type: QueryTypes.SELECT
        })
        res.send(data)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/get_carrier_list', async(req, res) => {
    try {
        const deptcd = req.query.deptcd
        const usrnm = req.query.usrnm
        let sql = "SELECT u.empno,u.usrnm,p.cdcd poscd,p.cdnm posnm, d.name deptnm FROM t_user u, t_cd_comm p, t_dept d WHERE p.catcd='POS' AND u.poscd *= p.cdcd AND u.deptcd = d.code AND ISNULL(u.resigndate,'')='' and u.deptcd LIKE :deptcd AND u.usrnm LIKE :usrnm  ORDER BY usrnm,poscd"
        const data = await db.sequelize.query(sql, {
            replacements: { deptcd: deptcd, usrnm: usrnm },
            type: QueryTypes.SELECT
        })
        res.send(data)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/get_spare_list', async(req, res) => {
    const location = req.query.location
    const spare_code = req.query.spare_code
    try {
        let sql = "select a.spare_code,b.description,a.location,c.qty,b.price from t_esrc_in_out as a join t_esrc_mold_master as b on a.spare_code = b.spare_code join t_esrc_stock as c on a.spare_code = c.spare_code and a.location = c.location_code where a.location like :location and a.spare_code like :spare_code group by a.spare_code,b.description,a.location,c.qty,b.price"
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