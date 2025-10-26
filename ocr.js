(function(){
  // 读取文件为DataURL
  async function readFileAsDataURL(file){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // 简单预处理：缩放、灰度化、对比度提升、二值化
  async function preprocessImage(dataUrl){
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const maxW = 1600; // 限制最大宽度，提升DPI
        const scale = Math.min(1, maxW / img.width);
        const w = Math.floor(img.width * scale);
        const h = Math.floor(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);
        const d = imageData.data;
        // 灰度 + 对比度 + 简单阈值（二值化）
        const contrast = 1.2; // 适度提升
        const threshold = 180; // 阈值可后续调节
        for(let i=0;i<d.length;i+=4){
          let r = d[i], g = d[i+1], b = d[i+2];
          // 灰度
          let v = 0.299*r + 0.587*g + 0.114*b;
          // 对比度
          v = (v-128)*contrast + 128;
          // 二值化
          const bin = v > threshold ? 255 : 0;
          d[i] = d[i+1] = d[i+2] = bin;
        }
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = dataUrl;
    });
  }

  function subjectToLang(subject){
    if(subject === 'english') return 'eng';
    if(subject === 'chinese') return 'chi_sim';
    // 数学既可能包含中文也包含英文符号
    return 'eng+chi_sim';
  }
  function subjectWhitelist(subject){
    const commonDigits = '0123456789';
    const mathOps = '+-*/x÷=()[]{}.:;,%><';
    const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if(subject === 'english') return commonDigits + letters + ",:'-.!?()";
    if(subject === 'chinese') return commonDigits + letters + mathOps; // 中文不做严格限制，保留常见符号
    return commonDigits + letters + mathOps; // 数学：数字+英文+符号
  }

  // 使用createWorker以便设置参数（psm/whitelist/dpi）
  async function recognize(imageDataUrl, subject){
    if(!window.Tesseract){
      throw new Error('Tesseract.js未加载');
    }
    const lang = subjectToLang(subject);
    const whitelist = subjectWhitelist(subject);
    const processed = await preprocessImage(imageDataUrl);
    try {
      const worker = await Tesseract.createWorker({ logger: m => console.log('[OCR]', m) });
      await worker.loadLanguage(lang);
      await worker.initialize(lang);
      await worker.setParameters({
        tessedit_char_whitelist: whitelist,
        preserve_interword_spaces: '1',
        user_defined_dpi: '300',
        tessedit_pageseg_mode: '6' // 单一块文本，适合试题拍照
      });
      const { data: { text } } = await worker.recognize(processed);
      await worker.terminate();
      return (text || '').trim();
    } catch(err){
      console.warn('[OCR] createWorker识别失败，回退到普通识别', err);
      // 回退到简单API
      const { data: { text } } = await Tesseract.recognize(processed, lang, {
        logger: m => console.log('[OCR-fallback]', m),
        psm: 6,
        preserve_interword_spaces: '1'
      });
      return (text || '').trim();
    }
  }

  function parseQuestions(subject, text){
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if(subject === 'math'){
      const items = [];
      lines.forEach(l => {
        if(/\d/.test(l) && /[+\-×x*÷/]/.test(l)){
          items.push({ type: 'arithmetic', text: l });
        } else if(/(米|千米|元|角|分|时间|速度|平均|共有|剩下)/.test(l)){
          items.push({ type: 'word_problem', text: l });
        } else {
          items.push({ type: 'math_general', text: l });
        }
      });
      return items;
    }
    if(subject === 'chinese'){
      return lines.map(l => ({ type: 'chinese_text', text: l }));
    }
    if(subject === 'english'){
      return lines.map(l => ({ type: 'english_text', text: l }));
    }
    return lines.map(l => ({ type: 'unknown', text: l }));
  }
  window.OCRUtils = { readFileAsDataURL, preprocessImage, recognize, parseQuestions };
})();