(function () {
  'use strict';

  var currentPage = 0;
  var totalPages = 6;
  var isTransitioning = false;
  var currentLang = 'zh';
  var pinnedTabs = {};
  var tabOrder = [0, 1, 2, 3, 4, 5];

  var tabData = [
    { id: 0, title: { zh: '首页', en: 'Home' }, url: 'drift://home', color: '#4FC3F7' },
    { id: 1, title: { zh: '特性', en: 'Features' }, url: 'drift://features', color: '#4FC3F7' },
    { id: 2, title: { zh: 'AI', en: 'AI' }, url: 'drift://ai', color: '#4FC3F7' },
    { id: 3, title: { zh: '插件', en: 'Plugins' }, url: 'drift://plugins', color: '#FF6D00' },
    { id: 4, title: { zh: '下载', en: 'Download' }, url: 'drift://download', color: '#FF6D00' },
    { id: 5, title: { zh: '更新', en: 'Changelog' }, url: 'drift://changelog', color: '#4FC3F7' }
  ];

  var i18n = {
    zh: {
      'lang.toggle': 'EN',
      'hero.badge': 'v2.33 · Windows',
      'hero.subtitle': 'AI 驱动的新一代桌面浏览器',
      'hero.download': '下载 Drift',
      'hero.github': 'GitHub',
      'features.title': '核心特性',
      'features.desc': '为现代浏览而生的全能工具',
      'features.hint': '拖拽旋转球体 · 点击图标查看详情',
      'ai.title': 'AI 驱动',
      'ai.desc': '不只是浏览器，更是你的智能助手',
      'ai.chatTitle': 'AI Chat',
      'ai.userMsg': '帮我总结这个页面的要点',
      'ai.aiMsg': '这个页面主要讨论了三个核心主题：1. 现代浏览器架构演进 2. AI 与浏览器的融合趋势 3. 用户隐私保护的新方案',
      'ai.inputPlaceholder': '输入消息...',
      'ai.chat.title': 'AI Chat',
      'ai.chat.desc': '与网页内容对话，智能总结、翻译、分析',
      'ai.agent.title': 'AI Agent',
      'ai.agent.desc': '自动化浏览器操作，执行复杂任务流程',
      'ai.models.title': '多模型支持',
      'ai.models.desc': 'OpenAI · Claude · Gemini · 本地模型，自由切换',
      'plugins.title': '插件生态',
      'plugins.desc': '无限扩展，打造你的专属浏览器',
      'plugins.i18n.title': 'English i18n',
      'plugins.i18n.desc': '一键切换浏览器界面为英文，完整的语言包覆盖',
      'plugins.github.title': 'GitHub 中文翻译',
      'plugins.github.desc': '自动翻译 GitHub 页面 UI 文本和状态标签',
      'plugins.custom.title': '个性化定制',
      'plugins.custom.desc': '自定义背景、颜色、布局、CSS，5 个预设主题',
      'plugins.tag.i18n': 'i18n',
      'plugins.tag.github': 'ui',
      'plugins.tag.custom': 'ui',
      'plugins.sdk.label': 'DriftPluginSDK',
      'plugins.back': '返回',
      'download.title': '获取 Drift',
      'download.desc': '免费 · 开源 · 为 Windows 而生',
      'download.btn': '下载 Drift',
      'download.installer.title': '安装版',
      'download.installer.tag': '推荐大多数用户',
      'download.portable.title': '便携版',
      'download.portable.tag': '免安装，直接运行',
      'download.version': '版本',
      'download.platform': '平台',
      'download.license': '协议',
      'download.engine': '内核',
      'changelog.title': '更新日志',
      'changelog.desc': '持续进化，越来越好',
      'changelog.v233.1': '云盘系统全面重构，支持文件预览和全局搜索',
      'changelog.v233.2': 'AI Agent 浏览器自动化操作',
      'changelog.v233.3': '插件系统 SDK 增强',
      'changelog.v233.4': '性能调节器优化，内存占用降低 30%',
      'changelog.v230.1': '内置云盘功能上线',
      'changelog.v230.2': 'DocForge 文档编辑器',
      'changelog.v230.3': '深色/浅色主题切换优化',
      'changelog.v225.1': 'AI Chat 多模型支持',
      'changelog.v225.2': 'Chrome 扩展加载支持',
      'changelog.v225.3': '标签分组和分屏视图',
      'changelog.v220.1': '侧载插件系统上线',
      'changelog.v220.2': '广告拦截内置',
      'changelog.v220.3': '自动更新功能',
      'footer.copy': '© 2025 Drift Browser Team',
      'ctx.refresh': '刷新',
      'ctx.pin': '固定标签',
      'ctx.close': '关闭标签',
      'ctx.newtab': '新标签打开',
      'fd.ai.title': 'AI 集成',
      'fd.ai.desc': '内置 AI Chat 与 AI Agent，支持多模型配置。与网页内容智能对话，自动总结、翻译、分析，还能自动化执行复杂浏览器操作流程。',
      'fd.plugin.title': '插件系统',
      'fd.plugin.desc': '侧载插件架构，无需重新打包即可扩展浏览器功能。丰富的 SDK API 覆盖 i18n、tabs、storage、messaging 等核心能力。',
      'fd.cloud.title': '云盘',
      'fd.cloud.desc': '内置云存储，文件上传下载、在线预览（图片/文本/音视频/Markdown）、全局搜索，数据随身携带。',
      'fd.perf.title': '性能优化',
      'fd.perf.desc': '自适应性能调节器，智能冻结后台标签页，内存占用降低 30%，响应速度显著提升。',
      'fd.tabs.title': '标签管理',
      'fd.tabs.desc': '标签分组、垂直标签栏、分屏视图，多标签井然有序，高效管理浏览会话。',
      'fd.adblock.title': '广告拦截',
      'fd.adblock.desc': '内置广告和追踪器过滤，清爽浏览体验，隐私保护，无需安装第三方扩展。'
    },
    en: {
      'lang.toggle': '中文',
      'hero.badge': 'v2.33 · Windows',
      'hero.subtitle': 'AI-Powered Next-Gen Desktop Browser',
      'hero.download': 'Download Drift',
      'hero.github': 'GitHub',
      'features.title': 'Core Features',
      'features.desc': 'The all-in-one tool for modern browsing',
      'features.hint': 'Drag to rotate sphere · Click icon for details',
      'ai.title': 'AI Powered',
      'ai.desc': 'Not just a browser, your intelligent assistant',
      'ai.chatTitle': 'AI Chat',
      'ai.userMsg': 'Summarize the key points of this page',
      'ai.aiMsg': 'This page covers three core topics: 1. Evolution of modern browser architecture 2. Trends in AI-browser integration 3. New approaches to user privacy protection',
      'ai.inputPlaceholder': 'Type a message...',
      'ai.chat.title': 'AI Chat',
      'ai.chat.desc': 'Converse with web content, smart summarize, translate, analyze',
      'ai.agent.title': 'AI Agent',
      'ai.agent.desc': 'Automate browser operations, execute complex task workflows',
      'ai.models.title': 'Multi-Model',
      'ai.models.desc': 'OpenAI · Claude · Gemini · Local models, switch freely',
      'plugins.title': 'Plugin Ecosystem',
      'plugins.desc': 'Infinite extensibility, build your own browser',
      'plugins.i18n.title': 'English i18n',
      'plugins.i18n.desc': 'Switch browser interface to English with full language pack coverage',
      'plugins.github.title': 'GitHub Translation',
      'plugins.github.desc': 'Auto-translate GitHub page UI text and status labels to Chinese',
      'plugins.custom.title': 'Customization',
      'plugins.custom.desc': 'Custom backgrounds, colors, layouts, CSS, 5 preset themes',
      'plugins.tag.i18n': 'i18n',
      'plugins.tag.github': 'ui',
      'plugins.tag.custom': 'ui',
      'plugins.sdk.label': 'DriftPluginSDK',
      'plugins.back': 'Back',
      'download.title': 'Get Drift',
      'download.desc': 'Free · Open Source · Built for Windows',
      'download.btn': 'Download Drift',
      'download.installer.title': 'Installer',
      'download.installer.tag': 'Recommended for most users',
      'download.portable.title': 'Portable',
      'download.portable.tag': 'No installation required',
      'download.version': 'Version',
      'download.platform': 'Platform',
      'download.license': 'License',
      'download.engine': 'Engine',
      'changelog.title': 'Changelog',
      'changelog.desc': 'Continuously evolving, getting better',
      'changelog.v233.1': 'Cloud drive system rebuilt, file preview and global search',
      'changelog.v233.2': 'AI Agent browser automation',
      'changelog.v233.3': 'Plugin SDK enhancements',
      'changelog.v233.4': 'Performance governor optimized, 30% less memory usage',
      'changelog.v230.1': 'Built-in cloud drive launched',
      'changelog.v230.2': 'DocForge document editor',
      'changelog.v230.3': 'Dark/light theme switching improved',
      'changelog.v225.1': 'AI Chat multi-model support',
      'changelog.v225.2': 'Chrome extension loading support',
      'changelog.v225.3': 'Tab groups and split view',
      'changelog.v220.1': 'Sideloading plugin system launched',
      'changelog.v220.2': 'Built-in ad blocker',
      'changelog.v220.3': 'Auto-update feature',
      'footer.copy': '© 2025 Drift Browser Team',
      'ctx.refresh': 'Refresh',
      'ctx.pin': 'Pin Tab',
      'ctx.close': 'Close Tab',
      'ctx.newtab': 'Open in New Tab',
      'fd.ai.title': 'AI Integration',
      'fd.ai.desc': 'Built-in AI Chat & Agent with multi-model support. Smart conversations with web content, auto-summarize, translate, analyze, and automate complex browser workflows.',
      'fd.plugin.title': 'Plugin System',
      'fd.plugin.desc': 'Sideloading architecture, extend browser without repackaging. Rich SDK API covering i18n, tabs, storage, messaging and more.',
      'fd.cloud.title': 'Cloud Drive',
      'fd.cloud.desc': 'Built-in cloud storage, upload/download, online preview (image/text/audio/video/Markdown), global search, data on the go.',
      'fd.perf.title': 'Performance',
      'fd.perf.desc': 'Adaptive performance governor, smart tab freezing, 30% less memory usage, significantly faster response.',
      'fd.tabs.title': 'Tab Management',
      'fd.tabs.desc': 'Tab groups, vertical tab bar, split view, organized multitasking for efficient browsing sessions.',
      'fd.adblock.title': 'Ad Blocker',
      'fd.adblock.desc': 'Built-in ad & tracker filtering, clean browsing, privacy protection, no third-party extension needed.'
    }
  };

  function t(key) {
    return (i18n[currentLang] && i18n[currentLang][key]) || key;
  }

  function applyLang() {
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n');
      els[i].textContent = t(key);
    }
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
    renderTabs();
    updateAddrUrl();
  }

  var langBtn = document.getElementById('langToggle');
  langBtn.addEventListener('click', function () {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    applyLang();
  });

  var pages = document.querySelectorAll('.page');
  var tabStrip = document.getElementById('tabStrip');
  var addrUrl = document.getElementById('addrUrl');
  var ctxMenu = document.getElementById('contextMenu');
  var transLayer = document.getElementById('transitionLayer');

  function renderTabs() {
    tabStrip.innerHTML = '';
    for (var i = 0; i < tabOrder.length; i++) {
      var id = tabOrder[i];
      var data = tabData[id];
      var tab = document.createElement('div');
      tab.className = 'tab' + (id === currentPage ? ' active' : '') + (pinnedTabs[id] ? ' pinned' : '');
      tab.setAttribute('data-id', id);
      tab.setAttribute('draggable', 'true');
      tab.innerHTML =
        '<img class="tab-favicon" src="data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\'><rect rx=\'3\' width=\'16\' height=\'16\' fill=\'' + encodeURIComponent(data.color) + '\'/><text x=\'3\' y=\'12\' font-size=\'10\' font-weight=\'800\' fill=\'%23060810\'>D</text></svg>">' +
        '<span class="tab-title">' + data.title[currentLang] + '</span>' +
        '<svg class="tab-pin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v8l4 4H8l4-4V2"/><circle cx="12" cy="18" r="3"/></svg>' +
        '<button class="tab-close"><svg width="10" height="10" viewBox="0 0 10 10"><line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" stroke-width="1.2"/><line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" stroke-width="1.2"/></svg></button>';
      tabStrip.appendChild(tab);
    }
    bindTabEvents();
  }

  function bindTabEvents() {
    var tabs = tabStrip.querySelectorAll('.tab');
    for (var i = 0; i < tabs.length; i++) {
      (function (tabEl) {
        var id = parseInt(tabEl.getAttribute('data-id'));
        tabEl.addEventListener('click', function (e) {
          if (e.target.closest('.tab-close')) return;
          goToPage(id);
        });
        tabEl.querySelector('.tab-close').addEventListener('click', function (e) {
          e.stopPropagation();
          closeTab(id);
        });
        tabEl.addEventListener('contextmenu', function (e) {
          e.preventDefault();
          showCtxMenu(e.clientX, e.clientY, id);
        });
        tabEl.addEventListener('dragstart', function (e) {
          e.dataTransfer.setData('text/plain', id);
          tabEl.classList.add('dragging');
        });
        tabEl.addEventListener('dragend', function () {
          tabEl.classList.remove('dragging');
        });
        tabEl.addEventListener('dragover', function (e) {
          e.preventDefault();
        });
        tabEl.addEventListener('drop', function (e) {
          e.preventDefault();
          var fromId = parseInt(e.dataTransfer.getData('text/plain'));
          var toId = parseInt(tabEl.getAttribute('data-id'));
          if (fromId !== toId) {
            var fromIdx = tabOrder.indexOf(fromId);
            var toIdx = tabOrder.indexOf(toId);
            tabOrder.splice(fromIdx, 1);
            tabOrder.splice(toIdx, 0, fromId);
            renderTabs();
            DriftAudio.play('tabSwitch');
          }
        });
      })(tabs[i]);
    }
  }

  function updateAddrUrl() {
    addrUrl.textContent = tabData[currentPage].url;
  }

  function closeTab(id) {
    if (pinnedTabs[id]) return;
    if (Object.keys(pinnedTabs).length === 0 && tabOrder.length <= 1) return;
    DriftAudio.play('tabClose');
    var idx = tabOrder.indexOf(id);
    tabOrder.splice(idx, 1);
    if (id === currentPage) {
      var nextId = tabOrder[Math.min(idx, tabOrder.length - 1)];
      goToPage(nextId);
    }
    renderTabs();
  }

  function showCtxMenu(x, y, tabId) {
    DriftAudio.play('contextMenu');
    ctxMenu.classList.remove('hidden');
    ctxMenu.style.left = x + 'px';
    ctxMenu.style.top = y + 'px';
    ctxMenu.setAttribute('data-tab', tabId);
    if (pinnedTabs[tabId]) {
      ctxMenu.querySelector('[data-action="pin"] span').textContent = t('ctx.pin').replace('固定', '取消固定').replace('Pin', 'Unpin');
    } else {
      ctxMenu.querySelector('[data-action="pin"] span').textContent = t('ctx.pin');
    }
  }

  document.addEventListener('click', function () {
    ctxMenu.classList.add('hidden');
  });

  var ctxItems = ctxMenu.querySelectorAll('.ctx-item');
  for (var ci = 0; ci < ctxItems.length; ci++) {
    ctxItems[ci].addEventListener('click', function () {
      var action = this.getAttribute('data-action');
      var tabId = parseInt(ctxMenu.getAttribute('data-tab'));
      ctxMenu.classList.add('hidden');
      if (action === 'refresh') {
        triggerPageAnimations(tabId);
        DriftAudio.play('btnClick');
      } else if (action === 'pin') {
        pinnedTabs[tabId] = !pinnedTabs[tabId];
        renderTabs();
        DriftAudio.play('btnClick');
      } else if (action === 'close') {
        closeTab(tabId);
      } else if (action === 'newtab') {
        DriftAudio.play('btnClick');
      }
    });
  }

  document.getElementById('btnMin').addEventListener('click', function () { DriftAudio.play('btnClick'); });
  document.getElementById('btnMax').addEventListener('click', function () { DriftAudio.play('btnClick'); });
  document.getElementById('btnClose').addEventListener('click', function () {
    DriftAudio.play('tabClose');
    if (confirm(currentLang === 'zh' ? '确定要离开吗？' : 'Are you sure you want to leave?')) {
      window.close();
    }
  });

  function goToPage(index) {
    if (isTransitioning || index === currentPage) return;
    if (tabOrder.indexOf(index) === -1) return;
    isTransitioning = true;
    DriftAudio.play('transitionStart');

    var oldPage = currentPage;
    var newPage = index;
    var transitionType = getTransitionType(oldPage, newPage);

    runTransition(transitionType, oldPage, newPage, function () {
      pages[oldPage].classList.remove('active');
      pages[newPage].classList.add('active');
      currentPage = newPage;
      updateAddrUrl();
      renderTabs();
      triggerPageAnimations(newPage);
      DriftAudio.play('transitionEnd');
      setTimeout(function () { isTransitioning = false; }, 300);
    });
  }

  function getTransitionType(from, to) {
    if (from === 0 && to === 1) return 'minimize';
    if (from === 1 && to === 2) return 'aiGenerate';
    if (from === 2 && to === 3) return 'puzzle';
    if (from === 3 && to === 4) return 'dataFlow';
    if (from === 4 && to === 5) return 'codeScroll';
    if (from === 5 && to === 0) return 'timeReverse';
    if (to < from) {
      if (to === 0) return 'timeReverse';
      return 'minimize';
    }
    return 'minimize';
  }

  function runTransition(type, from, to, callback) {
    var duration = 1600;
    switch (type) {
      case 'minimize':
        transMinimize(from, to, duration, callback);
        break;
      case 'aiGenerate':
        transAiGenerate(from, to, duration, callback);
        break;
      case 'puzzle':
        transPuzzle(from, to, duration, callback);
        break;
      case 'dataFlow':
        transDataFlow(from, to, duration, callback);
        break;
      case 'codeScroll':
        transCodeScroll(from, to, duration, callback);
        break;
      case 'timeReverse':
        transTimeReverse(from, to, duration, callback);
        break;
      default:
        callback();
    }
  }

  function transMinimize(from, to, dur, cb) {
    var fromEl = pages[from];
    fromEl.style.transition = 'transform ' + (dur * 0.5) + 'ms cubic-bezier(0.4,0,0.2,1), opacity ' + (dur * 0.3) + 'ms';
    fromEl.style.transform = 'scale(0.1) translateY(-200%)';
    fromEl.style.opacity = '0';
    setTimeout(function () {
      fromEl.style.transition = '';
      fromEl.style.transform = '';
      fromEl.style.opacity = '';
      cb();
    }, dur * 0.55);
  }

  function transAiGenerate(from, to, dur, cb) {
    var pixels = [];
    var cols = 20;
    var rows = 12;
    var pw = window.innerWidth / cols;
    var ph = window.innerHeight / rows;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var px = document.createElement('div');
        px.className = 'trans-pixel';
        px.style.left = (c * pw) + 'px';
        px.style.top = (r * ph) + 'px';
        px.style.width = pw + 'px';
        px.style.height = ph + 'px';
        var cx = window.innerWidth / 2;
        var cy = window.innerHeight / 2;
        var dx = c * pw + pw / 2 - cx;
        var dy = r * ph + ph / 2 - cy;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var maxDist = Math.sqrt(cx * cx + cy * cy);
        var delay = (dist / maxDist) * 600;
        px.style.transition = 'opacity 0.4s ' + delay + 'ms, background 0.4s ' + delay + 'ms';
        transLayer.appendChild(px);
        pixels.push(px);
      }
    }
    requestAnimationFrame(function () {
      for (var i = 0; i < pixels.length; i++) {
        pixels[i].style.opacity = '1';
        pixels[i].style.background = '#4FC3F7';
      }
    });
    setTimeout(function () {
      for (var i = 0; i < pixels.length; i++) {
        pixels[i].style.opacity = '0';
      }
      cb();
    }, dur * 0.5);
    setTimeout(function () {
      for (var i = 0; i < pixels.length; i++) {
        if (pixels[i].parentNode) pixels[i].parentNode.removeChild(pixels[i]);
      }
    }, dur);
  }

  function transPuzzle(from, to, dur, cb) {
    var shards = [];
    var count = 12;
    for (var i = 0; i < count; i++) {
      var s = document.createElement('div');
      s.className = 'trans-shard';
      var w = window.innerWidth / 4 + Math.random() * 100;
      var h = 40 + Math.random() * 80;
      s.style.width = w + 'px';
      s.style.height = h + 'px';
      s.style.left = (Math.random() * window.innerWidth) + 'px';
      s.style.top = (Math.random() * window.innerHeight) + 'px';
      s.style.borderRadius = '4px';
      s.style.transition = 'all 0.8s cubic-bezier(0.16,1,0.3,1)';
      s.style.background = i % 2 === 0 ? '#4FC3F7' : '#FF6D00';
      transLayer.appendChild(s);
      shards.push(s);
    }
    requestAnimationFrame(function () {
      for (var i = 0; i < shards.length; i++) {
        shards[i].style.opacity = '0.6';
      }
    });
    setTimeout(function () {
      for (var i = 0; i < shards.length; i++) {
        var angle = Math.random() * 360;
        var dist = 200 + Math.random() * 400;
        shards[i].style.transform = 'translate(' + (Math.cos(angle) * dist) + 'px,' + (Math.sin(angle) * dist) + 'px) rotate(' + (Math.random() * 360) + 'deg)';
        shards[i].style.opacity = '0';
      }
    }, 50);
    setTimeout(function () {
      cb();
    }, dur * 0.5);
    setTimeout(function () {
      for (var i = 0; i < shards.length; i++) {
        if (shards[i].parentNode) shards[i].parentNode.removeChild(shards[i]);
      }
    }, dur);
  }

  function transDataFlow(from, to, dur, cb) {
    var lines = [];
    var count = 15;
    for (var i = 0; i < count; i++) {
      var l = document.createElement('div');
      l.className = 'trans-code-line';
      l.style.top = (i * (window.innerHeight / count)) + 'px';
      l.style.transition = 'opacity 0.3s ' + (i * 40) + 'ms, transform 0.6s ' + (i * 40) + 'ms';
      transLayer.appendChild(l);
      lines.push(l);
    }
    requestAnimationFrame(function () {
      for (var i = 0; i < lines.length; i++) {
        lines[i].style.opacity = '0.8';
      }
    });
    setTimeout(function () {
      for (var i = 0; i < lines.length; i++) {
        lines[i].style.transform = 'translateY(' + window.innerHeight + 'px)';
        lines[i].style.opacity = '0';
      }
    }, 100);
    setTimeout(function () {
      cb();
    }, dur * 0.5);
    setTimeout(function () {
      for (var i = 0; i < lines.length; i++) {
        if (lines[i].parentNode) lines[i].parentNode.removeChild(lines[i]);
      }
    }, dur);
  }

  function transCodeScroll(from, to, dur, cb) {
    var codeLines = [];
    var count = 20;
    for (var i = 0; i < count; i++) {
      var l = document.createElement('div');
      l.style.position = 'absolute';
      l.style.left = '10%';
      l.style.right = '10%';
      l.style.height = '1px';
      l.style.background = 'rgba(79,195,247,0.3)';
      l.style.top = (i * 30) + 'px';
      l.style.transition = 'transform 0.8s cubic-bezier(0.4,0,0.2,1), opacity 0.4s';
      transLayer.appendChild(l);
      codeLines.push(l);
    }
    requestAnimationFrame(function () {
      for (var i = 0; i < codeLines.length; i++) {
        codeLines[i].style.transform = 'translateY(' + window.innerHeight + 'px)';
      }
    });
    setTimeout(function () {
      cb();
    }, dur * 0.5);
    setTimeout(function () {
      for (var i = 0; i < codeLines.length; i++) {
        if (codeLines[i].parentNode) codeLines[i].parentNode.removeChild(codeLines[i]);
      }
    }, dur);
  }

  function transTimeReverse(from, to, dur, cb) {
    var fromEl = pages[from];
    fromEl.style.transition = 'transform ' + (dur * 0.6) + 'ms cubic-bezier(0.4,0,0.2,1), opacity ' + (dur * 0.4) + 'ms';
    fromEl.style.transform = 'scale(1.1)';
    fromEl.style.opacity = '0';
    fromEl.style.filter = 'blur(10px)';
    setTimeout(function () {
      fromEl.style.transition = '';
      fromEl.style.transform = '';
      fromEl.style.opacity = '';
      fromEl.style.filter = '';
      cb();
    }, dur * 0.55);
  }

  function triggerPageAnimations(pageIndex) {
    var page = pages[pageIndex];
    if (!page) return;

    if (pageIndex === 2) startTypewriter();
    if (pageIndex === 1) initSphere();

    var aiItems = page.querySelectorAll('.ai-feature-item');
    for (var j = 0; j < aiItems.length; j++) {
      (function (item, delay) {
        setTimeout(function () { item.classList.add('visible'); }, delay * 150 + 300);
      })(aiItems[j], j);
    }

    var tlItems = page.querySelectorAll('.tl-item');
    for (var k = 0; k < tlItems.length; k++) {
      (function (item, delay) {
        setTimeout(function () { item.classList.add('visible'); }, delay * 200 + 200);
      })(tlItems[k], k);
    }
  }

  var typewriterRunning = false;
  function startTypewriter() {
    if (typewriterRunning) return;
    typewriterRunning = true;
    var aiMsg = document.getElementById('chatAiMsg');
    if (!aiMsg) { typewriterRunning = false; return; }
    var text = t('ai.aiMsg');
    aiMsg.textContent = '';
    var cursor = document.getElementById('chatCursor');
    var i = 0;
    function type() {
      if (i < text.length) {
        aiMsg.textContent += text[i];
        i++;
        setTimeout(type, 30 + Math.random() * 40);
      } else {
        typewriterRunning = false;
      }
    }
    setTimeout(type, 800);
  }

  var sphereInited = false;
  var sphereAngle = 0;
  var sphereDragging = false;
  var sphereLastX = 0;
  var sphereLastY = 0;
  var sphereRotX = 0;
  var sphereRotY = 0;

  function initSphere() {
    if (sphereInited) return;
    sphereInited = true;
    var canvas = document.getElementById('sphereCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    var features = [
      { key: 'ai', angle: 0, icon: '🤖' },
      { key: 'plugin', angle: 60, icon: '🧩' },
      { key: 'cloud', angle: 120, icon: '☁️' },
      { key: 'perf', angle: 180, icon: '⚡' },
      { key: 'tabs', angle: 240, icon: '📑' },
      { key: 'adblock', angle: 300, icon: '🛡️' }
    ];

    canvas.addEventListener('mousedown', function (e) {
      sphereDragging = true;
      sphereLastX = e.clientX;
      sphereLastY = e.clientY;
      DriftAudio.play('sphereRotate');
    });

    canvas.addEventListener('mousemove', function (e) {
      if (!sphereDragging) return;
      var dx = e.clientX - sphereLastX;
      var dy = e.clientY - sphereLastY;
      sphereRotY += dx * 0.01;
      sphereRotX += dy * 0.01;
      sphereLastX = e.clientX;
      sphereLastY = e.clientY;
    });

    canvas.addEventListener('mouseup', function () { sphereDragging = false; });
    canvas.addEventListener('mouseleave', function () { sphereDragging = false; });

    canvas.addEventListener('click', function (e) {
      var rect = canvas.getBoundingClientRect();
      var cx = canvas.width / 2;
      var cy = canvas.height / 2;
      var mx = e.clientX - rect.left;
      var my = e.clientY - rect.top;
      var radius = Math.min(canvas.width, canvas.height) * 0.25;

      for (var i = 0; i < features.length; i++) {
        var a = (features[i].angle + sphereRotY * 57.3) * Math.PI / 180;
        var x = cx + Math.cos(a) * radius;
        var y = cy + Math.sin(a) * radius * 0.5 + Math.sin(sphereRotX + i) * 20;
        var dx = mx - x;
        var dy = my - y;
        if (Math.sqrt(dx * dx + dy * dy) < 30) {
          showFeatureDetail(features[i].key);
          return;
        }
      }
    });

    function draw() {
      if (currentPage !== 1) { requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var cx = canvas.width / 2;
      var cy = canvas.height / 2;
      var radius = Math.min(canvas.width, canvas.height) * 0.25;

      if (!sphereDragging) {
        sphereRotY += 0.003;
      }

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(79,195,247,0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(cx, cy, radius, radius * 0.3, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(79,195,247,0.05)';
      ctx.stroke();

      var sorted = [];
      for (var i = 0; i < features.length; i++) {
        var a = (features[i].angle + sphereRotY * 57.3) * Math.PI / 180;
        var x = cx + Math.cos(a) * radius;
        var yBase = cy + Math.sin(a) * radius * 0.5;
        var z = Math.sin(a);
        sorted.push({ feature: features[i], x: x, y: yBase + Math.sin(sphereRotX + i * 0.5) * 15, z: z, a: a });
      }
      sorted.sort(function (a, b) { return a.z - b.z; });

      for (var j = 0; j < sorted.length; j++) {
        var item = sorted[j];
        var scale = 0.6 + (item.z + 1) * 0.3;
        var alpha = 0.3 + (item.z + 1) * 0.35;
        ctx.beginPath();
        ctx.arc(item.x, item.y, 22 * scale, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(79,195,247,' + (alpha * 0.15) + ')';
        ctx.fill();
        ctx.strokeStyle = 'rgba(79,195,247,' + alpha + ')';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.font = (18 * scale) + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = alpha;
        ctx.fillText(item.feature.icon, item.x, item.y);
        ctx.globalAlpha = 1;
      }

      requestAnimationFrame(draw);
    }
    draw();
  }

  function showFeatureDetail(key) {
    DriftAudio.play('btnClick');
    var detail = document.getElementById('featureDetail');
    var fdIcon = document.getElementById('fdIcon');
    var fdTitle = document.getElementById('fdTitle');
    var fdDesc = document.getElementById('fdDesc');
    var icons = { ai: '🤖', plugin: '🧩', cloud: '☁️', perf: '⚡', tabs: '📑', adblock: '🛡️' };
    fdIcon.textContent = icons[key] || '';
    fdTitle.textContent = t('fd.' + key + '.title');
    fdDesc.textContent = t('fd.' + key + '.desc');
    detail.classList.remove('hidden');
    setTimeout(function () { detail.classList.add('show'); }, 10);
  }

  document.getElementById('fdClose').addEventListener('click', function () {
    var detail = document.getElementById('featureDetail');
    detail.classList.remove('show');
    setTimeout(function () { detail.classList.add('hidden'); }, 400);
  });

  var pluginCards = document.querySelectorAll('.plugin-card');
  for (var pc = 0; pc < pluginCards.length; pc++) {
    pluginCards[pc].addEventListener('click', function () {
      DriftAudio.play('btnClick');
      var name = this.getAttribute('data-plugin');
      var overlay = document.getElementById('pluginOverlay');
      var content = document.getElementById('poContent');
      var titles = { i18n: t('plugins.i18n.title'), github: t('plugins.github.title'), custom: t('plugins.custom.title') };
      var descs = { i18n: t('plugins.i18n.desc'), github: t('plugins.github.desc'), custom: t('plugins.custom.desc') };
      content.innerHTML = '<h2 style="font-size:28px;font-weight:800;margin-bottom:12px">' + titles[name] + '</h2>' +
        '<p style="color:var(--fg-1);line-height:1.8;max-width:400px;margin:0 auto">' + descs[name] + '</p>';
      overlay.classList.remove('hidden');
    });

    pluginCards[pc].addEventListener('dragstart', function (e) {
      e.dataTransfer.setData('text/plain', this.getAttribute('data-plugin'));
      this.classList.add('dragging');
    });
    pluginCards[pc].addEventListener('dragend', function () {
      this.classList.remove('dragging');
    });
  }

  var pluginsGrid = document.getElementById('pluginsGrid');
  pluginsGrid.addEventListener('dragover', function (e) { e.preventDefault(); });
  pluginsGrid.addEventListener('drop', function (e) {
    e.preventDefault();
    var fromPlugin = e.dataTransfer.getData('text/plain');
    var toEl = e.target.closest('.plugin-card');
    if (toEl) {
      var toPlugin = toEl.getAttribute('data-plugin');
      if (fromPlugin !== toPlugin) {
        var cards = Array.from(pluginsGrid.querySelectorAll('.plugin-card'));
        var fromIdx = cards.findIndex(function (c) { return c.getAttribute('data-plugin') === fromPlugin; });
        var toIdx = cards.findIndex(function (c) { return c.getAttribute('data-plugin') === toPlugin; });
        if (fromIdx < toIdx) {
          pluginsGrid.insertBefore(cards[fromIdx], cards[toIdx].nextSibling);
        } else {
          pluginsGrid.insertBefore(cards[fromIdx], cards[toIdx]);
        }
        DriftAudio.play('btnClick');
      }
    }
  });

  document.getElementById('poBack').addEventListener('click', function () {
    document.getElementById('pluginOverlay').classList.add('hidden');
  });

  var engineStarted = false;
  document.getElementById('engineBtn').addEventListener('click', function () {
    if (engineStarted) return;
    engineStarted = true;
    DriftAudio.play('engineStart');
    this.classList.add('started');
    setTimeout(function () {
      window.open('https://github.com/151shi23/drift-browser/releases', '_blank');
    }, 2000);
    setTimeout(function () {
      engineStarted = false;
      document.getElementById('engineBtn').classList.remove('started');
    }, 4000);
  });

  function initHeroCanvas() {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var mouseX = 0;
    var mouseY = 0;

    function resize() {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 0.5,
        o: Math.random() * 0.5 + 0.1,
        targetX: null,
        targetY: null
      });
    }

    canvas.parentElement.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    var assembling = false;
    var assembleStart = 0;

    setTimeout(function () {
      assembling = true;
      assembleStart = Date.now();
    }, 500);

    function draw() {
      if (currentPage !== 0) { requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      var cx = canvas.width / 2;
      var cy = canvas.height / 2;
      var winW = 280;
      var winH = 180;
      var winX = cx - winW / 2;
      var winY = cy - winH / 2 - 20;

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        if (assembling) {
          var progress = Math.min(1, (Date.now() - assembleStart) / 3000);
          var eased = 1 - Math.pow(1 - progress, 3);

          var col = i % 28;
          var row = Math.floor(i / 28) % 14;
          var tx, ty;

          if (row === 0) {
            tx = winX + (col / 28) * winW;
            ty = winY;
          } else if (row === 13) {
            tx = winX + (col / 28) * winW;
            ty = winY + winH;
          } else if (col === 0 || col === 27) {
            tx = winX + (col === 0 ? 0 : winW);
            ty = winY + (row / 14) * winH;
          } else {
            tx = winX + Math.random() * winW;
            ty = winY + Math.random() * winH;
          }

          p.x += (tx - p.x) * eased * 0.02;
          p.y += (ty - p.y) * eased * 0.02;
        }

        var dx = mouseX - p.x;
        var dy = mouseY - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.x -= dx * 0.01;
          p.y -= dy * 0.01;
        }

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(79,195,247,' + p.o + ')';
        ctx.fill();
      }

      for (var j = 0; j < particles.length; j++) {
        for (var k = j + 1; k < particles.length; k++) {
          var ddx = particles[j].x - particles[k].x;
          var ddy = particles[j].y - particles[k].y;
          var dd = ddx * ddx + ddy * ddy;
          if (dd < 6400) {
            ctx.beginPath();
            ctx.moveTo(particles[j].x, particles[j].y);
            ctx.lineTo(particles[k].x, particles[k].y);
            ctx.strokeStyle = 'rgba(79,195,247,' + (0.04 * (1 - dd / 6400)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(draw);
    }
    draw();
  }

  function initNeuralCanvas() {
    var canvas = document.getElementById('neuralCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var nodes = [];

    function resize() {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < 40; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 2 + Math.random() * 2
      });
    }

    function draw() {
      if (currentPage !== 2) { requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(79,195,247,0.15)';
        ctx.fill();

        for (var j = i + 1; j < nodes.length; j++) {
          var dx = n.x - nodes[j].x;
          var dy = n.y - nodes[j].y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = 'rgba(79,195,247,' + (0.06 * (1 - d / 150)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  function initEnergyCanvas() {
    var canvas = document.getElementById('energyCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];

    function resize() {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < 60; i++) {
      var angle = Math.random() * Math.PI * 2;
      var dist = 80 + Math.random() * 120;
      particles.push({
        angle: angle,
        dist: dist,
        speed: 0.005 + Math.random() * 0.01,
        r: 1 + Math.random() * 1.5,
        o: 0.1 + Math.random() * 0.3
      });
    }

    function draw() {
      if (currentPage !== 4) { requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var cx = canvas.width / 2;
      var cy = canvas.height / 2 - 40;

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.angle += p.speed;
        var x = cx + Math.cos(p.angle) * p.dist;
        var y = cy + Math.sin(p.angle) * p.dist * 0.6;

        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(79,195,247,' + p.o + ')';
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  function initTimelineCanvas() {
    var canvas = document.getElementById('timelineCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];

    function resize() {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < 30; i++) {
      particles.push({
        x: canvas.width * 0.15 + Math.random() * 4,
        y: Math.random() * canvas.height,
        vy: 0.2 + Math.random() * 0.5,
        r: 1 + Math.random() * 1.5,
        o: 0.1 + Math.random() * 0.2
      });
    }

    function draw() {
      if (currentPage !== 5) { requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.y += p.vy;
        if (p.y > canvas.height) {
          p.y = 0;
          p.x = canvas.width * 0.15 + Math.random() * 4;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(79,195,247,' + p.o + ')';
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  function runLoader() {
    var progress = document.getElementById('loadProgress');
    var loader = document.getElementById('loader');
    var val = 0;
    var interval = setInterval(function () {
      val += Math.random() * 15 + 5;
      if (val >= 100) {
        val = 100;
        clearInterval(interval);
        setTimeout(function () {
          loader.classList.add('done');
          setTimeout(function () {
            loader.style.display = 'none';
          }, 600);
        }, 200);
      }
      progress.style.width = val + '%';
    }, 120);
  }

  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      var idx = tabOrder.indexOf(currentPage);
      if (idx > 0) goToPage(tabOrder[idx - 1]);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      var idx2 = tabOrder.indexOf(currentPage);
      if (idx2 < tabOrder.length - 1) goToPage(tabOrder[idx2 + 1]);
    }
  });

  runLoader();
  renderTabs();
  updateAddrUrl();
  applyLang();

  setTimeout(function () {
    initHeroCanvas();
    initNeuralCanvas();
    initEnergyCanvas();
    initTimelineCanvas();
    triggerPageAnimations(0);
  }, 500);

})();
