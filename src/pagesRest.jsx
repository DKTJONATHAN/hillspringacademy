import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SCHOOL, GALLERY } from "./data.js";
import { BLOG_POSTS } from "./blogData.js";
import { Photo, PageHead } from "./components.jsx";
import { submitSchoolEnquiry } from "./supabase.js";

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
          <div className="reveal"><Photo src="/Gallery/school-gate.webp" alt="Hill Springs Academy school gate" /></div>
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
          <h2>Learning at every stage</h2>
          <p>Hill Springs Academy has Kindergarten, Pre-Primary and Junior School.</p>
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
                {step < S.length - 1 ? <button className="btn" onClick={() => setStep(step + 1)}>Next step</button> : <Link className="btn" to="/apply">Start your application</Link>}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section alt" id="enquiry">
        <div className="wrap">
          <span className="eyebrow">Enrol a learner</span>
          <h2>Apply online in a few minutes</h2>
          <p className="lead">Create a free parent account, complete the admission form, and track your application. We will email you the decision.</p>
          <div className="btns"><Link className="btn" to="/apply">Apply online</Link><Link className="btn ghost dark" to="/enquire">Make an enquiry</Link></div>
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
  const [active, setActive] = useState(null);
  const items = GALLERY;
  return (
    <>
      <PageHead title="Gallery" text="Moments from school life at Hill Springs Academy." />
      <section className="section">
        <div className="wrap">
          <div className="gallery-grid">
            {items.map((g, n) => (
              <button key={g.alt + n} className="tile" onClick={() => setActive(n)} type="button">
                <Photo {...g} />
              </button>
            ))}
          </div>
          {items.length === 0 && <p>Photos will appear here as they are added.</p>}
        </div>
      </section>
      {active !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setActive(null)}>
          <button className="close" onClick={() => setActive(null)} type="button">Close</button>
          <figure onClick={e => e.stopPropagation()}>
            <img src={items[active].src} alt={items[active].alt} />
            <figcaption>{items[active].alt}</figcaption>
          </figure>
        </div>
      )}
    </>
  );
}

