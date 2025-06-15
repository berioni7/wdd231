// -------------------- Cookie Utils --------------------
function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) return value;
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

// -------------------- Login Logic --------------------
document.getElementById("loginBtn")?.addEventListener("click", () => {
    const isLoggedIn = getCookie("loggedIn") === "true";
    if (!isLoggedIn) {
        window.location.href = "login.html";
    }
});

document.getElementById("profileBtn")?.addEventListener("click", () => {
    window.location.href = "profile.html";
});

window.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("loginBtn");
    const logoutModal = document.getElementById("logoutModal");
    const confirmLogout = document.getElementById("confirmLogout");
    const cancelLogout = document.getElementById("cancelLogout");

    const isLoggedIn = getCookie("loggedIn") === "true";

    if (loginBtn) {
        loginBtn.textContent = isLoggedIn ? "Logout" : "Login";

        if (isLoggedIn) {
            loginBtn.addEventListener("click", () => {
                logoutModal.style.display = "block";
            });

            confirmLogout?.addEventListener("click", () => {
                deleteCookie("loggedIn");
                deleteCookie("username");
                localStorage.removeItem("savedBooks");
                localStorage.removeItem("savedReviews");
                logoutModal.style.display = "none";
                window.location.reload();
            });

            cancelLogout?.addEventListener("click", () => {
                logoutModal.style.display = "none";
            });
        }
    }
});

// -------------------- Register --------------------
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("regName").value;
        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;
        const dob = document.getElementById("regDob").value;

        const user = { name, email, password, dob };
        localStorage.setItem("marginsUser", JSON.stringify(user));

        const modal = document.createElement("div");
        modal.innerHTML = `
            <div style="position:fixed; top:30%; left:50%; transform:translate(-50%, -50%);
                        background:white; padding:20px; border-radius:10px; box-shadow:0 0 10px black; text-align:center; z-index:1000;">
                <h2>Welcome, ${name}!</h2>
                <p>Your account has been created.</p>
            </div>
        `;
        document.body.appendChild(modal);

        setTimeout(() => {
            modal.remove();
            window.location.href = "login.html";
        }, 4000);
    });
}

// -------------------- Login --------------------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("loginUsername").value;
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
        const loginError = document.getElementById("loginError");

        const user = JSON.parse(localStorage.getItem("marginsUser"));
        if (
            user &&
            user.name.toLowerCase() === username.toLowerCase() &&
            user.email.toLowerCase() === email.toLowerCase() &&
            user.password === password
        ) {
            setCookie("loggedIn", "true", 1);
            setCookie("username", user.name, 1);
            loginError.textContent = "";
            document.getElementById("loginSuccessModal")?.classList.remove("hidden");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1500);
        } else {
            loginError.textContent = "Incorrect login: please check your info or create an account.";
            loginError.style.color = "red";
        }
    });

    document.getElementById("createAccountLink")?.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "createaccount.html";
    });
}

// -------------------- Search --------------------
document.querySelector(".search-bar")?.addEventListener("submit", async function (e) {
    e.preventDefault();
    const query = document.getElementById("searchInput").value.trim();
    if (!query) return;

    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (data.docs && data.docs.length > 0) {
        const book = data.docs[0];
        const key = book.key;

        const workResponse = await fetch(`https://openlibrary.org${key}.json`);
        const workData = await workResponse.json();

        const bookDetails = {
            title: book.title,
            author: book.author_name?.[0] || "Unknown",
            cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : "",
            key: book.key,
            description: workData.description?.value || workData.description || "No description available."
        };

        localStorage.setItem("selectedBook", JSON.stringify(bookDetails));
        window.location.href = "books.html";
    } else {
        alert("No book found.");
    }
});

