const PH_ICONS = {
    'ph-pencil': `<svg class="ph-icon" viewBox="0 0 256 256"><path d="M227.31,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96A16,16,0,0,0,227.31,73.37ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.69,147.31,64l24-24L216,84.69Z"/></svg>`,
    'ph-trash': `<svg class="ph-icon" viewBox="0 0 256 256"><path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM192,208H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"/></svg>`
};

const DEFAULT_DIALS = [
    { id: '1', title: 'Google', url: 'https://www.google.com', icon: '' },
    { id: '2', title: 'YouTube', url: 'https://www.youtube.com', icon: '' },
    { id: '3', title: 'GitHub', url: 'https://github.com', icon: '' },
    { id: '4', title: 'Reddit', url: 'https://www.reddit.com', icon: '' }
];

const DEFAULT_WALLPAPERS = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1920&auto=format&fit=crop'
];

let speedDials = JSON.parse(localStorage.getItem('speed_dials')) || DEFAULT_DIALS;
let wallpaperMode = localStorage.getItem('wallpaper_mode') || 'unsplash';
let customWallpaperUrl = localStorage.getItem('custom_wallpaper_url') || '';
let localWallpaperData = localStorage.getItem('local_wallpaper_data') || '';
let currentBg = localStorage.getItem('wallpaper') || '';
let isCompactView = localStorage.getItem('compact_view') === 'true';

let columnCount = localStorage.getItem('column_count') !== null
    ? parseInt(localStorage.getItem('column_count'))
    : (window.innerWidth < 768 ? 4 : 8);

let savedTheme = localStorage.getItem('theme_mode') || 'dark';
let showRecentlyVisited = localStorage.getItem('show_recently_visited') !== 'false';
let sectionOrder = localStorage.getItem('section_order') || 'speed-first';
let isEditMode = false;
let wallpaperIndex = parseInt(localStorage.getItem('wallpaper_index') || '0');

const contentWrapper = document.getElementById('content-sections-wrapper');
const dialSection = document.getElementById('speed-dial-section');
const recentSection = document.getElementById('recently-visited-section');
const pageWrapperContainer = document.getElementById('page-wrapper-container');

const dialContainer = document.getElementById('speed-dial-container');
const recentContainer = document.getElementById('recently-visited-container');
const recentEyeOpenIcon = document.getElementById('recent-eye-open-icon');
const recentEyeClosedIcon = document.getElementById('recent-eye-closed-icon');
const toggleRecentBtn = document.getElementById('toggle-recent-visibility-btn');
const clearAllDialsBtn = document.getElementById('clear-all-dials-btn');
const nextWallpaperBtn = document.getElementById('next-wallpaper-btn');

const bgContainer = document.getElementById('bg-container');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const dialCountEl = document.getElementById('dial-count');
const layoutToggleBtn = document.getElementById('layout-toggle-btn');
const layoutGridIcon = document.getElementById('layout-grid-icon');
const layoutListIcon = document.getElementById('layout-list-icon');
const editModeToggleBtn = document.getElementById('edit-mode-toggle-btn');
const themeSunIcon = document.getElementById('theme-sun-icon');
const themeMoonIcon = document.getElementById('theme-moon-icon');

const columnSlider = document.getElementById('column-count-slider');
const columnValEl = document.getElementById('column-count-value');
const sectionOrderSelect = document.getElementById('section-order-select');

const wpModeNoneBtn = document.getElementById('wp-mode-none-btn');
const wpModeCustomBtn = document.getElementById('wp-mode-custom-btn');
const wpModeLocalBtn = document.getElementById('wp-mode-local-btn');
const wpModeUnsplashBtn = document.getElementById('wp-mode-unsplash-btn');

const customWpContainer = document.getElementById('custom-wp-input-container');
const customWpInput = document.getElementById('custom-wallpaper-input');
const applyCustomWpBtn = document.getElementById('apply-custom-wallpaper-btn');

const localWpContainer = document.getElementById('local-wp-input-container');
const localWpFileInput = document.getElementById('local-wallpaper-file-input');
const localWpFilename = document.getElementById('local-wp-filename');

let draggedIndex = null;

const tabButtons = document.querySelectorAll('.settings-tab-btn');
const tabPanes = document.querySelectorAll('.settings-tab-pane');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        tabButtons.forEach(b => b.classList.remove('active-tab'));
        tabPanes.forEach(p => p.classList.add('hidden'));
        btn.classList.add('active-tab');
        document.getElementById(`tab-${targetTab}`).classList.remove('hidden');
    });
});

const shortcutTabBtns = document.querySelectorAll('.shortcut-tab-btn');
const shortcutTabPanes = document.querySelectorAll('.shortcut-tab-pane');

shortcutTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.dataset.shortcutTab;
        shortcutTabBtns.forEach(b => b.classList.remove('active-shortcut-tab'));
        shortcutTabPanes.forEach(p => p.classList.add('hidden'));
        btn.classList.add('active-shortcut-tab');
        document.getElementById(`shortcut-tab-${targetTab}`).classList.remove('hidden');
        if (targetTab === 'history') {
            renderHistoryImportList();
        }
    });
});

