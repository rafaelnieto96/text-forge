document.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.getElementById('landing-page');
    const formSection = document.getElementById('form-section');
    const backButton = document.getElementById('back-to-landing');
    const featureCards = document.querySelectorAll('.feature-card');
    const tabContents = document.querySelectorAll('.tab-content');

    function showFormSection(featureId) {
        landingPage.classList.remove('active-section');
        landingPage.classList.add('hidden-section');
        formSection.classList.remove('hidden-section');
        formSection.classList.add('active-section');

        // Show the selected form
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === featureId) {
                content.classList.add('active');
            }
        });
    }

    function showLandingPage() {
        formSection.classList.remove('active-section');
        formSection.classList.add('hidden-section');
        landingPage.classList.remove('hidden-section');
        landingPage.classList.add('active-section');
    }

    // Handle feature card selection
    featureCards.forEach(card => {
        card.addEventListener('click', () => {
            const featureId = card.getAttribute('data-feature');
            showFormSection(featureId);
        });
    });

    // Handle back button
    backButton.addEventListener('click', showLandingPage);

    // Form submission handlers
    const emailCampaignForm = document.getElementById('emailCampaignForm');
    const autoReplyForm = document.getElementById('autoReplyForm');
    const emailWriterForm = document.getElementById('emailWriterForm');
    const resultDiv = document.getElementById('result');

    async function handleFormSubmit(form, type) {
        const formData = new FormData(form);
        const data = {
            type: type,
            ...Object.fromEntries(formData)
        };

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Error en la generación del texto');
            }

            const result = await response.json();
            resultDiv.textContent = result.response;
        } catch (error) {
            resultDiv.textContent = `Error: ${error.message}`;
        }
    }

    emailCampaignForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(e.target, 'email_campaign');
    });

    autoReplyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(e.target, 'auto_reply');
    });

    emailWriterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(e.target, 'email_writer');
    });
}); 