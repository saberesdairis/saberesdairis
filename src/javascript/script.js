// script.js - rebuild: mobile menu, scroll spy, and carousel arrows
document.addEventListener('DOMContentLoaded', function () {
    var mobileBtn = document.getElementById('mobile_btn');
    var mobileMenu = document.getElementById('mobile_menu');
    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', function () {
            mobileMenu.classList.toggle('active');
            // Alternar ícone hamburger ↔ X
            var icon = mobileBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-x');
            }
        });
    }

    // Scroll spy: mark active nav item based on scroll position
    var sections = document.querySelectorAll('main section');
    var navItems = document.querySelectorAll('#nav_list .nav-item');
    
    function updateActiveNav() {
        var headerHeight = document.querySelector('header') ? document.querySelector('header').offsetHeight : 100;
        var scrollPos = window.scrollY + headerHeight + 50; // Add offset for better detection
        
        var activeSectionIndex = 0;
        sections.forEach(function (sec, idx) {
            var top = sec.offsetTop;
            var bottom = top + sec.offsetHeight;
            if (scrollPos >= top && scrollPos < bottom) {
                activeSectionIndex = idx;
            }
        });
        
        navItems.forEach(function (n) { n.classList.remove('active'); });
        if (navItems[activeSectionIndex]) {
            navItems[activeSectionIndex].classList.add('active');
        }
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Set initial active state
    
    // Smooth scroll for nav links with offset for fixed header
    document.querySelectorAll('#nav_list a[href^="#"], #mobile_nav_list a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            var targetId = this.getAttribute('href');
            var targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                var headerHeight = document.querySelector('header') ? document.querySelector('header').offsetHeight : 100;
                var targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu) {
                    mobileMenu.classList.remove('active');
                }
            }
        });
    });

    // Add/remove class on header when scrolling for visual effect
    var headerEl = document.querySelector('header');
    function onScrollHeader() {
        if (!headerEl) return;
        if (window.scrollY > 10) headerEl.classList.add('scrolled'); else headerEl.classList.remove('scrolled');
    }
    window.addEventListener('scroll', onScrollHeader);
    onScrollHeader();

    // Prepare revealable elements: ensure the class is present so CSS handles initial hidden state
    var initialTargets = document.querySelectorAll('#cta, #banner, .card, .section-title, .section-subtitle, .description');
    initialTargets.forEach(function (el) {
        if (!el.classList.contains('revealable')) el.classList.add('revealable');
    });

    // IntersectionObserver to reveal sections when they enter viewport (only once)
    var ioOptions = { root: null, rootMargin: '0px', threshold: 0.15 };  // Reduzido para 15% para funcionar melhor em mobile
    var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var section = entry.target;

                // apply staggered delays for revealable children inside this section
                var all = Array.from(section.querySelectorAll('.revealable'));
                all.forEach(function (el, i) {
                    // stagger reveal using inline delay; CSS transition handles the rest
                    el.style.transitionDelay = (i * 80) + 'ms';
                });

                // force a reflow then add the revealed class so transitions run
                window.requestAnimationFrame(function () {
                    section.classList.add('revealed');
                });
                // stop observing this section (reveal only once)
                obs.unobserve(section);
            }
        });
    }, ioOptions);

    // Observe each section
    document.querySelectorAll('main section').forEach(function (s) { observer.observe(s); });
    
    // removed ScrollReveal usage to avoid conflicts with IntersectionObserver-based reveals
});
