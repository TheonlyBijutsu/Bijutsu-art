// 🔑 Paste your OpenRouter API key here
const OPENROUTER_API_KEY = "PASTE_YOUR_API_KEY_HERE";

const MODEL = "qwen/qwen3-4b";

function addMessage(text, type) {
  const messages = document.getElementById('ai-messages');
  if (!messages) return;

  const div = document.createElement('div');
  div.className = `ai-message ${type}`;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

async function sendAIMessage() {
  const input = document.getElementById('ai-input');
  if (!input) return;

  const message = input.value.trim();
  if (!message) return;

  addMessage(message, 'user');
  input.value = '';

  if (OPENROUTER_API_KEY === 'PASTE_YOUR_API_KEY_HERE') {
    addMessage('Please add your OpenRouter API key in js/ai.js 🔑', 'bot');
    return;
  }

  addMessage('Thinking... 🤖', 'bot');

  const messages = document.getElementById('ai-messages');
  const thinking = messages.lastElementChild;

  const systemPrompt = `You are Bijutsu AI, a helpful multilingual assistant for an anime art commission website.
You answer in English, Hindi, or Hinglish depending on the user.
You help with pricing, art suggestions, OC ideas, and commission guidance.`;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json(); 
    const reply = data.choices?.[0]?.message?.content || 'No response.';
    thinking.textContent = reply;
  } catch (error) {
    thinking.textContent = 'Error connecting to AI.';
    console.error(error);
  }
}
