document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       ELEMENTS
    ========================================= */

    const textDisplay =
        document.getElementById("textDisplay");

    const typingInput =
        document.getElementById("typingInput");

    const timeElement =
        document.getElementById("time");

    const wpmElement =
        document.getElementById("wpm");

    const accuracyElement =
        document.getElementById("accuracy");

    const mistakesElement =
        document.getElementById("mistakes");

    const progressBar =
        document.getElementById("typingProgress");

    const characterCount =
        document.getElementById("characterCount");

    const restartButton =
        document.getElementById("restartBtn");

    const testStatus =
        document.getElementById("testStatus");

    const modeButtons =
        document.querySelectorAll(".mode-btn");

    const difficultyButtons =
        document.querySelectorAll(".difficulty-btn");


    /* =========================================
       GAME STATE
    ========================================= */

    let selectedTime = 30;

    let selectedDifficulty = "easy";

    let currentText = "";

    let timer = null;

    let startTime = null;

    let timeRemaining = selectedTime;

    let testStarted = false;

    let testFinished = false;


    /* =========================================
       INITIALIZE
    ========================================= */

async function initializeGame() {

    stopTimer();

    testStarted = false;

    testFinished = false;

    timeRemaining = selectedTime;

    timeElement.textContent =
        selectedTime;

    wpmElement.textContent = "0";

    accuracyElement.textContent = "100";

    mistakesElement.textContent = "0";

    characterCount.textContent =
        "0 / 0 characters";

    progressBar.style.width = "0%";

    testStatus.textContent = "Loading...";

    typingInput.value = "";

    typingInput.disabled = true;

    await generateText();

    typingInput.disabled = false;

    typingInput.focus();
}


    /* =========================================
       GENERATE TEXT
    ========================================= */

