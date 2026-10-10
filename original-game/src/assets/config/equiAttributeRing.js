/**
 * Ring属性配置文件
 * @author couy
 */

export const equiAttributeRing = {
  data(){
    return{
      quality: [{
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
      uniqueCategory: [{
        name: 'True Fluffy Ring',
        des: '',
        iconSrc: './icons/U_ring02.png',
        entry: [{
            'valCoefficient': 1.2,
            'value': '11',
            'showVal': '+11',
            type: 'CRITDMG',
            'name': 'Crit damage'
          },{
            'valCoefficient': 0.5,
            'value': '11',
            'showVal': '+11',
            type: 'CRIT',
            'name': 'Crit rate'
          },{
            'valCoefficient': 0.7,
            'value': '11',
            'showVal': '+11',
            type: 'ATK',
            'name': 'Attack'
          },]
      },{
        name: 'Reaper’s Calling Card Ring',
        des: '',
        iconSrc: './icons/U_ring01.png',
        entry: [{
            'valCoefficient': 1.0,
            'value': '11',
            'showVal': '+11',
            type: 'CRITDMG',
            'name': 'Crit damage'
          },{
            'valCoefficient': 0.5,
            'value': '11',
            'showVal': '+11',
            type: 'CRIT',
            'name': 'Crit rate'
          },{
            'valCoefficient': 0.8,
            'value': '11',
            'showVal': '+11',
            type: 'HP',
            'name': 'HP'
          }]
      },{
        name: 'Pioneer’s Ring',
        des: '',
        iconSrc: './icons/U_ring03.png',
        entry: [{
            'valCoefficient': 1.0,
            'value': '11',
            'showVal': '+11',
            type: 'CRITDMG',
            'name': 'Crit damage'
          },{
            'valCoefficient': 0.5,
            'value': '11',
            'showVal': '+11',
            type: 'CRIT',
            'name': 'Crit rate'
          },{
            'valCoefficient': 0.7,
            'value': '11',
            'showVal': '+11',
            type: 'HP',
            'name': 'HP'
          }]
      },{
        name: 'Will of Susanoo',
        des: '',
        iconSrc: './icons/U_ring04.png',
        entry: [{
            'valCoefficient': 1.6,
            'value': '11',
            'showVal': '+11',
            type: 'CRITDMG',
            'name': 'Crit damage'
          },{
            'valCoefficient': 1.1,
            'value': '11',
            'showVal': '+11',
            type: 'ATK',
            'name': 'Attack'
          },]
      },{
        name: 'Will of Tsukuyomi',
        des: '',
        iconSrc: './icons/U_ring05.png',
        entry: [{
            'valCoefficient': 1.5,
            'value': '11',
            'showVal': '+11',
            type: 'CRITDMG',
            'name': 'Crit damage'
          },{
            'valCoefficient': 1.2,
            'value': '11',
            'showVal': '+11',
            type: 'HP',
            'name': 'HP'
          }]
      },],
      category: [
        {
          name: 'Ring of Life',
          des: 'Said to mysteriously strengthen its wearer’s constitution',
          iconSrc: './icons/Ac_9.png',
          entry: [{
            'valCoefficient': 1.1,
            'value': '11',
            'showVal': '+11',
            type: 'HP',
            'name': 'HP'
          }]
        },
        {
          name: 'Fluffy Ring',
          des: 'Meow ring, haunted by the grudge of paws that never got petted',
          iconSrc: './icons/Ac_11.png',
          entry: [{
            'valCoefficient': 0.9,
            'value': '11',
            'showVal': '+11',
            type: 'HP',
            'name': 'HP'
          },{
            'valCoefficient': 0.3,
            'value': '11',
            'showVal': '+11',
            type: 'ATK',
            'name': 'Attack'
          },{
            'valCoefficient': 0.8,
            'value': '11',
            'showVal': '+11',
            type: 'CRIT',
            'name': 'Crit rate'
          },]
        },
        {
          name: 'Soulbinder Ring',
          des: 'Come forth, Kazan! Devour every wandering soul!   - John the Ghost Swordsman',
          iconSrc: './icons/Ac_10.png',
          entry: [{
            'valCoefficient': 0.7,
            'value': '11',
            'showVal': '+11',
            type: 'HP',
            'name': 'HP'
          },{
            'valCoefficient': 0.5,
            'value': '11',
            'showVal': '+11',
            type: 'ATK',
            'name': 'Attack'
          },]
        },
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
      }]
    }
  },
  methods: {
  }
};