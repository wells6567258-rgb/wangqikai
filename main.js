// 汪琪凯日常打卡系统 - 主要JavaScript文件

// 全局变量
let currentDate = new Date();
let currentMonth = new Date();
let userData = {};
let checkInData = {};

// 初始化函数
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    createParticleBackground();
});

// 应用初始化
function initializeApp() {
    // 加载用户数据
    loadUserData();
    
    // 显示当前日期
    updateCurrentDate();
    
    // 生成日历
    generateCalendar();
    
    // 更新今日任务
    updateTodayTasks();
    
    // 更新统计信息
    updateStatistics();
    
    // 生成成就展示
    generateAchievements();
    
    // 创建统计图表
    createStatsChart();
    
    // 添加页面动画
    animatePageLoad();
    
    // 安排24点自动刷新当天内容
    scheduleMidnightRollover();
}

// 加载用户数据
function loadUserData() {
    const defaultData = {
        userInfo: {
            name: "汪琪凯",
            avatar: "resources/avatar.png",
            joinDate: "2025-01-01",
            totalDays: 45,
            totalScore: 1280,
            level: 3,
            experience: 1280
        },
        checkInData: generateMockCheckInData(),
        statistics: {
            continuousDays: 12,
            weekCompletionRate: 0.85,
            monthlyData: generateMonthlyData(),
            totalStudyTime: 1800, // 分钟
            averageDailyTime: 45, // 分钟
            bestSubject: 'math',
            improvement: 0.15 // 15%进步
        },
        achievements: [
            { id: 1, name: "连续打卡", icon: "🔥", unlocked: true, description: "连续打卡7天" },
            { id: 2, name: "数学达人", icon: "🧮", unlocked: true, description: "数学正确率90%以上" },
            { id: 3, name: "成语大师", icon: "📚", unlocked: true, description: "成语接龙完成10次" },
            { id: 4, name: "英语之星", icon: "⭐", unlocked: false, description: "英语单词全对" },
            { id: 5, name: "24点高手", icon: "🎯", unlocked: true, description: "24点游戏完成50题" },
            { id: 6, name: "学习标兵", icon: "🏆", unlocked: false, description: "所有科目打卡完成" },
            { id: 7, name: "坚持不懈", icon: "💪", unlocked: true, description: "连续打卡30天" },
            { id: 8, name: "智慧少年", icon: "🧠", unlocked: false, description: "总分达到2000分" },
            { id: 9, name: "时间管理大师", icon: "⏰", unlocked: false, description: "单日学习超过2小时" }
        ],
        gameStats: {
            cards: {
                totalScore: 0,
                bestTime: null,
                totalPractice: 0
            },
            math: {
                totalScore: 0,
                wrongAnswers: []
            },
            chinese: {
                totalScore: 0,
                bestChain: 0,
                totalChains: 0
            },
            english: {
                totalScore: 0,
                wordsLearned: 0,
                pronunciationScore: 0,
                spellingScore: 0
            }
        }
    };
    
    userData = JSON.parse(localStorage.getItem('wangqikai_data')) || defaultData;
    checkInData = userData.checkInData;
    
    // 保存到localStorage
    localStorage.setItem('wangqikai_data', JSON.stringify(userData));
}

// 生成模拟打卡数据
function generateMockCheckInData() {
    const data = {};
    const today = new Date();
    
    // 生成过去30天的数据
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = formatDate(date);
        
        // 80%的概率完成打卡
        if (Math.random() > 0.2) {
            data[dateStr] = {
                cards: { 
                    completed: Math.random() > 0.3, 
                    time: randomTime(), 
                    score: Math.floor(Math.random() * 30) + 70 
                },
                math: { 
                    completed: Math.random() > 0.2, 
                    time: randomTime(), 
                    correctRate: Math.random() * 0.3 + 0.7 
                },
                chinese: { 
                    completed: Math.random() > 0.4, 
                    time: Math.random() > 0.4 ? randomTime() : null, 
                    progress: Math.floor(Math.random() * 5) + 1 
                },
                english: { 
                    completed: Math.random() > 0.25, 
                    time: Math.random() > 0.25 ? randomTime() : null, 
                    correctRate: Math.random() * 0.2 + 0.8 
                }
            };
        }
    }
    
    return data;
}

