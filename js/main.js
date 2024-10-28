let uri = ""; 
let musicLibrary = "";
let currentPlaylist = [];
let topFolder = true;
let folderName = "";
let repeat = "none";
let shuffle = false;
$("#up").click(function(){ sonosApi("volume/+5"); });
$("#down").click(function(){ sonosApi("volume/-5");  });
$("#repeat").click(function(){ 
	if (repeat == "none") {
		sonosApi("repeat/on");
		repeat = "all";
		$('#repeat').css('opacity', '1.0');
	} else {
		sonosApi("repeat/off"); 
		repeat = "none";
		$('#repeat').css('opacity', '0.4');
	} 
});
$("#shuffle").click(function(){ 
	if (shuffle == false) {
		sonosApi("shuffle/on");
		shuffle = true;
		$('#shuffle').css('opacity', '1.0');
	} else {
		sonosApi("shuffle/off"); 
		shuffle = false;
		$('#shuffle').css('opacity', '0.3');
	} 
});
	
$("#play").click(function(){ sonosApi("play");  });
$("#pause").click(function(){ sonosApi("pause");  });
$("#prev").click(function(){ sonosApi("previous"); });
$("#next").click(function(){ sonosApi("next"); });
$("#refreshButton").click(function(){ sonosApi("state"); });
$("#saveButton").click(function(){ saveQueue(); });
$("#helpButton").click(function(){ openHelpPage(); });

$("#queueLabel").click(function(){ listQueue(); });
$("#ul-playlist-list").on("click", "li", function(){ listPlaylist(this.id); });
$("#ul-playlist-list").on("dblclick", "li", function(){ playPlaylist(this.id); });
$("#ul-song-list").on("dblclick", "li", function(){ addToQueue(this.id); });
$("#ul-file-list").on("click", "li", function(){ listFiles(this.id); });
//$("#ul-file-list").on("dblclick", "li", function(){ addFileToQueue(this.id); });
$("#up-folder").click(function(){ listFolders(); });


function openHelpPage() {
	window.open('help.html', '_blank', 'width=600,height=400');
}

window.onload = function() {

	// Fetch the settings from a JSON file
	fetch('settings.json')
		.then(response => response.json())
		.then(settings => {
			// Update the webpage with the settings
			uri = settings.uri;
			musicLibrary = settings.musicLibrary;

			sonosApi("state");
		})
		.catch(error => console.error('Error loading settings:', error));

      
};


async function sonosApi(data1) {
  const url = uri + data1;  
  console.log(url);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    console.log(json);
	const updateState = document.getElementById("statusBar");
	updateState.textContent = "Status: Success. Last action: " + data1 + "  " + JSON.stringify(json).slice(0, 100);
	if (data1 == "state") { 
		updateCurrent(json);
	}
	return json;

  } catch (error) {
    console.error(error.message);
	const updateState = document.getElementById("statusBar");
	updateState.textContent = "Error: " + data1 + "  " + JSON.stringify(json);
	return null;
  }
}

 function updateCurrent(data2) {
	 const title = document.getElementById("title");
	 const artist = document.getElementById("artist");
	 const nextTitle = document.getElementById("next-title");
	 const nextArtist = document.getElementById("next-artist");
	 title.textContent = data2.currentTrack.title;
	 artist.textContent = data2.currentTrack.artist;
	 nextTitle.textContent = data2.nextTrack.title;
	 nextArtist.textContent = data2.nextTrack.artist;	

	 repeat = data2.playMode.repeat;
	 shuffle = data2.playMode.shuffle;
	 console.log("Repeat " + repeat + "; Shuffle = " + shuffle);
	 if (shuffle == false) {
		$('#shuffle').css('opacity', '0.3');
	} else {
		$('#shuffle').css('opacity', '1.0');
	} 
	if (repeat == "none") {
		$('#repeat').css('opacity', '0.4');
	} else {
		$('#repeat').css('opacity', '1.0');
	} 

	const playlistJson = sonosApi("playlists");
	playlistJson.then(function(result){
		console.log(result);
		const playlistList = document.getElementById("playlist-list");
		//playlistList.textContent = JSON.stringify(result);
		
		const listContainer = document.getElementById('ul-playlist-list');
		listContainer.innerHTML = '';
		result.forEach((item,i) => {
			const listItem = document.createElement('li');
			listItem.textContent = item.title;
			listItem.className = "li-playlist";
			listItem.id = "li-playlist-" + item.uri.slice(item.uri.indexOf('#') + 1);   //i.toString();   //starts at zero
			console.log(listItem.id);
			listContainer.appendChild(listItem);
		});
	});
    
	listQueue();
	listFolders();
}

