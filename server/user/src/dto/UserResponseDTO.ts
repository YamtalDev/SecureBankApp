import { IUser } from '../interfaces/IUser';

export interface UserDTO {
  id: string;
  email: string;
  phoneNumber: string;
  isVerified: boolean;
  balance: number;
}

export const toUserDTO = (user: IUser): UserDTO => {
  return {
    id: user._id.toString(),
    email: user.email,
    phoneNumber: user.phoneNumber,
    isVerified: user.isVerified ?? false,
    balance: user.balance ?? 0,
  };
};
