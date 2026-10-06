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
      telephone: [SCHOOL.phoneTel, SCHOOL.phone2Tel].filter(Boolean),
      logo: `${SCHOOL.siteUrl}/logo.png`,
      address: {
        "@type": "PostalAddress",
        streetAddress: SCHOOL.poBox || undefined,
        addressLocality: "Maua",
        addressRegion: "Meru County",
        addressCountry: "KE",
      },
      areaServed: ["Maua", "Igembe South", "Meru County", "Kenya"],
      sameAs: Object.values(SCHOOL.social || {}).filter(Boolean),
    });
  }, [fullTitle, metaDescription, canonical, image, title]);
  return (
    <header className="pagehead">
      <div className="wrap">
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
    </header>
  );
}

const NAV = [
  ["/", "Home", "home"],
  ["/about", "About", "about"],
  ["/academics", "Academics", "book"],
  ["/admissions", "Admissions", "apply"],
  ["/school-life", "School life", "book"],
  ["/gallery", "Gallery", "image"],
  ["/contact", "Contact", "mail"],
];

/** Site header used by App.jsx — accepts theme/toggle/scrolled from useTheme + useScroll */
export function Header({ theme = "light", toggle, scrolled = false }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  return (
    <header className={"site-header" + (scrolled ? " scrolled" : "")}>
      <div className="wrap bar">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <Logo size={48} />
          <span className="brand-text">
            <strong>{SCHOOL.name}</strong>
            <small>Maua · Meru County</small>
          </span>
        </Link>
        <nav className="top-nav" aria-label="Main">
          {NAV.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === "/"}>{label}</NavLink>
          ))}
        </nav>
        <div className="actions">
          <Link className="btn small header-btn" to="/apply">Apply</Link>
          <Link className="btn small ghost header-btn" to="/enquire">Enquire</Link>
          <button type="button" className="icon-btn" onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            <Icon n={theme === "dark" ? "sun" : "moon"} size={18} />
          </button>
          <button type="button" className={"menu-toggle" + (open ? " open" : "")}
            aria-expanded={open} aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}>
            <span className="menu-bars" aria-hidden="true"><i></i><i></i><i></i></span>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile">
          <div className="mobile-menu-head">
            <div>
              <span className="mobile-menu-kicker">Hill Springs Academy</span>
              <strong>Menu</strong>
            </div>
            <button type="button" className="mobile-close" onClick={() => setOpen(false)} aria-label="Close menu">×</button>
          </div>
          <div className="mobile-menu-links">
            {NAV.map(([to, label, icon]) => (
              <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}>
                <Icon n={icon} size={19} /><span>{label}</span>
              </NavLink>
            ))}
            <Link to="/fees" onClick={() => setOpen(false)}><Icon n="book" size={19} /><span>Fees</span></Link>
            <Link to="/reading-materials" onClick={() => setOpen(false)}><Icon n="book" size={19} /><span>Reading materials</span></Link>
          </div>
          <div className="mobile-menu-cta">
            <Link className="btn" to="/apply" onClick={() => setOpen(false)}>Apply online</Link>
            <Link className="btn ghost" to="/enquire" onClick={() => setOpen(false)}>Make an enquiry</Link>
          </div>
        </nav>
      )}
    </header>
  );
}

/** Keep Navbar as an alias so any older imports still work */
export const Navbar = Header;

/** Mobile bottom navigation — 6 primary destinations */
export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Mobile primary">
      {NAV.map(([to, label, icon]) => (
        <NavLink key={to} to={to} end={to === "/"}>
          <Icon n={icon} size={19} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export function Footer() {
  const social = Object.entries(SCHOOL.social || {}).filter(([, v]) => v);
  return (
    <footer className="site-footer" itemScope itemType="https://schema.org/EducationalOrganization">
      <div className="wrap foot-intro">
        <div>
          <span className="foot-kicker">Hill Springs Academy</span>
          <h2>Building an excellent foundation for a brighter future.</h2>
        </div>
        <Link className="btn small foot-cta" to="/apply">Start an application <span aria-hidden="true">↗</span></Link>
      </div>

      <div className="wrap foot-grid">
        <div className="foot-col brand-col">
          <div className="foot-brand">
            <Logo size={64} />
            <div>
              <strong className="foot-name" itemProp="name">{SCHOOL.name}</strong>
              <span className="foot-tag" itemProp="slogan">{SCHOOL.motto}</span>
            </div>
          </div>
          <p className="foot-blurb">Kindergarten, Pre-Primary and Junior School under Kenya’s Competency-Based Education.</p>
          {social.length > 0 && (
            <div className="social" aria-label="School social media">
              {social.map(([k, v]) => (
                <a key={k} href={v} target="_blank" rel="noopener noreferrer" aria-label={k}>
                  {k[0].toUpperCase() + k.slice(1)}
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="foot-col">
          <h3>Explore</h3>
          <nav className="foot-links" aria-label="Footer explore">
            {NAV.slice(1).map(([to, l]) => <Link key={to} to={to}>{l}</Link>)}
            <Link to="/reading-materials">Resources</Link>
            <Link to="/fees">Fees</Link>
            <Link to="/uniforms">Uniforms</Link>
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
                <span className="fc-values">
                  <a href={`tel:${SCHOOL.phoneTel || SCHOOL.phone.replace(/\s/g, "")}`} itemProp="telephone">{SCHOOL.phone}</a>
                  {SCHOOL.phone2 && <a href={`tel:${SCHOOL.phone2Tel || SCHOOL.phone2.replace(/\s/g, "")}`}>{SCHOOL.phone2}</a>}
                </span>
              </li>
            )}
            {SCHOOL.poBox && (
              <li itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <span className="fc-label">Postal</span>
                <span itemProp="streetAddress">{SCHOOL.poBox}</span>
                <span className="fc-sub"><span itemProp="addressLocality">Maua</span>, <span itemProp="addressRegion">Meru County</span>, <span itemProp="addressCountry">Kenya</span></span>
              </li>
            )}
            <li>
              <span className="fc-label">Email</span>
              <span className="fc-values">
                <a href={`mailto:${SCHOOL.infoEmail}`}>{SCHOOL.infoEmail}</a>
                <a href={`mailto:${SCHOOL.admissionsEmail}`}>{SCHOOL.admissionsEmail}</a>
              </span>
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
        <div className="legal-right">
          <span>Website developed by <a href="https://zandani.co.ke" target="_blank" rel="noopener noreferrer">Jonathan Mwaniki</a></span>
          <Link to="/privacy">Privacy & data protection</Link>
          <Link to="/sitemap">Sitemap</Link>
        </div>
      </div>
    </footer>
  );
}

