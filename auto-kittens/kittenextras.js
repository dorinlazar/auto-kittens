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
  if ($('#automateKittens').prop('checked')) {
    ak_observeTheSky();
    ak_autoPray();
    if ($('#automateCraft').prop('checked')) {
      ak_autoCraft();
    }
    if ($('#automateHunt').prop('checked')) {
      ak_autoHunt();
    }
  }
}

function ak_resource_at_limit(res) {
  return res.maxValue - res.value < (res.maxValue / 100);
}

function ak_observeTheSky() {
  $('#observeBtn').click();
}

function ak_craft(res, from, count) {
  if (gamePage.workshop.getCraft(res).unlocked) {
    let maxops = 100;
    while (maxops > 0) {
      maxops--;
      let r = gamePage.resPool.get(from);
      if (ak_resource_at_limit(r)) {
        gamePage.craft(res, count);
      } else {
        break;
      }
    }
  }
}

function ak_autoCraft() {
  ak_craft('beam', 'wood', 1);
  ak_craft('wood', 'catnip', 1);
  ak_craft('slab', 'minerals', 1);
  ak_craft('steel', 'coal', 1);
  ak_craft('plate', 'iron', 1);
}

function ak_autoHunt() {
  var catpower = gamePage.resPool.get('manpower');
  if (ak_resource_at_limit(catpower)) {
    $('a:contains(\'Send hunters\')')[0].click();
    let ws = gamePage.workshop;
    if (ws.getCraft('parchment').unlocked && $('#automateParchment').prop('checked')) { gamePage.craftAll('parchment'); }
    if (ws.getCraft('manuscript').unlocked && $('#automateManuscript').prop('checked')) { gamePage.craftAll('manuscript'); }
    if (ws.getCraft('compedium').unlocked && $('#automateCompendium').prop('checked')) { gamePage.craftAll('compedium'); }
    if (ws.getCraft('blueprint').unlocked && $('#automateBlueprint').prop('checked')) { gamePage.craftAll('blueprint'); }
  }
};

function ak_autoPray() {
  var faith = gamePage.resPool.get('faith');

  if (ak_resource_at_limit(faith)) {
    $('a:contains(\'Praise the sun\')')[0].click();
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