// Fast persistence: localStorage is synchronous and keeps the new-tab UI instant.
// chrome.storage is mirrored asynchronously so it never sits on the critical path.
let storageWriteTimer = null;
function saveSpeedDials() {
    const serialized = JSON.stringify(speedDials);
    localStorage.setItem('speed_dials', serialized);

    if (window.chrome?.storage?.local) {
        clearTimeout(storageWriteTimer);
        storageWriteTimer = setTimeout(() => {
            chrome.storage.local.set({ speed_dials: speedDials });
        }, 0);
    }
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        themeMoonIcon.classList.add('hidden');
        themeSunIcon.classList.remove('hidden');
    } else {
        document.documentElement.classList.remove('dark');
        themeMoonIcon.classList.remove('hidden');
        themeSunIcon.classList.add('hidden');
    }
    localStorage.setItem('theme_mode', theme);
}

document.getElementById('theme-toggle').addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
});

function applySectionOrder(order) {
    sectionOrder = order;
    localStorage.setItem('section_order', order);
    sectionOrderSelect.value = order;

    if (order === 'recent-first') {
        contentWrapper.insertBefore(recentSection, dialSection);
    } else {
        contentWrapper.insertBefore(dialSection, recentSection);
    }
}

sectionOrderSelect.addEventListener('change', (e) => applySectionOrder(e.target.value));

function updateGridColumns(cols) {
    columnCount = cols;
    localStorage.setItem('column_count', cols);
    columnValEl.textContent = `${cols} Columns`;
    columnSlider.value = cols;

    if (!isCompactView) {
        dialContainer.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
        recentContainer.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
    } else {
        dialContainer.style.gridTemplateColumns = 'none';
        recentContainer.style.gridTemplateColumns = 'none';
    }

    renderRecentlyVisited();
}

let columnUpdateTimer = null;
columnSlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value, 10);
    // Update the visible grid immediately; refresh history only after the user stops sliding.
    columnCount = value;
    localStorage.setItem('column_count', value);
    columnValEl.textContent = `${value} Columns`;
    columnSlider.value = value;

    if (!isCompactView) {
        dialContainer.style.gridTemplateColumns = `repeat(${value}, minmax(0, 1fr))`;
        recentContainer.style.gridTemplateColumns = `repeat(${value}, minmax(0, 1fr))`;
    }

    clearTimeout(columnUpdateTimer);
    columnUpdateTimer = setTimeout(() => renderRecentlyVisited(), 120);
});

function updateLayoutToggleUI() {
    if (isCompactView) {
        layoutGridIcon.classList.remove('hidden');
        layoutListIcon.classList.add('hidden');
    } else {
        layoutGridIcon.classList.add('hidden');
        layoutListIcon.classList.remove('hidden');
    }
}

function setEditMode(active) {
    isEditMode = active;
    if (isEditMode) {
        editModeToggleBtn.classList.add('active-edit-mode');
        clearAllDialsBtn.classList.remove('hidden');
    } else {
        editModeToggleBtn.classList.remove('active-edit-mode');
        clearAllDialsBtn.classList.add('hidden');
    }
    renderSpeedDials();
}

editModeToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    setEditMode(!isEditMode);
});

pageWrapperContainer.addEventListener('click', (e) => {
    if (isEditMode) {
        if (!e.target.closest('.glass-card') && !e.target.closest('#edit-mode-toggle-btn') && !e.target.closest('#clear-all-dials-btn')) {
            setEditMode(false);
        }
    }
});

clearAllDialsBtn.addEventListener('click', () => {
    if (speedDials.length === 0) {
        alert('No shortcuts to clear.');
        return;
    }
    if (confirm('Are you sure you want to clear all speed dial shortcuts?')) {
        speedDials = [];
        saveSpeedDials();
        renderSpeedDials();
    }
});

// Fast favicon system.
// IMPORTANT: never fetch/parse a complete website just to paint a shortcut.
// The browser can load /favicon.ico immediately; cached discovered icons are
// reused, while optional discovery happens in the background.
const faviconMemoryCache = new Map();
const faviconPending = new Map();

function normalizeUrl(rawUrl) {
    try {
        return new URL(rawUrl.startsWith('http') ? rawUrl : 'https://' + rawUrl);
    } catch {
        return null;
    }
}

function faviconFallback(rawUrl) {
    const parsed = normalizeUrl(rawUrl);
    return parsed ? `${parsed.origin}/favicon.ico` : '';
}

function extractSiteFavicon(rawUrl) {
    const parsed = normalizeUrl(rawUrl);
    if (!parsed) return '';

    const baseUrl = parsed.origin;
    if (faviconMemoryCache.has(baseUrl)) return faviconMemoryCache.get(baseUrl);

    const cacheKey = `cached_icon_${baseUrl}`;
    const stored = localStorage.getItem(cacheKey);
    if (stored) {
        faviconMemoryCache.set(baseUrl, stored);
        return stored;
    }

    // Instant fallback. No network request is made here.
    const fallback = `${baseUrl}/favicon.ico`;
    faviconMemoryCache.set(baseUrl, fallback);
    return fallback;
}

