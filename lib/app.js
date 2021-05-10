/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';

// make an express app
const app = express();

// allow our server to be called from any website
app.use(cors());
// read JSON from body of request when indicated by Content-Type
app.use(express.json());
// enhanced logging
app.use(morgan('dev'));

// heartbeat route
app.get('/', (req, res) => {
  res.send('My Belongings API');
});

// API routes,
app.get('/api/stuff', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
      SELECT  id,
              name,
              type,
              description,
              is_sentimental as "isSentimental",
              year_acquired as "yearAcquired",
              color
      FROM    stuff;
    `);

    // send back the data
    res.json(data.rows); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

app.post('/api/stuff', async (req, res) => {
  try {
    const thing = req.body;

    const data = await client.query(`
      INSERT into stuff (id, name, type, description, is_sentimental, year_acquired, color)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, type, description, is_sentimental, year_acquired, color;
    `, [thing.id, thing.name, thing.type, thing.description, thing.isSentimental, thing.yearAcquired, thing.color]
    );

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/stuff/:id', async (req, res) => {
  try {
    const thing = req.body;

    const data = await client.query(`
      UPDATE stuff
      SET id = $1,
          name = $2,
          type = $3,
          description = $4,
          is_sentimental = $5,
          year_acquired = $6,
          color = $7
      WHERE id = $1
      RETURNING id, name, type, description, is_sentimental, year_acquired, color;
      `, [thing.id, thing.name, thing.type, thing.description, thing.isSentimental, thing.yearAcquired, thing.color]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/stuff/:id', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
      SELECT  id,
              name,
              type,
              description,
              is_sentimental as "isSentimental",
              year_acquired as "yearAcquired",
              color
      FROM    stuff
      WHERE   id = $1;
    `, [req.params.id]);

    // send back the data
    res.json(data.rows[0] || null); 
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

export default app;