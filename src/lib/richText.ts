import DOMPurify from "dompurify";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

/**
 * Converts TipTap/plain text content into display HTML.
 * Note: formatting-only; sanitization is applied separately.
 */
export const toDisplayHtmlFromContent = (value: string) => {
  const raw = value ?? "";
  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(raw);
  if (looksLikeHtml) {
    try {
      const doc = new DOMParser().parseFromString(raw, "text/html");
      const paragraphs = Array.from(doc.body.querySelectorAll("p"));

      for (const p of paragraphs) {
        const inner = (p.innerHTML ?? "").trim();
        const isEmpty = inner === "" || /^<br\s*\/?>$/i.test(inner);
        if (isEmpty) {
          const br = doc.createElement("br");
          p.replaceWith(br);
          continue;
        }

        // TipTap creates a new <p> for single line breaks; avoid extra spacing.
        p.setAttribute("style", "margin:0;");
      }

      // If a <p> is immediately followed by a <br>, remove bottom margin.
      const directChildren = Array.from(doc.body.children);
      for (let i = 0; i < directChildren.length - 1; i += 1) {
        const el = directChildren[i];
        const next = directChildren[i + 1];
        if (el.tagName === "P" && next.tagName === "BR") {
          el.setAttribute("style", "margin:0;");
        }
      }

      // Collapse consecutive <br>
      const nodes = Array.from(doc.body.childNodes);
      let lastWasBr = false;
      for (const n of nodes) {
        if (n.nodeType === Node.ELEMENT_NODE && (n as Element).tagName === "BR") {
          if (lastWasBr) {
            n.parentNode?.removeChild(n);
            continue;
          }
          lastWasBr = true;
        } else if (n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim() === "") {
          // ignore whitespace text nodes
        } else {
          lastWasBr = false;
        }
      }

      return doc.body.innerHTML;
    } catch {
      return raw
        .replace(/<p>\s*<\/p>/gi, "<br />")
        .replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, "<br />")
        .replace(/<p>/gi, "<p style='margin:0;'>");
    }
  }

  const escaped = escapeHtml(raw)
    .replace(/\r\n/g, "\n")
    .replace(/\n[ \t]+\n/g, "\n\n");
  const paragraphs = escaped
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, "<br />").trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return "<p></p>";
  return `<p>${paragraphs.join("</p><p>")}</p>`;
};

export const sanitizeHtml = (html: string) =>
  DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed"],
    FORBID_ATTR: ["onerror", "onclick", "onload"],
  });

export const toSafeHtmlFromContent = (value: string) =>
  sanitizeHtml(toDisplayHtmlFromContent(value));

