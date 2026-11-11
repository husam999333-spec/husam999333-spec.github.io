// Generates index.html (EN), ar/index.html (AR) and sitemap.xml from src/content.mjs
// Usage: node build.mjs
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { content, SITE } from "./src/content.mjs";

const IMG = "/assets/img/";
const today = new Date().toISOString().slice(0, 10);
const ver = (f) => createHash("md5").update(readFileSync(f)).digest("hex").slice(0, 8);
const cssV = ver("assets/css/style.css");
const jsV = ver("assets/js/main.js");

const ICONS = {
  megaphone: '<path d="M3 11v2a2 2 0 0 0 2 2h1l3 5h2l-1.5-5H12l7 4V5l-7 4H5a2 2 0 0 0-2 2Z"/><path d="M21 10v4"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12Z"/><path d="M8.5 11h7M8.5 14h4"/>',
  camera: '<rect x="2" y="7" width="14" height="11" rx="2"/><path d="m16 11 6-3v9l-6-3"/><circle cx="6" cy="4" r="1.6"/><circle cx="11" cy="4" r="1.6"/>',
  pen: '<path d="M12 19 5 12l4-8h6l4 8-7 7Z"/><circle cx="12" cy="11" r="2"/><path d="M12 4v5M8 22h8"/>',
  code: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8h20M9.5 12 7 14.5 9.5 17M14.5 12l2.5 2.5-2.5 2.5"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/><path d="m12 12 7-7M16 5h3v3"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/>',
  whatsapp: '<path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3 3l-4.5 1.5Z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 1a4 4 0 0 1-2-2l1-1-1-2L9 9.5Z"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>',
  arrow: '<path d="M7 17 17 7M8 7h9v9"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/>',
  play: '<path d="M8 5v14l11-7L8 5Z"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  check: '<path d="m5 12 4.5 4.5L19 7"/>',
  cert: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M7 9h10M7 12h6"/><circle cx="17" cy="17" r="3"/><path d="m15.5 19.5-.5 3 2-1 2 1-.5-3"/>',
  cap: '<path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5M22 9v6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
};
const icon = (n, cls = "i") =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]}</svg>`;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const img = (src, alt, w, h, extra = "") =>
  `<img src="${IMG}${src}" alt="${esc(alt)}" width="${w}" height="${h}" loading="lazy" decoding="async" ${extra}>`;
const head = (k, title) => `<p class="kicker reveal">${k}</p><h2 class="h2 reveal">${title}</h2>`;

function jsonLd(c) {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE.url}/#person`,
    name: "Husam Abdelfatah",
    alternateName: ["Husam Abd Alfattah", "Husam Awad", "Husam Abdelfatah Awad Alhassan", "حسام عوض", "حسام عبدالفتاح عوض"],
    jobTitle: c.role,
    description: c.description,
    url: SITE.url + c.path,
    image: `${SITE.url}${IMG}husam-suit.webp`,
    email: `mailto:${SITE.email}`,
    telephone: SITE.phone,
    address: { "@type": "PostalAddress", addressLocality: "Ajman", addressCountry: "AE" },
    worksFor: { "@type": "Organization", name: "Festival Land Ajman", url: "https://festivalland.ae/" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Sudan Academy for Banking & Financial Sciences" },
    award: "Employee of the Year 2025 — Festival Land Ajman",
    knowsAbout: c.knowsAbout,
    knowsLanguage: ["ar", "en"],
    sameAs: [SITE.linkedin],
    alumniOf: { "@type": "CollegeOrUniversity", name: "Sudan Academy for Banking & Financial Sciences" },
    hasCredential: c.education.certs.filter((x) => x.url).map((x) => ({ "@type": "EducationalOccupationalCredential", name: x.t, credentialCategory: "certificate", url: x.url, recognizedBy: { "@type": "Organization", name: x.org.split(" · ")[0] } })),
  };
  const page = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: SITE.url + c.path,
    name: c.title,
    inLanguage: c.lang,
    dateModified: today,
    mainEntity: { "@id": `${SITE.url}/#person` },
  };
  return `<script type="application/ld+json">${JSON.stringify([person, page])}</script>`;
}

