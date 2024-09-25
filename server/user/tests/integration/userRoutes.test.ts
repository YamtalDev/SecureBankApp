import mongoose from 'mongoose';
import request from 'supertest';
import { Types } from 'mongoose';
import { Express } from 'express';
import { config } from '../../src/config/config'

import startServer from '../../src/index';

let app: Express;

async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect('mongodb://localhost:27017/yourTestDb');
    } catch (err) {
      throw err;
    }
  }
}

beforeAll(async () => {
  app = await startServer();
  await connectToDatabase();
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
});

beforeEach(async () => {
  if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
    await mongoose.connection.db.collection('users').deleteMany({});
  }
});

afterEach(async () => {
  jest.clearAllMocks();
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

  async function createMockUser() {
    return await request(app)
      .post('/api/users')
      .send(mockCreateUserDTO);
  }

  describe('POST /api/users', () => {
    it('should create a new user with valid input', async () => {
      const response = await request(app)
        .post('/api/users')
        .send(mockCreateUserDTO);

      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe(mockUserData.email);
      expect(response.body.user.phoneNumber).toBe(mockUserData.phoneNumber);
      expect(response.body.user.isVerified).toBe(mockUserData.isVerified);
      expect(response.body.user.balance).toBe(mockUserData.balance);
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

    it('should return 400 if password is missing spacial characters', async () => {
      const invalidDTO = { ...mockCreateUserDTO, password: 'abAcsdf56' };

      const response = await request(app)
        .post('/api/users')
        .send(invalidDTO);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Must contain at least one special character `!, @, $`');
    });

    it('should return 400 if password is missing lower case letters', async () => {
      const invalidDTO = { ...mockCreateUserDTO, password: 'AABD!56' };

      const response = await request(app)
        .post('/api/users')
        .send(invalidDTO);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Must contain at least one lowercase letter');
    });

    it('should return 400 if password is missing digit', async () => {
      const invalidDTO = { ...mockCreateUserDTO, password: 'AABD!aaa' };

      const response = await request(app)
        .post('/api/users')
        .send(invalidDTO);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Must contain at least one digit');
    });

    it('should return 500 if there is a database error', async () => {
      await mongoose.disconnect();
    
      const response = await request(app).post('/api/users').send(mockCreateUserDTO);
    
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error.');
    
      await mongoose.connect('mongodb://localhost:27017/yourTestDb');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should retrieve a user by ID', async () => {
      const createdUser = await createMockUser();
      const response = await request(app).get(`/api/users/${createdUser.body.user.id.toString()}`);

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe(mockUserData.email);
      expect(response.body.user.phoneNumber).toBe(mockUserData.phoneNumber);
      expect(response.body.user.isVerified).toBe(mockUserData.isVerified);
      expect(response.body.user.balance).toBe(mockUserData.balance);
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
    async function createUsers(count: number) {
      const users: { email: string; password: string; phoneNumber: string }[] = [];
      for (let i = 0; i < count; i++) {
        const user = {
          email: `user${i}@example.com`,
          password: 'Password123!',
          phoneNumber: `+123456789${i}`,
        };
        users.push(user);
        await request(app).post('/api/users').send(user);
      }
      return users;
    }
    
    it('should retrieve an empty list when there are no users', async () => {
      const response = await request(app).get('/api/users');
  
      expect(response.status).toBe(200);
      expect(response.body.users).toBeInstanceOf(Array);
      expect(response.body.users.length).toBe(0);
    });

    it('should retrieve all users when there are users in the database', async () => {
      const userCount = 10;
      const createdUsers = await createUsers(userCount);
      const response = await request(app).get('/api/users');
  
      expect(response.status).toBe(200);
      expect(response.body.users).toBeInstanceOf(Array);
      expect(response.body.users.length).toBe(userCount);
  
      createdUsers.forEach((createdUser, index) => {
        expect(response.body.users[index].email).toBe(createdUser.email);
      });
    });
  
  
    it('should return 500 if fetching users fails', async () => {
      await mongoose.disconnect();
      const response = await request(app).get('/api/users');
  
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to retrieve users.');
  
      await mongoose.connect('mongodb://localhost:27017/yourTestDb');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update an existing user', async () => {
      const createdUser = await createMockUser();

      const response = await request(app)
        .put(`/api/users/${createdUser.body.user.id.toString()}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe(updateData.email);
      expect(response.body.user.phoneNumber).toBe(updateData.phoneNumber);
    });

    it('should return 404 if user is not found for update', async () => {
      const response = await request(app)
        .put('/api/users/507f191e810c19729de860ef')
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found.');
    });

    it('should return 400 if invalid data is provided for update', async () => {
      const createdUser = await createMockUser();

      const invalidUpdateData = { ...updateData, email: 'invalid-email' };
      const response = await request(app)
        .put(`/api/users/${createdUser.body.user.id.toString()}`)
        .send(invalidUpdateData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid email format');
    });

    it('should return 400 if password is too short', async () => {
      const createdUser = await createMockUser();

      const invalidUpdateData = { ...updateData, password: 'abc' };

      const response = await request(app)
        .put(`/api/users/${createdUser.body.user.id.toString()}`)
        .send(invalidUpdateData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Must be at least 6 characters long');
    });

    it('should return 400 if password is missing uppercase letters', async () => {
      const createdUser = await createMockUser();

      const invalidUpdateData = { ...updateData, password: 'abc!sdf56' };

      const response = await request(app)
        .put(`/api/users/${createdUser.body.user.id.toString()}`)
        .send(invalidUpdateData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Must contain at least one uppercase letter');
    });

    it('should return 400 if password is missing spacial characters', async () => {
      const createdUser = await createMockUser();

      const invalidUpdateData = { ...updateData, password: 'abAcsdf56' };

      const response = await request(app)
        .put(`/api/users/${createdUser.body.user.id.toString()}`)
        .send(invalidUpdateData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Must contain at least one special character `!, @, $`');
    });

    it('should return 400 if password is missing lower case letters', async () => {
      const createdUser = await createMockUser();

      const invalidUpdateData = { ...updateData, password: 'AABD!56' };

      const response = await request(app)
        .put(`/api/users/${createdUser.body.user.id.toString()}`)
        .send(invalidUpdateData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Must contain at least one lowercase letter');
    });

    it('should return 400 if password is missing digit', async () => {
      const createdUser = await createMockUser();

      const invalidUpdateData = { ...updateData, password: 'AABD!aaa' };

      const response = await request(app)
        .put(`/api/users/${createdUser.body.user.id.toString()}`)
        .send(invalidUpdateData);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Must contain at least one digit');
    });

  });

  describe('DELETE /api/users/:id', () => {
    it('should delete an existing user', async () => {
      const createdUser = await createMockUser();

      const response = await request(app).delete(`/api/users/${createdUser.body.user.id.toString()}`);

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

    it('should update the user balance to positive 100', async () => {
      const createdUser = await createMockUser();

      const response = await request(app)
        .patch(`/api/users/${createdUser.body.user.id.toString()}`)
        .send(patchData);

      expect(response.status).toBe(200);
      expect(response.body.user.balance).toBe(mockUserData.balance + patchData.amount);
    });

    it('should update the user balance to negative 100', async () => {
      const createdUser = await createMockUser();

      patchData.amount = -100;
      const response = await request(app)
        .patch(`/api/users/${createdUser.body.user.id.toString()}`)
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