async function listQueue() {
	
	const playlistTitle = document.getElementById('playlist-title');
	playlistTitle.innerHTML = "Queue";
	
	const queueJson = sonosApi("queue/detailed");
	queueJson.then(function(result){
		console.log(result);
		//const queueList = document.getElementById("playlist-list");
		//playlistList.textContent = JSON.stringify(result);
		
		const listContainer = document.getElementById('ul-song-list');
		listContainer.innerHTML = "";
		result.forEach((item,i) => {
			const listItem = document.createElement('li');
			listItem.textContent = item.title;
			listItem.className = "li-song";
			listItem.id = "li-song-" + i.toString();   //starts at zero
			console.log(item.uri);
			listItem.setAttribute("data-uri", item.uri);
			listContainer.appendChild(listItem);
		});
	});	


	$("#queueLabel").css("background-color","#f9f99e");
	$(".li-playlist").css("background-color","");

}

async function listPlaylist(item) {
	
	const playlistText = document.getElementById(item).innerHTML;
	const playlistTitle = document.getElementById('playlist-title');
	playlistTitle.innerHTML = playlistText;
	
	const playlistItem = item.slice(12);
	const playlistNumber = parseInt(playlistItem);
	console.log("getplaylist/" + playlistNumber.toString() + "/detailed");
	const playlistJson = sonosApi("getplaylist/" + playlistNumber.toString() + "/detailed");
	playlistJson.then(function(result){
		console.log(result);
		//const queueList = document.getElementById("playlist-list");
		//playlistList.textContent = JSON.stringify(result);
		
		const listContainer = document.getElementById('ul-song-list');
		listContainer.innerHTML = "";
		currentPlaylist = [];
		result.forEach((item,i) => {
			const songUri = decodeURI(item.uri);
			console.log(songUri);
			const song = getCharactersAfterLastSpecialChar(songUri, '/');
			console.log(song);
			currentPlaylist.push(song);
			const listItem = document.createElement('li');
			listItem.textContent = item.title;
			listItem.className = "li-song tip";
			listItem.id = "li-song-" + i.toString();   //starts at zero
			console.log(item.uri);
			listItem.setAttribute("data-uri", item.uri);
			const tipItem = document.createElement('span');
			tipItem.textContent = decodeURI(item.uri);
			tipItem.className = "tiptext";
			listContainer.appendChild(listItem);
			listItem.appendChild(tipItem);
		});
	});	
//	console.log(currentPlaylist);
	
	item = "#" + item;
	$("#queueLabel").css("background-color","");
	$(".li-playlist").css("background-color","");
	$(item).css("background-color","#f9f99e");
}

async function playPlaylist(item) {
	
	const plTitle = "playlist/" + document.getElementById(item).innerHTML;
	console.log(plTitle);
	sonosApi(plTitle);
}


// Add addToQueue.js to node-sonos-http-api-master/lib/actions 
//http://localhost:5005/living room/addtoqueue/x-file-cifs%3A%2F%2F192.168.0.166%2Fshared%2Fmusic%2FWorld%20Heritage%20Tour%2FAll%20I%20Want%20for%20Christmas%20-%20Eline%20Vera%20(cover%20of%20Mariah%20Carey).mp3/true/1

