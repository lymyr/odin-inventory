import { getInventory as queryAll} from "../db/query.js"

export async function getInventory(req, res) {
    const inventory = await queryAll();
    res.render('index', {title: 'Inventory', dataList: inventory})
}