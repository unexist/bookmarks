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

function renderBookmark(elem) {
    const a = document.createElement("a");

    a.text = elem.name.substr(0, elem.name.lastIndexOf("."));
    a.target = "_new";
    a.classList.add("entry");

    /* Load json content */
    if ("file" === elem.type) {
        loadFile(elem.download_url).then(response => {
            a.href = response.url;

            if (null != response.description) {
                a.setAttribute("title", response.description);
            }
        });
    }

    return a;
}

function renderTag(elem) {
    const a = document.createElement("a");

    a.text = elem.name;
    a.classList.add("entry");

    return a;
}

function renderPlaceholder(text) {
    const a = document.createElement("a");

    a.text = text;
    a.classList.add("entry");

    return a;
}

function showPage(name, loadFunc, renderFunc, clickFunc) {
    showMenu(name);

    loadFunc().then(response => {
        const spinner = document.getElementById(name + "_spinner");
        const list = document.getElementById(name + "_list");

        /* Clear content */
        list.innerHTML = "";

        response.forEach(elem => {
            const entry = renderFunc(elem);

            /* Add click func if any */
            if (null != clickFunc) {
                entry.addEventListener("click", () => {
                    clickFunc(elem);
                });
            }

            list.appendChild(entry);
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
document.getElementById("button_add").addEventListener("click", () => {
    showPage("tags", loadTags, renderTag, (elem) => {
        /* Get current tab */
        const b = chrome || browser;

        b.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            addBookmark(elem.name, tabs[0].title, tabs[0].url, "Test").then(response => {
                if (201 !== response.status) {
                    alert(response.status + " " + response.statusText);
                }
            });
        });
    }, renderBookmark);
});

document.getElementById("button_tags").addEventListener("click", () => {
    showPage("tags", loadTags, renderTag, (elem) => {
        showPage("bookmarks", () => {
            return loadBookmarks(elem.name);
        }, renderBookmark)
    });
});

document.querySelectorAll(".entry.back").forEach(elem => {
    elem.addEventListener("click", () => {
        if (document.getElementById("menu_tags")
            .classList.contains("hidden"))
        {
            showMenu("tags");
        } else {
            showMenu("main");
        }
    });
});