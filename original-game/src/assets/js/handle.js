function deepCopy(data) {
  return JSON.parse(JSON.stringify(data))
}

/**
 * 根据Enhance等级计算Enhance后属性
 * @param {obj} entry Equip基础属性
 * @param {number} lv  EquipEnhance等级
 */
function CalculateStrAttr(entry, lv) {
  var a = 1
  // OKEnhance系数
  a = (1.055 ** lv ** 1.1)
  entry.map((item) => {
    let value
    switch (item.type) {
      case 'ATK':
        value = Math.round(a * item.value)
        item.value = value
        item.showValue = '+' + value
        break;
      case 'DEF':
        value = Math.round(a * item.value)
        item.value = value
        item.showValue = '+' + value
        break;
      case 'HP':
        value = Math.round(a * item.value)
        item.value = value
        item.showValue = '+' + value
        break;
      case 'ATKPERCENT':
        value = Math.round(a * item.value)
        item.value = value
        item.showValue = '+' + value + '%'
        break;
      case 'DEFPERCENT':
        value = Math.round(a * item.value)
        item.value = value
        item.showValue = '+' + value + '%'
        break;
      case 'HPPERCENT':
        value = Math.round(a * item.value)
        item.value = value
        item.showValue = '+' + value + '%'
        break;
      case 'CRIT':
        value = Math.round(a * item.value)
        item.value = value
        item.showValue = '+' + value + '%'
        break;
      case 'CRITDMG':
        value = Math.round(a * item.value)
        item.value = value
        item.showValue = '+' + value + '%'
        break;
      case 'BLOC':
          value = Math.round(a * item.value)
          item.value = value
          item.showValue = '+' + value
          break;
      default:
        break;
    }

  })
  return entry
}

/**
 * 随机化生成副本
 * @param {number} lv  Dungeon level
 * @param {number} difficulty(1:Normal 2:Hard 3:Extreme) 副本难度
 */
function createRandomDungeons(lv, difficulty) {
  lv = lv||1,difficulty = difficulty||1;
  var df = difficulty==1?1:difficulty==2?1.15:1.4
  var dungeonsConfig = {
    id:lv+''+difficulty,
    battleTime: 2000,
    name: 'Lv'+lv+'_'+(difficulty==1?'Normal':difficulty==2?'Hard':'Extreme'),
    eventNum: '5',
    lv: lv,
    needDPS: parseInt(lv*lv**1.3*2*difficulty),
    difficulty:difficulty,
    difficultyName:difficulty==1?'Normal':difficulty==2?'Hard':'Extreme',
    top:Math.random()*70+15+'%',
    left:Math.random()*70+10+'%',
    eventType: [{
      name: 'monster',
      type: 'monster',
      eventType: 'battle',
      attribute: {
        HP: parseInt(lv*lv**1.1*(Math.random()*5+16)*df),
        ATK: parseInt(lv*lv**1.1*(Math.random()*1+2)*df),
      },
      trophy: {
        gold: parseInt(lv**1.16*(Math.random()*5+11)*df),
        equip: [
          0.2*df, 0.08*df, 0.03*df, 0*df
        ],
      }
    }, {
      name: 'monster',
      type: 'monster',
      eventType: 'battle',
      attribute: {
        HP: parseInt(lv*lv**1.1*(Math.random()*5+16)*df),
        ATK: parseInt(lv*lv**1.1*(Math.random()*1+2)*df),
      },
      trophy: {
        gold: parseInt(lv**1.16*(Math.random()*5+11)*df),
        equip: [
          0.2*df, 0.08*df, 0.03*df, 0*df
        ],
      }
    }, {
      name: 'monster',
      type: 'monster',
      eventType: 'battle',
      attribute: {
        HP: parseInt(lv*lv**1.1*(Math.random()*5+16)*df),
        ATK: parseInt(lv*lv**1.1*(Math.random()*1+2)*df),
      },
      trophy: {
        gold: parseInt(lv**1.16*(Math.random()*5+11)*df),
        equip: [
          0.2*df, 0.08*df, 0.03*df, 0*df
        ],
      }
    }, {
      name: 'monster',
      type: 'monster',
      eventType: 'battle',
      attribute: {
        HP: parseInt(lv*lv**1.1*(Math.random()*5+16)*df),
        ATK: parseInt(lv*lv**1.1*(Math.random()*1+2)*df),
      },
      trophy: {
        gold: parseInt(lv**1.16*(Math.random()*5+11)*df),
        equip: [
          0.2*df, 0.08*df, 0.03*df, 0*df
        ],
      }
    }, {
      name: 'boss',
      type: 'boss',
      eventType: 'battle',
      attribute: {
        HP: parseInt(lv*lv**1.1*(Math.random()*5+30)*df),
        ATK: parseInt(lv*lv**1.1*(Math.random()*1+3)*df),
      },
      trophy: {
        gold: parseInt(lv**1.16*(Math.random()*10+28)*df),
        equip: [
          0.25-0.05*df, 0.55-0.15*df, 0.15+0.15*df, 0.05+0.05*df
        ],
      }
    }, ]
  }
  return dungeonsConfig
}


