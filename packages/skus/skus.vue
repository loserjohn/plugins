<template>
  <div id="sku" class="container">
    <div class="spec">
      <h4>商品规格</h4>
      <span class="skutip">* 商品的价格及库存以商品规格为准,拖动单元格可以改变规格顺序</span>
      <el-button v-if="enableSpec" type="primary" size="small" class="mar-t" @click="addType">添加新规格</el-button>
    </div>
    <el-card class="specsBox" shadow="hover" style="padding: 0">
      <div v-if="productsInfo.goods_parameter.length > 0" class="specContent">
        <draggable v-model="productsInfo.goods_parameter" v-bind="dragOptions" tag="ul" class="list-group el-upload-list el-upload-list--picture-card" @update="dragHandle" @start="isDragging = true" @end="isDragging = false">
          <!-- <transition-group type="transition" name="flip-list"> -->
          <el-col v-for="(spec, index) in productsInfo.goods_parameter" v-show="enableSpec" :key="index" :span="24">
            <el-card shadow="hover">
              <div slot="header" class="clearfix">
                <span>规格名称：</span>
                <el-input v-model.trim.lazy="spec.name" size="small" clearable placeholder="请输入规格名，例如：尺寸" class="spec-type" @blur="_blur" />

                <span style="margin-left: 10px">规格项：</span>
                <el-input v-model.trim.lazy="newSpecName[index]" size="small" clearable placeholder="请输入规格项，例如：XXL" class="spec-type" />
                <el-button size="small" @click="addSpec(spec.list, newSpecName[index], index)">+添加</el-button>
                <!-- <el-button v-if="index!=0" :type="spec.checked?'danger':'success'" size="medium" style="float: right" @click="spec.checked=!spec.checked">
                                              {{spec.checked?'点击禁用':'点击启用'}}
                    </el-button>-->
                <el-switch v-if="index != 0" v-model="spec.checked" active-color="#13ce66" style="float: right; margin-left: 20px; margin-top: 8px" inactive-color="#f2f2f2" @change="_changeSwitch"></el-switch>
                <el-button v-if="index != 0" type="primary" size="small" style="float: right" @click="deleteType(index)">删除规格</el-button>
              </div>
              <div class="textitem">
                <el-row v-if="index == 0" style="margin-top: 0; flex-wrap: wrap" class="row-bg">
                  <el-col v-for="(specName, ind) in spec.list" :key="ind" :span="12" :sm="{ span: 12 }">
                    <div class="tabgsBox">
                      <span class="destitle">序号：{{ ind }}</span>
                      <div style="overflow: hidden; margin-right: 10px">
                        <!-- <upload-image v-model="spec.list[ind]" :setting="config.setting" :showskutip="false" :upload-url="uploadUrl" label="规格图片" /> -->
                      </div>
                      <div style="flex: 1; margin-right: 16px">
                        <el-input v-model.trim.lazy="specName.name" size="mini" style="width: 100%" clearable class="price-modi" @blur="_blur" />
                      </div>
                      <el-button size="mini" type="primary" style="margin-right: 10px" circle :disabled="ind == 0" class="el-icon-delete" @click="deleteSpec(ind, spec.list, index)" />
                      <el-switch v-model="specName.checked" :disabled="ind == 0" active-color="#13ce66" inactive-color="#f2f2f2" @change="_changeSwitch"></el-switch>
                    </div>
                  </el-col>
                </el-row>
                <el-row v-if="index != 0" style="margin-top: 0" class="row-bg">
                  <el-col v-for="(specName, ind) in spec.list" :key="`${index}_${ind}`" :span="12">
                    <div class="tabgsBox">
                      <span class="destitle">序号：{{ ind }}</span>
                      <div style="overflow: hidden; margin-right: 10px">
                        <!-- <upload-image v-model="spec.list[ind]" :setting="config.setting" :showskutip="false" :upload-url="uploadUrl" label="规格图片" /> -->
                      </div>
                      <div style="flex: 1; margin-right: 16px">
                        <el-input v-model.trim.lazy="specName.name" size="mini" style="width: 100%" clearable class="price-modi" @blur="_blur" />
                      </div>
                      <el-row type="flex" style="margin-top: 0; padding-right: 10px" justify="end " align="middle">
                        <el-button size="mini" type="primary" style="margin-right: 10px" circle class="el-icon-delete" :disabled="ind == 0" @click="deleteSpec(ind, spec.list, index)" />
                        <el-switch v-model="specName.checked" :disabled="ind == 0" active-color="#13ce66" inactive-color="#f2f2f2" @change="_changeSwitch"></el-switch>
                      </el-row>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
          <!-- </transition-group> -->
        </draggable>
      </div>
      <div v-else class="noneText">暂无数据</div>
    </el-card>

    <el-divider>sku规格</el-divider>

    <!-- 快速填写 -->
    <div class="menusBox">
      <div class="spec">
        <h4>商品价格</h4>
        <span class="skutip">* 商品的价格批量填写</span>
        <el-button type="primary" plain size="small" class="mar-t" @click="_setSkuMsg">一键设置</el-button>
      </div>
      <div class="specflex">
        <div :span="6" style="margin-bottom: 20px">
          <div style="margin-bottom: 10px"><b class="must-fill">*</b>原价（元）:</div>
          <el-input v-model="displayedPrices.skus_origin" class="goods-price" size="small" />&nbsp;&nbsp;
        </div>
        <div :span="6" style="margin-bottom: 20px">
          <div style="margin-bottom: 10px"><b class="must-fill">*</b>售价（元）:</div>
          <el-input v-model="displayedPrices.skus_price" class="goods-price" size="small" />&nbsp;&nbsp;
        </div>
        <div :span="6" style="margin-bottom: 20px">
          <div style="margin-bottom: 10px"><b class="must-fill">*</b>商品库存(件) :</div>
          <el-input v-model="displayedPrices.skus_stock" class="goods-price" size="small" />&nbsp;&nbsp;
        </div>
      </div>
    </div>

    <template v-if="enableSpec && specs.length !== 0">
      <el-table key="aTable" :data="productsInfo.goods_spec" border>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column v-for="(it, ids) in vilidParameter" :key="ids" :label="it.name">
          <template slot-scope="scope">
            <span>{{ scope.row.skus_difference[ids] }}</span>
          </template>
        </el-table-column>

        <el-table-column label="原价" prop="skus_origin">
          <template slot-scope="scope">
            <el-popover trigger="click" placement="top">
              <p>
                原价:
                <el-input v-model.number="scope.row.skus_origin" size="mini" class="price-modi" />
              </p>
              <div style="text-align: right; margin: 0" />
              <div slot="reference" class="name-wrapper">{{ scope.row.skus_origin }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="skus_price" label="售价">
          <template slot-scope="scope">
            <el-popover trigger="click" placement="top">
              <p>
                售价:
                <el-input v-model.number="scope.row.skus_price" size="mini" class="price-modi" />
              </p>
              <div style="text-align: right; margin: 0">
                <!-- <el-button size="mini" type="text" @click="visible2 = false">取消</el-button> -->
                <!-- <el-button type="primary" size="mini" @click="visible2 = false">确定</el-button> -->
              </div>
              <div slot="reference" class="name-wrapper">{{ scope.row.skus_price }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="skus_stock" label="库存">
          <template slot-scope="scope">
            <el-popover trigger="click" placement="top">
              <p>
                库存:
                <el-input v-model.number="scope.row.skus_stock" size="mini" class="price-modi" />
              </p>
              <div style="text-align: right; margin: 0">
                <!-- <el-button size="mini" type="text" @click="visible2 = false">取消</el-button> -->
                <!-- <el-button type="primary" size="mini" @click="visible2 = false">确定</el-button> -->
              </div>
              <div slot="reference" class="name-wrapper">{{ scope.row.skus_stock }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="productsInfo.flashsale_code" prop="skus_stock" label="活动价格">
          <template slot-scope="scope">
            <el-popover trigger="click" placement="top">
              <p>
                活动价格:
                <el-input v-model.number="scope.row.sale_price" size="mini" class="price-modi" />
              </p>
              <div slot="reference" class="name-wrapper">{{ scope.row.sale_price ? scope.row.sale_price : 0 }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column v-if="productsInfo.flashsale_code" prop="skus_stock" label="活动库存">
          <template slot-scope="scope">
            <el-popover trigger="click" placement="top">
              <p>
                活动库存:
                <el-input v-model.number="scope.row.sale_stock" size="mini" class="price-modi" />
              </p>
              <div slot="reference" class="name-wrapper">{{ scope.row.sale_stock ? scope.row.sale_stock : 0 }}</div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script>
// import UploadImage from './UploadImage'
import draggable from 'vuedraggable'
// import ActivityList from './activityList'
import request from '@/utils/request'
export default {
  name: 'yp-skus',
  components: {
    // UploadImage,
    draggable
    // ActivityList
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      arr: [1, 3, 5],
      visible2: false,
      // local
      // __flag
      // 规格种类的数量
      typesLength: null,
      enableSpec: true,
      // __data
      // 注意此项为数组 type Array
      originalPrices: [
        {
          skus_origin: 110,
          skus_price: 100,
          cost: 90,
          skus_stock: 110
        }
      ],
      // 批量填写价格
      defaultAddPrices: {
        skus_origin: 100,
        skus_price: 90,
        cost: 80,
        skus_stock: 50
      },
      // from backend
      specs: [
        {
          type: '颜色',
          children: ['红', '蓝']
        }
      ],
      // from backend
      specPrices: [
        {
          specs: ['红', '大'],
          prices: {
            skus_origin: 90,
            skus_price: 60,
            cost: 40,
            skus_stock: 10
          }
        }
      ],
      newSpecName: ['', '', '', '', '', ''],
      tableData: [],
      uploadUrl: process.env.VUE_APP_BASE_API + '/Upload/File/Saves',
      imageUrl: '',
      activityShow: false,
      activityList: '',
      productsInfo: {
        goods_parameter: [],
        goods_spec: []
      }
    }
  },
  computed: {
    vilidParameter() {
      let arr = []
      this.productsInfo.goods_parameter.map((item) => {
        if (item.checked) {
          arr.push(item)
        }
      })
      return arr
    },
    displayedPrices() {
      // //console.log(this.enableSpec ? this.defaultAddPrices : this.originalPrices[0])
      return this.enableSpec ? this.defaultAddPrices : this.originalPrices[0]
    },
    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    },
    currentAct() {
      let resitem = {}
      if (this.activityList) {
        this.activityList.some((item) => {
          if (this.productsInfo.flashsale_code === item.flashsale_code) {
            resitem = item
          }
        })
      } else {
        resitem = {
          begin_date: '',
          end_date: '',
          flashsale_code: '',
          goods_count: 0,
          status: 0,
          title: ''
        }
      }
      return resitem
    }
  },
  created() {
    this.specs = []
    this.specPrices = []
    if (this.specs.length === 0) {
      // 初始化规格数据
      const obj = {}
      obj.type = '统一规格'
      obj.children = ['标准规格']
      this.specs.push(obj)
    }
    this.typesLength = this.specs.length
    this.enableSpec = !!this.typesLength
    this.enableSpec = true

    // this._getAllAct()
  },
  methods: {
    // 拖动回调
    dragHandle(e) {
      console.log(e)
      console.log(this.productsInfo.goods_parameter)
      this.calcTable()
    },
    // 一键设置
    _setSkuMsg() {
      this.$confirm('确定要一键设置所有属性信息？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.productsInfo.goods_spec.map((item) => {
            item.skus_origin = this.displayedPrices.skus_origin
            item.skus_price = this.displayedPrices.skus_price
            item.skus_stock = this.displayedPrices.skus_stock
          })
          // this.closeLoading(this, loading)
        })
        .catch((err) => {
          console.error(err)
        })
    },
    // 获取所有的可选活动
    async _getAllAct() {
      let data = {
        title: '', //限时购标题
        status: '', //状态
        pageIndex: 1, //页
        pageSize: 100 //条
      }
      const res = await this.__getAllAct(data)
      if (res.result === 1) {
        this.activityList = res.data.rows
      }
    },
    async __getAllAct(data) {
      return request({
        url: '/Shop/ShopFlashSale/list',
        method: 'post',
        data
      })
    },
    // 确认参加活动
    _addInActivity(data) {
      // debugger
      // this.currentAct = data
      this.productsInfo.flashsale_code = data.flashsale_code
      this.activityShow = false
    },
    // 退出活动
    _outActivity() {
      this.productsInfo.flashsale_code = ''
      // 所有skulist活动清0
      this.productsInfo.goods_spec.map((item) => {
        item.sale_price = 0
        item.sale_stock = 0
      })
    },
    // 选择活动
    _chooseActivity() {
      this.activityShow = true
    },
    _blur() {
      // console.log(e);
      this.calcTable()
    },
    _changeSwitch() {
      // console.log(e)
      this.calcTable()
    },
    specPicSuccess() {},
    beforeAvatarUpload() {},
    _submit() {
      // console.log(this.tableData)
    },
    arrTest() {
      this.arr = 0
      //   const t = 0
      //   const _t = '0'
      // console.log("Boolean(t)");
      // console.log(Boolean(t));
      // console.log(Boolean(_t));
    },
    test() {
      // console.log(this.specs);
    },
    deleteType(index) {
      if (index == 0) {
        this.$message({
          message: '该条为默认规格，不可删除',
          type: 'error'
        })
        return
      }
      this.$confirm('确定删除规格名么, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.productsInfo.goods_parameter.splice(index, 1)
          this.calcTable()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    deleteSpec(ind, spec, index) {
      if (index === 0 && spec.length <= 1) {
        this.$message({
          type: 'error',
          message: '请保留至少一条商品属性!'
        })
        return
      } else {
        spec.splice(ind, 1)
        if (spec.length == 0) {
          this.productsInfo.goods_parameter[index].checked = false
        }
        this.calcTable()
      }
    },
    modiSpec(specName, spec, index) {
      spec[index] = specName
      // console.log(this.specs);
    },
    addType() {
      // alert()
      const obj = {}
      obj.name = `新增规格${this.productsInfo.goods_parameter.length + 1}`
      obj.checked = true
      obj.list = [
        {
          name: '新增属性',
          pic: '',
          checked: true
        }
      ]
      this.productsInfo.goods_parameter.push(obj)
      this.calcTable()
    },
    addSpec(spec, newSpecName, index) {
      // console.log(111,spec, newSpecName);
      // 检测新规格名是否规范 1, 不为空. 2,不重复
      if (!newSpecName) {
        this.$message({
          type: 'error',
          message: '规格项名称不能为空!'
        })
        return
      } else if (spec.some((item) => item.name == newSpecName)) {
        this.$message({
          type: 'error',
          message: '规格项名称不能为重复!'
        })
        return
      }
      spec.push({
        name: newSpecName,
        pic: '',
        checked: true
      })
      this.calcTable()
      this.newSpecName[index] = ''
      // //console.log(this.specs)
    },
    // 计算表格
    calcTable() {
      const arr = []
      // console.log(1, this.productsInfo);
      this.productsInfo.goods_parameter.forEach((item) => {
        if (item.checked) {
          // console.log(item.list)
          let l = item.list
          let r = []

          for (let i = 0; i < l.length; i++) {
            // console.log(1.1,l[i])
            // let allUnCheck = false
            if (l[i].checked) {
              if (!l[i].name) {
                l[i].name = '匿名属性'
              }

              r.push(l[i])
              // allUnCheck = true
            }
          }
          if (!item.name) {
            item.name = '匿名规格'
          }
          // console.log(1.5,r)
          arr.push([...r])
        } else {
          // let l = item.list
          // for(let i=0;i<l.length;i++){
          //     // console.log(1.1,l[i])
          //     if(l[i].checked){
          //         l[i].checked = false
          //     }
          // }
        }
      })
      // console.log(arr)
      const tableData = this.creatSku(arr)
      // console.log(2, tableData)
      const a = []
      tableData.map((item, ids) => {
        a.push({
          skus_difference: [...item],
          skus_origin: this.displayedPrices.skus_origin,
          skus_price: this.displayedPrices.skus_price,
          skus_stock: this.displayedPrices.skus_stock,
          sale_price: 0,
          sale_stock: 0,
          id: ids
        })
      })
      this.productsInfo.goods_spec = a
      // console.log(a)
    },
    creatSku(array) {
      // console.log('所有属性维维数组', array)
      if (array.length == 0) {
        return []
      }
      if (array.length < 2) {
        const a = []
        array[0].forEach((it) => {
          a.push([it.name])
        })
        return a || []
      }
      // console.log('2种规格以上', array)
      return array.reduce((total, currentproductsInfo) => {
        const res = []
        total.forEach((t) => {
          // console.log(t,currentproductsInfo);
          currentproductsInfo.forEach((cv) => {
            if (Array.isArray(t)) {
              // 或者使用 Array.isArray(t)
              // console.log('数组',[...t, cv.name])
              res.push([...t, cv.name])
            } else {
              // console.log('非数组',[t.name, cv.name])
              res.push([t.name, cv.name])
            }
          })
        })
        // console.log(res)
        return res
      })
    },
    modiPrice() {},

    getResult() {
      return { ...this.productsInfo }
    },

    setResult(value) {
      if (!value) return
      // debugger
      this.productsInfo = value
    },
    resetResult() {
      // debugger
      this.productsInfo = {
        goods_parameter: [],
        goods_spec: []
      }
    }
    // 规格组合数组
  }
}
</script>

<style lang="scss" scoped>
#sku {
  width: 100%;
}
.specsBox {
  width: 100%;
  display: block;
  margin-bottom: 20px;
}
.specContent {
  width: 100%;
  height: auto;
  overflow: hidden;
}
.menusBox {
  background: #35abff;
  color: #fff;
  padding: 0 20px;
  margin-bottom: 20px;
  .spec {
    border-bottom: 1px dashed #fff;
  }
}
.textitem {
  margin-bottom: 16px;
}

