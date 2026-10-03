// Branded email layer for Hill Springs Academy.
// Palette: red #c8102e, black #202124, greys, white. No gradients (email-client safe).
export const SITE_URL = (Deno.env.get("SITE_URL") || "https://hillspringsacademy.sc.ke").replace(/\/$/, "");
export const SCHOOL_NAME = "Hill Springs Academy";
export const SCHOOL_EMAIL = "info@hillspringsacademy.sc.ke";
export const ADMISSIONS_EMAIL = "admissions@hillspringsacademy.sc.ke";
export const FROM = `${SCHOOL_NAME} <${SCHOOL_EMAIL}>`;
export const FROM_ADMISSIONS = `${SCHOOL_NAME} Admissions <${ADMISSIONS_EMAIL}>`;
const MOTTO = "BUILDING AN EXCELLENT FOUNDATION FOR A BRIGHTER FUTURE";
const RED = "#c8102e", INK = "#202124", GREY = "#5f6368", LINE = "#e5e7eb", BG = "#f3f4f5";

export const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

export async function sendEmail(opts: { to: string; subject: string; html: string; from?: string; replyTo?: string }) {
  const key = Deno.env.get("RESEND_API_KEY") || "";
  if (!key) throw new Error("RESEND_API_KEY is not configured.");
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ from: opts.from || FROM, to: [opts.to], subject: opts.subject, html: opts.html, ...(opts.replyTo ? { reply_to: opts.replyTo } : {}) }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.message || "Email delivery failed.");
  return data as { id?: string };
}

export const button = (href: string, label: string) =>
  `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px 0 4px"><tr><td style="background:${RED};border-radius:8px"><a href="${esc(href)}" style="display:inline-block;padding:14px 26px;color:#ffffff;font-weight:bold;font-size:15px;text-decoration:none">${esc(label)}</a></td></tr></table>`;

export const callout = (html: string) =>
  `<div style="background:#f7f7f8;border-left:4px solid ${RED};padding:16px 18px;margin:22px 0;font-size:15px;line-height:1.65;color:${INK}">${html}</div>`;

/** Shared layout: header with logo + school name, content card, footer. */
export function layout(o: { preheader?: string; eyebrow?: string; title: string; body: string; footerNote?: string }) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:${BG};font-family:Arial,Helvetica,sans-serif;color:${INK}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(o.preheader || o.title)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BG}"><tr><td align="center" style="padding:28px 14px">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border:1px solid ${LINE};border-radius:14px;overflow:hidden">
<tr><td align="center" style="background:${RED};padding:26px 24px 22px">
  <img src="${SITE_URL}/logo.png" width="84" height="84" alt="${SCHOOL_NAME} logo" style="display:block;margin:0 auto 12px;background:#ffffff;border-radius:50%;padding:6px;object-fit:contain">
  <div style="color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:.4px">${SCHOOL_NAME}</div>
  <div style="color:#ffd9de;font-size:11px;letter-spacing:1.4px;margin-top:6px">${MOTTO}</div>
</td></tr>
<tr><td style="padding:34px 32px 26px">
  ${o.eyebrow ? `<div style="font-size:12px;letter-spacing:1.4px;color:${GREY};font-weight:bold;margin-bottom:8px">${esc(o.eyebrow.toUpperCase())}</div>` : ""}
  <h1 style="margin:0 0 18px;font-size:26px;line-height:1.25;color:${INK}">${o.title}</h1>
  <div style="font-size:15.5px;line-height:1.75;color:#3c4043">${o.body}</div>