// 生成月度数据
function generateMonthlyData() {
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = formatDate(date);
        
        data.push({
            date: dateStr.substring(5), // MM-DD格式
            completionRate: Math.random() * 0.4 + 0.6, // 60%-100%
            totalTasks: Math.floor(Math.random() * 3) + 2 // 2-4个任务
        });
    }
    
    return data;
}

// 生成随机时间
function randomTime() {
    const hour = Math.floor(Math.random() * 4) + 18; // 18-22点
    const minute = Math.floor(Math.random() * 60);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

// 更新当前日期显示
function updateCurrentDate() {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    document.getElementById('current-date').textContent = 
        currentDate.toLocaleDateString('zh-CN', options);
}

// 生成日历
function generateCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const monthElement = document.getElementById('current-month');
    
    // 若关键容器未渲染，直接返回，避免空指针
    if (!calendarGrid || !monthElement) return;
    
    // 更新月份显示
    monthElement.textContent = 
        currentMonth.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });
    
    // 清空日历网格
    calendarGrid.innerHTML = '';
    
    // 获取月份信息
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // 生成42个日期格子（6周）
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dateStr = formatDate(date);
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day w-12 h-12 rounded-lg flex items-center justify-center text-sm font-medium';
        
        // 判断日期状态
        const isCurrentMonth = date.getMonth() === month;
        const isToday = formatDate(date) === formatDate(new Date());
        const hasCheckIn = checkInData[dateStr];
        const isCompleted = hasCheckIn && isDayCompleted(hasCheckIn);
        
        if (!isCurrentMonth) {
            dayElement.className += ' text-gray-300';
        } else if (isToday) {
            dayElement.className += ' today';
        } else if (isCompleted) {
            dayElement.className += ' completed';
        } else {
            dayElement.className += ' bg-gray-100 text-gray-700 hover:bg-gray-200';
        }
        
        dayElement.textContent = date.getDate();
        dayElement.dataset.date = dateStr;
        
        // 添加点击事件
        dayElement.addEventListener('click', () => showDateDetails(dateStr));
        
        calendarGrid.appendChild(dayElement);
    }
}

// 判断一天是否完成打卡
function isDayCompleted(dayData) {
    if (!dayData) return false;
    
    const tasks = ['cards', 'math', 'chinese', 'english'];
    let completedCount = 0;
    
    tasks.forEach(task => {
        if (dayData[task] && dayData[task].completed) {
            completedCount++;
        }
    });
    
    return completedCount >= 3; // 至少完成3个任务算完成
}

