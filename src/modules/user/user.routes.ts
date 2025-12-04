
import express, { Request, Response } from 'express'
import { pool } from '../../config/db'

const router = express.Router()

//post a user
router.post("/",async(req, res) => {
  const {name,email} = req.body

  try{

    const result = await pool.query(
      `INSERT INTO users(name,email) VALUES($1, $2) RETURNING *`,[name,email]
    )

    res.status(200).send({
      success : true,
      message : "Data Inserted Successfully",
      data : result.rows[0]

    })

  }catch(err:any){
    res.status(500).json({
      success:false,
      message : err.message
    })
  }
})

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