/* ---------- EDIT SCHOOL CONTENT HERE ----------
   Verified: name, town, emails, developer credit.
   Everything else is placeholder copy: replace with the school's real details.
   Empty strings are hidden automatically. */
import { GALLERY_AUTO } from "./gallery.auto.js";

export const SCHOOL = {
  siteUrl: "https://hillspringsacademy.sc.ke",
  name: "Hill Springs Academy",
  short: "Hill Springs",
  town: "Maua, Igembe South, Meru County, Kenya",
  centreCode: "15309228",
  admissionsEmail: "admissions@hillspringacademy.sc.ke",
  infoEmail: "info@hillspringacademy.sc.ke",
  phone: "",
  // Levels shown in the application form dropdown. Edit freely.
  applyLevels: ["Playgroup","PP1","PP2","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7","Grade 8","Grade 9"],
  // Optional: extra admin emails remembered in the browser (the server still decides who is an admin).
  adminEmails: [],
  address: "Maua, Igembe South, Meru County, Kenya",
  hours: "",
  motto: "BUILDING AN EXCELLENT FOUNDATION FOR A BRIGHTER FUTURE",
  intro:
    "Hill Springs Academy is a private CBE school in Maua, Igembe South, Meru County, Kenya. We offer Kindergarten, Pre-Primary and Junior School under Kenya’s Competency-Based Education.",
  social: { facebook: "", instagram: "", x: "", youtube: "" },
  videos: [
    { id: "VzVgnbuUIPQ", title: "Alphabet sounds (CBC)", text: "Phonics and letter sounds for Playgroup, PP1 and PP2 — aligned with the Kenyan CBC system." },
    { id: "YxcIXoig-J8", title: "Writing numbers 1 to 10", text: "Mathematical activities for early learners: how to write numbers 1–10 (CBC)." },
    { id: "OUWqFYSSxKQ", title: "Wild and domestic animals", text: "Learn types of animals — a CBC science topic for Playgroup through lower grades." },
    { id: "C2ZLewPxZtc", title: "Water cycle experiment (Ubongo Kids)", text: "African educational cartoon that shows the water cycle through a simple home experiment." },
    { id: "cQ9dO9leHL0", title: "Vowel sounds", text: "Vowel sounds for Playgroup, PP1 and PP2 under the CBC system." },
    { id: "uwK-cVMt_08", title: "Counting 1 to 30", text: "Mathematical activities: counting numbers 1 to 30 for CBC early years." },
  ],
  get videoIds() { return this.videos.map(v => v.id); },
  readingMaterials: [
    { title: "Grade 1 English Reading Material", grade: "Grade 1", description: "Reading practice and language activities.", file: "/reading-materials/grade-1-english.pdf" },
    { title: "Grade 2 Mathematics Practice", grade: "Grade 2", description: "Mathematics revision and practice exercises.", file: "/reading-materials/grade-2-mathematics.pdf" },
    { title: "Grade 3 Science Notes", grade: "Grade 3", description: "Science learning notes for revision.", file: "/reading-materials/grade-3-science.pdf" },
    { title: "Grade 4 English Reading Material", grade: "Grade 4", description: "Reading comprehension and language practice.", file: "/reading-materials/grade-4-english.pdf" },
    { title: "Grade 5 Mathematics Revision", grade: "Grade 5", description: "Revision notes and practice questions.", file: "/reading-materials/grade-5-mathematics.pdf" },
    { title: "Grade 6 Science Notes", grade: "Grade 6", description: "Science notes and revision material.", file: "/reading-materials/grade-6-science.pdf" },
    { title: "Grade 7 General Reading Material", grade: "Grade 7", description: "Learning and revision material for learners.", file: "/reading-materials/grade-7-reading.pdf" },
    { title: "Grade 8 General Reading Material", grade: "Grade 8", description: "Learning and revision material for learners.", file: "/reading-materials/grade-8-reading.pdf" },
    { title: "Grade 9 General Reading Material", grade: "Grade 9", description: "Learning and revision material for learners.", file: "/reading-materials/grade-9-reading.pdf" },
  ],
  values: [
    { title: "Learning", text: "Curious, well-taught learners who understand more than they memorise." },
    { title: "Character", text: "Respect, honesty and responsibility practised every day." },
    { title: "Community", text: "Parents, teachers and learners working together." },
  ],
  stages: [
    { title: "Kindergarten", text: "A nurturing early-learning stage where play, stories, movement, creativity and guided discovery support confidence and foundational development." },
    { title: "Pre-Primary", text: "Early learning builds language, communication, number sense, social skills, creativity and positive learning habits through age-appropriate activities." },
    { title: "Junior School", text: "Junior School learning develops stronger subject understanding, practical skills, collaboration, independent study and preparation for the next stage of education." },
  ],
  levels: [
    { title: "Kindergarten", text: "A nurturing early-learning stage where play, stories, movement, creativity and guided discovery support confidence and foundational development." },
    { title: "Pre-Primary", text: "Early learning builds language, communication, number sense, social skills, creativity and positive learning habits through age-appropriate activities." },
    { title: "Junior School", text: "Junior School learning develops stronger subject understanding, practical skills, collaboration, independent study and preparation for the next stage of education." },
  ],
  subjects: ["English", "Kiswahili", "Mathematics", "Science and Technology", "Social Studies", "Creative Arts", "Religious Education", "Physical Education"],
  activities: ["Sports and games", "Music and drama", "Clubs and societies", "ICT and digital skills", "Community service"],
  learningApproach: [
    { title: "Competency development", text: "Learning focuses on knowledge, skills, values and positive attitudes, with clear opportunities for learners to apply what they know." },
    { title: "Literacy and numeracy", text: "Strong foundations in reading, writing, communication and mathematics support learning across the curriculum." },
    { title: "Practical learning", text: "Inquiry, projects, discussion and real-life examples help children connect classroom ideas to everyday life." },
    { title: "Character and values", text: "Respect, responsibility, honesty, cooperation and care for others are part of a balanced education." },
  ],
  parentInfo: [
    { title: "Admissions guidance", text: "Create a parent account to submit an application online. Contact the admissions office for available places, reporting requirements and the latest fee information." },
    { title: "Learning support", text: "Families can discuss a learner's transition, learning needs and progress with the school so that appropriate support can be planned." },
    { title: "Communication", text: "This website provides public information. For learner-specific or confidential matters, please contact the school directly." },
  ],
  steps: [
    { title: "Enquire", text: "Email the admissions office to request the admission form and current fee details." },
    { title: "Apply", text: "Submit the completed form with the required learner documents." },
    { title: "Visit", text: "Tour the school and meet the admissions team." },
    { title: "Join", text: "Receive your admission decision and reporting details." },
  ],
  documents: ["Completed admission form", "Copy of birth certificate", "Recent passport photos", "Previous school report (if transferring)"],
  siteKeywords: [
    "Hill Springs Academy",
    "Hill Springs Academy Maua",
    "Hill Springs",
    "schools in Maua",
    "private schools in Maua",
    "Maua Meru County",
    "CBE school Maua",
    "private school Igembe South",
    "primary school in Maua",
    "Hill Sprungs Academy",
    "Hillsprings Academy Maua",
    "Kenyan CBC school"
  ],
  faqs: [
    { q: "How do I get an admission form?", a: "Email admissions@hillspringacademy.sc.ke and we will send it to you." },
    { q: "Can I visit the school before applying?", a: "Yes. Contact the admissions office to arrange a visit." },
    { q: "Does Hill Springs Academy offer school transport?", a: "Yes. Contact admissions to confirm current route coverage, availability, arrangements and charges." },
    { q: "Where can I find fee information?", a: "Ask the admissions office for the current fee structure." },
  ],
  news: [
    { date: "", title: "Admissions are open", text: "Create a free parent account and apply online to start an application." },
  ],
};

