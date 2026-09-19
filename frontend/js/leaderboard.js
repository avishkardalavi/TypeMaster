document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadLeaderboard();


        const retryButton =
            document.getElementById(
                "retryButton"
            );


        if (retryButton) {

            retryButton.addEventListener(
                "click",
                loadLeaderboard
            );

        }

    }
);


/* =========================================
   LOAD LEADERBOARD
========================================= */

async function loadLeaderboard() {

    showLoading();


    try {

        const response =
            await fetch(
                `${window.API_BASE_URL}/leaderboard`
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load leaderboard."
            );

        }


        const leaderboard =
            data.leaderboard || [];


        if (
            leaderboard.length === 0
        ) {

            showEmpty();

            return;

        }


        renderTopPlayers(
            leaderboard
        );


        renderLeaderboardTable(
            leaderboard
        );


        showTable();


    } catch (error) {

        console.error(
            "Leaderboard error:",
            error
        );


        showError(
            error.message ||
            "Unable to load leaderboard."
        );

    }

}


/* =========================================
   TOP 3 PLAYERS
========================================= */

function renderTopPlayers(
    leaderboard
) {

    const container =
        document.getElementById(
            "topPlayers"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const topThree =
        leaderboard.slice(
            0,
            3
        );


    topThree.forEach(
        player => {

            let rankClass = "";
            let icon = "";


            if (
                player.rank === 1
            ) {

                rankClass = "first";

                icon =
                    '<i class="bi bi-trophy-fill"></i>';

            } else if (
                player.rank === 2
            ) {

                rankClass = "second";

                icon =
                    '<i class="bi bi-award-fill"></i>';

            } else {

                rankClass = "third";

                icon =
                    '<i class="bi bi-medal-fill"></i>';

            }


            const column =
                document.createElement(
                    "div"
                );


            column.className =
                "col-md-4";


            column.innerHTML = `

                <div class="top-player-card ${rankClass}">

                    <div class="rank-icon">

                        ${icon}

                    </div>


                    <h3>

                        ${escapeHTML(
                            player.username
                        )}

                    </h3>


                    <div class="top-wpm">

                        ${player.bestWpm}

                    </div>


                    <div class="top-label">

                        BEST WPM

                    </div>


                    <div class="top-details">

                        <span>

                            <i class="bi bi-bullseye"></i>

                            ${player.averageAccuracy}%

                        </span>


                        <span>

                            <i class="bi bi-check-circle"></i>

                            ${player.testsCompleted} tests

                        </span>

                    </div>

                </div>

            `;


            container.appendChild(
                column
            );

        }
    );

}


/* =========================================
   TABLE
========================================= */

function renderLeaderboardTable(
    leaderboard
) {

    const tbody =
        document.getElementById(
            "leaderboardBody"
        );


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    const currentUser =
        getCurrentUser();


    leaderboard.forEach(
        player => {

            const row =
                document.createElement(
                    "tr"
                );


            const isCurrentUser =
                currentUser &&
                String(
                    currentUser.id
                ) ===
                String(
                    player.userId
                );


            if (
                isCurrentUser
            ) {

                row.classList.add(
                    "current-user"
                );

            }


            const rankClass =
                player.rank <= 3
                    ? "top-rank"
                    : "";


            row.innerHTML = `

                <td>

                    <span
                        class="rank-number ${rankClass}"
                    >

                        #${player.rank}

                    </span>

                </td>


                <td>

                    <span class="player-name">

                        ${escapeHTML(
                            player.username
                        )}

                    </span>


                    ${
                        isCurrentUser
                            ? `
                                <span
                                    class="badge text-bg-primary ms-2"
                                >
                                    You
                                </span>
                              `
                            : ""
                    }

                </td>


                <td>

                    <span class="wpm-value">

                        ${player.bestWpm}

                    </span>

                    WPM

                </td>


                <td>

                    ${player.averageWpm}

                    WPM

                </td>


                <td>

                    <span class="accuracy-value">

                        ${player.averageAccuracy}%

                    </span>

                </td>


                <td>

                    ${player.testsCompleted}

                </td>

            `;


            tbody.appendChild(
                row
            );

        }
    );

}


/* =========================================
   CURRENT USER
========================================= */

function getCurrentUser() {

    const storedUser =
        localStorage.getItem(
            "typingUser"
        );


    if (!storedUser) {
        return null;
    }


    try {

        return JSON.parse(
            storedUser
        );

    } catch (error) {

        return null;

    }

}


/* =========================================
   LOADING
========================================= */

function showLoading() {

    document
        .getElementById(
            "loadingState"
        )
        ?.classList.remove(
            "d-none"
        );


    document
        .getElementById(
            "errorState"
        )
        ?.classList.add(
            "d-none"
        );


    document
        .getElementById(
            "emptyState"
        )
        ?.classList.add(
            "d-none"
        );


    document
        .getElementById(
            "tableContainer"
        )
        ?.classList.add(
            "d-none"
        );

}


/* =========================================
   SHOW TABLE
========================================= */

function showTable() {

    document
        .getElementById(
            "loadingState"
        )
        ?.classList.add(
            "d-none"
        );


    document
        .getElementById(
            "errorState"
        )
        ?.classList.add(
            "d-none"
        );


    document
        .getElementById(
            "emptyState"
        )
        ?.classList.add(
            "d-none"
        );


    document
        .getElementById(
            "tableContainer"
        )
        ?.classList.remove(
            "d-none"
        );

}


/* =========================================
   SHOW EMPTY
========================================= */

function showEmpty() {

    document
        .getElementById(
            "loadingState"
        )
        ?.classList.add(
            "d-none"
        );


    document
        .getElementById(
            "errorState"
        )
        ?.classList.add(
            "d-none"
        );


    document
        .getElementById(
            "tableContainer"
        )
        ?.classList.add(
            "d-none"
        );


    document
        .getElementById(
            "emptyState"
        )
        ?.classList.remove(
            "d-none"
        );

}


/* =========================================
   SHOW ERROR
========================================= */

function showError(
    message
) {

    document
        .getElementById(
            "loadingState"
        )
        ?.classList.add(
            "d-none"
        );


    document
        .getElementById(
            "tableContainer"
        )
        ?.classList.add(
            "d-none"
        );


    document
        .getElementById(
            "emptyState"
        )
        ?.classList.add(
            "d-none"
        );


    const errorState =
        document.getElementById(
            "errorState"
        );


    if (errorState) {

        errorState.classList.remove(
            "d-none"
        );

    }


    const errorMessage =
        document.getElementById(
            "errorMessage"
        );


    if (errorMessage) {

        errorMessage.textContent =
            message;

    }

}


/* =========================================
   ESCAPE HTML
========================================= */

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