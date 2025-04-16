document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-link').forEach(n => 
        n.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        })
    );
    
    // Category Filter Tabs
    const categoryTabs = document.querySelectorAll('.category-tab');
    const newsCards = document.querySelectorAll('.news-grid .news-card');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active class
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // Filter news cards
            newsCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'all' || category === cardCategory) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // News Sorting
    const sortSelect = document.getElementById('sort-news');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const newsCardsArray = Array.from(newsCards);
            
            newsCardsArray.sort((a, b) => {
                const dateA = new Date(a.getAttribute('data-date'));
                const dateB = new Date(b.getAttribute('data-date'));
                
                if (sortValue === 'newest') {
                    return dateB - dateA;
                } else if (sortValue === 'oldest') {
                    return dateA - dateB;
                } else if (sortValue === 'popular') {
                    const popularityA = parseInt(a.getAttribute('data-views') || 0);
                    const popularityB = parseInt(b.getAttribute('data-views') || 0);
                    return popularityB - popularityA;
                }
                
                return 0;
            });
            
            // Re-append cards in the sorted order
            const newsGrid = document.querySelector('.news-grid');
            newsCardsArray.forEach(card => {
                newsGrid.appendChild(card);
            });
        });
    }
    
    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                // Here you would typically send the email to your server
                // For demo purposes, we'll just show a success message
                alert('Teşekkürler! Bültenimize başarıyla abone oldunuz.');
                emailInput.value = '';
            } else {
                alert('Lütfen geçerli bir e-posta adresi girin.');
            }
        });
    }
    
    // Read More Click Tracking
    const readMoreLinks = document.querySelectorAll('.read-more');
    readMoreLinks.forEach(link => {
        link.addEventListener('click', function() {
            const newsCard = this.closest('.news-card');
            const newsId = newsCard.getAttribute('data-id');
            const viewCount = parseInt(newsCard.getAttribute('data-views') || 0) + 1;
            
            // Update view count (in a real app, this would be sent to a server)
            newsCard.setAttribute('data-views', viewCount);
            
            // In a real application, you might want to track this click with analytics
            console.log(`News item ${newsId} clicked, new view count: ${viewCount}`);
        });
    });
    
    // Pagination (simple implementation)
    const paginationLinks = document.querySelectorAll('.pagination-link');
    if (paginationLinks.length > 0) {
        paginationLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links
                paginationLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // In a real application, this would load the next page of news
                // For demo purposes, we'll just log the page number
                const page = this.textContent;
                console.log(`Loading page ${page}`);
                
                // Scroll to top of news section
                document.querySelector('.latest-news').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }
    
    // Helper function to validate email
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // Image Lazy Loading
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
}); 