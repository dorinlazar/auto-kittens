
function add_cheats() {
  if (document.getElementById('rightTabAutoKittens')) {
    return;
  }

  let nbsp = document.createElement('div');
  nbsp.innerHTML = '&nbsp;|&nbsp;';
  let link = document.createElement('div');
  link.innerHTML = '<a href="#" onclick="autokittens_cheats_clicked()"> Cheats</a>';
  let elem = document.getElementsByClassName('right-tab-header')[0];
  elem.appendChild(nbsp.firstChild);
  elem.appendChild(link.firstChild);

  let el = document.createElement('script');
  el.setAttribute('src', chrome.runtime.getURL('/kittenextras.js'));
  el.setAttribute('type', 'text/javascript');
  document.body.appendChild(el);

  let cheatsTab = document.createElement('div');
  cheatsTab.classList.add('right-tab');
  cheatsTab.id = 'rightTabAutoKittens'
  cheatsTab.setAttribute('style', 'display:none;');
  cheatsTab.innerHTML = '<div id="autoContainer">' +
    '<input type="checkbox" name="automateKittens" id="automateKittens" checked/><label for="automateKittens">Automate Kittens (overrides all below)</label><br>' +
    '<input type="checkbox" name="automateCraft" id="automateCraft" checked/><label for="automateCraft">Automate crafting</label><br>' +
    '<input type="checkbox" name="automateHunt" id="automateHunt" checked/><label for="automateHunt">Automate hunt</label><br>' +
    '<input type="checkbox" name="automateParchment" id="automateParchment" checked/><label for="automateParchment">Auto make parchments</label><br>' +
    '<input type="checkbox" name="automateManuscript" id="automateManuscript" checked/><label for="automateManuscript">Auto make manuscripts</label><br>' +
    '<input type="checkbox" name="automateCompendium" id="automateCompendium"/><label for="automateCompendium">Auto make compendiums</label><br>' +
    '<input type="checkbox" name="automateBlueprint" id="automateBlueprint"/><label for="automateBlueprint">Auto make blueprints</label><br>' +
    '</div>';
  document.getElementById('rightColumn').appendChild(cheatsTab);
}

add_cheats();
