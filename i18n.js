/* ============================================================================
   MediAI — i18n (Sprint 16 · Vague 1)
   ----------------------------------------------------------------------------
   Mécanisme d'internationalisation léger, sans build ni dépendance.
   - Externalise les chaînes dans un dictionnaire par langue.
   - Applique les traductions via l'attribut `data-i18n` (texte) et
     `data-i18n-attr="attr:key,attr2:key2"` (attributs, ex. placeholder).
   - Langue persistée (localStorage) ; repli automatique sur le français.

   Preuve d'usage : trust.html (FR/EN complets). Les autres surfaces seront
   migrées progressivement (pas de retrofit massif — décision CTO Sprint 16).
   Langues cibles : fr · en · es · it (es/it retombent sur fr tant que non
   traduites — jamais de fausse traduction).
   ========================================================================== */
(function () {
  const DICT = {
    fr: {
      'trust.title': 'Centre de confiance',
      'trust.subtitle': 'Comment MediAI protège les données de santé — en toute transparence.',
      'trust.status.label': 'Statut de conformité',
      'trust.status.value': 'Hébergement HDS en cours · données synthétiques uniquement',
      'trust.hosting.h': 'Hébergement',
      'trust.hosting.p': "L'infrastructure est en cours de migration vers un hébergeur agréé HDS (Hébergeur de Données de Santé). Tant que cette migration n'est pas finalisée, aucune donnée patient réelle n'est traitée : uniquement des données synthétiques.",
      'trust.security.h': 'Sécurité',
      'trust.security.p': "Authentification par jeton signé (fail-closed), limitation de débit sur les points sensibles, CORS restreint, journaux d'audit. Les sous-traitants IA sont isolés derrière une couche dédiée.",
      'trust.encryption.h': 'Chiffrement',
      'trust.encryption.p': "Chiffrement en transit (HTTPS/TLS) sur l'ensemble des échanges. Le chiffrement au repos sera formalisé dans le cadre de l'agrément HDS.",
      'trust.rgpd.h': 'RGPD',
      'trust.rgpd.p': "Toute donnée envoyée à un modèle d'IA est anonymisée au préalable puis ré-identifiée localement. Droits d'accès, d'export et d'effacement pris en charge côté patient (export de ses données déjà disponible).",
      'trust.backups.h': 'Sauvegardes',
      'trust.backups.p': "Base de données managée avec sauvegardes régulières. La politique de rétention et de restauration sera formalisée avec l'agrément HDS.",
      'trust.availability.h': 'Disponibilité',
      'trust.availability.p': "Déploiement continu sur infrastructure managée (backend et frontend). Aucun engagement de niveau de service (SLA) contractuel n'est encore publié à ce stade.",
      'trust.incidents.h': 'Historique des incidents',
      'trust.incidents.p': "Aucun incident de sécurité à ce jour.",
      'trust.footer': "Cette page reflète l'état réel du produit. Elle est mise à jour à mesure que la conformité progresse — jamais en avance sur les faits.",
      'trust.back': "← Retour à l'accueil",
      'common.soon': 'En cours',
    },
    en: {
      'trust.title': 'Trust Center',
      'trust.subtitle': 'How MediAI protects health data — with full transparency.',
      'trust.status.label': 'Compliance status',
      'trust.status.value': 'HDS hosting in progress · synthetic data only',
      'trust.hosting.h': 'Hosting',
      'trust.hosting.p': "The infrastructure is being migrated to an HDS-certified host (French health-data hosting standard). Until this migration is complete, no real patient data is processed: synthetic data only.",
      'trust.security.h': 'Security',
      'trust.security.p': "Signed-token authentication (fail-closed), rate limiting on sensitive endpoints, restricted CORS, audit logs. AI subprocessors are isolated behind a dedicated layer.",
      'trust.encryption.h': 'Encryption',
      'trust.encryption.p': "Encryption in transit (HTTPS/TLS) across all exchanges. Encryption at rest will be formalized as part of HDS certification.",
      'trust.rgpd.h': 'GDPR',
      'trust.rgpd.p': "Any data sent to an AI model is anonymized beforehand and re-identified locally. Access, export and erasure rights are supported on the patient side (data export already available).",
      'trust.backups.h': 'Backups',
      'trust.backups.p': "Managed database with regular backups. Retention and restore policies will be formalized with HDS certification.",
      'trust.availability.h': 'Availability',
      'trust.availability.p': "Continuous deployment on managed infrastructure (backend and frontend). No contractual service-level agreement (SLA) is published at this stage.",
      'trust.incidents.h': 'Incident history',
      'trust.incidents.p': "No security incident to date.",
      'trust.footer': "This page reflects the real state of the product. It is updated as compliance progresses — never ahead of the facts.",
      'trust.back': '← Back to home',
      'common.soon': 'In progress',
    },
  };

  let lang = localStorage.getItem('mediai_lang') || (navigator.language || 'fr').slice(0, 2);
  if (!DICT[lang]) lang = 'fr';

  function t(key, fallback) {
    return (DICT[lang] && DICT[lang][key]) || (DICT.fr && DICT.fr[key]) || fallback || key;
  }
  function apply(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    scope.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        const parts = pair.split(':');
        if (parts.length === 2) el.setAttribute(parts[0].trim(), t(parts[1].trim()));
      });
    });
  }
  function setLang(l) {
    if (!DICT[l]) return;
    lang = l;
    localStorage.setItem('mediai_lang', l);
    document.documentElement.lang = l;
    apply();
    document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang: l } }));
  }

  window.MediaiI18n = {
    t: t, apply: apply, setLang: setLang,
    get lang() { return lang; },
    available: Object.keys(DICT),          // langues réellement traduites
    targets: ['fr', 'en', 'es', 'it'],     // langues cibles (es/it : repli fr)
  };

  if (document.readyState !== 'loading') apply();
  else document.addEventListener('DOMContentLoaded', function () { apply(); });
})();
