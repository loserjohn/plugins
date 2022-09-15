<template>
  <div class="componens">
    <div class="componensheader flex">
      <div class="siderLeftTitle">
        时间快捷选择
        <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
          <i class="el-icon-warning"></i>
        </el-tooltip>
      </div>
      <div style="flex: 1"></div>
      <div class="siderLeftTitle">
        {{ minDate | timerFormate }} 至 {{ maxDate | timerFormate }}
        <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start">
          <i class="el-icon-warning"></i>
        </el-tooltip>
      </div>
    </div>
    <div class="componensBox flex">
      <div class="siderLeft">
        <div class="siderLeftContent flex">
          <el-button size="mini" plain @click="_quick(item)" class="btns" v-for="(item, index) in btnsList" :key="index" type="primary">{{ item.text }}</el-button>
        </div>
      </div>
      <div class="siderContent">
        <div style="width: 100%">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="时间范围" name="0">
              <span slot="label">
                时间范围
                <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start"> <i class="el-icon-warning"></i> </el-tooltip
              ></span>
              <MounthPanel @pick="selectDateRange" ref="MounthPanel" />
            </el-tab-pane>
            <el-tab-pane label="自定时间" name="1">
              <span slot="label">
                自定时间
                <el-tooltip class="item" effect="dark" content="Top Left 提示文字" placement="top-start"> <i class="el-icon-warning"></i> </el-tooltip
              ></span>
              <div class="customRange">
                <div class="rangePanel">
                  <h4>过去N天</h4>
                  <el-input-number v-model="num" :step="2"></el-input-number>
                </div>
                <span>~</span>
                <div class="rangePanel">
                  <h4>过去N - S天</h4>
                  <el-input-number v-model="num" :step="2"></el-input-number>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <div class="flex componensfooter">
      <el-button size="small" class="btns" type="text">取消</el-button>
      <el-button size="small" class="btns" type="primary">确定</el-button>
    </div>
  </div>
</template>

<script>
import MounthPanel from './mounthPanel'
import { formatDate, parseDate, isDate, modifyDate, modifyTime, modifyWithTimeString, prevYear, nextYear, prevMonth, nextMonth, nextDate, extractDateFormat, extractTimeFormat } from '../utils/date-util'
import moment from 'moment'
const defaultShotCut = {
  yestoday: {
    text: '昨日至今',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
      return [start, end]
    }
  },
  last7day: {
    text: '过去7天',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
      return [start, end]
    }
  },
  last14day: {
    text: '过去14天',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 13)
      return [start, end]
    }
  },
  last30day: {
    text: '过去30天',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
      return [start, end]
    }
  },
  last60day: {
    text: '过去60天',
    onClick(picker) {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 59)
      return [start, end]
    }
  },
  toweek: {
    text: '本周',
    onClick(picker) {
      const end = new Date()
      const weekOfDay = parseInt(moment().format('E'))
      const start = moment()
        .startOf('day')
        .subtract(weekOfDay - 1, 'days')
        .toDate()
      return [start, end] //周一日期
    }
  },
  lastweek: {
    text: '上周',
    onClick(picker) {
      const end = new Date()
      const weekOfDay = parseInt(moment().format('E'))
      const start = moment()
        .startOf('day')
        .subtract(weekOfDay + 6, 'days')
        .toDate() //周一日期

      return [start, end]
    }
  },
  tomounth: {
    text: '本月',
    onClick(picker) {
      const startTime = moment(moment().month(moment().month()).startOf('month').valueOf())
      const endTime = moment(moment().month(moment().month()).endOf('month').valueOf())

      return [startTime, endTime]
    }
  },
  lastmounth: {
    text: '上月',
    onClick(picker) {
      const startTime = moment(
        moment()
          .month(moment().month() - 1)
          .startOf('month')
          .valueOf()
      )
      const endTime = moment(
        moment()
          .month(moment().month() - 1)
          .endOf('month')
          .valueOf()
      )

      return [startTime, endTime]
    }
  },
  toseason: {
    text: '本季度',
    onClick(picker) {
      const startTime = moment(moment().quarter(moment().quarter()).startOf('quarter').valueOf())
      const endTime = new Date()

      return [startTime, endTime]
    }
  },
  lastseason: {
    text: '上季度',
    onClick(picker) {
      const startTime = moment(
        moment()
          .quarter(moment().quarter() - 1)
          .startOf('quarter')
          .valueOf()
      )
      const endTime = moment(
        moment()
          .quarter(moment().quarter() - 1)
          .endOf('quarter')
          .valueOf()
      )

      return [startTime, endTime]
    }
  },
  toyear: {
    text: '本年度',
    onClick(picker) {
      const startTime = moment(moment().year(moment().year()).startOf('year').valueOf())
      const endTime = new Date()
      return [startTime, endTime]
    }
  },
  lastyear: {
    text: '上年度',
    onClick(picker) {
      const startTime = moment(
        moment()
          .year(moment().year() - 1)
          .startOf('year')
          .valueOf()
      )
      const endTime = moment(
        moment()
          .year(moment().year() - 1)
          .endOf('year')
          .valueOf()
      )

      return [startTime, endTime]
    }
  }
}

