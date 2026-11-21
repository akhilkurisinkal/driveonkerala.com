"use strict";
// Single source of truth. E.164 phone; WhatsApp digits with country code, no +.
// After changes run: python3 scripts/sync-settings.py (updates static no-JS links).
const BUSINESS = /* BUSINESS_CONFIG_START */ {
  "name": "Drive On Tours & Travels",
  "phone": "+919895122149",
  "whatsapp": "919895122149",
  "email": "",
  "location": "",
  "siteUrl": ""
} /* BUSINESS_CONFIG_END */;

(() => {
  const analyticsId = "G-4YWQ8DR0JC";
  const analyticsEnabled = ["driveonkerala.com", "www.driveonkerala.com"].includes(window.location.hostname);
  if (analyticsEnabled) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", analyticsId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: window.location.origin + window.location.pathname,
      page_referrer: document.referrer ? new URL(document.referrer).origin : ""
    });
    window.gtag("event", "page_view");
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtag/js?id=" + analyticsId;
    document.head.append(tag);
  }

  const whatsappReady = /^[1-9]\d{7,14}$/.test(BUSINESS.whatsapp);
  const phoneReady = /^\+[1-9]\d{7,14}$/.test(BUSINESS.phone);
  const message = "Hello Drive On! I would like to plan a driver-included trip from Kochi.";
  // Subscribe using document.addEventListener('driveon:analytics', handler).
  // No third-party tracking by default. Never include travellers' form values.
  function track(name, detail = {}) {
    document.dispatchEvent(new CustomEvent("driveon:analytics", { detail: { event: name, ...detail } }));
    if (!analyticsEnabled) return;
    if (name === "whatsapp_click") {
      window.gtag("event", detail.source === "quote_form" ? "whatsapp_quote_open" : "whatsapp_contact_open");
    } else if (name === "phone_click" || name === "quote_start" || name === "vehicle_quote_click") {
      window.gtag("event", name);
    }
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
  const quoteParams = new URLSearchParams(window.location.search);
  const suggestedRoute = quoteParams.get("route")?.trim().slice(0, 200);
  const preferredVehicle = quoteParams.get("vehicle")?.trim().slice(0, 80);
  document.querySelectorAll("[data-quote-form]").forEach(form => {
    if (suggestedRoute && !form.elements.destination.value) form.elements.destination.value = suggestedRoute;
    if (preferredVehicle && !form.elements.details.value) form.elements.details.value = "Preferred vehicle: " + preferredVehicle;
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
      const source = form.dataset.quoteSource;
      const message = source ? text + "\nEnquiry page: " + source : text;
      const url = `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
      status.hidden = false;
      status.textContent = "Your message is ready. Review and send it in WhatsApp; your booking is not yet confirmed. ";
      const link = document.createElement("a"); link.href = url; link.textContent = "Open WhatsApp"; status.append(link);
      window.location.assign(url);
    });
  });
})();
