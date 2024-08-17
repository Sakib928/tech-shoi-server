const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1towayy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });

        const productCollection = client.db('tech-shoi').collection('products');

        app.post('/product', async (req, res) => {
            const product = req.body;
            console.log(product);
            const result = await productCollection.insertOne(product);
            res.send(result);
        })

        app.get('/products', async (req, res) => {
            const searchText = req.query.searchText;
            const brand = req.query.brand;
            const category = req.query.category;


            const searchRegex = new RegExp(searchText, "i");
            const brandRegex = new RegExp(brand, "i");
            const categoryRegex = new RegExp(category, "i");

            const query = {
                productname: searchRegex, brand: brandRegex, category: categoryRegex,
            };
            const result = await productCollection.find(query).toArray();
            res.send(result);
        })

        app.get('/price-range', async (req, res) => {
            const range = parseInt(req.query.range);
            if (range == 0) {
                return;
            }
            const query = { price: { $gte: range - 1000, $lte: range } }
            const result = await productCollection.find(query).toArray();
            res.send(result);
        })

        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}

app.get('/', (req, res) => {
    res.send('tech-shoi server is up and running')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})
run().catch(console.dir);
