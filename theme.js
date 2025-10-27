// OKComputer 可爱潮玩主题交互脚本 ✨
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌸 OKComputer 可爱潮玩主题已加载 ✨');
    
    // 初始化所有可爱交互功能
    /* injectCuteNavbar disabled per request */
    applyPolkaBackground();
    initScrollAnimations();
    initCuteButtonEffects();
    initCuteBackgroundInteraction();
    addCuteFloatingElements();
    initCuteParticles();
    initDraggableButtons();
});

function initScrollAnimations() {
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); }
      });
    },{threshold: 0.12});
    document.querySelectorAll('.tw-fade, body.tw-theme .bg-white, body.tw-theme .word-card, body.tw-theme .card-hover, body.tw-theme .idiom-card').forEach(el=>{
      if(!el.classList.contains('tw-fade')) el.classList.add('tw-fade');
      io.observe(el);
    });
}

function initCuteButtonEffects() {
    const isThemed = document.body.classList.contains('tw-theme');
    if (!isThemed) return;
    const buttons = Array.from(document.querySelectorAll('button, .btn, input[type="button"], input[type="submit"]'));
    buttons.forEach((btn) => {
      // 替换旧的 candy/tw 按钮类，应用棉花糖样式
      const toRemove = ['candy-btn','candy-blue','candy-pink','candy-green','candy-purple','candy-orange','candy-yellow','tw-btn','tw-btn--cyan','tw-btn--purple','tw-btn--orange','tw-btn--green','tw-btn--blue'];
      toRemove.forEach(cls => btn.classList.remove(cls));
  
      if (!btn.classList.contains('marsh-btn')) {
        btn.classList.add('marsh-btn', 'marsh-yellow');
      }
  
      // 命中强调类时自动粉色
      const label = (btn.textContent || '').trim();
      const emphasizeWords = ['提交','确认','下一步','继续','完成'];
      if (emphasizeWords.some(w => label.includes(w))) {
        btn.classList.remove('marsh-yellow');
        btn.classList.add('marsh-pink');
      }
  
      // 弹性按压效果
      addPressEffect(btn);
    });
}

function addPressEffect(button){
    button.addEventListener('click',()=>{
      button.classList.add('tw-press');
      setTimeout(()=>button.classList.remove('tw-press'), 420);
    });
}

function initCuteBackgroundInteraction() {
    const preloader = document.createElement('div');
    preloader.className = 'tw-preloader';
    preloader.innerHTML = '<div class="tw-loader"></div>';
    document.body.appendChild(preloader);
    setTimeout(()=>{ preloader.classList.add('fade-out'); preloader.style.opacity='0'; preloader.style.transition='opacity .35s ease'; setTimeout(()=>preloader.remove(), 380); }, 680);
}

function addCuteFloatingElements() {
    // 添加可爱的浮动装饰元素
    const floatingElements = ['🌸', '✨', '🎀', '💫', '🌟', '💖'];
    
    for(let i = 0; i < 3; i++) {
        const element = document.createElement('div');
        element.className = `cute-float cute-float-${i + 1}`;
        element.innerHTML = floatingElements[i % floatingElements.length];
        element.style.fontSize = '24px';
        element.style.userSelect = 'none';
        document.body.appendChild(element);
    }
}

function initCuteParticles() {
    // 鼠标点击时的可爱粒子效果
    document.addEventListener('click', function(e) {
        createCuteParticles(e.clientX, e.clientY);
    });
}

