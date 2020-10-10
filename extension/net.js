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

const REPO_USER = "unexist";
const REPO_NAME = "bookmarks";
const REPO_URL = "https://api.github.com/repos/" + REPO_USER + "/" + REPO_NAME;

const COMITTER_USER = "unexist";
const COMITTER_MAIL = "christoph@unexist.dev";

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
 * Add given url to bookmark list
 *
 * @param {String}  tag          Name of the tag
 * @param {String}  name         Name of the entry
 * @param {String}  url          Url of the entry
 * @param {String}  description  Descriprtion of the entry
 **/

async function addBookmark(tag, name, url, description) {
    var url = REPO_URL + "/contents/bookmarks/" + tag + "/" +
        name.replace(/[^\w\s]/gi, "") + ".json";

    return await fetch(REPO_URL, {
        method: "PUT",
        body: JSON.stringify({
            "message": "Added bookmark",
            "committer": {
                "name": COMITTER_MAIL,
                "email": COMITTER_MAIL
            },
            "content": btoa(JSON.stringify({
                "url": url,
                "description": description
            }))
        }),
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json"
        }
    });
}
