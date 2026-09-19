document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       THEME
    ========================================= */

    const themeToggle =
        document.getElementById("themeToggle");


    if (themeToggle) {

        const savedTheme =
            localStorage.getItem(
                "typingTheme"
            );


        if (savedTheme === "dark") {

            document.body.classList.add(
                "dark-mode"
            );

            themeToggle.innerHTML =
                '<i class="bi bi-sun-fill"></i>';

        }


        themeToggle.addEventListener(
            "click",
            function () {

                document.body.classList.toggle(
                    "dark-mode"
                );


                const isDark =
                    document.body.classList.contains(
                        "dark-mode"
                    );


                if (isDark) {

                    themeToggle.innerHTML =
                        '<i class="bi bi-sun-fill"></i>';

                    localStorage.setItem(
                        "typingTheme",
                        "dark"
                    );

                } else {

                    themeToggle.innerHTML =
                        '<i class="bi bi-moon-fill"></i>';

                    localStorage.setItem(
                        "typingTheme",
                        "light"
                    );

                }

            }
        );

    }


    /* =========================================
       AUTHENTICATION
    ========================================= */

    updateAuthenticationUI();

});


/* =========================================
   AUTH UI
========================================= */

function updateAuthenticationUI() {

    const token =
        localStorage.getItem(
            "typingAuthToken"
        );


    const userData =
        localStorage.getItem(
            "typingUser"
        );


    let user = null;


    try {

        if (userData) {

            user =
                JSON.parse(userData);

        }

    } catch (error) {

        console.error(
            "Invalid user data:",
            error
        );

    }


    /* =========================================
       FIND NAVBAR
    ========================================= */

    const navbar =
        document.querySelector(
            ".navbar .container"
        );


    if (!navbar) {
        return;
    }


    /* =========================================
       REMOVE OLD AUTH ELEMENT
    ========================================= */

    const oldAuth =
        document.getElementById(
            "authNavItem"
        );


    if (oldAuth) {

        oldAuth.remove();

    }


    /* =========================================
       LOGGED IN
    ========================================= */

    if (token && user) {

        const authItem =
            document.createElement(
                "div"
            );


        authItem.id =
            "authNavItem";


        authItem.className =
            "d-flex align-items-center gap-2 ms-lg-3";


        authItem.innerHTML = `

            <div class="dropdown">

                <button
                    class="btn btn-outline-primary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >

                    <i class="bi bi-person-circle"></i>

                    ${escapeHTML(user.username)}

                </button>


                <ul class="dropdown-menu dropdown-menu-end">

    <li>

        <a
            class="dropdown-item"
            href="#"
            id="profileNavItem"
        >

            <i class="bi bi-person"></i>

            Profile

        </a>

    </li>

    ${
        user.role === "admin"
            ? `
                <li>

                    <a
                        class="dropdown-item"
                        href="admin-paragraphs.html"
                    >

                        <i class="bi bi-file-text"></i>

                        Manage Paragraphs

                    </a>

                </li>
              `
            : ""
    }


    <li>

        <hr class="dropdown-divider">

    </li>


    <li>

        <button
            class="dropdown-item text-danger"
            id="logoutBtn"
        >

            <i class="bi bi-box-arrow-right"></i>

            Logout

        </button>

    </li>

</ul>

            </div>

        `;


        navbar.appendChild(
            authItem
        );


        /* ---------- LOGOUT ---------- */

        const logoutBtn =
            document.getElementById(
                "logoutBtn"
            );


        if (logoutBtn) {

            logoutBtn.addEventListener(
                "click",
                function () {

                    logoutUser();

                }
            );

        }


        /* ---------- PROFILE ---------- */

        const profileBtn =
            document.getElementById(
                "profileNavItem"
            );


        if (profileBtn) {

            profileBtn.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    window.location.href =
                        "profile.html";

                }
            );

        }

    }


    /* =========================================
       LOGGED OUT
    ========================================= */

    else {

        const authItem =
            document.createElement(
                "div"
            );


        authItem.id =
            "authNavItem";


        authItem.className =
            "ms-lg-3 mt-2 mt-lg-0";


        authItem.innerHTML = `

            <a
                href="login.html"
                class="btn btn-primary"
            >

                <i class="bi bi-box-arrow-in-right"></i>

                Login

            </a>

        `;


        navbar.appendChild(
            authItem
        );

    }

}


/* =========================================
   LOGOUT
========================================= */

function logoutUser() {

    localStorage.removeItem(
        "typingAuthToken"
    );


    localStorage.removeItem(
        "typingUser"
    );


    window.location.href =
        "index.html";

}


/* =========================================
   GET CURRENT USER
========================================= */

function getCurrentUser() {

    const userData =
        localStorage.getItem(
            "typingUser"
        );


    if (!userData) {

        return null;

    }


    try {

        return JSON.parse(
            userData
        );

    } catch (error) {

        return null;

    }

}


/* =========================================
   GET AUTH TOKEN
========================================= */

function getAuthToken() {

    return localStorage.getItem(
        "typingAuthToken"
    );

}


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;

}

