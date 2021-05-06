/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import stuff from './stuff.js';

run();

async function run() {

  try {

    await Promise.all(
      stuff.map(thing => {
        return client.query(`
          INSERT INTO stuff (name, type, description, is_sentimental, year_acquired, color)
          VALUES ($1, $2, $3, $4, $5, $6);
        `,
        [thing.name, thing.type, thing.description, thing.isSentimental, thing.yearAcquired, thing.color]);
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