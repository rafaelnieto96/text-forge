document.addEventListener('DOMContentLoaded', () => {
    const landingPage = document.getElementById('landing-page');
    const formSection = document.getElementById('form-section');
    const backButton = document.getElementById('back-to-landing');
    const featureCards = document.querySelectorAll('.feature-card');
    const tabContents = document.querySelectorAll('.tab-content');

    // Animación de entrada para las tarjetas
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
        // Ocultar landing page
        landingPage.classList.add('hidden-section');
        landingPage.classList.remove('active-section');
        
        // Mostrar formulario
        formSection.classList.remove('hidden-section');
        formSection.classList.add('active-section');

        // Cambiar título y descripción según el formulario seleccionado
        const formTitle = document.querySelector('.form-title h1');
        const formDescription = document.querySelector('.form-title p');
        
        switch(featureId) {
            case 'email-campaign':
                formTitle.textContent = 'Campaña de Email';
                formDescription.textContent = 'Crea campañas de marketing con IA';
                break;
            case 'auto-reply':
                formTitle.textContent = 'Respuesta Automática';
                formDescription.textContent = 'Genera respuestas profesionales';
                break;
            case 'email-writer':
                formTitle.textContent = 'Redactor de Emails';
                formDescription.textContent = 'Escribe emails personalizados';
                break;
        }
        
        // Desactivar efecto del mouse para P5.js
        document.body.classList.add('no-pointer-effect');

        // Mostrar el formulario seleccionado
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === featureId) {
                content.classList.add('active');
            }
        });
    }

    function showLandingPage() {
        // Ocultar formulario
        formSection.classList.add('hidden-section');
        formSection.classList.remove('active-section');
        
        // Mostrar landing page
        landingPage.classList.remove('hidden-section');
        landingPage.classList.add('active-section');
        
        // Restaurar efecto del mouse para P5.js
        document.body.classList.remove('no-pointer-effect');
    }

    // Manejar selección de tarjetas
    featureCards.forEach(card => {
        card.addEventListener('click', () => {
            console.log('Card clicked');
            const featureId = card.getAttribute('data-feature');
            console.log('Feature ID:', featureId);
            
            // Efecto visual al hacer clic
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = 'translateY(0) scale(1)';
                showFormSection(featureId);
            }, 150);
        });
    });

    // Manejar botón de volver
    backButton.addEventListener('click', showLandingPage);

    // Form submission handlers
    const emailCampaignForm = document.getElementById('emailCampaignForm');
    const autoReplyForm = document.getElementById('autoReplyForm');
    const emailWriterForm = document.getElementById('emailWriterForm');
    const resultDiv = document.getElementById('result');

    async function handleFormSubmit(form, type) {
        const submitButton = form.querySelector('.generate-btn');
        
        // Limpiar resultado anterior
        resultDiv.textContent = "Generando...";
        
        // Deshabilitar el botón durante la generación
        submitButton.disabled = true;
        
        // Mostrar estado de carga
        submitButton.classList.add('loading');
        
        const formData = new FormData(form);
        const data = {
            type: type,
            ...Object.fromEntries(formData)
        };

        console.log('Enviando solicitud con datos:', data);

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
        } finally {
            // Quitar estado de carga y habilitar el botón
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