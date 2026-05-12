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
    gain.gain.value = gainVal || 0.1;
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
    gain.gain.value = gainVal || 0.03;
    var filter = ctx.createBiquadFilter();
    filter.type = filterType || 'lowpass';
    filter.frequency.value = filterFreq || 800;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(ctx.currentTime);
    source.stop(ctx.currentTime + (duration || 0.3));
  }

  var sounds = {
    tabSwitch: function () {
      createOsc(880, 'sine', 0.12, 0.06, true);
      setTimeout(function () {
        createOsc(1100, 'sine', 0.08, 0.04, true);
      }, 40);
    },

    tabClose: function () {
      createNoise(0.2, 0.04, 1200, 'bandpass');
      createOsc(440, 'sine', 0.25, 0.03, true);
    },

    btnHover: function () {
      createOsc(1200, 'sine', 0.06, 0.02, true);
    },

    btnClick: function () {
      createOsc(660, 'sine', 0.08, 0.08, true);
      setTimeout(function () {
        createOsc(990, 'sine', 0.06, 0.05, true);
      }, 30);
    },

    transitionStart: function () {
      createNoise(0.4, 0.05, 600, 'lowpass');
      createOsc(220, 'sine', 0.5, 0.04, true);
      setTimeout(function () {
        createOsc(330, 'sine', 0.3, 0.03, true);
      }, 100);
    },

    transitionEnd: function () {
      createOsc(550, 'sine', 0.3, 0.05, true);
      createNoise(0.15, 0.02, 2000, 'highpass');
    },

    contextMenu: function () {
      createOsc(700, 'sine', 0.06, 0.04, true);
    },

    sphereRotate: function () {
      createNoise(0.08, 0.01, 3000, 'highpass');
    },

    engineStart: function () {
      var o = createOsc(80, 'sawtooth', 1.5, 0.06, false);
      o.osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 1.0);
      o.gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      createNoise(1.0, 0.04, 400, 'lowpass');
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