// -------------------- Books Page (books.html) --------------------
const book = JSON.parse(localStorage.getItem("selectedBook"));
if (book && document.getElementById("book-details")) {
    document.getElementById("book-details").innerHTML = `
        <h2>${book.title}</h2>
        <p>by ${book.author}</p>
        <img src="${book.cover}" alt="Book cover">
        <p>${book.description}</p>
    `;

    const ratingDiv = document.getElementById("rating");
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.textContent = "☆";
        star.style.fontSize = "2em";
        star.style.cursor = "pointer";
        star.addEventListener("click", () => {
            localStorage.setItem(`rating_${book.key}`, i);
            [...ratingDiv.children].forEach((s, index) => {
                s.textContent = index < i ? "★" : "☆";
            });
        });
        ratingDiv.appendChild(star);
    }

    document.getElementById("saveBook")?.addEventListener("click", () => {
        const books = JSON.parse(localStorage.getItem("savedBooks") || "[]");
        const alreadySaved = books.find(b => b.key === book.key);

        if (alreadySaved) {
            const message = document.createElement("div");
            message.textContent = "This book has already been saved.";
            message.style.position = "fixed";
            message.style.top = "20px";
            message.style.left = "50%";
            message.style.transform = "translateX(-50%)";
            message.style.background = "#f8d7da";
            message.style.color = "#721c24";
            message.style.padding = "10px 20px";
            message.style.border = "1px solid #f5c6cb";
            message.style.borderRadius = "5px";
            message.style.zIndex = "9999";
            document.body.appendChild(message);

            setTimeout(() => {
                message.remove();
            }, 3000);
            return;
        }

        books.push(book);
        localStorage.setItem("savedBooks", JSON.stringify(books));
        window.location.href = "mybooks.html";
    });

    document.getElementById("submitReview")?.addEventListener("click", () => {
        const text = document.getElementById("reviewText").value.trim();
        if (text) {
            const reviews = JSON.parse(localStorage.getItem("savedReviews") || "[]");
            reviews.push({ bookTitle: book.title, text });
            localStorage.setItem("savedReviews", JSON.stringify(reviews));
            window.location.href = "myreviews.html";
        }
    });
}

// -------------------- My Books Page (mybooks.html) --------------------
if (document.getElementById("myBooks")) {
    const books = JSON.parse(localStorage.getItem("savedBooks") || "[]");
    const div = document.getElementById("myBooks");

    if (books.length === 0) {
        div.textContent = "You haven't saved any books yet.";
    } else {
        books.forEach(book => {
            const bookCard = document.createElement("div");
            bookCard.innerHTML = `
                <h3>${book.title}</h3>
                <img src="${book.cover}" alt="Cover" style="width:100px">
                <p>by ${book.author}</p>
            `;
            div.appendChild(bookCard);
        });
    }
}

// -------------------- My Reviews Page (myreviews.html) --------------------
if (document.getElementById("myReviews")) {
    let reviews = JSON.parse(localStorage.getItem("savedReviews") || "[]");
    const div = document.getElementById("myReviews");

    if (reviews.length === 0) {
        div.textContent = "You haven't written any reviews yet.";
    } else {
        reviews.forEach((r, index) => {
            const reviewCard = document.createElement("div");
            reviewCard.style.border = "1px solid #ccc";
            reviewCard.style.margin = "10px";
            reviewCard.style.padding = "10px";
            reviewCard.style.borderRadius = "8px";
            reviewCard.style.position = "relative";

            const title = document.createElement("strong");
            title.textContent = r.bookTitle;

            const text = document.createElement("p");
            text.textContent = r.text;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.style.position = "absolute";
            deleteBtn.style.top = "10px";
            deleteBtn.style.right = "10px";
            deleteBtn.style.backgroundColor = "#e74c3c";
            deleteBtn.style.color = "white";
            deleteBtn.style.border = "none";
            deleteBtn.style.padding = "5px 10px";
            deleteBtn.style.borderRadius = "5px";
            deleteBtn.style.cursor = "pointer";

            deleteBtn.addEventListener("click", () => {
                reviews.splice(index, 1);
                localStorage.setItem("savedReviews", JSON.stringify(reviews));
                reviewCard.remove();

                if (reviews.length === 0) {
                    div.textContent = "You haven't written any reviews yet.";
                }
            });

            reviewCard.appendChild(title);
            reviewCard.appendChild(text);
            reviewCard.appendChild(deleteBtn);
            div.appendChild(reviewCard);
        });
    }
}

