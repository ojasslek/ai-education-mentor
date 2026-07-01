// Educational Videos Database and Search logic

const VIDEOS_DB = [
  // Physics Wallah
  {
    id: "pw-force",
    youtubeId: "ZNzYXm103n8",
    title: "Force And Laws Of Motion - One Shot | Class 9 Physics",
    channel: "Physics Wallah",
    channelKey: "physicswallah",
    level: "high",
    subject: "Physics",
    views: "1.2M",
    duration: "45:12"
  },
  {
    id: "pw-light",
    youtubeId: "kHVAk96r05Y",
    title: "Light: Reflection & Refraction - Class 10 Full Chapter",
    channel: "Physics Wallah",
    channelKey: "physicswallah",
    level: "high",
    subject: "Physics",
    views: "2.4M",
    duration: "1:15:30"
  },
  {
    id: "pw-electricity",
    youtubeId: "EJcnBv691cY",
    title: "Electricity in One Shot - Class 10 Science",
    channel: "Physics Wallah",
    channelKey: "physicswallah",
    level: "high",
    subject: "Physics",
    views: "980K",
    duration: "58:45"
  },
  {
    id: "pw-jee-vectors",
    youtubeId: "253EkOqCrmM",
    title: "Vectors Class 11 Physics for JEE & NEET Preparation",
    channel: "Physics Wallah",
    channelKey: "physicswallah",
    level: "competitive",
    subject: "Physics",
    views: "450K",
    duration: "2:05:10"
  },
  {
    id: "pw-jee-quad",
    youtubeId: "NPFLB0Xs8Kw",
    title: "Quadratic Equations in One Shot - Class 11 JEE",
    channel: "Physics Wallah",
    channelKey: "physicswallah",
    level: "competitive",
    subject: "Maths",
    views: "350K",
    duration: "1:42:00"
  },

  // Khan Academy
  {
    id: "khan-gravity",
    youtubeId: "DFup8QRqur0",
    title: "Introduction to Gravity",
    channel: "Khan Academy",
    channelKey: "khanacademy",
    level: "high",
    subject: "Physics",
    views: "890K",
    duration: "12:35"
  },
  {
    id: "khan-photosynthesis",
    youtubeId: "-rsYk4eCKnA",
    title: "Breaking Down Photosynthesis Stages",
    channel: "Khan Academy",
    channelKey: "khanacademy",
    level: "high",
    subject: "Biology",
    views: "1.5M",
    duration: "18:22"
  },
  {
    id: "khan-algebra",
    youtubeId: "vDqOoI-4Z6M",
    title: "The Beauty of Algebra - Introduction to Algebra",
    channel: "Khan Academy",
    channelKey: "khanacademy",
    level: "high",
    subject: "Maths",
    views: "3.2M",
    duration: "14:50"
  },
  {
    id: "khan-primary-math",
    youtubeId: "JYKUfwXI55I",
    title: "Learn to Count Numbers - Khan Academy Kids",
    channel: "Khan Academy",
    channelKey: "khanacademy",
    level: "primary",
    subject: "Maths",
    views: "600K",
    duration: "8:10"
  },
  {
    id: "khan-mitosis",
    youtubeId: "LLKX_4DHE3I",
    title: "Phases of Mitosis - Cell Division Biology",
    channel: "Khan Academy",
    channelKey: "khanacademy",
    level: "high",
    subject: "Biology",
    views: "720K",
    duration: "20:15"
  },

  // CrashCourse
  {
    id: "cc-universe",
    youtubeId: "tq6be-CZJ3w",
    title: "The Big Bang: Crash Course Big History #1",
    channel: "CrashCourse",
    channelKey: "crashcourse",
    level: "primary",
    subject: "Science",
    views: "4.1M",
    duration: "10:45"
  },
  {
    id: "cc-periodic",
    youtubeId: "0RRVV4Diomg",
    title: "The Periodic Table: Crash Course Chemistry #4",
    channel: "CrashCourse",
    channelKey: "crashcourse",
    level: "high",
    subject: "Chemistry",
    views: "3.8M",
    duration: "11:22"
  },
  {
    id: "cc-dna",
    youtubeId: "8kK2zwjRV0M",
    title: "DNA Structure and Replication: Crash Course Biology #10",
    channel: "CrashCourse",
    channelKey: "crashcourse",
    level: "high",
    subject: "Biology",
    views: "5.0M",
    duration: "12:52"
  },
  {
    id: "cc-limits",
    youtubeId: "WsQQvHm4lSw",
    title: "Calculus 1 Final Review - Full Crash Course",
    channel: "CrashCourse",
    channelKey: "crashcourse",
    level: "competitive",
    subject: "Maths",
    views: "640K",
    duration: "9:40"
  },
  
  // JEE Wallah
  {
    id: "jee-wallah-integration",
    youtubeId: "7dVDuyI_8FA",
    title: "Integration in One Shot - JEE Main",
    channel: "JEE Wallah",
    channelKey: "jeewallah",
    level: "competitive",
    subject: "Maths",
    views: "1.1M",
    duration: "2:45:00"
  },
  {
    id: "jee-wallah-thermo",
    youtubeId: "NwCmoh7Vd9g",
    title: "Thermodynamics in One Shot - JEE Main",
    channel: "JEE Wallah",
    channelKey: "jeewallah",
    level: "competitive",
    subject: "Physics",
    views: "1.5M",
    duration: "2:10:00"
  },
  {
    id: "jee-wallah-kinematics",
    youtubeId: "hY9zZrYuDVk",
    title: "Kinematics in One Shot - JEE Main",
    channel: "JEE Wallah",
    channelKey: "jeewallah",
    level: "competitive",
    subject: "Physics",
    views: "1.3M",
    duration: "2:30:00"
  },
  {
    id: "jee-wallah-electricity",
    youtubeId: "eereDCe_gVw",
    title: "Current Electricity in One Shot - JEE Main",
    channel: "JEE Wallah",
    channelKey: "jeewallah",
    level: "competitive",
    subject: "Physics",
    views: "1.2M",
    duration: "2:15:00"
  },

  // Extra Channels
  {
    id: "3b1b-calc",
    youtubeId: "WUvTyaaNkzM",
    title: "The Essence of Calculus, Chapter 1",
    channel: "3Blue1Brown",
    channelKey: "3blue1brown",
    level: "competitive",
    subject: "Maths",
    views: "7.1M",
    duration: "17:05"
  },
  {
    id: "ver-radioactive",
    youtubeId: "TRL7o2kPqw0",
    title: "The Most Radioactive Places on Earth",
    channel: "Veritasium",
    channelKey: "veritasium",
    level: "high",
    subject: "Science",
    views: "23M",
    duration: "11:17"
  },
  {
    id: "cc-history",
    youtubeId: "Yocja_N5s1I",
    title: "The Agricultural Revolution: Crash Course World History",
    channel: "CrashCourse",
    channelKey: "crashcourse",
    level: "high",
    subject: "History",
    views: "13M",
    duration: "11:11"
  },
  
  // Cocomelon (Primary)
  {
    id: "coco-abc",
    youtubeId: "RIQDmnIJZv8",
    title: "ABC Song with Balloons - Learn Alphabet",
    channel: "Cocomelon",
    channelKey: "cocomelon",
    level: "primary",
    subject: "English",
    views: "500M",
    duration: "35:10"
  },
  {
    id: "coco-numbers",
    youtubeId: "a9PpVo6b7z0",
    title: "Numbers Song 1-10 - Learn to Count",
    channel: "Cocomelon",
    channelKey: "cocomelon",
    level: "primary",
    subject: "Maths",
    views: "450M",
    duration: "40:05"
  },
  {
    id: "coco-colors",
    youtubeId: "RvgnuPL9x-s",
    title: "Colors Song - Learn Colors",
    channel: "Cocomelon",
    channelKey: "cocomelon",
    level: "primary",
    subject: "Science",
    views: "300M",
    duration: "38:20"
  },
  {
    id: "coco-shapes",
    youtubeId: "uaUnTxoF4hU",
    title: "Shapes Song - Learn Shapes",
    channel: "Cocomelon",
    channelKey: "cocomelon",
    level: "primary",
    subject: "Maths",
    views: "250M",
    duration: "32:15"
  }
];

