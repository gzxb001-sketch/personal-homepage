// ==================== 项目数据配置 ====================
const projectsData = {
    project1: {
        id: 'project1',
        title: '英语学习助手',
        status: '✓ 已完成',
        category: 'AI Agent',
        categoryId: 'ai-agent',
        date: '2025.11',
        emoji: '🤖',
        gradient: 'from-blue-500/20 to-purple-500/20',
        coverImage: 'images/project1-cover.jpg',
        shortDesc: '基于Coze平台开发的英语学习AI智能体，提供24/7个性化学习辅导',
        fullDesc: '这是一个基于Coze平台和GPT-4开发的英语学习AI智能体。它能够提供实时对话练习、语法纠错、词汇扩展建议和发音评估等功能，帮助用户随时随地提升英语能力。',
        techStack: ['Coze', 'GPT-4', 'JavaScript'],
        features: ['实时对话模拟', '语法纠错', '词汇扩展建议', '发音评估', '学习进度跟踪'],
        useCases: '适合日常口语练习、备考雅思托福、商务英语提升等场景',
        demoLink: 'https://www.coze.cn/store/agent/7570320960692191273?bot_id=true',
        githubRepo: null, // 如果有GitHub仓库可以添加
        stars: 0,
        forks: 0
    },
    project2: {
        id: 'project2',
        title: '第二大脑',
        status: '✓ 已完成',
        category: 'AI Agent',
        categoryId: 'ai-agent',
        date: '2025.11',
        emoji: '🧠',
        gradient: 'from-purple-500/20 to-pink-500/20',
        coverImage: 'images/project2-cover.jpg',
        shortDesc: '智能知识管理工具，帮助用户收集、整理并快速检索各类信息',
        fullDesc: '一个集成的智能知识管理系统，利用AI技术帮助用户自动分类、标签化和检索信息。支持网页收藏、图片识别、智能搜索等功能，是您的数字第二大脑。',
        techStack: ['Coze', 'Vue.js', 'Node.js', 'MongoDB'],
        features: ['信息收藏（网页、图片）', 'AI智能分类', '标签系统', '全文搜索', '笔记编辑'],
        useCases: '适用于研究学习、项目资料整理、灵感记录等',
        demoLink: 'https://www.coze.cn/store/agent/7571450183440384015?bot_id=true',
        githubRepo: null,
        stars: 0,
        forks: 0
    },
    project3: {
        id: 'project3',
        title: '变量命名智能体',
        status: '✓ 已完成',
        category: 'AI Agent',
        categoryId: 'ai-agent',
        date: '2025.11',
        emoji: '💻',
        gradient: 'from-green-500/20 to-teal-500/20',
        coverImage: 'images/project3-cover.jpg',
        shortDesc: '为开发者设计的AI工具，根据代码上下文智能生成变量名',
        fullDesc: '专为开发者打造的AI辅助工具，能够理解代码上下文，根据变量的用途和作用域智能生成符合命名规范的变量名建议，支持多种编程语言和命名风格。',
        techStack: ['Python', 'OpenAI API', 'FastAPI'],
        features: ['多语言支持', '上下文理解', '命名选项推荐', '风格选择（驼峰/下划线）'],
        useCases: '适用于开发中命名困难、代码重构等场景',
        demoLink: 'https://www.coze.cn/store/agent/7572856676387733510?bot_id=true',
        githubRepo: null,
        stars: 0,
        forks: 0
    },
    project4: {
        id: 'project4',
        title: '每日AI资讯信息发送',
        status: '✓ 已完成',
        category: 'AI Agent',
        categoryId: 'ai-agent',
        date: '2025.11',
        emoji: '📰',
        gradient: 'from-orange-500/20 to-red-500/20',
        coverImage: 'images/project4-cover.jpg',
        shortDesc: '自动抓取并推送最新AI行业动态的定时服务',
        fullDesc: '自动化资讯聚合服务，从多个AI相关源抓取最新动态，通过关键词过滤和AI摘要生成，定时推送给用户，让您随时掌握AI行业最新趋势。',
        techStack: ['Python', '爬虫', 'cron', 'BeautifulSoup', 'Coze API'],
        features: ['多源聚合', '关键词过滤', 'AI摘要生成', '定时推送', '个性化推荐'],
        useCases: '适合AI研究者、开发者每日获取领域动态',
        demoLink: 'https://www.coze.cn/space/7478698091047780352/bot/7549830130861621267',
        githubRepo: null,
        stars: 0,
        forks: 0
    },
    project5: {
        id: 'project5',
        title: '羽生结弦粉丝主页',
        status: '✓ 已完成',
        category: 'Web开发',
        categoryId: 'web',
        date: '2026.01',
        emoji: '⛸️',
        label: 'SPORTS',
        gradient: 'from-pink-500/20 to-purple-500/20',
        coverImage: 'images/project5-cover.jpg',
        shortDesc: '聚合羽生结弦最新动态、比赛视频与粉丝互动的专题网站',
        fullDesc: '为羽生结弦粉丝打造的专题网站，集成最新赛事信息、比赛视频、图片画廊和粉丝讨论区。采用响应式设计，提供流畅的用户体验。',
        techStack: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Vercel'],
        features: ['赛事信息实时更新', '高清视频库', '图片画廊', '粉丝讨论区', '响应式设计'],
        useCases: '为羽生结弦的粉丝提供一站式信息获取与交流平台',
        demoLink: 'https://yuzuru-hanyu-nxqr6jarf-gzxb001s-projects.vercel.app/',
        notesLink: 'https://vcn4n9sm0ggv.feishu.cn/docx/Nj4MduL5Oof14OxdGnhcpFh9nbc?from=from_copylink',
        githubRepo: null,
        stars: 0,
        forks: 0
    },
    project6: {
        id: 'project6',
        title: '蛋指标测量者',
        status: '✓ 已上线',
        category: '微信小程序',
        categoryId: 'miniprogram',
        date: '2025.01',
        emoji: '🥚',
        gradient: 'from-green-500/20 to-teal-500/20',
        coverImage: 'images/miniprogram-qrcode.png',
        shortDesc: '通过手机拍照自动获取蛋的长度、宽度及长宽比，辅助实验室测量工作',
        fullDesc: '基于AI视觉技术的微信小程序，通过拍照自动识别并测量蛋的尺寸指标。替代传统人工测量，提高实验室工作效率，支持数据记录和导出功能。',
        techStack: ['微信小程序', 'AI视觉', '图像处理', 'Python', 'TensorFlow'],
        features: ['拍照自动测量', '长度/宽度/长宽比计算', '数据记录功能', '结果导出Excel', '批量处理'],
        useCases: '适用于实验室蛋品质检测、家禽养殖场日常测量等场景',
        demoLink: 'https://github.com/gzxb001-sketch',
        githubRepo: 'https://github.com/gzxb001-sketch/egg-measurer',
        stars: 0,
        forks: 0
    },
    project7: {
        id: 'project7',
        title: 'AI面试助手',
        status: '✓ 已上线',
        category: 'AI Agent',
        categoryId: 'ai-agent',
        date: '2025.02',
        emoji: '💼',
        gradient: 'from-blue-500/20 to-indigo-500/20',
        coverImage: 'images/project7-cover.jpg',
        shortDesc: 'AI驱动的求职面试全流程辅导平台 - 智能简历解析、岗位分析、模拟面试',
        fullDesc: '全功能AI面试辅导平台，提供简历智能解析、岗位能力分析、个性化优化建议、模拟面试对话等功能，帮助求职者提升面试成功率。',
        techStack: ['Python', 'Flask', 'Claude API', 'SQLite', 'React'],
        features: ['智能简历解析', '岗位能力分析', '个性化优化建议', '模拟面试对话', '面试题库', '数据管理'],
        useCases: '适用于求职者准备面试、HR筛选候选人、职业规划辅导等场景',
        demoLink: 'https://github.com/alexanderkinging/JD-supervisor',
        githubRepo: 'https://github.com/alexanderkinging/JD-supervisor',
        stars: 0,
        forks: 0
    }
};

