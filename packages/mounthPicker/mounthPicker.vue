<template>
  <div id="boxArea" v-clickOutside="out" class="selectMonthBoxSquare clearFixed">
    <span v-if="required" class="dot">*</span>
    <!-- el-input输入框：readonly和clearable属性不能同时使用 -->
    <el-input v-model="inputValue" class="inputStyle" type="text" placeholder="请选择查询月份" readonly @focus="showBox = true">
      <i slot="prefix" class="el-input__icon el-icon-date" />
      <!-- 清空图标：有内容的时候渲染出来，鼠标hover到input框的时候再显示出来（即：输入框有内容并且鼠标悬浮时显示该图标） -->
      <i v-if="showClear" slot="suffix" class="el-input__icon el-icon-circle-close clearIconStyle" @click="resetMonth(true)" />
    </el-input>
    <el-tooltip v-if="showTips" class="item" effect="dark" :content="inputValue" placement="top-start">
      <!-- <el-button type="info" plain icon="el-icon-info" circle size="small"> </el-button> -->
      <i class="el-icon-info"></i>
    </el-tooltip>
    <span v-if="showSum" class="suffix"> 共:{{ resultTimes.length }}</span>
    <!-- 年份月份选择弹框 -->
    <div v-if="showBox" class="selectContentBox">
      <div class="contentArea">
        <!-- 年份 -->
        <div class="mounth mounth-wrap mounth-around" style="padding: 15px 0; border-bottom: 1px solid #e5e5e5">
          <!-- <img src="../../../images/left_icon_gray.png" alt="" /> -->
          <!-- <div v-if="curIndex == DateList.length - 1" class="cursor" style="width: 15%">
            <el-button icon="el-icon-arrow-left" circle size="small"></el-button>
          </div> -->
          <!-- <img src="../../../images/left_icon.png" alt="" /> -->
          <div class="cursor" style="width: 15%">
            <el-button :disabled="curIndex >= DateList.length - 1" icon="el-icon-d-arrow-left" circle size="small" @click="reduceYear"></el-button>
          </div>
          <div>{{ OneY }}年</div>
          <!-- <img src="../../../images/right_icon_gray.png" alt="" /> -->
          <!-- <div v-if="curIndex == 0" class="cursor t-r" style="width: 15%">
            <el-button icon="el-icon-arrow-right" circle size="small"></el-button>
          </div> -->
          <!-- <img src="../../../images/right_icon.png" alt="" /> -->

          <div class="cursor t-r" style="width: 15%">
            <el-button :disabled="curIndex <= 0" icon="el-icon-d-arrow-right" circle size="small" @click="addYear"></el-button>
          </div>
        </div>
        <!-- 月份 -->
        <div class="conterList">
          <!-- <el-checkbox-group v-model="optTime[curIndex].queryTime" class="mounth mounth-wrap monthLeft" @change="onChange">
            <el-checkbox v-for="(item, index) in DateList[curIndex].queryTime" :key="index" class="onSelect" :label="`${DateList[curIndex].TimeYear}-${item <= 9 ? `0${item}` : item}`"> {{ monthMap[item] }}月 </el-checkbox>
          </el-checkbox-group> -->

          <div class="mounth mounth-wrap monthLeft">
            <div v-for="(item, index) in DateList[curIndex].queryTime" :key="index" :class="filterClass(item)">
              <div class="selectOptions" @click="onSelect(item)">{{ monthMap[item] }}月</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 按钮 -->
      <div class="buttonBox t-r">
        <span class="suffix" style="margin-right: 10px"> (已选:{{ optTimes.length }})</span>
        <el-button class="buttonStyle" size="small" type="primary" @click.stop="handleSubmit">确定</el-button>
        <el-button class="buttonStyle" size="small" plain @click.stop="resetMonth(false)">重置</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import clickOutside from './clickOut/index.js'
