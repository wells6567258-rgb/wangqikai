(function(){
  const TODAY = new Date().toISOString().split('T')[0];
  function getData(){ try { return JSON.parse(localStorage.getItem('wangqikai_data') || '{}'); } catch(e){ return {}; } }
  function setData(d){ localStorage.setItem('wangqikai_data', JSON.stringify(d)); }
  function ensureCheckIn(d){ if(!d.checkInData) d.checkInData = {}; if(!d.checkInData[TODAY]) d.checkInData[TODAY] = {}; }
  function safe(fn){ return typeof window[fn] === 'function' ? window[fn] : null; }
  const path = location.pathname.split('/').pop();

  // 英语学习
  if (path === 'english.html') {
    const KEY = 'english_session';
    function load(){
      try {
        const s = JSON.parse(localStorage.getItem(KEY) || '{}');
        if(!s || !s.wordProgress) return;
        if(typeof window.currentWordIndex !== 'undefined') window.currentWordIndex = s.currentWordIndex || 0;
        if(typeof window.wordProgress !== 'undefined') window.wordProgress = s.wordProgress || {};
        if(typeof window.gameStats !== 'undefined' && s.gameStats){
          window.gameStats.pronunciationAttempts = s.gameStats.pronunciationAttempts ?? window.gameStats.pronunciationAttempts;
          window.gameStats.pronunciationCorrect = s.gameStats.pronunciationCorrect ?? window.gameStats.pronunciationCorrect;
          window.gameStats.spellingAttempts = s.gameStats.spellingAttempts ?? window.gameStats.spellingAttempts;
          window.gameStats.spellingCorrect = s.gameStats.spellingCorrect ?? window.gameStats.spellingCorrect;
          window.gameStats.todayPoints = s.gameStats.todayPoints ?? window.gameStats.todayPoints;
        }
        safe('updateCurrentWord')?.();
        safe('updateStats')?.();
      } catch(e){}
    }
    function save(){
      try {
        const payload = {
          currentWordIndex: window.currentWordIndex,
          wordProgress: window.wordProgress,
          gameStats: {
            pronunciationAttempts: (window.gameStats||{}).pronunciationAttempts||0,
            pronunciationCorrect: (window.gameStats||{}).pronunciationCorrect||0,
            spellingAttempts: (window.gameStats||{}).spellingAttempts||0,
            spellingCorrect: (window.gameStats||{}).spellingCorrect||0,
            todayPoints: (window.gameStats||{}).todayPoints||0
          }
        };
        localStorage.setItem(KEY, JSON.stringify(payload));
        const learned = Object.values(window.wordProgress||{}).filter(p=>p && (p.read||p.spell)).length;
        const data = getData(); ensureCheckIn(data);
        const prev = data.checkInData[TODAY].english || {};
        const completed = prev.completed === true;
        data.checkInData[TODAY].english = { ...prev, completed, progress: learned>0 ? learned : 0 };
        setData(data);
        if(completed) localStorage.removeItem(KEY);
      } catch(e){}
    }
    window.addEventListener('DOMContentLoaded', load);
    window.addEventListener('beforeunload', save);
    setInterval(save, 2000);
  }

  // 成语接龙
  if (path === 'chinese.html') {
    const KEY = 'chinese_session';
    function load(){
      try {
        const s = JSON.parse(localStorage.getItem(KEY) || '{}');
        if(!s || !s.currentChain) return;
        if(Array.isArray(s.currentChain) && typeof window.currentChain !== 'undefined') window.currentChain = s.currentChain;
        if(typeof window.completedCount !== 'undefined') window.completedCount = s.completedCount || 0;
        if(typeof window.gameStats !== 'undefined' && s.gameStats){
          window.gameStats.todayScore = s.gameStats.todayScore ?? window.gameStats.todayScore;
          window.gameStats.successfulChains = s.gameStats.successfulChains ?? window.gameStats.successfulChains;
          window.gameStats.totalAttempts = s.gameStats.totalAttempts ?? window.gameStats.totalAttempts;
          window.gameStats.bestChain = s.gameStats.bestChain ?? window.gameStats.bestChain;
        }
        safe('updateChainDisplay')?.();
        safe('updateCurrentIdiom')?.();
        safe('updateProgress')?.();
        safe('updateStats')?.();
      } catch(e){}
    }
    function save(){
      try {
        const payload = {
          currentChain: window.currentChain,
          completedCount: window.completedCount,
          gameStats: {
            todayScore: (window.gameStats||{}).todayScore||0,
            successfulChains: (window.gameStats||{}).successfulChains||0,
            totalAttempts: (window.gameStats||{}).totalAttempts||0,
            bestChain: Math.max((window.gameStats||{}).bestChain||0, (window.currentChain||[]).length-1)
          }
        };
        localStorage.setItem(KEY, JSON.stringify(payload));
        const data = getData(); ensureCheckIn(data);
        const prev = data.checkInData[TODAY].chinese || {};
        const completed = prev.completed === true;
        data.checkInData[TODAY].chinese = { ...prev, completed, progress: Math.min(window.completedCount||0,5), chain: window.currentChain };
        setData(data);
        if(completed) localStorage.removeItem(KEY);
      } catch(e){}
    }
    window.addEventListener('DOMContentLoaded', load);
    window.addEventListener('beforeunload', save);
    setInterval(save, 2000);
  }

  // 数学练习
  if (path === 'math.html') {
    const KEY = 'math_session';
    function load(){
      try {
        const s = JSON.parse(localStorage.getItem(KEY) || '{}');
        if(!s) return;
        if(s.completionStatus && typeof window.completionStatus !== 'undefined') window.completionStatus = s.completionStatus;
        if(s.scores && typeof window.scores !== 'undefined') window.scores = s.scores;
        if(typeof s.currentSection === 'string' && typeof window.currentSection !== 'undefined') window.currentSection = s.currentSection;
        if(typeof s.currentGroup === 'number' && typeof window.currentGroup !== 'undefined') window.currentGroup = s.currentGroup;
        safe('updateProgressIndicator')?.(window.currentSection);
        safe('updateOverallProgress')?.();
        safe('showSection')?.(window.currentSection || 'oral');
      } catch(e){}
    }
    function save(){
      try {
        const payload = {
          completionStatus: window.completionStatus,
          scores: window.scores,
          currentSection: window.currentSection,
          currentGroup: window.currentGroup
        };
        localStorage.setItem(KEY, JSON.stringify(payload));
        const data = getData(); ensureCheckIn(data);
        const prev = data.checkInData[TODAY].math || {};
        const completed = prev.completed === true;
        const completedQuestions = ((window.scores||{}).oral||0) + ((window.scores||{}).vertical||0) + ((window.scores||{}).word||0);
        data.checkInData[TODAY].math = { ...prev, completed, progress: completedQuestions };
        setData(data);
        if(completed) localStorage.removeItem(KEY);
      } catch(e){}
    }
    window.addEventListener('DOMContentLoaded', load);
    window.addEventListener('beforeunload', save);
    setInterval(save, 2500);
  }

  // 24点卡牌
  if (path === 'cards.html') {
    const KEY = 'cards_session';
    function load(){
      try {
        const s = JSON.parse(localStorage.getItem(KEY) || '{}');
        if(!s) return;
        if(Array.isArray(s.currentCards) && typeof window.currentCards !== 'undefined') window.currentCards = s.currentCards;
        if(typeof s.currentExpression === 'string' && typeof window.currentExpression !== 'undefined') window.currentExpression = s.currentExpression;
        if(s.gameStats && typeof window.gameStats !== 'undefined') { Object.assign(window.gameStats, s.gameStats); }
        safe('renderCards')?.(window.currentCards);
        const input = document.getElementById('expression-input');
        if(input && typeof window.currentExpression === 'string') input.value = window.currentExpression;
      } catch(e){}
    }
    function save(){
      try {
        const payload = {
          currentCards: window.currentCards,
          currentExpression: window.currentExpression,
          gameStats: window.gameStats
        };
        localStorage.setItem(KEY, JSON.stringify(payload));
        const data = getData(); ensureCheckIn(data);
        const prev = data.checkInData[TODAY].cards || {};
        const completed = prev.completed === true;
        data.checkInData[TODAY].cards = { ...prev, completed, progress: (window.gameStats||{}).correctCount || 0 };
        setData(data);
        if(completed) localStorage.removeItem(KEY);
      } catch(e){}
    }
    window.addEventListener('DOMContentLoaded', load);
    window.addEventListener('beforeunload', save);
    setInterval(save, 2000);
  }
})();