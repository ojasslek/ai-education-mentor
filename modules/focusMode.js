// Focus Mode, Pomodoro Timer & Ambient Sounds logic

const SOUND_URLS = {
  rain: "audio/rain.webm",
  forest: "audio/forest.wav",
  cafe: "audio/cafe.wav",
  jazz: "audio/jazz.webm"
};

export class FocusMode {
  constructor(appState) {
    this.appState = appState;
    
    // Timer State
    this.timeLeft = 25 * 60; // 25 minutes default
    this.totalTime = 25 * 60;
    this.timerInterval = null;
    this.isRunning = false;
    this.currentPhase = "work"; // work, short-break, long-break
    
    // Audio State
    this.audioContext = null;
    this.audioElements = {};
    this.audioNodes = {};
    this.whiteNoiseNode = null;
    this.whiteNoiseGain = null;
    
    this.initializeUI();
  }

  initializeUI() {
    // Timer Digits
    this.clockDigits = document.getElementById("timer-clock-digits");
    this.phaseTitle = document.getElementById("timer-phase-title");
    this.progressBar = document.getElementById("timer-progress");
    this.btnToggle = document.getElementById("btn-timer-toggle");
    this.btnReset = document.getElementById("btn-timer-reset");
    this.btnFullscreen = document.getElementById("btn-timer-fullscreen");
    
    // Fullscreen Overlay Elements
    this.fullscreenOverlay = document.getElementById("timer-fullscreen-overlay");
    this.overlayClockDigits = document.getElementById("overlay-clock-digits");
    this.overlayPhaseTitle = document.getElementById("overlay-phase-title");
    this.btnExitOverlay = document.getElementById("btn-exit-overlay");

    // Event Listeners for Timer
    this.btnToggle.addEventListener("click", () => this.toggleTimer());
    this.btnReset.addEventListener("click", () => this.resetTimer());
    this.btnFullscreen.addEventListener("click", () => this.enterFullscreenFocus());
    this.btnExitOverlay.addEventListener("click", () => this.exitFullscreenFocus());

    // Preset buttons
    document.querySelectorAll(".btn-preset").forEach(btn => {
      btn.addEventListener("click", () => {
        if (btn.id === "btn-custom-timer") {
          const inputEl = document.getElementById("custom-timer-input");
          const customMins = inputEl ? inputEl.value : "";
          if (customMins.trim() !== "") {
            const mins = parseInt(customMins, 10);
            if (!isNaN(mins) && mins > 0) {
              document.querySelectorAll(".btn-preset").forEach(b => b.classList.remove("active"));
              btn.classList.add("active");
              this.currentPhase = "work";
              this.setTimerDuration(mins);
            } else {
              alert("Please enter a valid number of minutes greater than 0.");
            }
          }
          return;
        }

        document.querySelectorAll(".btn-preset").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        const mins = parseInt(btn.dataset.minutes);
        this.currentPhase = btn.dataset.phase;
        
        this.setTimerDuration(mins);
      });
    });

    // Sound Controls
    document.querySelectorAll(".btn-ambient-play").forEach(btn => {
      btn.addEventListener("click", () => {
        const sound = btn.dataset.sound;
        this.toggleAmbientSound(sound, btn);
      });
    });

    document.querySelectorAll(".ambient-slider").forEach(slider => {
      slider.addEventListener("input", (e) => {
        const sound = e.target.dataset.sound;
        this.adjustVolume(sound, parseFloat(e.target.value));
      });
    });

    // Initial Progress stroke calculation
    this.updateProgressRing();
  }

  setTimerDuration(minutes) {
    this.stopTimer();
    this.timeLeft = minutes * 60;
    this.totalTime = minutes * 60;
    
    // Update Phase Titles
    const phaseLabel = this.currentPhase === "work" ? "Work Time" : (this.currentPhase === "short-break" ? "Short Break" : "Long Break");
    this.phaseTitle.innerText = phaseLabel;
    this.overlayPhaseTitle.innerText = phaseLabel;
    
    this.updateClockDisplay();
    this.updateProgressRing();
  }

  updateClockDisplay() {
    const mins = Math.floor(this.timeLeft / 60);
    const secs = this.timeLeft % 60;
    const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    this.clockDigits.innerText = formatted;
    this.overlayClockDigits.innerText = formatted;
  }

  updateProgressRing() {
    // 2 * PI * R where R = 130
    const circumference = 816;
    const progress = this.timeLeft / this.totalTime;
    const offset = circumference - (progress * circumference);
    this.progressBar.style.strokeDashoffset = offset;
  }

