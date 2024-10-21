# Brella Counter (`web` branch)
Count Brellas from your (my) [stat.ink](https://stat.ink) data.

## [Live Right Here!](https://brella.northwestw.in)

## How?
I upload my matches to [stat.ink](https://stat.ink).  
The backend of this website is just continuously synchronizing with [my page](https://stat.ink/@NorthWestWind/spl3).

## Can I use it with my own account?
Yes! I don't why I thought of this, but you can change the account it is synchronizing with to your own.

Edit `.env` (create if it doesn't exist), and append the following line:
```
STAT_USER=YourUsernameHere
```
Obviously replace `YourUsernameHere` with your own username.

Unfortunately this doesn't change the website heading so you'll have to edit the file `vite/src/App.tsx` and change the text in the `h1` element.

### Running the server
You'll need [Node.js](https://nodejs.org) for this.

1. Clone this repo, and `cd` into it
2. Run the command `npm run deep-install` (if you don't plan to use the website, just do `npm install`)
3. Run the command `npm run build` (if you don't plan to use the website, just do `npx tsc`)
4. (Optional) Download your stat.ink data (see [Getting the file](#getting-the-file)) and put it in the `work` directory (it doesn't exist, so create it). Extract the `.gz` file and rename the `.json` file to `stats.json`.
5. Run `npm start`. The server should start at port 3000.

#### Getting the file
1. Login to [stat.ink](https://stat.ink).
2. Go to the [profile page](https://stat.ink/profile)
3. Click `JSON (stat.ink format, gzipped)` under `Export (Splatoon 3)` on the right side
4. Extract the downloaded `.gz` file to obtain the `.json` file

### Options
There are 3 things you can configure with the `.env` file.

- `PORT`: The port the server will listen to. Defaults to `3000`.
- `RUNTIME_DIR`: The directory where data will be stored. This includes `stats.json` and `stat.txt` that the program outputs. Defaults to `work`.
- `STAT_USER`: The stat.ink account to synchronize to. Defaults to `NorthWestWind`.