import express from "express";
import path from 'node:path'
import inventoryRouter from "./routes/inventoryRouter.js";
import categoryRouter from "./routes/categoryRouter.js";
import itemRouter from "./routes/itemRouter.js";
import personRouter from "./routes/personRouter.js";

process.loadEnvFile()
const app = express()
app.set('views', path.join(import.meta.dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(import.meta.dirname, 'public')))

app.use('/', inventoryRouter)
app.use('/category', categoryRouter)
app.use('/item', itemRouter)
app.use('/person', personRouter)

app.use((req, res) => {
    res.render('error', {title: 'Error', errorDesc: 'Page not Found'})
})

// may add custom Error class with customized title depending on error
app.use((err, req, res, next) => {
    res.render('error', {title: 'Error', errorDesc: err})
})

app.listen(process.env.PORT, 'localhost', () => {
    console.log("Listening on " + process.env.PORT)
})