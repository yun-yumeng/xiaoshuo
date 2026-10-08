/* 公共逻辑：主题切换、数据加载、灯箱、页脚 */
(function () {
  // ---- 主题 ----
  var KEY = 'site-theme';
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    var btn = document.querySelector('[data-theme-toggle]');
    if (btn) btn.textContent = t === 'dark' ? '☀' : '☾';
  }
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  applyTheme(saved || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(KEY, next); } catch (err) {}
  });

  // ---- 数据加载（带缓存）----
  var cache = {};
  window.loadJSON = function (url) {
    if (cache[url]) return cache[url];
    cache[url] = fetch(url, { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error(url + ' → ' + r.status);
        return r.json();
      })
      .catch(function (err) {
        console.error(err);
        if (location.protocol === 'file:') {
          throw new Error('请用本地服务器打开（README 里有命令），file:// 下浏览器禁止读取内容文件。');
        }
        throw err;
      });
    return cache[url];
  };

  window.loadText = function (url) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(url + ' → ' + r.status);
      return r.text();
    });
  };

  window.fmtSize = function (bytes) {
    if (bytes == null) return '';
    var u = ['B', 'KB', 'MB', 'GB'], i = 0, n = bytes;
    while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
    return (i === 0 ? n : n.toFixed(1)) + ' ' + u[i];
  };

  window.escHtml = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };

  window.qs = function (name) {
    return new URLSearchParams(location.search).get(name);
  };

  // ---- 灯箱 ----
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = '<img alt="">';
  document.addEventListener('DOMContentLoaded', function () { document.body.appendChild(lb); });
  lb.addEventListener('click', function () { lb.classList.remove('show'); });

  document.addEventListener('click', function (e) {
    var img = e.target.closest('[data-zoom]');
    if (!img) return;
    lb.querySelector('img').src = img.currentSrc || img.src;
    lb.classList.add('show');
  });

  // ---- 页脚年份 ----
  document.addEventListener('DOMContentLoaded', function () {
    var y = document.querySelector('[data-year]');
    if (y) y.textContent = new Date().getFullYear();
    var path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a.link').forEach(function (a) {
      if (a.getAttribute('href') === path) a.classList.add('active');
    });
  });
})();
