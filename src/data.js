/* ---------- EDIT SCHOOL CONTENT HERE ----------
   Verified: name, town, emails, developer credit.
   Everything else is placeholder copy: replace with the school's real details.
   Empty strings are hidden automatically. */
import { GALLERY_AUTO } from "./gallery.auto.js";

/** Build a safe public URL for a file under public/reading-material/ */
const resourceFile = (name) => "/reading-material/" + encodeURIComponent(name);

export const SCHOOL = {
  siteUrl: "https://hillspringsacademy.sc.ke",
  name: "Hill Springs Academy",
  short: "Hill Springs",
  town: "Maua, Igembe South, Meru County, Kenya",
  centreCode: "15309228",
  admissionsEmail: "admissions@hillspringsacademy.sc.ke",
  infoEmail: "info@hillspringsacademy.sc.ke",
  phone: "+254 710 572419",
  phoneTel: "+254710572419",
  phone2: "0733 693 685",
  phone2Tel: "+254733693685",
  poBox: "P.O. Box 377-60600 Maua",
  applyLevels: ["Playgroup","PP1","PP2","Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7","Grade 8","Grade 9"],
  adminEmails: [],
  address: "P.O. Box 377-60600 Maua, Igembe South, Meru County, Kenya",
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
  // Files live in public/reading-material/
  readingMaterials: [
    // —— Grade 1 ——
    {
      title: "Hygiene Grade 1 Notes",
      grade: "Grade 1",
      description: "Hygiene learning notes for Grade 1.",
      file: resourceFile("HYG GRADE 1 NOTES.pdf"),
    },
    // —— Grade 4 ——
    {
      title: "CRE Grade 4 Notes",
      grade: "Grade 4",
      description: "Christian Religious Education notes for Grade 4.",
      file: resourceFile("CRE GRADE 4 NOTE..pdf"),
    },
    {
      title: "Home Science Grade 4 Notes",
      grade: "Grade 4",
      description: "Home Science notes for Grade 4.",
      file: resourceFile("HSCI GRADE 4 NOTES.pdf"),
    },
    {
      title: "Music Grade 4 Notes",
      grade: "Grade 4",
      description: "Music notes for Grade 4.",
      file: resourceFile("MUSIC GRADE 4 NOTES.pdf"),
    },
    {
      title: "Physical Education Grade 4 Notes",
      grade: "Grade 4",
      description: "Physical Education notes for Grade 4.",
      file: resourceFile("PE GRADE 4 NOTES.pdf"),
    },
    {
      title: "Social Studies Grade 4 Notes",
      grade: "Grade 4",
      description: "Social Studies notes for Grade 4.",
      file: resourceFile("SST GRADE 4 NOTES..pdf"),
    },
    // —— Grade 5 ——
    {
      title: "CRE Grade 5 Notes",
      grade: "Grade 5",
      description: "Christian Religious Education notes for Grade 5.",
      file: resourceFile("CRE GRADE 5 NOTES.pdf"),
    },
    {
      title: "Social Studies Grade 5 Notes",
      grade: "Grade 5",
      description: "Social Studies notes for Grade 5.",
      file: resourceFile("SOCIAL GRADE 5 NOTES.pdf"),
    },
    // —— Grade 7 (SBA 2026) ——
    {
      title: "CRE Grade 7 SBA Question Paper 2026",
      grade: "Grade 7",
      description: "Christian Religious Education school-based assessment question paper (Regular), 2026.",
      file: resourceFile("CRE Grade 7 SBA QP 2026  Regular.pdf"),
    },
    {
      title: "English Grade 7 Section A — Learner's Copy 2026",
      grade: "Grade 7",
      description: "English Section A assessment for learners, 2026.",
      file: resourceFile("GRADE 7 SECTION A LEARNER'S 2026.pdf"),
    },
    {
      title: "Integrated Science Grade 7 Question Paper",
      grade: "Grade 7",
      description: "Integrated Science Grade 7 question paper.",
      file: resourceFile("INTSCI G7 QP.pdf"),
    },
    {
      title: "Kiswahili Grade 7 Sehemu A — Nakala ya Mwanafunzi 2026",
      grade: "Grade 7",
      description: "Kiswahili Sehemu A, nakala ya mwanafunzi, 2026.",
      file: resourceFile("KISWAHILI GRADE 7 SEHEMU A NAKALA YA MWANAFUNZI 2026.pdf"),
    },
    {
      title: "Kiswahili Grade 7 Sehemu B Question Paper 2026",
      grade: "Grade 7",
      description: "Kiswahili Sehemu B question paper (Regular & PI), 2026.",
      file: resourceFile("KISWAHILI GRADE 7 SEHEMU B QUESTION PAPER 2026 Regular & PI.pdf"),
    },
    {
      title: "Mathematics Grade 7 SBA Question Paper",
      grade: "Grade 7",
      description: "Mathematics school-based assessment question paper for Grade 7.",
      file: resourceFile("MATHEMATICS GRADE 7 SBA - QP.pdf"),
    },
    {
      title: "Pre-Technical Grade 7 SBA Question Paper",
      grade: "Grade 7",
      description: "Pre-Technical studies school-based assessment question paper.",
      file: resourceFile("PRETECHNICAL GRADE 7 SBA QP.pdf"),
    },
    {
      title: "Creative Arts & Sports Grade 7 SBA",
      grade: "Grade 7",
      description: "Creative Arts and Sports (CAS) Grade 7 SBA question paper.",
      file: resourceFile("QP CAS GRADE 7 SBA.pdf"),
    },
    {
      title: "Social Studies Grade 7 SBA Question Paper",
      grade: "Grade 7",
      description: "Social Studies (SST) Grade 7 school-based assessment question paper.",
      file: resourceFile("SST QP GRADE 7 SBA..pdf"),
    },
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
    { q: "How do I get an admission form?", a: "Email admissions@hillspringsacademy.sc.ke and we will send it to you." },
    { q: "Can I visit the school before applying?", a: "Yes. Contact the admissions office to arrange a visit." },
    { q: "Does Hill Springs Academy offer school transport?", a: "Yes. Contact admissions to confirm current route coverage, availability, arrangements and charges." },
    { q: "Where can I find fee information?", a: "Ask the admissions office for the current fee structure." },
  ],
  news: [
    { date: "", title: "Admissions are open", text: "Create a free parent account and apply online to start an application." },
  ],
};

