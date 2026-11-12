const clamp = (value: number) => Math.max(0, Math.min(1, value));
const mobile = window.matchMedia('(max-width: 1023px)');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

function setupBucketGraphic(root: HTMLElement) {
  const row = root.querySelector<HTMLElement>('.bucket-graphic__row')!;
  const cascade = root.querySelector<SVGSVGElement>('.bucket-graphic__cascade')!;
  const streams = Array.from(root.querySelectorAll<SVGGElement>('.bucket-graphic__stream'));
  const b1 = root.querySelector<HTMLElement>('.bucket-graphic__bucket--one')!;
  const b2 = root.querySelector<HTMLElement>('.bucket-graphic__bucket--two')!;
  const b3 = root.querySelector<HTMLElement>('.bucket-graphic__bucket--three')!;
  const w1 = b1.querySelector<SVGPathElement>('.bucket-graphic__water')!;
  const w2 = b2.querySelector<SVGPathElement>('.bucket-graphic__water')!;

  if (!row || !cascade || streams.length < 2 || !b1 || !b2 || !b3 || !w1 || !w2) return;

  let lengths = [0, 0];
  let state = { fill1: 0, pour1: 0, fill2: 0, pour2: 0 };
  let step = 0;
  let playing = false;
  let ticking = false;

  function setLevel(path: SVGPathElement, level: number) {
    if (level <= 0.002) {
      path.style.opacity = '0';
      return;
    }
    path.style.opacity = '1';
    const y = 100 - level * 100;
    const left = 3 + (8 * y) / 100;
    const right = 97 - (8 * y) / 100;
    path.setAttribute('d', `M${left} ${y} L${right} ${y} L89 100 L11 100 Z`);
  }

  function setStream(index: number, amount: number) {
    const stream = streams[index];
    const base = stream.querySelector<SVGPathElement>('.bucket-graphic__base');
    if (!base) return;
    base.style.strokeDasharray = String(lengths[index]);
    base.style.strokeDashoffset = String(lengths[index] * (1 - amount));
    stream.classList.toggle('is-done', amount >= 1);
  }

  function box(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    const origin = row.getBoundingClientRect();
    return {
      left: rect.left - origin.left,
      right: rect.right - origin.left,
      top: rect.top - origin.top,
      bottom: rect.bottom - origin.top,
    };
  }

  function contentHeight(bucket: HTMLElement) {
    const rim = bucket.querySelector<HTMLElement>('.bucket-graphic__rim');
    const body = bucket.querySelector<HTMLElement>('.bucket-graphic__body');
    let height = rim?.offsetHeight ?? 0;
    if (!body) return height;
    Array.from(body.children).forEach((child) => {
      const element = child as HTMLElement;
      if (element.tagName.toLowerCase() === 'svg' || element.classList.contains('bucket-graphic__spacer')) return;
      height += element.offsetHeight;
    });
    return height + 24;
  }

  function sizeBuckets() {
    const all = [b1, b2, b3];
    if (!mobile.matches) {
      all.forEach((bucket) => {
        bucket.style.minHeight = '';
      });
      return;
    }
    const content = all.map(contentHeight);
    const stepHeight = 50;
    const h3 = Math.max(content[2], content[1] - stepHeight, content[0] - 2 * stepHeight);
    b1.style.minHeight = `${h3 + 2 * stepHeight}px`;
    b2.style.minHeight = `${h3 + stepHeight}px`;
    b3.style.minHeight = `${h3}px`;
  }

  function render() {
    setLevel(w1, state.fill1);
    setLevel(w2, 0.4 * state.fill2);
    if (mobile.matches) {
      setStream(0, state.pour1);
      setStream(1, state.pour2);
    }
  }

  function layout() {
    sizeBuckets();
    if (!mobile.matches) return;

    const origin = row.getBoundingClientRect();
    cascade.setAttribute('width', String(origin.width));
    cascade.setAttribute('height', String(origin.height));
    cascade.setAttribute('viewBox', `0 0 ${origin.width} ${origin.height}`);

    const first = box(b1);
    const second = box(b2);
    const third = box(b3);

    const x1 = first.right - 10;
    const y1 = first.top + 1;
    const xf = first.right + (origin.width - first.right) / 2;
    const d1 = `M ${x1} ${y1} C ${x1 + 8} ${y1 - 30}, ${xf} ${y1 - 26}, ${xf} ${y1 + 14} L ${xf} ${second.top - 6}`;

    const x2 = second.left + 10;
    const y2 = second.top + 1;
    const xg = second.left / 2;
    const d2 = `M ${x2} ${y2} C ${x2 - 8} ${y2 - 30}, ${xg} ${y2 - 26}, ${xg} ${y2 + 14} L ${xg} ${third.top - 6}`;

    [
      [d1, xf, second.top],
      [d2, xg, third.top],
    ].forEach(([path, x, y], index) => {
      const stream = streams[index];
      stream.querySelector<SVGPathElement>('.bucket-graphic__base')?.setAttribute('d', String(path));
      stream.querySelector<SVGPathElement>('.bucket-graphic__flow')?.setAttribute('d', String(path));
      const drops = stream.querySelectorAll<SVGCircleElement>('circle');
      drops[0]?.setAttribute('cx', String(Number(x) - 6));
      drops[0]?.setAttribute('cy', String(Number(y) - 12));
      drops[1]?.setAttribute('cx', String(Number(x) + 7));
      drops[1]?.setAttribute('cy', String(Number(y) - 10));
      lengths[index] = stream.querySelector<SVGPathElement>('.bucket-graphic__base')?.getTotalLength() ?? 0;
    });
    render();
  }

  function shown(el: HTMLElement, amount: number) {
    const rect = el.getBoundingClientRect();
    const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
    return visible / Math.min(rect.height, window.innerHeight) >= amount;
  }

  function play(key: keyof typeof state, ms: number, done?: () => void) {
    playing = true;
    const start = performance.now();
    function frame(now: number) {
      const progress = clamp((now - start) / ms);
      state[key] = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      render();
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        playing = false;
        step += 1;
        done?.();
        update();
      }
    }
    requestAnimationFrame(frame);
  }

  function update() {
    if (!mobile.matches || reduce.matches) {
      state = { fill1: 1, pour1: 1, fill2: 1, pour2: 1 };
      render();
      return;
    }
    if (playing) return;
    if (step === 0 && shown(b1, 0.5)) play('fill1', 1400);
    else if (step === 1) play('pour1', 900);
    else if (step === 2 && shown(b2, 0.4)) play('fill2', 1200);
    else if (step === 3) play('pour2', 900);
  }

  if (mobile.matches && !reduce.matches) render();
  else update();

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    },
    { passive: true }
  );

  window.addEventListener('resize', () => {
    if (!mobile.matches) {
      step = 4;
      state = { fill1: 1, pour1: 1, fill2: 1, pour2: 1 };
    }
    layout();
    render();
  });

  if (window.ResizeObserver) new ResizeObserver(layout).observe(row);
  if (document.fonts?.ready) document.fonts.ready.then(layout);
  layout();
  update();
}

document.querySelectorAll<HTMLElement>('[data-bucket-graphic]').forEach(setupBucketGraphic);