</td></tr>
<tr><td style="border-top:1px solid ${LINE};padding:20px 32px 24px;font-size:13px;line-height:1.7;color:${GREY}">
  <strong style="color:${INK}">${SCHOOL_NAME}</strong><br>Maua, Igembe South, Meru County, Kenya<br>
  <a href="mailto:${ADMISSIONS_EMAIL}" style="color:${RED};text-decoration:none">${ADMISSIONS_EMAIL}</a> &nbsp;|&nbsp; <a href="mailto:${SCHOOL_EMAIL}" style="color:${RED};text-decoration:none">${SCHOOL_EMAIL}</a><br>
  <a href="${SITE_URL}" style="color:${RED};text-decoration:none">${SITE_URL.replace(/^https?:\/\//, "")}</a>
  ${o.footerNote ? `<br><br>${o.footerNote}` : ""}
</td></tr></table>
<div style="font-size:11px;color:#9aa0a6;margin-top:14px">&copy; ${new Date().getFullYear()} ${SCHOOL_NAME}</div>
</td></tr></table></body></html>`;
}

/** 6-digit code email (sign-up verification and password reset). */
export function codeEmail(o: { name?: string; code: string; purpose: "signup" | "reset" }) {
  const reset = o.purpose === "reset";
  const digits = o.code.split("").map(d =>
    `<td style="width:46px;height:56px;text-align:center;font-size:30px;font-weight:bold;color:${INK};background:#f7f7f8;border:1px solid ${LINE};border-radius:10px">${d}</td><td style="width:8px"></td>`).join("");
  return {
    subject: reset ? `${o.code} is your ${SCHOOL_NAME} password reset code` : `${o.code} is your ${SCHOOL_NAME} verification code`,
    html: layout({
      preheader: `Your code is ${o.code}. It expires in 10 minutes.`,
      eyebrow: reset ? "Password reset" : "Verify your email",
      title: reset ? "Reset your password" : "Confirm your email address",
      body: `<p style="margin:0 0 16px">${o.name ? `Hello ${esc(o.name)},` : "Hello,"}</p>
<p style="margin:0 0 20px">${reset ? "Use this code to choose a new password for your account." : "Thank you for creating an account. Enter this code to confirm your email address."}</p>
<table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin:6px auto 22px"><tr>${digits}</tr></table>
${callout(`This code expires in <strong>10 minutes</strong> and can be used once. Please never share it with anyone, including school staff.`)}
<p style="margin:0;font-size:14px;color:${GREY}">${reset ? "If you did not ask to reset your password, you can safely ignore this email. Your password will not change." : "If you did not create an account, you can ignore this email."}</p>`,
    }),
  };
}

export function acceptanceEmail(o: { parent: string; learner: string; level: string; note?: string }) {
  return {
    subject: `Congratulations! ${o.learner} has been accepted at ${SCHOOL_NAME}`,
    html: layout({
      preheader: `${o.learner} has been accepted for ${o.level}.`,
      eyebrow: "Admission decision",
      title: `Welcome to the Hill Springs family, ${esc(o.learner)}!`,
      body: `<p style="margin:0 0 16px">Dear ${esc(o.parent)},</p>
<p style="margin:0 0 16px">We are delighted to let you know that your application for <strong>${esc(o.learner)}</strong> has been <strong style="color:${RED}">accepted</strong> for <strong>${esc(o.level)}</strong> at ${SCHOOL_NAME}. Thank you for trusting us with your child's early learning journey.</p>
${o.note ? callout(`<strong>A note from the admissions office</strong><br>${esc(o.note).replace(/\n/g, "<br>")}`) : ""}
<p style="margin:0 0 8px"><strong>What happens next</strong></p>
<ul style="margin:0 0 16px;padding-left:20px"><li>Our admissions office will contact you with reporting dates, fees and the items your child will need.</li><li>Please keep your child's birth certificate and immunisation records ready.</li><li>You are welcome to reply to this email or write to us with any questions.</li></ul>
<p style="margin:0">We cannot wait to welcome ${esc(o.learner)} to our school community.</p>
${button(`${SITE_URL}/apply`, "View your account")}
<p style="margin:22px 0 0">Warm regards,<br><strong>The Admissions Office</strong><br>${SCHOOL_NAME}</p>`,
    }),
  };
}

export function rejectionEmail(o: { parent: string; learner: string; level: string; note?: string }) {
  return {
    subject: `Update on ${o.learner}'s application to ${SCHOOL_NAME}`,
    html: layout({
      preheader: `An update on ${o.learner}'s application.`,
      eyebrow: "Admission decision",
      title: "Thank you for applying",
      body: `<p style="margin:0 0 16px">Dear ${esc(o.parent)},</p>
<p style="margin:0 0 16px">Thank you for choosing ${SCHOOL_NAME} and for the time you took to apply for <strong>${esc(o.learner)}</strong> (${esc(o.level)}). We read every application with care.</p>
<p style="margin:0 0 16px">After careful consideration, we are unable to offer ${esc(o.learner)} a place at this time. This is often because places in a class are limited, or because the requirements for that level were not met this term. It is not a reflection of your child's potential.</p>
${o.note ? callout(`<strong>A note from the admissions office</strong><br>${esc(o.note).replace(/\n/g, "<br>")}`) : ""}
<p style="margin:0 0 16px">You are most welcome to apply again for a future term, and we would be glad to talk through other options with you. Please write to us at <a href="mailto:${ADMISSIONS_EMAIL}" style="color:${RED}">${ADMISSIONS_EMAIL}</a>.</p>
<p style="margin:0">We wish ${esc(o.learner)} and your family every success and happiness ahead.</p>
<p style="margin:22px 0 0">Kind regards,<br><strong>The Admissions Office</strong><br>${SCHOOL_NAME}</p>`,
    }),
  };
}

