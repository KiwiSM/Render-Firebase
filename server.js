// sätt upp firestore DONE
// sätt upp webbservern DONE
// publicera på render

const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = new express();
app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.get('/', (req, res) => {
    res.send('Hej från Webbservern')
});

app.get('/pokemons', async (req, res) => {
    try {
        const pokemons = [];
        const query = await db.collection('pokemons').get();

        query.forEach(doc => {
            pokemons.push({
                id: doc.id,
                ...doc.data()
            });
        });
        res.json({list: pokemons});
    }
    catch (err) {
        console.error(err);
    }
});

app.put("/pokemon", async (req, res) => {
    const { id } = req.body;
    try {
        const ref = await db.collection("pokemon").doc(id);
        const doc = await ref.get();
        res.json(doc.data());
    } catch (err) {
        console.error(err);
    }
});

app.listen(1234, () => {
    console.log('Servern är igång');
});