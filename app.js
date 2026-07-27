// Irregular Verb Master Application Logic

// Verb Database (50 Common English Irregular Verbs)
const verbDataset = [
  { base: "be", past: "was", pp: "been", meaning: "~이다, 있다" },
  { base: "become", past: "became", pp: "become", meaning: "~이 되다" },
  { base: "begin", past: "began", pp: "begun", meaning: "시작하다" },
  { base: "break", past: "broke", pp: "broken", meaning: "깨뜨리다, 부수다" },
  { base: "bring", past: "brought", pp: "brought", meaning: "가져오다" },
  { base: "build", past: "built", pp: "built", meaning: "짓다, 세우다" },
  { base: "buy", past: "bought", pp: "bought", meaning: "사다" },
  { base: "catch", past: "caught", pp: "caught", meaning: "잡다" },
  { base: "choose", past: "chose", pp: "chosen", meaning: "선택하다" },
  { base: "come", past: "came", pp: "come", meaning: "오다" },
  { base: "cut", past: "cut", pp: "cut", meaning: "자르다" },
  { base: "do", past: "did", pp: "done", meaning: "하다" },
  { base: "draw", past: "drew", pp: "drawn", meaning: "그리다" },
  { base: "drink", past: "drank", pp: "drunk", meaning: "마시다" },
  { base: "drive", past: "drove", pp: "driven", meaning: "운전하다" },
  { base: "eat", past: "ate", pp: "eaten", meaning: "먹다" },
  { base: "fall", past: "fell", pp: "fallen", meaning: "떨어지다" },
  { base: "feel", past: "felt", pp: "felt", meaning: "느끼다" },
  { base: "fight", past: "fought", pp: "fought", meaning: "싸우다" },
  { base: "find", past: "found", pp: "found", meaning: "찾다" },
  { base: "fly", past: "flew", pp: "flown", meaning: "날다" },
  { base: "forget", past: "forgot", pp: "forgotten", meaning: "잊다" },
  { base: "get", past: "got", pp: "gotten", meaning: "얻다, 받다" },
  { base: "give", past: "gave", pp: "given", meaning: "주다" },
  { base: "go", past: "went", pp: "gone", meaning: "가다" },
  { base: "grow", past: "grew", pp: "grown", meaning: "자라다, 기르다" },
  { base: "have", past: "had", pp: "had", meaning: "가지다" },
  { base: "hear", past: "heard", pp: "heard", meaning: "듣다" },
  { base: "hide", past: "hid", pp: "hidden", meaning: "숨기다" },
  { base: "hit", past: "hit", pp: "hit", meaning: "치다, 때리다" },
  { base: "hold", past: "held", pp: "held", meaning: "잡다, 쥐다" },
  { base: "hurt", past: "hurt", pp: "hurt", meaning: "다치게 하다" },
  { base: "keep", past: "kept", pp: "kept", meaning: "유지하다, 보관하다" },
  { base: "know", past: "knew", pp: "known", meaning: "알다" },
  { base: "leave", past: "left", pp: "left", meaning: "떠나다, 남기다" },
  { base: "lend", past: "lent", pp: "lent", meaning: "빌려주다" },
  { base: "lose", past: "lost", pp: "lost", meaning: "잃다" },
  { base: "make", past: "made", pp: "made", meaning: "만들다" },
  { base: "meet", past: "met", pp: "met", meaning: "만나다" },
  { base: "pay", past: "paid", pp: "paid", meaning: "지불하다" },
  { base: "put", past: "put", pp: "put", meaning: "놓다, 두다" },
  { base: "read", past: "read", pp: "read", meaning: "읽다" },
  { base: "ride", past: "rode", pp: "ridden", meaning: "타다" },
  { base: "run", past: "ran", pp: "run", meaning: "달리다" },
  { base: "say", past: "said", pp: "said", meaning: "말하다" },
  { base: "see", past: "saw", pp: "seen", meaning: "보다" },
  { base: "sell", past: "sold", pp: "sold", meaning: "팔다" },
  { base: "send", past: "sent", pp: "sent", meaning: "보내다" },
  { base: "sing", past: "sang", pp: "sung", meaning: "노래하다" },
  { base: "sleep", past: "slept", pp: "slept", meaning: "자다" }
];

// Supabase public client configuration
const SUPABASE_URL = 'https://vatttnvvglzlgwrrlkrc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhdHR0bnZ2Z2x6bGd3cnJsa3JjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3MTMyNDMsImV4cCI6MjEwMDI4OTI0M30.LDTH1o40PL9ysnIWzmjpJCeQD1wV88T6YnAL2aKfNpg';
const COMMENTS_ENDPOINT = `${SUPABASE_URL}/rest/v1/comments`;

function supabaseHeaders(extraHeaders = {}) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    ...extraHeaders
  };
}

