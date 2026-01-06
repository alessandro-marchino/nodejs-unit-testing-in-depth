import express from 'express';
import { connect, connection } from 'mongoose';
import { getURL } from '../config/database.mjs';
import {} from 'body-parsers';
import { json, urlencoded } from 'body-parser';
import { createUser, deleteUser, getUser, resetPassword, updateUser } from './users.mjs';
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');

// const auth = require('./auth.mjs');

export const app = express();

if(connection.readyState === 0) {
  connect(getURL());
}

app.use(urlencoded({
  extended: true
}));
app.use(json());

//--------------------------------------> routes
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Foo Fooing Bar'
  });
});

app.post('/user', (req, res) => {
  createUser(req.body).then((result) => {
    res.json(result);
  }).catch((err) => {
    handleError(res, err);
  });
});

app.get('/user/:id', (req, res) => {
  getUser(req.params.id, (err, result) => {
    if (err) {
      return handleError(err);
    }

    res.json(result);
  });
});

app.put('/user/:id', (req, res) => {
  // res.send('User route')
  updateUser(req.params.id, req.body).then((result) => {
    res.json(result);
  }).catch((err) => {
    handleError(res, err);
  });
});

app.delete('/user/:id', auth.isAuthorized, (req, res) => {
  deleteUser({id: req.params.id, name: 'foo'}).then((result) => {
    res.json(result);
  }).catch((err) => {
    handleError(res, err);
  });
});

app.get('/reset/:email', (req, res) => {
  resetPassword(req.params.email).then((result) => {
    res.json({
      message: 'Password reset email has been sent.'
    });
  }).catch((err) => {
    handleError(res, err);
  });
});

function handleError(res, err) {
  if (err instanceof Error) {
    return res.status(400).json({
      error: err.message
    });
  }

  return res.status(400).json(err);
}


//--------------------------------------> misc
//404
app.use((req, res, next) => {
  return res.status(404).send('404 - Page Not Found.');
});

//500
app.use((err, req, res) => {
  res.status = err.status || 500;
  return res.send(res.status + '. An unknown error has occured.');
});
