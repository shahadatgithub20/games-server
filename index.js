
const express=require('express');
// require('dotenv').config();
const cors =require ('cors');
const ObjectId =require ('mongodb').ObjectId;
const app= express();
const port =process.env.PORT || 5000;
// middle were
app.use(cors());


app.use(express.json());
// =================================
    // mongodb connection
// =================================
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://games:BABU1234@cluster0.zfnnb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
      await client.connect();
      const database = client.db("super-play-users");
      const userCollection=database.collection("users");
      const cardCollection=database.collection("card");
  
     // ===================users get API====================
    app.get('/users', async(req, res)=>{
     const cursor=userCollection.find({});
     const user=await cursor.toArray();

        res.send(user);
    })
    // =====================users post API==================
    // =======================================
    app.post('/users', async(req, res)=>{
        const newUser= req.body;
        const result = await userCollection.insertOne(newUser);
        console.log('got newUser', req.body);
        console.log('got newUser', newUser);
        res.json(result);
    })
    // ======================================
    
    // =======================================
    // ======================UPDATE API=================
    app.put('/order/:id', async(req, res)=>{
        const id =req.params.id;
        const updateOrder= req.body;
        const  filter={_id: ObjectId(id)};
        const options={upsert:true};
        const updateDate={
            $set:{
                name:updateOrder.name,
                email:updateOrder.email,
                status:updateOrder.status,

            },
        };
        const result = await orderCollection.updateOne(filter,updateDate, options);
        res.json(result);

    })

    // =======================================
    // ======================Delete API=================

    app.delete('/order/:id', async(req, res)=>{
        const id =req.params.id;
        const  query={_id: ObjectId(id)};
        const result =await orderCollection.deleteOne(query);
        res.json(result);

    })
    // ========================================
    // ====================== find dynamic by id ==================
    app.get('/order/:id',async(req, res)=>{
        const id =req.params.id;
        const  query={_id: ObjectId(id)};
        const result =await orderCollection.findOne(query);
        res.send(result);
    })
    // ---------------------------------------------------
    // ---------------------------------------------------
       // ===================users get API====================
       app.get('/card', async(req, res)=>{
        const cursor=cardCollection.find({});
        const card=await cursor.toArray();
   
           res.send(card);
       });
         // =====================users post API==================
    // =======================================
        app.post('/card', async(req, res)=>{
            const newCard= req.body;
            const result = await cardCollection.insertOne(newCard);
            console.log('got newCard', req.body);
            res.json(result);
        })


    // ---------------------------------------------------
    // ---------------------------------------------------



    } finally {
    //   await client.close();
    }
}
run().catch(console.dir);

// =================================

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})