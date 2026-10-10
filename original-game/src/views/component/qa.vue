<template>
  <div class="qa">
    <!-- <a class="github" target="_blank" @click="navToGithub" title="Source code" src="https://github.com/Couy69/vue-idle-game"></a> -->
    <div class="update-info" @click="drawerOpen" type="primary">
      <img src="../../assets/icons/menu/Q&A.png" alt="">
      <span>Q&A</span>
      <i class="new" v-if="!checkedUpdateInfo"></i>
    </div>
    <transition name="fade">
      <div class="drawer-update" v-if="showExtrasInfo">
        <i class="close" @click="closePanel"></i>
        <h1>Q&A</h1>
        <p>Here are some questions players have asked</p>
        <p>I got lots of feedback and can’t post it all, but I credit everyone whose suggestion makes it into an update</p>
        <div class="scroll">
          <div class="info" v-for="(item,index) in update" :key="index">
            <h1>{{item.name}}<span>({{GMTToStr(item.created_at)}})</span>:</h1>
            <p v-if="item.suggest"> {{item.suggest}}</p>
            <p style="padding-left:0"><img src="../../assets/img/35017881.jpg" alt="">:<span>{{item.standby1}}</span> </p>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>
<script>
import { assist } from '../../assets/js/assist';
export default {
  name: "qa",
  mixins: [assist],
  data() {
    return {
      checkedUpdateInfo: false,
      showExtrasInfo: false,
      // TODO: 
      update: [
        {
          name: '木匠',
          suggest: 'It keeps getting harder with every update',
          created_at: '2020-11-26 19:13:42',
          standby1: 'Gear keeps getting stronger, so dungeons do too. The current difficulty should be just right',
        }, {
          name: 'QQ',
          suggest: 'Auto-sell by gear color? Storage? There doesn’t seem to be a character level',
          created_at: '2020-11-26 20:26:15',
          standby1: 'Auto-sell: yes. No storage for now. Character level isn’t a separate setting (it follows your equipment level, and so does the shop’s item level)',
        }, {
          name: '木匠',
          suggest: 'In Endless mode, Climb and Repeat do the same thing',
          created_at: '2020-11-26 20:36:07',
          standby1: 'Repeat loops the current floor; Climb moves to the next floor after each win',
        }, {
          name: 'Mrlin',
          suggest: 'Enhancements don’t carry over?',
          created_at: '2020-11-27 10:12:47',
          standby1: 'Not for now, and probably not in the future',
        }, {
          name: 'armchair player',
          suggest: 'Hi, the game is fun! Small suggestion: could you show the enhance success rate?',
          created_at: '2020-11-27 07:53:55',
          standby1: 'Sure, it’s now in the enhance tips',
        }, {
          name: '卜玉和银',
          suggest: 'When I equip the Susanoo ring I only have 100 HP',
          created_at: '2020-11-27 10:36:10',
          standby1: 'Characters start with 100 HP, which means none of your equipped gear adds HP',
        }, {
          name: 'zjw',
          suggest: 'Can I enhance equipped gear?',
          created_at: '2020-11-27 10:44:04',
          standby1: 'Unequip it first, then enhance it',
        }, {
          name: 'masy',
          suggest: 'Can’t it run in the background? It pauses as soon as I switch away.',
          created_at: '2020-11-28 09:18:31',
          standby1: 'Background pausing is a browser limitation: switching away pauses the page. Chrome users can try opening chrome://flags/, searching for the calc option and setting it toDisabled',
        }, {
          name: 'MarkH2',
          suggest: 'Could you explain the rarities??',
          created_at: '2020-11-28 14:34:37',
          standby1: 'Rarity: Worn - Common - Artifact - Epic - Unique. Higher rarity means more affixes and better stats',
        }]
    };
  },
  mounted() {
    this.checkedUpdateInfo = localStorage.getItem('checkedUpdateInfo')
    this.update = this.update.reverse()
    this.getSuggest()
  },
  methods: {
    eastereEgg1(e) {
      setTimeout(() => {
        this.reKeyCode = []
      }, 3000)
      this.reKeyCode.push(e.keyCode)
      if (JSON.stringify(this.reKeyCode) == JSON.stringify(this.keyCode)) {
        var p = this.findComponentUpward(this, 'index')
        if (!p.GMmodel) {
          p.GMmodel = true
          this.$store.commit("set_sys_info", {
            msg: `
              You found an easter egg. You must love games too.
            `,
            type: 'win'
          });
          this.$store.commit("set_sys_info", {
            msg: `
              GM mode enabled. If you’re a player, please don’t abuse GM mode.
            `,
            type: 'win'
          });
        }
      }
    },
    drawerOpen() {
      this.showExtrasInfo = true
      this.checkedUpdateInfo = true
      localStorage.setItem('checkedUpdateInfo', true)
    },
    closePanel() {
      localStorage.setItem('checkedUpdateInfo', true)
      this.showExtrasInfo = false
    },
    GMTToStr(time) {
      let date = new Date(time)
      let Str = date.getFullYear() + '-' +
        (date.getMonth() + 1) + '-' +
        date.getDate() + ' ' +
        date.getHours() + ':' +
        date.getMinutes() + ':' +
        date.getSeconds()
      return Str
    },
    async getSuggest() {
      try {
        let data = await this.$api.post(
          "v1/Suggest/getReviewed", {
          page: 1,
          size: 30
        }
        );
        if (data.data.error_code == 20000) {
          this.update = data.data.content.rows
        } else {

        }
      } catch (error) {
        console.log(error);
      }
      this.disabled = true
      setTimeout(() => {
        this.disabled = false
      }, 1000)
    }
  }
};


