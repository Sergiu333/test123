const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});

app.post('/api/location', async (req, res) => {
    const { latitude, longitude } = req.body;
    try {
        const query = 'INSERT INTO locations (latitude, longitude) VALUES ($1, $2)';
        await pool.query(query, [latitude, longitude]);
        res.status(201).send('Location saved');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving location');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
