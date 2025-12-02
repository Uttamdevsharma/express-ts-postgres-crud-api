import express, { Request, Response } from "express"
const app = express()
const port = 5000


//middleware
app.use(express.json())

app.get('/', (req:Request, res:Response) => {
  res.send('Full Stack Developer!')
})

app.post('/',(req,res) => {
  const result = req.body
  console.log(result)

  res.send({
    message : "successfully",
    result
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
