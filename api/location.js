const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { latitude, longitude } = req.body;
        try {
            const query = 'INSERT INTO locations (latitude, longitude) VALUES ($1, $2)';
            await pool.query(query, [latitude, longitude]);
            res.status(201).send('Location saved');
        } catch (err) {
            console.error(err);
            res.status(500).send('Error saving location');
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
}
