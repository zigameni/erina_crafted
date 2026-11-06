import type { CSSProperties } from "react";
import Link from "next/link";

import type { Locale, SiteContent } from "@/lib/content";

import { HomeBehavior } from "./home-behavior";
import { homeFontVariables } from "./fonts";

/**
 * Concept 01, rendered from content rather than hard-coded copy, so the admin
 * panel can edit every word and image and the same markup serves both locales.
 */
export function HomePage({ content, locale }: { content: SiteContent; locale: Locale }) {
  const { brand, nav, header, hero, intro, services, work, studio, contact, footer, langLink } =
    content;

  const details = [contact.phone, contact.location].filter(Boolean).join(" · ");

  return (
    <div className={`erina ${homeFontVariables}`} lang={locale}>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <header className="site-head" data-header>
        <div className="site-head__inner">
          <a className="wordmark" href="#top" aria-label={`${brand.name} ${brand.sub} — home`}>
            <span className="wordmark__name">{brand.name}</span>
            <span className="wordmark__sub">{brand.sub}</span>
          </a>

          <nav className="nav" aria-label="Primary">
            {nav.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="site-head__actions">
            <a
              className="link-quiet"
              href={contact.instagramUrl}
              target="_blank"
              rel="noreferrer noopener"
            >
              {header.instagramLabel}
            </a>
            <a className="link-quiet lang-switch" href={langLink.href} hrefLang={langLink.hreflang}>
              {langLink.label}
            </a>
            <a className="btn btn--line" href="#contact">
              {header.cta}
            </a>
            <button
              className="menu-btn"
              type="button"
              aria-expanded="false"
              aria-controls="mobile-menu"
              data-menu-btn
            >
              <span className="menu-btn__label">Menu</span>
              <span className="menu-btn__bars" aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="mobile-menu" id="mobile-menu" data-menu hidden>
        <nav className="mobile-menu__nav" aria-label="Mobile">
          {nav.map((link, index) => (
            <a key={link.href} href={link.href}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="mobile-menu__foot">
          <a href={contact.instagramUrl} target="_blank" rel="noreferrer noopener">
            Instagram — {contact.instagramHandle}
          </a>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <a href={langLink.href} hrefLang={langLink.hreflang}>
            {langLink.label}
          </a>
        </div>
      </div>

      <main id="main">
        {/* HERO */}
        <section className="hero" id="top">
          <div className="hero__media">
            {/* eslint-disable-next-line @next/next/no-img-element -- full-bleed art direction; swapped for next/image when real photography lands */}
            <img
              data-hero-img
              src={hero.image.src}
              alt={hero.image.alt}
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="hero__veil" aria-hidden="true" />

          <div className="hero__content wrap">
            <p className="label label--light hero__eyebrow">{hero.eyebrow}</p>
            <h1 className="hero__title">
              {hero.title.line1}
              <br />
              {hero.title.line2Before}
              <em>{hero.title.emphasis}</em>
              {hero.title.line2After}
            </h1>
            <div className="hero__row">
              <p className="hero__lede">{hero.lede}</p>
              <a className="btn btn--solid" href="#work">
                {hero.cta}
              </a>
            </div>
          </div>

          <div className="hero__foot wrap">
            <span className="hero__scroll">
              <i aria-hidden="true" />
              Scroll
            </span>
            <span className="hero__meta">{hero.footMeta}</span>
          </div>
        </section>

        {/* INTRO */}
        <section className="intro wrap section" id="intro">
          <p className="label reveal">{intro.label}</p>
          <div className="intro__body">
            <h2 className="display reveal">{intro.heading}</h2>
            <div className="intro__aside reveal">
              <p>{intro.body}</p>
              {intro.fineprint && <p className="fineprint">{intro.fineprint}</p>}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="services section" id="services">
          <div className="wrap">
            <div className="section-head">
              <p className="label reveal">{services.label}</p>
              <h2 className="display display--sm reveal">{services.heading}</h2>
            </div>

            <div className="services__layout">
              <div className="services__list" data-services>
                {services.items.map((service, index) => (
                  <a className="service" href="#contact" key={`${service.title}-${index}`}>
                    <span className="service__num">{String(index + 1).padStart(2, "0")}</span>
                    <div className="service__text">
                      <h3 className="service__title">{service.title}</h3>
                      <p className="service__copy">{service.copy}</p>
                    </div>
                    <span className="service__arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                ))}
              </div>

              <div className="services__media" aria-hidden="true">
                <div className="services__frame">
                  {services.items.map((service, index) => (
                    // eslint-disable-next-line @next/next/no-img-element -- decorative crossfade layer, no layout box of its own
                    <img
                      key={`${service.image}-${index}`}
                      className={`services__img${index === 0 ? " is-active" : ""}`}
                      src={service.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  ))}
                </div>
                <p className="services__caption">{services.caption}</p>
              </div>
            </div>
          </div>
        </section>

        {/* WORK */}
        <section className="work section" id="work">
          <div className="wrap">
            <div className="section-head section-head--split">
              <div>
                <p className="label reveal">{work.label}</p>
                <h2 className="display display--sm reveal">{work.heading}</h2>
              </div>
              <p className="section-head__note reveal">{work.note}</p>
            </div>

            <div className="work__list">
              {work.items.map((project, index) => (
                <figure
                  className={`project reveal${project.portrait ? " project--offset" : ""}`}
                  key={`${project.name}-${index}`}
                >
                  <a className="project__link" href="#contact">
                    <div
                      className={`project__media${project.portrait ? " project__media--portrait" : ""}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- temporary photography, replaced when the studio supplies its own */}
                      <img
                        src={project.image}
                        alt={project.alt}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <figcaption className="project__caption">
                      <span className="project__index">{String(index + 1).padStart(2, "0")}</span>
                      <span className="project__name">{project.name}</span>
                      <span className="project__meta">{project.meta}</span>
                    </figcaption>
                  </a>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* STUDIO */}
        <section className="studio section" id="studio">
          <div className="wrap studio__grid">
            <div className="studio__media reveal">
              {/* eslint-disable-next-line @next/next/no-img-element -- temporary photography */}
              <img src={studio.image.src} alt={studio.image.alt} loading="lazy" decoding="async" />
              <p className="studio__caption">{studio.caption}</p>
            </div>

            <div className="studio__copy">
              <p className="label reveal">{studio.label}</p>
              <h2 className="display reveal">
                {studio.heading.before}
                <em>{studio.heading.emphasis}</em>
                {studio.heading.after}
              </h2>
              <p className="reveal">{studio.body}</p>

              <ul className="materials reveal">
                {studio.materials.map((material, index) => (
                  <li key={`${material.name}-${index}`}>
                    <span
                      className="materials__swatch"
                      style={{ "--swatch": material.swatch } as CSSProperties}
                      aria-hidden="true"
                    />
                    {material.name}
                  </li>
                ))}
              </ul>

              <a className="link-arrow reveal" href="#contact">
                {studio.link} <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="contact" id="contact">
          <div className="wrap contact__inner">
            <p className="label label--light reveal">{contact.label}</p>
            <h2 className="contact__title reveal">
              {contact.title.line1}
              <br />
              {contact.title.before}
              <em>{contact.title.emphasis}</em>
              {contact.title.line2After}
            </h2>
            <div className="contact__row reveal">
              <div className="contact__copy">
                <p className="contact__lede">{contact.lede}</p>
                {details && <p className="contact__details">{details}</p>}
              </div>
              <div className="contact__actions">
                <a className="btn btn--solid btn--wide" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
                <a
                  className="btn btn--ghost"
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {contact.instagramHandle}
                </a>
              </div>
            </div>
            {contact.fineprint && (
              <p className="fineprint fineprint--light reveal">{contact.fineprint}</p>
            )}
          </div>
        </section>
      </main>

      <footer className="site-foot">
        <div className="wrap site-foot__inner">
          <a className="wordmark wordmark--foot" href="#top">
            <span className="wordmark__name">{brand.name}</span>
            <span className="wordmark__sub">{brand.sub}</span>
          </a>
          <nav className="site-foot__nav" aria-label="Footer">
            {nav.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="site-foot__meta">
            <p>
              © {new Date().getFullYear()} {footer.copyrightName}
            </p>
            <Link href="/zg-login">{footer.signIn}</Link>
          </div>
        </div>
      </footer>

      <HomeBehavior />
    </div>
  );
}
