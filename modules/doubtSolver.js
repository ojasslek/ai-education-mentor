// Your Professor - AI Doubt Solver logic

const PROFESSOR_CONFIG = {
  name: "Your Professor",
  avatar: "🎓",
  prompt: "You are 'Your Professor', an expert, friendly, and highly knowledgeable AI study mentor. You can help students of all levels — from primary school to competitive exam preparation. Adapt your tone and depth based on the complexity of the question asked. For simple questions, use warm and encouraging language with fun analogies. For advanced questions, provide structured formatting with headers, bullet points, formulas, step-by-step solutions, shortcuts, and common pitfalls. Always be patient, clear, and helpful. Use emojis sparingly to keep things engaging.",
  welcome: "Hello! [GEMINI_ICON] I'm **Your Professor** — your personal AI study mentor. Ask me anything: from basic concepts to competitive exam problems. I'll explain it clearly, step by step. What would you like to learn today?"
};

// Simple Markdown-like Renderer for nice visual outputs
function formatResponseText(text) {
  let html = text;

  // Escape HTML elements to prevent breakage, except safe symbols
  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Code blocks: ```js ... ```
  html = html.replace(/```(?:[a-zA-Z0-9]+)?\n([\s\S]*?)\n```/g, '<pre><code>$1</code></pre>');

  // Inline code: `code`
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Bold text: **text**
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Lists: lines starting with * or -
  html = html.replace(/^(?:\*|-)\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');

  // Line breaks
  html = html.replace(/\n/g, '<br>');

  // Custom Icons
  html = html.replace(/\[GEMINI_ICON\]/g, '<img src="images/google-gemini-icon.png" alt="Gemini" style="width: 24px; vertical-align: text-bottom; margin: 0 4px;">');

  return html;
}

// Simulated local fallback responses for offline simulator
function getSimulatedResponse(question) {
  const query = question.toLowerCase();

  const simulations = [
    { keys: ["gravity", "fall", "earth", "newton", "force"], response: "**Gravity** is one of the four fundamental forces of nature. According to **Newton's Law of Universal Gravitation**, every object with mass attracts every other object with a force:\n\n`F = G × (m₁ × m₂) / r²`\n\nWhere `G` is the gravitational constant (`6.674 × 10⁻¹¹ N·m²/kg²`).\n\n**Real-World Example:**\nWhen an apple falls from a tree, the Earth pulls the apple down, but the apple also pulls the Earth up with equal force! Because Earth is so massive, only the apple moves noticeably. 🍎\n\n**Quick Tip:** At the surface of the Earth, acceleration due to gravity is approximately `g ≈ 9.8 m/s²`." },
    { keys: ["math", "add", "count", "plus"], response: "Let's do some math! 🌟\n\n**Addition** is combining two or more numbers to find their total.\n\n**Example:** If you have 3 apples and get 2 more:\n`3 + 2 = 5` 🍎\n\n**Pro Tip:** Addition is commutative — the order doesn't matter!\n`a + b = b + a`\n\nFor larger numbers, try breaking them into tens and ones for mental math:\n`47 + 35 = (40 + 30) + (7 + 5) = 70 + 12 = 82` ✨" },
    { keys: ["sun", "hot", "light", "star"], response: "The **Sun** is a G-type main-sequence star (G2V) at the center of our solar system. ☀️\n\n**Key Facts:**\n- Surface temperature: ~5,500°C\n- Core temperature: ~15 million°C\n- Distance from Earth: ~150 million km (1 AU)\n- Energy source: Nuclear fusion (hydrogen → helium)\n\nThe Sun provides the light and heat that makes life possible on Earth through electromagnetic radiation! 🌍" },
    { keys: ["photosynthesis", "plant", "food", "chlorophyll"], response: "**Photosynthesis** is the process by which green plants convert light energy into chemical energy (glucose). 🌿\n\n**Chemical Equation:**\n`6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂`\n\n**Key Steps:**\n- **Light Reactions:** Chlorophyll absorbs sunlight, water is split, O₂ is released\n- **Calvin Cycle (Dark Reactions):** CO₂ is fixed into glucose using ATP and NADPH\n\n**Where it happens:** Chloroplasts (specifically the thylakoid membranes and stroma)" },
    { keys: ["cell", "mitochondria", "nucleus", "biology"], response: "A **cell** is the basic structural and functional unit of life. 🔬\n\n**Key Organelles:**\n- **Nucleus:** Contains DNA — the cell's control center\n- **Mitochondria:** The 'powerhouse' — produces ATP energy\n- **Ribosomes:** Protein synthesis factories\n- **Endoplasmic Reticulum:** Protein/lipid processing\n- **Cell Membrane:** Selectively permeable barrier\n\n**Fun Fact:** Your body contains approximately 37.2 trillion cells!" },
    { keys: ["quadratic", "formula", "roots", "equation"], response: "For quadratic equations of the form `ax² + bx + c = 0`:\n\n**Quadratic Formula:**\n`x = [-b ± √(b² - 4ac)] / 2a`\n\n**Key Relationships:**\n- Sum of roots (α + β): `-b/a`\n- Product of roots (α × β): `c/a`\n- Discriminant (D): `b² - 4ac`\n\n**Nature of Roots:**\n- D > 0 → Two distinct real roots\n- D = 0 → Two equal real roots\n- D < 0 → Complex/imaginary roots\n\n**Quick Trick:** If `c > 0`, both roots have the same sign. If `c < 0`, roots have opposite signs. ⚡" },
    { keys: ["projectile", "orbit", "velocity", "motion"], response: "**Projectile Motion** is the motion of an object thrown into the air, subject only to gravity.\n\n**Key Equations:**\n- **Range:** `R = u²sin(2θ) / g`\n- **Max Height:** `H = u²sin²(θ) / 2g`\n- **Time of Flight:** `T = 2u·sin(θ) / g`\n\n**Important Notes:**\n- Maximum range occurs at θ = 45°\n- At the peak, vertical velocity = 0\n- Horizontal velocity remains constant throughout\n\n**Escape Velocity:** `Ve = √(2GM/R)` ≈ 11.2 km/s for Earth 🚀" }
  ];

  // Search for matching keywords
  for (const item of simulations) {
    if (item.keys.some(k => query.includes(k))) {
      return item.response;
    }
  }

  // Default fallback
  return `Great question about "${question}"! 🎓\n\nTo give you a detailed, accurate answer, I'd recommend connecting the **Gemini API** in Settings. This will unlock real-time AI-powered responses for any topic.\n\nIn the meantime, you can also explore our **Video Lectures** section for curated educational content, or check the **Vault Resources** for free study materials.\n\n*Tip: Click the ⚙️ Gemini Settings in the sidebar to add your API key!*`;
}

export class DoubtSolver {
  constructor(appState) {
    this.appState = appState;
    this.chatHistory = [];

    this.initializeUI();
  }

  initializeUI() {
    this.chatMessagesBox = document.getElementById("chat-messages-box");
    this.doubtInputField = document.getElementById("doubt-input-field");
    this.doubtSendBtn = document.getElementById("doubt-send-btn");
    this.clearChatBtn = document.getElementById("btn-clear-chat");

    // Send button event
    this.doubtSendBtn.addEventListener("click", () => this.handleSendMessage());

    // Enter key event
    this.doubtInputField.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.handleSendMessage();
      }
    });

    // Clear chat
    this.clearChatBtn.addEventListener("click", () => this.clearChatHistory());

    // Load initial welcome message
    this.renderChat();
  }

  renderChat() {
    this.chatMessagesBox.innerHTML = "";

    if (this.chatHistory.length === 0) {
      // Add first welcome message
      this.appendMessage("ai", PROFESSOR_CONFIG.welcome);
    } else {
      this.chatHistory.forEach(msg => {
        this.appendMessage(msg.sender, msg.text, false);
      });
    }

    this.scrollToBottom();
  }

  appendMessage(sender, text, saveToHistory = true) {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${sender}`;
    bubble.innerHTML = formatResponseText(text);

    this.chatMessagesBox.appendChild(bubble);

    if (saveToHistory) {
      this.chatHistory.push({ sender, text });
    }

    this.scrollToBottom();
  }

  scrollToBottom() {
    this.chatMessagesBox.scrollTop = this.chatMessagesBox.scrollHeight;
  }

  clearChatHistory() {
    this.chatHistory = [];
    this.renderChat();
  }

  async handleSendMessage() {
    const question = this.doubtInputField.value.trim();
    if (!question) return;

    // Clear input
    this.doubtInputField.value = "";

    // Show user message
    this.appendMessage("user", question);
    this.appState.incrementStat("doubts");

    // Add typing indicator
    const typingBubble = document.createElement("div");
    typingBubble.className = "chat-bubble ai typing-indicator";
    typingBubble.innerText = "Your Professor is thinking...";
    this.chatMessagesBox.appendChild(typingBubble);
    this.scrollToBottom();

    // Fetch answer
    const answer = await this.askAI(question);

    // Remove typing indicator
    typingBubble.remove();

    // Show AI response
    this.appendMessage("ai", answer);
  }

  async askAI(question) {
    const apiKey = this.appState.getApiKey();

    if (!apiKey) {
      // Run in simulated local mode with a 1-second delay for realism
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(getSimulatedResponse(question));
        }, 1000);
      });
    }

    // Call real Google Gemini API
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: question }]
              }
            ],
            systemInstruction: {
              parts: [{ text: PROFESSOR_CONFIG.prompt }]
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Gemini API request failed:", error);
      return `❌ **Error Connecting to Gemini API:** ${error.message}\n\n*Falling back to simulator:* \n\n${getSimulatedResponse(question)}`;
    }
  }
}
