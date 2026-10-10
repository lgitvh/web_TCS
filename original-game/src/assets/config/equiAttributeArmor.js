/**
 * Armor属性配置文件
 * @author couy
 */

export const equiAttributeArmor = {
  data(){
    return{
      qualityArmor: [{
        name: 'Worn',
        qualityCoefficient: 0.7,
        probability: '0.25',
        color: '#a1a1a1',
        extraEntryNum: 1,
      }, {
        name: 'Common',
        qualityCoefficient: 1,
        probability: '0.55',
        color: '#fff', extraEntryNum: 2,
      }, {
        name: 'Artifact',
        qualityCoefficient: 1.5,
        probability: '0.15',
        color: '#ff00ff', extraEntryNum: 3,
      }, {
        name: 'Epic',
        qualityCoefficient: 2,
        probability: '0.05',
        color: '#f78918', extraEntryNum: 4,
      }, {
        name: 'Unique',
        qualityCoefficient: 2.2,
        probability: '0',
        color: '#ff0000', extraEntryNum: 5,
      }],
      extraEntryArmor: [{
        'value': '11',
        'showVal': '+11',
        type: 'ATK',
        'name': 'Attack'
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
        type: 'DEFPERCENT',
        'name': 'Defense'
      }, {
        'value': '11%',
        'showVal': '+11%',
        type: 'HPPERCENT',
        'name': 'HP'
      },],
      uniqueCategoryArmor: [{
        name: 'Red Moon Nightcloak',
        des: '',
        iconSrc: './icons/U_Armor06.png',
        entry: [{
          'valCoefficient': 1.2,
          'value': '11',
          'showVal': '+11',
          type: 'DEF',
          'name': 'Defense'
        }, {
          type: 'HP',
          'valCoefficient': 1.5,
          'value': '8',
          'showVal': '8',
          'name': 'HP'
        }, {
          'valCoefficient': 1.2,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        }]
      }, {
        name: 'Purger’s Battle Garb',
        des: 'Legend says no one who saw this black garb survived.',
        iconSrc: './icons/U_Armor05.png',
        entry: [{
          type: 'HP',
          'valCoefficient': 1.6,
          'value': '8',
          'showVal': '8',
          'name': 'HP'
        }, {
          'valCoefficient': 2.4,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        },{
          'valCoefficient': 1.2,
          'value': '11',
          'showVal': '+11',
          type: 'BLOC',
          'name': 'Block'
        },]
      }, {
        name: 'Quarrel Jumpsuit',
        des: '',
        iconSrc: './icons/U_Armor01.png',
        entry: [{
          'valCoefficient': 1.0,
          'value': '11',
          'showVal': '+11',
          type: 'DEF',
          'name': 'Defense'
        }, {
          type: 'HP',
          'valCoefficient': 1.4,
          'value': '8',
          'showVal': '8',
          'name': 'HP'
        }, {
          'valCoefficient': 1.4,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        }]
      }, {
        name: 'Sword Saint Armor',
        des: '',
        iconSrc: './icons/U_Armor02.png',
        entry: [{
          'valCoefficient': 2.1,
          'value': '11',
          'showVal': '+11',
          type: 'DEF',
          'name': 'Defense'
        }, {
          type: 'HP',
          'valCoefficient': 2.6,
          'value': '8',
          'showVal': '8',
          'name': 'HP'
        }]
      }, {
        name: 'Hidden Samurai Armor',
        des: '',
        iconSrc: './icons/U_Armor03.png',
        entry: [{
          'valCoefficient': 1.3,
          'value': '11',
          'showVal': '+11',
          type: 'DEF',
          'name': 'Defense'
        }, {
          type: 'HP',
          'valCoefficient': 1.7,
          'value': '8',
          'showVal': '8',
          'name': 'HP'
        }, {
          'valCoefficient': 0.9,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        }]
      }, {
        name: 'Fensaril Tracker',
        des: '',
        iconSrc: './icons/U_Armor04.png',
        entry: [{
          'valCoefficient': 0.9,
          'value': '11',
          'showVal': '+11',
          type: 'DEF',
          'name': 'Defense'
        }, {
          'valCoefficient': 1.7,
          'value': '11',
          'showVal': '+11',
          type: 'CRITDMG',
          'name': 'Crit damage'
        }, {
          'valCoefficient': 1.7,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        }]
      },{
        name: 'Elder Dragon Berserker Armor',
        des: '',
        iconSrc: './icons/U_Armor07.png',
        entry: [{
          'valCoefficient': 1.5,
          'value': '11',
          'showVal': '+11',
          type: 'DEF',
          'name': 'Defense'
        }, {
          'valCoefficient': 1.2,
          'value': '11',
          'showVal': '+11',
          type: 'BLOC',
          'name': 'Block'
        },{
          type: 'HP',
          'valCoefficient': 1.4,
          'value': '8',
          'showVal': '8',
          'name': 'HP'
        },]
      },],
      categoryArmor: [
        {
          name: 'Purple-Gold Guardian Cuirass',
          des: 'Tanky enough to deal damage',
          iconSrc: './icons/A_A2.png',
          entry: [{
            'valCoefficient': 2,
            'value': '11',
            'showVal': '+11',
            type: 'DEF',
            'name': 'Defense'
          }, {
            type: 'HP',
            'valCoefficient': 0.6,
            'value': '8',
            'showVal': '8',
            'name': 'HP'
          }]
        },
        {
          name: 'Warrior’s Heavy Plate',
          des: 'Heavy plate worn by level-6 warriors',
          iconSrc: './icons/A_A5.png',
          entry: [{
            'valCoefficient': 1.1,
            'value': '11',
            'showVal': '+11',
            type: 'DEF',
            'name': 'Defense'
          }, {
            type: 'HP',
            'valCoefficient': 0.8,
            'value': '8',
            'showVal': '8',
            'name': 'HP'
          }]
        },
        {
          name: 'Celestial Light Armor',
          des: 'Light armor that trades defense for agility, boosting offense',
          iconSrc: './icons/A_A7.png',
          entry: [{
            'valCoefficient': 0.7,
            'value': '11',
            'showVal': '+11',
            type: 'DEF',
            'name': 'Defense'
          }, {
            type: 'HP',
            'valCoefficient': 0.5,
            'value': '8',
            'showVal': '8',
            'name': 'HP'
          }, {
            'valCoefficient': 0.5,
            'value': '11',
            'showVal': '+11',
            type: 'ATK',
            'name': 'Attack'
          }]
        },
        {
          name: 'Crimson Willow Blood Armor',
          des: 'Seems to fill its wearer with life force',
          iconSrc: './icons/A_A3.png',
          entry: [{
            'valCoefficient': 0.9,
            'value': '11',
            'showVal': '+11',
            type: 'DEF',
            'name': 'Defense'
          }, {
            type: 'HP',
            'valCoefficient': 1.2,
            'value': '8',
            'showVal': '8',
            'name': 'HP'
          }]
        },
        {
          name: 'Happy Fluffy Onesie',
          des: 'Happy Fluffy',
          iconSrc: './icons/A_A9.png',
          entry: [{
            'valCoefficient': 0.8,
            'value': '11',
            'showVal': '+11',
            type: 'DEF',
            'name': 'Defense'
          }, {
            type: 'HP',
            'valCoefficient': 0.8,
            'value': '8',
            'showVal': '8',
            'name': 'HP'
          }, {
            'valCoefficient': 0.4,
            'value': '11',
            'showVal': '+11',
            type: 'ATK',
            'name': 'Attack'
          }]
        }
      ],
    }
  },
  methods: {
  }
};