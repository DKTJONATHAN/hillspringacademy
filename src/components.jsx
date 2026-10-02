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

export function Logo({ size = 44 }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="logo-ph" style={{ width: size, height: size }} aria-hidden="true">LOGO</span>;
  return <img src="/logo.png" alt="" width={size} height={size} onError={() => setFailed(true)} style={{ objectFit: "contain" }} />;
}

export function Photo({ src, alt, ratio = "4/3" }) {
  return (
    <div className="photo" style={{ aspectRatio: ratio }}>
      {src ? <img src={src} alt={alt} loading="lazy" /> : <span>{alt}</span>}
    </div>
  );
}

export function PageHead({ title, text, description, path }) {
  const metaDescription = description || text || "Hill Springs Academy in Maua, Meru County, Kenya — learning, admissions, school life and learner resources.";
  const canonicalPath = path || window.location.pathname;
  const canonical = `${SCHOOL.siteUrl}${canonicalPath === "/" ? "/" : canonicalPath.replace(/\\/$/, "")}`;
  useEffect(() => {
    document.title = `${title} | ${SCHOOL.name}`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = metaDescription;
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) { canonicalEl = document.createElement("link"); canonicalEl.rel = "canonical"; document.head.appendChild(canonicalEl); }
    canonicalEl.href = canonical;
    const setMeta = (property, content) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute("property", property); document.head.appendChild(el); }
      el.content = content;
    };
    setMeta("og:title", `${title} | ${SCHOOL.name}`);
    setMeta("og:description", metaDescription);
    setMeta("og:type", "website");
    setMeta("og:url", canonical);
    setMeta("og:site_name", SCHOOL.name);
    let ld = document.getElementById("school-jsonld");
    if (!ld) { ld = document.createElement("script"); ld.id = "school-jsonld"; ld.type = "application/ld+json"; document.head.appendChild(ld); }
    ld.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      name: SCHOOL.name,
      url: SCHOOL.siteUrl,
      description: SCHOOL.intro,
      slogan: SCHOOL.motto,
      email: SCHOOL.infoEmail,
      address: { "@type": "PostalAddress", addressLocality: "Maua", addressRegion: "Meru County", addressCountry: "KE" },
      areaServed: ["Maua", "Igembe South", "Meru County", "Kenya"]
    });
  }, [title, metaDescription, canonical]);
  return (
    <section className="pagehead">
      <div className="wrap"><p className="eyebrow page-eyebrow">{SCHOOL.name} · Maua, Meru County</p><h1>{title}</h1>{text && <p>{text}</p>}</div>
    </section>
  );
}

export const NAV = [
  ["/", "Home", "home"],
  ["/about", "About", "about"],
  ["/academics", "Academics", "book"],
  ["/admissions", "Admissions", "apply"],
  ["/school-life", "School Life", "image"],
  ["/reading-materials", "Resources", "book"],
  ["/contact", "Contact", "mail"],
];

export function Header({ theme, toggle, scrolled }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className={"site-header" + (scrolled ? " scrolled" : "")}>
      <div className="wrap bar">
        <Link to="/" className="brand"><Logo size={scrolled ? 36 : 44} /><span>{SCHOOL.name}</span></Link>
        <nav aria-label="Main" className="top-nav">
          {NAV.map(([to, label]) => <NavLink key={to} to={to} end={to === "/"}>{label}</NavLink>)}
        </nav>
        <button className="menu-toggle" aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen(v => !v)}>{menuOpen ? "×" : "☰"} <span>{menuOpen ? "Close" : "Menu"}</span></button>
        <div className="actions">
          <button className="icon-btn" onClick={toggle} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
            <Icon n={theme === "dark" ? "sun" : "moon"} />
          </button>
          <Link to="/admissions" className="btn small">Apply now</Link>
        </div>
      </div>
      {menuOpen && <nav className="mobile-menu" aria-label="Mobile navigation">{[...NAV, ["/fees","School Fees"], ["/faq","FAQ"], ["/gallery","Gallery"], ["/directors","Leadership"], ["/blog","Blog"], ["/privacy","Privacy"], ["/sitemap","Sitemap"]].map(([to,label]) => <NavLink key={to} to={to} end={to === "/"} onClick={() => setMenuOpen(false)}>{label}</NavLink>)}</nav>}
    </header>
  );
}

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main mobile">
      {NAV.map(([to, label, ic]) => (
        <NavLink key={to} to={to} end={to === "/"}><Icon n={ic} size={22} /><span>{label}</span></NavLink>
      ))}
    </nav>
  );
}

export function Footer() {
  const social = Object.entries(SCHOOL.social).filter(([, v]) => v);
  return (
    <footer className="site-footer">
      <div className="wrap foot-grid">
        <div>
          <div className="brand light"><Logo size={40} /><span>{SCHOOL.name}</span></div>
          <p>{SCHOOL.town}</p>
          {social.length > 0 && <p className="social">{social.map(([k, v]) => <a key={k} href={v} target="_blank" rel="noopener noreferrer">{k[0].toUpperCase() + k.slice(1)}</a>)}</p>}
        </div>
        <div><h3>Explore</h3>{NAV.slice(1).map(([to, l]) => <Link key={to} to={to}>{l}</Link>)}</div>
        <div>
          <h3>Contact</h3>
          <a href={`mailto:${SCHOOL.admissionsEmail}`}>{SCHOOL.admissionsEmail}</a>
          <a href={`mailto:${SCHOOL.infoEmail}`}>{SCHOOL.infoEmail}</a>
          {SCHOOL.phone && <span>{SCHOOL.phone}</span>}
        </div>
      </div>
      <div className="wrap legal">
        © {new Date().getFullYear()} {SCHOOL.name}. Website by Jonathan Mwaniki of{" "}
        <a href="https://zandani.co.ke" target="_blank" rel="noopener noreferrer">zandani.co.ke</a>.
      </div>
    </footer>
  );
}
