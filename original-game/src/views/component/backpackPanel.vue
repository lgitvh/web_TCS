<template>
  <div class="backpackPanel">
    <div v-for="(v, k) in grid" :key="k">
      <div class="grid">
        <div class="title" v-if="v.lv" @contextmenu.prevent="openMenu(k,$event)" @touchstart.stop.prevent="openMenu(k,$event)" @mouseover="showItemInfo($event,v.itemType,v)" @mouseleave="closeItemInfo">
          <div class="icon" :class="{'red-flash':v.enchantlvl>=13}"  :style="{ 'box-shadow': 'inset 0 0 7px 2px ' + v.quality.color }">
            <img :src="v.type.iconSrc" alt="" />
          </div>
          <div class="title-lock" v-if="v.locked">
            <img src="../../assets/icons/lock.png" alt="">
          </div>
        </div>
      </div>
    </div>
    <div class="backpack-capacity" :class="{'height-capacity':itemNum/grid.length>0.8}">{{itemNum}}/{{grid.length}}</div>
    <div class="handle">
      <div class="handle-checkbox">
        <!-- <input type="checkbox" name="" v-model="autoSell"> -->
        <span  @click.stop="autoSellPanel = !autoSellPanel">
          Auto-sell settings
          <i class="icon icon-setting"></i>
        </span>
        <div class="autoSellSetting" v-if="autoSellPanel">
          Checked rarities are sold automatically when dropped in dungeons
          <div>
            <span @click="setAutoSell(0)"><input type="checkbox" name="" v-model="autoSell[0]">Worn</span>
            <span @click="setAutoSell(1)"><input type="checkbox" name="" v-model="autoSell[1]">Common</span>
          </div>
          <div>
            <span @click="setAutoSell(2)"><input type="checkbox" name="" v-model="autoSell[2]">Artifact</span>
            <span @click="setAutoSell(3)"><input type="checkbox" name="" v-model="autoSell[3]">Epic</span>
          </div>

        </div>
      </div>
      <div class="button" @click="neaten">Sort</div>
      <div class="button" @click="sell">Sell all</div>
    </div>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="showItemInfo($event,currentItem.itemType,currentItem,'touch')" v-if="$store.state.operatorSchemaIsMobile">View</li>
      <li @click="equipTheEquipment()">Equip</li>
      <li @click="strengthenEquipment()">Enhance</li>
      <li @click="strengthenEquipment()">Reforge</li>
      <li @click="lockTheEquipment(true)" v-if="!currentItem.locked">Lock</li>
      <li @click="lockTheEquipment(false)" v-if="currentItem.locked">Unlock</li>
      <li @click="sellTheEquipment()">Sell</li>
    </ul>
  </div>
