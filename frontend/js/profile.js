/* =========================================
   PROFILE PAGE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProfile();

        setupProfileEvents();

    }
);


/* =========================================
   LOAD PROFILE
========================================= */

async function loadProfile() {

    const token =
        localStorage.getItem(
            "typingAuthToken"
        );


    /* -----------------------------------------
       CHECK LOGIN
    ----------------------------------------- */

    if (!token) {

        window.location.href =
            "login.html";

        return;

    }


    try {

        const response =
            await fetch(
                `${window.API_BASE_URL}/users/profile`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        /* -----------------------------------------
           TOKEN EXPIRED / INVALID
        ----------------------------------------- */

        if (
            response.status === 401
        ) {

            localStorage.removeItem(
                "typingAuthToken"
            );

            localStorage.removeItem(
                "typingUser"
            );

            window.location.href =
                "login.html";

            return;

        }


        /* -----------------------------------------
           SERVER ERROR
        ----------------------------------------- */

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load profile."
            );

        }


        /* -----------------------------------------
           DISPLAY PROFILE
        ----------------------------------------- */

        displayProfile(data);


    } catch (error) {

        console.error(
            "Profile loading error:",
            error
        );


        showProfileMessage(
            error.message ||
            "Unable to load profile.",
            "danger"
        );

    }

}


/* =========================================
   DISPLAY PROFILE
========================================= */

function displayProfile(data) {

    const user =
        data.user;

    const statistics =
        data.statistics;


    /* -----------------------------------------
       USER INFORMATION
    ----------------------------------------- */

    setText(
        "profileUsername",
        user.username
    );


    setText(
        "profileEmail",
        user.email
    );


    /* -----------------------------------------
       MEMBER SINCE
    ----------------------------------------- */

    if (
        user.createdAt
    ) {

        const date =
            new Date(
                user.createdAt
            );


        setText(
            "memberSince",
            date.toLocaleDateString(
                undefined,
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            )
        );

    }


    /* -----------------------------------------
       STATISTICS
    ----------------------------------------- */

    setText(
        "bestWpm",
        statistics.bestWpm
    );


    setText(
        "averageWpm",
        statistics.averageWpm
    );


    setText(
        "bestAccuracy",
        `${statistics.bestAccuracy}%`
    );


    setText(
        "testsCompleted",
        statistics.testsCompleted
    );


    setText(
        "totalCharacters",
        Number(
            statistics.totalCharacters
        ).toLocaleString()
    );


    setText(
        "totalMistakes",
        Number(
            statistics.totalMistakes
        ).toLocaleString()
    );


    /* -----------------------------------------
       EDIT PROFILE FIELD
    ----------------------------------------- */

    const usernameInput =
        document.getElementById(
            "editUsername"
        );


    if (usernameInput) {

        usernameInput.value =
            user.username;

    }

}


/* =========================================
   PROFILE EVENTS
========================================= */

function setupProfileEvents() {


    /* -----------------------------------------
       EDIT PROFILE BUTTON
    ----------------------------------------- */

    const editButton =
        document.getElementById(
            "editProfileBtn"
        );


    const editCard =
        document.getElementById(
            "editProfileCard"
        );


    if (
        editButton &&
        editCard
    ) {

        editButton.addEventListener(
            "click",
            function () {

                editCard.classList.toggle(
                    "d-none"
                );


                if (
                    !editCard.classList.contains(
                        "d-none"
                    )
                ) {

                    editCard.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }

            }
        );

    }


    /* -----------------------------------------
       LOGOUT
    ----------------------------------------- */

    const logoutButton =
        document.getElementById(
            "logoutBtn"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function () {

                localStorage.removeItem(
                    "typingAuthToken"
                );

                localStorage.removeItem(
                    "typingUser"
                );


                window.location.href =
                    "index.html";

            }
        );

    }


    /* -----------------------------------------
       EDIT PROFILE FORM
    ----------------------------------------- */

    const profileForm =
        document.getElementById(
            "profileForm"
        );


    if (profileForm) {

        profileForm.addEventListener(
            "submit",
            updateProfile
        );

    }

}


/* =========================================
   UPDATE PROFILE
========================================= */

