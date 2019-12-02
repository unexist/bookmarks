/**
 * @package Bkmrks
 * @file Popup handling
 * @copyright (c) 2019, Christoph Kappel <unexist@subforge.org>
 * @version $Id$
 *
 * This program can be distributed under the terms of the GNU GPL.??
 * See the file COPYING
 **/

function showMenu(name) {
    document.querySelectorAll(".menu").forEach(elem => {
        elem.classList.add("hidden");
    });

    document.getElementById("menu_" + name).classList.remove("hidden");
}

function toggleBookmark() {
}

function renderBookmark(elem) {
    const a = document.createElement("a");
    const d = new Date(Date.parse(elem.checked_at));

    a.href = elem.uri;
    a.text = elem.uri;
    a.target = "_new";
    a.classList.add("entry");

    a.setAttribute("title", "Last checked: " +
        d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate()
    );

    return a;
}

function renderTag(elem) {
    const a = document.createElement("a");

    a.text = elem.name;
    a.classList.add("entry");

    a.addEventListener("click", () => {
        showPage("bookmarks", () => {
            return loadBookmarks(elem.id);
        }, renderBookmark)
    });

    return a;
}

function renderPlaceholder(text) {
    const a = document.createElement("a");

    a.text = text;
    a.classList.add("entry");

    return a;
}

function showPage(name, loadFunc, renderFunc) {
    showMenu(name);

    loadFunc().then(response => {
        const spinner = document.getElementById(name + "_spinner");
        const list = document.getElementById(name + "_list");

        /* Clear content */
        list.innerHTML = "";

        response.forEach(elem => {
            list.appendChild(renderFunc(elem));
        });

        /* Placeholder? */
        if (!list.hasChildNodes()) {
            list.appendChild(renderPlaceholder("No content"));
        }

        spinner.classList.add("hidden");
        list.classList.remove("hidden");
    });
}

/* Events */
document.getElementById("button_toggle").addEventListener("click", toggleBookmark);

document.getElementById("button_tags").addEventListener("click", () => {
    showPage("tags", loadTags, renderTag);
});

document.getElementById("button_bookmarks").addEventListener("click", () => {
    showPage("bookmarks", loadBookmarks, renderBookmark);
});

document.querySelectorAll(".entry.back").forEach(elem => {
    elem.addEventListener("click", () => {
        showMenu("main");;
    });
});