import request from 'supertest';
import { Express } from 'express';
import mongoose from 'mongoose';
import startServer from '../../src/index';
import { Types } from 'mongoose';

let app: Express;

beforeAll(async () => {
  app = await startServer();
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect('mongodb://localhost:27017/yourTestDb');
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase(); // Clear the test DB after the tests
  await mongoose.disconnect();
  jest.resetModules();
});

describe('User Routes', () => {
  const mockUserData = {
    _id: new Types.ObjectId(),
    email: 'test@example.com',
    password: 'Password123!',
    phoneNumber: '+123456789',
    isVerified: false,
    balance: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateUserDTO = {
    email: 'test@example.com',
    password: 'Password123!',
    phoneNumber: '+123456789',
  };

  const updateData = {
    email: 'updated@example.com',
    password: '!Password@1234',
    phoneNumber: '+934563476',
  };

  afterEach(async () => {
    jest.clearAllMocks();
    
    // Check if the connection is established before attempting to clean up
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      await mongoose.connection.db.collection('users').deleteMany({}); // Clean up users after each test
    }
  });

  describe('POST /api/users', () => {
    it('should create a new user with valid input', async () => {
      const response = await request(app)
        .post('/api/users')
        .send(mockCreateUserDTO);

      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe(mockUserData.email);
    });

    it('should return 400 if email is invalid', async () => {
      const invalidDTO = { ...mockCreateUserDTO, email: 'invalid-email' };

      const response = await request(app)
        .post('/api/users')
        .send(invalidDTO);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid email format');
    });

    it('should return 400 if password is too short', async () => {
      const invalidDTO = { ...mockCreateUserDTO, password: 'abc' };

      const response = await request(app)
        .post('/api/users')
        .send(invalidDTO);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Must be at least 6 characters long');
    });

    it('should return 400 if password is missing uppercase letters', async () => {
      const invalidDTO = { ...mockCreateUserDTO, password: 'abc!sdf56' };

      const response = await request(app)
        .post('/api/users')
        .send(invalidDTO);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Must contain at least one uppercase letter');
    });

    it('should return 500 if there is a database error', async () => {
      // Simulate a database error by shutting down the DB or mocking a failure
      await mongoose.disconnect();  // Simulate DB disconnection for this test

      const response = await request(app)
        .post('/api/users')
        .send(mockCreateUserDTO);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error.');

      // Reconnect for future tests
      await mongoose.connect('mongodb://localhost:27017/yourTestDb');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should retrieve a user by ID', async () => {
      await mongoose.disconnect();
      const response = await request(app).get(`/api/users/${mockUserData._id.toString()}`);

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe(mockUserData.email);
    });

    it('should return 404 if user is not found', async () => {
      const response = await request(app).get('/api/users/507f191e810c19729de860ec');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found.');
    });

    it('should return 400 if user ID is invalid', async () => {
      const response = await request(app).get('/api/users/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid user ID format');
    });
  });

  describe('GET /api/users', () => {
    it('should retrieve all users', async () => {
      const response = await request(app).get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body.users).toBeInstanceOf(Array);
    });

    it('should return 500 if fetching users fails', async () => {
      // Simulate database disconnection
      await mongoose.disconnect();

      const response = await request(app).get('/api/users');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error.');

      // Reconnect for further tests
      await mongoose.connect('mongodb://localhost:27017/yourTestDb');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update an existing user', async () => {
      const response = await request(app)
        .put(`/api/users/${mockUserData._id.toString()}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe(updateData.email);
    });

    it('should return 404 if user is not found for update', async () => {
      const response = await request(app)
        .put('/api/users/507f191e810c19729de860ef')
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found.');
    });

    it('should return 400 if invalid data is provided for update', async () => {
      const invalidUpdateData = { ...updateData, email: 'invalid-email' };

      const response = await request(app)
        .put(`/api/users/${mockUserData._id.toString()}`)
        .send(invalidUpdateData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid email format');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete an existing user', async () => {
      const response = await request(app).delete(`/api/users/${mockUserData._id.toString()}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User deleted successfully.');
    });

    it('should return 404 if user is not found for deletion', async () => {
      const response = await request(app).delete('/api/users/507f191e810c19729de860ec');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found.');
    });

    it('should return 400 if invalid user ID is provided for deletion', async () => {
      const response = await request(app).delete('/api/users/invalid-id');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid user ID format');
    });
  });

  describe('PATCH /api/users/:id', () => {
    const patchData = { amount: 100 };

    it('should update the user balance', async () => {
      const response = await request(app)
        .patch(`/api/users/${mockUserData._id.toString()}`)
        .send(patchData);

      expect(response.status).toBe(200);
      expect(response.body.user.balance).toBe(mockUserData.balance + patchData.amount);
    });

    it('should return 404 if user is not found for balance update', async () => {
      const response = await request(app)
        .patch('/api/users/507f191e810c19729de86045')
        .send(patchData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found.');
    });

    it('should return 400 if user id is not valid', async () => {
      const response = await request(app)
        .patch('/api/users/507f191e810c')
        .send(patchData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid user ID format');
    });

    it('should return 400 if invalid balance amount is provided', async () => {
      const invalidPatchData = { amount: 'invalid-amount' };

      const response = await request(app)
        .patch(`/api/users/${mockUserData._id.toString()}`)
        .send(invalidPatchData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Amount must be a valid number');
    });

    it('should return 400 if no balance amount is provided', async () => {
      const emptyPatchData = { };

      const response = await request(app)
        .patch(`/api/users/${mockUserData._id.toString()}`)
        .send(emptyPatchData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Amount is required, Amount must be a valid number');
    });
  });
});