/**
 *  返回一条随机属性
 * @param {number} lv  EquipEnhance等级
 */
function createRandomEntry(lv, qualityCoefficient) {

  let extraEntry = [{
      'value': '11',
      'showVal': '+11',
      type: 'ATK',
      'name': 'Attack'
    }, {
      type: 'CRIT',
      'value': '8',
      'showVal': '+8%',
      'name': 'Crit rate'
    }, {
      type: 'CRITDMG',
      'value': '20',
      'showVal': '+20%',
      'name': 'Crit damage'
    }, {
      type: 'HP',
      'value': '20',
      'showVal': '+20',
      'name': 'HP'
    }, {
      type: 'DEF',
      'value': '8',
      'showVal': '+8%',
      'name': 'Defense'
    }, {
      'value': '11%',
      'showVal': '+11%',
      type: 'ATKPERCENT',
      'name': 'Attack'
    }, {
      'value': '11%',
      'showVal': '+11%',
      type: 'DEFPERCENT',
      'name': 'Defense'
    }, {
      'value': '11%',
      'showVal': '+11%',
      type: 'HPPERCENT',
      'name': 'HP'
    },
    {
      'value': '11%',
      'showVal': '+11%',
      type: 'BLOCPERCENT',
      'name': 'Block'
    },
    {
      'value': '11%',
      'showVal': '+11%',
      type: 'BLOC',
      'name': 'Block'
    },
    // {
    //   'value': '11%',
    //   'showVal': '+11%',
    //   type: 'EVA',
    //   'name': '闪避'
    // },
  ]

  let randomCoefficient = Math.random() ,EntryLevel = Math.floor(randomCoefficient*100)+'%'
  let entry = {}
  let index = Math.floor((Math.random()  * extraEntry.length));
  entry = extraEntry[index]
  entry.EntryLevel = EntryLevel
  switch (entry.type) {
    case 'ATK':
      var random = parseInt(lv * 1 + (randomCoefficient  * lv / 2 + 1))
      random = parseInt(random * qualityCoefficient)
      random = random || 1
      entry.value = random
      entry.showVal = '+' + random
      break;
    case 'DEF':
      var random = parseInt((lv * 0.4 + (randomCoefficient  * lv / 2 + 1)))
      random = parseInt(random * qualityCoefficient)
      random = random || 1
      entry.value = random
      entry.showVal = '+' + random
      break;
    case 'HP':
      var random = parseInt((lv * 0.2 * 15 + (randomCoefficient  * lv / 2 + 1)))
      random = parseInt(random * qualityCoefficient)
      random = random || 1
      entry.value = random
      entry.showVal = '+' + random
      break;
    case 'ATKPERCENT':
      var random = parseFloat(lv * 0.11 + (randomCoefficient  * lv / 10 + 4)).toFixed(2)
      random = parseFloat(random * qualityCoefficient).toFixed(2)
      random = random || 1
      entry.value = random
      entry.showVal = '+' + random + '%'
      break;
    case 'DEFPERCENT':
      var random = parseFloat(lv * 0.1 + (randomCoefficient  * lv / 10 + 4)).toFixed(2)
      random = parseFloat(random * qualityCoefficient).toFixed(2)
      random = random || 1
      entry.value = random
      entry.showVal = '+' + random + '%'
      break;
    case 'HPPERCENT':
      var random = parseFloat(lv * 0.13 + (randomCoefficient  * lv / 10 + 4)).toFixed(2)
      random = parseFloat(random * qualityCoefficient).toFixed(2)
      random = random || 1
      entry.value = random
      entry.showVal = '+' + random + '%'
      break;
    case 'BLOCPERCENT':
        var random = parseFloat(lv * 0.1 + (randomCoefficient  * lv / 10 + 4)).toFixed(2)
        random = parseFloat(random * qualityCoefficient).toFixed(2)
        random = random || 1
        entry.value = random
        entry.showVal = '+' + random + '%'
        break;
    case 'CRIT':
      var random = parseInt(randomCoefficient  * 5 + 5)
      random = parseInt(random * qualityCoefficient)
      entry.value = random
      entry.showVal = '+' + random + '%'
      break;
    case 'CRITDMG':
      var random = parseInt(randomCoefficient  * 12 + 20)
      random = parseInt(random * qualityCoefficient)
      entry.value = random
      entry.showVal = '+' + random + '%'
      break;
    case 'BLOC':
      var random = parseInt((lv * 0.6 + (randomCoefficient  * lv / 2 + 1)))
      random = parseInt(random * qualityCoefficient)
      random = random || 1
      entry.value = random
      entry.showVal = '+' + random
      break;
      // case 'EVA':
      //     var random = parseInt(randomCoefficient  * 12 + 3)
      //     random = parseInt(random * qualityCoefficient)
      //     entry.value = random
      //     entry.showVal = '+' + random + '%'
      //     break;
    default:
      break;
  }
  return entry
}

export default {
  deepCopy,
  CalculateStrAttr,
  createRandomEntry,
  createRandomDungeons
}