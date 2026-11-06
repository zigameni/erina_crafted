"use client";

import { useEffect } from "react";

/**
 * The small amount of behaviour concept 01 needs: header scroll state, the
 * mobile menu, scroll reveals, the hero parallax and the service list ↔ image
 * pairing. It is deliberately imperative — the page it decorates never
 * re-renders, so writing to the DOM here costs nothing and avoids turning the
 * whole marketing page into a client component.
 */
export function HomeBehavior() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");

    const header = document.querySelector<HTMLElement>("[data-header]");
    const heroImg = document.querySelector<HTMLImageElement>("[data-hero-img]");

    /* ---------- header state + hero parallax ---------- */

    let frameQueued = false;

    // Only the transform write is deferred: it is the one that would otherwise
    // run dozens of times per scroll burst.
    function onFrame() {
      frameQueued = false;
      if (!heroImg || reduceMotion.matches) return;

      const shift = Math.min(window.scrollY * 0.12, 140);
      // Written straight to the element rather than through a CSS variable on
      // .hero — a variable there would restyle every descendant each frame.
      heroImg.style.transform = `scale(1.08) translate3d(0, ${shift.toFixed(1)}px, 0)`;
    }

    function onScroll() {
      header?.classList.toggle("is-scrolled", window.scrollY > 24);
      if (frameQueued) return;
      frameQueued = true;
      window.requestAnimationFrame(onFrame);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* ---------- mobile menu ---------- */

    const menuBtn = document.querySelector<HTMLButtonElement>("[data-menu-btn]");
    const menu = document.querySelector<HTMLElement>("[data-menu]");
    let closeTimer = 0;

    function openMenu() {
      if (!menu || !menuBtn) return;
      window.clearTimeout(closeTimer);
      menu.hidden = false;
      document.body.classList.add("is-locked");
      menuBtn.setAttribute("aria-expanded", "true");
      // Force a layout read so the opening transition always has a start frame.
      void menu.offsetHeight;
      menu.classList.add("is-open");
      // Focus deliberately stays on the trigger: the panel is the next thing in
      // DOM order, so Tab walks straight into it, and Escape returns here. A
      // focus move at this moment is unreliable — the panel is still mid
      // visibility change — and a disclosure that keeps focus on its button is
      // the pattern assistive tech expects.
    }

    function closeMenu(returnFocus: boolean) {
      if (!menu || !menuBtn) return;
      menu.classList.remove("is-open");
      document.body.classList.remove("is-locked");
      menuBtn.setAttribute("aria-expanded", "false");
      closeTimer = window.setTimeout(() => {
        menu.hidden = true;
      }, 320);
      if (returnFocus) menuBtn.focus({ preventScroll: true });
    }

    function onMenuButton() {
      if (!menuBtn) return;
      if (menuBtn.getAttribute("aria-expanded") === "true") closeMenu(false);
      else openMenu();
    }

    function onMenuClick(event: MouseEvent) {
      if ((event.target as Element | null)?.closest("a")) closeMenu(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || !menuBtn) return;
      if (menuBtn.getAttribute("aria-expanded") === "true") closeMenu(true);
    }

    function onResize() {
      if (!menuBtn) return;
      if (window.innerWidth > 896 && menuBtn.getAttribute("aria-expanded") === "true") {
        closeMenu(false);
      }
    }

    if (menuBtn && menu) {
      menuBtn.addEventListener("click", onMenuButton);
      menu.addEventListener("click", onMenuClick);
      document.addEventListener("keydown", onKeyDown);
      window.addEventListener("resize", onResize);
    }

    /* ---------- scroll reveals ---------- */

    const revealables = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    let observer: IntersectionObserver | undefined;

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      revealables.forEach((el) => el.classList.add("is-in"));
    } else {
      // Stagger only siblings, and cap the cascade so late items never lag.
      revealables.forEach((el) => {
        const parent = el.parentElement;
        if (!parent) return;
        const siblings = Array.from(parent.children).filter((node) =>
          node.classList.contains("reveal"),
        );
        const index = Math.min(siblings.indexOf(el), 4);
        if (index > 0) el.style.setProperty("--reveal-delay", `${index * 70}ms`);
      });

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-in");
            observer?.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
      );

      revealables.forEach((el) => observer?.observe(el));
    }

    /* ---------- services: the list drives the image ---------- */

    const serviceList = document.querySelector<HTMLElement>("[data-services]");
    const serviceImages = Array.from(document.querySelectorAll<HTMLElement>(".services__img"));

    if (serviceList && serviceImages.length) {
      const services = Array.from(serviceList.querySelectorAll<HTMLElement>(".service"));

      const setActive = (index: number) => {
        services.forEach((service, i) => service.classList.toggle("is-active", i === index));
        serviceImages.forEach((img, i) => img.classList.toggle("is-active", i === index));
      };

      services.forEach((service, index) => {
        const activate = () => setActive(index);
        service.addEventListener("mouseenter", activate);
        service.addEventListener("focus", activate);
        service.addEventListener("click", activate);
        // Touch users get the same pairing on tap.
        if (!canHover.matches) {
          service.addEventListener("touchstart", activate, { passive: true });
        }
      });

      setActive(0);
    }

    /* ---------- teardown ---------- */

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("keydown", onKeyDown);
      menuBtn?.removeEventListener("click", onMenuButton);
      menu?.removeEventListener("click", onMenuClick);
      window.clearTimeout(closeTimer);
      observer?.disconnect();
      document.body.classList.remove("is-locked");
    };
  }, []);

  return null;
}