export default {
  components: {
    MounthPanel
  },
  props: {
    shoptcuts: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeName: 0,
      btnsList: [],
      num: 0,
      minDate: null,
      maxDate: null
    }
  },

  mounted() {
    if (this.shoptcuts && this.shoptcuts.length > 0) {
      const arr = []
      this.shoptcuts.map((item) => {
        if (defaultShotCut[item]) {
          arr.push(defaultShotCut[item])
        }
      })
      this.btnsList = [...arr]
    } else {
      this.btnsList = [...Object.values(defaultShotCut)]
    }
    // debugger
  },
  filters: {
    timerFormate(v) {
      if (!v) return '--'
      return formatDate(v)
    }
  },
  methods: {
    // 快捷选择
    _quick(e) {
      const { onClick } = e
      const res = onClick()
      // this.minDate = res[0]
      // this.maxDate = res[1]
      // debugger

      const start = res[0] instanceof moment ? res[0].toDate() : res[0]
      const end = res[1] instanceof moment ? res[1].toDate() : res[1]

      // debugger
      this.$refs.MounthPanel.handleRangePick({
        minDate: start,
        maxDate: end
      })
    },
    handleClick(e) {
      // debugger
      const index = e.index
      this.activeName = index
    },
    selectDateRange(e) {
      this.minDate = e[0]
      this.maxDate = e[1]
    }
  }
}
</script>

<style lang="scss" scoped>
.componens {
  width: 890px;
  box-shadow: 0 0 8px #e4e7ed;
  border-radius: 8px;
  box-sizing: border-box;
  .componensheader {
    border-bottom: 1px solid #e4e7ed;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    // margin-bottom: 14px;
    .siderLeftTitle {
      line-height: 38px;

      color: #606266;
      font-size: 14px;
    }
  }
  .componensBox {
    width: 100%;
    overflow: hidden;
    // background: red;
    box-sizing: border-box;
    // height: 416px;
    align-items: flex-start;
    // padding: 20px;
    .siderLeft {
      width: 200px;
      height: 100%;
      padding-top: 10px;
      .siderLeftContent {
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: flex-start;
        padding: 0 6px;
        .btns {
          flex: 0 0 45%;
          margin: 4px;
        }
      }
    }
    .siderContent {
      flex: 1;
      padding: 0 20px 10px 15px;
      border-left: 1px solid #e4e7ed;
      min-height: 300px;
      .siderRightTitle {
        border-bottom: 1px solid #e4e7ed;
        line-height: 38px;
        margin-bottom: 14px;
        color: #606266;
        font-size: 14px;
      }
      .customRange {
        display: flex;
        justify-content: center;
        align-items: center;
        .rangePanel {
          flex: 1;
          text-align: center;
        }
      }
    }
  }
  .componensfooter {
    border-top: 1px solid #e4e7ed;
    justify-content: flex-end;
    padding: 10px 20px;
  }
}
</style>
