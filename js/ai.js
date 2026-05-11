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
