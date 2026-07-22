/**
 * Contact form → Web3Forms (same pattern as norvialabs.com/contact).
 * Expects window.SITE_CONTACT from contact-config.js.
 */
(function () {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  const success = contactForm.querySelector("[data-form-success]");
  const error = contactForm.querySelector("[data-form-error]");
  const submitBtn = contactForm.querySelector('[type="submit"]');
  const cfg = window.SITE_CONTACT || {};
  const accessKey = (cfg.accessKey || "").trim();
  const subjectPrefix = cfg.subjectPrefix || "Website contact";
  const linkedInUrl = "https://www.linkedin.com/in/mohit-ranka";

  function show(el, text) {
    if (!el) return;
    if (text) el.innerHTML = text;
    el.classList.add("show");
  }

  function hideStatus() {
    if (success) success.classList.remove("show");
    if (error) error.classList.remove("show");
  }

  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.setAttribute("aria-busy", loading ? "true" : "false");
    if (!submitBtn.dataset.label) {
      submitBtn.dataset.label = submitBtn.textContent;
    }
    submitBtn.textContent = loading ? "Sending…" : submitBtn.dataset.label;
  }

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideStatus();

    const nameEl = contactForm.elements.namedItem("name");
    const emailEl = contactForm.elements.namedItem("email");
    const companyEl = contactForm.elements.namedItem("company");
    const messageEl = contactForm.elements.namedItem("message");
    const botEl = contactForm.elements.namedItem("botcheck");

    const nameTrim = String((nameEl && nameEl.value) || "").trim();
    const emailTrim = String((emailEl && emailEl.value) || "").trim();
    const companyTrim = String((companyEl && companyEl.value) || "").trim();
    const messageTrim = String((messageEl && messageEl.value) || "").trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim);

    if (!nameTrim || !emailOk || !messageTrim) {
      show(
        error,
        "Please fill in name, a valid email, and a message — then try again."
      );
      return;
    }

    // Honeypot: only treat as bot when the hidden checkbox is actually checked.
    // (Checkbox .value is always "on" even when unchecked — do not use .value here.)
    if (botEl && botEl.checked) {
      show(
        success,
        "Thank you! Your message has been sent. I will get back to you soon."
      );
      contactForm.reset();
      return;
    }

    if (!accessKey || accessKey === "YOUR_ACCESS_KEY_HERE") {
      show(
        error,
        `Contact form is not configured yet. Please
        <a href="${linkedInUrl}" target="_blank" rel="noopener noreferrer">connect on LinkedIn</a>.`
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `${subjectPrefix}: ${nameTrim}`,
          from_name: cfg.fromName || "Website contact form",
          name: nameTrim,
          email: emailTrim,
          company: companyTrim || undefined,
          message: messageTrim,
          replyto: emailTrim,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        show(
          success,
          "Thank you! Your message has been sent. I will get back to you soon."
        );
        contactForm.reset();
      } else {
        const msg =
          data.message ||
          "Sorry, something went wrong. Please try again in a moment.";
        show(
          error,
          `${msg}
          You can also
          <a href="${linkedInUrl}" target="_blank" rel="noopener noreferrer">reach me on LinkedIn</a>.`
        );
      }
    } catch (_) {
      show(
        error,
        `Network error — please try again, or
        <a href="${linkedInUrl}" target="_blank" rel="noopener noreferrer">connect on LinkedIn</a>.`
      );
    } finally {
      setLoading(false);
    }
  });
})();
