import { 
    getItems as queryAll
} from "../db/query.js"

export async function getItems(req, res) {
    const items = await queryAll()
    res.render('index', {title: 'Item', dataList: items})
}