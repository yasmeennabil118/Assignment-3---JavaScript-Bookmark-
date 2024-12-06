var bookmarkName = document.getElementById("bookmarkName");
var bookmarkURL = document.getElementById("bookmarkURL");
var submitBtn = document.getElementById("submitBtn");
var bookmarkList = [];
var regex = {
    bookmarkName: {
        value: /^[A-Z][A-Za-z0-9\s]{2,}$/,
        valid: false
    },
    bookmarkURL: {
        value: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-@:%._\+~#=]+\.[a-zA-Z0-9()]{1,6}[a-zA-Z0-9-()!@:%_\+.~#?&\/\/=]*$/,
        valid: false
    }
}

if (localStorage.getItem("bookmarkList") != null) {
    bookmarkList = JSON.parse(localStorage.getItem("bookmarkList"));
    display(bookmarkList);
}

function addBookmark() {
    var bookmark = {
        name: bookmarkName.value,
        URL: bookmarkURL.value
    }
    if (bookmarkName.value && bookmarkURL.value) {
        if (regex.bookmarkName.valid && regex.bookmarkURL.valid) {
            if (!bookmarkList.find(existingBookmark => existingBookmark.name === bookmark.name)) {
                bookmarkList.push(bookmark);
                updateLocalStorage();
                display(bookmarkList);
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "Bookmark name already exists!",
                    text: "Please enter a different bookmark name"
                });
            }
            clearInputs();
            bookmarkName.classList.remove("is-valid");
            bookmarkURL.classList.remove("is-valid");
        }
        else {
            Swal.fire({
                title: "Bookmark name or website URL is not valid!",
                icon: "error",
                html: `<div class="text-start">
                    <p class="mb-0"><i class="fa-regular fa-circle-right p-2 text-danger"></i>Bookmark name must be a valid name</p>
                    <small>must begin with<strong> capital letter</strong> and contain <strong>at least 3 characters</strong></small>
                    <p class="mb-0 mt-3"><i class="fa-regular fa-circle-right p-2 text-danger"></i>Website URL must be a valid one</p>
                    <ul class="list-unstyled">
                    <li><small>could begin with <strong>http:// or https://</strong></small></li>
                    <li><small>could contain <strong>www. </strong>after http:// or https://</small></li>
                    <li><small>the domain must have <strong>at least 1 character</strong></small></li>
                    </ul>
                    </div>`
            });
        }
    }
    else {
        Swal.fire({
            icon: "warning",
            title: "Bookmark name and website URL cannot be empty!",
            text: "Please enter bookmark name and website URL"
        });
    }
}

function display(bookmarkList) {
    var bookmarks = ``;
    if (bookmarkList.length == 0) {
        document.getElementById("bookmarkTable").innerHTML = `<tr>
                    <td colspan="4" class="fw-semibold">Bookmark List is Empty!</td>
                </tr>`;
    } else {
        for (var i = 0; i < bookmarkList.length; i++) {
            bookmarks += `<tr>
                    <td>${i + 1}</td>
                    <td>${bookmarkList[i].name}</td>
                    <td>
                        <button class="btn btn-visit" onclick="visitURL(${i})">
                            <i class="fa-solid fa-eye pe-2"></i>Visit
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-delete" onclick="deleteBookmark(${i})">
                            <i class="fa-solid fa-trash-can pe-2"></i>Delete
                        </button>
                    </td>
                </tr>`;
        }
        document.getElementById("bookmarkTable").innerHTML = bookmarks;
    }
}

function updateLocalStorage() {
    localStorage.setItem("bookmarkList", JSON.stringify(bookmarkList));
}

function clearInputs() {
    bookmarkName.value = null;
    bookmarkURL.value = null;
}

function deleteBookmark(i) {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#7066E0",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            bookmarkList.splice(i, 1);
            updateLocalStorage();
            display(bookmarkList);
            Swal.fire({
                title: "Deleted!",
                text: "Your bookmark has been deleted.",
                icon: "success"
            });
        }
    });
}

function visitURL(i) {
    open(bookmarkList[i].URL);
}

function validateInput(element) {
    if (regex[element.id].value.test(element.value) == true) {
        element.classList.add("is-valid");
        element.classList.remove("is-invalid");
        regex[element.id].valid = true;
    }
    else {
        element.classList.add("is-invalid");
        element.classList.remove("is-valid");
        regex[element.id].valid = false;
    }
}