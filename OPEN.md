# If the app “won’t open”

1. **Use the folder that contains `package.json`**

   In a terminal, `cd` until `ls` shows `package.json` next to `next.config.js`, then:

   ```bash
   npm install
   npm run dev
   ```

   If this app is nested under a larger repo, that folder is usually named `musician-discovery-prototype`:

   ```bash
   cd musician-discovery-prototype
   npm install
   npm run dev
   ```

2. Wait until the terminal shows **Ready** and a **Local** URL.

3. Open:

   **http://localhost:3001/musicians/map**

   (or **http://127.0.0.1:3001/musicians/map** — `/` redirects to the map for this prototype)

4. **Port already in use?**

   ```bash
   npx next dev -p 3002
   ```

   Then open **http://localhost:3002/musicians**

5. **Never run `npm` from your home directory** (`/Users/you`) — you will get `ENOENT` for `package.json`. Always `cd` into this app folder first.
