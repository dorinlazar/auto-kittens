function kittens_observeTheSky() {
  $('#observeBtn').click();
}

function kittens_autoCraft() {
  var resources = [
    ['wood', 'beam'],
    ['minerals', 'slab'],
    ['coal', 'steel'],
    ['iron', 'plate']
  ];

  for (var i = 0; i < resources.length; i++) {
    var curRes = gamePage.resPool.get(resources[i][0]);
    if (curRes.value / curRes.maxValue > 0.95
      && gamePage.workshop.getCraft(resources[i][1]).unlocked) {
      gamePage.craftAll(resources[i][1]);
    }
  }
}

function kittens_autoHunt() {
  var catpower = gamePage.resPool.get('manpower');
  if (catpower.value / catpower.maxValue > 0.95) {
    $('a:contains(\'Send hunters\')')[0].click();
    if (gamePage.workshop.getCraft('parchment').unlocked) { gamePage.craftAll('parchment'); }
    if (gamePage.workshop.getCraft('manuscript').unlocked) { gamePage.craftAll('manuscript'); }
    if (gamePage.workshop.getCraft('compedium').unlocked) { gamePage.craftAll('compedium'); }
  }
};

function kittens_autoCatnip() {
  var catnip = gamePage.resPool.get('catnip');
  var calendar = gamePage.calendar;
  if (catnip.perTickUI < 0) { return; }
  if (catnip.value / catnip.maxValue < 0.95) { return; }
  if (calendar.season == 2 && calendar.day > 50) { return; }
  gamePage.craftAll('wood');
}

function kittens_autoPray() {
  var faith = gamePage.resPool.get('faith');

  if (faith.value / faith.maxValue > 0.95) {
    $('a:contains(\'Praise the sun\')')[0].click();
  }
}

function add_cheats() {
  nbsp = document.createElement('div');
  nbsp.innerHTML = '&nbsp;|&nbsp;';
  link = document.createElement('div');
  link.innerHTML = '<a href="#" onclick="console.log(\'Clicked\', gamePage.resPool.get(\'manpower\')); kittens_autoHunt();"> Cheats</a>';
  elem = document.getElementsByClassName('right-tab-header')[0];
  elem.appendChild(nbsp.firstChild);
  elem.appendChild(link.firstChild);
  // console.log(gamePage.resPool.get('manpower'));
}

add_cheats();
