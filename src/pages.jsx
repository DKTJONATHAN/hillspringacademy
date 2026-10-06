import { Link } from "react-router-dom";
import { SCHOOL, GALLERY } from "./data.js";
import { Photo } from "./components.jsx";

const campusPhoto = GALLERY.find((g) => g.cat === "Campus") || { src: "/Gallery/school-gate.webp", alt: "Hill Springs Academy school gate in Maua" };
const transportPhoto = GALLERY.find((g) => g.cat === "Transport") || { src: "/Gallery/school-bus.webp", alt: "Hill Springs Academy school bus in Maua" };

export function Home() {
  const levels = SCHOOL.levels || SCHOOL.stages || [];
  const galleryPhotos = [
    { src: "/Gallery/school-gate.webp", alt: "Hill Springs Academy school gate in Maua" },
    { src: "/Gallery/WhatsApp Image 2026-10-05 at 05.07.23.jpeg", alt: "Hill Springs Academy school life" },
    { src: "/Gallery/WhatsApp Image 2026-10-05 at 05.07.26.jpeg", alt: "Hill Springs Academy school life" },
  ];
  const uniformPhotos = [
    { src: "/junior-primary-boy.jfif", title: "Primary School", text: "Primary uniform" },
    { src: "/senior-primary-boy.jfif", title: "Junior Secondary", text: "JSS uniform" },
    { src: "/senior-primary-girl-with-jumper.jfif", title: "JSS sweater", text: "JSS cold-weather option" },
  ];

  return (
    <>
      <section className="school-hero">
        <div className="school-hero-media">
          <img src="/Gallery/school-gate.webp" alt="Hill Springs Academy school gate in Maua" />
        </div>
        <div className="school-hero-shade" />
        <div className="wrap school-hero-content">
          <span className="eyebrow">Maua · Meru County · Kenya</span>
          <h1>Hill Springs Academy</h1>
          <p>Building an excellent foundation for a brighter future.</p>
          <div className="btns">
            <Link className="btn hero-primary" to="/apply">Apply to the school</Link>
            <Link className="btn hero-secondary" to="/enquire?subject=School%20visit&topic=contact">Make an enquiry</Link>
          </div>
        </div>
      </section>

      <section className="home-quicklinks">
        <div className="wrap quicklink-grid">
          <Link to="/admissions"><strong>Admissions</strong><span>How to join Hill Springs</span><b>→</b></Link>
          <Link to="/academics"><strong>Academics</strong><span>Explore our CBE journey</span><b>→</b></Link>
          <Link to="/fees"><strong>Fees</strong><span>View fee information</span><b>→</b></Link>
          <Link to="/contact"><strong>Contact</strong><span>Talk to the school</span><b>→</b></Link>
        </div>
      </section>

      <section className="section home-welcome">
        <div className="wrap welcome-grid">
          <div className="welcome-copy">
            <span className="eyebrow">Welcome to Hill Springs</span>
            <h2>A school where children can learn, grow and find their confidence.</h2>
            <p>{SCHOOL.intro}</p>
            <p>We serve learners from Kindergarten and Pre-Primary through Junior School, with learning guided by Kenya's Competency-Based Education framework.</p>
            <Link className="textlink" to="/about">Learn about Hill Springs</Link>
          </div>
          <div className="welcome-facts">
            <div><span>01</span><strong>Kindergarten</strong><p>Early learning and discovery.</p></div>
            <div><span>02</span><strong>Pre-Primary</strong><p>Strong foundations for learning.</p></div>
            <div><span>03</span><strong>Junior School</strong><p>Growing skills, knowledge and independence.</p></div>
          </div>
        </div>
      </section>

      <section className="section home-academics">
        <div className="wrap">
          <div className="home-section-head">
            <div><span className="eyebrow">Academics</span><h2>Learning at every stage.</h2></div>
            <Link className="textlink" to="/academics">Explore academics</Link>
          </div>
          <div className="level-grid">
            {levels.map((level, i) => (
              <Link to="/academics" className="level-card" key={level.title}>
                <span>0{i + 1}</span>
                <h3>{level.title}</h3>
                <p>{level.text}</p>
                <b>Explore level →</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section home-life">
        <div className="wrap">
          <div className="home-section-head">
            <div><span className="eyebrow">School life</span><h2>See something of the place.</h2></div>
            <Link className="textlink" to="/gallery">View gallery</Link>
          </div>
          <div className="life-photo-grid">
            {galleryPhotos.map((photo, i) => (
              <div className={`life-photo life-photo-${i + 1}`} key={photo.src}><img src={photo.src} alt={photo.alt} /></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section home-uniforms">
        <div className="wrap">
          <div className="home-section-head">
            <div><span className="eyebrow">Uniform guide</span><h2>Primary and JSS, clearly separated.</h2></div>
            <Link className="textlink" to="/uniforms">View full uniform guide</Link>
          </div>
          <div className="home-uniform-grid">
            {uniformPhotos.map((photo) => (
              <Link className="home-uniform-card" to="/uniforms" key={photo.src}>
                <div><img src={photo.src} alt={photo.title} /></div>
                <strong>{photo.title}</strong><span>{photo.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section home-admissions">
        <div className="wrap admissions-home-grid">
          <div>
            <span className="eyebrow">Admissions</span>
            <h2>Thinking about Hill Springs for your child?</h2>
            <p>Start with an enquiry, arrange a visit and then submit an application when you are ready.</p>
          </div>
          <div className="admissions-home-steps">
            {(SCHOOL.steps || []).slice(0, 3).map((step, i) => (
              <div key={step.title}><span>0{i + 1}</span><strong>{step.title}</strong><p>{step.text}</p></div>
            ))}
          </div>
          <div className="btns">
            <Link className="btn" to="/apply">Start an application</Link>
            <Link className="btn ghost" to="/enquire?subject=Admissions&topic=contact">Talk to admissions</Link>
          </div>
        </div>
      </section>

      <section className="home-contact-band">
        <div className="wrap contact-band-grid">
          <div><span className="eyebrow">Visit Hill Springs</span><h2>Come and see the school.</h2><p>{SCHOOL.address}</p></div>
          <div className="contact-band-actions">
            <a href={`tel:${SCHOOL.phoneTel}`}>{SCHOOL.phone}</a>
            <a href={`mailto:${SCHOOL.admissionsEmail}`}>{SCHOOL.admissionsEmail}</a>
            <Link className="btn white" to="/contact">Directions & contact</Link>
          </div>
        </div>
      </section>
    </>
  );
}
