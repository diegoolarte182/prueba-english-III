/**
 * English3 Portfolio Interactivity
 * Handles:
 * - Tab navigation
 * - Checklist updates & progress bars
 * - Goal card expansion
 * - Table/Text editing persistence
 * - Profile photo upload preview
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Tab Navigation ---
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;

            // Update active tab button
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active content
            contents.forEach(content => {
                content.classList.remove('active');
                if (content.id === target) {
                    content.classList.add('active');
                }
            });
        });
    });

    // --- Checklist Logic ---
    const checklistInputs = document.querySelectorAll('.checklist-radio');
    const yesCountEl = document.getElementById('yes-total');
    const sometimesCountEl = document.getElementById('sometimes-total');
    const notYetCountEl = document.getElementById('not-yet-total');
    
    const yesProgress = document.getElementById('yes-progress');
    const sometimesProgress = document.getElementById('sometimes-progress');
    const notYetProgress = document.getElementById('not-yet-progress');

    function updateChecklistStats() {
        let yes = 0;
        let sometimes = 0;
        let notYet = 0;
        const totalRows = 6;

        checklistInputs.forEach(input => {
            if (input.checked) {
                if (input.value === 'yes') yes++;
                if (input.value === 'sometimes') sometimes++;
                if (input.value === 'not-yet') notYet++;
            }
        });

        // Update counts
        yesCountEl.textContent = yes;
        sometimesCountEl.textContent = sometimes;
        notYetCountEl.textContent = notYet;

        // Update progress bars
        yesProgress.style.width = `${(yes / totalRows) * 100}%`;
        sometimesProgress.style.width = `${(sometimes / totalRows) * 100}%`;
        notYetProgress.style.width = `${(notYet / totalRows) * 100}%`;
    }

    checklistInputs.forEach(input => {
        input.addEventListener('change', updateChecklistStats);
    });

    // Initialize stats
    updateChecklistStats();

    // --- SMART Goals Expansion ---
    const goalCards = document.querySelectorAll('.goal-card');
    goalCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('expanded');
        });
    });

    // --- Profile Photo Upload ---
    const photoUpload = document.getElementById('photo-upload');
    const profilePreview = document.getElementById('profile-preview');

    if (photoUpload && profilePreview) {
        photoUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    profilePreview.src = event.target.result;
                    // Save to localStorage (optional, but good for persistence)
                    localStorage.setItem('portfolio-profile-photo', event.target.result);
                };
                reader.readAsDataURL(file);
            }
        });

        // Load saved photo
        const savedPhoto = localStorage.getItem('portfolio-profile-photo');
        if (savedPhoto) {
            profilePreview.src = savedPhoto;
        }
    }

    // --- Editable Text Persistence ---
    const editableElements = document.querySelectorAll('[contenteditable="true"], .schedule-input');
    
    editableElements.forEach((el, index) => {
        const savedValue = localStorage.getItem(`portfolio-edit-${index}`);
        if (savedValue) {
            if (el.tagName === 'INPUT') {
                el.value = savedValue;
            } else {
                el.innerText = savedValue;
            }
        }

        el.addEventListener('input', () => {
            const value = el.tagName === 'INPUT' ? el.value : el.innerText;
            localStorage.setItem(`portfolio-edit-${index}`, value);
        });
    });
});
