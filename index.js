const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//middleware
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.igfrycv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const jobsCollection = client.db("jobsDb").collection('jobs');


    //add jobs
    app.post('/add-jobs', async(req, res)=>{
      const body = req.body;
      const result = await jobsCollection.insertOne(body);
      res.send(result);
    })
    //get-all-job
    app.get('/all-jobs', async(req, res)=>{
      const result = await jobsCollection.find().toArray();
      res.send(result);
    })
    //find-jobs-by-id
    app.get('/all-jobs/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const result = await jobsCollection.findOne(filter);
      res.send(result);
    })
    //update-job
    app.patch('/update-jobs/:id', async(req, res)=>{
      const id = req.params.id;
      const body = req.body;
      const filter = {_id: new ObjectId(id)}
      const option = { upsert: true }
      const updateDoc = {
        $set:{
          ...body
        }
      }
      const result = await jobsCollection.updateOne(filter, updateDoc, option);
      res.send(result);
    })
    //delete job
    app.delete('/job/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await jobsCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res)=>{
  res.send("server running")
})

app.listen(port, ()=>{
  console.log(`server running on port: ${port}`);
})