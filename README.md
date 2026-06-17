# Simple Calculator (Node.js)

A calculator with two interfaces sharing the same logic:
- a command-line tool (CLI)
- a web UI (Express server + HTML/CSS/JS frontend)

## Requirements
- Node.js (v14+ recommended)

## Setup
```bash
cd calculator-app
npm install
```
(`npm install` is only needed for the web UI — it installs Express.)

## Web UI

```bash
npm run web
```
Then open **http://localhost:3000** in your browser.

- Click the buttons or use your keyboard (digits, `+ - * /`, `Enter`/`=`, `Backspace`, `Escape`/`C`, `%`).
- The display shows a small "history" line above the main result, similar to a real desk calculator.
- Every `+ − × ÷` operation is sent to the Express backend (`POST /api/calculate`), which uses the exact same `calculator.js` module as the CLI — so the math logic isn't duplicated between the two interfaces.

## CLI

### Interactive mode
```bash
node index.js
```
You'll be prompted for two numbers and an operator. Type `exit` at any prompt to quit.

### One-shot mode
```bash
node index.js 5 + 3
node index.js 10 / 2
node index.js 7 "*" 6
```
Note: wrap `*` in quotes on most shells so it isn't interpreted by the shell.

## Project structure
```
calculator-app/
├── index.js          # CLI entry point
├── server.js          # Express server for the web UI
├── calculator.js       # Core math logic, shared by CLI and web backend
├── public/
│   ├── index.html      # Web UI markup
│   ├── style.css        # Web UI styling (LCD/phosphor display theme)
│   └── script.js         # Web UI client logic (calls /api/calculate)
├── package.json
└── README.md
```

## Supported operators
- `+` Addition
- `-` Subtraction
- `*` Multiplication
- `/` Division (errors on divide by zero)
