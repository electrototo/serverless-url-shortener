import cors from 'cors';
import express, { ErrorRequestHandler, Express } from 'express';

import mainRouter from './views/index';
import apiRouter from './views/api/index';
import { ZodError } from 'zod';

export const app: Express = express();
const port = process.env.PORT || 3000;

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof ZodError) {
        res.status(400).json({
            error: err.issues
        });
    }

    res.status(500).json({ error: err });
};

app.use(cors());
app.use(express.json());

app.use('/', mainRouter);
app.use('/api/', apiRouter);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
})