async function generateText() {

    try {

        const response =
            await fetch(
                `${window.API_BASE_URL}/paragraphs`
            );

        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to load paragraphs."
            );

        }


        const paragraphs =
            data.paragraphs.filter(
                paragraph =>
                    paragraph.difficulty ===
                    selectedDifficulty
            );


        if (paragraphs.length === 0) {

            currentText = "";

            textDisplay.innerHTML = `
                <div class="text-danger">
                    No ${selectedDifficulty} paragraphs are available.
                    Please ask the administrator to add one.
                </div>
            `;

            testStatus.textContent =
                "No paragraph available";

            return;
        }


        const randomIndex =
            Math.floor(
                Math.random() *
                paragraphs.length
            );


        currentText =
            paragraphs[randomIndex].text;


        renderText();


        testStatus.textContent =
            "Ready";

    } catch (error) {

        console.error(
            "Paragraph loading error:",
            error
        );


        currentText = "";

        textDisplay.innerHTML = `
            <div class="text-danger">
                Unable to load paragraphs from the server.
            </div>
        `;


        testStatus.textContent =
            "Server Error";
    }
}


    /* =========================================
       RENDER TEXT
    ========================================= */

    function renderText() {

        textDisplay.innerHTML = "";

        [...currentText].forEach(
            function (character, index) {

                const span =
                    document.createElement("span");

                span.classList.add("char");

                span.dataset.index = index;

                span.textContent = character;

                textDisplay.appendChild(span);

            }
        );

        updateCurrentCharacter();

    }


    /* =========================================
       START TEST
    ========================================= */

    function startTest() {

        if (testStarted || testFinished) {
            return;
        }

        testStarted = true;

        startTime = Date.now();

        testStatus.textContent =
            "Typing...";

        timer = setInterval(
            updateTimer,
            1000
        );

    }


    /* =========================================
       TIMER
    ========================================= */

    function updateTimer() {

        timeRemaining--;

        timeElement.textContent =
            timeRemaining;

        if (timeRemaining <= 0) {

            finishTest();

        }

    }


    /* =========================================
       STOP TIMER
    ========================================= */

    function stopTimer() {

        if (timer !== null) {

            clearInterval(timer);

            timer = null;

        }

    }


    /* =========================================
       HANDLE TYPING
    ========================================= */

    typingInput.addEventListener(
        "input",
        function () {

            if (!testStarted) {

                startTest();

            }

            checkTyping();

        }
    );


    /* =========================================
       CHECK TYPING
    ========================================= */

    function checkTyping() {

        const typedText =
            typingInput.value;

        const characters =
            textDisplay.querySelectorAll(".char");

        let correctCharacters = 0;

        let incorrectCharacters = 0;


        characters.forEach(
            function (character, index) {

                character.classList.remove(
                    "correct",
                    "incorrect",
                    "current"
                );


                if (index < typedText.length) {

                    if (
                        typedText[index] ===
                        currentText[index]
                    ) {

                        character.classList.add(
                            "correct"
                        );

                        correctCharacters++;

                    } else {

                        character.classList.add(
                            "incorrect"
                        );

                        incorrectCharacters++;

                    }

                }

            }
        );


        updateCurrentCharacter();


        /* =====================================
           CALCULATE ACCURACY
        ===================================== */

        const totalTyped =
            typedText.length;

        let accuracy = 100;


        if (totalTyped > 0) {

            accuracy =
                Math.round(
                    (
                        correctCharacters /
                        totalTyped
                    ) * 100
                );

        }


        /* =====================================
           CALCULATE WPM
        ===================================== */

        let elapsedTime = 0;

        if (startTime !== null) {

            elapsedTime =
                (
                    Date.now() -
                    startTime
                ) / 1000;

        }


        let wpm = 0;


        if (elapsedTime > 0) {

            wpm =
                Math.round(
                    (
                        correctCharacters / 5
                    ) /
                    (
                        elapsedTime / 60
                    )
                );

        }


        /* =====================================
           UPDATE UI
        ===================================== */

        wpmElement.textContent =
            wpm;

        accuracyElement.textContent =
            Math.max(0, accuracy);

        mistakesElement.textContent =
            incorrectCharacters;


        characterCount.textContent =
            typedText.length +
            " / " +
            currentText.length +
            " characters";


        const progress =
            Math.min(
                (
                    typedText.length /
                    currentText.length
                ) * 100,
                100
            );


        progressBar.style.width =
            progress + "%";


        /* =====================================
           FINISH IF TEXT COMPLETED
        ===================================== */

        if (
            typedText.length >=
            currentText.length
        ) {

            finishTest();

        }

    }


    /* =========================================
       CURRENT CHARACTER
    ========================================= */

    function updateCurrentCharacter() {

        const typedLength =
            typingInput.value.length;

        const currentCharacter =
            textDisplay.querySelector(
                `[data-index="${typedLength}"]`
            );

        if (currentCharacter) {

            currentCharacter.classList.add(
                "current"
            );

        }

    }


    /* =====================================
   SAVE RESULT TO BACKEND
===================================== */

    async function saveResultToServer(result) {

        const token =
            localStorage.getItem(
                "typingAuthToken"
            );


        // User is not logged in
        if (!token) {

            console.log(
                "User is not logged in. Result will remain local."
            );

            return false;

        }


        try {

            const response =
                await fetch(
                    `${window.API_BASE_URL}/tests`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body:
                            JSON.stringify({

                                wpm:
                                    result.wpm,

                                accuracy:
                                    result.accuracy,

                                mistakes:
                                    result.mistakes,

                                characters:
                                    result.characters,

                                difficulty:
                                    result.difficulty,

                                duration:
                                    result.duration

                            })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to save result."
                );

            }


            console.log("Typing result saved to MongoDB:", data);

            /*
             * Check and unlock achievements
             * after successfully saving the test result.
             */
            try {

                const achievementResponse = await fetch(
                    `${window.API_BASE_URL}/achievements`,
                    {
                        method: "GET",

                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                if (achievementResponse.ok) {

                    const achievementData =
                        await achievementResponse.json();

                    console.log(
                        "Achievements updated:",
                        achievementData
                    );

                } else {

                    console.warn(
                        "Achievement update failed:",
                        achievementResponse.status
                    );

                }

            } catch (achievementError) {

                console.warn(
                    "Could not update achievements:",
                    achievementError
                );

            }

            return true;


        } catch (error) {

            console.error(
                "Online result save failed:",
                error
            );


            return false;

        }

    }

    /* =========================================
       FINISH TEST
    ========================================= */

    async function finishTest() {

        if (testFinished) {
            return;
        }

        testFinished = true;

        stopTimer();

        typingInput.disabled = true;

        testStatus.textContent =
            "Complete";


        /* =====================================
           FINAL CALCULATIONS
        ===================================== */

        const typedText =
            typingInput.value;


        const characters =
            textDisplay.querySelectorAll(
                ".char"
            );


        let correctCharacters = 0;

        let incorrectCharacters = 0;


        characters.forEach(
            function (character, index) {

                character.classList.remove(
                    "current"
                );


                if (
                    index < typedText.length
                ) {

                    if (
                        typedText[index] ===
                        currentText[index]
                    ) {

                        correctCharacters++;

                    } else {

                        incorrectCharacters++;

                    }

                }

            }
        );


        const elapsedTime =
            Math.max(
                (
                    Date.now() -
                    startTime
                ) / 1000,
                1
            );


        const wpm =
            Math.round(
                (
                    correctCharacters / 5
                ) /
                (
                    elapsedTime / 60
                )
            );


        const accuracy =
            typedText.length > 0
                ? Math.round(
                    (
                        correctCharacters /
                        typedText.length
                    ) * 100
                )
                : 100;


        /* =====================================
           SAVE PERSONAL BEST
        ===================================== */

        const previousBest =
            Number(
                localStorage.getItem(
                    "typingBestWPM"
                )
            ) || 0;


        const newBest =
            Math.max(
                previousBest,
                wpm
            );


        localStorage.setItem(
            "typingBestWPM",
            newBest
        );


        /* =====================================
           SAVE TEST RESULT
        ===================================== */

        const result = {

            wpm: wpm,

            accuracy: Math.max(
                0,
                accuracy
            ),

            mistakes:
                incorrectCharacters,

            characters:
                typedText.length,

            difficulty:
                selectedDifficulty,

            duration:
                selectedTime,

            date:
                new Date().toISOString()

        };

        await saveResultToServer(result);


        localStorage.setItem(
            "lastTypingResult",
            JSON.stringify(result)
        );

        /* =====================================
   SAVE TEST HISTORY
===================================== */

        let testHistory = [];

        try {

            testHistory =
                JSON.parse(
                    localStorage.getItem(
                        "typingTestHistory"
                    )
                ) || [];

        } catch (error) {

            testHistory = [];

        }


        testHistory.push(result);


        /*
           Keep the latest 50 tests only.
        */

        if (testHistory.length > 50) {

            testHistory =
                testHistory.slice(-50);

        }


        localStorage.setItem(
            "typingTestHistory",
            JSON.stringify(testHistory)
        );


        /* =====================================
           UPDATE RESULT MODAL
        ===================================== */

        document.getElementById(
            "finalWpm"
        ).textContent = wpm;


        document.getElementById(
            "finalAccuracy"
        ).textContent =
            Math.max(0, accuracy) + "%";


        document.getElementById(
            "finalMistakes"
        ).textContent =
            incorrectCharacters;


        document.getElementById(
            "finalCharacters"
        ).textContent =
            typedText.length;


        document.getElementById(
            "bestWpm"
        ).textContent =
            newBest;


        /* =====================================
           SHOW MODAL
        ===================================== */

        const modalElement =
            document.getElementById(
                "resultModal"
            );


        const resultModal =
            bootstrap.Modal.getOrCreateInstance(
                modalElement
            );


        resultModal.show();

    }


    /* =========================================
       RESTART
    ========================================= */

    restartButton.addEventListener(
        "click",
        function () {

            initializeGame();

        }
    );


    /* =========================================
       TIME MODE
    ========================================= */

    modeButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    modeButtons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    selectedTime =
                        Number(
                            button.dataset.time
                        );


                    initializeGame();

                }
            );

        }
    );


    /* =========================================
       DIFFICULTY
    ========================================= */

    difficultyButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    difficultyButtons.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    selectedDifficulty =
                        button.dataset.level;


                    initializeGame();

                }
            );

        }
    );


    /* =========================================
       TRY AGAIN
    ========================================= */

    const tryAgainButton =
        document.getElementById(
            "tryAgainBtn"
        );


    if (tryAgainButton) {

        tryAgainButton.addEventListener(
            "click",
            function () {

                initializeGame();

            }
        );

    }


    /* =========================================
       KEYBOARD SHORTCUT
       Ctrl + R is handled normally by browser.
       Escape resets only when input is focused.
    ========================================= */

    typingInput.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                event.preventDefault();

                initializeGame();

            }

        }
    );


    /* =========================================
       INITIAL LOAD
    ========================================= */

    initializeGame();

});