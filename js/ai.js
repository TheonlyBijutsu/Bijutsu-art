const WORKER_URL = 'https://bijutsu-ai.e-r-r-o-r-97op.workers.dev/';

const aiToggle = document.getElementById('ai-toggle');
const aiPanel = document.getElementById('ai-panel');
const aiClose = document.getElementById('ai-close');
const aiInput = document.getElementById('ai-input');
const aiSend = document.getElementById('ai-send');
const aiMessages = document.getElementById('ai-messages');

let isProcessing = false;

function addMessage(text, sender = 'bot') {
  const div = document.createElement('div');
  div.className = `ai-message ${sender}`;
  div.textContent = text;
  aiMessages.appendChild(div);
  aiMessages.scrollTop = aiMessages.scrollHeight;
  return div;
}

if (aiToggle) {
  aiToggle.addEventListener('click', () => {
    aiPanel.classList.toggle('open');
    if (aiMessages && aiMessages.children.length === 0) {
      addMessage("Hi! I'm Bijutsu AI 🎨 Ask me about pricing, OC design and delivery.");
    }
  });
}

if (aiClose) {
  aiClose.addEventListener('click', () => aiPanel.classList.remove('open'));
}

async function sendAIMessage() {
  const text = aiInput.value.trim();
  if (!text || isProcessing) return;

  isProcessing = true;
  aiInput.disabled = true;
  aiSend.disabled = true;

  addMessage(text, 'user');
  aiInput.value = '';

  const thinking = addMessage('Bijutsu AI is sketching... ✏️');

  try {
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();
    thinking.textContent = data.reply || 'No response.';
  } catch (err) {
    thinking.textContent = 'Connection error. Please try again.';
    console.error(err);
  } finally {
    isProcessing = false;
    aiInput.disabled = false;
    aiSend.disabled = false;
    aiInput.focus();
  }
}

if (aiSend) aiSend.addEventListener('click', sendAIMessage);

if (aiInput) {
  aiInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendAIMessage();
    }
  });
}
