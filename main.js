/* Renders the portfolio from the data/*.js files. No framework needed. */
(function () {
  "use strict";

  var P = window.PROFILE || {};
  var DATA = window.DATA_PROJECTS || [];
  var FRONT = window.FRONTEND_PROJECTS || [];

  // ---------- helpers ----------
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "class") node.className = attrs[k];
        else if (k === "text") node.textContent = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function chips(items) {
    var ul = el("ul", { class: "chips" });
    (items || []).forEach(function (t) { ul.appendChild(el("li", { text: t })); });
    return ul;
  }

  function bullets(items) {
    var ul = el("ul", { class: "bullets" });
    (items || []).forEach(function (t) { ul.appendChild(el("li", { text: t })); });
    return ul;
  }

  function linkBtn(label, url, cls) {
    if (!url) return null;
    return el("a", { class: "btn btn-sm " + cls, href: url, target: "_blank", rel: "noopener noreferrer", text: label });
  }

  function block(label, content) {
    return el("div", { class: "block" }, [el("h4", { text: label }), content]);
  }

  function badge(p) {
    return p.placeholder ? el("span", { class: "badge", text: "Sample" }) : null;
  }

  // ---------- profile text ----------
  document.querySelectorAll("[data-profile]").forEach(function (n) {
    var key = n.getAttribute("data-profile");
    if (P[key]) n.textContent = P[key];
  });
  if (P.name) {
    document.title = P.name + " | " + (P.title || "Portfolio");
    var mark = document.querySelector(".brand-mark");
    if (mark) mark.textContent = P.name.charAt(0).toUpperCase();
  }

  // ---------- hero photo ----------
  var photoBox = document.getElementById("heroPhoto");
  if (P.photo) {
    photoBox.appendChild(el("img", { src: P.photo, alt: "Portrait of " + (P.name || "me"), width: "360", height: "360", loading: "eager" }));
  } else {
    var initials = (P.name || "M").split(/\s+/).map(function (w) { return w.charAt(0); }).join("").slice(0, 2).toUpperCase();
    photoBox.classList.add("is-placeholder");
    photoBox.appendChild(el("span", { class: "initials", text: initials }));
  }

  // ---------- project details window ----------
  var modal = document.getElementById("projectModal");
  var modalBody = document.getElementById("modalBody");

  // Turns a YouTube link or a local .mp4/.webm path into a player. Anything else is ignored.
  function buildVideo(src, poster, title) {
    if (!src) return null;
    var yt = src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([\w-]{11})/);
    if (yt) {
      return el("div", { class: "video-wrap" }, [
        el("iframe", {
          src: "https://www.youtube-nocookie.com/embed/" + yt[1] + "?rel=0",
          title: "Video: " + title, loading: "lazy", allowfullscreen: "",
          allow: "accelerometer; encrypted-media; picture-in-picture; fullscreen"
        })
      ]);
    }
    if (/\.(mp4|webm)(\?.*)?$/i.test(src)) {
      var v = el("video", { src: src, controls: "", playsinline: "", preload: "metadata" });
      if (poster) v.setAttribute("poster", poster);
      return el("div", { class: "video-wrap" }, [v]);
    }
    return null;
  }

  // track = "data" or "front"; the same window serves both sections
  function openDetails(p, track) {
    var isFront = track === "front";
    modal.setAttribute("data-track", track);
    modalBody.textContent = "";
    var player = buildVideo(p.video, p.image, p.title);
    var media = player || el("img", { class: "modal-img", src: p.image, alt: (isFront ? "Screenshot: " : "Dashboard: ") + p.title });
    var title = el("h3", { id: "modalTitle", text: p.title });
    var links = el("div", { class: "actions" }, [
      linkBtn(isFront ? "Live demo" : "View project", p.liveUrl, isFront ? "btn-front" : "btn-data"),
      linkBtn(isFront ? "Source code" : "GitHub / files", p.githubUrl, "btn-ghost")
    ]);
    var about = p.overview || p.description;
    var toolList = p.tools || p.tech;
    modalBody.appendChild(media);
    modalBody.appendChild(el("div", { class: "modal-text" }, [
      title,
      about ? block(p.overview ? "Overview" : "About", el("p", { text: about })) : null,
      (toolList && toolList.length) ? block(isFront ? "Built with" : "Tools", chips(toolList)) : null,
      (p.steps && p.steps.length) ? block("Analysis steps", (function () {
        var ol = el("ol", { class: "steps" });
        p.steps.forEach(function (s) { ol.appendChild(el("li", { text: s })); });
        return ol;
      })()) : null,
      (p.findings && p.findings.length) ? block("Key findings", bullets(p.findings)) : null,
      (p.features && p.features.length) ? block("Features", bullets(p.features)) : null,
      links.children.length ? links : null
    ]));
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
    document.body.classList.add("no-scroll");
  }

  function closeDetails() {
    if (modal.open) modal.close();
  }
  modal.addEventListener("close", function () {
    modalBody.textContent = "";            // also stops any playing video
    document.body.classList.remove("no-scroll");
  });
  document.getElementById("modalClose").addEventListener("click", closeDetails);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeDetails(); });   // click on the dark backdrop

  // ---------- data projects ----------
  var dataRoot = document.getElementById("dataProjects");
  DATA.forEach(function (p) {
    var media = el("button", { class: "case-media", type: "button", "aria-label": "Open details of " + p.title }, [
      el("img", { src: p.image, alt: "Screenshot of " + p.title, loading: "lazy", width: "800", height: "450" }),
      badge(p),
      el("span", { class: "media-hint", text: p.video ? "▶ Watch & details" : "View details" })
    ]);
    media.addEventListener("click", function () { openDetails(p, "data"); });

    var detailsBtn = el("button", { class: "btn btn-sm btn-data", type: "button", text: p.video ? "Watch video & details" : "Details" });
    detailsBtn.addEventListener("click", function () { openDetails(p, "data"); });

    var links = el("div", { class: "actions" }, [
      detailsBtn,
      linkBtn("View project", p.liveUrl, "btn-ghost"),
      linkBtn("GitHub / files", p.githubUrl, "btn-ghost")
    ]);

    var hasSteps = p.steps && p.steps.length;
    var hasFindings = p.findings && p.findings.length;
    var stepsBlock = hasSteps ? block("Analysis steps", (function () {
      var ol = el("ol", { class: "steps" });
      p.steps.forEach(function (s) { ol.appendChild(el("li", { text: s })); });
      return ol;
    })()) : null;
    var findingsBlock = hasFindings ? block("Key findings", bullets(p.findings)) : null;

    var body = el("div", { class: "case-body" }, [
      el("h3", { text: p.title }),
      (p.overview || p.question) ? block(p.overview ? "Overview" : "The question", el("p", { text: p.overview || p.question })) : null,
      block("Tools", chips(p.tools)),
      (hasSteps || hasFindings) ? el("div", { class: "case-cols" }, [stepsBlock, findingsBlock]) : null,
      links.children.length ? links : null
    ]);

    dataRoot.appendChild(el("article", { class: "case" }, [media, body]));
  });

  // ---------- front-end projects ----------
  var frontRoot = document.getElementById("frontProjects");
  FRONT.forEach(function (p) {
    var shotBtn = el("button", { class: "shot-btn", type: "button", "aria-label": "Open details of " + p.title }, [
      el("img", { src: p.image, alt: "Interface of " + p.title, loading: "lazy", width: "800", height: "500" }),
      el("span", { class: "media-hint", text: p.video ? "▶ Watch & details" : "View details" })
    ]);
    shotBtn.addEventListener("click", function () { openDetails(p, "front"); });

    var shot = el("div", { class: "shot" }, [
      el("div", { class: "shot-bar", "aria-hidden": "true" }, [el("i"), el("i"), el("i")]),
      shotBtn,
      badge(p)
    ]);

    var detailsBtn = el("button", { class: "btn btn-sm btn-front", type: "button", text: p.video ? "Watch video & details" : "Details" });
    detailsBtn.addEventListener("click", function () { openDetails(p, "front"); });

    var links = el("div", { class: "actions" }, [
      detailsBtn,
      linkBtn("Live demo", p.liveUrl, "btn-ghost"),
      linkBtn("Source code", p.githubUrl, "btn-ghost")
    ]);

    var body = el("div", { class: "card-body" }, [
      el("h3", { text: p.title }),
      el("p", { class: "desc", text: p.description }),
      (p.tech && p.tech.length) ? chips(p.tech) : null,
      (p.features && p.features.length) ? bullets(p.features) : null,
      links.children.length ? links : null
    ]);

    frontRoot.appendChild(el("article", { class: "card" }, [shot, body]));
  });

  // ---------- skills ----------
  function fillChips(id, items) {
    var ul = document.getElementById(id);
    (items || []).forEach(function (t) { ul.appendChild(el("li", { text: t })); });
  }
  fillChips("skillsData", (P.skills || {}).data);
  fillChips("skillsFront", (P.skills || {}).frontend);

  // ---------- contact ----------
  var C = P.contact || {};
  var list = document.getElementById("contactList");
  var defs = [
    ["whatsapp", "WhatsApp", function (v) { return v + "?text=" + encodeURIComponent("Hello Mohamed, I saw your portfolio and I'd like to talk about a project."); }, function () { return C.phone || "Chat on WhatsApp"; }],
    ["email", "Email", function (v) { return "mailto:" + v; }, function (v) { return v; }],
    ["linkedin", "LinkedIn", function (v) { return v; }, function () { return "Profile"; }],
    ["github", "GitHub", function (v) { return v; }, function () { return "Profile"; }],
    ["fiverr", "Fiverr", function (v) { return v; }, function () { return "Gigs"; }],
    ["khamsat", "Khamsat", function (v) { return v; }, function () { return "Services"; }]
  ];
  var shown = 0;
  defs.forEach(function (d) {
    var v = C[d[0]];
    if (!v) return;
    shown++;
    var a = el("a", { class: "contact-item", href: d[2](v) }, [
      el("span", { class: "contact-label", text: d[1] }),
      el("span", { class: "contact-value", text: d[3](v) })
    ]);
    if (d[0] !== "email") { a.setAttribute("target", "_blank"); a.setAttribute("rel", "noopener noreferrer"); }
    list.appendChild(el("li", null, [a]));
  });
  if (!shown) document.getElementById("contactEmpty").hidden = false;

  // ---------- contact form (sent to your email via FormSubmit, no backend) ----------
  var form = document.getElementById("contactForm");
  if (!C.email) {
    form.hidden = true;
  } else {
    var statusEl = document.getElementById("cfStatus");
    var submitBtn = document.getElementById("cfSubmit");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      statusEl.className = "form-status";
      var fd = new FormData(form);
      var name = (fd.get("name") || "").trim();
      var email = (fd.get("email") || "").trim();
      var message = (fd.get("message") || "").trim();
      if (fd.get("_honey")) return;                       // bot
      if (!name || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        statusEl.textContent = "Please fill in your name, a valid email, and the project details.";
        statusEl.classList.add("error");
        return;
      }
      submitBtn.disabled = true;
      statusEl.textContent = "Sending...";
      fetch("https://formsubmit.co/ajax/" + encodeURIComponent(C.email), {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          name: name, email: email, message: message,
          _subject: "New project inquiry from " + name + " (portfolio)",
          _replyto: email, _template: "table", _captcha: "false"
        })
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (res && (res.success === true || res.success === "true")) {
          form.reset();
          statusEl.textContent = "Thank you! Your message was sent. I'll reply to you by email soon.";
          statusEl.classList.add("ok");
        } else { throw new Error("failed"); }
      }).catch(function () {
        var href = "mailto:" + C.email + "?subject=" + encodeURIComponent("Project inquiry from " + name) +
                   "&body=" + encodeURIComponent(message + "\n\n" + name + " (" + email + ")");
        statusEl.innerHTML = "";
        statusEl.appendChild(document.createTextNode("Couldn't send from the page. "));
        statusEl.appendChild(el("a", { href: href, text: "Click here to send it from your email app." }));
        statusEl.classList.add("error");
      }).then(function () { submitBtn.disabled = false; });
    });
  }

  // ---------- theme toggle ----------
  var root = document.documentElement;
  document.getElementById("themeToggle").addEventListener("click", function () {
    var current = root.getAttribute("data-theme");
    if (!current) current = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    var next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // ---------- mobile menu ----------
  var nav = document.getElementById("nav");
  var menuBtn = document.getElementById("menuToggle");
  function closeMenu() { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
  menuBtn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", function (e) { if (e.target.tagName === "A") closeMenu(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  // ---------- active nav link on scroll ----------
  var links = Array.prototype.slice.call(nav.querySelectorAll("a"));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["home", "data", "frontend", "skills", "contact"].forEach(function (id) {
      var s = document.getElementById(id);
      if (s) io.observe(s);
    });
  }

  document.getElementById("year").textContent = new Date().getFullYear();
})();