</template>
<script>
import { assist } from '../../assets/js/assist';
export default {
  name: "backpackPanel",
  data() {
    return {
      grid: [],
      left: '',
      top: '',
      visible: false,
      currentItem: {},
      currentItemIndex: '',
      autoSellPanel: false,
      autoSell:[false,false,false,false]
    };
  },
  mixins: [assist],
  created() {
    this.grid = new Array(32).fill({});
  },
  watch: {
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    },
  },
  computed: {
    itemNum() {
      let count = 0
      this.grid.map((item) => {
        if (JSON.stringify(item) != '{}') {
          count++
        }
      })
      if (count / this.grid.length > 0.8) {
        this.$store.commit("set_sys_info", {
          msg: `
              Backpack almost full, clean it up soon!
            `,
          type: 'warning',
        });
      }
      return count
    }
  },
  mounted() {
    var item = {
      lv: 30,
      itemType: 'armor',
      quality: {
        name: "Artifact",
        qualityCoefficient: 1.5,
        probability: "0.15",
        color: "#ff00ff",
        extraEntryNum: 3,
      },
      type: {
        name: "Crimson Willow Blood Armor",
        des: "Seems to fill its wearer with life force",
        iconSrc: "./icons/A_A3.png",
        entry: [
          {
            valCoefficient: 0.9,
            value: 51,
            showVal: "+51",
            type: "DEF",
            name: "Defense",
          },
          {
            type: "HP",
            valCoefficient: 1.4,
            value: 634,
            showVal: "+634",
            name: "HP",
          },
        ],
      },
      extraEntry: [
        { type: "HP", value: 99, showVal: "+99", name: "HP" },
        { type: "HP", value: 93, showVal: "+93", name: "HP" },
        { type: "HP", value: 97, showVal: "+97", name: "HP" },
      ],
    };
    // this.$set(this.grid,0,item)
    // try {
    //   var p = this.findComponentUpward(this, 'index')
    //   if (JSON.stringify(p.saveData) != '{}') {
    //     this.grid = p.saveData.backpackEquipment
    //   }
    // } catch (error) {
    //   console.log(error)
    //   this.$store.commit("set_sys_info", {
    //     msg: `
    //           Oops, the save is corrupted!
    //         `,
    //     type: 'warning'
    //   });
    // }

  },
  methods: {
    // 点击span仍然可以设置input的值，操作的是数组，所以需要$set来实现双向绑定
    setAutoSell(index){
      this.$set(this.autoSell,index,!this.autoSell[index])
    },
    // 整理
    neaten() {
      var tem = new Array(32).fill({}),
        temIndex = 0
      this.grid.map((item, index) => {
        if (JSON.stringify(item) != '{}') {
          tem[temIndex] = item
          temIndex++
        }
      })
      this.grid = this.$deepCopy(tem)
      tem = []
    },
    clear(){
      this.grid = new Array(32).fill({});
    },
    // Sell all
    sell() {
      this.grid.map((item, index) => {
        if (JSON.stringify(item) != '{}') {
          this.currentItemIndex = index
          this.currentItem = item
          this.sellTheEquipment(true)
        }
      })
    },
    openMenu(k, e) {
      this.currentItemIndex = k
      this.currentItem = this.grid[k]
      this.$store.commit('set_need_strengthen_equipment', this.currentItem)
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      if (e.type == 'touchstart') {
        var left = e.changedTouches[0].clientX - offsetLeft + 15; // 15: margin right
      } else {
        var left = e.clientX - offsetLeft + 15; // 15: margin right
      }


      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }

      this.top = e.offsetY;
      this.visible = true;
    },
    closeMenu() {
      this.visible = false;
    },
    showItemInfo($event, type, item, SchemaIsMobile) {
      if (SchemaIsMobile != 'touch' && this.$store.state.operatorSchemaIsMobile) {
        return
      }
      var p = this.findComponentUpward(this, 'index')
      p.showItemInfo($event, type, item)
    },
    closeItemInfo() {
      var p = this.findComponentUpward(this, 'index')
      p.weaponShow = p.armorShow = p.ringShow  =p.neckShow = false
    },
    lockTheEquipment(v) {
      this.currentItem.locked = v;
    },
    equipTheEquipment() {
      switch (this.currentItem.itemType) {
        case 'weapon':
          this.grid[this.currentItemIndex] = this.$store.state.playerAttribute.weapon
          this.$store.commit('set_player_weapon', this.currentItem)
          break;
        case 'armor':
          this.grid[this.currentItemIndex] = this.$store.state.playerAttribute.armor
          this.$store.commit('set_player_armor', this.currentItem)
          break;
        case 'ring':
          this.grid[this.currentItemIndex] = this.$store.state.playerAttribute.ring
          this.$store.commit('set_player_ring', this.currentItem)
          break;
        case 'neck':
          this.grid[this.currentItemIndex] = this.$store.state.playerAttribute.neck
          this.$store.commit('set_player_neck', this.currentItem)
          break;
        default:
          break;
      }

    },
    strengthenEquipment(v) {
      var p = this.findComponentUpward(this, 'index')
      p.closePanel()
      p.strengthenEquipmentPanelOpened = true
    },
    sellTheEquipment(withoutWarning, sellMsg) {
      if (this.currentItem.locked) {

        !withoutWarning && this.$store.commit("set_sys_info", {
          msg: `
              This item is locked. Unlock it before selling.
            `,
          type: 'warning',
        });
        return
      }
      this.$set(this.grid, this.currentItemIndex, {});
      var gold = this.currentItem.lv * this.currentItem.quality.qualityCoefficient * 30
      this.$store.commit("set_player_gold", parseInt(gold));
      this.$store.commit("set_sys_info", {
        msg: `
              ${sellMsg ? sellMsg : ''}Sold gear for gold${parseInt(gold)}
            `,
        type: 'trophy',
      });
    }
  },
};
</script>
<style lang="scss" scoped>
.backpackPanel {
  width: 5.02rem;
  height: 3.1rem;
  display: flex;
  flex-wrap: wrap;
  padding: 0.14rem 0.14rem 0.14rem;
  justify-items: flex-start;
  align-items: flex-start;
  position: relative;
}
.handle {
  padding-top: 0.1rem;
  justify-content: flex-end;
  display: flex;
  align-items: center;
  width: 100%;
  height: 0.5rem;
  .handle-checkbox {
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
    span {
      display: flex;
      align-items: center;
    }
    input {
      width: 0.17rem;
      height: 0.17rem;
      margin-right: 2px;
      margin-top: 1px;
    }
  }
}
.grid {
  width: 0.6rem;
  height: 0.6rem;
  border: 1px solid #ccc;
  margin-left: -1px;
  margin-top: -1px;
  box-shadow: inset 0 0 6px 6px rgba($color: #000000, $alpha: 0.5);
  .title {
    display: flex;
    width: 100%;
    cursor: pointer;
    position: relative;
    .icon {
      width: 0.56rem;
      height: 0.56rem;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.04rem;
      img {
        width: 80%;
        height: 80%;
        max-width: 0.32rem;
        max-height: 0.32rem;
      }
    }
  }
  .title-lock {
    position: absolute;
    // width: 0.2rem;
    // height: 0.2rem;
    // background: red;
    top: -0.03rem;
    right: -0.11rem;
    width: 0;
    height: 0;
    border-left: 0.24rem solid transparent;
    border-right: 0.24rem solid transparent;
    border-bottom: 0.24rem solid rgba(255, 0, 0, 0.658);
    font-size: 0;
    line-height: 0;
    transform: rotate(45deg);
    img {
      width: 0.16rem;
      height: 0.16rem;
      transform: rotate(-45deg) translate(-50%, -0%);
      position: absolute;
      top: 50%;
      left: 50%;
    }
  }
}
.contextmenu {
  margin: 0;
  background: #000;
  border: 1px solid #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #fff;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

  li {
    margin: 0;
    padding: 9px 16px;
    cursor: pointer;
    border-top: 1px solid #ccc;
    margin-top: -1px;
    font-size: 14px;
    letter-spacing: 6px;
    &:hover {
      color: #ccc;
    }
  }
}
.backpack-capacity {
  position: absolute;
  bottom: 0.2rem;
  left: 0.2rem;
  font-size: 0.2rem;
}
.height-capacity {
  color: red;
}
.autoSellSetting {
  position: absolute;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.5);
  padding: 0.1rem;
  border-radius: 4px;
  bottom: 0.3rem;
  right:0rem;
  width: 1.7rem;
  div{
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  span {
    display: flex;
    align-items: center;
    padding: 0.06rem;
    cursor: pointer;
  }
  input{
    cursor: pointer;
  }
}
</style>