// Optional background discovery preserves the old "site icon" behavior,
// but it never blocks rendering, imports, or navigation.
function discoverSiteFavicon(rawUrl) {
    const parsed = normalizeUrl(rawUrl);
    if (!parsed) return Promise.resolve('');

    const baseUrl = parsed.origin;
    if (faviconPending.has(baseUrl)) return faviconPending.get(baseUrl);

    const promise = fetch(parsed.href, { mode: 'cors', credentials: 'omit' })
        .then(response => response.ok ? response.text() : '')
        .then(html => {
            if (!html) return faviconFallback(rawUrl);

            const doc = new DOMParser().parseFromString(html, 'text/html');
            const link = doc.querySelector(
                "link[rel~='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon'], link[rel='fluid-icon']"
            );

            let href = link?.getAttribute('href')?.trim() || faviconFallback(rawUrl);
            try {
                href = new URL(href, parsed.href).href;
            } catch {
                href = faviconFallback(rawUrl);
            }

            faviconMemoryCache.set(baseUrl, href);
            localStorage.setItem(`cached_icon_${baseUrl}`, href);
            return href;
        })
        .catch(() => faviconFallback(rawUrl))
        .finally(() => faviconPending.delete(baseUrl));

    faviconPending.set(baseUrl, promise);
    return promise;
}

function backgroundPrefetchIcons() {
    // Only discover missing/uncached icons. Work is scheduled after first paint.
    const queue = speedDials.filter(dial => dial.url && !localStorage.getItem(`cached_icon_${normalizeUrl(dial.url)?.origin || ''}`));

    let index = 0;
    const runNext = () => {
        if (index >= queue.length) return;
        const dial = queue[index++];

        discoverSiteFavicon(dial.url).then(icon => {
            if (icon && dial.icon !== icon && dial.icon?.startsWith('http')) {
                dial.icon = icon;
                // Persist in batches instead of once per favicon.
                saveSpeedDials();
            }
        }).finally(() => {
            setTimeout(runNext, 25);
        });
    };

    if (queue.length) setTimeout(runNext, 250);
}

let recentRenderToken = 0;
let recentRenderTimer = null;

function renderRecentlyVisited() {
    const token = ++recentRenderToken;

    if (!showRecentlyVisited) {
        recentContainer.classList.add('hidden');
        recentEyeOpenIcon.classList.add('hidden');
        recentEyeClosedIcon.classList.remove('hidden');
        return;
    }

    recentContainer.classList.remove('hidden');
    recentEyeOpenIcon.classList.remove('hidden');
    recentEyeClosedIcon.classList.add('hidden');
    recentContainer.innerHTML = '';

    if (isCompactView) {
        recentContainer.classList.add('dial-list-view');
        recentContainer.style.gridTemplateColumns = 'none';
    } else {
        recentContainer.classList.remove('dial-list-view');
        recentContainer.style.gridTemplateColumns = `repeat(${columnCount}, minmax(0, 1fr))`;
    }

    if (!(window.chrome && chrome.history)) {
        recentSection.classList.add('hidden');
        return;
    }

    chrome.history.search({ text: '', maxResults: Math.max(columnCount * 4, 20) }, (results) => {
        if (token !== recentRenderToken) return;

        const seenDomains = new Set();
        const uniqueSiteItems = [];

        for (const item of results || []) {
            if (!item.url || !item.url.startsWith('http')) continue;

            try {
                const parsed = new URL(item.url);
                const domain = parsed.hostname;
                if (!seenDomains.has(domain)) {
                    seenDomains.add(domain);
                    uniqueSiteItems.push({
                        item,
                        url: item.url,
                        title: item.title || domain,
                        icon: extractSiteFavicon(item.url)
                    });
                }
            } catch {}

            if (uniqueSiteItems.length >= columnCount) break;
        }

        if (uniqueSiteItems.length === 0) {
            recentSection.classList.add('hidden');
            return;
        }

        recentSection.classList.remove('hidden');

        // Build the complete DOM synchronously. No favicon/network await inside the loop.
        const fragment = document.createDocumentFragment();

        for (const site of uniqueSiteItems) {
            const tile = document.createElement('div');
            tile.className = 'glass-card group relative p-3.5 rounded-2xl flex flex-col items-center justify-center cursor-pointer select-none';
            tile.dataset.url = site.url;

            const badgeDiv = document.createElement('div');
            badgeDiv.className = 'icon-circle-badge glass-panel shadow-sm mb-2 shrink-0';

            const img = document.createElement('img');
            img.src = site.icon;
            img.alt = site.title;
            img.loading = 'lazy';
            img.decoding = 'async';
            img.className = 'w-full h-full object-cover rounded-full';

            img.addEventListener('error', () => {
                img.onerror = null;
                badgeDiv.textContent = site.title.charAt(0).toUpperCase();
                badgeDiv.classList.add('text-sm', 'font-bold', 'text-slate-900', 'dark:text-white');
            }, { once: true });

            badgeDiv.appendChild(img);

            const span = document.createElement('span');
            span.className = 'dial-title text-xs font-bold text-center text-slate-900 dark:text-white truncate w-full';
            span.title = site.title;
            span.textContent = site.title;

            tile.append(badgeDiv, span);
            fragment.appendChild(tile);
        }

        recentContainer.appendChild(fragment);
    });
}

