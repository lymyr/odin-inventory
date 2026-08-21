import { getItems, getPeople, getInventory as queryAll} from "../db/query.js"

export async function getInventory(req, res) {
    const inventory = await queryAll(); // todo: include DISTINCT per table
    res.render('index', {title: 'Inventory', dataList: inventory})
}

export async function getFromDetails(req, res) {
    const {items, people} = await Promise.all(getItems(), getPeople())
    
    res.send([items, people])
}

export async function addInventory(req, res) {
    res.send(200)
}