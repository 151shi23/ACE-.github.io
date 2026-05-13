(function () {
  'use strict';

  var ctx = null;
  var enabled = true;

  function init() {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      enabled = false;
    }
  }

  function resume() {
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  function play(type) {
    if (!enabled || !ctx) return;
    resume();
    var fn = sounds[type];
    if (fn) fn();
  }

  function createOsc(freq, type, duration, gainVal, rampTime) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.value = gainVal || 0.04;
    if (rampTime) {
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (duration || 0.3));
    }
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + (duration || 0.3));
    return { osc: osc, gain: gain };
  }

  function createNoise(duration, gainVal, filterFreq, filterType) {
    var bufferSize = ctx.sampleRate * (duration || 0.3);
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }
    var source = ctx.createBufferSource();
    source.buffer = buffer;
    var gain = ctx.createGain();
    gain.gain.value = gainVal || 0.02;
    var filter = ctx.createBiquadFilter();
    filter.type = filterType || 'lowpass';
    filter.frequency.value = filterFreq || 600;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(ctx.currentTime);
    source.stop(ctx.currentTime + (duration || 0.3));
  }

  var sounds = {
    tabSwitch: function () {
      createOsc(660, 'sine', 0.1, 0.03, true);
      setTimeout(function () {
        createOsc(880, 'sine', 0.07, 0.02, true);
      }, 50);
    },

    tabClose: function () {
      createNoise(0.15, 0.02, 1000, 'bandpass');
      createOsc(330, 'sine', 0.2, 0.02, true);
    },

    btnHover: function () {
      createOsc(1000, 'sine', 0.04, 0.01, true);
    },

    btnClick: function () {
      createOsc(520, 'sine', 0.06, 0.04, true);
      setTimeout(function () {
        createOsc(780, 'sine', 0.05, 0.025, true);
      }, 40);
    },

    transitionStart: function () {
      createNoise(0.5, 0.025, 400, 'lowpass');
      createOsc(180, 'sine', 0.6, 0.02, true);
      setTimeout(function () {
        createOsc(260, 'sine', 0.35, 0.015, true);
      }, 120);
    },

    transitionEnd: function () {
      createOsc(440, 'sine', 0.25, 0.025, true);
      createNoise(0.1, 0.01, 1800, 'highpass');
    },

    contextMenu: function () {
      createOsc(580, 'sine', 0.05, 0.02, true);
    },

    engineStart: function () {
      var o = createOsc(60, 'sawtooth', 1.2, 0.03, false);
      o.osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.8);
      o.gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      createNoise(0.8, 0.02, 300, 'lowpass');
    }
  };

  document.addEventListener('click', function () {
    if (!ctx) init();
    resume();
  }, { once: true });

  document.addEventListener('keydown', function () {
    if (!ctx) init();
    resume();
  }, { once: true });

  window.DriftAudio = {
    init: init,
    play: play,
    resume: resume,
    setEnabled: function (v) { enabled = v; }
  };

})();