toggleRecentBtn.addEventListener('click', () => {
    showRecentlyVisited = !showRecentlyVisited;
    localStorage.setItem('show_recently_visited', showRecentlyVisited);
    renderRecentlyVisited();
});

// One delegated click handler is cheaper than one listener per history tile.
recentContainer.addEventListener('click', (e) => {
    const tile = e.target.closest('.glass-card[data-url]');
    if (tile?.dataset.url) window.location.href = tile.dataset.url;
});

function renderSpeedDials() {
    dialContainer.innerHTML = '';
    dialCountEl.textContent = speedDials.length;
    updateLayoutToggleUI();

    if (isCompactView) {
        dialContainer.classList.add('dial-list-view');
        dialContainer.style.gridTemplateColumns = 'none';
    } else {
        dialContainer.classList.remove('dial-list-view');
        dialContainer.style.gridTemplateColumns = `repeat(${columnCount}, minmax(0, 1fr))`;
    }

    speedDials.forEach((dial, index) => {
        const tile = document.createElement('div');
        tile.className = 'glass-card group relative p-3.5 rounded-2xl flex flex-col items-center justify-center cursor-pointer select-none';

        tile.setAttribute('draggable', isEditMode ? 'true' : 'false');
        tile.dataset.index = index;

        const badgeDiv = document.createElement('div');
        badgeDiv.className = 'icon-circle-badge glass-panel shadow-sm mb-2 shrink-0';

        if (dial.icon && !dial.icon.startsWith('http')) {
            const spanIcon = document.createElement('span');
            spanIcon.className = 'text-xl';
            spanIcon.textContent = dial.icon;
            badgeDiv.appendChild(spanIcon);
        } else {
            const img = document.createElement('img');
            img.src = dial.icon || `${new URL(dial.url).origin}/favicon.ico`;
            img.alt = dial.title;
            img.className = 'w-full h-full object-cover rounded-full';
            img.addEventListener('error', () => {
                badgeDiv.innerHTML = `<span class="text-sm font-bold text-slate-900 dark:text-white">${dial.title.charAt(0).toUpperCase()}</span>`;
            });
            badgeDiv.appendChild(img);
        }

        if (isEditMode) {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'absolute top-2 right-2 z-20 flex space-x-1';

            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.className = 'edit-dial-btn p-1.5 rounded-lg text-xs font-bold shadow-sm';
            editBtn.dataset.id = dial.id;
            editBtn.title = 'Edit';
            editBtn.innerHTML = PH_ICONS['ph-pencil'];

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'delete-dial-btn p-1.5 rounded-lg text-xs font-bold shadow-sm';
            deleteBtn.dataset.id = dial.id;
            deleteBtn.title = 'Delete';
            deleteBtn.innerHTML = PH_ICONS['ph-trash'];

            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);
            tile.appendChild(actionsDiv);
        }

        const titleSpan = document.createElement('span');
        titleSpan.className = 'dial-title text-xs font-bold text-center text-slate-900 dark:text-white truncate w-full';
        titleSpan.title = dial.title;
        titleSpan.textContent = dial.title;

        tile.appendChild(badgeDiv);
        tile.appendChild(titleSpan);

        if (isEditMode) {
            tile.addEventListener('dragstart', (e) => {
                draggedIndex = index;
                tile.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });

            tile.addEventListener('dragend', () => {
                tile.classList.remove('dragging');
                document.querySelectorAll('.glass-card').forEach(c => c.classList.remove('drag-over'));
            });

            tile.addEventListener('dragover', (e) => {
                e.preventDefault();
                tile.classList.add('drag-over');
            });

            tile.addEventListener('dragleave', () => {
                tile.classList.remove('drag-over');
            });

            tile.addEventListener('drop', (e) => {
                e.preventDefault();
                tile.classList.remove('drag-over');
                if (draggedIndex !== null && draggedIndex !== index) {
                    const movedItem = speedDials.splice(draggedIndex, 1)[0];
                    speedDials.splice(index, 0, movedItem);
                    saveSpeedDials();
                    renderSpeedDials();
                }
            });
        }

        dialContainer.appendChild(tile);
    });
}

layoutToggleBtn.addEventListener('click', () => {
    isCompactView = !isCompactView;
    localStorage.setItem('compact_view', isCompactView);
    renderSpeedDials();
    renderRecentlyVisited();
});

function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    document.getElementById('date').textContent = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}
setInterval(updateClock, 1000);
updateClock();

