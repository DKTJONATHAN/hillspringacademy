import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FEES_META, FEE_BANDS, FEE_CLASSES, downloadFeePdf } from "./feesData.js";
import { SCHOOL, GALLERY } from "./data.js";
import { BLOG_POSTS } from "./blogData.js";
import { PageHead, Photo } from "./components.jsx";
import { submitEnquiry, subscribeToSchoolUpdates } from "./supabase.js";

export function About() {
  return (
    <>
      <PageHead title="About Hill Springs Academy" text="A private CBE school in Maua, Meru County." path="/about" />
      <section className="section">
        <div className="wrap split">
          <div>
            <span className="eyebrow">Who we are</span>
            <h2>{SCHOOL.name}</h2>
            <p>{SCHOOL.intro}</p>
            <p>We serve families in Maua, Igembe South and across Meru County with Kindergarten, Pre-Primary and Junior School under Kenya’s Competency-Based Education.</p>
            <ul className="checks">
              <li>Location: {SCHOOL.town}</li>
              <li>Motto: {SCHOOL.motto}</li>
              {SCHOOL.centreCode && <li>Centre code: {SCHOOL.centreCode}</li>}
            </ul>
          </div>
          <div className="card">
            <h3>Our values</h3>
            {SCHOOL.values.map((v) => (
              <div key={v.title} style={{ marginBottom: 12 }}>
                <strong>{v.title}</strong>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section alt">
        <div className="wrap">
          <span className="eyebrow">Learning stages</span>
          <h2>From early years to Junior School</h2>
          <div className="cols">
            {(SCHOOL.stages || SCHOOL.levels || []).map((s) => (
              <article className="card" key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function Academics() {
  return (
    <>
      <PageHead title="Academics" text="Competency-Based Education with strong foundations." path="/academics" />
      <section className="section">
        <div className="wrap">
          <span className="eyebrow">CBE</span>
          <h2>How we teach</h2>
          <div className="cols">
            {(SCHOOL.learningApproach || []).map((x) => (
              <article className="card" key={x.title}>
                <h3>{x.title}</h3>
                <p>{x.text}</p>
              </article>
            ))}
          </div>
          <h3 style={{ marginTop: 32 }}>Subjects</h3>
          <ul className="tags dark">{(SCHOOL.subjects || []).map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      </section>
    </>
  );
}

export function Admissions() {
  return (
    <>
      <PageHead title="Admissions" text="Apply online or contact the admissions office." path="/admissions" />
      <section className="section">
        <div className="wrap split">
          <div>
            <h2>How to join</h2>
            <div className="cols">
              {(SCHOOL.steps || []).map((s, i) => (
                <article className="card" key={s.title}>
                  <span className="eyebrow">Step {i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </article>
              ))}
            </div>
            <div className="btns" style={{ marginTop: 24 }}>
              <Link className="btn" to="/apply">Apply online</Link>
              <Link className="btn ghost" to="/fees">View fees</Link>
            </div>
          </div>
          <div className="card">
            <h3>Documents to prepare</h3>
            <ul className="checks">{(SCHOOL.documents || []).map((d) => <li key={d}>{d}</li>)}</ul>
            <h3 style={{ marginTop: 20 }}>Levels</h3>
            <ul className="tags">{(SCHOOL.applyLevels || []).map((l) => <li key={l}>{l}</li>)}</ul>
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
      <PageHead title="Gallery" text="Life at Hill Springs Academy." path="/gallery" />
      <section className="section">
        <div className="wrap">
          <div className="chips">
            {cats.map((c) => (
              <button key={c} type="button" className={filter === c ? "on" : ""} onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
          <div className="gallery-grid" style={{ marginTop: 20 }}>
            {items.map((g, n) => (
              <div key={g.src + n}><Photo {...g} /></div>
            ))}
          </div>
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
      <PageHead title="School life" text="Learning, play and community beyond the classroom." path="/school-life" />
      <section className="section">
        <div className="wrap">
          <h2>Activities and clubs</h2>
          <ul className="tags dark">{(SCHOOL.activities || []).map((s) => <li key={s}>{s}</li>)}</ul>
          <div className="cols" style={{ marginTop: 28 }}>
            {(SCHOOL.values || []).map((v) => (
              <article className="card" key={v.title}><h3>{v.title}</h3><p>{v.text}</p></article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function Fees() {
  return (
    <>
      <PageHead
        title="School fees 2026"
        text="Official termly fees by class. Click a class to download that fee structure as a PDF."
        path="/fees"
      />
      <section className="section">
        <div className="wrap">
          <div className="row-head">
            <div>
              <span className="eyebrow">Fees Structure {FEES_META.year}</span>
              <h2>Choose a class to download</h2>
              <p className="lede">Each download shows only the fee band for that class, what the fees cover, admission charge, and bank details — not the full multi-class table.</p>
            </div>
            <Link className="btn ghost" to="/enquire">Ask about fees</Link>
          </div>

          <div className="fee-class-grid">
            {FEE_CLASSES.map((item) => (
              <button
                key={item.slug}
                type="button"
                className="fee-class-card"
                onClick={() => downloadFeePdf(item)}
              >
                <strong>{item.name}</strong>
                <span className="fee-band-label">{item.band.title}</span>
                <span className="fee-amounts">
                  {item.band.terms.map((t) => (
                    <span key={t.term}><small>{t.term}</small> Ksh {t.amount}</span>
                  ))}
                </span>
                <span className="fee-dl">Download PDF ↓</span>
              </button>
            ))}
          </div>

          <div className="fee-bands">
            <h3>Or download by fee band</h3>
            <div className="fee-band-row">
              {FEE_BANDS.map((band) => (
                <button key={band.id} type="button" className="btn small ghost dark" onClick={() => downloadFeePdf(band)}>
                  {band.title}
                </button>
              ))}
            </div>
          </div>

          <div className="card fee-includes">
            <h3>What the fees cover</h3>
            <ul className="checks">
              {FEES_META.covers.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p><strong>Admission (new pupils):</strong> Ksh {FEES_META.admissionNewPupil}</p>
            <p>{FEES_META.transportNote}</p>
            <h3>Bank details</h3>
            <ul className="fee-banks">
              {FEES_META.banks.map((b) => (
                <li key={b.account}>
                  <strong>{b.bank}</strong>
                  <span>A/C {b.account} · {b.name}</span>
                </li>
              ))}
            </ul>
            <p className="fee-note">Amounts are from the official {FEES_META.year} structure. Confirm with admissions before paying — fees can change.</p>
          </div>
        </div>
      </section>
    </>
  );
}

const UNIFORM_LEVELS = [
  {
    id: "primary",
    title: "Primary School",
    text: "Official Primary School uniform options, including shirt, sweater and jumper.",
    items: [
      { src: "/junior-primary-boy.jfif", title: "Primary School Boy — Shirt", desc: "Standard boys' uniform with the school shirt and approved colours." },
      { src: "/junior-primary-girl.jfif", title: "Primary School Girl", desc: "Official girls' uniform, including the school colours and pattern." },
      { src: "/junior-primary-boy2.jfif", title: "Primary School Boy — Sweater", desc: "Boys' sweater option for cooler days." },
      { src: "/primary%20school%20jumper.jfif", title: "Primary School Jumper", desc: "Approved Primary School jumper for cooler days." },
    ],
  },
  {
    id: "jss",
    title: "Junior Secondary School (JSS)",
    text: "Official Junior Secondary School uniform options, shown separately from Primary.",
    items: [
      { src: "/senior-primary-boy.jfif", title: "JSS Boy", desc: "Official boys' uniform and its approved colours and pattern." },
      { src: "/senior-primary-girl.jfif", title: "JSS Girl", desc: "Official girls' uniform, including the school colours and pattern." },
      { src: "/senior-primary-girl-with-jumper.jfif", title: "JSS Girl with Jumper", desc: "Approved JSS jumper combination for cooler days." },
    ],
  },
];

export function Uniforms() {
  return (
    <>
      <PageHead
        title="School uniforms"
        text="Official uniforms by school level — Primary and Junior Secondary School (JSS)."
        path="/uniforms"
      />
      <section className="section uniform-section">
        <div className="wrap">
          <div className="row-head">
            <div>
              <span className="eyebrow">Dress code</span>
              <h2>Uniforms by level</h2>
              <p className="lede">Use the photographs below as the official reference for each level. Contact admissions for supplier, sizing and pricing.</p>
            </div>
            <Link to="/contact" className="textlink">Ask about uniform</Link>
          </div>

          {UNIFORM_LEVELS.map((level) => (
            <div className="uniform-level" key={level.id} id={level.id}>
              <span className="eyebrow">{level.title}</span>
              <h3>{level.title}</h3>
              <p className="uniform-intro">{level.text}</p>
              <div className="uniform-grid">
                {level.items.map((item, i) => (
                  <figure className="uniform-card" key={item.title} style={{ "--d": `${i * 80}ms` }}>
                    <div className="uniform-image">
                      <img src={item.src} alt={`Hill Springs Academy ${item.title}`} loading="lazy" width="900" height="1200" />
                    </div>
                    <figcaption>
                      <strong>{item.title}</strong>
                      <span>{item.desc}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ))}

          <div className="uniform-note">
            <span aria-hidden="true">✓</span>
            <p><strong>Official uniform reference:</strong> Primary and JSS requirements are shown separately above. For supplier, sizing, pricing or term-specific rules, contact the school.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <>
      <PageHead title="FAQ" text="Common questions from parents and guardians." path="/faq" />
      <section className="section">
        <div className="wrap">
          {(SCHOOL.faqs || []).map((f, i) => (
            <div className="faq" key={f.q}>
              <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
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
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
  const [state, setState] = useState({ busy: false, error: "", done: false });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setState({ busy: true, error: "", done: false });
    try {
      await submitEnquiry(form);
      setState({ busy: false, error: "", done: true });
      setForm({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
    } catch (err) {
      setState({ busy: false, error: err.message || "Unable to send.", done: false });
    }
  };
  return (
    <>
      <PageHead title="Contact" text="Reach Hill Springs Academy in Maua." path="/contact" />
      <section className="section">
        <div className="wrap split">
          <div>
            <h2>Get in touch</h2>
            <ul className="checks">
              {SCHOOL.phone && <li>Phone: <a href={`tel:${SCHOOL.phoneTel || SCHOOL.phone}`}>{SCHOOL.phone}</a></li>}
              <li>Email: <a href={`mailto:${SCHOOL.infoEmail}`}>{SCHOOL.infoEmail}</a></li>
              <li>Admissions: <a href={`mailto:${SCHOOL.admissionsEmail}`}>{SCHOOL.admissionsEmail}</a></li>
              {SCHOOL.poBox && <li>{SCHOOL.poBox}</li>}
              <li>{SCHOOL.town}</li>
            </ul>
            <div className="btns">
              <Link className="btn" to="/enquire">Make an enquiry</Link>
              <Link className="btn ghost" to="/apply">Apply online</Link>
            </div>
          </div>
          <form className="card enquiry-form" onSubmit={submit}>
            <h3>Contact form</h3>
            <input type="text" name="website" value={form.website} onChange={set("website")} tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: "-9999px" }} aria-hidden="true" />
            <label>Name<input value={form.name} onChange={set("name")} required /></label>
            <label>Email<input type="email" value={form.email} onChange={set("email")} required /></label>
            <label>Phone<input value={form.phone} onChange={set("phone")} /></label>
            <label>Subject<input value={form.subject} onChange={set("subject")} /></label>
            <label>Message<textarea value={form.message} onChange={set("message")} required /></label>
            {state.error && <p className="form-error" role="alert">{state.error}</p>}
            {state.done && <p className="form-success" role="status">Thank you. We received your message.</p>}
            <button className="btn" type="submit" disabled={state.busy}>{state.busy ? "Sending…" : "Send message"}</button>
          </form>
        </div>
      </section>
    </>
  );
}

export function Directors() {
  return (
    <>
      <PageHead title="Leadership" text="School leadership at Hill Springs Academy." path="/directors" />
      <section className="section">
        <div className="wrap card">
          <p>Leadership details will be published here. For official enquiries, contact the school office.</p>
          <Link className="btn" to="/contact">Contact us</Link>
        </div>
      </section>
    </>
  );
}

export function Privacy() {
  return (
    <>
      <PageHead title="Privacy" text="How we handle information on this website." path="/privacy" />
      <section className="section">
        <div className="wrap card">
          <p>This website collects information you submit through forms (such as name, email, phone and messages) so the school can respond to enquiries and applications.</p>
          <p>Account and application data is stored securely with our service providers. Contact the school if you need a correction or have a privacy question.</p>
          <p>Email: <a href={`mailto:${SCHOOL.infoEmail}`}>{SCHOOL.infoEmail}</a></p>
        </div>
      </section>
    </>
  );
}

export function Blog() {
  const { slug } = useParams();
  const post = slug ? BLOG_POSTS.find((p) => p.slug === slug) : null;
  if (slug && !post) {
    return (
      <>
        <PageHead title="Post not found" text="That article does not exist." />
        <section className="section"><div className="wrap"><Link className="btn" to="/blog">Back to blog</Link></div></section>
      </>
    );
  }
  if (post) {
    return (
      <>
        <PageHead title={post.title} text={post.excerpt || ""} path={`/blog/${post.slug}`} />
        <section className="section"><div className="wrap card"><div dangerouslySetInnerHTML={{ __html: post.html || post.body || "" }} /></div></section>
      </>
    );
  }
  return (
    <>
      <PageHead title="Blog" text="News and notes from Hill Springs Academy." path="/blog" />
      <section className="section">
        <div className="wrap cols">
          {(BLOG_POSTS || []).map((p) => (
            <article className="card" key={p.slug}>
              <h3><Link to={`/blog/${p.slug}`}>{p.title}</Link></h3>
              <p>{p.excerpt}</p>
              <Link className="textlink" to={`/blog/${p.slug}`}>Read more</Link>
            </article>
          ))}
          {!BLOG_POSTS?.length && <p>No posts yet.</p>}
        </div>
      </section>
    </>
  );
}

export function Sitemap() {
  const links = [["/","Home"],["/about","About"],["/academics","Academics"],["/admissions","Admissions"],["/school-life","School life"],["/gallery","Gallery"],["/fees","Fees"],["/uniforms","Uniforms"],["/faq","FAQ"],["/reading-materials","Reading materials"],["/contact","Contact"],["/blog","Blog"],["/directors","Leadership"],["/privacy","Privacy"]];
  return (
    <>
      <PageHead title="Sitemap" text="All main pages on this website." path="/sitemap" />
      <section className="section">
        <div className="wrap">
          <ul className="checks">
            {links.map(([to, label]) => (
              <li key={to}><Link to={to}>{label}</Link></li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
