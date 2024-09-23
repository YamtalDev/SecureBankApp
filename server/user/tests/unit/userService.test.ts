import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import User from '../../src/models/User';
import * as userServices from '../../src/services/userServices';

const mockUserData = {
  email: 'test@example.com',
  password: 'Password123!',
  phoneNumber: '+123456789',
};

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe('User Service - createUserService', () => {
  it('should create a new user', async () => {
    const user = await userServices.createUserService(mockUserData);

    expect(user.email).toBe(mockUserData.email);
    expect(user.phoneNumber).toBe(mockUserData.phoneNumber);
    expect(user.isVerified).toBe(false);
    expect(user.balance).toBe(0);
  });

  it('should throw error if email is already in use', async () => {
    await userServices.createUserService(mockUserData);

    await expect(userServices.createUserService(mockUserData)).rejects.toThrow('Email already in use.');
  });
});

describe('User Service - getUserByIdService', () => {
  it('should retrieve a user by ID', async () => {
    const createdUser = await userServices.createUserService(mockUserData);
    const user = await userServices.getUserByIdService(createdUser._id.toString());

    expect(user?.email).toBe(mockUserData.email);
    expect(user?.phoneNumber).toBe(mockUserData.phoneNumber);
    expect(user?.isVerified).toBe(false);
    expect(user?.balance).toBe(0);
  });

  it('should throw an error if user is not found', async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    await expect(userServices.getUserByIdService(nonExistentId)).rejects.toThrow('User not found.');
  });
});

describe('User Service - updateUserService', () => {
  it('should update an existing user', async () => {
    const createdUser = await userServices.createUserService(mockUserData);
    const updatedData = {
      email: 'updated@example.com',
      password: 'New123!',
      phoneNumber: '+12345678',
    };

    const updatedUser = await userServices.updateUserService(createdUser._id.toString(), updatedData);
    expect(updatedUser?.email).toBe(updatedData.email);
    expect(updatedUser?.phoneNumber).toBe(updatedData.phoneNumber);
  });

  it('should throw an error if user is not found for update', async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    const updatedData = {
      email: 'updated@example.com',
      password: 'New123!',
      phoneNumber: '+12345678',
    };
    await expect(userServices.updateUserService(nonExistentId, updatedData)).rejects.toThrow('User not found.');
  });
});

describe('User Service - deleteUserService', () => {
  it('should delete an existing user', async () => {
    const createdUser = await userServices.createUserService(mockUserData);
    const deletedUser = await userServices.deleteUserService(createdUser._id.toString());

    expect(deletedUser?.email).toBe(mockUserData.email);
    const foundUser = await User.findById(createdUser._id);
    expect(foundUser).toBeNull();
  });

  it('should throw an error if user is not found for deletion', async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    await expect(userServices.deleteUserService(nonExistentId)).rejects.toThrow('User not found.');
  });
});

describe('User Service - patchUserBalanceService', () => {
  it('should update the user balance', async () => {
    const createdUser = await userServices.createUserService(mockUserData);
    const patchData = { amount: 100 };
    const updatedUser = await userServices.patchUserBalanceService(createdUser._id.toString(), patchData);

    expect(updatedUser?.balance).toBe(100);
  });

  it('should throw an error if user is not found for balance update', async () => {
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    const patchData = { amount: 100 };
    await expect(userServices.patchUserBalanceService(nonExistentId, patchData)).rejects.toThrow('User not found.');
  });
});
