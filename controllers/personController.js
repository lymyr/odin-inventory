import { 
    getPeople as queryAll
} from "../db/query.js"

export async function getPeople(req, res) {
    const persons = await queryAll()
    res.render('index', {title: 'Person', dataList: persons})
}