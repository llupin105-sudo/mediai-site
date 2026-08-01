/* ============================================================================
   MediAI — Feature Flags (Sprint 16 · Vague 1)
   ----------------------------------------------------------------------------
   Helper client : lit /api/flags (public) et expose l'état des fonctionnalités.
   Les défauts sont embarqués (l'UI fonctionne même hors-ligne / backend froid).
   Un admin bascule un flag via PUT /api/admin/flags/:key — SANS redéploiement.

   Usage :
     await MediaiFlags.load();
     if (MediaiFlags.on('teleconsultation')) { ... }
     document.addEventListener('flags:loaded', () => rerender());
   ========================================================================== */
(function () {
  const API = window.MEDIAI_API_BASE || 'https://mediai-backend-156u.onrender.com';
  const DEFAULTS = {
    teleconsultation: false,
    marketplace: false,
    apple_health: false,
    voice_assistant: false,
    vision_pro: false,
    command_center: true,
  };
  let flags = Object.assign({}, DEFAULTS);
  let loaded = false;

  async function load() {
    try {
      const r = await fetch(API + '/api/flags');
      if (r.ok) {
        const d = await r.json();
        if (d && d.flags) {
          Object.keys(d.flags).forEach(function (k) { flags[k] = !!d.flags[k].enabled; });
        }
      }
    } catch (e) { /* backend indispo : on garde les défauts */ }
    loaded = true;
    document.dispatchEvent(new CustomEvent('flags:loaded', { detail: { flags: Object.assign({}, flags) } }));
    return Object.assign({}, flags);
  }

  window.MediaiFlags = {
    load: load,
    on: function (key) { return !!flags[key]; },
    all: function () { return Object.assign({}, flags); },
    get loaded() { return loaded; },
  };
})();
