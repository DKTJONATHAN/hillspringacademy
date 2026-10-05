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

function VideoCard({ id, title, text }) {
  const [play, setPlay] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  return (
    <article className="video-card">
      <div className="video-frame">
        {play ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button type="button" className="video-facade" onClick={() => setPlay(true)} aria-label={`Play ${title}`}>
            <img src={thumb} alt="" loading="lazy" width="480" height="360" />
            <span className="play" aria-hidden="true">▶</span>
          </button>
        )}
      </div>
      <div className="video-copy">
        <b>{title}</b>
        <small>{text}</small>
      </div>
    </article>
  );
}

export function Home() {
  const [showMoreVideos, setShowMoreVideos] = useState(false);
  const tiles = [
    ["/admissions", "apply", "Apply"],
    ["/academics", "book", "Academics"],
    ["/reading-materials", "book", "Resources"],
    ["/gallery", "image", "Gallery"],
  ];
  const videos = SCHOOL.videos || [];
  const visibleVideos = showMoreVideos ? videos : videos.slice(0, 2);
  const resourceCount = (SCHOOL.readingMaterials || []).length;

  useEffect(() => {
    const fullTitle = "Hill Springs Academy | Private School in Maua, Meru County";
    document.title = fullTitle;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Hill Springs Academy is a private CBE school in Maua, Igembe South, Meru County, Kenya. Kindergarten, Pre-Primary and Junior School. Admissions open.");
    let titleMeta = document.querySelector('meta[name="title"]');
    if (!titleMeta) { titleMeta = document.createElement("meta"); titleMeta.name = "title"; document.head.appendChild(titleMeta); }
    titleMeta.content = fullTitle;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", fullTitle);
  }, []);

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow">Private CBE school · Maua, Meru County</p>
            <h1>
              <span className="h1-name">Hill Springs Academy</span>
              <span className="motto-line">BUILDING AN <em>EXCELLENT</em> FOUNDATION FOR A <em>BRIGHTER</em> FUTURE</span>
            </h1>
            <p>Hill Springs Academy is a private school in Maua, Igembe South, Meru County. We teach Kindergarten, Pre-Primary and Junior School under Kenya’s Competency-Based Education (CBE), with strong teaching, clear values and a caring community.</p>
            <div className="btns">
              <Link to="/signup" className="btn">Sign up</Link>
              <Link to="/reading-materials" className="btn ghost">Learning resources</Link>
            </div>
            <div className="tiles">
              {tiles.map(([to, ic, l]) => (
                <Link key={to} to={to} className="tile-link">
                  <Icon n={ic} />
                  <span>{l}</span>
                </Link>
              ))}
            </div>
          </div>
          <Carousel />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <span className="eyebrow">A place to grow</span>
          <h2 className="reveal">Every child has a spark. We help it shine.</h2>
          <div className="cols">
            {SCHOOL.values.map((v, n) => (
              <div className="card reveal" style={{ "--d": n * 90 + "ms" }} key={v.title}>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning resources — clear path for students */}
      <section className="section alt" id="resources">
        <div className="wrap split">
          <div>
            <span className="eyebrow">For learners & families</span>
            <h2>Learning resources</h2>
            <p>
              Download notes, practice papers and assessment materials for your grade.
              {resourceCount > 0
                ? ` We currently have ${resourceCount} resources available, including Grade 7 SBA materials and notes for lower grades.`
                : " New materials are added regularly."}
            </p>
            <p>Open the resources page, choose your grade, and download the PDFs you need.</p>
            <div className="btns">
              <Link to="/reading-materials" className="btn">Go to resources</Link>
            </div>
          </div>
          <div className="card">
            <h3>What you will find</h3>
            <ul className="checks">
              <li>Grade 1 hygiene notes</li>
              <li>Grade 4 & 5 subject notes</li>
              <li>Grade 7 SBA question papers</li>
              <li>Teacher and learner copies where available</li>
            </ul>
            <Link to="/reading-materials" className="textlink">Browse all resources →</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div>
            <span className="eyebrow">Hill Springs Academy · Maua</span>
            <h2>A private school in Maua, Igembe South, Meru County</h2>
            <p>Hill Springs Academy serves families looking for private schools in Maua and across Meru County. We offer Kindergarten, Pre-Primary and Junior School under Kenya’s Competency-Based Education (CBE), with a clear focus on learning, character and partnership with parents.</p>
            <p>For current places, fees and reporting dates, please contact the admissions office — these details can change from term to term.</p>
            <Link to="/contact" className="textlink">Contact Hill Springs Academy</Link>
          </div>
          <div className="card">
            <h3>At a glance</h3>
            <ul className="checks">
              <li>School: Hill Springs Academy</li>
              <li>Location: Maua, Igembe South, Meru County, Kenya</li>
              <li>Curriculum: Kenya’s Competency-Based Education (CBE)</li>
              <li>Levels: Kindergarten, Pre-Primary, Junior School</li>
              <li>Type: Private school in Maua</li>
              <li>Transport: available (confirm routes with admissions)</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap split">
          <div>
            <span className="eyebrow">Find us</span>
            <h2>Visit Hill Springs Academy in Maua</h2>
            <p>We are based in Maua, Igembe South, Meru County. Use the map for location guidance and contact us before travelling if you need directions or to arrange a visit to this private CBE school.</p>
            <a className="textlink" href="https://www.google.com/maps/search/?api=1&query=Hill+Springs+Academy+Maua+Kenya" target="_blank" rel="noopener noreferrer">Open Hill Springs Academy on Google Maps ↗</a>
          </div>
          <div className="map-card">
            <iframe
              title="Hill Springs Academy on Google Maps, Maua, Meru County"
              src="https://www.google.com/maps?q=Hill+Springs+Academy,+Maua,+Kenya&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ width: "100%", height: "360px", border: 0 }}
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap split">
          <div>
            <span className="eyebrow">Getting to school</span>
            <h2>School transport</h2>
            <p>School transport is available for learners. Contact the admissions office to confirm current routes, availability and charges.</p>
            <Link to="/contact" className="textlink">Enquire about school transport</Link>
          </div>
          <Photo src="/Gallery/school-bus.webp" alt="Hill Springs Academy school bus in Maua, Meru County" />
        </div>
      </section>

      <section className="section learning-band">
        <div className="wrap learning-feature">
          <span className="eyebrow">Competency-Based Education (CBE)</span>
          <h2>Learning that goes beyond remembering</h2>
          <p>Kenya’s CBE approach helps learners at Hill Springs Academy build knowledge, practical skills, values and positive attitudes. Through inquiry, projects and reflection, children connect classroom learning with everyday life in Maua and Meru County.</p>
          <div className="video-grid">
            {visibleVideos.map((v) => (
              <VideoCard key={v.id} id={v.id} title={v.title} text={v.text} />
            ))}
          </div>
          {videos.length > 2 && (
            <div className="video-more">
              <button type="button" className="btn ghost dark" onClick={() => setShowMoreVideos((s) => !s)}>
                {showMoreVideos ? "Show fewer videos" : `Watch more (${videos.length - 2} more)`}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="section uniform-section">
        <div className="wrap">
          <div className="row-head reveal">
            <div>
              <span className="eyebrow">School uniform</span>
              <h2>Official Primary & Junior Secondary School (JSS) uniforms</h2>
            </div>
            <Link to="/contact" className="textlink">Ask admissions about uniform</Link>
          </div>

          <div className="uniform-level reveal">
            <span className="eyebrow">Primary School</span>
            <h3>Primary School Uniform</h3>
            <p className="uniform-intro">
              These are the official Primary School uniform designs used by Hill Springs Academy. Primary School does not have a jumper; the approved sweater option is shown separately below.
            </p>
            <div className="uniform-grid">
              <figure className="uniform-card reveal" style={{ "--d": "0ms" }}>
                <div className="uniform-image">
                  <img src="/junior-primary-boy.jfif" alt="Official Hill Springs Academy Primary School boy wearing the school shirt" loading="lazy" width="900" height="1200" />
                </div>
                <figcaption>
                  <strong>Primary School Boy — Shirt</strong>
                  <span>The standard Primary School boys' uniform with the school shirt and approved colours.</span>
                </figcaption>
              </figure>
              <figure className="uniform-card reveal" style={{ "--d": "80ms" }}>
                <div className="uniform-image">
                  <img src="/junior-primary-girl.jfif" alt="Official Hill Springs Academy Primary School girls' school uniform" loading="lazy" width="900" height="1200" />
                </div>
                <figcaption>
                  <strong>Primary School Girl</strong>
                  <span>Official girls' uniform, including the school colours and pattern.</span>
                </figcaption>
              </figure>
              <figure className="uniform-card reveal" style={{ "--d": "160ms" }}>
                <div className="uniform-image">
                  <img src="/junior-primary-boy2.jfif" alt="Official Hill Springs Academy Primary School boy wearing the school sweater" loading="lazy" width="900" height="1200" />
                </div>
                <figcaption>
                  <strong>Primary School Boy — Sweater</strong>
                  <span>The Primary School boy's sweater option for cooler days. Primary School does not use a jumper.</span>
                </figcaption>
              </figure>
            </div>
          </div>

          <div className="uniform-level reveal">
            <span className="eyebrow">Junior Secondary School (JSS)</span>
            <h3>Junior Secondary School (JSS) School Uniform</h3>
            <p className="uniform-intro">
              These are the official Junior Secondary School (JSS) uniform designs used by Hill Springs Academy, shown separately from Primary School.
            </p>
            <div className="uniform-grid">
              <figure className="uniform-card reveal" style={{ "--d": "0ms" }}>
                <div className="uniform-image">
                  <img src="/senior-primary-boy.jfif" alt="Official Hill Springs Academy Junior Secondary School (JSS) boys' school uniform" loading="lazy" width="900" height="1200" />
                </div>
                <figcaption>
                  <strong>Junior Secondary School (JSS) Boy</strong>
                  <span>Official boys' uniform and its approved colours and pattern.</span>
                </figcaption>
              </figure>
              <figure className="uniform-card reveal" style={{ "--d": "80ms" }}>
                <div className="uniform-image">
                  <img src="/senior-primary-girl.jfif" alt="Official Hill Springs Academy Junior Secondary School (JSS) girls' school uniform" loading="lazy" width="900" height="1200" />
                </div>
                <figcaption>
                  <strong>Junior Secondary School (JSS) Girl</strong>
                  <span>Official girls' uniform, including the school colours and pattern.</span>
                </figcaption>
              </figure>
              <figure className="uniform-card reveal" style={{ "--d": "160ms" }}>
                <div className="uniform-image">
                  <img src="/senior-primary-girl-with-jumper.jfif" alt="Official Hill Springs Academy Junior Secondary School (JSS) girl wearing the approved jumper" loading="lazy" width="900" height="1200" />
                </div>
                <figcaption>
                  <strong>Junior Secondary School (JSS) Girl with Jumper</strong>
                  <span>The approved JSS jumper combination for cooler days.</span>
                </figcaption>
              </figure>
            </div>
          </div>

          <div className="uniform-note reveal">
            <span aria-hidden="true">✓</span>
            <p><strong>Official uniform reference:</strong> Primary School has no jumper. Please use the photographs above to distinguish the standard shirt uniform from the approved sweater option. JSS uniform requirements are shown separately. For current supplier, sizing, pricing or term-specific requirements, contact the school.</p>
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
