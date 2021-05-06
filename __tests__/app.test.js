import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  beforeAll(() => {
    execSync('npm run setup-db');
  });

  afterAll(async () => {
    return client.end();
  });

  const expectedStuff = [
    {
      id: 1,
      name: 'lamp',
      type: 'furniture',
      description: 'A wooden desk lamp.',
      isSentimental: false,
      yearAcquired: 2020,
      color: 'brown'
    },
    {
      id: 2,
      name: 'radio',
      type: 'furniture',
      description: 'A tabletop FM radio.',
      isSentimental: false,
      yearAcquired: 2021,
      color: 'brown'
    },
    {
      id: 3,
      name: 'bouquet',
      type: 'plant',
      description: 'Some flowers I picked out in the city, in a jar.',
      isSentimental: true,
      yearAcquired: 2021,
      color: 'green'
    },
    {
      id: 4,
      name: 'books',
      type: 'things',
      description: 'A few stacks of books, probably around 100.',
      isSentimental: true,
      yearAcquired: 2014,
      color: 'green'
    },
    {
      id: 5,
      name: 'poem',
      type: 'art',
      description: 'A Marilyn Hacker poem transcribed on handmade paper that I got from my partner as a gift.',
      isSentimental: true,
      yearAcquired: 2020,
      color: 'blue'
    },
    {
      id: 6,
      name: 'rug',
      type: 'textiles',
      description: 'A flatwoven rug from Ikea.',
      isSentimental: false,
      yearAcquired: 2021,
      color: 'white'
    },
    {
      id: 7,
      name: 'blanket',
      type: 'textiles',
      description: 'A wool blanket hanging on my door.',
      isSentimental: false,
      yearAcquired: 2021,
      color: 'blue'
    },
    {
      id: 8,
      name: 'curtain',
      type: 'textiles',
      description: 'Natural color linen curtain with wooden curtain rings.',
      isSentimental: false,
      yearAcquired: 2020,
      color: 'white'
    },
    {
      id: 9,
      name: 'desk',
      type: 'furniture',
      description: 'An old hardwood desk, pretty small. It has three drawers',
      isSentimental: false,
      yearAcquired: 2020,
      color: 'brown'
    },
    {
      id: 10,
      name: 'yoga mat',
      type: 'things',
      description: 'A leaf green yoga mat.',
      isSentimental: true,
      yearAcquired: 2018,
      color: 'green'
    },
    {
      id: 11,
      name: 'computer',
      type: 'things',
      description: 'A space gray Macbook Pro.',
      isSentimental: true,
      yearAcquired: 2021,
      color: 'gray'
    }
  ];

  // If a GET request is made to /api/cats, does:
  // 1) the server respond with status of 200
  // 2) the body match the expected API data?
  it('GET /api/stuff', async () => {
    // act - make the request
    const response = await request.get('/api/stuff');

    // was response OK (200)?
    expect(response.status).toBe(200);

    // did it return the data we expected?
    expect(response.body).toEqual(expectedStuff);

  });

  // If a GET request is made to /api/cats/:id, does:
  // 1) the server respond with status of 200
  // 2) the body match the expected API data for the cat with that id?
  test('GET /api/stuff/:id', async () => {
    const response = await request.get('/api/stuff/2');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedStuff[1]);
  });
});