const GALLERY_OVERRIDES = {
  "school-gate.webp": { alt: "Hill Springs Academy school gate in Maua, Meru County", cat: "Campus" },
  "school-bus.webp": { alt: "Hill Springs Academy school bus in Maua", cat: "Transport" },
};

export const GALLERY = GALLERY_AUTO.map((item) => {
  const o = GALLERY_OVERRIDES[item.file] || {};
  return { src: item.src, alt: o.alt || item.alt, cat: o.cat || item.cat };
});

/** Hero carousel — 4 slides, auto-swipe in the home Carousel component */
export const HERO = [
  {
    src: "/logo.png",
    alt: "Hill Springs Academy logo",
    title: "Hill Springs Academy",
    text: "A private CBE school in Maua, Meru County.",
  },
  {
    src: "/primary-school-jumper.jfif",
    alt: "Primary School official jumper",
    title: "Primary School jumper",
    text: "Official Primary School uniform jumper for cooler days.",
  },
  {
    src: "/senior-primary-girl-with-jumper.jfif",
    alt: "Junior Secondary School (JSS) uniform with jumper",
    title: "JSS uniform jumper",
    text: "Official Junior Secondary School jumper combination.",
  },
  {
    src: "/Gallery/school-bus.webp",
    alt: "Hill Springs Academy school bus in Maua",
    title: "School transport",
    text: "Transport for learners — confirm routes with admissions.",
  },
];
