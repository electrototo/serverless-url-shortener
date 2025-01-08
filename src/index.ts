import cors from 'cors';
import express, { Express, Request } from 'express';
import { DDBLink } from './models/dynamodb/link';

const app: Express = express();
const port = process.env.PORT || 3000;

const alphabet = 'abcdefghijklmonpqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
const baseDomain = 'https://s.to';

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    const links = await DDBLink.scan.go();

    console.log(links);
    res.send(JSON.stringify(links));
});

app.post('/', async (req, res) => {
    let shortCode: string = '';
    for (let i = 0; i < 7; i++) {
        shortCode = shortCode + alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    const shortened = `${baseDomain}/${shortCode}`;

    await DDBLink.create({
        url: req.body.url,
        shortcode: shortened
    }).go();

    res.send(JSON.stringify({
        url: req.body.url,
        shortcode: shortened
    }));
});

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
})