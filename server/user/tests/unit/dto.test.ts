import { UserRequestDTO } from '../../src/dto/UserRequestDTO';
import { PatchRequestDTO } from '../../src/dto/PatchRequestDTO';
import { UpdateRequestDTO } from '../../src/dto/UpdateRequestDTO';
import { toUserDTO, UserDTO } from '../../src/dto/UserResponseDTO';
import { IUser } from '../../src/interfaces/IUser';
import { Types } from 'mongoose'; // To use ObjectId for mock _id

describe('DTO Module', () => {
  describe('PatchRequestDTO', () => {
    it('should create PatchRequestDTO with amount', () => {
      const patchData: PatchRequestDTO = { amount: 100 };
      expect(patchData.amount).toBe(100);
    });
  });

  describe('UpdateRequestDTO', () => {
    it('should create UpdateRequestDTO with partial fields', () => {
      const updateData: UpdateRequestDTO = { email: 'test@example.com', phoneNumber: '+123456789' };
      expect(updateData.email).toBe('test@example.com');
      expect(updateData.phoneNumber).toBe('+123456789');
    });

    it('should handle missing fields in UpdateRequestDTO', () => {
      const updateData: UpdateRequestDTO = {};
      expect(updateData.email).toBeUndefined();
      expect(updateData.password).toBeUndefined();
      expect(updateData.phoneNumber).toBeUndefined();
    });
  });

  describe('UserRequestDTO', () => {
    it('should create UserRequestDTO with required fields', () => {
      const userData: UserRequestDTO = {
        email: 'test@example.com',
        password: 'Password123!',
        phoneNumber: '+123456789',
      };
      expect(userData.email).toBe('test@example.com');
      expect(userData.password).toBe('Password123!');
      expect(userData.phoneNumber).toBe('+123456789');
    });
  });

  describe('UserResponseDTO', () => {
    it('should convert IUser to UserDTO', () => {
      const mockUser: Partial<IUser> = {
        _id: new Types.ObjectId(),
        email: 'test@example.com',
        password: 'Password123!',
        phoneNumber: '+123456789',
        isVerified: true,
        balance: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const userDTO: UserDTO = toUserDTO(mockUser as IUser);

      expect(userDTO.id).toBe(mockUser._id?.toString());
      expect(userDTO.email).toBe('test@example.com');
      expect(userDTO.phoneNumber).toBe('+123456789');
      expect(userDTO.isVerified).toBe(true);
      expect(userDTO.balance).toBe(1000);
    });

    it('should handle missing optional fields in IUser when converting to UserDTO', () => {
      const mockUser: Partial<IUser> = {
        _id: new Types.ObjectId(),
        email: 'test@example.com',
        password: 'Password123!',
        phoneNumber: '+123456789',
        // `isVerified` is missing
        balance: 1000,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const userDTO: UserDTO = toUserDTO(mockUser as IUser);

      expect(userDTO.isVerified).toBe(false); // Default to false
    });
  });
});
