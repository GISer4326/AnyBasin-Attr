<!--
 * @Author: BinjieYuan yuanbj9035@163.com
 * @Date: 2022-09-26 16:17:07
 * @LastEditors: BinjieYuan yuanbj9035@163.com
 * @LastEditTime: 2023-03-20 23:04:14
 * @FilePath: \WebBasin\front\src\components\seimscontrol\CalibrationModel.vue
 * @Description: 率定模块
-->
<template>
  <div>
    <Modal v-model="caliModelShowTemp" draggable scrollable footer-hide :mask="false" title="SEIMS Calibration" width="550px" @on-visible-change="modalVisible">
      <div>
        <Tabs type="card" :animated="false" >
          <TabPane label="参数敏感性分析">
            <div class="selectSetting">
              <span>请选择敏感性分析评估对象&nbsp;:&nbsp;</span>
              <Select v-model="selectdEvaluateTarget" style="width:245px" placeholder="请选择评估对象并点击确定" size="small">
                <Option v-for="item in evaluateTargets" :value="item" :key="item">{{ item }}</Option>
              </Select>
              <Button type="success" ghost @click="setEvaluateTarget" size="small">确定</Button>
            </div>
            <div class="selectSetting">
              <span>请选择模型运行时间段&nbsp;:&nbsp;</span>
              <DatePicker type="datetimerange" format="yyyy-MM-dd HH:mm" v-model="runSensitivityDateRange" size="small" 
                      placeholder="请选择模型运行时间段并点击确定" style="width: 275px" transfer split-panels @on-change="timeChange('runSensitivity',runSensitivityDateRange)"/>
              <Button type="success" ghost @click="setRunSensitivityTime" size="small">确定</Button>
              <Tooltip max-width="200" content="模型运行时间段需包含参数评估时间段，起始相差时间段可做为预热期。" placement="top-end" theme="light">
                <Icon type="ios-alert-outline" size="20" />
              </Tooltip>
            </div>
            <div class="selectSetting">
              <span>请选择参数评估时间段&nbsp;:&nbsp;</span>
              <DatePicker type="datetimerange" format="yyyy-MM-dd HH:mm" v-model="evaluateDateRange" size="small"
                      placeholder="请选择参数评估时间段并点击确定" style="width: 275px" transfer split-panels @on-change="timeChange('evaluateDate',evaluateDateRange)"/>
              <Button type="success" ghost @click="setEvaluateTime" size="small">确定</Button>
              <Tooltip max-width="200" content="参数评估时间段为模型参数敏感性评估运行的时间段" placement="top-end" theme="light">
                <Icon type="ios-alert-outline" size="20" />
              </Tooltip>
            </div>
            <div class="selectSetting">
              <span>添加其他参与模型敏感性分析的参数&nbsp;:&nbsp;</span>
              <Select v-model="selectAddParam" style="width:185px" @on-change="diffSensitivityParamCompute" placeholder="请选择参数并点击确定" size="small">
                <Option v-for="item in diffSensitivityParam" :value="item.name" :key="item.name">{{ item.name }}</Option>
              </Select>
              <Button type="success" ghost @click="addSensitivityParamToTable" size="small">确定</Button><br>
            </div>
            <Table border :columns="sensitivityParamColumns" :data="sensitivityParamDataShow"  size="small" height="260" style="margin-bottom:7px">
              <!-- <template slot-scope="{ row }" slot="name">
                <strong>{{ row.name }}</strong>
               </template> -->
              <template slot-scope="{ row }" slot="min" >
                <Form v-if="row.isEdit" :model="row" ref="tableMin" :rules="tableMinRules">
                  <FormItem prop="min" >
                    <Input v-model="row.min" size="small"></Input>
                  </FormItem>
                </Form>
                <div v-else >{{ row.min }}</div>
              </template>
              <template slot-scope="{ row }" slot="max" >
                <Form v-if="row.isEdit" :model="row" ref="tableMax" :rules="tableMaxRules">
                  <!-- <FormItem prop="max" :rules="{required: true, message: 'not null!', trigger: 'change',type:'number'}"> -->
                  <FormItem prop="max" >
                    <Input v-model="row.max" size="small" ></Input>
                  </FormItem>
                </Form>
                <div v-else >{{ row.max }}</div>
              </template>
              <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="tableDetailSensitivity(index)">Detail</Button>
                <Button v-if="row.isEdit" type="success" ghost size="small" style="margin-right: 5px" @click="tableSaveSensitivity(row,index)">Save</Button>
                <Button v-else type="success" size="small" style="margin-right: 5px" @click="tableEditSensitivity(row,index)">Edit</Button>
                <Button type="error" size="small" @click="tableRemoveSensitivity(index)">Delete</Button>
              </template> 
            </Table>
            <div class="selectParamsBtn">
              <Button size="small" type="success" ghost @click="setEvaluateParams">确定选择上述参数</Button><br>                
            </div>
            <div class="finishBtn">
              <Button v-if="runSensitivityStatus=='modelSetting'" type="info" ghost @click="reRunSensitivityApi">进行参数敏感性分析</Button>
              <div v-else-if="runSensitivityStatus=='modelRunning'" style="width:85%">
                <i-progress :percent="99.99" status="active" hide-info></i-progress>
                <span>参数敏感性分析运行中...</span>
              </div>
              <div v-else-if="runSensitivityStatus=='modelRunSuccessed'" style="width:100%">
                <p class="finishFont">参数敏感性分析运行结束</p>
                <div class="finishBtn">
                  <Button type="success" ghost @click="showSensitivityChart">查看敏感性分析结果</Button>
                  <Button type="info" ghost @click="reRunSensitivityApi">重新运行参数敏感性分析</Button>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane label="参  数  率  定">
            <div class="selectSetting">
              <span>选择模型运行时间段&nbsp;:&nbsp;</span>
              <DatePicker type="datetimerange" format="yyyy-MM-dd HH:mm" v-model="runModelDateRange" size="small"
                      placeholder="请选择模型运行时间段并点击确定" style="width: 274px" transfer split-panels @on-change="timeChange('runModelDate',runModelDateRange)"/>
              <Button size="small" type="success" ghost @click="setCaliRunModelTime">确定</Button><br>
            </div>
            <div class="selectSetting">
              <span>选择模型率定时间段&nbsp;:&nbsp;</span>
              <DatePicker type="datetimerange" format="yyyy-MM-dd HH:mm" v-model="runCaliDateRange"  size="small"
                    placeholder="请选择模型率定时间段并点击确定" style="width: 274px" transfer split-panels @on-change="timeChange('runCaliDate',runCaliDateRange)"/>
              <Button size="small" type="success" ghost @click="setCaliRunCaliTime">确定</Button><br>
            </div>
            <div class="selectSetting">
              <span>选择模型验证时间段&nbsp;:&nbsp;</span>
              <DatePicker type="datetimerange" format="yyyy-MM-dd HH:mm" v-model="runValiDateRange" size="small"
                    placeholder="请选择模型验证时间段并点击确定" style="width: 274px" transfer split-panels @on-change="timeChange('runValiDate',runValiDateRange)"/>
              <Button size="small" type="success" ghost @click="setCaliRunValiTime">确定</Button><br>
            </div>
            <div class="selectSetting">
              <span>选择率定时使用的方法&nbsp;:&nbsp;</span>
              <Select v-model="caliMethod" clearable style="width:259px" size="small" placeholder="请选择率定方法并点击确定">
                <Option v-for="item in caliMethods" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <Button size="small" type="success" ghost @click="selectCaliMethod">确定</Button><br>
              <div v-show="caliMethod === 'NSGA2'">
                <p><strong>【NSGA2参数设置】迭代次数：</strong>{{formNSGA2Params.generationsNum}};    <strong>种群内个体数量：</strong>{{formNSGA2Params.populationSize}};    <strong>交叉概率：</strong>{{formNSGA2Params.crossoverRate}};
                  <br><strong>突变概率：</strong>{{formNSGA2Params.mutateRate}};    <strong>变异基因最大百分比：</strong>{{formNSGA2Params.maxMutatePerc}};</p>
                <Button type="primary" ghost size="small" shape="circle" @click="changeNSGA2Params" >编辑NAGA2参数</Button><br>
              </div>
              <Modal v-model="isNSGA2ParamsModalShow" title="编辑NAGA2参数">
                <Form ref="formNSGA2Params" :model="formNSGA2Params" :rules="rulesNSGA2Params">
                  <FormItem label="迭代次数：" prop="generationsNum">
                    <Input v-model="formNSGA2Params.generationsNum"></Input>
                  </FormItem>
                  <FormItem label="种群内个体数量：" prop="populationSize">
                    <Input v-model="formNSGA2Params.populationSize" ></Input>
                  </FormItem>
                  <FormItem label="交叉概率：" prop="crossoverRate">
                    <Input v-model="formNSGA2Params.crossoverRate" ></Input>
                  </FormItem>
                  <FormItem label="突变概率：" prop="mutateRate">
                    <Input v-model="formNSGA2Params.mutateRate"></Input>
                  </FormItem>
                  <FormItem label="变异基因最大百分比：" prop="maxMutatePerc">
                    <Input v-model="formNSGA2Params.maxMutatePerc" ></Input>
                  </FormItem>
                </Form>
              </Modal>
            </div>
            <div class="selectSetting">
              <span>请选择参与率定的参数&nbsp;:&nbsp;</span>
              <Select v-model="selectAddParam" style="width:259px" @on-change="diffSensitivityParamCompute" placeholder="请选择参数并点击确定" size="small">
                <Option v-for="item in diffSensitivityParam" :value="item.name" :key="item.name">{{ item.name }}</Option>
              </Select>
              <Button type="success" ghost @click="addSensitivityParamToTable" size="small">确定</Button><br>
            </div>
            <Table border :columns="sensitivityParamColumns" :data="sensitivityParamDataShow"  size="small" height="230" style="margin-bottom:7px">
              <template slot-scope="{ row }" slot="min" >
                <Form v-if="row.isEdit" :model="row" ref="tableMin" :rules="tableMinRules">
                  <FormItem prop="min" >
                    <Input v-model="row.min" size="small"></Input>
                  </FormItem>
                </Form>
                <div v-else >{{ row.min }}</div>
              </template>
              <template slot-scope="{ row }" slot="max" >
                <Form v-if="row.isEdit" :model="row" ref="tableMax" :rules="tableMaxRules">
                  <FormItem prop="max" >
                    <Input v-model="row.max" size="small" ></Input>
                  </FormItem>
                </Form>
                <div v-else >{{ row.max }}</div>
              </template>
              <!-- <template slot-scope="{ row }" slot="value" >
                <Form v-if="row.isEdit" :model="row" ref="tableValue" :rules="tableMinRules">
                  <FormItem prop="value" >
                    <Input v-model="row.value" size="small"></Input>
                  </FormItem>
                </Form>
                <div v-else >{{ row.value }}</div>
              </template> -->
              <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" style="margin-right: 5px" @click="tableDetailSensitivity(index)">Detail</Button>
                <Button v-if="row.isEdit" type="success" ghost size="small" style="margin-right: 5px" @click="tableSaveSensitivity(row,index)">Save</Button>
                <Button v-else type="success" size="small" style="margin-right: 5px" @click="tableEditSensitivity(row,index)">Edit</Button>
                <Button type="error" size="small" @click="tableRemoveSensitivity(index)">Delete</Button>
              </template> 
            </Table>
            <div class="selectParamsBtn" >
              <Button size="small" type="success" ghost @click="setCliaParams" >确定选择上述参数</Button><br>                
            </div>
            <div class="finishBtn">
              <Button v-if="runCaliStatus=='modelSetting'" type="info" ghost @click="runCali">进行参数率定</Button>
              <div v-else-if="runCaliStatus=='modelRunning'" style="width:85%">
                <i-progress :percent="99.99" status="active" hide-info></i-progress>
                <span>参数率定运行中...</span>
              </div>
              <div v-else-if="runCaliStatus=='modelRunSuccessed'" style="width:100%">
                <p class="finishFont">参数率定运行结束</p>
                <div class="finishBtn">
                  <Button type="success" ghost @click="showCaliChart">查看参数率定结果</Button>
                  <Button type="info" ghost @click="runCali">重新运行参数率定</Button>
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Modal>
      <Modal v-model="isSensitivityChartShow" draggable scrollable footer-hide :mask="false" title="敏感性分析结果图" width="520px"	>
        <Tabs type="card" :animated="false" @on-click="changeSensitivityTabs">
          <TabPane label="NSE" name="NSE" >
            <!-- <div id="sensitivityNSE" style="height:400px;width:500px;"></div> -->
              <div id="sensitivityNSE" style="height:400px;width:500px"></div>
          </TabPane>
          <TabPane label="R-square" name="R-square" :disabled="isChartsTabsDisabled">
            <div id="sensitivityRsquare" style="height:400px;width:500px;"></div>
          </TabPane>
          <TabPane label="RMSE" name="RMSE" :disabled="isChartsTabsDisabled">
            <div id="sensitivityRMSE" style="height:400px;width:500px;"></div>
          </TabPane>
          <TabPane label="PBIAS" name="PBIAS" :disabled="isChartsTabsDisabled">
            <div id="sensitivityPBIAS" style="height:400px;width:500px;"></div>
          </TabPane>
          <TabPane label="RSR" name="RSR" :disabled="isChartsTabsDisabled">
            <div id="sensitivityRSR" style="height:400px;width:500px;"></div>
          </TabPane>        
          <TabPane label="lnNSE" name="lnNSE" :disabled="isChartsTabsDisabled">
            <div id="sensitivityLnNSE" style="height:400px;width:500px;"></div>
          </TabPane>
        </Tabs>
      </Modal>
      <Modal v-model="isCaliChartShow" draggable scrollable footer-hide :mask="false" title="率定结果图" width="600px">
        <div id="caliChart" style="height:400px;width:580px;"></div>
      </Modal>
  </div>


