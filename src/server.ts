import express, { Request, Response } from "express";
import { Pool } from "pg";
const app = express();
const port = 5000;
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path:path.join(process.cwd(),".env")})

const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`,
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    age INT,
    phone VARCHAR(15),
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    ) 
    `);
    // await pool.query('DROP TABLE IF EXISTS todos CASCADE');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos(
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT false,
        due_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)    

};

initDB();

//middleware
app.use(express.json());
// app.use(express.urlencoded()) //for FORM DATA

app.get("/", (req: Request, res: Response) => {
  res.send("Full Stack Developer!");
});

app.post("/users", (req, res) => {
  const {email,password} = req.body

  try{

    

  }catch(err:any){
    res.status(500).json({
      success:false,
      message : err.message
    })
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
