# Troubleshooting local dev

1. **Run commands from the repo root** (where `package.json` and `next.config.js` live):

   ```bash
   npm install
   npm run dev
   ```

2. Wait until the terminal shows **Ready** and a local URL.

3. Open **http://localhost:3001/musicians/map**  
   (`/` redirects to the map.)

4. **Port in use?**

   ```bash
   npx next dev -p 3002
   ```

   Then open **http://localhost:3002/musicians/map**.

5. **`ENOENT` for `package.json`** — you are not in the project directory. `cd` into the cloned `music-talent` folder first.