function setWallpaperMode(mode, customUrl = '', localData = '') {
    wallpaperMode = mode;
    localStorage.setItem('wallpaper_mode', mode);

    [wpModeNoneBtn, wpModeCustomBtn, wpModeLocalBtn, wpModeUnsplashBtn].forEach(b => b.classList.remove('active-wp-mode'));
    customWpContainer.classList.add('hidden');
    localWpContainer.classList.add('hidden');

    if (mode === 'none') {
        wpModeNoneBtn.classList.add('active-wp-mode');
        bgContainer.style.backgroundImage = 'none';
        currentBg = 'none';
        localStorage.setItem('wallpaper', 'none');
    }
    else if (mode === 'custom') {
        wpModeCustomBtn.classList.add('active-wp-mode');
        customWpContainer.classList.remove('hidden');
        if (customUrl) {
            customWallpaperUrl = customUrl;
            localStorage.setItem('custom_wallpaper_url', customUrl);
        }
        if (customWallpaperUrl) {
            customWpInput.value = customWallpaperUrl;
            bgContainer.style.backgroundImage = `url('${customWallpaperUrl}')`;
            currentBg = customWallpaperUrl;
            localStorage.setItem('wallpaper', customWallpaperUrl);
        }
    }
    else if (mode === 'local') {
        wpModeLocalBtn.classList.add('active-wp-mode');
        localWpContainer.classList.remove('hidden');
        if (localData) {
            localWallpaperData = localData;
            localStorage.setItem('local_wallpaper_data', localData);
        }
        if (localWallpaperData) {
            localWpFilename.textContent = 'Change Local Image';
            bgContainer.style.backgroundImage = `url('${localWallpaperData}')`;
            currentBg = localWallpaperData;
            localStorage.setItem('wallpaper', localWallpaperData);
        }
    }
    else if (mode === 'unsplash') {
        wpModeUnsplashBtn.classList.add('active-wp-mode');
        applyUnsplashWallpaper();
    }
}

function applyUnsplashWallpaper() {
    const today = new Date().toDateString();
    const lastFetchDate = localStorage.getItem('unsplash_last_date');
    let unsplashUrl = localStorage.getItem('unsplash_current_url');

    if (lastFetchDate !== today || !unsplashUrl) {
        unsplashUrl = DEFAULT_WALLPAPERS[wallpaperIndex % DEFAULT_WALLPAPERS.length];
        localStorage.setItem('unsplash_last_date', today);
        localStorage.setItem('unsplash_current_url', unsplashUrl);
    }

    currentBg = unsplashUrl;
    bgContainer.style.backgroundImage = `url('${unsplashUrl}')`;
    localStorage.setItem('wallpaper', unsplashUrl);
}

nextWallpaperBtn.addEventListener('click', () => {
    wallpaperIndex = (wallpaperIndex + 1) % DEFAULT_WALLPAPERS.length;
    localStorage.setItem('wallpaper_index', wallpaperIndex);
    const nextUrl = DEFAULT_WALLPAPERS[wallpaperIndex];
    localStorage.setItem('unsplash_current_url', nextUrl);

    if (wallpaperMode !== 'unsplash') {
        setWallpaperMode('unsplash');
    } else {
        currentBg = nextUrl;
        bgContainer.style.backgroundImage = `url('${nextUrl}')`;
        localStorage.setItem('wallpaper', nextUrl);
    }
});

wpModeNoneBtn.addEventListener('click', () => setWallpaperMode('none'));
wpModeCustomBtn.addEventListener('click', () => setWallpaperMode('custom'));
wpModeLocalBtn.addEventListener('click', () => setWallpaperMode('local'));
wpModeUnsplashBtn.addEventListener('click', () => setWallpaperMode('unsplash'));

applyCustomWpBtn.addEventListener('click', () => {
    const url = customWpInput.value.trim();
    if (url) setWallpaperMode('custom', url);
});

localWpFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        const base64Data = evt.target.result;
        setWallpaperMode('local', '', base64Data);
    };
    reader.readAsDataURL(file);
});

document.getElementById('add-bookmarks-to-dial-btn').addEventListener('click', () => {
    if (!confirm('Add your browser bookmarks to speed dial?')) return;

    if (window.chrome?.bookmarks) {
        chrome.bookmarks.getTree((nodes) => {
            const existing = new Set(speedDials.map(d => d.url));
            const imported = [];

            const traverse = (nodeList) => {
                for (const node of nodeList || []) {
                    if (node.url?.startsWith('http') && !existing.has(node.url)) {
                        existing.add(node.url);
                        imported.push({
                            id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                            title: node.title || 'Bookmark',
                            url: node.url,
                            icon: extractSiteFavicon(node.url)
                        });
                    }
                    if (node.children) traverse(node.children);
                }
            };

            traverse(nodes);
            speedDials.push(...imported);
            saveSpeedDials();
            renderSpeedDials();

            // Icon discovery is optional background work, never part of import latency.
            imported.forEach(dial => discoverSiteFavicon(dial.url).then(icon => {
                if (icon && dial.icon !== icon) {
                    dial.icon = icon;
                    saveSpeedDials();
                }
            }));

            alert(`Added ${imported.length} bookmarks to speed dial!`);
        });
    } else {
        alert('Browser bookmarks API unavailable.');
    }
});

