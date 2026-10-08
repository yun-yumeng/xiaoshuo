/* 极简 Markdown 渲染器（零依赖，够用就好）
   支持：标题 / 段落 / 引用 / 列表 / 分割线 / 代码块 / 行内代码 / 粗体 / 斜体 / 链接 / 图片 */
(function (global) {
  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function inline(s) {
    s = esc(s);
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g,
      '<img src="$2" alt="$1" loading="lazy">');
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>');
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    return s;
  }

  function render(src) {
    var lines = src.replace(/\r\n?/g, '\n').split('\n');
    var out = [], i = 0, buf = [];

    function flush() {
      if (!buf.length) return;
      out.push('<p>' + inline(buf.join('\n')).replace(/\n/g, '<br>') + '</p>');
      buf = [];
    }

    while (i < lines.length) {
      var ln = lines[i];

      // 代码块
      if (/^```/.test(ln)) {
        flush();
        var lang = ln.slice(3).trim(), code = [];
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) { code.push(lines[i]); i++; }
        i++;
        out.push('<pre><code' + (lang ? ' class="lang-' + esc(lang) + '"' : '') + '>' +
          esc(code.join('\n')) + '</code></pre>');
        continue;
      }

      // 空行
      if (!ln.trim()) { flush(); i++; continue; }

      // 标题
      var h = /^(#{1,6})\s+(.*)$/.exec(ln);
      if (h) {
        flush();
        var lv = Math.min(h[1].length + 1, 6);
        out.push('<h' + lv + '>' + inline(h[2]) + '</h' + lv + '>');
        i++; continue;
      }

      // 分割线
      if (/^\s*([-*_])\s*\1\s*\1[\s\-*_]*$/.test(ln)) { flush(); out.push('<hr>'); i++; continue; }

      // 引用
      if (/^>\s?/.test(ln)) {
        flush();
        var q = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) { q.push(lines[i].replace(/^>\s?/, '')); i++; }
        out.push('<blockquote>' + inline(q.join('\n')).replace(/\n/g, '<br>') + '</blockquote>');
        continue;
      }

      // 列表
      if (/^\s*(?:[-*+]|\d+\.)\s+/.test(ln)) {
        flush();
        var ordered = /^\s*\d+\./.test(ln);
        var items = [];
        while (i < lines.length && /^\s*(?:[-*+]|\d+\.)\s+/.test(lines[i])) {
          items.push(lines[i].replace(/^\s*(?:[-*+]|\d+\.)\s+/, ''));
          i++;
        }
        var tag = ordered ? 'ol' : 'ul';
        out.push('<' + tag + '>' + items.map(function (t) { return '<li>' + inline(t) + '</li>'; }).join('') + '</' + tag + '>');
        continue;
      }

      buf.push(ln);
      i++;
    }
    flush();
    return out.join('\n');
  }

  global.md = { render: render };
})(window);
