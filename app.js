(function () {
  const cfg = window.OLGAC_CONFIG || {};
  const email = cfg.email || "olgacasansor27@gmail.com";
  const whatsapp = cfg.whatsapp || "905412675672";

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const mailLink = document.getElementById("mail-link");
  const mailText = document.getElementById("mail-text");
  if (mailLink) mailLink.href = "mailto:" + email;
  if (mailText) mailText.textContent = email;

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("ana-menu");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        document.body.classList.remove("menu-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const fileInput = document.getElementById("rapor-dosya");
  const fileName = document.getElementById("file-name");
  const fileDrop = document.getElementById("file-drop");
  if (fileInput && fileName) {
    fileInput.addEventListener("change", function () {
      fileName.textContent = fileInput.files[0] ? fileInput.files[0].name : "";
    });
  }
  if (fileDrop && fileInput) {
    ["dragenter", "dragover"].forEach(function (evt) {
      fileDrop.addEventListener(evt, function (e) {
        e.preventDefault();
        fileDrop.style.borderColor = "#7eb8e0";
      });
    });
    ["dragleave", "drop"].forEach(function (evt) {
      fileDrop.addEventListener(evt, function (e) {
        e.preventDefault();
        fileDrop.style.borderColor = "";
      });
    });
    fileDrop.addEventListener("drop", function (e) {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        fileInput.files = e.dataTransfer.files;
        fileName.textContent = e.dataTransfer.files[0].name;
      }
    });
  }

  function valueOf(form, name) {
    const el = form.elements[name];
    return el && el.value ? el.value.trim() : "";
  }

  function setStatus(el, text) {
    if (el) el.textContent = text;
  }

  function sendToInbox(form, subject, statusEl) {
    const data = new FormData(form);
    data.append("_subject", subject);
    data.append("_template", "table");
    data.append("_captcha", "false");
    data.append("_honey", "");

    setStatus(statusEl, "Gönderiliyor...");

    return fetch("https://formsubmit.co/ajax/" + encodeURIComponent(email), {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    })
      .then(function (res) {
        return res.json().then(function (json) {
          return { ok: res.ok, json: json };
        });
      })
      .then(function (result) {
        if (result.ok) {
          setStatus(
            statusEl,
            "Talebiniz " + email + " adresine iletildi. İlk gönderimde Gmail’deki onay linkine tıklamanız gerekir."
          );
          form.reset();
          if (fileName) fileName.textContent = "";
          return;
        }
        throw new Error("submit failed");
      })
      .catch(function () {
        const lines = [];
        Array.from(form.elements).forEach(function (el) {
          if (!el.name || el.type === "file" || el.type === "submit" || el.type === "button") return;
          lines.push(el.name + ": " + (el.value || "").trim());
        });
        window.location.href =
          "mailto:" +
          email +
          "?subject=" +
          encodeURIComponent(subject) +
          "&body=" +
          encodeURIComponent(lines.join("\n"));
        setStatus(statusEl, "E-posta penceresi açıldı. Gönder’e basmanız yeterli.");
      });
  }

  function openWhatsApp(text) {
    window.open("https://wa.me/" + whatsapp + "?text=" + encodeURIComponent(text), "_blank", "noopener");
  }

  const raporForm = document.getElementById("rapor-form");
  const raporStatus = document.getElementById("rapor-status");
  function raporBody(form) {
    const file = fileInput && fileInput.files[0] ? fileInput.files[0].name : "Dosya seçilmedi";
    return [
      "Olgaç Asansör — Muayene raporu / fiyat talebi",
      "",
      "Ad: " + valueOf(form, "ad"),
      "Telefon: " + valueOf(form, "telefon"),
      "E-posta: " + valueOf(form, "eposta"),
      "Konum: " + valueOf(form, "konum"),
      "Dosya: " + file,
      "Not: " + valueOf(form, "not"),
      "",
      "Not: Rapor dosyasını e-posta veya WhatsApp ekine eklemeyi unutmayın.",
    ].join("\n");
  }

  if (raporForm) {
    raporForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!raporForm.reportValidity()) return;
      sendToInbox(raporForm, "Rapor / fiyat talebi — Olgaç Asansör", raporStatus);
    });
  }

  const raporWa = document.getElementById("rapor-whatsapp");
  if (raporWa && raporForm) {
    raporWa.addEventListener("click", function () {
      if (!raporForm.reportValidity()) return;
      openWhatsApp(raporBody(raporForm));
      if (raporStatus) {
        raporStatus.textContent = "WhatsApp açıldı. Rapor fotoğrafını sohbete ekleyebilirsiniz.";
      }
    });
  }

  const teklifForm = document.getElementById("teklif-form");
  const teklifStatus = document.getElementById("teklif-status");
  function teklifBody(form) {
    return [
      "Olgaç Asansör — Keşif ve teklif talebi",
      "",
      "Ad: " + valueOf(form, "ad"),
      "Telefon: " + valueOf(form, "telefon"),
      "E-posta: " + valueOf(form, "eposta"),
      "Hizmet: " + valueOf(form, "hizmet"),
      "Konum: " + valueOf(form, "konum"),
      "Mesaj: " + valueOf(form, "mesaj"),
    ].join("\n");
  }

  if (teklifForm) {
    teklifForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!teklifForm.reportValidity()) return;
      sendToInbox(teklifForm, "Keşif ve teklif — Olgaç Asansör", teklifStatus);
    });
  }

  const teklifWa = document.getElementById("teklif-whatsapp");
  if (teklifWa && teklifForm) {
    teklifWa.addEventListener("click", function () {
      if (!teklifForm.reportValidity()) return;
      openWhatsApp(teklifBody(teklifForm));
      if (teklifStatus) teklifStatus.textContent = "WhatsApp mesajı hazırlandı.";
    });
  }
})();
