
import express, { Request, Response } from 'express'
import { pool } from '../../config/db'
import { userController } from './user.controller'

const router = express.Router()

//modular ->  routes -> controllers - > service (business logic)

//post a user
router.post("/",userController.createUser)

//get all user
router.get("/",userController.getAllUser)

//single user get
router.get("/:id" ,userController.getSingleUser )

//update a user
router.put("/:id", userController.updateUser)

router.delete("/:id" ,userController.deleteUser)

export const userRoutes =router