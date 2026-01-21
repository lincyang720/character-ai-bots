// Rating widget functionality for character detail pages
document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.star');
    const submitButton = document.querySelector('.submit-rating');
    let selectedRating = 0;

    // Star hover and click effects
    stars.forEach((star, index) => {
        star.addEventListener('mouseenter', () => {
            highlightStars(index + 1);
        });

        star.addEventListener('click', () => {
            selectedRating = index + 1;
            highlightStars(selectedRating);
        });
    });

    // Reset stars on mouse leave
    const starsContainer = document.querySelector('.stars-input');
    if (starsContainer) {
        starsContainer.addEventListener('mouseleave', () => {
            if (selectedRating > 0) {
                highlightStars(selectedRating);
            } else {
                highlightStars(0);
            }
        });
    }

    // Submit rating
    if (submitButton) {
        submitButton.addEventListener('click', () => {
            if (selectedRating === 0) {
                alert('Please select a rating before submitting.');
                return;
            }

            // In a real application, this would send the rating to a server
            alert(`Thank you for rating this character ${selectedRating} stars!`);

            // Disable the button after submission
            submitButton.disabled = true;
            submitButton.textContent = 'Rating Submitted';
            submitButton.style.opacity = '0.6';
        });
    }

    // Highlight stars up to the given rating
    function highlightStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.textContent = '★';
                star.classList.add('active');
            } else {
                star.textContent = '☆';
                star.classList.remove('active');
            }
        });
    }
});
