window.currentLang = getCookie('preferredLang') || 'en';
window.currentTheme = getCookie('theme') || 'dark';



document.addEventListener("DOMContentLoaded", function() {
  const accepted = getCookie("cookiesAccepted");
  if (accepted === "true") {
    const notice = document.getElementById("cookie-notice");
    if (notice) notice.style.display = "none";
  }
  const savedTheme = getCookie('theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  } else {
    document.body.classList.remove('light-mode');
  }

  updateThemeButtonText();
  applyLanguage();
  const currentPath = window.location.pathname;
  const homeBtn = document.getElementById('homeBtn');
  const statsBtn = document.getElementById('statsBtn');
  if (currentPath.includes('stats.html')) {
    statsBtn.classList.add('active');
    homeBtn.classList.remove('active');
  } else {
    homeBtn.classList.add('active');
    statsBtn.classList.remove('active');
  }

  const players = document.querySelectorAll('.player-name');

  players.forEach(player => {
    const ign = player.getAttribute('data-ign');
    const rank = player.getAttribute('data-rank') || "Staff";
    const skill = player.getAttribute('data-skill') || "玩家協助";

    const tooltip = document.createElement('div');
    tooltip.className = 'player-tooltip';

    tooltip.innerHTML = `
    <img class="tooltip-img"
         src="https://visage.surgeplay.com/head/128/${ign}"
         alt="${ign}">
    <span class="tooltip-ign">${ign}</span>
    <span class="tooltip-rank">${rank}</span>
    <span class="tooltip-skill">${skill}</span>
`;

    player.appendChild(tooltip);
  });
  const statsForm = document.getElementById("statsForm");

  if (statsForm) {
    statsForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("stats").value.trim();
      const result = document.getElementById("result");

      if (!name) {
        result.innerText = "Please enter a player name.";
        return;
      }

      const url = `https://api.bedtwl.com/api/v1/player/bwffa?player=${encodeURIComponent(name)}`;

      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error("API error: " + response.status);
          }
          return response.json();
        })
        .then(data => {
          result.innerHTML = `<span>Kills: </span>${data.kills}</span><span>Deaths: </span><span>${data.deaths}</span><br><span>Best Kill Streak: </span><span>${data.best_killstreak}</span><span>Last Kill Streak: </span><span>${data.last_killstreak}</span><br><span>Skill: </span><span>${data.skill}</span><br><span>Skill level: </span><span>${data.skill_level}</span><br>`;
        })
        .catch(error => {
          result.innerText = "Error fetching data: " + error.message;
        });
    });
  }
});

function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))
    ?.split('=')[1] || null;
}


function copyIP() {
  const ip = "bedtwL.com";
  navigator.clipboard.writeText(ip).then(() => {
    const btn = document.querySelector('.copy-btn');
    const originalText = btn.innerText;
    btn.innerText = "Copied!";
    btn.style.background = "#00ff55";
    setTimeout(() => {
      btn.innerText = originalText;
      btn.style.background = "";
    }, 2000);
  });
}

function updateThemeButtonText() {
  const themeBtn = document.getElementById('themeBtn');
  const isLight = document.body.classList.contains('light-mode');
  const mode = isLight ? 'light' : 'dark';

  const newText = themeBtn.getAttribute(`data-${currentLang}-${mode}`);
  if (newText) {
    themeBtn.innerText = newText;
  }
}


function toggleTheme() {
  const body = document.body;
  const isLight = body.classList.toggle('light-mode'); // 切換 light-mode
  setCookie('theme', isLight ? 'light' : 'dark', 365);

  updateThemeButtonText();
}
function toggleLanguage() {
  window.currentLang = (window.currentLang === 'en') ? 'zh' : 'en';
  setCookie('preferredLang', window.currentLang);
  applyLanguage();

  const langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.textContent = (window.currentLang === 'en') ? "EN / 繁體" : "繁體 / EN";
  }

  const elements = document.querySelectorAll('[data-en]');
  elements.forEach(el => {
    const enText = el.getAttribute('data-en');
    const zhText = el.getAttribute('data-zh');

    const newText = (currentLang === 'zh') ? (zhText || enText) : enText;

    if (newText.includes('<')) {
      el.innerHTML = newText;
    } else {
      el.textContent = newText;
    }
  });
  updateThemeButtonText();
}

function applyLanguage() {
  const elements = document.querySelectorAll('[data-en]');

  elements.forEach(el => {
    const enText = el.getAttribute('data-en');
    const zhText = el.getAttribute('data-zh');
    const text = (currentLang === 'zh') ? (zhText || enText) : enText;

    if (text.includes('<')) {
      el.innerHTML = text;
    } else {
      el.textContent = text;
    }
  });

  const langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.textContent = (currentLang === 'en') ? "EN / 繁體" : "繁體 / EN";
  }

  updateThemeButtonText();
}

function acceptCookies() {
  setCookie("cookiesAccepted", "true", 365);
  const notice = document.getElementById("cookie-notice");
  if (notice) notice.style.display = "none";
}

document.querySelectorAll('.yt-profile-card').forEach(card => {
  const url = card.href;
  const name = card.getAttribute('data-name');

  // 1. 從網址提取 Handle (例如 @MrBeast)
  const handleMatch = url.match(/@[\w\.-]+/);
  const handle = handleMatch ? handleMatch[0] : '';

  if (handle) {
    // 2. 自動設定頭貼 (利用 unavatar 服務)
    const avatarImg = card.querySelector('.yt-avatar');
    avatarImg.src = `https://unavatar.io/youtube/${handle}`;

    // 3. 自動設定名字 (如果有設定 data-name 就用它，沒有就顯示 handle)
    const nameText = card.querySelector('.yt-name');
    nameText.innerText = name || handle;
  }
});