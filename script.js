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

// Settings Tab Logic
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

// Shortcut Modal Tab Logic
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

function saveSpeedDials() {
    localStorage.setItem('speed_dials', JSON.stringify(speedDials));
    if (window.chrome && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ speed_dials: speedDials });
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

columnSlider.addEventListener('input', (e) => updateGridColumns(parseInt(e.target.value)));

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

function getFaviconUrl(url, strategy = 'direct') {
    try {
        const parsedUrl = new URL(url);
        return `${parsedUrl.origin}/favicon.ico`;
    } catch (e) {
        return '';
    }
}

// Site Favicon Extractor with local storage caching and update checking
async function extractSiteFavicon(rawUrl) {
    try {
        let urlObj = new URL(rawUrl.startsWith('http') ? rawUrl : 'https://' + rawUrl);
        const baseUrl = urlObj.origin;
        const cacheKey = `cached_icon_${baseUrl}`;
        let cachedIconData = JSON.parse(localStorage.getItem(cacheKey) || '{}');

        let fetchedHref = '';
        const response = await fetch(urlObj.href, { mode: 'cors' }).catch(() => null);
        if (response && response.ok) {
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            
            const iconSelectors = [
                "link[rel='icon']",
                "link[rel='shortcut icon']",
                "link[rel='apple-touch-icon']",
                "link[rel='fluid-icon']"
            ];

            for (const selector of iconSelectors) {
                const linkEl = doc.querySelector(selector);
                if (linkEl && linkEl.getAttribute('href')) {
                    let href = linkEl.getAttribute('href').trim();
                    if (href.startsWith('//')) {
                        href = urlObj.protocol + href;
                    } else if (href.startsWith('/')) {
                        href = baseUrl + href;
                    } else if (!href.startsWith('http')) {
                        href = baseUrl + '/' + href;
                    }
                    fetchedHref = href;
                    break;
                }
            }
        }

        if (!fetchedHref) {
            const directTest = await fetch(`${baseUrl}/favicon.ico`, { method: 'HEAD', mode: 'cors' }).catch(() => null);
            if (directTest && directTest.ok) {
                fetchedHref = `${baseUrl}/favicon.ico`;
            } else {
                fetchedHref = `${baseUrl}/favicon.ico`;
            }
        }

        // Only update icon if it was changed/updated from before
        if (cachedIconData.url === fetchedHref && cachedIconData.data) {
            return cachedIconData.data;
        }

        // Save and return new icon locally
        localStorage.setItem(cacheKey, JSON.stringify({ url: fetchedHref, data: fetchedHref }));
        return fetchedHref;
    } catch (err) {
        try {
            const parsedUrl = new URL(rawUrl.startsWith('http') ? rawUrl : 'https://' + rawUrl);
            return `${parsedUrl.origin}/favicon.ico`;
        } catch (e) {
            return '';
        }
    }
}

function renderRecentlyVisited() {
    if (!showRecentlyVisited) {
        recentContainer.classList.add('hidden');
        recentEyeOpenIcon.classList.add('hidden');
        recentEyeClosedIcon.classList.remove('hidden');
        return;
    } else {
        recentContainer.classList.remove('hidden');
        recentEyeOpenIcon.classList.remove('hidden');
        recentEyeClosedIcon.classList.add('hidden');
    }

    recentContainer.innerHTML = '';

    if (isCompactView) {
        recentContainer.classList.add('dial-list-view');
        recentContainer.style.gridTemplateColumns = 'none';
    } else {
        recentContainer.classList.remove('dial-list-view');
        recentContainer.style.gridTemplateColumns = `repeat(${columnCount}, minmax(0, 1fr))`;
    }

    if (window.chrome && chrome.history) {
        // Fetch a larger pool of history entries to uniquely filter down to 1 page per site/domain
        chrome.history.search({ text: '', maxResults: columnCount * 10 }, (results) => {
            const seenDomains = new Set();
            const uniqueSiteItems = [];

            for (const item of results) {
                if (item.url && item.url.startsWith('http')) {
                    try {
                        const domain = new URL(item.url).hostname;
                        if (!seenDomains.has(domain)) {
                            seenDomains.add(domain);
                            uniqueSiteItems.push(item);
                        }
                    } catch (e) {}
                }
                if (uniqueSiteItems.length >= columnCount) break;
            }

            if (uniqueSiteItems.length === 0) {
                recentSection.classList.add('hidden');
                return;
            }

            recentSection.classList.remove('hidden');
            uniqueSiteItems.forEach(item => {
                const tile = document.createElement('div');
                tile.className = 'glass-card group relative p-3.5 rounded-2xl flex flex-col items-center justify-center cursor-pointer select-none';

                const titleText = item.title || new URL(item.url).hostname;

                const badgeDiv = document.createElement('div');
                badgeDiv.className = 'icon-circle-badge glass-panel shadow-sm mb-2 shrink-0';

                const img = document.createElement('img');
                img.src = getFaviconUrl(item.url);
                img.alt = titleText;
                img.className = 'w-full h-full object-cover rounded-full';

                img.addEventListener('error', () => {
                    badgeDiv.innerHTML = `<span class="text-sm font-bold text-slate-900 dark:text-white">${titleText.charAt(0).toUpperCase()}</span>`;
                });

                badgeDiv.appendChild(img);

                const span = document.createElement('span');
                span.className = 'dial-title text-xs font-bold text-center text-slate-900 dark:text-white truncate w-full';
                span.title = titleText;
                span.textContent = titleText;

                tile.appendChild(badgeDiv);
                tile.appendChild(span);

                tile.addEventListener('click', () => window.location.href = item.url);
                recentContainer.appendChild(tile);
            });
        });
    } else {
        recentSection.classList.add('hidden');
    }
}

