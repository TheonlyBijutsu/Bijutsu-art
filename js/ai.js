// ── SAKURA PARTICLE SYSTEM ──
(function() {
const canvas = document.getElementById('particle-canvas');
if (!canvas) return;
const ctx = canvas.getContext('2d');

let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
W = canvas.width = window.innerWidth;
H = canvas.height = window.innerHeight;
});

const PETAL_COUNT = 22;
const petals = [];

function makePetal() {
return {
x: Math.random() * W,
y: Math.random() * H - H,
size: 2.5 + Math.random() * 3.5,
speedY: 0.4 + Math.random() * 0.8,
speedX: -0.3 + Math.random() * 0.6,
rot: Math.random() * Math.PI * 2,
rotSpeed: 0.005 + Math.random() * 0.015,
opacity: 0.06 + Math.random() * 0.12,
wobble: Math.random() * Math.PI * 2,
wobbleSpeed: 0.01 + Math.random() * 0.02,
};
}

for (let i = 0; i < PETAL_COUNT; i++) {
const p = makePetal();
p.y = Math.random() * H;
petals.push(p);
}

function drawPetal(p) {
ctx.save();
ctx.translate(p.x, p.y);
ctx.rotate(p.rot);
ctx.globalAlpha = p.opacity;
ctx.fillStyle = '#E8A0B4';
ctx.beginPath();
ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
ctx.fill();
ctx.restore();
}

function tick() {
ctx.clearRect(0, 0, W, H);
petals.forEach(p => {
p.y += p.speedY;
p.wobble += p.wobbleSpeed;
p.x += p.speedX + Math.sin(p.wobble) * 0.3;
p.rot += p.rotSpeed;

```
  if (p.y > H + 20 || p.x < -20 || p.x > W + 20) {
    Object.assign(p, makePetal());
    p.x = Math.random() * W;
    p.y = -20;
  }

  drawPetal(p);
});

requestAnimationFrame(tick);
```

}

tick();
})();
const WORKER_URL = "https://bijutsu-ai.e-r-r-o-r-97op.workers.dev/";

const aiToggle = document.getElementById("ai-toggle");
const aiPanel = document.getElementById("ai-panel");
const aiClose = document.getElementById("ai-close");
const aiInput = document.getElementById("ai-input");
const aiSend = document.getElementById("ai-send");
const aiMessages = document.getElementById("ai-messages");

let isProcessing = false;

function addMessage(text, sender = "bot") {
  const bubble = document.createElement("div");
  bubble.className = `ai-message ${sender}`;
  bubble.textContent = text;
  aiMessages.appendChild(bubble);
  aiMessages.scrollTop = aiMessages.scrollHeight;
  return bubble;
}

function togglePanel(forceOpen = null) {
  const open = forceOpen === null
    ? !aiPanel.classList.contains("open")
    : forceOpen;

  aiPanel.classList.toggle("open", open);

  if (open && aiMessages.children.length === 0) {
    addMessage(
      "Welcome to Bijutsu Studio. Ask me about prices, delivery time, or character ideas."
    );
  }
}

async function sendAIMessage() {
  const text = aiInput.value.trim();
  if (!text || isProcessing) return;

  isProcessing = true;
  aiInput.disabled = true;
  aiSend.disabled = true;

  addMessage(text, "user");
  aiInput.value = "";

  const thinking = addMessage("Thinking...");

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text
      })
    });

    // Raw text lete hain taaki different response formats handle ho saken
    const raw = await response.text();

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      data = { reply: raw };
    }

    // Different possible response formats
    const reply =
      data.reply ||
      data.response ||
      data.answer ||
      data.result ||
      data.output ||
      (data.choices &&
        data.choices[0] &&
        data.choices[0].message &&
        data.choices[0].message.content) ||
      null;

    thinking.textContent =
      reply || "Sorry, I couldn't generate a response.";

  } catch (error) {
    thinking.textContent =
      "Connection error. Please try again.";
    console.error(error);
  } finally {
    isProcessing = false;
    aiInput.disabled = false;
    aiSend.disabled = false;
    aiInput.focus();
  }
}

aiToggle?.addEventListener("click", () => togglePanel());
aiClose?.addEventListener("click", () => togglePanel(false));
aiSend?.addEventListener("click", sendAIMessage);

aiInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendAIMessage();
  }
});
