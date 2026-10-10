/**
 * Weapon属性配置文件
 * @author couy
 */

export const equiAttributeWeapon = {
  data(){
    return {
      quality: [{
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
      uniqueCategory: [{
        name: 'Genesis Desperado Sword',
        des: 'Only the chosen hero can awaken its true power.',
        iconSrc: './icons/U_Sword01.png',
        entry: [{
          'valCoefficient': 1.8,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        }, {
          type: 'CRIT',
          'valCoefficient': 1.5,
          'value': '8',
          'showVal': '+8%',
          'name': 'Crit rate'
        }, {
          'valCoefficient': 1.3,
          'value': '11',
          'showVal': '+11',
          type: 'CRITDMG',
          'name': 'Crit damage'
        }]
      }, {
        name: 'Nameless Sword',
        des: 'No one knows where it came from.',
        iconSrc: './icons/U_Sword02.png',
        entry: [{
          'valCoefficient': 2.7,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        }, {
          type: 'CRIT',
          'valCoefficient': 2.5,
          'value': '8',
          'showVal': '+8%',
          'name': 'Crit rate'
        }]
      }, {
        name: 'Blade of Death',
        des: 'All things endure through balance; break the source and all is lost.',
        iconSrc: './icons/U_Sword04.png',
        entry: [{
          'valCoefficient': 1.8,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        }, {
          type: 'CRIT',
          'valCoefficient': 1.5,
          'value': '8',
          'showVal': '+8%',
          'name': 'Crit rate'
        }, {
          'valCoefficient': 1.3,
          'value': '11',
          'showVal': '+11',
          type: 'CRITDMG',
          'name': 'Crit damage'
        }]
      }, {
        name: 'Frost Dragon Edge',
        des: 'Proud as snow, cold of heart; every thought turns to frost.',
        iconSrc: './icons/U_Sword05.png',
        entry: [{
          'valCoefficient': 1.8,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        }, {
          type: 'CRIT',
          'valCoefficient': 1.5,
          'value': '8',
          'showVal': '+8%',
          'name': 'Crit rate'
        }, {
          'valCoefficient': 1.3,
          'value': '11',
          'showVal': '+11',
          type: 'CRITDMG',
          'name': 'Crit damage'
        }]
      }, {
        name: 'Agares’ Crimson Greatsword',
        des: 'Brave and mighty, unbending to the end. Though the body dies, the spirit lives on as a hero among ghosts.',
        iconSrc: './icons/U_Sword03.png',
        entry: [{
          'valCoefficient': 1.8,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        }, {
          type: 'CRIT',
          'valCoefficient': 1.5,
          'value': '8',
          'showVal': '+8%',
          'name': 'Crit rate'
        }, {
          'valCoefficient': 1.3,
          'value': '11',
          'showVal': '+11',
          type: 'CRITDMG',
          'name': 'Crit damage'
        }]
      }, {
        name: 'Blade of Naglin',
        des: 'A blade forged from the claw of the divine dragon Naglin',
        iconSrc: './icons/U_Sword06.png',
        entry: [{
          'valCoefficient': 2.8,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        }, {
          'valCoefficient': 2.2,
          'value': '11',
          'showVal': '+11',
          type: 'CRITDMG',
          'name': 'Crit damage'
        }]
      }, {
        name: 'Sword of the Master Adventurer',
        des: 'Sword of the Master Adventurer',
        iconSrc: './icons/U_Sword07.png',
        entry: [{
          'valCoefficient': 2.4,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        }, {
          type: 'HP',
          'valCoefficient': 1.8,
          'value': '8',
          'showVal': '8',
          'name': 'HP'
        }]
      }, {
        name: 'Six-Winged Seraph Blade',
        des: 'Six-Winged Seraph Blade',
        iconSrc: './icons/U_Sword08.png',
        entry: [{
          'valCoefficient': 2.6,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        }, {
          type: 'DEF',
          'valCoefficient': 1.8,
          'value': '8',
          'showVal': '8',
          'name': 'Defense'
        }]
      }, {
        name: 'Juzumaru Tsunetsugu',
        des: 'Details unknown; legend says it belonged to the monk Nichiren',
        iconSrc: './icons/U_Sword09.png',
        entry: [{
          'valCoefficient': 3.9,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        }]
      }, {
        name: 'Esulebus Saber',
        des: '',
        iconSrc: './icons/U_Sword10.png',
        entry: [{
          'valCoefficient': 1.9,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        }, {
          type: 'DEF',
          'valCoefficient': 1.2,
          'value': '8',
          'showVal': '8',
          'name': 'Defense'
        }, {
          type: 'BLOC',
          'valCoefficient': 1.2,
          'value': '8',
          'showVal': '8',
          'name': 'Block'
        }]
      },],
      category: [{
        name: 'Hellrock Katana',
        des: 'A katana forged from hellrock, said to unleash its wielder’s hidden potential',
        iconSrc: './icons/W_Sword016.png',
        entry: [{
          'valCoefficient': 1.2,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        }, {
          type: 'CRIT',
          'valCoefficient': 1.3,
          'value': '8',
          'showVal': '+8%',
          'name': 'Crit rate'
        }]
      },
      {
        name: 'Warrior’s Longsword',
        des: 'A longsword used by level-6 warriors',
        iconSrc: './icons/W_Sword007.png',
        entry: [{
          'valCoefficient': 1.2,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        }, {
          type: 'DEF',
          'valCoefficient': 0.5,
          'value': '8',
          'showVal': '8',
          'name': 'Defense'
        }]
      },
      {
        name: 'Crimson Willow Blade',
        des: 'Seems to fill its wearer with life force',
        iconSrc: './icons/W_Sword019.png',
        entry: [{
          'valCoefficient': 1.3,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        }, {
          type: 'HP',
          'valCoefficient': 1.1,
          'value': '8',
          'showVal': '8',
          'name': 'HP'
        }]
      },
      {
        name: 'Plain Longsword',
        des: 'A plain, unadorned longsword. All it has is raw attack',
        iconSrc: './icons/W_Sword001.png',
        entry: [{
          'valCoefficient': 1.7,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        }]
      }
        ,
      {
        name: 'Violet Flame Wave Sword',
        des: 'The legendary berserker’s favorite sword.',
        iconSrc: './icons/W_Sword021.png',
        entry: [{
          'valCoefficient': 1.7,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        }]
      },
      {
        name: 'Fluffy’s Claw',
        des: 'This? This counts as a weapon?',
        iconSrc: './icons/W_Fist003.png',
        entry: [{
          'valCoefficient': 2,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        }, {
          type: 'CRIT',
          'valCoefficient': 0.7,
          'value': '8',
          'showVal': '+8%',
          'name': 'Crit rate'
        }]
      },
      {
        name: 'Ice Crystal Blade',
        des: 'Its edge is coated in ice; enemies it touches freeze solid.',
        iconSrc: './icons/W_Sword018.png',
        entry: [{
          'valCoefficient': 1.4,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        }, {
          'valCoefficient': 1.3,
          'value': '11',
          'showVal': '+11',
          type: 'CRITDMG',
          'name': 'Crit damage'
        }]
      }
      ],
      extraEntry: [{
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
      },]
    }
  },
  methods: {
  }
};