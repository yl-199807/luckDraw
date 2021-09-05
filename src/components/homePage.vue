<template>
  <div class="homPage-wrap">
    <div class="luck-draw-wrap">
      <header class="header-wrap">
        <svg t="1630142191932" class="icon-wrap" viewBox="0 0 1024 1024" version="1.1"
             xmlns="http://www.w3.org/2000/svg" p-id="7506" width="28" height="28">
          <path
            d="M372.2496 329.9584L208.64 481.4592h-107.52v163.84a64.1792 64.1792 0 0 0 64 64h212.48l107.52 99.5328V289.4592c0-35.2-58.1376-10.1632-112.8704 40.4992z"
            fill="#EE7C3D" p-id="7507"></path>
          <path
            d="M572.16 243.9936v533.7856l-138.9056-128.6144-23.552-21.7856H183.04v-232.96H409.6l23.552-21.8112 139.008-128.6144m65.8944-139.9296c-21.0688 0-59.7248 22.5792-96.8448 56.9344l-163.6096 151.5008h-212.48a64.1792 64.1792 0 0 0-64 64v268.8a64.1792 64.1792 0 0 0 64 64h212.48l163.6096 151.4752c37.0944 34.3552 75.776 56.9344 96.8448 56.9344 10.0096 0 16.0256-5.12 16.0256-16.4096v-780.8c0-11.3408-6.0416-16.4352-16.0256-16.4352zM881.92 551.8592h-86.8608a40.96 40.96 0 0 1 0-81.92h86.8608a40.96 40.96 0 0 1 0 81.92zM880.64 921.9328a40.8064 40.8064 0 0 1-28.9792-12.0064l-90.3424-90.3424A40.96 40.96 0 0 1 819.2 761.6512l90.3424 90.3424A40.96 40.96 0 0 1 880.64 921.9328zM795.2384 269.312a40.96 40.96 0 0 1-28.9536-69.9136l85.3248-85.3248a40.96 40.96 0 0 1 57.9328 57.9328L824.32 257.3312a40.96 40.96 0 0 1-29.0816 11.9808z"
            fill="#333333" p-id="7508"></path>
        </svg>
        <span>幸运抽奖</span>
      </header>
      <main class="main-wrap">
        <div class="topbar-wrap">
          <div>当前矿石数：{{ currentCount }}</div>
          <el-button size="small" style="border-radius: 50px; background: rgba(255,215,147,.3); border: none"><span
            class="span-wrap">已签到</span></el-button>
        </div>
        <div class="game-box">
          <div class="game-innerbox">
            <template
              v-for="(val, idx) of prizeList">
              <div v-if="idx === 4" class="game-item game-begin"
                   :key="idx"
                   @click="beginGame">
                <div class="luck-draw">抽奖</div>
                <div>{{ luckDrawUse }} 矿石/次</div>
              </div>
              <div v-else :key="idx"
                   class="game-item"
                   :class="{
            active: idx === curGameIdx
            }">
                <div class="image-wrap"><img class="image" :src="require(`../assets/prize${Number(idx+1)}.png`)" alt="">
                </div>
                <div class="text">{{ val }}</div>
              </div>
            </template>
          </div>
        </div>
      </main>
    </div>
    <div class="sidebar">
      <h1 class="history-prize-title">历史奖品</h1>
      <template v-for="item in historyPrize">
        <h4 class="history-prize">{{ item }}</h4>
      </template>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'homePage',
  data () {
    return {
      currentCount: 800,  // 当前矿石数
      prizeListStatic: ['66矿石', '随机限量徽章', '掘金新款T恤', 'Bug', '', '乐高海洋巨轮', '掘金限量桌垫', 'Yoyo抱枕', 'Switch'], // 静态
      prizeListDynamic: [],
      prizeList: [],
      curGameIdx: 0, // 当前选中商品索引
      luckDrawUse: 200,  // 每次消耗钻石数
      Order_List: [0, 1, 2, 5, 8, 7, 6, 3],
      testNum: 0, // 随机次之后停下来
      historyPrize: [],  // 历史奖品
      probabilityArr: [30,10,5,3,2,5,10,35]  // 概率数组, 要求数组和为100，每个数字对应奖品的百分制
      // '66矿石'30%, '随机限量徽章'10%, '掘金新款T恤'5%, '乐高海洋巨轮'3%, 'Switch'2%, 'Yoyo抱枕'5%, '掘金限量桌垫'10%, 'Bug'35%
    }
  },
  created () {
    axios.get('http://localhost:3002/api/prize').then(res => {
      if(res.status === 200) {
        this.prizeList = res.data.prizeList
        console.log("奖品信息为后端获取")
      }
    }).catch(err => {
      console.log(err, "后端接口请求失败")
      this.prizeList = this.prizeListStatic
      console.log("奖品信息为静态")
    })

    // 登录，待完成
    axios.get('http://localhost:3002/api/login',{
      username: 'admin',
      password: '123456'
    }).then(res => {
      if(res.status === 200) {
        console.log(res,"resresres")
      }
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    /**
     * 设置概率
     * @param arr 概率数组
     * @returns {number} 奖品几的索引
     * e.g. getResult([20,30,50]) 返回0为20%概率的奖品1，1为30%概率的奖品2，2为50%概率的奖品3
     * 测试概率计算是否准确：let res=[0,0,0,0,0,0,0,0]; for(let i=0; i<100000; i++){res[getResult([30,10,5,3,2,5,10,35])] += 1};  结果res=[30020, 9904, 5056, 2950, 2048, 4899, 10159, 34964]
     */
    getResult (arr) {
      let leng = 0
      for (let i = 0; i < arr.length; i++) {
        leng += arr[i]                                     //获取总数
      }
      for (let i = 0; i < arr.length; i++) {
        let random = parseInt(Math.random() * leng)       //获取 0-总数 之间的一个随随机整数
        if (random < arr[i]) {
          return i                                     //如果在当前的概率范围内,得到的就是当前概率
        } else {
          leng -= arr[i]                                 //否则减去当前的概率范围,进入下一轮循环
        }
      }
    },

    beginGame () {
      if (this.currentCount < 200) {
        alert('矿石不够辣~~')
        return
      } else {
        const that = this
        that.currentCount -= that.luckDrawUse
        // let randomNum = 16 + Math.floor(Math.random() * 10) //randomNum=17(奖品1),18(奖品2),19(奖品3),...24(奖品8)
        let randomNum = 17 + this.getResult(this.probabilityArr)
        let arr = JSON.parse(JSON.stringify(this.Order_List))
        that.testNum = 0 //清空定时器执行数目
        that.curGameIdx = 0  //清空当前的奖品
        let int = setInterval(() => {
          // console.log(that.testNum)
          if (that.testNum === randomNum) {
            clearInterval(int)
            alert(`恭喜您获得 ${that.prizeList[that.curGameIdx]}`)
            this.historyPrize.push(that.prizeList[that.curGameIdx])
            if (that.curGameIdx === 0) {  // 66矿石
              that.currentCount += 66
            }
            return
          }
          that.testNum++
          if (arr.length) {
            that.curGameIdx = arr.shift()
          } else {
            arr = JSON.parse(JSON.stringify(that.Order_List))
            that.curGameIdx = arr.shift()
          }
        }, 80)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$wrapWidth: 43vw;
$gameItemWidth: calc((43vw - 30px - 20px - 6px) / 3 - 4px); /* $wrapWidth/3向下取整 */
.homPage-wrap {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 80vh;

  .luck-draw-wrap {
    color: white;
    width: $wrapWidth;
    /*position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);*/
    display: flex;
    align-items: center;
    flex-direction: column;

    .header-wrap {
      display: flex;
      justify-content: flex-start;
      align-items: baseline;
      width: $wrapWidth;

      .icon-wrap {

      }
    }

    .main-wrap {
      width: $wrapWidth;

      .topbar-wrap {
        margin: 10px 5px;
        display: flex;
        justify-content: space-between;
        align-items: baseline;

        .span-wrap {
          color: #c9cdd4;
          line-height: 20px;
          padding: 0 5px;
          font-size: 16px;
        }
      }

      .game-box {
        color: #AF6819;
        background-color: #E17322;
        border: 15px solid #F9D796;
        border-radius: 12px;

        .game-innerbox {
          display: flex;
          flex-wrap: wrap;
          text-align: center;
          border: 10px solid #E17322;

          .game-item {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            justify-content: center;
            width: $gameItemWidth;
            height: 15vh;
            background: #FCF3F4;
            border-radius: 4px;
            /* border: 2px solid #E17322; */
            margin: 3px;
            transition: all 0.2s;

            .luck-draw {
              font-size: 32px;
              line-height: 42px;
              font-weight: 600;
              color: #a74b00;
              width: 100%;
            }

            &.game-begin {
              background: #ffe6a6;
              box-shadow: inset 0 0 16px #ffa800;
            }

            &.active {
              background-color: #F9CD8C;
            }

            .image-wrap {
              width: $gameItemWidth;

              .image {
                max-width: 50px;
              }
            }
          }
        }
      }
    }
  }

  .sidebar {
    margin-top: 80px;
    width: 20vw;
    height: 400px;
    border-radius: 12px;
    background: rgba(255, 247, 232, .3);
    padding: 16px;
    box-sizing: border-box;
    text-align: center;
    overflow: auto;

    .history-prize-title {
      color: #fadd95;
      font-size: 20px;
      line-height: 28px;
    }

    .history-prize {
      color: #FCF3F4;
    }
  }
}
</style>
