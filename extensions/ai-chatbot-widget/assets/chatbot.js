class ChatbotWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.isOpen = false;
  }

  connectedCallback() {
    const primaryColor = this.getAttribute('data-primary-color') || '#000000';
    const botName = this.getAttribute('data-bot-name') || 'AI Assistant';
    const cssUrl = this.getAttribute('data-css-url');

    this.shadowRoot.innerHTML = `
      <style>
        @import url("${cssUrl}");
        :host {
          --primary-color: ${primaryColor};
        }
      </style>
      <div class="chatbot-wrapper">
        <button class="chatbot-trigger" aria-label="Open chat">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
        </button>

        <div class="chatbot-window" aria-hidden="true">
          <div class="chatbot-header">
            <h3>${botName}</h3>
            <button class="chatbot-close">&times;</button>
          </div>
          <div class="chatbot-messages">
            <div class="message bot">Hello! How can I help you today?</div>
          </div>
          <div class="chatbot-input">
            <input type="text" placeholder="Type a message..." />
            <button class="send-btn">Send</button>
          </div>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.chatbot-trigger').addEventListener('click', () => this.toggle());
    this.shadowRoot.querySelector('.chatbot-close').addEventListener('click', () => this.toggle());
    
    const input = this.shadowRoot.querySelector('input');
    const sendBtn = this.shadowRoot.querySelector('.send-btn');
    
    sendBtn.addEventListener('click', () => this.sendMessage());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
    const window = this.shadowRoot.querySelector('.chatbot-window');
    window.setAttribute('aria-hidden', !this.isOpen);
    window.classList.toggle('active', this.isOpen);
    if (this.isOpen) {
      this.shadowRoot.querySelector('input').focus();
    }
  }

  async sendMessage() {
    const input = this.shadowRoot.querySelector('input');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    this.addMessage(text, 'user');
    
    const typing = this.addTypingIndicator();
    
    try {
      const response = await fetch('/apps/chat-api/chat', { // Assuming app proxy or direct public API
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, shop: this.getAttribute('data-shop') })
      });
      const data = await response.json();
      typing.remove();
      this.addMessage(data.response || "I'm sorry, I encountered an error.", 'bot');
    } catch (err) {
      typing.remove();
      this.addMessage("I'm sorry, I'm having trouble connecting right now.", 'bot');
    }
  }

  addMessage(text, sender) {
    const messages = this.shadowRoot.querySelector('.chatbot-messages');
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  addTypingIndicator() {
    const messages = this.shadowRoot.querySelector('.chatbot-messages');
    const div = document.createElement('div');
    div.className = 'message bot typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }
}

if (!customElements.get('ai-chatbot-widget')) {
  customElements.define('ai-chatbot-widget', ChatbotWidget);
}
