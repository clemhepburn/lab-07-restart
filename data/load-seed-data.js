/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import stuff from './stuff.js';
import users from './users.js';

run();

async function run() {

  try {

    const data = await Promise.all(users.map(user => {
      return client.query(`
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING *;
      `, [user.name, user.email, user.password]);
    }));

    const user = data[0].rows[0];

    await Promise.all(
      stuff.map(thing => {
        return client.query(`
          INSERT INTO stuff (name, type, description, is_sentimental, year_acquired, color, user_id)
          VALUES ($1, $2, $3, $4, $5, $6, $7);
        `,
        [thing.name, thing.type, thing.description, thing.isSentimental, thing.yearAcquired, thing.color, user.id]);
      })
    );
    

    console.log('seed data load complete');
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
} 