function createCuteParticles(x, y) {
    const particles = ['💖', '✨', '🌟', '💫', '🎀'];
    const colors = ['#f472b6', '#a78bfa', '#60a5fa', '#6ee7b7', '#fbbf24'];
    
    for(let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.innerHTML = particles[Math.floor(Math.random() * particles.length)];
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.fontSize = '16px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.userSelect = 'none';
        
        const angle = (Math.PI * 2 * i) / 6;
        const velocity = 50 + Math.random() * 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        document.body.appendChild(particle);
        
        let opacity = 1;
        let scale = 1;
        let currentX = x;
        let currentY = y;
        
        const animate = () => {
            currentX += vx * 0.02;
            currentY += vy * 0.02 + 1; // 重力效果
            opacity -= 0.02;
            scale -= 0.01;
            
            particle.style.left = currentX + 'px';
            particle.style.top = currentY + 'px';
            particle.style.opacity = opacity;
            particle.style.transform = `scale(${scale})`;
            
            if(opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// 增强按钮点击效果
function addPressEffect(button){
    button.addEventListener('click', function(e) {
        // 原有弹性效果
        button.classList.add('tw-press');
        setTimeout(() => button.classList.remove('tw-press'), 420);
        
        // 新增可爱粒子效果
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        createCuteParticles(centerX, centerY);
    });
}

function initDraggableButtons(){
  // 仅对标记为可拖拽的按钮启用拖拽，避免普通功能按钮（如发音按钮）因点击后被设为fixed造成“消失/位置跳动”现象。
  const targets = Array.from(document.querySelectorAll('button[data-draggable], .draggable-btn'));
  targets.forEach((el, idx)=> makeElementDraggable(el, { key: el.getAttribute('data-drag-key') || `drag-${idx}` }));
}

function makeElementDraggable(el, { key }={}){
  if(!el) return;
  let dragging = false; let offsetX = 0; let offsetY = 0; let pointerId = null; let moved = false;
  const clamp = (val, min, max)=> Math.min(Math.max(val, min), max);

  // 读取历史位置
  try{
    const saved = key ? JSON.parse(localStorage.getItem('tw_drag_'+key) || 'null') : null;
    if(saved){ el.style.position = 'fixed'; el.style.left = saved.left + 'px'; el.style.top = saved.top + 'px'; el.style.zIndex = '9999'; }
  }catch(e){}

  const onPointerDown = (e)=>{
    pointerId = e.pointerId; dragging = true; moved = false; el.setPointerCapture(pointerId);
    const rect = el.getBoundingClientRect();
    const computed = getComputedStyle(el);
    if(computed.position !== 'fixed'){ el.style.position = 'fixed'; el.style.left = rect.left + 'px'; el.style.top = rect.top + 'px'; el.style.zIndex = '9999'; }
    offsetX = e.clientX - rect.left; offsetY = e.clientY - rect.top; el.classList.add('tw-draggable','dragging');
  };

  const onPointerMove = (e)=>{
    if(!dragging) return; moved = true;
    const left = clamp(e.clientX - offsetX, 0, window.innerWidth - el.offsetWidth);
    const top  = clamp(e.clientY - offsetY, 0, window.innerHeight - el.offsetHeight);
    el.style.left = left + 'px'; el.style.top = top + 'px';
  };

  const onPointerUp = ()=>{
    if(!dragging) return; dragging = false; try{ el.releasePointerCapture(pointerId); }catch(_){}
    el.classList.remove('dragging');
    if(key){ const rect = el.getBoundingClientRect(); localStorage.setItem('tw_drag_'+key, JSON.stringify({ left: rect.left, top: rect.top })); }
    setTimeout(()=>{ moved = false; }, 0); // 结束后立即清除移动标记
  };

  // 阻止拖动产生的点击触发
  el.addEventListener('click', (evt)=>{ if(moved){ evt.preventDefault(); evt.stopPropagation(); } }, true);

  el.style.touchAction = 'none';
  el.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
}


function injectCuteNavbar(){
  if(document.querySelector('.cute-nav')) return;
  const nav = document.createElement('div');
  nav.className = 'cute-nav';
  const path = location.pathname.split('/').pop().toLowerCase();
  const links = [
    { href: 'index.html', text: '首页', icon: '💙' },
    { href: 'cards.html', text: '潮玩盲盒', icon: '🎁' },
    { href: 'english.html', text: '英语', icon: '🔤' },
    { href: 'math.html', text: '数学', icon: '🧮' },
    { href: 'chinese.html', text: '语文', icon: '📚' }
  ];
  const brand = `<div class="cute-brand"><div class="logo">💖</div><div><div style="font-weight:800;letter-spacing:.4px">OKComputer 潮玩站</div><div style="font-size:12px;color:#065f46;opacity:.9">Cute & Trendy</div></div></div>`;
  const navLinks = links.map(l=>`<a class="cute-link ${path===l.href.toLowerCase()?'active':''}" href="${l.href}">${l.icon} ${l.text}</a>`).join('');
  nav.innerHTML = `<div class="inner">${brand}<div class="links">${navLinks}</div></div>`;
  document.body.prepend(nav);
}

function applyPolkaBackground(){
  document.body.classList.add('polka-bg');
}