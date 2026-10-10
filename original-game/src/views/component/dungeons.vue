<template>
  <div class="dungeons">
    <div class="progress-bar"></div>
    <div class="icon-bar">
      <div class="player" :style="{left:left+'%','backgroundPosition':parseInt(left%4)*32+'px 96px'}">
        <!-- <img src="../../assets/icons/map/player-s.png" alt=""> -->
        <!-- :style="{background-position:}" -->
      </div>
      <div class="monster" v-for="(v,k) in dungeons.eventType" :key="k" :style="{left:(100/dungeons.eventNum)*(k+1)+'%'}">
        <img :src="'./icons/map/'+v.type+'.png'" alt="">
      </div>
    </div>
  </div>
</template>
<script>
import { assist } from '../../assets/js/assist';
export default {
  name: "dungeons",
  mixins: [assist],
  data() {
    return {
      left: 0,
      pro: {},
      timeOut: {},
      battleComTime: {},
      nextEvent: 1,
      battleTime:2000,
      moveTime:50,
      dungeons: {
        battleTime: 2000,
        name: 'Slime Forest',
        time: '60',
        id: '1',
        eventNum: '5',
        lv: 1,
        eventType: [{
          name: 'Little Slime', type: 'monster',
          eventType: 'battle',
          attribute: {
            HP: 20,
            ATK: 1,
          },
          trophy: {
            gold: 30,
            equip: [
              1, 0, 0, 0
            ],
          }
        }, {
          name: 'Little Slime', type: 'monster', eventType: 'battle',
          attribute: {
            HP: 20,
            ATK: 1,
          },
          trophy: {
            gold: 30,
            equip: [
              0.2, 0.1, 0.05, 0
            ],
          }
        }, {
          name: 'Little Slime',
          type: 'monster', eventType: 'battle',
          attribute: {
            HP: 20,
            ATK: 1,
          },
          trophy: {
            gold: 30,
            equip: [
              0.2, 0.1, 0.05, 0
            ],
          }
        }, {
          name: 'Little Slime',
          type: 'monster', eventType: 'battle',
          attribute: {
            HP: 20,
            ATK: 1,
          },
          trophy: {
            gold: 30,
            equip: [
              0.2, 0.1, 0.05, 0
            ],
          }
        }, {
          name: 'Slime King',
          type: 'boss', eventType: 'battle',
          attribute: {
            HP: 40,
            ATK: 2,
          },
          trophy: {
            gold: 30,
            equip: [
              0.25, 0.55, 0.15, 0.05
            ],
          }
        },]
      }
    };
  },
  computed: {
    reincarnationAttribute() { return this.$store.state.reincarnationAttribute },
  },
  mounted() {
    // this.evenHandle()

  },
  methods: {
    evenHandle() {
      let startEnent = () => {
        if (this.left >= this.nextEvent * 100 / this.dungeons.eventNum) {
          this.evenInExecution()
          this.nextEvent++
          if (this.nextEvent <= this.dungeons.eventNum) {
            this.timeOut = setTimeout(() => {
              this.pro = setInterval(() => {
                startEnent()
              }, this.moveTime+this.reincarnationAttribute.MOVESPEED)
            }, this.battleTime+this.reincarnationAttribute.BATTLESPEED)
          } else {
            setTimeout(() => {
              this.eventEnd()
            }, this.battleTime+this.reincarnationAttribute.BATTLESPEED)
          }

          clearInterval(this.pro)
        }

        this.left += 0.5
      }
      this.eventBegin()
      this.pro = setInterval(() => {
        startEnent()
      }, this.moveTime+this.reincarnationAttribute.MOVESPEED)
    },
    eventBegin() {
      this.$store.commit("set_sys_info", {
        msg: "You entered " + (this.dungeons.type=="endless"?'Endless (lv'+this.dungeons.lv+'）':this.dungeons.name),
        type: 'warning'
      });
      if (this.dungeons.name == 'Black Volcano') {
        this.$store.commit("set_sys_info", {
          msg: "This seems to be the final challenge",
          type: 'battle'
        });
        this.$store.commit("set_sys_info", {
          msg: "Good luck!",
          type: 'battle'
        });
      }
    },
    evenInExecution() {
      var event = this.dungeons.eventType[this.nextEvent - 1]
      switch (event.eventType) {
        case 'battle':
          this.$store.commit("set_sys_info", {
            msg: `
              You encountered ${event.name} (lv${this.dungeons.lv}), fighting...
            `,
            type: 'battle'
          });
          this.battleComTime = setTimeout(() => {
            this.battleCom(event)
          }, this.battleTime+this.reincarnationAttribute.BATTLESPEED)
          break;

        default:
          break;
      }

    },
    forcedToStopEvent() {
      clearInterval(this.pro)
      clearTimeout(this.timeOut)
      clearTimeout(this.battleComTime)
      this.pro = {}
      this.left = 0
      this.nextEvent = 1
      this.dungeons = {}
    },
    eventEnd() {

      setTimeout(() => {
        // this.battleCom(event)
        if (this.dungeons.type == "endless") {
          this.$store.commit("set_sys_info", {
            msg: `
                Victory! You can challenge the next floor
              `,
            type: "win",
          });
          this.$store.commit("set_endless_lv", this.$store.state.playerAttribute.endlessLv + 1);
          this.$store.commit("set_player_curhp", 'full');
        } else {
          this.$store.commit("set_sys_info", {
            msg: `
                Dungeon cleared!
              `,
            type: "win",
          });
        }

        let p = this.findComponentUpward(this, 'index')
        let backpackPanel = this.findBrothersComponents(this, 'backpackPanel', false)[0]

        if (this.dungeons.name == 'Black Volcano' && !this.$store.state.playerAttribute.endlessLv) {

          this.$store.commit("set_sys_info", {
            msg: "You defeated the final boss and beat the game!",
            type: 'warning'
          });
        }

        if(this.dungeons.lv>=10&&!this.$store.state.playerAttribute.endlessLv){
          this.$store.commit("set_sys_info", {
            msg: "Endless mode unlocked! Tap the dungeon icon at the top right of the map to enter",
            type: 'warning'
          });
          this.$store.commit("set_sys_info", {
            msg: "Test your limits",
            type: 'warning'
          });
          this.$store.commit('set_endless_lv', 1)
        }
        this.forcedToStopEvent()
        let backpackPanelSign = backpackPanel.itemNum / backpackPanel.grid.length < 0.8
        if (p.reChallenge && backpackPanelSign) {
          p.eventBegin()
        } else if (p.reEChallenge&&p.dungeons.type=='endless') {
          this.$store.commit("set_endless_lv", this.$store.state.playerAttribute.endlessLv - 1);
          p.eventBegin()
        } else if (p.upEChallenge&&p.dungeons.type=='endless') {
          p.endlessLv = this.$store.state.playerAttribute.endlessLv
          p.dungeons.lv = this.$store.state.playerAttribute.endlessLv
          p.showEndlessDungeonsInfo()
          p.eventBegin()
        } else {
          p.dungeons = ''
          p.inDungeons = false
        }

        // if(p.reEChallenge){
        //   this.$store.commit("set_endless_lv", this.$store.state.playerAttribute.endlessLv - 1);
        // }
        // if(p.upEChallenge){
        // }

      }, 100)
    },
    // 计算战斗过程
    battleCom(event) {
      let playerAttribute = this.$store.state.playerAttribute.attribute,
        battleTime,
        healthRecoverySpeed = this.$store.state.playerAttribute.healthRecoverySpeed,
        reducedDamage = this.$store.state.playerAttribute.attribute.REDUCDMG,
        playerDPS = playerAttribute.DPS,
        playerBLOC = playerAttribute.BLOC.value,
        monsterAttribute = this.$deepCopy(event.attribute), //HP: 100,ATK: 1,
        p = this.findComponentUpward(this, 'index')

      var playerDeadTime = (playerAttribute.CURHP.value+playerBLOC) / reducedDamage / monsterAttribute.ATK,
        monsterDeadTime = (monsterAttribute.HP / playerDPS)

      // 战斗获胜
      if (monsterDeadTime < playerDeadTime) {
        battleTime = monsterDeadTime
        var takeDmg = -battleTime * Number(monsterAttribute.ATK)
        takeDmg = parseInt(takeDmg * reducedDamage)
        takeDmg = takeDmg + playerBLOC
        takeDmg = takeDmg>-1?-1:takeDmg
        this.$store.commit('set_player_curhp', takeDmg)

        if (this.dungeons.type == 'endless') {
          this.$store.commit("set_sys_info", {
            msg: `
              Defeated ${event.name} (Endless floor: ${this.dungeons.lv}), took ${Math.abs(takeDmg)} damage
            `,
            type: 'win'
          });
        } else {
          this.$store.commit("set_sys_info", {
            msg: `
              Defeated ${event.name} (lv${this.dungeons.lv}), took ${Math.abs(takeDmg)} damage
            `,
            type: 'win'
          });
        }
        // 计算战利品获取
        this.caculateTrophy(event)
        // 副本战斗成功时提升玩家等级
        if(this.dungeons.lv>this.$store.state.playerAttribute.lv&&event.type=='boss'){
          this.$store.commit("set_sys_info", {
            msg: `
              Level up! Higher-level dungeons can now appear.
            `,
            type: 'win'
          });
          this.$store.commit('set_player_lv', this.dungeons.lv)
        }
        // 高难度副本只可以挑战一 times
        if(this.dungeons.difficulty!=1){
          p.dungeonsArr = p.dungeonsArr.filter(({ id }) => id !== this.dungeons.id);
        }
      } else {
        // 玩家死亡
        this.$store.commit('set_player_curhp', 'dead')
        clearInterval(this.pro)
        clearTimeout(this.timeOut)
        this.pro = {}
        this.timeOut = {}
        this.left = 0
        this.nextEvent = 1
        p.inDungeons = false
        this.dungeons = {}
        var takeDmg = monsterDeadTime * Number(monsterAttribute.ATK)
        takeDmg = parseInt(takeDmg * reducedDamage)
        takeDmg = takeDmg - playerBLOC
        takeDmg = takeDmg<1?1:takeDmg
        this.$store.commit("set_sys_info", {
          msg: `
              Defeated! Took ${takeDmg} damage
            `,
          type: 'warning'
        });
        this.$store.commit("set_sys_info", {
          msg: `
              Try enhancing or reforging your gear, then challenge again
            `,
          type: 'warning'
        });


      }
    },
    //战利品计算
    caculateTrophy(event) {
      var items = []
      var lv = this.dungeons.lv
      // 获取UniqueEquip
      if (event.type == 'boss' && this.dungeons.type != 'endless') {
        var randow = 1 - 0.02*((this.dungeons.difficulty-1)*2+1)
        if (Math.random() > randow) {
          var random = Math.random()
          if (random <= 0.3 && random > 0) {
            var b = this.findBrothersComponents(this, 'weaponPanel', false)[0]
            var item = b.createNewItem(4, parseInt(lv + Math.random() * 6))
            items.push(JSON.parse(item))
          } else if (random <= 0.5 && random > 0.3) {
            var b = this.findBrothersComponents(this, 'armorPanel', false)[0]
            var item = b.createNewItem(4, parseInt(lv + Math.random() * 6))
            items.push(JSON.parse(item))
          }else if (random <= 0.75 && random > 0.5) {
            var b = this.findBrothersComponents(this, 'ringPanel', false)[0]
            var item = b.createNewItem(4, parseInt(lv + Math.random() * 6))
            items.push(JSON.parse(item))
          } else {
            var b = this.findBrothersComponents(this, 'neckPanel', false)[0]
            var item = b.createNewItem(4, parseInt(lv + Math.random() * 6))
            items.push(JSON.parse(item))
          }

        }
      }
      var trophy = event.trophy
      var equip = [
        0.25, 0.25, 0.25, 0.25
      ]
      var equip = trophy.equip
      var equipQua = -1;
      var r = Math.random()
      if (r <= equip[0]) {
        // 获得WornEquip
        equipQua = 0
      } else if (r < equip[1] + equip[0] && r >= equip[0]) {
        // 获得CommonEquip
        equipQua = 1
      }
      else if (r < equip[2] + equip[1] + equip[0] && r >= equip[1] + equip[0]) {
        // 获得ArtifactEquip
        equipQua = 2
      }
      else if (r < equip[3] + equip[2] + equip[1] + equip[0] && r >= equip[2] + equip[1] + equip[0]) {
        // 获得EpicEquip
        equipQua = 3
      } else {
        // 未获得Equip
      }
      //获得Equip时
      if (equipQua != -1) {
        // this.createEquip(equipQua,lv)
        var index = Math.floor((Math.random() * 4));
        if (index == 0) {
          var b = this.findBrothersComponents(this, 'weaponPanel', false)[0]
          var item = b.createNewItem(equipQua, lv)
        } else if (index == 1) {
          var b = this.findBrothersComponents(this, 'armorPanel', false)[0]
          var item = b.createNewItem(equipQua, lv)
        }else if (index == 2) {
          var b = this.findBrothersComponents(this, 'ringPanel', false)[0]
          var item = b.createNewItem(equipQua, lv)
        } else {
          var b = this.findBrothersComponents(this, 'neckPanel', false)[0]
          var item = b.createNewItem(equipQua, lv)
        }
        items.push(JSON.parse(item))
        var backpackPanel = this.findBrothersComponents(this, 'backpackPanel', false)[0]
        var goldObtainRatio = 1
        if (this.dungeons.type == 'endless') {
          var endlessLv = this.$store.state.playerAttribute.endlessLv
          goldObtainRatio = 1.5
          items = []
        }
        this.$store.commit("set_sys_info", {
          msg: `
              Gained gold: ${parseInt(event.trophy.gold * goldObtainRatio)}
            `,
          type: 'trophy',
          equip: items
        });
        this.$store.commit("set_player_gold", parseInt(event.trophy.gold * goldObtainRatio));
        if(this.dungeons.type == 'endless'){
          return
        }
        items.map(item => {
          // 当开启了自动Sell并且新获得的Equip品质低于Epic时，自动Sell
          if (backpackPanel.autoSell[equipQua]&&item.quality.name!="Unique") {
            var gold = item.lv * item.quality.qualityCoefficient * 30
            this.$store.commit("set_player_gold", parseInt(gold));
            this.$store.commit("set_sys_info", {
              msg: `
                Auto-sold gear for gold: ${parseInt(gold)}
              `,
              type: 'trophy',
            });
          } else {
            for (let i = 0; i < backpackPanel.grid.length; i++) {
              if (JSON.stringify(backpackPanel.grid[i]).length < 3) {
                this.$set(backpackPanel.grid, i, item)
                break;
              }
            }
          }
        })
      } else {
        //Gold获取倍率
        var goldObtainRatio = 1
        if (this.dungeons.type == 'endless') {
          var endlessLv = this.$store.state.playerAttribute.endlessLv
          goldObtainRatio = 2.6
        }
        this.$store.commit("set_sys_info", {
          msg: `
              Gained gold: ${parseInt(event.trophy.gold * goldObtainRatio)}
            `,
          type: 'trophy',
          equip: []
        });
        this.$store.commit("set_player_gold", parseInt(event.trophy.gold * goldObtainRatio));
      }

    }
  }
};


</script>
<style lang="scss" scoped>
.dungeons {
  width: 100%;
  height: 100%;
  position: relative;
  .progress-bar {
    position: absolute;
    bottom: 5px;
    left: 10px;
    right: 10px;
    border: 1px solid #fff;
  }
  .icon-bar {
    margin: 0 30px;
    width: calc(100% - 60px);
    height: 100%;
    position: relative;
    & > div {
      position: absolute;
      height: 34px;
      width: 34px;
      top: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      img {
        height: 34px;
        width: 34px;
      }
    }
    .player {
      z-index: 2;
      height: 48px;
      width: 32px;
      // background-position: -0px 96px !important;
      background-repeat: no-repeat;
      background: url(../../assets/icons/map/player-s.png);
    }
    .monster {
      left: 20%;
    }
  }
}
</style>