export function applicationReceivedEmail(o: { parent: string; learner: string; level: string }) {
  return {
    subject: `We received ${o.learner}'s application`,
    html: layout({
      preheader: "Your application has been received.",
      eyebrow: "Application received",
      title: "We have your application",
      body: `<p style="margin:0 0 16px">Dear ${esc(o.parent)},</p>
<p style="margin:0 0 16px">Thank you for applying to ${SCHOOL_NAME} for <strong>${esc(o.learner)}</strong> (${esc(o.level)}). Our admissions team will review it and email you with a decision. You can also check the status any time in your account.</p>
${button(`${SITE_URL}/apply`, "Check application status")}`,
    }),
  };
}

export function welcomeEmail(o: { name: string }) {
  return {
    subject: `Welcome to ${SCHOOL_NAME} updates`,
    html: layout({
      preheader: "Thank you for subscribing.",
      eyebrow: "Welcome to our school community",
      title: `Welcome, ${esc(o.name)}!`,
      body: `<p style="margin:0 0 16px">Thank you for subscribing to ${SCHOOL_NAME} updates. We share selected school notices, admissions information, learning resources and school news.</p>
${callout(`<strong>Our motto</strong><br>${MOTTO}`)}
${button(SITE_URL, "Visit our website")}`,
      footerNote: "You received this email because you subscribed to school updates on our website.",
    }),
  };
}

/** Newsletter / announcement. content is already-safe HTML produced by the admin editor. */
export function newsletterEmail(o: { subject: string; contentHtml: string; kind?: "newsletter" | "announcement"; unsubscribeUrl?: string }) {
  const news = (o.kind ?? "newsletter") === "newsletter";
  return {
    subject: o.subject,
    html: layout({
      preheader: o.subject,
      eyebrow: news ? "School newsletter" : "Notice to parents",
      title: esc(o.subject),
      body: o.contentHtml,
      footerNote: o.unsubscribeUrl ? `You are receiving this because you subscribed to school updates. <a href="${esc(o.unsubscribeUrl)}" style="color:${RED}">Unsubscribe</a>` : undefined,
    }),
  };
}

export function enquiryReceivedEmail(o: { name: string; subject: string }) {
  return {
    subject: `We received your enquiry: ${o.subject}`,
    html: layout({
      preheader: "Thank you for contacting us.",
      eyebrow: "Enquiry received",
      title: "Thank you for getting in touch",
      body: `<p style="margin:0 0 16px">Dear ${esc(o.name)},</p><p style="margin:0">We have received your enquiry about <strong>${esc(o.subject)}</strong>. A member of our team will reply by email as soon as possible.</p>`,
    }),
  };
}
