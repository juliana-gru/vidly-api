const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie');
const mongoose = require('mongoose');
const request = require('supertest');
const moment = require('moment');
// const { genreSchema } = require('../../models/genre');


describe('/api/returns', () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;
  let movie;

  beforeEach(async () => {
    server = require('../../index');
   
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345', //min chars = 5
        phone: '12345' //min chars = 5
      },
      movie: {
        _id: movieId,
        title: '123', //min chars = 3
        dailyRentalRate: 2
      }
    });
    await rental.save();

    movie = new Movie({
      _id: movieId,
      title: '123',
      genre: { name: '12345' },
      numberInStock: 10,
      dailyRentalRate: 2
    });
    await movie.save();
  });

  afterEach(async () => { 
    await Rental.remove({});
    await Movie.remove({});
    await server.close();
  });
  
  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId }); 
  }

  it('should return 401 if  client is not logged in', async () => {
    token = ''; 

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400 if customerId is not provided', async () => {    
    customerId = null; 

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 400 if movieId is not provided', async () => {    
    movieId = null; 

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 404 if no rental found for this customer/movie', async () => {  
    await Rental.remove({});
    
    const res = await exec();

    expect(res.status).toBe(404);
  });

  it('should return 400 if the rental was already processed', async () => {  
    rental.dateReturned = new Date();
    await rental.save();
    
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 200 if it is a valid request', async () => {   
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it('should set the returnedDate if input is valid', async () => {   
    
    rental.dateOut = moment().add(-7, 'days').toDate();
    await rental.save();
    
    await exec();
    
    const rentalInDb = await Rental.findById(rental._id);    
    expect(rentalInDb.rentalFee).toBe(14); // 7days * 2 rentalfee
  });

  it('should increase the stock of the movie if input is valid', async () => {   
    await exec();
       
    const movieInDb = await Movie.findById(movieId); 
    
    // console.log(movieInDb);
    
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1); 
  });

  it('should return the rental if input is valid', async () => {   
    const res = await exec();   
    
    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining(
        ['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie']
      ));
  });
});