// 显示日期详情
function showDateDetails(dateStr) {
    const modal = document.getElementById('date-modal');
    const modalDate = document.getElementById('modal-date');
    const modalContent = document.getElementById('modal-content');
    
    modalDate.textContent = formatDateForDisplay(dateStr);
    
    const dayData = checkInData[dateStr];
    
    if (dayData) {
        modalContent.innerHTML = `
            <div class="space-y-4">
                <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span class="flex items-center">
                        <span class="mr-2">🎯</span>
                        24点卡牌
                    </span>
                    <div class="text-right">
                        <div class="text-sm ${dayData.cards.completed ? 'text-green-600' : 'text-gray-500'}">
                            ${dayData.cards.completed ? '已完成' : '未完成'}
                        </div>
                        ${dayData.cards.completed ? `<div class="text-xs text-gray-500">${dayData.cards.time} · ${dayData.cards.score}分</div>` : ''}
                    </div>
                </div>
                
                <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span class="flex items-center">
                        <span class="mr-2">🧮</span>
                        数学练习
                    </span>
                    <div class="text-right">
                        <div class="text-sm ${dayData.math.completed ? 'text-blue-600' : 'text-gray-500'}">
                            ${dayData.math.completed ? '已完成' : '未完成'}
                        </div>
                        ${dayData.math.completed ? `<div class="text-xs text-gray-500">${dayData.math.time} · ${Math.round(dayData.math.correctRate * 100)}%正确率</div>` : ''}
                    </div>
                </div>
                
                <div class="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span class="flex items-center">
                        <span class="mr-2">📚</span>
                        成语接龙
                    </span>
                    <div class="text-right">
                        <div class="text-sm ${dayData.chinese.completed ? 'text-orange-600' : 'text-gray-500'}">
                            ${dayData.chinese.completed ? '已完成' : `进行中 (${dayData.chinese.progress}/5)`}
                        </div>
                        ${dayData.chinese.completed && dayData.chinese.time ? `<div class="text-xs text-gray-500">${dayData.chinese.time}</div>` : ''}
                    </div>
                </div>
                
                <div class="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span class="flex items-center">
                        <span class="mr-2">⭐</span>
                        英语学习
                    </span>
                    <div class="text-right">
                        <div class="text-sm ${dayData.english.completed ? 'text-purple-600' : 'text-gray-500'}">
                            ${dayData.english.completed ? '已完成' : '未完成'}
                        </div>
                        ${dayData.english.completed ? `<div class="text-xs text-gray-500">${dayData.english.time} · ${Math.round(dayData.english.correctRate * 100)}%正确率</div>` : ''}
                    </div>
                </div>
            </div>
        `;
    } else {
        modalContent.innerHTML = `
            <div class="text-center py-8">
                <div class="text-6xl mb-4">😴</div>
                <p class="text-gray-500">这一天还没有学习记录哦</p>
                <p class="text-sm text-gray-400 mt-2">快去开始今天的学习吧！</p>
            </div>
        `;
    }
    
    modal.classList.remove('hidden');
}

