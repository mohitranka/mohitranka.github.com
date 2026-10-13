/**
 * Contact form → Web3Forms (same pattern as norvialabs.com/contact).
 * Expects window.SITE_CONTACT from contact-config.js.
 */
(function () {
// Exposed so the tour can bind a form it injects into a room.
function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm || contactForm.dataset.bound) return;
  contactForm.dataset.bound = "1";

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
      const missing = [];
      if (!nameTrim) missing.push("your name");
      if (!emailOk) missing.push("a valid email address");
      if (!messageTrim) missing.push("a message");
      const list =
        missing.length > 1
          ? `${missing.slice(0, -1).join(", ")} and ${missing[missing.length - 1]}`
          : missing[0];
      show(error, `Please add ${list}, then send again.`);
      return;
    }

    // Honeypot: only treat as bot when the hidden checkbox is actually checked.
    // (Checkbox .value is always "on" even when unchecked — do not use .value here.)
    if (botEl && botEl.checked) {
      show(
        success,
        "Thanks. Your message has been sent, and I will reply as soon as I can."
      );
      contactForm.reset();
      return;
    }

    if (!accessKey || accessKey === "YOUR_ACCESS_KEY_HERE") {
      show(
        error,
        `The contact form is not available right now. Please
        <a href="${linkedInUrl}" target="_blank" rel="noopener noreferrer">reach me on LinkedIn</a>.`
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
          "Thanks. Your message has been sent, and I will reply as soon as I can."
        );
        contactForm.reset();
      } else {
        const msg =
          data.message ||
          "Your message could not be sent. Please try again in a moment.";
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
}

window.initContactForm = initContactForm;
initContactForm();
})();
