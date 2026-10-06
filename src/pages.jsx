import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SCHOOL, GALLERY, HERO } from "./data.js";
import { Photo, Icon } from "./components.jsx";

function Carousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % HERO.length), 5000);
    return () => clearInterval(t);
  }, [paused]);
  const go = (d) => setI((n) => (n + d + HERO.length) % HERO.length);
  return (
    <div className="carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} aria-roledescription="carousel" aria-label="School highlights">
      <div className="track" style={{ transform: `translateX(-${i * 100}%)` }}>
        {HERO.map((s, n) => (
          <div className="slide" key={s.title} aria-hidden={n !== i}>
            <Photo src={s.src} alt={s.alt} ratio="4/5" />
            <div className="cap"><b>{s.title}</b><span>{s.text}</span></div>
          </div>
        ))}
      </div>
      <button className="nav prev" onClick={() => go(-1)} aria-label="Previous slide"><Icon n="left" /></button>
      <button className="nav next" onClick={() => go(1)} aria-label="Next slide"><Icon n="right" /></button>
      <div className="dots">
        {HERO.map((s, n) => <button key={s.title} className={n === i ? "on" : ""} onClick={() => setI(n)} aria-label={`Go to slide ${n + 1}`} />)}
      </div>
    </div>
  );
}

export function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Private CBE school · Maua, Meru County</span>
            <h1>{SCHOOL.name}</h1>
            <p className="lede">{SCHOOL.motto}</p>
            <p>{SCHOOL.intro}</p>
            <div className="btns">
              <Link className="btn" to="/apply">Apply online</Link>
              <Link className="btn ghost" to="/about">About the school</Link>
            </div>
          </div>
          <Carousel />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="row-head">
            <div>
              <span className="eyebrow">Learning stages</span>
              <h2>From early years to Junior School</h2>
            </div>
            <Link to="/academics" className="textlink">Academics</Link>
          </div>
          <div className="cols">
            {(SCHOOL.stages || []).map((s, n) => (
              <article className="card reveal" key={s.title} style={{ "--d": `${n * 80}ms` }}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap split">
          <div>
            <span className="eyebrow">School transport</span>
            <h2>School transport</h2>
            <p>School transport is available for learners. Contact the admissions office to confirm current routes, availability and charges.</p>
            <Link to="/enquire?subject=School%20transport&topic=contact" className="textlink">Enquire about school transport</Link>
          </div>
          <div>
            <span className="eyebrow">Resources</span>
            <h2>Learning resources</h2>
            <p>Download notes and assessment materials by grade for home study support.</p>
            <Link to="/reading-materials" className="textlink">Open resources</Link>
          </div>
        </div>
      </section>

      <section className="section uniform-section">
        <div className="wrap">
          <div className="row-head">
            <div>
              <span className="eyebrow">School uniform</span>
              <h2>Official Primary & Junior Secondary School (JSS) uniforms</h2>
            </div>
            <Link to="/enquire?subject=School%20uniforms&topic=contact" className="textlink">Enquire about school uniforms</Link>
          </div>
          <p className="lede">Preview of official uniforms. See the full uniforms page for every option by level.</p>
          <div className="btns" style={{ marginBottom: 20 }}>
            <Link className="btn" to="/uniforms">View all uniforms</Link>
            <Link className="btn ghost" to="/fees">School fees 2026</Link>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <div className="row-head reveal">
            <h2>Moments of school life</h2>
            <Link to="/gallery" className="textlink">See all photos</Link>
          </div>
          <div className="gallery-grid">
            {GALLERY.slice(0, 6).map((g, n) => (
              <div className="reveal" style={{ "--d": n * 70 + "ms" }} key={g.alt + n}>
                <Photo {...g} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="wrap reveal">
          <h2>Admissions are open at Hill Springs Academy</h2>
          <p>Create a free parent account, then apply online. We will guide you through every step.</p>
          <div className="btns" style={{ justifyContent: "center" }}>
            <Link className="btn white" to="/signup">Sign up</Link>
            <Link className="btn ghost" style={{ borderColor: "#fff", color: "#fff" }} to="/apply">Apply online</Link>
          </div>
        </div>
      </section>
    </>
  );
}
