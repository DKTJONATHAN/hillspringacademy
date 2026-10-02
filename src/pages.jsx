import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SCHOOL, GALLERY, HERO } from "./data.js";
import { Photo, PageHead, Icon } from "./components.jsx";
import { submitSchoolEnquiry, subscribeToSchoolUpdates, adminSignIn, adminCall } from "./supabase.js";

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
  const tiles = [["/admissions", "apply", "Apply"], ["/academics", "book", "Academics"], ["/gallery", "image", "Gallery"], ["/contact", "mail", "Contact"]];
  const videos = SCHOOL.videos || [];
  const visibleVideos = showMoreVideos ? videos : videos.slice(0, 2);

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1 className="motto">
              BUILDING AN <em>EXCELLENT</em> FOUNDATION FOR A <em>BRIGHTER</em> FUTURE
            </h1>
            <p>Strong teaching, clear values and a caring community. Discover how we help every learner grow in knowledge and character.</p>
            <div className="btns">
              <Link to="/admissions" className="btn">How to apply</Link>
              <Link to="/about" className="btn ghost">About the school</Link>
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

      <section className="section">
        <div className="wrap split">
          <div>
            <span className="eyebrow">Hill Springs Academy · Maua</span>
            <h2>A school community in Igembe South, Meru County</h2>
            <p>Hill Springs Academy serves families in Maua and the wider Meru County. We offer Kindergarten, Pre-Primary and Junior School under Kenya’s Competency-Based Education, with a clear focus on learning, character and partnership with parents.</p>
            <p>For current places, fees and reporting dates, please contact the admissions office — these details can change from term to term.</p>
            <Link to="/contact" className="textlink">Contact the school</Link>
          </div>
          <div className="card">
            <h3>At a glance</h3>
            <ul className="checks">
              <li>Location: Maua, Igembe South, Meru County</li>
              <li>Curriculum: Kenya’s Competency-Based Education</li>
              <li>Levels: Kindergarten, Pre-Primary, Junior School</li>
              <li>Transport: available (confirm routes with admissions)</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap split">
          <div>
            <span className="eyebrow">Find us</span>
            <h2>Visit Hill Springs Academy</h2>
            <p>We are based in Maua, Igembe South, Meru County. Use the map for location guidance and contact us before travelling if you need directions or to arrange a visit.</p>
            <a className="textlink" href="https://www.google.com/maps/search/?api=1&query=Hill+Springs+Academy+Maua+Kenya" target="_blank" rel="noopener noreferrer">Open in Google Maps ↗</a>
          </div>
          <div className="map-card">
            <iframe
              title="Hill Springs Academy on Google Maps"
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
          <Photo src="/Gallery/school-bus.webp" alt="Hill Springs Academy school bus" />
        </div>
      </section>

      <section className="section learning-band">
        <div className="wrap learning-feature">
          <span className="eyebrow">Competency-Based Education</span>
          <h2>Learning that goes beyond remembering</h2>
          <p>Kenya’s CBE approach helps learners build knowledge, practical skills, values and positive attitudes. Through inquiry, projects and reflection, children connect classroom learning with everyday life.</p>
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
          <h2>Admissions are open</h2>
          <p>Write to the admissions office and we will guide you through every step.</p>
          <Link className="btn white" to="/admissions#enquiry">Start an admissions enquiry</Link>
        </div>
      </section>
    </>
  );
}
