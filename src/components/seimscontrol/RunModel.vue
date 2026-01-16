<!--
 * @Author: BinjieYuan yuanbj9035@163.com
 * @Date: 2022-08-08 20:38:23
 * @LastEditors: BinjieYuan yuanbj9035@163.com
 * @LastEditTime: 2023-04-06 19:59:54
 * @FilePath: \WebBasin\front\src\components\seimscontrol\RunModel.vue
 * @Description: run SEIMS model
-->
<template>
  <div>
    <Modal v-model="runModelShowTemp" draggable scrollable footer-hide :mask="false" :styles="{top: '300px'}" title="Simulate"
      width="460px" @on-visible-change="modalVisible">
      <div>
        <Tabs type="card" :animated="false">
          <TabPane label="Mode">
            <div>
              <Form :model="modeFormValue" :label-width="90" :rules="intervaRules" ref="modeFormValue" inline>
                <FormItem label="Mode" prop="mode">
                  <Select v-model="modeFormValue.mode" style="width:100px">
                    <Option v-for="item in modeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
                <FormItem label="Time step" prop="intervalValue">
                  <Input v-if="modeFormValue.mode == 'Daily'" v-model="modeFormValue.intervalValue" style="width: 100px"
                    placeholder="Unit: Day"></Input>
                  <Input v-else-if="modeFormValue.mode == 'Storm'" v-model="modeFormValue.intervalValue"
                    style="width: 100px" placeholder="单位：秒"></Input>
                </FormItem>
                <FormItem label="Simulation period" prop="date">
                  <DatePicker type="datetimerange" :start-date="new Date(1994, 0, 1)" format="yyyy-MM-dd HH:mm" v-model="modeFormValue.date"
                    placeholder="Select date and time" style="width: 300px" transfer split-panels :editable='false' />
                </FormItem>
                <FormItem>
                  <Button type="primary" @click="handleModeSubmit('modeFormValue')"
                    :loading="modelModeSubmitButtonLoading">OK</Button>
                  <Button @click="handleModeReset('modeFormValue')" style="margin-left: 8px">Reset</Button>
                </FormItem>
              </Form>
            </div>
          </TabPane>
          <TabPane label="Module">
            <div>
              <Form :model="moduleFormValue" :label-width="110" :rules="moduleRules" ref="moduleFormValue" inline>
                <FormItem label="Module" prop="module">
                  <Select v-model="moduleFormValue.module" placeholder="Please select" style="width:290px" transfer>
                    <Option v-for="item in moduleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
                <FormItem>
                  <Button type="primary" ghost>Custom</Button>
                </FormItem>
                <FormItem>
                  <Button type="primary" @click="handleModuleSubmit('moduleFormValue')">OK</Button>
                  <Button @click="handleModuleReset('moduleFormValue')" style="margin-left: 8px">Reset</Button>
                </FormItem>
              </Form>
            </div>
          </TabPane>
          <TabPane label="Outputs">
            <div>
              <Form :model="outputFormValue" :label-width="110" :rules="outputRules" ref="outputFormValue" inline>
                <FormItem label="Outputs" prop="output">
                  <Select v-model="outputFormValue.output" placeholder="Please select" style="width:290px" transfer>
                    <Option v-for="item in outputList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
                <FormItem>
                  <Button type="primary" ghost>Custom</Button>
                </FormItem>
                <FormItem>
                  <Button type="primary" @click="handleOutputSubmit('outputFormValue')">OK</Button>
                  <Button @click="handleOutputReset('outputFormValue')" style="margin-left: 8px">Reset</Button>
                </FormItem>
              </Form>
              <!-- <div v-if="outputStatus" class="finishBtn" >
                <Button type="success" ghost @click="runModelButton">运行模型</Button> 
                <br>
              </div> -->
              <div class="finishBtn">
                <!-- <Button v-if="runModelStatus == 'modelSetting'" type="info" ghost @click="runModelButton">Run WISE</Button> -->
                <Button v-if="runModelStatus == 'modelSetting'" type="info" ghost @click="runModelButton" :style="runWISEButtonDynamicStyle" :loading="runWISELoading">Run WISE</Button>
                <div v-if="runModelStatus == 'modelRunning'" style="width:85%">
                  <i-progress :percent="99.99" status="active" hide-info></i-progress>
                  <span>Runing...</span>
                </div>
                <div v-else-if="runModelStatus == 'modelRunSuccessed'" style="width:100%">
                  <p class="finishFont">Completed</p>
                  <div class="finishBtn">
                    <Button type="info" ghost @click="runModelButton">Rerun</Button>
                  </div>
                </div>

                <!-- <Button type="info" ghost @click="runAIButton" :style="runAIButtonDynamicStyle" :loading="runAILoading">Run AI</Button> -->

                
                <!-- <div v-if="runAIStatus == 'AIRunning'" style="width:85%">
                  <i-progress :percent="99.99" status="active" hide-info></i-progress>
                  <span>Runing...</span>
                </div>
                <div v-else-if="runAIStatus == 'AIRunSuccessed'" style="width:100%">
                  <p class="finishFont">Completed</p>
                  <div class="finishBtn">
                    <Button type="info" ghost @click="runAIButton">Rerun</Button>
                  </div>
                </div> -->

              </div>

            </div>
          </TabPane>
        </Tabs>
      </div>
    </Modal>
    <Modal v-model="isCheckModelShow" :mask-closable="false" width="350">
      <template #header>
        <p style="color:#2d8cf0;text-align:center;font-size:20px">
          <Icon type="gear-b" size="20"></Icon>
          <span>Do you want to submit the current model settings?</span>
        </p>
      </template>
      <div>
        <List header="Current model settings" border size="small">
          <ListItem>Mode:{{ modeFormValue.mode }}</ListItem>
          <ListItem>Time step:{{ modeFormValue.intervalValue }}</ListItem>
          <ListItem>Start Time:{{ modeStartTime }}</ListItem>
          <ListItem>End Time:{{ modeEndTime }}</ListItem>
          <ListItem>Module:{{ modeSelect }}</ListItem>
          <ListItem>Output:{{ outputSelect }}</ListItem>
        </List>
      </div>
      <template #footer>
        <Button type="success" size="large" :loading="submitModuleDetailStatus" @click="submitModule">OK</Button>
        <Button type="error" size="large" :loading="dropModuleDetailStatus" @click="dropModule">Cancel</Button>
      </template>
    </Modal>
  </div>
