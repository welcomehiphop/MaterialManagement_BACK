const express = require('express')
const router = express.Router()
const path = require('path')
const { QueryTypes } = require('sequelize')
const uploadMultiFile = require('../middleware/uploadfile')
const db = require('../models')

router.post('/post_req_approve', async(req, res) => {
    const body = {
        docno: req.body.docno,
        reqType: req.body.reqType,
        carry_date: req.body.carry_date,
        destination: req.body.destination,
        purpose: req.body.purpose,
        carrier: req.body.carrier,
        department: req.body.department,
        reg_no: req.body.reg_no,
        reg_date: req.body.reg_date,

    }
    const sql = "insert into t_esrc_fe_carry(docno,reqType,carry_date,destination,purpose,carrier,department,reg_no,reg_date) values(:docno,:reqType,:carry_date,:destination,:purpose,:carrier,:department,:reg_no,:reg_date)"
    const select = "select id from t_esrc_fe_carry where docno = :docno"
    const data = await db.sequelize.query(sql, {
        replacements: { docno: body.docno, reqType: body.reqType, carry_date: body.carry_date, destination: body.destination, purpose: body.purpose, carrier: body.carrier, department: body.department, reg_no: body.reg_no, reg_date: body.reg_date },
        type: QueryTypes.INSERT
    })
    const data2 = await db.sequelize.query(select, {
        replacements: { docno: body.docno },
        type: QueryTypes.SELECT
    })

    res.send(data2)
})

router.get('/get_carry_list', async(req, res) => {
    const condition = {
        emp_name: req.query.emp_name,
        docst: req.query.docst,
        fromDate: req.query.fromDate,
        toDate: req.query.toDate
    }
    let sql = "select a.id,docno,reqType,purpose,a.reg_no,c.usrnm as reg_name,a.carrier,d.usrnm as carrier_name,department,CONVERT(varchar(20),a.reg_date,120) as reg_date,CASE when b.docst = 'P' then 'Pending' when b.docst = 'C' then 'Approved' when b.docst = 'W' then 'Withdraw' when b.docst = 'R' then 'Reject' END as status from t_esrc_fe_carry as a join t_appprocess as b on a.id = b.ref_idx join t_user as c on a.reg_no = c.usrid join t_user as d on a.carrier = d.usrid where b.bocd = 'feroom' and c.usrnm like :emp_name and docst like :docst and CONVERT(VARCHAR(8),a.reg_date,112) between :fromDate and :toDate order by a.id desc"
    const data = await db.sequelize.query(sql, {
        replacements: { emp_name: condition.emp_name, docst: condition.docst, fromDate: condition.fromDate, toDate: condition.toDate },
        type: QueryTypes.SELECT
    })
    res.send(data)

})

router.get('/get_carry_list/:id', async(req, res) => {
    const id = req.params.id
    const bocd = 'feroom'
    let sql = "select a.*,(select usrnm from t_user_all as b where a.appusr = b.empno) as Name ,b.cl_band,a.appdate,a.rcvdate,comment from t_applist as a  join t_user_all as b on a.appusr = b.empno where ref_idx = :id and bocd = :bocd order by step"
    let sql2 = "select a.*,(select usrnm from t_user as b where a.carrier = b.usrid) as carrier_name ,(select usrnm from t_user as b where a.reg_no = b.usrid) as reg_name from t_esrc_fe_carry as a where id = :id"
    let sql3 = "select * from t_esrc_fe_carry_file where ref_id = :id"
    let sql4 = "select *,convert(varchar(50),(qty * price),1) as total from t_esrc_fe_carry_spare where ref_id = :id"
    try {
        const data = await db.sequelize.query(sql, {
            replacements: { id: id, bocd: bocd },
            type: QueryTypes.SELECT
        })
        const data2 = await db.sequelize.query(sql2, {
            replacements: { id: id },
            type: QueryTypes.SELECT
        })
        const data3 = await db.sequelize.query(sql3, {
            replacements: { id: id },
            type: QueryTypes.SELECT
        })
        const data4 = await db.sequelize.query(sql4, {
            replacements: { id: id },
            type: QueryTypes.SELECT
        })
        res.send({
            process: data,
            detail: data2,
            file: data3,
            spares: data4
        })
    } catch (e) {
        res.send(e.message)
    }
})

