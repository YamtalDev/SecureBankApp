import request from 'supertest';
import { Express } from 'express';
import mongoose from 'mongoose';
import createError from 'http-errors';
import startServer from '../../src/index';
import * as userServices from '../../src/services/userServices';
import { IUser } from '../../src/interfaces/IUser';
import { Types } from 'mongoose'; // Import Types for ObjectId

jest.mock('../../src/services/userServices'); // Mock the service layer

// Mock the logger to avoid cluttering the test output
jest.mock('../../src/config/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

let app: Express;

beforeAll(async () => {
  // Call the startServer function to get the app for testing
  app = await startServer();
});

afterAll(async () => {
  await mongoose.disconnect();  // Close the MongoDB connection
  jest.resetModules();
});

describe('User Controller', () => {
  const mockUserData: Partial<IUser> = {
    _id: new Types.ObjectId(),
    email: 'test@example.com',
    password: 'hashedPassword123!',
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      (userServices.createUserService as jest.Mock).mockResolvedValue(mockUserData as IUser);
    
      const response = await request(app)
        .post('/api/users')
        .send(mockCreateUserDTO);
    
      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe(mockUserData.email);
      expect(userServices.createUserService).toHaveBeenCalledWith(mockCreateUserDTO);
    });

    it('should return 400 if email is already in use', async () => {
      (userServices.createUserService as jest.Mock).mockRejectedValue(createError(400, 'Email already in use'));
    
      const response = await request(app)
        .post('/api/users')
        .send(mockCreateUserDTO);
    
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email already in use');
    });

    it('should return 400 if required email is invalid', async () => {
      const invalidDTO = { ...mockCreateUserDTO, email: 'invalid-email'};
    
      const response = await request(app)
        .post('/api/users')
        .send(invalidDTO);
    
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid email format');
    });

    it('should return 400 if required password is invalid', async () => {
      const invalidDTO = { ...mockCreateUserDTO, password: ''};
    
      const response = await request(app)
        .post('/api/users')
        .send(invalidDTO);
    
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Password is required');
    });

    it('should return 400 if required password is to short', async () => {
      const invalidDTO = { ...mockCreateUserDTO, password: 'abc'};
    
      const response = await request(app)
        .post('/api/users')
        .send(invalidDTO);
    
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Must be at least 6 characters long');
    });

    it('should return 400 if required password is missing uppercase letters', async () => {
      const invalidDTO = { ...mockCreateUserDTO, password: 'abc!sdf56'};
    
      const response = await request(app)
        .post('/api/users')
        .send(invalidDTO);
    
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Must contain at least one uppercase letter');
    });

    it('should return 500 if a database error occurs', async () => {
      (userServices.createUserService as jest.Mock).mockRejectedValue(new Error('Database connection error'));
    
      const response = await request(app)
        .post('/api/users')
        .send(mockCreateUserDTO);
    
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error.');
    });

    it('should return 400 if the password is too weak', async () => {
      const weakPasswordDTO = { ...mockCreateUserDTO, password: '123' };  // Weak password
    
      const response = await request(app)
        .post('/api/users')
        .send(weakPasswordDTO);
    
      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Password is too weak');
    });

  });

  describe('GET /api/users/:id', () => {
    it('should retrieve a user by ID', async () => {
      (userServices.getUserByIdService as jest.Mock).mockResolvedValue(mockUserData as IUser);

      const response = await request(app).get(`/api/users/${mockUserData._id?.toString()}`);

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe(mockUserData.email);
      expect(userServices.getUserByIdService).toHaveBeenCalledWith(mockUserData._id?.toString());
    });

    it('should return an error if user is not found', async () => {
      (userServices.getUserByIdService as jest.Mock).mockRejectedValue(new Error('User not found'));

      const response = await request(app).get('/api/users/507f191e810c19729de860ec');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error.');
    });
  });

  describe('GET /api/users', () => {
    it('should retrieve all users', async () => {
      (userServices.getAllUsersService as jest.Mock).mockResolvedValue([mockUserData as IUser]);

      const response = await request(app).get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body.users[0].email).toBe(mockUserData.email);
      expect(userServices.getAllUsersService).toHaveBeenCalled();
    });

    it('should return an error if fetching users fails', async () => {
      (userServices.getAllUsersService as jest.Mock).mockRejectedValue(new Error('Failed to retrieve users'));

      const response = await request(app).get('/api/users');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error.');
    });
  });

  describe('PUT /api/users/:id', () => {
    const updateData = {
      email: 'updated@example.com',
      password: '!Password@1234',
      phoneNumber: '+934563476'
    };

    it('should update an existing user', async () => {
      const updatedUser = { ...mockUserData, ...updateData };
      (userServices.updateUserService as jest.Mock).mockResolvedValue(updatedUser as IUser);

      const response = await request(app)
        .put(`/api/users/${mockUserData._id?.toString()}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe(updatedUser.email);
      expect(userServices.updateUserService).toHaveBeenCalledWith(mockUserData._id?.toString(), updateData);
    });

    it('should return an error if user is not found for update', async () => {
      (userServices.updateUserService as jest.Mock).mockRejectedValue(createError(404, 'User not found'));

      const response = await request(app)
        .put(`/api/users/507f191e810c19729de860ef`)
        .send(updateData);

      expect(response.status).toBe(404);  // Ensure it returns 404
      expect(response.body.message).toBe('User not found.');  // Error message should match
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete an existing user', async () => {
      (userServices.deleteUserService as jest.Mock).mockResolvedValue(mockUserData as IUser);

      const response = await request(app).delete(`/api/users/${mockUserData._id?.toString()}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User deleted successfully.');
      expect(userServices.deleteUserService).toHaveBeenCalledWith(mockUserData._id?.toString());
    });

    it('should return an error if user is not found for deletion', async () => {
      (userServices.deleteUserService as jest.Mock).mockRejectedValue(new Error('User not found'));

      const response = await request(app).delete('/api/users/507f191e810c19729de860ec');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error.');
    });
  });

  describe('PATCH /api/users/:id', () => {
    const patchData = { amount: 100 };

    it('should update the user balance', async () => {
      const updatedUser = { ...mockUserData, balance: (mockUserData.balance || 0) + patchData.amount };
      (userServices.patchUserBalanceService as jest.Mock).mockResolvedValue(updatedUser as IUser);

      const response = await request(app)
        .patch(`/api/users/${mockUserData._id?.toString()}`)
        .send(patchData);

      expect(response.status).toBe(200);
      expect(response.body.user.balance).toBe(updatedUser.balance);
      expect(userServices.patchUserBalanceService).toHaveBeenCalledWith(mockUserData._id?.toString(), patchData);
    });

    it('should return an error if user is not found for balance update', async () => {
      (userServices.patchUserBalanceService as jest.Mock).mockRejectedValue(new Error('User not found'));

      const response = await request(app)
        .patch('/api/users/507f191e810c19729de860ec')
        .send(patchData);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error.');
    });
  });
});