// 更新今日任务
function updateTodayTasks() {
    const todayStr = formatDate(new Date());
    const todayData = checkInData[todayStr] || {};
    
    const tasksContainer = document.getElementById('today-tasks');
    
    const tasks = [
        {
            id: 'cards',
            name: '24点卡牌',
            icon: '🎯',
            color: 'green',
            page: 'cards.html'
        },
        {
            id: 'math',
            name: '数学练习',
            icon: '🧮',
            color: 'blue',
            page: 'math.html'
        },
        {
            id: 'chinese',
            name: '成语接龙',
            icon: '📚',
            color: 'orange',
            page: 'chinese.html'
        },
        {
            id: 'english',
            name: '英语学习',
            icon: '⭐',
            color: 'purple',
            page: 'english.html'
        }
    ];
    
    tasksContainer.innerHTML = tasks.map(task => {
        const taskData = todayData[task.id] || {};
        const isCompleted = taskData.completed || false;
        const progress = taskData.progress || 0;
        
        // 文案：已完成 / 进行中(仅语文显示x/5) / 未开始
        let statusText = '未开始';
        if (isCompleted) {
            statusText = '已完成';
        } else if (progress > 0) {
            statusText = task.id === 'chinese' ? `进行中 (${progress}/5)` : '进行中';
        }
        
        return `
            <div class="task-card p-4 rounded-xl border-2 border-${task.color}-100 bg-${task.color}-50 hover:border-${task.color}-200 transition-all cursor-pointer"
                 onclick="navigateToPage('${task.page}')">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="text-2xl">${task.icon}</div>
                        <div>
                            <div class="font-semibold text-gray-800">${task.name}</div>
                            <div class="text-sm text-gray-500">${statusText}</div>
                        </div>
                    </div>
                    <div class="flex items-center">
                        ${isCompleted ? 
                            `<div class="w-6 h-6 bg-${task.color}-500 rounded-full flex items-center justify-center">
                                <span class="text-white text-sm">✓</span>
                            </div>` : 
                            `<div class="w-6 h-6 border-2 border-${task.color}-200 rounded-full"></div>`
                        }
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// 更新统计信息
function updateStatistics() {
    const stats = userData.statistics;
    
    const streakEl = document.getElementById('streak-days');
    const weekRateEl = document.getElementById('week-rate');
    const totalDaysEl = document.getElementById('total-days');
    const totalScoreEl = document.getElementById('total-score');
    const progressBar = document.getElementById('progress-bar');

    if (streakEl) streakEl.textContent = stats.continuousDays;
    if (weekRateEl) weekRateEl.textContent = Math.round(stats.weekCompletionRate * 100) + '%';
    if (totalDaysEl) totalDaysEl.textContent = userData.userInfo.totalDays;
    if (totalScoreEl) totalScoreEl.textContent = userData.userInfo.totalScore;
    if (progressBar) {
        progressBar.style.width = (stats.weekCompletionRate * 100) + '%';
    }
}

// 生成成就展示
function generateAchievements() {
    const achievementsContainer = document.getElementById('achievements');
    if (!achievementsContainer) return;
    achievementsContainer.innerHTML = userData.achievements.map(achievement => `
        <div class="flex items-center space-x-3 p-3 rounded-lg ${achievement.earned ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'} hover:shadow-md transition-all">
            <div class="text-2xl">${achievement.icon}</div>
            <div>
                <div class="font-bold ${achievement.earned ? 'text-yellow-700' : 'text-gray-700'}">${achievement.title}</div>
                <div class="text-sm ${achievement.earned ? 'text-yellow-600' : 'text-gray-500'}">${achievement.description}</div>
            </div>
        </div>
    `).join('');
}

// 创建统计图表
function createStatsChart() {
    const chartContainer = document.getElementById('stats-chart');
    // 缺少容器或 echarts 未加载时跳过初始化
    if (!chartContainer || typeof echarts === 'undefined') return;
    const chart = echarts.init(chartContainer);
    
    const monthlyData = userData.statistics.monthlyData;
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ['完成率', '任务数量']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: monthlyData.map(item => item.date)
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '完成率',
                min: 0,
                max: 1,
                axisLabel: {
                    formatter: '{value}%'
                }
            },
            {
                type: 'value',
                name: '任务数',
                min: 0,
                max: 5,
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name: '完成率',
                type: 'line',
                smooth: true,
                areaStyle: {
                    opacity: 0.3,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#4A90E2' },
                        { offset: 1, color: '#7ED321' }
                    ])
                },
                data: monthlyData.map(item => item.completionRate),
                itemStyle: {
                    color: '#4A90E2'
                }
            },
            {
                name: '任务数量',
                type: 'bar',
                yAxisIndex: 1,
                data: monthlyData.map(item => item.totalTasks),
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#F5A623' },
                        { offset: 1, color: '#FF6B6B' }
                    ])
                }
            }
        ]
    };
    
    chart.setOption(option);
    
    // 响应式调整
    window.addEventListener('resize', () => {
        chart.resize();
    });
}

// 创建粒子背景
function createParticleBackground() {
    const sketch = (p) => {
        let particles = [];
        
        p.setup = () => {
            const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            canvas.parent('particle-container');
            
            // 创建粒子
            for (let i = 0; i < 50; i++) {
                particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    size: p.random(3, 8),
                    speedX: p.random(-0.5, 0.5),
                    speedY: p.random(-0.5, 0.5),
                    color: p.random(['#4A90E2', '#7ED321', '#F5A623', '#FF6B6B'])
                });
            }
        };
        
        p.draw = () => {
            p.clear();
            
            // 绘制和更新粒子
            particles.forEach(particle => {
                p.fill(particle.color + '40'); // 添加透明度
                p.noStroke();
                p.circle(particle.x, particle.y, particle.size);
                
                // 更新位置
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // 边界检测
                if (particle.x < 0 || particle.x > p.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > p.height) particle.speedY *= -1;
            });
        };
        
        p.windowResized = () => {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
    };
    
    new p5(sketch);
}

// 页面加载动画
function animatePageLoad() {
    // 为所有卡片添加进入动画
    anime({
        targets: '.card-hover',
        translateY: [50, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        duration: 800,
        easing: 'easeOutQuart'
    });
    
    // 为日历日期添加动画
    anime({
        targets: '.calendar-day',
        scale: [0, 1],
        delay: anime.stagger(20),
        duration: 600,
        easing: 'easeOutElastic(1, .8)'
    });
}

// 设置事件监听器
function setupEventListeners() {
    // 月份切换按钮（增加空值判断以避免运行时错误）
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    const closeModalBtn = document.getElementById('close-modal');
    const dateModal = document.getElementById('date-modal');
    const resetBtn = document.getElementById('btn-reset-checkin');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentMonth.setMonth(currentMonth.getMonth() - 1);
            generateCalendar();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentMonth.setMonth(currentMonth.getMonth() + 1);
            generateCalendar();
        });
    }
    
    // 模态框关闭
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            const modalEl = document.getElementById('date-modal');
            if (modalEl) modalEl.classList.add('hidden');
        });
    }
    
    // 点击模态框背景关闭
    if (dateModal) {
        dateModal.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'date-modal') {
                dateModal.classList.add('hidden');
            }
        });
    }

    // 清空打卡数据
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('确定清空所有打卡数据并重新开始吗？')) {
                resetCheckInData();
            }
        });
    }
}

// 导航到指定页面
function navigateToPage(page) {
    // 添加页面切换动画
    anime({
        targets: 'body',
        opacity: [1, 0],
        duration: 300,
        easing: 'easeInQuart',
        complete: () => {
            window.location.href = page;
        }
    });
}

// 工具函数
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function formatDateForDisplay(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
}

// 成功动画
function showSuccessAnimation(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl p-8 shadow-2xl text-center';
    successDiv.innerHTML = `
        <div class="text-6xl mb-4">🎉</div>
        <div class="text-2xl font-bold text-green-600 mb-2">${message}</div>
        <div class="text-gray-600">太棒了！继续保持！</div>
    `;
    
    document.body.appendChild(successDiv);
    
    anime({
        targets: successDiv,
        scale: [0, 1],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutElastic(1, .8)',
        complete: () => {
            setTimeout(() => {
                anime({
                    targets: successDiv,
                    scale: [1, 0],
                    opacity: [1, 0],
                    duration: 300,
                    complete: () => {
                        document.body.removeChild(successDiv);
                    }
                });
            }, 2000);
        }
    });
}

// 导出函数供其他页面使用
window.wangqikaiApp = {
    userData,
    checkInData,
    showSuccessAnimation,
    navigateToPage,
    formatDate
};

// 24点午夜自动刷新
function scheduleMidnightRollover() {
    try {
        const now = new Date();
        const nextMidnight = new Date(now);
        nextMidnight.setHours(24, 0, 0, 0); // 当地时间的24:00
        const ms = nextMidnight.getTime() - now.getTime();
        setTimeout(() => {
            // 到达午夜：滚动日期并刷新视图
            currentDate = new Date();
            updateCurrentDate();
            generateCalendar();
            updateTodayTasks();
            updateStatistics();
            // 继续安排下一天
            scheduleMidnightRollover();
        }, Math.max(ms, 1000));
    } catch (e) {
        console.warn('scheduleMidnightRollover 失败', e);
    }
}

// 清空打卡日历数据（保留用户信息）
function resetCheckInData() {
    try {
        const data = JSON.parse(localStorage.getItem('wangqikai_data') || '{}');
        data.checkInData = {};
        localStorage.setItem('wangqikai_data', JSON.stringify(data));
        userData = data;
        checkInData = data.checkInData;
        // 清空各科的会话进度
        localStorage.removeItem('cards_session');
        localStorage.removeItem('math_session');
        localStorage.removeItem('chinese_session');
        localStorage.removeItem('english_session');
        // 刷新页面显示
        generateCalendar();
        updateTodayTasks();
        showSuccessAnimation('打卡日历已清空，重新开始！');
    } catch (e) {
        alert('清空失败，请稍后再试');
        console.error(e);
    }
}