import express from 'express';
import * as jwt from 'jsonwebtoken';
import app from '../index'

import { GameController } from '../controllers/gameController';

const router = express.Router();

const gameController = new GameController();

export default (io) => {

  router.get('/', (req, res) => {
    res.send('hello');
  });
  
  router.post('/', (req, res) => {
    if (!req.body.token) {
      res.send(403, { error: 'Unauthorized: Token not found'} );
    }
    const player = jwt.decode(req.body.token);
    const game = gameController.createGame(player)
    res.json(game); 
  });

  router.get('/:gameid', (req, res) => {
    const result = gameController.getGameDetails(req.params.gameid);
    res.status(result.status).send(result.res);
  })
  
  router.post('/:gameid', (req, res) => {
    const player = jwt.decode(req.body.token);
    const result = gameController.joinGame(req.params.gameid, player)
    if(result !== false) {
      io.to(result.gameID).emit('playerJoin', {
        action: 'join',
        data: player
      });
      res.json(result);
    } else {
      res.send(400);
    }
  });

  router.post('/:gameid/start', (req, res) => {
    const player = jwt.decode(req.body.token);

    function turnCallback(data) {
      console.log(data.turn);
      io.to(req.params.gameid).emit('startTurn', {
        action: 'nRound',
        data: data
      });
    }

    function endCallback(data) {
      console.log(data.turn, 'game ends');
      gameController.getEndDetails(req.params.gameid)
      .then(result => {       
        io.to(req.params.gameid).emit('end', {
          action: 'end',
          data: result
        });
      });
    }

    const result = gameController
      .startGame(req.params.gameid, player, turnCallback, endCallback);
    io.to(req.params.gameid)
      .emit('gameStart', {
        action: 'start',
        data: gameController.getStocks(req.params.gameid)
      });
    res.status(result.status).send(result.res);
  });

  router.post('/:gameid/stocks', (req, res) => {
    const player = jwt.decode(req.body.token);
    const result = gameController.getStocks(req.params.gameid);
    res.json(result);
  });

  io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('joinGame', (data) => {
      console.log('A user connected', data.gameid, data.token);
      socket.join(data.gameid);
      // setTimeout(() => {
      //   io.to(data.gameid).emit('message', {hello: 'world'})
      // }, 5000);
    });
  });

  

  return router;
} 