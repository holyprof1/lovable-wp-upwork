import fs from "fs";
import path from "path";
import postcss from "postcss";

const SOURCE_PAGES = [
  {
    fileName: "lp-emergency-plumber.html",
    sourceUrl: "https://flow-plus-pages.lovable.app/lp-emergency-plumber.html",
  },
  {
    fileName: "lp-drain-unblocking.html",
    sourceUrl: "https://flow-plus-pages.lovable.app/lp-drain-unblocking.html",
  },
  {
    fileName: "lp-leak-detection.html",
    sourceUrl: "https://flow-plus-pages.lovable.app/lp-leak-detection.html",
  },
  {
    fileName: "lp-radiator.html",
    sourceUrl: "https://flow-plus-pages.lovable.app/lp-radiator.html",
  },
  {
    fileName: "lp-tap-repair.html",
    sourceUrl: "https://flow-plus-pages.lovable.app/lp-tap-repair.html",
  },
];

const SOURCE_DIR = path.join(process.cwd(), "public");
const OUTPUT_DIR = path.join(process.cwd(), "elementor");

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');";

const LOVABLE_BASE = "https://flow-plus-pages.lovable.app";

const SVG_ICONS = {
  arrowUpRight: `<svg class="fpp-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M8 7h9v9"/></svg>`,
  check: `<svg class="fpp-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 9.2 17 19 7"/></svg>`,
  clock: `<svg class="fpp-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.8v4.7l3.2 1.9"/></svg>`,
  email: `<svg class="fpp-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6.5h16v11H4z"/><path d="m5 8 7 5 7-5"/></svg>`,
  gear: `<svg class="fpp-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v3M12 18.2v3M4.1 7.4l2.6 1.5M17.3 15.1l2.6 1.5M4.1 16.6l2.6-1.5M17.3 8.9l2.6-1.5M5.7 12H2.8M21.2 12h-2.9"/></svg>`,
  mapPin: `<svg class="fpp-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11z"/><circle cx="12" cy="10" r="2"/></svg>`,
  phone: `<svg class="fpp-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4.5 9.4 4l2.1 4.8-1.5 1.1a12 12 0 0 0 4.1 4.1l1.1-1.5 4.8 2.1-.5 2.4c-.2 1-1.1 1.7-2.1 1.7A13.4 13.4 0 0 1 4.3 5.9c0-1 .7-1.8 1.7-2Z"/></svg>`,
  shield: `<svg class="fpp-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 19 6v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z"/><path d="m9.4 12 1.8 1.8L15 9.8"/></svg>`,
  sparkle: `<svg class="fpp-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="m12 2.5 1.9 6.4 6.6 1.9-6.6 1.9L12 19.5l-1.9-6.8-6.6-1.9 6.6-1.9L12 2.5Z"/></svg>`,
  star: `<svg class="fpp-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/></svg>`,
};

function svgIcon(name, className = "fpp-icon") {
  const svg = SVG_ICONS[name];

  if (!svg) {
    throw new Error(`Unknown SVG icon: ${name}`);
  }

  return svg.replace('class="fpp-icon"', `class="${className}"`);
}

function textIcon(text) {
  return `<span class="fpp-text-icon" aria-hidden="true">${text}</span>`;
}

const ELEMENTOR_RESET_CSS = `
${FONT_IMPORT}
:where(html:has(.fpp-landing),
body:has(.fpp-landing)) {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  max-width: none !important;
  overflow-x: hidden !important;
}

:where(body:has(.fpp-landing) #page,
body:has(.fpp-landing) .site,
body:has(.fpp-landing) .site-content,
body:has(.fpp-landing) .content-area,
body:has(.fpp-landing) main,
body:has(.fpp-landing) .entry-content,
body:has(.fpp-landing) .page-content) {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  max-width: none !important;
}

:where(.elementor:has(.fpp-landing),
.elementor-section:has(.fpp-landing),
.elementor-container:has(.fpp-landing),
.elementor-column:has(.fpp-landing),
.elementor-widget-wrap:has(.fpp-landing),
.elementor-widget:has(.fpp-landing),
.elementor-widget-html:has(.fpp-landing),
.elementor-widget-container:has(> .fpp-landing),
.elementor-element:has(.fpp-landing)) {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  max-width: none !important;
}

.fpp-landing {
  width: 100vw;
  max-width: 100vw;
  margin-left: calc(50% - 50vw) !important;
  margin-right: calc(50% - 50vw) !important;
  overflow-x: hidden;
  overflow-x: clip;
  box-sizing: border-box;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  padding: 0 !important;
  position: relative;
  display: block;
  background: #fff;
}

.fpp-landing *,
.fpp-landing *::before,
.fpp-landing *::after {
  box-sizing: border-box;
}

.fpp-landing img,
.fpp-landing svg {
  max-width: 100%;
  vertical-align: middle;
}
`.trim();

