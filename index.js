document.addEventListener('DOMContentLoaded', () => {
    const html = document.documentElement;
    const toggleDesktop = document.getElementById('themeToggle');
    const toggleMobile = document.getElementById('themeToggleMobile');
    const toggleFab = document.getElementById('toggleFab');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileBackdrop = document.getElementById('mobileBackdrop');
    const header = document.getElementById("mainHeader");
    const nav = document.getElementById('stickyNav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    let isMobileMenuOpen = false;

    // Ganti icon tema
    const updateIcons = () => {
        const isDark = html.classList.contains('dark');
        const icon = isDark ? 'sun' : 'moon';
        if (toggleDesktop) toggleDesktop.innerHTML = `<i data-lucide="${icon}" class="w-5 h-5"></i>`;
        if (toggleMobile) toggleMobile.innerHTML = `<i data-lucide="${icon}" class="w-6 h-6"></i>`;
        lucide.createIcons();
    };

    // Tema awal
    const initializeTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        html.classList.toggle('dark', savedTheme === 'dark' || (!savedTheme && prefersDark));
        updateIcons();
    };

    // Toggle tema
    const toggleTheme = () => {
        const isDark = html.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateIcons();
    };

    toggleDesktop?.addEventListener('click', toggleTheme);
    toggleMobile?.addEventListener('click', toggleTheme);

    // FAB update
    const updateFabButton = () => {
        toggleFab.innerHTML = isMobileMenuOpen
            ? '<i data-lucide="x" class="w-5 h-5"></i><span class="text-sm font-medium">Close</span>'
            : '<i data-lucide="menu" class="w-5 h-5"></i><span class="ml-1 text-sm font-medium">Menu</span>';
        lucide.createIcons();
    };

    // Toggle menu mobile
    toggleFab?.addEventListener('click', () => {
        isMobileMenuOpen = !isMobileMenuOpen;
        mobileOverlay.classList.toggle('hidden', !isMobileMenuOpen);
        mobileBackdrop.classList.toggle('hidden', !isMobileMenuOpen);
        updateFabButton();
    });

    // Klik link menu mobile
    document.querySelectorAll('.nav-link-mobile').forEach(link => {
        link.addEventListener('click', () => {
            document.querySelectorAll('.nav-link-mobile').forEach(l => l.classList.remove('bg-highlight', 'text-white'));
            link.classList.add('bg-highlight', 'text-white');
            isMobileMenuOpen = false;
            mobileOverlay.classList.add('hidden');
            mobileBackdrop.classList.add('hidden');
            updateFabButton();
        });
    });

    // Klik backdrop
    mobileBackdrop?.addEventListener('click', () => {
        isMobileMenuOpen = false;
        mobileOverlay.classList.add('hidden');
        mobileBackdrop.classList.add('hidden');
        updateFabButton();
    });

    // Header shrink saat scroll
    window.addEventListener("scroll", () => {
        if (window.scrollY > 10) {
            header?.classList.replace("py-4", "py-2");
            nav?.classList.add(
                'px-4', 'py-2', 'max-w-5xl', 'backdrop-blur-md',
                'bg-white/80', 'dark:bg-darkbg/80', 'outline-bg-700'
            );
            nav?.classList.remove('py-4', 'max-w-6xl', 'bg-transparent', 'backdrop-blur-0', 'outline-transparent');
        } else {
            header?.classList.replace("py-2", "py-4");
            nav?.classList.remove(
                'px-4', 'py-2', 'max-w-5xl', 'backdrop-blur-md',
                'bg-white/80', 'dark:bg-darkbg/80', 'outline-bg-700'
            );
            nav?.classList.add('py-4', 'max-w-6xl', 'bg-transparent', 'backdrop-blur-0', 'outline-transparent');
        }
    });

    // Marquee init
    const template = document.getElementById('marquee-item')?.content;
    const copy1 = document.getElementById('marquee-copy-1');
    const copy2 = document.getElementById('marquee-copy-2');
    if (template && copy1 && copy2) {
        copy1.appendChild(template.cloneNode(true));
        copy2.appendChild(template.cloneNode(true));
    }

    const template1 = document.getElementById('marquee-item-1')?.content;
    const copy11 = document.getElementById('marquee-copy-11');
    const copy22 = document.getElementById('marquee-copy-22');
    if (template1 && copy11 && copy22) {
        copy11.appendChild(template1.cloneNode(true));
        copy22.appendChild(template1.cloneNode(true));
    }

    // Set nav active dari hash URL
    const setActiveFromHash = () => {
        const hash = location.hash;
        if (!hash) return;
        const targetLink = document.querySelector(`.nav-link[href="${hash}"]`);
        if (targetLink) {
            navLinks.forEach(l => l.classList.remove('active'));
            targetLink.classList.add('active');
        }
    };

    // Smooth scroll saat klik nav
    $('a[href^="#"]').not('[href="#"]').not('[href="#0"]').click(function (event) {
        if (
            location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') &&
            location.hostname === this.hostname
        ) {
            const target = $(this.hash);
            if (target.length) {
                event.preventDefault();

                const navHeight = $('#stickyNav').outerHeight() || 0;
                const offsetTop = target.offset().top - navHeight + 40;

                $('html, body').animate({
                    scrollTop: offsetTop
                }, 500);
            }
        }
    });

    // Realtime scroll highlight active nav-link
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Loading Screen + Inisialisasi AOS setelahnya
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');

        setTimeout(() => {
            preloader.classList.add('opacity-0');
            setTimeout(() => {
                preloader.style.display = 'none';

                // ⬇️ Inisialisasi AOS di sini, setelah preloader selesai
                AOS.init({
                    once: true,
                    offset: window.innerWidth < 768 ? 100 : 120,
                    duration: 500,
                    easing: 'ease-in-out',
                });

            }, 500);
        }, 200);
    });

    // Init tema dan nav aktif
    initializeTheme();
    setActiveFromHash();
});
