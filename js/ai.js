
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
  const open = forceOpen === null ? !aiPanel.classList.contains("open") : forceOpen;
  aiPanel.classList.toggle("open", open);
  if (open && aiMessages.children.length === 0) {
    addMessage("Welcome to Bijutsu Studio. Ask me about prices, delivery time, or character ideas.");
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
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({message: text})
    });
    const data = await response.json();
    thinking.textContent = data.reply || "No response received.";
  } catch (error) {
    thinking.textContent = "Connection error. Please try again.";
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
aiInput?.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendAIMessage();
  }
});
