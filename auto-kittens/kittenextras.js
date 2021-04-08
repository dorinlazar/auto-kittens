const RESOURCES = [
  ['beam', 'wood'],
  ['wood', 'catnip'],
  ['slab', 'minerals'],
  ['steel', 'coal'],
  ['plate', 'iron'],
  ['alloy', 'titanium'],
  ['kerosene', 'oil'],
  ['thorium', 'uranium'],
  ['eludium', 'unobtainium']
];

ak_buildTab = null;

const BUILDINGS = ['hut', 'logHouse', 'aqueduct', 'field', 'pasture', 'workshop', 'lumberMill', 'mine', 'smelter', 'quarry', 'library', 'academy', 'observatory', 'barn', 'warehouse', 'amphitheatre', 'temple', 'tradepost'];

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function foreachresource(f) { RESOURCES.forEach(el => f(el[0], 'craft' + capitalize(el[0]), el[1])); }
function foreachbuilding(f) { BUILDINGS.forEach(el => f(el, 'build' + capitalize(el))); }

class Settings {
  constructor() {
    this.restore();
  }
  restore() {
    this.threshold = parseInt($('#autoThreshold').prop('value'), 10);
    this.mainSwitch = $('#automateKittens').prop('checked');
    this.autoHunt = $('#automateHunt').prop('checked');
    this.autoPraise = $('#automatePraise').prop('checked');
    this.autoObserve = $('#automateObserve').prop('checked');
    this.autoParchment = $('#automateParchment').prop('checked');
    this.autoManuscript = $('#automateManuscript').prop('checked');
    this.autoCompendium = $('#automateCompendium').prop('checked');
    this.autoBlueprint = $('#automateBlueprint').prop('checked');
    if ($('#automateCraft').prop('checked')) {
      foreachresource((name, elname) => { this[elname] = true });
    } else {
      foreachresource((name, elname) => { this[elname] = Boolean($('#' + elname).prop('checked')) });
    }
    foreachbuilding((bname, elname) => { this[elname] = Boolean($('#' + elname).prop('checked')) })
  }
}
var settings = new Settings();

['#autoThreshold', '#automateKittens', '#automateHunt',
  '#automatePraise', '#automateObserve', '#automateParchment',
  '#automateManuscript', '#automateCompendium', '#automateBlueprint'
].forEach((x) => { $(x).on('change', () => settings.restore()) });
foreachresource((name, elname) => { $('#' + elname).on('change', () => settings.restore()) });
foreachbuilding((name, elname) => { $('#' + elname).on('change', () => settings.restore()) });


function ak_timer_function() {
  if ($("#game").is(':hidden')) {
    console.log('Skipping turn, not fully loaded');
    return;
  }
  if (ak_buildTab === null) {
    for (var tab in game.tabs) {
      if (game.tabs[tab].tabId === 'Bonfire') {
        ak_buildTab = game.tabs[tab];
        break;
      }
    }
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

function ak_log_result(res, btn) {
  if (res) {
    console.log('Autobuilt', btn.model.metadata.name);
    btn.update(); // NOT ENOUGH!
  }
}

function ak_try_build(name, elname) {
  if (settings[elname]) {
    let btns = ak_buildTab.children;
    if (btns.length==0) { // support for old, unsupported version.
      btns = ak_buildTab.buttons;
    }
    if (gamePage.bld.getBuildingExt(name).meta.unlocked) {
      for (j = 2; j < btns.length; j++) {
        let model = btns[j].model;
        if (model.metadata.name == name) {
          btns[j].controller.buyItem(model, {}, res => ak_log_result(res, btns[j]));
          return;
        }
      }
    }
  }
}

function ak_try_craft(name, elname, from) {
  if (settings[elname]) {
    ak_craft(name, from)
  }
}

function ak_autoCraft() {
  foreachbuilding(ak_try_build);
  foreachresource(ak_try_craft);

  if (settings.craftBeam) ak_craft('beam', 'wood');
  if (settings.craftWood) ak_craft('wood', 'catnip');
  if (settings.craftSlab) ak_craft('slab', 'minerals');
  if (settings.craftSteel) ak_craft('steel', 'coal');
  if (settings.craftPlate) ak_craft('plate', 'iron');
  if (settings.craftAlloy) ak_craft('alloy', 'titanium');
  if (settings.craftKerosene) ak_craft('kerosene', 'oil');
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
      // let nHunts = ak_resource_limit_spend(mp, 100);
      // gamePage.village.huntMultiple(nHunts);
      gamePage.village.huntAll();
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
