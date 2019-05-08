class Settings {
  constructor() {
    this.restore();
  }
  restore() {
    this.threshold = parseInt($('#autoThreshold').prop('value'), 10);
    this.mainSwitch = $('#automateKittens').prop('checked');
    this.autoCraft = $('#automateCraft').prop('checked');
    this.autoHunt = $('#automateHunt').prop('checked');
    this.autoPraise = $('#automatePraise').prop('checked');
    this.autoObserve = $('#automateObserve').prop('checked');
    this.autoParchment = $('#automateParchment').prop('checked');
    this.autoManuscript = $('#automateManuscript').prop('checked');
    this.autoCompendium = $('#automateCompendium').prop('checked');
    this.autoBlueprint = $('#automateBlueprint').prop('checked');
  }
}
var settings = new Settings();

$('#autoThreshold').on('change', () => settings.restore());
$('#automateKittens').on('change', () => settings.restore());
$('#automateCraft').on('change', () => settings.restore());
$('#automateHunt').on('change', () => settings.restore());
$('#automatePraise').on('change', () => settings.restore());
$('#automateObserve').on('change', () => settings.restore());
$('#automateParchment').on('change', () => settings.restore());
$('#automateManuscript').on('change', () => settings.restore());
$('#automateCompendium').on('change', () => settings.restore());
$('#automateBlueprint').on('change', () => settings.restore());


function ak_timer_function() {
  if ($("#game").is(':hidden')) {
    console.log('Skipping turn, not fully loaded');
    return;
  }
  if (!$('#rightTabAutoKittens').is(':hidden')) {
    if (!$('#rightTabChat').is(':hidden') || !$('#rightTabLog').is(':hidden')) {
      $('#rightTabAutoKittens').hide();
    }
  }
  if (settings.mainSwitch) {
    ak_observeTheSky();
    ak_autoPray();
    ak_autoCraft();
    ak_autoHunt();
  }
}

function ak_resource_at_limit(res) {
  return res.maxValue - res.value < (100 - settings.threshold) * (res.maxValue / 100);
}

function ak_resource_limit_spend(res, chunks) {
  return Math.ceil((res.value - settings.threshold * (res.maxValue / 100)) / chunks);
}

function ak_named_resource_at_limit(res) {
  let r = gamePage.resPool.get(res);
  return ak_resource_at_limit(r);
}

function ak_observeTheSky() {
  if (settings.autoObserve) {
    $('#observeBtn').click();
  }
}

function ak_get_max_items_to_craft(arr, from) {
  let frompool = gamePage.resPool.get(from);
  var n = 0;
  for (let a of arr) {
    if (a['name'] == from) {
      n = ak_resource_limit_spend(frompool, a['val']);
    }
  }
  for (let a of arr) {
    let respool = gamePage.resPool.get(a['name']);
    let maxres = Math.floor(respool.value / a['val']);
    if (maxres < n) {
      n = maxres;
    }
  }
  return n;
}

function ak_craft(res, from) {
  let ws = gamePage.workshop;
  let rescraft = ws.getCraft(res);
  let frompool = gamePage.resPool.get(from);
  if (rescraft.unlocked && ws.getCraftAllCount(res) > 0 && ak_resource_at_limit(frompool)) {
    // can craft this. Now let's see how much.
    let x = ws.getCraftPrice(rescraft);
    let n = ak_get_max_items_to_craft(x, from);
    if (n > 0) {
      gamePage.craft(res, n);
    }
  }
}

function ak_autoCraft() {
  if (settings.autoCraft) {
    ak_craft('beam', 'wood');
    ak_craft('wood', 'catnip');
    ak_craft('slab', 'minerals');
    ak_craft('steel', 'coal');
    ak_craft('plate', 'iron');
  }
  let ws = gamePage.workshop;
  if (ws.getCraftAllCount('parchment') > 0 && ws.getCraft('parchment').unlocked && settings.autoParchment) {
    gamePage.craftAll('parchment');
  }
  if (settings.autoManuscript) {
    ak_craft('manuscript', 'culture');
  }
  if (settings.autoCompendium) {
    ak_craft('compedium', 'science');
  }
  if (settings.autoBlueprint) {
    ak_craft('blueprint', 'science');
  }
}

function ak_autoHunt() {
  if (settings.autoHunt) {
    mp = gamePage.resPool.get('manpower');
    if (ak_resource_at_limit(mp)) {
      //gamePage.village.sendHunters(); // this doesn't properly decrease catpower.
      let nHunts = ak_resource_limit_spend(mp, 100);
      gamePage.village.huntMultiple(nHunts);
    }
  }
};

function ak_autoPray() {
  if (settings.autoPraise) {
    if (ak_named_resource_at_limit('faith')) {
      gamePage.religion.praise();
    }
  }
}

function ak_cheats_clicked() {
  $('#rightTabChat').hide();
  $('#rightTabLog').hide();
  $('#rightTabAutoKittens').show();
  $('#autoContainer').css("visibility", "visible");
  $('#logLink').toggleClass('active', false);
  $('#chatLink').toggleClass('active', false);
}

setInterval(ak_timer_function, 1000);
