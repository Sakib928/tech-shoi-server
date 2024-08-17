const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



app.use(cors({
    origin: ['http://localhost:5173', 'https://tech-shoi.netlify.app'],
    credentials: true
}));
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1towayy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const productCollection = client.db('tech-shoi').collection('products');


        app.get('/products', async (req, res) => {
            const searchText = req.query.searchText;
            const brand = req.query.brand;
            const category = req.query.category;
            const page = parseInt(req.query.page);

            const searchRegex = new RegExp(searchText, "i");
            const brandRegex = new RegExp(brand, "i");
            const categoryRegex = new RegExp(category, "i");

            const query = {
                productname: searchRegex, brand: brandRegex, category: categoryRegex,
            };
            const result = await productCollection.find(query).skip((page - 1) * 6).limit(6).toArray();
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

        app.get('/productsCount', async (req, res) => {
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count })
        })

    } finally {

    }
}

app.get('/', (req, res) => {
    res.send('tech-shoi server is up and running')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})
run().catch(console.dir);
