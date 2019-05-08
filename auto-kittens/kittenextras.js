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
    ak_autoCraft();
    if ($('#automateHunt').prop('checked')) {
      ak_autoHunt();
    }
  }
}

function ak_resource_at_limit(res) {
  return res.maxValue - res.value < (res.maxValue / 100);
}

function ak_named_resource_at_limit(res) {
  let r = gamePage.resPool.get(res);
  return ak_resource_at_limit(r);
}

function ak_observeTheSky() {
  $('#observeBtn').click();
}

function ak_craft(res, from) {
  let ws = gamePage.workshop;
  if (ws.getCraft(res).unlocked && ws.getCraftAllCount(res) > 0) {
    while (ak_named_resource_at_limit(from)) {
      gamePage.craft(res, 1);
    }
  }
}

function ak_autoCraft() {
  if ($('#automateCraft').prop('checked')) {
    ak_craft('beam', 'wood');
    ak_craft('wood', 'catnip');
    ak_craft('slab', 'minerals');
    ak_craft('steel', 'coal');
    ak_craft('plate', 'iron');
  }
  let ws = gamePage.workshop;
  if (ws.getCraftAllCount('parchment') > 0 && ws.getCraft('parchment').unlocked && $('#automateParchment').prop('checked')) {
    gamePage.craftAll('parchment');
  }
  if ($('#automateManuscript').prop('checked')) {
    ak_craft('manuscript', 'culture');
  }
  if ($('#automateCompendium').prop('checked')) {
    ak_craft('compedium', 'science');
  }
  if ($('#automateBlueprint').prop('checked')) {
    ak_craft('blueprint', 'science');
  }
}

function ak_autoHunt() {
  var catpower = gamePage.resPool.get('manpower');
  if (ak_resource_at_limit(catpower)) {
    $('a:contains(\'Send hunters\')')[0].click();
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
