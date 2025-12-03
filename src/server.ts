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


//users crud

// post user
app.post("/users", async(req, res) => {
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
});

//all user get
app.get("/users",async(req:Request,res:Response) => {
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

//single user get
app.get("/users/:id" , async(req:Request,res:Response) => {
  
  try{
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`,[req.params.id])

    if(result.rows.length === 0){
       res.status(404).json({
        success:false,
        message : "User not Found"
       })
    }else {
      res.status(200).json({
        success:true,
        message : "User fetched successfully",
        data : result.rows[0]
      })
    }
  }catch(err:any){
    res.status(500).json({
      success : false,
      message:err.message
    })
  }

})

//update 
app.put("/users/:id",async(req:Request,res:Response) => {
  const {name,email} = req.body
  try{
    const result = await pool.query(`UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`,
      [name,email,req.params.id]
    );

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

//delete
app.delete("/users/:id" , async(req:Request,res:Response) => {
  
  try{
    const result = await pool.query(`DELETE FROM users WHERE id = $1`,[req.params.id])

    if(result.rowCount === 0){
      console.log(result.rowCount)
       res.status(404).json({
        success:false,
        message : "User not Found"
       })
    }else {
      res.status(200).json({
        success:true,
        message : "User Deleted Succesfully",
        data : result.rows
      })
    }
  }catch(err:any){
    res.status(500).json({
      success : false,
      message:err.message
    })
  }

})




//todos crud
app.post("/todos", async(req, res) => {
  const {user_id,title} = req.body

  try{

    const result = await pool.query(
      `INSERT INTO todos(user_id,title) VALUES($1, $2) RETURNING *`,[user_id,title]
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
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