export class VideoLibrary {
  constructor() {
    this.videoGrid = document.getElementById("video-cards-grid");
    this.searchInput = document.getElementById("video-search");
    this.sourceFilter = document.getElementById("video-source-filter");
    this.levelFilter = document.getElementById("video-level-filter");
    
    // Modal player elements
    this.videoModal = document.getElementById("video-modal");
    this.videoIframe = document.getElementById("video-iframe");
    this.videoPlayerTitle = document.getElementById("video-player-title");
    this.closeVideoBtn = document.getElementById("close-video-btn");

    this.initializeUI();
  }

  initializeUI() {
    // Input/Filter listeners
    this.searchInput.addEventListener("input", () => this.renderVideos());
    this.sourceFilter.addEventListener("change", () => this.renderVideos());
    this.levelFilter.addEventListener("change", () => this.renderVideos());

    // Close Video Modal
    this.closeVideoBtn.addEventListener("click", () => this.closeVideoPlayer());
    this.videoModal.addEventListener("click", (e) => {
      if (e.target === this.videoModal) {
        this.closeVideoPlayer();
      }
    });

    this.renderVideos();
  }

  renderVideos() {
    this.videoGrid.innerHTML = "";
    const query = this.searchInput.value.trim().toLowerCase();
    const sourceVal = this.sourceFilter.value;
    const levelVal = this.levelFilter.value;

    let filtered = VIDEOS_DB.filter(v => {
      const matchQuery = v.title.toLowerCase().includes(query) || 
                         v.subject.toLowerCase().includes(query) || 
                         v.channel.toLowerCase().includes(query);
      const matchSource = sourceVal === "all" || v.channelKey === sourceVal;
      const matchLevel = levelVal === "all" || v.level === levelVal;
      return matchQuery && matchSource && matchLevel;
    });

    // If query is active and database returns nothing, render dynamic YouTube search helpers
    if (filtered.length === 0 && query.length > 0) {
      this.renderYoutubeExternalSearchCards(query);
      return;
    }

    filtered.forEach(video => {
      const card = document.createElement("div");
      card.className = "glass-card video-card";
      
      // YT High-quality thumbnail lookup
      const thumbUrl = `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;
      
      card.innerHTML = `
        <div class="video-thumbnail">
          <img src="${thumbUrl}" alt="${video.title}">
          <div class="play-overlay">
            <i class="fa-solid fa-play"></i>
          </div>
          <span class="channel-tag">${video.channel}</span>
        </div>
        <div class="video-info">
          <h4>${video.title}</h4>
          <div class="video-meta">
            <span><i class="fa-solid fa-tag"></i> ${video.subject}</span>
            <span><i class="fa-regular fa-clock"></i> ${video.duration}</span>
          </div>
        </div>
      `;

      card.addEventListener("click", () => this.playVideo(video.title, video.youtubeId));
      this.videoGrid.appendChild(card);
    });
  }

  renderYoutubeExternalSearchCards(query) {
    const channels = [
      { name: "Cocomelon", key: "Cocomelon", color: "var(--color-primary-school)" },
      { name: "Physics Wallah", key: "Physics+Wallah", color: "var(--color-primary-school)" },
      { name: "Khan Academy", key: "Khan+Academy", color: "var(--color-high-school)" },
      { name: "Crash Course", key: "CrashCourse", color: "var(--color-competitive)" }
    ];

    const noticeCard = document.createElement("div");
    noticeCard.style.gridColumn = "1 / -1";
    noticeCard.style.textAlign = "center";
    noticeCard.style.padding = "40px";
    noticeCard.innerHTML = `
      <i class="fa-solid fa-face-smile" style="font-size: 2.5rem; color: var(--text-secondary); margin-bottom: 12px; display: block;"></i>
      <h3 style="font-family: var(--font-display); margin-bottom: 8px;">No direct video matches found in local vault</h3>
      <p class="text-secondary" style="font-size: 0.9rem; margin-bottom: 24px;">Search directly on YouTube for "${query}" from top channels:</p>
      <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
        ${channels.map(c => `
          <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(query)}+${c.key}" target="_blank" class="api-status-btn" style="padding: 12px 24px; font-weight: 600;">
            <i class="fa-brands fa-youtube" style="color: #ff0000; font-size: 1.1rem;"></i> Search ${c.name}
          </a>
        `).join('')}
      </div>
    `;

    this.videoGrid.appendChild(noticeCard);
  }

  playVideo(title, youtubeId) {
    this.videoPlayerTitle.innerText = title;
    this.videoIframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
    this.videoModal.classList.add("active");
  }

  closeVideoPlayer() {
    this.videoModal.classList.remove("active");
    this.videoIframe.src = ""; // Stop audio/video playing
  }
}
