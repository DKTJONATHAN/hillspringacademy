/* ---------- EDIT SCHOOL CONTENT HERE ----------
   Verified: name, town, emails, developer credit.
   Everything else is placeholder copy: replace with the school's real details.
   Empty strings are hidden automatically. */
export const SCHOOL = {
  siteUrl: "https://hillspringsacademy.sc.ke",
  name: "Hill Springs Academy",
  short: "Hill Springs",
  town: "Maua, Igembe South, Meru County, Kenya",
  centreCode: "15309228",
  admissionsEmail: "admissions@hillspringacademy.sc.ke",
  infoEmail: "info@hillspringacademy.sc.ke",
  phone: "",
  address: "",
  hours: "",
  motto: "BUILDING AN EXCELLENT FOUNDATION FOR A BRIGHTER FUTURE",
  intro:
    "Hill Springs Academy is a school in Maua, Meru County, committed to strong academics, good character and a caring community for every learner.",
  social: { facebook: "", instagram: "", x: "", youtube: "" },
  videos: [
    { id: "ncORPosDrjI", title: "The Water Cycle", text: "Dr. Binocs explains evaporation, condensation and precipitation in a fun way." },
    { id: "TD3XSIE4ymo", title: "Water Cycle for Kids", text: "Clear stages of the water cycle with practical examples for young learners." },
    { id: "C2ZLewPxZtc", title: "Water Cycle Experiment (Ubongo Kids)", text: "African educational cartoon that shows the water cycle through a simple experiment." },
    { id: "B77sebHmfdk", title: "Why Does It Rain?", text: "A short, friendly explanation of how rain is formed." },
    { id: "vD-ZwMjRDPU", title: "The Water Cycle (classroom)", text: "Explore how water moves through our world." },
    { id: "R0K7VKkksyc", title: "Where does water come from?", text: "A simple science story for curious learners." },
  ],
  // compatibility for existing Home until VideoCard + Watch more is fully deployed
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
    { title: "Admissions guidance", text: "Contact the admissions office for the current admission form, available places, reporting requirements and the latest fee information." },
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
  siteKeywords: ["Hill Springs Academy", "Hill Springs Academy Maua", "primary school in Maua", "schools in Maua", "school in Igembe South", "schools in Meru County", "CBC school in Meru", "primary school Meru County", "Kenyan CBC school"],
  faqs: [
    { q: "How do I get an admission form?", a: "Email admissions@hillspringacademy.sc.ke and we will send it to you." },
    { q: "Can I visit the school before applying?", a: "Yes. Contact the admissions office to arrange a visit." },
    { q: "Does Hill Springs Academy offer school transport?", a: "Yes. Contact admissions to confirm current route coverage, availability, arrangements and charges." },
    { q: "Where can I find fee information?", a: "Ask the admissions office for the current fee structure." },
  ],
  news: [
    { date: "", title: "Admissions are open", text: "Email admissions@hillspringacademy.sc.ke to start an application." },
  ],
};

/* Gallery: set src to "/gallery/your-photo.jpg" after adding the file to public/gallery/ */
export const GALLERY = [
  { src: "/Gallery/school-gate.webp", alt: "Hill Springs Academy school gate", cat: "Campus" },
  { src: "https://images.pexels.com/photos/5905450/pexels-photo-5905450.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "African pupils learning in a classroom, photographed from behind", cat: "Classes" },
  { src: "https://images.pexels.com/photos/5905438/pexels-photo-5905438.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Pupils working in a classroom, photographed from behind", cat: "Junior School" },
  { src: "https://images.pexels.com/photos/5905919/pexels-photo-5905919.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Students learning with a teacher, viewed from behind", cat: "Classes" },
  { src: "/Gallery/school-bus.webp", alt: "Hill Springs Academy school bus", cat: "Transport" },
  { src: "https://images.pexels.com/photos/5905450/pexels-photo-5905450.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Pupils concentrating on schoolwork in a classroom", cat: "Classes" },
  { src: "https://images.pexels.com/photos/5905438/pexels-photo-5905438.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Learners studying together in a classroom", cat: "Junior School" },
  { src: "https://images.pexels.com/photos/5905928/pexels-photo-5905928.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Young learners engaged in classroom activities", cat: "Kindergarten" },
  { src: "https://images.pexels.com/photos/5905450/pexels-photo-5905450.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Learners reading and writing in a classroom", cat: "Pre-Primary" },
  { src: "https://images.pexels.com/photos/5905438/pexels-photo-5905438.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Junior School learners working at desks", cat: "Junior School" },
  { src: "https://images.pexels.com/photos/5905928/pexels-photo-5905928.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Young learners participating in classroom learning", cat: "Kindergarten" },
  { src: "https://images.pexels.com/photos/5905919/pexels-photo-5905919.jpeg?auto=compress&cs=tinysrgb&w=800", alt: "Classroom learning activity with pupils viewed from behind", cat: "Pre-Primary" },
];

/* Hero slides on the home page. Prefer local images for performance. */
export const HERO = [
  { src: "/Gallery/school-gate.webp", alt: "Hill Springs Academy school gate", title: "Welcome to Hill Springs Academy", text: "A school community in Maua, Meru County." },
  { src: "https://images.pexels.com/photos/5905450/pexels-photo-5905450.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "African pupils learning in a classroom, photographed from behind", title: "Learning that lasts", text: "Kindergarten, Pre-Primary and Junior School." },
  { src: "https://images.pexels.com/photos/5905928/pexels-photo-5905928.jpeg?auto=compress&cs=tinysrgb&w=900", alt: "Young African learners in a classroom activity", title: "Early learning", text: "Age-appropriate discovery that builds confidence." },
];
