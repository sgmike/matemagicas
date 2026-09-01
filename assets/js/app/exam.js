/* =========================================================
   Simulacro de examen
   Parte A: 35 respuestas cortas (1 punto)
   Parte B: 15 problemas de varios pasos (3–5 puntos)
   150 minutos, como el examen real.
   ========================================================= */
(function (global) {
  'use strict';
  const MM = global.MM, T = MM.T, UI = MM.UI, bi = MM.bi, biB = MM.biB, esc = MM.esc;
  const V = MM.views;

  function pickUnique(defs, n, rng) {
    const w = defs.map(d => (MM.topic(d.topic) ? MM.topic(d.topic).w : 5));
    const pool = defs.slice(), weights = w.slice(), out = [];
    while (out.length < n && pool.length) {
      const total = weights.reduce((a, b) => a + b, 0);
      let r = rng.next() * total, i = 0;
      for (; i < pool.length; i++) { r -= weights[i]; if (r <= 0) break; }
      i = Math.min(i, pool.length - 1);
      out.push(pool[i]);
      pool.splice(i, 1); weights.splice(i, 1);
    }
    /* si hacen falta más, se repiten tipos con otra semilla */
    while (out.length < n) out.push(defs[rng.int(0, defs.length - 1)]);
    return out;
  }

  const exam = {
    state: null,

    build(short) {
      const rng = MM.rng(Date.now() % 1e9);
      const nA = short ? 12 : 35, nB = short ? 4 : 15;
      const defsA = MM.gen.all().filter(d => d.part === 'A');
      const defsB = MM.gen.all().filter(d => d.part === 'B');
      const items = [];
      pickUnique(defsA, nA, rng).forEach(d => {
        const seed = rng.int(1, 999999);
        const ex = MM.gen.make(d.id, seed);
        if (ex) items.push({ gen: d.id, seed: seed, ex: ex, part: 'A' });
      });
      pickUnique(defsB, nB, rng).forEach(d => {
        const seed = rng.int(1, 999999);
        const ex = MM.gen.make(d.id, seed);
        if (ex) items.push({ gen: d.id, seed: seed, ex: ex, part: 'B' });
      });
      this.state = {
        items: items,
        answers: {},
        minutes: short ? 30 : 150,
        started: Date.now(),
        finished: null,
        result: null,
        short: !!short
      };
      return this.state;
    },

    remainingMs() {
      const s = this.state;
      if (!s) return 0;
      return Math.max(0, s.started + s.minutes * 60000 - Date.now());
    },

    grade() {
      const s = this.state;
      let score = 0, max = 0;
      const byTopic = {};
      s.items.forEach((it, i) => {
        const pts = it.ex.points || (it.part === 'B' ? 3 : 1);
        max += pts;
        const results = it.ex.fields.map(f => MM.checkField(f, s.answers['q' + i + '_' + f.key]));
        const okCount = results.filter(Boolean).length;
        const got = Math.round(pts * okCount / results.length * 100) / 100;
        score += got;
        it.results = results;
        it.got = got; it.pts = pts;
        const tp = byTopic[it.ex.topic] || (byTopic[it.ex.topic] = { got: 0, max: 0 });
        tp.got += got; tp.max += pts;
        MM.store.record({
          topic: it.ex.topic, gen: it.gen, seed: it.seed,
          correct: results.every(Boolean),
          given: it.ex.fields.map(f => s.answers['q' + i + '_' + f.key] || '').join(' | ')
        });
      });
      s.finished = Date.now();
      const minutes = Math.max(1, Math.round((s.finished - s.started) / 60000));
      s.result = { score: Math.round(score * 100) / 100, max: max, byTopic: byTopic, minutes: minutes };
      const p = MM.store.p();
      p.exams.push({ when: MM.today(), score: s.result.score, max: max, minutes: minutes, byTopic: byTopic });
      MM.store.save();
      return s.result;
    }
  };
  MM.exam = exam;

  /* ---------------------------------------------------------
     Vistas
     --------------------------------------------------------- */
  V.exam = function () {
    const p = MM.store.p();
    const last = p.exams && p.exams.length ? p.exams[p.exams.length - 1] : null;
    return '<h1>📝 ' + bi(UI.examTitle) + '</h1>' +
      biB(UI.examIntro, 'p') +
      '<div class="card">' +
        '<div class="note key">' + biB(T('Reglas del examen real: bolígrafo azul o negro, regla y goma. <b>Sin calculadora</b>. El lápiz solo para dibujos. En la Parte B hay que escribir todos los pasos en papel.',
          'Īstā pārbaudījuma noteikumi: zila vai melna pildspalva, lineāls un dzēšgumija. <b>Bez kalkulatora</b>. Zīmulis tikai zīmējumiem. B daļā uz papīra jāraksta visi soļi.'), 'div') + '</div>' +
        '<div class="btn-row">' +
          '<button class="btn primary big" data-act="exam-start">▶︎ ' + bi(UI.examStart) + ' (150 min)</button>' +
          '<button class="btn" data-act="exam-start-short">⏱️ ' + bi(UI.examShort) + '</button>' +
        '</div>' +
      '</div>' +
      (last ? '<div class="card"><h3>' + bi(UI.examHistory) + '</h3>' +
        '<table class="t"><thead><tr><th>' + MM.txt(T('Fecha', 'Datums')) + '</th><th>' + MM.txt(UI.examScore) + '</th><th>%</th><th>' + MM.txt(UI.examTime) + '</th></tr></thead><tbody>' +
        p.exams.slice().reverse().map(e => '<tr><td>' + e.when + '</td><td>' + e.score + ' / ' + e.max + '</td><td>' +
          Math.round(e.score / e.max * 100) + ' %</td><td>' + e.minutes + ' min</td></tr>').join('') +
        '</tbody></table></div>' : '');
  };

  function examField(it, i, f, review) {
    const type = f.answerType || 'num';
    const key = 'q' + i + '_' + f.key;
    const val = MM.exam.state.answers[key] || '';
    const label = f.label ? '<label>' + bi(f.label) + '</label>' : '';
    if (review) {
      const idx = it.ex.fields.indexOf(f);
      const ok = it.results && it.results[idx];
      return '<div class="field">' + label +
        '<span class="badge ' + (ok ? 'green' : 'rose') + '">' + (ok ? '✓' : '✗') + ' ' + (val ? esc(val) : '—') + '</span>' +
        (ok ? '' : '<span class="muted">→ ' + MM.answerHtml(f) + '</span>') + '</div>';
    }
    if (type === 'choice' || type === 'bool' || type === 'cmp') {
      return '<div class="field" style="align-items:flex-start"><div style="width:100%">' + label +
        '<div class="choices">' + f.choices.map(c =>
          '<button class="choice" data-act="exam-choice" data-ekey="' + key + '" data-val="' + esc(c.v) + '"' +
          ' aria-pressed="' + (val === String(c.v) ? 'true' : 'false') + '"><span>' + bi(c.t) + '</span></button>').join('') +
        '</div></div></div>';
    }
    return '<div class="field">' + label +
      '<input class="ans" type="text" inputmode="decimal" autocomplete="off" data-act="exam-input" data-ekey="' + key + '" value="' + esc(val) + '">' +
      (f.unit ? '<span class="unit">' + (typeof f.unit === 'string' ? f.unit : bi(f.unit)) + '</span>' : '') + '</div>';
  }

  function examQuestion(it, i, review) {
    const n = i + 1;
    const partA = it.part === 'A';
    const num = partA ? n : n - MM.exam.state.items.filter(x => x.part === 'A').length;
    return '<div class="exam-q" id="eq' + i + '">' +
      '<div><span class="exam-no">' + (partA ? 'A' : 'B') + num + '.</span>' +
      (review ? '<span class="badge ' + (it.got === it.pts ? 'green' : (it.got > 0 ? 'amber' : 'rose')) + '">' + MM.n(it.got) + ' / ' + it.pts + '</span> ' : '') +
      '</div>' +
      '<div class="qtext" style="font-size:1rem">' + biB(it.ex.q, 'div') + '</div>' +
      it.ex.fields.map(f => examField(it, i, f, review)).join('') +
      (review ? '<details class="sol"><summary>' + bi(UI.solution) + '</summary><div class="sol-body"><ol class="steps">' +
        it.ex.solution.map(s => '<li>' + biB(s, 'div') + '</li>').join('') + '</ol></div></details>' : '') +
      '</div>';
  }

  V.examRun = function () {
    const s = MM.exam.state;
    if (!s) return V.exam();
    const items = s.items;
    const aItems = items.filter(x => x.part === 'A');
    return '<div class="row between">' +
        '<h1 style="margin:0">📝 ' + bi(UI.examTitle) + (s.short ? ' ⏱️' : '') + '</h1>' +
        '<span class="exam-timer" id="examTimer">⏳ --:--</span>' +
      '</div>' +
      '<div class="card"><h2>' + bi(UI.partA) + '</h2>' +
        biB(T('Escribe solo la respuesta.', 'Ieraksti tikai atbildi.'), 'p') +
        items.map((it, i) => it.part === 'A' ? examQuestion(it, i, false) : '').join('') +
      '</div>' +
      '<div class="card"><h2>' + bi(UI.partB) + '</h2>' +
        '<div class="note warn">' + biB(UI.partBNote, 'div') + '</div>' +
        items.map((it, i) => it.part === 'B' ? examQuestion(it, i, false) : '').join('') +
      '</div>' +
      '<div class="card center">' +
        '<button class="btn primary big" data-act="exam-submit">✅ ' + bi(UI.examFinish) + '</button>' +
      '</div>';
  };

  V.examResults = function () {
    const s = MM.exam.state, r = s.result;
    const pct = Math.round(r.score / r.max * 100);
    const face = pct >= 85 ? '🏆' : (pct >= 70 ? '🎉' : (pct >= 50 ? '💪' : '🌱'));
    const rows = Object.keys(r.byTopic).map(tid => {
      const t = MM.topic(tid), v = r.byTopic[tid];
      const p = Math.round(v.got / v.max * 100);
      return { tid: tid, name: t ? t.emoji + ' ' + bi(t.name) : tid, got: v.got, max: v.max, p: p };
    }).sort((a, b) => a.p - b.p);

    return '<div class="card center">' +
        '<div style="font-size:3rem;line-height:1">' + face + '</div>' +
        '<h1>' + bi(UI.examScore) + '</h1>' +
        '<div class="scorebig">' + MM.n(r.score) + ' / ' + r.max + '</div>' +
        '<p><b>' + pct + ' %</b> · ' + r.minutes + ' min</p>' +
        '<div class="btn-row" style="justify-content:center">' +
          '<button class="btn primary" data-act="exam-start">🔄 ' + bi(UI.examAgain) + '</button>' +
          '<button class="btn ghost" data-act="go" data-href="#/errores">🧾 ' + bi(UI.errTitle) + '</button>' +
        '</div>' +
      '</div>' +

      '<div class="card"><h2>🎯 ' + bi(UI.examByTopic) + '</h2>' +
        '<p class="muted">' + MM.txt(T('Empieza a repasar por arriba.', 'Sāc atkārtot no augšas.')) + '</p>' +
        rows.map(r2 => '<div style="margin:.5rem 0"><div class="row between" style="font-size:.9rem">' +
          '<span>' + r2.name + '</span><span class="muted">' + MM.n(r2.got) + '/' + r2.max + ' · ' + r2.p + ' %</span></div>' +
          '<div class="bar"><i style="width:' + r2.p + '%"></i></div>' +
          '<div style="margin-top:.2rem"><button class="btn sm ghost" data-act="go" data-href="#/practica/' + r2.tid + '">▶︎ ' + MM.txt(UI.practice) + '</button></div>' +
          '</div>').join('') +
      '</div>' +

      '<div class="card"><h2>🔍 ' + bi(UI.examReview) + '</h2>' +
        s.items.map((it, i) => examQuestion(it, i, true)).join('') +
      '</div>';
  };

})(typeof window !== 'undefined' ? window : globalThis);
