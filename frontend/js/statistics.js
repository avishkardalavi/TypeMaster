document.addEventListener("DOMContentLoaded", function () {

    loadOnlineStatistics();

});


/* =========================================
   LOAD ONLINE STATISTICS
========================================= */

async function loadOnlineStatistics() {

    const token =
        localStorage.getItem(
            "typingAuthToken"
        );


    /* =====================================
       CHECK LOGIN
    ===================================== */

    if (!token) {

        showLoginRequired();

        return;

    }


    try {

        const response =
            await fetch(
                `${window.API_BASE_URL}/tests`,
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


        /* =================================
           TOKEN INVALID / EXPIRED
        ================================= */

        if (
            response.status === 401
        ) {

            localStorage.removeItem(
                "typingAuthToken"
            );

            localStorage.removeItem(
                "typingUser"
            );

            showLoginRequired();

            return;

        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to load statistics."
            );

        }


        const results =
            data.results || [];


        /* =================================
           UPDATE STATISTICS
        ================================= */

        calculateStatistics(
            results
        );


        renderRecentTests(
            results
        );


        renderChart(
            results
        );


    } catch (error) {

        console.error(
            "Statistics error:",
            error
        );


        showError(
            "Unable to load your online statistics."
        );

    }

}


/* =========================================
   CALCULATE STATISTICS
========================================= */

function calculateStatistics(
    results
) {

    if (
        !results ||
        results.length === 0
    ) {

        setText(
            "bestWpm",
            "0"
        );

        setText(
            "averageWpm",
            "0"
        );

        setText(
            "bestAccuracy",
            "0%"
        );

        setText(
            "testsCompleted",
            "0"
        );

        setText(
            "totalCharacters",
            "0"
        );

        setText(
            "totalMistakes",
            "0"
        );

        setText(
            "averageAccuracy",
            "0%"
        );

        setText(
            "fastestTest",
            "0 WPM"
        );

        showEmptyState();

        return;

    }


    /* =====================================
       WPM
    ===================================== */

    const wpms =
        results.map(
            result =>
                Number(result.wpm)
        );


    const bestWpm =
        Math.max(...wpms);


    const averageWpm =
        wpms.reduce(
            (sum, value) =>
                sum + value,
            0
        ) / wpms.length;


    /* =====================================
       ACCURACY
    ===================================== */

    const accuracies =
        results.map(
            result =>
                Number(result.accuracy)
        );


    const bestAccuracy =
        Math.max(...accuracies);


    const averageAccuracy =
        accuracies.reduce(
            (sum, value) =>
                sum + value,
            0
        ) / accuracies.length;


    /* =====================================
       CHARACTERS
    ===================================== */

    const totalCharacters =
        results.reduce(
            (sum, result) =>
                sum +
                Number(result.characters || 0),
            0
        );


    /* =====================================
       MISTAKES
    ===================================== */

    const totalMistakes =
        results.reduce(
            (sum, result) =>
                sum +
                Number(result.mistakes || 0),
            0
        );


    /* =====================================
       UPDATE UI
    ===================================== */

    setText(
        "bestWpm",
        Math.round(bestWpm)
    );


    setText(
        "averageWpm",
        Math.round(averageWpm)
    );


    setText(
        "bestAccuracy",
        `${bestAccuracy.toFixed(1)}%`
    );


    setText(
        "testsCompleted",
        results.length
    );


    setText(
        "totalCharacters",
        totalCharacters.toLocaleString()
    );


    setText(
        "totalMistakes",
        totalMistakes.toLocaleString()
    );


    setText(
        "averageAccuracy",
        `${averageAccuracy.toFixed(1)}%`
    );


    setText(
        "fastestTest",
        `${Math.round(bestWpm)} WPM`
    );


    /* =====================================
       PERSONAL BEST
    ===================================== */

    const personalBest =
        document.getElementById(
            "personalBestWpm"
        );


    if (personalBest) {

        personalBest.textContent =
            `${Math.round(bestWpm)} WPM`;

    }


    hideEmptyState();

}


/* =========================================
   RECENT TESTS
========================================= */

