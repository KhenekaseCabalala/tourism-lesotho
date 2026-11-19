
/* ====================================
   LESOTHO TOURISM WEBSITE
   JavaScript functionality
   ==================================== */

document.addEventListener("DOMContentLoaded", function () {

    // 1. DARK AND LIGHT MODE
    const themeButton = document.getElementById("themeToggle");

    function updateThemeButton() {
        if (!themeButton) return;

        themeButton.textContent = document.body.classList.contains("dark-mode")
            ? "Light mode"
            : "Dark mode";
    }

    const savedTheme = localStorage.getItem("tourismTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    updateThemeButton();

    if (themeButton) {
        themeButton.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");

            const theme = document.body.classList.contains("dark-mode")
                ? "dark"
                : "light";

            localStorage.setItem("tourismTheme", theme);
            updateThemeButton();
        });
    }

    // 2. DESTINATION SEARCH AND CATEGORY FILTERING
    const searchInput = document.getElementById("destinationSearch");
    const serviceItems = document.querySelectorAll(".service-item");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const noResults = document.getElementById("noResults");
    const searchMessage = document.getElementById("searchMessage");

    let selectedCategory = "all";

    function filterServices() {
        if (!searchInput) return;

        const searchText = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        serviceItems.forEach(function (item) {
            const category = item.dataset.category;
            const text = item.textContent.toLowerCase();

            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;

            const matchesSearch = text.includes(searchText);
            const showItem = matchesCategory && matchesSearch;

            item.hidden = !showItem;

            if (showItem) {
                visibleCount++;
            }
        });

        if (noResults) {
            noResults.hidden = visibleCount !== 0;
        }

        if (searchMessage) {
            searchMessage.textContent =
                visibleCount + " service(s) found.";
        }
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterServices);
    }

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            selectedCategory = button.dataset.filter;

            filterButtons.forEach(function (otherButton) {
                otherButton.classList.remove("active", "btn-success");
                otherButton.classList.add("btn-outline-success");
            });

            button.classList.add("active", "btn-success");
            button.classList.remove("btn-outline-success");

            filterServices();
        });
    });

    // 3. BOOKING COST CALCULATOR
    const calculatorForm = document.getElementById("calculatorForm");
    const costResult = document.getElementById("costResult");

    if (calculatorForm) {
        calculatorForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const price = Number(
                document.getElementById("activityChoice").value
            );

            const people = Number(
                document.getElementById("peopleCount").value
            );

            if (
                !Number.isFinite(price) ||
                !Number.isInteger(people) ||
                people < 1 ||
                people > 100
            ) {
                costResult.textContent =
                    "Please enter a valid number of people.";
                costResult.className = "mt-3 text-danger fw-bold";
                return;
            }

            const total = price * people;

            costResult.textContent =
                "Estimated total: LSL " +
                total.toLocaleString("en-US") +
                " for " + people + " person(s).";

            costResult.className = "mt-3 text-success fw-bold";
        });
    }

    // 4. GALLERY IMAGE PREVIEW
    const galleryButtons = document.querySelectorAll("[data-gallery-image]");
    const imageModalElement = document.getElementById("imageModal");

    if (galleryButtons.length > 0 && imageModalElement) {
        const modalImage = document.getElementById("modalImage");
        const modalCaption = document.getElementById("modalCaption");
        const imageCounter = document.getElementById("imageCounter");

        const galleryImages = Array.from(galleryButtons).map(function (button) {
            const image = button.querySelector("img");

            return {
                src: image.src,
                alt: image.alt,
                caption: button.querySelector("span").textContent
            };
        });

        let currentImage = 0;

        const imageModal =
            bootstrap.Modal.getOrCreateInstance(imageModalElement);

        function showGalleryImage(index) {
            currentImage =
                (index + galleryImages.length) % galleryImages.length;

            const image = galleryImages[currentImage];

            modalImage.src = image.src;
            modalImage.alt = image.alt;
            modalCaption.textContent = image.caption;

            imageCounter.textContent =
                (currentImage + 1) + " of " + galleryImages.length;
        }

        galleryButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                showGalleryImage(Number(button.dataset.galleryImage));
                imageModal.show();
            });
        });

        document.getElementById("previousImage")
            .addEventListener("click", function () {
                showGalleryImage(currentImage - 1);
            });

        document.getElementById("nextImage")
            .addEventListener("click", function () {
                showGalleryImage(currentImage + 1);
            });
    }

    // 5. CONTACT FORM VALIDATION
    const contactForm = document.getElementById("contactForm");
    const contactFeedback = document.getElementById("contactFeedback");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            contactFeedback.textContent =
                "Thank you! Your message passed validation. " +
                "This demonstration does not send an email.";

            contactFeedback.className = "mt-3 text-success fw-bold";

            contactForm.reset();
        });
    }

    // 6. BOOKING FORM VALIDATION AND LOCAL STORAGE
    const bookingForm = document.getElementById("bookingForm");
    const bookingFeedback = document.getElementById("bookingFeedback");
    const bookingDate = document.getElementById("bookingDate");

    // Prevent selecting a past date.
    if (bookingDate) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        bookingDate.min = year + "-" + month + "-" + day;
    }

    if (bookingForm) {
        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!bookingForm.checkValidity()) {
                bookingForm.reportValidity();
                return;
            }

            const booking = {
                name: document.getElementById("bookingName").value.trim(),
                email: document.getElementById("bookingEmail").value.trim(),
                phone: document.getElementById("bookingPhone").value.trim(),
                destination: document.getElementById("bookingDestination").value,
                date: bookingDate.value,
                people: Number(document.getElementById("bookingPeople").value),
                notes: document.getElementById("bookingNotes").value.trim()
            };

            if (booking.name.length < 2 || booking.people < 1 ||
                booking.people > 100) {
                bookingFeedback.textContent =
                    "Please check your name and number of people.";
                bookingFeedback.className = "mt-3 text-danger fw-bold";
                return;
            }

            try {
                const bookings = JSON.parse(
                    localStorage.getItem("tourismBookings") || "[]"
                );

                if (!Array.isArray(bookings)) {
                    throw new Error("Invalid booking data");
                }

                bookings.push(booking);

                localStorage.setItem(
                    "tourismBookings",
                    JSON.stringify(bookings)
                );

                bookingFeedback.textContent =
                    "Booking request saved in this browser! " +
                    "This is a demonstration, not a confirmed reservation.";

                bookingFeedback.className = "mt-3 text-success fw-bold";
                bookingForm.reset();
                bookingDate.min = year + "-" + month + "-" + day;

            } catch (error) {
                bookingFeedback.textContent =
                    "Unable to save the request. Please check browser storage.";
                bookingFeedback.className = "mt-3 text-danger fw-bold";
            }
        });
    }

    // 7. REGISTRATION AND PASSWORD CONFIRMATION
    const registrationForm =
        document.getElementById("registrationForm");

    const registrationFeedback =
        document.getElementById("registrationFeedback");

    if (registrationForm) {
        registrationForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!registrationForm.checkValidity()) {
                registrationForm.reportValidity();
                return;
            }

            const name =
                document.getElementById("registerName").value.trim();

            const email =
                document.getElementById("registerEmail").value.trim();

            const password =
                document.getElementById("registerPassword").value;

            const confirmPassword =
                document.getElementById("confirmPassword").value;

            if (name.length < 2) {
                registrationFeedback.textContent =
                    "Please enter your full name.";
                registrationFeedback.className = "mt-3 text-danger fw-bold";
                return;
            }

            if (password !== confirmPassword) {
                registrationFeedback.textContent =
                    "The passwords do not match.";
                registrationFeedback.className = "mt-3 text-danger fw-bold";
                return;
            }

            try {
                // Save only non-sensitive visitor details.
                // Never store passwords in localStorage.
                const visitor = {
                    name: name,
                    email: email,
                    gender:
                        document.getElementById("registerGender").value
                };

                localStorage.setItem(
                    "tourismVisitor",
                    JSON.stringify(visitor)
                );

                registrationFeedback.textContent =
                    "Registration details validated and saved locally! " +
                    "No real account has been created.";

                registrationFeedback.className =
                    "mt-3 text-success fw-bold";

                registrationForm.reset();

            } catch (error) {
                registrationFeedback.textContent =
                    "Unable to save the details in browser storage.";
                registrationFeedback.className =
                    "mt-3 text-danger fw-bold";
            }
        });
    }

});
