import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index'; 
import { User } from '../models/User.Model';

chai.use(chaiHttp);
const should = chai.should();

describe('User API', () => {
  beforeEach(async () => {
    // Clear the Users table before each test
    await User.destroy({ where: {} });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const res = await chai.request(app)
        .post('/api/users')
        .send({ name: 'testUser', phone_number: '1234567890' });

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('success').eql(true);
      res.body.should.have.property('message').eql('USER CREATED SUCCESSFULLY');
      res.body.should.have.property('user');
      res.body.user.should.have.property('id');
      res.body.user.should.have.property('name').eql('testUser');
      res.body.user.should.have.property('phone_number').eql('1234567890');
    });
  });

  describe('POST /api/users/generateOTP', () => {
    it('should generate an OTP for an existing user', async () => {
      // Create a user first
      const user = await User.create({ name: 'testUser', phone_number: '1234567890' });

      const res = await chai.request(app)
        .post('/api/users/generateOTP')
        .send({ phone_number: '1234567890' });

      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('success').eql(true);
      res.body.should.have.property('message').eql('OTP GENERATED SUCCESSFULLY');
      res.body.should.have.property('phone_number').eql('1234567890');
      res.body.should.have.property('otp');
    });
  });
});
