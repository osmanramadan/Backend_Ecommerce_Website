import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import path from 'path';

const app: express.Application = express();
const port = 3005;

const corsoptions = {
  origin: process.env.FRONTEND_LINK,
  optionsSuccessStatus: 200
};

app.use(cors(corsoptions));
// this part is added when upload project to server (render) to upload images and save it in the upload folder in the root of the project
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// this part is responsible for recieving data from frontend forms (data-form) and save it in the req.body
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(routes);

app.listen(port, async (): Promise<void> => {
  const url = `http://localhost:${port}`;
  console.log(` open ${url} to review the project ...`);
});

export default app;