async function updateProfile(event) {

    event.preventDefault();


    const token =
        localStorage.getItem(
            "typingAuthToken"
        );


    const usernameInput =
        document.getElementById(
            "editUsername"
        );


    if (!usernameInput) {
        return;
    }


    const username =
        usernameInput.value.trim();


    /* -----------------------------------------
       VALIDATE
    ----------------------------------------- */

    if (
        username.length < 3
    ) {

        showProfileMessage(
            "Username must contain at least 3 characters.",
            "danger"
        );

        return;

    }


    try {

        const response =
            await fetch(
                `${window.API_BASE_URL}/users/profile`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    },

                    body:
                        JSON.stringify({
                            username: username
                        })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to update profile."
            );

        }


        /* -----------------------------------------
           UPDATE LOCAL USER DATA
        ----------------------------------------- */

        const storedUser =
            localStorage.getItem(
                "typingUser"
            );


        if (storedUser) {

            try {

                const user =
                    JSON.parse(
                        storedUser
                    );


                user.username =
                    data.username;


                localStorage.setItem(
                    "typingUser",
                    JSON.stringify(user)
                );

            } catch (error) {

                console.error(
                    "Unable to update local user:",
                    error
                );

            }

        }


        /* -----------------------------------------
           UPDATE PAGE
        ----------------------------------------- */

        setText(
            "profileUsername",
            data.username
        );


        usernameInput.value =
            data.username;


        showProfileMessage(
            "Profile updated successfully.",
            "success"
        );


        /* -----------------------------------------
           HIDE MESSAGE AFTER 3 SECONDS
        ----------------------------------------- */

        setTimeout(
            function () {

                const message =
                    document.getElementById(
                        "profileMessage"
                    );


                if (message) {

                    message.classList.add(
                        "d-none"
                    );

                }

            },
            3000
        );


    } catch (error) {

        console.error(
            "Profile update error:",
            error
        );


        showProfileMessage(
            error.message ||
            "Unable to update profile.",
            "danger"
        );

    }

}


/* =========================================
   SHOW PROFILE MESSAGE
========================================= */

function showProfileMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "profileMessage"
        );


    if (!element) {
        return;
    }


    element.className =
        `alert alert-${type}`;


    element.textContent =
        message;

}


/* =========================================
   SET TEXT
========================================= */

function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.textContent =
            value;

    }

}

/* =========================================
   CHANGE PASSWORD
========================================= */

const changePasswordForm =
    document.getElementById("changePasswordForm");

const passwordMessage =
    document.getElementById("passwordMessage");

const changePasswordButton =
    document.getElementById("changePasswordButton");


/* =========================================
   SHOW MESSAGE
========================================= */

function showPasswordMessage(
    message,
    type
) {

    passwordMessage.textContent =
        message;

    passwordMessage.className =
        `password-message ${type}`;

}


/* =========================================
   SHOW / HIDE PASSWORD
========================================= */

document
    .querySelectorAll(".password-toggle")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const targetId =
                    button.dataset.target;

                const input =
                    document.getElementById(
                        targetId
                    );

                const icon =
                    button.querySelector("i");


                if (
                    input.type === "password"
                ) {

                    input.type = "text";

                    icon.className =
                        "bi bi-eye-slash";

                } else {

                    input.type = "password";

                    icon.className =
                        "bi bi-eye";

                }

            }
        );

    });


/* =========================================
   CHANGE PASSWORD
========================================= */

