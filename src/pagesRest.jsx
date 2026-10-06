import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FEES_META, FEE_BANDS, FEE_CLASSES, downloadFeePdf } from "./feesData.js";
import { SCHOOL, GALLERY } from "./data.js";
import { BLOG_POSTS } from "./blogData.js";
import { PageHead, Photo } from "./components.jsx";
import { submitSchoolEnquiry } from "./supabase.js";

export function About() {
  return (
    <>
      <PageHead
        title="About Hill Springs Academy"
        text="A private CBE school in Maua, Igembe South, Meru County — Kindergarten, Pre-Primary and Junior School."
        path="/about"
      />

      <section className="section">
        <div className="wrap split">
          <div>
            <span className="eyebrow">Who we are</span>
            <h2>{SCHOOL.name}</h2>
            <p className="lede">{SCHOOL.motto}</p>
            <p>{SCHOOL.intro}</p>
            <p>
              We serve families in Maua, Igembe South and across Meru County. Our focus is strong teaching,
              clear values and a caring community so every child can build knowledge, skills and character
              under Kenya’s Competency-Based Education (CBE).
            </p>
            <div className="btns" style={{ marginTop: 20 }}>
              <Link className="btn" to="/admissions">Admissions</Link>
              <Link className="btn ghost" to="/contact">Contact us</Link>
            </div>
          </div>
          <div className="card">
            <h3>At a glance</h3>
            <ul className="checks">
              <li><strong>School:</strong> {SCHOOL.name}</li>
              <li><strong>Location:</strong> {SCHOOL.town}</li>
              <li><strong>Curriculum:</strong> Kenya’s Competency-Based Education (CBE)</li>
              <li><strong>Levels:</strong> Kindergarten, Pre-Primary, Junior School</li>
              {SCHOOL.centreCode && <li><strong>Centre code:</strong> {SCHOOL.centreCode}</li>}
              {SCHOOL.poBox && <li><strong>Postal:</strong> {SCHOOL.poBox}</li>}
              {SCHOOL.phone && (
                <li>
                  <strong>Phone:</strong>{" "}
                  <a href={`tel:${SCHOOL.phoneTel || SCHOOL.phone}`}>{SCHOOL.phone}</a>
                </li>
              )}
              <li>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${SCHOOL.infoEmail}`}>{SCHOOL.infoEmail}</a>
              </li>
              <li>
                <strong>Admissions:</strong>{" "}
                <a href={`mailto:${SCHOOL.admissionsEmail}`}>{SCHOOL.admissionsEmail}</a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <span className="eyebrow">What guides us</span>
          <h2>Our values</h2>
          <p className="lede">
            These principles shape daily life at Hill Springs Academy — in the classroom, on the field and with families.
          </p>
          <div className="cols">
            {(SCHOOL.values || []).map((v, n) => (
              <article className="card reveal" key={v.title} style={{ "--d": `${n * 80}ms` }}>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <span className="eyebrow">Learning stages</span>
          <h2>From early years to Junior School</h2>
          <p className="lede">
            We offer a continuous pathway from the first years of school through Junior School, so learners grow
            with familiar teachers, clear expectations and age-appropriate support.
          </p>
          <div className="cols">
            {(SCHOOL.stages || SCHOOL.levels || []).map((s, n) => (
              <article className="card reveal" key={s.title} style={{ "--d": `${n * 80}ms` }}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
          {(SCHOOL.applyLevels || []).length > 0 && (
            <div style={{ marginTop: 28 }}>
              <h3>Classes we admit</h3>
              <ul className="tags dark">
                {SCHOOL.applyLevels.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <span className="eyebrow">Competency-Based Education</span>
          <h2>How we teach</h2>
          <p className="lede">
            CBE helps learners build knowledge, practical skills, values and positive attitudes — not only
            recall of facts. Teaching at Hill Springs Academy connects classroom ideas with everyday life in Maua and Meru County.
          </p>
          <div className="cols">
            {(SCHOOL.learningApproach || []).map((x, n) => (
              <article className="card reveal" key={x.title} style={{ "--d": `${n * 80}ms` }}>
                <h3>{x.title}</h3>
                <p>{x.text}</p>
              </article>
            ))}
          </div>
          {(SCHOOL.subjects || []).length > 0 && (
            <div style={{ marginTop: 28 }}>
              <h3>Core subject areas</h3>
              <ul className="tags dark">
                {SCHOOL.subjects.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <p style={{ marginTop: 12 }}>
                <Link className="textlink" to="/academics">See the full academics page →</Link>
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div>
            <span className="eyebrow">Beyond the classroom</span>
            <h2>School life</h2>
            <p>
              Learning at Hill Springs Academy includes sports, creative activities, clubs and community involvement.
              These experiences build confidence, teamwork and healthy habits alongside academic progress.
            </p>
            <ul className="tags dark" style={{ marginTop: 16 }}>
              {(SCHOOL.activities || []).map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <p style={{ marginTop: 16 }}>
              <Link className="textlink" to="/school-life">Explore school life →</Link>
            </p>
          </div>
          <div className="card">
            <h3>For parents and guardians</h3>
            <ul className="checks">
              {(SCHOOL.parentInfo || []).map((p) => (
                <li key={p.title}>
                  <strong>{p.title}:</strong> {p.text}
                </li>
              ))}
            </ul>
            <div className="btns" style={{ marginTop: 16 }}>
              <Link className="btn small" to="/fees">Fees 2026</Link>
              <Link className="btn small ghost" to="/uniforms">Uniforms</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap split">
          <div>
            <span className="eyebrow">Find us</span>
            <h2>Visit Hill Springs Academy in Maua</h2>
            <p>
              We are based in Maua, Igembe South, Meru County. Families looking for private schools in Maua
              and across Meru County are welcome to contact the office to arrange a visit, confirm places and
              ask about fees, transport and reporting dates.
            </p>
            <ul className="checks">
              <li>{SCHOOL.address || SCHOOL.town}</li>
              {SCHOOL.poBox && <li>{SCHOOL.poBox}</li>}
              {SCHOOL.phone && (
                <li>
                  Phone:{" "}
                  <a href={`tel:${SCHOOL.phoneTel || SCHOOL.phone}`}>{SCHOOL.phone}</a>
                </li>
              )}
            </ul>
            <a
              className="textlink"
              href="https://www.google.com/maps/search/?api=1&query=Hill+Springs+Academy+Maua+Kenya"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open on Google Maps ↗
            </a>
          </div>
          <div className="map-card">
            <iframe
              title="Hill Springs Academy on Google Maps, Maua, Meru County"
              src="https://www.google.com/maps?q=Hill+Springs+Academy,+Maua,+Kenya&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ width: "100%", height: "320px", border: 0 }}
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="wrap">
          <h2>Ready to join Hill Springs Academy?</h2>
          <p>Create a parent account, apply online, or contact admissions for places and fee details.</p>
          <div className="btns" style={{ justifyContent: "center" }}>
            <Link className="btn white" to="/signup">Sign up</Link>
            <Link className="btn ghost" style={{ borderColor: "#fff", color: "#fff" }} to="/apply">
              Apply online
            </Link>
            <Link className="btn ghost" style={{ borderColor: "#fff", color: "#fff" }} to="/enquire">
              Make an enquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export function Academics() {
  return (
    <>
      <PageHead
        title="Academics"
        text="A clear learning journey from the early years into Junior School, grounded in Kenya's Competency-Based Education."
        path="/academics"
      />
      <section className="section">
        <div className="wrap">
          <div className="intro-row">
            <div>
              <span className="eyebrow">Learning at Hill Springs</span>
              <h2>Build understanding. Practise skills. Grow in confidence.</h2>
            </div>
            <p className="lede">Our academic approach is designed to help learners use what they know — in class, through practical activities and in everyday situations.</p>
          </div>
          <div className="academic-path">
            {(SCHOOL.stages || []).map((stage, i) => (
              <article className="academic-stage" key={stage.title}>
                <span className="stage-no">0{i + 1}</span>
                <div>
                  <h3>{stage.title}</h3>
                  <p>{stage.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <span className="eyebrow">Our approach</span>
          <h2>What learning looks like</h2>
          <div className="cols">
            {(SCHOOL.learningApproach || []).map((x) => (
              <article className="card editorial-card" key={x.title}>
                <h3>{x.title}</h3>
                <p>{x.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div>
            <span className="eyebrow">Curriculum</span>
            <h2>Subject areas</h2>
            <p>Our programme brings together foundational literacy and numeracy, sciences, humanities, creative work, physical development and values.</p>
          </div>
          <div className="subject-list">
            {(SCHOOL.subjects || []).map((subject, i) => (
              <div className="subject-item" key={subject}><span>0{i + 1}</span><strong>{subject}</strong></div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="wrap">
          <span className="eyebrow">Next step</span>
          <h2>Talk to us about the right class for your child.</h2>
          <p>Admissions can guide you on available places, the learner's level and the application process.</p>
          <div className="btns" style={{ justifyContent: "center" }}>
            <Link className="btn white" to="/apply">Apply online</Link>
            <Link className="btn ghost" style={{ borderColor: "#fff", color: "#fff" }} to="/enquire">Ask a question</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export function Admissions() {
  return (
    <>
      <PageHead
        title="Admissions"
        text="A straightforward route from your first enquiry to joining Hill Springs Academy."
        path="/admissions"
      />
      <section className="section">
        <div className="wrap split">
          <div>
            <span className="eyebrow">The process</span>
            <h2>Four simple steps</h2>
            <div className="admissions-timeline">
              {(SCHOOL.steps || []).map((step, i) => (
                <article className="timeline-item" key={step.title}>
                  <span className="timeline-no">{String(i + 1).padStart(2, "0")}</span>
                  <div><h3>{step.title}</h3><p>{step.text}</p></div>
                </article>
              ))}
            </div>
          </div>
          <aside className="admissions-aside">
            <span className="eyebrow">Before you apply</span>
            <h3>Have these ready</h3>
            <ul className="checks">{(SCHOOL.documents || []).map((d) => <li key={d}>{d}</li>)}</ul>
            <div className="aside-divider" />
            <h3>Levels</h3>
            <p>Applications are accepted for the classes listed below, subject to available places.</p>
            <div className="tags dark">{(SCHOOL.applyLevels || []).map((l) => <span key={l}>{l}</span>)}</div>
          </aside>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <div className="intro-row">
            <div><span className="eyebrow">Make your next move</span><h2>Choose the route that suits you.</h2></div>
            <p className="lede">You can begin with an enquiry, start an online application, or contact the office if you would like to visit first.</p>
          </div>
          <div className="action-strip">
            <Link to="/apply"><strong>Apply online</strong><span>Start an application →</span></Link>
            <Link to="/enquire"><strong>Make an enquiry</strong><span>Ask admissions a question →</span></Link>
            <Link to="/contact"><strong>Contact the school</strong><span>Find phone, email and location →</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}

export function Gallery() {
  const [filter, setFilter] = useState("All");
  const cats = ["All", ...new Set(GALLERY.map((g) => g.cat).filter(Boolean))];
  const items = filter === "All" ? GALLERY : GALLERY.filter((g) => g.cat === filter);
  return (
    <>
      <PageHead title="Gallery" text="A visual look at the places and moments that make up school life." path="/gallery" />
      <section className="section">
        <div className="wrap">
          <div className="gallery-intro">
            <div><span className="eyebrow">Life here</span><h2>See the school beyond the brochure.</h2></div>
            <p>Browse the available school photographs below. We keep the gallery focused on the real campus and school experience.</p>
          </div>
          <div className="chips">
            {cats.map((c) => (
              <button key={c} type="button" className={filter === c ? "on" : ""} onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
          <div className="gallery-grid" style={{ marginTop: 28 }}>
            {items.map((g, n) => <div key={g.src + n}><Photo {...g} /></div>)}
          </div>
          {!items.length && <p className="empty-state">More photographs will be added as the school gallery grows.</p>}
        </div>
      </section>
      <section className="section alt">
        <div className="wrap narrow-copy">
          <span className="eyebrow">Come and see us</span>
          <h2>Photographs are useful. A visit tells you much more.</h2>
          <p>If you are considering Hill Springs Academy, contact the school to arrange a visit and ask about current admissions.</p>
          <Link className="btn" to="/contact">Contact the school</Link>
        </div>
      </section>
    </>
  );
}

export function ReadingMaterials() {
  const materials = SCHOOL.readingMaterials || [];
  const grades = [...new Set(materials.map((m) => m.grade))];
  return (
    <>
      <PageHead title="Learning resources" text="Notes and assessment materials by grade." path="/reading-materials" />
      <section className="section">
        <div className="wrap">
          {grades.map((grade) => (
            <div key={grade} style={{ marginBottom: 28 }}>
              <h2>{grade}</h2>
              <div className="cols">
                {materials.filter((m) => m.grade === grade).map((m) => (
                  <article className="card" key={m.title}>
                    <h3>{m.title}</h3>
                    <p>{m.description}</p>
                    <a className="btn small" href={m.file} target="_blank" rel="noopener noreferrer">Download PDF</a>
                  </article>
                ))}
              </div>
            </div>
          ))}
          {!materials.length && <p>Resources will appear here as they are published.</p>}
        </div>
      </section>
    </>
  );
}

export function SchoolLife() {
  return (
    <>
      <PageHead title="School life" text="The part of school that happens between lessons — sport, creativity, friendships and community." path="/school-life" />
      <section className="section">
        <div className="wrap">
          <div className="intro-row">
            <div><span className="eyebrow">Beyond lessons</span><h2>Learning does not stop when the lesson ends.</h2></div>
            <p className="lede">Activities give learners opportunities to practise teamwork, confidence, creativity, responsibility and healthy habits.</p>
          </div>
          <div className="activity-list">
            {(SCHOOL.activities || []).map((activity, i) => (
              <div className="activity-row" key={activity}><span>0{i + 1}</span><strong>{activity}</strong><em>Part of a balanced school experience</em></div>
            ))}
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="wrap split">
          <div><span className="eyebrow">What matters here</span><h2>Values are lived, not just displayed.</h2><p>The school values are intended to shape how learners work, play, communicate and take responsibility.</p></div>
          <div className="value-stack">
            {(SCHOOL.values || []).map((v) => <article key={v.title}><h3>{v.title}</h3><p>{v.text}</p></article>)}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap parent-note">
          <div><span className="eyebrow">For families</span><h2>Stay connected to your child's school life.</h2></div>
          <div><p>For learner-specific matters, progress, support or communication, please use the school's direct channels.</p><Link className="textlink" to="/contact">Contact the school →</Link></div>
        </div>
      </section>
    </>
  );
}

const UNIFORM_LEVELS = [
  {
    id: "primary",
    title: "Primary School",
    text: "Primary School uniform reference. Primary and Junior Secondary School are shown separately so families can identify the correct level.",
    items: [
      { src: "/junior-primary-boy.jfif", title: "Primary School Boy — Shirt", desc: "Primary boys' shirt uniform." },
      { src: "/junior-primary-girl.jfif", title: "Primary School Girl", desc: "Primary girls' uniform." },
    ],
  },
  {
    id: "jss",
    title: "Junior Secondary School (JSS)",
    text: "Junior Secondary School uniform reference, kept separate from Primary School.",
    items: [
      { src: "/senior-primary-boy.jfif", title: "JSS Boy", desc: "Junior Secondary boys' uniform." },
      { src: "/senior-primary-girl.jfif", title: "JSS Girl", desc: "Junior Secondary girls' uniform." },
      { src: "/senior-primary-girl-with-jumper.jfif", title: "JSS Girl — Sweater", desc: "JSS sweater combination for cooler days." },
    ],
  },
];

export function Uniforms() {
  return (
    <>
      <PageHead title="School uniforms" text="Uniform reference for Primary School and Junior Secondary School (JSS)." path="/uniforms" />
      <section className="section uniform-section">
        <div className="wrap">
          <div className="intro-row">
            <div><span className="eyebrow">Uniform guide</span><h2>Primary and JSS, clearly separated.</h2></div>
            <p className="lede">The photographs below are grouped by school level. Contact the school for supplier, sizing, pricing and any current term-specific requirements.</p>
          </div>
          {UNIFORM_LEVELS.map((level) => (
            <div className="uniform-level" key={level.id} id={level.id}>
              <div className="uniform-heading"><div><span className="eyebrow">{level.id === "primary" ? "Junior school · Primary" : "Senior school · JSS"}</span><h3>{level.title}</h3></div><p>{level.text}</p></div>
              <div className="uniform-grid">
                {level.items.map((item, i) => (
                  <figure className="uniform-card" key={item.title} style={{ "--d": `${i * 80}ms` }}>
                    <div className="uniform-image"><img src={item.src} alt={`Hill Springs Academy ${item.title}`} loading="lazy" width="900" height="1200" /></div>
                    <figcaption><strong>{item.title}</strong><span>{item.desc}</span></figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ))}
          <div className="uniform-note"><span aria-hidden="true">✓</span><p><strong>Need the exact requirements?</strong> Contact admissions before buying uniforms so you can confirm the current specification.</p></div>
        </div>
      </section>
    </>
  );
}

export function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <>
      <PageHead title="Frequently asked questions" text="Quick answers to common questions from families considering Hill Springs Academy." path="/faq" />
      <section className="section">
        <div className="wrap faq-layout">
          <div><span className="eyebrow">Questions</span><h2>What families usually want to know.</h2><p className="lede">If your question is not answered here, the school office can give you the current information.</p><Link className="btn ghost" to="/contact">Ask the school</Link></div>
          <div>
            {(SCHOOL.faqs || []).map((f, i) => (
              <div className="faq" key={f.q}>
                <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}><span>{f.q}</span><span aria-hidden="true">{open === i ? "−" : "+"}</span></button>
                <div className={"ans" + (open === i ? " open" : "")}><p>{f.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
  const [state, setState] = useState({ busy: false, error: "", done: false });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setState({ busy: true, error: "", done: false });
    try {
      await submitSchoolEnquiry(form);
      setState({ busy: false, error: "", done: true });
      setForm({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
    } catch (err) {
      setState({ busy: false, error: err.message || "Unable to send.", done: false });
    }
  };
  return (
    <>
      <PageHead title="Contact Hill Springs Academy" text="Find the school, call the office, or send a message." path="/contact" />
      <section className="section">
        <div className="wrap contact-layout">
          <div className="contact-copy">
            <span className="eyebrow">Come and see us</span>
            <h2>Let's talk about your child's next step.</h2>
            <p>For admissions, fees, transport, uniforms or a general question, use the details below or send a message.</p>
            <div className="contact-details">
              {SCHOOL.phone && <a href={`tel:${SCHOOL.phoneTel || SCHOOL.phone}`}><small>Phone</small><strong>{SCHOOL.phone}</strong></a>}
              <a href={`mailto:${SCHOOL.infoEmail}`}><small>Email</small><strong>{SCHOOL.infoEmail}</strong></a>
              <a href={`mailto:${SCHOOL.admissionsEmail}`}><small>Admissions</small><strong>{SCHOOL.admissionsEmail}</strong></a>
              <div><small>Location</small><strong>{SCHOOL.address || SCHOOL.town}</strong><span>{SCHOOL.poBox || "Maua, Meru County, Kenya"}</span></div>
            </div>
            <a className="textlink" href="https://www.google.com/maps/search/?api=1&query=Hill+Springs+Academy+Maua+Kenya" target="_blank" rel="noopener noreferrer">Get directions on Google Maps ↗</a>
          </div>
          <form className="card enquiry-form" onSubmit={submit}>
            <span className="eyebrow">Send a message</span><h3>We'll receive your enquiry directly.</h3>
            <input type="text" name="website" value={form.website} onChange={set("website")} tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: "-9999px" }} aria-hidden="true" />
            <label>Name<input value={form.name} onChange={set("name")} required /></label>
            <label>Email<input type="email" value={form.email} onChange={set("email")} required /></label>
            <label>Phone<input value={form.phone} onChange={set("phone")} /></label>
            <label>Subject<input value={form.subject} onChange={set("subject")} /></label>
            <label>Message<textarea value={form.message} onChange={set("message")} required /></label>
            {state.error && <p className="form-error" role="alert">{state.error}</p>}
            {state.done && <p className="form-success" role="status">Thank you. Your message has been received.</p>}
            <button className="btn" type="submit" disabled={state.busy}>{state.busy ? "Sending…" : "Send enquiry"}</button>
          </form>
        </div>
      </section>
      <section className="section alt">
        <div className="wrap map-card"><iframe title="Hill Springs Academy on Google Maps, Maua, Meru County" src="https://www.google.com/maps?q=Hill+Springs+Academy,+Maua,+Kenya&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ width: "100%", height: "360px", border: 0 }} allowFullScreen /></div>
      </section>
    </>
  );
}

export function Blog() {
  const { slug } = useParams();
  const post = slug ? BLOG_POSTS.find((p) => p.slug === slug) : null;
  if (slug && !post) {
    return <><PageHead title="Article not found" text="That article does not exist." /><section className="section"><div className="wrap"><Link className="btn" to="/blog">Back to blog</Link></div></section></>;
  }
  if (post) {
    return (
      <>
        <PageHead title={post.title} text={post.intro || ""} path={`/blog/${post.slug}`} />
        <article className="section article-page">
          <div className="wrap article-wrap">
            <Link className="backlink" to="/blog">← Back to all articles</Link>
            <div className="article-meta">{post.date}</div>
            <h2>{post.title}</h2>
            <p className="article-intro">{post.intro}</p>
            {(post.sections || []).map(([heading, body]) => (
              <section key={heading}><h3>{heading}</h3><p>{body}</p></section>
            ))}
            {post.closing && <p className="article-closing">{post.closing}</p>}
          </div>
        </article>
      </>
    );
  }
  return (
    <>
      <PageHead title="School news & insights" text="Practical notes for families and learners." path="/blog" />
      <section className="section">
        <div className="wrap blog-list">
          {(BLOG_POSTS || []).map((p) => (
            <article className="blog-item" key={p.slug}>
              <div className="article-meta">{p.date}</div>
              <h2><Link to={`/blog/${p.slug}`}>{p.title}</Link></h2>
              <p>{p.intro}</p>
              <Link className="textlink" to={`/blog/${p.slug}`}>Read article →</Link>
            </article>
          ))}
          {!BLOG_POSTS?.length && <p>No articles have been published yet.</p>}
        </div>
      </section>
    </>
  );
}


export function Fees() {
  return (
    <>
      <PageHead title="School fees 2026" text="Official termly fees by class. Click a class to download that fee structure as a PDF." path="/fees" />
      <section className="section"><div className="wrap">
        <div className="row-head"><div><span className="eyebrow">Fees Structure {FEES_META.year}</span><h2>Choose a class to download</h2><p className="lede">Each download shows the fee band for that class, what the fees cover, admission charge and bank details.</p></div><Link className="btn ghost" to="/enquire">Ask about fees</Link></div>
        <div className="fee-class-grid">{FEE_CLASSES.map((item)=><button key={item.slug} type="button" className="fee-class-card" onClick={()=>downloadFeePdf(item)}><strong>{item.name}</strong><span className="fee-band-label">{item.band.title}</span><span className="fee-amounts">{item.band.terms.map(t=><span key={t.term}><small>{t.term}</small> Ksh {t.amount}</span>)}</span><span className="fee-dl">Download PDF ↓</span></button>)}</div>
        <div className="fee-bands"><h3>Or download by fee band</h3><div className="fee-band-row">{FEE_BANDS.map(b=><button key={b.id} type="button" className="btn small ghost dark" onClick={()=>downloadFeePdf(b)}>{b.title}</button>)}</div></div>
        <div className="card fee-includes"><h3>What the fees cover</h3><ul className="checks">{FEES_META.covers.map(c=><li key={c}>{c}</li>)}</ul><p><strong>Admission (new pupils):</strong> Ksh {FEES_META.admissionNewPupil}</p><p>{FEES_META.transportNote}</p><h3>Bank details</h3><ul className="fee-banks">{FEES_META.banks.map(b=><li key={b.account}><strong>{b.bank}</strong><span>A/C {b.account} · {b.name}</span></li>)}</ul><p className="fee-note">Amounts are from the official {FEES_META.year} structure. Confirm with admissions before paying.</p></div>
      </div></section>
    </>
  );
}

export function Directors() {
  return <><PageHead title="Leadership" text="School leadership at Hill Springs Academy." path="/directors" /><section className="section"><div className="wrap card"><p>Leadership details will be published here. For official enquiries, contact the school office.</p><Link className="btn" to="/contact">Contact us</Link></div></section></>;
}

export function Privacy() {
  return (
    <>
      <PageHead
        title="Privacy & Data Protection"
        text="How Hill Springs Academy collects, uses, protects and retains personal data."
        path="/privacy"
      />

      <section className="section privacy-page">
        <div className="wrap">
          <div className="privacy-intro">
            <div>
              <span className="eyebrow">Data protection</span>
              <h2>Your information, handled with care.</h2>
            </div>
            <p>
              <strong>Last updated: 6 October 2026.</strong> This notice explains how
              Hill Springs Academy handles personal data when you visit our website,
              create a parent account, make an enquiry, apply for admission, subscribe
              to school updates or otherwise communicate with us online.
            </p>
          </div>

          <div className="privacy-notice">
            <strong>Important:</strong> This notice is written for Hill Springs Academy's
            current website and online parent services. It is designed around the Kenya
            Data Protection Act, 2019 and applicable regulations, and reflects widely
            recognised privacy principles including the GDPR and UK GDPR where those laws
            apply to a particular person or processing activity. It is not a statement
            that every international privacy law applies to Hill Springs Academy.
          </div>

          <div className="privacy-grid">
            <article className="privacy-card">
              <span className="privacy-number">01</span>
              <h3>Who is responsible for your data?</h3>
              <p>
                Hill Springs Academy is responsible for personal data processed through
                this website and its online school services. For privacy questions,
                requests or complaints, contact the school using the details below.
              </p>
              <p>
                <strong>Hill Springs Academy</strong><br />
                {SCHOOL.address}<br />
                <a href={`mailto:${SCHOOL.infoEmail}`}>{SCHOOL.infoEmail}</a><br />
                <a href={`tel:${SCHOOL.phoneTel}`}>{SCHOOL.phone}</a>
              </p>
            </article>

            <article className="privacy-card">
              <span className="privacy-number">02</span>
              <h3>What information do we collect?</h3>
              <ul>
                <li><strong>Parent/account information:</strong> name, email address, phone number and account/security information.</li>
                <li><strong>Admission information:</strong> parent or guardian details and learner information such as name, date of birth, gender, current/requested level, previous school, entry term and notes you provide.</li>
                <li><strong>Enquiry information:</strong> subject, message, phone number and learner-related details supplied in an enquiry.</li>
                <li><strong>School updates:</strong> name and email address when you subscribe.</li>
                <li><strong>Security information:</strong> limited technical information such as IP address may be processed for fraud prevention, rate limiting, security and audit purposes.</li>
                <li><strong>Website preferences:</strong> essential browser storage such as your theme preference and session information.</li>
              </ul>
              <p>We ask you not to submit sensitive information unless the school specifically requests it and there is a lawful reason to process it.</p>
            </article>

            <article className="privacy-card">
              <span className="privacy-number">03</span>
              <h3>Why do we use personal data?</h3>
              <p>We process information only for clear and legitimate purposes, including:</p>
              <ul>
                <li>creating and managing parent accounts;</li>
                <li>verifying email addresses and securing accounts;</li>
                <li>receiving, assessing and communicating about admission applications;</li>
                <li>receiving and responding to enquiries and school communications;</li>
                <li>sending requested confirmations, verification codes, decisions and service messages;</li>
                <li>sending school updates where you have subscribed and can unsubscribe;</li>
                <li>protecting the website and services from abuse, fraud and unauthorised access;</li>
                <li>meeting legal, regulatory, safeguarding and record-keeping obligations; and</li>
                <li>improving the website only where the relevant processing is lawful and appropriately consented to where consent is required.</li>
              </ul>
            </article>

            <article className="privacy-card">
              <span className="privacy-number">04</span>
              <h3>Lawful basis and consent</h3>
              <p>
                Depending on the activity, processing may be necessary to provide a service
                you request, take steps relating to an application, comply with a legal
                obligation, protect legitimate interests such as website security, or rely
                on your consent for an optional activity such as certain marketing or
                non-essential measurement.
              </p>
              <p>
                Consent is voluntary, specific, informed and capable of being withdrawn.
                Withdrawal does not invalidate processing that was lawful before withdrawal.
                We do not make a service conditional on consent to processing that is not
                necessary for that service.
              </p>
            </article>

            <article className="privacy-card">
              <span className="privacy-number">05</span>
              <h3>Children's data</h3>
              <p>
                Hill Springs Academy is a school and therefore processes information about
                children for education and admissions purposes. Children's information is
                treated with additional care and is processed in a manner that protects
                the child's rights and best interests.
              </p>
              <p>
                Where required by Kenyan law, a parent or lawful guardian must provide
                consent or otherwise authorise the processing of a child's personal data.
                We may take reasonable steps to verify parental or guardian authority.
                We do not use children's admission information for unrelated advertising.
              </p>
              <p>
                If a photograph, achievement, name or other information about a learner is
                to be published for a purpose that requires consent, the school will seek
                the appropriate parent/guardian permission before publication.
              </p>
            </article>

            <article className="privacy-card">
              <span className="privacy-number">06</span>
              <h3>Who may receive the information?</h3>
              <p>
                Access is limited to people and service providers who need the information
                for the stated purpose. Depending on the service, this can include authorised
                Hill Springs Academy staff and contracted technology providers used for
                hosting, database services, authentication, security, email delivery and
                website infrastructure.
              </p>
              <p>
                The website may also contain embedded or linked services such as Google Maps
                or YouTube. When you interact with those services, the relevant provider may
                process technical information under its own privacy terms.
              </p>
              <p>
                We do not sell your personal data.
              </p>
            </article>

            <article className="privacy-card">
              <span className="privacy-number">07</span>
              <h3>International data transfers</h3>
              <p>
                Some technology providers used to operate the website may process or store
                information outside Kenya. Where personal data is transferred across borders,
                Hill Springs Academy will use the safeguards required by applicable law,
                which may include adequate protection requirements, contractual safeguards,
                security measures or valid consent where appropriate.
              </p>
              <p>
                For people protected by the GDPR or UK GDPR, we will apply the relevant
                international-transfer safeguards required by those laws.
              </p>
            </article>

            <article className="privacy-card">
              <span className="privacy-number">08</span>
              <h3>How long do we keep information?</h3>
              <p>
                We keep personal data only for as long as it is reasonably necessary for the
                purpose for which it was collected, for legitimate school records, or where
                retention is required by law. Retention periods depend on the type of record
                and the reason it was collected.
              </p>
              <ul>
                <li>Parent account information is retained while the account is active and for any period required for legitimate records or legal obligations.</li>
                <li>Admission records are retained according to the school's record-keeping needs and applicable legal requirements.</li>
                <li>Enquiries and communications are retained while needed to resolve the matter and for reasonable accountability.</li>
                <li>Newsletter subscriptions remain active until you unsubscribe or the subscription is otherwise closed.</li>
                <li>Security and audit records are retained for as long as reasonably necessary for security, investigation and accountability.</li>
              </ul>
              <p>When information is no longer required, it should be securely deleted, anonymised or otherwise disposed of in accordance with the school's retention procedures.</p>
            </article>

            <article className="privacy-card">
              <span className="privacy-number">09</span>
              <h3>Cookies, local storage and consent</h3>
              <p>
                The website uses essential browser storage for functions such as keeping
                your sign-in session, remembering your light/dark theme and remembering
                your privacy choice. These functions are necessary for the website or a
                service you have requested.
              </p>
              <p>
                <strong>Google Analytics and Google personalised advertising are not currently
                installed on this website.</strong> Optional analytics or advertising should
                not be enabled without the appropriate consent and configuration. If Google
                advertising products are introduced, users in the EEA, UK or Switzerland
                will be handled according to Google's then-current consent requirements,
                including use of an appropriate Google-certified consent solution where
                required for personalised advertising.
              </p>
              <p>
                You can change your privacy preference by clearing the site's privacy choice
                and making a new selection, or by contacting the school.
              </p>
            </article>

            <article className="privacy-card">
              <span className="privacy-number">10</span>
              <h3>Security</h3>
              <p>
                We use reasonable technical and organisational measures appropriate to the
                nature of the information we process. These include HTTPS, controlled access
                to administrative functions, restricted database privileges, authentication,
                rate limiting, security checks, audit records and server-side processing for
                sensitive operations.
              </p>
              <p>
                No internet service can guarantee absolute security. Please keep your
                account credentials confidential and notify the school promptly if you
                believe your account has been compromised.
              </p>
            </article>

            <article className="privacy-card">
              <span className="privacy-number">11</span>
              <h3>Your data protection rights</h3>
              <p>Subject to applicable legal limits, you may have the right to:</p>
              <ul>
                <li>be informed about how your personal data is used;</li>
                <li>request access to personal data held about you;</li>
                <li>request correction of inaccurate or misleading information;</li>
                <li>object to certain processing;</li>
                <li>request deletion/erasure where the law permits;</li>
                <li>request restriction of processing in applicable circumstances;</li>
                <li>request portability where applicable; and</li>
                <li>withdraw consent where processing relies on consent.</li>
              </ul>
              <p>
                A parent or lawful guardian may exercise applicable rights relating to a
                child's data, subject to verification and the child's best interests.
              </p>
            </article>

            <article className="privacy-card">
              <span className="privacy-number">12</span>
              <h3>How to make a privacy request</h3>
              <p>
                Email <a href={`mailto:${SCHOOL.infoEmail}`}>{SCHOOL.infoEmail}</a> with
                the subject line <strong>Data Protection Request</strong>. Tell us what you
                are requesting and provide enough information for us to verify your identity
                or authority. We may request additional information where reasonably necessary
                to protect personal data from unauthorised disclosure.
              </p>
              <p>
                We will handle requests in accordance with the applicable law and will explain
                if a request cannot be fully completed because a legal exception applies.
              </p>
            </article>

            <article className="privacy-card">
              <span className="privacy-number">13</span>
              <h3>Data breaches</h3>
              <p>
                We maintain procedures for detecting, investigating and responding to personal
                data incidents. Where Kenyan law requires notification of a notifiable breach,
                the school will follow the applicable notification and communication requirements,
                including the statutory timelines.
              </p>
              <p>
                If a breach creates a real risk of harm, the Kenya Data Protection Act requires
                notification to the Data Commissioner without delay and within 72 hours of
                becoming aware of the breach, subject to the Act's requirements and exceptions.
              </p>
            </article>

            <article className="privacy-card">
              <span className="privacy-number">14</span>
              <h3>Google and other third-party services</h3>
              <p>
                Some pages may link to or embed third-party services, including Google Maps
                and YouTube. Those providers may receive technical information when their
                content is requested or interacted with. Their own privacy policies and
                terms apply to their processing.
              </p>
              <p>
                We do not represent third-party providers as being controlled by Hill Springs
                Academy. Where a third-party service requires optional consent under applicable
                law, it should only be activated after the required consent has been obtained.
              </p>
            </article>

            <article className="privacy-card">
              <span className="privacy-number">15</span>
              <h3>Complaints</h3>
              <p>
                If you believe your data protection rights have not been respected, please
                contact Hill Springs Academy first so we can investigate and respond.
              </p>
              <p>
                You may also contact the <a href="https://www.odpc.go.ke/" target="_blank" rel="noopener noreferrer">Office of the Data Protection Commissioner (ODPC)</a>
                {' '}in Kenya. Individuals who are protected by the GDPR or UK GDPR may also
                have the right to complain to their relevant supervisory authority.
              </p>
            </article>

            <article className="privacy-card">
              <span className="privacy-number">16</span>
              <h3>Changes to this notice</h3>
              <p>
                We may update this notice when our services, technology, legal obligations or
                data-processing practices change. The current version will be published on
                this page with its updated date.
              </p>
            </article>
          </div>

          <div className="privacy-footer-note">
            <strong>Privacy contact</strong>
            <p>
              For access, correction, deletion, consent withdrawal, child-data questions,
              security concerns or any other data-protection request, contact
              <a href={`mailto:${SCHOOL.infoEmail}`}> {SCHOOL.infoEmail}</a>.
            </p>
            <div className="btns">
              <Link className="btn small" to="/contact">Contact the school</Link>
              <button className="btn small ghost dark" type="button" onClick={() => { clearPrivacyConsent(); window.location.reload(); }}>
                Change privacy choices
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export { Sitemap } from "./SitemapPage.jsx";
