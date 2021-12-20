const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

// PORT
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kyyp9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        console.log('Database connect')

        const database = client.db('forxd_shop')
        const productCollection = database.collection('products')
        const saveProductCollection = database.collection('saveProducts');

        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const result = await cursor.toArray();
            res.json(result);
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.json(result)
            console.log(id)
        })

        // GET add to card product
        app.get('/saveProduct', async (req, res) => {
            const cursor = saveProductCollection.find({});
            const result = await cursor.toArray();
            res.json(result)
        })

        // add to card
        app.post('/addtocard', async (req, res) => {
            const setCard = req.body;
            const result = await saveProductCollection.insertOne(setCard);
            res.json(result)
        })

        // Delete saveProduct
        app.delete('/saveProduct/:cartId', async (req, res) => {
            const cartId = req.params.cartId;
            const query = { _id: ObjectId(cartId) };
            const result = await saveProductCollection.deleteOne(query)
            res.json(result)
            console.log(cartId)
            console.log(result)
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

// App get
app.get('/', (req, res) => {
    res.send('ForXd Shop is running');
})

// Listen PORT
app.listen(port, (req, res) => {
    console.log('Listenning port is:', port);
})