router.get('/get_carry_spare/:id', async(req, res) => {
    const id = req.params.id
    let sql = "select * from t_esrc_fe_carry_spare where ref_id = :id"
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

router.post('/post_process_approve', async(req, res) => {
    const body = {
        title: req.body.title,
        bocd: req.body.bocd,
        ref_id: req.body.ref_id,
        reg_no: req.body.reg_no,
        reg_date: req.body.reg_date,
        curstep: req.body.curstep,
        docst: req.body.docst,
        // --------------------------------- applist table
        // bocd,ref_id,app_user,role,app_type,appst,withdraw,step,ordno,comment,rcv_date,app_date,send_mail

    }
    let sql = "insert into t_appprocess(title,bocd,ref_idx,regusr,regdate,curstep,docst) values(:title,:bocd,:ref_id,:reg_no,:reg_date,:curstep,:docst)"
    const data = await db.sequelize.query(sql, {
        replacements: { title: body.title, bocd: body.bocd, ref_id: body.ref_id, reg_no: body.reg_no, reg_date: body.reg_date, curstep: body.curstep, docst: body.docst },
        type: QueryTypes.INSERT
    })
    res.send(body)
})

router.post('/post_list_approve', async(req, res) => {
    const body = {
        docno: req.body.docno,
        bocd: req.body.bocd,
        ref_id: req.body.ref_id,
        app_user: req.body.app_user,
        role: req.body.role,
        app_type: req.body.app_type,
        appst: req.body.appst,
        withdraw: req.body.withdraw,
        step: req.body.step,
        ordno: req.body.ordno,
        comment: req.body.comment,
        rcv_date: req.body.rcv_date,
        app_date: req.body.app_date,
        send_mail: req.body.send_mail
    }
    let sql = "insert into t_applist(bocd,ref_idx,appusr,role,apptype,appst,withdraw,step,ordno,comment,rcvdate,appdate,sendmail) values(:bocd,:ref_id,:app_user,:role,:app_type,:appst,:withdraw,:step,:ordno,:comment,:rcv_date,:app_date,:send_mail)"
    const data = await db.sequelize.query(sql, {
        replacements: {
            docno: body.docno,
            bocd: body.bocd,
            ref_id: body.ref_id,
            app_user: body.app_user,
            role: body.role,
            app_type: body.app_type,
            appst: body.appst,
            withdraw: body.withdraw,
            step: body.step,
            ordno: body.ordno,
            comment: body.comment,
            rcv_date: body.rcv_date,
            app_date: body.app_date,
            send_mail: body.send_mail
        },
        type: QueryTypes.INSERT
    })
    res.send(req.body)
})

router.post('/post_spare_approve', async(req, res) => {
    const data = {
        ref_id: req.body.ref_id,
        spare_code: req.body.spare_code,
        location_code: req.body.location_code,
        qty: req.body.qty,
        approve_status: req.body.approve_status,
        price: req.body.price
    }
    const sql_post_spare = "insert into t_esrc_fe_carry_spare(ref_id,spare_code,qty,location_code,approve_status,price) values(:ref_id,:spare_code,:qty,:location_code,:approve_status,:price)"
    const data3 = await db.sequelize.query(sql_post_spare, {
        replacements: { ref_id: data.ref_id, spare_code: data.spare_code, location_code: data.location_code, qty: data.qty, approve_status: data.approve_status, price: data.price },
        type: QueryTypes.INSERT
    })
    res.send(req.body)
})

router.post('/post_files_approve', uploadMultiFile, async(req, res) => {
    const ref_id = req.body.ref_id
    const files = req.files
    let sql = "insert into t_esrc_fe_carry_file (ref_id,filename) values(:ref_id,:files)"
    for (let i = 0; i < files.length; i++) {
        const data = await db.sequelize.query(sql, {
            replacements: { ref_id: ref_id, files: files[i].filename }
        })
    }
    res.send(files);
})

router.get('/get_all_location', async(req, res) => {
    let sql = "select location_code,id from t_esrc_fe_location"
    try {
        const data = await db.sequelize.query(sql, {
            type: QueryTypes.SELECT
        })
        res.send(data)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.put('/update_fe_status/:id', async(req, res) => {
    const id = req.params.id
    const docst = req.body.docst
    const app_date = req.body.app_date
    const rcv_date = req.body.rcv_date
    const sql = "update t_appprocess set docst = :docst where ref_idx = :id  and bocd = 'feroom'"
    const sql2 = "update t_applist set appdate = :app_date , rcvdate = :rcv_date where ref_idx = :id and step = '1' and bocd = 'feroom  '"
    try {
        const data = await db.sequelize.query(sql, {
            replacements: { id: id, docst: docst },
            type: QueryTypes.UPDATE
        })
        const data2 = await db.sequelize.query(sql2, {
            replacements: { id: id, app_date: app_date, rcv_date: rcv_date },
            type: QueryTypes.UPDATE
        })
        res.send('Success')
    } catch (e) {
        res.status(500).send(e.message)
    }
})



module.exports = router