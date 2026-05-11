let knowledge = "";

const files = [
  'data/pricing.txt',
  'data/faq.txt',
  'data/portfolio.txt'
];

async function loadKnowledge() {
  for (const file of files) {
    try {
      const response = await fetch(file);
      const text = await response.text();
      knowledge += text + "\n";
    } catch (error) {
      console.error('Could not load', file);
    }
  }
}

function askAI() {
  const input = document.getElementById('user-input').value.toLowerCase();
  const output = document.getElementById('chat-output');

  if (!input.trim()) {
    output.textContent = 'Please type a question.';
    return;
  }

  if (input.includes('price') || input.includes('cost') || input.includes('rate')) {
    output.textContent = knowledge || 'Pricing data is loading...';
  } else if (input.includes('delivery')) {
    output.textContent = 'Starter orders usually take 2–3 days. More detailed work may take longer.';
  } else if (input.includes('hello') || input.includes('hi')) {
    output.textContent = 'Hello! Welcome to Bijutsu Studio 🎨✨';
  } else {
    output.textContent = 'I can answer questions about prices, services, and delivery times.';
  }
}

loadKnowledge();
