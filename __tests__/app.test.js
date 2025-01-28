const endpointsJson = require("../endpoints.json");


/* Set up your test imports here */

const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');

/* Set up your beforeEach & afterAll functions here */

beforeEach(() => {
  return seed(testData); 
});

afterAll(() => {
  return db.end(); 
});



describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
  
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});


describe('Potential errors when requesting API', () => {

  test('404: Responds with error if endpoint is not available', () => {
    return request(app)
    .get('/api/nope')
    .expect(404)
    .then((response) => {
      expect(response.body.error).toBe('Endpoint not found');
    });
  });
  
 })






describe('GET /api/topics', () => {
  test('200: Responds an array of topic objects ', () => {
    return request(app)
    .get('/api/topics')
    .expect(200)
    .then((response) => {
    const body = response.body
    expect(body.topics).toBeInstanceOf(Array)
    expect(body.topics.length).toBe(3)
    body.topics.forEach((topic) => {
      expect(typeof topic.description).toBe('string')
      expect(typeof topic.slug).toBe('string')
      expect(topic).toHaveProperty('slug')
      expect(topic).toHaveProperty('description')
    })
    })
  })

})