// App State
let state = {
  learned: new Set(),     // Stored as base verbs
  starred: new Set(),     // Stored as base verbs
  incorrect: new Set(),   // Stored as base verbs
  studyCount: {},         // Verb study counts: { baseVerb: count }
  comments: [],           // { id, author, content, created_at }
  studyList: [...verbDataset],
  studyIndex: 0,
  studyFilter: 'all',     // 'all', 'unlearned', 'starred'
  
  // Quiz states
  quizQuestions: [],
  quizIndex: 0,
  quizTimerId: null,
  quizTimeSeconds: 0,
  quizCorrectCount: 0,
  quizWrongList: [],      // array of objects: { verb, userPast, userPP, isCorrectPast, isCorrectPP }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
  initNavigation();
  initStudyTab();
  initWordListTab();
  initQuizTab();
  initBookmarksTab();
  initCommentsTab();
  updateGlobalProgress();
  
  // Re-run lucide icons to replace elements
  lucide.createIcons();
});

// Load / Save Local Storage
function loadFromLocalStorage() {
  try {
    const savedLearned = localStorage.getItem('master_learned');
    if (savedLearned) state.learned = new Set(JSON.parse(savedLearned));
    
    const savedStarred = localStorage.getItem('master_starred');
    if (savedStarred) state.starred = new Set(JSON.parse(savedStarred));
    
    const savedIncorrect = localStorage.getItem('master_incorrect');
    if (savedIncorrect) state.incorrect = new Set(JSON.parse(savedIncorrect));

    const savedStudyCount = localStorage.getItem('master_study_count');
    if (savedStudyCount) state.studyCount = JSON.parse(savedStudyCount);
    else state.studyCount = {};

  } catch (e) {
    console.error("Local storage loading error", e);
    state.studyCount = {};
  }
}

function saveToLocalStorage() {
  try {
    localStorage.setItem('master_learned', JSON.stringify([...state.learned]));
    localStorage.setItem('master_starred', JSON.stringify([...state.starred]));
    localStorage.setItem('master_incorrect', JSON.stringify([...state.incorrect]));
    localStorage.setItem('master_study_count', JSON.stringify(state.studyCount || {}));
  } catch (e) {
    console.error("Local storage saving error", e);
  }
}

// Navigation Tabs
function initNavigation() {
  const tabs = document.querySelectorAll('.nav-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const targetTab = tab.getAttribute('data-tab');
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(`tab-${targetTab}`).classList.add('active');
      
      // Stop quiz if leaving quiz tab
      if (targetTab !== 'quiz') {
        resetQuizState();
      }
      
      // Render word list when opening wordlist tab
      if (targetTab === 'wordlist') {
        renderWordList();
      }
      
      // Render bookmarks when opening bookmark tab
      if (targetTab === 'bookmarks') {
        renderBookmarksList();
      }
    });
  });
}

// Global Progress Header
function updateGlobalProgress() {
  const totalCount = verbDataset.length;
  const learnedCount = state.learned.size;
  document.getElementById('learned-count').textContent = `${learnedCount} / ${totalCount}`;
  
  const percentage = Math.round((learnedCount / totalCount) * 100);
  document.getElementById('overall-progress').style.width = `${percentage}%`;
}