const ELEMENTOR_OVERRIDE_CSS = `
.fpp-landing #top,
.fpp-landing .topbar,
.fpp-landing .main-nav,
.fpp-landing .hero,
.fpp-landing .usp-bar,
.fpp-landing .credibility-strip,
.fpp-landing .section,
.fpp-landing .stats-strip,
.fpp-landing .final-cta,
.fpp-landing .lp-footer,
.fpp-landing .mobile-cta,
.fpp-landing #top > .topbar,
.fpp-landing #top > .main-nav,
.fpp-landing #top > .mobile-menu,
.fpp-landing #top > .hero,
.fpp-landing #top > .usp-bar,
.fpp-landing #top > .credibility-strip,
.fpp-landing #top > .section,
.fpp-landing #top > .stats-strip,
.fpp-landing #top > .final-cta,
.fpp-landing #top > .lp-footer {
  width: 100%;
  max-width: 100%;
}

.fpp-landing #top,
.fpp-landing .topbar,
.fpp-landing .main-nav,
.fpp-landing .hero,
.fpp-landing .usp-bar,
.fpp-landing .credibility-strip,
.fpp-landing .section,
.fpp-landing .stats-strip,
.fpp-landing .final-cta,
.fpp-landing .lp-footer {
  margin-left: 0 !important;
  margin-right: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}

.fpp-landing #top,
.fpp-landing .topbar,
.fpp-landing .main-nav {
  padding-top: 0;
}

.fpp-landing .main-nav {
  overflow: visible;
}

.fpp-landing .logo,
.fpp-landing .nav-menu,
.fpp-landing .nav-call,
.fpp-landing .hero-copy,
.fpp-landing .content-grid,
.fpp-landing .card-grid,
.fpp-landing .property-grid,
.fpp-landing .footer-grid,
.fpp-landing .footer-bottom {
  min-width: 0;
}

.fpp-landing .nav-menu {
  flex: 1 1 auto;
}

.fpp-landing .nav-call {
  flex: 0 1 auto;
  max-width: 100%;
}

.fpp-landing .nav-call em,
.fpp-landing .nav-call strong {
  white-space: nowrap;
}

.fpp-landing .nav-call em {
  overflow: hidden;
  text-overflow: ellipsis;
}

.fpp-landing .footer-grid a,
.fpp-landing .footer-grid span,
.fpp-landing .footer-grid p,
.fpp-landing .footer-grid small,
.fpp-landing .footer-grid b {
  max-width: 100%;
}

.fpp-landing #top {
  display: block;
  min-width: 0;
  margin: 0 !important;
  padding: 0 !important;
  overflow-x: clip;
}

.fpp-landing > :first-child,
.fpp-landing #top > :first-child {
  margin-top: 0 !important;
}

.fpp-landing > :last-child,
.fpp-landing #top > :last-child {
  margin-bottom: 0 !important;
}

.fpp-landing .topbar,
.fpp-landing .main-nav,
.fpp-landing .hero,
.fpp-landing .final-cta,
.fpp-landing .lp-footer {
  border-left: 0 !important;
  border-right: 0 !important;
}

.fpp-landing .source-logo {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.fpp-landing .google-g {
  display: inline-flex !important;
  align-items: center;
  gap: 0;
  white-space: nowrap;
  line-height: 1;
  letter-spacing: 0;
}

.fpp-landing .google-g span {
  display: inline-block;
  line-height: 1;
  margin: 0;
  padding: 0;
}

.fpp-landing .fpp-icon,
.fpp-landing .btn-icon,
.fpp-landing .badge-icon,
.fpp-landing .footer-icon,
.fpp-landing .mobile-icon {
  display: block;
  width: 1em;
  height: 1em;
  flex: 0 0 auto;
  color: currentColor;
}

.fpp-landing .icon-box .fpp-icon {
  width: 30px;
  height: 30px;
}

.fpp-landing .feature-row > span .fpp-icon {
  width: 28px;
  height: 28px;
}

.fpp-landing .feature-row > span .fpp-text-icon {
  display: inline-block !important;
  margin: 0 !important;
  padding: 0 !important;
  color: currentColor;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
}

.fpp-landing .nav-call span .fpp-icon {
  width: 25px;
  height: 25px;
}

.fpp-landing .btn .btn-icon {
  width: 20px;
  height: 20px;
}

.fpp-landing .trust-badge {
  align-items: center;
  gap: 6px;
}

.fpp-landing .trust-badge .badge-icon {
  width: 14px;
  height: 14px;
}

.fpp-landing .footer-grid .footer-contact-item {
  display: flex !important;
  align-items: center;
  gap: 9px;
  margin: 7px 0;
  min-width: 0;
}

.fpp-landing .footer-grid .footer-contact-item .footer-icon {
  display: inline-flex !important;
  width: 16px;
  height: 16px;
  margin: 0 !important;
  padding: 0 !important;
  color: currentColor;
}

.fpp-landing .mobile-cta .mobile-icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 1240px) {
  .fpp-landing .main-nav {
    gap: 16px;
    padding-left: clamp(16px, 3vw, 32px);
    padding-right: clamp(16px, 3vw, 32px);
  }

  .fpp-landing .nav-menu {
    gap: clamp(12px, 1.8vw, 22px);
  }

  .fpp-landing .nav-call em {
    display: none;
  }

  .fpp-landing .nav-call {
    grid-template-columns: 42px auto;
    column-gap: 10px;
  }

  .fpp-landing .nav-call span {
    width: 42px;
    height: 42px;
  }

  .fpp-landing .nav-call strong {
    font-size: 22px;
  }
}

@media (max-width: 1100px) {
  .fpp-landing .nav-call {
    display: none;
  }
}

@media (max-width: 767px) {
  .fpp-landing {
    padding-bottom: 0 !important;
  }

  .fpp-landing .lp-footer {
    padding-bottom: calc(52px + 76px) !important;
  }
}
`.trim();

