export interface NavLink {
  text?: string;
  href?: string;
  ariaLabel?: string;
  icon?: string;
  links?: NavLink[];
  columns?: Array<{ title: string; links: NavLink[] }>;
}

export const mobileLinkClass =
  'flex items-center rounded-[12px] px-3 py-3 font-sans text-[16px] font-medium leading-none text-white/90 transition-colors hover:bg-white/10 hover:text-white';
export const mobilePanelClass =
  'absolute inset-x-0 top-[calc(100%+8px)] z-50 max-h-[min(24rem,calc(100dvh-5.5rem))] flex-col overflow-y-auto rounded-[var(--aw-radius-xl)] border border-white/10 bg-section-dark p-3 shadow-[4px_4px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl';
