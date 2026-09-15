/* =========================================================
   MateMágicas · almacenamiento del progreso
   Todo se guarda en el navegador (localStorage). Hay export/import
   en Ajustes para llevarse el progreso a otro dispositivo.
   ========================================================= */
(function (global) {
  'use strict';
  const MM = global.MM || (global.MM = {});
  const KEY = 'matemagicas.v1';

  const DEFAULT_SETTINGS = {
    lang: 'both',
    theme: 'auto',
    examDate: '2027-04-24',   // sábado de finales de abril (fecha habitual del examen)
    sessionLen: 10,
    duo: false,
    sound: true,
    parentPin: '1234',        // PIN del panel de padres
    weeklyGoal: 300,          // puntos por semana para el premio
    dailyGoal: 60             // puntos al día
  };

  function blankProfile(id, name, avatar) {
    return {
      id, name, avatar,
      created: MM.today(),
      xp: 0,
      streak: { last: null, days: 0, best: 0 },
      topics: {},          // idTema -> {att, ok, ema, last}
      gens: {},            // idGenerador -> {att, ok}
      mistakes: [],        // {gen, seed, topic, given, when}
      exams: [],           // {when, part, score, max, byTopic, minutes}
      daily: {},           // 'YYYY-MM-DD' -> {a, c}
      plan: {},            // semana -> true
      read: {},            // idTema -> true (lección leída)
      points: {},          // 'YYYY-MM-DD' -> {t:total, juego, practica, reto, simulacro}
      game: { levels: {}, history: [] },   // 'tema:n' -> {done, stars, best, first}
      rewards: {}          // 'YYYY-MM-DD' (lunes) -> {given, note}
    };
  }

  /** lunes de la semana a la que pertenece una fecha 'YYYY-MM-DD' */
  MM.weekStart = function (day) {
    const d = new Date((day || MM.today()) + 'T12:00:00');
    const wd = (d.getDay() + 6) % 7;            // lunes = 0
    d.setDate(d.getDate() - wd);
    return MM.today(d);
  };
  MM.addDays = function (day, n) {
    const d = new Date(day + 'T12:00:00'); d.setDate(d.getDate() + n); return MM.today(d);
  };

  function blank() {
    return {
      v: 1,
      active: 'p1',
      profiles: { p1: blankProfile('p1', 'Yo', '🦊') },
      settings: Object.assign({}, DEFAULT_SETTINGS)
    };
  }

  const store = {
    data: blank(),

    load() {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          const d = JSON.parse(raw);
          if (d && d.profiles) {
            this.data = d;
            this.data.settings = Object.assign({}, DEFAULT_SETTINGS, d.settings || {});
            Object.values(this.data.profiles).forEach(p => {
              const b = blankProfile(p.id, p.name, p.avatar);
              Object.keys(b).forEach(k => { if (p[k] === undefined) p[k] = b[k]; });
            });
          }
        }
      } catch (e) { console.warn('No se pudo leer el progreso guardado', e); }
      if (!this.data.profiles[this.data.active]) this.data.active = Object.keys(this.data.profiles)[0];
      return this.data;
    },

    save() {
      try { localStorage.setItem(KEY, JSON.stringify(this.data)); }
      catch (e) { console.warn('No se pudo guardar el progreso', e); }
    },

    /* ---------- perfiles ---------- */
    p() { return this.data.profiles[this.data.active]; },
    profiles() { return Object.values(this.data.profiles); },
    setActive(id) { if (this.data.profiles[id]) { this.data.active = id; this.save(); } },
    addProfile(name, avatar) {
      const id = 'p' + (Date.now().toString(36));
      this.data.profiles[id] = blankProfile(id, name || 'Nuevo', avatar || '🐣');
      this.data.active = id; this.save();
      return id;
    },
    renameProfile(id, name, avatar) {
      const p = this.data.profiles[id]; if (!p) return;
      if (name) p.name = name; if (avatar) p.avatar = avatar; this.save();
    },
    deleteProfile(id) {
      if (Object.keys(this.data.profiles).length <= 1) return false;
      delete this.data.profiles[id];
      if (this.data.active === id) this.data.active = Object.keys(this.data.profiles)[0];
      this.save(); return true;
    },

    /* ---------- ajustes ---------- */
    get settings() { return this.data.settings; },
    set(k, v) { this.data.settings[k] = v; this.save(); },

    /* ---------- experiencia y racha ---------- */
    level(p) { p = p || this.p(); return 1 + Math.floor(p.xp / 150); },
    levelProgress(p) { p = p || this.p(); return (p.xp % 150) / 150; },
    addXp(n, p) {
      p = p || this.p();
      const before = this.level(p);
      p.xp += n;
      const after = this.level(p);
      this.save();
      return after > before ? after : 0;     // devuelve el nuevo nivel si subió
    },
    touchStreak(p) {
      p = p || this.p();
      const t = MM.today();
      if (p.streak.last === t) return p.streak;
      const yest = MM.today(new Date(Date.now() - 86400000));
      p.streak.days = (p.streak.last === yest) ? p.streak.days + 1 : 1;
      p.streak.last = t;
      p.streak.best = Math.max(p.streak.best || 0, p.streak.days);
      this.save();
      return p.streak;
    },

    /* ---------- registro de respuestas ---------- */
    record(o, p) {                     // {topic, gen, seed, correct, revealed, given}
      p = p || this.p();
      const t = p.topics[o.topic] || (p.topics[o.topic] = { att: 0, ok: 0, ema: 0, last: null });
      t.att++; if (o.correct) t.ok++;
      const w = 0.22;                                   // media móvil: pesa lo reciente
      t.ema = t.att === 1 ? (o.correct ? 1 : 0) : t.ema * (1 - w) + (o.correct ? 1 : 0) * w;
      t.last = MM.today();

      const g = p.gens[o.gen] || (p.gens[o.gen] = { att: 0, ok: 0 });
      g.att++; if (o.correct) g.ok++;

      const day = p.daily[MM.today()] || (p.daily[MM.today()] = { a: 0, c: 0 });
      day.a++; if (o.correct) day.c++;

      if (!o.correct && !o.exam) {
        p.mistakes = p.mistakes.filter(m => !(m.gen === o.gen && m.seed === o.seed));
        p.mistakes.unshift({ gen: o.gen, seed: o.seed, topic: o.topic, given: (o.given || '').slice(0, 40), when: MM.today() });
        if (p.mistakes.length > 250) p.mistakes.length = 250;
      }
      if (o.correct && o.fromMistake) {
        p.mistakes = p.mistakes.filter(m => !(m.gen === o.gen && m.seed === o.seed));
      }
      this.touchStreak(p);
      this.save();
    },
    forgetMistake(gen, seed, p) {
      p = p || this.p();
      p.mistakes = p.mistakes.filter(m => !(m.gen === gen && m.seed === seed));
      this.save();
    },

    /* ---------- dominio por tema ---------- */
    topicStat(topicId, p) {
      p = p || this.p();
      return p.topics[topicId] || { att: 0, ok: 0, ema: 0, last: null };
    },
    stars(topicId, p) {
      const t = this.topicStat(topicId, p);
      if (t.att >= 40 && t.ema >= 0.85) return 3;
      if (t.att >= 22 && t.ema >= 0.7) return 2;
      if (t.att >= 8 && t.ema >= 0.5) return 1;
      return 0;
    },
    mastery(topicId, p) {                     // 0..1 para la barra
      const t = this.topicStat(topicId, p);
      if (!t.att) return 0;
      const vol = Math.min(1, t.att / 40);
      return Math.max(0.03, 0.45 * vol + 0.55 * t.ema * Math.min(1, t.att / 8));
    },
    /** nivel de dificultad sugerido 1..3 según cómo va el tema */
    levelFor(topicId, p) {
      const t = this.topicStat(topicId, p);
      if (t.att < 6) return 1;
      if (t.ema >= 0.85 && t.att >= 18) return 3;
      if (t.ema >= 0.62) return 2;
      return 1;
    },

    /* ---------- puntos (para el juego y el panel de padres) ---------- */
    addPoints(n, source, p) {
      p = p || this.p();
      if (!n) return;
      const day = p.points[MM.today()] || (p.points[MM.today()] = { t: 0 });
      day.t += n;
      day[source || 'otro'] = (day[source || 'otro'] || 0) + n;
      this.save();
    },
    pointsBetween(from, to, p) {          // ambos inclusive
      p = p || this.p();
      let t = 0;
      Object.keys(p.points).forEach(d => { if (d >= from && d <= to) t += p.points[d].t || 0; });
      return t;
    },
    pointsWeek(monday, p) { return this.pointsBetween(monday, MM.addDays(monday, 6), p); },
    pointsTotal(p) { p = p || this.p(); return Object.values(p.points).reduce((a, d) => a + (d.t || 0), 0); },
    /** resumen de una semana para el panel de padres */
    weekSummary(monday, p) {
      p = p || this.p();
      const end = MM.addDays(monday, 6);
      let pts = 0, days = 0, a = 0, c = 0; const by = {};
      for (let i = 0; i < 7; i++) {
        const d = MM.addDays(monday, i);
        const pd = p.points[d]; const dd = p.daily[d];
        if (pd && pd.t) { pts += pd.t; days++; Object.keys(pd).forEach(k => { if (k !== 't') by[k] = (by[k] || 0) + pd[k]; }); }
        if (dd) { a += dd.a; c += dd.c; }
      }
      const levels = (p.game.history || []).filter(h => h.d >= monday && h.d <= end).length;
      return { monday: monday, end: end, pts: pts, days: days, answered: a, correct: c, levels: levels, by: by,
               reward: p.rewards[monday] || null };
    },

    /* ---------- exportar / importar ---------- */
    exportJson() { return JSON.stringify(this.data, null, 2); },
    importJson(text) {
      const d = JSON.parse(text);
      if (!d || !d.profiles) throw new Error('Archivo no válido');
      this.data = d;
      this.data.settings = Object.assign({}, DEFAULT_SETTINGS, d.settings || {});
      if (!this.data.profiles[this.data.active]) this.data.active = Object.keys(this.data.profiles)[0];
      this.save();
    },
    resetAll() { this.data = blank(); this.save(); }
  };

  MM.store = store;
})(typeof window !== 'undefined' ? window : globalThis);
