"use strict";
// Single source of truth. E.164 phone; WhatsApp digits with country code, no +.
// After changes run: python3 scripts/sync-settings.py (updates static no-JS links).
const BUSINESS = /* BUSINESS_CONFIG_START */ {
  "name": "Drive On Tours & Travels",
  "phone": "+919895122149",
  "whatsapp": "",
  "email": "",
  "location": "",
  "siteUrl": ""
} /* BUSINESS_CONFIG_END */;

(() => {
  const whatsappReady = /^[1-9]\d{7,14}$/.test(BUSINESS.whatsapp);
  const phoneReady = /^\+[1-9]\d{7,14}$/.test(BUSINESS.phone);
  const message = "Hello Drive On! I would like to plan a driver-included trip from Kochi.";
  // Subscribe using document.addEventListener('driveon:analytics', handler).
  // No third-party tracking by default. Never include travellers' form values.
  function track(name, detail = {}) {
    document.dispatchEvent(new CustomEvent("driveon:analytics", { detail: { event: name, ...detail } }));
  }
  document.querySelectorAll("[data-business]").forEach(el => {
    const value = BUSINESS[el.dataset.business];
    if (value) el.textContent = value;
  });
  document.querySelectorAll("[data-phone]").forEach(el => {
    if (phoneReady) el.href = `tel:${BUSINESS.phone}`;
  });
  document.querySelectorAll("[data-whatsapp]").forEach(el => {
    if (whatsappReady) el.href = `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
  });
  document.addEventListener("click", event => {
    const link = event.target.closest("[data-event]");
    if (link) track(link.dataset.event, { vehicle: link.dataset.vehicle || undefined, configured: link.hasAttribute("data-whatsapp") ? whatsappReady : link.hasAttribute("data-phone") ? phoneReady : undefined });
  });
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("navigation");
  const mobile = window.matchMedia("(max-width: 900px)");
  function resetMenu() { nav.hidden = mobile.matches; toggle.setAttribute("aria-expanded", String(!nav.hidden)); }
  toggle.hidden = false;
  resetMenu();
  mobile.addEventListener("change", resetMenu);
  toggle.addEventListener("click", () => { nav.hidden = !nav.hidden; toggle.setAttribute("aria-expanded", String(!nav.hidden)); });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && mobile.matches && !nav.hidden) { nav.hidden = true; toggle.setAttribute("aria-expanded", "false"); toggle.focus(); }
  });
  document.querySelectorAll("[data-quote-form]").forEach(form => {
    const status = form.querySelector("[data-quote-status]");
    const button = form.querySelector("[data-quote-submit]");
    button.disabled = !whatsappReady;
    if (whatsappReady) { status.hidden = true; status.textContent = ""; }
    let started = false;
    form.addEventListener("input", () => { if (!started) { started = true; track("quote_start"); } });
    const date = form.elements.date;
    const today = new Date();
    const localDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
    date.min = localDate;
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!whatsappReady || !form.reportValidity()) return;
      const data = new FormData(form);
      const text = `Hello Drive On! I would like a driver-included trip quote.\nPick-up: ${data.get("pickup").trim()}\nRoute: ${data.get("destination").trim()}\nDate: ${data.get("date")}\nTravellers: ${data.get("passengers")}\nDetails: ${data.get("details").trim() || "None added"}\nPlease confirm vehicle availability, total charges, inclusions and booking terms.`;
      track("quote_submit");
      track("whatsapp_click", { source: "quote_form", configured: true });
      const url = `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`;
      status.hidden = false;
      status.textContent = "Your message is ready. Review and send it in WhatsApp; your booking is not yet confirmed. ";
      const link = document.createElement("a"); link.href = url; link.textContent = "Open WhatsApp"; status.append(link);
      window.location.assign(url);
    });
  });
})();
