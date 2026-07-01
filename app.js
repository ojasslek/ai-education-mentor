// App.js - Main Application Orchestrator & Router

import { DoubtSolver } from "./modules/doubtSolver.js?v=2";
import { VideoLibrary } from "./modules/videos.js?v=5";
import { FocusMode } from "./modules/focusMode.js?v=7";
import { StudyPlanner } from "./modules/planner.js?v=2";
import { ResourcesVault } from "./modules/resources.js";

class AppState {
  constructor() {
    this.apiKey = localStorage.getItem("mentor_gemini_api_key") || "YOUR_API_KEY_HERE";
    this.stats = JSON.parse(localStorage.getItem("mentor_stats")) || {
      sessions: 0,
      doubts: 0,
      tasksPercentage: 0
    };
  }

  getApiKey() {
    return this.apiKey;
  }

  setApiKey(key) {
    this.apiKey = key;
    localStorage.setItem("mentor_gemini_api_key", key);
    this.syncApiIndicator();
  }

  clearApiKey() {
    this.apiKey = "";
    localStorage.removeItem("mentor_gemini_api_key");
    this.syncApiIndicator();
  }

  incrementStat(statKey) {
    if (this.stats[statKey] !== undefined) {
      this.stats[statKey]++;
      this.saveStats();
      this.renderStatsUI();
    }
  }

  updatePercentageStat(percentage) {
    this.stats.tasksPercentage = percentage;
    this.saveStats();
    this.renderStatsUI();
  }

  saveStats() {
    localStorage.setItem("mentor_stats", JSON.stringify(this.stats));
  }

  renderStatsUI() {
    const elSessions = document.getElementById("stat-sessions");
    const elDoubts = document.getElementById("stat-doubts");
    const elTasks = document.getElementById("stat-tasks");

    if (elSessions) elSessions.innerText = this.stats.sessions;
    if (elDoubts) elDoubts.innerText = this.stats.doubts;
    if (elTasks) elTasks.innerText = `${this.stats.tasksPercentage}%`;
  }

  syncApiIndicator() {}
}

// App Orchestration Shell
document.addEventListener("DOMContentLoaded", () => {
  const state = new AppState();
  state.renderStatsUI();
  state.syncApiIndicator();

  // Initialize Modules
  const doubtSolver = new DoubtSolver(state);
  const videoLibrary = new VideoLibrary();
  const focusMode = new FocusMode(state);
  const studyPlanner = new StudyPlanner(state);
  const resourcesVault = new ResourcesVault();



  // Single Page Router
  const navItems = document.querySelectorAll(".nav-item");
  const panels = document.querySelectorAll(".content-panel");

  const navigateTo = (panelName) => {
    // Update active nav-item style
    navItems.forEach(item => {
      if (item.dataset.panel === panelName) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Toggle panel displays
    panels.forEach(panel => {
      if (panel.id === `panel-${panelName}`) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });
  };

  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo(item.dataset.panel);
    });
  });

  // Grade level card clicks on Dashboard (Auto router with preset level switch)
  document.querySelectorAll(".level-card").forEach(card => {
    card.addEventListener("click", () => {
      const level = card.dataset.level;
      // Switch chat mentor
      doubtSolver.switchMentor(level);
      // Route to solver tab
      navigateTo("doubt-solver");
    });
  });

  // Clock updates
  const timeDisplay = document.getElementById("live-time");
  const updateClock = () => {
    const now = new Date();
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const paddedHours = hours.toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    timeDisplay.innerHTML = `<span style="color: #34A853">${paddedHours}</span>:<span style="color: #FBBC05">${minutes}</span>:<span style="color: #EA4335">${seconds}</span> ${ampm}`;
  };
  setInterval(updateClock, 1000);
  updateClock();

  // Dynamic user greetings based on local time hour
  const welcomeText = document.getElementById("welcome-text");
  const hours = new Date().getHours();
  let greeting = "Hi, Scholar!";
  if (hours < 12) greeting = "Good Morning, Scholar! ☀️";
  else if (hours < 17) greeting = "Good Afternoon, Scholar! 🌤️";
  else greeting = "Good Evening, Scholar! 🌙";
  welcomeText.innerText = greeting;


});