function isInsideKeyframes(rule) {
  let parent = rule.parent;

  while (parent) {
    if (parent.type === "atrule" && /keyframes$/i.test(parent.name)) {
      return true;
    }

    parent = parent.parent;
  }

  return false;
}

function scopeSelector(selector) {
  const trimmed = selector.trim();

  if (!trimmed) {
    return trimmed;
  }

  if (
    trimmed === ":root" ||
    trimmed === "html" ||
    trimmed === "body" ||
    trimmed === "html body"
  ) {
    return ".fpp-landing";
  }

  if (trimmed.startsWith(".fpp-landing")) {
    return trimmed;
  }

  return `.fpp-landing ${trimmed}`;
}

function scopeCss(css) {
  const root = postcss.parse(css);

  root.walkRules((rule) => {
    if (!rule.selectors || isInsideKeyframes(rule)) {
      return;
    }

    rule.selectors = rule.selectors.map(scopeSelector);
  });

  return root.toString();
}

function extractStyle(html) {
  const match = html.match(/<style>([\s\S]*?)<\/style>/i);

  if (!match) {
    throw new Error("Could not find source <style> block.");
  }

  return match[1].trim();
}

function extractBodyContent(html) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  if (!match) {
    throw new Error("Could not find source <body> block.");
  }

  return match[1].trim();
}

