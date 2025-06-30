// Cosmic Chatbot Script
const chatbotTrigger = document.getElementById('chatbot-trigger');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.getElementById('chatbot-close');
const chatbotForm = document.getElementById('chatbot-form');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotLabel = document.getElementById('chatbot-label');

// Show chat window
chatbotTrigger.addEventListener('click', () => {
  chatbotWindow.classList.remove('chatbot-hidden');
  chatbotWindow.classList.add('chatbot-visible');
  setTimeout(() => chatbotInput.focus(), 300);
});

// Hide chat window
chatbotClose.addEventListener('click', () => {
  chatbotWindow.classList.remove('chatbot-visible');
  chatbotWindow.classList.add('chatbot-hidden');
});

// Floating label animation
setInterval(() => {
  chatbotLabel.classList.toggle('float');
}, 2000);

// Helper: Add message to chat
function addMessage(text, sender = 'user') {
  const msg = document.createElement('div');
  msg.className = 'chatbot-message ' + sender;
  msg.innerText = text;
  chatbotMessages.appendChild(msg);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Helper: Check if message is space-related
function isSpaceRelated(text) {
  const keywords = [
    'space', 'satellite', 'moon', 'sun', 'planet', 'galaxy', 'star', 'black hole',
    'astronaut', 'rocket', 'mission', 'cosmos', 'universe', 'comet', 'meteor', 'nebula', 'alien', 'aurora', 'constellation', 'eclipse', 'nasa', 'spacex', 'iss', 'telescope', 'gravity', 'orbit', 'solar', 'lunar', 'astro', 'milky way', 'andromeda', 'jupiter', 'mars', 'venus', 'mercury', 'saturn', 'uranus', 'neptune', 'pluto', 'apollo', 'voyager', 'hubble', 'james webb', 'exoplanet', 'supernova', 'pulsar', 'quasar', 'event horizon', 'cosmic', 'extraterrestrial'
  ];
  const lower = text.toLowerCase();
  return keywords.some(k => lower.includes(k));
}

// OpenAI API call
async function getAIResponse(userMsg) {
  // Replace with your OpenAI API key
  const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';
  const endpoint = 'https://api.openai.com/v1/chat/completions';
  const systemPrompt = `You are a friendly, enthusiastic space guide. Only answer questions about space science, astronomy, satellites, planets, stars, galaxies, rockets, astronauts, and related topics. If the user asks something unrelated to space, gently redirect them to ask about space. Keep your answers fun, clear, and cosmic!`;
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMsg }
  ];
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 300,
        temperature: 0.7
      })
    });
    const data = await res.json();
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content.trim();
    } else {
      return "Sorry, I couldn't reach the cosmic servers. Please try again later!";
    }
  } catch (e) {
    return "Oops! My rocket lost connection. Please check your internet and try again.";
  }
}

// Handle chat form submit
chatbotForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userMsg = chatbotInput.value.trim();
  if (!userMsg) return;
  addMessage(userMsg, 'user');
  chatbotInput.value = '';
  addMessage('...', 'bot');
  let botReply;
  if (!isSpaceRelated(userMsg)) {
    botReply = "I'm here to help with anything about space! Try asking about planets, stars, rockets, or any cosmic mystery.";
  } else {
    botReply = await getAIResponse(userMsg);
  }
  // Replace the last bot message (the '...')
  const botMsgs = chatbotMessages.querySelectorAll('.chatbot-message.bot');
  if (botMsgs.length) botMsgs[botMsgs.length - 1].innerText = botReply;
});

// Optional: Animate chat window in
chatbotWindow.addEventListener('animationend', () => {
  chatbotWindow.classList.remove('chatbot-animate');
}); 