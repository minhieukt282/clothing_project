const express = require('express')
const app = express()
const layout = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const fileUpload = require('express-fileupload');

let connection = {
    user: 'root',
    password: '123456',
    host: 3306,
    database: 'clothingweb',
    charset: 'utf8_general_ci'
}
let connect = mysql.createConnection(connection)
connect.connect(err => {
    if (err) console.log(err)
    else console.log("connect success")
})

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

//index home
app.get('/', (req, res) => {
    let query = `select *
                 from product
                          join productdetails p on product.product_id = p.product_id limit 9`
    connect.query(query, async (err, listProducts) => {
        if (err) console.log(err)
        else {
            await showRender('./product/homeProduct', listProducts, res)
        }
    })

})

app.get('/product', (req, res) => {
    let query = `select *
                 from product
                          join productdetails p on product.product_id = p.product_id`
    connect.query(query, async (err, listProducts) => {
        if (err) console.log(err)
        else {
            await showRender('./product/listProduct', listProducts, res)
        }
    })
})

app.get('/product/men', (req, res) => {
    showGender('male', res)
})
app.get('/product/men/style/normal', (req, res) => {
    showGenderAndStyle('male', 'normal', res)
})
app.get('/product/men/style/sport', (req, res) => {
    showGenderAndStyle('male', 'sport', res)
})
app.get('/product/men/branch/china', (req, res) => {
    showGenderAndBranch('male', 'china', res)
})
app.get('/product/men/branch/japan', (req, res) => {
    showGenderAndBranch('male', 'japan', res)
})
app.get('/product/woman', (req, res) => {
    showGender('female', res)
})
app.get('/product/woman/style/normal', (req, res) => {
    showGenderAndStyle('female', 'normal', res)
})
app.get('/product/woman/style/sport', (req, res) => {
    showGenderAndStyle('female', 'sport', res)
})
app.get('/product/woman/branch/china', (req, res) => {
    showGenderAndBranch('female', 'china', res)
})
app.get('/product/woman/branch/japan', (req, res) => {
    showGenderAndBranch('female', 'japan', res)
})
app.get('/product/style/normal', (req, res) => {
    showStyle('normal', res)
})
app.get('/product/style/sport', (req, res) => {
    showStyle('sport', res)
})
app.get('/product/branch/china', (req, res) => {
    showBranch('china', res)
})
app.get('/product/branch/japan', (req, res) => {
    showBranch('japan', res)
})
app.get('/product/details/:idProduct', (req, res)=>{
    productDetails(req.params.idProduct, res)
})

function productDetails(id, res){
    console.log("id san pham", id)
    let query = `select *
                 from product
                          join productdetails p on product.product_id = p.product_id
                          join branch b on b.branch_id = product.branch_id
                          join style s on product.style_id = s.style_id
                          join gender g on product.gender_id = g.gender_id
                 where p.product_id = ${id}`
    connect.query(query, async (err, listProducts) => {
        if (err) console.log(err)
        else {
            await showRender('./product/productDetails', listProducts, res)
        }
    })
}

async function showRender(url, listProducts, res) {
    let bestProduct = await bestSeller()
    let newArrivals = await newProduct()
    res.render(url, {
        products: listProducts,
        bestProduct: bestProduct,
        newProduct: newArrivals
    })
}

function showGender(gender, res) {
    let query = `select *
                 from product
                          join productdetails p on product.product_id = p.product_id
                          join branch b on b.branch_id = product.branch_id
                          join style s on product.style_id = s.style_id
                          join gender g on product.gender_id = g.gender_id
                 where gender_name = '${gender}'`
    connect.query(query, async (err, listProducts) => {
        if (err) console.log(err)
        else {
            await showRender('./product/listProduct', listProducts, res)
        }
    })
}

function showGenderAndStyle(gender, style, res) {
    let query = `select *
                 from product
                          join productdetails p on product.product_id = p.product_id
                          join branch b on b.branch_id = product.branch_id
                          join style s on product.style_id = s.style_id
                          join gender g on product.gender_id = g.gender_id
                 where gender_name = '${gender}'
                   and style_name = '${style}' `
    connect.query(query, async (err, listProducts) => {
        if (err) console.log(err)
        else {
            await showRender('./product/listProduct', listProducts, res)
        }
    })
}

function showGenderAndBranch(gender, branch, res) {
    let query = `select *
                 from product
                          join productdetails p on product.product_id = p.product_id
                          join branch b on b.branch_id = product.branch_id
                          join style s on product.style_id = s.style_id
                          join gender g on product.gender_id = g.gender_id
                 where gender_name = '${gender}'
                   and branch_name = '${branch}' `
    connect.query(query, async (err, listProducts) => {
        if (err) console.log(err)
        else {
            await showRender('./product/listProduct', listProducts, res)
        }
    })
}

function showStyle(style, res) {
    let query = `select *
                 from product
                          join productdetails p on product.product_id = p.product_id
                          join branch b on b.branch_id = product.branch_id
                          join style s on product.style_id = s.style_id
                          join gender g on product.gender_id = g.gender_id
                 where style_name = '${style}' `
    connect.query(query, async (err, listProducts) => {
        if (err) console.log(err)
        else {
            await showRender('./product/listProduct', listProducts, res)
        }
    })
}

function showBranch(branch, res) {
    let query = `select *
                 from product
                          join productdetails p on product.product_id = p.product_id
                          join branch b on b.branch_id = product.branch_id
                          join style s on product.style_id = s.style_id
                          join gender g on product.gender_id = g.gender_id
                 where branch_name = '${branch}' `
    connect.query(query, async (err, listProducts) => {
        if (err) console.log(err)
        else {
            await showRender('./product/listProduct', listProducts, res)
        }
    })
}

function bestSeller() {
    return new Promise((resolve, reject) => {
        let query = `select *
                     from product
                              join productdetails p on product.product_id = p.product_id
                              join branch b on b.branch_id = product.branch_id
                              join style s on product.style_id = s.style_id
                              join gender g on product.gender_id = g.gender_id limit 3`
        connect.query(query, (err, listProducts) => {
            if (err) {
                reject(err)
            } else {
                resolve(listProducts)
            }
        })
    })
}

function newProduct() {
    return new Promise((resolve, reject) => {
        let query = `select *
                     from product
                              join productdetails p on product.product_id = p.product_id
                              join branch b on b.branch_id = product.branch_id
                              join style s on product.style_id = s.style_id
                              join gender g on product.gender_id = g.gender_id limit 4`
        connect.query(query, (err, listProducts) => {
            if (err) {
                reject(err)
            } else {
                resolve(listProducts)
            }
        })
    })
}

app.get('/details', (req, res) => {
    let query = `select *
                 from product
                          join productdetails p on product.product_id = p.product_id limit 8`
    connect.query(query, async (err, listProducts) => {
        if (err) console.log(err)
        else {
            await showRender('./product/productDetails', listProducts, res)
        }
    })
})

