import { Link } from "react-router-dom";
import { PageHead } from "./components.jsx";

/** Public sitemap of main site pages (admin is intentionally omitted). */
export function Sitemap() {
  const links = [
    ["/", "Home"],
    ["/about", "About"],
    ["/directors", "Leadership"],
    ["/academics", "Academics"],
    ["/admissions", "Admissions"],
    ["/apply", "Apply online"],
    ["/signup", "Sign up"],
    ["/enquire", "Make an enquiry"],
    ["/fees", "School fees 2026"],
    ["/uniforms", "School uniforms"],
    ["/school-life", "School life"],
    ["/gallery", "Gallery"],
    ["/reading-materials", "Learning resources"],
    ["/faq", "FAQ"],
    ["/blog", "Blog"],
    ["/contact", "Contact"],
    ["/privacy", "Privacy"],
  ];
  return (
    <>
      <PageHead title="Sitemap" text="All main public pages on this website." path="/sitemap" />
      <section className="section">
        <div className="wrap">
          <ul className="checks">
            {links.map(([to, label]) => (
              <li key={to}>
                <Link to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