</template>

<script>
import {request} from "@/network/request";


export default {
  name:"CalibrationModel",
  props:{
    caliModelShow: {
      type: Boolean
    }
  },
  watch:{
    caliModelShow(newVal, oldVal){
    this.caliModelShowTemp=newVal
    },
    immediate: true
  },
  mounted() {
    this.diffSensitivityParamCompute();
  },
  data() {
    const validateNSGA1 = (rule, value, callback) =>{
      if (!value.match(/^\+?[1-9][0-9]*$/)) {
          callback(new Error('应输入非零正整数'))
        }else{
          callback()
        }
    };
    const validateMaxMin = (rule, value, callback) =>{
      if (!value.match(/[-+]*[0-9][.][0-9]+|[-+]*[1-9][0-9]*|^[0]$/)) {
          callback(new Error('Must Number'))
        }else{
          callback()
        }
    };
    return {
      caliModelShowTemp:false,
      sensitivityParamColumns: [
        {
          title: 'Name',
          slot: 'name',
          width: 125,
          render: (h, params) => {
            return h('div', [
              h('strong', params.row.name)
            ]);
          }
        },
        // {
        //   title: 'Value',
        //   slot: 'value',
        // },
        {
          title: 'Min',
          slot: 'min',
        },
        {
          title: 'Max',
          slot: 'max',
          // render: (h, params) => {
          //   if(params.row.isEdit){
          //     return h('Input',{
          //       props:{
          //         value: params.row.max
          //       },
          //       on:{
          //         'input':(val)=>{
          //           params.row.max = val;
          //         },
          //       }
          //     });
          //   }else{
          //     return h('div', [
          //       h('div', params.row.max)
          //     ]);
          //   };
          // }
        },
        {
          title: 'Action',
          slot: 'action',
          width: 240,
          // align: 'center'
        }
      ],
      sensitivityParamData:[
        {name:"K_pet", min:"-0.3" ,max: "0.3", detail:'Correction factor for PET(PET_PM)',isEdit:false},
        {name:"Interc_max", min: "0.5", max: "2.0", detail:'Maximum Interception Capacity(PI_MCS)',isEdit:false},
        {name:"Interc_min", min: "0.5" ,max: "2.0", detail:'Minimum Interception Capacity(PI_MCS)',isEdit:false},
        {name:"K_run", min:"-1.5",max:"1.5", detail:'Runoff exponent for a near zero rainfall intensity(SUR_MR)',isEdit:false},
        {name:"P_max",  min:"-20" , max: "10", detail:'Rainfall intensity corresponding to a surface runoff exponent of 1(SUR_MR)',isEdit:false},
        {name:"Runoff_co",  min: "0.8", max: "2", detail:'Potential runoff coefficient(SUR_MR)',isEdit:false},
        {name:"sw_cap",  min: "0.9", max: "1.5", detail:'amount of water capacity in soil layers such as sol_awc sol_ul and wiltingpoint(SUR_MR)',isEdit:false},
        {name:"Depression",  min:"0.8", max:"1.5", detail:'Depression storage capacity(DEP_LINSLEY)',isEdit:false},
        {name:"Conductivity",  min:"0.6", max:"1.2", detail:'Saturated hydraulic conductivity(PER_STR)',isEdit:false},
        {name:"Ki",  min:"-2", max:"-1", detail:'Interflow scaling factor(SSR_DA)',isEdit:false},
        {name:"Base_ex",  min:"0.8", max:"1.2", detail:'Baseflow exponent(GW_RSVR)',isEdit:false},
        {name:"df_coef",  min:"0.2", max:"0.5", detail:'Deep percolation coefficient(GW_RSVR)',isEdit:false},
        {name:"gwmax",  min:"0", max:"500", detail:'Maximum groundwater storage(GW_RSVR)',isEdit:false},
        {name:"Kg",  min:"-0.004", max: "0", detail:'Baseflow recession coefficient(GW_RSVR)',isEdit:false},
        {name:"ep_ch",  min:"-0.5", max: "0", detail:'reach evaporation adjustment factor(Channel)',isEdit:false},
        {name:"ch_width",  min:"1", max: "4", detail:'Average width of main channel(Channel)',isEdit:false},
        {name:"ch_depth", min: "0.8",  max: "2", detail:'Average depth of main channel(Channel)',isEdit:false},
        {name:"MSK_co1",  min:"0", max:"0.25", detail:'Calibration coefficient used to control impact of the storage time constant for normal flow(Channel)',isEdit:false},
        {name:"MSK_X",  min:"-0.1", max: "0.1", detail:'Calibration coefficient used to control impact of the storage time constant for normal flow(Channel)',isEdit:false},
        {name:"ch_n",  min: "0.4", max: "1", detail:'Manning coefficient n value for the main channel',isEdit:false},
      ],
      sensitivityParamDataShow:[
        {name:"ch_width",  min:"1", max: "4", detail:'Average width of main channel(Channel)',isEdit:false},
        {name:"ch_depth", min: "0.8",  max: "2", detail:'Average depth of main channel(Channel)',isEdit:false},
        {name:"Base_ex",  min:"0.8", max:"1.2", detail:'Baseflow exponent(GW_RSVR)',isEdit:false},
        {name:"gwmax",  min:"0", max:"500", detail:'Maximum groundwater storage(GW_RSVR)',isEdit:false},
        {name:"Conductivity",  min:"0.6", max:"1.2", detail:'Saturated hydraulic conductivity(PER_STR)',isEdit:false},
        {name:"sw_cap",  min: "0.9", max: "1.5", detail:'amount of water capacity in soil layers such as sol_awc sol_ul and wiltingpoint(SUR_MR)',isEdit:false},
        {name:"Runoff_co",  min: "0.8", max: "2", detail:'Potential runoff coefficient(SUR_MR)',isEdit:false},
        {name:"Depression",  min:"0.8", max:"1.5", detail:'Depression storage capacity(DEP_LINSLEY)',isEdit:false},
        {name:"df_coef",  min:"0.2", max:"0.5", detail:'Deep percolation coefficient(GW_RSVR)',isEdit:false},
        {name:"Kg",  min:"-0.004", max: "0", detail:'Baseflow recession coefficient(GW_RSVR)',isEdit:false},
        {name:"ep_ch",  min:"-0.5", max:"0", detail:'reach evaporation adjustment factor(Channel)',isEdit:false},
        {name:"K_pet", min:"-0.3" ,max: "0.3", detail:'Correction factor for PET(PET_PM)',isEdit:false},
        {name:"P_max",  min:"-20" , max: "10", detail:'Rainfall intensity corresponding to a surface runoff exponent of 1(SUR_MR)',isEdit:false},
        {name:"ch_n",  min: "0.4", max: "1", detail:'Manning coefficient n value for the main channel',isEdit:false},
      ],
      // sensitivityParamDataShow:[
      //   {name:"Porosity", value: "1.2", detail:'amount of water capacity in soil layers such as sol_awc sol_ul and wiltingpoint(SUR_MR)',isEdit:false},
      //   {name:"Base_ex", value:"1", detail:'Baseflow exponent(GW_RSVR)',isEdit:false},
      //   {name:"gwmax", value:"100", detail:'Maximum groundwater storage(GW_RSVR)',isEdit:false},
      //   {name:"Kg", value: "0.0005", detail:'Baseflow recession coefficient(GW_RSVR)',isEdit:false},
      //   {name:"gw0", value:"50", detail:'reach evaporation adjustment factor(Channel)',isEdit:false},
      //   {name:"ch_width", value: "2", detail:'Average width of main channel(Channel)',isEdit:false},
      //   {name:"ch_depth", value: "2", detail:'Average depth of main channel(Channel)',isEdit:false},
      //   {name:"Manning",  value: "1.6", detail:'Manning coefficient n value for the main channel',isEdit:false},
      // ],
      editParamModalShow:false,
      selectAddParam:'',
      diffSensitivityParam:'',
      evaluateTargets:["Q","SED","其他参数"],
      selectdEvaluateTarget:'',
      runSensitivityDateRange:'',
      runSensitivityStartTime:'',
      runSensitivityEndTime:'',
      evaluateDateRange:'',
      evaluateStartTime:'',
      evaluateEndTime:'',
      tableMinRules:{
        min:[
          {required: true, message: 'not null!', trigger: 'blur'},
          {type:'number', validator:validateMaxMin, trigger: 'blur'}
        ]
      },
      tableMaxRules:{
        max:[
          {required: true, message: 'not null!', trigger: 'blur'},
          {type:'number', validator:validateMaxMin, trigger: 'blur'}
        ]
      },
      projectName:'test1',
      userName:'',
      isSetEvaluateTargetSuccess:false,
      isSetEvaluateTimeSuccess:false,
      isSetEvaluateParamSuccess:false,
      runSensitivityStatus:"modelSetting",
      isSensitivityChartShow:false,
      sensitivityNSEChart:null,
      sensitivityRsquareChart:null,
      sensitivityRMSEChart:null,
      sensitivityPBIASChart:null,
      sensitivityRSRChart:null,
      sensitivityLnNSEChart:null,
      initOption:{
        grid:{
          top:48,
          left:80,
          right:50,
          bottom:50,
        },
        yAxis: {
          data: []
        },
        xAxis: {
          name: 'μ*'
        },
        series: [
          {
            type: 'bar',
            data: []
          }
        ]
      },
      runCaliStatus:"modelSetting",
      runModelDateRange:'',
      runModelStartTime:'',
      runModelEndTime:'',
      runCaliDateRange:'',
      runCaliStartTime:'',
      runCaliEndTime:'',
      runValiDateRange:'',
      runValiStartTime:'',
      runValiEndTime:'',
      isChartsTabsDisabled:true,
      caliMethod:'',
      caliMethods:[
        {
          value:'NSGA2',
          label:'NSGA2'
        },
        {
          value:'method1',
          label:'手动率定'
        }
      ],
      caliParamsShow:'',
      formNSGA2Params:{
        generationsNum:5,
        populationSize:4,
        crossoverRate:0.8,
        mutateRate:0.2,
        maxMutatePerc:0.1,
      },
      isNSGA2ParamsModalShow:false,
      rulesNSGA2Params:{
        generationsNum:[
          { required: true, message: '请输入迭代次数', trigger: 'blur' },
          {type:'number', validator: validateNSGA1, trigger: 'blur',}
        ],
        populationSize:[
          { required: true, message: '请输入种群内个体数量', trigger: 'blur' },
          {type:'number', validator: validateNSGA1, trigger: 'blur',}
        ],
        crossoverRate:[
          { required: true, message: '请输入交叉概率', trigger: 'blur' },
          // {type:'number', validator: , trigger: 'blur',}
        ],
        mutateRate:[
          { required: true, message: '请输入突变概率', trigger: 'blur' },
          // {type:'number', validator: , trigger: 'blur',}
        ],
        maxMutatePerc:[
          { required: true, message: '请输入变异基因最大百分比', trigger: 'blur' },
          // {type:'number', validator: , trigger: 'blur',}
        ]
      },
      isCaliChartShow:false,
      caliChart:null,
      caliChartOption:{
        title: {
          text: '率定结果',
          left: 'center'
        },
        grid:{
          top:80,
          left:80,
          right:50,
          bottom:100,
        },
        legend: {
          orient: 'vertical',
          data: ['Best Simulation', 'Observed Points'],
          left: 8,
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            animation: false,
            label: {
              backgroundColor: '#505765'
            }
          }
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            realtime: true,
            start: 0,
            end: 100,
          },
          {
            type: 'inside',
            realtime: true,
            start: 0,
            end: 100,
          }
        ],
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          name: 'Q(m³/s)',
          type: 'value',
        },
        series: [
          {
            name: 'Best Simulation',
            data: [],
            type: 'line',
            lineStyle: {
              width: 3
            },
            smooth: true,
          },
          {
            name: 'Observed Points',
            symbolSize: 6,
            data: [],
            type: 'scatter'
          }
        ]
      },
      caliValiResponseData:'',
      isSelectCaliMethod:false,

    }
  },
  methods: {
    modalVisible(isVisible){
      // console.log(isVisible);
      this.$emit('update:caliModelShow',isVisible); //实现createModelShow的双向绑定
    }, 
    tableDetailSensitivity(index){
      this.$Modal.info({
        title: 'Parameters Info',
        content: `Parameter Name：${this.sensitivityParamDataShow[index].name}<br>
                  Min：${this.sensitivityParamDataShow[index].min}<br>
                  Max：${this.sensitivityParamDataShow[index].max}<br>
                  Detail：${this.sensitivityParamDataShow[index].detail}<br>`
      })
    },
    // tableDetailSensitivity(index){
    //   this.$Modal.info({
    //     title: 'Parameters Info',
    //     content: `Parameter Name：${this.sensitivityParamDataShow[index].name}<br>
    //               Value：${this.sensitivityParamDataShow[index].value}<br>
    //               Detail：${this.sensitivityParamDataShow[index].detail}<br>`
    //   })
    // },
    tableEditSensitivity(row,index){
      row.isEdit = true;
    },
    tableSaveSensitivity(row,index){
      this.$refs['tableMax'].validate((valid) => {
        var validMax = valid
        this.$refs['tableMin'].validate((validMin) => {
          // console.log(validMin);
          // console.log(validMax);
          if (validMax && validMin) {
            row.isEdit = false;
            this.sensitivityParamDataShow[index].max = row.max;
            this.sensitivityParamDataShow[index].min = row.min;
            // this.sensitivityParamDataShow[index].value = row.value;
          }
        })
      })
    },
    tableRemoveSensitivity(index){
      this.sensitivityParamDataShow.splice(index, 1);
      this.diffSensitivityParamCompute();
    },
    diffSensitivityParamCompute(){
      this.diffSensitivityParam = this.sensitivityParamData.filter(v => !this.sensitivityParamDataShow.find((item) => item.name === v.name))

    },
    addSensitivityParamToTable(){
      var addParam = this.sensitivityParamData.filter(x => x.name === this.selectAddParam);
      if (addParam.length) {
        this.sensitivityParamDataShow.push(addParam[0]);
        // console.log(this.sensitivityParamDataShow);
      }
      this.selectAddParam = '';
      this.$Message['success']({
        background: true,
        content: '添加成功'
      });
    },
    timeChange(val,dataRange){
      var beginDate = new Date(dataRange[0]);
      var endDate = new Date(dataRange[1]);
      switch(val) {
        case 'runSensitivity':
          this.runSensitivityStartTime = this.dateFormat("YYYY-mm-dd HH:MM:SS", beginDate)
          this.runSensitivityEndTime = this.dateFormat("YYYY-mm-dd HH:MM:SS", endDate)
          break;
        case 'evaluateDate':
          this.evaluateStartTime = this.dateFormat("YYYY-mm-dd HH:MM:SS", beginDate)
          this.evaluateEndTime = this.dateFormat("YYYY-mm-dd HH:MM:SS", endDate)
          break;
        case 'runModelDate':
          this.runModelStartTime = this.dateFormat("YYYY-mm-dd HH:MM:SS", beginDate)
          this.runModelEndTime = this.dateFormat("YYYY-mm-dd HH:MM:SS", endDate)
          break;
        case 'runCaliDate':
          this.runCaliStartTime = this.dateFormat("YYYY-mm-dd HH:MM:SS", beginDate)
          this.runCaliEndTime = this.dateFormat("YYYY-mm-dd HH:MM:SS", endDate)
          break;
        case 'runValiDate':
          this.runValiStartTime = this.dateFormat("YYYY-mm-dd HH:MM:SS", beginDate)
          this.runValiEndTime = this.dateFormat("YYYY-mm-dd HH:MM:SS", endDate)
          break;
        default:
          console.log('time change error');
          break;
      } 

    },
    dateFormat(fmt, date) {
      let ret;
      const opt = {
          "Y+": date.getFullYear().toString(),        // 年
          "m+": (date.getMonth() + 1).toString(),     // 月
          "d+": date.getDate().toString(),            // 日
          "H+": date.getHours().toString(),           // 时
          "M+": date.getMinutes().toString(),         // 分
          "S+": date.getSeconds().toString()          // 秒
          // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
          ret = new RegExp("(" + k + ")").exec(fmt);
          if (ret) {
              fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
          };
      };
      return fmt;
    },
    setEvaluateTarget(){
      this.projectName=this.$store.getters.projectName;
      let params = new URLSearchParams();
      params.append("projectName",this.projectName);
      params.append("evaluateTarget",this.selectdEvaluateTarget);
      request.post('/basins/sensitivity/setEvaluateTarget',params)
      .then(res=>{
        if (res.data.errCode == 200) {
          this.$Notice.success({
            title:'敏感性分析评估参数设置成功',
            duration:10
          })
          this.isSetEvaluateTargetSuccess = true;
        }else {
          this.$Notice.warning({
            title: '敏感性分析评估参数设置失败，请重新设置！',
            desc: '失败原因： ' + res.data.msg,
            duration:10
          });
        }
      }).catch(e => {
          this.$Notice.error({
            title: '敏感性分析评估参数设置失败，请重新设置！',
          });
      })
    },
    setRunSensitivityTime(){
      this.projectName=this.$store.getters.projectName;
      let params = new URLSearchParams();
      params.append("projectName",this.projectName);
      params.append("runSensitivityStartTime",this.runSensitivityStartTime);
      params.append("runSensitivityEndTime",this.runSensitivityEndTime);
      request.post('/basins/sensitivity/setRunSensitivityTime',params)
      .then(res=>{
        if (res.data.errCode == 200) {
          this.$Notice.success({
            title:'敏感性分析模型运行时间设置成功',
            duration:10
          })
          this.isSetEvaluateTimeSuccess = true;
        }else {
          this.$Notice.warning({
            title: '敏感性分析模型运行时间设置失败，请重新设置！',
            desc: '失败原因： ' + res.data.msg,
            duration:10
          });
        }
      }).catch(e => {
          this.$Notice.error({
            title: '敏感性分析模型运行时间设置失败，请重新设置！',
          });
      })
    },
    setEvaluateTime(){
      this.projectName=this.$store.getters.projectName;
      let params = new URLSearchParams();
      params.append("projectName",this.projectName);
      params.append("evaluateStartTime",this.evaluateStartTime);
      params.append("evaluateEndTime",this.evaluateEndTime);
      request.post('/basins/sensitivity/setEvaluateTime',params)
      .then(res=>{
        if (res.data.errCode == 200) {
          this.$Notice.success({
            title:'敏感性分析评估时间设置成功',
            duration:10
          })
          this.isSetEvaluateTimeSuccess = true;
        }else {
          this.$Notice.warning({
            title: '敏感性分析评估时间设置失败，请重新设置！',
            desc: '失败原因： ' + res.data.msg,
            duration:10
          });
        }
      }).catch(e => {
          this.$Notice.error({
            title: '敏感性分析评估时间设置失败，请重新设置！',
          });
      })
    },
    setEvaluateParams(){
      var sensitivityParams = this.convertSensitivityParams(this.sensitivityParamDataShow);
      this.projectName=this.$store.getters.projectName;
      var paramObj = {
        projectName: this.projectName,
        evaluateParams: sensitivityParams
      };
      // console.log(paramObj);
      var options = {
        headers: {
          "content-type": "application/json"
        },
        method: "POST",
        data: JSON.stringify(paramObj)
      };
      // console.log(options);
      request('/basins/sensitivity/setEvaluateParams',options)
      .then(res=>{
        if (res.data.errCode == 200) {
          this.$Notice.success({
            title:'敏感性分析评估参数设置成功',
            duration:10
          })
          this.isSetEvaluateParamsSuccess = true;
          // this.caliParamsShow = this.sensitivityParamDataShow;
        }else {
          this.$Notice.warning({
            title: '敏感性分析评估参数设置失败，请重新设置！',
            desc: '失败原因： ' + res.data.msg,
            duration:10
          });
        }
      }).catch(e => {
          this.$Notice.error({
            title: '敏感性分析评估参数设置失败，请重新设置！',
          });
      })
    },
    convertSensitivityParams(sourceParams){
      var Params = [];
      sourceParams.forEach(dict => {
        delete dict.detail;
        delete dict.isEdit;
        Params.push(dict);
      });
      return Params;
    },
    async reRunSensitivityApi(){
      let deleteResultStatus = await this.deleteSensitivityResult();
      // console.log(deleteResultStatus);
      if (deleteResultStatus === true) {
        this.sensitivityApi();
      }
    },
    async deleteSensitivityResult(){
      this.projectName=this.$store.getters.projectName;
      let deleteSensitivityResultStatus = false;
      let params = new URLSearchParams();
      params.append("projectName",this.projectName);
      await request.post('/basins/sensitivity/deleteSensitivityResult',params)
      .then(res=>{
        // console.log(res.data.errCode);
        if (res.data.errCode === 200) {
          deleteSensitivityResultStatus=true;
        }else {
          deleteSensitivityResultStatus=false;
        }
      }).catch(e => {
          deleteSensitivityResultStatus=false;
      })
      return deleteSensitivityResultStatus;
    },
    sensitivityApi(){
      this.projectName=this.$store.getters.projectName;
      this.runSensitivityStatus='modelRunning';
      let params = new URLSearchParams();
      params.append("projectName",this.projectName);
      request.post('/SEIMSServices/sensitivityAnalysis',params)
      .then(res=>{
        if (res.data === true) {
          this.$Notice.success({
            title:'模型参数敏感性分析完成',
            duration:10
          })
        this.runSensitivityStatus='modelRunSuccessed';
        }else {
          this.$Notice.warning({
            title: '模型参数敏感性分析运行失败，请重新检查设置！',
            duration:10
          });
          this.runSensitivityStatus='modelSetting';
        }
      }).catch(e => {
          this.$Notice.error({
            title: '模型参数敏感性分析运行失败，请重新检查设置！',
          });
          this.runSensitivityStatus='modelSetting';
      })
    },
    
    showSensitivityChart(){
      this.isSensitivityChartShow = !this.isSensitivityChartShow;
      if (this.isSensitivityChartShow) {
        this.initSensitivityCharts();
        // this.getSensitivityResultTest();
        this.getSensitivityResult();
      }
    },
    initSensitivityCharts(){
      if (null === this.sensitivityNSEChart) {
        this.sensitivityNSEChart = this.$echarts.init(document.getElementById('sensitivityNSE'));
        this.sensitivityNSEChart.setOption(this.initOption);
        this.sensitivityNSEChart.showLoading();      
      }else{
        this.sensitivityNSEChart.showLoading();  
      }
    },
    getSensitivityResult(){
      this.projectName=this.$store.getters.projectName;
      let params = new URLSearchParams();
      params.append("projectName",this.projectName);
      request.post('/basins/sensitivity/getSensitivityResult',params)
      .then(res=>{
        if (200 === res.status) {
          this.sensitivityResponseData = res.data
          this.setSensitivityChartData()
          this.$Notice.success({
            title:'请求敏感性分析数据成功',
            duration:10
          })
          this.isChartsTabsDisabled=false;
        }else {
          this.$Notice.error({
            title: '请求敏感性分析数据失败',
            duration:10
          });
        }
      }).catch(e => {
          this.$Notice.error({
            title: '请求敏感性分析数据失败',
          });
      })
    },
    setSensitivityChartData(){
      // console.log(val['NSE']['0']);
      var NSEChartOption = {
        title: {
          text: '敏感性分析-NSE'
        },
        yAxis: {
          data : this.sensitivityResponseData['NSE']['0']['names']['0']
        },
        series: [
          {
            name: 'μ*',
            data: this.sensitivityResponseData['NSE']['0']['mu_star']['0']
          }
        ]
      }
      setTimeout(() => {
        this.sensitivityNSEChart.hideLoading();
        this.sensitivityNSEChart.setOption(NSEChartOption)
      }, 500);
    },
    changeSensitivityTabs(name){
      var ChartOption = {
        title: {
          text: '敏感性分析-' + name
        },
        yAxis: {
          data : this.sensitivityResponseData[name]['0']['names']['0']
        },
        series: [
          {
            name: 'μ*',
            data: this.sensitivityResponseData[name]['0']['mu_star']['0']
          }
        ]
      }
      switch(name) {
        case 'NSE':
          if (null === this.sensitivityNSEChart) {
            this.sensitivityNSEChart = this.$echarts.init(document.getElementById('sensitivityNSE'));
            this.sensitivityNSEChart.setOption(this.initOption);
            this.sensitivityNSEChart.showLoading();
            setTimeout(() => {
              this.sensitivityNSEChart.hideLoading();
              this.sensitivityNSEChart.setOption(ChartOption)
            }, 900);
          } else {
            this.sensitivityNSEChart.showLoading();
            setTimeout(() => {
              this.sensitivityNSEChart.hideLoading();
              this.sensitivityNSEChart.setOption(ChartOption)
            }, 500);
          }
          break;
        case 'R-square':
          if (null === this.sensitivityRsquareChart) {
            this.sensitivityRsquareChart = this.$echarts.init(document.getElementById('sensitivityRsquare'));
            this.sensitivityRsquareChart.setOption(this.initOption);
            this.sensitivityRsquareChart.showLoading();
            setTimeout(() => {
              this.sensitivityRsquareChart.hideLoading();
              this.sensitivityRsquareChart.setOption(ChartOption)
            }, 900);
          } else {
            this.sensitivityRsquareChart.showLoading();
            setTimeout(() => {
              this.sensitivityRsquareChart.hideLoading();
              this.sensitivityRsquareChart.setOption(ChartOption)
            }, 500);
          }
          break;
        case 'RMSE':
          if (null === this.sensitivityRMSEChart) {
            this.sensitivityRMSEChart = this.$echarts.init(document.getElementById('sensitivityRMSE'));
            this.sensitivityRMSEChart.setOption(this.initOption);
            this.sensitivityRMSEChart.showLoading();
            setTimeout(() => {
              this.sensitivityRMSEChart.hideLoading();
              this.sensitivityRMSEChart.setOption(ChartOption)
            }, 900);
          } else {
            this.sensitivityRMSEChart.showLoading();
            setTimeout(() => {
              this.sensitivityRMSEChart.hideLoading();
              this.sensitivityRMSEChart.setOption(ChartOption)
            }, 500);
          }
          break;
        case 'PBIAS':
          if (null === this.sensitivityPBIASChart) {
            this.sensitivityPBIASChart = this.$echarts.init(document.getElementById('sensitivityPBIAS'));
            this.sensitivityPBIASChart.setOption(this.initOption);
            this.sensitivityPBIASChart.showLoading();
            setTimeout(() => {
              this.sensitivityPBIASChart.hideLoading();
              this.sensitivityPBIASChart.setOption(ChartOption)
            }, 900);
          } else {
            this.sensitivityPBIASChart.showLoading();
            setTimeout(() => {
              this.sensitivityPBIASChart.hideLoading();
              this.sensitivityPBIASChart.setOption(ChartOption)
            }, 500);
          }
          break;
        case 'RSR':
          if (null === this.sensitivityRSRChart) {
            this.sensitivityRSRChart = this.$echarts.init(document.getElementById('sensitivityRSR'));
            this.sensitivityRSRChart.setOption(this.initOption);
            this.sensitivityRSRChart.showLoading();
            setTimeout(() => {
              this.sensitivityRSRChart.hideLoading();
              this.sensitivityRSRChart.setOption(ChartOption)
            }, 900);
          } else {
            this.sensitivityRSRChart.showLoading();
            setTimeout(() => {
              this.sensitivityRSRChart.hideLoading();
              this.sensitivityRSRChart.setOption(ChartOption)
            }, 500);
          }
          break;
        case 'lnNSE':
          if (null === this.sensitivityLnNSEChart) {
            this.sensitivityLnNSEChart = this.$echarts.init(document.getElementById('sensitivityLnNSE'));
            this.sensitivityLnNSEChart.setOption(this.initOption);
            this.sensitivityLnNSEChart.showLoading();
            setTimeout(() => {
              this.sensitivityLnNSEChart.hideLoading();
              this.sensitivityLnNSEChart.setOption(ChartOption)
            }, 900);
          } else {
            this.sensitivityLnNSEChart.showLoading();
            setTimeout(() => {
              this.sensitivityLnNSEChart.hideLoading();
              this.sensitivityLnNSEChart.setOption(ChartOption)
            }, 500);
          }
          break;
        default:
          console.log('chart change error');
          break;
      }
    },
    setCaliRunModelTime(){
      this.projectName=this.$store.getters.projectName;
      this.userName = sessionStorage.getItem('username');
      let params = new URLSearchParams();
      params.append("projectName",this.projectName);
      params.append("userName",this.userName);
      params.append("startTime",this.runModelStartTime)
      params.append("endTime",this.runModelEndTime)
      request.post('/basins/calibration/setCaliRunModelTime',params)
      .then(res=>{
        if (res.status === 200) {
          this.$Notice.success({
            title:'设置模型运行时间段成功',
            duration:10
          })
        }else {
          this.$Notice.error({
            title: '设置模型运行时间段失败',
            duration:10
          });
        }
      }).catch(e => {
          this.$Notice.error({
            title: '设置模型运行时间段失败',
          });
      })
    },
    setCaliRunCaliTime(){
      this.projectName=this.$store.getters.projectName;
      let params = new URLSearchParams();
      params.append("projectName",this.projectName);
      params.append("userName",this.userName);
      params.append("startTime",this.runCaliStartTime)
      params.append("endTime",this.runCaliEndTime)
      request.post('/basins/calibration/setCaliRunCaliTime',params)
      .then(res=>{
        if (res.status === 200) {
          this.$Notice.success({
            title:'设置模型率定时间段成功',
            duration:10
          })
        }else {
          this.$Notice.error({
            title: '设置模型率定时间段失败',
            duration:10
          });
        }
      }).catch(e => {
          this.$Notice.error({
            title: '设置模型率定时间段失败',
          });
      })
    },
    setCaliRunValiTime(){
      this.projectName=this.$store.getters.projectName;
      let params = new URLSearchParams();
      params.append("projectName",this.projectName);
      params.append("userName",this.userName);
      params.append("startTime",this.runValiStartTime)
      params.append("endTime",this.runValiEndTime)
      request.post('/basins/calibration/setCaliRunValiTime',params)
      .then(res=>{
        if (res.status === 200) {
          this.$Notice.success({
            title:'设置模型验证时间段成功',
            duration:10
          })
        }else {
          this.$Notice.error({
            title: '设置模型验证时间段失败',
            duration:10
          });
        }
      }).catch(e => {
          this.$Notice.error({
            title: '设置模型验证时间段失败',
          });
      })
    },
    selectCaliMethod(){
      this.projectName=this.$store.getters.projectName;
      var paramObj = {
        generationsNum: this.formNSGA2Params.generationsNum,
        populationSize: this.formNSGA2Params.populationSize,
        crossoverRate: this.formNSGA2Params.crossoverRate,
        mutateRate:    this.formNSGA2Params.mutateRate,
        maxMutatePerc: this.formNSGA2Params.maxMutatePerc
      };
      var options = {
        headers: {
          "content-type": "application/json"
        },
        method: "POST",
        data: JSON.stringify(paramObj)
      };
      request('/basins/calibration/setCaliMethodParams?projectName='+this.projectName+'&userName='+this.userName,options)
      .then(res=>{
        if (res.data.errCode === 200) {
          this.$Notice.success({
            title:'设置模型率定方法成功',
            duration:10
          })
          this.isSelectCaliMethod = true;
        }else {
          this.$Notice.warning({
            title: '设置模型率定方法失败，请重新设置！',
            desc: '失败原因： ' + res.data.msg,
            duration:10
          });
        }
      }).catch(e => {
          this.$Notice.error({
            title: '设置模型率定方法失败，请重新设置！',
          });
      })
    },
    setCliaParams(){
      var caliParams = this.convertSensitivityParams(this.sensitivityParamDataShow);
      this.projectName=this.$store.getters.projectName;
      var paramObj = {
        projectName: this.projectName,
        userName: this.userName,
        evaluateParams: caliParams
      };
      var options = {
        headers: {
          "content-type": "application/json"
        },
        method: "POST",
        data: JSON.stringify(paramObj)
      };
      request('/basins/calibration/setCaliParams',options)
      .then(res=>{
        if (res.data.errCode == 200) {
          this.$Notice.success({
            title:'选择率定参数成功',
            duration:10
          })
          this.isSetEvaluateParamsSuccess = true;
        }else {
          this.$Notice.warning({
            title: '选择率定参数失败，请重新设置！',
            desc: '失败原因： ' + res.data.msg,
            duration:10
          });
        }
      }).catch(e => {
          this.$Notice.error({
            title: '选择率定参数失败，请重新设置！',
          });
      })
    },
    changeNSGA2Params(){
      if (this.isNSGA2ParamsModalShow === false) {
        this.isNSGA2ParamsModalShow=true
      }
    },
    runCali(){

      this.$Notice.success({
        title:'模型参数自动率定完成',
        duration:10
      })

      // this.projectName=this.$store.getters.projectName;
      // console.log(sessionStorage.getItem('username'));
      // this.userName = sessionStorage.getItem('username');
      // this.runCaliStatus='modelRunning';
      // let params = new URLSearchParams();
      // params.append("userName",this.userName);
      // params.append("projectName",this.projectName);
      // request.post('/SEIMSServices/calibration',params)
      // .then(res=>{
      //   if (res.data === true) {
      //     this.$Notice.success({
      //       title:'模型参数自动率定完成',
      //       duration:10
      //     })
      //   this.runCaliStatus='modelRunSuccessed';
      //   }else {
      //     this.$Notice.warning({
      //       title: '模型参数自动率定运行失败，请重新检查设置！',
      //       duration:10
      //     });
      //     this.runCaliStatus='modelSetting';
      //   }
      // }).catch(e => {
      //     this.$Notice.error({
      //       title: '模型参数自动率定运行失败，请重新检查设置！',
      //     });
      //     this.runCaliStatus='modelSetting';
      // })
    },
    showCaliChart(){
      this.isCaliChartShow = !this.isCaliChartShow;
      if (this.isCaliChartShow) {
        this.initCaliCharts();
        this.getCaliResult();
      }
    },
    initCaliCharts(){
      if (null === this.caliChart) {
        this.caliChart = this.$echarts.init(document.getElementById('caliChart'));
        this.caliChart.setOption(this.caliChartOption);
        this.caliChart.showLoading();      
      }else{
        this.caliChart.showLoading();  
      }
    },
    getCaliResult(){
      // this.projectName=this.$store.getters.projectName;
      var paramObj = {
        generationsNum: this.formNSGA2Params.generationsNum,
        populationSize: this.formNSGA2Params.populationSize,
        crossoverRate: this.formNSGA2Params.crossoverRate,
        mutateRate:    this.formNSGA2Params.mutateRate,
        maxMutatePerc: this.formNSGA2Params.maxMutatePerc
      };
      var options = {
        headers: {
          "content-type": "application/json"
        },
        method: "POST",
        data: JSON.stringify(paramObj)
      };
      request('/basins/calibration/getCaliBestResult?projectName='+this.projectName,options)
      .then(res=>{
        if (200 === res.status) {
          this.caliValiResponseData = res.data
          this.setCaliChartData()
          this.$Notice.success({
            title:'获取率定结果成功',
            duration:10
          })
        }else {
          this.$Notice.error({
            title: '获取率定结果失败',
            duration:10
          });
          this.isCaliChartShow = false
        }
      }).catch(e => {
          this.$Notice.error({
            title: '获取率定结果失败',
          });
          this.isCaliChartShow = false
      })
    },
    setCaliChartData(){
      var caliChartOption = {
        xAxis: {
          data : this.caliValiResponseData['cali']['UTCDATETIME'].concat(this.caliValiResponseData['vali']['UTCDATETIME'])
                  .map(function (str) {
                    return str.replace(' ', '\n');
                  })
        },
        series: [
          {
            name: 'Best Simulation',
            data: this.caliValiResponseData['cali']['Sim'].concat(this.caliValiResponseData['vali']['Sim']),
            markLine : {
							symbol:"none",               //去掉警戒线最后面的箭头
							label:{
								position:"end"          //将警示值放在哪个位置，三个值“start”,"middle","end"  开始  中点 结束
							},
              data : [{
								silent:true,             //鼠标悬停事件  true没有，false有
								lineStyle:{               //警戒线的样式  ，虚实  颜色
                  // type:"solid",
                  width: 3,
									color:"#FA3934",
								},
								xAxis: this.caliValiResponseData['vali']['UTCDATETIME'][0].replace(' ', '\n')

							}]
            },
            // markArea: {
            //   data: [
            //         [{
            //             xAxis: this.caliValiResponseData['cali']['UTCDATETIME'][0].replace(' ', '\n'),
            //             itemStyle:{
            //               color:'#c60c30',
            //               opacity: 0.3
            //             }
            //         }, {
            //             xAxis: this.caliValiResponseData['cali']['UTCDATETIME'].slice(-1)[0].replace(' ', '\n')
            //         }],
            //         [{
            //             xAxis: this.caliValiResponseData['vali']['UTCDATETIME'][0].replace(' ', '\n'),
            //             itemStyle:{
            //               color:'#25C50E',
            //               opacity: 0.3
            //             }
            //         }, {
            //             xAxis: this.caliValiResponseData['vali']['UTCDATETIME'].slice(-1)[0].replace(' ', '\n')
            //         }]
            //     ],
            // },
          },
          {
            name:'Observed Points',
            data: this.caliValiResponseData['cali']['Obs'].concat(this.caliValiResponseData['vali']['Obs'])
          }
        ],
        graphic: [
          {
            type: 'text',
            z: 100,
            left: 82,
            top: 82,
            style: {
              fill: '#333',
              width: 200,
              overflow: 'break',
              text: 'Calibration\n'+ 
                    'NSE:' + Number(this.caliValiResponseData['cali']['NSE']).toFixed(2) + '\n' +
                    'R²: ' + Number(this.caliValiResponseData['cali']['R-square']).toFixed(2) + '\n' +
                    'PBIAS:' + Number(this.caliValiResponseData['cali']['PBIAS']).toFixed(2),
              font: '13px Microsoft YaHei'
            }
          },
          {
            type: 'text',
            z: 100,
            right:52,
            top: 82,
            style: {
              fill: '#333',
              width: 200,
              overflow: 'break',
              text: 'Validation\n'+ 
                    'NSE:' + Number(this.caliValiResponseData['vali']['NSE']).toFixed(2) + '\n' +
                    'R²: ' + Number(this.caliValiResponseData['vali']['R-square']).toFixed(2) + '\n' +
                    'PBIAS:' + Number(this.caliValiResponseData['vali']['PBIAS']).toFixed(2),
              font: '13px Microsoft YaHei'
            }
          },
        ]
      }
      setTimeout(() => {
        this.caliChart.hideLoading();
        this.caliChart.setOption(caliChartOption)
      }, 500);
    },

  },
}
</script>

<style>
  .finishBtn{
    display: flex;
    justify-content: center ;
    margin-top: 7px;
    text-align: center;
  }
  .finishBtn>button{
    width: 90%;
  }
  .selectSetting>span{
    font-size:15px;
    font-weight:bold;
  }
  .selectSetting{
    margin:5px 0 5px 0 ;
  }
  .selectParamsBtn{
    text-align:center;
    margin-bottom:14px
  }
  .selectParamsBtn>button{
    width:250px;
  }
</style>