document.getElementById('import-external-bookmarks-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        let count = 0;
        try {
            const content = evt.target.result;
            const imported = [];
            const existing = new Set(speedDials.map(d => d.url));

            if (file.name.toLowerCase().endsWith('.json')) {
                const parsed = JSON.parse(content);
                const list = Array.isArray(parsed)
                    ? parsed
                    : (parsed.speed_dials || parsed.bookmarks || []);

                for (const item of list) {
                    const url = item.url || item.uri;
                    if (!url?.startsWith('http') || existing.has(url)) continue;

                    existing.add(url);
                    imported.push({
                        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                        title: item.title || 'Imported Shortcut',
                        url,
                        icon: extractSiteFavicon(url)
                    });
                }
            } else {
                const anchorRegex = /<a\s+([^>]+)>([^<]+)<\/a>/gi;
                let match;

                while ((match = anchorRegex.exec(content)) !== null) {
                    const attrStr = match[1];
                    const title = match[2].trim();
                    const hrefMatch = attrStr.match(/HREF="([^"]+)"/i) || attrStr.match(/href="([^"]+)"/i);
                    const url = hrefMatch?.[1];

                    if (!url?.startsWith('http') || existing.has(url)) continue;

                    existing.add(url);
                    imported.push({
                        id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                        title: title || 'Bookmark',
                        url,
                        icon: extractSiteFavicon(url)
                    });
                }
            }

            speedDials.push(...imported);
            count = imported.length;
            saveSpeedDials();
            renderSpeedDials();

            // Discover better icons after the UI is already updated.
            imported.forEach(dial => discoverSiteFavicon(dial.url).then(icon => {
                if (icon && dial.icon !== icon) {
                    dial.icon = icon;
                    saveSpeedDials();
                }
            }));

            alert(`Successfully imported ${count} shortcuts from bookmark file!`);
        } catch {
            alert('Failed to parse external bookmark file format.');
        }
    };
    reader.readAsText(file);
});

document.getElementById('add-topsites-to-dial-btn').addEventListener('click', () => {
    if (!confirm("Add browser's top site to speed dial?")) return;

    if (window.chrome?.topSites) {
        chrome.topSites.get((sites) => {
            const existing = new Set(speedDials.map(d => d.url));
            const imported = [];

            for (const site of sites || []) {
                if (!site.url?.startsWith('http') || existing.has(site.url)) continue;

                existing.add(site.url);
                imported.push({
                    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                    title: site.title || 'Top Site',
                    url: site.url,
                    icon: extractSiteFavicon(site.url)
                });
            }

            speedDials.push(...imported);
            saveSpeedDials();
            renderSpeedDials();

            imported.forEach(dial => discoverSiteFavicon(dial.url).then(icon => {
                if (icon && dial.icon !== icon) {
                    dial.icon = icon;
                    saveSpeedDials();
                }
            }));

            alert(`Added ${imported.length} top sites to speed dial!`);
        });
    } else {
        alert('Browser topSites API unavailable.');
    }
});

let historyImportToken = 0;

function renderHistoryImportList() {
    const container = document.getElementById('history-import-list-container');
    if (!container) return;

    const token = ++historyImportToken;
    container.innerHTML = '<p class="text-xs text-slate-500 text-center py-2">Loading recent history...</p>';

    if (!window.chrome?.history) {
        container.innerHTML = '<p class="text-xs text-rose-500 text-center py-2">Browser history API unavailable.</p>';
        return;
    }

    chrome.history.search({ text: '', maxResults: 20 }, (results) => {
        if (token !== historyImportToken) return;

        const items = (results || [])
            .filter(h => h.url?.startsWith('http'))
            .slice(0, 10);

        container.innerHTML = '';

        if (!items.length) {
            container.innerHTML = '<p class="text-xs text-slate-500 text-center py-2">No recent history found.</p>';
            return;
        }

        const existing = new Set(speedDials.map(d => d.url));
        const fragment = document.createDocumentFragment();

        for (const item of items) {
            const parsed = normalizeUrl(item.url);
            const titleText = item.title || parsed?.hostname || item.url;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 gap-2';

            const infoDiv = document.createElement('div');
            infoDiv.className = 'flex items-center space-x-2 overflow-hidden flex-1';

            const img = document.createElement('img');
            img.src = extractSiteFavicon(item.url);
            img.loading = 'lazy';
            img.decoding = 'async';
            img.className = 'w-5 h-5 rounded-full shrink-0 object-cover';
            img.addEventListener('error', () => {
                img.onerror = null;
                img.replaceWith(document.createTextNode(titleText.charAt(0).toUpperCase()));
            }, { once: true });

            const textSpan = document.createElement('span');
            textSpan.className = 'text-xs font-semibold text-slate-900 dark:text-white truncate';
            textSpan.title = titleText;
            textSpan.textContent = titleText;

            infoDiv.append(img, textSpan);

            const addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.className = 'settings-btn-primary px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0';
            addBtn.textContent = existing.has(item.url) ? 'Added' : 'Add';
            addBtn.disabled = existing.has(item.url);
            if (addBtn.disabled) addBtn.classList.add('opacity-50');

            addBtn.addEventListener('click', () => {
                if (existing.has(item.url)) return;

                existing.add(item.url);
                const dial = {
                    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                    title: titleText,
                    url: item.url,
                    icon: extractSiteFavicon(item.url)
                };

                speedDials.push(dial);
                saveSpeedDials();
                renderSpeedDials();

                addBtn.textContent = 'Added';
                addBtn.disabled = true;
                addBtn.classList.add('opacity-50');

                discoverSiteFavicon(item.url).then(icon => {
                    if (icon && dial.icon !== icon) {
                        dial.icon = icon;
                        saveSpeedDials();
                    }
                });
            });

            itemDiv.append(infoDiv, addBtn);
            fragment.appendChild(itemDiv);
        }

        container.appendChild(fragment);
    });
}