// ==================== 项目分类配置 ====================
const projectCategories = [
    { id: 'all', name: '全部项目', icon: '📚' },
    { id: 'ai-agent', name: 'AI Agent', icon: '🤖' },
    { id: 'web', name: 'Web开发', icon: '💻' },
    { id: 'miniprogram', name: '微信小程序', icon: '📱' }
];

// ==================== 状态筛选配置 ====================
const projectStatuses = [
    { id: 'all', name: '全部状态' },
    { id: 'online', name: '已上线' },
    { id: 'completed', name: '已完成' },
    { id: 'progress', name: '进行中' }
];

// ==================== 渲染项目卡片 ====================
function renderProjects(filteredProjects = null) {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    const projectsToRender = filteredProjects || Object.values(projectsData);

    projectsGrid.innerHTML = projectsToRender.map(project => `
        <div class="card project-card reveal overflow-hidden" data-category="${project.categoryId}" data-status="${project.status}">
            <!-- 封面图区域 -->
            <div class="project-cover-wrapper relative">
                ${project.coverImage ? `
                    <img src="${project.coverImage}"
                         alt="${project.title}"
                         class="w-full h-56 object-cover project-cover-image"
                         onerror="this.parentElement.innerHTML='<div class=\\'w-full h-56 flex items-center justify-center text-6xl\\' style=\\'background:${project.gradient}\\'>${project.emoji}</div>'">
                ` : `
                    <div class="w-full h-56 flex items-center justify-center project-cover-fallback" style="background: ${project.gradient}">
                        <span class="text-6xl">${project.emoji}</span>
                    </div>
                `}

                <!-- 悬停遮罩层 -->
                <div class="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button onclick="openModal('${project.id}')" class="btn-primary text-sm" style="transform: translateY(0);">
                        查看详情 →
                    </button>
                </div>
            </div>

            <!-- 内容区域 -->
            <div class="p-5">
                <!-- 项目头部 -->
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-2 flex-1 min-w-0">
                        <span class="text-xl flex-shrink-0">${project.emoji}</span>
                        <div class="min-w-0 flex-1">
                            <h3 class="text-lg font-bold leading-tight" style="color: var(--text-primary);">
                                ${project.title}
                            </h3>
                        </div>
                    </div>
                    <span class="text-xs font-mono flex-shrink-0 ml-2" style="color: var(--text-muted);">${project.date}</span>
                </div>

                <!-- 分类标签 -->
                <div class="flex items-center gap-2 mb-3">
                    <span class="text-xs font-semibold px-2 py-1 rounded" style="background: var(--bg-tertiary); color: var(--accent);">
                        ${project.category}
                    </span>
                    ${project.label ? `
                        <span class="text-xs font-bold px-2 py-1 rounded" style="background: var(--gradient-neon); color: white;">
                            ${project.label}
                        </span>
                    ` : ''}
                </div>

                <!-- 简短描述 -->
                <p class="text-sm mb-4 line-clamp-2" style="color: var(--text-secondary); line-height: 1.6;">
                    ${project.shortDesc}
                </p>

                <!-- 技术栈 -->
                <div class="flex flex-wrap gap-1.5 mb-4">
                    ${project.techStack.slice(0, 4).map(tech => `
                        <span class="text-xs px-2 py-1 rounded" style="background: rgba(249, 115, 22, 0.08); color: var(--text-secondary);">
                            ${tech}
                        </span>
                    `).join('')}
                    ${project.techStack.length > 4 ? `
                        <span class="text-xs px-2 py-1 rounded" style="background: rgba(249, 115, 22, 0.05); color: var(--text-muted);">
                            +${project.techStack.length - 4}
                        </span>
                    ` : ''}
                </div>

                <!-- 移动端按钮 -->
                <button onclick="openModal('${project.id}')" class="btn-secondary text-sm w-full lg:hidden" style="padding: 10px 20px;">
                    查看详情
                </button>
            </div>
        </div>
    `).join('');

    // 触发动画
    setTimeout(() => {
        document.querySelectorAll('.project-card').forEach(card => {
            card.classList.add('active');
        });
    }, 100);
}

