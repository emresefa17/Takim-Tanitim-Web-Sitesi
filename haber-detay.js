document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality (inherit from haberler.js)
    
    // Social Share Functionality
    setupSocialShare();
    
    // Gallery Image Viewer
    setupGalleryViewer();
    
    // Update view count
    updateViewCount();
    
    // Track reading progress
    trackReadingProgress();
});

/**
 * Sets up the social share functionality for the share buttons
 */
function setupSocialShare() {
    const shareButtons = document.querySelectorAll('.share-button');
    
    if (shareButtons.length > 0) {
        const pageUrl = encodeURIComponent(window.location.href);
        const pageTitle = encodeURIComponent(document.title);
        
        shareButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                let shareUrl = '';
                
                // Determine which platform to share to
                if (this.classList.contains('facebook')) {
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
                } else if (this.classList.contains('twitter')) {
                    shareUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
                } else if (this.classList.contains('whatsapp')) {
                    shareUrl = `https://api.whatsapp.com/send?text=${pageTitle} ${pageUrl}`;
                } else if (this.classList.contains('telegram')) {
                    shareUrl = `https://t.me/share/url?url=${pageUrl}&text=${pageTitle}`;
                } else if (this.classList.contains('email')) {
                    shareUrl = `mailto:?subject=${pageTitle}&body=Bu haberi okumanı öneririm: ${pageUrl}`;
                }
                
                // Open share dialog
                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400,resizable=yes,scrollbars=yes,status=yes');
                }
            });
        });
    }
}

/**
 * Sets up an image viewer for the gallery images
 */
function setupGalleryViewer() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryItems.length > 0) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').getAttribute('src');
                openImageViewer(imgSrc);
            });
        });
    }
    
    // Create image viewer modal
    function openImageViewer(imgSrc) {
        // Check if modal already exists
        let modal = document.getElementById('image-viewer-modal');
        
        if (!modal) {
            // Create modal if it doesn't exist
            modal = document.createElement('div');
            modal.id = 'image-viewer-modal';
            modal.className = 'image-viewer-modal';
            
            const modalContent = document.createElement('div');
            modalContent.className = 'image-viewer-content';
            
            const closeBtn = document.createElement('span');
            closeBtn.className = 'image-viewer-close';
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
            
            const modalImg = document.createElement('img');
            modalImg.className = 'image-viewer-img';
            
            modalContent.appendChild(closeBtn);
            modalContent.appendChild(modalImg);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            
            // Close on click outside image
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
            
            // Add CSS for modal
            const style = document.createElement('style');
            style.textContent = `
                .image-viewer-modal {
                    display: none;
                    position: fixed;
                    z-index: 1000;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    background-color: rgba(0, 0, 0, 0.9);
                    cursor: pointer;
                }
                
                .image-viewer-content {
                    position: relative;
                    margin: 5% auto;
                    padding: 0;
                    width: 90%;
                    max-width: 1200px;
                }
                
                .image-viewer-close {
                    position: absolute;
                    top: -40px;
                    right: 0;
                    color: white;
                    font-size: 40px;
                    font-weight: bold;
                    cursor: pointer;
                }
                
                .image-viewer-img {
                    display: block;
                    width: 100%;
                    max-height: 85vh;
                    object-fit: contain;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Set the image source and display modal
        const modalImg = modal.querySelector('.image-viewer-img');
        modalImg.src = imgSrc;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Updates the view count for the current article
 * In a real application, this would send an AJAX request to update the count on the server
 */
function updateViewCount() {
    // Check if this view has already been counted in this session
    const newsId = getArticleId();
    const viewedArticles = JSON.parse(localStorage.getItem('viewedArticles') || '[]');
    
    if (newsId && !viewedArticles.includes(newsId)) {
        const viewCountElement = document.querySelector('.news-views');
        
        if (viewCountElement) {
            const currentViews = parseInt(viewCountElement.textContent.match(/\d+/)[0], 10);
            const newViews = currentViews + 1;
            
            // Update display
            viewCountElement.innerHTML = `<i class="far fa-eye"></i> ${newViews} görüntülenme`;
            
            // In a real app, this would be an AJAX request to the server
            console.log(`View count for article ${newsId} increased to ${newViews}`);
            
            // Mark as viewed in this session
            viewedArticles.push(newsId);
            localStorage.setItem('viewedArticles', JSON.stringify(viewedArticles));
        }
    }
    
    function getArticleId() {
        // In a real app, you would get this from the URL or data attribute
        // For demo purposes, we'll just use a fixed value
        return '1';
    }
}

/**
 * Tracks the user's reading progress and highlights the current section in the content
 */
function trackReadingProgress() {
    const articleContent = document.querySelector('.news-detail-text');
    const headings = articleContent ? articleContent.querySelectorAll('h2, h3') : [];
    
    if (headings.length > 0) {
        // Create a reading progress container
        const progressContainer = document.createElement('div');
        progressContainer.className = 'reading-progress-container';
        document.querySelector('.news-detail-header .container').appendChild(progressContainer);
        
        // Add progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress-bar';
        progressContainer.appendChild(progressBar);
        
        // Update progress bar on scroll
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const articleStart = articleContent.offsetTop;
            const articleHeight = articleContent.offsetHeight;
            const windowHeight = window.innerHeight;
            
            // Calculate progress percentage
            let progress = (scrollTop - articleStart) / (articleHeight - windowHeight) * 100;
            progress = Math.min(100, Math.max(0, progress));
            
            // Update progress bar width
            progressBar.style.width = `${progress}%`;
            
            // Highlight current section being read
            highlightCurrentSection(scrollTop);
        });
        
        // Add CSS for progress bar
        const style = document.createElement('style');
        style.textContent = `
            .reading-progress-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background-color: rgba(0, 0, 0, 0.1);
                z-index: 100;
            }
            
            .reading-progress-bar {
                height: 100%;
                background-color: var(--primary-color);
                width: 0;
                transition: width 0.1s ease;
            }
            
            .heading-active {
                color: var(--secondary-color) !important;
                transition: color 0.3s ease;
            }
        `;
        document.head.appendChild(style);
        
        // Function to highlight the current section being read
        function highlightCurrentSection(scrollTop) {
            // Add a small offset to detect when the heading is close to the top
            const offset = 150;
            
            // Reset all headings
            headings.forEach(heading => {
                heading.classList.remove('heading-active');
            });
            
            // Find the current heading
            for (let i = headings.length - 1; i >= 0; i--) {
                if (headings[i].offsetTop - offset <= scrollTop) {
                    headings[i].classList.add('heading-active');
                    break;
                }
            }
        }
    }
} 