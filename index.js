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

//Save button
savePageBtn.addEventListener("click", () => {
    let newUrl = inputEl.value;
    let linkName = newUrl.replace(/(^http(?:s|):\/\/)/, "");
    if (newUrl === "") {
        return false;
    } else if (newUrl.match(/(^http(?:s|):\/\/)/)) {
        pageLinks.push(newUrl);
        pageNames.push(linkName);
    } else {
        newUrl = "http://".concat(newUrl);
        pageLinks.push(newUrl);
        pageNames.push(linkName);
    }

    //simpan ke local storage
    localStorage.setItem("savedPages", JSON.stringify(pageLinks));
    localStorage.setItem("savedNamePages", JSON.stringify(pageNames));
    renderPageList(false);
});

//Save Tab Button
saveTabBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
        let newUrl = tab[0].url;
        let linkName = newUrl.replace(/(^http(?:s|):\/\/)/, "");
        if (newUrl === "") {
            return false;
        } else if (newUrl.match(/(^http(?:s|):\/\/)/)) {
            pageLinks.push(newUrl);
            pageNames.push(linkName);
        } else {
            newUrl = "http://".concat(newUrl);
            pageLinks.push(newUrl);
            pageNames.push(linkName);
        }
        //simpan ke local storage
        localStorage.setItem("savedPages", JSON.stringify(pageLinks));
        localStorage.setItem("savedNamePages", JSON.stringify(pageNames));
        renderPageList(false);
    });
});

//Delete Button
deleteAllBtn.addEventListener("dblclick", () => {
    localStorage.clear();
    pageLinks = [];
    pageNames = [];

    const listItemEl = document.querySelectorAll(".list-item");
    listItemEl.forEach((item) => {
        console.log(item);
        item.remove();
    });
});

const handleOneClickDelete = function () {
    savedPages.insertAdjacentHTML(
        "beforebegin",
        '<p class="delete-message">Double-click to delete</p>'
    );
    setTimeout(() => {
        let deleteMessage =
            document.getElementsByClassName("delete-message")[0];
        console.log(deleteMessage);
        deleteMessage.remove();
    }, 5000);
    deleteAllBtn.removeEventListener("click", handleOneClickDelete);
};
deleteAllBtn.addEventListener("click", handleOneClickDelete);

function renderPageList(loadAll) {
    // let index;
    if (loadAll) {
        for (let i = 0; i < pageLinks.length; i++) {
            let listItem = `<li class="list-item"><a href="${pageLinks[i]}">${pageNames[i]}</a></li>`;
            pageList.insertAdjacentHTML("afterend", listItem);
        }
    } else {
        index = pageLinks.length - 1;
        let listItem = `<li class="list-item"><a href="${pageLinks[index]}" target="\_blank">${pageNames[index]}</a></li>`;
        pageList.insertAdjacentHTML("afterend", listItem);
    }
    inputEl.value = "";
}
