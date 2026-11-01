/** Official Hill Springs Academy fee schedule.
 * The published academic year advances every 1 November in Kenya time.
 * Fee amounts remain unchanged until the school edits FEE_BANDS.
 */
export function getFeesYear() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "numeric",
  }).formatToParts(new Date());
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  return String(year + (month >= 11 ? 1 : 0));
}

export const FEES_META = {
  get year() { return getFeesYear(); },
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

/** Load the school's actual logo and encode it as JPEG for a compact PDF image. */
async function loadPdfLogo() {
  const response = await fetch("/logo.png");
  if (!response.ok) throw new Error("Could not load the school logo for the PDF.");
  const bitmap = await createImageBitmap(await response.blob());
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, 256, 256);
  context.drawImage(bitmap, 0, 0, 256, 256);
  bitmap.close?.();
  const encoded = canvas.toDataURL("image/jpeg", 0.94).split(",")[1];
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function pdfBytes(text) {
  return new TextEncoder().encode(text);
}

function joinPdfBytes(chunks) {
  const length = chunks.reduce((total, chunk) => total + chunk.length, 0);
  const result = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

/** Single-page A4 PDF with the official school logo embedded in the header. */
export async function buildFeePdfBlob({ focusLabel, band }) {
  const W = 595;
  const H = 842;
  const logoBytes = await loadPdfLogo();
  let y = H - 100;
  const content = [];
  content.push("0.784 0.063 0.180 rg");
  content.push(`0 ${H - 70} ${W} 70 re f`);
  content.push("q 48 0 0 48 505 781 cm /Logo Do Q");
  content.push("1 1 1 rg");
  content.push("BT /F2 16 Tf 40 805 Td (HILL SPRINGS ACADEMY) Tj ET");
  content.push("BT /F1 9 Tf 40 788 Td (P.O. Box 377-60600 Maua  |  Tel: +254 710 572419) Tj ET");
  content.push("BT /F1 9 Tf 40 775 Td (admissions@hillspringsacademy.sc.ke) Tj ET");

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

  content.push("0.1 0.11 0.125 rg");
  let x = 40;
  for (const t of band.terms) {
    content.push(`BT /F1 9 Tf ${x} ${y} Td (${pdfEscape(t.term)}) Tj ET`);
    content.push(`BT /F2 14 Tf ${x} ${y - 18} Td (Ksh ${pdfEscape(t.amount)}) Tj ET`);
    x += 160;
  }
  y -= 40;

  content.push("0.784 0.063 0.180 rg");
  content.push(`BT /F2 10 Tf 40 ${y} Td (Admission for new pupils - Ksh ${FEES_META.admissionNewPupil}) Tj ET`);
  y -= 22;

  content.push("0.1 0.11 0.125 rg");
  content.push(`BT /F2 10 Tf 40 ${y} Td (The above amount covers:) Tj ET`);
  y -= 16;
  for (const item of FEES_META.covers) {
    content.push(`BT /F1 10 Tf 48 ${y} Td (${pdfEscape("- " + item)}) Tj ET`);
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
  content.push("BT /F1 8 Tf 40 40 Td (Confirm amounts with admissions. Generated for parents and staff reference.) Tj ET");

  const stream = pdfBytes(content.join("\\n"));
  const logoObject = joinPdfBytes([
    pdfBytes(`7 0 obj\\n<< /Type /XObject /Subtype /Image /Width 256 /Height 256 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${logoBytes.length} >>\\nstream\\n`),
    logoBytes,
    pdfBytes("\\nendstream\\nendobj\\n"),
  ]);
  const objects = [
    pdfBytes("1 0 obj\\n<< /Type /Catalog /Pages 2 0 R >>\\nendobj\\n"),
    pdfBytes("2 0 obj\\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\\nendobj\\n"),
    pdfBytes("3 0 obj\\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> /XObject << /Logo 7 0 R >> >> >>\\nendobj\\n"),
    joinPdfBytes([pdfBytes(`4 0 obj\\n<< /Length ${stream.length} >>\\nstream\\n`), stream, pdfBytes("\\nendstream\\nendobj\\n")]),
    pdfBytes("5 0 obj\\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\\nendobj\\n"),
    pdfBytes("6 0 obj\\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\\nendobj\\n"),
    logoObject,
  ];
  const chunks = [pdfBytes("%PDF-1.4\\n")];
  const offsets = [0];
  let offset = chunks[0].length;
  for (const object of objects) {
    offsets.push(offset);
    chunks.push(object);
    offset += object.length;
  }
  const xrefStart = offset;
  let xref = `xref\\n0 ${objects.length + 1}\\n0000000000 65535 f \\n`;
  for (let i = 1; i < offsets.length; i++) {
    xref += String(offsets[i]).padStart(10, "0") + " 00000 n \\n";
  }
  chunks.push(pdfBytes(xref));
  chunks.push(pdfBytes(`trailer\\n<< /Size ${objects.length + 1} /Root 1 0 R >>\\nstartxref\\n${xrefStart}\\n%%EOF`));
  return new Blob([joinPdfBytes(chunks)], { type: "application/pdf" });
}

export function downloadFeePdf(classOrBand) {
  const isBand = FEE_BANDS.some((b) => b.id === classOrBand.id);
  const band = isBand ? classOrBand : classOrBand.band;
  const focusLabel = isBand ? band.title : classOrBand.name;
  const slug = isBand ? band.id : classOrBand.slug;
  const blob = await buildFeePdfBlob({ focusLabel, band });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Hill-Springs-Academy-Fees-${slug}-${getFeesYear()}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
