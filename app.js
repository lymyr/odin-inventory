import express from "express";
import path from 'node:path'
import inventoryRouter from "./routes/inventoryRouter.js";

process.loadEnvFile()
const app = express()
app.set('views', path.join(import.meta.dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))

app.use('/', inventoryRouter)

app.listen(process.env.PORT, () => {
    console.log("Listening on " + process.env.PORT)
})