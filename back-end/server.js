const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/unoDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
    name: 'session',
    keys: ['secretValue'],
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// import the users module and setup its API path
const users = require("./users.js");
app.use("/api/users", users.routes);

app.listen(3000, () => console.log('Server listening on port 3000!'));

// Create the schemes/tables for the database

// Game
const gameSchema = new mongoose.Schema({
    gameName: String,
    playerIds: [Number],
    cardSetId: Number,
    ruleSetId: Number,
    acceptingPlayers: Boolean,
    id: Number,
});

// RuleSet
const ruleSetSchema = new mongoose.Schema({
    name: String,
    startingHandSize: Number,
    drawUntilYouCanPlay: Boolean,
    id: Number,
});

// CardDetails
const cardDetailsSchema = new mongoose.Schema({
    qty: Number,
    cardId: Number,
});

// CardSet
const cardSetSchema = new mongoose.Schema({
    name: String,
    cards: [cardDetailsSchema],
    id: Number,
});

// CardBase
const cardBaseSchema = new mongoose.Schema({
    color: String,
    symbol: String,
    id: Number,
});

// Player
const playerSchema = new mongoose.Schema({
    name: String,
    wins: String,
    id: Number,
    hand: [cardBaseSchema],
    inGame: Boolean,
});


// Create new tables
const Card = mongoose.model('card', cardBaseSchema);
const RuleSet = mongoose.model('ruleSet', ruleSetSchema);
const Player = mongoose.model('player', playerSchema);
const CardSet = mongoose.model('cardSet', cardSetSchema);
const Game = mongoose.model('game', gameSchema);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
    res.header('Allow', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
    res.header('Access-Control-Allow-Credentials', 'Set-Cookie');
    next();
});

// #region TabCards
// CRUD operations for TabCards
app.post('/api/cards', async (req,res) => {
    const card = new Card({
        color: req.body.color,
        symbol: req.body.symbol,
        id: req.body.id,
    });
    try {
        console.log(card);
        await card.save();
        res.send(card);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

    // Get all cards
app.get('/api/cards', async (req,res) => {
    try {
        let card = await Card.find();
        res.send(card);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});
    // Get one card
app.get('/api/cards/:id', async (req,res) => {
    try {
        let card = await Card.findOne({
            id: req.params.id
        });
        res.send(card);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.put('/api/cards/:id', async (req, res) => {
    console.log("not implemented");
});

app.delete('/api/cards/:id', async (req,res) => {
    try {
        await Card.deleteOne({
            id: req.params.id
        });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});
//#endregion

// #region RuleSet
// CRUD operations for TabRuleSets
app.post('/api/ruleSets', async (req,res) => {
    const ruleSet = new RuleSet
({
        startingHandSize: req.body.startingHandSize,
        drawUntilYouCanPlay: req.body.drawUntilYouCanPlay,
        id: req.body.id,
        name: req.body.name,
    });
    try {
        await ruleSet.save();
        res.send(ruleSet);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/ruleSets', async (req,res) => {
    try {
        let results = await RuleSet
    .find();
        res.send(results);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.put('/api/ruleSets/:id', async (req, res) => {
    try {
        let ruleSet = await RuleSet
    .findOne({
          id: req.params.id
        });
        ruleSet.startingHandSize = req.body.startingHandSize;
        ruleSet.drawUntilYouCanPlay = req.body.drawUntilYouCanPlay;
        ruleSet.name = req.body.name;
        ruleSet.save();
        res.sendStatus(200);
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
});

app.delete('/api/ruleSets/:id', async (req,res) => {
    try {
        await RuleSet
    .deleteOne({
            id: req.params.id
        });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});
//#endregion

// #region Player
// CRUD operations for TabPlayers
app.post('/api/players', async (req,res) => {
    const player = new Player({
        name: req.body.name,
        wins: req.body.wins,
        id: req.body.id,
        hand: req.body.hand,
        inGame: req.body.inGame
    });
    try {
        await player.save();
        res.send(player);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/players', async (req,res) => {
    try {
        let results = await Player.find();
        res.send(results);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.put('/api/players/:id', async (req, res) => {
    try {
        let player = await Player.findOne({
          id: req.params.id
        });
        player.name = req.body.name;
        player.wins = req.body.wins;
        player.id = req.body.id;
        player.hand = req.body.hand;
        player.inGame = req.body.inGame;
        player.save();
        res.sendStatus(200);
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
});

app.delete('/api/players/:id', async (req,res) => {
    try {
        await Player.deleteOne({
            id: req.params.id
        });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});
//#endregion

// #region CardSet
// CRUD operations for TabCardSets
app.post('/api/cardSets', async (req,res) => {
    const cardSet = new CardSet({
        name: req.body.name,
        cards: req.body.cards,
        id: req.body.id,
    });
    try {
        await cardSet.save();
        res.send(cardSet);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/cardSets', async (req,res) => {
    try {
        let results = await CardSet.find();
        res.send(results);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

// For updating the quantity of the given cardId in cards
app.put('/api/cardSets/:id/:cardId', async (req, res) => {
    try {
        let cardSet = await CardSet.findOne({
          id: req.params.id
        });
        console.log("prefilter");
        cardSet.cards.filter(a => a.id === cardId)[0].qty = req.body.qty;
        console.log("postfilter");
        cardSet.save();
        res.sendStatus(200);
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
});

app.put('/api/cardSets/:id', async (req, res) => {
    try {
        let cardSet = await CardSet.findOne({
            id: req.params.id
        });
        cardSet.cards = req.body.cards;
        cardSet.name = req.body.name;
        cardSet.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/cardSets/:id', async (req,res) => {
    try {
        await CardSet.deleteOne({
            id: req.params.id
        });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});
//#endregion

// #region Game
// CRUD operations for TabGames
app.post('/api/games', async (req,res) => {
    const game = new Game({
        gameName: req.body.gameName,
        playerIds: req.body.playerIds,
        cardSetId: req.body.cardSetId,
        ruleSetId: req.body.ruleSetId,
        acceptingPlayers: req.body.acceptingPlayers,
        id: req.body.id
    });
    try {
        await game.save();
        res.send(game);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/games', async (req,res) => {
    try {
        let results = await Game.find();
        res.send(results);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.put('/api/games/:id', async (req, res) => {
    try {
        let game = await Game.findOne({
          id: req.params.id
        });
        game.gameName = req.body.gameName;
        game.playerIds = req.body.playerIds;
        game.cardSetId = req.body.cardSetId;
        game.ruleSetId = req.body.ruleSetId;
        game.acceptingPlayers = req.body.acceptingPlayers;
        game.save();
        res.sendStatus(200);
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
});

app.delete('/api/games/:id', async (req,res) => {
    try {
        await Game.deleteOne({
            id: req.params.id
        });
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});
//#endregion