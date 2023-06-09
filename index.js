const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

//this are my middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jeg7pmd.mongodb.net/?retryWrites=true&w=majority`;

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


        const alltoysCollection = client.db('babyShop').collection('alltoys');

        app.get("/alltoys", async (req, res) => {
            const cursor = alltoysCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/alltoys/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await alltoysCollection.findOne(query);
            res.send(result);
        })



        app.get("/category/:text", async (req, res) => {
            // console.log(req.params.text);
            const text = req.params.text;
            const query = { category: text };
            const result = await alltoysCollection.find(query).toArray();
            res.send(result);
        });


        app.get("/mytoys/:email", async (req, res) => {
            console.log(req.params.email);
            const email = req.params.email;
            const query = { selleremail: email };
            const result = await alltoysCollection.find(query).toArray();
            res.send(result);
        });


        app.post('/alltoys', async (req, res) => {
            const addToy = req.body;
            // console.log(addToy);
            const result = await alltoysCollection.insertOne(addToy);
            res.send(result);
        })

        app.put('/alltoys/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateProduct = req.body;
            // console.log(updateProduct);
            const product = {
                $set: {
                    price: updateProduct.price,
                    quantity: updateProduct.quantity,
                    description: updateProduct.description
                }
            }
            const result = await alltoysCollection.updateOne(filter, product, options);
            res.send(result)
        })

        // Search Items
        app.get("/search/:text", async (req, res) => {
            const text = req.params.text;
            const result = await alltoysCollection
                .find({
                    $or: [
                        { name: { $regex: text, $options: "i" } },
                        { category: { $regex: text, $options: "i" } },
                    ],
                })
                .toArray();
            res.send(result);
        });


        app.delete('/alltoys/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await alltoysCollection.deleteOne(query);
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




app.get('/', (req, res) => {
    res.send('baby-shop is running')
})


app.listen(port, () => {
    console.log(`baby-shop  Server is running on port ${port}`);
})