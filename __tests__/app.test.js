import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  // beforeAll(() => {
  //   execSync('npm run setup-db');
  // });



  const expectedStuff = [
    {
      id: 1,
      name: 'lamp',
      type: 'furniture',
      description: 'A wooden desk lamp.',
      isSentimental: false,
      yearAcquired: 2020,
      color: 'brown',
      userId: expect.any(Number)
    },
    {
      id: 2,
      name: 'radio',
      type: 'furniture',
      description: 'A tabletop FM radio.',
      isSentimental: false,
      yearAcquired: 2021,
      color: 'brown',
      userId: expect.any(Number)
    },
    {
      id: 3,
      name: 'bouquet',
      type: 'plant',
      description: 'Some flowers I picked out in the city, in a jar.',
      isSentimental: true,
      yearAcquired: 2021,
      color: 'green',
      userId: expect.any(Number)
    },
    {
      id: 4,
      name: 'books',
      type: 'things',
      description: 'A few stacks of books, probably around 100.',
      isSentimental: true,
      yearAcquired: 2014,
      color: 'green',
      userId: expect.any(Number)
    },
    {
      id: 5,
      name: 'poem',
      type: 'art',
      description: 'A Marilyn Hacker poem transcribed on handmade paper that I got from my partner as a gift.',
      isSentimental: true,
      yearAcquired: 2020,
      color: 'blue',
      userId: expect.any(Number)
    },
    {
      id: 6,
      name: 'rug',
      type: 'textiles',
      description: 'A flatwoven rug from Ikea.',
      isSentimental: false,
      yearAcquired: 2021,
      color: 'white',
      userId: expect.any(Number)
    },
    {
      id: 7,
      name: 'blanket',
      type: 'textiles',
      description: 'A wool blanket hanging on my door.',
      isSentimental: false,
      yearAcquired: 2021,
      color: 'blue',
      userId: expect.any(Number)
    },
    {
      id: 8,
      name: 'curtain',
      type: 'textiles',
      description: 'Natural color linen curtain with wooden curtain rings.',
      isSentimental: false,
      yearAcquired: 2020,
      color: 'white',
      userId: expect.any(Number)
    },
    {
      id: 9,
      name: 'desk',
      type: 'furniture',
      description: 'An old hardwood desk, pretty small. It has three drawers',
      isSentimental: false,
      yearAcquired: 2020,
      color: 'brown',
      userId: expect.any(Number)
    },
    {
      id: 10,
      name: 'yoga mat',
      type: 'things',
      description: 'A leaf green yoga mat.',
      isSentimental: true,
      yearAcquired: 2018,
      color: 'green',
      userId: expect.any(Number)
    },
    {
      id: 11,
      name: 'computer',
      type: 'things',
      description: 'A space gray Macbook Pro.',
      isSentimental: true,
      yearAcquired: 2021,
      color: 'gray',
      userId: expect.any(Number)
    }
  ];

  let newThing = {
    id: expect.any(Number),
    name: 'mirror',
    type: 'furniture',
    description: 'an oval mirror with a dried rose taped to it.',
    isSentimental: true,
    yearAcquired: 2020,
    color: 'silver',
    userId: expect.any(Number)
  };

  let newThing2 = {
    id: expect.any(Number),
    name: 'throw',
    type: 'textiles',
    description: 'a faded pumpkin orange woven throw with fringe',
    isSentimental: false,
    yearAcquired: 2019,
    color: 'orange',
    userId: expect.any(Number)
  };

  let newThing3 = {
    id: expect.any(Number),
    name: 'basket',
    type: 'furniture',
    description: 'a large woven straw basket with handles',
    isSentimental: true,
    yearAcquired: 2017,
    color: 'wheat',
    userId: expect.any(Number)
  };

  // beforeAll(() => {
  //   execSync('npm run recreate-tables');
  // });

  let user;

  beforeAll(async () => {
    execSync('npm run setup-db');

    const response = await request
      .post('/api/auth/signup')
      .send({
        name: 'Me the User',
        email: 'me@user.com',
        password: 'password'
      });

    expect(response.status).toBe(200);

    user = response.body;
  });


  afterAll(async () => {
    return client.end();
  });

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
    newThing.userId = user.id;
    const thing = (await request.post('/api/stuff').send(newThing)).body;
    const response = await request.get(`/api/stuff/${thing.id}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(thing);
    
  });

  it('POST /api/stuff', async () => {
    newThing.userId = user.id;
    const response = await request.post('/api/stuff').send(newThing);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(newThing);
  });

  it('PUT /api/stuff/:id', async () => {
    newThing2.userId = user.id;
    const thing = (await request.post('/api/stuff').send(newThing2)).body;
    thing.color = 'blue';

    const response = await request.put(`/api/stuff/${thing.id}`).send(thing);

    expect(response.status).toBe(200);
    expect(response.body.color).toEqual('blue');
  });


  it('DELETE /api/stuff/:id', async () => {
    execSync('npm run setup-db');
    await request.delete(`/api/stuff/${expectedStuff.length}`);

    const response = await request.get('/api/stuff');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining(expectedStuff.slice(0, -1)));
  });



});