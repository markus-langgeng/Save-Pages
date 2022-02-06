const inputEl = document.getElementById("input-el");
const savedCurrrentPageBtn = document.getElementById("save-current-page");
const savedPages = document.getElementById("saved-pages");
const pageList = document.getElementsByClassName("list-of-pages")[0];

const savePageBtn = document.getElementById("save-page");
const saveTabBtn = document.getElementById("save-tab");
const deleteAllBtn = document.getElementById("delete-all");

let pageLinks = [];
let pageNames = [];

const linksFromLocalStroage = JSON.parse(localStorage.getItem("savedPages"));
const pageNamesFromLocalStroage = JSON.parse(
    localStorage.getItem("savedNamePages")
);

if (linksFromLocalStroage) {
    pageLinks = linksFromLocalStroage;
    pageNames = pageNamesFromLocalStroage;
    renderPageList(true);
}

const filterUrl = (link, name) => {
    if (link === "" || link === undefined) {
        return false;
    } else if (link.match(/(^http(?:s|):\/\/)/)) {
        pageLinks.push(link);
        pageNames.push(name);
    } else {
        link = "http://".concat(link);
        pageLinks.push(link);
        pageNames.push(name);
    }
    //simpan ke local storage
    localStorage.setItem("savedPages", JSON.stringify(pageLinks));
    localStorage.setItem("savedNamePages", JSON.stringify(pageNames));
    renderPageList(false);
};

//Save button
savePageBtn.addEventListener("click", () => {
    let newUrl = inputEl.value;
    let linkName = newUrl.replace(/(^http(?:s|):\/\/)/, "");
    filterUrl(newUrl, linkName);
});

//Save Tab Button
saveTabBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
        let newUrl = tab[0].url;
        let linkName = newUrl.replace(/(^http(?:s|):\/\/)/, "");
        filterUrl(newUrl, linkName);
    });
});

//Delete Button
deleteAllBtn.addEventListener("dblclick", () => {
    localStorage.clear();
    pageLinks = [];
    pageNames = [];

    const listItemEl = document.querySelectorAll(".list-item");
    listItemEl.forEach((item) => {
        item.remove();
    });
});

const handleDelete1Click = function () {
    savedPages.insertAdjacentHTML(
        "beforebegin",
        '<p class="delete-message">Double-click to delete</p>'
    );
    setTimeout(() => {
        let deleteMessage =
            document.getElementsByClassName("delete-message")[0];
        deleteMessage.remove();
    }, 3500);
    deleteAllBtn.removeEventListener("click", handleDelete1Click);
};
deleteAllBtn.addEventListener("click", handleDelete1Click);

function renderPageList(renderAll) {
    if (renderAll) {
        for (let i = pageLinks.length - 1; i >= 0; i--) {
            let listItem = `<li class="list-item"><a href="${pageLinks[i]}">${pageNames[i]}</a></li>`;
            pageList.insertAdjacentHTML("afterend", listItem);
        }
    } else {
        index = pageLinks.length - 1;
        let listItem = `<li class="list-item"><a href="${pageLinks[index]}" target="\_blank">${pageNames[index]}</a></li>`;
        const liEl = document.querySelector(".list-item:last-of-type");
        if (liEl) {
            liEl.insertAdjacentHTML("afterend", listItem);
        } else {
            pageList.insertAdjacentHTML("afterend", listItem);
        }
    }
    inputEl.value = "";
}
