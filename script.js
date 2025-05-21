document.addEventListener('DOMContentLoaded', function() {
    // Animate rule cards when they come into view
    const ruleCards = document.querySelectorAll('.rule-card');
    const backToTop = document.querySelector('.back-to-top');
    
    // Animation for rule cards
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add delay based on index for cascade effect
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, { threshold: 0.15 });
    
    ruleCards.forEach(card => {
        observer.observe(card);
    });
    
    // Back to top functionality
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Highlight table rows on hover
    const tableRows = document.querySelectorAll('.table-row:not(.highlight)');
    
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.backgroundColor = 'rgba(255, 68, 61, 0.08)';
        });
        
        row.addEventListener('mouseleave', () => {
            row.style.backgroundColor = '';
        });
    });
    
    // Make the highlight row pulse for attention
    const highlightRow = document.querySelector('.table-row.highlight');
    
    function pulseHighlight() {
        highlightRow.style.boxShadow = '0 0 15px rgba(255, 68, 61, 0.5)';
        setTimeout(() => {
            highlightRow.style.boxShadow = 'none';
            setTimeout(pulseHighlight, 2000);
        }, 1000);
    }
    
    if (highlightRow) {
        pulseHighlight();
    }
    
    // Smooth scrolling for nav links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get the target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Scroll to target section
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // If on mobile, open the accordion
            if (window.innerWidth <= 768) {
                const accordionTitle = targetSection.querySelector('.accordion-title');
                const accordionContent = targetSection.querySelector('.accordion-content');
                
                if (accordionTitle && accordionContent) {
                    // Close all accordions first
                    document.querySelectorAll('.accordion-title').forEach(title => {
                        title.classList.remove('active');
                    });
                    
                    document.querySelectorAll('.accordion-content').forEach(content => {
                        content.classList.remove('active');
                        content.style.display = 'none';
                    });
                    
                    // Open the target accordion
                    accordionTitle.classList.add('active');
                    accordionContent.classList.add('active');
                    accordionContent.style.display = 'block';
                }
            }
        });
    });
    
    // Mobile accordion functionality
    const accordionTitles = document.querySelectorAll('.accordion-title');
    
    accordionTitles.forEach(title => {
        title.addEventListener('click', function() {
            // Toggle active class on this accordion title
            this.classList.toggle('active');
            
            // Get the content associated with this title
            const content = this.nextElementSibling;
            
            // Toggle visibility of content
            if (content.classList.contains('active')) {
                content.classList.remove('active');
                content.style.display = 'none';
            } else {
                content.classList.add('active');
                content.style.display = 'block';
            }
        });
    });
    
    // Show all accordion content on desktop
    function handleWindowResize() {
        if (window.innerWidth > 768) {
            document.querySelectorAll('.accordion-content').forEach(content => {
                content.style.display = 'block';
            });
        } else {
            // On mobile, only show active accordion content
            document.querySelectorAll('.accordion-content:not(.active)').forEach(content => {
                content.style.display = 'none';
            });
            
            // Make sure at least one accordion is open on mobile
            const anyActive = document.querySelector('.accordion-content.active');
            if (!anyActive) {
                const firstAccordion = document.querySelector('.accordion-content');
                const firstTitle = document.querySelector('.accordion-title');
                if (firstAccordion && firstTitle) {
                    firstAccordion.classList.add('active');
                    firstAccordion.style.display = 'block';
                    firstTitle.classList.add('active');
                }
            }
        }
    }
    
    // Initial check on page load
    handleWindowResize();
    
    // Check when window is resized
    window.addEventListener('resize', handleWindowResize);
    
    // Search functionality
    const searchBox = document.getElementById('search-box');
    
    searchBox.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const ruleCards = document.querySelectorAll('.rule-card');
        const tableRows = document.querySelectorAll('.table-row');
        
        // Show all sections first
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'block';
        });
        
        if (searchTerm === '') {
            // If search is empty, show all cards and rows
            ruleCards.forEach(card => {
                card.style.display = 'flex';
            });
            
            tableRows.forEach(row => {
                row.style.display = 'flex';
            });
            
            return;
        }
        
        // Search in rule cards
        let foundInCards = false;
        ruleCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const content = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                card.style.display = 'flex';
                foundInCards = true;
                
                // If on mobile, open the accordion containing this card
                if (window.innerWidth <= 768) {
                    const accordionContent = card.closest('.accordion-content');
                    const accordionTitle = accordionContent.previousElementSibling;
                    
                    accordionTitle.classList.add('active');
                    accordionContent.classList.add('active');
                    accordionContent.style.display = 'block';
                }
            } else {
                card.style.display = 'none';
            }
        });
        
        // Search in table rows
        let foundInTable = false;
        tableRows.forEach(row => {
            const rule = row.querySelector('.col-rule').textContent.toLowerCase();
            const offenses = Array.from(row.querySelectorAll('.col-offense')).map(el => el.textContent.toLowerCase());
            
            if (rule.includes(searchTerm) || offenses.some(offense => offense.includes(searchTerm))) {
                row.style.display = 'flex';
                foundInTable = true;
                
                // If on mobile, open the accordion containing this row
                if (window.innerWidth <= 768) {
                    const accordionContent = row.closest('.accordion-content');
                    const accordionTitle = accordionContent.previousElementSibling;
                    
                    accordionTitle.classList.add('active');
                    accordionContent.classList.add('active');
                    accordionContent.style.display = 'block';
                }
            } else {
                row.style.display = 'none';
            }
        });
        
        // Hide sections that don't have any visible content
        document.querySelectorAll('.section').forEach(section => {
            const visibleCards = section.querySelectorAll('.rule-card[style="display: flex;"]');
            const visibleRows = section.querySelectorAll('.table-row[style="display: flex;"]');
            
            if (visibleCards.length === 0 && visibleRows.length === 0) {
                section.style.display = 'none';
            }
        });
    });
});
