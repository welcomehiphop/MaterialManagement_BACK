/*
  hatsanai sungnark
*/
const fs = require("fs")
const express = require('express')
const router = express.Router()
const multer = require('multer')
const sequelize = require('sequelize');
const path = require('path')
const { QueryTypes } = require('sequelize');
const multerConfig = require('../config/multer_config')
    //const upload = multer(multerConfig.config).single(multerConfig.keyUpload)
const db = require('../models');
const uploadFileMiddleware = require("../middleware/upload");
//const uploadFile = require("../middleware/upload");

// router.post('/upload', uploadFileMiddleware, async(req, res) => {
//     try {
//         if (req.file == undefined) {
//             return res.status(400).send({ message: "Please upload a file!" });
//         }
//         res.status(200).send({
//             message: "Uploaded the file successfully: " + req.file.originalname,
//         });
//     } catch (err) {
//         if (err.code == "LIMIT_FILE_SIZE") {
//             return res.status(500).send({ message: "File size cannot be larger thai 2MB" })
//         }
//         res.status(500).send({
//             message: `Could not upload the file: ${ req.file.originalname} . ${err}`,
//         });
//     }
//     console.log(req.file.filename)
// });


router.get('/atp_get_list', async(req, res) => {
    /* with sql command*/
    let sql = "select a.idx,a.week_number,c.plant,c.line,c.machine_name,b.content_name,a.picture_before,a.before_comment,(select usrnm from t_user where t_user.empno = a.before_empno) as before_empno,a.before_reg_date,a.picture_after,a.after_comment,(select usrnm from t_user where t_user.empno = a.after_empno) as after_empno ,a.after_reg_date,check_status from TP_CheckResult as a join TP_ContentCheck as b on a.check_id = b.check_id and a.content_id = b.content_id join TP_Machine as c on a.machine_id = c.machine_id where YEAR(before_reg_date) = YEAR(getdate())"
    if (req.query.week) {
        sql += ` and week_number = '${req.query.week}'`
        if (req.query.status) {
            if (req.query.status != 'all') {
                sql += ` and check_status = '${req.query.status}'`
            }
        }
    } else if (req.query.emp) {
        sql += ` and before_empno like '%${req.query.emp}%'`
        if (req.query.status) {
            if (req.query.status != 'all') {
                sql += ` and check_status = '${req.query.status}'`
            }
        }
    } else if (req.query.status) {
        if (req.query.status != 'all') {
            sql += ` and check_status = '${req.query.status}'`
        }
    }

    sql += ' order by before_reg_date desc'
    const data = await db.sequelize.query(sql, {
        type: QueryTypes.SELECT
    });

    res.send(data);
})

router.get('/image/:filename', async(req, res) => {
    const filename = req.params.filename
    res.sendFile(path.join(__basedir + "/upload/images/" + filename))
})

router.get('/atp_get_list/:id', async(req, res) => {
    /* with sql command*/
    const id = req.params.id
    const data = await db.sequelize.query("select a.idx,a.week_number,c.plant,c.line,b.content_name,a.picture_before,a.before_comment,a.before_empno,a.before_reg_date,a.picture_after,a.after_comment,a.after_empno,a.after_reg_date,check_status from TP_CheckResult as a join TP_ContentCheck as b on a.check_id = b.check_id and a.content_id = b.content_id join TP_Machine as c on a.machine_id = c.machine_id  where idx = :id order by a.before_reg_date desc", {
        replacements: { id: id },
        type: QueryTypes.SELECT
    });
    res.send(data);
})

router.delete('/atp_delete_list/:id', async(req, res) => {
    const id = req.params.id
    const sql = "DELETE FROM TP_CheckResult where idx = :id"
    const data = await db.sequelize.query(sql, {
        replacements: { id: id },
        type: QueryTypes.DELETE
    })
    res.send("Delete sucessfully")
})

router.put('/atp_get_list/:id', uploadFileMiddleware, async(req, res) => {
    //await uploadFile(req, res)
    const id = req.params.id
    const status = req.body.status
    const dateAndTime = req.body.dateAndTime
    const empNo = req.body.empNo
    const action = req.body.action
    const picture = "http://localhost:3000/image/" + req.file.filename
    const sql = "UPDATE TP_CheckResult set after_empno = :empNo , after_comment = :action, after_reg_date = :dateAndTime, check_status = :status ,picture_after = :picture where idx = :id"
    const [results, metadata] = await db.sequelize.query(sql, {
        replacements: { empNo: empNo, action: action, dateAndTime: dateAndTime, id: id, status: status, picture: picture },
        type: QueryTypes.UPDATE
    })
    res.send("Updated successfully")
})

router.post('/userlogin', async(req, res) => {
    const empno = req.body.empno
    const sql = "select usrid from t_user where usrid = :empno"
    const result = await db.sequelize.query(sql, {
        replacements: { empno: empno },
        type: QueryTypes.SELECT
    })

    res.send(result)
})

// router.post('/atp_get_list_update/', async(req, res) => {
//     console.log(req.body)
//     const picture = "http://localhost:3000/image/" + req.file.filename
//     const sql = "UPDATE TP_CheckResult set after_empno = :empNo , after_comment = :action, after_reg_date = :dateAndTime, check_status = :status ,picture_after = :picture where idx = :id"
//     const [results, metadata] = await db.sequelize.query(sql, {
//         replacements: { empNo: empNo, action: action, dateAndTime: dateAndTime, id: id, status: status, picture: picture },
//         type: QueryTypes.UPDATE
//     })
//     res.send("Updated successfully")
// })


module.exports = router