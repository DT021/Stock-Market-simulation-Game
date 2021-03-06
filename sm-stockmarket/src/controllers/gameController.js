import * as jwt from 'jsonwebtoken';
import config from '../config.json';
import { Game } from '../models/Game'
import { StockManager } from '../models/StockManager';
import axios from 'axios'
export class GameController {

  constructor() {
    this.games = [];
  }

  createGame(gameAdmin) {
    const stockManager = new StockManager(config.stocks);
    const g = new Game(gameAdmin, stockManager);
    this.games.push(g);
    return {
      playerList: g.playerList,
      turn: g.turn,
      gameAdmin: g.gameAdmin,
      gameID: g.gameID,
      stocks: g.stocks
    }
  }

  getGameDetails(gameID) {
    const g = this.games.find(v => v.gameID === gameID);
    if (g) {
      return {
        status: 200,
        res: g
      }
    } else {
      return {
        status: 404,
        res: 'Game not found'
      }
    }
  }

  joinGame(gameID, playerID) {
    const g = this.games.find(v => v.gameID === gameID);
    if (g) {
      g.addPlayer(playerID);
      return g;
    } else {
      return false;
    }
  }

  getStocks(gameID) {
    const g = this.games.find(v => v.gameID === gameID);
    if (g) {
      return g.getStocks();
    } else {
      return false;
    }
  }

  startGame(gameID, playerID, turnCallback, endCallback) {
    const g = this.games.find(v => v.gameID === gameID);
    if (!g) {
      return {
        status: 404,
        res: { error: 'No such game' }
      }
    }

    if (g.gameAdmin.name !== playerID.name) {
      return {
        status: 403,
        res: { error: 'You need to be admin to start game' }
      }
    }

    const res = g.startGame(turnCallback, endCallback);

    return {
      status: 200,
      res: res
    }
  }

  getEndDetails(gameId) {
    const g = this.games.find(v => v.gameID === gameId);
    if(g) {
      let promises = [];
      g.playerList.forEach(p => {
        console.log(p);
        console.log(config.bankUrl+'/player/'+p.name);
        
        promises.push(axios.get(config.bankUrl+'/player/'+p.name).then(r => r.data))
      });
      return Promise.all(promises);
    } else {
      throw new Error();
    }
  }

  // decodePlayerName(token) {

  //     let p = jwt.decode(token);
  //     let playerName = p.name;

  //     Game(playerName);
  // }

  // getPlayerId() {
  //     let playerId = Game.getPlayerId();
  //     return playerId;
  // }

  // addPlayer() {

  // }

  // getCurrentTurn() {

  // }

  // getStock() {

  // }
}