/* =========================================================
   MODO JUEGO  (estilo Duolingo, en español)
   - 15 mundos (los temas), cada uno con 6 niveles:
       📖 Aprende · 🎬 Mira cómo se hace · ⭐ Nivel 1 · ⭐ Nivel 2 · ⭐ Nivel 3 · 👑 Jefe
   - corazones, puntos, estrellas, objetivo diario y semanal
   - reproductor de pasos (los ejemplos se "ven hacer")
   - panel de padres con PIN: puntos por semana y premios
   ========================================================= */
(function (global) {
  'use strict';
  const MM = global.MM, V = MM.views, esc = MM.esc;
  const G = MM.game = { run: null, parentOk: false };

  /* ---------------------------------------------------------
     Definición de los niveles de cada mundo
     --------------------------------------------------------- */
  const LEVELS = [
    { n: 1, kind: 'lesson',   icon: '📖', title: 'Aprende',            sub: 'La explicación, en cartas cortas',    pts: 20 },
    { n: 2, kind: 'examples', icon: '🎬', title: 'Mira cómo se hace',  sub: 'Ejemplos resueltos paso a paso',       pts: 15 },
    { n: 3, kind: 'practice', icon: '⭐', title: 'Nivel 1',            sub: '5 ejercicios fáciles',                 count: 5, maxLevel: 1, lv: false, pts: 50 },
    { n: 4, kind: 'practice', icon: '⭐', title: 'Nivel 2',            sub: '6 ejercicios',                          count: 6, maxLevel: 2, lv: false, pts: 60 },
    { n: 5, kind: 'practice', icon: '⭐', title: 'Nivel 3',            sub: '7 ejercicios, enunciados en letón',    count: 7, maxLevel: 3, lv: true,  pts: 70 },
    { n: 6, kind: 'boss',     icon: '👑', title: 'Jefe final',         sub: '8 ejercicios en letón, sin fallar mucho', count: 8, maxLevel: 3, lv: true, pts: 100 }
  ];
  G.LEVELS = LEVELS;
  const HEARTS = 3;

  const key = (topic, n) => topic + ':' + n;
  const lvlState = (topic, n) => (MM.store.p().game.levels || {})[key(topic, n)] || null;
  const isDone = (topic, n) => !!(lvlState(topic, n) && lvlState(topic, n).done);
  const freeRoam = () => !!MM.store.settings.freeRoam;

  G.worldUnlocked = function (i) {
    if (i === 0 || freeRoam()) return true;
    return isDone(MM.TOPICS[i - 1].id, 3);          // el Nivel 1 del mundo anterior
  };
  G.levelUnlocked = function (topic, n) {
    if (n === 1 || freeRoam()) return true;
    return isDone(topic, n - 1);
  };
  G.worldProgress = function (topic) {
    return LEVELS.filter(l => isDone(topic, l.n)).length;
  };
  /** siguiente nivel pendiente (para el botón Continuar) */
  G.nextLevel = function () {
    for (let i = 0; i < MM.TOPICS.length; i++) {
      if (!G.worldUnlocked(i)) continue;
      const t = MM.TOPICS[i].id;
      for (const l of LEVELS) if (!isDone(t, l.n) && G.levelUnlocked(t, l.n)) return { topic: t, n: l.n };
    }
    return null;
  };

  /* ---------------------------------------------------------
     Ayudas de texto (todo en español en el juego)
     --------------------------------------------------------- */
  const es = t => (t && typeof t === 'object') ? t.es : (t || '');
  const lv = t => (t && typeof t === 'object') ? (t.lv || t.es) : (t || '');

  function blockEs(b) {
    switch (b.k) {
      case 'p': return '<p>' + es(b.t) + '</p>';
      case 'key': return '<div class="note key">🔑 ' + es(b.t) + '</div>';
      case 'tip': return '<div class="note tip">💡 ' + es(b.t) + '</div>';
      case 'warn': return '<div class="note warn">⚠️ ' + es(b.t) + '</div>';
      case 'list': return '<ul>' + b.items.map(i => '<li>' + es(i) + '</li>').join('') + '</ul>';
      case 'table': return '<table class="t"><thead><tr>' + b.head.map(h => '<th>' + es(h) + '</th>').join('') +
        '</tr></thead><tbody>' + b.rows.map(r => '<tr>' + r.map(c => '<td>' + es(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
      case 'ex': return playerHtml(es(b.t), b.steps.map(es), { auto: true });
      default: return '';
    }
  }

  /* ---------------------------------------------------------
     Reproductor de pasos ("mini vídeo")
     --------------------------------------------------------- */
  let pid = 0;
  function playerHtml(title, steps, opts) {
    opts = opts || {};
    const id = 'pl' + (++pid);
    return '<div class="player" id="' + id + '" data-speed="' + (opts.speed || 2600) + '"' + (opts.auto ? ' data-auto="1"' : '') + '>' +
      '<div class="player-head"><span>🎬 ' + title + '</span>' +
      '<span class="player-ctl">' +
        '<button data-pact="restart" title="Desde el principio">⏮</button>' +
        '<button data-pact="toggle" title="Reproducir / pausar">▶</button>' +
        '<button data-pact="next" title="Siguiente paso">⏭</button>' +
      '</span></div>' +
      '<ol class="steps psteps">' + steps.map(s => '<li class="pending">' + s + '</li>').join('') + '</ol>' +
      '<div class="player-bar"><i></i></div>' +
      '</div>';
  }
  G.playerHtml = playerHtml;

  const players = {};
  function pState(el) {
    return players[el.id] || (players[el.id] = { idx: 0, timer: null, playing: false });
  }
  function pShow(el, st) {
    const lis = el.querySelectorAll('.psteps li');
    lis.forEach((li, i) => {
      li.classList.toggle('pending', i >= st.idx);
      li.classList.toggle('shown', i < st.idx);
      li.classList.toggle('now', i === st.idx - 1);
    });
    const bar = el.querySelector('.player-bar i');
    if (bar) bar.style.width = Math.round(st.idx / Math.max(1, lis.length) * 100) + '%';
    const btn = el.querySelector('[data-pact="toggle"]');
    if (btn) btn.textContent = st.playing ? '⏸' : (st.idx >= lis.length ? '🔁' : '▶');
  }
  function pStop(el, st) { if (st.timer) clearInterval(st.timer); st.timer = null; st.playing = false; }
  function pStep(el, st) {
    const n = el.querySelectorAll('.psteps li').length;
    if (st.idx < n) st.idx++;
    if (st.idx >= n) pStop(el, st);
    pShow(el, st);
  }
  function pPlay(el, st) {
    const n = el.querySelectorAll('.psteps li').length;
    if (st.idx >= n) st.idx = 0;
    pStop(el, st);
    st.playing = true;
    pStep(el, st);
    st.timer = setInterval(() => {
      if (!document.contains(el)) { pStop(el, st); return; }
      pStep(el, st);
    }, Number(el.getAttribute('data-speed')) || 2600);
    pShow(el, st);
  }
  MM.player = {
    init(root) {
      root.querySelectorAll('.player').forEach((el, i) => {
        const st = pState(el);
        st.idx = 0; pStop(el, st);
        pShow(el, st);
        if (el.getAttribute('data-auto') && i === 0) setTimeout(() => { if (document.contains(el)) pPlay(el, st); }, 500);
        else if (el.getAttribute('data-auto')) setTimeout(() => { if (document.contains(el)) pPlay(el, st); }, 500 + i * 300);
      });
    },
    act(el, action) {
      const st = pState(el);
      if (action === 'toggle') { if (st.playing) { pStop(el, st); pShow(el, st); } else pPlay(el, st); }
      else if (action === 'next') { pStop(el, st); pStep(el, st); }
      else if (action === 'restart') { st.idx = 0; pPlay(el, st); }
      else if (action === 'all') { pStop(el, st); st.idx = el.querySelectorAll('.psteps li').length; pShow(el, st); }
    }
  };
  document.addEventListener('click', ev => {
    const b = ev.target.closest('[data-pact]');
    if (!b) return;
    const el = b.closest('.player');
    if (el) MM.player.act(el, b.getAttribute('data-pact'));
  });

  /* ---------------------------------------------------------
     Puntos y estado del juego
     --------------------------------------------------------- */
  function award(n, source) { if (n > 0) MM.store.addPoints(n, source || 'juego'); }

  function weekInfo() {
    const mon = MM.weekStart();
    const pts = MM.store.pointsWeek(mon);
    const goal = MM.store.settings.weeklyGoal || 300;
    const today = (MM.store.p().points[MM.today()] || { t: 0 }).t;
    return { mon: mon, pts: pts, goal: goal, today: today, dailyGoal: MM.store.settings.dailyGoal || 60 };
  }
  G.weekInfo = weekInfo;

  function markDone(topic, n, stars, ptsEarned) {
    const p = MM.store.p();
    const k = key(topic, n);
    const prev = p.game.levels[k];
    const first = !prev || !prev.done;
    p.game.levels[k] = {
      done: true,
      stars: Math.max(stars, prev ? prev.stars || 0 : 0),
      best: Math.max(ptsEarned, prev ? prev.best || 0 : 0),
      first: prev && prev.first ? prev.first : MM.today(),
      plays: (prev ? prev.plays || 0 : 0) + 1
    };
    p.game.history.push({ d: MM.today(), topic: topic, n: n, stars: stars, pts: ptsEarned });
    if (p.game.history.length > 400) p.game.history.splice(0, p.game.history.length - 400);
    MM.store.save();
    return first;
  }

  /* ---------------------------------------------------------
     Empezar un nivel
     --------------------------------------------------------- */
  G.start = function (topic, n) {
    const def = LEVELS.find(l => l.n === n);
    const t = MM.topic(topic);
    if (!def || !t) return false;
    const replay = isDone(topic, n);
    const run = { topic: topic, n: n, def: def, replay: replay, pts: 0, page: 0, hearts: HEARTS, showAlt: false, finished: false, failed: false };
    if (def.kind === 'lesson') {
      run.pages = MM.LESSONS[topic].sections.map(sec => ({ title: es(sec.t), html: sec.b.map(blockEs).join('') }));
      run.pages.push({ title: 'Palabras en letón', html: vocabHtml(topic) });
    }
    if (def.kind === 'examples') {
      const items = [];
      MM.LESSONS[topic].sections.forEach(sec => sec.b.filter(b => b.k === 'ex').forEach(b => items.push({ title: es(b.t), steps: b.steps.map(es) })));
      const rng = MM.rng(Date.now() % 1e9);
      MM.engine.chooseGens(topic, 3, rng).forEach(g => {
        const ex = MM.gen.make(g, rng.int(1, 999999));
        if (ex) items.push({ title: 'Ejemplo nuevo: ' + stripHtml(es(ex.q)).slice(0, 90), q: es(ex.q), steps: ex.solution.map(es),
          answer: ex.fields.map(f => MM.answerHtml(f)).join(' · ') });
      });
      run.examples = items;
    }
    if (def.kind === 'practice' || def.kind === 'boss') {
      const rng = MM.rng(Date.now() % 1e9);
      const defs = MM.gen.byTopic(topic).filter(d => d.level <= def.maxLevel);
      const pool = defs.length >= 3 ? defs : MM.gen.byTopic(topic);
      const items = [];
      let used = [];
      for (let i = 0; i < def.count; i++) {
        let cand = pool.filter(d => !used.includes(d.id));
        if (!cand.length) { used = []; cand = pool; }
        const pick = rng.pick(cand);
        used.push(pick.id);
        items.push({ gen: pick.id, seed: rng.int(1, 999999) });
      }
      MM.engine.start({ mode: 'game', topic: topic, items: items, noPoints: true });
    }
    G.run = run;
    return true;
  };

  function stripHtml(s) { return String(s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }

  const VOCAB = { nat: [1], frac: [3], dec: [3], neg: [1], pow: [2], pct: [4], rat: [4], mag: [5], sta: [7], lang: [2, 0], geo: [6], coo: [6], vol: [6], wm: [8], log: [8] };
  function vocabHtml(topic) {
    const cats = VOCAB[topic] || [0];
    const rng = MM.rng('vocab-' + topic);
    let items = [];
    cats.forEach(ci => { items = items.concat(MM.GLOSSARY[ci].items); });
    items = rng.sample(items, Math.min(10, items.length));
    return '<p>El examen es <b>solo en letón</b>. Estas palabras salen en los enunciados de este tema: léelas dos veces, mañana las verás en los ejercicios.</p>' +
      '<table class="t"><thead><tr><th>Latviski</th><th>Español</th></tr></thead><tbody>' +
      items.map(it => '<tr><td><b>' + esc(it[0]) + '</b></td><td>' + esc(it[1]) + '</td></tr>').join('') + '</tbody></table>';
  }

  /* ---------------------------------------------------------
     VISTAS
     --------------------------------------------------------- */
  function heartsHtml(h) {
    return '<span class="hearts" aria-label="' + h + ' vidas">' + '❤️'.repeat(h) + '<span class="off">' + '🖤'.repeat(Math.max(0, HEARTS - h)) + '</span></span>';
  }
  function starsHtml(n) { return '<span class="gstars">' + '⭐'.repeat(n) + '<span class="off">' + '☆'.repeat(3 - n) + '</span></span>'; }

  V.gameHome = function () {
    const p = MM.store.p();
    G.claimQuests(); G.checkBadges();
    const w = weekInfo();
    const rewardNote = (p.rewards[w.mon] || {}).note;
    const next = G.nextLevel();
    const total = MM.store.pointsTotal();
    const nextT = next ? MM.topic(next.topic) : null;
    const nextL = next ? LEVELS.find(l => l.n === next.n) : null;
    const pct = Math.min(100, Math.round(w.pts / w.goal * 100));

    return '<section class="hero card ghero">' +
        '<div class="hero-deco">🎮</div>' +
        '<h1>¡Hola, ' + esc(p.name) + '! ' + p.avatar + '</h1>' +
        '<div class="mascot"><span class="mascot-face">' + G.MASCOT + '</span><div class="bubble">' + G.mascotMsg() + '</div></div>' +
        '<div class="hero-stats">' +
          '<span class="pill">🔥 <b>' + (p.streak.days || 0) + '</b> días seguidos</span>' +
          '<span class="pill">💎 <b>' + total + '</b> puntos en total</span>' +
          '<span class="pill">☀️ hoy <b>' + w.today + '</b> / ' + w.dailyGoal + '</span>' +
        '</div>' +
        '<div class="goalbox">' +
          '<div class="row between"><b>🎁 ' + (rewardNote ? 'Premio de la semana: ' + esc(rewardNote) : 'Objetivo de la semana') + '</b><span>' + w.pts + ' / ' + w.goal + ' puntos</span></div>' +
          '<div class="bar big"><i style="width:' + pct + '%"></i></div>' +
          (w.pts >= w.goal ? '<div class="goal-ok">🏆 ¡Objetivo conseguido! Todo lo que sumes ahora es extra.</div>'
                           : '<div class="muted-light">Te faltan <b>' + (w.goal - w.pts) + '</b> puntos. Cada ejercicio bien vale 10 o más.</div>') +
        '</div>' +
        (next ? '<button class="btn accent big" data-act="g-play" data-topic="' + next.topic + '" data-n="' + next.n + '">▶ Continuar: ' +
                nextT.emoji + ' ' + es(nextT.name) + ' · ' + nextL.icon + ' ' + nextL.title + '</button>'
              : '<div class="goal-ok">🏁 ¡Has completado todos los mundos! Repite los jefes para más puntos.</div>') +
        '<div class="btn-row" style="margin-top:.5rem"><button class="btn" data-act="go" data-href="#/juego/relampago">⚡ Relámpago (60 s) · récord ' + (p.flash.best || 0) + '</button>' +
        '<button class="btn" data-act="go" data-href="#/reto">🎲 Reto del día</button></div>' +
      '</section>' +
      G.questsHtml() +
      '<h2 style="margin-top:1rem">🗺️ Mundos</h2>' +
      '<div class="worlds">' + MM.TOPICS.map((t, i) => {
        const unlocked = G.worldUnlocked(i);
        const done = G.worldProgress(t.id);
        const stars = LEVELS.reduce((a, l) => a + ((lvlState(t.id, l.n) || {}).stars || 0), 0);
        return '<button class="world' + (unlocked ? '' : ' locked') + (done === LEVELS.length ? ' complete' : '') + '" ' +
          (unlocked ? 'data-act="g-world" data-topic="' + t.id + '"' : 'disabled') + '>' +
          '<span class="world-no">' + (i + 1) + '</span>' +
          '<span class="world-emoji">' + (unlocked ? t.emoji : '🔒') + '</span>' +
          '<span class="world-body"><b>' + es(t.name) + (t.big && unlocked ? ' <span class="badge sky big-only" title="mejor en pantalla grande">💻</span>' : '') + '</b><small>' + (unlocked ? es(t.sub) : 'Se abre al pasar el Nivel 1 del mundo anterior') + '</small>' +
          '<span class="bar"><i style="width:' + Math.round(done / LEVELS.length * 100) + '%"></i></span></span>' +
          '<span class="world-meta">' + done + '/' + LEVELS.length + '<br>⭐' + stars + '</span>' +
          '</button>';
      }).join('') + '</div>' + G.badgesHtml();
  };

  V.gameWorld = function (topic) {
    const t = MM.topic(topic);
    if (!t) return V.gameHome();
    const i = MM.topicIndex(topic) - 1;
    if (!G.worldUnlocked(i)) return V.gameHome();
    return '<div class="row between"><a class="btn sm ghost" href="#/juego">← Mundos</a>' +
      '<span class="badge">Mundo ' + (i + 1) + ' de ' + MM.TOPICS.length + '</span></div>' +
      '<h1>' + t.emoji + ' ' + es(t.name) + '</h1><p class="muted">' + es(t.sub) + '</p>' +
      '<div class="gpath">' + LEVELS.map((l, k) => {
        const st = lvlState(topic, l.n);
        const done = !!(st && st.done);
        const open = G.levelUnlocked(topic, l.n);
        const cls = 'gnode' + (done ? ' done' : (open ? ' open' : ' locked')) + (k % 2 ? ' right' : ' left');
        return '<div class="' + cls + '">' +
          '<button class="gnode-btn" ' + (open ? 'data-act="g-play" data-topic="' + topic + '" data-n="' + l.n + '"' : 'disabled') + '>' +
            '<span class="gnode-icon">' + (open ? l.icon : '🔒') + '</span></button>' +
          '<div class="gnode-txt"><b>' + l.title + '</b><small>' + l.sub + '</small>' +
            (done ? '<div>' + starsHtml(st.stars || 1) + ' <span class="muted">· mejor: ' + (st.best || 0) + ' pts</span></div>'
                  : '<div class="muted">hasta ' + l.pts + ' pts' + (l.kind === 'practice' || l.kind === 'boss' ? ' · ' + HEARTS + ' vidas' : '') + '</div>') +
          '</div></div>';
      }).join('') + '</div>';
  };

  /* --- jugar un nivel --- */
  V.gameLevel = function () {
    const run = G.run;
    if (!run) return V.gameHome();
    if (run.finished) return levelDoneHtml(run);
    if (run.failed) return levelFailedHtml(run);
    const t = MM.topic(run.topic);
    const head = '<div class="row between ghead">' +
      '<a class="btn sm ghost" href="#/juego/mundo/' + run.topic + '">✕</a>' +
      '<span class="muted">' + t.emoji + ' ' + es(t.name) + ' · ' + run.def.icon + ' ' + run.def.title + '</span>' +
      '<span class="badge green">+' + run.pts + '</span></div>';
    if (run.def.kind === 'lesson' && !run.quiz) return head + lessonPageHtml(run);
    if (run.def.kind === 'examples') return head + examplesHtml(run);
    return head + practiceHtml(run);
  };

  function lessonPageHtml(run) {
    const pg = run.pages[run.page];
    const n = run.pages.length;
    return '<div class="dots" style="margin:.5rem 0">' + run.pages.map((_, i) => '<i class="' + (i < run.page ? 'ok' : (i === run.page ? 'now' : '')) + '"></i>').join('') + '</div>' +
      '<div class="card gcard lesson"><h2>' + pg.title + '</h2>' + pg.html + '</div>' +
      '<div class="btn-row" style="margin-top:.8rem">' +
        (run.page > 0 ? '<button class="btn" data-act="g-page" data-d="-1">← Anterior</button>' : '') +
        (run.page < n - 1 ? '<button class="btn primary big" data-act="g-page" data-d="1">Siguiente →</button>'
                          : '<button class="btn accent big" data-act="g-finish-read">✅ ¡Entendido! (+' + (run.replay ? 0 : run.def.pts) + ' pts)</button>') +
      '</div>';
  }

  function examplesHtml(run) {
    const i = run.page, ex = run.examples[i], n = run.examples.length;
    return '<div class="dots" style="margin:.5rem 0">' + run.examples.map((_, k) => '<i class="' + (k < i ? 'ok' : (k === i ? 'now' : '')) + '"></i>').join('') + '</div>' +
      '<div class="card gcard">' +
        (ex.q ? '<div class="qtext">' + ex.q + '</div>' : '') +
        playerHtml(ex.q ? 'Solución paso a paso' : ex.title, ex.steps, { auto: true, speed: 2800 }) +
        (ex.answer ? '<div class="note key" style="margin-top:.6rem">Respuesta: ' + ex.answer + '</div>' : '') +
        '<p class="muted" style="margin:.6rem 0 0">Pulsa ⏭ si vas más rápido que el vídeo, o ⏮ para verlo otra vez.</p>' +
      '</div>' +
      '<div class="btn-row" style="margin-top:.8rem">' +
        (i > 0 ? '<button class="btn" data-act="g-page" data-d="-1">← Anterior</button>' : '') +
        (i < n - 1 ? '<button class="btn primary big" data-act="g-page" data-d="1">Siguiente ejemplo →</button>'
                   : '<button class="btn accent big" data-act="g-finish-read">✅ ¡Lo he visto! (+' + (run.replay ? 0 : run.def.pts) + ' pts)</button>') +
      '</div>';
  }

  function gameField(f, item) {
    const type = f.answerType || 'num';
    const res = item.results ? item.results[item.ex.fields.indexOf(f)] : null;
    const cls = res === null ? '' : (res ? 'ok' : 'bad');
    const label = f.label ? '<label for="ans-' + f.key + '">' + es(f.label) + '</label>' : '';
    if (type === 'choice' || type === 'bool' || type === 'cmp') {
      const letters = ['A', 'B', 'C', 'D', 'E'];
      return '<div class="field" style="align-items:flex-start"><div style="width:100%">' + label +
        '<div class="choices">' + f.choices.map((c, ci) => {
          const sel = item.given[f.key] === String(c.v);
          let k = '';
          if (item.checked) { if (String(c.v) === String(f.answer)) k = 'ok'; else if (sel) k = 'bad'; }
          const altLv = G.run && G.run.def && G.run.def.lv !== undefined ? (G.run.showAlt !== G.run.def.lv) : false;
          const txt = typeof c.t === 'string' ? c.t : (altLv ? lv(c.t) : es(c.t));
          return '<button class="choice ' + k + '" data-act="choice" data-key="' + f.key + '" data-val="' + esc(c.v) + '" aria-pressed="' + (sel ? 'true' : 'false') + '"' +
            (item.checked ? ' disabled' : '') + '><span class="k">' + (type === 'cmp' ? '' : letters[ci]) + '</span><span>' + txt + '</span></button>';
        }).join('') + '</div></div></div>';
    }
    return '<div class="field">' + label +
      '<input class="ans ' + cls + '" id="ans-' + f.key + '" data-key="' + f.key + '" type="text" inputmode="' + (MM.isTouch() ? 'none' : 'decimal') + '" aria-label="respuesta" ' +
      'autocomplete="off" autocorrect="off" spellcheck="false" value="' + esc(item.given[f.key] || '') + '"' + (item.checked ? ' disabled' : '') + ' placeholder="?">' +
      (f.unit ? '<span class="unit">' + es(f.unit) + '</span>' : '') + '</div>';
  }

  G.fieldHtml = gameField;

  const CHEER_OK = ['🎉 ¡Correcto!', '⭐ ¡Muy bien!', '🚀 ¡Eso es!', '💪 ¡Genial!', '🧠 ¡Perfecto!', '✨ ¡Brillante!'];
  const CHEER_BAD = ['💔 Casi. Mira cómo se hace paso a paso 👇', '🤔 Esta no. Fíjate en el vídeo y lo pillas 👇', '💡 No pasa nada: así se hace 👇', '👀 Mira el truco aquí abajo 👇'];

  function practiceHtml(run) {
    const s = MM.engine.session;
    const item = MM.engine.item();
    if (!s || !item) return '<p>…</p>';
    const ex = item.ex;
    const lvFirst = run.def.lv;                       // en niveles altos, primero en letón
    const showLv = lvFirst ? !run.showAlt : run.showAlt;
    const showEs = lvFirst ? run.showAlt : !run.showAlt;
    const done = item.checked || item.state === 'revealed';
    const okAll = item.results && item.results.every(Boolean) && item.state !== 'revealed';
    const dots = s.items.map((it, i) => '<i class="' + (i === s.idx ? 'now' : (it.state === 'ok' ? 'ok' : (it.state === 'pending' ? '' : 'bad'))) + '"></i>').join('');
    const ptsIf = ptsFor(item.ex, run);

    let feedback = '';
    if (done) {
      if (item.state === 'revealed' && !item.checked) feedback = '<div class="feedback neutral">👀 Solución mostrada' + (run.quiz ? '' : ' (cuesta una vida, no da puntos)') + '. ¡El siguiente lo haces tú!</div>';
      else if (okAll) feedback = '<div class="feedback ok">' + CHEER_OK[(s.idx + run.pts) % CHEER_OK.length] + ' +' + item.gained + ' puntos</div>';
      else feedback = '<div class="feedback bad">' + CHEER_BAD[(s.idx + item.seed) % CHEER_BAD.length] + '</div>';
    }
    const sol = done ? playerHtml('Solución paso a paso', ex.solution.map(es), { auto: !okAll, speed: 2600 }) +
      '<div class="note key" style="margin-top:.5rem">Respuesta correcta: ' + ex.fields.map(f => (f.label ? es(f.label) + ': ' : '') + MM.answerHtml(f)).join(' · ') + '</div>' : '';

    return '<div class="row between" style="margin:.4rem 0">' + (run.quiz ? '<span class="badge amber">📖 Comprobación rápida: ¿te has enterado?</span>' : heartsHtml(run.hearts)) + '<span class="badge">' + (s.idx + 1) + ' / ' + s.items.length + '</span></div>' +
      '<div class="dots" style="margin-bottom:.7rem">' + dots + '</div>' +
      '<div class="card gcard qcard">' +
        '<div class="muted" style="font-size:.8rem;padding-right:4rem">' + es(ex.typeName) + ' · vale <b>' + ptsIf + '</b> pts</div>' +
        (showLv ? '<div class="qtext qlv">🇱🇻 ' + lv(ex.q) + '</div>' : '') +
        (showEs ? '<div class="qtext">' + es(ex.q) + '</div>' : '') +
        '<button class="btn sm ghost" data-act="g-alt">' + (run.showAlt ? '↩ ocultar' : (lvFirst ? '🇪🇸 ¿Qué dice en español?' : '🇱🇻 ¿Cómo se pregunta en letón?')) + '</button>' +
        '<div class="answers" style="margin-top:.7rem">' + ex.fields.map(f => gameField(f, item)).join('') + '</div>' +
        (done ? '' : V._keypadHtml('g-check')) +
        (item.hintShown && !done ? '<div class="note tip" style="margin-top:.6rem">💡 ' + es(ex.hint || { es: 'Lee el enunciado otra vez, despacio.' }) + '</div>' : '') +
        feedback + sol +
        '<div class="btn-row" style="margin-top:.9rem">' +
          (done ? '<button class="btn primary big" data-act="g-next">' + (s.idx + 1 < s.items.length ? 'Siguiente →' : '🏁 Terminar') + '</button>'
                : '<button class="btn primary big" data-act="g-check">✓ Comprobar</button>' +
                  '<button class="btn" data-act="hint">💡 Pista</button>' +
                  '<button class="btn ghost" data-act="g-reveal" title="' + (run.quiz ? '' : 'Cuesta una vida') + '">👀 Ver solución</button>') +
        '</div>' +
      '</div>';
  }

  function ptsFor(ex, run) {
    if (run.quiz) return run.replay ? 2 : 5;
    const base = run.def.kind === 'boss' ? 20 : 10 + 5 * ((ex.level || 1) - 1);
    return run.replay ? Math.ceil(base / 2) : base;
  }

  function levelDoneHtml(run) {
    const t = MM.topic(run.topic);
    const next = G.nextLevel();
    const w = weekInfo();
    return '<div class="card center gdone">' +
      '<div style="font-size:3.2rem;line-height:1">' + (run.stars === 3 ? '🏆' : (run.stars === 2 ? '🎉' : '👏')) + '</div>' +
      '<h1>' + ['¡Nivel superado!', '¡Lo has clavado!', '¡Qué máquina!', '¡Así se hace!'][run.pts % 4] + '</h1>' +
      '<div>' + starsHtml(run.stars || 3) + '</div>' +
      '<div class="scorebig">+' + run.pts + '</div><p class="muted">puntos</p>' +
      (run.bonusNote ? '<p>' + run.bonusNote + '</p>' : '') +
      '<div class="goalbox" style="color:inherit"><div class="row between"><b>🎁 Semana</b><span>' + w.pts + ' / ' + w.goal + '</span></div>' +
        '<div class="bar big"><i style="width:' + Math.min(100, Math.round(w.pts / w.goal * 100)) + '%"></i></div></div>' +
      '<div class="btn-row" style="justify-content:center;margin-top:1rem">' +
        (next ? '<button class="btn accent big" data-act="g-play" data-topic="' + next.topic + '" data-n="' + next.n + '">▶ Siguiente nivel</button>' : '') +
        '<button class="btn" data-act="g-play" data-topic="' + run.topic + '" data-n="' + run.n + '">🔁 Repetir</button>' +
        '<button class="btn ghost" data-act="go" data-href="#/juego/mundo/' + run.topic + '">🗺️ ' + t.emoji + '</button>' +
      '</div></div>';
  }

  function levelFailedHtml(run) {
    return '<div class="card center gdone">' +
      '<div style="font-size:3.2rem;line-height:1">💪</div>' +
      '<h1>¡Casi!</h1><p>Se acabaron las vidas, pero te llevas <b>' + run.pts + ' puntos</b> de lo que hiciste bien. Mira las soluciones que te enseñó y prueba otra vez: los ejercicios serán nuevos.</p>' +
      '<div class="btn-row" style="justify-content:center;margin-top:1rem">' +
        '<button class="btn accent big" data-act="g-play" data-topic="' + run.topic + '" data-n="' + run.n + '">🔁 Otra vez</button>' +
        '<button class="btn ghost" data-act="go" data-href="#/tema/' + run.topic + '">📖 Releer la lección</button>' +
        '<button class="btn ghost" data-act="go" data-href="#/juego/mundo/' + run.topic + '">🗺️ Mapa</button>' +
      '</div></div>';
  }

  /* ---------------------------------------------------------
     Acciones del juego (las llama main.js)
     --------------------------------------------------------- */
  G.act = function (act, el) {
    const run = G.run;
    switch (act) {
      case 'g-world': location.hash = '#/juego/mundo/' + el.getAttribute('data-topic'); return true;
      case 'g-play': {
        const topic = el.getAttribute('data-topic'), n = Number(el.getAttribute('data-n'));
        if (G.start(topic, n)) location.hash = '#/juego/nivel/' + topic + '/' + n;
        MM.render();
        return true;
      }
      case 'g-page': {
        if (!run) return true;
        run.page = Math.max(0, run.page + Number(el.getAttribute('data-d')));
        MM.render(); global.scrollTo(0, 0);
        return true;
      }
      case 'g-finish-read': {
        if (!run) return true;
        if (run.def.kind === 'lesson' && !run.quiz) {
          /* dos preguntas fáciles: si solo pasa las páginas, no cuenta */
          const rng = MM.rng(Date.now() % 1e9);
          const defs = MM.gen.byTopic(run.topic).filter(d => d.level <= 1);
          const pool = defs.length >= 2 ? defs : MM.gen.byTopic(run.topic);
          const picks = rng.sample(pool, 2);
          MM.engine.start({ mode: 'game', topic: run.topic, items: picks.map(d => ({ gen: d.id, seed: rng.int(1, 999999) })), noPoints: true });
          run.quiz = true; run.hearts = 99;
          MM.render(); global.scrollTo(0, 0);
          return true;
        }
        const pts = run.replay ? 0 : run.def.pts;
        run.pts = pts; award(pts, 'juego');
        run.stars = 3;
        markDone(run.topic, run.n, 3, pts);
        run.finished = true;
        MM.confetti(); MM.beep('up');
        G.claimQuests(); G.checkBadges();
        MM.render();
        return true;
      }
      case 'g-alt': if (run) { run.showAlt = !run.showAlt; MM.render(); } return true;
      case 'g-check': {
        const item = MM.engine.item();
        if (!item || item.checked) return true;
        const vals = {};
        item.ex.fields.forEach(f => {
          const type = f.answerType || 'num';
          if (type === 'choice' || type === 'bool' || type === 'cmp') vals[f.key] = item.given[f.key] || '';
          else { const inp = document.querySelector('input.ans[data-key="' + f.key + '"]'); vals[f.key] = inp ? inp.value : ''; }
        });
        if (item.ex.fields.every(f => !String(vals[f.key] || '').trim())) { MM.toast('Escribe una respuesta 😊'); return true; }
        const res = MM.engine.check(vals);
        item.results = res.fields;
        if (res.ok) {
          const g = ptsFor(item.ex, run);
          item.gained = g; run.pts += g; award(g, 'juego');
          MM.beep('ok');
        } else {
          item.gained = 0; run.hearts--; MM.beep('bad');
        }
        MM.render();
        return true;
      }
      case 'g-reveal': {
        const item = MM.engine.item();
        if (!item || item.checked) return true;
        MM.engine.reveal(); run.hearts--;
        MM.render();
        return true;
      }
      case 'g-next': {
        if (!run) return true;
        run.showAlt = false;
        if (run.hearts <= 0) { run.failed = true; MM.render(); return true; }
        const more = MM.engine.next();
        if (!more) finishPractice(run);
        MM.render(); global.scrollTo(0, 0);
        return true;
      }
    }
    return false;
  };

  function finishPractice(run) {
    const s = MM.engine.session;
    if (run.quiz) {
      const pts = run.replay ? 0 : run.def.pts;
      run.pts += pts; award(pts, 'juego');
      run.stars = 3; run.bonusNote = pts ? '📖 Lección leída: +' + pts : '';
      markDone(run.topic, run.n, 3, run.pts);
      run.finished = true;
      MM.confetti(); MM.beep('up');
      G.claimQuests(); G.checkBadges();
      return;
    }
    const perfect = s.wrong === 0 && s.revealed === 0;
    let bonus = 0, note = [];
    if (perfect) { bonus += 25; note.push('✨ Sin fallos: +25'); }
    if (!run.replay) { bonus += run.def.pts; note.push('🎯 Primera vez: +' + run.def.pts); }
    run.pts += bonus; award(bonus, 'juego');
    run.stars = run.hearts >= 3 ? 3 : (run.hearts === 2 ? 2 : 1);
    run.bonusNote = note.join(' · ');
    markDone(run.topic, run.n, run.stars, run.pts);
    run.finished = true;
    MM.confetti(); MM.beep('up');
    G.claimQuests(); G.checkBadges();
  }

  /* ---------------------------------------------------------
     PANEL DE PADRES
     --------------------------------------------------------- */
  V.parents = function () {
    if (!G.parentOk) {
      return '<div class="card" style="max-width:420px;margin:2rem auto"><h1>👨‍👧 Panel de padres</h1>' +
        '<p class="muted">Introduce el PIN (el de fábrica es <b>1234</b>; cámbialo dentro).</p>' +
        '<div class="row"><input class="txt" id="pinInput" type="password" inputmode="numeric" maxlength="8" placeholder="PIN" style="width:120px;text-align:center;font-size:1.3rem">' +
        '<button class="btn primary" data-act="pin-ok">Entrar</button></div></div>';
    }
    const p = MM.store.p();
    const s = MM.store.settings;
    const thisMon = MM.weekStart();
    const weeks = [];
    for (let i = 0; i < 8; i++) weeks.push(MM.store.weekSummary(MM.addDays(thisMon, -7 * i)));
    const cur = weeks[0], prev = weeks[1];
    const delta = prev.pts ? Math.round((cur.pts - prev.pts) / prev.pts * 100) : null;
    const maxPts = Math.max(s.weeklyGoal || 1, ...weeks.map(w => w.pts));
    const fmtWeek = w => { const a = w.monday.slice(5).split('-'), b = w.end.slice(5).split('-'); return a[1] + '/' + a[0] + ' – ' + b[1] + '/' + b[0]; };

    /* gráfico de barras de 8 semanas (SVG) */
    const W = 520, H = 170, L = 36, B = 28, T = 10, pw = (W - L - 10) / 8;
    let svg = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="puntos por semana">';
    const gy = T + (H - B - T) - (Math.min(1, (s.weeklyGoal || 0) / maxPts)) * (H - B - T);
    svg += '<line x1="' + L + '" y1="' + gy.toFixed(1) + '" x2="' + (W - 10) + '" y2="' + gy.toFixed(1) + '" stroke="var(--amber)" stroke-dasharray="4 3" stroke-width="1.5"/>';
    svg += '<text x="' + (W - 12) + '" y="' + (gy - 4).toFixed(1) + '" text-anchor="end">objetivo ' + s.weeklyGoal + '</text>';
    weeks.slice().reverse().forEach((w, i) => {
      const h = (w.pts / maxPts) * (H - B - T);
      const x = L + i * pw + pw * 0.18;
      svg += '<rect class="barv" x="' + x.toFixed(1) + '" y="' + (T + (H - B - T) - h).toFixed(1) + '" width="' + (pw * 0.64).toFixed(1) + '" height="' + h.toFixed(1) + '" rx="4"' + (i === 7 ? ' fill="var(--amber)"' : '') + '/>';
      svg += '<text x="' + (x + pw * 0.32).toFixed(1) + '" y="' + (T + (H - B - T) - h - 4).toFixed(1) + '" text-anchor="middle">' + (w.pts || '') + '</text>';
      svg += '<text x="' + (x + pw * 0.32).toFixed(1) + '" y="' + (H - 10) + '" text-anchor="middle">' + w.monday.slice(5).split('-').reverse().join('/') + '</text>';
    });
    svg += '<line class="ax" x1="' + L + '" y1="' + (H - B) + '" x2="' + (W - 10) + '" y2="' + (H - B) + '"/></svg>';

    const hist = (p.game.history || []).filter(h => h.d >= thisMon).slice().reverse();
    const topicRows = MM.TOPICS.map(t => {
      const st = MM.store.topicStat(t.id);
      const done = G.worldProgress(t.id);
      return { t: t, st: st, done: done };
    });

    return '<div class="row between"><h1 style="margin:0">👨‍👧 Panel de padres</h1><span class="muted">' + p.avatar + ' ' + esc(p.name) + '</span></div>' +

      '<div class="grid cols-2">' +
        '<div class="card"><h3>📅 Esta semana (' + fmtWeek(cur) + ')</h3>' +
          '<div class="scorebig">' + cur.pts + ' <small class="muted" style="font-size:1rem">/ ' + s.weeklyGoal + ' pts</small></div>' +
          V._bar(Math.min(1, cur.pts / s.weeklyGoal)) +
          '<p style="margin-top:.5rem">' + (delta === null ? 'Sin semana anterior para comparar.' :
            (delta >= 0 ? '📈 <b>+' + delta + ' %</b>' : '📉 <b>' + delta + ' %</b>') + ' respecto a la semana pasada (' + prev.pts + ' pts)') + '</p>' +
          '<ul class="plain">' +
            '<li>🗓️ Días con actividad: <b>' + cur.days + '</b> / 7</li>' +
            '<li>✏️ Ejercicios respondidos: <b>' + cur.answered + '</b> · aciertos <b>' + (cur.answered ? Math.round(cur.correct / cur.answered * 100) : 0) + ' %</b></li>' +
            '<li>🎮 Niveles superados: <b>' + cur.levels + '</b></li>' +
            '<li>💎 De dónde salen: ' + Object.keys(cur.by).map(k => k + ' ' + cur.by[k]).join(' · ') + '</li>' +
          '</ul>' +
        '</div>' +
        '<div class="card"><h3>📊 Últimas 8 semanas</h3>' + svg + '</div>' +
      '</div>' +

      '<div class="card"><h3>🎁 Premio de esta semana</h3>' +
        '<p class="muted">Escribe aquí el premio prometido: ella lo verá en su portada junto a los puntos que le faltan.</p>' +
        '<input class="txt" style="width:min(360px,100%)" data-act="reward-note" data-week="' + thisMon + '" value="' + esc((p.rewards[thisMon] || {}).note || '') + '" placeholder="p. ej. ir al cine 🎬"></div>' +
      '<div class="card"><h3>🎁 Premios por semana</h3>' +
        '<p class="muted">Marca cuándo diste el premio y anota cuál fue. Así las dos veis el historial.</p>' +
        '<table class="t"><thead><tr><th>Semana</th><th>Puntos</th><th>Objetivo</th><th>Días</th><th>Niveles</th><th>Premio dado</th><th>Nota</th></tr></thead><tbody>' +
        weeks.map(w => {
          const r = w.reward || {};
          return '<tr><td>' + fmtWeek(w) + (w.monday === thisMon ? ' <span class="badge amber">ahora</span>' : '') + '</td><td><b>' + w.pts + '</b></td>' +
            '<td>' + (w.pts >= s.weeklyGoal ? '✅' : Math.round(w.pts / s.weeklyGoal * 100) + ' %') + '</td><td>' + w.days + '</td><td>' + w.levels + '</td>' +
            '<td><input type="checkbox" data-act="reward-given" data-week="' + w.monday + '"' + (r.given ? ' checked' : '') + '></td>' +
            '<td><input class="txt" style="width:140px;padding:.25rem .4rem" data-act="reward-note" data-week="' + w.monday + '" value="' + esc(r.note || '') + '" placeholder="p. ej. helado 🍦"></td></tr>';
        }).join('') + '</tbody></table></div>' +

      '<div class="grid cols-2">' +
        '<div class="card"><h3>🏁 Lo que ha hecho esta semana</h3>' +
          (hist.length ? '<ul class="plain">' + hist.slice(0, 25).map(h => {
            const t = MM.topic(h.topic), l = LEVELS.find(x => x.n === h.n);
            return '<li class="row between"><span>' + h.d.slice(5) + ' · ' + t.emoji + ' ' + es(t.name) + ' · ' + l.icon + ' ' + l.title + '</span><span>' + starsHtml(h.stars) + ' +' + h.pts + '</span></li>';
          }).join('') + '</ul>' : '<p class="muted">Todavía nada esta semana.</p>') +
        '</div>' +
        '<div class="card"><h3>🧠 Dominio por tema</h3>' +
          topicRows.map(r => '<div class="row between" style="font-size:.86rem;margin:.25rem 0"><span>' + r.t.emoji + ' ' + es(r.t.name) + '</span>' +
            '<span class="muted">juego ' + r.done + '/6 · ' + (r.st.att ? Math.round(r.st.ok / r.st.att * 100) + ' % de ' + r.st.att : '—') + '</span></div>' + V._bar(MM.store.mastery(r.t.id))).join('') +
        '</div>' +
      '</div>' +

      '<div class="card"><h3>⚙️ Ajustes del juego</h3>' +
        '<div class="field"><label>Objetivo semanal (puntos)</label><input class="txt" type="number" min="50" step="10" value="' + s.weeklyGoal + '" data-act="set" data-key="weeklyGoal" style="width:110px"></div>' +
        '<div class="field"><label>Objetivo diario (puntos)</label><input class="txt" type="number" min="10" step="10" value="' + s.dailyGoal + '" data-act="set" data-key="dailyGoal" style="width:110px"></div>' +
        '<div class="field"><label>Mundos libres (sin bloqueos)</label><input type="checkbox" data-act="set-check" data-key="freeRoam"' + (s.freeRoam ? ' checked' : '') + ' style="width:22px;height:22px"></div>' +
        '<div class="field"><label>Cambiar PIN</label><input class="txt" type="text" inputmode="numeric" maxlength="8" value="' + esc(s.parentPin) + '" data-act="set" data-key="parentPin" style="width:110px"></div>' +
        '<p class="muted" style="margin-top:.6rem">Cómo se ganan los puntos: ejercicio bien en el juego 10–20 (jefe 20), nivel sin fallos +25, primera vez que se supera un nivel +50/60/70 (jefe +100), lección +20, ejemplos +15. Repetir un nivel da la mitad. La práctica libre y el reto del día también suman.</p>' +
        '<div class="btn-row"><button class="btn" data-act="go" data-href="#/progreso">📈 Progreso detallado</button>' +
        '<button class="btn" data-act="go" data-href="#/ajustes">💾 Copia de seguridad</button>' +
        '<button class="btn ghost" data-act="pin-lock">🔒 Salir del panel</button></div>' +
      '</div>';
  };

})(typeof window !== 'undefined' ? window : globalThis);
