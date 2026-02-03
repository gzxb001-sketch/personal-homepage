/**
 * 单页应用路由系统 (SPA Router)
 *
 * 功能：
 * - 无刷新页面切换
 * - 保持音乐播放不中断
 * - 保持聊天窗口状态
 * - 支持浏览器前进/后退
 * - 平滑过渡动画
 */

class SPARouter {
    constructor() {
        this.currentPage = 'home';
        this.pages = ['home', 'about', 'portfolio', 'contact'];
        this.titles = {
            'home': '首页',
            'about': '关于我',
            'portfolio': '作品集',
            'contact': '联系我'
        };

        this.init();
    }

    /**
     * 初始化路由系统
     */
    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    /**
     * 设置路由
     */
    setup() {
        console.log('初始化SPA路由系统...');

        // 拦截导航链接
        this.interceptLinks();

        // 监听浏览器前进/后退
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.navigateTo(e.state.page, false);
            }
        });

        // 设置初始页面
        const hash = window.location.hash.slice(1) || 'home';
        this.navigateTo(hash, false);

        console.log('SPA路由系统初始化完成');
    }

    /**
     * 拦截导航链接
     */
    interceptLinks() {
        const navLinks = document.querySelectorAll('nav a[href^="#"]');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                const page = href.slice(1); // 移除 # 符号

                if (this.pages.includes(page)) {
                    this.navigateTo(page, true);
                }
            });
        });
    }

    /**
     * 导航到指定页面
     * @param {string} page - 页面名称
     * @param {boolean} pushState - 是否更新浏览器历史
     */
    navigateTo(page, pushState = true) {
        // 验证页面是否存在
        if (!this.pages.includes(page)) {
            console.warn(`页面不存在: ${page}`);
            page = 'home';
        }

        // 更新浏览器历史
        if (pushState) {
            history.pushState({ page }, '', `#${page}`);
        }

        // 隐藏当前页面
        this.hidePage(this.currentPage);

        // 显示新页面
        this.showPage(page);

        // 更新导航激活状态
        this.updateNavActive(page);

        // 更新页面标题
        document.title = `${this.titles[page]} - 王晓宇 | 公子小白`;

        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // 更新当前页面
        this.currentPage = page;

        console.log(`切换到页面: ${page}`);
    }

    /**
     * 隐藏页面
     * @param {string} page - 页面名称
     */
    hidePage(page) {
        const section = document.getElementById(`section-${page}`);
        if (!section) return;

        // 添加淡出动画
        section.style.opacity = '0';
        section.style.transform = 'translateY(10px)';

        setTimeout(() => {
            section.classList.add('hidden');
            section.style.display = 'none';
        }, 300);
    }

    /**
     * 显示页面
     * @param {string} page - 页面名称
     */
    showPage(page) {
        const section = document.getElementById(`section-${page}`);
        if (!section) return;

        // 先设置为可见，但透明
        section.classList.remove('hidden');
        section.style.display = 'block';

        // 触发重绘
        section.offsetHeight;

        // 添加淡入动画
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 50);
    }

    /**
     * 更新导航激活状态
     * @param {string} page - 页面名称
     */
    updateNavActive(page) {
        // 移除所有激活状态
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // 添加当前页面的激活状态
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${page}`) {
                link.classList.add('active');
            }
        });
    }
}

// 初始化路由系统
const spaRouter = new SPARouter();
