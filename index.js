const express = require('express')
const app = express()
const layout = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const fileUpload = require('express-fileupload');

// let connection = {
//     user: 'root',
//     password: '123456',
//     host: 3306,
//     database: 'demodata',
//     charset: 'utf8_general_ci'
// }
// let connect = mysql.createConnection(connection)
// connect.connect(err => {
//     if (err) console.log(err)
//     else console.log("connect success")
// })

app.set('views', './src/views')
app.set('view engine', 'ejs')
app.use(layout)
app.set('layout', 'index')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(fileUpload({
    createParentPath: true
}));
app.listen(3000, () => {
    console.log("server is running")
})


app.get('/', (req, res) => {
    res.render('index')
})