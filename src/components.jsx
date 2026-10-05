import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { SCHOOL } from "./data.js";

const P = {
  home: <path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  about: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.01" /></>,
  book: <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7" />,
  apply: <path d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7" />,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.5" /><path d="M21 16l-5-5-8 8" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" /></>,
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
  left: <path d="M15 5l-7 7 7 7" />,
  right: <path d="M9 5l7 7-7 7" />,
};
export const Icon = ({ n, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{P[n]}</svg>
);

export function Logo({ size = 56 }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="logo-ph" style={{ width: size, height: size }} aria-hidden="true">HSA</span>;
  return <img src="/logo.png" alt="Hill Springs Academy, Maua" width={size} height={size} onError={() => setFailed(true)} style={{ objectFit: "contain" }} />;
}

export function Photo({ src, alt, ratio = "4/3" }) {
  return (
    <div className="photo" style={{ aspectRatio: ratio }}>
      {src ? <img src={src} alt={alt} loading="lazy" /> : <span>{alt}</span>}
    </div>
  );
}

export function PageHead({ title, text, description, path, image }) {
  const metaDescription = description || text || "Hill Springs Academy is a private CBE school in Maua, Igembe South, Meru County, Kenya. Kindergarten, Pre-Primary and Junior School.";
  const canonicalPath = path || window.location.pathname;
  const cleanPath = canonicalPath === "/" ? "/" : (canonicalPath.endsWith("/") ? canonicalPath.slice(0, -1) : canonicalPath);
  const canonical = `${SCHOOL.siteUrl}${cleanPath}`;
  const fullTitle = title.toLowerCase().includes("hill springs") ? title : `${title} | Hill Springs Academy, Maua`;
  useEffect(() => {
    document.title = fullTitle;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = metaDescription;
    let titleMeta = document.querySelector('meta[name="title"]');
    if (!titleMeta) { titleMeta = document.createElement("meta"); titleMeta.name = "title"; document.head.appendChild(titleMeta); }
    titleMeta.content = fullTitle;
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) { canonicalEl = document.createElement("link"); canonicalEl.rel = "canonical"; document.head.appendChild(canonicalEl); }
    canonicalEl.href = canonical;
    const setMeta = (property, content) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute("property", property); document.head.appendChild(el); }
      el.content = content;
    };
    setMeta("og:title", fullTitle);
    setMeta("og:description", metaDescription);
    setMeta("og:type", "website");
    setMeta("og:url", canonical);
    setMeta("og:site_name", SCHOOL.name);
    setMeta("og:image", image || `${SCHOOL.siteUrl}/logo.png`);
    setMeta("og:image:alt", `${title} | Hill Springs Academy, Maua, Meru County`);
    setMeta("og:locale", "en_KE");
    setMeta("og:image:width", "1200");
    setMeta("og:image:height", "630");
    setMeta("og:image:type", "image/jpeg");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", metaDescription);
    setMeta("twitter:image", image || `${SCHOOL.siteUrl}/logo.png`);
    setMeta("twitter:image:alt", `${title} | Hill Springs Academy, Maua`);
    let ld = document.getElementById("school-jsonld");
    if (!ld) { ld = document.createElement("script"); ld.id = "school-jsonld"; ld.type = "application/ld+json"; document.head.appendChild(ld); }
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": ["School", "EducationalOrganization"],
      name: SCHOOL.name,
      alternateName: ["Hill Springs", "Hillsprings Academy", "Hill Springs Academy Maua", "Hill Sprungs Academy"],
      url: SCHOOL.siteUrl,
      description: SCHOOL.intro,
      slogan: SCHOOL.motto,
      email: SCHOOL.infoEmail,
      telephone: SCHOOL.phoneTel || SCHOOL.phone || undefined,
      logo: `${SCHOOL.siteUrl}/logo.png`,
      address: {
        "@type": "PostalAddress",
        streetAddress: SCHOOL.poBox || undefined,
        addressLocality: "Maua",
        addressRegion: "Meru County",
        postalCode: "60600",
        addressCountry: "KE",
      },
      areaServed: ["Maua", "Igembe South", "Meru County", "Kenya"],
      educationalLevel: ["Kindergarten", "Pre-Primary", "Junior School"],
      hasMap: "https://www.google.com/maps/search/?api=1&query=Hill+Springs+Academy+Maua+Kenya",
      sameAs: Object.values(SCHOOL.social || {}).filter(Boolean)
    });
  }, [fullTitle, metaDescription, canonical, title, image]);
  return (
    <section className="pagehead">
      <div className="wrap"><p className="eyebrow page-eyebrow">Hill Springs Academy · Maua, Meru County</p><h1>{title}</h1>{text && <p>{text}</p>}</div>
    </section>
  );
}

