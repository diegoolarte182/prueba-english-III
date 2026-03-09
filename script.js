/**
 * English3 Portfolio Interactivity
 * Handles:
 * - Tab navigation
 * - Checklist updates & progress bars
 * - Goal card expansion
 * - Table/Text editing persistence
 * - Profile photo upload preview
 */

document.addEventListener("DOMContentLoaded", () => {

    /* ---------------------------
       TAB NAVIGATION
    --------------------------- */

    const tabs = document.querySelectorAll(".tab-btn");
    const contents = document.querySelectorAll(".tab-content");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {

            const target = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            contents.forEach(content => {
                content.classList.remove("active");

                if (content.id === target) {
                    content.classList.add("active");
                }
            });

            // Scroll to top when changing tabs
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });
    });


    /* ---------------------------
       CHECKLIST LOGIC
    --------------------------- */

    const checklistInputs = document.querySelectorAll(".checklist-radio");

    const yesCountEl = document.getElementById("yes-total");
    const sometimesCountEl = document.getElementById("sometimes-total");
    const notYetCountEl = document.getElementById("not-yet-total");

    const yesProgress = document.getElementById("yes-progress");
    const sometimesProgress = document.getElementById("sometimes-progress");
    const notYetProgress = document.getElementById("not-yet-progress");

    function updateChecklistStats() {

        let yes = 0;
        let sometimes = 0;
        let notYet = 0;

        const groups = {};

        // Detect groups of radios
        checklistInputs.forEach(input => {
            if (!groups[input.name]) {
                groups[input.name] = [];
            }
            groups[input.name].push(input);
        });

        const totalRows = Object.keys(groups).length;

        Object.values(groups).forEach(group => {
            const checked = group.find(r => r.checked);

            if (!checked) return;

            if (checked.value === "yes") yes++;
            if (checked.value === "sometimes") sometimes++;
            if (checked.value === "not-yet") notYet++;
        });

        if (yesCountEl) yesCountEl.textContent = yes;
        if (sometimesCountEl) sometimesCountEl.textContent = sometimes;
        if (notYetCountEl) notYetCountEl.textContent = notYet;

        if (yesProgress) {
            yesProgress.style.width = `${(yes / totalRows) * 100}%`;
        }

        if (sometimesProgress) {
            sometimesProgress.style.width = `${(sometimes / totalRows) * 100}%`;
        }

        if (notYetProgress) {
            notYetProgress.style.width = `${(notYet / totalRows) * 100}%`;
        }
    }

    checklistInputs.forEach(input => {
        input.addEventListener("change", updateChecklistStats);
    });

    updateChecklistStats();


    /* ---------------------------
       SMART GOALS EXPANSION
    --------------------------- */

    const goalCards = document.querySelectorAll(".goal-card");

    goalCards.forEach(card => {

        const header = card.querySelector(".goal-header");

        if (header) {
            header.addEventListener("click", () => {
                card.classList.toggle("expanded");
            });
        }

    });


    /* ---------------------------
       TASK 1 SUBMENU NAVIGATION
    --------------------------- */

    const submenuLinks = document.querySelectorAll(".submenu-link");
    const sections = document.querySelectorAll("#task1 section");

    submenuLinks.forEach(link => {

        link.addEventListener("click", (e) => {

            e.preventDefault();

            const targetId = link.getAttribute("href").replace("#", "");
            const targetSection = document.getElementById(targetId);

            if (!targetSection) return;

            const nav = document.querySelector("nav");
            const submenu = document.querySelector(".task-submenu");

            const navHeight = nav ? nav.offsetHeight : 0;
            const submenuHeight = submenu ? submenu.offsetHeight : 0;

            const offset = navHeight + submenuHeight + 20;

            window.scrollTo({
                top: targetSection.offsetTop - offset,
                behavior: "smooth"
            });

            submenuLinks.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

        });

    });


    /* ---------------------------
       SUBMENU ACTIVE ON SCROLL
    --------------------------- */

    window.addEventListener("scroll", () => {

        const task1 = document.getElementById("task1");
        if (!task1 || !task1.classList.contains("active")) return;

        let current = "";

        const nav = document.querySelector("nav");
        const submenu = document.querySelector(".task-submenu");

        const navHeight = nav ? nav.offsetHeight : 0;
        const submenuHeight = submenu ? submenu.offsetHeight : 0;

        const offset = navHeight + submenuHeight + 100;

        sections.forEach(section => {

            const sectionTop = section.offsetTop;

            if (window.pageYOffset >= sectionTop - offset) {
                current = section.id;
            }

        });

        submenuLinks.forEach(link => {

            link.classList.remove("active");

            if (link.getAttribute("href").replace("#", "") === current) {
                link.classList.add("active");
            }

        });

    });


    /* ---------------------------
       PROFILE PHOTO UPLOAD
    --------------------------- */

    const photoUpload = document.getElementById("photo-upload");
    const profilePreview = document.getElementById("profile-preview");

    if (photoUpload && profilePreview) {

        photoUpload.addEventListener("change", (e) => {

            const file = e.target.files[0];

            if (!file) return;

            const reader = new FileReader();

            reader.onload = function(event) {

                profilePreview.src = event.target.result;

                localStorage.setItem(
                    "portfolio-profile-photo",
                    event.target.result
                );

            };

            reader.readAsDataURL(file);

        });

        const savedPhoto = localStorage.getItem("portfolio-profile-photo");

        if (savedPhoto) {
            profilePreview.src = savedPhoto;
        }

    }


    /* ---------------------------
       EDITABLE CONTENT STORAGE
    --------------------------- */

    const editableElements = document.querySelectorAll(
        '[contenteditable="true"], .schedule-input'
    );

    editableElements.forEach((el, index) => {

        const key = `portfolio-edit-${index}`;
        const savedValue = localStorage.getItem(key);

        if (savedValue) {

            if (el.tagName === "INPUT") {
                el.value = savedValue;
            } else {
                el.innerText = savedValue;
            }

        }

        el.addEventListener("input", () => {

            const value = el.tagName === "INPUT"
                ? el.value
                : el.innerText;

            localStorage.setItem(key, value);

        });

    });

});