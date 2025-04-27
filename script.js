document.addEventListener('DOMContentLoaded', function() {
    // Animate rule cards when they come into view
    const ruleCards = document.querySelectorAll('.rule-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    ruleCards.forEach(card => {
        observer.observe(card);
    });
    
    // Highlight table rows on hover
    const tableRows = document.querySelectorAll('.table-row:not(.highlight)');
    
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.backgroundColor = 'rgba(255, 94, 0, 0.1)';
        });
        
        row.addEventListener('mouseleave', () => {
            row.style.backgroundColor = 'rgba(50, 50, 50, 0.7)';
        });
    });
    
    // Make the highlight row pulse for attention
    const highlightRow = document.querySelector('.table-row.highlight');
    
    function pulseHighlight() {
        highlightRow.style.boxShadow = '0 0 15px rgba(255, 30, 0, 0.7)';
        setTimeout(() => {
            highlightRow.style.boxShadow = 'none';
            setTimeout(pulseHighlight, 2000);
        }, 1000);
    }
    
    pulseHighlight();
});