  toggleTimer() {
    if (this.isRunning) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    this.isRunning = true;
    this.btnToggle.innerHTML = '<i class="fa-solid fa-pause"></i>';
    this.btnToggle.classList.add("primary");

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.updateClockDisplay();
      this.updateProgressRing();

      if (this.timeLeft <= 0) {
        this.playAlarm();
        this.handlePhaseComplete();
      }
    }, 1000);
  }

  stopTimer() {
    this.isRunning = false;
    this.btnToggle.innerHTML = '<i class="fa-solid fa-play"></i>';
    clearInterval(this.timerInterval);
  }

  resetTimer() {
    this.stopTimer();
    this.timeLeft = this.totalTime;
    this.updateClockDisplay();
    this.updateProgressRing();
  }

  playAlarm() {
    // Standard system beep using AudioContext synthesizer
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, ctx.currentTime); // C5 note
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.warn("Could not trigger synthesizer alarm.", e);
    }
  }

  handlePhaseComplete() {
    this.stopTimer();
    
    if (this.currentPhase === "work") {
      this.appState.incrementStat("sessions");
      alert("🎉 Great job! Study session complete. Time to take a break!");
      
      // Auto toggle to break preset
      const shortBreakBtn = document.querySelector('.btn-preset[data-phase="short-break"]');
      if (shortBreakBtn) shortBreakBtn.click();
    } else {
      alert("💪 Break over. Ready to dive back in?");
      const workBtn = document.querySelector('.btn-preset[data-phase="work"]');
      if (workBtn) workBtn.click();
    }
  }

  enterFullscreenFocus() {
    this.fullscreenOverlay.classList.add("active");
  }

  exitFullscreenFocus() {
    this.fullscreenOverlay.classList.remove("active");
  }

  /* Audio Mixer Code */
  initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }

  toggleAmbientSound(soundName, btnElement) {
    this.initAudioContext();

    // Check if it's White Noise (Synthesized)
    if (soundName === "noise") {
      this.toggleWhiteNoise(btnElement);
      return;
    }

    let el = this.audioElements[soundName];
    const parentCard = btnElement.closest(".ambient-card");

    if (!el) {
      // Create new HTML5 Audio node
      el = new Audio(SOUND_URLS[soundName]);
      el.loop = true;
      el.volume = 0.5; // Default volume mid
      this.audioElements[soundName] = el;
    }

    if (el.paused) {
      el.play().catch(err => console.warn("Audio playback issue: ", err));
      btnElement.innerHTML = '<i class="fa-solid fa-pause"></i>';
      parentCard.classList.add("active");
    } else {
      el.pause();
      btnElement.innerHTML = '<i class="fa-solid fa-play"></i>';
      parentCard.classList.remove("active");
    }
  }

  toggleWhiteNoise(btnElement) {
    const parentCard = btnElement.closest(".ambient-card");

    if (this.whiteNoiseNode) {
      // Stop playing
      this.whiteNoiseNode.stop();
      this.whiteNoiseNode.disconnect();
      this.whiteNoiseNode = null;
      btnElement.innerHTML = '<i class="fa-solid fa-play"></i>';
      parentCard.classList.remove("active");
      return;
    }

    // Synthesize Brown/Pink noise via Web Audio API Buffer
    const bufferSize = 10 * this.audioContext.sampleRate;
    const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    // Synthesize Brown noise (deep rumbling white noise)
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // volume adjustment
    }

    this.whiteNoiseNode = this.audioContext.createBufferSource();
    this.whiteNoiseNode.buffer = noiseBuffer;
    this.whiteNoiseNode.loop = true;

    this.whiteNoiseGain = this.audioContext.createGain();
    const currentVal = parseFloat(document.querySelector('.ambient-slider[data-sound="noise"]').value);
    this.whiteNoiseGain.gain.value = currentVal;

    this.whiteNoiseNode.connect(this.whiteNoiseGain);
    this.whiteNoiseGain.connect(this.audioContext.destination);

    this.whiteNoiseNode.start(0);
    btnElement.innerHTML = '<i class="fa-solid fa-pause"></i>';
    parentCard.classList.add("active");
  }

  adjustVolume(soundName, volume) {
    if (soundName === "noise") {
      if (this.whiteNoiseGain) {
        this.whiteNoiseGain.gain.value = volume;
      }
      return;
    }

    const el = this.audioElements[soundName];
    if (el) {
      el.volume = volume;
    }
  }
}
