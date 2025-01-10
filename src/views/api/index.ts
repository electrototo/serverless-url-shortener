import express, { ErrorRequestHandler } from 'express';

import linkRouter from './link';

const router = express.Router();

router.use('/link', linkRouter);

export default router;