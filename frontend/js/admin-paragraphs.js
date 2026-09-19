const API_BASE_URL = window.API_BASE_URL;

const token = localStorage.getItem("typingAuthToken");
const storedUser = JSON.parse(
    localStorage.getItem("typingUser") || "null"
);


// ==========================================
// CHECK LOGIN / ADMIN
// ==========================================

if (!token || !storedUser) {
    window.location.href = "login.html";
}

if (storedUser && storedUser.role !== "admin") {
    alert("Admin access required.");
    window.location.href = "index.html";
}


// ==========================================
// VARIABLES
// ==========================================

let paragraphs = [];
let paragraphToDelete = null;

const paragraphModal =
    new bootstrap.Modal(
        document.getElementById("paragraphModal")
    );

const deleteModal =
    new bootstrap.Modal(
        document.getElementById("deleteModal")
    );


// ==========================================
// LOAD PARAGRAPHS
// ==========================================

async function loadParagraphs() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/paragraphs`
        );

        const data = await response.json();

        if (!data.success) {
            throw new Error(
                data.message || "Unable to load paragraphs."
            );
        }

        paragraphs = data.paragraphs || [];

        updateStatistics();

        renderParagraphs();

    } catch (error) {

        console.error(error);

        showMessage(
            error.message,
            "danger"
        );
    }
}


// ==========================================
// STATISTICS
// ==========================================

function updateStatistics() {

    const easy = paragraphs.filter(
        paragraph => paragraph.difficulty === "easy"
    ).length;

    const hard = paragraphs.filter(
        paragraph => paragraph.difficulty === "hard"
    ).length;

    document.getElementById(
        "totalParagraphs"
    ).textContent = paragraphs.length;

    document.getElementById(
        "easyParagraphs"
    ).textContent = easy;

    document.getElementById(
        "hardParagraphs"
    ).textContent = hard;
}


// ==========================================
// RENDER PARAGRAPHS
// ==========================================

function renderParagraphs() {

    const container =
        document.getElementById("paragraphList");

    const filter =
        document.getElementById(
            "difficultyFilter"
        ).value;

    let filteredParagraphs =
        paragraphs;

    if (filter !== "all") {

        filteredParagraphs =
            paragraphs.filter(
                paragraph =>
                    paragraph.difficulty === filter
            );
    }


    if (filteredParagraphs.length === 0) {

        container.innerHTML = `
            <div class="empty-box">
                <i class="bi bi-file-earmark-text"></i>

                <h4>No paragraphs found</h4>

                <p class="text-muted">
                    There are no paragraphs for this filter.
                </p>
            </div>
        `;

        return;
    }


    container.innerHTML =
        filteredParagraphs.map(
            paragraph => {

                const difficulty =
                    paragraph.difficulty;

                const difficultyClass =
                    `difficulty-${difficulty}`;

                const text =
                    escapeHtml(paragraph.text);

                return `
                    <div class="paragraph-card">

                        <div class="paragraph-top">

                            <div>
                                <span class="difficulty-badge ${difficultyClass}">
                                    ${capitalize(difficulty)}
                                </span>

                                <div class="paragraph-id mt-2">
                                    ID: ${paragraph._id}
                                </div>
                            </div>

                            <div class="paragraph-actions">

                                <button
                                    class="btn btn-sm btn-outline-primary"
                                    onclick="editParagraph('${paragraph._id}')"
                                >
                                    <i class="bi bi-pencil"></i>
                                    Edit
                                </button>

                                <button
                                    class="btn btn-sm btn-outline-danger"
                                    onclick="openDeleteModal('${paragraph._id}')"
                                >
                                    <i class="bi bi-trash"></i>
                                    Delete
                                </button>

                            </div>

                        </div>


                        <div class="paragraph-text">
                            ${text}
                        </div>

                    </div>
                `;
            }
        ).join("");
}


// ==========================================
// ADD PARAGRAPH
// ==========================================

document
    .getElementById("addParagraphBtn")
    .addEventListener(
        "click",
        () => {

            document.getElementById(
                "modalTitle"
            ).textContent = "Add Paragraph";

            document.getElementById(
                "paragraphId"
            ).value = "";

            document.getElementById(
                "paragraphText"
            ).value = "";

            document.getElementById(
                "paragraphDifficulty"
            ).value = "easy";

            paragraphModal.show();
        }
    );


// ==========================================
// EDIT PARAGRAPH
// ==========================================

function editParagraph(id) {

    const paragraph =
        paragraphs.find(
            item => item._id === id
        );

    if (!paragraph) {
        return;
    }

    document.getElementById(
        "modalTitle"
    ).textContent = "Edit Paragraph";

    document.getElementById(
        "paragraphId"
    ).value = paragraph._id;

    document.getElementById(
        "paragraphText"
    ).value = paragraph.text;

    document.getElementById(
        "paragraphDifficulty"
    ).value = paragraph.difficulty;

    paragraphModal.show();
}


// ==========================================
// SAVE PARAGRAPH
// ==========================================

document
    .getElementById("saveParagraphBtn")
    .addEventListener(
        "click",
        saveParagraph
    );


async function saveParagraph() {

    const id =
        document.getElementById(
            "paragraphId"
        ).value;

    const text =
        document.getElementById(
            "paragraphText"
        ).value.trim();

    const difficulty =
        document.getElementById(
            "paragraphDifficulty"
        ).value;


    if (!text) {

        showMessage(
            "Please enter paragraph text.",
            "danger"
        );

        return;
    }


    try {

        const method =
            id ? "PUT" : "POST";

        const url =
            id
                ? `${API_BASE_URL}/paragraphs/${id}`
                : `${API_BASE_URL}/paragraphs`;


        const response =
            await fetch(url, {

                method,

                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    text,
                    difficulty
                })
            });


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to save paragraph."
            );
        }


        paragraphModal.hide();

        showMessage(
            data.message ||
            "Paragraph saved successfully.",
            "success"
        );

        await loadParagraphs();

    } catch (error) {

        console.error(error);

        showMessage(
            error.message,
            "danger"
        );
    }
}


// ==========================================
// DELETE
// ==========================================

function openDeleteModal(id) {

    paragraphToDelete = id;

    deleteModal.show();
}


document
    .getElementById("confirmDeleteBtn")
    .addEventListener(
        "click",
        deleteParagraph
    );


async function deleteParagraph() {

    if (!paragraphToDelete) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/paragraphs/${paragraphToDelete}`,
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


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to delete paragraph."
            );
        }


        deleteModal.hide();

        paragraphToDelete = null;

        showMessage(
            data.message ||
            "Paragraph deleted successfully.",
            "success"
        );

        await loadParagraphs();

    } catch (error) {

        console.error(error);

        showMessage(
            error.message,
            "danger"
        );
    }
}


// ==========================================
// FILTER
// ==========================================

document
    .getElementById("difficultyFilter")
    .addEventListener(
        "change",
        renderParagraphs
    );


// ==========================================
// LOGOUT
// ==========================================

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "typingAuthToken"
            );

            localStorage.removeItem(
                "typingUser"
            );

            window.location.href =
                "login.html";
        }
    );


// ==========================================
// MESSAGE
// ==========================================

function showMessage(
    message,
    type
) {

    const box =
        document.getElementById(
            "messageBox"
        );

    box.className =
        `alert alert-${type}`;

    box.textContent = message;

    setTimeout(
        () => {
            box.classList.add("d-none");
        },
        4000
    );
}


// ==========================================
// HELPERS
// ==========================================

function capitalize(value) {

    return value.charAt(0).toUpperCase() +
        value.slice(1);
}


function escapeHtml(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


// ==========================================
// INITIAL LOAD
// ==========================================

loadParagraphs();