function render(c) {
  const isAr = c.lang === "ar";
  const fonts = isAr
    ? "https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&display=swap"
    : "https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&display=swap";
  const og = `${SITE.url}/assets/og-${c.lang}.jpg`;
  const N = c.nav;

  const stats = c.stats
    .map(
      (s) => `<li class="stat reveal"><b class="stat-n" dir="ltr"><span>${s.pre}</span><span data-count="${s.n}">${s.n}</span><span>${s.suf}</span></b><span class="stat-l">${s.label}</span></li>`
    )
    .join("");

  const marqueeItems = ["Meta Ads", "Google Ads", "TikTok", "Snapchat", "Instagram", "YouTube", "WordPress", "Photoshop", "Premiere Pro", "Illustrator", "Google Analytics", "SEO", "AI Marketing"];
  const marquee = marqueeItems.map((m) => `<span>${m}</span><i aria-hidden="true">✦</i>`).join("");

  const services = c.services.items
    .map(
      (s, i) => `<article class="svc reveal" style="--d:${i * 60}ms">
        <div class="svc-top"><span class="svc-ic">${icon(s.icon)}</span><span class="svc-n">0${i + 1}</span></div>
        <h3>${s.t}</h3><p>${s.d}</p>
        <ul class="tags">${s.tags.map((t) => `<li>${t}</li>`).join("")}</ul>
      </article>`
    )
    .join("");

  const cs = c.caseStudy;
  const csBlocks = cs.blocks
    .map(
      (b) => `<div class="cs-block reveal"><h3>${b.t}</h3>${b.d ? `<p>${b.d}</p>` : `<ul class="ticks">${b.list.map((l) => `<li>${icon("check")}${l}</li>`).join("")}</ul>`}</div>`
    )
    .join("");
  const csResults = cs.results
    .map((r) => `<div class="cs-res reveal"><b dir="ltr">${r.big}</b><span>${r.label}</span></div>`)
    .join("");
  const csImpact = cs.impact.map(([t, d]) => `<li class="reveal"><h4>${t}</h4><p>${d}</p></li>`).join("");
  const proofDims = { "proof/ig-followers.webp": [277, 155], "proof/gbp-performance.webp": [1100, 768], "proof/fb-insights.webp": [1100, 514] };
  const csProof = cs.proof
    .map((p) => {
      const [w, h] = proofDims[p.src];
      return `<figure class="shot reveal"><button class="zoom" data-full="${IMG}${p.src}" data-cap="${esc(p.cap)}">${img(p.src, p.cap, w, h)}</button><figcaption>${p.cap}</figcaption></figure>`;
    })
    .join("");

  const adDims = { "proof/meta-overview.webp": [1100, 495], "proof/top-campaign.webp": [1100, 465], "proof/conversations.webp": [1100, 427], "proof/audience.webp": [1100, 598] };
  const adsKpis = c.ads.kpis.map((k) => `<div class="kpi reveal"><b dir="ltr">${k.big}</b><span>${k.label}</span></div>`).join("");
  const adsShots = c.ads.shots
    .map((p) => {
      const [w, h] = adDims[p.src];
      return `<figure class="shot reveal"><button class="zoom" data-full="${IMG}${p.src}" data-cap="${esc(p.cap)}">${img(p.src, p.cap, w, h)}</button><figcaption>${p.cap}</figcaption></figure>`;
    })
    .join("");

  const posters = c.creative.posters
    .map((p, i) => `<button class="poster reveal zoom" style="--d:${(i % 3) * 70}ms" data-full="${IMG}${p.src}" data-cap="${esc(p.alt)}">${img(p.src, p.alt, 680, 850)}</button>`)
    .join("");
  const videos = c.creative.videos
    .map((v) => `<button class="vid reveal zoom" data-full="${IMG}${v.src}" data-cap="${esc(v.alt)}">${img(v.src, v.alt, 435, 242)}<span class="play">${icon("play")}</span></button>`)
    .join("");

  const sites = c.sites.items
    .map(
      (s, i) => `<article class="site reveal" style="--d:${i * 80}ms">
        <a class="browser" href="${s.url}" target="_blank" rel="noopener" aria-label="${esc(c.sites.visit + ": " + s.n)}">
          <span class="bar" dir="ltr"><i></i><i></i><i></i><span class="addr">${s.host}</span></span>
          ${img(s.img, s.n, 1200, 750)}
        </a>
        <div class="site-body">
          <h3>${s.n}</h3><p>${s.d}</p>
          <dl>
            <div><dt>${c.sites.features}</dt><dd>${s.f}</dd></div>
            <div><dt>${c.sites.role}</dt><dd>${c.sites.roleVal}</dd></div>
            <div><dt>${c.sites.platform}</dt><dd>WordPress</dd></div>
          </dl>
          <a class="link" href="${s.url}" target="_blank" rel="noopener">${c.sites.visit} ${icon("arrow")}</a>
        </div>
      </article>`
    )
    .join("");

  const jobs = c.experience.jobs
    .map(
      (j) => `<article class="job reveal">
        <div class="job-when">${j.when}</div>
        <div class="job-main">
          <h3>${j.role}</h3>
          <p class="job-org">${j.org} <span>· ${j.where}</span></p>
          <div class="job-tags">
          ${j.badge ? `<p class="badge-award">${icon("award")}${j.badge}</p>` : ""}
          ${j.link ? `<a class="ig-chip" href="${j.link.href}" target="_blank" rel="noopener" dir="ltr">${icon("instagram")}${j.link.label}</a>` : ""}
          ${(j.clients || []).map((cl) => `<a class="ig-chip" href="${cl.href}" target="_blank" rel="noopener"><span class="ig-k">${j.clientsLabel}:</span> <b>${cl.name}</b> <span dir="ltr">${icon("instagram")}${cl.handle}</span></a>`).join("")}
          </div>
          <ul>${j.points.map((p) => `<li>${p}</li>`).join("")}</ul>
        </div>
      </article>`
    )
    .join("");

  const skills = c.skills.groups
    .map((g) => `<div class="sk reveal"><h3>${g.t}</h3><ul>${g.items.map((x) => `<li>${x}</li>`).join("")}</ul></div>`)
    .join("");

  const e = c.education;
  const certs = e.certs
    .map(
      (x) => `<li class="cert reveal"><span class="cert-ic">${icon("cert")}</span><div class="cert-body">${x.kind ? `<span class="cert-kind">${x.kind}</span>` : ""}<h3 dir="ltr">${x.t}</h3><p><bdi dir="ltr">${x.org}</bdi> · <bdi>${x.when}</bdi></p>${x.id ? `<p class="cid">${e.idLabel}: <code>${x.id}</code></p>` : ""}</div>${x.url ? `<a class="cert-go" href="${x.url}" target="_blank" rel="noopener" aria-label="${e.verify}: ${esc(x.t)}">${e.verify} ${icon("arrow")}</a>` : ""}</li>`
    )
    .join("");

  const k = c.contact;
  const contacts = [
    ["mail", k.email, SITE.email, `mailto:${SITE.email}`],
    ["phone", k.phone, SITE.phoneDisplay, `tel:${SITE.phone}`],
    ["whatsapp", k.whatsapp, SITE.whatsappDisplay, `https://wa.me/${SITE.whatsapp}`],
    ["linkedin", k.linkedin, k.linkedinVal, SITE.linkedin],
  ]
    .map(
      ([ic, l, v, href]) => `<li class="reveal"><a href="${href}"${href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}><span class="c-ic">${icon(ic)}</span><span><small>${l}</small><b dir="ltr">${v}</b></span>${icon("arrow", "i c-go")}</a></li>`
    )
    .join("");

  return `<!doctype html>
<html lang="${c.lang}" dir="${c.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${c.title}</title>
<meta name="description" content="${esc(c.description)}">
<meta name="author" content="Husam Abdelfatah">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#0a0a0b">
<link rel="canonical" href="${SITE.url}${c.path}">
<link rel="alternate" hreflang="en" href="${SITE.url}/">
<link rel="alternate" hreflang="ar" href="${SITE.url}/ar/">
<link rel="alternate" hreflang="x-default" href="${SITE.url}/">
<meta property="og:type" content="profile">
<meta property="og:site_name" content="Husam Abdelfatah">
<meta property="og:title" content="${esc(c.title)}">
<meta property="og:description" content="${esc(c.description)}">
<meta property="og:url" content="${SITE.url}${c.path}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${c.ogLocale}">
<meta property="profile:first_name" content="Husam">
<meta property="profile:last_name" content="Abdelfatah">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(c.title)}">
<meta name="twitter:description" content="${esc(c.description)}">
<meta name="twitter:image" content="${og}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fonts}">
<link rel="preload" as="image" href="${IMG}husam-suit.webp" fetchpriority="high">
<link rel="stylesheet" href="/assets/css/style.css?v=${cssV}">
${jsonLd(c)}
</head>
<body>
<a class="skip" href="#main">${c.skip}</a>
<div class="progress" aria-hidden="true"></div>
<header class="nav" id="top">
  <div class="wrap nav-in">
    <a class="logo" href="${c.path}" aria-label="${c.name}">${c.first.toUpperCase()}<span>${c.last.toUpperCase()}</span><i>.</i></a>
    <nav class="links" id="menu" aria-label="Main">
      <a href="#about">${N.about}</a><a href="#services">${N.services}</a><a href="#work">${N.work}</a><a href="#experience">${N.experience}</a><a href="#contact">${N.contact}</a>
    </nav>
    <div class="nav-act">
      <a class="lang" href="${c.other}" hreflang="${isAr ? "en" : "ar"}" lang="${isAr ? "en" : "ar"}">${c.otherLabel}</a>
      <a class="btn btn-sm" href="#contact">${c.hire}</a>
      <button class="burger" aria-label="Menu" aria-expanded="false" aria-controls="menu">${icon("menu")}</button>
    </div>
  </div>
</header>

<main id="main">
<section class="hero">
  <div class="hero-bg" aria-hidden="true"><span class="ghost">${isAr ? "تسويق" : "MARKETING"}</span></div>
  <div class="wrap hero-in">
    <div class="hero-txt">
      <p class="avail"><span class="dot"></span>${c.hero.badge}</p>
      <p class="eyebrow">${c.hero.eyebrow}</p>
      <h1 class="h1">${c.hero.title.map((l) => `<span class="ln"><span>${l}</span></span>`).join("")}</h1>
      <p class="lead">${c.hero.sub}</p>
      <div class="ctas">
        <a class="btn" href="#work">${c.hero.cta1} ${icon("arrow")}</a>
        <a class="btn btn-ghost" href="${SITE.cv}" download>${icon("download")} ${c.hero.cta2}</a>
      </div>
    </div>
    <figure class="hero-pic print">
      <div class="print-box"><span class="print-frame" aria-hidden="true"></span>
      <div class="print-photo"><img src="${IMG}husam-suit.webp" alt="${esc(c.hero.photoAlt)}" width="690" height="862" fetchpriority="high"></div></div>
      <figcaption class="print-cap"><span>${c.hero.capLoc}</span><span class="on">${c.hero.capRole}</span></figcaption>
      <div class="award-chip">${icon("award")}<span><b>${c.hero.award}</b><small>Festival Land Ajman · ${c.hero.awardYear}</small></span></div>
    </figure>
  </div>
  <div class="wrap"><ul class="stats">${stats}</ul></div>
</section>

<div class="marquee" aria-hidden="true"><div class="mq-track" dir="ltr">${marquee}${marquee}</div></div>

<section class="sec" id="about">
  <div class="wrap about">
    <div>${head(c.about.kicker, c.about.title)}</div>
    <div class="about-txt">
      ${c.about.p.map((p) => `<p class="reveal">${p}</p>`).join("")}
      <dl class="facts reveal">${c.about.facts.map(([a, b]) => `<div><dt>${a}</dt><dd>${b}</dd></div>`).join("")}</dl>
    </div>
  </div>
</section>

<section class="sec sec-alt" id="services">
  <div class="wrap">
    <div class="sec-head">${head(c.services.kicker, c.services.title)}</div>
    <div class="svc-grid">${services}</div>
    <ul class="also reveal">${c.services.also.map((a) => `<li>${a}</li>`).join("")}</ul>
  </div>
</section>

<section class="sec" id="work">
  <div class="wrap">
    <div class="cs-head">
      <div>${head(cs.kicker + " — " + cs.client, cs.title)}</div>
      <p class="sec-sub reveal">${cs.intro}</p>
    </div>
    <div class="cs-results">${csResults}</div>
    <div class="cs-grid">${csBlocks}</div>
    <ul class="impact">${csImpact}</ul>
    <h3 class="h3 reveal">${cs.proofTitle}</h3>
    <div class="proof">${csProof}</div>
    <p class="note reveal">${cs.proofNote}</p>
  </div>
</section>

<section class="sec sec-alt" id="ads">
  <div class="wrap">
    <div class="sec-head">${head(c.ads.kicker, c.ads.title)}<p class="sec-sub reveal">${c.ads.sub}</p></div>
    <div class="kpis">${adsKpis}</div>
    <div class="shots">${adsShots}</div>
  </div>
</section>

<section class="sec" id="creative">
  <div class="wrap">
    <div class="sec-head">${head(c.creative.kicker, c.creative.title)}<p class="sec-sub reveal">${c.creative.sub}</p></div>
    <h3 class="h3 reveal">${c.creative.design}</h3>
    <div class="posters">${posters}</div>
    <div class="vid-head reveal"><h3 class="h3">${c.creative.video}</h3><p class="views">${icon("eye")}${c.creative.views}</p></div>
    <div class="vids">${videos}</div>
    <div class="ig-head reveal">
      <div><h3 class="h3">${c.creative.igTitle}</h3><p class="sec-sub">${c.creative.igSub}</p></div>
      <a class="btn btn-ghost" href="${SITE.festivalIg}" target="_blank" rel="noopener">${icon("instagram")} ${c.creative.igCta}</a>
    </div>
    <div class="ig-row" id="ig-row" dir="ltr">
      ${SITE.igPosts
        .map(
          (id) => `<div class="ig-card"><blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/${id}/?utm_source=ig_embed" data-instgrm-version="14"><a href="https://www.instagram.com/p/${id}/" target="_blank" rel="noopener">${icon("instagram")}<span>${c.creative.igOpen}</span></a></blockquote></div>`
        )
        .join("")}
    </div>
  </div>
