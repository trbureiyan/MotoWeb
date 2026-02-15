// MotoTaller - Custom JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Don't prevent default for modal triggers
            if (href === '#offcanvas-nav') {
                return;
            }
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                UIkit.offcanvas('#offcanvas-nav').hide();
                
                // Scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Form submission handler
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            
            // Validate form
            if (!name || !email || !message) {
                UIkit.notification({
                    message: 'Por favor completa todos los campos requeridos',
                    status: 'warning',
                    pos: 'top-right',
                    timeout: 3000
                });
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                UIkit.notification({
                    message: 'Por favor ingresa un email válido',
                    status: 'warning',
                    pos: 'top-right',
                    timeout: 3000
                });
                return;
            }
            
            // Simulate form submission
            // In a real application, you would send this data to a server
            console.log('Form Data:', { name, email, phone, message });
            
            // Show success message
            UIkit.notification({
                message: '¡Mensaje enviado con éxito! Te contactaremos pronto.',
                status: 'success',
                pos: 'top-right',
                timeout: 5000
            });
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Add active class to navigation on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                link.classList.remove('uk-active');
                if (href === '#' + current) {
                    link.classList.add('uk-active');
                }
            }
        });
    });
    
    // Add animation on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .gallery-item, .stat-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initialize animation styles
    const initAnimationStyles = () => {
        const elements = document.querySelectorAll('.service-card, .gallery-item, .stat-card');
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
    };
    
    // Run on load and scroll
    initAnimationStyles();
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    // Welcome message
    console.log('%c🏍️ MotoTaller', 'font-size: 24px; font-weight: bold; color: #FF6B35;');
    console.log('%cWebsite desarrollado con UIKit Framework', 'font-size: 14px; color: #2C3E50;');
    
});
