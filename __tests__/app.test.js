const endpointsJson = require("../endpoints.json");

/* Set up your test imports here */

const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
require("jest-sorted");

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

describe("GET /api/topics", () => {
  test("200: Responds an array of topic objects ", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({body}) => {
        
        expect(body.topics).toBeInstanceOf(Array);
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
  test("404: Responds with an error if endpoint is not available in topics", () => {
    return request(app)
      .get("/api/nope")
      .expect(404)
      .then(({body}) => {
        expect(body.error).toBe("Endpoint not found");
      });
  });
});

describe("GET /api/articles/:articles_id", () => {
  test("200: Should respond with the correct article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({body}) => {
        expect(body.articles).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("404: Responds with an error if the id is not available in articles", () => {
    return request(app)
      .get("/api/articles/200")
      .expect(500)
      .then(({body}) => {
        expect(body.error).toBe("Internal Server Error");
      });
  });

  test("404: Responds with error if the id is invalid in articles", () => {
    return request(app)
      .get("/api/articles/letter")
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad Request - Invalid ID type");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBeGreaterThan(1);
        expect(body.articles.length).toBe(13)
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            author: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("200: Responds with articles  sorted by date in descending order by defult", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("200: Responds with articles sorted by date in descending order when specified", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=desc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with all comments on an article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
        body.comments.forEach((comment) => {
          
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
        
        expect(body.comments[0]).toEqual({
        
          comment_id: 5,
          votes: 0,
          created_at: "2020-11-03T21:00:00.000Z",
          author: "icellusedkars",
          body: "I hate streaming noses",
          article_id: 1,
        });
      });
  });
  test("404: Responds with an error if the article does not exist", () => {
    return request(app)
      .get("/api/articles/1444/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("Article not found");
      });
  });
  test("400: Responds with an error if the id is invalid type of data", () => {
    return request(app)
      .get("/api/articles/letter/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request - Invalid ID type");
      });
  });
  test("200: Responds with an empty array if the article exists but does not have comments", () => {
  return request(app)
  .get("/api/articles/7/comments")
  .expect(200)
  .then(({ body }) => {
    expect(body.comments).toEqual([]);
  });
});
});


describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the comment added", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        "username": "icellusedkars",
        "body": "Hey buy&hold."
      })
      .expect(201)  
      .then(({body}) => {
        expect(body.comment).toBeDefined();  
        expect(body.comment.comment_id).toBe(19);  
        expect(body.comment.author).toBe("icellusedkars");  
        expect(body.comment.body).toBe("Hey buy&hold.");  
      });
  });
  test("400: Responds with an error if the username is missing", () => {
    return request(app)
      .post("/api/articles/1/comments") 
      .send({
        "body": "Hey buy&hold." 
      })
      .expect(400) 
      .then(({body}) => {
        expect(body.error).toBe('Bad Request'); 
      });
  });
  test("400: Responds with an error if the body is missing", () => {
    return request(app)
      .post("/api/articles/1/comments") 
      .send({

        "username": "icellusedkars",
          
      })
      .expect(400) 
      .then(({body}) => {
        expect(body.error).toBe('Bad Request'); 
      });
  });
  test("400: Responds with an error when data is not passed", () => {
    return request(app)
      .post("/api/articles/1/comments") 
      .send({
      
      })
      .expect(400) 
      .then(({body}) => {
        expect(body.error).toBe('Bad Request'); 
      });
  });
  test("400: Responds with an error when the id is invalid", () => {
    return request(app)
      .post("/api/articles/wrong/comments") 
      .send({
          "username": "icellusedkars",
        "body": "Hey buy&hold."
      })
      .expect(400) 
      .then(({body}) => {
        expect(body.msg).toBe('Bad Request - Invalid ID type'); 
      });
  });
  test("400: Responds with an error when the id is valid but non-existent on article_id", () => {
    return request(app)
      .post("/api/articles/12358/comments") 
      .send({
          "username": "icellusedkars",
          "body": "Hey buy&hold."
      })
      .expect(404) 
      .then(({body}) => {
      
        expect(body.error).toBe('Article not found'); 
      });
  });
});


describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with the article and vote updated", () => {
  return request(app)
  .patch("/api/articles/1")
  .send({
    inc_votes : 50
  })
  .expect(200)
  .then(({body}) => {    
    
    expect(body.article.votes).toBe(150)
    expect(body.article).toEqual(
    expect.objectContaining({
      article_id: expect.any(Number),
      title: expect.any(String),
      topic: expect.any(String),
      author: expect.any(String),
      body: expect.any(String),
      created_at: expect.any(String),
      votes: expect.any(Number),
      article_img_url: expect.any(String),
    })
  );
  });
});
test("200: Responds with the article and vote updated when the vote is negative", () => {
  return request(app)
  .patch("/api/articles/1")
  .send({
    inc_votes : -40
  })
  .expect(200)
  .then(({body}) => {    

    expect(body.article.votes).toBe(60)
    expect(body.article).toEqual(
    expect.objectContaining({
      article_id: expect.any(Number),
      title: expect.any(String),
      topic: expect.any(String),
      author: expect.any(String),
      body: expect.any(String),
      created_at: expect.any(String),
      votes: expect.any(Number),
      article_img_url: expect.any(String),
    })
  );
  });
});

test("404: Responds with an error when the id is not available", () => {
  return request(app)
  .patch("/api/articles/1000")
  .send({
    inc_votes : 5
  })
  .expect(404)
  .then(({body}) => {   
      expect(body.error).toBe('Article not found')
  });
});
test("400: Responds with an error when vote is not a number but the id exist", () => {
  return request(app)
  .patch("/api/articles/1")
  .send({
    inc_votes : 'letter'
  })
  .expect(400)
  .then(({body}) => {   
    
      expect(body.error).toBe('Bad Request')
  });
});
test("400: Responds with an error when vote is empty", () => {
  return request(app)
  .patch("/api/articles/1")
  .send({})
  .expect(400)
  .then(({body}) => {   
    
      expect(body.error).toBe('Bad Request')
  });
});
});


describe(`DELETE /api/comments/comment_id`, () => {
 test("204: Responds with the correct status for successful", () => {
 return request(app)
 .delete('/api/comments/1')
 .expect(204)
});
test("404: Responds with error when comment_id does not exist", () => {
  return request(app)
  .delete('/api/comments/1235812')
  .expect(404)
  .then(({body}) => {
   
    expect(body.error).toBe('Comment not found')
  });
});
test("404:Responde with an error when comment_id is invalid type of data", () => {
  return request(app)
  .delete("/api/comments/hey")
  .expect(400)
  .then(({body}) => {
     expect(body.msg).toBe('Bad Request - Invalid ID type')
  });
})
});


describe("GET /api/users ", () => {
 test("200: Responds with the list of all users", () => {
   return request(app)
   .get('/api/users')
   .expect(200)
   .then(({body}) => {
     expect(body.users).toHaveLength(4);

     const usersDb = [
      {
        username: "butter_bridge",
        name: "jonny",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
      {
        username: "icellusedkars",
        name: "sam",
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      },
      {
        username: "rogersop",
        name: "paul",
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
      },
      {
        username: "lurker",
        name: "do_nothing",
        avatar_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
      },
    ];
       
    usersDb.forEach(user => {
       
      expect(body.users).toContainEqual(user)

    });
  
   });
 });
 test("404: Responds with an error if endpoint is not available in users ", () => {
    return request(app)
    .get("/api/ctbnoom")
    .expect(404)
    .then(({body}) => {
      
      expect(body.error).toBe("Endpoint not found")
    });
 });
});