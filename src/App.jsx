import { useEffect } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { Header, BottomNav, Footer, PageHead } from "./components.jsx";
import { Home } from "./pages.jsx";
import {
  About,
  Academics,
  Admissions,
  Gallery,
  ReadingMaterials,
  Contact,
  Directors,
  Privacy,
  Blog,
  Sitemap,
  SchoolLife,
  Fees,
  Uniforms,
  FAQ,
} from "./pagesRest.jsx";
import { AdminEmailCentre } from "./AdminEmailCentre.jsx";
import { AccountPortal } from "./AccountPortal.jsx";
import { useTheme, useScroll } from "./hooks.js";
import { PrivacyConsent } from "./PrivacyConsent.jsx";

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
            <Route path="/blog/:slug" element={<Blog />} />
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/apply" element={<AccountPortal kind="admissions" />} />
            <Route path="/signup" element={<AccountPortal kind="signup" />} />
            <Route path="/enquire" element={<AccountPortal kind="enquiry" />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/reading-materials" element={<ReadingMaterials />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminEmailCentre />} />
            <Route path="/school-life" element={<SchoolLife />} />
            <Route path="/fees" element={<Fees />} />
            <Route path="/uniforms" element={<Uniforms />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Footer />
      <BottomNav />
      <PrivacyConsent />
    </>
  );
}
