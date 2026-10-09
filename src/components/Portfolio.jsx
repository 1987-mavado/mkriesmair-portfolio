// Generated from the design handoff (Portfolio Site v11) by scripts/convert.mjs + scripts/assemble.mjs,
// then maintained by hand.
import React from 'react';
import Slot from './Slot.jsx';
import slots from '../data/slots.json';

const css = (s) => {
  const o = {};
  for (const d of s.split(';')) {
    const i = d.indexOf(':');
    if (i < 0) continue;
    let k = d.slice(0, i).trim();
    let v = d.slice(i + 1).trim();
    if (!k) continue;
    const imp = /\s*!important$/.test(v);
    if (imp) v = v.replace(/\s*!important$/, '');
    if (!k.startsWith('--')) k = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    o[k] = v;
  }
  return o;
};

import paths from '../data/paths.json';

const hasDOM = typeof window !== 'undefined';

// i18n: English is the source language; German strings are looked up by their English text.
import DE from '../i18n/de.json';
let LANG = 'en';
const T = (s) => { if (LANG !== 'de') return s; const k = s.trim(); return k in DE.ui ? s.replace(k, () => DE.ui[k]) : s; };
// Case study URLs (same slug in both languages). Opening a case pushes its URL, so the
// browser's back button closes it and the address can be shared or opened directly.
export const CASE_SLUGS = { ducati: 'ducati', o2: 'o2-record-race', bmw2: 'bmw-2', tonline: 't-online', bmw1: 'bmw-1', bmwx4: 'bmw-x4', aokback: 'aok-ruecken', union: 'union-investment', yelp: 'yelp', saturn: 'saturn-tech-nick', db: 'deutsche-bahn' };
export const caseUrl = (lang, key) => (lang === 'de' ? '' : '/en') + '/cases/' + CASE_SLUGS[key] + '/';
const EN = (v) => (LANG === 'de' ? null : 'EN: ' + v);
const PAT = [[/^Play video: /, 'Video abspielen: '], [/^Play audio: /, 'Audio abspielen: '], [/ — image (\d+) of (\d+)$/, ' — Bild $1 von $2'], [/ — case image/, ' — Case-Bild'], [/ — film (\d+)$/, ' — Film $1']];
const tr = (v) => {
  if (LANG !== 'de' || v == null) return v;
  if (typeof v === 'string') { if (v in DE.data) return DE.data[v]; let o = v; for (const [re, r] of PAT) o = o.replace(re, r); return o; }
  if (Array.isArray(v)) return v.map(tr);
  if (typeof v === 'object') { if (v.$$typeof || 'current' in v || Object.getPrototypeOf(v) !== Object.prototype) return v; const o = {}; for (const k in v) o[k] = tr(v[k]); return o; }
  return v;
};

