(() => {
  const forms = [...document.querySelectorAll("[data-performer-form]")];

  function bindForm(form) {
    const submit = form.querySelector('button[type="submit"]');
    const note = form.querySelector("[data-form-note]");
    const honey = form.querySelector('[name="_honey"]');
    if (!submit || !note) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (submit.disabled || !form.reportValidity() || (honey && honey.value)) return;

      const original = submit.textContent;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      submit.disabled = true;
      submit.textContent = "Sending...";
      form.setAttribute("aria-busy", "true");
      note.classList.remove("is-success", "is-error");
      note.textContent = "Sending...";

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
          signal: controller.signal
        });
        const result = await response.json();
        if (!response.ok || result.success === false || result.success === "false") throw new Error("Submission failed");
        form.reset();
        note.classList.add("is-success");
        note.textContent = form.classList.contains("compact-form")
          ? "You are on the performance updates list."
          : "Thanks. Your booking inquiry has been sent to Andrew.";
      } catch (error) {
        note.classList.add("is-error");
        note.textContent = "The form did not send. Email hello@awolverton.com directly.";
      } finally {
        clearTimeout(timeout);
        submit.disabled = false;
        submit.textContent = original;
        form.removeAttribute("aria-busy");
      }
    });
  }

  forms.forEach(bindForm);

  const bookingSelect = document.querySelector("[data-booking-select]");
  document.querySelectorAll("[data-booking-choice]").forEach((link) => {
    link.addEventListener("click", () => {
      if (bookingSelect) bookingSelect.value = link.dataset.bookingChoice || "";
    });
  });
})();
