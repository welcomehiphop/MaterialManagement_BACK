const express = require('express')
const app = express()
var path = require('path');
var cors = require('cors')



global.__basedir = __dirname

/*middle ware*/
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


// app.use(express.static(path.join(__dirname, '/upload')));
app.use(require('./controller/c_esrc_system'))
app.use(require('./controller/c_esrc_monitoring'))
app.use(require('./controller/c_esrc_approval'))
app.use(require('./controller/c_ppe_system'))
app.use(require('./controller/t_esrc_ppe_approval'))
app.use(require('./controller/c_it_mold'))
app.use(require('./controller/c_it_location'))
app.use(require('./controller/c_it_inout'))
app.use(require('./controller/c_it_carryout'))
app.use(require('./controller/c_esrc_stockview'))
app.use(require('./controller/c_esrc_app_status'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    const env = `${process.env.NODE_ENV || 'development'}`
    console.log(`App listening on port ${PORT}`)
    console.log(`App listening on env ${env}`)
    console.log(`Press Ctrl+C to quit.`)
})