// STUDY TAB LOGIC
function initStudyTab() {
  const flashcard = document.getElementById('flashcard');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnMarkLearned = document.getElementById('btn-mark-learned');
  
  // Card elements
  const btnStarFront = document.getElementById('btn-star');
  const btnStarBack = document.getElementById('btn-star-back');
  const btnSpeakFront = document.getElementById('btn-speak');
  const btnSpeakBack = document.getElementById('btn-speak-back');
  
  // Flashcard flipping
  flashcard.addEventListener('click', (e) => {
    // Avoid flipping when clicking action buttons on the card
    if (e.target.closest('.star-btn') || e.target.closest('.audio-btn')) {
      return;
    }
    flashcard.classList.toggle('flipped');
  });

  // Next / Prev buttons
  btnPrev.addEventListener('click', () => {
    if (state.studyList.length === 0) return;
    flashcard.classList.remove('flipped');
    setTimeout(() => {
      state.studyIndex = (state.studyIndex - 1 + state.studyList.length) % state.studyList.length;
      renderCurrentCard();
    }, 150);
  });

  btnNext.addEventListener('click', () => {
    if (state.studyList.length === 0) return;
    flashcard.classList.remove('flipped');
    setTimeout(() => {
      state.studyIndex = (state.studyIndex + 1) % state.studyList.length;
      renderCurrentCard();
    }, 150);
  });

  // Learned status toggle
  btnMarkLearned.addEventListener('click', () => {
    if (state.studyList.length === 0) return;
    const currentVerb = state.studyList[state.studyIndex];
    if (state.learned.has(currentVerb.base)) {
      state.learned.delete(currentVerb.base);
    } else {
      state.learned.add(currentVerb.base);
    }
    saveToLocalStorage();
    updateGlobalProgress();
    updateMarkLearnedButton();
  });

  // Star / Bookmark toggle
  [btnStarFront, btnStarBack].forEach(btn => {
    btn.addEventListener('click', () => {
      if (state.studyList.length === 0) return;
      const currentVerb = state.studyList[state.studyIndex];
      if (state.starred.has(currentVerb.base)) {
        state.starred.delete(currentVerb.base);
      } else {
        state.starred.add(currentVerb.base);
      }
      saveToLocalStorage();
      updateStarredButtons();
    });
  });

  // Audio / TTS Feature
  [btnSpeakFront, btnSpeakBack].forEach(btn => {
    btn.addEventListener('click', () => {
      if (state.studyList.length === 0) return;
      const currentVerb = state.studyList[state.studyIndex];
      speakVerbConjugation(currentVerb);
    });
  });

  // Filters (All, Unlearned, Starred)
  const filters = [
    { id: 'study-filter-all', type: 'all' },
    { id: 'study-filter-unlearned', type: 'unlearned' },
    { id: 'study-filter-starred', type: 'starred' }
  ];
  
  filters.forEach(filter => {
    document.getElementById(filter.id).addEventListener('click', (e) => {
      filters.forEach(f => document.getElementById(f.id).classList.remove('active'));
      e.target.classList.add('active');
      state.studyFilter = filter.type;
      applyStudyFilter();
    });
  });

  // Initial render
  applyStudyFilter();
}

function applyStudyFilter() {
  if (state.studyFilter === 'all') {
    state.studyList = [...verbDataset];
  } else if (state.studyFilter === 'unlearned') {
    state.studyList = verbDataset.filter(v => !state.learned.has(v.base));
  } else if (state.studyFilter === 'starred') {
    state.studyList = verbDataset.filter(v => state.starred.has(v.base));
  }
  
  state.studyIndex = 0;
  
  // Render card or empty state
  const container = document.getElementById('flashcard-container');
  const actionWrapper = document.querySelector('.study-actions');
  
  if (state.studyList.length === 0) {
    container.style.opacity = '0.5';
    actionWrapper.style.opacity = '0.3';
    
    document.getElementById('card-base').textContent = "조건에 맞는 단어가 없습니다";
    document.querySelector('.verb-tip').textContent = "다른 필터를 선택해 주세요";
  } else {
    container.style.opacity = '1';
    actionWrapper.style.opacity = '1';
    renderCurrentCard();
  }
}

function renderCurrentCard() {
  if (state.studyList.length === 0) return;
  const verb = state.studyList[state.studyIndex];
  
  // Increment study count when card is viewed
  incrementStudyCount(verb.base);
  
  // Indexes
  const idxString = `${state.studyIndex + 1} / ${state.studyList.length}`;
  document.getElementById('card-index').textContent = idxString;
  document.getElementById('card-index-back').textContent = idxString;
  
  // Base Text Front
  document.getElementById('card-base').textContent = verb.base;
  
  // Back card text
  document.getElementById('card-back-base').textContent = verb.base;
  document.getElementById('card-back-past').textContent = verb.past;
  document.getElementById('card-back-pp').textContent = verb.pp;
  document.getElementById('card-meaning').textContent = verb.meaning;
  
  // Update button active states
  updateStarredButtons();
  updateMarkLearnedButton();
}

function updateStarredButtons() {
  if (state.studyList.length === 0) return;
  const currentVerb = state.studyList[state.studyIndex];
  const isStarred = state.starred.has(currentVerb.base);
  
  const iconFront = document.getElementById('btn-star');
  const iconBack = document.getElementById('btn-star-back');
  
  if (isStarred) {
    iconFront.classList.add('active');
    iconBack.classList.add('active');
    iconFront.innerHTML = '<i data-lucide="star" fill="#fbbf24" stroke="#fbbf24"></i>';
    iconBack.innerHTML = '<i data-lucide="star" fill="#fbbf24" stroke="#fbbf24"></i>';
  } else {
    iconFront.classList.remove('active');
    iconBack.classList.remove('active');
    iconFront.innerHTML = '<i data-lucide="star"></i>';
    iconBack.innerHTML = '<i data-lucide="star"></i>';
  }
  lucide.createIcons();
}

function updateMarkLearnedButton() {
  if (state.studyList.length === 0) return;
  const currentVerb = state.studyList[state.studyIndex];
  const isLearned = state.learned.has(currentVerb.base);
  const btn = document.getElementById('btn-mark-learned');
  
  if (isLearned) {
    btn.classList.add('completed');
    btn.innerHTML = '<i data-lucide="check-circle-2"></i> 완암기 완료!';
  } else {
    btn.classList.remove('completed');
    btn.innerHTML = '<i data-lucide="circle"></i> 외웠어요';
  }
  lucide.createIcons();
}

