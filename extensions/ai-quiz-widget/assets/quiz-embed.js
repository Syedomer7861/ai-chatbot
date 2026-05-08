class AIQuizWidget {
  constructor(options = {}) {
    this.shop = options.shop || document.querySelector('[data-shop]')?.getAttribute('data-shop');
    this.apiBase = options.apiBase || '';
    this.position = options.position || 'bottom-right';
    this.quiz = null;
    this.currentQuestion = 0;
    this.answers = [];
    this.isOpen = false;

    if (!this.shop) {
      console.error('AI Quiz: Shop domain required');
      return;
    }

    this.init();
  }

  async init() {
    await this.loadQuiz();
    if (this.quiz) {
      this.render();
      this.bindEvents();
    }
  }

  async loadQuiz() {
    try {
      const response = await fetch(`${this.apiBase}/apps/chat-api/quiz?shop=${this.shop}`);
      const data = await response.json();
      this.quiz = data.quiz;
    } catch (err) {
      console.error('AI Quiz: Failed to load quiz', err);
    }
  }

  render() {
    const container = document.getElementById('ai-quiz-widget');
    if (!container) return;

    const positionStyles = {
      'bottom-right': { bottom: '20px', right: '20px' },
      'bottom-left': { bottom: '20px', left: '20px' },
      'top-right': { top: '20px', right: '20px' },
      'top-left': { top: '20px', left: '20px' },
    };

    const pos = positionStyles[this.position] || positionStyles['bottom-right'];

    this.element = document.createElement('div');
    this.element.id = 'ai-quiz-container';
    this.element.innerHTML = `
      <style>
        #ai-quiz-container * {
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        #ai-quiz-trigger {
          position: fixed;
          ${pos.top || pos.bottom ? (pos.top ? `top: ${pos.top}` : `bottom: ${pos.bottom}`) : `bottom: 20px`};
          ${pos.left ? `left: ${pos.left}` : `right: ${pos.right}`};
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s, box-shadow 0.3s;
          z-index: 9999;
        }
        #ai-quiz-trigger:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
        }
        #ai-quiz-trigger svg {
          width: 28px;
          height: 28px;
          fill: white;
        }
        #ai-quiz-window {
          position: fixed;
          ${pos.top ? `top: calc(${pos.top} + 70px)` : `bottom: calc(${pos.bottom || '20px'} + 70px)`};
          ${pos.left ? `left: ${pos.left}` : `right: ${pos.right}`};
          width: 380px;
          max-width: calc(100vw - 40px);
          height: 520px;
          max-height: calc(100vh - 120px);
          background: white;
          border-radius: 16px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          display: none;
          flex-direction: column;
          overflow: hidden;
          z-index: 9998;
        }
        #ai-quiz-window.active {
          display: flex;
        }
        #ai-quiz-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          text-align: center;
        }
        #ai-quiz-header h3 {
          margin: 0 0 4px 0;
          font-size: 18px;
        }
        #ai-quiz-header p {
          margin: 0;
          font-size: 13px;
          opacity: 0.9;
        }
        #ai-quiz-progress {
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
        }
        #ai-quiz-progress-bar {
          height: 100%;
          background: white;
          transition: width 0.3s ease;
          width: 0%;
        }
        #ai-quiz-content {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }
        #ai-quiz-question {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #333;
        }
        .quiz-option {
          display: block;
          width: 100%;
          padding: 14px 16px;
          margin-bottom: 10px;
          background: #f8f9fa;
          border: 2px solid transparent;
          border-radius: 10px;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          color: #333;
        }
        .quiz-option:hover {
          background: #e9ecef;
        }
        .quiz-option.selected {
          background: #e8f4fd;
          border-color: #667eea;
          color: #667eea;
        }
        #ai-quiz-email-section {
          display: none;
          text-align: center;
          padding-top: 20px;
        }
        #ai-quiz-email-section h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
          color: #333;
        }
        #ai-quiz-email-section p {
          margin: 0 0 16px 0;
          font-size: 13px;
          color: #666;
        }
        #quiz-email-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          margin-bottom: 12px;
          font-size: 14px;
        }
        #quiz-submit-email {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }
        #ai-quiz-footer {
          padding: 16px 20px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        #ai-quiz-close {
          background: none;
          border: none;
          color: #999;
          cursor: pointer;
          font-size: 13px;
        }
        #ai-quiz-next {
          padding: 10px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          opacity: 0.5;
          transition: opacity 0.2s;
        }
        #ai-quiz-next.enabled {
          opacity: 1;
        }
        #ai-quiz-results {
          display: none;
          padding: 20px;
          text-align: center;
        }
        #ai-quiz-results h3 {
          margin: 0 0 16px 0;
          font-size: 18px;
          color: #333;
        }
        .quiz-product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }
        .quiz-product-card {
          border: 1px solid #eee;
          border-radius: 8px;
          overflow: hidden;
          text-align: left;
        }
        .quiz-product-card img {
          width: 100%;
          height: 100px;
          object-fit: cover;
        }
        .quiz-product-card h4 {
          margin: 8px;
          font-size: 12px;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .quiz-product-card p {
          margin: 0 8px 8px;
          font-size: 13px;
          font-weight: 600;
          color: #667eea;
        }
        .quiz-product-card a {
          display: block;
          margin: 0 8px 8px;
          padding: 6px;
          background: #667eea;
          color: white;
          text-align: center;
          border-radius: 4px;
          text-decoration: none;
          font-size: 11px;
        }
        #quiz-restart {
          padding: 10px 20px;
          background: #f1f1f1;
          border: none;
          border-radius: 20px;
          font-size: 13px;
          cursor: pointer;
        }
        @media (max-width: 480px) {
          #ai-quiz-window {
            width: calc(100vw - 20px);
            ${pos.top ? `top: 10px` : `bottom: 70px`};
            ${pos.left ? `left: 10px` : `right: 10px`};
          }
        }
      </style>
      <button id="ai-quiz-trigger" aria-label="Start Quiz">
        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
      </button>
      <div id="ai-quiz-window">
        <div id="ai-quiz-header">
          <h3>${this.quiz?.title || 'Product Quiz'}</h3>
          <p>${this.quiz?.description || 'Find your perfect match'}</p>
          <div id="ai-quiz-progress"><div id="ai-quiz-progress-bar"></div></div>
        </div>
        <div id="ai-quiz-content">
          <div id="ai-quiz-question-section">
            <div id="ai-quiz-question"></div>
            <div id="ai-quiz-options"></div>
          </div>
          <div id="ai-quiz-email-section">
            <h4>Get Your Personalized Results</h4>
            <p>Enter your email to see your recommended products</p>
            <input type="email" id="quiz-email-input" placeholder="your@email.com" />
            <button id="quiz-submit-email">See My Results</button>
          </div>
          <div id="ai-quiz-results">
            <h3>Your Perfect Matches!</h3>
            <div class="quiz-product-grid" id="quiz-products"></div>
            <button id="quiz-restart">Take Quiz Again</button>
          </div>
        </div>
        <div id="ai-quiz-footer">
          <button id="ai-quiz-close">Close</button>
          <button id="ai-quiz-next">Next</button>
        </div>
      </div>
    `;

    container.appendChild(this.element);
  }

  bindEvents() {
    const trigger = document.getElementById('ai-quiz-trigger');
    const closeBtn = document.getElementById('ai-quiz-close');
    const nextBtn = document.getElementById('ai-quiz-next');
    const submitEmail = document.getElementById('quiz-submit-email');
    const restartBtn = document.getElementById('quiz-restart');

    trigger?.addEventListener('click', () => this.open());
    closeBtn?.addEventListener('click', () => this.close());
    nextBtn?.addEventListener('click', () => this.nextQuestion());
    submitEmail?.addEventListener('click', () => this.submitEmail());
    restartBtn?.addEventListener('click', () => this.restart());

    this.showQuestion(0);
  }

  open() {
    document.getElementById('ai-quiz-window')?.classList.add('active');
    this.isOpen = true;
  }

  close() {
    document.getElementById('ai-quiz-window')?.classList.remove('active');
    this.isOpen = false;
  }

  showQuestion(index) {
    if (!this.quiz?.questions?.length) return;

    const question = this.quiz.questions[index];
    if (!question) return this.showEmailCapture();

    const questionEl = document.getElementById('ai-quiz-question');
    const optionsEl = document.getElementById('ai-quiz-options');
    const progressBar = document.getElementById('ai-quiz-progress-bar');
    const nextBtn = document.getElementById('ai-quiz-next');

    questionEl.textContent = question.question;
    progressBar.style.width = `${((index) / this.quiz.questions.length) * 100}%`;

    const options = question.options || [];
    optionsEl.innerHTML = options.map((opt: any, i: number) => `
      <button class="quiz-option" data-index="${i}" data-value="${opt.text}">
        ${opt.text}
      </button>
    `).join('');

    optionsEl.querySelectorAll('.quiz-option').forEach((btn) => {
      btn.addEventListener('click', (e) => this.selectOption(e, question.id));
    });

    nextBtn.classList.toggle('enabled', this.hasAnswerForQuestion(question.id));

    document.getElementById('ai-quiz-question-section').style.display = 'block';
    document.getElementById('ai-quiz-email-section').style.display = 'none';
    document.getElementById('ai-quiz-results').style.display = 'none';
    nextBtn.textContent = index === this.quiz.questions.length - 1 ? 'Finish' : 'Next';
  }

  selectOption(e: Event, questionId: string) {
    const btn = e.target as HTMLElement;
    const value = btn.getAttribute('data-value');
    const index = parseInt(btn.getAttribute('data-index') || '0');
    const question = this.quiz.questions.find((q: any) => q.id === questionId);

    if (question?.type === 'multiple') {
      btn.classList.toggle('selected');
      const existing = this.answers.find((a) => a.questionId === questionId);
      if (existing) {
        if (btn.classList.contains('selected')) {
          existing.selectedOptions.push(value);
        } else {
          existing.selectedOptions = existing.selectedOptions.filter((o: string) => o !== value);
        }
      } else {
        this.answers.push({ questionId, selectedOptions: [value] });
      }
    } else {
      document.querySelectorAll('.quiz-option').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      this.answers = this.answers.filter((a) => a.questionId !== questionId);
      this.answers.push({ questionId, selectedOptions: [value] });
    }

    const nextBtn = document.getElementById('ai-quiz-next');
    nextBtn.classList.toggle('enabled', this.hasAnswerForQuestion(questionId));
  }

  hasAnswerForQuestion(questionId: string): boolean {
    const answer = this.answers.find((a) => a.questionId === questionId);
    return answer && answer.selectedOptions.length > 0;
  }

  nextQuestion() {
    const currentQ = this.quiz.questions[this.currentQuestion];
    if (!this.hasAnswerForQuestion(currentQ.id)) return;

    this.currentQuestion++;

    if (this.currentQuestion >= this.quiz.questions.length) {
      this.showEmailCapture();
    } else {
      this.showQuestion(this.currentQuestion);
    }
  }

  showEmailCapture() {
    const progressBar = document.getElementById('ai-quiz-progress-bar');
    progressBar.style.width = '100%';

    document.getElementById('ai-quiz-question-section').style.display = 'none';
    document.getElementById('ai-quiz-email-section').style.display = 'block';
    document.getElementById('ai-quiz-results').style.display = 'none';
    document.getElementById('ai-quiz-next').style.display = 'none';
  }

  async submitEmail() {
    const emailInput = document.getElementById('quiz-email-input') as HTMLInputElement;
    const email = emailInput?.value;

    if (email && !email.includes('@')) {
      alert('Please enter a valid email');
      return;
    }

    try {
      const response = await fetch(`${this.apiBase}/apps/chat-api/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: this.quiz.id,
          answers: this.answers,
          email: email || null,
          shop: this.shop,
        }),
      });

      const data = await response.json();

      if (data.success) {
        this.showResults(data.products || []);
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
      this.showResults([]);
    }
  }

  showResults(products: any[]) {
    document.getElementById('ai-quiz-question-section').style.display = 'none';
    document.getElementById('ai-quiz-email-section').style.display = 'none';
    document.getElementById('ai-quiz-results').style.display = 'block';
    document.getElementById('ai-quiz-next').style.display = 'none';

    const productsEl = document.getElementById('quiz-products');
    if (products.length === 0) {
      productsEl.innerHTML = '<p style="grid-column: span 2; color: #666;">No products found. Try again later!</p>';
    } else {
      productsEl.innerHTML = products.slice(0, 4).map((p: any) => `
        <div class="quiz-product-card">
          <img src="${p.featuredImage || 'https://via.placeholder.com/150'}" alt="${p.title}" />
          <h4>${p.title}</h4>
          <p>${p.price || ''} ${p.currencyCode || ''}</p>
          <a href="/products/${p.handle}">View Product</a>
        </div>
      `).join('');
    }
  }

  restart() {
    this.currentQuestion = 0;
    this.answers = [];
    document.getElementById('ai-quiz-next').style.display = 'block';
    this.showQuestion(0);
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('ai-quiz-widget');
    if (container) {
      new AIQuizWidget({
        shop: container.getAttribute('data-shop'),
        apiBase: '',
        position: 'bottom-right',
      });
    }
  });
}

export default AIQuizWidget;