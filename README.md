# [stat.ink](https://stat.ink) Brella Counter
Count Brellas from your [stat.ink](https://stat.ink) data.

## Usage
You'll need `Node.js` for this.

### Setting up the script
1. Clone this repo, and `cd` into it
2. Run the command `npm install`

### Getting the file
1. Login to [stat.ink](https://stat.ink).
2. Go to the [profile page](https://stat.ink/profile)
3. Click `JSON (stat.ink format, gzipped)` under `Export (Splatoon 3)` on the right side
4. Extract the downloaded `.gz` file to obtain the `.json` file

### Running the script
1. Run the command `npx ts-node analyze.ts /path/to/file.json`, where `/path/to/file.json` is the path to the file you downloaded
2. The stats will be output in the `work/stat.txt` file