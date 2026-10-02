import { useEffect } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { Header, BottomNav, Footer, PageHead } from "./components.jsx";
import { Home, About, Academics, Admissions, Gallery, ReadingMaterials, Contact, Directors, Privacy, Blog, Sitemap } from "./pages.jsx";
import { useTheme, useScroll } from "./hooks.js";

const NotFound = () => (
  <>
    <PageHead title="Page not found" text="That page does not exist." />
    <section className="section"><div className="wrap"><Link className="btn" to="/">Back to home</Link></div></section>
  </>
);

export default function App() {
  const { pathname } = useLocation();
  const [theme, toggle] = useTheme();
  const { y, p } = useScroll();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="progress" style={{ transform: `scaleX(${p})` }} aria-hidden="true" />
      <Header theme={theme} toggle={toggle} scrolled={y > 12} />
      <main id="main">
        <div className="page">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/directors" element={<Directors />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/reading-materials" element={<ReadingMaterials />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