document.getElementById('export-settings-btn').addEventListener('click', () => {
    const settingsBackup = {
        app_name: "Next New Tab",
        timestamp: new Date().toISOString(),
        speed_dials: speedDials,
        wallpaper_mode: wallpaperMode,
        custom_wallpaper_url: customWallpaperUrl,
        local_wallpaper_data: localWallpaperData,
        wallpaper: currentBg,
        compact_view: isCompactView,
        column_count: columnCount,
        theme_mode: savedTheme,
        show_recently_visited: showRecentlyVisited,
        section_order: sectionOrder
    };

    const blob = new Blob([JSON.stringify(settingsBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `next-new-tab-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
});

document.getElementById('import-settings-file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!confirm(`Import configuration backup from "${file.name}"? This will overwrite existing speed dials and settings.`)) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            const config = JSON.parse(evt.target.result);
            if (Array.isArray(config.speed_dials)) speedDials = config.speed_dials;
            if (config.wallpaper_mode) wallpaperMode = config.wallpaper_mode;
            if (typeof config.custom_wallpaper_url !== 'undefined') customWallpaperUrl = config.custom_wallpaper_url;
            if (typeof config.local_wallpaper_data !== 'undefined') localWallpaperData = config.local_wallpaper_data;
            if (typeof config.compact_view !== 'undefined') isCompactView = config.compact_view;
            if (config.column_count) columnCount = config.column_count;
            if (config.theme_mode) savedTheme = config.theme_mode;
            if (typeof config.show_recently_visited !== 'undefined') showRecentlyVisited = config.show_recently_visited;
            if (config.section_order) sectionOrder = config.section_order;

            saveSpeedDials();
            localStorage.setItem('compact_view', isCompactView);
            localStorage.setItem('show_recently_visited', showRecentlyVisited);

            applyTheme(savedTheme);
            applySectionOrder(sectionOrder);
            updateGridColumns(columnCount);
            renderSpeedDials();
            setWallpaperMode(wallpaperMode, customWallpaperUrl, localWallpaperData);

            alert('Extension settings and Speed Dials imported successfully!');
        } catch (err) {
            alert('Invalid configuration file format.');
        }
    };
    reader.readAsText(file);
});

const dialModal = document.getElementById('dial-modal');
const dialModalCard = document.getElementById('dial-modal-card');
const dialForm = document.getElementById('dial-form');
const dialIdInput = document.getElementById('dial-id');
const dialTitleInput = document.getElementById('dial-title');
const dialUrlInput = document.getElementById('dial-url');
const dialIconInput = document.getElementById('dial-icon');
const iconFetchStrategySelect = document.getElementById('icon-fetch-strategy');
const customIconWrapper = document.getElementById('custom-icon-input-wrapper');

iconFetchStrategySelect.addEventListener('change', (e) => {
    if (e.target.value === 'custom') {
        customIconWrapper.classList.remove('hidden');
    } else {
        customIconWrapper.classList.add('hidden');
    }
});

function openDialModal(dial = null) {
    if (dial) {
        document.getElementById('modal-title').textContent = 'Edit Shortcut';
        dialIdInput.value = dial.id;
        dialTitleInput.value = dial.title;
        dialUrlInput.value = dial.url;
        dialIconInput.value = dial.icon || '';
        if (dial.icon && !dial.icon.startsWith('http')) {
            iconFetchStrategySelect.value = 'custom';
            customIconWrapper.classList.remove('hidden');
        } else {
            iconFetchStrategySelect.value = 'direct';
            customIconWrapper.classList.add('hidden');
        }
    } else {
        document.getElementById('modal-title').textContent = 'Add Shortcut';
        dialForm.reset();
        dialIdInput.value = '';
        iconFetchStrategySelect.value = 'direct';
        customIconWrapper.classList.add('hidden');
    }
    dialModal.classList.remove('hidden');
}

function closeDialModal() {
    dialModal.classList.add('hidden');
}

document.getElementById('auto-fetch-btn').addEventListener('click', async () => {
    let rawUrl = dialUrlInput.value.trim();
    if (!rawUrl) {
        alert('Please enter a website URL first.');
        return;
    }
    if (!rawUrl.startsWith('http')) rawUrl = 'https://' + rawUrl;
    dialUrlInput.value = rawUrl;

    try {
        const parsedUrl = new URL(rawUrl);
        const domain = parsedUrl.hostname.replace('www.', '');

        if (!dialTitleInput.value.trim()) {
            dialTitleInput.value = domain.charAt(0).toUpperCase() + domain.slice(1);
        }

        try {
            const response = await fetch(rawUrl);
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const pageTitle = doc.querySelector('title');
            if (pageTitle && pageTitle.textContent.trim()) {
                dialTitleInput.value = pageTitle.textContent.trim();
            }
        } catch (fetchErr) {}

        const siteIcon = await discoverSiteFavicon(rawUrl);
        if (siteIcon) {
            iconFetchStrategySelect.value = 'direct';
            customIconWrapper.classList.add('hidden');
            dialIconInput.value = siteIcon;
        }

        alert(`Successfully fetched details and site icon for ${domain}!`);
    } catch (e) {
        alert('Please enter a valid URL.');
    }
});

dialUrlInput.addEventListener('blur', () => {
    let rawUrl = dialUrlInput.value.trim();
    if (!rawUrl) return;
    if (!rawUrl.startsWith('http')) rawUrl = 'https://' + rawUrl;

    try {
        const parsedUrl = new URL(rawUrl);
        const domain = parsedUrl.hostname.replace('www.', '');
        if (!dialTitleInput.value.trim()) {
            dialTitleInput.value = domain.charAt(0).toUpperCase() + domain.slice(1);
        }
    } catch (e) {}
});

dialForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = dialIdInput.value;
    let url = dialUrlInput.value.trim();
    if (!url.startsWith('http')) url = 'https://' + url;

    const strategy = iconFetchStrategySelect.value;
    let finalIcon = '';

    if (strategy === 'custom') {
        finalIcon = dialIconInput.value.trim();
    } else {
        finalIcon = extractSiteFavicon(url);
    }

    const parsedUrl = new URL(url);
    const defaultTitle = parsedUrl.hostname.replace('www.', '');
    const titleVal = dialTitleInput.value.trim() || (defaultTitle.charAt(0).toUpperCase() + defaultTitle.slice(1));

    const newDial = {
        id: id || Date.now().toString(),
        title: titleVal,
        url: url,
        icon: finalIcon
    };

    if (id) speedDials = speedDials.map(d => d.id === id ? newDial : d);
    else speedDials.push(newDial);

    saveSpeedDials();
    renderSpeedDials();
    closeDialModal();
});

document.getElementById('add-dial-btn').addEventListener('click', () => openDialModal());
document.getElementById('close-dial-modal').addEventListener('click', closeDialModal);
document.getElementById('cancel-dial-btn').addEventListener('click', closeDialModal);

dialModal.addEventListener('click', (e) => {
    if (!dialModalCard.contains(e.target)) closeDialModal();
});

// Single delegated handler for all speed-dial interactions.
dialContainer.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-dial-btn');
    const deleteBtn = e.target.closest('.delete-dial-btn');

    if (editBtn) {
        e.stopPropagation();
        const dial = speedDials.find(d => d.id === editBtn.dataset.id);
        if (dial) openDialModal(dial);
        return;
    }

    if (deleteBtn) {
        e.stopPropagation();
        const targetDial = speedDials.find(d => d.id === deleteBtn.dataset.id);
        const titleName = targetDial ? targetDial.title : 'this shortcut';

        if (confirm(`Are you sure you want to delete "${titleName}"?`)) {
            speedDials = speedDials.filter(d => d.id !== deleteBtn.dataset.id);
            saveSpeedDials();
            renderSpeedDials();
        }
        return;
    }

    if (!isEditMode) {
        const tile = e.target.closest('.glass-card[data-index]');
        if (tile) {
            const dial = speedDials[Number(tile.dataset.index)];
            if (dial?.url) window.location.href = dial.url;
        }
    }
});

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    if (query.match(/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/.*)?$/i)) {
        window.location.href = query.startsWith('http') ? query : 'https://' + query;
    } else if (window.chrome && chrome.search && chrome.search.query) {
        chrome.search.query({ text: query, disposition: 'CURRENT_TAB' });
    } else {
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    }
});

const settingsModal = document.getElementById('settings-modal');
const settingsBtn = document.getElementById('settings-btn');
const settingsCard = document.getElementById('settings-modal-card');

function toggleSettingsModal() { settingsModal.classList.toggle('hidden'); }

settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSettingsModal();
});

document.getElementById('close-settings-modal').addEventListener('click', () => settingsModal.classList.add('hidden'));

settingsModal.addEventListener('click', (e) => {
    if (!settingsCard.contains(e.target)) settingsModal.classList.add('hidden');
});

document.getElementById('reset-data-btn').addEventListener('click', () => {
    if (confirm('Reset Next New Tab back to original default settings?')) {
        localStorage.clear();

        speedDials = DEFAULT_DIALS;
        wallpaperMode = 'unsplash';
        customWallpaperUrl = '';
        localWallpaperData = '';
        isCompactView = false;
        columnCount = window.innerWidth < 768 ? 4 : 8;
        savedTheme = 'dark';
        showRecentlyVisited = true;
        sectionOrder = 'speed-first';
        isEditMode = false;
        wallpaperIndex = 0;

        saveSpeedDials();
        applyTheme(savedTheme);
        applySectionOrder(sectionOrder);
        updateGridColumns(columnCount);
        renderSpeedDials();
        setWallpaperMode('unsplash');

        settingsModal.classList.add('hidden');
        alert('Next New Tab has been reset to defaults!');
    }
});

window.addEventListener('DOMContentLoaded', () => {
    applyTheme(savedTheme);
    applySectionOrder(sectionOrder);
    updateGridColumns(columnCount);
    renderSpeedDials();
    setWallpaperMode(wallpaperMode, customWallpaperUrl, localWallpaperData);
    
    setTimeout(backgroundPrefetchIcons, 1000);
});
