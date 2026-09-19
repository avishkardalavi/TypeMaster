const API_URL = window.API_BASE_URL;


/* =========================================
   ELEMENTS
========================================= */

const loadingState =
    document.getElementById("loadingState");

const errorState =
    document.getElementById("errorState");

const loginState =
    document.getElementById("loginState");

const achievementsGrid =
    document.getElementById("achievementsGrid");

const errorMessage =
    document.getElementById("errorMessage");

const retryButton =
    document.getElementById("retryButton");


/* =========================================
   LOAD ACHIEVEMENTS
========================================= */

async function loadAchievements() {

    const token =
        localStorage.getItem(
            "typingAuthToken"
        );


    /* -----------------------------------------
       CHECK LOGIN
    ----------------------------------------- */

    if (!token) {

        showLoginState();

        return;

    }


    showLoadingState();


    try {

        const response =
            await fetch(
                `${API_URL}/achievements`,
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
           UNAUTHORIZED
        ----------------------------------------- */

        if (response.status === 401) {

            localStorage.removeItem(
                "typingAuthToken"
            );

            localStorage.removeItem(
                "typingUser"
            );

            showLoginState();

            return;

        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load achievements."
            );

        }


        renderSummary(
            data.summary
        );


        renderAchievements(
            data.achievements
        );


    } catch (error) {

        console.error(
            "Achievement loading error:",
            error
        );

        showError(
            error.message
        );

    }

}


/* =========================================
   RENDER SUMMARY
========================================= */

function renderSummary(summary) {

    const total =
        Number(summary.total || 0);

    const unlocked =
        Number(summary.unlocked || 0);

    const testsCompleted =
        Number(
            summary.testsCompleted || 0
        );

    const bestWpm =
        Number(
            summary.bestWpm || 0
        );

    const bestAccuracy =
        Number(
            summary.bestAccuracy || 0
        );


    const progress =
        total > 0
            ? Math.round(
                (unlocked / total) * 100
            )
            : 0;


    document.getElementById(
        "totalAchievements"
    ).textContent = total;


    document.getElementById(
        "unlockedAchievements"
    ).textContent = unlocked;


    document.getElementById(
        "achievementProgress"
    ).textContent = `${progress}%`;


    document.getElementById(
        "achievementProgressBar"
    ).style.width = `${progress}%`;


    document.getElementById(
        "testsCompleted"
    ).textContent = testsCompleted;


    document.getElementById(
        "bestWpm"
    ).textContent = bestWpm;


    document.getElementById(
        "bestAccuracy"
    ).textContent =
        `${bestAccuracy}%`;


    document.getElementById(
        "miniUnlocked"
    ).textContent = unlocked;

}


/* =========================================
   RENDER ACHIEVEMENTS
========================================= */

function renderAchievements(
    achievements
) {

    achievementsGrid.innerHTML = "";


    if (
        !achievements ||
        achievements.length === 0
    ) {

        achievementsGrid.innerHTML = `

            <div class="col-12">

                <div class="achievement-state">

                    <div class="state-icon">
                        <i class="bi bi-trophy"></i>
                    </div>

                    <h3>
                        No achievements available
                    </h3>

                    <p>
                        Complete typing tests to start
                        unlocking achievements.
                    </p>

                </div>

            </div>

        `;

        showOnly(
            achievementsGrid
        );

        return;

    }


    achievements.forEach(
        achievement => {

            const card =
                createAchievementCard(
                    achievement
                );

            achievementsGrid.appendChild(
                card
            );

        }
    );


    showOnly(
        achievementsGrid
    );

}


/* =========================================
   CREATE ACHIEVEMENT CARD
========================================= */

function createAchievementCard(
    achievement
) {

    const column =
        document.createElement("div");

    column.className =
        "col-md-6 col-lg-4";


    const unlocked =
        achievement.unlocked === true;


    const statusClass =
        unlocked
            ? "unlocked"
            : "locked";


    const statusIcon =
        unlocked
            ? "bi-check-circle-fill"
            : "bi-lock-fill";


    const statusText =
        unlocked
            ? "Unlocked"
            : "Locked";


    let unlockDateHTML = "";


    if (
        unlocked &&
        achievement.unlockedAt
    ) {

        const date =
            new Date(
                achievement.unlockedAt
            );


        unlockDateHTML = `

            <div class="unlock-date">

                <i class="bi bi-calendar3"></i>

                Unlocked on
                ${formatDate(date)}

            </div>

        `;

    }


    column.innerHTML = `

        <div
            class="achievement-card ${statusClass}"
        >

            <div class="achievement-icon">

                <i
                    class="bi ${
                        escapeHTML(
                            achievement.icon
                        )
                    }"
                ></i>

            </div>


            <h3>
                ${escapeHTML(
                    achievement.name
                )}
            </h3>


            <p>
                ${escapeHTML(
                    achievement.description
                )}
            </p>


            <span
                class="achievement-status ${statusClass}"
            >

                <i class="bi ${statusIcon}"></i>

                ${statusText}

            </span>


            ${unlockDateHTML}

        </div>

    `;


    return column;

}


/* =========================================
   DATE FORMAT
========================================= */

function formatDate(date) {

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   STATES
========================================= */

function showLoadingState() {

    showOnly(
        loadingState
    );

}


function showLoginState() {

    showOnly(
        loginState
    );

}


function showError(message) {

    errorMessage.textContent =
        message ||
        "Something went wrong.";

    showOnly(
        errorState
    );

}


function showOnly(element) {

    loadingState.classList.add(
        "d-none"
    );

    errorState.classList.add(
        "d-none"
    );

    loginState.classList.add(
        "d-none"
    );

    achievementsGrid.classList.add(
        "d-none"
    );


    element.classList.remove(
        "d-none"
    );

}


/* =========================================
   RETRY
========================================= */

if (retryButton) {

    retryButton.addEventListener(
        "click",
        loadAchievements
    );

}


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    loadAchievements
);