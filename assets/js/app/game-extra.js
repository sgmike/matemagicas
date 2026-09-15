/* =========================================================
   MODO JUEGO · extras que enganchan
   - mascota con mensajes según el momento
   - misiones diarias (3 al día, con bonus)
   - logros / insignias
   - modo relámpago (60 segundos, récord)
   ========================================================= */
(function (global) {
  'use strict';
  const MM = global.MM, V = MM.views, G = MM.game, esc = MM.esc;
  const es = t => (t && typeof t === 'object') ? t.es : (t || '');

  /* ---------------------------------------------------------
     Mascota: Pī el búho
     --------------------------------------------------------- */
  G.MASCOT = '🦉';
  G.mascotMsg = function () {
    const p = MM.store.p();
    const w = G.weekInfo();
    const r = p.rewards[w.mon] || {};
    const next = G.nextLevel();
    const hour = new Date().getHours();
    const rng = MM.rng('pi-' + MM.today() + '-' + Math.floor(Date.now() / 600000));
    const msgs = [];
    if (w.today === 0) {
      msgs.push(hour < 12 ? '¡Buenos días! Un nivel cortito y ya tienes la racha de hoy. 🔥' : '¡Hola! Todavía no has jugado hoy. ¿Un nivel rápido? 🔥');
      if (p.streak.days >= 2) msgs.push('Llevas ' + p.streak.days + ' días seguidos. ¡No rompas la racha hoy! 🔥');
    } else if (w.today < w.dailyGoal) {
      msgs.push('Hoy llevas ' + w.today + ' puntos. Te faltan ' + (w.dailyGoal - w.today) + ' para el objetivo del día. 💪');
    } else {
      msgs.push('¡Objetivo del día conseguido! 🎉 Todo lo que hagas ahora es extra.');
    }
    if (w.pts >= w.goal) msgs.push('¡El premio de la semana ya es tuyo! 🎁 ¿Vamos a por el récord?');
    else if (r.note) msgs.push('Por el premio de la semana (' + esc(r.note) + ') te faltan ' + (w.goal - w.pts) + ' puntos. 🎁');
    if (next) {
      const t = MM.topic(next.topic), l = G.LEVELS.find(x => x.n === next.n);
      msgs.push('Te espera ' + t.emoji + ' ' + es(t.name) + ' · ' + l.icon + ' ' + l.title + '. ¡Tú puedes!');
    }
    const tips = [
      'Truco: escribe siempre los pasos en papel, aunque aquí solo pongas el resultado.',
      'Si fallas, mira el vídeo de la solución despacio: ahí está el truco.',
      'El modo relámpago ⚡ es genial para practicar rapidez, como en la Parte A del examen.',
      'Las palabras en letón al final de cada lección son las que salen en el examen.',
      '¿Sabías que dividir entre 0,1 es lo mismo que multiplicar por 10?',
      'Un jefe 👑 vencido sin fallos vale más que tres niveles fáciles.'
    ];
    msgs.push(rng.pick(tips));
    return rng.pick(msgs.slice(0, 2)) + (rng.chance(0.4) ? '<br><small>' + rng.pick(tips) + '</small>' : '');
  };

  /* ---------------------------------------------------------
     Misiones diarias
     --------------------------------------------------------- */
  const QUEST_BONUS = 20, ALL_BONUS = 30;
  function questDefs() {
    const p = MM.store.p();
    const today = MM.today();
    const pts = p.points[today] || {};
    const day = p.daily[today] || { a: 0, c: 0 };
    const hist = (p.game.history || []).filter(h => h.d === today);
    const goal = MM.store.settings.dailyGoal || 60;
    const anyLv5 = MM.TOPICS.some(t => (p.game.levels[t.id + ':5'] || {}).done);
    const defs = [
      { id: 'pts', icon: '💎', title: 'Gana ' + goal + ' puntos hoy', target: goal, prog: pts.t || 0, href: '#/' },
      { id: 'levels', icon: '⭐', title: 'Supera 1 nivel del juego', target: 1, prog: hist.length, href: '#/' },
      { id: 'correct', icon: '✅', title: 'Acierta 8 ejercicios', target: 8, prog: day.c, href: '#/' },
      { id: 'reto', icon: '⚡', title: 'Haz el reto del día', target: 1, prog: (pts.reto || 0) > 0 ? 1 : 0, href: '#/reto' },
      { id: 'flash', icon: '🔥', title: 'Juega una partida relámpago', target: 1, prog: (p.flash.lastDay === today) ? 1 : 0, href: '#/juego/relampago' },
      { id: 'lesson', icon: '📖', title: 'Lee una lección nueva', target: 1, prog: hist.filter(h => h.n === 1).length, href: '#/' }
    ];
    if ((p.mistakes || []).length >= 2 || (day.fixed || 0) > 0) defs.push({ id: 'repaso', icon: '🧾', title: 'Corrige 2 errores del cuaderno', target: 2, prog: day.fixed || 0, href: '#/repaso' });
    if (anyLv5) defs.push({ id: 'boss', icon: '👑', title: 'Vence a un jefe', target: 1, prog: hist.filter(h => h.n === 6).length, href: '#/' });
    return defs;
  }
  G.quests = function () {
    const defs = questDefs();
    const rng = MM.rng('misiones-' + MM.today() + '-' + MM.store.p().id);
    const pick = rng.sample(defs, 3);
    const claimed = MM.store.p().quests[MM.today()] || [];
    return pick.map(q => Object.assign({}, q, { done: q.prog >= q.target, claimed: claimed.includes(q.id), allClaimed: claimed.includes('all') }));
  };
  /** cobra las misiones recién completadas; devuelve cuántos puntos dio */
  G.claimQuests = function () {
    const p = MM.store.p();
    const today = MM.today();
    const claimed = p.quests[today] || (p.quests[today] = []);
    let gained = 0;
    const qs = G.quests();
    qs.forEach(q => {
      if (q.done && !claimed.includes(q.id)) { claimed.push(q.id); MM.store.addPoints(QUEST_BONUS, 'misiones'); gained += QUEST_BONUS; MM.toast('🎯 Misión completada: ' + q.title + ' (+' + QUEST_BONUS + ')', 2600); }
    });
    if (qs.every(q => q.done) && !claimed.includes('all')) {
      claimed.push('all'); MM.store.addPoints(ALL_BONUS, 'misiones'); gained += ALL_BONUS;
      MM.toast('🏆 ¡Las 3 misiones de hoy! +' + ALL_BONUS, 3000); MM.confetti();
    }
    MM.store.save();
    return gained;
  };
  G.questsHtml = function () {
    const qs = G.quests();
    const all = qs.every(q => q.done);
    return '<div class="card"><div class="row between"><h2 style="margin:0">🎯 Misiones de hoy</h2>' +
      '<span class="badge ' + (all ? 'green' : '') + '">' + qs.filter(q => q.done).length + ' / 3' + (all ? ' ✓' : '') + '</span></div>' +
      '<ul class="plain quests">' + qs.map(q =>
        '<li class="' + (q.done ? 'done' : '') + '"><span class="q-icon">' + q.icon + '</span>' +
        '<span class="q-body"><b>' + q.title + '</b>' +
          '<span class="bar"><i style="width:' + Math.min(100, Math.round(q.prog / q.target * 100)) + '%"></i></span></span>' +
        '<span class="q-right">' + (q.done ? '✅ +' + QUEST_BONUS : Math.min(q.prog, q.target) + '/' + q.target) +
          (q.done || q.href === '#/' ? '' : '<br><button class="btn sm" data-act="go" data-href="' + q.href + '">Ir</button>') + '</span></li>').join('') +
      '</ul>' + (all ? '' : '<p class="muted" style="margin:.4rem 0 0">Las 3 juntas dan +' + ALL_BONUS + ' extra.</p>') + '</div>';
  };

  /* ---------------------------------------------------------
     Logros
     --------------------------------------------------------- */
  const BADGES = [
    { id: 'first', icon: '🌱', name: 'Primer nivel', desc: 'Supera tu primer nivel', pts: 20, test: p => p.game.history.length >= 1 },
    { id: 'lesson5', icon: '📚', name: 'Lectora', desc: 'Lee 5 lecciones', pts: 30, test: p => MM.TOPICS.filter(t => (p.game.levels[t.id + ':1'] || {}).done).length >= 5 },
    { id: 'perfect', icon: '✨', name: 'Sin fallos', desc: 'Un nivel de ejercicios con 3 estrellas', pts: 20, test: p => p.game.history.some(h => h.n >= 3 && h.stars === 3) },
    { id: 'boss1', icon: '👑', name: 'Cazajefes', desc: 'Vence a tu primer jefe', pts: 50, test: p => p.game.history.some(h => h.n === 6) },
    { id: 'lv', icon: '🇱🇻', name: 'Latviski!', desc: 'Supera un nivel con enunciados en letón', pts: 40, test: p => p.game.history.some(h => h.n === 5) },
    { id: 'streak3', icon: '🔥', name: '3 días seguidos', desc: 'Juega tres días seguidos', pts: 30, test: p => (p.streak.best || 0) >= 3 },
    { id: 'streak7', icon: '🔥🔥', name: 'Semana entera', desc: 'Siete días seguidos', pts: 100, test: p => (p.streak.best || 0) >= 7 },
    { id: 'streak30', icon: '🏅', name: 'Un mes seguido', desc: 'Treinta días seguidos', pts: 300, test: p => (p.streak.best || 0) >= 30 },
    { id: 'pts500', icon: '💎', name: '500 puntos', desc: 'Suma 500 puntos en total', pts: 25, test: () => MM.store.pointsTotal() >= 500 },
    { id: 'pts2000', icon: '💠', name: '2000 puntos', desc: 'Suma 2000 puntos en total', pts: 60, test: () => MM.store.pointsTotal() >= 2000 },
    { id: 'pts5000', icon: '🏆', name: '5000 puntos', desc: 'Suma 5000 puntos en total', pts: 150, test: () => MM.store.pointsTotal() >= 5000 },
    { id: 'stars15', icon: '⭐', name: '15 estrellas', desc: 'Reúne 15 estrellas en el mapa', pts: 50, test: p => totalStars(p) >= 15 },
    { id: 'stars45', icon: '🌟', name: '45 estrellas', desc: 'Reúne 45 estrellas en el mapa', pts: 150, test: p => totalStars(p) >= 45 },
    { id: 'world', icon: '🗺️', name: 'Mundo completo', desc: 'Termina los 6 niveles de un mundo', pts: 80, test: () => MM.TOPICS.some(t => G.worldProgress(t.id) === 6) },
    { id: 'worlds5', icon: '🌍', name: 'Cinco mundos', desc: 'Completa cinco mundos', pts: 250, test: () => MM.TOPICS.filter(t => G.worldProgress(t.id) === 6).length >= 5 },
    { id: 'flash20', icon: '⚡', name: 'Rayo', desc: '20 aciertos en una partida relámpago', pts: 40, test: p => (p.flash.best || 0) >= 20 },
    { id: 'fixer', icon: '🧾', name: 'Detective', desc: 'Corrige 10 errores del cuaderno', pts: 40, test: p => Object.values(p.daily).reduce((a, d) => a + (d.fixed || 0), 0) >= 10 },
    { id: 'quests5', icon: '🎯', name: 'Misionera', desc: 'Completa las 3 misiones en 5 días distintos', pts: 60, test: p => Object.values(p.quests).filter(q => q.includes('all')).length >= 5 },
    { id: 'exam', icon: '📝', name: 'Simulacro', desc: 'Haz un simulacro completo', pts: 60, test: p => (p.exams || []).length >= 1 }
  ];
  function totalStars(p) {
    let s = 0; Object.values(p.game.levels || {}).forEach(l => { s += l.stars || 0; }); return s;
  }
  G.BADGES = BADGES;
  G.checkBadges = function () {
    const p = MM.store.p();
    const won = [];
    BADGES.forEach(b => {
      if (p.badges[b.id]) return;
      let ok = false;
      try { ok = !!b.test(p); } catch (e) { ok = false; }
      if (ok) { p.badges[b.id] = MM.today(); MM.store.addPoints(b.pts, 'logros'); won.push(b); }
    });
    if (won.length) {
      MM.store.save();
      MM.toast('🏅 ¡Logro! ' + won.map(b => b.icon + ' ' + b.name + ' (+' + b.pts + ')').join(' · '), 3200);
      MM.confetti(); MM.beep('up');
    }
    return won;
  };
  G.badgesHtml = function () {
    const p = MM.store.p();
    const got = BADGES.filter(b => p.badges[b.id]).length;
    return '<div class="card"><div class="row between"><h2 style="margin:0">🏅 Logros</h2><span class="badge">' + got + ' / ' + BADGES.length + '</span></div>' +
      '<div class="badges">' + BADGES.map(b => {
        const on = !!p.badges[b.id];
        return '<div class="bdg' + (on ? ' on' : '') + '" title="' + esc(b.desc) + (on ? ' · ' + p.badges[b.id] : '') + '">' +
          '<span class="bdg-icon">' + (on ? b.icon : '🔒') + '</span><b>' + b.name + '</b><small>' + (on ? '+' + b.pts : b.desc) + '</small></div>';
      }).join('') + '</div></div>';
  };

  /* ---------------------------------------------------------
     Modo relámpago: 60 segundos
     --------------------------------------------------------- */
  const FLASH_SECONDS = 60;
  G.flash = null;
  let flashTimer = null;

  G.flashStart = function () {
    const p = MM.store.p();
    const rng = MM.rng(Date.now() % 1e9);
    const unlockedTopics = MM.TOPICS.filter((t, i) => G.worldUnlocked(i)).map(t => t.id);
    let defs = MM.gen.all().filter(d => d.part === 'A' && d.level <= 2 && unlockedTopics.includes(d.topic));
    if (defs.length < 6) defs = MM.gen.all().filter(d => d.part === 'A' && d.level <= 2);
    const items = [];
    for (let i = 0; i < 40; i++) items.push({ gen: rng.pick(defs).id, seed: rng.int(1, 999999) });
    MM.engine.start({ mode: 'flash', items: items, noPoints: true });
    G.flash = { started: Date.now(), score: 0, answered: 0, ended: false, best: p.flash.best || 0, awarded: 0, newBest: false, last: null };
    clearInterval(flashTimer);
    flashTimer = setInterval(() => {
      const el = document.getElementById('flashTimer');
      const left = G.flashLeft();
      if (el) { el.textContent = '⏱️ ' + left + ' s'; el.classList.toggle('warn', left <= 10); }
      if (left <= 0) G.flashEnd();
    }, 250);
  };
  G.flashLeft = function () { return G.flash ? Math.max(0, Math.ceil(FLASH_SECONDS - (Date.now() - G.flash.started) / 1000)) : 0; };
  G.flashEnd = function () {
    const f = G.flash;
    if (!f || f.ended) return;
    clearInterval(flashTimer); flashTimer = null;
    f.ended = true;
    const p = MM.store.p();
    p.flash.games = (p.flash.games || 0) + 1;
    p.flash.lastDay = MM.today();
    f.newBest = f.score > (p.flash.best || 0);
    if (f.newBest) p.flash.best = f.score;
    f.awarded = f.score * 5 + (f.newBest && f.score >= 5 ? 25 : 0);
    MM.store.save();
    MM.store.addPoints(f.awarded, 'relampago');
    if (f.newBest && f.score >= 5) { MM.confetti(); MM.beep('up'); }
    G.claimQuests(); G.checkBadges();
    MM.render();
  };

  V.gameFlash = function () {
    const p = MM.store.p();
    const f = G.flash;
    if (!f) {
      return '<div class="card center gdone">' +
        '<div style="font-size:3rem;line-height:1">⚡</div><h1>Modo relámpago</h1>' +
        '<p>60 segundos. Todos los ejercicios fáciles que puedas. <b>Cada acierto vale 5 puntos</b>, fallar no resta. Si superas tu récord, +25.</p>' +
        '<p class="muted">Tu récord: <b>' + (p.flash.best || 0) + '</b> aciertos · partidas: ' + (p.flash.games || 0) + '</p>' +
        '<div class="btn-row" style="justify-content:center"><button class="btn accent big" data-act="g-flash-start">▶ ¡Empezar!</button>' +
        '<button class="btn ghost" data-act="go" data-href="#/">← Volver</button></div></div>';
    }
    if (f.ended) {
      return '<div class="card center gdone">' +
        '<div style="font-size:3rem;line-height:1">' + (f.newBest ? '🏆' : '⚡') + '</div>' +
        '<h1>' + (f.newBest ? '¡Nuevo récord!' : '¡Tiempo!') + '</h1>' +
        '<div class="scorebig">' + f.score + '</div><p class="muted">aciertos de ' + f.answered + ' · récord: ' + p.flash.best + '</p>' +
        '<p><b>+' + f.awarded + ' puntos</b></p>' +
        '<div class="btn-row" style="justify-content:center"><button class="btn accent big" data-act="g-flash-start">🔁 Otra vez</button>' +
        '<button class="btn ghost" data-act="go" data-href="#/">🏠</button></div></div>';
    }
    const item = MM.engine.item();
    if (!item) { G.flashEnd(); return ''; }
    const ex = item.ex;
    return '<div class="row between" style="margin:.4rem 0">' +
        '<span class="exam-timer" id="flashTimer">⏱️ ' + G.flashLeft() + ' s</span>' +
        '<span class="badge green" style="font-size:1rem">✅ ' + f.score + '</span>' +
        '<a class="btn sm ghost" href="#/">✕</a></div>' +
      (f.last ? '<div class="feedback ' + (f.last.ok ? 'ok' : 'bad') + '" style="margin:.3rem 0">' + (f.last.ok ? '🎉 ¡Bien!' : '✗ Era ' + f.last.ans) + '</div>' : '') +
      '<div class="card gcard qcard">' +
        '<div class="qtext">' + es(ex.q) + '</div>' +
        '<div class="answers">' + ex.fields.map(fl => G.fieldHtml(fl, item)).join('') + '</div>' +
        V._keypadHtml('g-flash-check') +
        '<div class="btn-row" style="margin-top:.8rem"><button class="btn primary big" data-act="g-flash-check">✓ Comprobar</button>' +
        '<button class="btn ghost" data-act="g-flash-skip">Saltar →</button></div>' +
      '</div>';
  };

  function flashAdvance(ok, item) {
    const f = G.flash;
    f.answered++;
    if (ok) { f.score++; MM.beep('ok'); } else MM.beep('bad');
    f.last = { ok: ok, ans: item.ex.fields.map(fl => MM.answerHtml(fl)).join(' · ') };
    MM.engine.next();
    if (MM.engine.done()) G.flashEnd(); else MM.render();
  }

  /* acciones extra: se encadenan con las del juego */
  const baseAct = G.act;
  G.act = function (act, el) {
    switch (act) {
      case 'g-flash-start': G.flashStart(); location.hash = '#/juego/relampago'; MM.render(); return true;
      case 'g-flash-check': {
        const item = MM.engine.item();
        if (!item || !G.flash || G.flash.ended) return true;
        const vals = {};
        item.ex.fields.forEach(fl => {
          const type = fl.answerType || 'num';
          if (type === 'choice' || type === 'bool' || type === 'cmp') vals[fl.key] = item.given[fl.key] || '';
          else { const inp = document.querySelector('input.ans[data-key="' + fl.key + '"]'); vals[fl.key] = inp ? inp.value : ''; }
        });
        if (item.ex.fields.every(fl => !String(vals[fl.key] || '').trim())) { MM.toast('Escribe algo o pulsa Saltar'); return true; }
        const res = MM.engine.check(vals);
        flashAdvance(res.ok, item);
        return true;
      }
      case 'g-flash-skip': {
        const item = MM.engine.item();
        if (!item || !G.flash || G.flash.ended) return true;
        flashAdvance(false, item);
        return true;
      }
    }
    return baseAct(act, el);
  };
  G.flashStop = function () { clearInterval(flashTimer); flashTimer = null; G.flash = null; };

})(typeof window !== 'undefined' ? window : globalThis);
