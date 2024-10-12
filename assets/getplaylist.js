//Author: rayr
//Date: 10/8/25
//usage: <URI>/getplaylist/<playlist id>/<limit>/<offset>
//e.g. http://localhost:5005/getplaylist/3/60/0
// - modified from queue.JSON
// - calls new module "getPL" in <installdir>\node-sonos-http-api-master\node_modules\sonos-discovery\lib\models\Player.js line 850

'use strict';

function simplify(items) {
  return items
  .map(item => {
    return {
      title: item.title,
      artist: item.artist,
      album: item.album,
      //albumArtUri: item.albumArtUri
    }
  });
}

function getplaylist(player, values) {
  const detailed = values[values.length - 1] === 'detailed';
  let id;
  let limit;
  let offset;

  if (/\d+/.test(values[0])) {
    id = parseInt(values[0]);
  }
  if (/\d+/.test(values[1])) {
    limit = parseInt(values[1]);
  }
  if (/\d+/.test(values[2])) {
    offset = parseInt(values[2]);
  }

  const promise = player.coordinator.getPL(id,limit,offset);  //ray (limit, offset);

  if (detailed) {
    return promise;
  }

  return promise.then(simplify);
}

module.exports = function (api) {
  api.registerAction('getplaylist', getplaylist);
}
