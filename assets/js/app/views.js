/* =========================================================
   Vistas de la aplicación
   ========================================================= */
(function (global) {
  'use strict';
  const MM = global.MM, T = MM.T, UI = MM.UI, bi = MM.bi, biB = MM.biB;
  const V = MM.views = {};
  const esc = MM.esc;

  /* ---------------------------------------------------------
     Piezas reutilizables
     --------------------------------------------------------- */
  function stars(n) {
    return '<span class="stars" title="' + n + '/3">' + '★'.repeat(n) + '<span class="muted">' + '☆'.repeat(3 - n) + '</span></span>';
  }
  function bar(p) { return '<div class="bar"><i style="width:' + Math.round(p * 100) + '%"></i></div>'; }
  /** singular o plural según el número */
  function pl(n, one, many) { return bi(n === 1 ? one : many); }
  function unitHtml(u) { return u ? '<span class="unit">' + (typeof u === 'string' ? u : bi(u)) + '</span>' : ''; }

  function daysToExam() {
    const d = MM.store.settings.examDate;
    if (!d) return null;
    return MM.daysBetween(MM.today(), d);
  }

  function topicCard(t) {
    const st = MM.store.topicStat(t.id);
    const m = MM.store.mastery(t.id);
    return '<button class="topic-card" data-act="go" data-href="#/tema/' + t.id + '">' +
      '<div class="topic-head"><span class="topic-emoji">' + t.emoji + '</span>' +
      '<span><span class="topic-title">' + biB(t.name, 'span') + '</span></span></div>' +
      '<div class="row between"><span>' + stars(MM.store.stars(t.id)) + '</span>' +
      '<span class="muted" style="font-size:.8rem">' + (st.att ? st.att + ' ' + MM.txt(st.att === 1 ? UI.attemptOne : UI.attempts) : '—') + '</span></div>' +
      bar(m) + '</button>';
  }

  /* ---------------------------------------------------------
     INICIO
     --------------------------------------------------------- */
  V.home = function () {
    const p = MM.store.p();
    const d = daysToExam();
    const today = p.daily[MM.today()] || { a: 0, c: 0 };
    const lvl = MM.store.level();
    const weak = MM.TOPICS.slice()
      .sort((a, b) => MM.store.mastery(a.id) - MM.store.mastery(b.id))
      .slice(0, 3);

    return '' +
      '<section class="hero card">' +
        '<div class="hero-deco">✨</div>' +
        '<h1>' + MM.txt(UI.hi) + ', ' + esc(p.name) + '! ' + p.avatar + '</h1>' +
        biB(UI.heroSub, 'p') +
        '<div class="hero-stats">' +
          (d !== null && d >= 0 ? '<span class="pill">📅 <b>' + d + '</b> ' + pl(d, UI.dayToExam, UI.daysToExam) + '</span>' : '') +
          '<span class="pill">🔥 <b>' + (p.streak.days || 0) + '</b> ' + pl(p.streak.days || 0, UI.streakOne, UI.streak) + '</span>' +
          '<span class="pill">⭐ ' + bi(UI.level) + ' <b>' + lvl + '</b></span>' +
          '<span class="pill">✅ ' + bi(UI.todayGoal) + ': <b>' + today.a + '</b> ' + pl(today.a, UI.exerciseOne, UI.exercises) + '</span>' +
        '</div>' +
        '<div class="btn-row">' +
          '<button class="btn accent big" data-act="go" data-href="#/juego">🎮 ' + bi(T('Jugar', 'Spēlēt')) + '</button>' +
          '<button class="btn big" data-act="go" data-href="#/reto">⚡ ' + bi(UI.dailyTitle) + '</button>' +
          '<button class="btn big" data-act="go" data-href="#/temas">📚 ' + bi(UI.topicsTitle) + '</button>' +
        '</div>' +
      '</section>' +

      '<div class="card">' +
        '<h2>🎯 ' + bi(UI.weakest) + '</h2>' +
        '<div class="grid cols">' + weak.map(topicCard).join('') + '</div>' +
      '</div>' +

      '<div class="card">' +
        '<div class="row between"><h2 style="margin:0">📚 ' + bi(UI.topicsTitle) + '</h2>' +
        '<a class="btn sm ghost" href="#/temas">' + bi(T('Ver todos', 'Visi')) + ' →</a></div>' +
        '<div class="grid cols" style="margin-top:.8rem">' + MM.TOPICS.slice(0, 6).map(topicCard).join('') + '</div>' +
      '</div>' +

      '<div class="grid cols-2">' +
        quickCard('📝', UI.examTitle, UI.examIntro, '#/examen') +
        quickCard('🧾', UI.errTitle, UI.errSub, '#/errores') +
        quickCard('🗓️', UI.planTitle, UI.planSub, '#/plan') +
        quickCard('🔤', UI.gloTitle, UI.gloSub, '#/glosario') +
        quickCard('🖨️', T('Hoja para imprimir', 'Lapa izdrukāšanai'),
          T('Ejercicios en papel con espacio para los pasos y las soluciones al final.',
            'Uzdevumi uz papīra ar vietu risinājumam un atbildēm beigās.'), '#/imprimir') +
      '</div>';
  };

  function quickCard(emoji, title, sub, href) {
    return '<button class="topic-card" data-act="go" data-href="' + href + '">' +
      '<div class="topic-head"><span class="topic-emoji">' + emoji + '</span>' +
      '<span class="topic-title">' + biB(title, 'span') + '</span></div>' +
      '<div class="muted" style="font-size:.86rem">' + biB(sub, 'div') + '</div></button>';
  }

  /* ---------------------------------------------------------
     LISTA DE TEMAS
     --------------------------------------------------------- */
  V.topics = function () {
    return '<h1>📚 ' + bi(UI.topicsTitle) + '</h1>' +
      biB(T('Cada tema tiene su explicación con ejemplos y ejercicios que cambian siempre. Las estrellas se ganan practicando.',
            'Katram tematam ir skaidrojums ar piemēriem un uzdevumi, kas vienmēr mainās. Zvaigznes nopelna, trenējoties.'), 'p') +
      '<div class="grid cols">' + MM.TOPICS.map((t, i) =>
        topicCard(t).replace('<span class="topic-emoji">', '<span class="topic-emoji" title="Tema ' + (i + 1) + '">')
      ).join('') + '</div>';
  };

  /* ---------------------------------------------------------
     UN TEMA: lección + tipos de ejercicio
     --------------------------------------------------------- */
  function blockHtml(b) {
    switch (b.k) {
      case 'p': return biB(b.t, 'p');
      case 'key': return '<div class="note key">' + biB(b.t, 'div') + '</div>';
      case 'tip': return '<div class="note tip">💡 ' + biB(b.t, 'div') + '</div>';
      case 'warn': return '<div class="note warn">⚠️ ' + biB(b.t, 'div') + '</div>';
      case 'list': return '<ul>' + b.items.map(i => '<li>' + biB(i, 'div') + '</li>').join('') + '</ul>';
      case 'table':
        return '<table class="t"><thead><tr>' + b.head.map(hc => '<th>' + bi(hc) + '</th>').join('') +
          '</tr></thead><tbody>' + b.rows.map(r => '<tr>' + r.map(c => '<td>' + bi(c) + '</td>').join('') + '</tr>').join('') +
          '</tbody></table>';
      case 'ex':
        return '<div class="example"><div class="ex-title">✏️ ' + biB(b.t, 'span') + '</div>' +
          '<ol class="steps">' + b.steps.map(s => '<li>' + biB(s, 'div') + '</li>').join('') + '</ol></div>';
      default: return '';
    }
  }

  V.topic = function (id) {
    const t = MM.topic(id);
    if (!t) return '<p>?</p>';
    const l = MM.LESSONS[id];
    const st = MM.store.topicStat(id);
    const gens = MM.gen.byTopic(id);
    const pct = st.att ? Math.round(st.ok / st.att * 100) : 0;

    return '<div class="row between" style="align-items:flex-start">' +
        '<h1 style="max-width:70%">' + t.emoji + ' ' + biB(t.name, 'span') + '</h1>' +
        '<a class="btn sm ghost" href="#/temas">← ' + bi(UI.back) + '</a>' +
      '</div>' +
      biB(t.sub, 'p') +

      '<div class="card row between">' +
        '<div><div class="muted" style="font-size:.8rem">' + bi(UI.mastery) + '</div>' +
          stars(MM.store.stars(id)) +
          '<div class="muted" style="font-size:.8rem;margin-top:.2rem">' + st.att + ' ' + pl(st.att, UI.attemptOne, UI.attempts) + ' · ' + pct + ' % ' + bi(UI.correctPct) + '</div>' +
        '</div>' +
        '<div class="btn-row"><button class="btn primary big" data-act="go" data-href="#/practica/' + id + '">▶︎ ' + bi(UI.startPractice) + '</button>' +
        '<button class="btn" data-act="go" data-href="#/imprimir/' + id + '" title="' + MM.txt(T('Hoja para imprimir', 'Lapa izdrukāšanai')) + '">🖨️</button></div>' +
      '</div>' +

      '<div class="card lesson">' +
        '<h2>📖 ' + bi(UI.theory) + '</h2>' +
        (l ? l.sections.map((sec, i) =>
          '<section><h3 class="sec-title"><span class="n">' + (i + 1) + '</span>' + biB(sec.t, 'span') + '</h3>' +
          sec.b.map(blockHtml).join('') + '</section>').join('') : '') +
        '<div class="btn-row" style="margin-top:1rem">' +
          '<button class="btn primary big" data-act="go" data-href="#/practica/' + id + '">▶︎ ' + bi(UI.startPractice) + '</button>' +
        '</div>' +
      '</div>' +

      '<div class="card">' +
        '<h2>🎲 ' + bi(UI.exTypes) + '</h2>' +
        '<ul class="plain">' + gens.map(g => {
          const gs = MM.store.p().gens[g.id];
          return '<li class="row between"><span>' + (g.part === 'B' ? '<span class="badge amber">B</span> ' : '<span class="badge">A</span> ') +
            bi(g.name) + '</span><span class="muted" style="font-size:.8rem">' +
            (gs ? gs.ok + '/' + gs.att : '—') + '</span></li>';
        }).join('') + '</ul>' +
      '</div>';
  };

  /* ---------------------------------------------------------
     PRÁCTICA
     --------------------------------------------------------- */
  const LETTERS = ['A', 'B', 'C', 'D', 'E'];

  function fieldHtml(f, item) {
    const type = f.answerType || 'num';
    const res = item.results ? item.results[item.ex.fields.indexOf(f)] : null;
    const cls = res === null ? '' : (res ? 'ok' : 'bad');
    const label = f.label ? '<label for="ans-' + f.key + '">' + bi(f.label) + '</label>' : '';
    if (type === 'choice' || type === 'bool' || type === 'cmp') {
      return '<div class="field" style="align-items:flex-start"><div style="width:100%">' + label +
        '<div class="choices">' + f.choices.map((c, ci) => {
          const sel = item.given[f.key] === String(c.v);
          let k = '';
          if (item.checked) {
            if (String(c.v) === String(f.answer)) k = 'ok';
            else if (sel) k = 'bad';
          }
          return '<button class="choice ' + k + '" data-act="choice" data-key="' + f.key + '" data-val="' + esc(c.v) + '"' +
            ' aria-pressed="' + (sel ? 'true' : 'false') + '"' + (item.checked ? ' disabled' : '') + '>' +
            '<span class="k">' + (type === 'cmp' ? '' : LETTERS[ci]) + '</span><span>' + bi(c.t) + '</span></button>';
        }).join('') + '</div></div></div>';
    }
    return '<div class="field">' + label +
      '<input class="ans ' + cls + '" id="ans-' + f.key + '" data-key="' + f.key + '" type="text" inputmode="decimal" ' +
      'aria-label="' + MM.txt(f.label || UI.writeAnswer) + '" ' +
      'autocomplete="off" autocorrect="off" spellcheck="false" value="' + esc(item.given[f.key] || '') + '"' +
      (item.checked ? ' disabled' : '') + ' placeholder="?">' + unitHtml(f.unit) + '</div>';
  }

  function keypadHtml() {
    return '<div class="keypad" aria-label="teclas">' +
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', ',', '/', '−', '␣'].map(k =>
        '<button data-act="key" data-k="' + k + '">' + k + '</button>').join('') +
      '<button data-act="key" data-k="⌫">⌫</button></div>';
  }

  function solutionHtml(item, open) {
    const ex = item.ex;
    const ans = ex.fields.map(f =>
      (f.label ? bi(f.label) + ': ' : '') + MM.answerHtml(f)).join(' &nbsp;·&nbsp; ');
    return '<details class="sol"' + (open ? ' open' : '') + '>' +
      '<summary>' + bi(UI.solution) + '</summary>' +
      '<div class="sol-body">' +
        '<ol class="steps">' + ex.solution.map(s => '<li>' + biB(s, 'div') + '</li>').join('') + '</ol>' +
        '<div class="note key" style="margin-bottom:0">' + bi(UI.rightAns) + ': ' + ans + '</div>' +
      '</div></details>';
  }

  function practiceCard() {
    const s = MM.engine.session;
    const item = MM.engine.item();
    if (!item) return '';
    const ex = item.ex;
    const t = MM.topic(ex.topic);
    const showSol = item.checked || item.state === 'revealed';
    const okAll = item.results && item.results.every(Boolean) && item.state !== 'revealed';

    let feedback = '';
    if (item.state === 'revealed' && !item.checked) {
      feedback = '<div class="feedback neutral">👀 ' + bi(UI.revealed) + '</div>';
    } else if (item.checked) {
      feedback = okAll
        ? '<div class="feedback ok">🎉 ' + bi(UI.correct) + '</div>'
        : '<div class="feedback bad">' + bi(UI.incorrect) + '</div>';
    }

    const buttons = showSol
      ? '<button class="btn primary big" data-act="next">' + bi(UI.next) + ' →</button>'
      : '<button class="btn primary big" data-act="check">✓ ' + bi(UI.check) + '</button>' +
        '<button class="btn" data-act="hint">💡 ' + bi(UI.hint) + '</button>' +
        '<button class="btn ghost" data-act="reveal">' + bi(UI.showSol) + '</button>' +
        '<button class="btn ghost" data-act="reroll" title="' + MM.txt(UI.newExercise) + '">🎲</button>';

    return '<div class="card qcard">' +
      '<div class="qtag">' + (ex.part === 'B' ? '<span class="badge amber">Parte B</span>' : '<span class="badge">Parte A</span>') + '</div>' +
      '<div class="muted" style="font-size:.82rem">' + (t ? t.emoji + ' ' + bi(t.name) : '') + ' · ' + bi(ex.typeName) + '</div>' +
      '<div class="qtext">' + biB(ex.q, 'div') + '</div>' +
      '<div class="answers">' + ex.fields.map(f => fieldHtml(f, item)).join('') + '</div>' +
      (item.checked || item.state === 'revealed' ? '' : keypadHtml()) +
      (item.hintShown ? '<div class="note tip" style="margin-top:.7rem">💡 ' + biB(ex.hint || T('Vuelve a leer el enunciado con calma.', 'Izlasi uzdevumu vēlreiz mierīgi.'), 'div') + '</div>' : '') +
      feedback +
      (showSol ? solutionHtml(item, !okAll) : '') +
      '<div class="btn-row" style="margin-top:.9rem">' + buttons + '</div>' +
    '</div>';
  }

  V._fieldHtml = fieldHtml; V._keypadHtml = keypadHtml; V._stars = stars; V._bar = bar;

  V.practice = function () {
    const s = MM.engine.session;
    if (!s) return '<p>…</p>';
    if (MM.engine.done()) return V.practiceSummary();
    const dots = s.items.map((it, i) =>
      '<i class="' + (i === s.idx ? 'now' : (it.state === 'ok' ? 'ok' : (it.state === 'pending' ? '' : 'bad'))) + '"></i>').join('');
    const duo = s.duo ? '<span class="turn">🎮 ' + bi(UI.duoTurn) + ' <b>' +
      esc(MM.engine.currentProfile().name) + '</b> ' + MM.engine.currentProfile().avatar + '</span>' : '';

    return '<div class="row between">' +
        '<div>' + (s.topic ? '<a class="btn sm ghost" href="#/tema/' + s.topic + '">← ' + bi(UI.back) + '</a>'
                           : '<a class="btn sm ghost" href="#/">← ' + bi(UI.back) + '</a>') + '</div>' +
        '<div class="row"><span class="badge">' + (s.idx + 1) + ' / ' + s.items.length + '</span>' + duo + '</div>' +
      '</div>' +
      '<div class="dots" style="margin:.6rem 0 .8rem">' + dots + '</div>' +
      practiceCard();
  };

  V.practiceSummary = function () {
    const sum = MM.engine.summary();
    const s = MM.engine.session;
    const pct = Math.round(sum.correct / sum.total * 100);
    const face = pct >= 90 ? '🏆' : (pct >= 70 ? '🎉' : (pct >= 50 ? '💪' : '🌱'));
    const msg = pct >= 90 ? T('¡Perfecto! Estás listo para subir de nivel.', 'Lieliski! Vari kāpt nākamajā līmenī.')
      : pct >= 70 ? T('¡Muy bien! Repasa solo los fallos.', 'Ļoti labi! Pārskati tikai kļūdas.')
      : pct >= 50 ? T('Vas bien. Mira las soluciones de los fallos con calma.', 'Iet uz priekšu. Mierīgi apskati kļūdu risinājumus.')
      : T('Tranquila: esto es justo lo que hay que practicar. Lee la lección otra vez.', 'Nekas: tieši to vajag trenēt. Izlasi mācību vēlreiz.');

    let duoHtml = '';
    if (sum.duo) {
      duoHtml = '<div class="card"><h3>🎮 ' + bi(T('Marcador del dúo', 'Duo rezultāts')) + '</h3><ul class="plain">' +
        sum.duo.players.map(id => {
          const p = MM.store.data.profiles[id];
          return '<li class="row between"><span>' + p.avatar + ' ' + esc(p.name) + '</span><b>' + sum.duo.score[id] + '</b></li>';
        }).join('') + '</ul></div>';
    }

    const failedHtml = sum.failed.length
      ? '<div class="card"><h3>🔁 ' + bi(UI.reviewFails) + ' (' + sum.failed.length + ')</h3>' +
        '<button class="btn primary" data-act="repeat-failed">' + bi(UI.errRepeat) + '</button></div>'
      : '';

    return '<div class="card center">' +
        '<div style="font-size:3rem;line-height:1">' + face + '</div>' +
        '<h1>' + bi(UI.sessionEnd) + '</h1>' +
        '<div class="scorebig">' + sum.correct + ' / ' + sum.total + '</div>' +
        biB(msg, 'p') +
        '<div class="hero-stats" style="justify-content:center">' +
          '<span class="badge green">+' + sum.xp + ' XP</span>' +
          '<span class="badge">' + sum.minutes + ' min</span>' +
          (sum.revealed ? '<span class="badge amber">' + sum.revealed + ' ' + MM.txt(T('vistas', 'parādītas')) + '</span>' : '') +
        '</div>' +
        '<div class="btn-row" style="justify-content:center;margin-top:1rem">' +
          '<button class="btn primary big" data-act="again">🔄 ' + bi(UI.againRound) + '</button>' +
          (s.topic ? '<button class="btn" data-act="go" data-href="#/tema/' + s.topic + '">📖 ' + bi(UI.lesson) + '</button>' : '') +
          '<button class="btn ghost" data-act="go" data-href="#/">🏠</button>' +
        '</div>' +
      '</div>' + duoHtml + failedHtml;
  };

  /* ---------------------------------------------------------
     CUADERNO DE ERRORES
     --------------------------------------------------------- */
  V.mistakes = function () {
    const p = MM.store.p();
    const list = p.mistakes || [];
    if (!list.length) {
      return '<h1>🧾 ' + bi(UI.errTitle) + '</h1>' + biB(UI.errSub, 'p') +
        '<div class="card center"><p style="font-size:2.4rem;margin:0">🌟</p>' + biB(UI.errEmpty, 'p') +
        '<button class="btn primary" data-act="go" data-href="#/temas">' + bi(UI.topicsTitle) + '</button></div>';
    }
    const byTopic = {};
    list.forEach(m => { (byTopic[m.topic] = byTopic[m.topic] || []).push(m); });

    return '<h1>🧾 ' + bi(UI.errTitle) + '</h1>' + biB(UI.errSub, 'p') +
      '<div class="card row between">' +
        '<span><b>' + list.length + '</b> ' + bi(T('ejercicios para repasar', 'atkārtojamie uzdevumi')) + '</span>' +
        '<span class="btn-row"><button class="btn primary" data-act="review-mistakes">🔁 ' + bi(UI.errRepeat) + '</button>' +
        '<button class="btn ghost sm" data-act="clear-mistakes">🗑️</button></span>' +
      '</div>' +
      Object.keys(byTopic).map(tid => {
        const t = MM.topic(tid);
        return '<div class="card"><div class="row between"><h3 style="margin:0">' + (t ? t.emoji + ' ' + bi(t.name) : tid) + '</h3>' +
          '<button class="btn sm" data-act="go" data-href="#/practica/' + tid + '">' + bi(UI.practice) + '</button></div>' +
          '<ul class="plain">' + byTopic[tid].map(m => {
            const def = MM.gen.list[m.gen];
            return '<li class="row between"><span>' + (def ? bi(def.name) : m.gen) +
              (m.given ? ' <span class="muted" style="font-size:.8rem">(' + esc(m.given) + ')</span>' : '') + '</span>' +
              '<button class="btn sm ghost" data-act="review-one" data-gen="' + esc(m.gen) + '" data-seed="' + esc(m.seed) + '">↻</button></li>';
          }).join('') + '</ul></div>';
      }).join('');
  };

  /* ---------------------------------------------------------
     PLAN
     --------------------------------------------------------- */
  V.plan = function () {
    const p = MM.store.p();
    const d = daysToExam();
    return '<h1>🗓️ ' + bi(UI.planTitle) + '</h1>' +
      biB(MM.PLAN.intro, 'p') +
      (d !== null && d >= 0 ? '<div class="note key">📅 ' + biB(T('Faltan <b>' + d + ' días</b> para el examen (' + MM.store.settings.examDate + '). Puedes cambiar la fecha en Ajustes.',
        'Līdz pārbaudījumam atlikušas <b>' + d + ' dienas</b> (' + MM.store.settings.examDate + '). Datumu var mainīt iestatījumos.'), 'div') + '</div>' : '') +
      MM.PLAN.months.map(mo =>
        '<div class="card"><h2>' + bi(mo.t) + '</h2>' + biB(mo.note, 'p') +
        '<ul class="plain">' + mo.weeks.map(w => {
          const key = 'w' + w.n, on = !!p.plan[key];
          return '<li><label class="checkline"><input type="checkbox" data-act="plan" data-week="' + key + '"' + (on ? ' checked' : '') + '>' +
            '<span><b>' + MM.txt(UI.planWeek) + ' ' + w.n + '</b> ' +
            w.topics.map(tid => { const t = MM.topic(tid); return t ? '<span class="badge">' + t.emoji + ' ' + bi(t.name) + '</span> ' : ''; }).join('') +
            '<br>' + biB(w.goal, 'span') + '</span></label></li>';
        }).join('') + '</ul></div>').join('') +
      '<div class="card"><h2>💡 ' + bi(T('Dos hábitos que valen más que las horas extra', 'Divi ieradumi, kas vērtīgāki par papildu stundām')) + '</h2>' +
        '<ul>' + MM.PLAN.habits.map(h => '<li>' + biB(h, 'div') + '</li>').join('') + '</ul></div>';
  };

  /* ---------------------------------------------------------
     GLOSARIO
     --------------------------------------------------------- */
  V.glossary = function () {
    return '<h1>🔤 ' + bi(UI.gloTitle) + '</h1>' + biB(UI.gloSub, 'p') +
      '<div class="card"><input class="txt searchbox" id="gloSearch" placeholder="' + MM.txt(UI.gloSearch) + '" data-act="glo-search"></div>' +
      '<div id="gloList">' + glossaryList('') + '</div>';
  };

  function glossaryList(q) {
    q = (q || '').toLowerCase().trim();
    return MM.GLOSSARY.map(g => {
      const items = g.items.filter(it => !q || it[0].toLowerCase().includes(q) || it[1].toLowerCase().includes(q));
      if (!items.length) return '';
      return '<div class="card"><h3>' + g.emoji + ' ' + bi(g.t) + '</h3>' +
        '<table class="t"><thead><tr><th>Latviski</th><th>Español</th></tr></thead><tbody>' +
        items.map(it => '<tr><td><b>' + esc(it[0]) + '</b></td><td>' + esc(it[1]) + '</td></tr>').join('') +
        '</tbody></table></div>';
    }).join('');
  }
  V.glossaryList = glossaryList;

  /* ---------------------------------------------------------
     PROGRESO
     --------------------------------------------------------- */
  V.progress = function () {
    const p = MM.store.p();
    const totalEx = Object.values(p.daily).reduce((a, d) => a + d.a, 0);
    const totalOk = Object.values(p.daily).reduce((a, d) => a + d.c, 0);
    const avg = MM.TOPICS.reduce((a, t) => a + MM.store.mastery(t.id), 0) / MM.TOPICS.length;

    /* mapa de calor de los últimos 91 días */
    const cells = [];
    for (let i = 90; i >= 0; i--) {
      const day = MM.today(new Date(Date.now() - i * 86400000));
      const v = (p.daily[day] || { a: 0 }).a;
      const lvl = v === 0 ? 0 : (v < 5 ? 1 : (v < 12 ? 2 : (v < 25 ? 3 : 4)));
      cells.push('<i data-l="' + lvl + '" title="' + day + ': ' + v + '"></i>');
    }

    return '<h1>📈 ' + bi(UI.progTitle) + '</h1>' +
      '<div class="card row between">' +
        '<div class="row" style="gap:1rem">' +
          '<div class="ring" style="--p:' + Math.round(avg * 100) + '"><span>' + Math.round(avg * 100) + '%</span></div>' +
          '<div><div><b>' + totalEx + '</b> ' + bi(UI.progTotal) + '</div>' +
          '<div class="muted">' + (totalEx ? Math.round(totalOk / totalEx * 100) : 0) + ' % ' + bi(UI.correctPct) + '</div>' +
          '<div class="muted">🔥 ' + (p.streak.days || 0) + ' ' + bi(UI.streak) + ' · ' + MM.txt(T('récord', 'rekords')) + ': ' + (p.streak.best || 0) + '</div></div>' +
        '</div>' +
        '<div><span class="badge">' + bi(UI.level) + ' ' + MM.store.level() + '</span><br>' +
        '<span class="muted" style="font-size:.8rem">' + p.xp + ' XP</span></div>' +
      '</div>' +

      '<div class="card"><h3>' + bi(UI.progDays) + '</h3><div class="heat">' + cells.join('') + '</div></div>' +

      '<div class="card"><h3>' + bi(UI.progTopics) + '</h3>' +
        MM.TOPICS.map(t => {
          const st = MM.store.topicStat(t.id);
          return '<div style="margin:.5rem 0"><div class="row between" style="font-size:.88rem">' +
            '<span>' + t.emoji + ' ' + bi(t.name) + ' ' + stars(MM.store.stars(t.id)) + '</span>' +
            '<span class="muted">' + st.ok + '/' + st.att + '</span></div>' + bar(MM.store.mastery(t.id)) + '</div>';
        }).join('') +
      '</div>' +

      '<div class="card"><h3>' + bi(UI.progExams) + '</h3>' +
        (p.exams && p.exams.length
          ? '<table class="t"><thead><tr><th>' + MM.txt(T('Fecha', 'Datums')) + '</th><th>' + MM.txt(UI.examScore) + '</th><th>%</th><th>' + MM.txt(UI.examTime) + '</th></tr></thead><tbody>' +
            p.exams.slice().reverse().map(e => '<tr><td>' + e.when + '</td><td>' + e.score + ' / ' + e.max + '</td><td>' +
              Math.round(e.score / e.max * 100) + ' %</td><td>' + e.minutes + ' min</td></tr>').join('') + '</tbody></table>'
          : biB(T('Todavía no has hecho ningún simulacro.', 'Simulācijas vēl nav veiktas.'), 'p')) +
      '</div>';
  };

  /* ---------------------------------------------------------
     AJUSTES
     --------------------------------------------------------- */
  V.settings = function () {
    const s = MM.store.settings;
    const profiles = MM.store.profiles();
    return '<h1>⚙️ ' + bi(UI.setTitle) + '</h1>' +

      '<div class="card"><h3>👥 ' + bi(UI.setProfiles) + '</h3>' +
        '<ul class="plain">' + profiles.map(p =>
          '<li class="row between"><span>' + p.avatar + ' <b>' + esc(p.name) + '</b> ' +
          '<span class="muted" style="font-size:.8rem">' + p.xp + ' XP · ' + bi(UI.level) + ' ' + MM.store.level(p) + '</span></span>' +
          '<span class="btn-row">' +
            (p.id === MM.store.data.active ? '<span class="badge green">✓</span>'
              : '<button class="btn sm" data-act="switch-profile" data-id="' + p.id + '">' + bi(T('Usar', 'Lietot')) + '</button>') +
            '<button class="btn sm ghost" data-act="rename-profile" data-id="' + p.id + '">✏️</button>' +
            (profiles.length > 1 ? '<button class="btn sm ghost" data-act="delete-profile" data-id="' + p.id + '">🗑️</button>' : '') +
          '</span></li>').join('') + '</ul>' +
        '<button class="btn" data-act="add-profile">➕ ' + bi(UI.setNew) + '</button>' +
      '</div>' +

      '<div class="card"><h3>🎛️ ' + bi(T('Preferencias', 'Iestatījumi')) + '</h3>' +
        '<div class="field"><label>' + bi(UI.setExamDate) + '</label>' +
          '<input class="txt" type="date" value="' + esc(s.examDate) + '" data-act="set" data-key="examDate"></div>' +
        '<div class="field"><label>' + bi(UI.setLen) + '</label>' +
          '<select class="txt" data-act="set" data-key="sessionLen">' +
          [5, 10, 15, 20].map(n => '<option value="' + n + '"' + (s.sessionLen === n ? ' selected' : '') + '>' + n + '</option>').join('') +
          '</select></div>' +
        '<div class="field"><label>' + bi(UI.duoOn) + '</label>' +
          '<input type="checkbox" data-act="set-check" data-key="duo"' + (s.duo ? ' checked' : '') + ' style="width:22px;height:22px"></div>' +
        '<div class="field"><label>' + bi(UI.setSound) + '</label>' +
          '<input type="checkbox" data-act="set-check" data-key="sound"' + (s.sound ? ' checked' : '') + ' style="width:22px;height:22px"></div>' +
      '</div>' +

      '<div class="card"><h3>💾 ' + bi(T('Copia de seguridad', 'Dublējums')) + '</h3>' +
        biB(T('El progreso se guarda en este navegador. Descarga una copia de vez en cuando (y para pasarlo a otro dispositivo).',
              'Progress glabājas šajā pārlūkā. Ik pa laikam lejupielādē dublējumu (un lai pārnestu uz citu ierīci).'), 'p') +
        '<div class="btn-row">' +
          '<button class="btn" data-act="export">⬇️ ' + bi(UI.setExport) + '</button>' +
          '<label class="btn">⬆️ ' + bi(UI.setImport) + '<input type="file" accept="application/json" style="display:none" data-act="import"></label>' +
          '<button class="btn ghost" data-act="reset">🗑️ ' + bi(UI.setReset) + '</button>' +
        '</div>' +
      '</div>' +

      '<div class="card"><h3>ℹ️ ' + bi(T('Sobre esta web', 'Par šo vietni')) + '</h3>' +
        biB(T('Hecha para preparar el examen unificado de matemáticas de los gimnasios estatales de Riga (entrada a 7.º curso). Todos los ejercicios se generan al azar, así que nunca se acaban.',
              'Veidota, gatavojoties Rīgas valsts ģimnāziju vienotajam matemātikas iestājpārbaudījumam (uzņemšana 7. klasē). Visi uzdevumi tiek ģenerēti nejauši, tāpēc tie nekad nebeidzas.'), 'p') +
        '<p class="muted">' + MM.gen.all().length + ' ' + MM.txt(T('tipos de ejercicio', 'uzdevumu veidi')) + ' · ' +
        MM.TOPICS.length + ' ' + MM.txt(T('temas', 'temati')) + '</p>' +
      '</div>';
  };

  /* ---------------------------------------------------------
     HOJA PARA IMPRIMIR
     El examen real se hace en papel y con bolígrafo: esta hoja
     sirve para practicar igual, con las soluciones al final.
     --------------------------------------------------------- */
  MM.sheet = null;

  MM.buildSheet = function (topicId, n, seed) {
    const rng = MM.rng('hoja-' + seed);
    const gens = topicId === 'mix' ? MM.engine.chooseMixed(n, rng) : MM.engine.chooseGens(topicId, n, rng);
    const items = gens.map(g => MM.gen.make(g, rng.int(1, 999999))).filter(Boolean);
    MM.sheet = { topic: topicId, n: n, seed: seed, items: items };
    return MM.sheet;
  };

  V.print = function () {
    const s = MM.sheet;
    const opts = '<option value="mix">' + MM.txt(T('Mezcla de todos los temas', 'Visu tematu sajaukums')) + '</option>' +
      MM.TOPICS.map(t => '<option value="' + t.id + '"' + (s && s.topic === t.id ? ' selected' : '') + '>' +
        t.emoji + ' ' + MM.txt(t.name) + '</option>').join('');

    const form = '<div class="card">' +
      '<h1>🖨️ ' + bi(T('Hoja para imprimir', 'Lapa izdrukāšanai')) + '</h1>' +
      biB(T('Ejercicios nuevos cada vez, con espacio para escribir todos los pasos a boli, y las soluciones al final. Así se practica igual que en el examen.',
            'Katru reizi jauni uzdevumi, ar vietu, kur ar pildspalvu pierakstīt visus soļus, un risinājumiem beigās. Tā var trenēties tāpat kā pārbaudījumā.'), 'p') +
      '<div class="row">' +
        '<select class="txt" id="sheetTopic">' + opts + '</select>' +
        '<select class="txt" id="sheetN">' + [8, 12, 16, 20, 30].map(k =>
          '<option value="' + k + '"' + (s && s.n === k ? ' selected' : '') + '>' + k + ' ' + MM.txt(UI.exercises) + '</option>').join('') + '</select>' +
        '<button class="btn primary" data-act="sheet-make">🎲 ' + bi(T('Generar hoja', 'Izveidot lapu')) + '</button>' +
        (s ? '<button class="btn accent" data-act="sheet-print">🖨️ ' + bi(T('Imprimir', 'Drukāt')) + '</button>' : '') +
      '</div></div>';

    if (!s) return form;

    return form + '<div class="card sheet-paper">' +
      '<div class="row between"><h2 style="margin:0">' +
        (s.topic === 'mix' ? MM.txt(T('Mezcla', 'Sajaukums')) : MM.txt(MM.topic(s.topic).name)) +
        '</h2><span class="muted">' + MM.txt(T('Hoja n.º', 'Lapa Nr.')) + ' ' + s.seed + '</span></div>' +
      '<p class="muted">' + MM.txt(T('Nombre: ______________________   Fecha: ____________   Tiempo: ______',
                                     'Vārds: ______________________   Datums: ____________   Laiks: ______')) + '</p>' +
      s.items.map((ex, i) =>
        '<div class="sheet-q"><b>' + (i + 1) + '.</b> ' + biB(ex.q, 'div') +
        '<div class="sheet-space" style="height:' + (ex.part === 'B' ? 110 : 46) + 'px"></div></div>').join('') +
      '</div>' +
      '<div class="card sheet-sol">' +
        '<h2>🔑 ' + bi(T('Soluciones', 'Risinājumi')) + '</h2>' +
        s.items.map((ex, i) =>
          '<div class="sheet-q"><b>' + (i + 1) + '.</b> ' +
          ex.fields.map(f => (f.label ? bi(f.label) + ': ' : '') + MM.answerHtml(f)).join(' · ') +
          '<ol class="steps">' + ex.solution.map(st => '<li>' + biB(st, 'div') + '</li>').join('') + '</ol></div>').join('') +
      '</div>';
  };

  /* ---------------------------------------------------------
     Avisos, confeti y modal
     --------------------------------------------------------- */
  MM.toast = function (msg, ms) {
    const el = document.getElementById('toast');
    el.innerHTML = typeof msg === 'string' ? msg : bi(msg);
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), ms || 2200);
  };

  MM.confetti = function () {
    if (global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = document.createElement('div');
    box.className = 'confetti';
    const colors = ['#6C5CE7', '#FFB020', '#14a06a', '#e11d48', '#0ea5e9'];
    for (let i = 0; i < 60; i++) {
      const c = document.createElement('i');
      c.style.left = Math.random() * 100 + 'vw';
      c.style.top = '-20px';
      c.style.background = colors[i % colors.length];
      c.style.animationDuration = (1.6 + Math.random() * 1.4) + 's';
      c.style.animationDelay = (Math.random() * 0.4) + 's';
      box.appendChild(c);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 3600);
  };

  MM.modal = function (html, onOk) {
    const m = document.getElementById('modal');
    m.innerHTML = '<div class="sheet">' + html + '</div>';
    m.hidden = false;
    m._onOk = onOk;
    const f = m.querySelector('input,select,textarea');
    if (f) setTimeout(() => f.focus(), 40);
  };
  MM.closeModal = function () {
    const m = document.getElementById('modal');
    m.hidden = true; m.innerHTML = ''; m._onOk = null;
  };

})(typeof window !== 'undefined' ? window : globalThis);
