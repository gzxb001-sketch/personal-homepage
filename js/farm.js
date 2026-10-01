// ==================== 数字农田 Hero（会生长的主页） ====================
// 依赖：projects.js 中的 projectsData 与 openModal、main.js 中的 showToast
(function () {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scene = document.getElementById('farmScene');
    if (!scene) return;
    const root = document.documentElement;

    // 果实在场景中的位置（百分比坐标）
    const FRUITS = [
        { id: 'project1', x: 29, y: 18 },
        { id: 'project2', x: 24, y: 38 },
        { id: 'project3', x: 34, y: 34 },
        { id: 'project4', x: 20, y: 58 },
        { id: 'project5', x: 38, y: 52 },
        { id: 'project6', x: 28, y: 74 },
        { id: 'project7', x: 42, y: 70 }
    ];

    // ---------- 渲染果实（数据与作品集同源） ----------
    function renderFruits() {
        const box = document.getElementById('farmFruits');
        if (!box || typeof projectsData === 'undefined') return;
        const chips = FRUITS.map((f, i) => {
            const p = projectsData[f.id];
            if (!p) return '';
            return `<button class="fruit-chip" style="--i:${i}; left:${f.x}%; top:${f.y}%" data-project="${f.id}" aria-label="${p.title}，点击查看详情" title="${p.shortDesc}">
                <span class="fruit-dot">${p.emoji}</span>
                <span class="fruit-label">${p.title}</span>
            </button>`;
        }).join('');
        const sprout = `<button class="fruit-chip is-sprout" style="--i:${FRUITS.length}; left:53%; top:80%" data-sprout aria-label="新作物培育中">
            <span class="fruit-dot">🌱</span>
            <span class="fruit-label">新作物培育中</span>
        </button>`;
        box.innerHTML = chips + sprout;

        box.querySelectorAll('[data-project]').forEach(chip => {
            chip.addEventListener('click', () => {
                if (typeof openModal === 'function') openModal(chip.dataset.project);
            });
        });
        box.querySelector('[data-sprout]')?.addEventListener('click', () => {
            showToast('新作物流一中：正在发芽，敬请期待 🌱');
        });
    }

    // ---------- 浇水互动 ----------
    const WATER_KEYS = { growth: 'xz_farm_growth', times: 'xz_farm_water' };
    // 安全存储：file:// 或受限环境下 localStorage 不可用时静默降级
    const store = {
        get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
    };
    const WATER_TOASTS = [
        '小白谢谢你！生长 +1% 🌱',
        '水灵灵的果实又圆了一点 🍊',
        '根部吸收良好，继续加油！',
        '喵~ 谢谢投喂清水！',
        '感觉今晚能长出一个新想法 💡'
    ];
    function getGrowth() {
        return Math.min(100, parseInt(store.get(WATER_KEYS.growth) || '32', 10) || 32);
    }
    function renderGrowth() {
        const g = getGrowth();
        const fill = document.getElementById('farmGrowthFill');
        const num = document.getElementById('farmGrowthNum');
        if (fill) fill.style.width = g + '%';
        if (num) num.textContent = g + '%';
    }
    function water() {
        const btn = document.getElementById('farmWaterBtn');
        if (!btn || btn.disabled) return;
        btn.disabled = true;

        // 水滴
        const drops = document.getElementById('farmDrops');
        if (drops) {
            for (let i = 0; i < 9; i++) {
                const d = document.createElement('span');
                d.className = 'farm-drop';
                d.style.left = (24 + Math.random() * 16) + '%';
                d.style.animationDelay = (Math.random() * 0.3) + 's';
                drops.appendChild(d);
                setTimeout(() => d.remove(), 1500);
            }
        }
        // 植物摇摆
        const plant = scene.querySelector('.farm-plant');
        if (plant) {
            plant.classList.remove('sway');
            void plant.offsetWidth; // 重置动画
            plant.classList.add('sway');
        }
        // 生长值（本地记录，诚实的小游戏）
        const g = Math.min(100, getGrowth() + 1);
        store.set(WATER_KEYS.growth, String(g));
        store.set(WATER_KEYS.times, String((parseInt(store.get(WATER_KEYS.times) || '0', 10) || 0) + 1));
        renderGrowth();
        showToast(WATER_TOASTS[Math.floor(Math.random() * WATER_TOASTS.length)]);
        setTimeout(() => { btn.disabled = false; }, 900);
    }

    // ---------- 猫咪瞳孔跟随鼠标 ----------
    function bindPupils() {
        const pupils = scene.querySelectorAll('.farm-pupil');
        if (!pupils.length) return;
        let raf = null;
        scene.addEventListener('mousemove', (e) => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = null;
                const rect = scene.getBoundingClientRect();
                const cx = rect.left + rect.width * 0.75; // 猫咪大致位置
                const cy = rect.top + rect.height * 0.62;
                const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)));
                const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)));
                pupils.forEach(p => {
                    p.style.transform = `translate(${(dx * 2.6).toFixed(2)}px, ${(dy * 2.2).toFixed(2)}px)`;
                });
            });
        });
        scene.addEventListener('mouseleave', () => {
            pupils.forEach(p => { p.style.transform = 'translate(0, 0)'; });
        });
    }

    // ---------- 进场序列：AI 生成农田 ----------
    const PROMPT_TEXT = '帮我做一个农学生转型AI开发者的主页…';
    function typePrompt(el) {
        return new Promise(resolve => {
            let i = 0;
            const timer = setInterval(() => {
                el.textContent = PROMPT_TEXT.slice(0, ++i);
                if (i >= PROMPT_TEXT.length) { clearInterval(timer); resolve(); }
            }, 55);
        });
    }
    async function playIntro() {
        const intro = document.getElementById('farmIntro');
        const textEl = document.getElementById('farmPromptText');
        const status = document.getElementById('farmIntroStatus');
        if (!intro || !textEl) { root.classList.add('farm-ready'); return; }
        root.classList.add('farm-intro-on');
        try {
            await typePrompt(textEl);
            await new Promise(r => setTimeout(r, 250));
            intro.classList.add('go');
            if (status) status.textContent = '生成中，正在种下果实…';
            await new Promise(r => setTimeout(r, 1000));
            if (status) status.textContent = '生成完毕 ✓ 灵魂已手工注入';
            await new Promise(r => setTimeout(r, 450));
        } finally {
            root.classList.remove('farm-intro-on');
            root.classList.add('farm-ready');
        }
    }

    // ---------- 初始化 ----------
    function init() {
        renderFruits();
        renderGrowth();
        bindPupils();
        document.getElementById('farmWaterBtn')?.addEventListener('click', water);

        const playedThisSession = store.get('xz_farm_intro');
        if (reduced || playedThisSession) {
            root.classList.add('farm-ready');
        } else {
            store.set('xz_farm_intro', '1');
            playIntro();
            // 兜底：任何情况下 6.5s 内结束进场
            setTimeout(() => {
                root.classList.add('farm-ready');
                root.classList.remove('farm-intro-on');
            }, 6500);
        }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
