# Scent Finder Frontend

Static HTML/CSS/JavaScript frontend for Scent Finder.

## Run

Start the backend on `http://127.0.0.1:8000`, then run:

```bash
npm start
```

Open `http://127.0.0.1:5500`.

## API URL

The frontend uses `http://127.0.0.1:8000` by default. To test another API server in the browser console:

```js
localStorage.setItem("SCENT_API_BASE_URL", "https://your-api.example.com");
location.reload();
```

## Check JavaScript

```bash
npm run check
```