async function addToQueue(item) {
	
	const song = document.getElementById(item);
	const songUri = song.getAttribute("data-uri");
	const uri = "addtoqueue/" + encodeURIComponent(songUri) + "/true/1";
	console.log(uri);
	sonosApi(uri);
}

async function addFileToQueue(item) {
	
	const songStr = document.getElementById(item).innerHTML;
	const songUri = "x-file-cifs:" + musicLibrary + "/" + folderName + "/" + songStr;
	const uri = "addtoqueue/" + encodeURIComponent(songUri) + "/true/1";
	console.log(uri);
	sonosApi(uri);
	console.log('Hello');
	setTimeout(() => { listQueue(); }, 200);
}

// Add saveQueue.js to node-sonos-http-api-master/lib/actions 
//http://localhost:5005/savequeue/testplaylist

async function saveQueue() {
	
	const title = document.getElementById("saveTitle").value;
	const uri = "savequeue/" + title;
	console.log(uri);
	sonosApi(uri);
	setTimeout(() => {sonosApi("state"); }, 200);
}

// Add folderlist.js to node-sonos-http-api-master/lib/actions 
// edit folderlist.js to point to you music folder locally on linux 
//http://localhost:5005/folderlist

async function listFolders() {
	topFolder = true;
	const filelistTitle = document.getElementById('filelist-title');
	filelistTitle.innerHTML = "Folders";	
	
	const folderJson = sonosApi("folderlist");
	folderJson.then(function(result){
		console.log(result);
		//const queueList = document.getElementById("playlist-list");
		//playlistList.textContent = JSON.stringify(result);
		
		const listContainer = document.getElementById('ul-file-list');
		listContainer.innerHTML = "";
		result.forEach((item,i) => {
			const listItem = document.createElement('li');
			listItem.textContent = item;
			listItem.className = "li-file";
			listItem.id = "li-file-" + i.toString();   //starts at zero
			console.log(item);
//			listItem.setAttribute("data-uri", item.uri);
			listContainer.appendChild(listItem);
		});
	});	

}

async function listFiles(item) {
	if (topFolder == true) {
		topFolder = false;
		folderName = document.getElementById(item).innerHTML;;
	} else {
		addFileToQueue(item);
		return;
	}
	console.log(currentPlaylist);
	
	const filelistText = document.getElementById(item).innerHTML;
	const filelistTitle = document.getElementById('filelist-title');
	filelistTitle.innerHTML = filelistText;
	
//	const plTitle = "playlist/" + document.getElementById(item).innerHTML;
	console.log(item);
	const id = getDigitsAfterLastSpecialChar(item, '-');
	const filesJson = sonosApi("folder/"+id);
	filesJson.then(function(result){
		console.log(result);
		//const queueList = document.getElementById("playlist-list");
		//playlistList.textContent = JSON.stringify(result);
		
		const listContainer = document.getElementById('ul-file-list');
		listContainer.innerHTML = "";
		result.forEach((item,i) => {
			const listItem = document.createElement('li');
			listItem.textContent = item;
			listItem.className = "li-file";
			listItem.id = "li-file-" + i.toString();   //starts at zero
			if (currentPlaylist.includes(item)) {
				listItem.style.backgroundColor = "#f9f99e";
			}	
			console.log(item);
//			listItem.setAttribute("data-uri", item.uri);
			listContainer.appendChild(listItem);
		});
	});		
}

function getDigitsAfterLastSpecialChar(str, specialChar) {
    const lastIndex = str.lastIndexOf(specialChar);
    if (lastIndex === -1) {
        return ''; // Special character not found
    }
    const substring = str.slice(lastIndex + 1);
    const digits = substring.match(/\d+/);
    return digits ? digits[0] : ''; // Return the digits or an empty string if no digits found
}


function getCharactersAfterLastSpecialChar(str, specialChar) {
    const lastIndex = str.lastIndexOf(specialChar);
    if (lastIndex === -1) {
        return ''; // Special character not found
    }
    const substring = str.slice(lastIndex + 1);
    return substring;
}
