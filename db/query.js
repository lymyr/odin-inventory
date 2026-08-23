import pool from "./pool.js";

// gets
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
        ORDER BY owner
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

export async function getItemsCategory() {
    const { rows } = await pool.query(`
        SELECT item.id, item.name, item.description, JSON_AGG(category.name) AS category FROM item
        LEFT JOIN item_category AS ic ON ic.item_id = item.id
        LEFT JOIN category ON ic.category_id = category.id
        GROUP BY item.id, item.name, item.description
    `)
    return rows
}

export async function getItems() {
    const { rows } = await pool.query(`
        SELECT * FROM item
    `)
    return rows
}

export async function getItem(id) {
    const { rows } = await pool.query(`
        SELECT * FROM item WHERE item.id = $1
    `, [id])
    return rows
}

export async function getItemCategory(id) {
    const [item, cat] = await Promise.all([
        pool.query(`
            SELECT 
                item.id, 
                item.name, 
                item.description,
                JSON_AGG(c.id) AS category
            FROM item
            LEFT JOIN item_category AS ic ON item.id = ic.item_id
            LEFT JOIN category AS c ON ic.category_id = c.id
            WHERE item.id = $1
            GROUP BY item.id;
        `, [id]),
        pool.query(`
            SELECT id, name FROM category
        `)
    ])
    return {
        item: item.rows, 
        category: cat.rows
    }
}

export async function getItemByName(name) {
    const { rows } = await pool.query(`
        SELECT * FROM item WHERE UPPER(item.name) = UPPER($1)
    `, [name])
    return rows
}

export async function getItemsFilterId(id, name) {
    const { rows } = await pool.query(`
        SELECT * FROM item WHERE UPPER(item.name) = UPPER($1) AND id != $2
    `, [name, id])
    return rows
}

export async function getItemsInInv(id) {
    const { rows } = await pool.query(`
        SELECT item_id, person_id, person.name FROM inventory
        INNER JOIN person ON person_id = person.id
        WHERE item_id = $1 
    `, [id])
    return rows
}

export async function getPerson(id) {
    const { rows } = await pool.query(`
        SELECT * FROM person WHERE person.id = $1
    `, [id])
    return rows
}

export async function getInvMatch(item_id, person_id, id=null) {
    const q = async () => {
        let query;
        if (id === null) {
            query = await pool.query(`
                SELECT * FROM inventory WHERE item_id = $1 AND person_id = $2
            `, [item_id, person_id])
            return query
        }
        query = await pool.query(`
            SELECT * FROM inventory WHERE item_id = $1 AND person_id = $2 AND id != $3
        `, [item_id, person_id, id])
        return query
    }
    const { rows } = await q()
    return rows
}

export async function getInvMatchById(id) {
    const { rows } = await pool.query(`
        SELECT * FROM inventory WHERE id = $1
    `, [id])
    return rows
}

export async function getSameNameCategory(name) {
    const { rows } = await pool.query(`
        SELECT * FROM category WHERE
            UPPER(name) = UPPER($1)    
    `, [name])
    return rows
}

export async function getSameNameUpdateCategory(id, name) {
    const { rows } = await pool.query(`
        SELECT * FROM category WHERE id != $1 AND UPPER(name) = UPPER($2)    
    `, [id, name])
    return rows
}

export async function getCategoryById(id) {
    const { rows } = await pool.query(`
        SELECT * FROM category WHERE id = $1    
    `, [id])
    return rows
}

export async function getPersonByName(name) {
    const { rows } = await pool.query(`
        SELECT * FROM person WHERE UPPER(name) = UPPER($1)    
    `, [name])
    return rows
}

// creates
export async function addInventory(item_id, quantity, person_id) {
    await pool.query(`INSERT INTO inventory (item_id, quantity, person_id) 
        VALUES($1, $2, $3)
    `, [item_id, quantity, person_id])
}

export async function addCategory(name, description) {
    await pool.query(`
        INSERT INTO category (name, description) VALUES ($1, $2)    
    `, [name, description])
}

export async function addPerson(name) {
    await pool.query(`
        INSERT INTO person (name) VALUES ($1)    
    `, [name])
}

export async function addItem(name, description, categories) {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        await client.query(`
            INSERT INTO item (name, description) VALUES ($1, $2);
        `, [name, description])
        
        let i = 2
        for (const cat of categories) {
            await client.query(`
                INSERT INTO item_category (item_id, category_id) VALUES (
                    (SELECT id FROM item WHERE name = $1),
                    $2
                );
            `, [name, cat])
        }

        await client.query('COMMIT')
    }
    catch(e) {
        return e
        await client.query('ROLLBACK')
    }
    finally {
        client.release()
    }

    return 200
}

// updates
export async function updateInventory(id, item_id, quantity, person_id) {
    await pool.query(`
        UPDATE inventory SET 
            item_id = $2, 
            quantity = $3, 
            person_id = $4
        WHERE id = $1
    `, [id, item_id, quantity, person_id])
}

export async function updateCategory(id, name, description) {
    await pool.query(`
        UPDATE category SET
            name = $2,
            description = $3
        WHERE id = $1
    `, [id, name, description])
}

export async function updatePerson(id, name) {
    await pool.query(`
        UPDATE person SET
            name = $2
        WHERE id = $1
    `, [id, name])
}

export async function updateItem(id, name, description, categoryList) {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')

        let params = []
        categoryList.forEach((cat, i) => {
            params.push(`$${i+2}`)
        })


        await client.query(`
            UPDATE item SET name = $1, description = $2
            WHERE id = $3
        `, [name, description, id])

        await client.query(`
            DELETE FROM item_category WHERE item_id = $1 AND 
                category_id NOT IN (${params.toString()})
        `, [id, ...categoryList])
  
        const oldCats = await client.query(`
            SELECT category_id FROM item_category WHERE item_id = $1 AND
                category_id IN (${params.toString()})
        `, [id, ...categoryList])
        
        for (const cat of categoryList) {
            if (!oldCats.rows.map(catObj => catObj.category_id).includes(cat))
                await client.query(`
                    INSERT INTO item_category (item_id, category_id)
                    VALUES ($1, $2)
                `, [id, cat])
        }

        await client.query('COMMIT')
    }
    catch(e) {
        console.error(e)
        return e
        await client.query('ROLLBACK')
    }
    finally {
        client.release()
    }
    return 200
}


// deletes
export async function deleteInventory(id) {
    await pool.query(`
        DELETE FROM inventory WHERE id = $1
    `, [id])
}

export async function deleteCategory(id) {
    await pool.query(`
        DELETE FROM category WHERE id = $1
    `, [id])
}

export async function deletePerson(id) {
    await pool.query(`
        DELETE FROM person WHERE id = $1
    `, [id])
}

export async function deleteItem(id) {
    const client = await pool.connect()
    try {
        await client.query('BEGIN')
        await client.query(`
            DELETE FROM item_category WHERE item_id = $1    
        `, [id])
        await client.query(`
            DELETE FROM item WHERE id = $1    
        `, [id])
        await client.query('COMMIT')
    }
    catch(e) {
        await client.query('ROLLBACK')
        console.error(e)
        return e
    }
    finally {
        client.release()
        return 200
    }
}