</template>

<script>
import { request } from "@/network/request";
import { flattenJSON } from "three/src/animation/AnimationUtils.js";
export default {
  name: 'RunModel',
  props: {
    runModelShow: {
      type: Boolean
    }
  },
  watch: {
    runModelShow(newVal, oldVal) {
      this.runModelShowTemp = newVal
    },
    immediate: true
  },
  computed: {
    runWISEButtonDynamicStyle() {
      if (this.completeRunWISE) return "background-color: rgb(85, 225, 85);color: blue;margin- right:5px"
    },
    runAIButtonDynamicStyle() {
      if (this.completeRunAI) return "background-color: rgb(85, 225, 85);color: blue;margin- right:5px"
    }
  },
  data() {
    const validateValue = (rule, value, callback) => {
      if (!value.match(/^\+?[1-9][0-9]*$/)) {
        callback(new Error('应输入非零正整数'))
      } else {
        callback()
      }
    };
    return {
      runModelShowTemp: false,
      projectName: '',
      modeList: [
        {
          value: 'Daily',
          label: 'Daily'
        },
        {
          value: 'Storm',
          label: 'Storm'
        }
      ],
      modeFormValue: {
        mode: 'Daily',
        intervalValue: '',
        date: null,
      },
      modeStartTime: '',
      modeEndTime: '',
      modeStatus: false,
      intervaRules: {
        mode: [
          { required: true, message: 'Please select mode', trigger: 'blur' },
        ],
        intervalValue: [
          { required: true, message: 'Time step is None', trigger: 'blur' },
          { type: 'number', validator: validateValue, trigger: 'blur', }
        ],
        date: [
          { type: 'array', required: true, message: 'Simulation period is None', trigger: 'blur' },
        ]
      },
      modelModeSubmitButtonLoading: false,
      moduleList: [
        {
          value: 'baseModule',
          label: 'Daily hydrological simulation'
        },
        {
          value: 'module1',
          label: 'Hydrological and hydrodynamic coupling model'
        },
      ],
      moduleFormValue: {
        module: '',
      },
      moduleRules: {
        module: [
          { required: true, message: 'Please select module', trigger: 'blur' }
        ],
      },
      moduleStatus: false,
      outputFormValue: {
        output: '',
      },
      outputList: [
        {
          value: 'demoOutput',
          label: 'Demo output'
        },
        {
          value: 'timeSeries',
          label: 'time Series'
        },
        {
          value: 'raster',
          label: 'Raster'
        },
        {
          value: 'timeSeriesRaster',
          label: 'time series raster'
        },
      ],
      outputRules: {
        output: [
          { required: true, message: 'output is None', trigger: 'blur' }
        ],
      },
      isCheckModelShow: false,
      outputStatus: false,
      submitModuleDetailStatus: false,
      dropModuleDetailStatus: false,
      modeSelect: '',
      outputSelect: '',
      runModelStatus: '',
      completeRunWISE: false,
      completeRunAI: false,
      runAILoading: false,
      runWISELoading: false,
    }
  },
  methods: {
    modalVisible(isVisible) {
      // console.log(isVisible);
      this.$emit('update:runModelShow', isVisible); //实现createModelShow的双向绑定
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    handleModeSubmit(name) {
      console.log("确定")
      this.projectName = this.$store.getters.projectName;
      var username = sessionStorage.getItem('username');
      this.$refs[name].validate((valid) => {
        if (valid) {
          console.log("确定1")
          this.modelModeSubmitButtonLoading = true;
          this.modeDateFormat();
          //提交请求
          let params = new URLSearchParams();
          params.append("projectName", this.projectName);
          params.append("username", username);
          params.append("startTime", this.modeStartTime);
          params.append("endTime", this.modeEndTime);
          params.append("mode", this.modeFormValue.mode);
          params.append("interval", this.modeFormValue.intervalValue);
          request.post('/basins/modelModeConfig', params)
            .then(res => {
              if (res.data.errCode == 200) {
                this.$Notice.success({
                  title: 'Mode setting successful',
                  duration: 10
                })
                this.modeStatus = true;
                this.modelModeSubmitButtonLoading = false;
              } else {
                this.$Notice.warning({
                  title: 'Mode setting failed!',
                  desc: '失败原因： ' + res.data.msg,
                  duration: 10
                });
                this.modelModeSubmitButtonLoading = false;
              }
            }).catch(e => {
              this.$Notice.error({
                title: 'Mode setting failed!',
              });
              this.modelModeSubmitButtonLoading = false;
            })
        } else {
          this.$Notice.error({
            title: 'Mode setting failed!',
          });
          this.modelModeSubmitButtonLoading = false;
        }
      })
    },
    modeDateFormatT() {
      var beginDate = new Date(this.modeFormValue.date[0]);
      var endDate = new Date(this.modeFormValue.date[1]);
      this.modeStartTime = this.dateFormat("YYYY-mm-ddTHH:MM:SS", beginDate)
      this.modeEndTime = this.dateFormat("YYYY-mm-ddTHH:MM:SS", endDate)
    },
    modeDateFormat() {
      var beginDate = new Date(this.modeFormValue.date[0]);
      var endDate = new Date(this.modeFormValue.date[1]);
      this.modeStartTime = this.dateFormat("YYYY-mm-dd HH:MM:SS", beginDate)
      this.modeEndTime = this.dateFormat("YYYY-mm-dd HH:MM:SS", endDate)
    },
    handleModeReset(name) {
      this.modeStatus = false;
      this.handleReset(name);
    },
    handleModuleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!');
          this.moduleStatus = true;
        } else {
          this.$Message.error('Fail!');
        }
      })
    },
    handleModuleReset(name) {
      this.moduleStatus = false;
      this.handleReset(name);
    },
    handleOutputSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!');
          this.outputStatus = true;
          if (this.modeStatus == true && this.moduleStatus == true && this.outputStatus == true) {
            this.runModelStatus = 'modelSetting';
          } else {
            this.$Notice.warning({
              title: 'Model setup incomplete！',
              duration: 10
            });
          }
        } else {
          this.$Message.error('Fail!');
        }
      })
    },
    handleOutputReset(name) {
      this.outputStatus = false;
      this.handleReset(name);
    },
    checkModel() {
      console.log(this.modeStatus)
      console.log(this.moduleStatus)
      console.log(this.outputStatus)
      if (this.modeStatus == true && this.moduleStatus == true && this.outputStatus == true) {
        this.isCheckModelShow = true;
        this.modeSelect = this.getDictValue(this.moduleList, this.moduleFormValue.module)
        this.outputSelect = this.getDictValue(this.outputList, this.outputFormValue.output)
      } else {
        this.$Notice.warning({
          title: 'Model setup incomplete！',
          duration: 10
        });
      }
    },
    runModelButton() {
      this.checkModel();
    },
    submitModule() {
      this.runWISELoading = true
      this.submitModuleDetailStatus = true;
      setTimeout(() => {
        this.submitModuleDetailStatus = false;
        this.isCheckModelShow = false;
        this.runModelApi();
      }, 500);
    },
    runModelApi() {
      // this.runModelStatus = 'modelRunning';
      let params = new URLSearchParams();
      var username = sessionStorage.getItem('username');
      params.append("projectName", this.projectName);
      params.append("username", username);
      request.post('/SEIMSServices/runModel', params)
        .then(res => {
          // console.log("流域划分",res);
          if (res) {
            this.runWISELoading = false
            this.$Notice.success({
              title: 'Completed run',
              duration: 10
            })
            console.log(res)
            this.runModelStatus = 'modelRunSuccessed';
            this.completeRunWISE = true
            //下载模拟结果图
            // var href = 'http://localhost:8083/SEIMSServices/downLandResultPNG?username=' + username + '&projectName=' + this.projectName;
            // var downloadRandName2 = document.createElement('a');
            // downloadRandName2.href = href;
            // downloadRandName2.click();

            // this.geoserverPublih();
            //获取模拟结果数据
            var _this = this
            var params = new URLSearchParams();
            var username = sessionStorage.getItem('username');
            params.append("projectName", this.projectName);
            params.append("username", username);
            request.post('/SEIMSServices/getSimulationResultSequence', params)
              .then(res => {
                console.log(res.data)
                console.log(res.data[0].split(","))
                _this.$store.commit("SET_RAINFALL_LIST", res.data[0].split(","));
                _this.$store.commit("SET_Q_LIST", res.data[1].split(","));
                _this.$store.commit("SET_DATE_LIST", res.data[2].split(","));
                _this.$store.commit("SET_DOC_LIST", res.data[3].split(","));
              }).catch(e => {
                this.$Notice.error({
                  title: 'Run failed!',
                });
                this.runModelStatus = 'modelSetting';
              })
            this.completeRunWISE = true
          } else {
            this.$Notice.warning({
              title: 'Run failed!',
              duration: 10
            });
            this.runModelStatus = 'modelSetting';
          }
        }).catch(e => {
          this.$Notice.error({
            title: 'Run failed!',
          });
          this.runModelStatus = 'modelSetting';
        })
    },
    runAIButton() {
      // this.runAIStatus = 'AIRunning';
      console.log(this.modeFormValue.date)
      this.runAILoading = true
      var beginDate = new Date(this.modeFormValue.date[0]);
      var endDate = new Date(this.modeFormValue.date[1]);
      var StartTime = this.dateFormat("YYYY", beginDate)
      var EndTime = this.dateFormat("YYYY", endDate)
      
      console.log(StartTime)
      console.log(EndTime)

      let params = new URLSearchParams();
      var username = sessionStorage.getItem('username');
      var projectName = this.$store.getters.projectName;
      params.append("projectName", projectName);
      params.append("username", username);
      params.append("startTime", StartTime);
      params.append("endTime", EndTime);
      request.post('/SEIMSServices/runAI', params)
      
      console.log("调用")
      var polling = new FormData();
      polling.append("projectname", projectName);
      polling.append("username", username);
      polling.append('filepathandname',"/processing/1/data_prepare/climate/prediction.csv") //子流域划分生成的最后一个文件是subbasinfile/subbasin.shp，以此作为子流域划分结束的标志
      var _this = this
      let timer = window.setInterval(() => {
        // setTimeout是自带清除定时器
        setTimeout( () =>{
          request.post("/Polling", polling)
          .then(res=>{
            // console.log(res.data.errCode);
            if (res.data.errCode == 200) {
              // 清除定时器
              clearInterval(timer)
              // 添加图层
              
              this.$Message.success({
                content: 'Run AI Successfully',
                duration: 3
              });
              
              console.log(res.data)
              console.log(res.data.data[0])
              console.log(res.data.data[0].split(","))
              _this.$store.commit("SET_AI_RAINFALL_LIST", res.data.data[2].split(","));
              _this.$store.commit("SET_AI_Q_LIST", res.data.data[1].split(","));
              _this.$store.commit("SET_AI_DATE_LIST", res.data.data[0].split(","));

            }else if(res.data.errCode == 204){
              // 继续轮询
              // console.log("继续轮询")
            }else {
              this.$Notice.success({
                title: "Run AI 失败",
                duration: 10,
              });
              // 清除定时器
              clearInterval(timer)
              _this.completeRunAI = true
              _this.runAILoading = false
            }
          })
          .catch(err=>{
            console.log(err);
            confirm('运行失败!');
            // 清除定时器
            clearInterval(timer)
          });
        }, 0);
      // 轮询时间间隔为20/1min/6s:1000 * 60 * 0.1
      }, 2000);
    },
    dropModule() {
      this.isCheckModelShow = false;
    },

    getDictValue(jsObjects, selectValue) {
      var result = jsObjects.filter(x => x.value === selectValue);
      return result[0].label
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
  }
}
</script>

<style>
.finishBtn {
  display: flex;
  justify-content: center;
  margin-top: 7px;
  text-align: center;
}

.finishBtn>button {
  width: 90%;
}
</style>