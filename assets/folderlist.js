//Author: rayr
//Date: 10/8/25
//usage: <URI>/folderlist
//e.g. http://localhost:5005/folderlist

'use strict';
const fs = require('fs').promises;
const path = require('path');

// Sub-function that performs an asynchronous operation
async function readDirectory(directoryPath) {
    try {
        const items = await fs.readdir(directoryPath);
        return items;
    } catch (err) {
        console.error('Error reading directory:', err);
        return [];
    }
}

// Main function that waits for the sub-function to complete
async function folderlist(player, values) {
	const directoryPath = '/home/pi/share/music';
    const items = await readDirectory(directoryPath);
	console.log(items);
    const folders = items.filter(async (item) => {
        const itemPath = path.join(directoryPath, item);
        const stats = await fs.stat(itemPath);
        return stats.isDirectory();
    });
    return folders;
}

module.exports = function (api) {
  api.registerAction('folderlist', folderlist);
}

