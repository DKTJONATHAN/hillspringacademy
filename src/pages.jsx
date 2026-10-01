import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SCHOOL, GALLERY, HERO } from "./data.js";
import { Photo, PageHead, Icon } from "./components.jsx";

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
  const tiles = [["/admissions", "apply", "Apply"], ["/academics", "book", "Academics"], ["/gallery", "image", "Gallery"], ["/contact", "mail", "Contact"]];
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1>Big ideas begin <em>here.</em></h1>
            <p>Curious minds, caring guidance and room to discover what you can do. Explore our learning approach, school life and admissions.</p>
            <div className="btns">
              <Link to="/admissions" className="btn">How to apply</Link>
              <Link to="/about" className="btn ghost">About the school</Link>
            </div>
            <div className="tiles">
              {tiles.map(([to, ic, l]) => <Link key={to} to={to} className="tile-link"><Icon n={ic} /><span>{l}</span></Link>)}
            </div>
          </div>
          <Carousel />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <span className="eyebrow">A place to grow</span><h2 className="reveal">Every child has a spark. Let’s help it shine.</h2>
          <div className="cols">
            {SCHOOL.values.map((v, n) => (
              <div className="card reveal" style={{ "--d": n * 90 + "ms" }} key={v.title}><h3>{v.title}</h3><p>{v.text}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section learning-band">
        <div className="wrap learning-feature"><span className="eyebrow">Competency-Based Education</span><h2>Learning that goes beyond remembering</h2><p>Kenya’s CBE approach supports learners in building knowledge, practical skills, values and positive attitudes. Through inquiry, projects, collaboration and reflection, children connect classroom learning with everyday life.</p><div className="video-grid"><div className="video-slot"><span className="play">▶</span><b>Discover and explore</b><small>School-approved learning film slot</small></div><div className="video-slot"><span className="play">▶</span><b>Stories for young minds</b><small>School-approved children’s video slot</small></div></div></div>
      </section>
      <section className="section alt">
        <div className="wrap">
          <div className="row-head reveal"><h2>Moments of school life</h2><Link to="/gallery" className="textlink">See all photos</Link></div>
          <div className="gallery-grid">
            {GALLERY.slice(0, 6).map((g, n) => <div className="reveal" style={{ "--d": n * 70 + "ms" }} key={g.alt}><Photo {...g} /></div>)}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="wrap reveal">
          <h2>Admissions are open</h2>
          <p>Write to the admissions office and we will guide you through every step.</p>
          <a className="btn white" href={`mailto:${SCHOOL.admissionsEmail}`}>{SCHOOL.admissionsEmail}</a>
        </div>
      </section>
    </>
  );
}

export function About() {
  return (
    <>
      <PageHead title="About us" text={`${SCHOOL.name} serves families in Maua and the wider Meru County.`} />
      <section className="section">
        <div className="wrap split">
          <div className="reveal">
            <h2>Our school</h2>
            <p>{SCHOOL.intro}</p>
            {SCHOOL.motto && <p><strong>Motto:</strong> {SCHOOL.motto}</p>}
            <p>We combine good teaching with clear values so that every learner grows in knowledge and in character.</p>
          </div>
          <div className="reveal"><Photo src="" alt="School photo" /></div>
        </div>
      </section>
      <section className="section alt">
        <div className="wrap">
          <h2 className="reveal">What we stand for</h2>
          <div className="cols">
            {SCHOOL.values.map((v, n) => <div className="card reveal" style={{ "--d": n * 90 + "ms" }} key={v.title}><h3>{v.title}</h3><p>{v.text}</p></div>)}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <h2>News and notices</h2>
          {SCHOOL.news.map((n) => <div className="notice" key={n.title}><b>{n.title}</b>{n.date && <span> ({n.date})</span>}<p>{n.text}</p></div>)}
        </div>
      </section>
    </>
  );
}

export function Academics() {
  const [tab, setTab] = useState(0);
  const l = SCHOOL.levels[tab];
  return (
    <>
      <PageHead title="Academics" text="Each level builds on the last, with teachers who know their learners by name." />
      <section className="section">
        <div className="wrap">
          <h2>Learning at every stage</h2><p>Grade descriptions below are general CBE learning themes, not a claim about the school’s exact class placement or subject timetable.</p>
          <div className="tabs" role="tablist" aria-label="School levels">
            {SCHOOL.levels.map((x, n) => (
              <button key={x.title} role="tab" id={`t${n}`} aria-selected={n === tab} aria-controls="panel" className={n === tab ? "on" : ""} onClick={() => setTab(n)}>{x.title}</button>
            ))}
          </div>
          <div className="panel" id="panel" role="tabpanel" aria-labelledby={`t${tab}`} key={tab}>
            <h3>{l.title}</h3>
            <p>{l.text}</p>
            <ul className="tags">{SCHOOL.subjects.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="wrap reveal">
          <h2>Beyond the classroom</h2>
          <ul className="tags dark">{SCHOOL.activities.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      </section>
    </>
  );
}

export function Admissions() {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(0);
  const S = SCHOOL.steps;
  return (
    <>
      <PageHead title="Admissions" text="Applying is simple. Our admissions office will guide you through each step." />
      <section className="section">
        <div className="wrap">
          <h2>How to apply</h2>
          <div className="stepper">
            <div className="steplist" role="tablist" aria-label="Application steps">
              {S.map((s, n) => (
                <button key={s.title} role="tab" aria-selected={n === step} className={(n === step ? "on " : "") + (n < step ? "done" : "")} onClick={() => setStep(n)}>
                  <span className="num">{n + 1}</span>{s.title}
                </button>
              ))}
            </div>
            <div className="stepbody" key={step} role="tabpanel">
              <div className="bar-track"><i style={{ width: ((step + 1) / S.length) * 100 + "%" }} /></div>
              <h3>Step {step + 1}: {S[step].title}</h3>
              <p>{S[step].text}</p>
              <div className="btns">
                {step > 0 && <button className="btn ghost dark" onClick={() => setStep(step - 1)}>Back</button>}
                {step < S.length - 1
                  ? <button className="btn" onClick={() => setStep(step + 1)}>Next step</button>
                  : <a className="btn" href={`mailto:${SCHOOL.admissionsEmail}`}>Email admissions</a>}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="wrap split">
          <div className="reveal">
            <h2>Documents needed</h2>
            <ul className="checks">{SCHOOL.documents.map((d) => <li key={d}>{d}</li>)}</ul>
          </div>
          <div className="reveal">
            <h2>Questions</h2>
            {SCHOOL.faqs.map((f, i) => (
              <div className="faq" key={f.q}>
                <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>{f.q}<span aria-hidden="true">{open === i ? "−" : "+"}</span></button>
                <div className={"ans" + (open === i ? " open" : "")}><p>{f.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function Gallery() {
  const cats = ["All", ...new Set(GALLERY.map((g) => g.cat))];
  const [cat, setCat] = useState("All");
  const [v, setV] = useState(null);
  const items = GALLERY.filter((g) => cat === "All" || g.cat === cat);
  const step = (d) => setV((n) => (n + d + items.length) % items.length);
  useEffect(() => {
    if (v === null) return;
    const k = (e) => (e.key === "Escape" ? setV(null) : e.key === "ArrowRight" ? step(1) : e.key === "ArrowLeft" ? step(-1) : 0);
    addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [v, items.length]);
  const cur = v !== null ? items[v] : null;
  return (
    <>
      <PageHead title="Gallery" text="A look at life at Hill Spring Academy." />
      <section className="section">
        <div className="wrap">
          <div className="chips" role="group" aria-label="Filter photos">
            {cats.map((c) => <button key={c} className={c === cat ? "on" : ""} aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>)}
          </div>
          <div className="gallery-grid" key={cat}>
            {items.map((g, n) => (
              <button className="tile" key={g.alt} onClick={() => setV(n)} aria-label={`View ${g.alt}`}><Photo {...g} /></button>
            ))}
          </div>
        </div>
      </section>
      {cur && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={cur.alt} onClick={() => setV(null)}>
          <button className="close" onClick={() => setV(null)}>Close</button>
          <button className="lnav l" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous photo"><Icon n="left" /></button>
          <button className="lnav r" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next photo"><Icon n="right" /></button>
          <figure onClick={(e) => e.stopPropagation()}>
            {cur.src ? <img src={cur.src} alt={cur.alt} /> : <div className="photo big"><span>{cur.alt}</span></div>}
            <figcaption>{cur.alt} ({v + 1} of {items.length})</figcaption>
          </figure>
        </div>
      )}
    </>
  );
}

export function Contact() {
  const [toast, setToast] = useState(false);
  const send = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const to = f.get("topic") === "Admissions" ? SCHOOL.admissionsEmail : SCHOOL.infoEmail;
    const body = `${f.get("message")}\n\nFrom: ${f.get("name")} (${f.get("email")})`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(f.get("topic") + " enquiry")}&body=${encodeURIComponent(body)}`;
    setToast(true);
    setTimeout(() => setToast(false), 4000);
  };
  return (
    <>
      <PageHead title="Contact us" text="Send a message or write to us directly." />
      <section className="section">
        <div className="wrap split">
          <div className="info">
            <p><b>Admissions</b><a href={`mailto:${SCHOOL.admissionsEmail}`}>{SCHOOL.admissionsEmail}</a></p>
            <p><b>General enquiries</b><a href={`mailto:${SCHOOL.infoEmail}`}>{SCHOOL.infoEmail}</a></p>
            {SCHOOL.phone && <p><b>Phone</b>{SCHOOL.phone}</p>}
            <p><b>Location</b>{SCHOOL.address && <>{SCHOOL.address}<br /></>}{SCHOOL.town}</p>
            {SCHOOL.hours && <p><b>Office hours</b>{SCHOOL.hours}</p>}
            <a className="btn ghost dark" target="_blank" rel="noopener noreferrer" href="https://www.google.com/maps/search/?api=1&query=Hill+Spring+Academy+Maua">Open in Google Maps</a>
            <div className="map-frame"><iframe title="Map showing Hill Spring Academy in Maua" src="https://www.google.com/maps?q=Hill%20Spring%20Academy%2C%20Maua%2C%20Kenya&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
          </div>
          <form onSubmit={send}>
            <label>Your name<input name="name" required autoComplete="name" /></label>
            <label>Your email<input name="email" type="email" required autoComplete="email" /></label>
            <label>Topic<select name="topic"><option>Admissions</option><option>General</option></select></label>
            <label>Message<textarea name="message" required /></label>
            <button className="btn" type="submit">Send message</button>
          </form>
        </div>
      </section>
      {toast && <div className="toast" role="status">Your email app should open with the message ready to send.</div>}
    </>
  );
}


export function Directors() {
  return <><PageHead title="Our leadership" text="Meet the people guiding the school community. Portraits and verified biographies will be added by the school."/><section className="section"><div className="wrap director-grid">{["Director","Director","School leadership"].map((role,i)=><article className="director-card" key={role+i}><div className="portrait-placeholder">Photo to be added</div><span className="eyebrow">{role}</span><h2>Name to be added</h2><p>A short message and professional biography will appear here after approval by the school.</p></article>)}</div></section></>;
}
export function Privacy() {
 return <><PageHead title="Privacy & child protection" text="We respect the privacy, dignity and safety of every learner and family."/><section className="section"><div className="wrap prose"><h2>Information we collect</h2><p>When families contact the school, we may receive names, contact details and information they choose to share about a learner. The school should only collect information needed for education, admissions, communication and learner welfare.</p><h2>How information is used</h2><p>Information is used for school administration, learning support, safeguarding and responding to enquiries. Access should be limited to authorised staff and information should not be published without an appropriate lawful basis.</p><h2>Children’s images</h2><p>Photos, recordings and learner work should be shared only with appropriate parent or guardian consent and in line with the school’s safeguarding procedures. Do not submit sensitive learner information through this website.</p><h2>Your choices</h2><p>For privacy questions or requests, contact the school office using the contact details on this website. This page is a public-facing summary and should be reviewed against the school’s approved privacy policy.</p></div></section></>;
}
export function Blog() {
 const posts=[["CBE at home: learning beyond the classroom","Simple ways families can encourage curiosity, reading and practical problem-solving."],["Reading together builds confident learners","A short daily reading routine can help children grow vocabulary, imagination and confidence."],["Why play matters in early learning","Play gives young learners opportunities to explore, communicate, create and practise social skills."],["Helping children build healthy study habits","Consistent routines, encouragement and rest can make learning more manageable."]];
 return <><PageHead title="Ideas for growing minds" text="Notes for parents and educators on learning, wellbeing and childhood."/><section className="section"><div className="wrap blog-grid">{posts.map(([title,desc],i)=><article className="blog-card" key={title}><div className="blog-art" aria-hidden="true">{["✎","▤","✿","☆"][i]}</div><span className="eyebrow">Learning & family</span><h2>{title}</h2><p>{desc}</p><span className="coming">Article preview · Full post coming soon</span></article>)}</div></section></>;
}
export function Sitemap() {
 const links=[["Home","/"],["About the school","/about"],["Our directors","/directors"],["Academics & CBE","/academics"],["Admissions","/admissions"],["Gallery","/gallery"],["Learning blog","/blog"],["Privacy & child protection","/privacy"],["Contact","/contact"]];
 return <><PageHead title="Sitemap" text="Find your way around Hill Spring Academy."/><section className="section"><div className="wrap sitemap-list">{links.map(([label,to])=><Link key={to} to={to}>{label}<span>↗</span></Link>)}</div></section></>;
}
