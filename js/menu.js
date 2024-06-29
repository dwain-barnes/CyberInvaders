document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');

    const howToPlayButton = document.getElementById('howToPlayButton');
    const howToPlaySection = document.getElementById('howToPlay');

    if (howToPlayButton && howToPlaySection) {
        console.log('Both How To Play button and section found');
        
        howToPlayButton.addEventListener('click', function(e) {
            console.log('How to Play button clicked');
            e.preventDefault();
            
            howToPlaySection.classList.toggle('visible');
            
            if (howToPlaySection.classList.contains('visible')) {
                howToPlayButton.textContent = 'Hide Instructions';
                console.log('Showing instructions');
            } else {
                howToPlayButton.textContent = 'How to Play';
                console.log('Hiding instructions');
            }
        });
    } else {
        console.error('How to Play button or section not found');
    }
});