const mongoose = require('mongoose');
const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');

let server;
//When writing integration test, you should load the server before and close it after each test, otherwise you get an exception saying the server is already running.

describe('/api/genres', () => {
  beforeEach(() => {
    server = require('../../index');
  });

  afterEach(async () => { 
    server.close();
    await Genre.remove({});
  });
  
  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.collection.insertMany([
        { name: 'genre1' },
        { name: 'genre2' }
      ]);

      const res = await request(server).get('/api/genres');
      
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name = 'genre1')).toBeTruthy();
      expect(res.body.some(g => g.name = 'genre2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return a genre if valid id is passed', async () => {  
      const genre = new Genre({ name: 'Genre1' });
      await genre.save();

      const res = await request(server).get('/api/genres/' + genre._id);
        
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);      
    });
  
    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/genres/1');
  
      expect(res.status).toBe(404);
    });

    it('should return 404 if no genre with given id exists', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get('/api/genres/' + id);
  
      expect(res.status).toBe(404);
    });
  });
  
  describe('POST /', () => {

    //Mosh's Refactoring technique for clean tests

    //Define the happy path (the request that is succesful), and then in each test,
    // we change one parameter that clearly aligns with the name of the test.

    let token;
    let name;

    const exec = async () => {
      return await request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({ name }); //in ES6, if key and value are =, keep just key
    }

    beforeEach(() => {
      //Happy path
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it('should return 401 if client is not logged in', async () => {
      token = ''; //explicitly set the token to an invalid data

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if genre is less than 3 chars', async () => {            
      name = "12";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if genre is more than 50 chars', async () => {      
      name = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should save the genre is it is valid', async () => {
      await exec();

      const genre = await Genre.find({ name: 'genre1'});

      expect(genre).not.toBeNull();
    });

    it('should return the genre if it is valid', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1');
    });
  });
  
  describe('PUT /id' , () => {
    let token;
    let name;
    let genre;    

    const exec = async () => {
      return await request(server)
      .put('/api/genres/' + id)
      .set('x-auth-token', token)
      .send({ name }); //in ES6, if key and value are =, keep just key
    }

    // const createGenre = async () => {
    //   return await request(server)
    //   .post('/api/genres/')
    //   .set('x-auth-token', token)
    //   .send({ name }); //in ES6, if key and value are =, keep just key
    // }

    beforeEach(async () => {
      //Happy path
      genre = new Genre({ name: 'genre1' });
      await genre.save();

      token = new User().generateAuthToken();
      name = "genre1";
      id = genre._id;      
    });

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });
    
    it('should return 400 if genre is less than 3 characters', async () => {
      name = '12';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if genre is more than 50 characters', async () => {
      name = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 404 if id is invalid', async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if the given id does not match a gender', async () => {
      id = mongoose.Types.ObjectId(); 

      const res = await exec();
  
      expect(res.status).toBe(404);
    });

    it('should update the genre if input is valid', async () => {      
      name = 'updated';

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', name);
    });
  });

  describe('DELETE /id', () => {
    let token;
    let genre;
    let id;

    const exec = async () => {
      return await request(server)
      .delete('/api/genres/' + id)
      .set('x-auth-token', token)
      .send();      
    }

    beforeEach(async () => {
      genre = new Genre({ name: 'genre1' });
      await genre.save();
      
      id = genre._id; 
      token = new User({isAdmin: true}).generateAuthToken();           
    });

    it('should return 401 if client is not logged in', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 403 if the user is not an admin', async () => {
      token = new User({ isAdmin: false }).generateAuthToken(); 

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('should return 404 if id is invalid', async () => {
      id = 1; 
      
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should return 404 if genre not found', async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('should delete the genre if input is valid', async () => {
      await exec();

      const genreInDb = await Genre.findById(id);

      expect(genreInDb).toBeNull();
    });

    it('should return the removed genre', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id', genre._id.toHexString());
      expect(res.body).toHaveProperty('name', genre.name);
    });
  });
});