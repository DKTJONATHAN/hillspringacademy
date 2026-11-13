import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App.jsx";
import { BLOG_POSTS } from "./blogData.js";
import { getFeesYear } from "./feesData.js";

const SITE = "https://hillspringsacademy.sc.ke";

const PAGE_DESCRIPTIONS = {
  "/": "Hill Springs Academy is a private CBE school in Maua, Igembe South, Meru County, Kenya, offering Kindergarten, Pre-Primary and Junior School.",
  "/about": "Learn about Hill Springs Academy, a private CBE school in Maua, Igembe South, Meru County, offering Kindergarten, Pre-Primary and Junior School.",
  "/academics": "Explore Kindergarten, Pre-Primary and Junior School at Hill Springs Academy in Maua, Meru County. Learn about the school's CBE approach, subject areas and learning stages.",
  "/admissions": "Find out how to enquire and apply to Hill Springs Academy, a private CBE school in Maua, Igembe South, Meru County, offering Kindergarten, Pre-Primary and Junior School.",
  "/parent": "Sign in or create a parent account to manage applications and school enquiries.",
  "/school-life": "Discover school life at Hill Springs Academy in Maua, including learning, activities and the wider school community.",
  "/gallery": "View photographs of school life, learning spaces and activities at Hill Springs Academy in Maua, Meru County.",
  "/reading-materials": "Access learning and reading resources shared by Hill Springs Academy for learners and families.",
  "/fees": "View the published Hill Springs Academy school fees in Maua, Meru County, with termly fee information by class. Contact admissions to confirm current charges before payment.",
  "/uniforms": "View Hill Springs Academy uniform references for Primary School and Junior Secondary School (JSS) in Maua, Meru County. Contact admissions to confirm current sizes, suppliers and prices.",
  "/faq": "Answers to common questions about Hill Springs Academy in Maua, including admission forms, school visits, learning levels, transport, uniforms and fees.",
  "/contact": "Contact Hill Springs Academy in Maua for admissions, school fees, uniforms, transport enquiries, school visits or directions to the school office.",
  "/blog": "Read learning, parenting and school-community articles from Hill Springs Academy in Maua, Meru County.",
  "/directors": "Meet the leadership of Hill Springs Academy in Maua, Meru County.",
  "/privacy": "Read how Hill Springs Academy handles personal information submitted through its website and school enquiry services.",
  "/terms": "Read the terms that apply to use of the Hill Springs Academy website and its online services.",
  "/refund-policy": "Read the refund policy published by Hill Springs Academy. Contact the school for clarification about a specific payment.",
  "/delete-account": "Find instructions for requesting deletion of an account associated with Hill Springs Academy online services.",
  "/sitemap": "Browse the main pages and public resources available on the Hill Springs Academy website."
};

const PAGE_TITLES = {
  "/": "Hill Springs Academy | Private School in Maua, Meru County",
  "/about": "About Hill Springs Academy | Private CBE School in Maua",
  "/academics": "Academics at Hill Springs Academy | CBE School in Maua",
  "/admissions": "School Admissions in Maua | Hill Springs Academy",
  "/signup": "Join Hill Springs Academy | Sign up",
  "/parent": "Parent Portal | Hill Springs Academy, Maua",
  "/apply": "Apply to Hill Springs Academy | Maua",
  "/enquire": "Make an enquiry | Hill Springs Academy",
  "/school-life": "School Life | Hill Springs Academy, Maua",
  "/gallery": "Gallery | Hill Springs Academy, Maua",
  "/reading-materials": "Learning Resources | Hill Springs Academy, Maua",
  "/fees": `School Fees ${getFeesYear()} | Hill Springs Academy, Maua`,
  "/uniforms": "Primary & JSS School Uniforms in Maua | Hill Springs Academy",
  "/faq": "FAQ | Hill Springs Academy, Maua",
  "/contact": "Contact Hill Springs Academy in Maua | Phone & Directions",
  "/blog": "Blog | Hill Springs Academy, Maua",
  "/directors": "Leadership | Hill Springs Academy, Maua",
  "/privacy": "Privacy | Hill Springs Academy",
  "/terms": "Terms of Service | Hill Springs Academy",
  "/refund-policy": "Refund Policy | Hill Springs Academy",
  "/delete-account": "Delete account help | Hill Springs Academy",
  "/sitemap": "Sitemap | Hill Springs Academy, Maua",
  "/admin": "Admin | Hill Springs Academy",
};

/**
 * Render the React app to an HTML string for the given URL.
 * @param {string} url Absolute or path URL of the request
 * @returns {{ appHtml: string, title: string, canonical: string, pathname: string }}
 */
export function render(url) {
  const parsed = new URL(url, SITE);
  const pathname = parsed.pathname.replace(/\/$/, "") || "/";
  const location = pathname + parsed.search;

  const appHtml = renderToString(
    <React.StrictMode>
      <StaticRouter location={location}>
        <App />
      </StaticRouter>
    </React.StrictMode>
  );

  const blogSlug = pathname.startsWith("/blog/") ? pathname.slice("/blog/".length) : "";
  const post = blogSlug ? BLOG_POSTS.find((item) => item.slug === blogSlug) : null;
  const knownPath = Object.prototype.hasOwnProperty.call(PAGE_TITLES, pathname);
  const notFound = !knownPath && !post;

  const title = post
    ? `${post.title} | Hill Springs Academy, Maua`
    : notFound
      ? "Page not found | Hill Springs Academy"
      : PAGE_TITLES[pathname];

  const canonical = SITE + (pathname === "/" ? "/" : pathname);

  const description = post
    ? post.intro
    : notFound
      ? "The page you requested could not be found on the Hill Springs Academy website."
      : PAGE_DESCRIPTIONS[pathname] ||
        "Official information about Hill Springs Academy in Maua, Igembe South, Meru County, Kenya.";
  const noIndex = notFound || ["/signup", "/parent", "/apply", "/enquire", "/admin"].includes(pathname);
  return {
    appHtml,
    title,
    description,
    canonical,
    pathname,
    status: notFound ? 404 : 200,
    robots: noIndex ? "noindex,follow" : "index,follow,max-image-preview:large",
  };
}
