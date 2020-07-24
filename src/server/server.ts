import express from 'express';
import { Routes } from './routes/routes';
import * as bodyParser from 'body-parser';
import { connectDb } from './connector/database-connector';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
    Routes.routes(this.app);
  }
}

connectDb().then(async () => {
  new App().app.listen(3000, () => {
    console.log('App is listening on port 3000!');
  });
});
