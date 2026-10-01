/* ---------- EDIT SCHOOL CONTENT HERE ----------
   Verified: name, town, emails, developer credit.
   Everything else is placeholder copy: replace with the school's real details.
   Empty strings are hidden automatically. */
export const SCHOOL = {
  name: "Hill Spring Academy",
  short: "Hill Spring",
  town: "Maua, Meru County, Kenya",
  admissionsEmail: "admissions@hillspringacademy.sc.ke",
  infoEmail: "info@hillspringacademy.sc.ke",
  phone: "", // "+254 7XX XXX XXX"
  address: "", // "P.O. Box ___, Maua"
  hours: "", // "Mon to Fri, 8:00 am to 4:30 pm"
  motto: "",
  intro:
    "A school in Maua, Meru County, committed to strong academics, good character and a caring community for every learner.",
  social: { facebook: "", instagram: "", x: "", youtube: "" },
  values: [
    { title: "Learning", text: "Curious, well-taught learners who understand more than they memorise." },
    { title: "Character", text: "Respect, honesty and responsibility practised every day." },
    { title: "Community", text: "Parents, teachers and learners working together." },
  ],
  levels: [
    { title: "Pre-Primary", text: "A warm, play-based start that builds early language, number and social skills." },
    { title: "Primary", text: "Solid foundations in literacy, numeracy, science and creative learning." },
    { title: "Junior School", text: "Deeper subject learning, projects and growing independence." },
  ],
  subjects: ["English", "Kiswahili", "Mathematics", "Science and Technology", "Social Studies", "Creative Arts", "Religious Education", "Physical Education"],
  activities: ["Sports and games", "Music and drama", "Clubs and societies", "ICT and digital skills", "Community service"],
  steps: [
    { title: "Enquire", text: "Email the admissions office to ask for the admission form and current fee details." },
    { title: "Apply", text: "Submit the completed form with the required learner documents." },
    { title: "Visit", text: "Tour the school and meet the admissions team." },
    { title: "Join", text: "Receive your admission decision and report-in details." },
  ],
  documents: ["Completed admission form", "Copy of birth certificate", "Recent passport photos", "Previous school report (if transferring)"],
  faqs: [
    { q: "How do I get an admission form?", a: "Email admissions@hillspringacademy.sc.ke and we will send it to you." },
    { q: "Can I visit the school before applying?", a: "Yes. Contact the admissions office to arrange a visit." },
    { q: "Where can I find fee information?", a: "Ask the admissions office for the current fee structure." },
  ],
  news: [
    { date: "", title: "Admissions are open", text: "Email admissions@hillspringacademy.sc.ke to start an application." },
  ],
};

/* Gallery: set src to "/gallery/your-photo.jpg" after adding the file to public/gallery/ */
export const GALLERY = [
  { src: "", alt: "Main school gate", cat: "Campus" },
  { src: "", alt: "Classroom learning", cat: "Classes" },
  { src: "", alt: "Football on the field", cat: "Sports" },
  { src: "", alt: "Morning assembly", cat: "Events" },
  { src: "", alt: "School compound", cat: "Campus" },
  { src: "", alt: "Science lesson", cat: "Classes" },
  { src: "", alt: "Athletics day", cat: "Sports" },
  { src: "", alt: "Prize giving", cat: "Events" },
  { src: "", alt: "Library", cat: "Campus" },
  { src: "", alt: "Computer lab", cat: "Classes" },
  { src: "", alt: "Netball match", cat: "Sports" },
  { src: "", alt: "Cultural day", cat: "Events" },
];

/* Hero slides on the home page. Add "src: '/gallery/photo.jpg'" to show a real photo. */
export const HERO = [
  { src: "", alt: "Photo: learners in class", title: "Welcome to Hill Spring", text: "A caring school community in Maua." },
  { src: "", alt: "Photo: school compound", title: "A place to grow", text: "Good teaching, clear values, supportive staff." },
  { src: "", alt: "Photo: sports and activities", title: "Life beyond the classroom", text: "Sports, music, clubs and more." },
];
