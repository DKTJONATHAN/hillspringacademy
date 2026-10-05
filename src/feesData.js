/** Official Fees Structure 2026 — Hill Springs Academy */

export const FEES_META = {
  year: "2026",
  admissionNewPupil: "1,000",
  covers: [
    "Lunch",
    "School fees",
    "Midmorning cup of porridge",
    "Exams",
    "Stationeries (e.g. exercise books, sharpeners and book covers)",
  ],
  transportNote: "Transport is charged according to distance.",
  banks: [
    { bank: "K.C.B Bank Maua", account: "1207826952", name: "HILL SPRINGS ACADEMY" },
    { bank: "Equity Bank Maua", account: "0400279398615", name: "HILL SPRINGS ACADEMY" },
  ],
};

/** Fee bands from the official sheet */
export const FEE_BANDS = [
  {
    id: "playgroup-pp1-pp2",
    title: "Playgroup, PP1 and PP2",
    classes: ["Playgroup", "PP1", "PP2"],
    terms: [
      { term: "Term 1", amount: "10,500" },
      { term: "Term 2", amount: "10,500" },
      { term: "Term 3", amount: "10,000" },
    ],
  },
  {
    id: "grade-1-2-3",
    title: "Grade 1, 2 and 3",
    classes: ["Grade 1", "Grade 2", "Grade 3"],
    terms: [
      { term: "Term 1", amount: "12,000" },
      { term: "Term 2", amount: "12,000" },
      { term: "Term 3", amount: "11,500" },
    ],
  },
  {
    id: "grade-4-5-6",
    title: "Grade 4, 5 and 6",
    classes: ["Grade 4", "Grade 5", "Grade 6"],
    terms: [
      { term: "Term 1", amount: "13,000" },
      { term: "Term 2", amount: "13,000" },
      { term: "Term 3", amount: "12,500" },
    ],
  },
  {
    id: "grade-7-8-9",
    title: "Grade 7, 8 and 9",
    classes: ["Grade 7", "Grade 8", "Grade 9"],
    terms: [
      { term: "Term 1", amount: "15,500" },
      { term: "Term 2", amount: "15,500" },
      { term: "Term 3", amount: "15,500" },
    ],
  },
];

/** Flat list for clicking a single class */
export const FEE_CLASSES = FEE_BANDS.flatMap((band) =>
  band.classes.map((name) => ({
    name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    band,
  }))
);

