# 📖 Bible Trivia — Scoreboard & Timer

A simple web app for playing **Bible Trivia** (or any group quiz game) with friends.  
It lets you manage players/teams, keep track of scores, and run a countdown timer for each round.

---

## ✨ Features
- 🎯 **Scoreboard**
  - Add unlimited players or teams.
  - Update points with **+ Add, − Subtract, Set, or Remove** buttons.
  - Input a custom point value for each action.
  - Sort leaderboard by **highest points, lowest points, or name A–Z**.
  - Shows total number of teams.
  - Data is **saved in your browser’s local storage**.

- ⏳ **Countdown Timer**
  - Preset timers: **1, 2, 3, 5, and 10 minutes**.
  - Custom timer input (minutes & seconds).
  - **Start, Pause, Reset** controls.
  - Beeps when time reaches zero.
  - Timer state is also saved in local storage.

- ⌨️ **Keyboard Shortcuts**
  - Press **N** to focus the "Add new player" input.
  - Press **Space** to start/pause the timer.

- 🖥️ **Responsive Design**
  - Works well on desktop, tablet, and mobile.

---

## 📂 Project Structure
If using separate files:

`/bible-trivia-app`

├── `index.html` # Main HTML structure

├──`style.css` # Styles (white background, clean layout)

├── `script.js` # Scoreboard & timer logic

└── `README.md` # Project documentation/


---

## 🚀 Getting Started

### Option 1: Run Locally
1. Clone or download this repo.
2. Open `index.html` in your browser.
3. Start adding players and running your trivia game!

### Option 2: Deploy Online
- You can deploy instantly on free platforms like:
  - **GitHub Pages**
  - **Netlify**
  - **Vercel**

---

## 🛠️ Customization
- Change the **colors** by editing `style.css`.
- Update **default players** in `script.js`.
- Modify the **beep sound** in `script.js → beep()` function.

---

## 🎉 Usage Tips
- Use the **quick add field** beside each player for faster scoring.
- Keep rounds exciting by adjusting the **timer presets**.
- Reset all players easily before starting a new game.

---

## 📜 License
This project is open-source and free to use for personal or group trivia games.
