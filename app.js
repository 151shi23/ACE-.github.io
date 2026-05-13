(function () {
  'use strict';

  var currentPage = 0;
  var isTransitioning = false;
  var currentLang = 'zh';
  var currentFeature = 0;
  var currentPlugin = 0;
  var currentAiScene = 'summarize';
  var aiSceneTimer = null;

  var pageList = [
    { id: 0, title: { zh: '首页', en: 'Home' }, url: 'drift://home' },
    { id: 1, title: { zh: '海报', en: 'Poster' }, url: 'drift://poster' },
    { id: 2, title: { zh: '特性', en: 'Features' }, url: 'drift://features' },
    { id: 3, title: { zh: 'AI', en: 'AI' }, url: 'drift://ai' },
    { id: 4, title: { zh: '插件', en: 'Plugins' }, url: 'drift://plugins' },
    { id: 5, title: { zh: '下载', en: 'Download' }, url: 'drift://download' },
    { id: 6, title: { zh: '更新', en: 'Changelog' }, url: 'drift://changelog' }
  ];

  var i18n = {
    zh: {
      'lang.toggle': 'EN',
      'hero.subtitle': 'AI 驱动的新一代桌面浏览器',
      'hero.download': '下载 Drift',
      'hero.github': 'GitHub',
      'poster.placeholder': '放置海报图片到 poster/ 目录',
      'poster.title': '重新定义浏览',
      'poster.desc': 'Drift 不仅仅是一个浏览器，它是你数字世界的智能伙伴。',
      'features.ai.title': 'AI 集成',
      'features.ai.desc': '内置 AI Chat 与 AI Agent，支持多模型配置，智能对话与自动化操作',
      'features.plugin.title': '插件系统',
      'features.plugin.desc': '侧载插件架构，无需重新打包即可扩展浏览器功能',
      'features.cloud.title': '云盘',
      'features.cloud.desc': '内置云存储，文件上传下载、在线预览、全局搜索',
      'features.perf.title': '性能优化',
      'features.perf.desc': '自适应性能调节器，智能冻结后台标签页，内存占用更少',
      'features.tabs.title': '标签管理',
      'features.tabs.desc': '标签分组、垂直标签栏、分屏视图，多标签井然有序',
      'features.adblock.title': '广告拦截',
      'features.adblock.desc': '内置广告和追踪器过滤，清爽浏览，隐私保护',
      'ai.title': 'AI 驱动',
      'ai.desc': '不只是浏览器，更是你的智能助手',
      'ai.summarize': '自动总结',
      'ai.fill': '自动填表',
      'ai.search': '自动搜索',
      'ai.translate': '自动翻译',
      'plugins.label.plugin': '插件',
      'plugins.i18n.title': 'English i18n',
      'plugins.i18n.desc': '一键切换浏览器界面为英文，完整的语言包覆盖',
      'plugins.github.title': 'GitHub 中文翻译',
      'plugins.github.desc': '自动翻译 GitHub 页面 UI 文本和状态标签',
      'plugins.custom.title': '个性化定制',
      'plugins.custom.desc': '自定义背景、颜色、布局、CSS，5 个预设主题',
      'download.title': '获取 Drift',
      'download.desc': '免费 · 开源 · 为 Windows 而生',
      'download.btn': '下载 Drift',
      'download.installer': '安装版',
      'download.portable': '便携版',
      'changelog.title': '更新日志',
      'changelog.v233.1': '云盘系统全面重构',
      'changelog.v233.2': 'AI Agent 浏览器自动化',
      'changelog.v233.3': '插件 SDK 增强',
      'changelog.v233.4': '性能优化，内存降低 30%',
      'changelog.v230.1': '内置云盘功能上线',
      'changelog.v230.2': 'DocForge 文档编辑器',
      'changelog.v230.3': '深色/浅色主题优化',
      'changelog.v225.1': 'AI Chat 多模型支持',
      'changelog.v225.2': 'Chrome 扩展加载',
      'changelog.v225.3': '标签分组和分屏视图',
      'changelog.v220.1': '侧载插件系统上线',
      'changelog.v220.2': '广告拦截内置',
      'changelog.v220.3': '自动更新功能',
      'ctx.refresh': '刷新',
      'ctx.pin': '固定标签',
      'ctx.close': '关闭标签',
      'ctx.newtab': '新标签打开',
      'demo.ai.q': '总结这个页面的要点',
      'demo.ai.input': '试试输入问题...',
      'demo.plugin.item': '🌐 English i18n',
      'demo.plugin.item2': '🎨 个性化定制',
      'demo.plugin.drop': '拖拽到此处安装'
    },
    en: {
      'lang.toggle': '中文',
      'hero.subtitle': 'AI-Powered Next-Gen Desktop Browser',
      'hero.download': 'Download Drift',
      'hero.github': 'GitHub',
      'poster.placeholder': 'Place poster image in poster/ directory',
      'poster.title': 'Redefine Browsing',
      'poster.desc': 'Drift is more than a browser — it\'s your intelligent companion in the digital world.',
      'features.ai.title': 'AI Integration',
      'features.ai.desc': 'Built-in AI Chat & Agent, multi-model support, smart conversations & automation',
      'features.plugin.title': 'Plugin System',
      'features.plugin.desc': 'Sideloading architecture, extend browser without repackaging',
      'features.cloud.title': 'Cloud Drive',
      'features.cloud.desc': 'Built-in cloud storage, upload/download, online preview, global search',
      'features.perf.title': 'Performance',
      'features.perf.desc': 'Adaptive governor, smart tab freezing, less memory usage',
      'features.tabs.title': 'Tab Management',
      'features.tabs.desc': 'Tab groups, vertical tab bar, split view, organized multitasking',
      'features.adblock.title': 'Ad Blocker',
      'features.adblock.desc': 'Built-in ad & tracker filtering, clean browsing, privacy protection',
      'ai.title': 'AI Powered',
      'ai.desc': 'Not just a browser, your intelligent assistant',
      'ai.summarize': 'Auto Summarize',
      'ai.fill': 'Auto Fill',
      'ai.search': 'Auto Search',
      'ai.translate': 'Auto Translate',
      'plugins.label.plugin': 'Plugin',
      'plugins.i18n.title': 'English i18n',
      'plugins.i18n.desc': 'Switch browser interface to English with full language pack coverage',
      'plugins.github.title': 'GitHub Translation',
      'plugins.github.desc': 'Auto-translate GitHub page UI text and status labels to Chinese',
      'plugins.custom.title': 'Customization',
      'plugins.custom.desc': 'Custom backgrounds, colors, layouts, CSS, 5 preset themes',
      'download.title': 'Get Drift',
      'download.desc': 'Free · Open Source · Built for Windows',
      'download.btn': 'Download Drift',
      'download.installer': 'Installer',
      'download.portable': 'Portable',
      'changelog.title': 'Changelog',
      'changelog.v233.1': 'Cloud drive system rebuilt',
      'changelog.v233.2': 'AI Agent browser automation',
      'changelog.v233.3': 'Plugin SDK enhancements',
      'changelog.v233.4': 'Performance optimized, 30% less memory',
      'changelog.v230.1': 'Built-in cloud drive launched',
      'changelog.v230.2': 'DocForge document editor',
      'changelog.v230.3': 'Dark/light theme improved',
      'changelog.v225.1': 'AI Chat multi-model support',
      'changelog.v225.2': 'Chrome extension loading',
      'changelog.v225.3': 'Tab groups and split view',
      'changelog.v220.1': 'Sideloading plugin system launched',
      'changelog.v220.2': 'Built-in ad blocker',
      'changelog.v220.3': 'Auto-update feature',
      'ctx.refresh': 'Refresh',
      'ctx.pin': 'Pin Tab',
      'ctx.close': 'Close Tab',
      'ctx.newtab': 'Open in New Tab',
      'demo.ai.q': 'Summarize the key points',
      'demo.ai.input': 'Try typing a question...',
      'demo.plugin.item': '🌐 English i18n',
      'demo.plugin.item2': '🎨 Customization',
      'demo.plugin.drop': 'Drag here to install'
    }
  };

  function t(key) { return (i18n[currentLang] && i18n[currentLang][key]) || key; }

  function applyLang() {
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++) {
      var key = els[i].getAttribute('data-i18n');
      els[i].textContent = t(key);
    }
    var phEls = document.querySelectorAll('[data-i18n-placeholder]');
    for (var j = 0; j < phEls.length; j++) {
      phEls[j].placeholder = t(phEls[j].getAttribute('data-i18n-placeholder'));
    }
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
    renderTabs();
    updateAddrUrl();
  }

  function liquidElastic(t) {
    if (t === 0 || t === 1) return t;
    var p = 0.35;
    return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
  }

  function anim(el, props, duration, easing, delay, onDone) {
    var start = performance.now() + (delay || 0);
    var from = {};
    var keys = Object.keys(props);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (k === 'opacity') from[k] = el.style.opacity !== '' ? parseFloat(el.style.opacity) : (parseFloat(getComputedStyle(el).opacity) || 0);
      else if (k === 'filter') from[k] = 0;
      else if (k === 'clipRadius') from[k] = 0;
      else from[k] = parseFloat(el.style[k]) || parseFloat(getComputedStyle(el)[k]) || 0;
    }
    function ease(t) {
      if (easing === 'elastic') return liquidElastic(t);
      if (easing === 'out') return 1 - Math.pow(1 - t, 3);
      if (easing === 'inOut') return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      return 1 - Math.pow(1 - t, 4);
    }
    function tick(now) {
      var elapsed = now - start;
      if (elapsed < 0) { requestAnimationFrame(tick); return; }
      var progress = Math.min(elapsed / duration, 1);
      var ep = ease(progress);
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        var val = from[k] + (props[k] - from[k]) * ep;
        if (k === 'opacity') el.style.opacity = val;
        else if (k === 'filter') el.style.filter = 'blur(' + val + 'px)';
        else if (k === 'clipRadius') {
          var r = val;
          el.style.clipPath = 'circle(' + r + '% at 50% 100%)';
        }
        else if (k === 'scale') el.style.transform = 'scale(' + val + ')';
        else if (k === 'translateX') el.style.transform = 'translateX(' + val + 'px)';
        else if (k === 'translateY') el.style.transform = 'translateY(' + val + 'px)';
        else el.style[k] = val;
      }
      if (progress < 1) requestAnimationFrame(tick);
      else if (onDone) onDone();
    }
    requestAnimationFrame(tick);
  }

  function staggerAnim(els, props, duration, stagger, easing) {
    for (var i = 0; i < els.length; i++) {
      anim(els[i], props, duration, easing || 'elastic', i * stagger);
    }
  }

  var pages = document.querySelectorAll('.page');
  var tabStrip = document.getElementById('tabStrip');
  var addrUrl = document.getElementById('addrUrl');
  var ctxMenu = document.getElementById('contextMenu');
  var langBtn = document.getElementById('langToggle');

  langBtn.addEventListener('click', function () {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    applyLang();
    DriftAudio.play('btnClick');
  });

  function renderTabs() {
    tabStrip.innerHTML = '';
    for (var i = 0; i < pageList.length; i++) {
      var btn = document.createElement('button');
      btn.className = 'tab-item' + (i === currentPage ? ' active' : '');
      btn.textContent = pageList[i].title[currentLang];
      btn.setAttribute('data-page', i);
      btn.addEventListener('click', function () {
        goToPage(parseInt(this.getAttribute('data-page')));
      });
      btn.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        showCtxMenu(e.clientX, e.clientY, parseInt(this.getAttribute('data-page')));
      });
      tabStrip.appendChild(btn);
    }
  }

  function updateAddrUrl() {
    addrUrl.textContent = pageList[currentPage].url;
  }

  function showCtxMenu(x, y, pageId) {
    DriftAudio.play('contextMenu');
    ctxMenu.classList.remove('hidden');
    ctxMenu.style.left = x + 'px';
    ctxMenu.style.top = y + 'px';
    ctxMenu.setAttribute('data-page', pageId);
  }

  document.addEventListener('click', function () { ctxMenu.classList.add('hidden'); });

  var ctxItems = ctxMenu.querySelectorAll('.ctx-item');
  for (var ci = 0; ci < ctxItems.length; ci++) {
    ctxItems[ci].addEventListener('click', function () {
      var action = this.getAttribute('data-action');
      ctxMenu.classList.add('hidden');
      DriftAudio.play('btnClick');
      if (action === 'refresh') triggerPageAnimations(currentPage);
    });
  }

  function goToPage(index) {
    if (isTransitioning || index === currentPage || index < 0 || index >= pageList.length) return;
    isTransitioning = true;
    DriftAudio.play('transitionStart');

    var oldPage = currentPage;
    var newPage = index;
    var oldEl = pages[oldPage];
    var newEl = pages[newPage];

    transLiquidClip(oldEl, newEl, function () { finishTransition(oldPage, newPage); });
  }

  function finishTransition(oldPage, newPage) {
    pages[oldPage].classList.remove('active');
    pages[oldPage].style.cssText = '';
    pages[newPage].classList.add('active');
    currentPage = newPage;
    updateAddrUrl();
    renderTabs();
    triggerPageAnimations(newPage);
    DriftAudio.play('transitionEnd');
    setTimeout(function () { isTransitioning = false; }, 300);
  }

  function transLiquidClip(oldEl, newEl, cb) {
    newEl.style.visibility = 'visible';
    newEl.style.opacity = '1';
    newEl.style.clipPath = 'circle(0% at 50% 100%)';
    newEl.classList.add('active');

    anim(oldEl, { opacity: 0 }, 500, 'out', 0, function () {
      oldEl.style.visibility = '';
      oldEl.classList.remove('active');
    });

    anim(newEl, { clipRadius: 160 }, 900, 'elastic', 100, function () {
      newEl.style.clipPath = '';
      if (cb) cb();
    });
  }

  function triggerPageAnimations(pageIndex) {
    var page = pages[pageIndex];
    if (!page) return;

    var title = page.querySelector('.section-title');
    var desc = page.querySelector('.section-desc');
    if (title) {
      title.style.opacity = '0';
      title.style.filter = 'blur(8px)';
      title.style.transform = 'translateY(20px)';
      anim(title, { opacity: 1, filter: 0 }, 700, 'elastic', 150);
      anim(title, { translateY: 0 }, 700, 'elastic', 150);
    }
    if (desc) {
      desc.style.opacity = '0';
      desc.style.transform = 'translateY(15px)';
      anim(desc, { opacity: 1 }, 600, 'out', 300);
      anim(desc, { translateY: 0 }, 600, 'elastic', 300);
    }

    if (pageIndex === 0) initHeroEntrance();
    if (pageIndex === 1) initPosterEntrance();
    if (pageIndex === 2) initFeatureCarousel();
    if (pageIndex === 3) initAIDemo();
    if (pageIndex === 4) initPluginsCarousel();
    if (pageIndex === 5) initDownloadEntrance();
    if (pageIndex === 6) initChangelogEntrance();
  }

  function initHeroEntrance() {
    var heroTitle = document.querySelector('.hero-title');
    var heroSub = document.querySelector('.hero-subtitle');
    var heroActions = document.querySelector('.hero-actions');
    if (heroTitle) {
      heroTitle.style.opacity = '0';
      heroTitle.style.filter = 'blur(12px)';
      heroTitle.style.transform = 'scale(0.9)';
      anim(heroTitle, { opacity: 1, filter: 0 }, 800, 'elastic', 200);
      anim(heroTitle, { scale: 1 }, 800, 'elastic', 200);
    }
    if (heroSub) {
      heroSub.style.opacity = '0';
      heroSub.style.transform = 'translateY(20px)';
      anim(heroSub, { opacity: 1 }, 600, 'out', 500);
      anim(heroSub, { translateY: 0 }, 600, 'elastic', 500);
    }
    if (heroActions) {
      heroActions.style.opacity = '0';
      heroActions.style.transform = 'scale(0.9)';
      anim(heroActions, { opacity: 1 }, 500, 'out', 700);
      anim(heroActions, { scale: 1 }, 500, 'elastic', 700);
    }
  }

  function initPosterEntrance() {
    var posterFrame = document.querySelector('.poster-frame');
    var posterText = document.querySelector('.poster-text');
    if (posterFrame) {
      posterFrame.style.opacity = '0';
      posterFrame.style.transform = 'scale(0.9)';
      anim(posterFrame, { opacity: 1 }, 600, 'out', 200);
      anim(posterFrame, { scale: 1 }, 600, 'elastic', 200);
    }
    if (posterText) {
      posterText.style.opacity = '0';
      posterText.style.transform = 'translateY(20px)';
      anim(posterText, { opacity: 1 }, 500, 'out', 400);
      anim(posterText, { translateY: 0 }, 500, 'elastic', 400);
    }
  }

  function initDownloadEntrance() {
    var dlTitle = document.querySelector('.download-title');
    var dlSub = document.querySelector('.download-subtitle');
    var dlBtn = document.querySelector('.download-btn');
    var dlLinks = document.querySelector('.download-links');
    var dlMeta = document.querySelector('.download-meta');
    if (dlTitle) {
      dlTitle.style.opacity = '0';
      dlTitle.style.filter = 'blur(10px)';
      dlTitle.style.transform = 'translateY(30px)';
      anim(dlTitle, { opacity: 1, filter: 0 }, 800, 'elastic', 200);
      anim(dlTitle, { translateY: 0 }, 800, 'elastic', 200);
    }
    if (dlSub) {
      dlSub.style.opacity = '0';
      anim(dlSub, { opacity: 1 }, 600, 'out', 500);
    }
    if (dlBtn) {
      dlBtn.style.opacity = '0';
      dlBtn.style.transform = 'scale(0.8)';
      anim(dlBtn, { opacity: 1 }, 500, 'out', 700);
      anim(dlBtn, { scale: 1 }, 600, 'elastic', 700);
    }
    if (dlLinks) {
      dlLinks.style.opacity = '0';
      anim(dlLinks, { opacity: 1 }, 500, 'out', 900);
    }
    if (dlMeta) {
      dlMeta.style.opacity = '0';
      anim(dlMeta, { opacity: 1 }, 500, 'out', 1000);
    }
  }

  function initChangelogEntrance() {
    var items = document.querySelectorAll('.changelog-item');
    for (var i = 0; i < items.length; i++) {
      items[i].style.opacity = '0';
      items[i].style.transform = 'translateY(20px)';
      anim(items[i], { opacity: 1 }, 500, 'out', 200 + i * 150);
      anim(items[i], { translateY: 0 }, 600, 'elastic', 200 + i * 150);
    }
  }

  document.addEventListener('keydown', function (e) {
    if (isTransitioning) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      goToPage(currentPage + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      goToPage(currentPage - 1);
    }
  });

  var wheelAccum = 0;
  var wheelTimeout;
  document.addEventListener('wheel', function (e) {
    if (isTransitioning) return;
    var activePage = pages[currentPage];
    if (activePage && activePage.classList.contains('page-changelog')) return;
    e.preventDefault();
    wheelAccum += e.deltaY;
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(function () { wheelAccum = 0; }, 200);
    if (Math.abs(wheelAccum) >= 80) {
      goToPage(currentPage + (wheelAccum > 0 ? 1 : -1));
      wheelAccum = 0;
    }
  }, { passive: false });

  document.addEventListener('click', function (e) {
    var rippleEl = document.getElementById('rippleEffect');
    var circle = document.createElement('div');
    circle.className = 'ripple-circle';
    circle.style.left = e.clientX + 'px';
    circle.style.top = e.clientY + 'px';
    circle.style.width = '60px';
    circle.style.height = '60px';
    rippleEl.appendChild(circle);
    setTimeout(function () { if (circle.parentNode) circle.parentNode.removeChild(circle); }, 900);
  });

  function init3DTilt() {
    var tiltEls = document.querySelectorAll('[data-tilt]');
    document.addEventListener('mousemove', function (e) {
      for (var i = 0; i < tiltEls.length; i++) {
        var el = tiltEls[i];
        var rect = el.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) / (rect.width / 2);
        var dy = (e.clientY - cy) / (rect.height / 2);
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 3) {
          el.style.transform = '';
          continue;
        }
        var tiltX = dy * -6;
        var tiltY = dx * 6;
        el.style.transform = 'perspective(800px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg)';
      }
    });
  }

  function initGlossEffect() {
    var glossEls = document.querySelectorAll('[data-gloss]');
    document.addEventListener('mousemove', function (e) {
      for (var i = 0; i < glossEls.length; i++) {
        var el = glossEls[i];
        var rect = el.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width * 100);
        var y = ((e.clientY - rect.top) / rect.height * 100);
        el.style.setProperty('--gloss-x', x + '%');
        el.style.setProperty('--gloss-y', y + '%');
      }
    });
  }

  function initInkCanvas() {
    var canvas = document.getElementById('inkCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var mouseX = 0.5, mouseY = 0.5;
    var time = 0;
    var drops = [];

    function resize() { canvas.width = canvas.parentElement.clientWidth; canvas.height = canvas.parentElement.clientHeight; }
    resize();
    window.addEventListener('resize', resize);

    canvas.parentElement.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = (e.clientY - rect.top) / rect.height;
      if (Math.random() < 0.3) {
        drops.push({
          x: mouseX * canvas.width,
          y: mouseY * canvas.height,
          r: 20 + Math.random() * 60,
          maxR: 80 + Math.random() * 160,
          opacity: 0.04 + Math.random() * 0.06,
          speed: 0.3 + Math.random() * 0.5
        });
      }
    });

    for (var i = 0; i < 8; i++) {
      drops.push({
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        r: 40 + Math.random() * 100,
        maxR: 150 + Math.random() * 200,
        opacity: 0.03 + Math.random() * 0.05,
        speed: 0.2 + Math.random() * 0.4
      });
    }

    function simplex2D(x, y) {
      var n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return n - Math.floor(n);
    }

    function draw() {
      if (currentPage !== 0) { requestAnimationFrame(draw); return; }
      time += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = drops.length - 1; i >= 0; i--) {
        var d = drops[i];
        d.r += d.speed;
        if (d.r > d.maxR) {
          drops.splice(i, 1);
          continue;
        }
        var fade = 1 - (d.r / d.maxR);
        var alpha = d.opacity * fade;
        var grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
        grad.addColorStop(0, 'rgba(255,255,255,' + (alpha * 1.5) + ')');
        grad.addColorStop(0.3, 'rgba(200,220,230,' + (alpha * 0.8) + ')');
        grad.addColorStop(0.6, 'rgba(0,188,212,' + (alpha * 0.3) + ')');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      for (var x = 0; x < canvas.width; x += 8) {
        for (var y = 0; y < canvas.height; y += 8) {
          var n = simplex2D(x * 0.003 + time, y * 0.003 + time * 0.7);
          if (n > 0.92) {
            var a = (n - 0.92) * 3;
            ctx.fillStyle = 'rgba(255,255,255,' + (a * 0.03) + ')';
            ctx.fillRect(x, y, 8, 8);
          }
        }
      }

      if (Math.random() < 0.02) {
        drops.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: 10,
          maxR: 60 + Math.random() * 120,
          opacity: 0.02 + Math.random() * 0.04,
          speed: 0.2 + Math.random() * 0.3
        });
      }

      requestAnimationFrame(draw);
    }
    draw();
  }

  function initFeatureCarousel() {
    var slides = document.querySelectorAll('.feature-slide');
    var dotsContainer = document.getElementById('featDots');
    if (dotsContainer.children.length === 0) {
      for (var i = 0; i < slides.length; i++) {
        var dot = document.createElement('div');
        dot.className = 'feat-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('data-index', i);
        dot.addEventListener('click', function () { goToFeature(parseInt(this.getAttribute('data-index'))); });
        dotsContainer.appendChild(dot);
      }
    }
    if (!slides[0].classList.contains('active')) {
      slides[0].classList.add('active');
    }
    initFeatureDemos();
  }

  function goToFeature(index) {
    var slides = document.querySelectorAll('.feature-slide');
    var dots = document.querySelectorAll('.feat-dot');
    if (index < 0 || index >= slides.length || index === currentFeature) return;
    DriftAudio.play('tabSwitch');

    slides[currentFeature].classList.remove('active');
    slides[currentFeature].classList.add('exit-up');
    setTimeout(function () { slides[currentFeature].classList.remove('exit-up'); currentFeature = index; }, 700);

    var prevFeature = currentFeature;
    slides[index].classList.add('active');
    dots[prevFeature].classList.remove('active');
    dots[index].classList.add('active');
    currentFeature = index;
  }

  document.getElementById('featPrev').addEventListener('click', function () { goToFeature(currentFeature - 1); });
  document.getElementById('featNext').addEventListener('click', function () { goToFeature(currentFeature + 1); });

  function initFeatureDemos() {
    var aiInput = document.getElementById('demoAiInput');
    if (aiInput && !aiInput._bound) {
      aiInput._bound = true;
      aiInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && this.value.trim()) {
          var reply = document.getElementById('demoAiReply');
          reply.textContent = '';
          var text = currentLang === 'zh' ? '这是一个很好的问题！让我为你分析...' : 'Great question! Let me analyze that for you...';
          var i = 0;
          function type() {
            if (i < text.length) { reply.textContent += text[i]; i++; setTimeout(type, 30); }
          }
          type();
          this.value = '';
          DriftAudio.play('btnClick');
        }
      });
    }

    var dropZone = document.querySelector('.demo-drop-zone');
    if (dropZone && !dropZone._bound) {
      dropZone._bound = true;
      dropZone.addEventListener('dragover', function (e) { e.preventDefault(); this.style.borderColor = '#00E676'; this.style.background = 'rgba(0,230,118,0.1)'; });
      dropZone.addEventListener('dragleave', function () { this.style.borderColor = ''; this.style.background = ''; });
      dropZone.addEventListener('drop', function (e) {
        e.preventDefault();
        this.textContent = currentLang === 'zh' ? '✅ 安装成功！' : '✅ Installed!';
        this.style.borderColor = '#00E676';
        this.style.background = 'rgba(0,230,118,0.15)';
        DriftAudio.play('btnClick');
      });
    }

    initPerfChart();
    initAdblockDemo();
  }

  function initPerfChart() {
    var canvas = document.getElementById('perfChart');
    if (!canvas || canvas._inited) return;
    canvas._inited = true;
    var ctx = canvas.getContext('2d');
    var data = [];
    for (var i = 0; i < 30; i++) data.push(60 + Math.random() * 30);

    function draw() {
      if (currentPage !== 2) { requestAnimationFrame(draw); return; }
      data.shift();
      data.push(30 + Math.random() * 50);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      for (var i = 0; i < data.length; i++) {
        var x = (i / (data.length - 1)) * canvas.width;
        var y = canvas.height - (data[i] / 100) * canvas.height * 0.8 - 10;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = '#00BCD4';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      var grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, 'rgba(0,188,212,0.15)');
      grad.addColorStop(1, 'rgba(0,188,212,0)');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.fillStyle = '#6E6E73';
      ctx.font = '10px monospace';
      ctx.fillText('Memory MB', 4, 14);
      ctx.fillText(Math.round(data[data.length - 1]) + 'MB', canvas.width - 40, 14);

      requestAnimationFrame(draw);
    }
    draw();
  }

  function initAdblockDemo() {
    var webpage = document.getElementById('demoWebpage');
    if (!webpage || webpage._inited) return;
    webpage._inited = true;
    var ads = webpage.querySelectorAll('.demo-ad');
    var idx = 0;
    setInterval(function () {
      if (currentPage !== 2) return;
      if (idx < ads.length) {
        ads[idx].classList.add('removed');
        idx++;
        DriftAudio.play('btnClick');
      } else {
        for (var i = 0; i < ads.length; i++) ads[i].classList.remove('removed');
        idx = 0;
      }
    }, 2000);
  }

  function initAIDemo() {
    var sceneBtns = document.querySelectorAll('.ai-scene-btn');
    for (var i = 0; i < sceneBtns.length; i++) {
      if (sceneBtns[i]._bound) continue;
      sceneBtns[i]._bound = true;
      sceneBtns[i].addEventListener('click', function () {
        var scene = this.getAttribute('data-scene');
        switchAiScene(scene);
        DriftAudio.play('tabSwitch');
      });
    }
    switchAiScene('summarize');
  }

  function switchAiScene(scene) {
    currentAiScene = scene;
    var btns = document.querySelectorAll('.ai-scene-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle('active', btns[i].getAttribute('data-scene') === scene);
    }
    var scenes = document.querySelectorAll('.ai-scene');
    for (var j = 0; j < scenes.length; j++) {
      scenes[j].classList.toggle('active', scenes[j].getAttribute('data-scene') === scene);
    }
    if (aiSceneTimer) clearTimeout(aiSceneTimer);
    runAiScene(scene);
  }

  function runAiScene(scene) {
    if (scene === 'summarize') runSummarizeScene();
    else if (scene === 'fill') runFillScene();
    else if (scene === 'search') runSearchScene();
    else if (scene === 'translate') runTranslateScene();
  }

  function runSummarizeScene() {
    var overlay = document.getElementById('aiSummarizeOverlay');
    var text = document.getElementById('aiSummarizeText');
    if (!overlay || !text) return;
    overlay.classList.remove('visible');
    text.textContent = '';
    aiSceneTimer = setTimeout(function () {
      overlay.classList.add('visible');
      var summary = currentLang === 'zh'
        ? '这篇文章探讨了Web浏览的未来趋势，包括AI集成、隐私保护和性能优化三个核心方向。'
        : 'This article explores future trends in web browsing, including AI integration, privacy protection, and performance optimization.';
      var i = 0;
      function type() {
        if (i < summary.length && currentAiScene === 'summarize') {
          text.textContent += summary[i]; i++;
          aiSceneTimer = setTimeout(type, 25);
        }
      }
      type();
    }, 1500);
  }

  function runFillScene() {
    var fields = [
      { id: 'aiFillName', val: currentLang === 'zh' ? '张三' : 'John Smith' },
      { id: 'aiFillEmail', val: 'john@example.com' },
      { id: 'aiFillPhone', val: currentLang === 'zh' ? '138-0000-0000' : '+1 555-0123' },
      { id: 'aiFillAddr', val: currentLang === 'zh' ? '北京市朝阳区' : '123 Main St, NYC' }
    ];
    for (var i = 0; i < fields.length; i++) {
      var el = document.getElementById(fields[i].id);
      if (el) { el.textContent = ''; el.classList.remove('filled'); }
    }
    fields.forEach(function (f, idx) {
      aiSceneTimer = setTimeout(function () {
        var el = document.getElementById(f.id);
        if (el && currentAiScene === 'fill') {
          el.textContent = f.val;
          el.classList.add('filled');
          DriftAudio.play('btnClick');
        }
      }, 800 + idx * 600);
    });
  }

  function runSearchScene() {
    var searchText = document.getElementById('aiSearchText');
    var results = document.getElementById('aiSearchResults');
    if (!searchText || !results) return;
    searchText.textContent = '';
    results.innerHTML = '';
    var query = currentLang === 'zh' ? 'Drift 浏览器 AI 功能' : 'Drift browser AI features';
    var i = 0;
    function typeQuery() {
      if (i < query.length && currentAiScene === 'search') {
        searchText.textContent += query[i]; i++;
        aiSceneTimer = setTimeout(typeQuery, 60);
      } else if (currentAiScene === 'search') {
        showSearchResults();
      }
    }
    aiSceneTimer = setTimeout(typeQuery, 500);
  }

  function showSearchResults() {
    var results = document.getElementById('aiSearchResults');
    if (!results) return;
    var items = currentLang === 'zh' ? [
      { title: 'Drift Browser - AI 驱动的浏览器', url: 'drift-browser.com/ai' },
      { title: 'AI Chat 多模型支持 - Drift 文档', url: 'docs.drift-browser.com/ai-chat' },
      { title: 'AI Agent 自动化操作指南', url: 'docs.drift-browser.com/ai-agent' }
    ] : [
      { title: 'Drift Browser - AI-Powered Browser', url: 'drift-browser.com/ai' },
      { title: 'AI Chat Multi-Model Support - Drift Docs', url: 'docs.drift-browser.com/ai-chat' },
      { title: 'AI Agent Automation Guide', url: 'docs.drift-browser.com/ai-agent' }
    ];
    results.innerHTML = '';
    items.forEach(function (item, idx) {
      var div = document.createElement('div');
      div.className = 'ai-search-result';
      div.innerHTML = '<div class="ai-search-result-title">' + item.title + '</div><div class="ai-search-result-url">' + item.url + '</div>';
      results.appendChild(div);
      setTimeout(function () {
        if (currentAiScene === 'search') div.classList.add('visible');
      }, 300 + idx * 300);
    });
  }

  function runTranslateScene() {
    var result = document.getElementById('aiTranslateResult');
    if (!result) return;
    result.innerHTML = '';
    var translations = [
      { en: 'The quick brown fox jumps over the lazy dog.', zh: '敏捷的棕色狐狸跳过了懒狗。' },
      { en: 'Artificial intelligence is transforming how we browse the web.', zh: '人工智能正在改变我们浏览网页的方式。' },
      { en: 'Drift Browser brings AI directly into your workflow.', zh: 'Drift 浏览器将 AI 直接融入你的工作流。' }
    ];
    translations.forEach(function (t, idx) {
      aiSceneTimer = setTimeout(function () {
        if (currentAiScene !== 'translate' || !result) return;
        var line = document.createElement('div');
        line.className = 'ai-translate-line zh';
        line.textContent = t.zh;
        result.appendChild(line);
        setTimeout(function () { line.classList.add('visible'); }, 50);
        DriftAudio.play('btnClick');
      }, 800 + idx * 800);
    });
  }

  function initPluginsCarousel() {
    var cards = document.querySelectorAll('.plugin-card');
    var dotsContainer = document.getElementById('plugDots');
    if (dotsContainer.children.length === 0) {
      for (var i = 0; i < cards.length; i++) {
        var dot = document.createElement('div');
        dot.className = 'plug-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('data-index', i);
        dot.addEventListener('click', function () { goToPlugin(parseInt(this.getAttribute('data-index'))); });
        dotsContainer.appendChild(dot);
      }
    }
  }

  function goToPlugin(index) {
    var cards = document.querySelectorAll('.plugin-card');
    var dots = document.querySelectorAll('.plug-dot');
    if (index < 0 || index >= cards.length || index === currentPlugin) return;
    DriftAudio.play('tabSwitch');

    cards[currentPlugin].classList.remove('active');
    cards[currentPlugin].classList.add('exit-left');
    setTimeout(function () { cards[currentPlugin].classList.remove('exit-left'); }, 600);

    cards[index].classList.add('active');
    dots[currentPlugin].classList.remove('active');
    dots[index].classList.add('active');
    currentPlugin = index;
  }

  document.getElementById('plugPrev').addEventListener('click', function () { goToPlugin(currentPlugin - 1); });
  document.getElementById('plugNext').addEventListener('click', function () { goToPlugin(currentPlugin + 1); });

  function initNeuralCanvas() {
    var canvas = document.getElementById('neuralCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var nodes = [];

    function resize() { canvas.width = canvas.parentElement.clientWidth; canvas.height = canvas.parentElement.clientHeight; }
    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < 40; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: 1.5 + Math.random() * 2
      });
    }

    function draw() {
      if (currentPage !== 3) { requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,188,212,0.15)';
        ctx.fill();
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = n.x - nodes[j].x;
          var dy = n.y - nodes[j].y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = 'rgba(0,188,212,' + (0.06 * (1 - d / 150)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  function initDownloadCanvas() {
    var canvas = document.getElementById('downloadCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];

    function resize() { canvas.width = canvas.parentElement.clientWidth; canvas.height = canvas.parentElement.clientHeight; }
    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.2 - Math.random() * 0.5,
        r: 1 + Math.random() * 2,
        o: 0.05 + Math.random() * 0.15
      });
    }

    function draw() {
      if (currentPage !== 5) { requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,188,212,' + p.o + ')';
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  function initLoader() {
    var canvas = document.getElementById('loadCanvas');
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var progress = 0;
    var cx = canvas.width / 2;
    var cy = canvas.height / 2;

    function draw() {
      progress += 0.012;
      if (progress > 1) progress = 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      var liquidH = canvas.height * progress;
      var grad = ctx.createLinearGradient(0, canvas.height - liquidH, 0, canvas.height);
      grad.addColorStop(0, 'rgba(0,188,212,0.2)');
      grad.addColorStop(0.5, 'rgba(0,230,118,0.12)');
      grad.addColorStop(1, 'rgba(68,138,255,0.08)');

      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (var x = 0; x <= canvas.width; x += 4) {
        var waveY = canvas.height - liquidH + Math.sin(x * 0.01 + progress * 10) * 8;
        ctx.lineTo(x, waveY);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.fillStyle = '#F5F5F7';
      ctx.font = '600 16px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Drift Browser', cx, cy);

      ctx.fillStyle = '#86868B';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(Math.round(progress * 100) + '%', cx, cy + 28);

      if (progress < 1) {
        requestAnimationFrame(draw);
      } else {
        setTimeout(function () {
          document.getElementById('loader').classList.add('done');
          setTimeout(function () { document.getElementById('loader').style.display = 'none'; }, 1000);
        }, 400);
      }
    }
    draw();
  }

  initLoader();
  renderTabs();
  updateAddrUrl();
  applyLang();
  init3DTilt();
  initGlossEffect();

  setTimeout(function () {
    initInkCanvas();
    initNeuralCanvas();
    initDownloadCanvas();
    triggerPageAnimations(0);
  }, 500);

})();
