import pool from "./pool.js";

export async function getInventory() {
    const { rows } = await pool.query(`
        SELECT 
            inventory.id AS id,
            item.name AS item, 
            inventory.quantity AS quantity, 
            person.name AS owner,
            JSON_AGG(category.name) AS category
        FROM inventory
        INNER JOIN person ON inventory.person_id = person.id
        INNER JOIN item ON inventory.item_id = item.id
        INNER JOIN item_category ON item_category.item_id = item.id
        INNER JOIN category ON item_category.category_id = category.id
        GROUP BY inventory.id, item, quantity, owner
    `)
    return rows
}

export async function getCategories() {
    const { rows } = await pool.query(`
        SELECT * FROM category
    `)
    return rows
}

export async function getPeople() {
    const { rows } = await pool.query(`
        SELECT * FROM person    
    `)
    return rows
}

export async function getItems() {
    const { rows } = await pool.query(`
        SELECT item.id, item.name, item.description, JSON_AGG(category.name) AS category FROM item
        INNER JOIN item_category AS ic ON ic.item_id = item.id
        INNER JOIN category ON ic.category_id = category.id
        GROUP BY item.id, item.name, item.description
    `)
    return rows
}