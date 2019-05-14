
function add_cheats(settings) {
  if (document.getElementById('rightTabAutoKittens')) {
    return;
  }

  let nbsp = document.createElement('div');
  nbsp.innerHTML = '&nbsp;|&nbsp;';
  let link = document.createElement('div');
  link.innerHTML = '<a href="#" onclick="ak_cheats_clicked()">Cheats</a>';
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
    '<input type="checkbox" name="automateKittens" id="automateKittens" checked/><label for="automateKittens">Automate Kittens (when disabled overrides all below)</label><br>' +
    '<input type="checkbox" name="automateCraft" id="automateCraft" checked/><label for="automateCraft">Automate crafting (basics)</label><br>' +
    '<input type="checkbox" name="automateHunt" id="automateHunt" checked/><label for="automateHunt">Automate hunts (on max catpower)</label><br>' +
    '<input type="checkbox" name="automatePraise" id="automatePraise" checked/><label for="automatePraise">Automate praise (on max faith)</label><br>' +
    '<input type="checkbox" name="automateObserve" id="automateObserve" checked/><label for="automateObserve">Auto observe the sky</label><br>' +
    '<input type="checkbox" name="automateParchment" id="automateParchment" checked/><label for="automateParchment">Auto make parchments (when furs available)</label><br>' +
    '<input type="checkbox" name="automateManuscript" id="automateManuscript" checked/><label for="automateManuscript">Auto make manuscripts (on max culture)</label><br>' +
    '<input type="checkbox" name="automateCompendium" id="automateCompendium"/><label for="automateCompendium">Auto make compendiums (on max science)</label><br>' +
    '<input type="checkbox" name="automateBlueprint" id="automateBlueprint"/><label for="automateBlueprint">Auto make blueprints (on max science)</label><br>' +
    '<input type="number" name="autoThreshold" id="autoThreshold" min="0" max="99" value="99"/><label for="autoThreshold">Threshold</label><br>'
  '</div>';
  document.getElementById('rightColumn').appendChild(cheatsTab);
  console.log('Received settings: ', settings);
  for (let key in settings) {
    switch (key) {
      case 'threshold': document.getElementById('autoThreshold').value = settings[key]; break;
      case 'mainSwitch': document.getElementById('automateKittens').checked = settings[key]; break;
      case 'autoCraft': document.getElementById('automateCraft').checked = settings[key]; break;
      case 'autoHunt': document.getElementById('automateHunt').checked = settings[key]; break;
      case 'autoPraise': document.getElementById('automatePraise').checked = settings[key]; break;
      case 'autoObserve': document.getElementById('automateObserve').checked = settings[key]; break;
      case 'autoParchment': document.getElementById('automateParchment').checked = settings[key]; break;
      case 'autoManuscript': document.getElementById('automateManuscript').checked = settings[key]; break;
      case 'autoCompendium': document.getElementById('automateCompendium').checked = settings[key]; break;
      case 'autoBlueprint': document.getElementById('automateBlueprint').checked = settings[key]; break;
    }
  }
  function readSettings(ev) {
    let x = {
      threshold: parseInt(document.getElementById('autoThreshold').value, 10),
      mainSwitch: document.getElementById('automateKittens').checked,
      autoCraft: document.getElementById('automateCraft').checked,
      autoHunt: document.getElementById('automateHunt').checked,
      autoPraise: document.getElementById('automatePraise').checked,
      autoObserve: document.getElementById('automateObserve').checked,
      autoParchment: document.getElementById('automateParchment').checked,
      autoManuscript: document.getElementById('automateManuscript').checked,
      autoCompendium: document.getElementById('automateCompendium').checked,
      autoBlueprint: document.getElementById('automateBlueprint').checked
    };
    chrome.extension.sendMessage({ type: "settings", settings: x });
  }
  for (let name of ['autoThreshold', 'automateKittens', 'automateCraft', 'automateHunt',
    'automatePraise', 'automateObserve', 'automateParchment', 'automateManuscript', 'automateCompendium', 'automateBlueprint'])
    document.getElementById(name).onchange = readSettings;
}

chrome.extension.sendMessage({ type: "load" }, function (response) {
  add_cheats(response);
});
