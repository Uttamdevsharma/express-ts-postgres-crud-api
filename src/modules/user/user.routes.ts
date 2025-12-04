
import express, { Request, Response } from 'express'
import { pool } from '../../config/db'
import { userController } from './user.controller'

const router = express.Router()

//modular ->  routes -> controllers - > service (business logic)

//post a user
router.post("/",userController.createUser)

//get all user
router.get("/",userController.getAllUser)

export const userRoutes =router