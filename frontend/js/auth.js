const API_URL =
    window.API_BASE_URL;


/* =========================================
   MESSAGE
========================================= */

function showMessage(
    message,
    type = "danger"
) {

    const messageBox =
        document.getElementById(
            "messageBox"
        );

    if (!messageBox) {
        return;
    }

    messageBox.className =
        `alert alert-${type}`;

    messageBox.textContent =
        message;

}


/* =========================================
   PASSWORD TOGGLE
========================================= */

function setupPasswordToggle(
    buttonId,
    inputId
) {

    const button =
        document.getElementById(
            buttonId
        );

    const input =
        document.getElementById(
            inputId
        );


    if (!button || !input) {
        return;
    }


    button.addEventListener(
        "click",
        function () {

            const isPassword =
                input.type === "password";


            input.type =
                isPassword
                    ? "text"
                    : "password";


            const icon =
                button.querySelector("i");


            icon.className =
                isPassword
                    ? "bi bi-eye-slash"
                    : "bi bi-eye";

        }
    );

}


/* =========================================
   REGISTER
========================================= */

const registerForm =
    document.getElementById(
        "registerForm"
    );


if (registerForm) {

    setupPasswordToggle(
        "passwordToggle",
        "password"
    );

    setupPasswordToggle(
        "confirmPasswordToggle",
        "confirmPassword"
    );


    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const username =
                document
                    .getElementById(
                        "username"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "email"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "password"
                    )
                    .value;


            const confirmPassword =
                document
                    .getElementById(
                        "confirmPassword"
                    )
                    .value;


            /* ---------- VALIDATION ---------- */

            if (username.length < 3) {

                showMessage(
                    "Username must contain at least 3 characters."
                );

                return;

            }


            if (password.length < 6) {

                showMessage(
                    "Password must contain at least 6 characters."
                );

                return;

            }


            if (
                password !==
                confirmPassword
            ) {

                showMessage(
                    "Passwords do not match."
                );

                return;

            }


            /* ---------- BUTTON ---------- */

            const button =
                document.getElementById(
                    "registerBtn"
                );

            const buttonText =
                document.getElementById(
                    "registerBtnText"
                );

            const spinner =
                document.getElementById(
                    "registerSpinner"
                );


            button.disabled = true;

            buttonText.textContent =
                "Creating Account...";

            spinner.classList.remove(
                "d-none"
            );


            try {

                const response =
                    await fetch(
                        `${API_URL}/auth/register`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    username,

                                    email,

                                    password

                                })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Registration failed."
                    );

                }


                showMessage(
                    "Account created successfully! Redirecting to login...",
                    "success"
                );


                setTimeout(
                    function () {

                        window.location.href =
                            "login.html";

                    },
                    1500
                );


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );


                showMessage(
                    error.message ||
                    "Unable to connect to the server."
                );


                button.disabled =
                    false;

                buttonText.textContent =
                    "Create Account";

                spinner.classList.add(
                    "d-none"
                );

            }

        }
    );

}


/* =========================================
   LOGIN
========================================= */

const loginForm =
    document.getElementById(
        "loginForm"
    );


if (loginForm) {

    setupPasswordToggle(
        "passwordToggle",
        "password"
    );


    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "email"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "password"
                    )
                    .value;


            const button =
                document.getElementById(
                    "loginBtn"
                );

            const buttonText =
                document.getElementById(
                    "loginBtnText"
                );

            const spinner =
                document.getElementById(
                    "loginSpinner"
                );


            button.disabled = true;

            buttonText.textContent =
                "Logging in...";

            spinner.classList.remove(
                "d-none"
            );


            try {

                const response =
                    await fetch(
                        `${API_URL}/auth/login`,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify({

                                    email,

                                    password

                                })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Login failed."
                    );

                }


                /* ---------- SAVE JWT ---------- */

                localStorage.setItem(
                    "typingAuthToken",
                    data.token
                );


                /* ---------- SAVE USER ---------- */

                localStorage.setItem(
                    "typingUser",
                    JSON.stringify(
                        data.user
                    )
                );


                showMessage(
                    `Welcome back, ${data.user.username}!`,
                    "success"
                );


                setTimeout(
                    function () {

                        window.location.href =
                            "index.html";

                    },
                    800
                );


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                showMessage(
                    error.message ||
                    "Unable to connect to the server."
                );


                button.disabled =
                    false;

                buttonText.textContent =
                    "Login";

                spinner.classList.add(
                    "d-none"
                );

            }

        }
    );

}