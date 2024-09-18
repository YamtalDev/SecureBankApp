import {Request, Response} from "express";
import {random, authentication} from "../utils/encrypt";
import {createUser,deleteUserById, updateUserById, getUserByEmail,getUserById,getUsers} from "../db/db.query";

/******************************************************************************
 * @description: Registers a new user.
 * @returns: A JSON response with the created user object or an error message.
******************************************************************************/
export const registerUser = async (req: Request, res: Response) =>
{
    try
    {
        const {name, email, country, city, salary, id} = req.body;
        if(!email || !name || !country || !city || !salary || !id)
        {
            return (res.sendStatus(406).json({error: "All fields required"}));
        }

        const existingUser = await getUserByEmail(email);
        if(existingUser)
        {
            return (res.status(409).json({error: "User already exists"}));
        }
        
        const salt = random();
        const user = await createUser({
            name, email, country, city, salary, 
            authentication: {salt, id: authentication(salt, id)}
        });
        
        return (res.status(201).json(user).end());
    }
    catch(error)
    {
        console.error(error.message);
        res.status(500).json({error: "Error creating user"});
    }
}
/******************************************************************************
 * @description: Retrieves all users from the database.
 * @returns: A JSON response with the deleted user object or an error message.
******************************************************************************/
export const getAllUsers = async (req: Request, res: Response) =>
{
    try
    {
        const users = await getUsers();
        return (res.status(200).json(users));
    }
    catch(error)
    {
        console.log(error.message);
        return (res.sendStatus(500).json({error: "Error accessing users"}));
    }
}
/******************************************************************************
 * @description: Retrieves a user by their ID.
 * @returns: A JSON response with the deleted user object or an error message.
******************************************************************************/
export const getUser = async (req: Request, res: Response) =>
{
    try
    {
        const {id} = req.params;
        const user = await getUserById(id);
        if(!user)
        {
            return (res.status(404).json({ error: "User not found" }));
        }

        return (res.status(200).json(user));
    }
    catch(error)
    {
        console.log(error.message);
        return (res.sendStatus(500).json({error: "Error accessing users"}));
    }
}
/******************************************************************************
 * @description: Deletes a user by their ID.
 * @returns: A JSON response with the deleted user object or an error message.
******************************************************************************/
export const deleteUser = async (req: Request, res: Response) =>
{
    try
    {
        const {id} = req.params;
        const deletedUser = await deleteUserById(id);
        return (res.status(201).json(deletedUser));
    }
    catch(error)
    {
        console.log(error.message);
        return (res.sendStatus(500).json({error: "Error deleting user"}));
    }
}
/******************************************************************************
 * @description Updates a user's information by their ID.
 * @returns A JSON response with the updated user object or an error message.
******************************************************************************/
export const updateUser = async (req: Request, res: Response) =>
{
    try
    {
        const {id} = req.params;
        const {name} = req.body;

        if(!name)
        {
            return res.status(400).json({ error: "A name must be provided" });
        }
  
        const updatedUser = await updateUserById(id, { name });
        if(!updatedUser)
        {
            return (res.status(404).json({ error: "User not found" }));
        }
  
        return (res.status(202).json(updatedUser));
    }
    catch(error)
    {
        console.error(error.message);
        return (res.status(500).json({ error: "Error updating user" }));
    }
}