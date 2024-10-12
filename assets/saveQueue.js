'use strict';

function savequeue(player, values) {
  const uri = decodeURIComponent(values[0]);
  const title = values[1];
  const metadata = "";
  return player.coordinator.saveQueue(uri,title);
}

module.exports = function (api) {
  api.registerAction('savequeue', savequeue);
};