export default class Portfolio extends React.Component {
  static defaultProps = { aiImagesInline: false };
  getAudio(src) {
    if (!this._au || this._au.dataset.src !== src) {
      if (this._au) this._au.pause();
      const a = new Audio(src); a.preload = 'metadata'; a.dataset.src = src; this._au = a;
      const up = () => this.setState({ au: { src, playing: !a.paused, t: a.currentTime, dur: a.duration || 0 } });
      ['play','pause','timeupdate','loadedmetadata','ended'].forEach(e => a.addEventListener(e, up));
    }
    return this._au;
  }
  toggleAudio(src) { const a = this.getAudio(src); if (a.paused) { document.querySelectorAll('video').forEach(v => { if (!v.muted) v.pause(); }); a.play().catch(() => {}); } else a.pause(); }
  seekAudio(src, f) { const a = this.getAudio(src); const go = () => { a.currentTime = Math.max(0, Math.min(1, f)) * a.duration; }; if (a.duration) go(); else a.addEventListener('loadedmetadata', go, { once: true }); }
  state = { open: this.props.openKey ? { [this.props.openKey]: true } : {}, grid: null, aiFine: null, heroPortrait: null };
  aiFolRef = React.createRef();
  ceWrapRef = React.createRef();
  ceSvgRef = React.createRef();
  ceVisRef = React.createRef();
  clockRef = React.createRef();
  scRef = React.createRef();
  cntRef = React.createRef();
  goTo(i) { const sc = this.scRef.current; if (!sc || !sc.children[i]) return; const pl = parseFloat(getComputedStyle(sc).paddingLeft) || 0; sc.scrollTo({ left: sc.children[i].offsetLeft - pl, behavior: 'smooth' }); }
  cur() { const sc = this.scRef.current; if (!sc) return 0; const pl = parseFloat(getComputedStyle(sc).paddingLeft) || 0; let best = 0, d = 1e9; [...sc.children].forEach((c, i) => { const x = Math.abs(c.offsetLeft - pl - sc.scrollLeft); if (x < d) { d = x; best = i; } }); return best; }
  componentDidMount() {
    this._mounted = true; this.forceUpdate();
    if (Object.keys(this.state.open || {}).length) document.body.style.overflow = 'hidden';
    this._pop = e => { const k = e.state && e.state.case; if (this._setOpen) this._setOpen(k || null, !!k, true); };
    window.addEventListener('popstate', this._pop);
    this._syncLang();
    // Deep links from the service pages (/#case-…): bring the work slider to that case and open it.
    const hash = decodeURIComponent(window.location.hash || '');
    if (hash.startsWith('#case-')) this._deep = setTimeout(() => {
      const el = document.getElementById(hash.slice(1)); const sc = this.scRef.current;
      if (!el || !sc) return;
      document.getElementById('work').scrollIntoView({ behavior: 'instant' });
      const i = [...sc.children].indexOf(el); if (i >= 0) this.goTo(i);
      const btn = el.querySelector('button[aria-expanded]'); if (btn) btn.click();
    }, 500);
    const fmt = new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const tick = () => { if (this.clockRef.current) this.clockRef.current.textContent = fmt.format(new Date()); };
    tick(); this._clock = setInterval(tick, 1000);
    this._fade = () => {
      const vh = window.innerHeight;
      document.querySelectorAll('[data-fade]').forEach(box => {
        const r = box.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (r.height + vh * 0.3)));
        const ws = box.querySelectorAll('[data-w]'); const n = ws.length;
        ws.forEach((w, i) => { const t = Math.max(0, Math.min(1, p * n * 1.2 - i)); w.style.opacity = String(0.16 + 0.84 * t); });
      });
    };
    window.addEventListener('scroll', this._fade, true); window.addEventListener('resize', this._fade);
    setTimeout(this._fade, 50);
    this._key = () => {};
    window.addEventListener('keydown', this._key);
    this._esc = e => { if (e.key === 'Escape' && !this.state.lb && Object.keys(this.state.open || {}).length) this._setOpen(null, false); };
    window.addEventListener('keydown', this._esc);
    const clean = () => document.querySelectorAll('image-slot[data-logo]').forEach(el => { const r = el.shadowRoot; if (r && !r.querySelector('style[data-logo]')) { const st = document.createElement('style'); st.setAttribute('data-logo', ''); st.textContent = '.frame{background:transparent!important}.ring{display:none!important}'; r.appendChild(st); } });
    clean(); setTimeout(clean, 300); setTimeout(clean, 1500);
    this._logoSrc = () => document.querySelectorAll('img[data-src],iframe[data-src]').forEach(im => { const s = im.getAttribute('data-src'); if (s && !s.includes('{{') && im.getAttribute('src') !== s) im.setAttribute('src', s); });
    this._logoSrc(); setTimeout(this._logoSrc, 100);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) this.setState({ reduceM: true });
    const ease = t => 1 - Math.pow(1 - t, 3);
    const run = el => {
      if (reduce) return;
      const t0 = performance.now();
      if (el.dataset.count) {
        const to = +el.dataset.count, suf = el.dataset.suffix || '', dur = 2400;
        const f = now => { const p = Math.min(1, (now - t0) / dur); el.textContent = Math.round(to * ease(p)) + suf; if (p < 1) requestAnimationFrame(f); };
        el.textContent = '0' + suf; requestAnimationFrame(f);
      } else {
        const tgt = el.dataset.scramble, dur = 2200, abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let last = 0;
        const f = now => { const p = Math.min(1, (now - t0) / dur); if (now - last > 70 || p === 1) { last = now; const fixed = Math.floor(ease(p) * tgt.length); el.textContent = [...tgt].map((c, i) => i < fixed || !/[A-Z]/.test(c) ? c : abc[Math.floor(Math.random() * 26)]).join(''); } if (p < 1) requestAnimationFrame(f); else el.textContent = tgt; };
        requestAnimationFrame(f);
      }
    };
    this._io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { this._io.unobserve(e.target); run(e.target); } }), { threshold: 0.6 });
    document.querySelectorAll('[data-count],[data-scramble]').forEach(el => this._io.observe(el));

    const fineMq = window.matchMedia('(hover: hover) and (pointer: fine)');
    this._aiMq = () => this.setState({ aiFine: fineMq.matches });
    this._aiMq(); fineMq.addEventListener('change', this._aiMq); this._fineMq = fineMq;
    const portMq = window.matchMedia('(orientation: portrait)');
    this._portFn = () => this.setState({ heroPortrait: portMq.matches });
    this._portFn(); portMq.addEventListener('change', this._portFn); this._portMq = portMq;
    const st = { x: 0, y: 0, tx: 0, ty: 0, s: .9, ts: .9, act: -1, raf: 0, cyc: 0, fr: 0 }; this._aiSt = st;
    const FW = 320, FH = 220, OX = 28, OY = 24;
    const fol = () => this.aiFolRef.current;
    const setRows = i => document.querySelectorAll('[data-ai-row]').forEach(r => { r.style.opacity = i < 0 || +r.dataset.aiRow === i ? '1' : '.35'; });
    const showGrp = i => { const f = fol(); if (!f) return; clearInterval(st.cyc); f.querySelectorAll('[data-ai-grp]').forEach(g => { const on = +g.dataset.aiGrp === i; g.style.opacity = on ? '1' : '0'; if (!on) return; f.style.height = (g.dataset.aiH || 220) + 'px'; const fr = g.querySelectorAll('[data-ai-frame]'); st.fr = 0; fr.forEach((x, k) => { x.style.opacity = k === 0 ? '1' : '0'; }); if (fr.length > 1 && !reduce) st.cyc = setInterval(() => { fr[st.fr].style.opacity = '0'; st.fr = (st.fr + 1) % fr.length; fr[st.fr].style.opacity = '1'; }, 1200); }); };
    const place = (cx, cy) => { let x = cx + OX, y = cy + OY; if (x + FW > window.innerWidth - 12) x = cx - OX - FW; if (y + FH > window.innerHeight - 12) y = window.innerHeight - 12 - FH; st.tx = x; st.ty = y; };
    const apply = () => { const f = fol(); if (f) f.style.transform = 'translate3d(' + st.x + 'px,' + st.y + 'px,0) scale(' + st.s + ')'; };
    const loop = () => { st.x += (st.tx - st.x) * .16; st.y += (st.ty - st.y) * .16; st.s += (st.ts - st.s) * .3; apply(); st.raf = Math.abs(st.tx - st.x) + Math.abs(st.ty - st.y) + Math.abs(st.ts - st.s) > .05 ? requestAnimationFrame(loop) : 0; };
    const kick = () => { if (!st.raf) st.raf = requestAnimationFrame(loop); };
    const hide = () => { const f = fol(); st.act = -1; setRows(-1); clearInterval(st.cyc); if (f) f.style.opacity = '0'; st.ts = .9; };
    this._aiMove = e => {
      const f = fol(); if (!f) return;
      const row = e.target && e.target.closest ? e.target.closest('[data-ai-row]') : null;
      const i = row ? +row.dataset.aiRow : -1;
      if (i !== st.act) {
        if (i < 0) { hide(); return; }
        st.act = i; setRows(i); showGrp(i);
        if (reduce) { const r = row.getBoundingClientRect(); st.x = st.tx = Math.max(12, Math.min(window.innerWidth - FW - 12, r.right - FW)); st.y = st.ty = r.top + (r.height - FH) / 2; st.s = st.ts = 1; apply(); f.style.opacity = '1'; return; }
        if (f.style.opacity !== '1') { place(e.clientX, e.clientY); st.x = st.tx; st.y = st.ty; st.s = .9; apply(); }
        f.style.opacity = '1'; st.ts = 1;
      }
      if (!reduce) { place(e.clientX, e.clientY); kick(); }
    };
    this._aiScroll = () => { if (st.act >= 0) hide(); };
    window.addEventListener('pointermove', this._aiMove, { passive: true });
    window.addEventListener('scroll', this._aiScroll, { passive: true });
    const sc = this.scRef.current;
    if (sc) {
      const upd = () => { if (this.cntRef.current) this.cntRef.current.textContent = String(this.cur() + 1).padStart(2, '0'); };
      sc.addEventListener('scroll', upd, { passive: true });
      let down = null;
      sc.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.target.closest('a,button')) return; down = { x: e.clientX, l: sc.scrollLeft, moved: false }; sc.style.scrollSnapType = 'none'; sc.style.cursor = 'grabbing'; });
      window.addEventListener('pointermove', this._pm = e => { if (!down) return; const dx = e.clientX - down.x; if (Math.abs(dx) > 4) down.moved = true; sc.scrollLeft = down.l - dx; });
      window.addEventListener('pointerup', this._pu = () => { if (!down) return; const i = this.cur(); down = null; sc.style.cursor = ''; sc.style.scrollSnapType = ''; this.goTo(i); });
    }
    const vis = this.ceVisRef.current;
    if (vis) {
      const P = [['M528 352 C480 300 480 200 426 200','#4285F4'],['M508 405 C480 408 455 414 426 414','#FBBC04'],['M528 458 C480 505 480 570 430 570','#EA4335'],['M660 388 C700 362 725 352 780 352 L950 352 C1020 352 1015 245 1077 238','#34A853'],['M664 418 C850 424 1000 432 1157 432','#4285F4'],['M640 462 C680 540 700 592 780 592 L1108 592','#FBBC04']];
      vis.innerHTML = '<defs><mask id="ceHead" maskUnits="userSpaceOnUse" x="0" y="0" width="1550" height="1015"><image href="' + '/assets/concept-chef-mask.png' + '" x="0" y="0" width="1550" height="1015"/></mask></defs><g mask="url(#ceHead)">' + P.map(([d, c], i) => '<path data-draw="' + i + '" d="' + d + '" pathLength="1000" fill="none" stroke="' + c + '" stroke-width="6" stroke-linecap="round" stroke-dasharray="1000" stroke-dashoffset="1000" style="transition:stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1) ' + (0.3 + i * 0.18).toFixed(2) + 's"/>').join('') + '</g>';
    }
    this._ceIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.dataset.shown = '1'; this.revealDraw(e.target); this._ceIO.unobserve(e.target); } }), { threshold: 0.35 });
    if (this.ceWrapRef.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) this.ceWrapRef.current.querySelectorAll('[data-ce-card]').forEach(c => { c.style.opacity = '0'; });
    [vis && vis.parentNode, this.ceWrapRef.current].forEach(el => el && this._ceIO.observe(el));
    const wrap = this.ceWrapRef.current;
    if (!wrap) return;
    this._ro = new ResizeObserver(() => this.drawLines());
    this._ro.observe(wrap);
    const img = wrap.querySelector('[data-ce-img]');
    if (img) img.addEventListener('load', () => this.drawLines());
    this.drawLines();
  }
  componentDidUpdate() { this._logoSrc && this._logoSrc(); }
  componentDidUpdate() { this._syncLang(); }
  // Language switch follows the open case: DE | EN then lead to that case in the other language.
  _syncLang() { const k = Object.keys(this.state.open || {})[0]; document.querySelectorAll('a[data-lang-switch]').forEach(a => { if (!a.dataset.base) a.dataset.base = a.getAttribute('href'); a.setAttribute('href', k ? caseUrl(a.getAttribute('data-lang-switch'), k) : a.dataset.base); }); }
  componentWillUnmount() { window.removeEventListener('popstate', this._pop); document.body.style.overflow = ''; clearTimeout(this._deep); this._portMq && this._portMq.removeEventListener('change', this._portFn); if (this._au) this._au.pause(); this._ceIO && this._ceIO.disconnect(); window.removeEventListener('pointermove', this._aiMove); window.removeEventListener('scroll', this._aiScroll); this._fineMq && this._fineMq.removeEventListener('change', this._aiMq); this._aiSt && clearInterval(this._aiSt.cyc); this._ro && this._ro.disconnect(); window.removeEventListener('keydown', this._key); window.removeEventListener('keydown', this._esc); document.body.style.overflow = ''; this._io && this._io.disconnect(); window.removeEventListener('pointermove', this._pm); window.removeEventListener('pointerup', this._pu); clearInterval(this._clock); window.removeEventListener('scroll', this._fade, true); window.removeEventListener('resize', this._fade); }
  revealDraw(root) {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.querySelectorAll('[data-draw]').forEach(p => { if (rm) p.style.transition = 'none'; p.style.strokeDashoffset = '0'; });
    root.querySelectorAll('[data-strike]').forEach(p => { if (rm) p.style.transition = 'none'; p.style.transform = 'scaleX(1)'; });
    root.querySelectorAll('[data-ce-card]').forEach((c, i) => { c.style.opacity = ''; if (!rm && c.animate) c.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: i * 1400, easing: 'cubic-bezier(.2,0,0,1)', fill: 'backwards' }); });
  }
  drawLines() {
    const wrap = this.ceWrapRef.current, svg = this.ceSvgRef.current;
    if (!wrap || !svg) return;
    const W = wrap.getBoundingClientRect();
    const cards = [...wrap.querySelectorAll('[data-ce-card]')].map(el => { const r = el.getBoundingClientRect(); return { l:r.left-W.left, t:r.top-W.top, r:r.right-W.left, b:r.bottom-W.top, w:r.width, h:r.height }; });
    if (cards.length < 3) return;
    const sw = Math.max(2.5, Math.min(4.5, W.width / 280));
    const paths = [];
    const vCurve = (x1, y1, x2, y2, c) => { const m = (y2 - y1) / 2; paths.push([`M${x1} ${y1} C${x1} ${y1+m} ${x2} ${y2-m} ${x2} ${y2}`, c]); };
    const hCurve = (x1, y1, x2, y2, c) => { const m = (x2 - x1) / 2; paths.push([`M${x1} ${y1} C${x1+m} ${y1} ${x2-m} ${y2} ${x2} ${y2}`, c]); };
    for (let k = 0; k < 2; k++) {
      const a = cards[k], b = cards[k + 1], col = k ? '#4285F4' : '#FBBC04';
      if (Math.abs(a.t - b.t) < 4) hCurve(a.r - 2, a.t + a.h * (k ? 0.62 : 0.35), b.l + 2, b.t + b.h * (k ? 0.35 : 0.62), col);
      else vCurve(a.l + a.w * (k ? 0.7 : 0.3), a.b - 2, b.l + b.w * (k ? 0.3 : 0.7), b.t + 2, col);
    }
    svg.setAttribute('viewBox', `0 0 ${W.width} ${W.height}`);
    const shown = wrap.dataset.shown === '1';
    svg.innerHTML = paths.map(([d, c], i) => `<path data-draw="${i}" d="${d}" pathLength="1000" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="1000" stroke-dashoffset="1000" style="transition:${shown ? 'none' : 'stroke-dashoffset .9s cubic-bezier(.4,0,.2,1) ' + (0.5 + i * 1.4) + 's'};${shown ? 'stroke-dashoffset:0' : ''}"/>`).join('');
  }
  renderVals() {
    LANG = this.props.lang === 'de' ? 'de' : 'en';
    const inGerman = this._inGerman || (this._inGerman = (() => {
      const cuts = [
        { fontFamily: "'IBM Plex Sans',sans-serif", fontWeight: 200, letterSpacing: '-0.04em' },
        { fontFamily: "'Instrument Serif',serif", fontWeight: 400, letterSpacing: '-0.02em', scale: '1.08' },
        { fontFamily: "'Nunito',sans-serif", fontWeight: 300, letterSpacing: '-0.03em' },
        { fontFamily: "'Playfair Display',serif", fontWeight: 400, letterSpacing: '-0.03em' },
        { fontFamily: "'IBM Plex Mono',monospace", fontWeight: 300, letterSpacing: '-0.06em', scale: '.9' },
        { fontFamily: "'Bodoni Moda',serif", fontWeight: 400, letterSpacing: '-0.03em' }
      ];
      const dur = 9.6, step = dur / cuts.length;
      return React.createElement('em', { 'data-mk-cut': '', 'aria-label': 'in German,', style: { display: 'inline-grid', fontStyle: 'italic', justifyItems: 'start', verticalAlign: 'baseline' } },
        cuts.map((c, i) => React.createElement('span', { key: i, 'aria-hidden': 'true', style: { ...c, gridArea: '1 / 1', whiteSpace: 'nowrap', lineHeight: 'inherit', transformOrigin: '0 75%', fontStyle: 'italic', opacity: 0, animation: ['mkA','mkB','mkC','mkD','mkE','mkF'][i] + ' ' + dur + 's cubic-bezier(.4,0,.2,1) ' + (i * step) + 's infinite backwards', willChange: 'opacity, filter, transform' } }, 'in German,')));
    })());
    const f = t => ({ t, ph: /^\[.*\]$/.test(t), np: !/^\[.*\]$/.test(t) });
    const open = this.state.open;
    const setOpen = (k, v, fromHistory) => {
      document.body.style.overflow = v ? 'hidden' : ''; this.setState({ open: v ? { [k]: true } : {} });
      if (hasDOM && !fromHistory) { if (v) window.history.pushState({ case: k }, '', caseUrl(LANG, k)); else if (window.history.state && window.history.state.case) window.history.back(); }
    };
    this._setOpen = setOpen;
    const raw = [
      { key:'bmwx4', brand:'BMW X4', anchor:'case-bmwx4', slotId:'m3-case-bmwx4', slotSrc:'/assets/bmwx4-ooh-front.webp', slotHint:'BMW X4 — launch motif, out of home',
        tags:['BMW','Launch','Art direction','Print','OOH'],
        title:'A new segment, launched with attitude.',
        body:'The BMW X4 opened a new segment: the presence of a BMW X model with the line of a coupé. For Germany, we did not adapt the international launch — we built a campaign of our own, with one line that describes the car and its driver in four words.',
        de:'„Design: Coupé-artig. Charakter: Unartig.“', en:'“Design: coupé-like. Character: badly behaved.”',
        role:'Art Director', outcome:'A standalone German launch campaign in print, out of home and digital',
        challenge:'The international campaign „Embrace the Unknown“ staged the X4 as a pioneer in an urban setting. The German launch needed more than a translation: its own idea, and a reason for design-minded drivers to walk into a BMW dealership on launch day.',
        idea:'Put the driver next to the car. The lead thought „Design: Coupé-artig. Charakter: Unartig.“ speaks to people who care about aesthetics and innovation, but just as much about individuality. The campaign concentrates on two motifs made for Germany, newly composed and retouched: the three-quarter front view as the lead, the three-quarter rear view in support — both built around the coupé line.',
        did:['Art direction of a standalone launch campaign for the German market','Two key motifs with their own composition and new retouching: three-quarter front as the lead, three-quarter rear in support','Print and out of home, pointing to the launch at BMW dealers'],
        resultLabel:'Rollout in Germany', result:['Nationwide market launch on 12 July 2014 at BMW dealers','Placements used for the first time, among them a “statement button” on the cover of Beef magazine and a moiré poster at Munich Airport that makes the car appear to move as you walk past','Digital special formats, including the first ad in the n-tv app on the Samsung Galaxy Gear smartwatch'],
        srcHref:'https://www.press.bmwgroup.com/deutschland/article/detail/T0187422DE/kommunikationsstart-fuer-den-neuen-bmw-x4?language=de', srcLabel:'BMW Group PressClub, 11 July 2014',
        year:'2014', org:'Serviceplan Campaign Hamburg' },
      { key:'aokback', brand:'AOK — Liebe deinen Rücken', anchor:'case-aok-back', slotId:'m3-case-aok-back', slotSrc:'/assets/aok-ruecken-ooh.jpg', slotHint:'AOK — Liebe deinen Rücken, digital OOH',
        tags:['AOK','Health','Prevention','Digital OOH'],
        title:'Prevention, told as self-care.',
        body:'A prevention campaign on back health for AOK Baden-Württemberg. One simple gesture — people hugging themselves — turns a clinical topic into an act of self-care.',
        de:'„Liebe deinen Rücken.“', en:'“Love your back.”',
        role:'Creative concept (freelance)', outcome:'Prevention campaign in digital OOH, linking to AOK prevention offers',
        did:['Creative concept for the AOK Baden-Württemberg prevention campaign on back health','Key visual idea: the self-hug as a gesture of care','Rollout in digital OOH, pointing to aok.de/bw/ruecken'],
        result:['Prevention campaign „Liebe deinen Rücken.“ in digital OOH'],
        year:'2024', org:'Freelance, for KNSK / PARAT' },
      { key:'union', vimeo:'384482892', vimeoH:'c444701c58', brand:'Union Investment', anchor:'case-union', slotId:'m3-case-union', slotSrc:'https://framerusercontent.com/images/qRFqxsgpqaBt54lhko1ZEe1G9FY.png', slotHint:'Union Investment — More Than Numbers',
        tags:['Union Investment','Finance','Storytelling','Integrated'],
        title:'More than numbers.',
        body:'A brand campaign that moved Union Investment from purely rational messaging to emotionally driven storytelling — without losing credibility.',
        en:'"Even the smallest number can make a big difference."',
        role:'Creative concept, campaign strategy, art direction', outcome:'A more human brand in one of the most rational categories',
        challenge:'Financial communication is built on facts, performance and rational decisions. The task was an emotional connection that keeps credibility intact.',
        idea:'Replace product-centric communication with a universal family story about love, conflict and reconciliation — the first financial institution in Germany to use the emotional significance of Christmas for its brand.',
        did:['Creative concept','Campaign strategy','Integrated campaign','Art direction'],
        result:['Introduced a more human dimension to the Union Investment brand','Showed that emotional storytelling can build trust in a rational category'],
        year:'2018', org:'' },
      { key:'yelp', vimeo:'747572410', vimeoH:'3ff68b2f6b', brand:'Yelp', anchor:'case-yelp', slotId:'m3-case-yelp', slotSrc:'https://framerusercontent.com/images/73ADeVQfadmjodca1BUqiW5d9H4.png', slotHint:'Yelp — brand launch Germany',
        tags:['Yelp','Launch','TV','Integrated'],
        title:'Introducing a brand nobody knew yet.',
        body:"Yelp's first brand campaign for Germany — building awareness and relevance in a market where the platform was still largely unknown.",
        role:'Concept & art direction, through production', outcome:'Established in Germany, then rolled out to further European markets',
        challenge:"Introduce Yelp to the German market: build awareness, communicate the brand's value and earn relevance with a new audience.",
        did:['Creative concept and art direction','Brand campaign and integrated communication','Production, including on-set involvement','Digital assets'],
        result:["Established Yelp's brand presence in Germany","Rolled out across additional European markets — Yelp's first pan-European TV campaign"],
        quote:'"Germany is one of our most important growth markets, and with this new campaign, we want to achieve even greater brand awareness."', quoteBy:'Holger Thiemann, Managing Director, Yelp Germany',
        year:'2017', org:'GGH MullenLowe' },
      { key:'o2', vimeo:'886809296', vimeoH:'15daaa5256', brand:'O₂ Record Race', anchor:'case-o2', slotId:'m3-case-o2', slotHint:'O₂ Record Race — Gran Turismo steering wheel',
        tags:['O₂','Partnership','Experience','Social'],
        title:'A world record the gaming community set themselves.',
        body:'Instead of telling gamers O₂ belongs in their world, we gave them something to take part in: a world record attempt with PlayStation for the most laps completed in Gran Turismo 7 within 48 hours.',
        role:'Creative Concept & Campaign architecture', outcome:'All slots booked in 5 days. New world record.',
        challenge:'O₂ wanted credibility in gaming — a community that quickly spots brands that only borrow its culture. The task was to earn a place in it and create awareness beyond the event itself.',
        idea:"Don't sponsor the game. Let the community make history with it. Together with PlayStation, we staged a world record attempt for the most laps completed in Gran Turismo 7 within 48 hours, supported by a dedicated microsite, gaming creators and an integrated social campaign.",
        did:['Built the campaign architecture connecting live event, microsite, gaming creators and social','Developed the creative concept and experience design','Art direction and key visual, including AI-generated artwork'],
        result:['All participant slots booked within 5 days','48 hours non-stop, 78 drivers, 1,143 team laps','New world record: most laps completed in Gran Turismo 7 within 48 hours'],
        srcHref:'https://www.o2online.de/o2-studio/gaming/', srcLabel:'o2online.de — O₂ Studio Gaming',
        year:'2023', org:'Freelance, for Serviceplan' },
      { key:'saturn', vimeo:'746494490', vimeoH:'b35974f02f', brand:'Saturn Tech-Nick', anchor:'case-saturn', slotId:'m3-case-saturn', slotHint:'Tech-Nick portrait',
        tags:['Saturn','TV','Social','Retail'],
        title:'Making technology feel easy to ask about.',
        body:'One character, one promise. We turned Tech-Nick into a campaign platform that carried Saturn across every channel — on half the media budget of its biggest competitor.',
        de:'„Bei Technikfragen, Tech-Nick fragen."', en:'"Tech questions? Ask Tech-Nick."',
        role:'Art Director, lead of the art team', outcome:'Spontaneous awareness 80 % above target. GWA Effie case.',
        challenge:'Electronics retail is loud, price-driven and full of jargon. Saturn needed a brand voice that could handle a year of weekly retail pressure without losing recognition — against competitors with twice the media spend.',
        idea:'Put a human face on technical expertise. Tech-Nick, played by Antoine Monot, answered the questions customers were too embarrassed to ask.',
        steps:[["Concept & Ideation",["Creative platform based on the brand strategy","Film ideas","Visual design of the campaign"]],["Corporate Campaign Design",["Design guidelines for partners","OOH, film, flyers, digital and social media"]],["Production",["Supervision of shoots and film production","Post-production and finalisation","Delivery of all assets"]],["Campaign Lead",["Year-round quality assurance of all outgoing Saturn media","Concepts for all thematic campaigns under the campaign umbrella"]]],
        result:['Spontaneous brand awareness 80 % above target','89 % aided awareness for Tech-Nick','"Conveys passion for technology": 50.4 %, ahead of Amazon and the leading competitor','Average basket value +10.2 % to €59.49 — on half the media budget of the largest competitor'],
        year:'2012–2014', org:'Serviceplan Campaign Hamburg', resultLabel:'Campaign results (GWA Effie case, 2013–2016)' },
      { key:'bmw2', vimeo:'176226797', vimeoH:'b831fc8521', brand:'BMW 2 Series', anchor:'case-bmw2', slotId:'m3-case-bmw2', slotSrc:'/assets/bmw2-coupe.webp', slotHint:'BMW 2 Series Coupé — campaign key visual',
        tags:['BMW','Adaptation','Social','Co-creation'],
        title:'A car built for America, made to matter in Germany.',
        body:'The 2 Series Coupé was designed with the US market in mind. In Germany, it needed a reason to exist. We found it in its most loved ancestor, the BMW 2002 — and let the fans finish the campaign.',
        de:'„2 Worte für den BMW 2er“', en:'“Two words for the BMW 2 Series”',
        role:'Art Director, German adaptation', outcome:'A US-led product repositioned as a car for German BMW fans',
        challenge:"The international launch introduced the 2 Series Coupé as a new model for a new audience, with the US as its main market. German drivers didn't need a new car so much as a reason to care about this one.",
        idea:"Don't launch a new car — continue a legend. In Germany, the 2 Series Coupé became the heir to the BMW 2002, one of the brand's most loved classics, turning a US-led product into a car for BMW enthusiasts. Then we handed the story to them: under the line „2 Worte für den BMW 2er“, fans shaped the campaign with their own words and designs.",
        did:['Adapted the international campaign for the German market','Art direction for the heritage-led route','Co-creation mechanic and fan-generated executions','TV, Online, Print, CRM\n'],
        result:['A US-led product repositioned as a car for German BMW fans','A campaign ultimately made by its audience'],
        year:'2013', org:'Serviceplan Campaign Hamburg' },
      { key:'bmw1', vimeo:'1152598473', vimeoH:'7eeef58e24', brand:'BMW 1 Series', anchor:'case-bmw1', slotId:'m3-case-bmw1', slotSrc:'/assets/bmw1-still.jpg', slotHint:'BMW 1 Series TVC film still',
        tags:['BMW','TVC','Humour','Young audience'],
        title:'Sporty and efficient — told with a wink.',
        body:'The BMW 1 Series is popular with a young audience. The film promotes the two things that matter to them in one car: the sporty, typically BMW way of driving and the efficiency they expect today — with humour instead of spec sheets.',
        role:'Idea development', outcome:'„Fahrerlebnisschalter Sportmodus“ became a lasting social media metaphor in German-speaking countries',
        did:['Idea development for the TVC'],
        resultLabel:'The viral afterlife', result:['The campaign worked — and the term outlived it. „Fahrerlebnisschalter Sportmodus“ (EN: “driving experience switch, sport mode”) became a fixed social media metaphor in German-speaking countries','User-generated short videos on TikTok and Instagram — memes about switching older 1 Series models into sport mode — still reach seven-figure view counts today','59,241 new BMW 1 Series registrations in Germany in 2012, up 12 % on 2011 (KBA)'],
        year:'2013', org:'Serviceplan Campaign Hamburg' },
      { key:'ducati', brand:'Ducati Germany', anchor:'case-ducati', slotId:'m3-case-ducati', slotHint:'[La bella Macchina film still or key visual]',
        tags:['Ducati','Positioning','TV','Social','Performance'],
        title:'Selling a dream to a country of touring bikes.',
        body:'For over a year, I developed model-specific positioning and adapted Ducati’s international creative assets into campaigns for Germany across TV, social and retail.',
        role:'External creative & strategy consultant (via m&T Frankfurt)', outcome:'Cost per lead −43 %. Conversion rate +110 %. Brand film aired at MotoGP.',
        challenge:'In Germany, BMW Motorrad owns engineering and efficiency. Ducati owns something else: Italian passion with character — nothing smoothed out. Most Germans buy touring enduros, yet what draws them to Ducati is passion, Italian racing and design. The task: give each model a clear role in the German market, charge the brand emotionally, and convert that emotion into sales.',
        insight:"Riding a motorcycle makes no rational sense. It's pure emotion — as every rider knows the moment they come out of the supermarket and look for the boot.",
        strategy:'So for the whole year, I put one theme at the centre: the dream — the most essential reason anyone buys a motorcycle. Every model owns a different one.',
        models:[
          { name:'Panigale V4', role:'The dream of racing', line:'Brand flagship — the machine everyone dreams of and connects with Ducati' },
          { name:'Multistrada V4', role:'The dream of travelling', line:'Touring riders — imagery of distance, open space and unforgettable experiences; the urge for freedom every enduro rider knows' },
          { name:'XDiavel', role:'The dream of design', line:'Design-driven riders — Italian style as a statement' } ],
        funnel:[
          { stage:'Brand', items:['One TV spot per model — Multistrada V4, XDiavel, Panigale V4'] },
          { stage:'Consideration', items:['Trust ads (test winner)','Awareness ads','USP ads (accessory benefits)'] },
          { stage:'Conversion', items:['Seasonal campaign phases 1 & 2','Ducati CAS','50 % down payment offer, financing campaign','100,000 km bonus'] } ],
        films:true,
        steps:[["Positioning",["Model-specific positioning for three Ducati models in Germany","One theme for the year: the dream"]],["Localisation",["Translated international footage and creative assets into locally relevant narratives and campaign executions for Germany"]],["Creative",["One TV spot per model, brand films for the Panigale V4","Key visuals and film concepts"]]],
        result:['Cost per lead reduced by 43 %','Conversion rate up 110 %','Three model TVCs','Brand film aired at MotoGP, built from existing footage','Sales-focused executions across seasonal, financing and accessory campaigns'], resultLabel:'Campaign results (with Magni & Tude)', footnote:'Performance figures reflect the overall campaign, including tracking and media by Magni & Tude. My contribution: creative work and campaign positioning.',
        year:'2025', org:'Freelance, for m&T Frankfurt' },
      { key:'tonline', brand:'t-online', anchor:'case-tonline', slotId:'m3-case-tonline-v2', slotHint:'Clean shot of the t-online OOH motif or brand campaign',
        tags:['t-online','Brand','OOH','Media','Sound','Studio'],
        title:'Trust needs consistency.',
        body:"t-online was one of Germany's biggest news sites — yet many people still saw it as Telekom's homepage. We repositioned it as an independent journalistic brand, with a new identity, a new voice and a sound of its own.",
        de:'„Jeder hat ein Recht zu erfahren, was auf der Welt passiert. Verstanden statt nur informiert."', en:'"Everyone has the right to know what\'s happening in the world. Understood, not just informed."',
        role:'Brand management, client side', outcome:'Independent editorial positioning, clearly set apart from Bild.de and WEB.DE',
        challenge:"t-online had the reach and the newsroom, but its origin as Deutsche Telekom's portal still shaped how people saw it. The brand needed to be seen as what it had become: independent, credible journalism.",
        idea:'Build the brand around the value of understanding, not just information.',
        didLabel:'What I did (client side, Ströer Content Group)',
        steps:[["Strategy",["Led the marketing narrative with external freelancers","Media mix for all marketing activities","Developed project proposals, secured internal approval and planned delivery within approved project budgets and internal media allocations."]],["Creative",["Briefed and coordinated external creative partners and internal teams, aligning the work with C-level stakeholders.","New corporate design with in-house resources","Campaign with freelancers","Audio logo","OOH, Spotify, social media, print and trade fair"]],["Media",["Steering and monitoring of media delivery"]]],
        result:['A more editorial identity with its own visual language and tone of voice','Clear differentiation from Bild.de and WEB.DE','Ranked #2 on r/munich, among other subreddits, in its launch week','Free earned reach: a six-minute discussion of the campaign on the tech podcast Doppelgänger','Shared by entrepreneur and investor Frank Thelen'],
        ctxLabel:'Brand context', ctxText:'31.34 million unique users in March 2021 (agof).', srcHref:'https://www.stroeer.de/newsroom/presse/deutschlands-reichweitenstaerkstes-newsportal-1-bei-agof-und-ivw/', srcLabel:'Ströer press release (agof / IVW)',
        year:'2021–2022', org:'Ströer Content Group' },
      { key:'db', vimeo:'384494288', vimeoH:'901ee3e8f2', dbFilms:true, brand:'Deutsche Bahn', anchor:'case-db', slotId:'m3-case-db', slotHint:'Deutsche Bahn station OOH',
        tags:['Deutsche Bahn','TV','OOH','Content'],
        title:'Jobs shown as they really are.',
        body:'One of Germany\'s largest employers needed an employer brand that felt consistent across hundreds of job profiles, audiences and channels — and honest enough to be believed.',
        de:'„Du willst beruflich die ‚digitale Schiene\' – privat die sicherste."', en:'"At work, you want the digital track. In life, the safest one."',
        role:'Senior Art Director, lead of the art team', outcome:'A cohesive employer brand across TV, OOH, content and career films',
        challenge:'Create a stronger, more consistent employer brand experience across a wide range of target groups, channels and formats, while supporting the long-term development of the Deutsche Bahn employer brand.',
        idea:'Let the jobs speak for themselves — real roles, shown as honestly as possible, within one consistent visual and verbal system. An extensive audience analysis showed that apprentices need to be addressed very differently. So we created a dedicated design variant for them: related to the employer brand, but more dynamic and younger.',
        steps:[["Strategy & Brief",["Sharpened the client brief","Translated the strategy into a creative brief"]],["Creative",["Briefing and alignment with the creative team","Selection of the creative work","Selling to and advising the client"]],["Production",["Production lead through to final delivery","Adaptation of social media assets"]]],
        result:['A more cohesive employer brand built on consistent visual and communicative principles, supporting recruitment and long-term brand perception'],
        ctxLabel:'Company context', ctxText:'Deutsche Bahn hired more than 20,000 employees in 2020.',
        quote:'"The goal is to bring these jobs to life and present them as honestly as possible."', quoteBy:'Kerstin Wagner, Head of Talent Acquisition, Deutsche Bahn',
        year:'2018–2020', org:'thjnk Hamburg' }
    ];
    const order = this.props.caseKeys || ['ducati','o2','bmw2','tonline','bmw1','bmwx4','aokback','union','yelp','saturn','db'];
    for (let i = 0; i < raw.length; i++) raw[i] = tr(raw[i]);
    raw.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key));
    const cases = raw.map((c, i) => {
      const isOpen = !!open[c.key];
      return { ...c, hasChallenge: !!c.challenge, hasIdea: !!c.idea, hasInsight: !!c.insight, hasStrategy: !!c.strategy, hasModels: !!c.models, models: (c.models || []).map(m => ({ name: m.name, role: f(m.role), line: f(m.line) })), hasFunnel: !!c.funnel, hasSteps: !!c.steps, resultLabel: c.resultLabel || 'Result', hasCtx: !!c.ctxText, ctxLabel: c.ctxLabel || '', ctxText: c.ctxText || '', hasSrc: !!c.srcHref, srcHref: c.srcHref || '', srcLabel: c.srcLabel || '', isO2: c.key === 'o2', notO2: c.key !== 'o2', hasDid: !c.steps, resCol: c.steps ? 'var(--g-full)' : 'var(--g-half)', steps: (c.steps || []).map((st, k, arr) => ({ no: String(k + 1).padStart(2, '0'), stage: st[0], items: st[1], notLast: k < arr.length - 1 })), funnel: (c.funnel || []).map((st, k, arr) => ({ no: String(k + 1).padStart(2, '0'), stage: st.stage, items: st.items, notLast: k < arr.length - 1 })), hasFilms: !!c.films, hasDbFilms: !!c.dbFilms, vimeo: c.vimeo || '', hasMore: !!c.more, more: (c.more || []).map((m, k) => ({ isVid: !m.ph, isPh: !!m.ph, src: m.ph ? '' : 'https://player.vimeo.com/video/' + m.id + '?h=' + m.h + '&title=0&byline=0&portrait=0&dnt=1', slot: 'detail-' + c.key + '-more-' + (k + 1), title: c.brand + ' — film ' + (k + 1) })), hasVideo: !!c.vimeo, vimeoSrc: c.vimeo ? 'https://player.vimeo.com/video/' + c.vimeo + (c.vimeoH ? '?h=' + c.vimeoH + '&' : '?') + 'title=0&byline=0&portrait=0&dnt=1' : '', noVideo: !c.vimeo, mediaSlot: 'detail-' + c.key, mediaHint: c.brand + ' — case image (or add a Vimeo ID in the data)', num: String(i + 1).padStart(2, '0'), imgCol: i % 2 ? 'var(--g-b7)' : 'var(--g-a7)', txtCol: i % 2 ? 'var(--g-a4)' : 'var(--g-b4)', tagLine: c.tags.join('  ///  '), tagCaps: c.tags.join('  ·  '), hasDe: !!c.de, hasQuote: !!c.quote, footnote: c.footnote || '', didLabel: c.didLabel || 'What I did',
        role: f(c.role), outcome: f(c.outcome), year: f(c.year), org: f(c.org || ''), slotSrc: c.slotSrc || '', hasFootnote: !!c.footnote, did: (c.did || []).map(f), result: c.result.map(f),
        isOpen, toggleLabel: isOpen ? 'close case' : 'read the case', toggleRot: isOpen ? '-90deg' : '0deg', toggle: () => setOpen(c.key, !isOpen) };
    });
    const ORDER = order;
    const workCases = ORDER.map(k => cases.find(c => c.key === k)).filter(Boolean).map((c, i) => ({ ...c, num: String(i + 1).padStart(2, '0') }));
    const offs = ['0%','24%','8%','32%','4%','18%']; const req = (no, ask, proof, key, label) => ({ off: offs[parseInt(no, 10) - 1], no, ask, proof, href: key ? '#case-detail' : '#concept', link: label.replace(/\s*→$/, ''), onClick: () => { if (key) { setOpen(key, true); this.goTo(raw.findIndex(r => r.key === key)); } } });
    const showGrid = this.state.grid ?? (this.props.showGrid ?? false);
    const marquee = this._marq || (this._marq = (() => {
      const rows = [['Making AI make sense –', 1, 160], ['in German', -1, 120], ['at national scale.', 1, 140]];
      return React.createElement('div', { 'aria-hidden': 'true', style: { display: 'flex', flexDirection: 'column', gap: '.02em' } },
        rows.map(([t, d, s], k) => React.createElement('div', { key: k, style: { overflow: 'hidden', whiteSpace: 'nowrap' } },
          React.createElement('div', { 'data-marq': '', style: { display: 'inline-flex', animation: 'mkMarq ' + s + 's linear infinite' + (d < 0 ? ' reverse' : ''), willChange: 'transform' } },
            Array.from({ length: 8 }, (_, i) => React.createElement('span', { key: i, style: { paddingRight: '.35em', fontFamily: "'Reglo','IBM Plex Sans Condensed',sans-serif", fontWeight: 700, textTransform: 'uppercase', fontSize: 'clamp(72px,13.5vw,220px)', lineHeight: .86, letterSpacing: '-0.02em', color: k === 1 ? '#8C9098' : '#F2F2F0' } }, t))))));
    })());
    const film = this.state.film || 'bella';
    const reduceM = !!this.state.reduceM;
    const cardTrans = reduceM ? 'none' : 'opacity .2s ease, border-color .2s ease';
    const boardTrans = reduceM ? 'none' : 'opacity .2s ease, transform .2s ease';
    const selectFilm = k => { if (this.state.film !== k) this.setState({ film: k }); };
    const filmsUI = [
      { k:'bella', title:'La bella Macchina', sub:'Panigale V4', body:"A ride through Ducati's racing history, from its first motorcycle to the social media age. Built entirely from existing footage, with no new production budget. Aired on TV at MotoGP as the last spot before the race.", hasLink:true },
      { k:'dream', title:'Träumer', sub:'EN: "Dreamer"', concept:true, body:"A story about Francesco Bagnaia and a dream that didn't start yesterday. A portrait of someone happily obsessed — and every rider recognises themselves in him." }
    ].map(x => { const a = film === x.k; return { ...x, hasBody: !!x.body, hasLink: !!x.hasLink, concept: !!x.concept, isActive: a ? 'true' : 'false', border: 'transparent', bg: a ? '#1F2226' : '#0C0D0F', op: a ? 1 : .5, notch: a ? 1 : 0, select: () => selectFilm(x.k), key: ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); selectFilm(x.k); } } }; });
    const fr = (no, slotId, t, de, en) => ({ no, slotId, hint: t, t, ph: /^\[.*\]$/.test(t), np: !/^\[.*\]$/.test(t), de: de || '', en: en || '', hasDe: !!de });
    const boardsRaw = [
      { k:'bella', zoom:1.14, note:'Storyboard visuals: AI-generated.', frames: [
        fr('01','ducati-bella-1','An old Ducati radio, shot with a vintage camera look. VO: a sports commentator excitedly calls a motorcycle race.'),
        fr('02','ducati-bella-2','Cut to archive footage of old motorcycle races.'),
        fr('03','ducati-bella-3','The clips follow one another, each with a different camera effect.'),
        { ...fr('04','ducati-bella-4','VO: we keep hearing different historic commentators.'), zoom:1.5, origin:'50% 50%' },
        { ...fr('05','ducati-bella-5','A modern camera shot: the Panigale V4 races towards us and takes its corners.'), zoom:1.5, origin:'50% 50%' },
        fr('06','ducati-bella-6','End line:','„Ducati Panigale V4 – Die schönste Form der Perfektion."','"Ducati Panigale V4 – The most beautiful form of perfection."') ] },
      { k:'dream', note:'Storyboard visuals: AI-generated.', frames: [
        fr('01','ducati-dream-1','On the back seat, six-year-old Francesco leans into every bend as if he were steering.'),
        fr('02','ducati-dream-2','His mother sees him in the rear-view mirror and smiles:','„Francesco, lass das!"','"Francesco, stop that!"'),
        fr('03','ducati-dream-3','Now a teenager, he stops at a kiosk, lost in a motorcycle magazine.','„Komm schon, wir gehen!"',"\"Come on, let's go!\""),
        fr('04','ducati-dream-4','As an adult, he draws a race track in the flour while cooking.','„Francesco, du alter Träumer."','"Francesco, you old dreamer."'),
        fr('05','ducati-dream-5','A garage opens: the Ducati Panigale V4.'),
        fr('06','ducati-dream-6','MotoGP champion Francesco Bagnaia in racing leathers.','„Ducati Panigale V4 – Für alle, die schon früh wussten, wie echte Träume aussehen."','"Ducati Panigale V4 – For everyone who knew early on what real dreams look like."') ] }
    ];
    const boardsUI = boardsRaw.map(b => { const a = film === b.k; return { ...b, zoom: b.zoom || 1, hasEnd: !!b.end, end: b.end || '', hasEndEn: !!b.endEn, endEn: b.endEn || '', hasNote: !!b.note, note: b.note || '', op: a ? 1 : 0, pe: a ? 'auto' : 'none', vis: a ? 'visible' : 'hidden', hidden: a ? 'false' : 'true', frames: b.frames.map((f2, i) => ({ ...f2, zoom: f2.zoom || b.zoom || 1, origin: f2.origin || '50% 50%', op: a ? 1 : 0, ty: a || reduceM ? '0px' : '6px', delay: a && !reduceM ? (i * 30) + 'ms' : '0ms' })) }; });
    const U = n => paths['uploads/' + n] || ('/uploads/' + encodeURI(n));
    const tabSets = { bmwx4: { brand: 'BMW X4', label: 'The two key motifs', data: [
      { k:'front', title:'Front', sub:'Lead motif', tag:'Print · OOH', line:'The three-quarter front view carries the campaign.', vids:[
        { img:'/assets/bmwx4-ooh-front.webp', ar:'3/2', t:'„Design: Coupé-artig. Charakter: Unartig.“', en:'“Design: coupé-like. Character: badly behaved.”' } ] },
      { k:'rear', title:'Rear', sub:'Supporting motif', tag:'Print · OOH', line:'The three-quarter rear view shows the coupé line.', vids:[
        { img:'/assets/bmwx4-ooh-rear.webp', ar:'3/2', t:'„Design: Coupé-artig. Charakter: Unartig.“', en:'“Design: coupé-like. Character: badly behaved.”' } ] }
    ] }, saturn: { brand: 'Saturn', label: 'Campaign across channels', data: [
      { k:'ooh', title:'Out of home', sub:'', tag:'OOH · City light', line:'Tech-Nick and the Saturn team as the face of technical expertise, right in the city.', vids:[
        { img:'/assets/saturn-ooh.png', ar:'714/497', t:'„Alle wollen Tech-Nick – und das beste Team bei Technikfragen!"', en:'"Everyone wants Tech-Nick – and the best team for tech questions!"' } ] },
      { k:'print', title:'Retail flyer', sub:'DE: „Prospekt"', tag:'Print · Retail', line:'The weekly offers, carried by one recognisable look instead of price noise alone.', vids:[
        { img:'/assets/saturn-prospekt.png', ar:'816/497', t:'Retail flyer in the Tech-Nick campaign look' } ] },
      { k:'web', title:'Web activation', sub:'', tag:'Web · Social', line:'Seasonal activations on saturn.de throughout the year, each inviting customers to join in with Tech-Nick.', vids:[
        { img:'/assets/saturn-web.png', ar:'714/521', t:'„Jetzt wird\'s gruselig."', en:'"Now it gets spooky."' } ] },
      { k:'store', title:'In-store & digital', sub:'', tag:'Digital · POS', line:'The same platform on screens in the store — one character across every touchpoint.', vids:[
        { img:'/assets/saturn-social.png', ar:'816/521', t:'„Alle wollen Tech-Nick."', en:'"Everyone wants Tech-Nick."' } ] }
    ] },
    db: { brand: 'Deutsche Bahn', label: 'Employer branding films', data: [
      { k:'brand', title:'Brand recruiting campaign', sub:'', tag:'TV · Employer brand', line:'The main recruiting campaign for the Deutsche Bahn employer brand.', vids:[ { id:'384494288', h:'901ee3e8f2', t:'TVC Jobs für Deutschland' }, { id:'384494099', h:'869f86cc75', t:'YT Preroll Jobs für Deutschland' }, { t:'OOH Willkommen beim Zukunftsgeber', gal:['https://freight.cargo.site/w/2000/q/75/i/07c24e8289d347176b5a11de8f8850bc5c954d02c1fa6e786364269def2e9099/Fahne_quer.jpg','https://freight.cargo.site/w/2000/q/75/i/71724a99ec7031f5d0b019d0f5f6b2a7d6d90cd6291aae58f42ffaf02194ffb1/Bahnhof_16x1.jpg','https://freight.cargo.site/w/2000/q/75/i/5fd7a273be28719654d2ab4779acd79a05a5457dbd863d30e5a7238fad3ff750/BerlinBahnnhof_Q1_2000x1500.jpg'] } ] },
      { k:'career', title:'Career content', sub:'', tag:'Career platform', line:'Real employees, real jobs — career videos for the DB career platform.', vids:[ { id:'749645061', h:'9d1f9c4a02', t:'Contentfilm: Inklusion bei der DB' }, { id:'749645266', h:'fe107b7b29', t:'Contentfilm: Führungskräfte bei der DB' }, { id:'1152505120', h:'3099ec3a96', t:'Contentfilm: Lokrangierführer bei der DB' } ] },
      { k:'azubi', title:'Apprentices', sub:'DE: „Azubis"', tag:'Dedicated design variant', line:'A younger, more dynamic design for a younger audience — based on audience analysis.', vids:[ { id:'749654482', h:'b5448a6415', t:'YT Preroll Überspring nicht deine Zukunft' }, { t:'OOH Apprentices female', img:'https://freight.cargo.site/w/2000/q/75/i/8abbc4cbbd87ef7e7b2ad6c0bcb155fe5ac3146b1a899040427b1482b091c388/CLP-Schueler_2.jpg' }, { t:'OOH Apprentices male', img:'https://freight.cargo.site/w/2000/q/75/i/23259fd6386c8d286f37701307d07312e4a904470e20dc43ef9df6aae98313d3/CLP-Schueler_1.jpg' } ] }
    ] },
    tonline: { brand: 't-online', label: 'Campaign, media, sound & studio', data: [
      { k:'teaser', title:'Teaser campaign', sub:'', tag:'Video · no copy', line:'Step 1: text-free teaser videos that ran ahead of the big brand campaign — no logo, no claim.', vids:[
        { mp4: '/uploads/isw-teaser-musk.mp4', t:'Teaser — Musk' },
        { mp4: '/uploads/isw-teaser-skeleton.mp4', t:'Teaser — Skeleton' },
        { mp4: '/uploads/isw-teaser-umarmung.mp4', t:'Teaser — Umarmung', en:'Hug' },
        { mp4: '/uploads/isw-teaser-corona-v1.mp4', t:'Teaser — Corona' },
        { img: '/uploads/zusammenbau.jpg', contain:true, t:'Reactions online: people in Hamburg, Munich and Berlin guessing who was behind the billboards' } ] },
      { k:'brand', title:'Brand campaign', sub:'', tag:'OOH · Brand', line:'The repositioning in public: the big brand campaign that followed the teasers.', vids:[
        { mp4: '/uploads/pvmq-musk-mitabdunklung.mp4', t:'Musk, dimmed variant' },
        { img: '/uploads/220825-t-online-markenkampagne-1920x1080-papst.jpg', t:'„Die Wahrheit über Halbwahrheiten."', en:'"The truth about half-truths."' },
        { img: '/uploads/220825-t-online-markenkampagne-1920x1080-macron.jpg', t:'„Jeder hat ein Recht zu erfahren, was auf der Welt passiert."', en:'"Everyone has the right to know what\'s happening in the world."' } ] },
      { k:'product', title:'Product campaigns', sub:'', tag:'Media planning', line:'Campaigns for individual t-online formats — part of the media planning across the Ströer portfolio.', vids:[
        { mp4: '/assets/tonline-tagesanbruch.mp4', t:'Tagesanbruch', en:'Daybreak' },
        { mp4: '/uploads/sekt-selters-var-3-16x9.mp4', t:'Sekt oder Selters', en:'Champagne or seltzer' },
        { mp4: '/uploads/ladezeit-16x9-ohne-logo-wave-1.mp4', t:'Ladezeit', en:'Loading time' } ] },
      { k:'sound', title:'Sound branding', sub:'', tag:'Sound logo · Sound bed', line:'The new t-online sound branding: a sound logo and a sound bed, produced with BLUT Audio.', vids:[
        { audio: '/uploads/10-220506-t-online-podcast-edit-mit-lisa-v2.mp3', t:'Podcast edit with Lisa — V2' },
        { audio: '/uploads/11-220506-t-online-podcast-edit-mit-lisa-we.mp3', t:'Podcast edit with Lisa — WE' } ] }
,
      { k:'studio', title:'Studio design', sub:'', tag:'Set design', line:'The news studio designed in the new t-online identity.', vids:[
        { img: '/uploads/chatgpt-image-10-juni-2026-15-05-19.png', t:'The t-online news studio in the new identity' } ] }
    ] } };
    for (const k in tabSets) tabSets[k] = tr(tabSets[k]);
    const acKey = (cases.find(c => c.isOpen) || cases[0]).key;
    const tset = tabSets[acKey];
    const dbData = tset ? tset.data : [];
    const tabSel = this.state.tabSel || {};
    const dbKey = tabSel[acKey] || (dbData[0] && dbData[0].k);
    const selDb = k => { if (tabSel[acKey] !== k) this.setState(s => ({ tabSel: { ...(s.tabSel || {}), [acKey]: k } })); };
    const vsrc = (id, hh) => 'https://player.vimeo.com/video/' + id + '?' + (hh ? 'h=' + hh + '&' : '') + 'autoplay=1&title=0&byline=0&portrait=0&dnt=1';
    const thumbs = this.state.dbThumbs || {};
    if (hasDOM && !this._oneMedia) { this._oneMedia = e => { document.querySelectorAll('audio,video').forEach(m => { if (m !== e.target && !m.muted) m.pause(); }); }; document.addEventListener('play', this._oneMedia, true); }
    if (this._mounted && !this._dbThumbReq) { this._dbThumbReq = true; tabSets.db.data.forEach(d => d.vids.forEach(v => { if (!v.id) return; fetch('https://vimeo.com/api/oembed.json?width=960&url=' + encodeURIComponent('https://vimeo.com/' + v.id + (v.h ? '/' + v.h : ''))).then(r => r.ok ? r.json() : null).then(j => { if (j && j.thumbnail_url) this.setState(s => ({ dbThumbs: { ...(s.dbThumbs || {}), [v.id]: j.thumbnail_url } })); }).catch(() => {}); })); }
    const openLb = (src, title, video) => { this._lbPrev = document.activeElement; this.setState({ lb: { src, title, video: !!video } }, () => setTimeout(() => this.lbCloseRef.current && this.lbCloseRef.current.focus(), 30)); if (!this._lbEsc) { this._lbEsc = e => { if (e.key === 'Escape' && this.state.lb) closeLb(); }; window.addEventListener('keydown', this._lbEsc); } };
    const closeLb = () => { this.setState({ lb: null }); if (this._lbPrev && this._lbPrev.focus) this._lbPrev.focus(); };
    if (!this.lbCloseRef) this.lbCloseRef = React.createRef();
    const dbTabs = dbData.map((d, i) => { const a = dbKey === d.k; return { tabId: 'tab-' + acKey + '-' + d.k, panelId: 'panel-' + acKey + '-' + d.k, title: d.title, sub: d.sub, tag: d.tag, line: d.line, flag: d.flag || '', hasFlag: !!d.flag, isActive: a ? 'true' : 'false', tabIndex: a ? '0' : '-1', bg: a ? '#1F2226' : '#0C0D0F', op: a ? 1 : .5, notch: a ? 1 : 0, select: () => selDb(d.k), key: ev => {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); selDb(d.k); }
      else if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') { ev.preventDefault(); const n = dbData[(i + (ev.key === 'ArrowRight' ? 1 : dbData.length - 1)) % dbData.length]; const el = document.getElementById('tab-' + acKey + '-' + n.k); if (el) el.focus(); } } }; });
    const dbRows = dbData.map(d => { const a = dbKey === d.k; return { tabId: 'tab-' + acKey + '-' + d.k, panelId: 'panel-' + acKey + '-' + d.k, op: a ? 1 : 0, pe: a ? 'auto' : 'none', vis: a ? 'visible' : 'hidden', hidden: a ? 'false' : 'true', vids: d.vids.map((v, i) => { const no = String(i + 1).padStart(2, '0'); const ph = /^\[.*\]$/.test(v.t); const th = v.img || (v.id && thumbs[v.id]); const ttl = ph ? tset.brand + ' — ' + d.title + ' ' + no : tset.brand + ' — ' + v.t; const gk = acKey + d.k + no; const gi = (this.state.dbGal || {})[gk] || 0; const gn = v.gal ? v.gal.length : 0; const setG = x => this.setState(s => ({ dbGal: { ...(s.dbGal || {}), [gk]: (x + gn) % gn } }));
      const playable = !!(v.id || v.mp4);
      const au = this.state.au || {}; const aOn = !!v.audio && au.src === v.audio && au.playing; const aCur = au.src === v.audio ? au : {};
      const fmt = s => { s = Math.floor(s || 0); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
      return { no, ar: v.ar || '16/9', t: v.t, ph, np: !ph, hasEn: !!v.en, en: v.en || '', alt: v.img ? ttl : '', fit: v.contain ? 'contain' : 'cover', cursor: playable ? 'pointer' : 'default', isMp4: !!v.mp4, mp4Poster: v.mp4 ? v.mp4 + '#t=0.5' : '', preload: a ? 'metadata' : 'none', isAudio: !!v.audio, audio: v.audio || '', aOn: aOn ? 'true' : 'false', aIcon: aOn ? 'II' : '▶', aLabel: (aOn ? 'Pause audio: ' : 'Play audio: ') + ttl, aPct: (aCur.dur ? (aCur.t / aCur.dur) * 100 : 0) + '%', aTime: fmt(aCur.t) + (aCur.dur ? ' / ' + fmt(aCur.dur) : ''), aToggle: () => this.toggleAudio(v.audio), aSeek: ev => { const r = ev.currentTarget.getBoundingClientRect(); this.seekAudio(v.audio, (ev.clientX - r.left) / r.width); }, isGal: !!v.gal, galSrc: v.gal ? v.gal[gi] : '', galAlt: ttl + ' — image ' + (gi + 1) + ' of ' + gn, galCount: (gi + 1) + ' / ' + gn, galPrev: () => setG(gi - 1), galNext: () => setG(gi + 1), basis: v.full ? '100%' : '260px', isVid: playable, hasThumb: !!th, noThumb: !th && !v.gal && !v.mp4 && !v.audio, thumb: th || '', slot: (acKey === 'db' ? 'db' : acKey) + '-film-' + d.k + '-' + no, hint: v.id ? '[poster] ' + ttl : '[poster + video] ' + ttl, playLabel: (v.audio ? 'Play audio: ' : 'Play video: ') + ttl, play: v.id ? () => openLb(vsrc(v.id, v.h), ttl) : v.mp4 ? () => openLb(v.mp4, ttl, true) : () => {}, op: a ? 1 : 0, ty: a || reduceM ? '0px' : '6px', delay: a && !reduceM ? (i * 30) + 'ms' : '0ms' }; }) }; });
    const words = s => s.split(' ').map(w => w + ' ');
    const ac = cases.find(c => c.isOpen) || cases[0];
    return tr({
      ac, hasAc: cases.some(c => c.isOpen),
      scRef: this.scRef, cntRef: this.cntRef,
      prev: () => this.goTo(Math.max(0, this.cur() - 1)),
      next: () => this.goTo(Math.min(workCases.length - 1, this.cur() + 1)),
      caseTotal: String(workCases.length).padStart(2, '0'),
      workCases, acClose: () => setOpen(null, false), openSaturn: () => setOpen('saturn', true), openTonline: () => setOpen('tonline', true),
      marquee,
      clockRef: this.clockRef,
      introWords: words(T("Art Director, Creative Director and Creative Strategist. I connect strategy, ideas and creative leadership — from brief to final delivery, on the agency side and the client side.")),
      aiWords: words(T("AI is part of how I work.")),
      films: filmsUI, boards: boardsUI, cardTrans, boardTrans, dbTabs, dbRows, hasTabs: !!tset && cases.some(c => c.isOpen), tabsLabel: tset ? tset.label : '',
      lbOpen: !!this.state.lb, lbSrc: this.state.lb ? this.state.lb.src : '', lbVideo: !!(this.state.lb && this.state.lb.video), lbFrame: !!(this.state.lb && !this.state.lb.video), lbTitle: this.state.lb ? this.state.lb.title : '', lbClose: closeLb, lbStop: e => e.stopPropagation(), lbCloseRef: this.lbCloseRef,
      aiFolRef: this.aiFolRef,
      heroPortrait: this.state.heroPortrait,
      aiFollow: this.state.aiFine === true && !false,
      aiInline: this.state.aiFine !== null && !(this.state.aiFine === true && !false),
      aiRows: [
        { idx: 0, folH: 192, no: '01', title: 'Multi-agent systems & automation', desc: [f('I design multi-agent systems and workflow automations and implement them for small businesses.')], tags: ['Gemini','Gemini Notebook (formerly NotebookLM)','ChatGPT','Claude','Claude Code','Make','GitHub','Supabase'].map(f), imgs: [{ ar: '1280/769', slotId: 'ai-img-agents', src: '/uploads/do-automation-in-make-com-made-com-integromat-zapier-notion-airtable-googlesheet.png', hint: '[image: diagram or screenshot of an agent/automation workflow]', alt: 'Workflow automation scenario with a router branching into multiple tool chains' }] },
        { idx: 1, folH: 179, no: '02', title: 'Creative GenAI', desc: [f('Image, voice and music generation in concept development and production.')], tags: ['Midjourney','ElevenLabs','Suno','NanoBanana\n'].map(f), imgs: [{ ar: '700/392', slotId: 'ai-img-genai', src: '/uploads/231121-record-race-flag-online.png', hint: '[image: generated key visual or moodboard]', alt: 'O₂ The Record Race — AI-generated key visual' }] },
        { idx: 2, folH: 217, no: '03', title: 'Vibe coding', desc: [f('Side projects built with Claude Code: Nonna (recipe generation), Done (freelancer dashboard), Vers.io (medication app), '), f('Lhotse'), f(' (nutrition planning for competitive athletes).')], tags: ['Claude Code','Cursor\n'].map(f), imgs: [
          { ar: '1446/980', slotId: 'ai-img-lhotse', src: '/uploads/mockup-app-lhotse.png', hint: 'Lhotse — app mockup', alt: 'Lhotse app mockup' },
          { ar: '1446/980', slotId: 'ai-img-versio', src: '/uploads/mockup-app-vers.png', hint: 'Vers.io — app mockup', alt: 'Vers.io medication app mockup' },
          { ar: '1446/980', slotId: 'ai-img-done', src: '/uploads/mockup-app-done.png', hint: 'Done — app mockup', alt: 'Done freelancer dashboard app mockup' } ] }
      ],
      inGerman,
      showGrid,
      gridCols: Array.from({ length: 12 }, (_, i) => i + 1),
      gridLabel: showGrid ? 'Grid on · G' : 'Grid off · G',
      toggleGrid: () => this.setState({ grid: !showGrid }),
      ceWrapRef: this.ceWrapRef,
      ceSvgRef: this.ceSvgRef,
      ceVisRef: this.ceVisRef,
      cases,
      requirements: [
        req('01','Own integrated campaigns end-to-end',"Led creative work from brief to air for Deutsche Bahn's employer brand: TV, station domination, a career content platform and a series of career films.",'db','See case: Deutsche Bahn →'),
        req('02','Steer creative partners and internal teams',"Client side at Ströer: briefed and steered an external strategist, a sound studio, designers and freelance teams for t-online's repositioning — and aligned C-level leadership.",'tonline','See case: t-online →'),
        req('03','Make new technology feel human','Helped make technology approachable through the Tech-Nick campaign platform. The campaign exceeded its spontaneous awareness target by 80%.','saturn','See case: Saturn →'),
        req('04','Work global-to-local','Adapted Ducati’s international creative assets into campaigns for the German market, developing model-specific narratives across TV, social and retail.','ducati','See case: Ducati →'),
        req('05','Native German, fluent English','German copy and cultural judgement first-hand; English as working language with international clients and agency networks.',null,'See: Case spec Concept →'),
        req('06','Create culturally relevant brand experiences','Developed the creative concept and campaign architecture for O₂’s Record Race with PlayStation, connecting gaming culture, a live experience and social activation.','o2','See case: O₂ Record Race →')
      ],
      awards: this._aw || (this._aw = [
        { name:'Cannes Lions', metal:'Silver', slotId:'award-cannes', hint:'Cannes Lions logo' },
        { name:'ADC Germany', metal:'Silver & Bronze', slotId:'award-adc', hint:'ADC Germany logo' },
        { name:'GWA Effie', metal:'Silver & Bronze', slotId:'award-effie', hint:'GWA Effie logo', src:'/assets/effie-logo-white.svg' },
        { name:'AME Awards', metal:'Gold & Bronze', slotId:'award-ame', hint:'AME Awards logo', src:'/assets/ame-logo-white.svg', scale:.8 },
        { name:'Radio Advertising Award', metal:'Gold', slotId:'award-radio', hint:'Radio Advertising Award logo', src:'/assets/raa-logo-white.svg' },
        { name:'DDC', metal:'Bronze', slotId:'award-ddc', hint:'DDC logo', src:'/uploads/ddc-weiss.png', scale:.68 },
        { name:'Red Dot', metal:'Award\n', slotId:'award-reddot', hint:'Red Dot logo', src:'/uploads/red-dot-weiss.png', scale:1.8 }
      ].map(a => ({ ...a, scale: a.scale || 1, hasSrc: !!a.src, noSrc: !a.src, metalPh: /^\[.*\]$/.test(a.metal), noMetalPh: !/^\[.*\]$/.test(a.metal) }))),
      method: [
        {no:"01", title:"Sharpen the brief before anyone designs", body:"One audience, one job, one measure. Ambiguity is cheaper to fix in writing."},
        {no:"02", title:"Buy the idea, not the deck", body:"Choose the route with the strongest core thought, then spend the budget making it well."},
        {no:"03", title:"Run production as creative work", body:"Casting, music, edit and localisation decide whether the idea survives contact with the market."},
        {no:"04", title:"Close the loop", body:"A post-campaign read that changes the next brief — not a reporting ritual."}
      ]
    });
  }

  render() {
    const {
      heroPortrait, ac, hasAc, scRef, cntRef, prev, next, caseTotal, workCases, acClose, openSaturn, openTonline, marquee, clockRef, introWords, aiWords, films, boards, cardTrans, boardTrans, dbTabs, dbRows, hasTabs, tabsLabel, lbOpen, lbSrc, lbVideo, lbFrame, lbTitle, lbClose, lbStop, lbCloseRef, aiFolRef, aiFollow, aiInline, aiRows, inGerman, showGrid, gridCols, gridLabel, toggleGrid, ceWrapRef, ceSvgRef, ceVisRef, cases, requirements, awards, method
    } = this.renderVals();
    const full = (this.props.mode || 'home') === 'home';
    return (
      <>



{(showGrid) && (<>
<div aria-hidden="true" style={css("position:fixed;inset:0;pointer-events:none;z-index:60")}>
<div style={css("max-width:1440px;margin:0 auto;padding:0 var(--g-m);height:100%;display:grid;grid-template-columns:repeat(var(--g-cols),minmax(0,1fr));column-gap:var(--g-gap);grid-template-rows:100%;grid-auto-rows:0;overflow:hidden")}>
{(gridCols).map((gc, gc_i) => (<React.Fragment key={gc_i}><div style={css("background:rgba(230,40,90,.07);border-left:1px solid rgba(230,40,90,.3);border-right:1px solid rgba(230,40,90,.3)")}></div></React.Fragment>))}
</div>
</div>
</>)}


{full && (<>
<header className="site-header" style={css("position:sticky;top:0;z-index:20;background:transparent")}>
<div style={css("max-width:1440px;margin:0 auto;padding:0 var(--g-m);display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap;padding-top:20px;padding-bottom:20px")}>
<a href="#top" aria-label="markus kriesmair" style={css("display:flex;align-items:center;text-decoration:none")}><img src="/uploads/240316-logo-markus-kriesmair-abbinder.png" alt="markus kriesmair" style={css("display:block;height:44px;width:auto;max-width:56vw;object-fit:contain;object-position:left center;filter:invert(1)")} /></a>
<nav className="site-nav" style={css("display:flex;gap:28px;align-items:center;flex-wrap:wrap;font-size:16px;font-weight:300")}>
<a href="#leadership">{T("leadership")}</a><a href="#work">{T("work")}</a><a href="#process">{T("process")}</a><a href="#about">{T("about")}</a><a href="#ai">{T("ai")}</a><a href="#contact" style={css("font-weight:700")} className="hv2">{T("contact ")}<svg aria-hidden="true" viewBox="0 0 16 16" style={css("width:.8em;height:.8em;flex:none;overflow:visible;transform:rotate(0deg)")}><path d="M2.5 8h11M8.5 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="square" strokeLinejoin="round" strokeMiterlimit="2"></path></svg></a>
</nav>
<div className="site-lang" role="group" aria-label={T("Language")} style={css("display:flex;gap:8px;align-items:center;font-size:13px;letter-spacing:.06em;color:#5B5F66")}>
<a href="/" data-lang-switch="de" hrefLang="de" lang="de" aria-label="Deutsch" aria-current={LANG === 'de' ? 'true' : undefined} style={{ color: LANG === 'de' ? '#F2F2F0' : '#8C9098', fontWeight: LANG === 'de' ? 700 : 300 }} className="hv2">DE</a><span aria-hidden="true">|</span><a href="/en/" data-lang-switch="en" hrefLang="en" lang="en" aria-label="English" aria-current={LANG === 'en' ? 'true' : undefined} style={{ color: LANG === 'en' ? '#F2F2F0' : '#8C9098', fontWeight: LANG === 'en' ? 700 : 300 }} className="hv2">EN</a>
</div>
</div>
</header>

<section id="top" style={css("position:relative;margin-top:-84px;min-height:clamp(480px,62.5vw,100vh);overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;gap:48px;padding-top:132px")}>
<div aria-hidden="true" style={css("position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none")}><div style={css("position:absolute;inset:0;container-type:size;background:#0C0D0F")}>{(heroPortrait === false) && (<iframe src="https://player.vimeo.com/video/1231749248?h=49347f3d65&amp;background=1&amp;autoplay=1&amp;loop=1&amp;muted=1&amp;dnt=1" title="Showreel" tabIndex="-1" allow="autoplay; fullscreen; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" style={css("position:absolute;left:50%;top:0;width:max(100cqw,177.78cqh);height:max(56.25cqw,100cqh);transform:translateX(-50%);border:0")}></iframe>)}{(heroPortrait === true) && (<video src="/assets/hero-portrait-9x16.mp4" autoPlay muted loop playsInline preload="auto" tabIndex="-1" style={css("position:absolute;inset:0;width:100%;height:100%;object-fit:cover")}></video>)}</div><div style={css("position:absolute;inset:0;background:linear-gradient(180deg,rgba(12,13,15,0) 0%,rgba(12,13,15,0) 30%,rgba(12,13,15,0) 65%,rgba(12,13,15,.75) 100%)")}></div></div>

<div style={css("flex:1")}></div><div data-hero-row="1" style={css("max-width:1440px;margin:0 auto;padding:0 var(--g-m);width:100%;position:relative;z-index:3;display:flex;justify-content:space-between;align-items:flex-end;gap:24px;flex-wrap:wrap")}>
<div data-hero-id="1" style={css("display:flex;flex-direction:column;gap:10px;align-items:flex-start")}>
<h1 style={css("margin:0;font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.04em;line-height:1.5;color:#F2F2F0;text-wrap:balance")}>Markus Kriesmair <span style={css("color:#A9ADB4;font-weight:400")}>{T("— Art Director, Creative Director & Creative Strategist in Munich")}</span></h1>
<div style={css("font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098;display:flex;align-items:center;gap:10px")}><span style={css("width:8px;height:8px;border-radius:4px;background:#F2F2F0")}></span>{T("available for freelance projects")}</div>
</div><div data-hero-ctas="1" style={css("display:flex;gap:28px;flex-wrap:wrap;justify-content:flex-end;margin-left:auto")}>
<a href="#work" style={css("display: inline-flex; align-items: center; gap: 8px; padding: 0; border: none; background: none; font-family: 'Tanker','Satoshi',sans-serif; font-size: 20px; font-weight: 900; letter-spacing: .01em; color: #F2F2F0; text-decoration: none; cursor: pointer")} className="hv3">{T("See the work ")}<svg aria-hidden="true" viewBox="0 0 16 16" style={css("width:.8em;height:.8em;flex:none;overflow:visible;transform:rotate(0deg)")}><path d="M2.5 8h11M8.5 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="square" strokeLinejoin="round" strokeMiterlimit="2"></path></svg></a>
<a href="#leadership" style={css("display: inline-flex; align-items: center; gap: 8px; padding: 0; border: none; background: none; font-family: 'Tanker','Satoshi',sans-serif; font-size: 20px; font-weight: 900; letter-spacing: .01em; color: #F2F2F0; text-decoration: none; cursor: pointer; text-align: right")} className="hv4">{T("See leadership ")}<svg aria-hidden="true" viewBox="0 0 16 16" style={css("width:.8em;height:.8em;flex:none;overflow:visible;transform:rotate(0deg)")}><path d="M2.5 8h11M8.5 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="square" strokeLinejoin="round" strokeMiterlimit="2"></path></svg></a>
</div>

</div>
<div data-hero-row="1" style={css("max-width:1440px;margin:0 auto;padding:0 var(--g-m);width:100%;position:relative;z-index:2;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;padding-bottom:24px;padding-right:140px;font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098")}>
<span style={css("display:flex;gap:10px;align-items:center")}>{T("based in munich · ")}<span ref={clockRef}>--:--:--</span></span>
<span>{T("scroll ↓")}</span>
</div>
</section>

<div style={css("max-width:1440px;margin:0 auto;padding:0 var(--g-m)")}>

<section id="intro" style={css("display:grid;grid-template-columns:repeat(var(--g-cols),minmax(0,1fr));column-gap:var(--g-gap);row-gap:56px;padding:96px 0")}>
<div style={css("grid-column:var(--g-label);font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098;padding-top:.6em")}>{T("(intro)")}</div>
<p data-fade="1" style={css("grid-column:var(--g-main);margin:0;font-size:clamp(26px,3.2vw,48px);font-weight:300;line-height:1.25;letter-spacing:-0.03em;color:#F2F2F0;text-wrap:pretty")}>{(introWords).map((w, w_i) => (<React.Fragment key={w_i}><span data-w="1" style={css("opacity:.16;transition:opacity .25s linear")}>{w}</span></React.Fragment>))}</p>
<p style={css("grid-column:var(--g-m6);margin:0;font-size:18px;font-weight:300;line-height:1.55;color:#8C9098;text-wrap:pretty")}>{T("14+ years across leading agencies, in-house brand management and independent work. Munich, German and English.")}</p>
<nav aria-label={T("Services")} style={css("grid-column:var(--g-main);display:flex;gap:16px 28px;flex-wrap:wrap")}>
<a href={LANG === 'de' ? "/art-director-muenchen/" : "/en/art-director-munich/"} style={css("display:inline-flex;align-items:center;gap:8px;font-family:'Tanker','Satoshi',sans-serif;font-size:20px;line-height:1;letter-spacing:.01em;color:#F2F2F0;text-decoration:none")} className="hv3">Art Direction <svg aria-hidden="true" viewBox="0 0 16 16" style={css("width:.8em;height:.8em;flex:none;overflow:visible")}><path d="M2.5 8h11M8.5 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="square" strokeLinejoin="round" strokeMiterlimit="2"></path></svg></a>
<a href={LANG === 'de' ? "/creative-director-muenchen/" : "/en/creative-director-munich/"} style={css("display:inline-flex;align-items:center;gap:8px;font-family:'Tanker','Satoshi',sans-serif;font-size:20px;line-height:1;letter-spacing:.01em;color:#F2F2F0;text-decoration:none")} className="hv3">Creative Direction <svg aria-hidden="true" viewBox="0 0 16 16" style={css("width:.8em;height:.8em;flex:none;overflow:visible")}><path d="M2.5 8h11M8.5 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="square" strokeLinejoin="round" strokeMiterlimit="2"></path></svg></a>
<a href={LANG === 'de' ? "/creative-strategist-muenchen/" : "/en/creative-strategist-munich/"} style={css("display:inline-flex;align-items:center;gap:8px;font-family:'Tanker','Satoshi',sans-serif;font-size:20px;line-height:1;letter-spacing:.01em;color:#F2F2F0;text-decoration:none")} className="hv3">Creative Strategy <svg aria-hidden="true" viewBox="0 0 16 16" style={css("width:.8em;height:.8em;flex:none;overflow:visible")}><path d="M2.5 8h11M8.5 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="square" strokeLinejoin="round" strokeMiterlimit="2"></path></svg></a>
</nav>
<div style={css("grid-column:var(--g-main);display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px")}>
<div style={css("display:flex;flex-direction:column;gap:20px")}><span style={css("font-family:'Satoshi',sans-serif;font-size:12px;letter-spacing:.04em;color:#8C9098")}>{T("years in creative & brand")}</span><span style={css("font-family: 'Tanker','Satoshi',sans-serif; font-weight: 400; letter-spacing: 0; font-size: clamp(56px,6vw,96px); line-height: .9; font-style: normal")} data-count="14" data-suffix="+">14+</span></div>
<div style={css("display:flex;flex-direction:column;gap:20px")}><span style={css("font-family:'Satoshi',sans-serif;font-size:12px;letter-spacing:.04em;color:#8C9098")}>{T("national & international brands")}</span><span style={css("font-family: 'Tanker','Satoshi',sans-serif; font-weight: 400; letter-spacing: 0; font-size: clamp(56px,6vw,96px); line-height: .9; font-style: normal")} data-count="20" data-suffix="+">20+</span></div>
<div style={css("display:flex;flex-direction:column;gap:20px")}><span style={css("font-family:'Satoshi',sans-serif;font-size:12px;letter-spacing:.04em;color:#8C9098")}>{T("native German, fluent English")}</span><span style={css("font-family: 'Tanker','Satoshi',sans-serif; font-weight: 400; letter-spacing: 0; font-size: clamp(56px,6vw,96px); line-height: .9; font-style: normal")} data-scramble="DE/ EN">{T("DE/ EN")}</span></div>
</div>
<div style={css("grid-column:var(--g-main);font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098")}>{T("thjnk · GGH MullenLowe · Grabarz & Partner · Serviceplan · Heye & Partner · Ströer Content Group")}</div>
</section>

</div>
<div style={css("max-width:1440px;margin:0 auto;padding:0 var(--g-m)")}>
<section id="leadership" style={css("display:grid;grid-template-columns:repeat(var(--g-cols),minmax(0,1fr));column-gap:var(--g-gap);row-gap:40px;padding:40px 0 96px")}>
<div style={css("grid-column:var(--g-label);font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098;padding-top:1.4em")}>{T("(01) leadership")}</div>
<h2 style={css("font-family:'Tanker','Satoshi',sans-serif;font-weight:400;letter-spacing:0;grid-column:var(--g-main);margin:0;font-size:clamp(48px,8vw,136px);line-height:.92;color:#F2F2F0;text-wrap:balance")}>{T("Teams, ideas, clients.")}</h2>
<p style={css("grid-column:var(--g-main);margin:0;max-width:44ch;font-size:clamp(20px,1.8vw,28px);font-weight:300;line-height:1.35;color:#8C9098;text-wrap:pretty")}>{T("From brief to final delivery — on the agency side and the client side.")}</p>
<ol style={css("grid-column:var(--g-full);margin:24px 0 0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:40px var(--g-gap)")}>
<li style={css("display:flex;flex-direction:column;gap:12px;padding-top:20px;border-top:1px solid #3A3E45")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098")}>{T("Serviceplan")}</span><h3 style={css("margin:0;font-family:'Tanker','Satoshi',sans-serif;font-weight:400;font-size:22px;line-height:1.15;color:#F2F2F0;text-wrap:balance")}>{T("Art team lead, Saturn")}</h3><p style={css("margin:0;font-size:15px;line-height:1.55;font-weight:300;color:#A9ADB4;text-wrap:pretty")}>{T("Three Junior Art Directors and an intern — from creative platform to production and year-round campaign lead.")}</p></li>
<li style={css("display:flex;flex-direction:column;gap:12px;padding-top:20px;border-top:1px solid #3A3E45")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098")}>{T("thjnk")}</span><h3 style={css("margin:0;font-family:'Tanker','Satoshi',sans-serif;font-weight:400;font-size:22px;line-height:1.15;color:#F2F2F0;text-wrap:balance")}>{T("Senior Art Director")}</h3><p style={css("margin:0;font-size:15px;line-height:1.55;font-weight:300;color:#A9ADB4;text-wrap:pretty")}>{T("Line manager of one Senior Art Director and two Art Directors for 2.5 years, incl. development talks and career development — in tandem with a Creative Director Copy.")}</p></li>
<li style={css("display:flex;flex-direction:column;gap:12px;padding-top:20px;border-top:1px solid #3A3E45")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098")}>{T("Ströer Content Group")}</span><h3 style={css("margin:0;font-family:'Tanker','Satoshi',sans-serif;font-weight:400;font-size:22px;line-height:1.15;color:#F2F2F0;text-wrap:balance")}>{T("Cross-functional lead")}</h3><p style={css("margin:0;font-size:15px;line-height:1.55;font-weight:300;color:#A9ADB4;text-wrap:pretty")}>{T("Staffing authority for t-online and watson: project teams from internal specialists and booked freelancers. Secured project budgets through business cases to C-level and managed them to delivery.")}</p></li>
<li style={css("display:flex;flex-direction:column;gap:12px;padding-top:20px;border-top:1px solid #3A3E45")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098")}>{T("O₂ · Freelance, for Publicis")}</span><h3 style={css("margin:0;font-family:'Tanker','Satoshi',sans-serif;font-weight:400;font-size:22px;line-height:1.15;color:#F2F2F0;text-wrap:balance")}>{T("Account handover")}</h3><p style={css("margin:0;font-size:15px;line-height:1.55;font-weight:300;color:#A9ADB4;text-wrap:pretty")}>{T("Booked by Publicis, the incoming agency, as interim Art / Creative Director. Brought my O₂ knowledge into the new team, kept the creative work running through the transition and handed that knowledge over.")}</p></li>
<li style={css("display:flex;flex-direction:column;gap:12px;padding-top:20px;border-top:1px solid #3A3E45")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098")}>{T("Teaching")}</span><h3 style={css("margin:0;font-family:'Tanker','Satoshi',sans-serif;font-weight:400;font-size:22px;line-height:1.15;color:#F2F2F0;text-wrap:balance")}>{T("Lecturer, campaign development")}</h3><p style={css("margin:0;font-size:15px;line-height:1.55;font-weight:300;color:#A9ADB4;text-wrap:pretty")}>{T("htk Hamburg 2023–2024 · Burke Munich 2025. Mentoring junior creatives along the way.")}</p></li>
</ol>
<div style={css("grid-column:var(--g-full);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:40px var(--g-gap);border-top:1px solid #26292E;padding-top:28px")}><div style={css("display:flex;flex-direction:column;gap:12px")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{T("Clients")}</span><p style={css("margin:0;font-family:'Tanker','Satoshi',sans-serif;font-weight:400;font-size:22px;line-height:1.35;color:#F2F2F0;text-wrap:pretty")}>{T("BioNTech · BMW · Volkswagen · Audi · Škoda · Deutsche Bahn · E.ON · AOK · ")}<img src="/assets/o2-logo.png" alt="O₂" style={css("display:inline-block;height:calc(1cap * 237 / 211);width:auto;vertical-align:calc(-1cap * 26 / 211)")} />{T(" · Ducati · Union Investment · Yelp · t-online · Veltins · SABMiller · Adelholzener · McDonald’s · Burger King · Der Spiegel · Hornbach · IKEA · Gore-Tex · Saturn · C&A")}</p></div><div style={css("display:flex;flex-direction:column;gap:12px")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{T("Pitches")}</span><p style={css("margin:0;font-family:'Tanker','Satoshi',sans-serif;font-weight:400;font-size:22px;line-height:1.35;color:#A9ADB4;text-wrap:pretty")}>{T("BMW · Volkswagen · Audi · Škoda · Deutsche Bahn · E.ON · AOK · Saturn · C&A · Veltins · SABMiller · Burger King · Bayer · Google · OTTO · Mondelēz · Schöfferhofer · Landliebe · Penny · Montblanc · ARD · Das Handwerk · Land Niedersachsen")}</p></div></div>
</section>
</div>

</>)}
<section id="work" style={css("padding:0 0 72px")}>
<div style={css("max-width:1440px;margin:0 auto;padding:0 var(--g-m);display:grid;grid-template-columns:repeat(var(--g-cols),minmax(0,1fr));column-gap:var(--g-gap);row-gap:40px")}>
{full && (<>
<div style={css("grid-column:var(--g-label);font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098;padding-top:1.4em")}>{T("(02) selected work")}</div>
<h2 style={css("font-family:'Tanker','Satoshi',sans-serif;font-weight:400;letter-spacing:0;grid-column:var(--g-main);margin:0;font-size:clamp(56px,10vw,168px);line-height:.9;color:#F2F2F0")}>{T("work")}</h2>
<p style={css("grid-column:var(--g-main);margin:0;max-width:34ch;font-size:clamp(20px,1.8vw,28px);font-weight:300;line-height:1.35;color:#8C9098;text-wrap:pretty")}>{T("Automotive, health, finance, launches and in-house brand work — each a different kind of trust to earn.")}</p>
</>)}
<div style={css(`grid-column:var(--g-full);display:flex;justify-content:space-between;align-items:center;gap:16px;margin-top:${full ? 48 : 0}px`)}>
<span style={css("display:flex;gap:14px;align-items:center;white-space:nowrap;font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098")}><span ref={cntRef}>01</span> / {caseTotal} <span className="ctl-hint" style={css("color:#5B5F66")}>{T("drag or click")}</span></span>
<div style={css("display:flex;gap:24px")}><button type="button" aria-label={T("Previous case")} onClick={prev} style={css("display:inline-flex;align-items:center;gap:8px;padding:0;border:none;background:none;font-family:'Satoshi',sans-serif;font-size:16px;font-weight:700;color:#F2F2F0;text-decoration:none;cursor:pointer")} className="hv5"><svg aria-hidden="true" viewBox="0 0 16 16" style={css("width:.8em;height:.8em;flex:none;overflow:visible;transform:rotate(180deg)")}><path d="M2.5 8h11M8.5 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="square" strokeLinejoin="round" strokeMiterlimit="2"></path></svg>{T(" prev")}</button><button type="button" aria-label={T("Next case")} onClick={next} style={css("display:inline-flex;align-items:center;gap:8px;padding:0;border:none;background:none;font-family:'Satoshi',sans-serif;font-size:16px;font-weight:700;color:#F2F2F0;text-decoration:none;cursor:pointer")} className="hv6">{T("next ")}<svg aria-hidden="true" viewBox="0 0 16 16" style={css("width:.8em;height:.8em;flex:none;overflow:visible;transform:rotate(0deg)")}><path d="M2.5 8h11M8.5 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="square" strokeLinejoin="round" strokeMiterlimit="2"></path></svg></button></div>
</div>
</div>
<div ref={scRef} data-scroller="1" style={css("position:relative;display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;padding:32px max(var(--g-m), calc((100vw - 1440px) / 2 + var(--g-m))) 8px;scroll-padding-left:max(var(--g-m), calc((100vw - 1440px) / 2 + var(--g-m)));cursor:grab;user-select:none")}>
{(workCases).map((cs, cs_i) => (<React.Fragment key={cs_i}>
<article id={cs.anchor} style={css("flex:0 0 clamp(300px,58vw,840px);scroll-snap-align:start;display:flex;flex-direction:column;gap:32px")}>
<div style={css("position:relative;aspect-ratio:16/10;border-radius:6px;overflow:hidden;background:#16181B")}>
<Slot id={cs.slotId} src={cs.slotSrc} shape="rect" placeholder={cs.slotHint} style={css("position:absolute;inset:0;pointer-events:auto")} />
</div>
<div style={css("display:flex;flex-direction:column;gap:36px;max-width:60ch;padding:0 20px")}>
<div style={css("display:flex;flex-direction:column;gap:16px")}>
<div style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098;display:flex;gap:12px;flex-wrap:wrap")}><span style={css("color:#F2F2F0")}>{cs.num} — {cs.brand}</span><span>{cs.tagCaps}</span></div>
<h3 style={css("font-family:'Tanker','Satoshi',sans-serif;font-weight:400;letter-spacing:0;margin:0;font-size:clamp(28px,2.8vw,40px);line-height:1.05;text-wrap:balance")}>{cs.title}</h3>
<p style={css("margin:0;font-family:'Satoshi',sans-serif;font-size:16px;font-weight:400;line-height:1.55;color:#A9ADB4;text-wrap:pretty")}>{cs.body}</p>
{(cs.hasDe) && (<>
<div style={css("display:flex;flex-direction:column;gap:4px")}>
<div style={css("font-family:'Satoshi',sans-serif;font-size:16px;font-weight:400;line-height:1.55;font-style:italic;color:#F2F2F0;text-wrap:pretty")}>{cs.de}</div>
<div style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{EN(cs.en)}</div>
</div>
</>)}
</div>
<div style={css("display:flex;flex-direction:column;gap:2px;font-family:'Satoshi',sans-serif;font-size:16px;font-weight:400;line-height:1.55")}>
<div><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098;padding-right:8px")}>{T("Role")}</span>{(cs.role.ph) && (<><mark style={css("background:#FFE86B;color:#000000;padding:1px 4px")}>{cs.role.t}</mark></>)}{(cs.role.np) && (<>{cs.role.t}</>)}</div>
<div><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098;padding-right:8px")}>{T("Outcome")}</span>{(cs.outcome.ph) && (<><mark style={css("background:#FFE86B;color:#000000;padding:1px 4px")}>{cs.outcome.t}</mark></>)}{(cs.outcome.np) && (<>{cs.outcome.t}</>)}</div>
</div>
<button type="button" onClick={cs.toggle} aria-expanded={cs.isOpen} style={css("align-self:flex-start;display:inline-flex;align-items:center;gap:8px;padding:0;border:none;background:none;font-family:'Tanker','Satoshi',sans-serif;font-size:20px;font-weight:400;letter-spacing:.01em;color:#F2F2F0;text-decoration:none;cursor:pointer")} className="hv7">{cs.toggleLabel} <svg aria-hidden="true" viewBox="0 0 16 16" style={css(`width:.8em;height:.8em;flex:none;overflow:visible;transform:rotate(${cs.toggleRot})`)}><path d="M2.5 8h11M8.5 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="square" strokeLinejoin="round" strokeMiterlimit="2"></path></svg></button>
</div>
</article>
</React.Fragment>))}
</div>
<div id="case-detail">
{(hasAc) && (<>
<div role="dialog" aria-modal="true" aria-label={T("Case detail")} onClick={acClose} style={css("position:fixed;inset:0;z-index:900;background:rgba(0,0,0,.84);overflow-y:auto;overscroll-behavior:contain;padding:clamp(16px,4vw,56px) var(--g-m)")}>
<div onClick={lbStop} style={css("max-width:1360px;margin:0 auto;background:#16181B;border-radius:6px;overflow:hidden;clip-path:inset(0 round 6px);padding:clamp(24px,4vw,56px);display:grid;grid-template-columns:repeat(var(--g-cols),minmax(0,1fr));column-gap:var(--g-gap);row-gap:40px")}>
<div style={css("grid-column:var(--g-full);display:flex;justify-content:space-between;align-items:baseline;gap:16px;flex-wrap:wrap")}><h3 style={css("font-family:'Tanker','Satoshi',sans-serif;font-weight:400;letter-spacing:0;margin:0;font-size:clamp(36px,4.4vw,64px);line-height:1;")}>{(ac.isO2) && (<><img src="/assets/o2-logo.png" alt="O₂" style={css("display:inline-block;height:calc(1cap * 237 / 211);width:auto;vertical-align:calc(-1cap * 26 / 211);margin-right:.08em")} />{T(" Record Race")}</>)}{(ac.notO2) && (<>{ac.brand}</>)}</h3><button type="button" onClick={ac.toggle} style={css("display:inline-flex;align-items:center;gap:0;padding:0;border:none;background:none;font-family:'Satoshi',sans-serif;font-size:16px;font-weight:700;color:#F2F2F0;text-decoration:none;cursor:pointer")} aria-label={T("Close case")} className="hv8"><span aria-hidden="true" style={css("font-family:'Tanker','Satoshi',sans-serif;font-weight:400;font-size:clamp(32px,3.2vw,44px);line-height:1")}>X</span></button></div>
<div style={css("grid-column:var(--g-full);position:relative;aspect-ratio:16/9;border-radius:6px;overflow:hidden;clip-path:inset(0 round 6px);isolation:isolate;background:#0C0D0F")}>
{(ac.hasVideo) && (<><iframe data-src={ac.vimeoSrc} referrerPolicy="strict-origin-when-cross-origin" title={`${ac.brand} — case film`} allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" allowFullScreen style={css("position:absolute;inset:0;width:100%;height:100%;border:0")}></iframe></>)}
{(ac.noVideo) && (<><Slot id={ac.mediaSlot} src={ac.slotSrc} shape="rect" placeholder={ac.mediaHint} style={css("position:absolute;inset:0")} /></>)}
</div>
{(ac.hasChallenge) && (<><div style={css("grid-column:var(--g-half);display:flex;flex-direction:column;gap:12px")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{T("Challenge")}</span><p style={css("margin:0;font-family:'Satoshi',sans-serif;font-size:16px;font-weight:400;line-height:1.6;color:#D6D8DC")}>{ac.challenge}</p></div></>)}
{(ac.hasIdea) && (<><div style={css("grid-column:var(--g-half);display:flex;flex-direction:column;gap:12px")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{T("Idea")}</span><p style={css("margin:0;font-family:'Satoshi',sans-serif;font-size:16px;font-weight:400;line-height:1.6;color:#D6D8DC;color:#F2F2F0")}>{ac.idea}</p></div></>)}
{(ac.hasInsight) && (<><div style={css("grid-column:var(--g-half);display:flex;flex-direction:column;gap:12px")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{T("Insight")}</span><p style={css("margin:0;font-family:'Satoshi',sans-serif;font-size:16px;font-weight:400;line-height:1.6;color:#D6D8DC;font-style:italic;color:#F2F2F0")}>{ac.insight}</p></div></>)}
{(ac.hasStrategy) && (<><div style={css("grid-column:var(--g-full);display:flex;flex-direction:column;gap:12px")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{T("Strategy")}</span><p style={css("margin:0;max-width:60ch;font-family:'Satoshi',sans-serif;font-size:16px;font-weight:400;line-height:1.6;color:#D6D8DC;color:#F2F2F0")}>{ac.strategy}</p></div></>)}
{(ac.hasModels) && (<><div style={css("grid-column:var(--g-full);display:flex;flex-direction:column;gap:12px")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{T("Model positioning")}</span>
<div style={css("display:flex;flex-direction:column;border-top:1px solid #26292E")}><div style={css("display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,2fr);gap:4px 24px;padding:10px 0;border-bottom:1px solid #26292E;font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}><span>{T("Model")}</span><span>{T("Dream")}</span><span>{T("Audience")}</span></div>{(ac.models).map((md, md_i) => (<React.Fragment key={md_i}><div style={css("display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,2fr);gap:4px 24px;padding:14px 0;border-bottom:1px solid #26292E;font-family:'Satoshi',sans-serif;font-size:16px;font-weight:400;line-height:1.6;color:#D6D8DC")}><span style={css("font-family:'Tanker','Satoshi',sans-serif;font-size:20px;line-height:1.3;color:#F2F2F0")}>{md.name}</span><span>{(md.role.ph) && (<><mark style={css("background:#FFE86B;color:#000000;padding:1px 4px")}>{md.role.t}</mark></>)}{(md.role.np) && (<>{md.role.t}</>)}</span><span>{(md.line.ph) && (<><mark style={css("background:#FFE86B;color:#000000;padding:1px 4px")}>{md.line.t}</mark></>)}{(md.line.np) && (<>{md.line.t}</>)}</span></div></React.Fragment>))}</div></div></>)}

{(ac.hasDid) && (<><div style={css("grid-column:var(--g-half);display:flex;flex-direction:column;gap:12px")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{ac.didLabel}</span><ul style={css("margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px")}>{(ac.did).map((it, it_i) => (<React.Fragment key={it_i}><li style={css("position:relative;padding-left:20px;text-wrap:pretty;font-family:'Satoshi',sans-serif;font-size:16px;font-weight:400;line-height:1.6;color:#D6D8DC")}><span aria-hidden="true" style={css("position:absolute;left:2px;top:.7em;width:5px;height:5px;border-radius:50%;background:#8C9098")}></span><span>{(it.ph) && (<><mark style={css("background:#FFE86B;color:#000000;padding:1px 4px")}>{it.t}</mark></>)}{(it.np) && (<>{it.t}</>)}</span></li></React.Fragment>))}</ul></div></>)}
{(ac.hasSteps) && (<><div style={css("grid-column:var(--g-full);display:flex;flex-direction:column;gap:12px")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{ac.didLabel}</span>
<div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:12px")}>{(ac.steps).map((fn, fn_i) => (<React.Fragment key={fn_i}><div style={css("background:#0C0D0F;border-radius:6px;padding:24px;display:flex;flex-direction:column;gap:14px")}><div style={css("display:flex;justify-content:space-between;align-items:center;gap:12px")}><span style={css("font-family:'Tanker','Satoshi',sans-serif;font-size:20px;color:#F2F2F0")}>{fn.no} {fn.stage}</span>{(fn.notLast) && (<><span style={css("color:#8C9098;display:flex")}><svg aria-hidden="true" viewBox="0 0 16 16" style={css("width:.8em;height:.8em;flex:none;overflow:visible")}><path d="M2.5 8h11M8.5 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="square" strokeLinejoin="round" strokeMiterlimit="2"></path></svg></span></>)}</div><ul style={css("margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px")}>{(fn.items).map((it, it_i) => (<React.Fragment key={it_i}><li style={css("position:relative;padding-left:20px;text-wrap:pretty;font-family:'Satoshi',sans-serif;font-size:16px;font-weight:400;line-height:1.6;color:#D6D8DC")}><span aria-hidden="true" style={css("position:absolute;left:2px;top:.7em;width:5px;height:5px;border-radius:50%;background:#8C9098")}></span>{it}</li></React.Fragment>))}</ul></div></React.Fragment>))}</div></div></>)}
<div style={css(`grid-column:${ac.resCol};display:flex;flex-direction:column;gap:12px`)}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{ac.resultLabel}</span><ul style={css("margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px")}>{(ac.result).map((it, it_i) => (<React.Fragment key={it_i}><li style={css("position:relative;padding-left:20px;text-wrap:pretty;font-family:'Satoshi',sans-serif;font-size:16px;font-weight:400;line-height:1.6;color:#D6D8DC")}><span aria-hidden="true" style={css("position:absolute;left:2px;top:.7em;width:5px;height:5px;border-radius:50%;background:#8C9098")}></span><span>{(it.ph) && (<></>)}{(it.np) && (<>{it.t}</>)}</span></li></React.Fragment>))}</ul></div>
{(ac.hasCtx) && (<><div style={css("grid-column:var(--g-full);display:flex;flex-direction:column;gap:12px")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{ac.ctxLabel}</span><p style={css("margin:0;font-family:'Satoshi',sans-serif;font-size:16px;font-weight:400;line-height:1.6;color:#D6D8DC;text-wrap:pretty")}>{ac.ctxText}</p></div></>)}
{(ac.hasSrc) && (<><div style={css("grid-column:var(--g-full);font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;line-height:1.45;color:#8C9098")}>{T("Source: ")}<a href={ac.srcHref} target="_blank" rel="noopener" style={css("color:#D6D8DC;text-decoration:underline;text-underline-offset:3px;overflow-wrap:anywhere")} className="hv9">{ac.srcLabel}</a></div></>)}
{(ac.hasFunnel) && (<><div style={css("grid-column:var(--g-full);display:flex;flex-direction:column;gap:12px")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{T("Full funnel")}</span>
<div style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:12px")}>{(ac.funnel).map((fn, fn_i) => (<React.Fragment key={fn_i}><div style={css("background:#0C0D0F;border-radius:6px;padding:24px;display:flex;flex-direction:column;gap:14px")}><div style={css("display:flex;justify-content:space-between;align-items:center;gap:12px")}><span style={css("font-family:'Tanker','Satoshi',sans-serif;font-size:20px;color:#F2F2F0")}>{fn.no} {fn.stage}</span>{(fn.notLast) && (<><span style={css("color:#8C9098;display:flex")}><svg aria-hidden="true" viewBox="0 0 16 16" style={css("width:.8em;height:.8em;flex:none;overflow:visible")}><path d="M2.5 8h11M8.5 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="square" strokeLinejoin="round" strokeMiterlimit="2"></path></svg></span></>)}</div><ul style={css("margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:8px")}>{(fn.items).map((it, it_i) => (<React.Fragment key={it_i}><li style={css("position:relative;padding-left:20px;text-wrap:pretty;font-family:'Satoshi',sans-serif;font-size:16px;font-weight:400;line-height:1.6;color:#D6D8DC")}><span aria-hidden="true" style={css("position:absolute;left:2px;top:.7em;width:5px;height:5px;border-radius:50%;background:#8C9098")}></span>{it}</li></React.Fragment>))}</ul></div></React.Fragment>))}</div></div></>)}
{(ac.hasFilms) && (<><div style={css("grid-column:var(--g-full);display:flex;flex-direction:column;gap:12px")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{T("Brand films")}</span>
<div role="group" aria-label={T("Choose a film to show its storyboard")} style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:12px")}>
{(films).map((fm, fm_i) => (<React.Fragment key={fm_i}>
<div role="button" tabIndex="0" aria-pressed={fm.isActive} onMouseEnter={fm.select} onFocus={fm.select} onClick={fm.select} onKeyDown={fm.key} style={css(`position:relative;background:${fm.bg};border-radius:6px;padding:24px;display:flex;flex-direction:column;gap:12px;cursor:pointer;outline:none;border:1px solid ${fm.border};opacity:${fm.op};transition:${cardTrans};transition-property:opacity,background-color`)} className="hv10">
<div style={css("display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap")}><span style={css("font-family:'Tanker','Satoshi',sans-serif;font-size:20px;color:#F2F2F0")}>{fm.title} <span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{fm.sub}</span></span>{(fm.concept) && (<><span style={css("padding:3px 10px;border-radius:999px;border:1px solid #3A3E45;font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098;color:#F2F2F0")}>{T("Concept · not produced")}</span></>)}</div>
{(fm.hasBody) && (<><p style={css("margin:0;font-family:'Satoshi',sans-serif;font-size:16px;font-weight:400;line-height:1.6;color:#D6D8DC")}>{fm.body}</p></>)}
{(fm.hasLink) && (<><span style={css("font-family:'Satoshi',sans-serif;font-size:16px;font-weight:400;line-height:1.6;color:#D6D8DC")}></span></>)}

<span aria-hidden="true" style={css(`position:absolute;left:32px;bottom:-7px;width:12px;height:12px;background:#1F2226;transform:rotate(45deg);opacity:${fm.notch};transition:${cardTrans}`)}></span>
</div>
</React.Fragment>))}
</div>
<div style={css("display:grid;margin-top:8px")}>
{(boards).map((sb, sb_i) => (<React.Fragment key={sb_i}>
<div aria-hidden={sb.hidden} style={css(`grid-area:1 / 1;display:flex;flex-direction:column;gap:12px;opacity:${sb.op};pointer-events:${sb.pe};visibility:${sb.vis};transition:${boardTrans}`)}>
<div style={css("display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,180px),1fr));gap:12px")}>
{(sb.frames).map((df, df_i) => (<React.Fragment key={df_i}><div style={css(`display:flex;flex-direction:column;gap:8px;opacity:${df.op};transform:translateY(${df.ty});transition:${boardTrans};transition-delay:${df.delay}`)}><div style={css("position:relative;aspect-ratio:16/9;border-radius:6px;overflow:hidden;background:#0C0D0F")}><Slot id={df.slotId} shape="rect" fit="cover" placeholder={df.hint} style={css(`position:absolute;inset:0;transform:scale(${df.zoom});transform-origin:${df.origin}`)} /></div><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{df.no}</span><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;line-height:1.45;color:#D6D8DC;text-wrap:pretty")}>{(df.ph) && (<><mark style={css("background:#FFE86B;color:#000000;padding:1px 4px")}>{df.t}</mark></>)}{(df.np) && (<>{df.t}</>)}</span>{(df.hasDe) && (<><span style={css("display:flex;flex-direction:column;gap:2px")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;line-height:1.45;font-style:italic;color:#F2F2F0")}>{df.de}</span><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{EN(df.en)}</span></span></>)}</div></React.Fragment>))}
</div>
{(sb.hasEnd) && (<><div style={css("display:flex;flex-direction:column;gap:4px;padding-top:8px")}><div style={css("font-family:'Satoshi',sans-serif;font-size:clamp(18px,1.6vw,22px);font-weight:400;font-style:italic;line-height:1.35;color:#F2F2F0;text-wrap:balance")}>{sb.end}</div>{(sb.hasEndEn) && (<><div style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{EN(sb.endEn)}</div></>)}</div></>)}
{(sb.hasNote) && (<><span style={css("margin-top:auto;padding-top:8px;font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{sb.note}</span></>)}
</div>
</React.Fragment>))}
</div>
</div></>)}
{(ac.hasQuote) && (<><figure style={css("grid-column:var(--g-full);margin:0;display:flex;flex-direction:column;gap:8px;padding-top:24px;border-top:1px solid #26292E")}><blockquote style={css("margin:0;font-family:'Satoshi',sans-serif;font-size:16px;font-weight:400;line-height:1.6;color:#D6D8DC;font-style:italic;color:#F2F2F0;max-width:60ch;text-wrap:pretty")}>{ac.quote}</blockquote><figcaption style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{ac.quoteBy}</figcaption></figure></>)}
{(hasTabs) && (<><div style={css("grid-column:var(--g-full);display:flex;flex-direction:column;gap:12px")}><span id="db-films-label" style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{tabsLabel}</span>
<div role="tablist" aria-labelledby="db-films-label" style={css("display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:12px")}>
{(dbTabs).map((dt, dt_i) => (<React.Fragment key={dt_i}>
<button type="button" role="tab" id={dt.tabId} aria-selected={dt.isActive} aria-controls={dt.panelId} tabIndex={dt.tabIndex} onMouseEnter={dt.select} onFocus={dt.select} onClick={dt.select} onKeyDown={dt.key} style={css(`position:relative;text-align:left;font:inherit;background:${dt.bg};border-radius:6px;padding:24px;display:flex;flex-direction:column;gap:12px;cursor:pointer;outline:none;border:1px solid transparent;opacity:${dt.op};transition:${cardTrans};transition-property:opacity,background-color`)} className="hv11">
<span style={css("display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap")}><span style={css("font-family:'Tanker','Satoshi',sans-serif;font-size:20px;color:#F2F2F0")}>{dt.title} <span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{dt.sub}</span></span><span style={css("padding:3px 10px;border-radius:999px;border:1px solid #3A3E45;font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098;color:#F2F2F0")}>{dt.tag}</span></span>
<span style={css("font-family:'Satoshi',sans-serif;font-size:16px;font-weight:400;line-height:1.6;color:#D6D8DC")}>{dt.line}{(dt.hasFlag) && (<> <mark style={css("background:#FFE86B;color:#000000;padding:1px 4px")}>{dt.flag}</mark></>)}</span>
<span aria-hidden="true" style={css(`position:absolute;left:32px;bottom:-7px;width:12px;height:12px;background:#1F2226;transform:rotate(45deg);opacity:${dt.notch};transition:${cardTrans}`)}></span>
</button>
</React.Fragment>))}
</div>
<div style={css("display:grid;margin-top:8px")}>
{(dbRows).map((dr, dr_i) => (<React.Fragment key={dr_i}>
<div role="tabpanel" id={dr.panelId} aria-labelledby={dr.tabId} aria-hidden={dr.hidden} style={css(`grid-area:1 / 1;min-width:0;opacity:${dr.op};pointer-events:${dr.pe};visibility:${dr.vis};transition:${boardTrans}`)}>
<div style={css("display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x proximity;padding-bottom:4px")}>
{(dr.vids).map((dv, dv_i) => (<React.Fragment key={dv_i}><div style={css(`flex:0 0 max(240px, calc((100% - 24px) / 3));min-width:0;scroll-snap-align:start;display:flex;flex-direction:column;gap:8px;opacity:${dv.op};transform:translateY(${dv.ty});transition:${boardTrans};transition-delay:${dv.delay}`)}>
<div style={css(`position:relative;aspect-ratio:${dv.ar};border-radius:6px;overflow:hidden;background:#0C0D0F`)}>
{(dv.hasThumb) && (<><img src={dv.thumb} alt={dv.alt} loading="lazy" onClick={dv.play} style={css(`position:absolute;inset:0;width:100%;height:100%;object-fit:${dv.fit};cursor:${dv.cursor}`)} /></>)}
{(dv.isMp4) && (<><video src={dv.mp4Poster} muted playsInline preload={dv.preload} aria-hidden="true" onClick={dv.play} style={css(`position:absolute;inset:0;width:100%;height:100%;object-fit:${dv.fit};cursor:pointer`)}></video></>)}
{(dv.isAudio) && (<><div style={css("position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:16px;background:#16181B")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{T("Audio")}</span><div style={css("display:flex;align-items:center;gap:12px")}><button type="button" onClick={dv.aToggle} aria-label={dv.aLabel} aria-pressed={dv.aOn} style={css("flex:none;width:48px;height:48px;border-radius:50%;border:1px solid #F2F2F0;background:rgba(12,13,15,.72);color:#F2F2F0;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;font-family:'Satoshi',sans-serif;font-size:14px;font-weight:700")} className="hv12 hv13">{dv.aIcon}</button><span onClick={dv.aSeek} style={css("flex:1;height:4px;border-radius:2px;background:#3A3E45;position:relative;cursor:pointer")}><span style={css(`position:absolute;left:0;top:0;bottom:0;width:${dv.aPct};border-radius:2px;background:#EDF0F5`)}></span></span><span style={css("flex:none;font-family:'IBM Plex Mono',monospace;font-size:12px;color:#A9ADB4")}>{dv.aTime}</span></div></div></>)}
{(dv.noThumb) && (<><Slot id={dv.slot} shape="rect" fit="cover" placeholder={dv.hint} style={css("position:absolute;inset:0")} /></>)}
{(dv.isGal) && (<><img src={dv.galSrc} alt={dv.galAlt} loading="lazy" style={css("position:absolute;inset:0;width:100%;height:100%;object-fit:cover")} /><span style={css("position:absolute;left:16px;bottom:16px;display:flex;gap:8px;align-items:center")}><button type="button" onClick={dv.galPrev} aria-label={T("Previous image")} style={css("width:40px;height:40px;border-radius:50%;border:1px solid #F2F2F0;background:rgba(12,13,15,.72);color:#F2F2F0;cursor:pointer;padding:0;font-family:'Satoshi',sans-serif;font-size:16px")} className="hv14 hv15">←</button><button type="button" onClick={dv.galNext} aria-label={T("Next image")} style={css("width:40px;height:40px;border-radius:50%;border:1px solid #F2F2F0;background:rgba(12,13,15,.72);color:#F2F2F0;cursor:pointer;padding:0;font-family:'Satoshi',sans-serif;font-size:16px")} className="hv16 hv17">→</button><span aria-live="polite" style={css("padding:3px 10px;border-radius:999px;background:rgba(12,13,15,.72);font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;color:#F2F2F0")}>{dv.galCount}</span></span></>)}
{(dv.isVid) && (<><button type="button" onClick={dv.play} aria-label={dv.playLabel} style={css("position:absolute;left:16px;bottom:16px;width:48px;height:48px;border-radius:50%;border:1px solid #F2F2F0;background:rgba(12,13,15,.72);color:#F2F2F0;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0")} className="hv18 hv19"><svg aria-hidden="true" viewBox="0 0 16 16" style={css("width:14px;height:14px;margin-left:2px")}><path d="M3 1.5v13l11-6.5z" fill="currentColor"></path></svg></button></>)}
</div>
<span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{dv.no}</span>
<span style={css("font-family:'Satoshi',sans-serif;font-size:13px;line-height:1.45;color:#D6D8DC;text-wrap:pretty")}>{(dv.ph) && (<><mark style={css("background:#FFE86B;color:#000000;padding:1px 4px")}>{dv.t}</mark></>)}{(dv.np) && (<>{dv.t}</>)}</span>
{(dv.hasEn) && (<><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{EN(dv.en)}</span></>)}
</div></React.Fragment>))}
</div>
</div>
</React.Fragment>))}
</div>
</div></>)}
<div style={css("grid-column:var(--g-full);display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}><span>{(ac.year.ph) && (<><mark style={css("background:#FFE86B;color:#000000;padding:1px 4px")}>{ac.year.t}</mark></>)}{(ac.year.np) && (<>{ac.year.t}</>)}</span><span>{(ac.org.ph) && (<><mark style={css("background:#FFE86B;color:#000000;padding:1px 4px")}>{ac.org.t}</mark></>)}{(ac.org.np) && (<>{ac.org.t}</>)}</span>{(ac.hasFootnote) && (<><span style={css("flex-basis:100%")}>{ac.footnote}</span></>)}</div>
</div>
</div>
</>)}
</div>
</section>

<div style={css("max-width:1440px;margin:0 auto;padding:0 var(--g-m)")}>
{full && (<>

<section id="process" style={css("position:relative;isolation:isolate;display:grid;grid-template-columns:repeat(var(--g-cols),minmax(0,1fr));column-gap:var(--g-gap);row-gap:40px;padding:96px 0 96px;margin-bottom:96px")}>
<div aria-hidden="true" style={css("position:absolute;top:0;bottom:0;left:calc(50% - 50vw);width:100vw;z-index:-1;overflow:hidden;pointer-events:none;background:#000000")}><img src="/assets/process-bg.gif" alt="" style={css("position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;transform:scale(1.4);transform-origin:center;display:block")} /></div>
<div style={css("grid-column:var(--g-label);font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098;padding-top:1.4em")}>{T("(03) how I work")}</div>
<h2 style={css("font-family:'Tanker','Satoshi',sans-serif;font-weight:400;letter-spacing:0;grid-column:var(--g-main);margin:0;font-size:clamp(56px,10vw,168px);line-height:.9;color:#F2F2F0")}>{T("process")}</h2>
<p style={css("grid-column:var(--g-main);margin:0;max-width:40ch;font-size:clamp(20px,1.8vw,28px);font-weight:300;line-height:1.35;color:#8C9098;text-wrap:pretty")}>{T("From brief to delivery in five steps — whether I join your team or lead the project.")}</p>
<ol style={css("grid-column:var(--g-full);margin:24px 0 0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(var(--g-cols),minmax(0,1fr));column-gap:var(--g-gap)")}>
<li style={css("grid-column:var(--g-full);display:grid;grid-template-columns:repeat(var(--g-cols),minmax(0,1fr));column-gap:var(--g-gap);row-gap:12px;padding:28px 0;border-top:1px solid #3A3E45")}><span style={css("grid-column:var(--g-label);font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098;padding-top:.5em")}>01</span><h3 style={css("grid-column:var(--g-l5proc);margin:0;font-family:'Tanker','Satoshi',sans-serif;font-weight:400;font-size:clamp(28px,3vw,44px);line-height:1;color:#F2F2F0;text-wrap:balance")}>{T("Listen")}</h3><div style={css("grid-column:var(--g-r5proc);display:flex;flex-direction:column;gap:10px")}><p style={css("margin:0;font-size:16px;line-height:1.55;font-weight:300;color:#A9ADB4;text-wrap:pretty")}>{T("Briefing, business goal, audience, category. I question the brief until the real task is on the table.")}</p><span style={css("font-size:15px;line-height:1.5;color:#F2F2F0")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098;padding-right:8px")}>{T("Output")}</span>{T("A sharpened brief")}</span></div></li>
<li style={css("grid-column:var(--g-full);display:grid;grid-template-columns:repeat(var(--g-cols),minmax(0,1fr));column-gap:var(--g-gap);row-gap:12px;padding:28px 0;border-top:1px solid #3A3E45")}><span style={css("grid-column:var(--g-label);font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098;padding-top:.5em")}>02</span><h3 style={css("grid-column:var(--g-l5proc);margin:0;font-family:'Tanker','Satoshi',sans-serif;font-weight:400;font-size:clamp(28px,3vw,44px);line-height:1;color:#F2F2F0;text-wrap:balance")}>{T("Find the insight")}</h3><div style={css("grid-column:var(--g-r5proc);display:flex;flex-direction:column;gap:10px")}><p style={css("margin:0;font-size:16px;line-height:1.55;font-weight:300;color:#A9ADB4;text-wrap:pretty")}>{T("Research, conversations, data and a lot of looking. The goal: one human truth the brand can own.")}</p><span style={css("font-size:15px;line-height:1.5;color:#F2F2F0")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098;padding-right:8px")}>{T("Output")}</span>{T("The insight and strategic direction")}</span></div></li>
<li style={css("grid-column:var(--g-full);display:grid;grid-template-columns:repeat(var(--g-cols),minmax(0,1fr));column-gap:var(--g-gap);row-gap:12px;padding:28px 0;border-top:1px solid #3A3E45")}><span style={css("grid-column:var(--g-label);font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098;padding-top:.5em")}>03</span><h3 style={css("grid-column:var(--g-l5proc);margin:0;font-family:'Tanker','Satoshi',sans-serif;font-weight:400;font-size:clamp(28px,3vw,44px);line-height:1;color:#F2F2F0;text-wrap:balance")}>{T("Develop the idea")}</h3><div style={css("grid-column:var(--g-r5proc);display:flex;flex-direction:column;gap:10px")}><p style={css("margin:0;font-size:16px;line-height:1.55;font-weight:300;color:#A9ADB4;text-wrap:pretty")}>{T("Concept routes, sketched and visualised early — with GenAI where it speeds things up. Strong ideas get tested before they get polished.")}</p><span style={css("font-size:15px;line-height:1.5;color:#F2F2F0")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098;padding-right:8px")}>{T("Output")}</span>{T("Two to three concept routes")}</span></div></li>
<li style={css("grid-column:var(--g-full);display:grid;grid-template-columns:repeat(var(--g-cols),minmax(0,1fr));column-gap:var(--g-gap);row-gap:12px;padding:28px 0;border-top:1px solid #3A3E45")}><span style={css("grid-column:var(--g-label);font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098;padding-top:.5em")}>04</span><h3 style={css("grid-column:var(--g-l5proc);margin:0;font-family:'Tanker','Satoshi',sans-serif;font-weight:400;font-size:clamp(28px,3vw,44px);line-height:1;color:#F2F2F0;text-wrap:balance")}>{T("Make it a campaign")}</h3><div style={css("grid-column:var(--g-r5proc);display:flex;flex-direction:column;gap:10px")}><p style={css("margin:0;font-size:16px;line-height:1.55;font-weight:300;color:#A9ADB4;text-wrap:pretty")}>{T("One idea, built into a platform that works across TV, social, OOH, digital and retail — with art direction that holds it all together.")}</p><span style={css("font-size:15px;line-height:1.5;color:#F2F2F0")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098;padding-right:8px")}>{T("Output")}</span>{T("Campaign platform and rollout plan")}</span></div></li>
<li style={css("grid-column:var(--g-full);display:grid;grid-template-columns:repeat(var(--g-cols),minmax(0,1fr));column-gap:var(--g-gap);row-gap:12px;padding:28px 0;border-top:1px solid #3A3E45")}><span style={css("grid-column:var(--g-label);font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098;padding-top:.5em")}>05</span><h3 style={css("grid-column:var(--g-l5proc);margin:0;font-family:'Tanker','Satoshi',sans-serif;font-weight:400;font-size:clamp(28px,3vw,44px);line-height:1;color:#F2F2F0;text-wrap:balance")}>{T("Produce and deliver")}</h3><div style={css("grid-column:var(--g-r5proc);display:flex;flex-direction:column;gap:10px")}><p style={css("margin:0;font-size:16px;line-height:1.55;font-weight:300;color:#A9ADB4;text-wrap:pretty")}>{T("Steering production partners, freelancers, budgets and timing — through to final delivery and on to optimisation.")}</p><span style={css("font-size:15px;line-height:1.5;color:#F2F2F0")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098;padding-right:8px")}>{T("Output")}</span>{T("Finished work, on air and on budget")}</span></div></li>
</ol>
</section>

<section id="about" style={css("display:grid;grid-template-columns:repeat(var(--g-cols),minmax(0,1fr));column-gap:var(--g-gap);row-gap:40px;padding:0 0 96px")}>
<div style={css("grid-column:var(--g-label);font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098;padding-top:1.4em")}>(04)</div>
<h2 style={css("font-family:'Tanker','Satoshi',sans-serif;font-weight:400;letter-spacing:0;grid-column:var(--g-main);margin:0;font-size:clamp(56px,10vw,168px);line-height:.9;color:#F2F2F0")}>{T("about")}</h2>
<p style={css("grid-column:var(--g-main);margin:0;max-width:44ch;font-size:clamp(20px,1.8vw,28px);font-weight:300;line-height:1.35;color:#8C9098;text-wrap:pretty")}>{T("Agency side, client side, independent. Each chapter changed how I look at the work.")}</p>
<ol style={css("grid-column:var(--g-full);margin:24px 0 0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:40px var(--g-gap)")}>
<li style={css("display:flex;flex-direction:column;gap:12px;padding-top:20px;border-top:1px solid #3A3E45")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098")}>01</span><h3 style={css("margin:0;font-family:'Tanker','Satoshi',sans-serif;font-weight:400;font-size:22px;line-height:1.15;color:#F2F2F0;text-wrap:balance")}>{T("Agency creative")}</h3><p style={css("margin:0;font-size:15px;line-height:1.55;font-weight:300;color:#A9ADB4;text-wrap:pretty")}>{T("Heye & Partner, Serviceplan, Grabarz & Partner, GGH MullenLowe. Two years adapting BMW launch campaigns for Germany, Yelp’s first pan-European TV campaign, Eurosport with the international network. Pitches for Google and BMW.")}</p></li>
<li style={css("display:flex;flex-direction:column;gap:12px;padding-top:20px;border-top:1px solid #3A3E45")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098")}>02</span><h3 style={css("margin:0;font-family:'Tanker','Satoshi',sans-serif;font-weight:400;font-size:22px;line-height:1.15;color:#F2F2F0;text-wrap:balance")}>{T("Creative leadership")}</h3><p style={css("margin:0;font-size:15px;line-height:1.55;font-weight:300;color:#A9ADB4;text-wrap:pretty")}>{T("Leading art teams — Saturn at Serviceplan, then as Senior Art Director at thjnk for Deutsche Bahn and Commerzbank.")}</p></li>
<li style={css("display:flex;flex-direction:column;gap:12px;padding-top:20px;border-top:1px solid #3A3E45")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098")}>03</span><h3 style={css("margin:0;font-family:'Tanker','Satoshi',sans-serif;font-weight:400;font-size:22px;line-height:1.15;color:#F2F2F0;text-wrap:balance")}>{T("In-house brand management")}</h3><p style={css("margin:0;font-size:15px;line-height:1.55;font-weight:300;color:#A9ADB4;text-wrap:pretty")}>{T("Ströer Content Group: t-online and watson.")}</p></li>
<li style={css("display:flex;flex-direction:column;gap:12px;padding-top:20px;border-top:1px solid #3A3E45")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098")}>04</span><h3 style={css("margin:0;font-family:'Tanker','Satoshi',sans-serif;font-weight:400;font-size:22px;line-height:1.15;color:#F2F2F0;text-wrap:balance")}>{T("Independent Creative Director")}</h3><p style={css("margin:0;font-size:15px;line-height:1.55;font-weight:300;color:#A9ADB4;text-wrap:pretty")}>{T("For agencies and brands directly — O₂, Ducati, AOK, EDEKA, Mondelēz, BioNTech, Das Handwerk. Lecturer in campaign development at htk Hamburg and Burke Munich.")}</p></li>
<li style={css("display:flex;flex-direction:column;gap:12px;padding-top:20px;border-top:1px solid #F2F2F0")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098")}>05</span><h3 style={css("margin:0;font-family:'Tanker','Satoshi',sans-serif;font-weight:400;font-size:22px;line-height:1.15;color:#F2F2F0;text-wrap:balance")}>{T("AI-enabled creative work")}</h3><p style={css("margin:0;font-size:15px;line-height:1.55;font-weight:300;color:#A9ADB4;text-wrap:pretty")}>{T("MBAI, 2025. Automations, GenAI in production, own products.")}</p></li>
</ol>
<p style={css("grid-column:var(--g-main);margin:24px 0 0;font-size:16px;line-height:1.6;font-weight:300;color:#A9ADB4;text-wrap:pretty")}><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098;padding-right:8px")}>{T("Brands along the way")}</span>{T("BMW · Audi · Volkswagen · McDonald’s · Deutsche Bahn · Commerzbank · O₂ · IKEA · E.ON · EDEKA · AOK · Saturn · Hornbach · Ducati · Škoda · Yelp · Eurosport · BioNTech · Vier Pfoten")}</p>
</section>

<section id="ai" style={css("display:grid;grid-template-columns:repeat(var(--g-cols),minmax(0,1fr));column-gap:var(--g-gap);row-gap:40px;padding:0 0 72px")}>
<div style={css("grid-column:var(--g-label);font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098;padding-top:.6em")}>{T("(05) ai in practice")}</div>
<h2 data-fade="1" style={css("font-family:'Tanker','Satoshi',sans-serif;font-weight:400;letter-spacing:0;grid-column:var(--g-main);margin:0;font-size:clamp(36px,5vw,80px);line-height:1.12;color:#F2F2F0;text-wrap:balance")}>{(aiWords).map((w, w_i) => (<React.Fragment key={w_i}><span data-w="1" style={css("opacity:.16;transition:opacity .25s linear")}>{w}</span></React.Fragment>))}</h2>
<p style={css("grid-column:var(--g-m6);margin:0;font-size:18px;line-height:1.55;font-weight:300;color:#A9ADB4;text-wrap:pretty")}>{T("Not a topic I present — part of how I develop ideas, produce work and build products.")}</p>
<div style={css("grid-column:var(--g-main);display:flex;flex-direction:column;gap:6px")}><div style={css("font-family:'Tanker','Satoshi',sans-serif;font-weight:400;font-size:20px;line-height:1.2;color:#F2F2F0")}>{T("MBAI — Master of Business with AI, 2025")}</div><div style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;line-height:1.45;color:#8C9098")}>{T("University certificate issued by Hochschule Fresenius and Leaders of AI.")}</div></div>
<div data-ai-list="1" style={css("grid-column:var(--g-full);border-top:1px solid #26292E;margin-top:24px")}>
{(aiRows).map((r, r_i) => (<React.Fragment key={r_i}>
<div data-ai-row={r.idx} style={css("border-bottom:1px solid #26292E;padding:clamp(28px,3.5vw,48px) 0;display:grid;grid-template-columns:repeat(var(--g-cols),minmax(0,1fr));column-gap:var(--g-gap);row-gap:12px;align-items:baseline;transition:opacity .25s ease")}>
<span style={css("grid-column:var(--g-label);font-family:'Tanker','Satoshi',sans-serif;font-size:20px;color:#8C9098")}>{r.no}</span>
<h3 style={css("grid-column:var(--g-m6);margin:0;font-family:'Tanker','Satoshi',sans-serif;font-weight:400;letter-spacing:0;font-size:20px;line-height:1.2;color:#F2F2F0;text-wrap:balance")}>{r.title}</h3>

<p style={css("grid-column:var(--g-m6);margin:0;font-family:'Satoshi',sans-serif;font-size:16px;line-height:1.55;color:#A9ADB4;text-wrap:pretty")}>{(r.desc).map((d, d_i) => (<React.Fragment key={d_i}>{(d.ph) && (<><mark style={css("background:#FFE86B;color:#000000;padding:1px 4px")}>{d.t}</mark></>)}{(d.np) && (<>{d.t}</>)}</React.Fragment>))}</p>
<div style={css("grid-column:var(--g-m6);display:flex;flex-wrap:wrap;gap:6px 14px;justify-content:flex-start;font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098")}>{(r.tags).map((tg, tg_i) => (<React.Fragment key={tg_i}><span>{(tg.ph) && (<><mark style={css("background:#FFE86B;color:#000000;padding:1px 4px")}>{tg.t}</mark></>)}{(tg.np) && (<>{tg.t}</>)}</span></React.Fragment>))}</div>
{(aiInline) && (<><div style={css("grid-column:var(--g-main);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:12px;margin-top:12px")}>{(r.imgs).map((im, im_i) => (<React.Fragment key={im_i}><div role="img" aria-label={im.alt} style={css(`position:relative;aspect-ratio:${im.ar};border-radius:6px;overflow:hidden;background:#16181B`)}><Slot id={im.slotId} src={im.src} shape="rect" fit="cover" placeholder={im.hint} style={css("position:absolute;inset:0")} /></div></React.Fragment>))}</div></>)}
</div>
</React.Fragment>))}
</div>
</section>
{(aiFollow) && (<>
<div ref={aiFolRef} aria-hidden="true" style={css("position:fixed;left:0;top:0;width:320px;height:220px;z-index:40;pointer-events:none;opacity:0;transform:translate3d(-9999px,0,0) scale(.9);transform-origin:0 0;transition:opacity .15s ease;border-radius:6px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.45);background:#16181B")}>
{(aiRows).map((r, r_i) => (<React.Fragment key={r_i}><div data-ai-grp={r.idx} data-ai-h={r.folH} style={css("position:absolute;inset:0;opacity:0")}>{(r.imgs).map((im, im_i) => (<React.Fragment key={im_i}><div data-ai-frame="1" style={css("position:absolute;inset:0;opacity:0;transition:opacity .2s")}><Slot id={im.slotId} src={im.src} shape="rect" fit="cover" placeholder={im.hint} style={css("position:absolute;inset:0")} /></div></React.Fragment>))}</div></React.Fragment>))}
</div>
</>)}


<section id="recognition" style={css("display:grid;grid-template-columns:repeat(var(--g-cols),minmax(0,1fr));column-gap:var(--g-gap);row-gap:48px;padding:40px 0 72px")}>
<div style={css("grid-column:var(--g-label);font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098;padding-top:1.4em")}>(06)</div>
<h2 style={css("font-family:'Tanker','Satoshi',sans-serif;font-weight:400;letter-spacing:0;grid-column: var(--g-main); margin: 0; font-size: clamp(36px,4.4vw,64px);  line-height: 1;  color: #F2F2F0")}>{T("recognition")}</h2>
<p style={css("grid-column:var(--g-main);margin:0;max-width:54ch;font-size:clamp(20px,1.8vw,28px);font-weight:300;line-height:1.35;color:#8C9098;text-wrap:balance")}>{T("Award-winning work for brands including IKEA, Deutsche Bahn, BMW, Audi, Hornbach and McDonald's.")}</p>
<div data-scroller="1" data-fade="1" style={css("grid-column:1 / -1;width:100vw;margin-left:calc(50% - 50vw);display:flex;gap:56px;overflow-x:auto;scroll-snap-type:x mandatory;padding:0 max(var(--g-m), calc((100vw - 1440px) / 2 + var(--g-m)));scroll-padding-left:max(var(--g-m), calc((100vw - 1440px) / 2 + var(--g-m)))")}>{(awards).map((aw, aw_i) => (<React.Fragment key={aw_i}><div data-w="1" style={css("opacity:.16;transition:opacity .25s linear;flex:0 0 clamp(160px,16vw,220px);scroll-snap-align:start;display:flex;flex-direction:column;gap:20px")}>
<div style={css("position:relative;height:96px")}>{(aw.hasSrc) && (<><img data-src={aw.src} alt={`${aw.name} logo`} style={css(`position: absolute; inset: 0; width: 187px; height: 82px; object-fit: contain; left: 18px; top: 7px; transform: scale(${aw.scale})`)} /></>)}{(aw.noSrc) && (<><Slot id={aw.slotId} shape="rect" fit="contain" placeholder={aw.hint} data-logo="1" style={css("position:absolute;inset:0;background:transparent;filter:grayscale(1) invert(1) contrast(1.4);mix-blend-mode:screen")} /></>)}</div>
<div style={css("display:flex;flex-direction:column;align-items:center;text-align:center;gap:2px")}><span style={css("font-size:16px;color:#F2F2F0")}>{aw.name}</span><span style={css("font-family:'Satoshi',sans-serif;font-size:13px;font-weight:500;letter-spacing:.02em;color:#8C9098")}>{(aw.metalPh) && (<><mark style={css("background:#FFE86B;color:#000000;padding:1px 4px")}>{aw.metal}</mark></>)}{(aw.noMetalPh) && (<>{aw.metal}</>)}</span></div>
</div></React.Fragment>))}</div>
<div style={css("grid-column:var(--g-main);font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098")}>{T("Also: BCM · Die Klappe · ZMG")}</div>
</section>


<section id="contact" style={css("display:grid;grid-template-columns:repeat(var(--g-cols),minmax(0,1fr));column-gap:var(--g-gap);row-gap:40px;padding:40px 0 32px")}>
<div style={css("grid-column:var(--g-label);font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098;padding-top:1.4em")}>(07)</div>
<h2 style={css("font-family:'Tanker','Satoshi',sans-serif;font-weight:400;letter-spacing:0;grid-column:var(--g-main);margin:0;font-size:clamp(36px,4.4vw,64px);line-height:1;color:#F2F2F0;text-wrap:balance;max-width:18ch")}>{T("let’s talk about your project.")}</h2>
<p style={css("grid-column:var(--g-main);margin:-16px 0 0;font-size:16px;font-weight:400;color:#8C9098")}>{T("Freelance as Art Director, Creative Director or Creative Strategist. Full case decks and references on request.")}</p>
<div style={css("grid-column:var(--g-full);display:grid;grid-template-columns:repeat(var(--g-cols),minmax(0,1fr));column-gap:var(--g-gap);row-gap:12px;margin-top:8px")}>
<a href="mailto:mail@mkriesmair.de" style={css("grid-column:var(--g-q3);background:#16181B;border-radius:6px;padding:20px;display:flex;flex-direction:column;gap:16px;text-decoration:none")} className="hv20"><span style={css("font-family:'Satoshi',sans-serif;font-size:12px;letter-spacing:.04em;color:#8C9098")}>{T("email")}</span><span style={css("font-size:16px;overflow-wrap:anywhere")}>{T("mail@mkriesmair.de")}</span></a>
<a href="tel:+4917632838362" style={css("grid-column:var(--g-q3);background:#16181B;border-radius:6px;padding:20px;display:flex;flex-direction:column;gap:16px;text-decoration:none")} className="hv21"><span style={css("font-family:'Satoshi',sans-serif;font-size:12px;letter-spacing:.04em;color:#8C9098")}>{T("phone")}</span><span style={css("font-size:16px")}>+49 (0)176 32 838 362</span></a>
<a target="_blank" rel="noopener" download="Markus_Kriesmair_CV.pdf" href="/uploads/markus-kriesmair-cv.pdf" style={css("grid-column:var(--g-q3);background:#16181B;border-radius:6px;padding:20px;display:flex;flex-direction:column;gap:16px;text-decoration:none")} className="hv22"><span style={css("font-family:'Satoshi',sans-serif;font-size:12px;letter-spacing:.04em;color:#8C9098")}>{T("cv")}</span><span style={css("font-size:16px;display:flex;gap:8px;flex-wrap:wrap;align-items:center")}>{T("Download CV (PDF)")}</span></a>
<a href="https://www.linkedin.com/in/markus-kriesmair-15847934/" target="_blank" rel="noopener noreferrer" style={css("grid-column:var(--g-q3);background:#16181B;border-radius:6px;padding:20px;display:flex;flex-direction:column;gap:16px;text-decoration:none")} className="hv23"><span style={css("font-family:'Satoshi',sans-serif;font-size:12px;letter-spacing:.04em;color:#8C9098")}>{T("profile")}</span><span style={css("font-size:16px")}>{T("LinkedIn")}</span></a>
</div>
<footer style={css("grid-column:var(--g-full);margin-top:80px;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;padding-right:140px;font-family:'Satoshi',sans-serif;font-size:13px;letter-spacing:.04em;color:#8C9098")}>
<span>{T("Markus Kriesmair — Portfolio 2026")}</span>
<span style={css("display:flex;gap:24px")}><a href="/imprint/" style={css("color:#8C9098")}>{T("Imprint")}</a><a href="#top" style={css("color:#8C9098")}>{T("Privacy")}</a></span>
</footer>
</section>
</>)}
{(lbOpen) && (<><div role="dialog" aria-modal="true" aria-label={lbTitle} onClick={lbClose} style={css("position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.9);display:flex;align-items:center;justify-content:center;padding:clamp(16px,5vw,80px)")}>
<button type="button" ref={lbCloseRef} onClick={lbClose} aria-label={T("Close video")} style={css("position:absolute;top:16px;right:24px;padding:0;border:none;background:none;color:#F2F2F0;cursor:pointer;font-family:'Tanker','Satoshi',sans-serif;font-size:44px;line-height:1")} className="hv24 hv25">X</button>
<div onClick={lbStop} style={css("position:relative;width:min(100%,calc((100vh - 160px) * 16 / 9));aspect-ratio:16/9;border-radius:6px;overflow:hidden;background:#0C0D0F")}>{(lbVideo) && (<><video src={lbSrc} controls autoPlay playsInline aria-label={lbTitle} style={css("position:absolute;inset:0;width:100%;height:100%;background:#000000")}></video></>)}{(lbFrame) && (<><iframe src={lbSrc} title={lbTitle} referrerPolicy="strict-origin-when-cross-origin" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen style={css("position:absolute;inset:0;width:100%;height:100%;border:0")}></iframe></>)}</div>
</div></>)}

</div>

      </>
    );
  }
}

// Case titles and summaries for the static pages (case routes, meta tags).
export const caseList = (lang) => new Portfolio({ lang }).renderVals().cases.map((c) => ({ key: c.key, slug: CASE_SLUGS[c.key], brand: c.brand, title: c.title, body: c.body, role: c.role && c.role.t ? c.role.t : c.role, img: c.slotSrc || '' }));
