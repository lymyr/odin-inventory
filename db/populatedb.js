import { Client } from 'pg'

process.loadEnvFile()

let SQL = `
    CREATE TABLE IF NOT EXISTS category (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(30) NOT NULL UNIQUE,
        description VARCHAR(255)
    );

    CREATE TABLE IF NOT EXISTS item (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(80) NOT NULL UNIQUE,
        description VARCHAR(255)
    );

    CREATE TABLE IF NOT EXISTS item_category (
        item_id INTEGER REFERENCES item,
        category_id INTEGER REFERENCES category,
        PRIMARY KEY (item_id, category_id)
    );

    CREATE TABLE IF NOT EXISTS person (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR(50) NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        item_id INTEGER NOT NULL REFERENCES item(id),
        person_id INTEGER NOT NULL REFERENCES person(id),
        quantity INTEGER CONSTRAINT valid_quantity CHECK (quantity > 0 AND quantity < 1000)
    );
`

if (process.argv[2] == 'seed')
    SQL += `
        INSERT INTO category (name, description)
        VALUES 
            ('Food', 'These things keep you full and energized :)'),
            ('Clothes', 'These things keep you away from jail.'),
            ('Real Estate', 'Damn, you must be really rich.');

        INSERT INTO item (name, description)
        VALUES
            ('Chicken', 'tasty.'),
            ('Booze', 'The liver killer...'),
            ('Sack of rice', 'One of them staple foods.'),
            ('Real Estate #1 Address', 'The good life.'),
            ('Real Estate #2 Address', 'The better life.'),
            ('Pizza T-shirt', 'Because why the hell not?'),
            ('Gingerbread House', 'Delicious and beautiful.'),
            ('Gingerbread House Pants', 'This is getting out hand...');
        
        INSERT INTO item_category(item_id, category_id)
        VALUES
            (1, 1),
            (2, 1),
            (3, 1),
            (4, 3),
            (5, 3),
            (6, 1),
            (6, 2),
            (7, 1),
            (7, 3),
            (8, 1),
            (8, 2),
            (8, 3);

        INSERT INTO person (name)
        VALUES
            ('Steve Bobs'),
            ('Van Coover'),
            ('Mariah Carry'),
            ('Harley Laughter'),
            ('Roronoa Zoro');

        INSERT INTO inventory (item_id, person_id, quantity)
        VALUES
            (1, 2, 4),
            (3, 1, 12),
            (4, 3, 1),
            (5, 3, 1),
            (6, 4, 4),
            (7, 1, 3),
            (8, 5, 23),
            (2, 5, 85);
    `
async function main() {
    console.log("Running populatedb...")
    const client = new Client({
        connectionString: process.env.DBSTRING
    })
    await client.connect()
    await client.query(SQL)
    await client.end()
    console.log("Finished :)")
}

main()