.noneText {
  text-align: center;
  color: #909399;
  font-size: 14px;
}

.askus-box-card {
  background: rgb(244, 250, 255);
}
.askus-box-card-white {
  background: #fff;
  margin-top: 20px;
}
.activityBox {
  padding: 0 10px;
  background: #53a5f1;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  display: -webkit-flex;
  border-radius: 4px;
  /* border: 2px solid #70b1ec; */
  color: #fff;
}
.skutip {
  color: red;
  font-size: 12px;
  display: block;
  margin: 0 20px;
}
#sku .spec-type {
  width: 280px;
}
// #sku .price-wra input[type='text'] {
//   width: 80px;
// }
// #sku .el-input {
//   width: auto;
// }
.must-fill {
  color: red;
}
.el-row {
  margin-top: 15px;
}
.spec-table {
  margin-top: 15px;
}
.spec {
  border-bottom: 1px solid #e6e6e6;
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.specflex {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.tabgsBox {
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  padding: 6px;
  margin: 4px 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.destitle {
  font-size: 12px;
  color: rgb(71, 148, 236);
}
.avatar-uploader {
  background: #f1f1f1;
  width: 40px;
  height: 40px;
  margin-right: 10px;
  line-height: 40px;
}
.price-modi {
  width: 70px;
}
</style>