</script>
<style lang="scss" scoped>
.qa {
  position: fixed;
  width: 0.5rem;
  height: 0.55rem;
  display: flex;
  bottom: 0.1rem;
  right: 1.5rem;
  z-index: 1;
  cursor: pointer;
  .update-info {
    margin-right: 0.2rem;
    cursor: pointer;
    width: 0.5rem;
    height: 0.55rem;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img {
      width: 0.35rem;
      height: 0.35rem;
    }
    span {
      white-space: nowrap;
      font-size: 0.12rem;
    }
    .new {
      display: flex;
      width: 0.3rem;
      height: 0.16rem;
      position: absolute;
      top: 0rem;
      right: 0px;
      transform: translate(50%, -50%);
      background-image: url("../../assets/icons/menu/NEW.png");
      background-size: contain;
      background-repeat: no-repeat;
      animation: tipsMove 1s infinite;
    }
  }
}
@keyframes tipsMove {
  0% {
    transform: translate(50%, -50%);
  }
  25% {
    transform: translate(50%, -70%);
  }
  50% {
    transform: translate(50%, -50%);
  }
  75% {
    transform: translate(50%, -80%);
  }
  100% {
    transform: translate(50%, -50%);
  }
}
.drawer-update {
  position: fixed;
  width: 30%;
  height: 100%;
  background: #111;
  top: 0;
  right: 0;
  padding: 0.2rem;
  z-index: 10;
  .scroll {
    height: calc(100% - 0.5rem);
    overflow-y: auto;
  }
  .close {
    cursor: pointer;
    position: absolute;
    top: 0.13rem;
    right: 0.15rem;
    display: block;
    width: 0.3rem;
    height: 0.3rem;
    background-image: url(../../assets/icons/close.png);
    background-size: cover;
  }
  .info {
    padding: 0.2rem;
    text-align: left;
    user-select:text;
    h1 {
      margin: 0.06rem 0;
      font-size: 0.23rem;
      letter-spacing: 1px;
    }
    span {
      margin: 0.06rem;
      font-size: 0.13rem;
      letter-spacing: 1px;
    }
    h2 {
      padding-left: 0.2rem;
      line-height: 0.3rem;
      margin: 0.1rem 0;
      font-size: 0.18rem;
      letter-spacing: 1px;
    }
    p {
      margin: 0.1rem;
      padding-left: 0.25rem;
      line-height: 0.2rem;
      color: #fafafa;
      font-size: 0.14rem;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      img {
        margin-right: 0.1rem;
        border-radius: 50%;
        width: 0.25rem;
        height: 0.25rem;
      }
    }
  }
}
</style>
