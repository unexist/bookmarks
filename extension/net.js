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

const USER = "unexist";
const REPO = "bookmarks";
const REPO_URL = "https://api.github.com/repos/" + USER + "/" + REPO;
const FILE_URL = "https://github.com/" + USER + "/" + REPO + "/blob/main/bookmarks";

/**
 * Load bookmarks from server
 *
 * @param  {String}  tagname  Optional tag name
 **/

async function loadBookmarks(tagname) {
    var url = REPO_URL + "/contents/bookmarks";

    if (undefined !== tagname) {
        url += "/" + tagname;
    }

    const response = await fetch(url, {
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
    const response = await fetch(REPO_URL + "/contents/bookmarks", {
        method: "GET",
        headers: {
            "accept": "application/json"
        }
    });

    return await response.json();
}

/**
 * Load file from server
 *
 * @param  {String}  path  Path of file to load
 **/

async function loadFile(path) {
    const response = await fetch(path, {
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
    return await fetch(REPO_URL + "/check", {
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
    return await fetch(REPO_URL, {
        method: "POST",
        body: urlString,
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json"
        }
    });
}
