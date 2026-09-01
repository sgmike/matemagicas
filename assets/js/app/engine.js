/* =========================================================
   Motor de las rondas de práctica
   Elige los ejercicios, corrige, guarda el progreso y
   controla el modo dúo (por turnos).
   ========================================================= */
(function (global) {
  'use strict';
  const MM = global.MM;

  /* ---------- elección inteligente de ejercicios ---------- */
  function weightFor(def, prof, level) {
    const g = prof.gens[def.id];
    let w = 10;
    if (def.level > level) w *= 0.35;                 // todavía es pronto para este tipo
    if (def.level < level - 1) w *= 0.6;              // ya está muy visto
    if (g && g.att >= 3) {
      const rate = g.ok / g.att;
      w *= (1.6 - rate);                              // insiste en lo que falla
    } else {
      w *= 1.25;                                      // tipos nuevos, un poco más probables
    }
    return Math.max(1, w);
  }

  function pickWeighted(rng, list, weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = rng.next() * total;
    for (let i = 0; i < list.length; i++) { r -= weights[i]; if (r <= 0) return list[i]; }
    return list[list.length - 1];
  }

  /** elige n generadores de un tema, sin repetir dos seguidos si se puede */
  function chooseGens(topicId, n, rng) {
    const prof = MM.store.p();
    const level = MM.store.levelFor(topicId);
    const defs = MM.gen.byTopic(topicId);
    if (!defs.length) return [];
    const out = [];
    let last = null;
    for (let i = 0; i < n; i++) {
      const pool = defs.length > 1 ? defs.filter(d => d.id !== last) : defs;
      const w = pool.map(d => weightFor(d, prof, level));
      const pick = pickWeighted(rng, pool, w);
      out.push(pick.id); last = pick.id;
    }
    return out;
  }

  /** mezcla de todos los temas, con el peso que tienen en el examen */
  function chooseMixed(n, rng, part) {
    const prof = MM.store.p();
    const defs = MM.gen.all().filter(d => !part || d.part === part);
    const w = defs.map(d => {
      const topic = MM.topic(d.topic);
      return (topic ? topic.w : 5) * weightFor(d, prof, MM.store.levelFor(d.topic)) / 10;
    });
    const out = [];
    for (let i = 0; i < n; i++) out.push(pickWeighted(rng, defs, w).id);
    return out;
  }

  const engine = {
    session: null,

    /**
     * opts = { mode, topic, len, items:[{gen,seed}], duo:bool, title }
     */
    start(opts) {
      const len = opts.len || MM.store.settings.sessionLen || 10;
      const rng = MM.rng(opts.seed || (Date.now() % 1e9));
      let items = opts.items;
      if (!items) {
        const gens = opts.topic ? chooseGens(opts.topic, len, rng) : chooseMixed(len, rng);
        items = gens.map(g => ({ gen: g, seed: rng.int(1, 999999) }));
      }
      const duoPlayers = opts.duo ? MM.store.profiles().slice(0, 2).map(p => p.id) : null;
      this.session = {
        mode: opts.mode || 'topic',
        topic: opts.topic || null,
        title: opts.title || null,
        fromMistakes: opts.mode === 'mistakes',
        items: items.map(it => ({
          gen: it.gen, seed: it.seed, ex: MM.gen.make(it.gen, it.seed),
          state: 'pending', given: {}, checked: false
        })).filter(it => it.ex),
        idx: 0,
        started: Date.now(),
        correct: 0, wrong: 0, revealed: 0, xp: 0,
        duo: duoPlayers && duoPlayers.length > 1 ? { players: duoPlayers, turn: 0, score: {} } : null
      };
      if (this.session.duo) this.session.duo.players.forEach(p => { this.session.duo.score[p] = 0; });
      return this.session;
    },

    item() { const s = this.session; return s ? s.items[s.idx] : null; },
    total() { return this.session ? this.session.items.length : 0; },
    done() { const s = this.session; return s ? s.idx >= s.items.length : true; },

    /** perfil al que se le apunta la respuesta actual */
    currentProfile() {
      const s = this.session;
      if (s && s.duo) return MM.store.data.profiles[s.duo.players[s.duo.turn % s.duo.players.length]];
      return MM.store.p();
    },

    /** corrige la respuesta; devuelve {ok, fields:[bool]} */
    check(values) {
      const it = this.item();
      if (!it || it.checked) return null;
      const res = it.ex.fields.map(f => MM.checkField(f, values[f.key]));
      const ok = res.every(Boolean);
      it.checked = true;
      it.given = values;
      it.state = it.state === 'revealed' ? 'revealed' : (ok ? 'ok' : 'bad');
      const prof = this.currentProfile();
      const s = this.session;

      if (it.state !== 'revealed') {
        if (ok) { s.correct++; if (s.duo) s.duo.score[prof.id] += 10; }
        else s.wrong++;
      }
      const gained = it.state === 'revealed' ? 2 : (ok ? (8 + 4 * (it.ex.level || 1)) : 2);
      s.xp += gained;
      const newLevel = MM.store.addXp(gained, prof);

      MM.store.record({
        topic: it.ex.topic, gen: it.gen, seed: it.seed,
        correct: ok && it.state !== 'revealed',
        given: Object.values(values).join(' | '),
        fromMistake: s.fromMistakes
      }, prof);

      return { ok: ok, fields: res, levelUp: newLevel, xp: gained };
    },

    /** muestra la solución sin puntuar (siempre disponible) */
    reveal() {
      const it = this.item();
      if (!it || it.checked) return;
      it.state = 'revealed';
      this.session.revealed++;
    },

    next() {
      const s = this.session;
      if (!s) return;
      if (s.duo) s.duo.turn++;
      s.idx++;
      return s.idx < s.items.length;
    },

    /** vuelve a generar el ejercicio actual con otra semilla */
    reroll() {
      const it = this.item();
      if (!it) return;
      const seed = MM.gen.newSeed();
      const ex = MM.gen.make(it.gen, seed);
      if (ex) { it.seed = seed; it.ex = ex; it.state = 'pending'; it.checked = false; it.given = {}; }
    },

    /** resumen final */
    summary() {
      const s = this.session;
      if (!s) return null;
      const mins = Math.max(1, Math.round((Date.now() - s.started) / 60000));
      const failed = s.items.filter(i => i.state === 'bad' || i.state === 'revealed');
      return {
        total: s.items.length, correct: s.correct, wrong: s.wrong, revealed: s.revealed,
        xp: s.xp, minutes: mins, failed: failed.map(i => ({ gen: i.gen, seed: i.seed })),
        duo: s.duo
      };
    }
  };

  MM.engine = engine;
  MM.engine.chooseGens = chooseGens;
  MM.engine.chooseMixed = chooseMixed;

  /* ---------- sonidos discretos ---------- */
  let audioCtx = null;
  MM.beep = function (kind) {
    if (!MM.store.settings.sound) return;
    try {
      audioCtx = audioCtx || new (global.AudioContext || global.webkitAudioContext)();
      const notes = kind === 'ok' ? [660, 880] : (kind === 'bad' ? [220, 175] : [523, 659, 784]);
      notes.forEach((f, i) => {
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.09, audioCtx.currentTime + 0.02 + i * 0.09);
        g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.22 + i * 0.09);
        o.connect(g); g.connect(audioCtx.destination);
        o.start(audioCtx.currentTime + i * 0.09); o.stop(audioCtx.currentTime + 0.3 + i * 0.09);
      });
    } catch (e) { /* sin sonido, da igual */ }
  };

})(typeof window !== 'undefined' ? window : globalThis);
