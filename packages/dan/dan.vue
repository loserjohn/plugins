<!--
 * @Author       : xh
 * @Date         : 2022-06-16 16:20:40
 * @LastEditors  : xh
 * @FileName     :   
-->

<template>
  <div class="components">
    <div class="containerdanBox">
      <aside class="title">{{ title }}</aside>

      <div class="containerdan" :style="backgropundStyle">
        <div class="danBar" :class="animate ? 'animetdMove' : ''" :style="valueStyle">
          <span v-show="value" class="labels" :style="{ color: activeColor }">{{ percent || localPercent }}% </span>
        </div>
        <div class="target" :style="targetStyle">
          <span v-if="target" class="labels" :style="{ color: targetColor }">{{ target }}</span>
        </div>
      </div>
      <!-- <aside class="title">{{ sum }}</aside> -->
    </div>
    <div v-if="showTip" class="flex footer">
      <div class="stip1" :style="{ background: activeColor }" />
      <span class="texts">{{ stipText }}</span>
      <div class="stip2" :style="{ background: targetColor }" />
      <span class="texts">{{ targetText }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'yp-dan',
  components: {},
  props: {
    //左边的标题
    title: {
      type: String,
      default: '流水'
    },
    value: {
      type: Number,
      default: 80 //有效值
    },
    animate: {
      type: Boolean,
      default: true //有效值
    },
    // 目标值
    target: {
      type: Number,
      default: 90
    },
    //是否显示底部的deleng
    showTip: {
      type: Boolean,
      default: true
    },

    //颜色相关
    targetColor: {
      type: String,
      default: ''
    },
    activeColor: {
      type: String,
      default: ''
    },
    backColor: {
      type: String,
      default: ''
    },

    //左边示例 颜色
    stipText: {
      type: String,
      default: '实际进度'
    },
    //右边示例 颜色
    targetText: {
      type: String,
      default: '目标进度'
    }
  },
  data() {
    return {
      range: 1,
      ctime: 1,
      loading: false,
      // queryTime: [moment().subtract('days', 1).format('YYYY-MM-DD'), moment().subtract('days', 1).format('YYYY-MM-DD')],
      cusdashboardList: []
    }
  },
  computed: {
    percent() {
      const s = ((this.value * 100) / this.sum).toFixed(2)

      return s
    },
    sum() {
      return Math.max(this.target, this.value)
    },
    valueStyle() {
      const s = ((this.value * 100) / this.sum).toFixed(2)
      console.log(98, this.activeColor)
      return {
        width: `${s}%`,
        background: this.activeColor || '-webkit-linear-gradient(right, #44b4e7, #618de2, #44b4e7, #9795f9, #44b4e7)'
      }
    },
    targetStyle() {
      let s = (this.target * 100) / this.sum

      return {
        left: `${s.toFixed(2)}%`,
        background: this.targetColor || 'rgb(25, 206, 107)'
      }
    },
    localPercent() {
      const s = ((this.value * 100) / this.sum).toFixed(2)
      return s
    },
    backgropundStyle() {
      return {
        background: this.backColor || 'rgb(224, 240, 253)'
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {}
  }
}
</script>
<style lang="scss" scoped>
$color: rgb(25, 206, 107);
$bar: linear-gradient(right, #44b4e7, #618de2, #44b4e7, #9795f9, #44b4e7);
.components {
  .containerdanBox {
    width: 100%;
    padding: 20px 0;
    position: relative;
    display: flex;
    align-items: center;
    .title {
      width: 70px;
      margin-right: 5px;
    }
    .containerdan {
      width: 100%;
      height: 30px;
      background-color: rgb(224, 240, 253);
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .danBar {
        width: 0%;
        height: 22px;
        background: $bar;

        // background-position-x: 0%;
        position: relative;
        text-align: right;
        line-height: 22px;
        color: #fff;
        padding-right: 10px;
        border-radius: 0 4px 4px 0;
        transition: width 0.3s ease-out;
        .labels {
          position: absolute;
          right: 0;
          bottom: -24px;
          color: rgb(41, 120, 238);
          font-size: 12px;
          // width: 100px;
        }
      }
      .animetdMove {
        background-size: 200% 100% !important;
        animation: bgmove 2s linear infinite;
      }
    }
    .target {
      width: 2px;
      height: 30px;
      background: $color;
      position: absolute;
      // top: 0;
      left: 60%;
      .labels {
        color: $color;
        position: absolute;
        top: -20px;
        width: 100px;
        left: 50%;
        margin-left: -50px;
        text-align: center;
      }
    }
  }
  .footer {
    justify-content: flex-start;
    display: flex;
    justify-content: center;
    align-items: center;
    .stip1 {
      width: 16px;
      height: 16px;
      background: $bar;
      margin: 0 10px;
    }
    .stip2 {
      width: 2px;
      height: 16px;
      background: $color;
      margin: 0 10px;
    }
  }
}
@keyframes bgmove {
  0% {
    background-position: 100% 0%;
  }

  100% {
    background-position: -100% 0%;
  }
}
</style>