// Speak Conjugation via Web Speech API
function speakVerbConjugation(verb) {
  if ('speechSynthesis' in window) {
    // Cancel ongoing synthesis
    window.speechSynthesis.cancel();
    
    // We will speak "Base", then "Past", then "Past Participle"
    const textToSpeak = `${verb.base}, ${verb.past}, ${verb.pp}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US';
    utterance.rate = 0.85; // Slightly slower for clarity
    window.speechSynthesis.speak(utterance);
  } else {
    alert("이 브라우저는 음성 재생(TTS)을 지원하지 않습니다.");
  }
}


// QUIZ TAB LOGIC
function initQuizTab() {
  // Toggle configuration button groups
  const setupToggleGroups = ['quiz-question-count', 'quiz-filter-type'];
  setupToggleGroups.forEach(groupId => {
    const buttons = document.querySelectorAll(`#${groupId} .btn-toggle`);
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });

  // Buttons
  document.getElementById('btn-start-quiz').addEventListener('click', startQuiz);
  document.getElementById('btn-submit-answer').addEventListener('click', handleQuizSubmit);
  document.getElementById('btn-skip-quiz').addEventListener('click', showQuizSetup);
  document.getElementById('btn-quiz-retry').addEventListener('click', () => {
    resetQuizState();
    startQuiz();
  });
  document.getElementById('btn-go-study').addEventListener('click', () => {
    resetQuizState();
    document.getElementById('btn-tab-study').click();
  });
  
  // Enter key support in input fields
  const inputs = [document.getElementById('quiz-input-past'), document.getElementById('quiz-input-pp')];
  inputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleQuizSubmit();
      }
    });
  });
}

function startQuiz() {
  // 1. Determine size and filters
  const activeCountBtn = document.querySelector('#quiz-question-count .btn-toggle.active');
  const activeFilterBtn = document.querySelector('#quiz-filter-type .btn-toggle.active');
  
  const countVal = activeCountBtn.getAttribute('data-value'); // '10', '20', 'all'
  const filterVal = activeFilterBtn.getAttribute('data-value'); // 'all', 'unlearned', 'starred'
  
  // 2. Filter dataset
  let candidates = [...verbDataset];
  if (filterVal === 'unlearned') {
    candidates = verbDataset.filter(v => !state.learned.has(v.base));
  } else if (filterVal === 'starred') {
    candidates = verbDataset.filter(v => state.starred.has(v.base));
  }
  
  // If we selected filtered options but have no verbs, fall back to entire database
  if (candidates.length === 0) {
    alert("지정한 필터 기준에 맞는 단어가 부족하여 전체 단어로 테스트를 시작합니다.");
    candidates = [...verbDataset];
  }
  
  // Shuffle candidates
  candidates.sort(() => Math.random() - 0.5);
  
  // Slice to correct length
  let finalCount = candidates.length;
  if (countVal === '10') finalCount = Math.min(10, candidates.length);
  else if (countVal === '20') finalCount = Math.min(20, candidates.length);
  
  state.quizQuestions = candidates.slice(0, finalCount);
  state.quizIndex = 0;
  state.quizCorrectCount = 0;
  state.quizWrongList = [];
  state.quizTimeSeconds = 0;
  
  // Switch Views
  document.getElementById('quiz-setup-view').classList.add('hidden');
  document.getElementById('quiz-active-view').classList.remove('hidden');
  document.getElementById('quiz-result-view').classList.add('hidden');
  
  // Start Timer
  startQuizTimer();
  
  // Render First Question
  renderQuizQuestion();
}

function startQuizTimer() {
  clearInterval(state.quizTimerId);
  const timerElement = document.getElementById('quiz-timer');
  timerElement.textContent = "00:00";
  
  state.quizTimerId = setInterval(() => {
    state.quizTimeSeconds++;
    const mins = String(Math.floor(state.quizTimeSeconds / 60)).padStart(2, '0');
    const secs = String(state.quizTimeSeconds % 60).padStart(2, '0');
    timerElement.textContent = `${mins}:${secs}`;
  }, 1000);
}