export default {
  name: 'yp-mounth-picker',
  directives: {
    clickOutside
  },
  props: {
    //@xh专属注释
    //@name: v-model绑定的值
    //@params:
    //@des:
    value: {
      type: Array,
      default: () => []
    },

    //@xh专属注释
    //@name:获取 前多少年的数据  默认为 20
    //@params:
    //@des:
    yearlength: {
      type: Number,
      default: 20
    },

    //@xh专属注释
    //@name:是否 是必选  是的话 默认 当前月份必选
    //@params:
    //@des:
    required: {
      type: Boolean,
      default: false
    },
    //@xh专属注释
    //@name:是否显示提示图标
    //@params:
    //@des:
    showTips: {
      type: Boolean,
      default: false
    },
    //@xh专属注释
    //@name:是否显示总数
    //@params:
    //@des:
    showSum: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      DateList: [], // 年份月份数组
      optTime: [], // 月份选中结果数组
      OneY: '', // 当前年份
      curIndex: 0, // 当前年份下标值
      optTimes: [], // 点击月份时的所有选中结果
      resultTimes: [], // 点击“确定”按钮后的选择结果
      showBox: false, // 是否显示月份选择弹框
      inputValue: '', // 输入框的绑定值
      showClear: false, // 是否显示输入框右边的“清空”小图标
      monthMap: {
        // 月份显示为中文
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六',
        7: '七',
        8: '八',
        9: '九',
        10: '十',
        11: '十一',
        12: '十二'
      },
      defaultValue: [] //记录初始值
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.defaultValue = [...this.value]
    this.initDetault()
  },
  methods: {
    //@xh专属注释
    //@name:判读是选中样式
    //@params:
    //@des:
    filterClass(key) {
      const labels = `${this.DateList[this.curIndex].TimeYear}-${key <= 9 ? `0${key}` : key}`
      const days = this.optTime[this.curIndex].queryTime
      if (days.indexOf(labels) > -1) {
        // 有
        return 'onSelect'
      } else {
        // 无
        return 'select'
      }
    },
    //@xh专属注释
    //@name:
    //@params:
    //@des:选择时间回调
    onSelect(key) {
      const labels = `${this.DateList[this.curIndex].TimeYear}-${key <= 9 ? `0${key}` : key}`
      const days = this.optTime[this.curIndex].queryTime

      if (days.indexOf(labels) > -1) {
        // 反选
        const index = days.indexOf(labels)
        this.optTime[this.curIndex].queryTime.splice(index, 1)
      } else {
        // 添加
        this.optTime[this.curIndex].queryTime.push(labels)
      }

      // console.log(this.optTime, key)
      const arr = []
      for (let item in this.optTime) {
        if (this.optTime[item].queryTime && this.optTime[item].queryTime.length > 0) {
          arr.push(...this.optTime[item].queryTime)
        }
      }
      this.optTimes = arr
      this.inputValue = arr.join(',')
      // console.log('xh', this.optTimes)
    },
    //@xh专属注释
    //@name:组件失去焦点触发 值校验
    //@params:
    //@des:
    out() {
      // console.log(123)

      // 判断当前选中月份与上次点击“确定”按钮时的选择结果是否一致
      const arr = [...this.resultTimes]
      const arr2 = [...this.optTimes]
      let equalArr = arr.sort().toString() == arr2.sort().toString()

      // debugger
      if (!equalArr) {
        // 如果不一致（因为是多选，所以必须是点击了“确定”按钮后才能进行查询）：
        // 将选择结果恢复到上次点击“确定”按钮时的结果
        this.optTimes = this.resultTimes
        // 将输入框的值恢复到上次点击“确定”按钮时的值
        this.inputValue = this.optTimes.join(',')
        // 根据输入框是否有值来判断清空图标是否渲染
        this.showClear = this.inputValue == '' ? false : true
        // 将月份选中结果恢复到上次点击“确定”按钮时的选中月份
        let _opt = this.resultTimes.map((v) => {
          return v.substring(0, 4)
        })
        for (let item in this.optTime) {
          this.optTime[item].queryTime = []
          _opt.map((items, indexs) => {
            if (items == this.optTime[item].TimeYear) {
              this.optTime[item].queryTime.push(this.resultTimes[indexs])
            }
          })
        }
      }
      this.showBox = false
      // 关
    },
    //@xh专属注释
    //@name:默认值设置
    //@params:
    //@des:
    checkResult(bool = false) {
      if (this.required) {
        let date = new Date() // Sat Jul 06 2019 19:59:27 GMT+0800 (中国标准时间)
        //获取当前年份：
        let year = date.getFullYear() // 2019
        //获取当前月份：
        let month = date.getMonth() + 1 // 7

        month = month > 9 ? month : '0' + month
        let today = year + '-' + month // 2019-07-06
        this.optTimes = [today]

        this.resultTimes = [today]
        // 将输入框的值恢复到上次点击“确定”按钮时的值
        this.inputValue = today
        let _opt = this.resultTimes.map((v) => {
          return v.substring(0, 4)
        })
        // console.log('xh', _opt, this.optTime)
        for (let item in this.optTime) {
          this.optTime[item].queryTime = []
          _opt.map((items, indexs) => {
            if (items == this.optTime[item].TimeYear) {
              this.optTime[item].queryTime.push(this.resultTimes[indexs])
            }
          })
        }
      }
      if (bool) {
        this.$emit('input', this.resultTimes)
      }
    },
    //@xh专属注释
    //@name:初始化默认值设置
    //@params:
    //@des:
    initDetault() {
      let date = new Date() // Sat Jul 06 2019 19:59:27 GMT+0800 (中国标准时间)
      //获取当前年份：
      let year = date.getFullYear() // 2019
      //获取当前月份：
      let month = date.getMonth() + 1 // 7

      month = month > 9 ? month : '0' + month
      let today = year + '-' + month // 2019-07-06
      if (this.defaultValue && this.defaultValue.length > 0) {
        this.optTimes = [...this.defaultValue]
        this.resultTimes = [...this.defaultValue]
        this.inputValue = this.defaultValue.join(',')
        this.$emit('input', [...this.defaultValue])
      } else if (this.required) {
        this.optTimes = [today]

        this.resultTimes = [today]
        // 将输入框的值恢复到上次点击“确定”按钮时的值
        this.inputValue = today
        this.$emit('input', [today])
      } else {
        this.$emit('input', [])
      }

      let _opt = this.resultTimes.map((v) => {
        return v.substring(0, 4)
      })
      // console.log('xh', _opt, this.optTime)
      for (let item in this.optTime) {
        this.optTime[item].queryTime = []
        _opt.map((items, indexs) => {
          if (items == this.optTime[item].TimeYear) {
            this.optTime[item].queryTime.push(this.resultTimes[indexs])
          }
        })
      }
    },
    // 初始化数据，获取前20年，然后循环 每一年里面都有12个月的 得到数组 opTime 和 DateList
    init() {
      let date = new Date() // Sat Jul 06 2019 19:59:27 GMT+0800 (中国标准时间)
      //获取当前年份：
      let year = date.getFullYear() // 2019
      //获取当前月份：
      let month = date.getMonth() + 1 // 7
      const _this = this
      let _opt = []
      let _optTime = []
      let arr = new Array(12)
      let optDate = this.getDateList()
      // console.log('xh123123', optDate)
      optDate.map((item, index) => {
        // 月份选择时el-checkbox-group绑定的值
        _optTime[index] = {
          TimeYear: item,
          queryTime: []
        }
        // 给每一年份设置12个月份，el-checkbox初始化显示时使用
        _opt[index] = {
          TimeYear: item,
          queryTime: []
        }
        for (let i = 1; i <= arr.length; i++) {
          if (item !== year || month >= i) {
            _opt[index].queryTime.push(i)
          }
        }
      })
      console.log('xh1223', _opt)
      _this.optTime = _optTime
      _this.DateList = _opt
    },
    // 获取近20年年份列表，倒序排列，最新一年在最前面
    getDateList() {
      let Dates = new Date()
      let year = Dates.getFullYear()
      this.OneY = year
      let optDate = []
      for (let i = year - this.yearlength; i <= year + this.yearlength; i++) {
        optDate.push(i)
        if (i === year) {
          this.curIndex = i - (year - this.yearlength)
        }
      }

      return optDate.reverse()
    },
    // 确定
    handleSubmit() {
      const _this = this
      // 更新输入框的值
      _this.inputValue = _this.optTimes.join(',')
      // 根据输入框是否有值来判断清空图标是否渲染
      _this.showClear = _this.inputValue == '' ? false : true
      // 将点击“确定”按钮的选择结果保存起来（该值将在哪里使用：在点击弹框以外区域关闭弹框时使用，mounted中）
      _this.resultTimes = _this.optTimes
      // console.log('xh12', _this.resultTimes, _this.resultTimes.length)
      // debugger
      // 关闭弹框
      _this.showBox = false

      //全部删除 则恢复默认
      // if (_this.inputValue == '') {
      //   _this.initDetault()
      // }

      _this.$emit('input', _this.resultTimes)
      // debugger
    },
    // 重置
    resetMonth(bool = false) {
      const _this = this
      // 将年份重置到当前年份
      let Dates = new Date()
      let year = Dates.getFullYear()
      _this.OneY = year
      // 将已选择的月份清空
      _this.optTimes = []
      for (let i in _this.optTime) {
        _this.optTime[i].queryTime = []
      }
      // 将输入框清空
      _this.inputValue = ''
      // 根据输入框是否有值来判断清空图标是否渲染，此处必然不渲染
      this.showClear = false

      // 关闭月份选择弹框

      if (bool) {
        // 将点击“确定”按钮的选择结果清空
        _this.resultTimes = []
        _this.checkResult(true)
      } else {
        _this.checkResult()
      }
    },
    // 左上角年份减少
    reduceYear() {
      const _this = this
      // 如果已经是最后一年了，则年份不能再减少了
      if (_this.curIndex == _this.DateList.length - 1) return
      // 当前下标值+1，根据下标值获取年份值
      _this.curIndex = _this.curIndex + 1
      _this.OneY = _this.DateList[_this.curIndex].TimeYear
    },
    // 右上角年份增加
    addYear() {
      const _this = this
      // 如果已经是当前年份了，则年份不能再增加了
      if (_this.curIndex == 0) return
      // 当前下标值-1，根据下标值获取年份值
      _this.curIndex = _this.curIndex - 1
      _this.OneY = _this.DateList[_this.curIndex].TimeYear
    }
    // 选择月份
    // onChange() {
    //   const _this = this
    //   // 遍历optTime中已选择的月份，将已选结果塞到optTimes数组中
    //   let _opt = _this.optTime
    //   let arr = []
    //   for (let item in _opt) {
    //     if (_opt[item].queryTime.length > 0)
    //       _opt[item].queryTime.filter((v) => {
    //         arr.push(v)
    //       })
    //   }
    //   _this.optTimes = arr
    //   // 更新输入框的值
    //   _this.inputValue = _this.optTimes.join(',')
    //   // 根据输入框是否有值来判断清空图标是否渲染
    //   _this.showClear = _this.inputValue == '' ? false : true
    // }
  }
}
</script>
<style lang="scss">
.selectMonthBoxSquare {
  // margin-top: 10px;
  width: 290px;
  padding-right: 40px;
  position: relative;
  display: flex;
  align-items: center;
  .dot {
    color: red;
    position: absolute;
    left: -15px;
    top: 0;
  }
  .mounth {
    display: flex;
    // justify-content: center;
    align-items: center;
  }
  .mounth-wrap {
    flex-wrap: wrap;
  }
  .mounth-around {
    justify-content: space-between;
  }
  .inputStyle {
    width: 290px;
  }
  .clearIconStyle {
    display: none;
    cursor: pointer;
  }
  .inputStyle:hover .clearIconStyle {
    display: block;
  }
  .selectContentBox {
    position: absolute;
    top: 45px;
    left: 0;
    z-index: 2021;
    background: #ffffff;
    border: 1px solid #e5e5e5;
    border-radius: 3px;

    .contentArea {
      width: 330px;
      text-align: center;
    }
  }
  .el-icon-info {
    color: #666;
    margin-left: 10px;
    cursor: pointer;
  }
  .conterList {
    .select {
      width: 25% !important;
      margin: 20px 0 !important;
      text-align: center;

      transition: all 0.3s ease-in-out;
      .selectOptions {
        cursor: pointer;
        height: 30px;
        // background: #4ca8ff;
        color: rgb(70, 70, 70);
        text-align: center;
        margin: 0 auto;
        width: 80%;
        border-radius: 15px;
        line-height: 30px;
        &:hover {
          background: #f4f9ff;
          color: #4ca8ff;
        }
      }
    }
    .onSelect {
      width: 25% !important;
      margin: 20px 0 !important;
      text-align: center;
      transition: all 0.3s ease-in-out;
      .selectOptions {
        cursor: pointer;
        height: 30px;
        background: #4ca8ff;
        color: #fff;
        text-align: center;
        margin: 0 auto;
        width: 80%;
        border-radius: 15px;
        line-height: 30px;
        &:hover {
          box-shadow: 0 0 4px #4ca8ff;
        }
      }
    }
    .columWidth {
      width: 33.33%;
    }
    .el-checkbox__input {
      display: none !important;
    }
    .el-checkbox__label {
      padding-left: 0px !important;
    }
  }
  .selectBox {
    width: 100px;

    input {
      height: 25px;
      line-height: 25px;
    }
    .el-input .el-input__icon {
      line-height: 25px;
    }
  }
  .tagStyle {
    margin-right: 10px;
    height: 25px;
    line-height: 25px;
  }
  .lableStyle {
    font-size: 14px;
  }
  .el-button--mini {
    padding: 5px 15px;
    font-size: 12px;
    border-radius: 3px;
  }
  .buttonBox {
    border-top: 1px solid #e5e5e5;
    padding: 10px 10px 10px 0;
    text-align: center;
    justify-content: flex-end;
    display: flex;
    // width: 100%;
    align-items: center;
  }
  .cursor {
    cursor: pointer;
  }
  .suffix {
    // background: #ffffff;
    margin-left: 10px;
    // position: absolute;
    // right: 10px;
    // top: 0;
    font-size: 12px;
    color: #4ca8ff;
  }
}

// 月份靠左
.monthLeft {
  justify-content: flex-start;
}
</style>