function removeLovableBadge(markup) {
  return markup
    .replace(
      /<aside\b[^>]*\bid=["']lovable-badge["'][\s\S]*?<\/aside>/gi,
      "",
    )
    .replace(
      /<script>\s*\/\/ Don't show the lovable-badge[\s\S]*?<\/script>/gi,
      "",
    )
    .replace(/<a[^>]*href="[^"]*lovable\.dev[^"]*"[\s\S]*?<\/a>/gi, "")
    .replace(/<div[^>]*>[\s\S]*?Edit with[\s\S]*?lovable[\s\S]*?<\/div>/gi, "")
    .trim();
}

function mapAsset(assetPath) {
  return `${LOVABLE_BASE}/${assetPath.replace(/^\/+/, "")}`;
}

function rewriteAssetRefs(markup) {
  return markup
    .replace(
      /(src=|url\()(['"]?)\/?((?:brand_assets|images)\/[^"')>]+)(['"]?)/g,
      (_, prefix, openQuote, assetPath, closeQuote) =>
        `${prefix}${openQuote}${mapAsset(assetPath)}${closeQuote}`,
    )
    .replace(
      /(href=)(["'])thank-you\.html\2/gi,
      '$1$2#$2 data-form-target="replace-with-wordpress-thank-you-page"',
    )
    .replace(
      /(action=)(["'])thank-you\.html\2/gi,
      '$1$2$2 data-form-action="replace-with-wordpress-form-handler"',
    );
}

const ICON_BOX_REPLACEMENTS = new Map([
  ["\u2197", svgIcon("arrowUpRight")],
  ["\u2699", svgIcon("gear")],
  ["\u2713", svgIcon("check")],
  ["\u2726", svgIcon("sparkle")],
]);

const FEATURE_ICON_REPLACEMENTS = new Map([
  ["\u00A3", textIcon("&pound;")],
  ["\u2713", svgIcon("check")],
  ["\u2605", svgIcon("star")],
  ["\u{1F6E1}", svgIcon("shield")],
]);

function replaceIconBoxes(markup) {
  return markup.replace(
    /<div class="icon-box">\s*([^<]*?)\s*<\/div>/g,
    (match, rawIcon) => {
      const replacement = ICON_BOX_REPLACEMENTS.get(rawIcon.trim());

      if (!replacement) {
        return match;
      }

      return `<div class="icon-box">${replacement}</div>`;
    },
  );
}

function replaceFeatureIcons(markup) {
  return markup.replace(
    /(<div class="feature-row">\s*)<span>\s*([^<]*?)\s*<\/span>/g,
    (match, prefix, rawIcon) => {
      const replacement = FEATURE_ICON_REPLACEMENTS.get(rawIcon.trim());

      if (!replacement) {
        return match;
      }

      return `${prefix}<span>${replacement}</span>`;
    },
  );
}

function replaceTextSymbolIcons(markup) {
  return markup
    .replace(
      /(<a class="nav-call" href="tel:\+447389869375">\s*)<span>\u260E<\/span>/g,
      `$1<span>${svgIcon("phone")}</span>`,
    )
    .replace(
      /(<a class="btn btn-outline" href="tel:\+447389869375">)\u260E\s*/g,
      `$1${svgIcon("phone", "btn-icon")}`,
    )
    .replace(
      /(<span class="trust-badge">)\u2713\s*/g,
      `$1${svgIcon("check", "badge-icon")}`,
    )
    .replace(
      /<a href="tel:\+447389869375">\u260E\s*07389 869 375<\/a>/g,
      `<a class="footer-contact-item" href="tel:+447389869375">${svgIcon("phone", "footer-icon")}07389 869 375</a>`,
    )
    .replace(
      /<a href="mailto:flowplusplumbing@gmail\.com">\u2709\s*flowplusplumbing@gmail\.com<\/a>/g,
      `<a class="footer-contact-item" href="mailto:flowplusplumbing@gmail.com">${svgIcon("email", "footer-icon")}flowplusplumbing@gmail.com</a>`,
    )
    .replace(
      /<span>\u2316\s*72 Regina Road, Finsbury Park, London N4 3PP<\/span>/g,
      `<span class="footer-contact-item">${svgIcon("mapPin", "footer-icon")}72 Regina Road, Finsbury Park, London N4 3PP</span>`,
    )
    .replace(
      /<span>\u25F7\s*7 days a week<\/span>/g,
      `<span class="footer-contact-item">${svgIcon("clock", "footer-icon")}7 days a week</span>`,
    )
    .replace(
      /(<div class="mobile-cta">\s*<a href="tel:\+447389869375">)\u260E\s*/g,
      `$1${svgIcon("phone", "mobile-icon")}`,
    )
    .replace(
      /(<div class="mobile-cta">[\s\S]*?<a href="#booking">)\u2197\s*/g,
      `$1${svgIcon("arrowUpRight", "mobile-icon")}`,
    );
}

function replaceWordPressEmojiRiskIcons(markup) {
  return replaceTextSymbolIcons(replaceFeatureIcons(replaceIconBoxes(markup)));
}

function addElementorFormNote(markup) {
  return markup.replace(
    /<form\b/i,
    "<!-- Replace the empty form action with your WordPress handler or swap this block for an Elementor Form widget before publishing. -->\n<form",
  );
}

const GOOGLE_LETTERS =
  '<span class="g-blue">G</span><span class="g-red">o</span><span class="g-yellow">o</span><span class="g-blue">g</span><span class="g-green">l</span><span class="g-red">e</span>';

function compactGoogleLogoMarkup(markup) {
  return markup
    .replace(
      /<span class="google-g"([^>]*)>\s*<span class="g-blue">G<\/span>\s*<span class="g-red">o<\/span>\s*<span class="g-yellow">o<\/span>\s*<span class="g-blue">g<\/span>\s*<span class="g-green">l<\/span>\s*<span class="g-red">e<\/span>\s*<\/span>/g,
      `<span class="google-g"$1>${GOOGLE_LETTERS}</span>`,
    )
    .replace(
      /<span class="source-logo">\s*(<span class="google-g"[^>]*><span class="g-blue">G<\/span><span class="g-red">o<\/span><span class="g-yellow">o<\/span><span class="g-blue">g<\/span><span class="g-green">l<\/span><span class="g-red">e<\/span><\/span>)\s*<\/span>/g,
      '<span class="source-logo">$1</span>',
    );
}

function formatMarkup(markup) {
  return markup.replace(/></g, ">\n<").replace(/\n{3,}/g, "\n\n").trim();
}

function collectOriginalAssets(markup) {
  const refs = [
    ...markup.matchAll(
      /(?:src=|url\()["']?\/?((?:brand_assets|images)\/[^"')>]+)/g,
    ),
  ].map((match) => match[1]);

  return [...new Set(refs)];
}

function buildFinalHtml(html) {
  const sourceStyle = extractStyle(html);
  const scopedStyle = scopeCss(sourceStyle);
  const rawBody = removeLovableBadge(extractBodyContent(html));
  const originalAssets = collectOriginalAssets(rawBody);
  const rewrittenBody = addElementorFormNote(
    replaceWordPressEmojiRiskIcons(rewriteAssetRefs(rawBody)),
  );
  const formattedBody = compactGoogleLogoMarkup(formatMarkup(rewrittenBody));

  return {
    originalAssets,
    html:
      `<style>\n${ELEMENTOR_RESET_CSS}\n\n${scopedStyle}\n\n${ELEMENTOR_OVERRIDE_CSS}\n</style>\n` +
      `<div class="fpp-landing">\n${formattedBody}\n</div>\n`,
  };
}

function buildAssetReport(entries) {
  const lines = [
    "Elementor Canvas assets used by the regenerated Lovable landing pages",
    "",
    "Shared external font import",
    "- https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Inter:wght@400;500;600;700;800&display=swap",
    "",
    "Notes",
    "- Asset URLs below point directly to the Lovable source page assets so the Elementor exports match the source more literally.",
    "",
  ];

  for (const entry of entries) {
    lines.push(entry.outputName);

    for (const asset of entry.originalAssets) {
      lines.push(`- ${asset} -> ${mapAsset(asset)}`);
    }

    lines.push("");
  }

  return lines.join("\n");
}

function getPageByName(name) {
  return SOURCE_PAGES.find(
    (page) =>
      page.fileName === name ||
      page.fileName.replace(/\.html$/, "") === name ||
      page.fileName.replace(/^lp-/, "").replace(/\.html$/, "") === name,
  );
}

function parseArgs(argv) {
  const options = {
    sourceMode: "local",
    names: [],
  };

  for (const arg of argv) {
    if (arg === "--live" || arg === "--source=live") {
      options.sourceMode = "live";
      continue;
    }

    if (arg === "--local" || arg === "--source=local") {
      options.sourceMode = "local";
      continue;
    }

    options.names.push(arg);
  }

  return options;
}

function getRequestedPages(names) {
  if (names.length === 0) {
    return SOURCE_PAGES;
  }

  return names.map((name) => {
    const page = getPageByName(name);

    if (!page) {
      throw new Error(`Unknown landing page: ${name}`);
    }

    return page;
  });
}

async function readSourcePage(page, sourceMode) {
  if (sourceMode === "live") {
    const response = await fetch(page.sourceUrl);

    if (!response.ok) {
      throw new Error(
        `Could not fetch ${page.sourceUrl}: ${response.status} ${response.statusText}`,
      );
    }

    return response.text();
  }

  const sourcePath = path.join(SOURCE_DIR, page.fileName);
  return fs.readFileSync(sourcePath, "utf8");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const pages = getRequestedPages(options.names);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const reportEntries = [];

  for (const page of pages) {
    const outputName = page.fileName.replace(".html", "-elementor.html");
    const outputPath = path.join(OUTPUT_DIR, outputName);
    const html = await readSourcePage(page, options.sourceMode);
    const result = buildFinalHtml(html);

    fs.writeFileSync(outputPath, result.html, "utf8");
    reportEntries.push({
      outputName,
      originalAssets: result.originalAssets,
    });
  }

  if (pages.length === SOURCE_PAGES.length) {
    fs.writeFileSync(
      path.join(OUTPUT_DIR, "assets-needed.txt"),
      buildAssetReport(reportEntries),
      "utf8",
    );
  }
}

main();