// ==================== 项目筛选功能 ====================
let currentCategory = 'all';
let currentSearchTerm = '';

function filterProjects() {
    let filtered = Object.values(projectsData);

    // 按分类筛选
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.categoryId === currentCategory);
    }

    // 按搜索词筛选
    if (currentSearchTerm && currentSearchTerm.trim()) {
        const term = currentSearchTerm.toLowerCase().trim();

        console.log('🔍 搜索词:', term);  // 调试日志

        filtered = filtered.filter(p => {
            // 搜索标题
            const titleMatch = p.title.toLowerCase().includes(term);

            // 搜索简短描述
            const descMatch = p.shortDesc.toLowerCase().includes(term);

            // 搜索完整描述
            const fullDescMatch = p.fullDesc.toLowerCase().includes(term);

            // 搜索技术栈
            const techMatch = p.techStack.some(tech =>
                tech.toLowerCase().includes(term)
            );

            // 搜索分类
            const categoryMatch = p.category.toLowerCase().includes(term);

            // 搜索日期
            const dateMatch = p.date.includes(term);

            const match = titleMatch || descMatch || fullDescMatch || techMatch || categoryMatch || dateMatch;

            if (match) {
                console.log('✅ 匹配:', p.title, '- 字段:',
                    titleMatch ? '标题' : '',
                    descMatch ? '描述' : '',
                    techMatch ? '技术' : '',
                    categoryMatch ? '分类' : '',
                    dateMatch ? '日期' : ''
                );
            }

            return match;
        });

        console.log('📊 搜索结果数量:', filtered.length);
    }

    renderProjects(filtered);

    // 显示/隐藏"无结果"提示
    const noResults = document.getElementById('noResults');
    if (noResults) {
        if (filtered.length === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }
    }
}

