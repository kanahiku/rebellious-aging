class AwHeader extends HTMLElement {
  private onScroll?: () => void;
  private mql?: MediaQueryList;
  private onMqlChange?: () => void;
  private onResize?: () => void;
  private onPageLoad = () => {
    this.updateActiveLinks();
    this.closeOpenDropdown();
  };

  connectedCallback() {
    const header = this.querySelector<HTMLElement>('#header');
    const toggle = this.querySelector<HTMLElement>('[data-aw-toggle-menu]');
    const nav = this.querySelector<HTMLElement>('[data-desktop-nav]');
    const panel = this.querySelector<HTMLElement>('[data-mobile-panel]');

    // The header persists across view transitions (transition:persist), so
    // the server-rendered `aw-link-active` class would go stale. Re-compute it
    // on every navigation (astro:page-load fires on load and after each swap).
    this.updateActiveLinks();
    document.addEventListener('astro:page-load', this.onPageLoad);
    window.addEventListener('hashchange', this.onPageLoad);

    const setDropdownOpen = (li: HTMLElement, open: boolean) => {
      li.classList.toggle('expanded', open);
      li.querySelectorAll<HTMLElement>('[data-aw-toggle-dropdown]').forEach((btn) => {
        btn.setAttribute('aria-expanded', String(open));
      });
    };

    const collapseDropdowns = () => {
      nav?.querySelectorAll<HTMLElement>('li.dropdown.expanded').forEach((li) => setDropdownOpen(li, false));
    };

    const closeMenu = () => {
      toggle?.classList.remove('expanded');
      toggle?.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('overflow-hidden');
      header?.classList.remove('expanded');
      collapseDropdowns();
    };

    // Mobile menu toggle.
    toggle?.addEventListener('click', () => {
      const expanded = toggle.classList.toggle('expanded');
      toggle.setAttribute('aria-expanded', String(expanded));
      document.body.classList.toggle('overflow-hidden', expanded);
      header?.classList.toggle('expanded', expanded);
      if (!expanded) collapseDropdowns();
    });

    const isMobileNav = () => window.matchMedia('(max-width: 767px)').matches;

    // Mobile: accordion chevrons toggle a submenu. Desktop: ignore clicks so
    // the menu never pins open and the chevron does not flip on its own.
    nav?.addEventListener('click', (e) => {
      const dropdownToggle = (e.target as HTMLElement)?.closest<HTMLElement>('[data-aw-toggle-dropdown]');
      if (dropdownToggle) {
        if (!isMobileNav()) {
          dropdownToggle.blur();
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        const li = dropdownToggle.closest<HTMLElement>('li.dropdown');
        if (!li) return;
        const willOpen = !li.classList.contains('expanded');
        nav.querySelectorAll<HTMLElement>('li.dropdown.expanded').forEach((open) => {
          if (open !== li) setDropdownOpen(open, false);
        });
        setDropdownOpen(li, willOpen);
        return;
      }

      const link = (e.target as HTMLElement)?.closest<HTMLElement>('a');
      if (link) link.blur();

      if (header?.classList.contains('expanded')) closeMenu();
    });

    panel?.addEventListener('click', (e) => {
      const link = (e.target as HTMLElement)?.closest<HTMLElement>('a');
      if (link) closeMenu();
    });

    // Close it when leaving the mobile breakpoint.
    this.mql = window.matchMedia('(max-width: 767px)');
    this.onMqlChange = () => closeMenu();
    this.mql.addEventListener('change', this.onMqlChange);

    this.querySelectorAll<HTMLElement>('li.mega').forEach((li) => {
      li.addEventListener('mouseenter', () => this.clampMegaMenu(li));
      li.addEventListener('focusin', () => this.clampMegaMenu(li));
    });
    this.onResize = () => {
      this.querySelectorAll<HTMLElement>('li.mega:hover, li.mega:focus-within').forEach((li) => {
        this.clampMegaMenu(li);
      });
    };
    window.addEventListener('resize', this.onResize);

    // Sticky header: toggle the `scroll` class past a small threshold.
    if (header?.hasAttribute('data-aw-sticky-header')) {
      let ticking = false;
      const applyStyles = () => {
        if (window.scrollY > 60) header.classList.add('scroll');
        else header.classList.remove('scroll');
        ticking = false;
      };
      this.onScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(applyStyles);
          ticking = true;
        }
      };
      applyStyles();
      document.addEventListener('scroll', this.onScroll, { passive: true });
    }

    document.documentElement.classList.add('motion-safe:scroll-smooth');
  }

  disconnectedCallback() {
    if (this.onScroll) document.removeEventListener('scroll', this.onScroll);
    if (this.mql && this.onMqlChange) this.mql.removeEventListener('change', this.onMqlChange);
    if (this.onResize) window.removeEventListener('resize', this.onResize);
    document.removeEventListener('astro:page-load', this.onPageLoad);
    window.removeEventListener('hashchange', this.onPageLoad);
  }

  private clampMegaMenu(li: HTMLElement) {
    const menu = li.querySelector<HTMLElement>('.mega-menu');
    if (!menu) return;
    if (window.matchMedia('(max-width: 767px)').matches) {
      menu.style.removeProperty('--mega-shift');
      return;
    }

    menu.style.setProperty('--mega-shift', '0px');
    requestAnimationFrame(() => {
      const pad = 16;
      const vw = window.innerWidth;
      const rect = menu.getBoundingClientRect();
      if (!rect.width) return;

      let shift = 0;
      if (rect.width >= vw - pad * 2) {
        shift = pad - rect.left;
      } else if (rect.left < pad) {
        shift = pad - rect.left;
      } else if (rect.right > vw - pad) {
        shift = vw - pad - rect.right;
      }
      menu.style.setProperty('--mega-shift', `${Math.round(shift)}px`);
    });
  }

  // With `transition:persist` the header (and its focus) survives client-side
  // navigations, so a clicked dropdown link keeps `:focus-within` and its menu
  // would stay open on the next page. Drop the focus so the CSS closes it.
  private closeOpenDropdown() {
    const active = document.activeElement as HTMLElement | null;
    if (active && this.contains(active) && active.closest('.dropdown')) active.blur();
  }

  private updateActiveLinks() {
    const norm = (p: string) => '/' + p.replace(/^\/+|\/+$/g, '');
    const current = norm(window.location.pathname);
    const currentHash = window.location.hash;

    const isActive = (href: string) => {
      const url = new URL(href, window.location.origin);
      if (norm(url.pathname) !== current) return false;
      // Hash-only links still need an exact hash match. Path links stay
      // active when an in-page autoscroll hash is present
      // (e.g. /books vs /books#book-hair, /podcast vs /podcast#hair-scalp).
      if (url.hash) return url.hash === currentHash;
      return true;
    };

    this.querySelectorAll<HTMLAnchorElement>('nav a[href]').forEach((a) => {
      a.classList.toggle('aw-link-active', isActive(a.href));
    });

    this.querySelectorAll<HTMLElement>('nav > ul > li.dropdown').forEach((li) => {
      const childLinks = li.querySelectorAll<HTMLAnchorElement>('.dropdown-menu a[href]');
      const anyChildActive = Array.from(childLinks).some((a) => isActive(a.href));
      const trigger = li.querySelector<HTMLElement>(':scope > a, :scope > span, :scope > div > a, :scope > div > button');
      const triggerHref = trigger instanceof HTMLAnchorElement ? trigger.href : null;
      const triggerActive = Boolean(triggerHref && isActive(triggerHref));
      if (trigger) trigger.classList.toggle('aw-link-active', anyChildActive || triggerActive);
    });
  }
}

if (!customElements.get('aw-header')) {
  customElements.define('aw-header', AwHeader);
}
