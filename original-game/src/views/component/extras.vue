<template>
  <div class="extras">
    <!-- <a class="github" target="_blank" @click="navToGithub" title="Source code" src="https://github.com/Couy69/vue-idle-game"></a> -->
    <div class="update-info" @click="drawerOpen" type="primary">
      <img src="../../assets/icons/menu/extras.png" alt="">
      <span>Changelog</span>
      <i class="new" v-if="!checkedUpdateInfo"></i>
    </div>
    <transition name="fade">
      <div class="drawer-update" v-if="showExtrasInfo">
        <i class="close" @click="closePanel"></i>
        <div class="scroll">
          <div class="info" v-for="(item,index) in update" :key="index">
            <h1> {{item.title}}</h1>
            <span v-if="item.desc"> {{item.desc}}</span>
            <h2 class="vision" v-for="(v) in item.vision" :key="v.id" v-if="item.vision">{{v.vision}}:<a :href="v.href" target="_blank"> {{v.href}}</a></h2>
            <h2 v-if="item.adjust">Feature changes</h2>
            <p v-for="(v) in item.adjust" :key="v.id">{{v}}</p>
            <h2 v-if="item.majorization">Improvements</h2>
            <p v-for="(v) in item.majorization" :key="v.id">{{v}}</p>
            <h2 v-if="item.bug">bugFixes</h2>
            <p v-for="(v) in item.bug" :key="v.id">{{v}}</p>
          </div>
        </div>

        <div class="footer">
          <div class="footer-github">
            <a class="github" target="_blank" @click="navToGithub" title="Source code" src="https://github.com/Couy69/vue-idle-game">
            </a>
            <span>Made with love. Leave a star?</span>

          </div>
          <div v-if="false" class="footer-suggest">
            <div>
              <textarea placeholder="Found a bug? Have a suggestion? Let us know." @keydown="eastereEgg1($event)" v-model="suggest" />
              </div>
            <div>
              <input type="text" v-model="name" placeholder="Your nickname?">
              <div class="button" @click="submitSuggest()">Submit</div>
            </div>
          </div>
          
          
        </div>
      </div>
    </transition>

  </div>
