# CPU Monitor Mini-App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

# Dependencies

## Server endpoint localhost:3001/cpu

This enable the app to poll for the lastest cpu usage. The server expects a json response `{ cpu: <value: number> }`.

## Example NodeJS (Express) Server

```
const express = require('express');
const os = require('os');
const cors = require('cors');
const app = express();
const port = 3001;
app.use(cors());
app.options('*', cors());

app.get('/', (_req, res) => { res.send(); });

app.get('/cpu', (_req, res) => {
	const loadAvg = os.loadavg()[0]/os.cpus().length;
	console.debug("load avg: " + Math.floor(loadAvg*100)/100);
	res.json({ cpu: loadAvg });
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
```

## Install / Run Server

After placing in "index.js" or similar, run:

### `npm install express cors --save`

and then

### `node index.js`

🤖
