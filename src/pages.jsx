import { Link } from "react-router-dom";
import { SCHOOL, GALLERY } from "./data.js";
import { Photo } from "./components.jsx";

const campusPhoto = GALLERY.find((g) => g.cat === "Campus") || { src: "/Gallery/school-gate.webp", alt: "Hill Springs Academy school gate in Maua" };
const transportPhoto = GALLERY.find((g) => g.cat === "Transport") || { src: "/Gallery/school-bus.webp", alt: "Hill Springs Academy school bus in Maua" };

export function Home() {
  const stages = SCHOOL.stages || [];
  const values = SCHOOL.values || [];
  return (
    <>
      <section className="home-hero">
        <div className="home-hero-image">
          <Photo {...campusPhoto} />
          <span className="image-note">Hill Springs Academy · Maua</span>
        </div>
        <div className="wrap home-hero-content">
          <div className="home-hero-copy">
            <span className="eyebrow">Maua · Meru County · Kenya</span>
            <h1>A school where a strong beginning becomes a brighter future.</h1>
            <p className="hero-motto">{SCHOOL.motto}</p>
            <p>{SCHOOL.intro}</p>
            <div className="btns">
              <Link className="btn" to="/apply">Start an application</Link>
              <Link className="btn ghost" to="/enquire?subject=School%20visit&topic=contact">Plan a school visit</Link>
            </div>
            <div className="hero-contact">
              <span>Admissions</span>
              <a href={`tel:${SCHOOL.phoneTel}`}>{SCHOOL.phone}</a>
              <a href={`mailto:${SCHOOL.admissionsEmail}`}>{SCHOOL.admissionsEmail}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="home-intro section">
        <div className="wrap intro-grid">
          <div>
            <span className="eyebrow">Why Hill Springs</span>
            <h2>Good schooling should feel personal.</h2>
          </div>
          <div>
            <p className="large-copy">Families need more than a list of subjects. They need to understand how a child will learn, grow, build confidence and move through school.</p>
            <Link className="textlink" to="/about">Get to know our school</Link>
          </div>
        </div>
      </section>

      <section className="home-stages section">
        <div className="wrap">
          <div className="section-kicker">
            <span className="eyebrow">The learner journey</span>
            <Link to="/academics" className="textlink">Explore academics</Link>
          </div>
          <h2>From the early years to Junior School</h2>
          <div className="stage-list">
            {stages.map((stage, n) => (
              <Link className="stage-row" to="/academics" key={stage.title}>
                <span className="stage-number">0{n + 1}</span>
                <span className="stage-name">{stage.title}</span>
                <span className="stage-text">{stage.text}</span>
                <span className="stage-arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-values section">
        <div className="wrap value-grid">
          <div className="value-lead">
            <span className="eyebrow">What we build</span>
            <h2>Learning, character and community belong together.</h2>
            <p>Our public information is simple by design: understand the school, find the right level, ask your questions and take the next step.</p>
          </div>
          <div className="value-list">
            {values.map((value, n) => (
              <article key={value.title} className="value-item">
                <span>0{n + 1}</span>
                <div><h3>{value.title}</h3><p>{value.text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-life section">
        <div className="wrap life-grid">
          <div className="life-photo"><Photo {...transportPhoto} /></div>
          <div className="life-copy">
            <span className="eyebrow">Life beyond the classroom</span>
            <h2>School is also the journey to and from learning.</h2>
            <p>Hill Springs Academy provides school transport for learners. Current routes, availability and charges should be confirmed with admissions.</p>
            <Link className="textlink" to="/enquire?subject=School%20transport&topic=contact">Ask about transport</Link>
            <div className="life-links">
              <Link to="/gallery">See school life</Link>
              <Link to="/reading-materials">Learning resources</Link>
              <Link to="/uniforms">Uniform guide</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-uniform section">
        <div className="wrap uniform-grid">
          <div>
            <span className="eyebrow">Uniform guide</span>
            <h2>Primary and JSS, clearly separated.</h2>
            <p>See the official uniform options by level, with Primary and Junior Secondary School (JSS) presented separately so families can identify the correct uniform.</p>
            <Link className="btn" to="/uniforms">View uniforms</Link>
          </div>
          <div className="uniform-rule">
            <div><strong>Primary</strong><span>Primary School uniform</span></div>
            <div><strong>JSS</strong><span>Junior Secondary School uniform</span></div>
          </div>
        </div>
      </section>

      <section className="home-admissions section">
        <div className="wrap">
          <div className="section-kicker"><span className="eyebrow">Admissions</span><Link to="/faq" className="textlink">Questions? Read the FAQ</Link></div>
          <h2>A straightforward route into Hill Springs.</h2>
          <div className="admission-steps">
            {(SCHOOL.steps || []).map((step, n) => (
              <div className="admission-step" key={step.title}>
                <span>0{n + 1}</span><h3>{step.title}</h3><p>{step.text}</p>
              </div>
            ))}
          </div>
          <div className="btns">
            <Link className="btn" to="/apply">Apply online</Link>
            <Link className="btn ghost" to="/enquire?subject=Admissions&topic=contact">Talk to admissions</Link>
          </div>
        </div>
      </section>

      <section className="home-contact section">
        <div className="wrap contact-grid">
          <div>
            <span className="eyebrow">Come and see us</span>
            <h2>Hill Springs Academy</h2>
            <p>{SCHOOL.address}</p>
            <p><a href={`tel:${SCHOOL.phoneTel}`}>{SCHOOL.phone}</a><br /><a href={`tel:${SCHOOL.phone2Tel}`}>{SCHOOL.phone2}</a></p>
            <div className="btns"><Link className="btn" to="/enquire?subject=School%20visit&topic=contact">Contact the school</Link><Link className="btn ghost" to="/contact">Directions & contact</Link></div>
          </div>
          <div className="contact-card">
            <span className="eyebrow">For families</span>
            <Link to="/fees">Fees</Link>
            <Link to="/uniforms">Uniforms</Link>
            <Link to="/reading-materials">Learning resources</Link>
            <Link to="/parent">Parent portal</Link>
          </div>
        </div>
      </section>

      <section className="home-final-cta">
        <div className="wrap">
          <span className="eyebrow">Your next step</span>
          <h2>Ready to know more about Hill Springs?</h2>
          <p>Ask a question, arrange a visit or begin an application.</p>
          <div className="btns"><Link className="btn white" to="/apply">Start an application</Link><Link className="btn dark-outline" to="/enquire?subject=General%20enquiry&topic=contact">Make an enquiry</Link></div>
        </div>
      </section>
    </>
  );
}