</template>
<script>
import { assist } from '../../assets/js/assist';
export default {
  name: "extras",
  mixins: [assist],
  data() {
    return {
      checkedUpdateInfo: false,
      showExtrasInfo: false,
      name: '',
      suggest: '',
      disabled: false,
      keyCode: [38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 66, 65],
      reKeyCode: [],
      update: [
        {
          title: '2021-1-15 (1.3.3)',
          adjust: [
            '- Slightly raised the base stat bonus from enhancing',
            '- Added a notice when the shop stocks a Unique item',
            '- Slightly raised gold from kills',
            '- Added a really cool-looking +13 effect',
          ],
          bug: [
            '- Fixed: in some cases HP wasn’t fully restored after an Endless win',
          ]
        },
        {
          title: '2020-12-11 (1.3.2)',
          desc: '- UI issues will be fixed next version; the author is currently hooked on Cyberpunk2077',
          adjust: [
            '-  Shop gear level is no longer capped; it follows your level',
            '-  Added percentage block affix',
          ],
          bug: [
            '- Fixed: Endless level and character level could go negative (thanks 天狐 and 鸡鸡姬 for the bug report)',
            '- Fixed: with Endless repeat checked, Hard and Extreme dungeons could also be repeated (thanks konoha and 游戏玩家 for the bug report)'
          ]
        },
        {
          title: '2020-12-09 (1.3.1)',
          desc: '- When reporting bugs, please describe them precisely😄',
          adjust: [
            '-  Endless difficulty: Extreme dungeon of level floor*10 -> an Extreme dungeon of level floor*5',
          ],
          majorization: [
            '- Slightly raised gold income',
            '- Auto-enhance no longer costs double gold; same cost as manual',
            '- Percentage affixes rebalanced to give higher stats at low levels',
            '- Raised stats on some gear with armor affixes',
          ],
          bug: [
            '- Fixed: block value lower than expected after enhancing',
          ]
        },
        {
          title: '2020-12-08 (1.3.0)',
          desc: '- If you hit a bug or balance issue, please send feedback.',
          adjust: [
            '-  Added Rebirth: rebirth grants points that raise your base stats',
            '-  New dungeon refresh rule: dungeons now follow your level. Use the refresh button in the menu bar(30S cd)',
            '-  Dungeons are now randomly generated instead of fixed: harder, with more gold',
            '-  Accessory slot split into Ring and Necklace; new necklaces added',
            '-  Endless floor can now be reset',
            '-  Added the Block affix',
            '-  Armor formula changed; the cap went from 100% to95%',
          ],
          majorization: [
            '-  Added a new font',
            '-  Reforging now shows each affix’s roll quality, so you can tell if it’s the best roll',
          ],
          bug: [
            '- Fixed HP regen not working after failing a dungeon in the backgroundbug',
            '- auto-sell price lower than expected',
          ]
        },
        {
          title: '2020-11-30 (1.2.2)',
          desc: '- Mostly small improvements this time.',
          adjust: [
            '-  Auto-enhance added: set a target level in the enhance panel (costs double gold)',
            '-  Click Clear Save at the bottom right to restart the game. Be careful, or back up your save first',
            '-  You can now choose which rarities to auto-sell in the backpack (thanks 执着 for the bug report)',
          ],
          majorization: [
            '- Improved the mobile layout; it looks like plenty of people play on phones',
          ],
          bug: [
            '- Fixed an error when manually ending a challenge',
          ]
        },
        {
          title: '2020-11-26 (1.2.1)',
          desc: '- You can now leave suggestions or bug reports right below the update notes.',
          adjust: [
            '-  Shop can now be refreshed with gold',
            '-  Endless mode now supports auto-challenge',
          ],
          majorization: [
            '- The game now saves after enhancing',
            '- Dungeons strengthened further',
            '- Gear stat adjustments',
          ],
        },
        {
          title: '2020-11-25 (1.2.0)',
          desc: '- First update in over two weeks, with quite a few changes',
          adjust: [
            '-  Added save import/export: a full backpack makes the save data long, so clean up your backpack before exporting ',
            '-  Added auto-sell: enable it in the backpack to sell low-quality gear (below Artifact)',
            '-  Added gear enhancing and affix reforging (costs gold)',
            '-  Added Unique armor and accessories',
          ],
          majorization: [
            '- Dungeons are stronger (Lv1 barely changed, Lv100 is about 5x stronger, scaling linearly)',
            '- Added some animations',
            '- Gear stat adjustments',
            '- Unique drop rate changed to 4%; the shop has a small chance to stock Unique gear',
            '- Selling gear now gives 3x gold; high-level dungeons give more gold'
          ],
          bug: [
            '- Fixed auto-sell possibly selling other backpack itemsbug',
          ]
        }, {
          title: '2020-11-09 (1.1.1)',
          adjust: [
            '-  Mobile support',
          ],
        },
        {
          title: '2020-11-06 (1.1.0)',
          desc: '',
          adjust: [
            '- (Feature) Added gear locking',
            '- (Feature) Gear can roll percentage affixes',
            '- (Feature) Added Lv60-100 dungeons',
            '- (Feature) Completing a dungeon may drop Unique gear (2.5% on clear, never in Endless)',
            '- (Feature) Beating the game unlocks Endless mode'
          ],
          majorization: [
            '- (Tweak) Shop prices adjusted (cheaper early, pricier late); shop item level now caps at 110',
            '- (Tweak) Adjusted and added some new gear',
            '- (Tweak) Raised difficulty of Lv90 and Lv100 dungeons'
          ],
          bug: [
            '- (Bug) Fixed manually ending a dungeon possibly speeding it up bug'
          ]
        },]
    };
  },
  mounted() {
    this.checkedUpdateInfo = localStorage.getItem('version') == "1.2.2" ? true : false
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
      localStorage.setItem('version', '1.2.2')
    },
    closePanel() {
      localStorage.setItem('version', '1.2.2')
      this.showExtrasInfo = false
    },
    navToGithub() {
      window.open('https://github.com/Couy69/vue-idle-game', '_blank');
    },
    async submitSuggest() {
      if (this.disabled) {
        return
      }
      try {
        let data = await this.$api.post(
          "v1/Suggest/add",
          {
            name: this.name,
            suggest: this.suggest,
          }
        );
        console.log(data)
        if (data.data.error_code == 20000) {
          this.$store.commit("set_sys_info", {
            msg: `
              Your suggestion was submitted. Thank you!😘
            `,
            type: 'win'
          });
          this.name = ''
          this.suggest = ''
        } else {
          this.$store.commit("set_sys_info", {
            msg: `
              Submit failed: ${data.data.msg}
            `,
            type: 'win'
          });
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
.extras {
  position: fixed;
  width: 0.5rem;
  height: 0.55rem;
  display: flex;
  bottom: 0.1rem;
  right: 0.8rem;
  z-index: 2;
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
    height: calc(100% - 2rem);
    overflow-y: auto;
    .vision {
      font-size: 0.16rem;
    }
    a {
      color: #fff;
      text-decoration: underline;
      font-size: 0.14rem;
      user-select: initial;
    }
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
      padding-left: 0.25rem;
      line-height: 0.2rem;
      color: #fafafa;
      font-size: 0.13rem;
      letter-spacing: 1px;
    }
  }
}
.footer {
  border-top: 1px solid #444;
  position: absolute;
  bottom: 0;
  left: 0;
  background: #111;
  width: 100%;
  height: 2rem;
  padding: 0.1rem 0.3rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .github {
    margin-bottom: 0.1rem;
    margin-left: 0.1rem;
    background: #fafafa;
    display: block;
    width: 0.32rem;
    height: 0.32rem;
    border-radius: 50%;
    background-image: url(../../assets/icons/github.svg);
    background-size: cover;
  }
  .footer-suggest {
    flex: 1;
    padding: 0 0.2rem;
    & > div {
      width: 100%;
      display: flex;
      margin: 0.1rem;
      justify-content: space-between;
    }
    textarea {
      width: 90%;
      height: 1rem;
      max-width: 4rem;
      max-height: 1.5rem;
    }
  }
  .footer-github {
    width: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    & > div {
      display: flex;
      margin: 0.1rem;
      justify-content: space-between;
    }
    span {
      text-align: center;
    }
  }
}
</style>
