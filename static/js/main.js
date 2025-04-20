document.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.getElementById('landing-page');
    const formSection = document.getElementById('form-section');
    const backButton = document.getElementById('back-to-landing');
    const featureCards = document.querySelectorAll('.feature-card');
    const tabContents = document.querySelectorAll('.tab-content');
    const copyButton = document.getElementById('copy-result');
    const copySuccess = document.querySelector('.copy-success');
    const resultDiv = document.getElementById('result');

    featureCards.forEach((card, index) => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = 1;
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    function showFormSection(featureId) {
        landingPage.classList.add('hidden-section');
        landingPage.classList.remove('active-section');

        formSection.classList.remove('hidden-section');
        formSection.classList.add('active-section');

        const formTitle = document.querySelector('.form-title h1');
        const formDescription = document.querySelector('.form-title p');

        switch (featureId) {
            case 'email-campaign':
                formTitle.textContent = 'Email Campaign';
                formDescription.textContent = 'Create marketing campaigns with AI';
                break;
            case 'auto-reply':
                formTitle.textContent = 'Auto Reply';
                formDescription.textContent = 'Generate email responses with AI';
                break;
            case 'email-writer':
                formTitle.textContent = 'Email Writer';
                formDescription.textContent = 'Write personalized emails with AI';
                break;
        }

        document.body.classList.add('no-pointer-effect');

        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === featureId) {
                content.classList.add('active');
            }
        });
    }

    function showLandingPage() {
        formSection.classList.add('hidden-section');
        formSection.classList.remove('active-section');

        landingPage.classList.remove('hidden-section');
        landingPage.classList.add('active-section');

        document.body.classList.remove('no-pointer-effect');

        document.getElementById('result').textContent = '';
    }

    featureCards.forEach(card => {
        card.addEventListener('click', () => {
            console.log('Card clicked');
            const featureId = card.getAttribute('data-feature');
            console.log('Feature ID:', featureId);

            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = 'translateY(0) scale(1)';
                showFormSection(featureId);
            }, 150);
        });
    });

    backButton.addEventListener('click', showLandingPage);

    copyButton.addEventListener('click', () => {
        const resultText = resultDiv.textContent;
        if (!resultText) return;

        const textarea = document.createElement('textarea');
        textarea.value = resultText;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);

        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        copySuccess.classList.add('show');
        setTimeout(() => {
            copySuccess.classList.remove('show');
        }, 2000);
    });

    const emailCampaignForm = document.getElementById('emailCampaignForm');
    const autoReplyForm = document.getElementById('autoReplyForm');
    const emailWriterForm = document.getElementById('emailWriterForm');

    async function handleFormSubmit(form, type) {
        const submitButton = form.querySelector('.generate-btn');

        resultDiv.textContent = "Generating...";

        submitButton.disabled = true;
        submitButton.classList.add('loading');

        const formData = new FormData(form);
        const data = {
            type: type,
            ...Object.fromEntries(formData)
        };

        console.log('Sending request with data:', data);

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Error in text generation');
            }

            const result = await response.json();
            resultDiv.textContent = result.response;
        } catch (error) {
            resultDiv.textContent = `Error: ${error.message}`;
        } finally {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
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