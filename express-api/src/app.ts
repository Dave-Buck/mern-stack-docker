import express, { json } from 'express';
import bodyParser from 'body-parser'
import mongoose from 'mongoose';
import cors from 'cors';
import Item from './models/Item';

const app: express.Application = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

mongoose
  .connect(
    'mongodb://mongo:27017/docker-node-mongo',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.get('/', cors(), (req: express.Request, res: express.Response, next: express.NextFunction) => {
  Item.find()
    .then(items => res.json({ "items": items }))
    .catch(err => res.status(404).json({ msg: 'No items found' }))
});

app.post('/item/add', (req: express.Request, res: express.Response) => {

  const newItem = new Item({
    name: req.body.name
  });

  newItem.save().then(item => res.json({ "name": item }));
});

app.post('/item/delete', (req: express.Request, res: express.Response) => {

  Item.findByIdAndDelete(req.body._id)
    .then(() => res.json({"item": "deleted"}))
    .catch(err => res.status(404).json({msg: 'Item was unable to be deleted'}))
});

app.post('/item/update', (req: express.Request, res: express.Response) => {

  Item.findByIdAndUpdate({_id: req.body._id}, {name: req.body.newName})
    .then(() => res.json({"item": "updated"}))
    .catch(err => res.status(404).json({msg: 'Item was unable to be updated'}));
});

app.listen(5000, () => console.log('Server running on port 5000'))