

# Installation

```
npm install
```

Open `main.js` and check these lines:

```js
const Account   = require('./key.json');

const API_KEY = Account.API_KEY;
const API_SECRET = Account.API_SECRET;
```

Either edit `API_KEY` and `API_SECRET` directly or create a `key.json` file next to `main.js` looking like this:

```js
{ 
    "API_KEY": "YOUR_KEY_HERE",
    "API_SECRET": "YOUR_SECRET_HERE"
}
```

(if you add API_KEY etc in the main.js file directly, remove the `const Account = require(...)` line! )

Edit your `START_DATE` and `END_DATE`, defaults are fine

Edit the coins you want to pull addresses from 

then:

```
node main.js
```

saved to output.json


## ABSOLUTELY NO WARANTY 