function renderQuizQuestion() {
  const currentVerb = state.quizQuestions[state.quizIndex];
  
  // Increment study count when question is presented
  incrementStudyCount(currentVerb.base);
  
  // Progress indicators
  document.getElementById('quiz-progress-text').textContent = `문제 ${state.quizIndex + 1} / ${state.quizQuestions.length}`;
  const progressPercent = ((state.quizIndex + 1) / state.quizQuestions.length) * 100;
  document.getElementById('quiz-progress-fill').style.width = `${progressPercent}%`;
  
  // Set question values
  document.getElementById('quiz-base-verb').textContent = currentVerb.base;
  document.getElementById('quiz-verb-meaning').textContent = `뜻: ${currentVerb.meaning}`;
  
  // Reset Input fields
  const pastInput = document.getElementById('quiz-input-past');
  const ppInput = document.getElementById('quiz-input-pp');
  pastInput.value = "";
  ppInput.value = "";
  pastInput.disabled = false;
  ppInput.disabled = false;
  
  // Remove feedback classes
  pastInput.className = "";
  ppInput.className = "";
  document.getElementById('feedback-past').className = "feedback-icon";
  document.getElementById('feedback-pp').className = "feedback-icon";
  document.getElementById('quiz-feedback-banner').className = "quiz-feedback-banner hidden";
  
  // Set submit button text
  document.getElementById('btn-submit-answer').textContent = "제출하기";
  
  // Focus on first input
  pastInput.focus();
}

function handleQuizSubmit() {
  const submitBtn = document.getElementById('btn-submit-answer');
  const currentVerb = state.quizQuestions[state.quizIndex];
  const pastInput = document.getElementById('quiz-input-past');
  const ppInput = document.getElementById('quiz-input-pp');
  
  // If the button is in "Next" state, click goes to next question
  if (submitBtn.textContent === "다음 문제" || submitBtn.textContent === "결과 보기") {
    goToNextQuestion();
    return;
  }
  
  // Get answers and normalize
  const userPast = pastInput.value.trim().toLowerCase();
  const userPP = ppInput.value.trim().toLowerCase();
  
  // Simple validation
  if (!userPast || !userPP) {
    alert("두 입력 칸 모두 채워주세요!");
    return;
  }
  
  const isPastCorrect = (userPast === currentVerb.past.toLowerCase());
  const isPPCorrect = (userPP === currentVerb.pp.toLowerCase());
  const isFullyCorrect = isPastCorrect && isPPCorrect;
  
  // Check and lock input fields
  pastInput.disabled = true;
  ppInput.disabled = true;
  
  // Render input indicators
  const fp = document.getElementById('feedback-past');
  const fpp = document.getElementById('feedback-pp');
  
  if (isPastCorrect) {
    pastInput.classList.add('correct');
    fp.innerHTML = '<i data-lucide="check" class="feedback-icon correct"></i>';
  } else {
    pastInput.classList.add('incorrect');
    fp.innerHTML = '<i data-lucide="x" class="feedback-icon incorrect"></i>';
  }
  
  if (isPPCorrect) {
    ppInput.classList.add('correct');
    fpp.innerHTML = '<i data-lucide="check" class="feedback-icon correct"></i>';
  } else {
    ppInput.classList.add('incorrect');
    fpp.innerHTML = '<i data-lucide="x" class="feedback-icon incorrect"></i>';
  }
  lucide.createIcons();
  
  // Update scoreboard / track mistakes
  const feedbackBanner = document.getElementById('quiz-feedback-banner');
  const correctAnswerText = document.getElementById('quiz-correct-answer-text');
  
  feedbackBanner.classList.remove('hidden');
  
  if (isFullyCorrect) {
    state.quizCorrectCount++;
    feedbackBanner.className = "quiz-feedback-banner correct";
    document.getElementById('quiz-feedback-text').textContent = "정답입니다! 참 잘했어요!";
    correctAnswerText.classList.add('hidden');
  } else {
    state.quizWrongList.push({
      verb: currentVerb,
      userPast: userPast,
      userPP: userPP
    });
    
    // Add to incorrect notes list in state
    state.incorrect.add(currentVerb.base);
    saveToLocalStorage();
    
    feedbackBanner.className = "quiz-feedback-banner incorrect";
    document.getElementById('quiz-feedback-text').textContent = "아쉽게도 오답입니다.";
    correctAnswerText.textContent = `정답: ${currentVerb.past} - ${currentVerb.pp}`;
    correctAnswerText.classList.remove('hidden');
  }
  
  // Set next step
  if (state.quizIndex < state.quizQuestions.length - 1) {
    submitBtn.textContent = "다음 문제";
  } else {
    submitBtn.textContent = "결과 보기";
  }
}

function goToNextQuestion() {
  if (state.quizIndex < state.quizQuestions.length - 1) {
    state.quizIndex++;
    renderQuizQuestion();
  } else {
    showQuizResults();
  }
}

