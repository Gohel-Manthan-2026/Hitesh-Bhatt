document.addEventListener('DOMContentLoaded', () => {
    // 0. Smooth Scroll removed as requested

    // 1. Theme Toggle
    const themeBtn = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('icon-sun');
    const moonIcon = document.getElementById('icon-moon');
    const htmlEl = document.documentElement;

    // Check system preference & localStorage
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            htmlEl.setAttribute('data-theme', 'dark');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            htmlEl.removeAttribute('data-theme');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    };

    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme(systemPrefersDark ? 'dark' : 'light');
    }

    themeBtn.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // 2. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // 3. Category Filtering Function
    const setupFilters = (filterContainer, itemsContainer) => {
        if (!filterContainer || !itemsContainer) return;

        const filterBtns = filterContainer.querySelectorAll('.filter-btn');
        const items = itemsContainer.querySelectorAll('.filter-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons in this section
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const targetCategory = btn.getAttribute('data-filter');

                items.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    // Smooth fade out
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    
                    // After transition, update display and fade in if matches
                    setTimeout(() => {
                        if (targetCategory === 'all' || itemCategory === targetCategory) {
                            item.style.display = ''; // reset to default display
                            // Slight delay to allow display to apply before fading in
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            }, 50);
                        } else {
                            item.style.display = 'none';
                        }
                    }, 300); // 300ms matches the CSS transition time
                });
            });
        });
    };

    // Initialize filters for all 3 sections
    setupFilters(document.getElementById('courses-filters'), document.getElementById('courses-grid'));
    setupFilters(document.getElementById('notes-filters'), document.getElementById('notes-list'));
    setupFilters(document.getElementById('lectures-filters'), document.getElementById('lectures-grid'));

    // 4. Smooth Scrolling & Active State Updates
    const sections = document.querySelectorAll('section, header');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Add slight offset for sticky navbar
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

    // 5. Back to top button functionality
    const backToTopBtn = document.getElementById('back-to-top');
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    // 6. Three.js Background Animation removed as requested

    // 7. Typewriter Animation
    const TypeWriter = function(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    TypeWriter.prototype.type = function() {
        // Current index of word
        const current = this.wordIndex % this.words.length;
        // Get full text of current word
        const fullTxt = this.words[current];

        // Check if deleting
        if(this.isDeleting) {
            // Remove char
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            // Add char
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        // Insert txt into element
        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span><span class="cursor">|</span>`;

        // Initial Type Speed
        let typeSpeed = 100;

        if(this.isDeleting) {
            typeSpeed /= 2; // Delete faster
        }

        // If word is complete
        if(!this.isDeleting && this.txt === fullTxt) {
            // Make pause at end
            typeSpeed = this.wait;
            // Set delete to true
            this.isDeleting = true;
        } else if(this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            // Move to next word
            this.wordIndex++;
            // Pause before start typing
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }

    // Init Typewriter On DOM Load
    const initTypeWriter = () => {
        const txtElement = document.querySelector('.typewriter-text');
        if(!txtElement) return;
        const words = ['Learn English', 'Learn Constitution', 'Competative Exams'];
        const wait = 3000;
        new TypeWriter(txtElement, words, wait);
    }
    
    initTypeWriter();

});