</section>

<section class="sec sec-alt" id="websites">
  <div class="wrap">
    <div class="sec-head">${head(c.sites.kicker, c.sites.title)}<p class="sec-sub reveal">${c.sites.sub}</p></div>
    <div class="sites">${sites}</div>
  </div>
</section>

<section class="sec" id="experience">
  <div class="wrap two">
    <div>${head(c.experience.kicker, c.experience.title)}</div>
    <div class="jobs">${jobs}</div>
  </div>
</section>

<section class="sec sec-alt" id="skills">
  <div class="wrap">
    <div class="sec-head">${head(c.skills.kicker, c.skills.title)}</div>
    <div class="skills">${skills}</div>
  </div>
</section>

<section class="sec" id="education">
  <div class="wrap two">
    <div>${head(e.kicker, e.title)}
      <div class="degree reveal"><span class="cert-ic">${icon("cap")}</span><div><h3>${e.degree.t}</h3><p>${e.degree.org}</p><p class="cid">${e.degree.when}</p></div></div>
    </div>
    <ul class="certs">${certs}</ul>
  </div>
</section>

<section class="sec contact" id="contact">
  <div class="wrap contact-in">
    <div class="contact-txt">
      <p class="kicker reveal">${k.kicker}</p>
      <h2 class="h-xl reveal">${k.title.map((t, i) => `<span${i === 1 ? ' class="red"' : ""}>${t}</span>`).join(" ")}</h2>
      <p class="lead reveal">${k.sub}</p>
      <ul class="clist">${contacts}</ul>
    </div>
    <figure class="contact-pic print reveal"><div class="print-box"><span class="print-frame" aria-hidden="true"></span><div class="print-photo"><img src="${IMG}husam-profile.webp" alt="${esc(k.photoAlt)}" width="795" height="900" loading="lazy"></div></div><figcaption class="print-cap"><span>${c.hero.capName}</span><span class="on">${c.hero.capRole}</span></figcaption></figure>
  </div>
