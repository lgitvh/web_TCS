/**
 * Necklace属性配置文件
 * @author couy
 */

export const equiAttributeNeck = {
  data(){
    return{
      qualityNeck: [{
        name: 'Worn',
        qualityCoefficient: 0.6,
        probability: '0.25',
        color: '#a1a1a1',
        extraEntryNum: 1,
      }, {
        name: 'Common',
        qualityCoefficient: 0.9,
        probability: '0.55',
        color: '#fff', extraEntryNum: 2,
      }, {
        name: 'Artifact',
        qualityCoefficient: 1.3,
        probability: '0.15',
        color: '#ff00ff', extraEntryNum: 3,
      }, {
        name: 'Epic',
        qualityCoefficient: 1.6,
        probability: '0.05',
        color: '#f78918', extraEntryNum: 4,
      }, {
        name: 'Unique',
        qualityCoefficient: 2,
        probability: '0',
        color: '#ff0000', extraEntryNum: 5,
      }],
      extraEntryNeck: [{
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
      uniqueCategoryNeck: [{
        name: 'Crusader Demonbane Necklace',
        des: '',
        iconSrc: './icons/U_neck01.png',
        entry: [{
          'valCoefficient': 0.7,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        }, {
          'valCoefficient': 0.8,
          'value': '11',
          'showVal': '+11',
          type: 'HP',
          'name': 'HP'
        }, {
          'valCoefficient': 0.9,
          'value': '11',
          'showVal': '+11',
          type: 'DEF',
          'name': 'Defense'
        }]
      }, {
        name: 'Ascended Dark Dragon King Necklace',
        des: '',
        iconSrc: './icons/U_neck02.png',
        entry: [{
          'valCoefficient': 1.0,
          'value': '11',
          'showVal': '+11',
          type: 'CRITDMG',
          'name': 'Crit damage'
        }, {
          'valCoefficient': 0.5,
          'value': '11',
          'showVal': '+11',
          type: 'CRIT',
          'name': 'Crit rate'
        }, {
          'valCoefficient': 0.8,
          'value': '11',
          'showVal': '+11',
          type: 'HP',
          'name': 'HP'
        }]
      }, {
        name: 'Necklace of the Great Singles Club',
        des: 'So cool, so handsome. With this necklace you’ll never feel lonely being single forever',
        iconSrc: './icons/U_neck03.png',
        entry: [{
          'valCoefficient': 1.0,
          'value': '11',
          'showVal': '+11',
          type: 'CRITDMG',
          'name': 'Crit damage'
        }, {
          'valCoefficient': 1.2,
          'value': '11',
          'showVal': '+11',
          type: 'BLOC',
          'name': 'Block'
        }, {
          'valCoefficient': 0.7,
          'value': '11',
          'showVal': '+11',
          type: 'HP',
          'name': 'HP'
        }]
      }, {
        name: 'Demon’s Wingspan',
        des: 'What can you see?',
        iconSrc: './icons/U_neck04.png',
        entry: [{
          'valCoefficient': 1.6,
          'value': '11',
          'showVal': '+11',
          type: 'CRITDMG',
          'name': 'Crit damage'
        }, {
          'valCoefficient': 1.6,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        },]
      }, {
        name: 'Ipaya’s Necklace',
        des: '',
        iconSrc: './icons/U_neck05.png',
        entry: [{
          'valCoefficient': 0.9,
          'value': '11',
          'showVal': '+11',
          type: 'BLOC',
          'name': 'Block'
        }, {
          'valCoefficient': 0.9,
          'value': '11',
          'showVal': '+11',
          type: 'DEF',
          'name': 'Defense'
        }, {
          'valCoefficient': 1.3,
          'value': '11',
          'showVal': '+11',
          type: 'HP',
          'name': 'HP'
        }]
      }],
      categoryNeck: [
        {
          name: 'Crusader Necklace',
          des: 'A necklace worn by crusaders',
          iconSrc: './icons/Ac_1.png',
          entry: [{
            'valCoefficient': 0.9,
            'value': '11',
            'showVal': '+11',
            type: 'DEF',
            'name': 'Defense'
          }, {
            'valCoefficient': 0.5,
            'value': '11',
            'showVal': '+11',
            type: 'HP',
            'name': 'HP'
          },{
          'valCoefficient': 0.6,
          'value': '11',
          'showVal': '+11',
          type: 'BLOC',
          'name': 'Block'
        }]
        },
        {
          name: 'Ice Dragon Frost',
          des: 'Ice Dragon Frost',
          iconSrc: './icons/Ac_7.png',
          entry: [{
            'valCoefficient': 0.75,
            'value': '11',
            'showVal': '+11',
            type: 'CRITDMG',
            'name': 'Crit damage'
          }, {
            'valCoefficient': 0.5,
            'value': '11',
            'showVal': '+11',
            type: 'CRIT',
            'name': 'Crit rate'
          }, {
            'valCoefficient': 0.5,
            'value': '11',
            'showVal': '+11',
            type: 'HP',
            'name': 'HP'
          }]
        },
        {
          name: 'Eye of the Silver Soul',
          des: 'Eye of the Silver Soul',
          iconSrc: './icons/Ac_5.png',
          entry: [{
            'valCoefficient': 1.1,
            'value': '11',
            'showVal': '+11',
            type: 'CRIT',
            'name': 'Crit rate'
          }, {
            'valCoefficient': 0.5,
            'value': '11',
            'showVal': '+11',
            type: 'HP',
            'name': 'HP'
          }, {
          'valCoefficient': 0.6,
          'value': '11',
          'showVal': '+11',
          type: 'ATK',
          'name': 'Attack'
        }]
        }
      ],
      extraEntryNeck: [{
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
        type: 'BLOC',
        'name': 'Block'
      }]
    }
  },
  methods: {
  }
};