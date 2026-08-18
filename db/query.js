import pool from "./pool.js";

export async function getInventory() {
    const { rows } = await pool.query(`
        SELECT 
            item.name AS item, 
            inventory.quantity AS quantity, 
            person.name AS owner,
            JSON_AGG(category.name) AS category
        FROM inventory
        INNER JOIN person ON inventory.person_id = person.id
        INNER JOIN item ON inventory.item_id = item.id
        INNER JOIN item_category ON item_category.item_id = item.id
        INNER JOIN category ON item_category.category_id = category.id
        GROUP BY item, quantity, owner
    `)
    return rows
}