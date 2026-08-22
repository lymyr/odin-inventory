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

app.use('/', inventoryRouter)
app.use('/category', categoryRouter)
app.use('/item', itemRouter)
app.use('/person', personRouter)

app.listen(process.env.PORT, 'localhost', () => {
    console.log("Listening on " + process.env.PORT)
})