</section>
</main>

<footer class="foot">
  <div class="wrap foot-in">
    <p class="motto">${c.footer.motto.map((m) => `<span>${m}</span>`).join("<i>•</i>")}</p>
    <p class="copy">© <span id="yr">${new Date().getFullYear()}</span> ${c.name}. ${c.footer.rights}</p>
    <a class="totop" href="#top">${c.footer.top} ↑</a>
  </div>
</footer>

<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Image viewer" hidden>
  <button class="lb-x" aria-label="${c.lightboxClose}">${icon("close")}</button>
  <figure><img alt=""><figcaption></figcaption></figure>
</div>
<script src="/assets/js/main.js?v=${jsV}" defer></script>
</body>
</html>
`;
}

writeFileSync("index.html", render(content.en));
mkdirSync("ar", { recursive: true });
writeFileSync("ar/index.html", render(content.ar));

const alt = `<xhtml:link rel="alternate" hreflang="en" href="${SITE.url}/"/><xhtml:link rel="alternate" hreflang="ar" href="${SITE.url}/ar/"/><xhtml:link rel="alternate" hreflang="x-default" href="${SITE.url}/"/>`;
writeFileSync(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url><loc>${SITE.url}/</loc><lastmod>${today}</lastmod>${alt}</url>
  <url><loc>${SITE.url}/ar/</loc><lastmod>${today}</lastmod>${alt}</url>
</urlset>
`
);
console.log("Built index.html, ar/index.html, sitemap.xml");
