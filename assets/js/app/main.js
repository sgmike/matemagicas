/* =========================================================
   Arranque, rutas y eventos
   ========================================================= */
(function (global) {
  'use strict';
  const MM = global.MM, T = MM.T, UI = MM.UI, V = MM.views;
  const doc = document;
  const main = doc.getElementById('main');
  let route = { name: '/', arg: null };
  let lastInput = null;
  let examTimer = null;

  /* ---------------------------------------------------------
     Rutas
     --------------------------------------------------------- */
  function parseHash() {
    const h = (location.hash || '#/').slice(1);
    const parts = h.split('/').filter(Boolean);
    return { name: '/' + (parts[0] || ''), arg: parts[1] || null, sub: parts[2] || null };
  }

  function viewHtml() {
    switch (route.name) {
      case '/': return V.home();
      case '/temas': return V.topics();
      case '/tema': return V.topic(route.arg);
      case '/practica': return V.practice();
      case '/reto': return V.practice();
      case '/repaso': return V.practice();
      case '/errores': return V.mistakes();
      case '/examen':
        if (route.arg === 'hacer' && MM.exam.state && !MM.exam.state.finished) return V.examRun();
        if (route.arg === 'resultado' && MM.exam.state && MM.exam.state.result) return V.examResults();
        return V.exam();
      case '/plan': return V.plan();
      case '/glosario': return V.glossary();
      case '/progreso': return V.progress();
      case '/ajustes': return V.settings();
      default: return V.home();
    }
  }

  /** al entrar en una ruta: preparar sesiones */
  function onEnter(prev) {
    const same = prev && prev.name === route.name && prev.arg === route.arg;
    if (route.name === '/practica' && !same) {
      if (!MM.topic(route.arg)) { location.hash = '#/temas'; return; }
      MM.engine.start({ mode: 'topic', topic: route.arg, duo: MM.store.settings.duo });
    }
    if (route.name === '/reto' && !same) startDaily();
    if (route.name === '/repaso' && !same) startMistakes();
    if (route.name === '/examen' && route.arg === 'hacer' && !MM.exam.state) { location.hash = '#/examen'; return; }
  }

  function startDaily() {
    const p = MM.store.p();
    const today = MM.today();
    if (!p.dailyItems || p.dailyItems.date !== today) {
      const rng = MM.rng('reto-' + today + '-' + p.id);
      const gens = MM.engine.chooseMixed(10, rng);
      p.dailyItems = { date: today, items: gens.map(g => ({ gen: g, seed: rng.int(1, 999999) })) };
      MM.store.save();
    }
    MM.engine.start({
      mode: 'daily', items: p.dailyItems.items,
      duo: MM.store.settings.duo, title: UI.dailyTitle
    });
  }

  function startMistakes() {
    const p = MM.store.p();
    const items = (p.mistakes || []).slice(0, MM.store.settings.sessionLen || 10)
      .map(m => ({ gen: m.gen, seed: m.seed }));
    if (!items.length) { location.hash = '#/errores'; return; }
    MM.engine.start({ mode: 'mistakes', items: items, duo: MM.store.settings.duo });
  }

  function render() {
    main.innerHTML = viewHtml();
    doc.querySelectorAll('.mainnav a').forEach(a => {
      const on = a.getAttribute('data-nav') === route.name;
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    updateProfileChip();
    if (route.name === '/examen' && route.arg === 'hacer') startExamTimer(); else stopExamTimer();
    const first = main.querySelector('input.ans:not([disabled])');
    if (first && (route.name === '/practica' || route.name === '/reto' || route.name === '/repaso')) first.focus();
  }
  MM.render = render;

  function navigate() {
    const prev = route;
    route = parseHash();
    onEnter(prev);
    render();
    global.scrollTo({ top: 0, behavior: 'instant' in global ? 'instant' : 'auto' });
  }

  /* ---------------------------------------------------------
     Cabecera: idioma, tema visual, perfil
     --------------------------------------------------------- */
  function applyLang(l) {
    doc.documentElement.setAttribute('data-lang', l);
    doc.documentElement.setAttribute('lang', l === 'lv' ? 'lv' : 'es');
    doc.querySelectorAll('[data-lang-btn]').forEach(b =>
      b.setAttribute('aria-pressed', b.getAttribute('data-lang-btn') === l ? 'true' : 'false'));
    MM.store.set('lang', l);
  }
  function applyTheme(t) {
    doc.documentElement.setAttribute('data-theme', t);
    MM.store.set('theme', t);
  }
  function updateProfileChip() {
    const p = MM.store.p();
    doc.getElementById('profileAvatar').textContent = p.avatar;
    doc.getElementById('profileName').textContent = p.name;
    doc.getElementById('profileXp').textContent = p.xp + ' XP · ' + MM.txt(UI.level) + ' ' + MM.store.level();
  }

  /* ---------------------------------------------------------
     Práctica: leer respuestas y actuar
     --------------------------------------------------------- */
  function readValues() {
    const item = MM.engine.item();
    if (!item) return {};
    const vals = {};
    item.ex.fields.forEach(f => {
      const type = f.answerType || 'num';
      if (type === 'choice' || type === 'bool' || type === 'cmp') vals[f.key] = item.given[f.key] || '';
      else {
        const el = main.querySelector('input.ans[data-key="' + f.key + '"]');
        vals[f.key] = el ? el.value : '';
      }
    });
    return vals;
  }

  function doCheck() {
    const item = MM.engine.item();
    if (!item || item.checked) return;
    const vals = readValues();
    const empty = item.ex.fields.every(f => !String(vals[f.key] || '').trim());
    if (empty) { MM.toast(T('Escribe una respuesta (o pulsa “Ver solución”).', 'Ieraksti atbildi (vai spied “Rādīt risinājumu”).')); return; }
    const res = MM.engine.check(vals);
    item.results = res.fields;
    MM.beep(res.ok ? 'ok' : 'bad');
    if (res.ok) {
      const s = MM.engine.session;
      const streak = s.items.slice(0, s.idx + 1).filter(i => i.state === 'ok').length;
      if (streak > 0 && streak % 5 === 0) MM.confetti();
    }
    if (res.levelUp) {
      MM.confetti(); MM.beep('up');
      MM.toast('🎉 ' + MM.txt(UI.level) + ' ' + res.levelUp + '!', 2600);
    }
    render();
  }

  function doNext() {
    const more = MM.engine.next();
    render();
    if (!more) {
      const sum = MM.engine.summary();
      if (sum.correct === sum.total && sum.total > 2) MM.confetti();
    }
  }

  /* ---------------------------------------------------------
     Examen
     --------------------------------------------------------- */
  function startExamTimer() {
    stopExamTimer();
    examTimer = setInterval(() => {
      const el = doc.getElementById('examTimer');
      if (!el || !MM.exam.state) return stopExamTimer();
      const ms = MM.exam.remainingMs();
      const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000);
      el.textContent = '⏳ ' + m + ':' + String(s).padStart(2, '0');
      el.classList.toggle('warn', ms < 10 * 60000);
      if (ms <= 0) { stopExamTimer(); submitExam(true); }
    }, 1000);
  }
  function stopExamTimer() { if (examTimer) { clearInterval(examTimer); examTimer = null; } }

  function submitExam(auto) {
    if (!MM.exam.state || MM.exam.state.finished) return;
    if (!auto && !confirm(MM.txt(UI.examConfirm))) return;
    stopExamTimer();
    MM.exam.grade();
    location.hash = '#/examen/resultado';
    MM.confetti();
  }

  /* ---------------------------------------------------------
     Eventos globales
     --------------------------------------------------------- */
  doc.addEventListener('click', ev => {
    const langBtn = ev.target.closest('[data-lang-btn]');
    if (langBtn) { applyLang(langBtn.getAttribute('data-lang-btn')); return; }

    if (ev.target.closest('#themeBtn')) {
      const cur = doc.documentElement.getAttribute('data-theme');
      applyTheme(cur === 'auto' ? 'light' : (cur === 'light' ? 'dark' : 'auto'));
      MM.toast({ auto: T('Tema: automático', 'Tēma: automātiska'), light: T('Tema: claro', 'Tēma: gaiša'), dark: T('Tema: oscuro', 'Tēma: tumša') }[doc.documentElement.getAttribute('data-theme')]);
      return;
    }
    if (ev.target.closest('#profileBtn')) { location.hash = '#/ajustes'; return; }

    const el = ev.target.closest('[data-act]');
    if (!el) return;
    const act = el.getAttribute('data-act');

    switch (act) {
      case 'go': location.hash = el.getAttribute('data-href'); break;

      /* práctica */
      case 'check': doCheck(); break;
      case 'next': doNext(); break;
      case 'reveal': MM.engine.reveal(); render(); break;
      case 'hint': { const it = MM.engine.item(); if (it) { it.hintShown = !it.hintShown; render(); } break; }
      case 'reroll': MM.engine.reroll(); render(); break;
      case 'choice': {
        const it = MM.engine.item();
        if (!it || it.checked) break;
        it.given[el.getAttribute('data-key')] = el.getAttribute('data-val');
        render();
        break;
      }
      case 'key': {
        const k = el.getAttribute('data-k');
        const input = lastInput && doc.contains(lastInput) && !lastInput.disabled
          ? lastInput : main.querySelector('input.ans:not([disabled])');
        if (!input) break;
        if (k === '⌫') input.value = input.value.slice(0, -1);
        else input.value += (k === '␣' ? ' ' : k);
        input.focus();
        break;
      }
      case 'again': {
        const s = MM.engine.session;
        if (s.mode === 'topic') MM.engine.start({ mode: 'topic', topic: s.topic, duo: MM.store.settings.duo });
        else if (s.mode === 'mistakes') startMistakes();
        else MM.engine.start({ mode: 'mixed', duo: MM.store.settings.duo });
        render();
        break;
      }
      case 'repeat-failed': {
        const sum = MM.engine.summary();
        MM.engine.start({ mode: 'mistakes', items: sum.failed, duo: MM.store.settings.duo });
        render();
        break;
      }
      case 'review-mistakes': location.hash = '#/repaso'; break;
      case 'review-one':
        MM.engine.start({ mode: 'mistakes', items: [{ gen: el.getAttribute('data-gen'), seed: Number(el.getAttribute('data-seed')) }] });
        location.hash = '#/repaso';
        render();
        break;
      case 'clear-mistakes':
        if (confirm(MM.txt(T('¿Vaciar el cuaderno de errores?', 'Iztukšot kļūdu burtnīcu?')))) {
          MM.store.p().mistakes = []; MM.store.save(); render();
        }
        break;

      /* examen */
      case 'exam-start': MM.exam.build(false); location.hash = '#/examen/hacer'; render(); break;
      case 'exam-start-short': MM.exam.build(true); location.hash = '#/examen/hacer'; render(); break;
      case 'exam-submit': submitExam(false); break;
      case 'exam-choice': {
        const key = el.getAttribute('data-ekey');
        MM.exam.state.answers[key] = el.getAttribute('data-val');
        el.parentNode.querySelectorAll('.choice').forEach(b => b.setAttribute('aria-pressed', b === el ? 'true' : 'false'));
        break;
      }

      /* plan */
      case 'plan': {
        const p = MM.store.p(), k = el.getAttribute('data-week');
        p.plan[k] = el.checked; MM.store.save();
        if (el.checked) MM.toast('✅ ' + MM.txt(T('¡Semana completada!', 'Nedēļa pabeigta!')));
        break;
      }

      /* ajustes */
      case 'switch-profile': MM.store.setActive(el.getAttribute('data-id')); render(); break;
      case 'add-profile': askProfile(null); break;
      case 'rename-profile': askProfile(el.getAttribute('data-id')); break;
      case 'delete-profile':
        if (confirm(MM.txt(T('¿Borrar este perfil y su progreso?', 'Dzēst šo profilu un tā progresu?')))) {
          MM.store.deleteProfile(el.getAttribute('data-id')); render();
        }
        break;
      case 'export': {
        const blob = new Blob([MM.store.exportJson()], { type: 'application/json' });
        const a = doc.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'matemagicas-' + MM.today() + '.json';
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
        break;
      }
      case 'reset':
        if (confirm(MM.txt(UI.setResetAsk))) { MM.store.resetAll(); location.hash = '#/'; render(); }
        break;
      case 'modal-ok': {
        const m = doc.getElementById('modal');
        const cb = m._onOk;
        const data = {};
        m.querySelectorAll('[data-f]').forEach(i => { data[i.getAttribute('data-f')] = i.value; });
        MM.closeModal();
        if (cb) cb(data);
        break;
      }
      case 'modal-cancel': MM.closeModal(); break;
      case 'pick-emoji': {
        const inp = doc.querySelector('#modal [data-f="avatar"]');
        if (inp) inp.value = el.textContent.trim();
        break;
      }
    }
  });

  /* cambios en inputs y selects */
  doc.addEventListener('change', ev => {
    const el = ev.target.closest('[data-act]');
    if (!el) return;
    const act = el.getAttribute('data-act');
    if (act === 'set') {
      const k = el.getAttribute('data-key');
      MM.store.set(k, k === 'sessionLen' ? Number(el.value) : el.value);
      MM.toast('✅');
    } else if (act === 'set-check') {
      MM.store.set(el.getAttribute('data-key'), el.checked);
      MM.toast('✅');
    } else if (act === 'import') {
      const file = el.files && el.files[0];
      if (!file) return;
      const rd = new FileReader();
      rd.onload = () => {
        try { MM.store.importJson(rd.result); MM.toast('✅ ' + MM.txt(T('Progreso cargado', 'Progress ielādēts'))); render(); }
        catch (e) { MM.toast('⚠️ ' + MM.txt(T('Archivo no válido', 'Nederīgs fails'))); }
      };
      rd.readAsText(file);
    }
  });

  /* escritura: guardar respuestas del examen y recordar el último campo */
  doc.addEventListener('input', ev => {
    const el = ev.target;
    if (el.matches('input.ans')) lastInput = el;
    if (el.matches('[data-act="exam-input"]') && MM.exam.state) {
      MM.exam.state.answers[el.getAttribute('data-ekey')] = el.value;
    }
    if (el.matches('[data-act="glo-search"]')) {
      doc.getElementById('gloList').innerHTML = MM.views.glossaryList(el.value);
    }
  });
  doc.addEventListener('focusin', ev => { if (ev.target.matches('input.ans')) lastInput = ev.target; });

  /* teclado: Enter comprueba y pasa al siguiente */
  doc.addEventListener('keydown', ev => {
    if (ev.key !== 'Enter') return;
    if (route.name !== '/practica' && route.name !== '/reto' && route.name !== '/repaso') return;
    if (MM.engine.done()) return;
    ev.preventDefault();
    const it = MM.engine.item();
    if (it && (it.checked || it.state === 'revealed')) doNext(); else doCheck();
  });

  /* ---------------------------------------------------------
     Modal de perfiles
     --------------------------------------------------------- */
  const EMOJIS = ['🦊', '🐣', '🐼', '🦄', '🐙', '🐝', '🦁', '🐧', '🐢', '🦉', '🐳', '🌟', '🚀', '🎈', '🍀', '👩', '👨', '👧', '👦'];
  function askProfile(id) {
    const p = id ? MM.store.data.profiles[id] : null;
    MM.modal(
      '<h3>' + (p ? MM.txt(T('Editar perfil', 'Rediģēt profilu')) : MM.txt(UI.setNew)) + '</h3>' +
      '<div class="field"><label>' + MM.txt(UI.setName) + '</label>' +
      '<input class="txt" data-f="name" value="' + MM.esc(p ? p.name : '') + '" maxlength="18"></div>' +
      '<div class="field"><label>Avatar</label><input class="txt" data-f="avatar" value="' + (p ? p.avatar : '🐣') + '" maxlength="4" style="width:70px;text-align:center"></div>' +
      '<div class="chips" style="margin:.5rem 0">' + EMOJIS.map(e => '<button class="chip" data-act="pick-emoji">' + e + '</button>').join('') + '</div>' +
      '<div class="btn-row" style="justify-content:flex-end">' +
        '<button class="btn ghost" data-act="modal-cancel">' + MM.txt(UI.cancel) + '</button>' +
        '<button class="btn primary" data-act="modal-ok">' + MM.txt(UI.save) + '</button>' +
      '</div>',
      data => {
        const name = (data.name || '').trim() || 'Yo';
        const avatar = (data.avatar || '🐣').trim() || '🐣';
        if (p) MM.store.renameProfile(p.id, name, avatar);
        else MM.store.addProfile(name, avatar);
        render();
      });
  }

  /* ---------------------------------------------------------
     Arranque
     --------------------------------------------------------- */
  function boot() {
    MM.store.load();
    applyLang(MM.store.settings.lang || 'both');
    doc.documentElement.setAttribute('data-theme', MM.store.settings.theme || 'auto');
    MM.store.touchStreak();
    global.addEventListener('hashchange', navigate);
    navigate();

    /* primera visita: pedir el nombre */
    const p = MM.store.p();
    if (p.name === 'Yo' && p.xp === 0 && !p.streak.best) {
      setTimeout(() => askProfile(p.id), 500);
    }
    /* aviso al salir de un examen en curso */
    global.addEventListener('beforeunload', e => {
      if (MM.exam.state && !MM.exam.state.finished) { e.preventDefault(); e.returnValue = ''; }
    });
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', boot);
  else boot();

})(typeof window !== 'undefined' ? window : globalThis);
