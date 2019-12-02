/**
 * @package Bkmrks
 * @file Extension handling
 * @copyright (c) 2019, Christoph Kappel <unexist@subforge.org>
 * @version $Id$
 *
 * This program can be distributed under the terms of the GNU GPL.??
 * See the file COPYING
 **/

var browser = browser || chrome;

/**
 * Updates the browserAction icon to reflect whether the current page
 * is already bookmarked.
 **/
function updateIcon(tabId, isBookmarked) {
    browser.browserAction.setIcon({
        path: (isBookmarked
            ? {
                19: "icons/star-filled-19.png",
                38: "icons/star-filled-38.png"
            }
            : {
                19: "icons/star-empty-19.png",
                38: "icons/star-empty-38.png"
            }),
        tabId: tabId
    });

    browser.browserAction.setTitle({
        tabId: tabId,
        title: (isBookmarked ? "Unbookmark it!" : "Bookmark it!")
    });
}

/*
 * Add or remove the bookmark on the current page.
 */
function toggleBookmark() {
}

/**
 * Check whether given protocol is valid
 *
 * @param {String} . urlString . Url
 **/

function isSupportedProtocol(urlString) {
    var supportedProtocols = ["https:", "http:", "ftp:", "file:"];
    var url = document.createElement("a");

    url.href = urlString;

    return -1 != supportedProtocols.indexOf(url.protocol);
}

/**
 * Update given tab
 *
 * @param {*} tabs
 **/

function updateTab(tabs) {
    if (tabs[0]) {
        if (isSupportedProtocol(tabs[0].url)) {
            isBookmarked(tabs[0].url).then(response => {
                updateIcon(tabs[0].id, !response.ok);
            });
        }
    }
}

/**
 * Update bookmark icon based on active tab
 *
 * @param {*} tabs
 **/

function updateActiveTab(tabs) {
    chrome.tabs.query(
        {
            active: true,
            currentWindow: true
        }, updateTab
    );
}

/* Events */
browser.browserAction.onClicked.addListener(toggleBookmark);
browser.tabs.onActivated.addListener(updateActiveTab);
//browser.windows.onFocusChanged.addListener(updateActiveTab);