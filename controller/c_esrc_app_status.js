const express = require('express')
const router = express.Router()
const { QueryTypes } = require('sequelize')
const db = require('../models')

router.get('/get_fe_app_list', async(req, res) => {
    const condition = {
        app_user: '20528906',
    }
    let sql = "select a.idx ,a.title,a.ref_idx,a.bocd,b.apptype,a.docst,a.regdate,b.appdate,b.rcvdate,c.usrnm,c.cdnm,c.name,c.code,"
    sql = sql + "CASE a.docst when 'P' then 'Pending' when 'C' then 'Approved' when 'R' then 'Rejected' when 'W' then 'Withdrawed' END as appst,a.job_status"
    sql = sql + " from t_appprocess as a join t_applist as b on a.ref_idx = b.ref_idx and a.bocd = b.bocd and a.curstep = b.step"
    sql = sql + " left join (select a.usrid,a.usrnm,a.empno,a.empno_old,c.cdnm,b.name,b.code"
    sql = sql + " from t_user as a left join t_dept as b on  a.deptcd = b.code"
    sql = sql + " left join (select * from t_cd_comm where catcd = 'POS') as c on a.poscd = c.cdcd) as c on a.regusr = c.usrid"
    sql = sql + " where a.docst = 'P' and b.appusr = :app_user and a.job_status is null and a.docst not in ('W','R')"
    sql = sql + " order by regdate asc"
    const data = await db.sequelize.query(sql, {
        replacements: { app_user: condition.app_user },
        type: QueryTypes.SELECT
    })
    res.send(data)
})

module.exports = router