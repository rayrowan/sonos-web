//Author: rayr
//Date: 10/8/25
//usage: <URI>/folder/<folder id>
//e.g. http://localhost:5005/folder/3

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
async function folder(player, values) {
	let directoryPath = '/home/pi/share/music';
    const items = await readDirectory(directoryPath);;
//	console.log(items);
    const folders = items.filter(async (item) => {
        const itemPath = path.join(directoryPath, item);
        const stats = await fs.stat(itemPath);
        return stats.isDirectory();
    });
	
	let id;
	if (/\d+/.test(values[0])) {
	id = parseInt(values[0]);
	}
	
	directoryPath = directoryPath + '/' + folders[id];
	console.log(directoryPath);
	const files = await readDirectory(directoryPath);
    return files;
}

module.exports = function (api) {
  api.registerAction('folder', folder);
}

