document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap components
    initializeBootstrapComponents();
    
    // Initialize features
    initializeProfilePicture();
    initializeLoginForm();
    initializeSmoothScrolling();
    initializeImageGallery();
    initializeContactForm();
    initializeResponsiveImages();
});

// Bootstrap Components Initialization
function initializeBootstrapComponents() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

// Enhanced Profile Picture Handling
function initializeProfilePicture() {
    const profileInput = document.getElementById('profilePictureInput');
    const profilePreview = document.getElementById('profilePreview');
    
    if (profileInput && profilePreview) {
        // Handle file selection
        profileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;

            // Validate file type
            if (!file.type.startsWith('image/')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid File Type',
                    text: 'Please select an image file (jpg, png, etc.)'
                });
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire({
                    icon: 'error',
                    title: 'File Too Large',
                    text: 'Please select an image smaller than 5MB'
                });
                return;
            }
            
            // Preview the image with enhanced error handling
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Add fade out effect
                profilePreview.style.opacity = '0';
                
                // Update image source
                profilePreview.src = e.target.result;
                
                // Add preview loaded class for additional styling
                profilePreview.classList.add('preview-loaded');
                
                // Fade in effect
                setTimeout(() => {
                    profilePreview.style.opacity = '1';
                }, 50);
            };
            
            reader.onerror = function() {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error reading the image file. Please try again.'
                });
            };
            
            reader.readAsDataURL(file);
        });

        // Enable clicking on the image to trigger file input
        profilePreview.addEventListener('click', function() {
            profileInput.click();
        });
        
        // Add hover effect class
        profilePreview.addEventListener('mouseenter', function() {
            this.classList.add('hover-effect');
        });
        
        profilePreview.addEventListener('mouseleave', function() {
            this.classList.remove('hover-effect');
        });
    }
}

// Login Form Handling
function initializeLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Logging in...';
            
            fetch(loginForm.action, {
                method: 'POST',
                body: new FormData(loginForm),
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Login Successful!',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        window.location.href = '/';
                    });
                } else {
                    // Reset button state
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Login';
                    
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed',
                        text: data.message || 'Please check your credentials and try again.'
                    });
                }
            })
            .catch(error => {
                // Reset button state
                submitButton.disabled = false;
                submitButton.innerHTML = 'Login';
                
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred. Please try again.'
                });
            });
        });
    }
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Image Gallery Animation with Enhanced Features
function initializeImageGallery() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // Add a slight delay between each card animation
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, entry.target.dataset.index * 100);
            } else {
                // Optional: remove classes when element is out of view for re-animation
                entry.target.classList.remove('show', 'visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '20px'  // Start animation slightly before element comes into view
    });

    document.querySelectorAll('.image-card').forEach((card, index) => {
        card.dataset.index = index;
        observer.observe(card);
        
        // Add hover effect handlers
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
}

// Enhanced Contact Form Handling
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Form validation
            const formData = new FormData(this);
            let isValid = true;
            let firstInvalidField = null;

            // Validate required fields
            this.querySelectorAll('[required]').forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                    if (!firstInvalidField) firstInvalidField = field;
                } else {
                    field.classList.remove('is-invalid');
                }
            });

            // Validate email format if present
            const emailField = this.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    isValid = false;
                    emailField.classList.add('is-invalid');
                    if (!firstInvalidField) firstInvalidField = emailField;
                }
            }

            if (!isValid) {
                firstInvalidField.focus();
                return;
            }

            const button = this.querySelector('button[type="submit"]');
            button.disabled = true;
            button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

            // Submit form data
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Message Sent!',
                        text: 'We will get back to you soon.',
                        showConfirmButton: false,
                        timer: 2000
                    });
                    this.reset();
                } else {
                    throw new Error(data.message || 'Failed to send message');
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'An error occurred. Please try again.'
                });
            })
            .finally(() => {
                button.disabled = false;
                button.innerHTML = 'Send Message';
            });
        });
    }
}

// Enhanced Responsive Image Handling
function initializeResponsiveImages() {
    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function handleResponsiveImages() {
        const images = document.querySelectorAll('.card-img-top');
        const isMobile = window.innerWidth <= 576;
        
        images.forEach(img => {
            // Only process loaded images
            if (img.complete) {
                processImage(img);
            } else {
                img.onload = () => processImage(img);
            }
        });
    }

    function processImage(img) {
        const isMobile = window.innerWidth <= 576;
        const isPortrait = img.naturalHeight > img.naturalWidth;
        
        img.style.objectPosition = isMobile && isPortrait ? 'top' : 'center';
        
        // Optional: Add classes for specific aspect ratios
        img.classList.remove('portrait', 'landscape');
        img.classList.add(isPortrait ? 'portrait' : 'landscape');
    }

    // Initial call
    handleResponsiveImages();
    
    // Add debounced resize listener
    window.addEventListener('resize', debounce(handleResponsiveImages, 100));

    // Handle dynamically loaded images
    const imageObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeName === 'IMG') {
                    processImage(node);
                }
            });
        });
    });

    // Observe the document body for added images
    imageObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}