toggleRecentBtn.addEventListener('click', () => {
    showRecentlyVisited = !showRecentlyVisited;
    localStorage.setItem('show_recently_visited', showRecentlyVisited);
    renderRecentlyVisited();
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

        if (dial.icon && dial.icon.startsWith('http')) {
            const img = document.createElement('img');
            img.src = dial.icon;
            img.alt = dial.title;
            img.className = 'w-full h-full object-cover rounded-full';
            img.addEventListener('error', () => {
                img.src = `https://placehold.co/32x32/6366f1/white?text=${dial.title.charAt(0)}`;
            });
            badgeDiv.appendChild(img);
        } else if (dial.icon) {
            const spanIcon = document.createElement('span');
            spanIcon.className = 'text-xl';
            spanIcon.textContent = dial.icon;
            badgeDiv.appendChild(spanIcon);
        } else {
            const img = document.createElement('img');
            img.src = getFaviconUrl(dial.url);
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

        tile.addEventListener('click', async (e) => {
            if (!e.target.closest('.edit-dial-btn') && !e.target.closest('.delete-dial-btn')) {
                if (!isEditMode) {
                    // Update icon upon visiting if the site icon changed
                    const updatedIcon = await extractSiteFavicon(dial.url);
                    if (updatedIcon && updatedIcon !== dial.icon) {
                        dial.icon = updatedIcon;
                        saveSpeedDials();
                    }
                    window.location.href = dial.url;
                }
            }
        });

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

document.getElementById('add-bookmarks-to-dial-btn').addEventListener('click', async () => {
    if (!confirm('Add your browser bookmarks to speed dial?')) return;

    if (window.chrome && chrome.bookmarks) {
        chrome.bookmarks.getTree(async (nodes) => {
            let count = 0;
            async function traverse(nodeList) {
                for (const node of nodeList) {
                    if (node.url && node.url.startsWith('http')) {
                        if (!speedDials.some(d => d.url === node.url)) {
                            const extractedIcon = await extractSiteFavicon(node.url);
                            speedDials.push({
                                id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
                                title: node.title || 'Bookmark',
                                url: node.url,
                                icon: extractedIcon
                            });
                            count++;
                        }
                    }
                    if (node.children) await traverse(node.children);
                }
            }
            await traverse(nodes);
            saveSpeedDials();
            renderSpeedDials();
            alert(`Added ${count} bookmarks to speed dial!`);
        });
    } else {
        alert('Browser bookmarks API unavailable.');
    }
});

document.getElementById('import-external-bookmarks-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(evt) {
        const content = evt.target.result;
        let count = 0;

        try {
            if (file.name.endsWith('.json')) {
                const parsed = JSON.parse(content);
                const list = Array.isArray(parsed) ? parsed : (parsed.speed_dials || parsed.bookmarks || []);
                for (const item of list) {
                    const url = item.url || item.uri;
                    const title = item.title || 'Imported Shortcut';
                    if (url && url.startsWith('http') && !speedDials.some(d => d.url === url)) {
                        const extractedIcon = await extractSiteFavicon(url);
                        speedDials.push({
                            id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
                            title: title,
                            url: url,
                            icon: extractedIcon
                        });
                        count++;
                    }
                }
            } else {
                const anchorRegex = /<a\s+([^>]+)>([^<]+)<\/a>/gi;
                let match;
                while ((match = anchorRegex.exec(content)) !== null) {
                    const attrStr = match[1];
                    const title = match[2].trim();
                    const hrefMatch = attrStr.match(/HREF="([^"]+)"/i) || attrStr.match(/href="([^"]+)"/i);

                    if (hrefMatch && hrefMatch[1]) {
                        const url = hrefMatch[1];
                        if (url.startsWith('http') && !speedDials.some(d => d.url === url)) {
                            const extractedIcon = await extractSiteFavicon(url);
                            speedDials.push({
                                id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
                                title: title || 'Bookmark',
                                url: url,
                                icon: extractedIcon
                            });
                            count++;
                        }
                    }
                }
            }

            saveSpeedDials();
            renderSpeedDials();
            alert(`Successfully imported ${count} shortcuts from bookmark file!`);
        } catch (err) {
            alert('Failed to parse external bookmark file format.');
        }
    };
    reader.readAsText(file);
});

document.getElementById('add-topsites-to-dial-btn').addEventListener('click', () => {
    if (!confirm("Add browser's top site to speed dial?")) return;

    if (window.chrome && chrome.topSites) {
        chrome.topSites.get(async (sites) => {
            let count = 0;
            for (const site of sites) {
                if (site.url && site.url.startsWith('http') && !speedDials.some(d => d.url === site.url)) {
                    const extractedIcon = await extractSiteFavicon(site.url);
                    speedDials.push({
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
                        title: site.title || 'Top Site',
                        url: site.url,
                        icon: extractedIcon
                    });
                    count++;
                }
            }
            saveSpeedDials();
            renderSpeedDials();
            alert(`Added ${count} top sites to speed dial!`);
        });
    } else {
        alert('Browser topSites API unavailable.');
    }
});

// Render Manual History Import List (Last 10 History Items)
function renderHistoryImportList() {
    const container = document.getElementById('history-import-list-container');
    if (!container) return;
    container.innerHTML = '<p class="text-xs text-slate-500 text-center py-2">Loading recent history...</p>';

    if (window.chrome && chrome.history) {
        chrome.history.search({ text: '', maxResults: 15 }, (results) => {
            const items = results.filter(h => h.url && h.url.startsWith('http')).slice(0, 10);
            container.innerHTML = '';

            if (items.length === 0) {
                container.innerHTML = '<p class="text-xs text-slate-500 text-center py-2">No recent history found.</p>';
                return;
            }

            items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 gap-2';

                const infoDiv = document.createElement('div');
                infoDiv.className = 'flex items-center space-x-2 overflow-hidden flex-1';

                const titleText = item.title || new URL(item.url).hostname;

                const img = document.createElement('img');
                img.src = getFaviconUrl(item.url);
                img.className = 'w-5 h-5 rounded-full shrink-0 object-cover';
                img.addEventListener('error', () => { img.src = `https://placehold.co/20x20/6366f1/white?text=${titleText.charAt(0)}`; });

                const textSpan = document.createElement('span');
                textSpan.className = 'text-xs font-semibold text-slate-900 dark:text-white truncate';
                textSpan.title = titleText;
                textSpan.textContent = titleText;

                infoDiv.appendChild(img);
                infoDiv.appendChild(textSpan);

                const addBtn = document.createElement('button');
                addBtn.type = 'button';
                addBtn.className = 'settings-btn-primary px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0';
                addBtn.textContent = 'Add';
                addBtn.addEventListener('click', async () => {
                    const extractedIcon = await extractSiteFavicon(item.url);
                    if (!speedDials.some(d => d.url === item.url)) {
                        speedDials.push({
                            id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
                            title: titleText,
                            url: item.url,
                            icon: extractedIcon
                        });
                        saveSpeedDials();
                        renderSpeedDials();
                        addBtn.textContent = 'Added';
                        addBtn.disabled = true;
                        addBtn.classList.add('opacity-50');
                    } else {
                        alert('This shortcut is already in your Speed Dials.');
                    }
                });

                itemDiv.appendChild(infoDiv);
                itemDiv.appendChild(addBtn);
                container.appendChild(itemDiv);
            });
        });
    } else {
        container.innerHTML = '<p class="text-xs text-rose-500 text-center py-2">Browser history API unavailable.</p>';
    }
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
        iconFetchStrategySelect.value = 'direct'; // Default to direct site icon extraction system
        customIconWrapper.classList.add('hidden');
    }
    dialModal.classList.remove('hidden');
}

function closeDialModal() {
    dialModal.classList.add('hidden');
}

// Auto-Fetch Section with Site Icon Extraction
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
        } catch (fetchErr) {
            console.log('Direct fetch restricted by target site headers, using domain fallback.');
        }

        const siteIcon = await extractSiteFavicon(rawUrl);
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
        finalIcon = await extractSiteFavicon(url);
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

dialContainer.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-dial-btn');
    const deleteBtn = e.target.closest('.delete-dial-btn');

    if (editBtn) {
        e.stopPropagation();
        const dial = speedDials.find(d => d.id === editBtn.dataset.id);
        if (dial) openDialModal(dial);
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
});
