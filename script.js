// ---------- Storage helpers ----------
const STORAGE_KEY = 'bible_trivia_v1';
function saveState(state){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function loadState(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null } catch(e){ return null } }

// ---------- Players / Score logic ----------
let state = loadState() || { players:[], timerSeconds:300 };

const playersTable = document.querySelector('#playersTable tbody');
const teamCountEl = document.getElementById('teamCount');
const newName = document.getElementById('newName');
const startPoints = document.getElementById('startPoints');
const addPlayerBtn = document.getElementById('addPlayerBtn');
const resetBtn = document.getElementById('resetBtn');
const sortSelect = document.getElementById('sortSelect');

function renderPlayers(){
  playersTable.innerHTML = '';
  const sort = sortSelect.value;
  let players = [...state.players];
  if(sort === '-points') players.sort((a,b)=>b.points-a.points);
  else if(sort === 'points') players.sort((a,b)=>a.points-b.points);
  else players.sort((a,b)=>a.name.localeCompare(b.name));

  for(const p of players){
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><div class="player-name">${escapeHtml(p.name)}</div>
      <div class="sub" style="font-weight:600">ID: ${p.id}</div></td>
      <td class="points">${p.points}</td>
      <td>
        <div class="row-actions">
          <input class="addInput" type="number" value="${p.lastAdd||1}" style="width:90px;padding:6px;border-radius:8px;background:#fff;border:1px solid #d1d5db" />
          <button class="small" data-action="add">+ Add</button>
          <button class="small ghost" data-action="sub">- Sub</button>
          <button class="small ghost" data-action="set">Set</button>
          <button class="small ghost" data-action="remove">Remove</button>
        </div>
      </td>
    `;

    tr.querySelector('[data-action="add"]').addEventListener('click',()=>{
      const v = Number(tr.querySelector('.addInput').value)||0;
      updatePoints(p.id, v);
      p.lastAdd = v;
    });
    tr.querySelector('[data-action="sub"]').addEventListener('click',()=>{
      const v = Number(tr.querySelector('.addInput').value)||0;
      updatePoints(p.id, -v);
      p.lastAdd = v;
    });
    tr.querySelector('[data-action="set"]').addEventListener('click',()=>{
      const v = Number(tr.querySelector('.addInput').value)||0;
      setPoints(p.id, v);
    });
    tr.querySelector('[data-action="remove"]').addEventListener('click',()=>{
      if(confirm('Remove player "'+p.name+'"?')) removePlayer(p.id);
    });

    playersTable.appendChild(tr);
  }
  teamCountEl.textContent = state.players.length;
  saveState(state);
}

function escapeHtml(str){ return String(str).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

function addPlayer(name, points=0){
  const id = Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  state.players.push({id,name: String(name).trim(),points:Number(points)||0,lastAdd:1});
  renderPlayers();
}
function removePlayer(id){ state.players = state.players.filter(p=>p.id!==id); renderPlayers(); }
function updatePoints(id, delta){
  const p = state.players.find(x=>x.id===id); if(!p) return;
  p.points = Number(p.points) + Number(delta);
  renderPlayers();
}
function setPoints(id, val){
  const p = state.players.find(x=>x.id===id); if(!p) return;
  p.points = Number(val);
  renderPlayers();
}

addPlayerBtn.addEventListener('click',()=>{
  const name = newName.value.trim() || ('Player '+(state.players.length+1));
  const sp = Number(startPoints.value)||0;
  addPlayer(name, sp);
  newName.value = '';
  startPoints.value = '';
});
resetBtn.addEventListener('click',()=>{
  if(confirm('Reset all players and points?')){ state.players=[]; renderPlayers(); }
});
sortSelect.addEventListener('change',renderPlayers);

// load initial sample if empty
if(state.players.length===0){
  addPlayer('Team A',0);
  addPlayer('Team B',0);
  addPlayer('Team C',0);
} else renderPlayers();

// ---------- Timer logic ----------
const clock = document.getElementById('clock');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetTimerBtn = document.getElementById('resetTimerBtn');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');
const setBtn = document.getElementById('setBtn');
const presets = document.querySelectorAll('.preset');

let timerSeconds = Number(state.timerSeconds) || 300;
let timerRemaining = timerSeconds;
let timerInterval = null;
let isRunning = false;

function formatTime(s){
  const mm = Math.floor(s/60).toString().padStart(2,'0');
  const ss = (s%60).toString().padStart(2,'0');
  return `${mm}:${ss}`;
}
function renderClock(){ clock.textContent = formatTime(timerRemaining); }

function startTimer(){
  if(isRunning) return;
  isRunning = true; startBtn.disabled=true; pauseBtn.disabled=false;
  timerInterval = setInterval(()=>{
    timerRemaining--;
    if(timerRemaining<=0){
      stopTimer(false);
      timerRemaining = 0;
      renderClock();
      beep();
    } else renderClock();
  },1000);
}
function pauseTimer(){ if(!isRunning) return; isRunning=false; startBtn.disabled=false; pauseBtn.disabled=true; clearInterval(timerInterval); }
function stopTimer(saveStateFlag=true){ clearInterval(timerInterval); isRunning=false; startBtn.disabled=false; pauseBtn.disabled=true; if(saveStateFlag){ state.timerSeconds = timerSeconds; saveState(state);} }
function resetTimer(){ timerRemaining = timerSeconds; renderClock(); stopTimer(); }

startBtn.addEventListener('click', ()=>{ startTimer(); });
pauseBtn.addEventListener('click', ()=>{ pauseTimer(); });
resetTimerBtn.addEventListener('click', ()=>{ resetTimer(); });

setBtn.addEventListener('click', ()=>{
  const m = Number(minutesInput.value)||0;
  const s = Number(secondsInput.value)||0;
  timerSeconds = m*60 + s;
  timerRemaining = timerSeconds;
  state.timerSeconds = timerSeconds;
  saveState(state);
  renderClock();
});
presets.forEach(p=>p.addEventListener('click',()=>{
  const m = Number(p.dataset.min);
  timerSeconds = m*60;
  timerRemaining = timerSeconds;
  state.timerSeconds = timerSeconds;
  saveState(state);
  renderClock();
}));

// WebAudio beep
function beep(){
  try{
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = 880;
    g.gain.value = 0.0001;
    o.connect(g); g.connect(ctx.destination); o.start();
    g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
    setTimeout(()=>{o.stop(); ctx.close()},1300);
  }catch(e){ console.warn('beep error', e); }
}

// init clock
timerSeconds = Number(state.timerSeconds) || 300;
timerRemaining = timerSeconds;
renderClock();

// ---------- Extras ----------
window.addEventListener('keydown', (e)=>{
  if(e.key.toLowerCase()==='n') newName.focus();
  if(e.code === 'Space'){
    e.preventDefault();
    if(isRunning) pauseTimer(); else startTimer();
  }
});
window.addEventListener('beforeunload', ()=>{ saveState(state); });
