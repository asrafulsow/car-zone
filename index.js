const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express()
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;


//middelweare
app.use(cors())
app.use(express.json())


//mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9ncig.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

//async function
async function run() {
  try {
    await client.connect();
    const database = client.db('car_services');
    const carCollection = database.collection('services');
    const exploreCollection = database.collection('explore');
    const bookingCollection = database.collection('booking');
    const usersCollection = database.collection('users')
    const reviewsCollection = database.collection('reviews')

    // Query for a movie that has the title 'Back to the Future'

    //get method
    app.get('/services', async (req, res) => {
      const cursor = carCollection.find({});
      const services = await cursor.toArray();
      res.send(services)
    })

    //get method
    app.get('/explore', async (req, res) => {
      const cursor = exploreCollection.find({});
      const explore = await cursor.toArray();
      res.send(explore)
    })

    //single api load
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      console.log('getting spacice service', id);
      const query = { _id: ObjectId(id) };
      const service = await carCollection.findOne(query);
      res.json(service);
    });

    //booking get method
    app.get('/booking', async (req, res) => {
      const email = req.query.email;
      const query = { email: email }
      const cursorbook = bookingCollection.find(query);
      const userbooking = await cursorbook.toArray();
      res.json(userbooking);
    })
    //booking get method
    app.get('/booking/user', async (req, res) => {
      const cursor = bookingCollection.find({});
      const user = await cursor.toArray();
      res.send(user);
    })


    //post method for booking
    app.post('/booking', async (req, res) => {
      const bookings = req.body;
      const result = await bookingCollection.insertOne(bookings)
      console.log(result);
      res.json(result)

    });
    //delete api for booking order
    app.delete('/booking/user/:id',async(req,res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const result = await bookingCollection.deleteOne(query);
      console.log('deleting user id', result);
      res.json(result)
    })

    //delete api for service Product
    app.delete('/services/:id',async(req,res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const result = await carCollection.deleteOne(query);
      console.log('deleting user id', result);
      res.json(result)
    })

    //post method for reviews
    app.post('/reviews', async (req,res) =>{
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.json(result)
    })

    //get method for review
    app.get('/reviews', async (req,res) =>{
      const getreview = reviewsCollection.find({})
      const review = await getreview.toArray()
      res.send(review)
    })

    //post method for services
    app.post('/services', async (req,res) =>{
      const addservice = req.body;
      console.log(addservice);
      const result = await carCollection.insertOne(addservice);
      console.log(result)
      res.json(result)
    })

    //get method for email check
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
        isAdmin = true;
      }
      res.json({admin: isAdmin})
    })

    //post method for users
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    })

    //make admin updateput
    app.put('/users/admin', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: 'admin' } }
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result)
    })

  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})