if (changePasswordForm) {

    changePasswordForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const currentPassword =
                document.getElementById(
                    "currentPassword"
                ).value;

            const newPassword =
                document.getElementById(
                    "newPassword"
                ).value;

            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                ).value;


            /* ---------------------------------
               VALIDATION
            --------------------------------- */

            if (newPassword.length < 6) {

                showPasswordMessage(
                    "New password must be at least 6 characters long.",
                    "error"
                );

                return;

            }


            if (
                newPassword !==
                confirmPassword
            ) {

                showPasswordMessage(
                    "New passwords do not match.",
                    "error"
                );

                return;

            }


            if (
                currentPassword ===
                newPassword
            ) {

                showPasswordMessage(
                    "New password must be different from your current password.",
                    "error"
                );

                return;

            }


            const token =
                localStorage.getItem(
                    "typingAuthToken"
                );


            if (!token) {

                window.location.href =
                    "login.html";

                return;

            }


            /* ---------------------------------
               BUTTON LOADING
            --------------------------------- */

            changePasswordButton.disabled =
                true;

            changePasswordButton.innerHTML = `
                <span
                    class="spinner-border spinner-border-sm me-2"
                ></span>
                Changing...
            `;


            try {

                const response =
                    await fetch(
                        `${window.API_BASE_URL}/users/change-password`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`
                            },

                            body:
                                JSON.stringify({
                                    currentPassword,
                                    newPassword
                                })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to change password."
                    );

                }


                /* -----------------------------
                   SUCCESS
                ----------------------------- */

                showPasswordMessage(
                    "Password changed successfully. Please log in again.",
                    "success"
                );


                changePasswordForm.reset();


                /*
                 * Remove old JWT because the
                 * password has changed.
                 */

                setTimeout(
                    () => {

                        localStorage.removeItem(
                            "typingAuthToken"
                        );

                        localStorage.removeItem(
                            "typingUser"
                        );

                        window.location.href =
                            "login.html";

                    },
                    2000
                );


            } catch (error) {

                console.error(
                    "Change password error:",
                    error
                );


                showPasswordMessage(
                    error.message ||
                    "Unable to change password.",
                    "error"
                );

            } finally {

                changePasswordButton.disabled =
                    false;

                changePasswordButton.innerHTML = `
                    <i class="bi bi-shield-lock"></i>
                    Change Password
                `;

            }

        }
    );

}

/* =========================================
   CLEAR TYPING HISTORY
========================================= */

const clearHistoryButton =
    document.getElementById(
        "clearHistoryButton"
    );

const confirmClearHistory =
    document.getElementById(
        "confirmClearHistory"
    );

const historyMessage =
    document.getElementById(
        "historyMessage"
    );

const clearHistoryModalElement =
    document.getElementById(
        "clearHistoryModal"
    );


let clearHistoryModal = null;


/* =========================================
   INITIALIZE MODAL
========================================= */

if (
    clearHistoryModalElement &&
    typeof bootstrap !== "undefined"
) {

    clearHistoryModal =
        new bootstrap.Modal(
            clearHistoryModalElement
        );

}


/* =========================================
   SHOW MESSAGE
========================================= */

function showHistoryMessage(
    message,
    type
) {

    historyMessage.textContent =
        message;

    historyMessage.className =
        `history-message ${type}`;

}


/* =========================================
   OPEN CONFIRMATION
========================================= */

if (clearHistoryButton) {

    clearHistoryButton.addEventListener(
        "click",
        () => {

            if (clearHistoryModal) {

                clearHistoryModal.show();

            }

        }
    );

}


/* =========================================
   CONFIRM CLEAR
========================================= */

if (confirmClearHistory) {

    confirmClearHistory.addEventListener(
        "click",
        async () => {

            const token =
                localStorage.getItem(
                    "typingAuthToken"
                );


            if (!token) {

                window.location.href =
                    "login.html";

                return;

            }


            /* -----------------------------
               BUTTON LOADING
            ----------------------------- */

            confirmClearHistory.disabled =
                true;

            confirmClearHistory.innerHTML = `
                <span
                    class="spinner-border spinner-border-sm me-2"
                ></span>
                Clearing...
            `;


            try {

                const response =
                    await fetch(
                        `${window.API_BASE_URL}/tests/history`,
                        {
                            method: "DELETE",

                            headers: {
                                "Authorization":
                                    `Bearer ${token}`
                            }
                        }
                    );


                const data =
                    await response.json();


                if (response.status === 401) {

                    localStorage.removeItem(
                        "typingAuthToken"
                    );

                    localStorage.removeItem(
                        "typingUser"
                    );

                    window.location.href =
                        "login.html";

                    return;

                }


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to clear typing history."
                    );

                }


                /* -----------------------------
                   CLOSE MODAL
                ----------------------------- */

                if (clearHistoryModal) {

                    clearHistoryModal.hide();

                }


                /* -----------------------------
                   SUCCESS MESSAGE
                ----------------------------- */

                showHistoryMessage(
                    `${data.deletedCount || 0} typing test result(s) deleted successfully.`,
                    "success"
                );


                /*
                 * Clear local typing history as well.
                 */

                localStorage.removeItem(
                    "typingTestHistory"
                );

                localStorage.removeItem(
                    "typingBestWPM"
                );


                /*
                 * Reload profile statistics
                 * if loadProfile() exists.
                 */

                if (
                    typeof loadProfile ===
                    "function"
                ) {

                    await loadProfile();

                }


                /*
                 * Refresh page after a short delay
                 * so all statistics are reset.
                 */

                setTimeout(
                    () => {
                        window.location.reload();
                    },
                    1200
                );


            } catch (error) {

                console.error(
                    "Clear history error:",
                    error
                );


                if (clearHistoryModal) {

                    clearHistoryModal.hide();

                }


                showHistoryMessage(
                    error.message ||
                    "Unable to clear typing history.",
                    "error"
                );


            } finally {

                confirmClearHistory.disabled =
                    false;

                confirmClearHistory.innerHTML = `
                    <i class="bi bi-trash3"></i>
                    Yes, Clear History
                `;

            }

        }
    );

}

/* =========================================
   DELETE ACCOUNT
========================================= */

const deleteAccountButton =
    document.getElementById(
        "deleteAccountButton"
    );

const confirmDeleteAccount =
    document.getElementById(
        "confirmDeleteAccount"
    );

const deleteAccountPassword =
    document.getElementById(
        "deleteAccountPassword"
    );

const deleteAccountMessage =
    document.getElementById(
        "deleteAccountMessage"
    );

const deleteAccountModalElement =
    document.getElementById(
        "deleteAccountModal"
    );

const deletePasswordToggle =
    document.getElementById(
        "deletePasswordToggle"
    );


let deleteAccountModal = null;


/* =========================================
   INITIALIZE MODAL
========================================= */

if (
    deleteAccountModalElement &&
    typeof bootstrap !== "undefined"
) {

    deleteAccountModal =
        new bootstrap.Modal(
            deleteAccountModalElement
        );

}


/* =========================================
   OPEN DELETE MODAL
========================================= */

if (deleteAccountButton) {

    deleteAccountButton.addEventListener(
        "click",
        () => {

            deleteAccountPassword.value = "";

            deleteAccountMessage.textContent = "";

            deleteAccountMessage.className =
                "delete-account-message";

            if (deleteAccountModal) {

                deleteAccountModal.show();

            }

        }
    );

}


/* =========================================
   SHOW / HIDE DELETE PASSWORD
========================================= */

if (deletePasswordToggle) {

    deletePasswordToggle.addEventListener(
        "click",
        () => {

            const icon =
                deletePasswordToggle.querySelector(
                    "i"
                );


            if (
                deleteAccountPassword.type ===
                "password"
            ) {

                deleteAccountPassword.type =
                    "text";

                icon.className =
                    "bi bi-eye-slash";

            } else {

                deleteAccountPassword.type =
                    "password";

                icon.className =
                    "bi bi-eye";

            }

        }
    );

}


/* =========================================
   CONFIRM DELETE ACCOUNT
========================================= */

if (confirmDeleteAccount) {

    confirmDeleteAccount.addEventListener(
        "click",
        async () => {

            const password =
                deleteAccountPassword.value.trim();


            if (!password) {

                deleteAccountMessage.textContent =
                    "Please enter your current password.";

                deleteAccountMessage.className =
                    "delete-account-message error";

                return;

            }


            const token =
                localStorage.getItem(
                    "typingAuthToken"
                );


            if (!token) {

                window.location.href =
                    "login.html";

                return;

            }


            /* ---------------------------------
               BUTTON LOADING
            --------------------------------- */

            confirmDeleteAccount.disabled =
                true;

            confirmDeleteAccount.innerHTML = `
                <span
                    class="spinner-border spinner-border-sm me-2"
                ></span>
                Deleting...
            `;


            try {

                const response =
                    await fetch(
                        `${window.API_BASE_URL}/users/account`,
                        {
                            method: "DELETE",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`
                            },

                            body:
                                JSON.stringify({
                                    currentPassword:
                                        password
                                })
                        }
                    );


                const data =
                    await response.json();


                /* -----------------------------
                   INVALID SESSION
                ----------------------------- */

                if (response.status === 401) {

                    deleteAccountMessage.textContent =
                        data.message ||
                        "Authentication failed.";

                    deleteAccountMessage.className =
                        "delete-account-message error";

                    return;

                }


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to delete account."
                    );

                }


                /* -----------------------------
                   ACCOUNT DELETED
                ----------------------------- */

                if (deleteAccountModal) {

                    deleteAccountModal.hide();

                }


                /*
                 * Remove all local account data.
                 */

                localStorage.removeItem(
                    "typingAuthToken"
                );

                localStorage.removeItem(
                    "typingUser"
                );

                localStorage.removeItem(
                    "typingTestHistory"
                );

                localStorage.removeItem(
                    "typingBestWPM"
                );

                localStorage.removeItem(
                    "lastTypingResult"
                );


                /*
                 * Redirect to login page.
                 */

                window.location.href =
                    "login.html";


            } catch (error) {

                console.error(
                    "Delete account error:",
                    error
                );


                deleteAccountMessage.textContent =
                    error.message ||
                    "Unable to delete account.";

                deleteAccountMessage.className =
                    "delete-account-message error";


            } finally {

                confirmDeleteAccount.disabled =
                    false;

                confirmDeleteAccount.innerHTML = `
                    <i class="bi bi-person-x-fill"></i>
                    Permanently Delete
                `;

            }

        }
    );

}