// ==================== 初始化筛选标签 ====================
function initFilterTabs() {
    const filterContainer = document.querySelector('.filter-tabs');
    if (!filterContainer) return;

    filterContainer.innerHTML = projectCategories.map(cat => `
        <button class="filter-tab ${cat.id === 'all' ? 'active' : ''}" data-category="${cat.id}">
            ${cat.icon} ${cat.name}
        </button>
    `).join('');

    // 绑定点击事件
    filterContainer.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // 更新激活状态
            filterContainer.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 筛选项目
            currentCategory = tab.dataset.category;
            filterProjects();
        });
    });
}

// ==================== 初始化搜索功能 ====================
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            currentSearchTerm = e.target.value;
            filterProjects();
        }, 300);
    });
}

// ==================== 打开项目详情 ====================
function openModal(projectId) {
    const project = projectsData[projectId];
    if (!project) return;

    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');

    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
        <div class="p-8">
            <div class="flex items-start justify-between mb-6">
                <div class="flex items-center gap-4">
                    <span class="text-5xl">${project.emoji}</span>
                    <div>
                        <h2 class="text-3xl font-bold" style="color: var(--text-primary);">${project.title}</h2>
                        <div class="flex items-center gap-2 mt-2">
                            <span class="text-sm font-mono px-2 py-1 rounded" style="background: var(--bg-tertiary); color: var(--accent);">
                                ${project.status}
                            </span>
                            <span class="text-sm" style="color: var(--text-muted);">${project.date}</span>
                        </div>
                    </div>
                </div>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>

            <div class="prose max-w-none">
                <p class="text-lg mb-6" style="color: var(--text-secondary); line-height: 1.8;">${project.fullDesc}</p>

                <h3 class="text-xl font-bold mb-3" style="color: var(--text-primary);">核心功能</h3>
                <ul class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                    ${project.features.map(feature => `
                        <li class="flex items-center gap-2" style="color: var(--text-secondary);">
                            <svg class="w-5 h-5 flex-shrink-0" style="color: var(--accent);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            ${feature}
                        </li>
                    `).join('')}
                </ul>

                <h3 class="text-xl font-bold mb-3" style="color: var(--text-primary);">技术栈</h3>
                <div class="flex flex-wrap gap-2 mb-6">
                    ${project.techStack.map(tech => `
                        <span class="px-3 py-1 rounded-lg text-sm font-medium" style="background: var(--gradient-subtle); color: var(--accent);">
                            ${tech}
                        </span>
                    `).join('')}
                </div>

                <h3 class="text-xl font-bold mb-3" style="color: var(--text-primary);">适用场景</h3>
                <p class="mb-6" style="color: var(--text-secondary);">${project.useCases}</p>

                <div class="flex flex-wrap gap-3 pt-6 border-t" style="border-color: var(--border-color);">
                    <a href="${project.demoLink}" target="_blank" class="btn-primary">
                        <span>在线演示</span>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                    </a>

                    ${project.githubRepo ? `
                        <a href="${project.githubRepo}" target="_blank" class="btn-secondary">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            查看代码
                        </a>
                    ` : ''}

                    ${project.notesLink ? `
                        <a href="${project.notesLink}" target="_blank" class="btn-secondary">
                            📄 学习笔记
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ==================== 关闭模态框 ====================
function closeModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function closeModalOutside(event) {
    if (event.target.id === 'projectModal') {
        closeModal();
    }
}

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    initFilterTabs();
    initSearch();

    // ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

// 导出到全局
window.openModal = openModal;
window.closeModal = closeModal;
window.closeModalOutside = closeModalOutside;
