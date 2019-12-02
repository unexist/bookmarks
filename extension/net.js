/**
 * @package Bkmrks
 *
 * @file Communication with backend
 * @copyright (c) 2019, Christoph Kappel <unexist@subforge.org>
 * @version $Id$
 *
 * This program can be distributed under the terms of the GNU GPL.??
 * See the file COPYING
 **/

const URL = "http://localhost:7000";

/**
 * Load bookmarks from server
 */

async function loadBookmarks() {
    const response = await fetch(URL + "/bookmarks", {
        method: "GET",
        headers: {
            "accept": "application/json"
        }
    });

    return await response.json();
}

/**
 * Load tags from server
 */

async function loadTags() {
    const response = await fetch(URL + "/tags", {
        method: "GET",
        headers: {
            "accept": "application/json"
        }
    });

    return await response.json();
}

/**
 * Check whether given url is already bookmarked
 *
 * @param {String}  urlString . Url as string
 *
 * TODO: Cache?
 */

async function isBookmarked(urlString) {
    return await fetch(URL + "/check", {
        method: "POST",
        body: urlString,
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json"
        }
    });
}

/**
 * Add given url to bookmark list
 *
 * @param {String}  urlString . Url as string
 **/

async function addBookmark(urlString) {
    return await fetch(URL, {
        method: "POST",
        body: urlString,
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json"
        }
    });
}