export function ReadingMaterials() {
  return (
    <>
      <PageHead title="Reading materials" text="Learning resources for learners and families." />
      <section className="section">
        <div className="wrap">
          <div className="cols">
            {SCHOOL.readingMaterials.map((m) => (
              <article className="card" key={m.title}>
                <h3>{m.title}</h3>
                <p><strong>{m.grade}</strong></p>
                <p>{m.description}</p>
                <a className="textlink" href={m.file}>Download</a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function SchoolLife() {
  return (
    <>
      <PageHead title="School life" text="Learning, play and community beyond the classroom." />
      <section className="section">
        <div className="wrap">
          <h2>Activities and clubs</h2>
          <ul className="tags dark">{SCHOOL.activities.map((s) => <li key={s}>{s}</li>)}</ul>
          <div className="cols" style={{ marginTop: 28 }}>
            {SCHOOL.values.map((v) => <article className="card" key={v.title}><h3>{v.title}</h3><p>{v.text}</p></article>)}
          </div>
        </div>
      </section>
    </>
  );
}

export function Fees() {
  return (
    <>
      <PageHead title="School fees" text="Request the current fee structure from the admissions office." />
      <section className="section">
        <div className="wrap">
          <h2>Fee information</h2>
          <p>Fee structures can change from term to term. Please contact the admissions office for the latest details, payment options and any available support.</p>
          <p><Link className="btn" to="/enquire">Ask about fees</Link></p>
        </div>
      </section>
    </>
  );
}

export function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <>
      <PageHead title="FAQ" text="Common questions from parents and guardians." />
      <section className="section">
        <div className="wrap">
          {SCHOOL.faqs.map((f, i) => (
            <div className="faq" key={f.q}>
              <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                {f.q}<span aria-hidden="true">{open === i ? "−" : "+"}</span>
              </button>
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
  const send = async (e) => {
    e.preventDefault();
    setError("");
    setSent(false);
    const form = e.currentTarget;
    const f = new FormData(form);
    try {
      await submitSchoolEnquiry({
        type: "contact",
        name: f.get("name"),
        email: f.get("email"),
        phone: f.get("phone"),
        subject: f.get("subject") || "General enquiry",
        message: f.get("message"),
        website: f.get("website"),
      });
      form.reset();
      setSent(true);
    } catch (err) {
      setError(err.message || "We could not send your message. Please try again.");
    }
  };
  return (
    <>
      <PageHead title="Contact" text="We are happy to hear from you." />
      <section className="section" id="contact-form">
        <div className="wrap split">
          <div>
            <h2>Get in touch</h2>
            <div className="info">
              {SCHOOL.phone && (
                <p>
                  <strong>Phone</strong>
                  <a href={`tel:${SCHOOL.phoneTel || SCHOOL.phone.replace(/\s/g, "")}`}>{SCHOOL.phone}</a>
                </p>
              )}
              {SCHOOL.poBox && (
                <p>
                  <strong>Postal address</strong>
                  <span>{SCHOOL.poBox}</span>
                </p>
              )}
              <p><strong>Location</strong><span>{SCHOOL.town}</span></p>
              <p><strong>Admissions</strong><a href={`mailto:${SCHOOL.admissionsEmail}`}>{SCHOOL.admissionsEmail}</a></p>
              <p><strong>General</strong><a href={`mailto:${SCHOOL.infoEmail}`}>{SCHOOL.infoEmail}</a></p>
              <p><strong>Apply</strong><Link to="/apply">Apply online</Link></p>
            </div>
          </div>
          <form className="enquiry-form" onSubmit={send}>
            <label>Name<input name="name" required autoComplete="name" /></label>
            <label>Email<input name="email" type="email" required autoComplete="email" /></label>
            <label>Phone<input name="phone" autoComplete="tel" /></label>
            <label>Subject<input name="subject" placeholder="How can we help?" /></label>
            <label>Message<textarea name="message" required /></label>
            <input name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" className="hp-field" />
            {error && <p className="form-error" role="alert">{error}</p>}
            {sent && <p className="form-success" role="status">Thank you. Your message has been sent.</p>}
            <button className="btn" type="submit">Send message</button>
          </form>
        </div>
      </section>
    </>
  );
}

export function Directors() {
  return (
    <>
      <PageHead title="Leadership" text="The people guiding Hill Springs Academy." />
      <section className="section">
        <div className="wrap">
          <p>Leadership profiles will be published here. For now, please contact the school office for any leadership-related enquiries.</p>
          <Link className="btn" to="/contact">Contact the school</Link>
        </div>
      </section>
    </>
  );
}

export function Privacy() {
  return (
    <>
      <PageHead title="Privacy" text="How we handle information shared through this website." />
      <section className="section">
        <div className="wrap prose">
          <h2>Privacy notice</h2>
          <p>Hill Springs Academy collects contact details and messages submitted through this website so that we can respond to enquiries and, where requested, send school updates.</p>
          <p>We do not sell personal information. Messages and subscriber details are stored securely and used only for school communication.</p>
          <p>To update or remove your details, email {SCHOOL.infoEmail}.</p>
        </div>
      </section>
    </>
  );
}

export function Blog() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((item) => item.slug === slug);
  if (slug) {
    if (!post) {
      return (
        <>
          <PageHead title="Article not found" text="This article could not be found." path="/blog" />
          <section className="section"><div className="wrap"><Link className="btn" to="/blog">Back to blog</Link></div></section>
        </>
      );
    }
    const canonicalPath = `/blog/${post.slug}`;
    return (
      <>
        <PageHead title={post.title} text={post.intro} description={`${post.intro.slice(0, 145)}…`} path={canonicalPath} image={`${SCHOOL.siteUrl}/social-preview.jpg`} />
        <article className="section">
          <div className="wrap prose blog-article">
            <Link className="textlink" to="/blog">← All articles</Link>
            <span className="eyebrow">{post.date} · Learning & family</span>
            <h1>{post.title}</h1>
            <p className="lead">{post.intro}</p>
            {post.sections.map(([heading, body]) => (
              <section key={heading}><h2>{heading}</h2><p>{body}</p></section>
            ))}
            <div className="card">
              <p><strong>For families:</strong> {post.closing}</p>
              <p className="article-byline">Written by <a href="https://zandani.co.ke" target="_blank" rel="noopener noreferrer">Jonathan Mwaniki</a>. This is general family-learning information, not a substitute for advice from your child’s teacher or current official curriculum materials.</p>
              <h3>Sources and further reading</h3>
              <ul>
                <li><a href="https://kicd.ac.ke/curriculum-reform/basic-education-curriculum-framework/" target="_blank" rel="noopener noreferrer">Kenya Institute of Curriculum Development: Basic Education Curriculum Framework</a></li>
                <li><a href="https://kicd.ac.ke/cbc-materials/" target="_blank" rel="noopener noreferrer">KICD: CBC curriculum and learning materials</a></li>
              </ul>
            </div>
            <p><Link className="textlink" to="/blog">Explore more learning articles</Link></p>
          </div>
        </article>
      </>
    );
  }
  return (
    <>
      <PageHead title="Ideas for Growing Minds" text="Practical learning, reading, play and family study guidance for parents and learners at Hill Springs Academy." path="/blog" image={`${SCHOOL.siteUrl}/social-preview.jpg`} />
      <section className="section">
        <div className="wrap">
          <span className="eyebrow">Hill Springs Academy · Learning blog</span>
          <h2>Ideas for growing minds</h2>
          <p className="lead">Practical articles for families who want to support learning beyond the classroom.</p>
          <div className="blog-grid">
            {BLOG_POSTS.map((item) => (
              <article className="blog-card" key={item.slug}>
                <Link className="blog-card-link" to={`/blog/${item.slug}`} aria-label={`Read ${item.title}`}>
                  <div className="blog-art" aria-hidden="true">✎</div>
                  <span className="eyebrow">{item.date}</span>
                  <h2>{item.title}</h2>
                  <p>{item.intro}</p>
                  <span className="textlink">Read full article →</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function Sitemap() {
  const links = [["/","Home"],["/about","About"],["/academics","Academics"],["/admissions","Admissions"],["/school-life","School life"],["/gallery","Gallery"],["/fees","Fees"],["/faq","FAQ"],["/reading-materials","Reading materials"],["/contact","Contact"],["/blog","Blog"],["/directors","Leadership"],["/privacy","Privacy"]];
  return (
    <>
      <PageHead title="Sitemap" text="Find your way around the Hill Springs Academy website." />
      <section className="section">
        <div className="wrap sitemap-list">
          {links.map(([to, label]) => <Link key={to} to={to}>{label}<span>↗</span></Link>)}
        </div>
      </section>
    </>
  );
}