/*
  Gallery photos are auto-discovered from public/Gallery/ at build/dev time.
  Just drop .webp / .jpg / .png / .gif / .avif files there — no code change needed.
  Optional: override alt text or category for a specific file name below.
*/
const GALLERY_OVERRIDES = {
  "school-gate.webp": { alt: "Hill Springs Academy school gate in Maua, Meru County", cat: "Campus" },
  "school-bus.webp": { alt: "Hill Springs Academy school bus in Maua", cat: "Transport" },
};

export const GALLERY = GALLERY_AUTO.map((item) => {
  const o = GALLERY_OVERRIDES[item.file] || {};
  return { src: item.src, alt: o.alt || item.alt, cat: o.cat || item.cat };
});

/* Hero: prefer known campus photos when present, otherwise first gallery images */
function pickHero() {
  const byFile = Object.fromEntries(GALLERY_AUTO.map((g) => [g.file, g]));
  const preferred = ["school-gate.webp", "school-bus.webp"];
  const slides = [];
  for (const f of preferred) {
    if (byFile[f]) slides.push(byFile[f]);
  }
  for (const g of GALLERY_AUTO) {
    if (slides.length >= 3) break;
    if (!preferred.includes(g.file)) slides.push(g);
  }
  const defaults = [
    { title: "Hill Springs Academy, Maua", text: "A private CBE school in Meru County." },
    { title: "Getting to school", text: "Transport for learners — confirm routes with admissions." },
    { title: "A place to grow", text: "Kindergarten, Pre-Primary and Junior School." },
  ];
  return slides.slice(0, 3).map((g, i) => ({
    src: g.src,
    alt: (GALLERY_OVERRIDES[g.file] && GALLERY_OVERRIDES[g.file].alt) || g.alt,
    title: defaults[i]?.title || "Hill Springs Academy",
    text: defaults[i]?.text || "Maua, Meru County",
  }));
}

export const HERO = pickHero();
