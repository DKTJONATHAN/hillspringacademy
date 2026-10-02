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

      <section className="section learning-band">
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
            <div className="map-frame"><iframe title="Map showing Hill Springs Academy in Maua" src="https://www.google.com/maps?q=Hill%20Spring%20Academy%2C%20Maua%2C%20Kenya&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
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
