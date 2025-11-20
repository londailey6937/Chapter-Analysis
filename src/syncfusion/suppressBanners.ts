const TEXT_MATCHERS = ["syncfusion", "license", "claim your free account"];

const SELECTORS = [
  "[class*='license']",
  "[id*='license']",
  ".e-de-triallicense",
  ".e-de-licensediag",
  ".e-control.e-dialog",
];

const LOG_PREFIX = "[SyncfusionBannerGuard]";

const isBrowser =
  typeof window !== "undefined" && typeof document !== "undefined";

const normalizeText = (value: string | null | undefined) =>
  value?.toLowerCase().replace(/\s+/g, " ").trim() ?? "";

const matchesTextHeuristics = (text: string) =>
  text.includes("syncfusion") &&
  (text.includes("license") || text.includes("claim your free account"));

const shouldRemoveElement = (el: Element) => {
  if (!(el instanceof HTMLElement)) {
    return false;
  }

  if (
    SELECTORS.some((selector) => {
      try {
        return el.matches(selector);
      } catch {
        return false;
      }
    })
  ) {
    const text = normalizeText(el.textContent);
    return text.length === 0 || matchesTextHeuristics(text);
  }

  const text = normalizeText(el.textContent);
  return text !== "" && matchesTextHeuristics(text);
};

const removeBannerElements = (root: ParentNode) => {
  if (!isBrowser) return;

  const removed: Element[] = [];
  root.querySelectorAll("*").forEach((node) => {
    if (shouldRemoveElement(node)) {
      removed.push(node as Element);
    }
  });

  removed.forEach((node) => node.remove());

  if (removed.length > 0 && import.meta.env.DEV) {
    console.info(`${LOG_PREFIX} removed ${removed.length} banner element(s).`);
  }
};

const observeForBanners = () => {
  if (!isBrowser) {
    return;
  }

  const body = document.body;
  if (!body) {
    return;
  }

  removeBannerElements(body);

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          if (shouldRemoveElement(node)) {
            node.remove();
            if (import.meta.env.DEV) {
              console.info(`${LOG_PREFIX} removed banner via mutation.`);
            }
            return;
          }
          removeBannerElements(node);
        }
      });
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  window.addEventListener("beforeunload", () => observer.disconnect(), {
    once: true,
  });
};

if (isBrowser) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observeForBanners, {
      once: true,
    });
  } else {
    observeForBanners();
  }
}
