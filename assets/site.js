(function () {
  // Copy buttons: <button class="copy" data-copy="id-of-element">
  function flash(btn, text) {
    var old = btn.getAttribute('data-label') || btn.textContent;
    btn.setAttribute('data-label', old);
    btn.textContent = text;
    setTimeout(function () { btn.textContent = old; }, 1600);
  }
  function selectText(el) {
    var r = document.createRange(); r.selectNodeContents(el);
    var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
  }
  document.querySelectorAll('.copy[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var el = document.getElementById(btn.getAttribute('data-copy'));
      if (!el) return;
      var text = el.textContent.trim();
      var fallback = function () { selectText(el); flash(btn, 'Selected'); };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { flash(btn, 'Copied'); }, fallback);
        } else { fallback(); }
      } catch (e) { fallback(); }
    });
  });

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Home wordmark: "Numio." collapses into the "N." logo, then opens back up.
  var wm = document.getElementById('wordmark');
  var umio = wm && wm.querySelector('.umio');
  if (wm && umio && !reduce) {
    var measure = function () { wm.style.setProperty('--umio-w', umio.getBoundingClientRect().width + 'px'); };
    var busy = false;
    var play = function () {
      if (busy) return; busy = true;
      wm.classList.add('logo');
      setTimeout(function () { wm.classList.remove('logo'); setTimeout(function () { busy = false; }, 900); }, 2200);
    };
    var start = function () { measure(); setTimeout(play, 1400); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else window.addEventListener('load', start);
    window.addEventListener('resize', function () { if (!busy) measure(); });
    wm.addEventListener('click', play);
  }

  // Easter egg: tap "Numio" in the footer 7 times.
  var brand = document.getElementById('brand'), egg = document.getElementById('egg');
  if (brand && egg) {
    var taps = 0, timer, running = false;
    var lines = ['Thanks for choosing Numio 💛', 'With Lo❤️e, R.R'];
    var type = function (line, cb) {
      var chars = Array.from(line), i = 0;
      if (reduce) { egg.textContent = line; return setTimeout(cb, 1400); }
      egg.textContent = '';
      (function step() {
        if (i < chars.length) { egg.textContent += chars[i++]; setTimeout(step, 55); }
        else setTimeout(cb, 1400);
      })();
    };
    brand.addEventListener('click', function () {
      if (running) return;
      taps++; clearTimeout(timer); timer = setTimeout(function () { taps = 0; }, 2000);
      if (taps >= 7) { taps = 0; running = true; type(lines[0], function () { type(lines[1], function () { running = false; }); }); }
    });
  }
})();
