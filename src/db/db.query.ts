import {UserModel} from "../schema/user.schema";

/******************************************************************************
 * @description: Retrieve all users from the MongoDB collection.
 * @returns: A promise that resolves to an array of user objects.
******************************************************************************/
export const getUsers = () => UserModel.find();

/******************************************************************************
 * @description: Retrieve a user by their ID.
 * @param id: The ID of the user.
 * @returns: A promise that resolves to the user object or null if not found.
******************************************************************************/
export const getUserById = (id: string) => UserModel.findById(id);

/******************************************************************************
 * @description: Retrieve a user by their email.
 * @param email: email - The email address of the user.
 * @returns: A promise that resolves to the user object or null if not found.
******************************************************************************/
export const getUserByEmail = (email: string) => UserModel.findOne({email});

/******************************************************************************
 * @description: Create a new user and save it to the MongoDB collection.
 * @param values: User data to be created.
 * @returns: A promise that resolves to the created user object.
******************************************************************************/
export const createUser = (values: Record<string, any>) => new UserModel(values)
.save().then((user) => user.toObject());

/******************************************************************************
 * @description: Delete a user by their ID.
 * @param id: The ID of the user to be deleted.
 * @returns: A promise that resolves to the deleted user object or null if not found.
******************************************************************************/
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id});

/******************************************************************************
 * @description: Update a user by their ID.
 * @param id: The ID of the user to be updated.
 * @param values: New user data.
 * @returns: A promise that resolves to the updated user object or null if not found.
******************************************************************************/
export const updateUserById = (id: string, values: Record<string, any>) => 
UserModel.findByIdAndUpdate(id, values);