function showQuizResults() {
  // Clear timer
  clearInterval(state.quizTimerId);
  
  // Elements
  document.getElementById('quiz-active-view').classList.add('hidden');
  document.getElementById('quiz-result-view').classList.remove('hidden');
  
  // Calculate stats
  const total = state.quizQuestions.length;
  const score = Math.round((state.quizCorrectCount / total) * 100);
  
  const min = String(Math.floor(state.quizTimeSeconds / 60)).padStart(2, '0');
  const sec = String(state.quizTimeSeconds % 60).padStart(2, '0');
  
  document.getElementById('result-score').textContent = `${score}점`;
  document.getElementById('result-correct-count').textContent = `${state.quizCorrectCount} / ${total}`;
  document.getElementById('result-time').textContent = `${min}:${sec}`;
  
  // Fill Wrong list
  const container = document.getElementById('wrong-answers-list-container');
  const list = document.getElementById('wrong-verbs-list');
  list.innerHTML = "";
  
  if (state.quizWrongList.length === 0) {
    container.classList.add('hidden');
  } else {
    container.classList.remove('hidden');
    state.quizWrongList.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span class="wrong-v-base">${item.verb.base} (${item.verb.meaning})</span>
        <span>
          입력: <span class="wrong-v-wrong">${item.userPast || '-'}, ${item.userPP || '-'}</span> | 
          정답: <span class="wrong-v-correct">${item.verb.past}, ${item.verb.pp}</span>
        </span>
      `;
      list.appendChild(li);
    });
  }
}

function resetQuizState() {
  clearInterval(state.quizTimerId);
  state.quizQuestions = [];
  state.quizIndex = 0;
  state.quizTimeSeconds = 0;
  state.quizCorrectCount = 0;
  state.quizWrongList = [];
}

function showQuizSetup() {
  resetQuizState();
  document.getElementById('quiz-setup-view').classList.remove('hidden');
  document.getElementById('quiz-active-view').classList.add('hidden');
  document.getElementById('quiz-result-view').classList.add('hidden');
}


// BOOKMARKS & DATA MANAGEMENT TAB
function initBookmarksTab() {
  document.getElementById('btn-reset-data').addEventListener('click', () => {
    if (confirm("정말로 모든 단어의 암기 정보와 오답 노트 및 즐겨찾기 데이터를 초기화하시겠습니까?")) {
      state.learned.clear();
      state.starred.clear();
      state.incorrect.clear();
      state.studyCount = {};
      saveToLocalStorage();
      updateGlobalProgress();
      applyStudyFilter();
      renderBookmarksList();
      alert("모든 데이터가 완벽히 초기화되었습니다.");
    }
  });
}

function renderBookmarksList() {
  const starredContainer = document.getElementById('starred-list-container');
  const incorrectContainer = document.getElementById('incorrect-list-container');
  
  starredContainer.innerHTML = "";
  incorrectContainer.innerHTML = "";
  
  // Starred list
  const starredItems = verbDataset.filter(v => state.starred.has(v.base));
  document.getElementById('starred-count').textContent = starredItems.length;
  
  if (starredItems.length === 0) {
    starredContainer.innerHTML = `<p class="subtitle" style="padding:15px; text-align:center;">즐겨찾기한 단어가 없습니다.</p>`;
  } else {
    starredItems.forEach(item => {
      const div = createBookmarkListItem(item, 'star');
      starredContainer.appendChild(div);
    });
  }
  
  // Incorrect list
  const incorrectItems = verbDataset.filter(v => state.incorrect.has(v.base));
  document.getElementById('incorrect-count').textContent = incorrectItems.length;
  
  if (incorrectItems.length === 0) {
    incorrectContainer.innerHTML = `<p class="subtitle" style="padding:15px; text-align:center;">틀린 오답 단어가 없습니다.</p>`;
  } else {
    incorrectItems.forEach(item => {
      const div = createBookmarkListItem(item, 'trash');
      incorrectContainer.appendChild(div);
    });
  }
  
  lucide.createIcons();
}

function createBookmarkListItem(item, type) {
  const div = document.createElement('div');
  div.className = 'verb-list-item';
  
  const left = document.createElement('div');
  left.className = 'v-item-left';
  left.innerHTML = `
    <span class="v-item-base">${item.base} (${item.meaning})</span>
    <span class="v-item-details">${item.past} - ${item.pp}</span>
  `;
  
  const right = document.createElement('div');
  right.className = 'v-item-right';
  
  // Play sound button
  const audioBtn = document.createElement('button');
  audioBtn.className = 'v-item-action';
  audioBtn.innerHTML = '<i data-lucide="volume-2" style="width:16px; height:16px;"></i>';
  audioBtn.addEventListener('click', () => speakVerbConjugation(item));
  
  // Remove button
  const removeBtn = document.createElement('button');
  removeBtn.className = 'v-item-action';
  
  if (type === 'star') {
    removeBtn.innerHTML = '<i data-lucide="star-off" style="width:16px; height:16px;"></i>';
    removeBtn.addEventListener('click', () => {
      state.starred.delete(item.base);
      saveToLocalStorage();
      renderBookmarksList();
      applyStudyFilter();
    });
  } else {
    removeBtn.innerHTML = '<i data-lucide="trash-2" style="width:16px; height:16px;"></i>';
    removeBtn.addEventListener('click', () => {
      state.incorrect.delete(item.base);
      saveToLocalStorage();
      renderBookmarksList();
    });
  }
  
  right.appendChild(audioBtn);
  right.appendChild(removeBtn);
  
  div.appendChild(left);
  div.appendChild(right);
  
  return div;
}

// Study Count increment utility
function incrementStudyCount(baseVerb) {
  if (!state.studyCount) {
    state.studyCount = {};
  }
  state.studyCount[baseVerb] = (state.studyCount[baseVerb] || 0) + 1;
  saveToLocalStorage();
  
  // If the word list is currently active, re-render it to show updated counts live
  const wordListTab = document.getElementById('tab-wordlist');
  if (wordListTab && wordListTab.classList.contains('active')) {
    renderWordList();
  }
}

// Word List Tab Initialization
function initWordListTab() {
  // Can be used for adding search filters or sorting buttons later
}

// Render Word List Table
function renderWordList() {
  const tbody = document.getElementById('wordlist-tbody');
  const totalCountEl = document.getElementById('wordlist-total-count');
  if (!tbody) return;

  tbody.innerHTML = "";
  totalCountEl.textContent = verbDataset.length;

  verbDataset.forEach(verb => {
    const tr = document.createElement('tr');
    
    // Check states
    const isLearned = state.learned.has(verb.base);
    const isStarred = state.starred.has(verb.base);
    const count = state.studyCount[verb.base] || 0;
    
    // Study count badge class
    const badgeClass = count > 0 ? 'study-count-badge active' : 'study-count-badge zero';
    
    // Star and Check icon states
    const starIcon = isStarred 
      ? '<i data-lucide="star" fill="#fbbf24" stroke="#fbbf24" style="width:16px; height:16px;"></i>' 
      : '<i data-lucide="star" style="width:16px; height:16px;"></i>';
      
    const checkIcon = isLearned 
      ? '<i data-lucide="check-circle-2" style="width:16px; height:16px;"></i>' 
      : '<i data-lucide="circle" style="width:16px; height:16px;"></i>';
    
    tr.innerHTML = `
      <td><strong>${verb.base}</strong></td>
      <td>${verb.past}</td>
      <td>${verb.pp}</td>
      <td>${verb.meaning}</td>
      <td><span class="${badgeClass}">${count}회</span></td>
      <td>
        <div class="wordlist-actions">
          <button class="wordlist-action-btn speak-btn" title="발음 듣기">
            <i data-lucide="volume-2" style="width:16px; height:16px;"></i>
          </button>
          <button class="wordlist-action-btn star ${isStarred ? 'active' : ''}" title="즐겨찾기 토글">
            ${starIcon}
          </button>
          <button class="wordlist-action-btn check ${isLearned ? 'active' : ''}" title="암기 완료 토글">
            ${checkIcon}
          </button>
        </div>
      </td>
    `;
    
    // Bind Event Listeners
    tr.querySelector('.speak-btn').addEventListener('click', () => {
      speakVerbConjugation(verb);
    });
    
    tr.querySelector('.star').addEventListener('click', (e) => {
      const btn = e.currentTarget;
      if (state.starred.has(verb.base)) {
        state.starred.delete(verb.base);
        btn.classList.remove('active');
        btn.innerHTML = '<i data-lucide="star" style="width:16px; height:16px;"></i>';
      } else {
        state.starred.add(verb.base);
        btn.classList.add('active');
        btn.innerHTML = '<i data-lucide="star" fill="#fbbf24" stroke="#fbbf24" style="width:16px; height:16px;"></i>';
      }
      saveToLocalStorage();
      lucide.createIcons();
    });
    
    tr.querySelector('.check').addEventListener('click', (e) => {
      const btn = e.currentTarget;
      if (state.learned.has(verb.base)) {
        state.learned.delete(verb.base);
        btn.classList.remove('active');
        btn.innerHTML = '<i data-lucide="circle" style="width:16px; height:16px;"></i>';
      } else {
        state.learned.add(verb.base);
        btn.classList.add('active');
        btn.innerHTML = '<i data-lucide="check-circle-2" style="width:16px; height:16px;"></i>';
      }
      saveToLocalStorage();
      updateGlobalProgress();
      lucide.createIcons();
    });

    tbody.appendChild(tr);
  });

  lucide.createIcons();
}

// COMMENTS TAB
function initCommentsTab() {
  const form = document.getElementById('comment-form');
  const authorInput = document.getElementById('comment-author');
  const contentInput = document.getElementById('comment-content');
  const charCount = document.getElementById('comment-char-count');

  if (!form || !authorInput || !contentInput) return;

  contentInput.addEventListener('input', () => {
    charCount.textContent = `${contentInput.value.length} / 300`;
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const author = authorInput.value.trim();
    const content = contentInput.value.trim();
    if (!author || !content) return;

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i data-lucide="loader-circle"></i> 등록 중...';
    lucide.createIcons();

    try {
      const response = await fetch(COMMENTS_ENDPOINT, {
        method: 'POST',
        headers: supabaseHeaders({ Prefer: 'return=representation' }),
        body: JSON.stringify({ author, content })
      });

      if (!response.ok) throw new Error(await getSupabaseError(response));

      contentInput.value = '';
      charCount.textContent = '0 / 300';
      await loadComments();
      contentInput.focus();
    } catch (error) {
      console.error('Comment creation error', error);
      showCommentsMessage(`등록하지 못했습니다. ${error.message}`, true);
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = '<i data-lucide="send"></i> 등록하기';
      lucide.createIcons();
    }
  });

  loadComments();
}

async function loadComments() {
  showCommentsMessage('한마디를 불러오는 중이에요.');

  try {
    const response = await fetch(`${COMMENTS_ENDPOINT}?select=id,author,content,created_at&order=created_at.desc`, {
      headers: supabaseHeaders()
    });

    if (!response.ok) throw new Error(await getSupabaseError(response));

    state.comments = await response.json();
    renderComments();
  } catch (error) {
    console.error('Comment loading error', error);
    showCommentsMessage(`한마디를 불러오지 못했습니다. ${error.message}`, true);
  }
}

async function getSupabaseError(response) {
  try {
    const result = await response.json();
    return result.message || result.hint || `오류 코드 ${response.status}`;
  } catch {
    return `오류 코드 ${response.status}`;
  }
}

function showCommentsMessage(message, isError = false) {
  const list = document.getElementById('comments-list');
  if (!list) return;

  list.innerHTML = '';
  const status = document.createElement('div');
  status.className = `comments-empty${isError ? ' comments-error' : ''}`;
  status.innerHTML = `<i data-lucide="${isError ? 'circle-alert' : 'loader-circle'}"></i>`;
  const text = document.createElement('strong');
  text.textContent = message;
  status.appendChild(text);
  list.appendChild(status);
  lucide.createIcons();
}

function renderComments() {
  const list = document.getElementById('comments-list');
  const count = document.getElementById('comment-count');
  if (!list || !count) return;

  count.textContent = `${state.comments.length}개`;
  list.innerHTML = '';

  if (state.comments.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'comments-empty';
    empty.innerHTML = '<i data-lucide="message-circle"></i><strong>아직 남겨진 한마디가 없어요.</strong><span>첫 번째 이야기를 들려주세요!</span>';
    list.appendChild(empty);
    lucide.createIcons();
    return;
  }

  state.comments.forEach((comment) => {
    const item = document.createElement('article');
    item.className = 'comment-item';

    const avatar = document.createElement('div');
    avatar.className = 'comment-avatar';
    avatar.textContent = comment.author.charAt(0).toUpperCase();

    const body = document.createElement('div');
    body.className = 'comment-body';

    const meta = document.createElement('div');
    meta.className = 'comment-meta';

    const author = document.createElement('strong');
    author.textContent = comment.author;

    const time = document.createElement('time');
    const createdAt = new Date(comment.created_at);
    time.dateTime = comment.created_at;
    time.textContent = Number.isNaN(createdAt.getTime())
      ? ''
      : createdAt.toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' });

    const content = document.createElement('p');
    content.className = 'comment-text';
    content.textContent = comment.content;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'comment-delete';
    remove.title = '한마디 삭제';
    remove.setAttribute('aria-label', `${comment.author}님의 한마디 삭제`);
    remove.innerHTML = '<i data-lucide="trash-2"></i>';
    remove.addEventListener('click', async () => {
      if (!confirm('이 한마디를 삭제할까요?')) return;

      remove.disabled = true;
      try {
        const response = await fetch(`${COMMENTS_ENDPOINT}?id=eq.${encodeURIComponent(comment.id)}`, {
          method: 'DELETE',
          headers: supabaseHeaders()
        });

        if (!response.ok) throw new Error(await getSupabaseError(response));
        state.comments = state.comments.filter((savedComment) => savedComment.id !== comment.id);
        renderComments();
      } catch (error) {
        console.error('Comment deletion error', error);
        alert(`삭제하지 못했습니다. ${error.message}`);
        remove.disabled = false;
      }
    });

    meta.append(author, time);
    body.append(meta, content);
    item.append(avatar, body, remove);
    list.appendChild(item);
  });

  lucide.createIcons();
}
