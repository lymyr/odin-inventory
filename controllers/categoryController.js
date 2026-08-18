import { 
    getCategories as queryAll
} from "../db/query.js"

export async function getCategories(req, res) {
    const categories = await queryAll()
    res.render('index', {title:'Category', dataList: categories})
}