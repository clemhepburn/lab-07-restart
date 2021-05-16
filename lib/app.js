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

app.post('/api/auth/signup', async (req, res) => {
  try {
    const user = req.body;
    const data = await client.query(`
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email;
      `, [user.name, user.email, user.password]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).jsomn({ error: err.message });
  }
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
              color,
              user_id as "userId"
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
      INSERT INTO stuff (name, type, description, is_sentimental, year_acquired, color, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, type, description, is_sentimental as "isSentimental", year_acquired as "yearAcquired", color, user_id as "userId";
    `, [thing.name, thing.type, thing.description, thing.isSentimental, thing.yearAcquired, thing.color, 1]
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
    console.log(thing);
    const data = await client.query(`
      UPDATE stuff
      SET name = $1,
          type = $2,
          description = $3,
          is_sentimental = $4,
          year_acquired = $5,
          color = $6,
          user_id = $7
      WHERE id = $8
      RETURNING id, name, type, description, is_sentimental as "isSentimental", year_acquired as "yearAcquired", color, user_id as "userId";
      `, [thing.name, thing.type, thing.description, thing.isSentimental, thing.yearAcquired, thing.color, thing.userId, req.params.id]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/stuff/:id', async (req, res) => {
  try {
    const data = await client.query(`
      DELETE FROM stuff
      WHERE id = $1
      RETURNING id, name, type, description, is_sentimental, year_acquired, color, user_id as "userId";
      `, [req.params.id]);

    res.json(data.rows[0] || null);
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
              color,
              user_id as "userId"
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

app.get('/api/stuff/name/:name', async (req, res) => {
  try {
    const data = await client.query(`
      SELECT id,
             name,
             type,
             description
             is_sentimental
             year_acquired
             color,
             user_id as "userId"
      FROM   books
      WHERE  name = $1;
      `, [req.params.name]);

    res.json(data.rows[0] || null);
  }
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:user_id/stuff', async (req, res) => {
  try {
    const data = await client.query(`
      SELECT id,
             name,
             type,
             description,
             is_sentimental as "isSentimental",
             year_acquired as "yearAcquired",
             color,
             user_id as "userId"
      FROM   stuff
      WHERE  name = $1
      `, [req.params.user_id]);

    res.json(data.rows || null);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

export default app;