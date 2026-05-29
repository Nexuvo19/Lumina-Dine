/* ============================================
   LUMIÈRE — Shared JS
   ============================================ */
(() => {
  // ---------- Loader ----------
  window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) setTimeout(() => loader.classList.add('hidden'), 600);
  });

  // ---------- Theme toggle ----------
  const root = document.body;
  const savedTheme = localStorage.getItem('lumiere-theme');
  if (savedTheme === 'light') root.classList.add('light');
  document.addEventListener('click', e => {
    if (e.target.closest('.theme-toggle')) {
      root.classList.toggle('light');
      localStorage.setItem('lumiere-theme', root.classList.contains('light') ? 'light' : 'dark');
      const btn = e.target.closest('.theme-toggle');
      btn.textContent = root.classList.contains('light') ? '☾' : '☀';
    }
  });
  document.querySelectorAll('.theme-toggle').forEach(b => {
    b.textContent = root.classList.contains('light') ? '☾' : '☀';
  });

  // ---------- Navbar scroll ----------
  const nav = document.querySelector('.navbar');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  // ---------- Hamburger ----------
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  // ---------- Active link ----------
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  // ---------- Reveal on scroll ----------
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ---------- Parallax (subtle) ----------
  const parallax = document.querySelectorAll('[data-parallax]');
  if (parallax.length) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      parallax.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        el.style.transform = `translateY(${y * speed}px)`;
      });
    });
  }

  // ---------- Mouse-reactive hero ----------
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      const bg = hero.querySelector('.hero-bg, .hero-video');
      if (bg) bg.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
    });
  }

  // ---------- Toast ----------
  const toast = (msg) => {
    let t = document.querySelector('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._t);
    t._t = setTimeout(() => t.classList.remove('show'), 2600);
  };
  window.lumiereToast = toast;

  // ---------- Add to cart (demo) ----------
  document.addEventListener('click', e => {
    const btn = e.target.closest('.add-btn');
    if (btn) {
      e.stopPropagation();
      const name = btn.closest('.dish')?.querySelector('h3')?.textContent || 'Dish';
      toast(`✓ ${name} added to order`);
    }
  });

  // ---------- Testimonials slider ----------
  const track = document.querySelector('.testi-track');
  if (track) {
    const slides = track.children.length;
    const dotsWrap = document.querySelector('.testi-nav');
    const perView = window.innerWidth < 900 ? 1 : 3;
    const pages = Math.max(1, slides - perView + 1);
    let idx = 0;
    const render = () => {
      const offset = idx * (track.children[0].offsetWidth + 24);
      track.style.transform = `translateX(-${offset}px)`;
      dotsWrap?.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    };
    if (dotsWrap) {
      dotsWrap.innerHTML = '';
      for (let i = 0; i < pages; i++) {
        const b = document.createElement('button');
        b.className = 'testi-dot' + (i === 0 ? ' active' : '');
        b.addEventListener('click', () => { idx = i; render(); });
        dotsWrap.appendChild(b);
      }
    }
    setInterval(() => { idx = (idx + 1) % pages; render(); }, 5000);
  }

  // ---------- Menu filter + search ----------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.querySelector('#menu-search');
  const dishes = document.querySelectorAll('.dish-grid .dish');
  let activeFilter = 'all';
  const applyFilter = () => {
    const q = (searchInput?.value || '').toLowerCase().trim();
    dishes.forEach(d => {
      const cat = d.dataset.cat;
      const name = d.querySelector('h3')?.textContent.toLowerCase() || '';
      const matchCat = activeFilter === 'all' || cat === activeFilter;
      const matchQ = !q || name.includes(q);
      d.style.display = (matchCat && matchQ) ? '' : 'none';
    });
  };
  filterBtns.forEach(b => b.addEventListener('click', () => {
    filterBtns.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    activeFilter = b.dataset.filter;
    applyFilter();
  }));
  searchInput?.addEventListener('input', applyFilter);

  // ---------- Lightbox ----------
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const img = lightbox.querySelector('img');
    document.querySelectorAll('.masonry .ph img').forEach(t => {
      t.addEventListener('click', () => {
        img.src = t.src;
        lightbox.classList.add('open');
      });
    });
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
        lightbox.classList.remove('open');
      }
    });
  }

  // ---------- Reservation page ----------
  document.querySelectorAll('.table-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.table-opt').forEach(x => x.classList.remove('sel'));
      opt.classList.add('sel');
    });
  });
  const counter = document.querySelector('.counter');
  if (counter) {
    const span = counter.querySelector('span');
    counter.querySelector('.minus').addEventListener('click', () => {
      let n = Math.max(1, parseInt(span.textContent) - 1); span.textContent = n;
    });
    counter.querySelector('.plus').addEventListener('click', () => {
      let n = Math.min(20, parseInt(span.textContent) + 1); span.textContent = n;
    });
  }
  const resForm = document.querySelector('#reservation-form');
  resForm?.addEventListener('submit', e => {
    e.preventDefault();
    toast('✓ Reservation confirmed! Check your email.');
    setTimeout(() => resForm.reset(), 800);
  });
  const contactForm = document.querySelector('#contact-form');
  contactForm?.addEventListener('submit', e => {
    e.preventDefault();
    toast('✓ Message sent — we\'ll be in touch shortly.');
    contactForm.reset();
  });
  const newsletter = document.querySelector('#newsletter-form');
  newsletter?.addEventListener('submit', e => {
    e.preventDefault();
    toast('✓ Subscribed to LUMIÈRE updates');
    newsletter.reset();
  });

  // ---------- Floating reserve ----------
  document.querySelector('.float-reserve')?.addEventListener('click', () => {
    location.href = 'reservations.html';
  });

  // ---------- Chatbot ----------
  const cb = document.querySelector('.chatbot');
  if (cb) {
    cb.querySelector('.chatbot-btn').addEventListener('click', () => cb.classList.toggle('open'));
    cb.querySelector('.chatbot-head button')?.addEventListener('click', () => cb.classList.remove('open'));
    const body = cb.querySelector('.chatbot-body');
    const input = cb.querySelector('input');
    const send = cb.querySelector('.chatbot-input button');
    const reply = q => {
      const lc = q.toLowerCase();
      if (lc.includes('reserv') || lc.includes('book')) return 'You can reserve a table on our Reservations page — opens instantly. Want me to take you there?';
      if (lc.includes('menu') || lc.includes('food')) return 'Our chef\'s seasonal menu changes monthly. Browse it on the Menu page — try the Wagyu Tataki.';
      if (lc.includes('hour') || lc.includes('open')) return 'We\'re open Tue–Sun, 6 PM – 11 PM. Closed Mondays.';
      if (lc.includes('location') || lc.includes('where')) return '12 Aurora Lane, Downtown. Free valet parking after 7 PM.';
      return 'Thanks for your message! Our concierge will respond within a minute.';
    };
    const post = (text, who) => {
      const m = document.createElement('div');
      m.className = 'msg ' + who;
      m.textContent = text;
      body.appendChild(m);
      body.scrollTop = body.scrollHeight;
    };
    const handle = () => {
      const v = input.value.trim();
      if (!v) return;
      post(v, 'user');
      input.value = '';
      setTimeout(() => post(reply(v), 'bot'), 600);
    };
    send.addEventListener('click', handle);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') handle(); });
  }

  // ---------- Counters ----------
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.count);
        const dur = 1600;
        const start = performance.now();
        const tick = t => {
          const p = Math.min(1, (t - start) / dur);
          el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))).toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(c => cio.observe(c));
  }
})();
