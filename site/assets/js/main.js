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
})();
