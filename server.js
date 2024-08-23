const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Configurarea clientului PostgreSQL
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

// Endpoint pentru primirea datelor de geolocatie
app.post('/api/geolocation', async (req, res) => {
    const { latitude, longitude, userAgent } = req.body;

    const query = `
        INSERT INTO geolocation_data (latitude, longitude, user_agent)
        VALUES ($1, $2, $3)
    `;

    try {
        await client.query(query, [latitude, longitude, userAgent]);
        res.status(200).json({ message: "Datele au fost inserate cu succes." });
    } catch (err) {
        console.error("Eroare la inserarea datelor:", err);
        res.status(500).json({ error: "A apărut o eroare la inserarea datelor." });
    }
});

app.listen(port, () => {
    console.log(`Serverul rulează la http://localhost:${port}`);
});
