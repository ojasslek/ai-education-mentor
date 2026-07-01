// Vault Resources logic

const RESOURCES_DB = [
  // Primary school resources
  {
    id: "res-prim-math",
    level: "primary",
    badge: "Primary Class",
    title: "Multiplication Table Tricks (1 to 10)",
    desc: "A fun and illustrated guide with visuals to master tables easily using fingers and patterns.",
    content: {
      type: "tables",
      data: [
        { topic: "The 9 Table Trick", detail: "Put your hands in front of you. To do 9 x 4, fold down your 4th finger. You have 3 fingers on the left and 6 on the right. That makes 36! 🐰✨" },
        { topic: "The 5 Table Pattern", detail: "Every answer in the 5 table ends in either 5 or 0. (5, 10, 15, 20...). It's like counting jumps of frogs! 🐸" }
      ]
    }
  },
  {
    id: "res-prim-science",
    level: "primary",
    badge: "Primary Class",
    title: "Animal Kingdom Fun Facts",
    desc: "Discover amazing facts about animals, what they eat, and how they sleep.",
    content: {
      type: "facts",
      data: [
        { topic: "Dolphins", detail: "Dolphins sleep with one eye open to watch for sharks! 🐬" },
        { topic: "Snails", detail: "A snail can sleep for 3 years without waking up! 🐌💤" }
      ]
    }
  },

  // High School
  {
    id: "res-high-electricity",
    level: "high",
    badge: "High School",
    title: "Class 10 Physics: Electricity Formula Guide",
    desc: "Quick formulas for current, resistance, Joule heating, and circuit combinations.",
    content: {
      type: "formulas",
      data: [
        { formula: "V = I * R", explanation: "Ohm's Law: The potential difference (V) is directly proportional to current (I) through a resistor (R)." },
        { formula: "Req = R1 + R2 + R3", explanation: "Equivalent Resistance in Series: Current remains constant, voltages add up." },
        { formula: "1/Req = 1/R1 + 1/R2 + 1/R3", explanation: "Equivalent Resistance in Parallel: Voltage remains constant, currents add up." }
      ]
    }
  },
  {
    id: "res-high-chem",
    level: "high",
    badge: "High School",
    title: "Class 10 Chemistry: Chemical Reactions Cheat Sheet",
    desc: "Balance equations easily. Summaries of Combination, Decomposition, and Redox reactions.",
    content: {
      type: "facts",
      data: [
        { topic: "Combination", detail: "Two reactants combine to form one product: A + B -> AB (e.g., burning magnesium in oxygen)." },
        { topic: "Decomposition", detail: "One reactant breaks down into two or more products: AB -> A + B (e.g., thermal heating of Calcium Carbonate)." },
        { topic: "Redox Reactions", detail: "Simultaneous oxidation (loss of electrons) and reduction (gain of electrons) during a chemical change." }
      ]
    }
  },

  // Competitive Exams
  {
    id: "res-comp-kinematics",
    level: "competitive",
    badge: "Competitive Exams",
    title: "Physics: Projectile Motion Shortcuts (JEE/NEET)",
    desc: "Skip long derivations. Memorize these rapid-solve shortcuts and boundary cases.",
    content: {
      type: "formulas",
      data: [
        { formula: "Rmax = u² / g", explanation: "Maximum horizontal range is achieved when projection angle θ is exactly 45°." },
        { formula: "Hmax = u² * sin²(θ) / 2g", explanation: "Maximum height equation. Horizontal velocity at peak is u*cos(θ)." },
        { formula: "T = 2u * sin(θ) / g", explanation: "Total Time of Flight. Vertical velocity becomes opposite of launch vertical velocity." }
      ]
    }
  },
  {
    id: "res-comp-goc",
    level: "competitive",
    badge: "Competitive Exams",
    title: "Organic Chemistry: GOC Acidic Strength Trends",
    desc: "Master Inductive, Mesomeric, and Hyperconjugation rules to rank acids instantly.",
    content: {
      type: "facts",
      data: [
        { topic: "-I / -M Effect", detail: "Electron withdrawing groups increase conjugate base stability, thereby significantly increasing acidic strength." },
        { topic: "Ortho Effect in Benzoic Acids", detail: "Ortho-substituted benzoic acids are almost always stronger acids than benzoic acid itself, due to steric hindrance inhibiting resonance." }
      ]
    }
  }
];

export class ResourcesVault {
  constructor() {
    this.cardsGrid = document.getElementById("resource-cards-grid");
    this.initializeUI();
  }

  initializeUI() {
    // Filter tabs click
    document.querySelectorAll(".res-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".res-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        const filterTab = btn.dataset.resTab;
        this.renderResources(filterTab);
      });
    });

    this.renderResources("all");
  }

  renderResources(filterTab) {
    this.cardsGrid.innerHTML = "";
    
    const filtered = RESOURCES_DB.filter(res => {
      return filterTab === "all" || res.level === filterTab;
    });

    filtered.forEach(res => {
      const card = document.createElement("div");
      card.className = "glass-card resource-card";
      
      card.innerHTML = `
        <span class="resource-badge">${res.badge}</span>
        <h3 style="margin-top: 14px;">${res.title}</h3>
        <p class="resource-desc">${res.desc}</p>
        <a href="#" class="resource-link">
          <span>Explore Guide</span> <i class="fa-solid fa-arrow-right"></i>
        </a>
      `;

      card.querySelector(".resource-link").addEventListener("click", (e) => {
        e.preventDefault();
        this.openResourceModal(res);
      });

      this.cardsGrid.appendChild(card);
    });
  }

  openResourceModal(res) {
    const modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay active";
    modalOverlay.id = "temp-resource-modal";
    
    let contentHtml = "";
    
    if (res.content.type === "formulas") {
      contentHtml = res.content.data.map(f => `
        <div class="formula-detail">
          <span class="formula-latex">${f.formula}</span>
          <p class="formula-explanation">${f.explanation}</p>
        </div>
      `).join('');
    } else {
      contentHtml = res.content.data.map(f => `
        <div class="formula-detail" style="border-left-color: var(--color-primary-school);">
          <strong style="color: #fff; font-size: 1rem; display: block; margin-bottom: 6px;">${f.topic}</strong>
          <p class="formula-explanation">${f.detail}</p>
        </div>
      `).join('');
    }

    modalOverlay.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>${res.title}</h3>
          <button class="btn-close-modal" id="close-temp-res-btn"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body" style="max-height: 400px; overflow-y: auto;">
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 20px;">${res.desc}</p>
          ${contentHtml}
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    // Close buttons
    const closeBtn = modalOverlay.querySelector("#close-temp-res-btn");
    closeBtn.addEventListener("click", () => {
      modalOverlay.remove();
    });
    
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.remove();
      }
    });
  }
}
