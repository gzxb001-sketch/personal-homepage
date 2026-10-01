// ==================== Cmd+K 命令面板 ====================
// 依赖：main.js 的 navigateToPage/copyLink/showToast、projects.js 的 projectsData/openModal
(function () {
    const root = document.documentElement;
    let open = false;
    let items = [];
    let filtered = [];
    let activeIndex = 0;
    let els = null;

    // ---------- 命令清单 ----------
    function buildItems() {
        const list = [];
        [
            ['home', '首页'],
            ['about', '关于我'],
            ['portfolio', '作品集'],
            ['skills', '技能'],
            ['blog', '学习笔记'],
            ['contact', '联系我']
        ].forEach(([id, label]) => list.push({
            label,
            hint: '页面',
            run: () => navigateToPage(id)
        }));

        if (typeof projectsData !== 'undefined') {
            Object.values(projectsData).forEach(p => list.push({
                label: p.title,
                hint: '项目',
                run: () => {
                    navigateToPage('portfolio');
                    openModal(p.id);
                }
            }));
        }

        list.push(
            {
                label: '查看生长日志',
                hint: '页面',
                run: () => {
                    navigateToPage('about');
                    setTimeout(() => {
                        document.getElementById('changelog')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 350);
                }
            },
            { label: '复制本页链接', hint: '动作', run: () => copyLink() },
            { label: '去我的 GitHub', hint: '动作', run: () => window.open('https://github.com/gzxb001-sketch', '_blank') },
            { label: '喵一声', hint: '彩蛋', run: () => showToast('喵~ 🐱') }
        );
        return list;
    }

    // ---------- DOM ----------
    function ensureDom() {
        if (els) return;
        const overlay = document.createElement('div');
        overlay.className = 'cmdk-overlay';
        overlay.id = 'cmdkOverlay';
        overlay.innerHTML = `
            <div class="cmdk-panel" role="dialog" aria-modal="true" aria-label="命令面板">
                <input class="cmdk-input" id="cmdkInput" type="text" placeholder="搜索页面、项目或动作…" aria-label="搜索命令" autocomplete="off">
                <div class="cmdk-list" id="cmdkList" role="listbox"></div>
                <div class="cmdk-foot">
                    <span><kbd>↑↓</kbd> 选择</span>
                    <span><kbd>Enter</kbd> 执行</span>
                    <span><kbd>Esc</kbd> 关闭</span>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        const input = overlay.querySelector('#cmdkInput');
        const list = overlay.querySelector('#cmdkList');
        els = { overlay, input, list };

        input.addEventListener('input', () => render(input.value));
        input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
            else if (e.key === 'Enter') { e.preventDefault(); exec(activeIndex); }
        });
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) setOpen(false);
        });
    }

    // ---------- 渲染与交互 ----------
    function render(query) {
        const q = (query || '').trim().toLowerCase();
        filtered = items.filter(it => !q || it.label.toLowerCase().includes(q));
        activeIndex = 0;
        if (!filtered.length) {
            els.list.innerHTML = '<div class="cmdk-empty">什么都没长出来…换个关键词试试 🌱</div>';
            return;
        }
        els.list.innerHTML = filtered.map((it, i) => `
            <button class="cmdk-item ${i === activeIndex ? 'active' : ''}" role="option" data-i="${i}" aria-selected="${i === activeIndex}">
                <span>${it.label}</span>
                <span class="cmdk-hint">${it.hint}</span>
            </button>
        `).join('');
        els.list.querySelectorAll('.cmdk-item').forEach(btn => {
            btn.addEventListener('mouseenter', () => setActive(parseInt(btn.dataset.i, 10)));
            btn.addEventListener('click', () => exec(parseInt(btn.dataset.i, 10)));
        });
    }
    function setActive(i) {
        if (!filtered.length) return;
        activeIndex = Math.max(0, Math.min(filtered.length - 1, i));
        els.list.querySelectorAll('.cmdk-item').forEach(btn => {
            const idx = parseInt(btn.dataset.i, 10);
            btn.classList.toggle('active', idx === activeIndex);
            btn.setAttribute('aria-selected', String(idx === activeIndex));
            if (idx === activeIndex) btn.scrollIntoView({ block: 'nearest' });
        });
    }
    function move(dir) { setActive(activeIndex + dir); }
    function exec(i) {
        const it = filtered[i];
        if (!it) return;
        setOpen(false);
        it.run();
    }

    function setOpen(v) {
        if (v === open) return;
        open = v;
        ensureDom();
        els.overlay.classList.toggle('on', open);
        document.body.style.overflow = open ? 'hidden' : '';
        if (open) {
            els.input.value = '';
            render('');
            setTimeout(() => els.input.focus(), 30);
        }
    }

    // ---------- 全局事件 ----------
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            setOpen(!open);
        } else if (e.key === 'Escape' && open) {
            setOpen(false);
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        items = buildItems();
        ensureDom();
        document.getElementById('cmdkOpen')?.addEventListener('click', () => setOpen(true));
        document.getElementById('cmdkOpenMobile')?.addEventListener('click', () => setOpen(true));
    });
})();
