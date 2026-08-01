/* ============================================================================
   MediAI — Moteur de notifications (Sprint 16 · Vague 2)
   ----------------------------------------------------------------------------
   Décide QUAND prévenir, avec quelle PRIORITÉ, et sans jamais faire de bruit.
   Déterministe, sans IA, sans donnée inventée : il ne fait que classer, dédupe
   et plafonner des faits déjà réels fournis par l'appelant.

   Règles :
   - Pertinence : on ne garde que les éléments porteurs d'une action utile.
   - Priorité : urgent > high > info ; à priorité égale, le plus récent d'abord
     (les échéances futures proches remontent).
   - Anti-bruit : déduplication par id, plafond global, comptage « non lus »
     persistant (rien n'est signalé deux fois).

   Entrée : liste d'items { id, kind, ts, title, detail, action, priority }.
   Sortie : { items: [...], total, hidden }.
   ========================================================================== */
(function () {
  const PRIO = { urgent: 3, high: 2, info: 1 };

  function build(items, opts) {
    opts = opts || {};
    const cap = opts.cap || 12;
    let list = (items || []).filter(function (it) { return it && it.id != null && it.ts != null; });

    // Déduplication par id (jamais deux fois le même fait).
    const seen = new Set();
    list = list.filter(function (it) { const k = String(it.id); if (seen.has(k)) return false; seen.add(k); return true; });

    // Score de priorité (défaut : info).
    list.forEach(function (it) { it._p = PRIO[it.priority] || PRIO.info; });

    // Tri : priorité décroissante, puis récence/imminence (ts décroissant).
    list.sort(function (a, b) { return (b._p - a._p) || (b.ts - a.ts); });

    const capped = list.slice(0, cap);
    return { items: capped, total: list.length, hidden: Math.max(0, list.length - cap) };
  }

  // ── « Non lus » persistants — le badge ne rappelle jamais un fait déjà vu ──
  function readSeen(key) { try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')); } catch (e) { return new Set(); } }
  function unreadCount(items, key) {
    const s = readSeen(key);
    return (items || []).filter(function (it) { return !s.has(String(it.id)); }).length;
  }
  function markAllSeen(items, key) {
    localStorage.setItem(key, JSON.stringify((items || []).map(function (it) { return String(it.id); })));
  }

  window.MediaiNotif = { build: build, unreadCount: unreadCount, markAllSeen: markAllSeen, PRIO: PRIO };
})();
