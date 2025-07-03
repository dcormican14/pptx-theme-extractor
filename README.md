# pptx-theme-extractor

## Overview

This project extracts theme color information and slide titles from PowerPoint `.pptx` files and displays them as stylized "chits" in a React viewer.

## How to Run

### 1. Install Dependencies

From the project root, install dependencies for both the backend and the React viewer:

```bash
npm install
cd theme-viewer
npm install
cd ..
```

### 2. Add PowerPoint Files

Place your `.pptx` files in the `uploads` folder at the project root.

### 3. Extract Chit Data

Run the server script to extract theme and slide information from all `.pptx` files in the `uploads` folder:

```bash
node server.js
```

This will generate a `chits.json` file at `theme-viewer/public/data/chits.json`.

### 4. Start the Viewer

Start the React viewer to see the extracted chits:

```bash
cd theme-viewer
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Notes

- Every time you add or change `.pptx` files in `uploads`, re-run `node server.js` to update the chit data.
- The viewer reads from `theme-viewer/public/data/chits.json` and does not require a running backend server.

---
```<!-- filepath: c:\prog\pptx-theme-extractor\README.md -->
# pptx-theme-extractor

## Overview

This project extracts theme color information and slide titles from PowerPoint `.pptx` files and displays them as stylized "chits" in a React viewer.

## How to Run

### 1. Install Dependencies

From the project root, install dependencies for both the backend and the React viewer:

```bash
npm install
cd theme-viewer
npm install
cd ..
```

### 2. Add PowerPoint Files

Place your `.pptx` files in the `uploads` folder at the project root.

### 3. Extract Chit Data

Run the server script to extract theme and slide information from all `.pptx` files in the `uploads` folder:

```bash
node server.js
```

This will generate a `chits.json` file at `theme-viewer/public/data/chits.json`.

### 4. Start the Viewer

Start the React viewer to see the extracted chits:

```bash
cd theme-viewer
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Notes

- Every time you add or change `.pptx` files in `uploads`, re-run `node server.js` to update the chit data.
- The viewer reads from `theme-viewer/public/data/chits.json` and does