/******************************************************************************
 * @file routes.ts
 * @description Defines the API routes for user-related operations. 
 *
 * API Routes:
 * @POST        /api/users     : User Registration
 * @GET         /api/users     : Get All Users
 * @GET         /api/users/:id : Get a Specific User by ID
 * @PUT         /api/users/:id : Update a Specific User by ID
 * @DELETE      /api/users/:id : Delete a Specific User by ID
 ******************************************************************************/
import {Router} from "express";
import{registerUser, getAllUsers, getUser, updateUser, deleteUser} from "../controllers/user.controllers";

const router = Router();
router.post("/api/users", registerUser);
router.get("/api/users", getAllUsers);
router.get("/api/users/:id", getUser);
router.put("/api/users/:id", updateUser);
router.delete("/api/users/:id", deleteUser);

export default (router);
