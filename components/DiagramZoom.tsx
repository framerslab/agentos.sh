"use client";

import { useEffect } from "react";

/**
 * Global click-to-zoom for hero diagram <img src="/img/diagrams/*.svg"> tags.
 *
 * Mirrors the docs site's mermaid-zoom.js: delegated click handler opens a
 * full-screen modal with zoom (-/+/reset), mouse-wheel zoom, click-drag pan,
 * and Escape/X to close. Selector is scoped to /img/diagrams/ so blog hero
 * images and other site imagery are untouched.
 *
 * Mount once in the root layout. Returns null — the component only registers
 * DOM listeners and styles.
 */
export default function DiagramZoom() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let modal: HTMLDivElement | null = null;
    let currentZoom = 150;
    let panX = 0;
    let panY = 0;
    let isPanning = false;
    let panStartX = 0;
    let panStartY = 0;

    const MIN_ZOOM = 50;
    const MAX_ZOOM = 400;
    const DEFAULT_ZOOM = 150;
    const ZOOM_STEP = 10;

    const applyTransform = () => {
      const wrap = document.getElementById("agentos-zoom-wrap");
      if (wrap) {
        const scale = currentZoom / 100;
        wrap.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
      }
    };

    const setZoom = (value: number) => {
      currentZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value));
      const label = document.getElementById("agentos-zoom-label");
      if (label) label.textContent = currentZoom + "%";
      applyTransform();
    };

    const hideModal = () => {
      if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "";
        isPanning = false;
      }
    };

    const getModal = (): HTMLDivElement => {
      if (modal) return modal;

      modal = document.createElement("div");
      modal.id = "agentos-zoom-modal";
      Object.assign(modal.style, {
        position: "fixed",
        inset: "0",
        zIndex: "99999",
        background: "rgba(0, 0, 0, 0.92)",
        backdropFilter: "blur(8px)",
        display: "none",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      } as Partial<CSSStyleDeclaration>);

      const toolbar = document.createElement("div");
      Object.assign(toolbar.style, {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 1rem",
        background: "rgba(255,255,255,0.08)",
        borderRadius: "8px",
        marginBottom: "0.75rem",
        userSelect: "none",
      } as Partial<CSSStyleDeclaration>);

      const btnStyle: Partial<CSSStyleDeclaration> = {
        background: "rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.2)",
        borderRadius: "6px",
        padding: "0.4rem 0.75rem",
        cursor: "pointer",
        color: "#fff",
        fontSize: "0.85rem",
        fontWeight: "600",
        transition: "background 0.15s",
      };
      const hover = (b: HTMLButtonElement) => {
        b.addEventListener("mouseenter", () => (b.style.background = "rgba(255,255,255,0.2)"));
        b.addEventListener("mouseleave", () => (b.style.background = "rgba(255,255,255,0.1)"));
      };

      const zoomOut = document.createElement("button");
      zoomOut.textContent = "−";
      zoomOut.title = "Zoom out";
      Object.assign(zoomOut.style, btnStyle);
      zoomOut.addEventListener("click", () => setZoom(currentZoom - ZOOM_STEP));
      hover(zoomOut);

      const zoomLabel = document.createElement("span");
      zoomLabel.id = "agentos-zoom-label";
      Object.assign(zoomLabel.style, {
        color: "#fff",
        fontSize: "0.8rem",
        minWidth: "3.5rem",
        textAlign: "center",
        fontFamily: "monospace",
      } as Partial<CSSStyleDeclaration>);
      zoomLabel.textContent = "150%";

      const zoomIn = document.createElement("button");
      zoomIn.textContent = "+";
      zoomIn.title = "Zoom in";
      Object.assign(zoomIn.style, btnStyle);
      zoomIn.addEventListener("click", () => setZoom(currentZoom + ZOOM_STEP));
      hover(zoomIn);

      const resetBtn = document.createElement("button");
      resetBtn.textContent = "Reset";
      resetBtn.title = "Reset to 150%";
      Object.assign(resetBtn.style, { ...btnStyle, marginLeft: "0.25rem" });
      resetBtn.addEventListener("click", () => {
        setZoom(DEFAULT_ZOOM);
        panX = 0;
        panY = 0;
        applyTransform();
      });
      hover(resetBtn);

      const sep = document.createElement("span");
      Object.assign(sep.style, {
        width: "1px",
        height: "1.2rem",
        background: "rgba(255,255,255,0.2)",
        margin: "0 0.25rem",
      } as Partial<CSSStyleDeclaration>);

      const closeBtn = document.createElement("button");
      closeBtn.textContent = "✕ Close";
      closeBtn.title = "Close (Escape)";
      Object.assign(closeBtn.style, { ...btnStyle, marginLeft: "0.5rem" });
      closeBtn.addEventListener("click", () => hideModal());
      hover(closeBtn);

      toolbar.append(zoomOut, zoomLabel, zoomIn, resetBtn, sep, closeBtn);

      const container = document.createElement("div");
      container.id = "agentos-zoom-container";
      Object.assign(container.style, {
        overflow: "hidden",
        borderRadius: "12px",
        background: "var(--background-surface, #1b1b1d)",
        maxWidth: "95vw",
        maxHeight: "calc(90vh - 4rem)",
        width: "100%",
        cursor: "grab",
        position: "relative",
      } as Partial<CSSStyleDeclaration>);

      const wrap = document.createElement("div");
      wrap.id = "agentos-zoom-wrap";
      Object.assign(wrap.style, {
        transformOrigin: "0 0",
        transition: "transform 0.1s ease-out",
        padding: "2rem",
      } as Partial<CSSStyleDeclaration>);
      container.appendChild(wrap);

      container.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        isPanning = true;
        panStartX = e.clientX - panX;
        panStartY = e.clientY - panY;
        container.style.cursor = "grabbing";
        e.preventDefault();
      });
      window.addEventListener("mousemove", (e) => {
        if (!isPanning) return;
        panX = e.clientX - panStartX;
        panY = e.clientY - panStartY;
        applyTransform();
      });
      window.addEventListener("mouseup", () => {
        if (isPanning) {
          isPanning = false;
          container.style.cursor = "grab";
        }
      });
      container.addEventListener(
        "wheel",
        (e) => {
          e.preventDefault();
          const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
          setZoom(currentZoom + delta);
        },
        { passive: false },
      );

      modal.append(toolbar, container);
      document.body.appendChild(modal);

      modal.addEventListener("click", (e) => {
        if (e.target === modal) hideModal();
      });

      return modal;
    };

    const showModal = (node: HTMLElement) => {
      const m = getModal();
      const wrap = document.getElementById("agentos-zoom-wrap");
      if (!wrap) return;

      currentZoom = DEFAULT_ZOOM;
      panX = 0;
      panY = 0;

      while (wrap.firstChild) wrap.removeChild(wrap.firstChild);

      const clone = node.cloneNode(true) as HTMLElement;
      clone.style.width = "100%";
      clone.style.height = "auto";
      clone.style.display = "block";
      clone.removeAttribute("width");
      clone.removeAttribute("height");
      clone.style.borderRadius = "0";
      clone.style.margin = "0";
      clone.style.pointerEvents = "none";
      wrap.appendChild(clone);

      const label = document.getElementById("agentos-zoom-label");
      if (label) label.textContent = DEFAULT_ZOOM + "%";

      applyTransform();
      m.style.display = "flex";
      document.body.style.overflow = "hidden";
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("a")) return;
      const img = target.closest('img[src*="/img/diagrams/"]') as HTMLImageElement | null;
      if (!img) return;
      e.preventDefault();
      e.stopPropagation();
      showModal(img);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hideModal();
      if (!modal || modal.style.display === "none") return;
      if (e.key === "+" || e.key === "=") setZoom(currentZoom + ZOOM_STEP);
      if (e.key === "-" || e.key === "_") setZoom(currentZoom - ZOOM_STEP);
      if (e.key === "0") {
        setZoom(DEFAULT_ZOOM);
        panX = 0;
        panY = 0;
        applyTransform();
      }
    };

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);

    const styleEl = document.createElement("style");
    styleEl.id = "agentos-diagram-zoom-style";
    styleEl.textContent = `
      img[src*="/img/diagrams/"] {
        cursor: zoom-in;
        transition: opacity 0.15s ease, box-shadow 0.15s ease;
        border-radius: 8px;
      }
      img[src*="/img/diagrams/"]:hover {
        opacity: 0.88;
        box-shadow: 0 0 0 2px var(--accent-primary, #6366f1);
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
      styleEl.remove();
      if (modal) {
        modal.remove();
        modal = null;
      }
    };
  }, []);

  return null;
}
