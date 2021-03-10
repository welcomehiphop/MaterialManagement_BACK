const express = require('express')
const router = express.Router()
const { QueryTypes } = require('sequelize')
const db = require('../models')

router.get('/get_fe_app_status/:id', async(req, res) => {
    const id = req.params.id
    const emp_no = req.body.emp_no
    let sql = "select a.*,(select usrnm from t_user_all as b where a.app_user = b.empno) as Name ,b.cl_band,a.app_date,a.rcv_date,comment from t_esrc_applist as a  join t_user_all as b on a.app_user = b.empno where ref_id = :id and a.app_user = :emp_no"
    let sql2 = "select a.*,(select usrnm from t_user as b where a.carrier = b.usrid) as carrier_name ,(select usrnm from t_user as b where a.reg_no = b.usrid) as reg_name from t_esrc_fe_carry as a where id = :id"
    let sql3 = "select * from t_esrc_fe_carry_file where ref_id = :id"
    let sql4 = "select *,convert(varchar(50),(qty * price),1) as total from t_esrc_fe_carry_spare where ref_id = :id"
    try {
        const data = await db.sequelize.query(sql, {
            replacements: { id: id },
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

module.exports = router