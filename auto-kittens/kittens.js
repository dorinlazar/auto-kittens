function add_cheats(settings) {
  if (document.getElementById('rightTabAutoKittens')) {
    return;
  }

  const KRESOURCES = ['wood', 'beam', 'slab', 'steel', 'plate', 'alloy', 'kerosene', 'thorium', 'eludium'];
  const KFOOD = ['field', 'pasture', 'aqueduct'];
  const KHOUSING = ['hut', 'logHouse', 'mansion'];
  const KSCIENCE = ['library', 'academy', 'observatory', 'biolab'];
  const KSTORAGE = ['barn', 'warehouse', 'harbor'];
  const KINDUSTRY = ['mine', 'quarry', 'lumberMill', 'oilWell', 'accelerator', 'smelter', 'calciner', 'factory', 'workshop'];
  const KENERGY = ['steamworks', 'magneto', 'reactor'];
  const KFAITH = ['amphitheatre', 'chapel', 'temple', 'unicornPasture', 'ziggurat'];
  const KECONOMY = ['tradepost', 'mint', 'brewery'];

  const KBUILDINGS = KFOOD.concat(KHOUSING, KSCIENCE, KSTORAGE, KINDUSTRY, KENERGY, KFAITH, KECONOMY);

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
  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function resourceSelectors() {
    let res = ' Resources:<br>';
    for (let r of KRESOURCES) {
      let cap = capitalize(r);
      let str = '<input type="checkbox" name="craft' + cap + '" id="craft' + cap +'" checked/><label for="craft' + cap +'">Craft ' + r + '</label><br>';
      res += str;
    }
    return res;
  }
  function buildingSelectors() {
    function gbs(buildingType, dataArr) {
      let result = buildingType + ':<br>';
      for (let r of dataArr) {
        let cap = capitalize(r);
        let str = '<input type="checkbox" name="build' + cap + '" id="build' + cap +'"/><label for="build' + cap +'">Build ' + r + '</label><br>';
        result += str;
      }
      return result;
    }
    let res = gbs('Food', KFOOD) + gbs('Housing', KHOUSING) + gbs('Science', KSCIENCE) + gbs('Storage', KSTORAGE) +
              gbs('Industry', KINDUSTRY) + gbs('Energy', KENERGY) + gbs('Faith', KFAITH) + gbs('Economy', KECONOMY);
    return res;
  }
  cheatsTab.innerHTML = '<div id="autoContainer" style="overflow-y: scroll; max-height: 600px;">' +
    '<input type="checkbox" name="automateKittens" id="automateKittens" checked/><label for="automateKittens">Automate Kittens (when disabled overrides all below)</label><br>' +
    '<input type="number" name="autoThreshold" id="autoThreshold" min="0" max="99" value="99"/><label for="autoThreshold">Threshold</label><br>' +
    '<input type="checkbox" name="automateHunt" id="automateHunt" checked/><label for="automateHunt">Automate hunts (on max catpower)</label><br>' +
    '<input type="checkbox" name="automatePraise" id="automatePraise" checked/><label for="automatePraise">Automate praise (on max faith)</label><br>' +
    '<input type="checkbox" name="automateObserve" id="automateObserve" checked/><label for="automateObserve">Auto observe the sky</label><br> Science:<br>' +
    '<input type="checkbox" name="automateParchment" id="automateParchment" checked/><label for="automateParchment">Auto make parchments (when furs available)</label><br>' +
    '<input type="checkbox" name="automateManuscript" id="automateManuscript" checked/><label for="automateManuscript">Auto make manuscripts (on max culture)</label><br>' +
    '<input type="checkbox" name="automateCompendium" id="automateCompendium"/><label for="automateCompendium">Auto make compendiums (on max science)</label><br>' +
    '<input type="checkbox" name="automateBlueprint" id="automateBlueprint"/><label for="automateBlueprint">Auto make blueprints (on max science)</label><br>' +
    resourceSelectors() +
    buildingSelectors() +
  '</div>';
  document.getElementById('rightColumn').appendChild(cheatsTab);
  console.log('Received settings: ', settings);
  for (let key in settings) {
    switch (key) {
      case 'threshold': document.getElementById('autoThreshold').value = settings[key]; break;
      case 'mainSwitch': document.getElementById('automateKittens').checked = settings[key]; break;
      case 'autoHunt': document.getElementById('automateHunt').checked = settings[key]; break;
      case 'autoPraise': document.getElementById('automatePraise').checked = settings[key]; break;
      case 'autoObserve': document.getElementById('automateObserve').checked = settings[key]; break;
      case 'autoParchment': document.getElementById('automateParchment').checked = settings[key]; break;
      case 'autoManuscript': document.getElementById('automateManuscript').checked = settings[key]; break;
      case 'autoCompendium': document.getElementById('automateCompendium').checked = settings[key]; break;
      case 'autoBlueprint': document.getElementById('automateBlueprint').checked = settings[key]; break;
      default:
        let tag = document.getElementById(key);
        if (tag) {
          tag.checked = settings[key];
        }
    }
  }
  function readSettings(ev) {
    let x = {
      threshold: parseInt(document.getElementById('autoThreshold').value, 10),
      mainSwitch: document.getElementById('automateKittens').checked,
      autoHunt: document.getElementById('automateHunt').checked,
      autoPraise: document.getElementById('automatePraise').checked,
      autoObserve: document.getElementById('automateObserve').checked,
      autoParchment: document.getElementById('automateParchment').checked,
      autoManuscript: document.getElementById('automateManuscript').checked,
      autoCompendium: document.getElementById('automateCompendium').checked,
      autoBlueprint: document.getElementById('automateBlueprint').checked
    };
    for (let r of KRESOURCES) {
      let name = 'craft' + capitalize(r);
      x[name] = Boolean(document.getElementById(name).checked);
    }
    for (let r of KBUILDINGS) {
      let name = 'build' + capitalize(r);
      x[name] = Boolean(document.getElementById(name).checked);
    }
    chrome.extension.sendMessage({ type: "settings", settings: x });
  }
  for (let name of ['autoThreshold', 'automateKittens', 'automateHunt', 'automatePraise', 'automateObserve',
                    'automateParchment', 'automateManuscript', 'automateCompendium', 'automateBlueprint']) {
    document.getElementById(name).onchange = readSettings;
  }
  for (let r of KRESOURCES) {
    let name = 'craft' + capitalize(r);
    document.getElementById(name).onchange = readSettings;
  }
  for (let r of KBUILDINGS) {
    let name = 'build' + capitalize(r);
    document.getElementById(name).onchange = readSettings;
  }
}

chrome.extension.sendMessage({ type: "load" }, function (response) {
  add_cheats(response);
});
