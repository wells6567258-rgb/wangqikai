(function(){
  const STORAGE_KEY = 'wangqikai_question_bank_v1';
  const state = {
    entries: []
  };
  function load(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      state.entries = raw ? JSON.parse(raw) : [];
    } catch(e){
      state.entries = [];
    }
  }
  function save(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.entries));
  }
  function uid(){
    return 'qb_' + Date.now() + '_' + Math.random().toString(36).slice(2,8);
  }
  function detectType(subject, text){
    if(!text) return 'unknown';
    const t = text.trim();
    if(subject === 'math'){
      // 24点题型：匹配四个牌面或数字（A J Q K 2-10），可含空格/逗号/中文逗号
      const tokens = (t.match(/(A|J|Q|K|10|[2-9])/gi) || []).map(x=>x.toUpperCase());
      if(tokens.length >= 4) return '24point';
      if(/[+\-×x*÷/]/.test(t) && /\d/.test(t)) return 'arithmetic';
      if(/(应用题|米|千米|元|角|分|时间|速度|平均)/.test(t)) return 'word_problem';
      if(/(竖式|进位|退位)/.test(t)) return 'vertical';
      return 'math_general';
    }
    if(subject === 'chinese'){
      if(/^[\u4e00-\u9fa5\s，。！？、；：“”‘’（ ）]+$/.test(t)) return 'text';
      return 'idiom_or_reading';
    }
    if(subject === 'english'){
      if(/[A-Za-z]/.test(t) && /(\bmeaning\b|\bexample\b|\bpronunciation\b)/i.test(t)) return 'vocabulary';
      return 'english_general';
    }
    return 'unknown';
  }
  const QuestionBank = {
    addEntry({subject, imageDataUrl=null, text='', type=null, meta={}}){
      const entry = {
        id: uid(),
        subject,
        imageDataUrl,
        text,
        type: type || detectType(subject, text),
        createdAt: new Date().toISOString(),
        meta
      };
      state.entries.unshift(entry);
      save();
      return entry;
    },
    list({subject=null, type=null}={}){
      return state.entries.filter(e => {
        if(subject && e.subject !== subject) return false;
        if(type && e.type !== type) return false;
        return true;
      });
    },
    update(id, patch){
      const idx = state.entries.findIndex(e => e.id === id);
      if(idx >= 0){
        state.entries[idx] = { ...state.entries[idx], ...patch };
        save();
        return state.entries[idx];
      }
      return null;
    },
    remove(id){
      const before = state.entries.length;
      state.entries = state.entries.filter(e => e.id !== id);
      if(state.entries.length !== before) save();
    },
    getAll(){ return [...state.entries]; },
    detectType
  };
  load();
  window.QuestionBank = QuestionBank;
})();