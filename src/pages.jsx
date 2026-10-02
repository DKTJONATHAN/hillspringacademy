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

export function Home() {
  const tiles = [["/admissions", "apply", "Apply"], ["/academics", "book", "Academics"], ["/gallery", "image", "Gallery"], ["/contact", "mail", "Contact"]];
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1>BUILDING AN EXCELLENT FOUNDATION FOR A BRIGHTER FUTURE</h1>
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

      <section className="section">
        <div className="wrap split">
          <div>
            <span className="eyebrow">Hill Springs Academy · Maua</span>
            <h2>A school community in Igembe South, Meru County</h2>
            <p>Hill Springs Academy is presented online as a school serving learners and families in Maua, Igembe South, Meru County, Kenya. This page brings together information parents commonly need when researching a school: learning approach, admissions, school life, learner resources and ways to contact the school.</p>
            <p>For current grade availability, fees, reporting dates and school-specific requirements, families should use the admissions office because these details can change.</p>
            <Link to="/contact" className="textlink">Contact the school</Link>
          </div>
          <div className="card">
            <h3>At a glance</h3>
            <ul className="checks">
              <li>Location: Maua, Igembe South, Meru County</li>
              <li>Curriculum context: Kenya's Competency-Based Education</li>
              <li>Admissions: contact the admissions office for current requirements</li>
              <li>Learning resources: downloadable materials section available on the site</li>
            </ul>
          </div>
        </div>
      </section>

<section className="section alt"><div className="wrap split"><div><span className="eyebrow">Find us</span><h2>Visit Hill Springs Academy</h2><p>Hill Springs Academy is in Maua, Igembe South, Meru County, Kenya. Use the map below for location guidance and contact the school before travelling if you need directions or visit arrangements.</p><a className="textlink" href="https://www.google.com/maps/search/?api=1&query=Hill+Springs+Academy+Maua+Kenya" target="_blank" rel="noopener noreferrer">Open in Google Maps ↗</a></div><div className="map-card"><iframe title="Hill Springs Academy on Google Maps" src="https://www.google.com/maps?q=Hill+Springs+Academy,+Maua,+Kenya&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{width:"100%",height:"360px",border:0}} allowFullScreen /></div></div></section>
      <section className="section alt"><div className="wrap split"><div><span className="eyebrow">Getting to school</span><h2>School transport services</h2><p>Hill Springs Academy offers school transport services for learners. Parents and guardians can contact the admissions office to confirm current route coverage, availability, transport arrangements and applicable charges before enrolling.</p><Link to="/contact" className="textlink">Enquire about school transport</Link></div><Photo src="/Gallery/school-bus.webp" alt="Hill Springs Academy school bus" /></div></section><section className="section learning-band">
        <div className="wrap learning-feature"><span className="eyebrow">Competency-Based Education</span><h2>Learning that goes beyond remembering</h2><p>Kenya’s CBE approach supports learners in building knowledge, practical skills, values and positive attitudes. Through inquiry, projects, collaboration and reflection, children connect classroom learning with everyday life.</p><div className="video-grid">
            <article className="video-card"><div className="video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${SCHOOL.videoIds[0]}?rel=0` } title="The water cycle for young learners" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div><div className="video-copy"><b>The water cycle</b><small>Explore how water moves through our world.</small></div></article>
            <article className="video-card"><div className="video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${SCHOOL.videoIds[1]}?rel=0` } title="Where does water come from? Learning for children" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div><div className="video-copy"><b>Where does water come from?</b><small>A simple science story for curious learners.</small></div></article>
          </div></div>
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
          <span className="eyebrow">School identity</span>
          <h2>What families can expect</h2>
          <div className="cols">
            <article className="card"><h3>Strong foundations</h3><p>Foundational literacy, numeracy, communication and positive learning habits support progress across the primary years.</p></article>
            <article className="card"><h3>Character and values</h3><p>Learning is connected with respect, honesty, responsibility, cooperation and care for the school community.</p></article>
            <article className="card"><h3>Partnership with families</h3><p>Parents and guardians are encouraged to communicate with the school about admissions, progress and learner support.</p></article>
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
          <h2>Learning at every stage</h2><p>Hill Springs Academy has Kindergarten, Pre-Primary and Junior School. The descriptions below are general learning themes and do not claim a particular class timetable or placement.</p>
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
      <section className="section">
        <div className="wrap">
          <span className="eyebrow">How learning works</span>
          <h2>A broader approach to CBE</h2>
          <div className="cols">
            {SCHOOL.learningApproach.map((x) => <article className="card" key={x.title}><h3>{x.title}</h3><p>{x.text}</p></article>)}
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
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const S = SCHOOL.steps;
  const sendEnquiry = async (e) => {
    e.preventDefault();
    setError("");
    setSent(false);
    const f = new FormData(e.currentTarget);
    try {
      await submitSchoolEnquiry({
        type: "admissions",
        name: f.get("name"),
        email: f.get("email"),
        phone: f.get("phone"),
        subject: "Student enrolment enquiry",
        studentName: f.get("studentName"),
        currentLevel: f.get("currentLevel"),
        requestedLevel: f.get("requestedLevel"),
        message: f.get("message"),
        website: f.get("website"),
      });
      e.currentTarget.reset();
      setSent(true);
    } catch (err) {
      setError(err.message || "We could not send your enquiry. Please try again.");
    }
  };
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
                {step < S.length - 1 ? <button className="btn" onClick={() => setStep(step + 1)}>Next step</button> : <a className="btn" href="#enquiry">Start enrolment enquiry</a>}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section alt" id="enquiry">
        <div className="wrap">
          <span className="eyebrow">Enrol a learner</span>
          <h2>Send an admissions enquiry</h2>
          <p className="lead">Your enquiry is stored securely for the admissions team. An administrator can reply to you by email.</p>
          <form className="enquiry-form" onSubmit={sendEnquiry}>
            <div className="form-grid">
              <label>Parent/guardian name<input name="name" required autoComplete="name" /></label>
              <label>Email<input name="email" type="email" required autoComplete="email" /></label>
              <label>Phone<input name="phone" autoComplete="tel" /></label>
              <label>Learner name<input name="studentName" required /></label>
              <label>Current level<input name="currentLevel" placeholder="e.g. Pre-Primary" /></label>
              <label>Level requested<input name="requestedLevel" placeholder="e.g. Junior School" /></label>
            </div>
            <label>Message<textarea name="message" required placeholder="Tell us what you would like to know about admission." /></label>
            <input name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" className="hp-field" />
            {error && <p className="form-error" role="alert">{error}</p>}
            {sent && <p className="form-success" role="status">Thank you. Your admissions enquiry has been sent to Hill Springs Academy.</p>}
            <button className="btn" type="submit">Send admissions enquiry</button>
          </form>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <span className="eyebrow">Before you apply</span>
          <h2>Prepare for admission</h2>
          <div className="cols">
            <article className="card"><h3>Confirm the grade</h3><p>Tell the admissions office the learner's current level and the grade being requested so the school can explain the applicable placement process.</p></article>
            <article className="card"><h3>Request current information</h3><p>Ask for the latest admission form, fee structure, reporting instructions and any school-specific requirements.</p></article>
            <article className="card"><h3>Plan a school visit</h3><p>A visit gives families an opportunity to ask questions about learning, school routines and the learner's transition.</p></article>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="wrap split">
          <div className="reveal"><h2>Documents needed</h2><ul className="checks">{SCHOOL.documents.map((d) => <li key={d}>{d}</li>)}</ul></div>
          <div className="reveal"><h2>Questions</h2>{SCHOOL.faqs.map((f, i) => <div className="faq" key={f.q}><button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>{f.q}<span aria-hidden="true">{open === i ? "−" : "+"}</span></button><div className={"ans" + (open === i ? " open" : "")}><p>{f.a}</p></div></div>)}</div>
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
      <PageHead title="Gallery" text="A look at life at Hill Springs Academy." />
      <section className="section">
        <div className="wrap">
          <span className="eyebrow">Photo stories</span>
          <h2>Life at Hill Springs Academy</h2>
          <p>Use this gallery to showcase authentic school activities, classroom moments, learner projects, sports and community events. Only approved school photographs should be uploaded, with appropriate consent for identifiable learners.</p>
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


export function ReadingMaterials() {
  const materials = SCHOOL.readingMaterials || [];
  return (
    <>
      <PageHead title="Kenyan CBC Reading Materials" text="Access authorised learning and revision resources for Hill Springs Academy learners, organised by grade and subject." />
      <section className="section">
        <div className="wrap">
          <div className="row-head">
            <div><span className="eyebrow">Learner resources</span><h2>Read and learn online</h2><p>Choose a material below to open the PDF in your browser. You can also download it for offline reading.</p></div>
          </div>
          <div className="card" style={{marginBottom:"24px"}}><p><strong>Copyright notice:</strong> Only materials the school owns, has permission to redistribute, or that are released under a licence allowing redistribution should be uploaded here. Each item should identify its copyright owner and licence.</p></div>
          <div className="materials-grid">
            {materials.map((m) => (
              <article className="material-card" key={m.file}>
                <div className="material-icon" aria-hidden="true">PDF</div>
                <span className="eyebrow">{m.grade}</span>
                <h3>{m.title}</h3>
                <p>{m.description}</p>
                <div className="btns">
                  <a className="btn small" href={m.file} target="_blank" rel="noopener noreferrer">Read online</a>
                  <a className="btn small ghost" href={m.file} download>Download PDF</a>
                </div>
              </article>
            ))}
          </div>
          {materials.length === 0 && <div className="card"><p>No reading materials have been added yet.</p></div>}
        </div>
      </section>
    </>
  );
}

export function SchoolLife() {
  return (
    <>
      <PageHead title="School Life" text="Explore learning, activities, character development and the wider school experience at Hill Springs Academy." />
      <section className="section">
        <div className="wrap">
          <span className="eyebrow">Beyond the classroom</span>
          <h2>A balanced school experience</h2>
          <p className="lead">A strong primary-school experience is more than lessons alone. Learners also need opportunities to communicate, create, collaborate, stay active and develop confidence and responsibility.</p>
          <div className="cols">
            {SCHOOL.activities.map((a) => <article className="card" key={a}><h3>{a}</h3><p>Activities at Hill Springs Academy can give learners opportunities to practise teamwork, communication, creativity, discipline and positive participation. The school can update this section with current clubs, teams, schedules and achievements.</p></article>)}
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="wrap">
          <span className="eyebrow">For families</span>
          <h2>Supporting learners together</h2>
          <div className="cols">
            {SCHOOL.parentInfo.map((x) => <article className="card" key={x.title}><h3>{x.title}</h3><p>{x.text}</p></article>)}
          </div>
        </div>
      </section>
    </>
  );
}

export function Fees() {
  return (
    <>
      <PageHead title="School Fees & Financial Information" text="Find out how to request the current Hill Springs Academy fee structure and understand the costs associated with joining the school." />
      <section className="section">
        <div className="wrap split">
          <div>
            <span className="eyebrow">Current information</span>
            <h2>Request the latest fee structure</h2>
            <p>Fee amounts, payment schedules and other charges can change from one school year or term to another. For that reason, this website does not publish an unverified figure.</p>
            <p>Parents and guardians should contact the admissions office for the current official fee structure, payment instructions, reporting requirements and any applicable charges.</p>
            <a className="btn" href={`mailto:${SCHOOL.admissionsEmail}?subject=Current%20fee%20structure%20request`}>Request fee structure</a>
          </div>
          <div className="card">
            <h3>When asking about fees</h3>
            <ul className="checks">
              <li>Ask for the current term and school-year fee schedule.</li>
              <li>Confirm what tuition or school charges are included.</li>
              <li>Ask about payment dates and accepted payment methods.</li>
              <li>Confirm requirements for a new or transferring learner.</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="wrap">
          <h2>Transparent information for parents</h2>
          <p>Parents should receive the same official fee information from the admissions office and the school website. If the school publishes a new approved fee document, it can be added to the website's downloadable resources without changing the rest of the site.</p>
        </div>
      </section>
    </>
  );
}

export function FAQ() {
  const [open, setOpen] = useState(0);
  const items = [
    ...SCHOOL.faqs,
    { q: "Where is Hill Springs Academy located?", a: "Hill Springs Academy is located in Maua, Igembe South, Meru County, Kenya." },
    { q: "Which curriculum does the website describe?", a: "The site describes learning in the context of Kenya's Competency-Based Education approach. Parents should confirm the school's current grade structure and subject timetable with the school." },
    { q: "How can I get the current school fees?", a: "Contact the admissions office at admissions@hillspringacademy.sc.ke for the latest official fee structure." },
    { q: "Can I visit the school before admission?", a: "Yes. Contact the admissions office in advance to arrange a visit and confirm the appropriate time." },
    { q: "Where can learners find reading materials?", a: "The Reading Materials section provides PDFs that the school is authorised to publish. Additional materials can be added as they are verified and approved for online distribution." }
  ];
  return (
    <>
      <PageHead title="Frequently Asked Questions" text="Answers to common questions from parents and guardians about Hill Springs Academy." />
      <section className="section">
        <div className="wrap prose">
          <h2>Parents' questions</h2>
          <p>Use the answers below as a starting point. For learner-specific, fee, placement or admissions decisions, contact the school directly.</p>
          {items.map((f, i) => (
            <div className="faq" key={f.q}>
              <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>{f.q}<span aria-hidden="true">{open === i ? "−" : "+"}</span></button>
              <div className={"ans" + (open === i ? " open" : "")}><p>{f.a}</p></div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const send = async (e) => {
    e.preventDefault();
    setError("");
    setSent(false);
    const f = new FormData(e.currentTarget);
    try {
      await submitSchoolEnquiry({
        type: f.get("topic") === "Admissions" ? "admissions" : "general",
        name: f.get("name"),
        email: f.get("email"),
        phone: f.get("phone"),
        subject: f.get("subject"),
        message: f.get("message"),
        website: f.get("website"),
      });
      e.currentTarget.reset();
      setSent(true);
    } catch (err) {
      setError(err.message || "We could not send your message. Please try again.");
    }
  };
  const subscribe = async (e) => {
    e.preventDefault();
    setError("");
    setSubscribed(false);
    const f = new FormData(e.currentTarget);
    try {
      await subscribeToSchoolUpdates({ name: f.get("name"), email: f.get("email"), website: f.get("website") });
      e.currentTarget.reset();
      setSubscribed(true);
    } catch (err) {
      setError(err.message || "We could not subscribe you. Please try again.");
    }
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
            <div className="map-frame"><iframe title="Map showing Hill Springs Academy in Maua" src="https://www.google.com/maps?q=Hill%20Spring%20Academy%2C%20Maua%2C%20Kenya&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
          </div>
          <form onSubmit={send} className="enquiry-form">
            <label>Your name<input name="name" required autoComplete="name" /></label>
            <label>Your email<input name="email" type="email" required autoComplete="email" /></label>
            <label>Phone<input name="phone" autoComplete="tel" /></label>
            <label>Topic<select name="topic"><option>General</option><option>Admissions</option></select></label>
            <label>Subject<input name="subject" required /></label>
            <label>Message<textarea name="message" required /></label>
            <input name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" className="hp-field" />
            {error && <p className="form-error" role="alert">{error}</p>}
            {sent && <p className="form-success" role="status">Your message has been sent to Hill Springs Academy.</p>}
            <button className="btn" type="submit">Send message</button>
          </form>
        </div>
      </section>
      <section className="section alt">
        <div className="wrap split">
          <div><span className="eyebrow">Stay informed</span><h2>Subscribe to school updates</h2><p>Receive selected school notices, admissions updates, learning information and news by email.</p></div>
          <form onSubmit={subscribe} className="card enquiry-form">
            <label>Your name<input name="name" autoComplete="name" /></label>
            <label>Your email<input name="email" type="email" required autoComplete="email" /></label>
            <input name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" className="hp-field" />
            {subscribed && <p className="form-success" role="status">You are subscribed to Hill Springs Academy updates.</p>}
            <button className="btn" type="submit">Subscribe</button>
          </form>
        </div>
      </section>
      {error && !sent && !subscribed && <div className="toast" role="status">{error}</div>}
    </>
  );
}

export function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem("hsa_admin_token") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState("");
  const [tab, setTab] = useState("messages");
  const [subscribers, setSubscribers] = useState([]);

  const load = async (t = token) => {
    const data = await adminCall(t, { action: "list_conversations" });
    setConversations(data.conversations || []);
  };
  useEffect(() => {
    if (token) load().catch(() => { localStorage.removeItem("hsa_admin_token"); setToken(""); });
  }, []);
  const login = async (e) => {
    e.preventDefault(); setLoginError("");
    try {
      const data = await adminSignIn(email, password);
      localStorage.setItem("hsa_admin_token", data.access_token);
      setToken(data.access_token);
      setPassword("");
      await load(data.access_token);
    } catch (err) { setLoginError(err.message || "Unable to sign in."); }
  };
  const openConversation = async (id) => {
    const data = await adminCall(token, { action: "get_conversation", id });
    setSelected(data.conversation); setMessages(data.messages || []); setReply(""); setStatus("");
  };
  const sendReply = async () => {
    if (!selected || reply.trim().length < 2) return;
    setStatus("Sending through Resend…");
    try {
      await adminCall(token, { action: "reply", id: selected.id, reply });
      setReply(""); setStatus("Reply sent successfully.");
      await openConversation(selected.id); await load();
    } catch (err) { setStatus(err.message || "Reply failed."); }
  };
  const closeConversation = async () => {
    if (!selected) return;
    await adminCall(token, { action: "close", id: selected.id });
    await openConversation(selected.id); await load();
  };
  const loadSubscribers = async () => {
    try { const data = await adminCall(token, { action: "subscribers" }); setSubscribers(data.subscribers || []); } catch (err) { setStatus(err.message || "Unable to load subscribers."); }
  };
  const logout = () => { localStorage.removeItem("hsa_admin_token"); setToken(""); setSelected(null); };

  if (!token) return (
    <>
      <PageHead title="Admin Email Centre" text="Secure Hill Springs Academy communications." />
      <section className="section"><div className="wrap admin-login">
        <form className="card enquiry-form" onSubmit={login}>
          <span className="eyebrow">Staff only</span><h2>Sign in</h2>
          <p>Use the Supabase administrator account created for the school.</p>
          <label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required autoComplete="username" /></label>
          <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password" /></label>
          {loginError && <p className="form-error" role="alert">{loginError}</p>}
          <button className="btn" type="submit">Sign in</button>
        </form>
      </div></section>
    </>
  );

  return (
    <>
      <PageHead title="Admin Email Centre" text="Manage parent enquiries and newsletter subscribers." />
      <section className="section">
        <div className="wrap">
          <div className="admin-toolbar">
            <div><button className={tab==="messages"?"btn small":"btn small ghost dark"} onClick={()=>setTab("messages")}>Messages</button><button className={tab==="subscribers"?"btn small":"btn small ghost dark"} onClick={()=>{setTab("subscribers");loadSubscribers();}}>Subscribers</button></div>
            <button className="btn small ghost dark" onClick={logout}>Sign out</button>
          </div>
          {tab==="messages" ? (
            <div className="admin-grid">
              <div className="card admin-list">
                <h3>Enquiries</h3>
                {conversations.length===0 && <p>No enquiries yet.</p>}
                {conversations.map(c=><button key={c.id} className={"admin-item"+(selected?.id===c.id?" selected":"")} onClick={()=>openConversation(c.id)}><strong>{c.subject}</strong><span>{c.requester_name} · {c.status}</span><small>{new Date(c.last_message_at).toLocaleString()}</small></button>)}
              </div>
              <div className="card admin-thread">
                {!selected ? <div><h3>Select an enquiry</h3><p>Choose a message to view the conversation and reply by email.</p></div> : <>
                  <div className="thread-head"><div><span className="eyebrow">{selected.type}</span><h3>{selected.subject}</h3><p>{selected.requester_name} · {selected.requester_email}{selected.requester_phone ? ` · ${selected.requester_phone}` : ""}</p></div><button className="btn small ghost dark" onClick={closeConversation}>Close</button></div>
                  <div className="thread">
                    {messages.map(m=><div className={"thread-message "+m.sender_type} key={m.id}><small>{m.sender_type==="visitor"?m.sender_name:"Hill Springs Academy"} · {new Date(m.created_at).toLocaleString()}</small><p>{m.body_text}</p>{m.delivery_status && <span>{m.delivery_status}</span>}</div>)}
                  </div>
                  {selected.status!=="closed" && <div className="reply-box"><textarea value={reply} onChange={e=>setReply(e.target.value)} placeholder="Write your reply to the parent or student…" /><button className="btn" onClick={sendReply}>Send reply by email</button></div>}
                  {status && <p className="form-success" role="status">{status}</p>}
                </>}
              </div>
            </div>
          ) : (
            <div className="card"><h3>Newsletter subscribers</h3><p>{subscribers.length} subscriber(s) loaded.</p><div className="subscriber-list">{subscribers.map(s=><div className="subscriber-row" key={s.id}><strong>{s.name || "No name"}</strong><span>{s.email}</span><small>{s.active?"Active":"Unsubscribed"}</small></div>)}</div></div>
          )}
        </div>
      </section>
    </>
  );
}

export function Directors() {
  return <><PageHead title="Our leadership" text="Meet the people guiding the school community. Portraits and verified biographies will be added by the school."/><section className="section"><div className="wrap director-grid">{["Director","Director","School leadership"].map((role,i)=><article className="director-card" key={role+i}><div className="portrait-placeholder">Photo to be added</div><span className="eyebrow">{role}</span><h2>Name to be added</h2><p>A short message and professional biography will appear here after approval by the school.</p></article>)}</div></section></>;
}
export function Privacy() {
 return <><PageHead title="Privacy & child protection" text="We respect the privacy, dignity and safety of every learner and family."/><section className="section"><div className="wrap prose"><h2>Information we collect</h2><p>When families contact the school, we may receive names, contact details and information they choose to share about a learner. The school should only collect information needed for education, admissions, communication and learner welfare.</p><h2>How information is used</h2><p>Information is used for school administration, learning support, safeguarding and responding to enquiries. Access should be limited to authorised staff and information should not be published without an appropriate lawful basis.</p><h2>Children’s images</h2><p>Photos, recordings and learner work should be shared only with appropriate parent or guardian consent and in line with the school’s safeguarding procedures. Do not submit sensitive learner information through this website.</p><h2>Your choices</h2><p>For privacy questions or requests, contact the school office using the contact details on this website. This page is a public-facing summary and should be reviewed against the school’s approved privacy policy.</p></div></section></>;
}
const BLOG_POSTS = [
  {
    slug: "cbe-at-home-learning-beyond-the-classroom",
    title: "How Parents Can Support Competency-Based Education (CBE) at Home in Kenya",
    date: "October 2, 2026",
    intro: "Practical ways parents and guardians can reinforce Kenya’s Competency-Based Education at home through conversation, reading, household activities, reflection and positive routines. A guide for families in Maua, Igembe South, Meru County and across Kenya.",
    sections: [
      ["What CBE means for learning at home", "Competency-Based Education is concerned not only with what a learner remembers, but also with how they use knowledge, skills, values and attitudes in meaningful situations. Families do not need expensive learning equipment to support this. Everyday experiences—asking questions, explaining choices, measuring ingredients, caring for plants and reading together—can help children practise communication, critical thinking, creativity and collaboration. Parents should follow the learner’s current school guidance and avoid turning home into a second classroom filled with pressure."],
      ["Use ordinary household activities as learning opportunities", "A trip to the market can involve estimating quantities, comparing prices, checking change and discussing needs versus wants. Cooking can practise measurement, sequencing, hygiene and reading instructions. Gardening can prompt observation of soil, water, sunlight and plant growth. Invite the child to predict what may happen, explain the steps and reflect on what worked. Keep activities safe and age-appropriate; the learning comes from participation and conversation, not from making every task feel like an examination."],
      ["Build language and literacy through conversation", "Talk with children in the languages your family uses comfortably, and encourage them to explain their thinking. Ask open questions such as “What did you notice?”, “How could we find out?” and “What might you try next?” Storytelling, describing a journey, retelling a lesson and discussing a news item suitable for the child’s age all strengthen vocabulary and expression. Give learners time to answer instead of completing their sentences for them."],
      ["Make reading a predictable family habit", "Choose a regular reading time that fits family life. Younger children can look at picture books, identify objects, predict what happens next and listen to an adult read aloud. More confident readers can take turns reading paragraphs and summarising the main idea. Ask what a new word means in context, then invite the learner to use it in another sentence. Consistency and positive attention are more useful than demanding a long session every day."],
      ["Encourage problem-solving without immediately giving answers", "When a child faces a puzzle, homework challenge or practical problem, resist the urge to solve it immediately. Ask what they already know, which part is confusing and what they could try first. If the first approach fails, discuss another possibility. This teaches persistence and helps children see mistakes as information. Offer help when needed, but let the learner do the thinking and explain the final solution in their own words."],
      ["Create a calm study space and realistic routine", "A dedicated desk is not essential; a reasonably quiet, well-lit place with basic materials can be enough. Agree on a manageable time for reading or assigned work, allow movement breaks and protect sleep and play. Keep expectations suitable for the child’s age and family circumstances. If a learner repeatedly struggles, communicate with their teacher rather than assuming that more hours of study will solve the problem."],
      ["Connect school and family through communication", "Ask your child what they are learning, what they enjoyed and where they need support. Share relevant concerns with the school and ask for guidance on current classroom activities, assessment expectations and ways to practise at home. For families exploring a school in Maua or Igembe South, admissions teams can explain the school’s current learning arrangements and parent communication channels."],
      ["A simple weekly CBE-at-home plan", "Choose one short reading activity, one practical task such as measuring or sorting, one conversation about the learner’s week and one opportunity for creative play or movement. Let the child help choose activities. At the end of the week, ask what felt easy, what was challenging and what they would like to try next. This reflective habit supports independence without turning family time into constant testing."]
    ],
    closing: "The Kenya Institute of Curriculum Development provides the official curriculum framework and curriculum designs. Families should use current school and KICD materials for formal learning expectations; the ideas in this article are practical home-support suggestions, not a substitute for a teacher’s guidance."
  },
  {
    slug: "reading-together-builds-confident-learners",
    title: "How to Improve a Child’s Reading Skills: A Practical Guide for Kenyan Parents",
    date: "October 2, 2026",
    intro: "A detailed, encouraging guide to reading practice, comprehension, vocabulary and reading confidence for parents of primary-school learners in Kenya, including simple routines that can work in busy households.",
    sections: [
      ["Why reading at home matters", "Reading supports learning across subjects because children use language to understand instructions, explain ideas and make sense of information. A child may decode words accurately yet still need help explaining what a passage means. Home reading can build fluency, vocabulary, comprehension and confidence when it is calm, regular and matched to the learner’s current ability. The aim is progress, not comparison with siblings or classmates."],
      ["Choose the right reading material", "Start with text the learner can read with reasonable success, then gradually introduce new vocabulary and longer passages. Stories, graded readers, poems, school-approved texts, labels, simple instructions and age-appropriate informational passages can all be useful. Allow children to choose from suitable options. If a book is so difficult that every line becomes a struggle, read it together or select an easier text and return to it later."],
      ["Use a short daily reading routine", "Set aside a predictable period—perhaps after a meal or before bedtime—depending on the household schedule. A useful session may include a few minutes of independent reading, a short read-aloud and a conversation about meaning. Younger learners benefit from hearing fluent reading and joining in with repeated phrases. Older learners can read silently, then summarise the main idea and identify one question they still have."],
      ["Teach comprehension with before, during and after questions", "Before reading, look at the title and ask what the text might be about. During reading, pause to clarify a confusing sentence or predict what may happen next. Afterwards, invite the child to retell the passage in their own words, describe a character’s decision, identify the main point or connect the text to an experience. Avoid turning every page into a quiz; conversation should help the learner make meaning."],
      ["Grow vocabulary without rote overload", "When an unfamiliar word appears, first use the surrounding sentence or picture to guess its meaning. Explain the word simply, say it aloud and make a new sentence together. Revisit useful words in later conversations. A small number of words understood deeply and used correctly is more valuable than copying a long list without comprehension. Encourage reading in the languages used at home and school as appropriate."],
      ["Support a child who avoids reading", "Avoid public correction, ridicule or comparisons. Find out whether the text is too hard, the child is tired, the topic is uninteresting or reading feels associated only with mistakes. Take turns reading, use a story connected to the child’s interests and praise effort such as trying a difficult word or rereading a sentence. If difficulties persist, speak privately with the teacher to understand what support may be appropriate."],
      ["Make reading accessible in a Kenyan home", "A family does not need a large library to build a reading culture. Re-read school materials, borrow books where available, tell oral stories, read signs and instructions together, and let older siblings model reading kindly. Protect books from damage and create a small, consistent place to keep them. Where internet access is available, use reputable, age-appropriate digital materials and balance screen reading with rest and offline activity."],
      ["A parent’s weekly reading check-in", "Once a week, ask the learner what they enjoyed reading, one new word they remember and one part they found difficult. Notice progress in willingness, expression and understanding—not only speed. Share observations with the teacher when you need advice. Reading confidence grows through practice, encouragement and access to material that gives the child a genuine reason to keep turning pages."]
    ],
    closing: "A 2014 Kenyatta University study focused on parental involvement in Standard Three reading in Igembe South, highlighting the relevance of family engagement in this local context. Its findings are historical and specific to that study; they should not be treated as a current national statistic. See the linked university repository record for the research details."
  },
  {
    slug: "why-play-matters-in-early-learning",
    title: "The Importance of Play in Early Childhood Education: Learning Through Play in Kenya",
    date: "October 2, 2026",
    intro: "Play-based learning helps young children explore language, early mathematics, movement, relationships and problem-solving. This guide explains how parents can support purposeful, safe play at home and understand its place in early childhood learning.",
    sections: [
      ["Play is a way young children investigate the world", "For young children, play is not merely a reward after learning. It can be a context for trying ideas, asking questions, testing possibilities and communicating with others. Building a tower, pretending to run a shop or sorting bottle tops can involve planning, counting, language and persistence. Adults support learning by providing safe materials, noticing what the child is doing and asking a thoughtful question without controlling every move."],
      ["Language grows through pretend play and storytelling", "Pretend kitchens, shops, clinics, journeys and family scenes invite children to name objects, negotiate roles, explain actions and create stories. A parent can introduce new words naturally—such as full, empty, heavy, light, before and after—then allow the child to use them. Storytelling with familiar people, animals and places can build listening and expression. Children should also have room to invent their own storylines."],
      ["Early mathematics can be playful", "Sorting objects by colour, size or shape helps children notice similarities and differences. Counting steps, sharing fruit equally, matching pairs, arranging objects from shortest to longest and comparing containers can introduce number, quantity, pattern and measurement. Use clean, safe, age-appropriate objects and supervise young children closely, especially around small items that could be swallowed. Focus on reasoning and exploration rather than speed."],
      ["Movement and outdoor play support whole-child development", "Running, balancing, dancing, hopping, throwing and climbing in a safe environment give children opportunities to practise coordination, body awareness and confidence. Outdoor observation can lead to questions about weather, plants, insects and the environment. Adults should choose activities suitable for the child’s age, supervise hazards and provide water, shade and rest as needed. Children with different abilities may participate in different ways; adapt the activity rather than excluding them."],
      ["Play teaches cooperation and emotional skills", "Simple games help children practise taking turns, following shared rules, waiting, listening and handling disappointment. When disagreements occur, adults can name the feeling, restate the problem and help children think of fair solutions. Do not expect young children to manage every conflict independently. Calm guidance models respectful communication and helps learners develop skills they can use in class and with peers."],
      ["Low-cost play ideas for Kenyan families", "Use locally available, clean and safe materials: cardboard for a pretend shop, paper for drawing and folding, a ball for movement games, cups for supervised pouring, or seeds and leaves for observation. Oral games, songs, clapping patterns and storytelling require little or no equipment. Avoid sharp, toxic or choking-risk materials. The quality of interaction matters more than the price of a toy."],
      ["How adults can extend learning without taking over", "Observe first. If a child is building, ask what they are making or what might make the structure steadier. If they are sorting, ask how they decided which objects belong together. Give time for trial and error. Too many instructions can turn play into a task where the adult does all the thinking. A useful balance is to provide a safe invitation, join when welcomed and allow the child to lead."],
      ["When play and school readiness meet", "Through play, children can practise attention, communication, early literacy, number sense, independence and social participation. These abilities contribute to readiness for structured learning, but play should not be reduced to drilling children ahead of their age. Families considering early childhood education can ask schools how they balance guided activities, exploration, rest, movement and care in the learner’s daily experience."]
    ],
    closing: "The Kenya Institute of Curriculum Development’s curriculum resources provide official guidance for Kenyan learning areas and stages. This article offers general family ideas; follow the school’s current advice and adapt play to each child’s age, interests and safety needs."
  },
  {
    slug: "helping-children-build-healthy-study-habits",
    title: "How to Build Good Study Habits for Primary School Children: A Parent’s Guide",
    date: "October 2, 2026",
    intro: "Learn how to create a realistic homework routine, support revision, reduce distractions and help primary-school learners become independent without excessive pressure.",
    sections: [
      ["Start with a routine the child can actually keep", "A study habit becomes sustainable when it fits the learner’s age, energy and family schedule. Choose a regular window for homework, reading or revision, but avoid assuming that every child can concentrate for long periods after a full school day. A short, focused session with a clear task is often more practical than an unrealistic timetable. Review the routine after a week and adjust it together."],
      ["Prepare a simple study space", "A child does not need an expensive desk or a perfectly silent room. A stable, reasonably lit place with the required books, pencils and water can reduce interruptions. Keep unrelated toys, television and phone notifications away during focused work where possible. If space is shared, agree on a temporary study corner and a time when the learner can work with fewer distractions."],
      ["Break homework and revision into manageable steps", "Help the learner identify what must be done, estimate the order and begin with one task. For a longer assignment, divide it into small parts with short pauses. Encourage the child to mark completed work and prepare materials for the next day. Adults can help plan, but should avoid doing the work for the learner. The aim is to build organisation and confidence gradually."],
      ["Use active recall instead of only rereading", "After reading a section, close the book and ask the learner to explain the main idea, solve a similar example or write a few points from memory. Then reopen the material to check and correct misunderstandings. Flashcards, oral questions, diagrams and teaching a concept to a family member can make revision more active. Keep questions supportive and suitable for the topic and grade."],
      ["Support literacy and mathematics in everyday life", "Reading instructions, writing a shopping list, estimating quantities, checking change, telling time and discussing measurements can reinforce classroom learning. These activities are not replacements for assigned work, but they help children see how knowledge is used. Invite the learner to explain their method rather than focusing only on whether the final answer is correct."],
      ["Respond constructively when a child struggles", "Repeated difficulty may mean the child needs a different explanation, more practice, rest or a conversation with the teacher. Avoid labels such as lazy or clever; describe the specific effort or challenge instead. Ask what part feels confusing and work through one example together. If a learner consistently cannot complete work independently, communicate with the school to understand expectations and possible support."],
      ["Balance study with sleep, play and wellbeing", "Children need rest, movement, relationships and unstructured time as well as academic practice. A schedule that removes play or sleep to add more revision may be counterproductive for wellbeing. Keep routines age-appropriate, include breaks and notice signs of fatigue or distress. Encourage questions and mistakes as normal parts of learning, not reasons for shame."],
      ["Build independence one responsibility at a time", "Begin with one manageable responsibility, such as packing a reading book, checking a homework diary or choosing which task to start. Once the child can do it reliably, add another. Praise planning, persistence and asking for help appropriately. A good study routine is not simply a parent supervising every minute; it is a gradual transfer of responsibility to the learner."]
    ],
    closing: "For school-specific homework expectations, assessment guidance and learner support, communicate directly with the teacher or admissions office. Families in Maua and Igembe South can use the school’s official contact channels for current information."
  }
];

export function Blog() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((item) => item.slug === slug);
  if (slug) {
    if (!post) return <><PageHead title="Article not found" text="This article could not be found." path="/blog"/><section className="section"><div className="wrap"><Link className="btn" to="/blog">Back to blog</Link></div></section></>;
    const canonicalPath = `/blog/${post.slug}`;
    return <><PageHead title={post.title} text={post.intro} description={`${post.intro.slice(0, 145)}…`} path={canonicalPath} image={`${SCHOOL.siteUrl}/social-preview.jpg`} /><article className="section"><div className="wrap prose blog-article"><Link className="textlink" to="/blog">← All articles</Link><span className="eyebrow">{post.date} · Learning & family</span><h1>{post.title}</h1><p className="lead">{post.intro}</p>{post.sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}<div className="card"><p><strong>For families:</strong> {post.closing}</p><p className="article-byline">Written by <a href="https://zandani.co.ke" target="_blank" rel="noopener noreferrer">Jonathan Mwaniki</a>. This is general family-learning information, not a substitute for advice from your child’s teacher or current official curriculum materials.</p><h3>Sources and further reading</h3><ul><li><a href="https://kicd.ac.ke/curriculum-reform/basic-education-curriculum-framework/" target="_blank" rel="noopener noreferrer">Kenya Institute of Curriculum Development: Basic Education Curriculum Framework</a></li><li><a href="https://kicd.ac.ke/cbc-materials/" target="_blank" rel="noopener noreferrer">KICD: CBC curriculum and learning materials</a></li></ul></div><p><Link className="textlink" to="/blog">Explore more learning articles</Link></p></div></article></>;
  }
  return <><PageHead title="Ideas for Growing Minds" text="Practical learning, reading, play and family study guidance for parents and learners at Hill Springs Academy." path="/blog" image={`${SCHOOL.siteUrl}/social-preview.jpg`} /><section className="section"><div className="wrap"><span className="eyebrow">Hill Springs Academy · Learning blog</span><h2>Ideas for growing minds</h2><p className="lead">Practical articles for families who want to support learning beyond the classroom.</p><div className="blog-grid">{BLOG_POSTS.map((item) => <article className="blog-card" key={item.slug}><Link className="blog-card-link" to={`/blog/${item.slug}`} aria-label={`Read ${item.title}`}><div className="blog-art" aria-hidden="true">✎</div><span className="eyebrow">{item.date}</span><h2>{item.title}</h2><p>{item.intro}</p><span className="textlink">Read full article →</span></Link></article>)}</div></div></section></>;
}
export function Sitemap() {
  const links=[
    ["Home","/"],
    ["About the school","/about"],
    ["Academics & CBE","/academics"],
    ["Admissions","/admissions"],
    ["School fees & financial information","/fees"],
    ["School life","/school-life"],
    ["Reading materials","/reading-materials"],
    ["Gallery","/gallery"],
    ["Frequently asked questions","/faq"],
    ["Leadership","/directors"],
    ["Learning blog","/blog"],
    ["Contact","/contact"],
    ["Privacy & child protection","/privacy"]
  ];
  return <><PageHead title="Sitemap" text="Find the main public sections of Hill Springs Academy."/><section className="section"><div className="wrap sitemap-list">{links.map(([label,to])=><Link key={to} to={to}>{label}<span>↗</span></Link>)}</div></section></>;
}
