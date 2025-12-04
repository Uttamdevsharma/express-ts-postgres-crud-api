
import express, { Request, Response } from 'express'
import { pool } from '../../config/db'
import { userController } from './user.controller'

const router = express.Router()

//modular ->  routes -> controllers - > service (business logic)

//post a user
router.post("/",userController.createUser)

//get all user
router.get("/",async(req:Request,res:Response) => {
  try{
    const result = await pool.query(`SELECT * FROM users`);

    res.status(200).json({
      success:true,
      message:"successfully retrieved",
      data : result.rows
    })

  }catch(error:any){
    res.status(500).json({
      success:false,
      message:error.message
    })
  }
})

export const userRoutes =router