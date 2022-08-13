const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World to');
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p4sest4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const detailsCollection = client.db("production").collection("details");

        // Get All Data
        app.get('/allDetails', async (req, res) => {
            const result = await detailsCollection.find().toArray();
            res.send(result);
        });

        // Data Load by Id
        app.get('/details/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await detailsCollection.find(query).toArray();
            res.send(result);
        });

        // Delete Detail
        app.delete('/details/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await detailsCollection.deleteOne(query);
            res.send(result);
        });

        // Set Users on Database
        app.put('/detail/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: user,
            };
            const result = await detailsCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });
        
    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log('Server site running', port);
});