function renderRecentTests(
    results
) {

    const tableBody =
        document.getElementById(
            "recentTestsBody"
        );


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    const recentResults =
        results.slice(0, 10);


    recentResults.forEach(
        (result) => {

            const row =
                document.createElement(
                    "tr"
                );


            const date =
                result.createdAt
                    ? new Date(
                        result.createdAt
                    ).toLocaleString()
                    : "-";


            row.innerHTML = `

                <td>
                    ${date}
                </td>

                <td>
                    <strong>
                        ${Math.round(
                            Number(result.wpm)
                        )}
                    </strong>
                </td>

                <td>
                    ${Number(
                        result.accuracy
                    ).toFixed(1)}%
                </td>

                <td>
                    ${Number(
                        result.mistakes || 0
                    )}
                </td>

                <td>
                    ${Number(
                        result.characters || 0
                    )}
                </td>

                <td>

                    <span class="difficulty-badge ${escapeHTML(
                        result.difficulty
                    )}">

                        ${escapeHTML(
                            capitalize(
                                result.difficulty
                            )
                        )}

                    </span>

                </td>

                <td>
                    ${Number(
                        result.duration
                    )}s
                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}


/* =========================================
   CHART
========================================= */

function renderChart(
    results
) {

    const canvas =
        document.getElementById(
            "wpmChart"
        );


    if (!canvas) {
        return;
    }


    if (
        typeof Chart ===
        "undefined"
    ) {

        console.error(
            "Chart.js is not loaded."
        );

        return;

    }


    const recent =
        results
            .slice(0, 15)
            .reverse();


    const labels =
        recent.map(
            (_, index) =>
                `Test ${index + 1}`
        );


    const wpmValues =
        recent.map(
            result =>
                Number(result.wpm)
        );


    const existingChart =
        Chart.getChart(canvas);


    if (existingChart) {

        existingChart.destroy();

    }


    new Chart(
        canvas,
        {

            type: "line",

            data: {

                labels,

                datasets: [

                    {

                        label:
                            "WPM",

                        data:
                            wpmValues,

                        tension:
                            0.35,

                        fill:
                            false,

                        borderWidth:
                            2,

                        pointRadius:
                            4

                    }

                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio:
                    false,

                plugins: {

                    legend: {

                        display:
                            true

                    }

                },

                scales: {

                    y: {

                        beginAtZero:
                            true

                    }

                }

            }

        }
    );

}


/* =========================================
   LOGIN REQUIRED
========================================= */

function showLoginRequired() {

    const main =
        document.querySelector(
            "main"
        );


    if (!main) {
        return;
    }


    main.innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">

                <i class="bi bi-person-lock"></i>

            </div>

            <h3>
                Login required
            </h3>

            <p>
                Login to view your personal
                typing statistics.
            </p>

            <a
                href="login.html"
                class="btn btn-primary"
            >

                <i class="bi bi-box-arrow-in-right"></i>

                Login

            </a>

        </div>

    `;

}


/* =========================================
   EMPTY STATE
========================================= */

function showEmptyState() {

    const emptyState =
        document.getElementById(
            "emptyState"
        );


    if (emptyState) {

        emptyState.classList.remove(
            "d-none"
        );

    }

}


function hideEmptyState() {

    const emptyState =
        document.getElementById(
            "emptyState"
        );


    if (emptyState) {

        emptyState.classList.add(
            "d-none"
        );

    }

}


/* =========================================
   ERROR
========================================= */

function showError(
    message
) {

    const main =
        document.querySelector(
            "main"
        );


    if (!main) {
        return;
    }


    main.innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">

                <i class="bi bi-exclamation-triangle"></i>

            </div>

            <h3>
                Something went wrong
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

            <button
                class="btn btn-primary"
                onclick="location.reload()"
            >

                Try Again

            </button>

        </div>

    `;

}


/* =========================================
   HELPERS
========================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


function capitalize(
    value
) {

    if (!value) {

        return "";

    }


    return value.charAt(0).toUpperCase()
        + value.slice(1);

}


function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value ?? "";


    return div.innerHTML;

}