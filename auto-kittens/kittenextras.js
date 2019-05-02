function autokittens_timer_function() {
  if ($("#game").is(':hidden')) {
    console.log('Skipping turn, not fully loaded');
    return;
  }
  if (!$('#rightTabAutoKittens').is(':hidden')) {
    if (!$('#rightTabChat').is(':hidden') || !$('#rightTabLog').is(':hidden')) {
      $('#rightTabAutoKittens').hide();
    }
  }
  if ($('#automateKittens').prop('checked')) {
    autokittens_observeTheSky();
    if ($('#automateCraft').prop('checked')) {
      autokittens_autoCraft();
    }
    if ($('#automateHunt').prop('checked')) {
      autokittens_autoHunt();
    }
  }
}

function autokittens_observeTheSky() {
  $('#observeBtn').click();
}

function autokittens_craft(res, from, count) {
  let r = gamePage.resPool.get(from);
  if (r.maxValue - r.value <= (r.maxValue / 100)) {
    gamePage.craft(res, count);
  }
}

function autokittens_autoCraft() {
  autokittens_craft('beam', 'wood', 1);
  autokittens_autoCatnip();
  autokittens_craft('slab', 'minerals', 1);
  autokittens_craft('steel', 'coal', 1);
  autokittens_craft('plate', 'iron', 1);
}

function autokittens_autoHunt() {
  var catpower = gamePage.resPool.get('manpower');
  if (catpower.value / catpower.maxValue > 0.95) {
    $('a:contains(\'Send hunters\')')[0].click();
    let ws = gamePage.workshop;
    if (ws.getCraft('parchment').unlocked && $('#automateParchment').prop('checked')) { gamePage.craftAll('parchment'); }
    if (ws.getCraft('manuscript').unlocked && $('#automateManuscript').prop('checked')) { gamePage.craftAll('manuscript'); }
    if (ws.getCraft('compedium').unlocked && $('#automateCompendium').prop('checked')) { gamePage.craftAll('compedium'); }
    if (ws.getCraft('blueprint').unlocked && $('#automateBlueprint').prop('checked')) { gamePage.craftAll('blueprint'); }
  }
};

function autokittens_space_for(res, needed) {
  let r = gamePage.resPool.get(res);
  return r.maxValue - r.value > needed;
}

function autokittens_autoCatnip() {
  let catnip = gamePage.resPool.get('catnip');
  if (catnip.perTickUI < 0) { return; }
  if (catnip.value / catnip.maxValue < 0.95) { return; }
  let wanted = catnip.value < 20000 ? 10 : 250;
  if (autokittens_space_for('wood', wanted)) {
    gamePage.craft('wood', wanted);
  }
}

function autokittens_autoPray() {
  var faith = gamePage.resPool.get('faith');

  if (faith.value / faith.maxValue > 0.95) {
    $('a:contains(\'Praise the sun\')')[0].click();
  }
}

function autokittens_cheats_clicked() {
  $('#rightTabChat').hide();
  $('#rightTabLog').hide();
  $('#rightTabAutoKittens').show();
  $('#autoContainer').css("visibility", "visible");
  $('#logLink').toggleClass('active', false);
  $('#chatLink').toggleClass('active', false);
}

setInterval(autokittens_timer_function, 2500);