function pdfEscape(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

/** Minimal single-page PDF (no external libraries). */
export function buildFeePdfBlob({ focusLabel, band }) {
  const lines = [];
  const add = (x, y, size, text, bold = false) => {
    lines.push("BT");
    lines.push(`/${bold ? "F2" : "F1"} ${size} Tf`);
    lines.push(`${x} ${y} Td`);
    lines.push(`(${pdfEscape(text)}) Tj`);
    lines.push("ET");
  };

  // Page size A4 in points
  const W = 595;
  const H = 842;
  let y = H - 50;

  // Red header bar via filled rect
  const headerOps = [
    "0.784 0.063 0.180 rg",
    `0 ${H - 70} ${W} 70 re f`,
    "1 1 1 rg",
  ];

  const content = [];
  content.push(...headerOps);
  content.push("BT /F2 16 Tf 40 805 Td (HILL SPRINGS ACADEMY) Tj ET");
  content.push("BT /F1 9 Tf 40 788 Td (P.O. Box 377-60600 Maua  |  Tel: +254 710 572419) Tj ET");
  content.push("BT /F1 9 Tf 40 775 Td (admissions@hillspringsacademy.sc.ke) Tj ET");

  y = H - 100;
  content.push("0.1 0.11 0.125 rg");
  content.push(`BT /F2 14 Tf 40 ${y} Td (Fees Structure ${FEES_META.year}) Tj ET`);
  y -= 22;
  content.push("0.784 0.063 0.180 rg");
  content.push(`BT /F2 13 Tf 40 ${y} Td (${pdfEscape(focusLabel)}) Tj ET`);
  y -= 16;
  if (focusLabel !== band.title) {
    content.push("0.35 0.4 0.45 rg");
    content.push(`BT /F1 9 Tf 40 ${y} Td (Fee band: ${pdfEscape(band.title)}) Tj ET`);
    y -= 18;
  } else {
    y -= 8;
  }

  // Term amounts
  content.push("0.1 0.11 0.125 rg");
  let x = 40;
  for (const t of band.terms) {
    content.push(`BT /F1 9 Tf ${x} ${y} Td (${pdfEscape(t.term)}) Tj ET`);
    content.push(`BT /F2 14 Tf ${x} ${y - 18} Td (Ksh ${pdfEscape(t.amount)}) Tj ET`);
    x += 160;
  }
  y -= 40;

  content.push("0.784 0.063 0.180 rg");
  content.push(`BT /F2 10 Tf 40 ${y} Td (Admission for new pupils \320 Ksh ${FEES_META.admissionNewPupil}) Tj ET`.replace("\320", "—"));
  // Use ASCII hyphen to avoid encoding issues
  content.pop();
  content.push(`BT /F2 10 Tf 40 ${y} Td (Admission for new pupils - Ksh ${FEES_META.admissionNewPupil}) Tj ET`);
  y -= 22;

  content.push("0.1 0.11 0.125 rg");
  content.push(`BT /F2 10 Tf 40 ${y} Td (The above amount covers:) Tj ET`);
  y -= 16;
  for (const item of FEES_META.covers) {
    content.push(`BT /F1 10 Tf 48 ${y} Td (${pdfEscape("• " + item)}) Tj ET`);
    y -= 14;
  }
  y -= 6;
  content.push("0.35 0.4 0.45 rg");
  content.push(`BT /F1 9 Tf 40 ${y} Td (${pdfEscape(FEES_META.transportNote)}) Tj ET`);
  y -= 24;

  content.push("0.1 0.11 0.125 rg");
  content.push(`BT /F2 10 Tf 40 ${y} Td (Pay school fees through the following banks only:) Tj ET`);
  y -= 18;
  for (const b of FEES_META.banks) {
    content.push(`BT /F2 10 Tf 40 ${y} Td (${pdfEscape(b.bank)}) Tj ET`);
    y -= 13;
    content.push(`BT /F1 9 Tf 40 ${y} Td (${pdfEscape("A/C No: " + b.account)}) Tj ET`);
    y -= 12;
    content.push(`BT /F1 9 Tf 40 ${y} Td (${pdfEscape("A/C Name: " + b.name)}) Tj ET`);
    y -= 20;
  }

  content.push("0.35 0.4 0.45 rg");
  content.push(`BT /F1 8 Tf 40 40 Td (Confirm amounts with admissions. Generated for parents and staff reference.) Tj ET`);

  const stream = content.join("\n");
  const streamLen = new TextEncoder().encode(stream).length;

  // Build PDF with objects
  const parts = [];
  parts.push("%PDF-1.4\n");

  const objs = [];
  const o1 = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
  const o2 = "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";
  const o3 = `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n`;
  const o4 = `4 0 obj\n<< /Length ${streamLen} >>\nstream\n${stream}\nendstream\nendobj\n`;
  const o5 = "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n";
  const o6 = "6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n";
  objs.push(o1, o2, o3, o4, o5, o6);

  let offset = parts[0].length;
  const xref = [0];
  for (const o of objs) {
    xref.push(offset);
    parts.push(o);
    offset += o.length;
  }

  const xrefStart = offset;
  let xrefTable = `xref\n0 ${objs.length + 1}\n`;
  xrefTable += "0000000000 65535 f \n";
  for (let i = 1; i < xref.length; i++) {
    xrefTable += String(xref[i]).padStart(10, "0") + " 00000 n \n";
  }
  parts.push(xrefTable);
  parts.push(`trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`);

  const pdfText = parts.join("");
  return new Blob([pdfText], { type: "application/pdf" });
}

export function downloadFeePdf(classOrBand) {
  const isBand = FEE_BANDS.some((b) => b.id === classOrBand.id);
  const band = isBand ? classOrBand : classOrBand.band;
  const focusLabel = isBand ? band.title : classOrBand.name;
  const slug = isBand ? band.id : classOrBand.slug;
  const blob = buildFeePdfBlob({ focusLabel, band });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Hill-Springs-Academy-Fees-${slug}-2026.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
