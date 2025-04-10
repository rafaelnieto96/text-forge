document.addEventListener('DOMContentLoaded', () => {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

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