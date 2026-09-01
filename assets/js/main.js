/* COSTA LVM HOME SERVICE - site behaviour.
   Vanilla, no dependencies. Every feature degrades to working HTML without it. */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function runModule(name, init) {
    try {
      init();
    } catch (error) {
      console.error("COSTA LVM module failed: " + name, error);
    }
  }

  function pushDataLayer(payload) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  }

  /* ------------------------------------------------------------------
     Estimate form

     This runs first. If another module fails later, the submit listener is
     already attached and the form cannot fall back to a native page POST.
     ------------------------------------------------------------------ */

  runModule("estimate form", function () {
    var form = document.getElementById("estimate-form");
    if (!form) return;

    var status = document.getElementById("form-status");
    var submitBtn = form.querySelector('button[type="submit"]');

    var MESSAGES = {
      name: "Enter your name so we know who we're writing back to.",
      phone: "Enter a phone number we can reach you on.",
      email: "Enter a valid email address, like name@example.com.",
      zip: "Enter your 5-digit ZIP code so we can confirm we cover your town.",
      service: "Choose the service you need.",
      details: "Tell us briefly what you'd like done.",
    };

    function setStatus(state, message) {
      if (!status) return;
      status.dataset.state = state || "";
      status.textContent = message || "";
    }

    /* Lead mirror -> the agency's own collector.

       Web3Forms stays the primary send: it is what reaches the client's
       inbox, and it alone decides whether the visitor sees success or the
       error message. This copy is strictly additive and deliberately
       silent — if the collector is down, slow, or blocked, the visitor
       must never find out and the lead must still land in the inbox.

       Three details carry the weight:
       - keepalive, because the success path navigates to /thank-you/ about
         1.3s later. A normal fetch is cancelled by that navigation and the
         lead is lost; keepalive lets the request outlive the page.
       - _id is generated once per submission, so the retry of a failed
         send is recognised as the same lead instead of a second one.
       - the Web3Forms plumbing is stripped. access_key is a credential and
         botcheck/subject/redirect are transport details, not answers the
         visitor gave; anything left in the payload would become a lead
         field. */
    var LEAD_HOOK =
      "https://ironwarden.eusouts.com/hooks/leads/IwF8kIPtEXZne-B6lHXSxQI_yh3L7rnonl3aTUlZtx4";
    var SKIP_FIELDS = ["access_key", "subject", "redirect", "botcheck", "from_name"];
    var leadId = "";

    function newLeadId() {
      if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
      }
      return (
        Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10)
      );
    }

    function mirrorLead(theForm) {
      try {
        if (!window.fetch || typeof FormData === "undefined") return;

        // Same id across retries of one submission, new id per submission.
        if (!leadId) leadId = newLeadId();

        var payload = new FormData();
        var source = new FormData(theForm);

        source.forEach(function (value, name) {
          if (SKIP_FIELDS.indexOf(name) !== -1) return;
          if (name.charAt(0) === "_") return; // reserved namespace
          payload.append(name, value);
        });

        payload.append("_id", leadId);
        payload.append("_form", theForm.id || "estimate-form");
        payload.append("_page", document.title);
        payload.append("_page_url", window.location.href);

        fetch(LEAD_HOOK, {
          method: "POST",
          body: payload,
          keepalive: true,
          mode: "cors",
        }).catch(function () {
          /* Silent on purpose: Web3Forms owns the visitor-facing outcome. */
        });
      } catch (error) {
        /* Never let the mirror break the real submission. */
      }
    }

    function fieldError(input, message) {
      var slot = document.getElementById(input.name + "-error");
      if (slot) slot.textContent = message || "";
      input.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function validate(input) {
      var value = input.value.trim();
      var message = "";

      if (!value) {
        message = MESSAGES[input.name] || "This field is required.";
      } else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        message = MESSAGES.email;
      } else if (input.name === "zip" && !/^\d{5}(-\d{4})?$/.test(value)) {
        message = MESSAGES.zip;
      } else if (input.name === "phone" && value.replace(/\D/g, "").length < 10) {
        message = MESSAGES.phone;
      }

      fieldError(input, message);
      return !message;
    }

    var required = Array.prototype.slice.call(form.querySelectorAll("[required]"));

    required.forEach(function (input) {
      input.addEventListener("blur", function () {
        validate(input);
      });
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") validate(input);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var firstInvalid = null;
      required.forEach(function (input) {
        if (!validate(input) && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        setStatus("error", "Check the highlighted fields and send again.");
        firstInvalid.focus();
        return;
      }

      var key = form.querySelector('input[name="access_key"]');
      if (!key || !key.value || key.value.indexOf("REPLACE") === 0) {
        setStatus(
          "error",
          "This form isn't connected yet. Please call us on (551) 508-3606."
        );
        return;
      }

      setStatus("", "Sending...");
      if (submitBtn) submitBtn.disabled = true;

      // Mirror the lead to the agency's own collector before the primary
      // send, so it is already in flight while Web3Forms works.
      mirrorLead(form);

      fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          if (data.success) {
            var redirected = false;
            var finish = function () {
              if (redirected) return;
              redirected = true;
              window.location.href = "/thank-you/";
            };
            pushDataLayer({
              event: "form_submit",
              form_id: form.id,
              form_location: window.location.pathname,
              eventCallback: finish,
              eventTimeout: 1200,
            });
            window.setTimeout(finish, 1300);
          } else {
            throw new Error(data.message || "Request failed");
          }
        })
        .catch(function () {
          setStatus(
            "error",
            "That didn't send. Call us on (551) 508-3606 or email contact@costalvmhomeservice.com and we'll pick it up from there."
          );
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  });

  /* ------------------------------------------------------------------
     Tracking hooks
     ------------------------------------------------------------------ */

  runModule("tracking hooks", function () {
    Array.prototype.forEach.call(document.querySelectorAll('a[href^="tel:"]'), function (link) {
      link.addEventListener("click", function () {
        pushDataLayer({
          event: "tel_click",
          phone_number: link.getAttribute("href").replace("tel:", ""),
          link_location: window.location.pathname,
        });
      });
    });
  });

  /* ------------------------------------------------------------------
     Hero video - picks the right cut for the viewport, never blocks paint
     ------------------------------------------------------------------ */

  runModule("hero video", function () {
    var heroVideo = document.getElementById("hero-video");

    if (heroVideo && !reduceMotion) {
      var isPhone = window.matchMedia("(max-width: 760px)").matches;
      var src = isPhone
        ? heroVideo.dataset.srcMobile
        : heroVideo.dataset.srcDesktop;

      var start = function () {
        if (!src || heroVideo.src) return;
        heroVideo.src = src;
        heroVideo.load();
      };

      var tryPlay = function () {
        var playing = heroVideo.play();
        if (playing && playing.catch) playing.catch(function () {});
      };

      var reveal = function () {
        heroVideo.classList.add("is-ready");
      };

      heroVideo.addEventListener("canplay", tryPlay);
      heroVideo.addEventListener("playing", reveal);
      heroVideo.addEventListener("timeupdate", reveal, { once: true });

      if (document.readyState === "complete") {
        window.setTimeout(start, 200);
      } else {
        window.addEventListener("load", function () {
          window.setTimeout(start, 200);
        });
      }
    }
  });

  /* ------------------------------------------------------------------
     Header - solid state once the page scrolls
     ------------------------------------------------------------------ */

  runModule("header state", function () {
    var header = document.getElementById("site-header");

    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-stuck", window.scrollY > 24);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  });

  /* ------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------ */

  runModule("mobile navigation", function () {
    var toggle = document.querySelector(".nav-toggle");
    var navPanel = document.getElementById("site-nav");

    if (toggle && navPanel) {
      toggle.addEventListener("click", function () {
        var open = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!open));
        toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
        navPanel.classList.toggle("is-open", !open);
      });

      navPanel.addEventListener("click", function (e) {
        if (e.target.closest("a")) {
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-label", "Open menu");
          navPanel.classList.remove("is-open");
        }
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-label", "Open menu");
          navPanel.classList.remove("is-open");
          toggle.focus();
        }
      });
    }
  });

  /* ------------------------------------------------------------------
     Services carousel

     The scrolling itself is CSS scroll-snap, so swipe, momentum and keyboard
     scrolling all work with no JS. This only syncs the arrows, the dots and
     the active-slide styling to whatever the scroll position already is.
     ------------------------------------------------------------------ */

  runModule("services carousel", function () {
    var track = document.getElementById("services-track");

    if (track) {
      var slides = Array.prototype.slice.call(track.children);
      var dotsWrap = document.getElementById("services-dots");
      var dots = dotsWrap
        ? Array.prototype.slice.call(dotsWrap.querySelectorAll(".carousel__dot"))
        : [];
      var navs = Array.prototype.slice.call(
        document.querySelectorAll(".carousel__nav")
      );
      var current = 0;

      function nearestIndex() {
        var tr = track.getBoundingClientRect();
        var mid = tr.left + tr.width / 2;
        var best = 0;
        var bestDist = Infinity;
        slides.forEach(function (s, i) {
          var r = s.getBoundingClientRect();
          var d = Math.abs(r.left + r.width / 2 - mid);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        return best;
      }

      function sync() {
        var i = nearestIndex();
        if (i !== current) current = i;

        slides.forEach(function (s, n) {
          s.classList.toggle("is-active", n === current);
        });
        dots.forEach(function (d, n) {
          if (n === current) d.setAttribute("aria-current", "true");
          else d.removeAttribute("aria-current");
        });

        var atStart = track.scrollLeft <= 2;
        var atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
        navs.forEach(function (b) {
          var dir = +b.dataset.dir;
          b.disabled = dir < 0 ? atStart : atEnd;
        });
      }

      function goTo(i) {
        var target = slides[Math.max(0, Math.min(slides.length - 1, i))];
        if (!target) return;
        var tr = track.getBoundingClientRect();
        var r = target.getBoundingClientRect();
        track.scrollBy({
          left: r.left + r.width / 2 - (tr.left + tr.width / 2),
          behavior: reduceMotion ? "auto" : "smooth",
        });
      }

      navs.forEach(function (b) {
        b.addEventListener("click", function () {
          goTo(nearestIndex() + +b.dataset.dir);
        });
      });

      dots.forEach(function (d) {
        d.addEventListener("click", function () {
          goTo(+d.dataset.index);
        });
      });

      track.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          goTo(nearestIndex() + 1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          goTo(nearestIndex() - 1);
        }
      });

      var AUTOPLAY_MS = 5000;
      var playBtn = document.getElementById("services-play");
      var timer = null;
      var dir = 1;
      var userPaused = false;
      var inView = true;
      var hovered = false;

      function canPlay() {
        return !reduceMotion && !userPaused && inView && !hovered && !document.hidden;
      }

      function stopTimer() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      function restart() {
        stopTimer();
        if (canPlay()) timer = window.setInterval(step, AUTOPLAY_MS);
      }

      function step() {
        var i = nearestIndex();
        if (i >= slides.length - 1) dir = -1;
        else if (i <= 0) dir = 1;
        goTo(i + dir);
      }

      if (playBtn) {
        playBtn.addEventListener("click", function () {
          userPaused = !userPaused;
          playBtn.classList.toggle("is-paused", userPaused);
          playBtn.setAttribute(
            "aria-label",
            userPaused ? "Play the services carousel" : "Pause the services carousel"
          );
          restart();
        });
      }

      var carousel = track.closest(".carousel");
      if (!carousel) return;

      carousel.addEventListener("pointerenter", function () {
        hovered = true;
        restart();
      });
      carousel.addEventListener("pointerleave", function () {
        hovered = false;
        restart();
      });
      carousel.addEventListener("focusin", function () {
        hovered = true;
        restart();
      });
      carousel.addEventListener("focusout", function () {
        if (!carousel.contains(document.activeElement)) {
          hovered = false;
          restart();
        }
      });

      track.addEventListener("pointerdown", restart, { passive: true });
      navs.forEach(function (b) {
        b.addEventListener("click", restart);
      });
      dots.forEach(function (d) {
        d.addEventListener("click", restart);
      });

      document.addEventListener("visibilitychange", restart);

      if ("IntersectionObserver" in window) {
        new IntersectionObserver(
          function (entries) {
            if (entries[0].isIntersecting === inView) return;
            inView = entries[0].isIntersecting;
            restart();
          },
          { threshold: 0.25 }
        ).observe(carousel);
      }

      restart();
      track.addEventListener("scroll", sync, { passive: true });
      window.addEventListener("resize", sync, { passive: true });
      sync();
    }
  });

  /* ------------------------------------------------------------------
     Gallery: category filter + progressive reveal
     ------------------------------------------------------------------ */

  runModule("gallery", function () {
    var gallery = document.getElementById("gallery");

    if (gallery) {
      var BATCH = 8;
      var filterButtons = Array.prototype.slice.call(
        document.querySelectorAll(".filter-btn")
      );
      var moreBtn = document.getElementById("gallery-more");
      var counter = document.getElementById("gallery-count");
      var activeFilter = "all";
      var shown = BATCH;

      function matches(fig) {
        return activeFilter === "all" || fig.dataset.category === activeFilter;
      }

      function render() {
        var pool = Array.prototype.filter.call(gallery.children, matches);

        Array.prototype.forEach.call(gallery.children, function (fig) {
          fig.hidden = true;
        });

        pool.slice(0, shown).forEach(function (fig) {
          fig.hidden = false;
        });

        if (moreBtn) moreBtn.hidden = pool.length <= shown;
        if (counter) {
          counter.textContent =
            "Showing " + Math.min(shown, pool.length) + " of " + pool.length + " photos";
        }
      }

      filterButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          filterButtons.forEach(function (b) {
            b.setAttribute("aria-pressed", String(b === btn));
          });
          activeFilter = btn.dataset.filter;
          shown = BATCH;
          render();
        });
      });

      if (moreBtn) {
        moreBtn.addEventListener("click", function () {
          shown += BATCH;
          render();
        });
      }

      render();
    }
  });

  /* ------------------------------------------------------------------
     Header nav: mark the section currently in view
     ------------------------------------------------------------------ */

  runModule("section nav", function () {
    var sectionLinks = Array.prototype.slice.call(
      document.querySelectorAll('.nav a[href^="#"]')
    );

    if (sectionLinks.length && "IntersectionObserver" in window) {
      var byId = {};
      var targets = [];

      sectionLinks.forEach(function (link) {
        var el = document.getElementById(link.hash.slice(1));
        if (el) {
          byId[el.id] = link;
          targets.push(el);
        }
      });

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            sectionLinks.forEach(function (l) {
              l.removeAttribute("aria-current");
            });
            var link = byId[entry.target.id];
            if (link) link.setAttribute("aria-current", "page");
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );

      targets.forEach(function (t) {
        observer.observe(t);
      });
    }
  });

  /* ------------------------------------------------------------------
     Entrance reveal

     The markup ships visible. This module marks <html> with .js-reveal,
     which is what activates the hidden state in CSS — so if this module
     throws, or JS never runs, or a crawler reads the page, everything is
     still on screen. Only opacity and transform move, so no layout and no
     CLS. Each element is unobserved once it lands: this is a one-way trip,
     never a re-animation on scroll back up.
     ------------------------------------------------------------------ */

  runModule("reveal", function () {
    if (reduceMotion) return;
    if (!("IntersectionObserver" in window)) return;

    // Single elements, then groups whose children cascade.
    var singles = document.querySelectorAll(
      ".section-head, .about-grid__media, .about-grid__copy, .contact-card," +
        " .page-hero, .service-detail__figure, .service-detail__copy, .contact-map"
    );
    var groups = document.querySelectorAll(
      ".trust-band .container, .reasons, .steps, .faq, .gallery-filters," +
        " .footer-grid, .service-index"
    );

    if (!singles.length && !groups.length) return;

    document.documentElement.classList.add("js-reveal");

    singles.forEach(function (el) {
      el.setAttribute("data-reveal", "");
    });
    groups.forEach(function (el) {
      el.setAttribute("data-reveal-group", "");
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      // Fire a little before the element reaches the viewport, so the
      // motion reads as the page settling rather than as a late pop.
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    singles.forEach(function (el) {
      observer.observe(el);
    });
    groups.forEach(function (el) {
      observer.observe(el);
    });

    // Anything already on screen reveals immediately, otherwise the first
    // fold would sit invisible until the user scrolls.
    //
    // This runs synchronously rather than inside requestAnimationFrame: rAF
    // does not run in a background tab, and neither does IntersectionObserver
    // reliably — so an rAF fallback leaves the page blank for anyone who
    // opens it in a background tab and switches to it later.
    function revealVisible() {
      var all = document.querySelectorAll("[data-reveal], [data-reveal-group]");
      all.forEach(function (el) {
        var box = el.getBoundingClientRect();
        if (box.top < window.innerHeight && box.bottom > 0) {
          el.classList.add("is-in");
          observer.unobserve(el);
        }
      });
    }

    revealVisible();
    window.addEventListener("load", revealVisible, { once: true });

    // Last resort: if the page was hidden the whole time, nothing above has
    // measured anything useful. Reveal on the first sight of the document.
    if (document.hidden) {
      document.addEventListener("visibilitychange", function onShow() {
        if (document.hidden) return;
        document.removeEventListener("visibilitychange", onShow);
        revealVisible();
      });
    }
  });

  /* ------------------------------------------------------------------
     Gallery lightbox

     Built on <dialog>: the browser supplies the top layer, the focus trap,
     the backdrop and Esc. The figures ship as plain images, and this module
     promotes each one to a button — so without JS the gallery is still a
     gallery, just not zoomable.
     ------------------------------------------------------------------ */

  runModule("lightbox", function () {
    var figures = document.querySelectorAll(".gallery figure");
    if (!figures.length) return;
    if (typeof HTMLDialogElement === "undefined") return; // no <dialog>, no promotion

    var items = [];

    var dialog = document.createElement("dialog");
    dialog.className = "lightbox";
    dialog.setAttribute("aria-label", "Project photo");
    dialog.innerHTML =
      '<div class="lightbox__frame">' +
      '<img class="lightbox__img" alt="">' +
      '<p class="lightbox__caption"></p>' +
      '<button type="button" class="lightbox__close" aria-label="Close photo">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
      "</button>" +
      '<button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Previous photo">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>' +
      "</button>" +
      '<button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Next photo">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>' +
      "</button>" +
      "</div>";
    document.body.appendChild(dialog);

    var imgEl = dialog.querySelector(".lightbox__img");
    var capEl = dialog.querySelector(".lightbox__caption");
    var prevBtn = dialog.querySelector(".lightbox__nav--prev");
    var nextBtn = dialog.querySelector(".lightbox__nav--next");
    var current = 0;

    figures.forEach(function (fig) {
      var img = fig.querySelector("img");
      if (!img) return;

      var caption = fig.querySelector("figcaption");
      // srcset gives us a bigger file for free; fall back to the src.
      var large = img.getAttribute("src");
      var srcset = img.getAttribute("srcset");
      if (srcset) {
        var candidates = srcset.split(",");
        var last = candidates[candidates.length - 1].trim().split(/\s+/)[0];
        if (last) large = last;
      }

      var index = items.length;
      items.push({
        src: large,
        alt: img.getAttribute("alt") || "",
        caption: caption ? caption.textContent.trim() : "",
        figure: fig
      });

      var button = document.createElement("button");
      button.type = "button";
      button.className = "gallery__open";
      button.setAttribute(
        "aria-label",
        "Open larger photo: " + (img.getAttribute("alt") || "project photo")
      );
      img.parentNode.insertBefore(button, img);
      button.appendChild(img);

      button.addEventListener("click", function () {
        open(index);
      });
    });

    if (!items.length) return;

    function visibleNeighbour(from, direction) {
      // The gallery filters and paginates, so the next photo in the DOM may
      // be hidden. Step until we find one the user can actually see.
      var i = from + direction;
      while (i >= 0 && i < items.length) {
        if (items[i].figure.offsetParent !== null) return i;
        i += direction;
      }
      return -1;
    }

    function show(index) {
      var item = items[index];
      if (!item) return;
      current = index;
      imgEl.setAttribute("src", item.src);
      imgEl.setAttribute("alt", item.alt);
      capEl.textContent = item.caption;
      capEl.hidden = !item.caption;
      prevBtn.disabled = visibleNeighbour(index, -1) === -1;
      nextBtn.disabled = visibleNeighbour(index, 1) === -1;
    }

    function open(index) {
      show(index);
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    }

    function move(direction) {
      var next = visibleNeighbour(current, direction);
      if (next !== -1) show(next);
    }

    prevBtn.addEventListener("click", function () {
      move(-1);
    });
    nextBtn.addEventListener("click", function () {
      move(1);
    });
    dialog.querySelector(".lightbox__close").addEventListener("click", function () {
      dialog.close();
    });

    dialog.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        move(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        move(1);
      }
    });

    // Clicking the backdrop closes. The dialog fills the whole viewport as
    // far as the event target is concerned, so compare against its box.
    dialog.addEventListener("click", function (e) {
      if (e.target !== dialog) return;
      var box = dialog.getBoundingClientRect();
      var inside =
        e.clientX >= box.left &&
        e.clientX <= box.right &&
        e.clientY >= box.top &&
        e.clientY <= box.bottom;
      if (!inside) dialog.close();
    });
  });
})();