export const NAV = [
  ["/", "Home", "home"],
  ["/about", "About", "about"],
  ["/academics", "Academics", "book"],
  ["/admissions", "Admissions", "apply"],
  ["/gallery", "Gallery", "image"],
  ["/contact", "Contact", "mail"],
];

const MORE_LINKS = [
  ["/school-life", "School life"],
  ["/blog", "Blog"],
  ["/reading-materials", "Resources"],
  ["/fees", "Fees"],
  ["/faq", "FAQ"],
  ["/signup", "Sign up"],
  ["/apply", "Apply online"],
  ["/enquire", "Make an enquiry"],
  ["/directors", "Leadership"],
  ["/privacy", "Privacy"],
  ["/sitemap", "Sitemap"],
];

export function Header({ theme, toggle, scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className={"site-header" + (scrolled ? " scrolled" : "")}>
      <div className="wrap bar">
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <Logo size={scrolled ? 56 : 68} />
          <span className="brand-text">
            <strong>{SCHOOL.short}</strong>
            <small>Academy</small>
          </span>
        </Link>

        <nav aria-label="Main" className="top-nav">
          {NAV.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/"}>{label}</NavLink>
          ))}
        </nav>

        <div className="actions">
          <button className="icon-btn" onClick={toggle} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            <Icon n={theme === "dark" ? "sun" : "moon"} size={18} />
          </button>
          <Link to="/signup" className="btn small ghost header-btn">Sign up</Link>
          <Link to="/apply" className="btn small header-btn">Apply</Link>
          <button
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="mobile-menu" aria-label="All pages">
          {[...NAV, ...MORE_LINKS].map(([to, label]) => (
            <NavLink key={to + label} to={to} end={to === "/"} onClick={() => setMenuOpen(false)}>{label}</NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main mobile">
      {NAV.map(([to, label, ic]) => (
        <NavLink key={to} to={to} end={to === "/"}><Icon n={ic} size={20} /><span>{label}</span></NavLink>
      ))}
    </nav>
  );
}

export function Footer() {
  const social = Object.entries(SCHOOL.social || {}).filter(([, v]) => v);
  return (
    <footer className="site-footer" itemScope itemType="https://schema.org/School">
      <div className="wrap foot-grid">
        <div className="foot-brand">
          <div className="brand light">
            <Logo size={72} />
            <div>
              <span className="foot-name" itemProp="name">{SCHOOL.name}</span>
              <span className="foot-tag">Private CBE school · Maua</span>
            </div>
          </div>
          <p className="foot-blurb">Kindergarten, Pre-Primary and Junior School under Kenya’s Competency-Based Education.</p>
          {social.length > 0 && (
            <p className="social">
              {social.map(([k, v]) => (
                <a key={k} href={v} target="_blank" rel="noopener noreferrer">{k[0].toUpperCase() + k.slice(1)}</a>
              ))}
            </p>
          )}
        </div>

        <div className="foot-col">
          <h3>Explore</h3>
          <nav className="foot-links" aria-label="Footer explore">
            {NAV.slice(1).map(([to, l]) => (
              <Link key={to} to={to}>{l}</Link>
            ))}
            <Link to="/reading-materials">Resources</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/school-life">School life</Link>
          </nav>
        </div>

        <div className="foot-col">
          <h3>Contact</h3>
          <ul className="foot-contact">
            {SCHOOL.phone && (
              <li>
                <span className="fc-label">Phone</span>
                <a href={`tel:${SCHOOL.phoneTel || SCHOOL.phone.replace(/\s/g, "")}`} itemProp="telephone">{SCHOOL.phone}</a>
              </li>
            )}
            {SCHOOL.poBox && (
              <li itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <span className="fc-label">Postal</span>
                <span itemProp="streetAddress">{SCHOOL.poBox}</span>
                <span className="fc-sub">
                  <span itemProp="addressLocality">Maua</span>,{" "}
                  <span itemProp="addressRegion">Meru County</span>,{" "}
                  <span itemProp="addressCountry">Kenya</span>
                </span>
              </li>
            )}
            <li>
              <span className="fc-label">Email</span>
              <a href={`mailto:${SCHOOL.infoEmail}`}>{SCHOOL.infoEmail}</a>
              <a href={`mailto:${SCHOOL.admissionsEmail}`}>{SCHOOL.admissionsEmail}</a>
            </li>
            <li className="foot-actions">
              <Link to="/contact">Contact form</Link>
              <Link to="/apply">Apply online</Link>
              <Link to="/enquire">Make an enquiry</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="wrap legal">
        <span>© {new Date().getFullYear()} {SCHOOL.name}. All rights reserved.</span>
        <span className="legal-right">
          Website developed by <a href="https://zandani.co.ke" target="_blank" rel="noopener noreferrer">Jonathan Mwaniki</a>
          {" · "}
          <Link to="/privacy">Privacy</Link>
        </span>
      </div>
    </footer>
  );
}
