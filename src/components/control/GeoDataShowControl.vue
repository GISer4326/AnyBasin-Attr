<!--
 * @Author: BinjieYuan yuanbj9035@163.com
 * @Date: 2022-05-08 21:49:16
 * @LastEditors: BinjieYuan yuanbj9035@163.com
 * @LastEditTime: 2022-11-20 21:08:32
 * @FilePath: \WebBasin\front\src\components\mapcontrol\GeoDataShowControl.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <!-- optionally define the sidebar content via HTML markup -->
    <div id="sidebar" class="leaflet-sidebar collapsed" style="height: 80%;left: 10px;">
      <!-- nav tabs -->
      <div class="leaflet-sidebar-tabs">
        <!-- top aligned tabs -->
        <ul role="tablist">
          <li><a href="#home" role="tab"><i class="fa fa-bars active"></i></a></li>
          <li><a href="#map" role="tab">
              <Icon type="md-map" />
            </a></li>
          <li><a href="#chart" role="tab">
              <Icon type="md-stats" />
            </a></li>
          <li><a href="#autopan" role="tab"><i class="fa fa-arrows"></i></a></li>
          <li><a href="#selfdefine" role="tab">
              <Icon type="md-medal" />
            </a></li>

        </ul>
        <!-- bottom aligned tabs -->
        <ul role="tablist">
          <li><a href="https://github.com/nickpeihl/leaflet-sidebar-v2"><i class="fa fa-github"></i></a></li>
        </ul>
      </div>
      <!-- panel content -->
      <div class="leaflet-sidebar-content">
        <div class="leaflet-sidebar-pane" id="home">
          <h1 class="leaflet-sidebar-header">
            WISE Modeler
            <span class="leaflet-sidebar-close"><i class="fa fa-caret-left"></i></span>
          </h1>
          <div>
            <Menu ref="menuActive" theme="light" width="auto">
              <!-- <MenuItem name="/basinshow" @click.native="showBasinShow">
                    <Icon type="ios-navigate"></Icon>
                    <span>流域展示</span>
                  </MenuItem> -->
              <MenuItem name="/createmodel" @click.native="showCreateModel">
              <Icon type="ios-search"></Icon>
              <span>Modeling</span>
              </MenuItem>
              <MenuItem name="/runmodel" @click.native="showRunModel">
              <Icon type="ios-settings"></Icon>
              <span>Simulate</span>
              </MenuItem>
              <MenuItem name="/calimodel" @click.native="showCaliModel">
              <Icon type="ios-settings"></Icon>
              <span>Calibrate</span>
              </MenuItem>
              <MenuItem name="/datamanagement" @click.native="showDataModel">
              <Icon type="ios-settings"></Icon>
              <span>Data management</span>
              </MenuItem>
              <!-- <MenuItem name="1-3">
              <Icon type="ios-settings"></Icon>
              <span>开发中.....</span>
              </MenuItem> -->
            </Menu>
          </div>
        </div>
        <div class="leaflet-sidebar-pane" id="map">
          <h1 class="leaflet-sidebar-header">
            View spatial data
            <span class="leaflet-sidebar-close"><i class="fa fa-caret-left"></i></span>
          </h1>
          <div id="BackgroundColor">
            <Collapse id="CollapseBackgroundColor" v-model="PanelShowValue">
              <Panel name="vector">
                <span style="font-size:15px">Vector data</span>
                <Tooltip content="点击更新数据" placement="right-start">
                  <Icon type="ios-refresh-circle-outline" size='20' @click="reFreshVector" />
                </Tooltip>
                <div slot="content">
                  <CheckboxGroup v-model="vectorGroup" @on-change="controlVectorLayer">
                    <div class="CheckBoxDiv">
                      <Checkbox label="basinBoundLayer" v-model="basinBoundChecked"
                        :disabled="this.$store.getters.basinBoundLayer == null">Basin boundary</Checkbox>
                      <!-- <Button v-if="disabledBasinScope" type="primary" ghost shape="circle" size="small" @click="vectorDataShowClick('disabledBasinScope','basin')">预览</Button> -->
                      <!-- <Button v-else-if="!disabledBasinScope" type="success" ghost shape="circle" size="small">已加载</Button> -->
                    </div>
                    <div class="CheckBoxDiv">
                      <Checkbox label="basinOutletLayer" v-model="basinOutletChecked"
                        :disabled="this.$store.getters.basinOutletLayer == null">Basin outlet</Checkbox>
                      <!-- <Button v-if="disabledOutlet" type="primary" ghost shape="circle" size="small" @click="vectorDataShowClick('disabledOutlet','outlet')">预览</Button> -->
                      <!-- <Button v-else-if="!disabledOutlet" type="success" ghost shape="circle" size="small">已加载</Button> -->
                    </div>
                    <div class="CheckBoxDiv">
                      <Checkbox label="subBasinOutletLayer" v-model="subBasinOutletChecked"
                        :disabled="this.$store.getters.subBasinOutletLayer == null">Subbasin outlet</Checkbox>
                    </div>
                    <div class="CheckBoxDiv">
                      <Checkbox label="streamLayer" v-model="streamChecked"
                        :disabled="this.$store.getters.streamLayer == null">River</Checkbox>
                      <!-- <Button v-if="disabledReach" type="primary" ghost shape="circle" size="small"
                        @click="vectorDataShowClick('disabledReach', 'reach')">预览</Button>
                      <Button v-else-if="!disabledReach" type="success" ghost shape="circle" size="small">已加载</Button> -->
                    </div>
                    <div class="CheckBoxDiv">
                      <Checkbox label="subBasinLayer" v-model="subBasinChecked"
                        :disabled="this.$store.getters.subBasinLayer == null">Subbasion</Checkbox>
                      <!-- <Button v-if="disabledSubbasinV" type="primary" ghost shape="circle" size="small"
                        @click="vectorDataShowClick('disabledSubbasinV', 'subbasin')">预览</Button>
                      <Button v-else-if="!disabledSubbasinV" type="success" ghost shape="circle" size="small">已加载</Button> -->
                    </div>
                    <div class="CheckBoxDiv">
                      <Checkbox label="HLULayer" v-model="HLUChecked" :disabled="this.$store.getters.HLULayer == null">
                        Subarea</Checkbox>
                      <!-- <Button v-if="disabledSubbasinV" type="primary" ghost shape="circle" size="small"
                        @click="vectorDataShowClick('disabledSubbasinV', 'subbasin')">预览</Button>
                      <Button v-else-if="!disabledSubbasinV" type="success" ghost shape="circle" size="small">已加载</Button> -->
                    </div>


                  </CheckboxGroup>
                </div>
              </Panel>
              <Panel name="raster">
                <span style="font-size:15px">Raster data</span>
                <Tooltip content="点击更新数据" placement="right-start">
                  <Icon type="ios-refresh-circle-outline" size='20' @click="reFreshRaster" />
                </Tooltip>
                <div slot="content">
                  <CheckboxGroup v-model="rasterGroup" @on-change="controlRasterLayer">
                    <div class="CheckBoxDiv">
                      <Checkbox label="dem" :disabled="disabledDem">DEM</Checkbox>
                      <Button v-if="disabledDem" type="primary" ghost shape="circle" size="small"
                        @click="rasterDataShowClick('disabledDem', 'dem')">Preview</Button>
                      <Button v-else-if="!disabledDem" type="success" ghost shape="circle" size="small">可预览</Button>
                    </div>
                    <div class="CheckBoxDiv">
                      <Checkbox label="flow_dir" :disabled="disabledFlowDir">Flow direction</Checkbox>
                      <Button v-if="disabledFlowDir" type="primary" ghost shape="circle" size="small"
                        @click="rasterDataShowClick('disabledFlowDir', 'flow_dir')">Preview</Button>
                      <Button v-else-if="!disabledFlowDir" type="success" ghost shape="circle" size="small">可预览</Button>
                    </div>
                    <div class="CheckBoxDiv">
                      <Checkbox label="acc" :disabled="disabledAcc">Flow Accumulation </Checkbox>
                      <Button v-if="disabledAcc" type="primary" ghost shape="circle" size="small"
                        @click="rasterDataShowClick('disabledAcc', 'acc')">Preview</Button>
                      <Button v-else-if="!disabledAcc" type="success" ghost shape="circle" size="small">可预览</Button>
                    </div>
                    <div class="CheckBoxDiv">
                      <Checkbox label="subbasin" :disabled="disabledSubbasinR">Subbasin raster</Checkbox>
                      <Button v-if="disabledSubbasinR" type="primary" ghost shape="circle" size="small"
                        @click="rasterDataShowClick('disabledSubbasinR', 'subbasin')">Preview</Button>
                      <Button v-else-if="!disabledSubbasinR" type="success" ghost shape="circle"
                        size="small">可预览</Button>
                    </div>
                    <div class="CheckBoxDiv">
                      <Checkbox label="stream_link" :disabled="disabledStreamLink">River raster</Checkbox>
                      <Button v-if="disabledStreamLink" type="primary" ghost shape="circle" size="small"
                        @click="rasterDataShowClick('disabledStreamLink', 'stream_link')">Preview</Button>
                      <Button v-else-if="!disabledStreamLink" type="success" ghost shape="circle"
                        size="small">可预览</Button>
                    </div>
                    <div class="CheckBoxDiv">
                      <Checkbox label="LANDCOVER" :disabled="disabledLandcover">Landuse</Checkbox>
                      <Button v-if="disabledLandcover" type="primary" ghost shape="circle" size="small"
                        @click="rasterDataShowClick('disabledLandcover', 'LANDCOVER')">Preview</Button>
                      <Button v-else-if="!disabledLandcover" type="success" ghost shape="circle"
                        size="small">可预览</Button>
                    </div>
                    <div class="CheckBoxDiv">
                      <Checkbox label="soiltype" :disabled="disabledSoiltype">Soiltype</Checkbox>
                      <Button v-if="disabledSoiltype" type="primary" ghost shape="circle" size="small"
                        @click="rasterDataShowClick('disabledSoiltype', 'soiltype')">Preview</Button>
                      <Button v-else-if="!disabledSoiltype" type="success" ghost shape="circle"
                        size="small">可预览</Button>
                    </div>
                  </CheckboxGroup>
                </div>
              </Panel>
            </Collapse>
          </div>
        </div>
        <div class="leaflet-sidebar-pane" id="chart">
          <h1 class="leaflet-sidebar-header">
            Chart
            <span class="leaflet-sidebar-close"><i class="fa fa-caret-left"></i></span>
          </h1>
          <div id="BackgroundColor">
            <Collapse id="CollapseBackgroundColor" v-model="PanelShowChart">
              <Panel name="modelParam">
                Simulation result
                <div slot="content">
                  <CheckboxGroup @on-change="controlChart">
                    <Checkbox label="modelParamChart">WISE Simulation result chart</Checkbox><br>
                  </CheckboxGroup>
                  <CheckboxGroup @on-change="controlChartAI">
                    <Checkbox label="modelParamChart">AI Simulation result chart</Checkbox><br>
                  </CheckboxGroup>
                  <CheckboxGroup @on-change="controlVisualizationFrozenSoil">
                    <Checkbox label="modelParamChart">3D visualization of frozen soil</Checkbox><br>
                  </CheckboxGroup>
                </div>
              </Panel>
              <!-- <Panel name="modelParam2">
                其他图表
                <div slot="content">
                  <CheckboxGroup v-model="otherChartGroup">
                    <Checkbox label="dem">其他1</Checkbox><br>
                    <Checkbox label="rasterBaisn">其他2</Checkbox><br>
                  </CheckboxGroup>
                </div>
              </Panel> -->
            </Collapse>
          </div>
        </div>
        <div class="leaflet-sidebar-pane" id="autopan">
          <h1 class="leaflet-sidebar-header">
            autopan
            <span class="leaflet-sidebar-close"><i class="fa fa-caret-left"></i></span>
          </h1>
          <p>
            <code>Leaflet.control.sidebar({ autopan: true })</code>
            makes shure that the map center always stays visible.
          </p>
          <p>
            The autopan behviour is responsive as well.
            Try opening and closing the sidebar from this pane!
          </p>
        </div>
        <div class="leaflet-sidebar-pane" id="selfdefine">
          <h1 class="leaflet-sidebar-header">
            环境因子提取
            <span class="leaflet-sidebar-close"><i class="fa fa-caret-left"></i></span>
          </h1>

          <div>
            <Menu ref="menuActive" theme="light" width="auto">
              <!-- <MenuItem name="/basinshow" @click.native="showBasinShow">
                    <Icon type="ios-navigate"></Icon>
                    <span>流域展示</span>
                  </MenuItem> -->
              <MenuItem name="/basinAttribute"  @click.native="showBasinAttribute">
              <Icon type="ios-settings"></Icon>
              <span>流域特征</span>
              </MenuItem>
              <MenuItem name="/landuse" @click.native="showLandUse">
              <Icon type="ios-search"></Icon>
              <span>湖泊流域环境因子</span>
              </MenuItem>
              <MenuItem name="/soiltype" @click.native="showSoilType">
              <Icon type="ios-settings"></Icon>
              <span>土壤类型</span>
              </MenuItem>
              <MenuItem name="/GLiM" @click.native="showGLiM">
              <Icon type="ios-settings"></Icon>
              <span>地质类型</span>
              </MenuItem>
              <MenuItem name="/calimodel" @click.native="">
              <Icon type="ios-settings"></Icon>
              <span>地形因子</span>
              </MenuItem>
              <MenuItem name="1-3">
              <Icon type="ios-settings"></Icon>
              <span>气象因子</span>
              </MenuItem>
              <MenuItem name="1-3">
              <Icon type="ios-settings"></Icon>
              <span>人类活动</span>
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
    </div>
    <div>
      <!-- <basin-show :basinShow.sync="basinShow"></basin-show> -->
      <create-model :createModelShow.sync="createModelShow" @changeLayerStatus="changeLayerStatus"></create-model>
      <run-model :runModelShow.sync="runModelShow"></run-model>
      <calibration-model :caliModelShow.sync="caliModelShow"></calibration-model>
      <data-management :dataModelShow.sync="dataModelShow"></data-management>
      <TimeSeriesChart :chartShow.sync="chartShow"></TimeSeriesChart>
      <TimeSeriesChart_ai :chartShow_ai.sync="chartShow_ai"></TimeSeriesChart_ai>
      <visualizationFrozenSoil :visualizationFrozenSoilShow.sync="visualizationFrozenSoilShow">
      </visualizationFrozenSoil>
      <LandUse :landUseShow.sync="landUseShow" ref="LandUse"></LandUse>
      <SoilType :soilTypeShow.sync="soilTypeShow" ref="SoilType"></SoilType>
      <GLiM :GLiMShow.sync="GLiMShow" ref="GLiM"></GLiM>
      <BasinAttribute :basinAttributeShow.sync="basinAttributeShow"></BasinAttribute>
    </div>
  </div>
</template>

<script>
import "@/assets/js/leaflet-sidebar.min.js";
import TimeSeriesChart from "../charts/TimeSeriesChart"
import TimeSeriesChart_ai from "../charts/TimeSeriesChart_ai"
import visualizationFrozenSoil from "../charts/visualizationFrozenSoil"
import { request } from "@/network/request";

// import BasinShow from '../control/BasinShow'
import CreateModel from '../seimscontrol/CreateModel'
import RunModel from '../seimscontrol/RunModel'
import CalibrationModel from '../seimscontrol/CalibrationModel'
import LandUse from "../factorquerycontrol/LandUse.vue";
import BasinAttribute from "../factorquerycontrol/BasinAttribute.vue";
import SoilType from "../factorquerycontrol/SoilType.vue";
import GLiM from "../factorquerycontrol/GLiM.vue";
import DataManagement from "../seimscontrol/DataManagement.vue";



export default {
  name: 'GeoDataShowControl',
  components: { CreateModel, RunModel, CalibrationModel, TimeSeriesChart, TimeSeriesChart_ai, LandUse, SoilType, GLiM, BasinAttribute, DataManagement, visualizationFrozenSoil},
  data() {
    return {
      basinShow: false,
      createModelShow: false,
      runModelShow: false,
      caliModelShow: false,
      landUseShow: false,
      soilTypeShow: false,
      GLiMShow: false,
      basinAttributeShow: false,
      dataModelShow: false,
      //
      chartShow: false,
      chartShow_ai: false,
      visualizationFrozenSoilShow: false,
      map: null,
      basinDataLayerGroup: null,
      PanelShowValue: ['vector', 'raster'],
      vectorGroup: [],
      rasterGroup: [],
      vectorShowGroup: [],
      rasterShowGroup: [],
      vectorLayerId: '',
      rasterLayerId: '',
      projectname: '',
      PanelShowChart: ['modelParam', 'modelParam2'],
      chartGroup: [],
      otherChartGroup: [],
      disabledDem: true,
      disabledFlowDir: true,
      disabledAcc: true,
      disabledSubbasinR: true,
      disabledStreamLink: true,
      disabledLandcover: true,
      disabledSoiltype: true,
      disabledBasinScope: true,
      disabledOutlet: true,
      disabledReach: true,
      disabledSubbasinV: true,

      basinBoundChecked: false,
      basinOutletChecked: false,
      subBasinChecked: false,
      streamChecked: false,
      HLUChecked: false,
      subBasinOutletChecked: false,
      

    }
  },

  mounted() {
    this.map = this.$store.getters.storeMap;
    this.addSideBar();
    this.initBasinLayerGroup();
    this.vectorLayerId = new Map();
    this.rasterLayerId = new Map();
  },
  updated() {
    this.projectName = this.$store.getters.projectName;
  },
  methods: {
    changeLayerStatus(layerName, status) {
      switch (layerName) {
        case "basinbound":
          console.log("basinbound");
          this.basinBoundChecked = status;
          if (status) { this.vectorShowGroup.push("basinBoundLayer"); this.vectorGroup.push("basinBoundLayer"); }
          else { this.vectorShowGroup = this.vectorShowGroup.filter(item => item !== "basinBoundLayer"); this.vectorGroup = this.vectorGroup.filter(item => item !== "basinBoundLayer") }
          break;
        case "basinoutlet":
          console.log("basinoutlet");
          this.basinOutletChecked = status;
          if (status) { this.vectorShowGroup.push("basinOutletLayer"); this.vectorGroup.push("basinOutletLayer"); }
          else { this.vectorShowGroup = this.vectorShowGroup.filter(item => item !== "basinOutletLayer"); this.vectorGroup = this.vectorGroup.filter(item => item !== "basinOutletLayer") }
          break;
        case "subBasin":
          console.log("subBasin");
          this.subBasinChecked = status;
          if (status) { this.vectorShowGroup.push("subBasinLayer"); this.vectorGroup.push("subBasinLayer"); }
          else { this.vectorShowGroup = this.vectorShowGroup.filter(item => item !== "subBasinLayer"); this.vectorGroup = this.vectorGroup.filter(item => item !== "subBasinLayer") }
          break;
        case "stream":
          console.log("stream");
          this.streamChecked = status;
          if (status) { this.vectorShowGroup.push("streamLayer"); this.vectorGroup.push("streamLayer"); }
          else { this.vectorShowGroup = this.vectorShowGroup.filter(item => item !== "streamLayer"); this.vectorGroup = this.vectorGroup.filter(item => item !== "streamLayer") }
          break;
        case "HLU":
          console.log("HLU");
          this.HLUChecked = status;
          if (status) { this.vectorShowGroup.push("HLULayer"); this.vectorGroup.push("HLULayer"); }
          else { this.vectorShowGroup = this.vectorShowGroup.filter(item => item !== "HLULayer"); this.vectorGroup = this.vectorGroup.filter(item => item !== "HLULayer") }
          break;
        case "subbasinoutlet":
          console.log("subbasinoutlet");
          this.subbasinoutlet = status;
          if (status) { this.vectorShowGroup.push("subBasinOutletLayer"); this.vectorGroup.push("subBasinOutletLayer"); }
          else { this.vectorShowGroup = this.vectorShowGroup.filter(item => item !== "subBasinOutletLayer"); this.vectorGroup = this.vectorGroup.filter(item => item !== "subBasinOutletLayer") }
          break;
        default:
          console.log("I don't own a pet");
          break;
      }
    },
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    uploadFile() {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('file', this.selectedFile);

        // 发送POST请求到后端
        // 请替换成你的后端API地址
        fetch('http://localhost:8083/infboy/upload', {
          method: 'POST',
          body: formData
        })
          .then(response => {
            // // 处理后端的响应
            // // 在URL后面添加随机参数
            // const randomParam = Math.random();
            // const randomParam2 = Math.random();
            // const newURL2 = 'http://localhost:8083/infboy/downLandUseSta?rand=' + randomParam + randomParam2;
            // var downloadRandName2 = 'downloadLink' + randomParam2;
            // downloadRandName2 = document.createElement('a');
            // downloadRandName2.href = newURL2;
            // //downloadRandName2.target = '_blank'; // 在新标签页中打开下载链接

            // // 模拟点击下载链接
            // downloadRandName2.click();
            console.log(response);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      } else {
        alert('Please select a CSV file.');
      }
    },
    showBasinShow() {
      this.basinShow = !this.basinShow;
      this.createModelShow = false;
      this.runModelShow = false;
      this.caliModelShow = false;
      this.landUseShow = false;
      this.basinAttributeShow = false;

    },
    showCreateModel() {
      this.createModelShow = !this.createModelShow;
      this.basinShow = false;
      this.runModelShow = false;
      this.caliModelShow = false;
      this.landUseShow = false;
      this.soilTypeShow = false;
      this.dataModelShow = false;
      this.basinAttributeShow = false;
    },
    showRunModel() {
      this.runModelShow = !this.runModelShow;
      this.createModelShow = false;
      this.basinShow = false;
      this.caliModelShow = false;
      this.landUseShow = false;
      this.soilTypeShow = false;
      this.dataModelShow = false;
      this.basinAttributeShow = false;
    },
    showCaliModel() {
      this.caliModelShow = !this.caliModelShow;
      this.createModelShow = false;
      this.basinShow = false;
      this.runModelShow = false;
      this.landUseShow = false;
      this.soilTypeShow = false;
      this.dataModelShow = false;
      this.basinAttributeShow = false;
    },
    showDataModel() {
      this.dataModelShow = !this.dataModelShow;
      console.log(this.dataModelShow)
      this.createModelShow = false;
      this.basinShow = false;
      this.runModelShow = false;
      this.landUseShow = false;
      this.soilTypeShow = false;
      this.caliModelShow = false;
      this.basinAttributeShow = false;
    },
    showBasinAttribute() {
      console.log("showBasinAttribute")
      this.basinAttributeShow = !this.basinAttributeShow;
      this.createModelShow = false;
      this.basinShow = false;
      this.runModelShow = false;
      this.caliModelShow = false;
      this.soilTypeShow = false;
      this.dataModelShow = false;
      this.landUseShow = false
    },
    showLandUse() {
      this.$store.commit("SET_ATTRIBUTE_SELECT", "LandUse");

      console.log("showLandUse")
      this.landUseShow = !this.landUseShow;
      this.createModelShow = false;
      this.basinShow = false;
      this.runModelShow = false;
      this.caliModelShow = false;
      this.soilTypeShow = false;
      this.dataModelShow = false;
      this.basinAttributeShow = false;
      this.GLiMShow = false;

      // this.$refs.LandUse.getTableData();
      this.$refs.SoilType.selectPOISwitchOff();
    },
    showSoilType() {
      this.$store.commit("SET_ATTRIBUTE_SELECT", "SoilType");

      console.log("showSoilType")
      this.soilTypeShow = !this.soilTypeShow;
      this.createModelShow = false;
      this.basinShow = false;
      this.runModelShow = false;
      this.caliModelShow = false;
      this.landUseShow = false;
      this.dataModelShow = false;
      this.basinAttributeShow = false;
      this.GLiMShow = false;

      this.$refs.SoilType.getTableData();
      this.$refs.LandUse.selectPOISwitchOff();
    },
    showGLiM() {
      this.$store.commit("SET_ATTRIBUTE_SELECT", "GLiM");

      console.log("showGLiM")
      this.GLiMShow = !this.GLiMShow;
      this.createModelShow = false;
      this.basinShow = false;
      this.runModelShow = false;
      this.caliModelShow = false;
      this.landUseShow = false;
      this.dataModelShow = false;
      this.basinAttributeShow = false;
      this.soilTypeShow = false;

      this.$refs.SoilType.getTableData();
      this.$refs.LandUse.selectPOISwitchOff();
    },



    //
    addSideBar() {
      var sidebar = L.control.sidebar({ container: 'sidebar' })
        .addTo(this.map);
      // .open('home');
      sidebar.on('content', function (ev) {
        switch (ev.id) {
          case 'autopan':
            sidebar.options.autopan = true;
            break;
          default:
            sidebar.options.autopan = false;
        }
      });
    },
    initBasinLayerGroup() {
      this.basinDataLayerGroup = L.layerGroup([]);
      this.basinDataLayerGroup.addTo(this.map);
    },
    controlRasterLayer() {
      if (this.rasterGroup.length > this.rasterShowGroup.length) {
        // console.log("执行if");
        // let b = new Set(this.rasterShowGroup);
        // let addLayer = [...arr].filter(x => !b.has(x));  
        var addLayer = this.diff(this.rasterGroup, this.rasterShowGroup);
        this.showBasinRasterDataLayer(addLayer[0]);
        this.rasterShowGroup.push(addLayer[0]);
      } else {
        // console.log("执行else");
        //   else if (arr.length<this.rasterShowGroup.length){
        // console.log(arr);
        // console.log(this.rasterShowGroup);
        var removeLayer = this.getArrDifference(this.rasterShowGroup, this.rasterGroup);
        // console.log(removeLayer[0]);
        var removeId = this.rasterLayerId.get(removeLayer[0]);
        // console.log(removeId);
        this.basinDataLayerGroup.removeLayer(removeId);
        this.rasterShowGroup.splice(this.rasterShowGroup.indexOf(removeLayer), 1);
        this.rasterLayerId.delete(removeLayer[0]);
      }
    },
    controlVectorLayer() {
      console.log(this.vectorGroup)
      if (this.vectorGroup.length > this.vectorShowGroup.length) {
        //添加图层
        var addLayer = this.diff(this.vectorGroup, this.vectorShowGroup);
        console.log(addLayer)
        //设置图层显隐
        if (addLayer[0] == "basinOutletLayer") this.$store.getters[addLayer[0]].setOpacity(1);
        else {
          this.$store.getters[addLayer[0]].eachLayer(layer => {
            this.map.addLayer(layer);
          });
          // this.$store.getters[addLayer[0]].addTo(this.map);
        }

        // this.showBasinVectorDataLayer(addLayer[0]);//发布geoserver服务
        this.vectorShowGroup.push(addLayer[0]);
      } else {
        //删除图层
        var removeLayer = this.getArrDifference(this.vectorShowGroup, this.vectorGroup);
        console.log(removeLayer)
        // var removeId = this.vectorLayerId.get(removeLayer[0]);
        // this.basinDataLayerGroup.removeLayer(removeId);
        // this.vectorShowGroup.splice(this.vectorShowGroup.indexOf(removeLayer), 1);

        if (removeLayer[0] == "basinOutletLayer") this.$store.getters[removeLayer[0]].setOpacity(0);
        else {
          // this.$store.getters[removeLayer[0]].clearLayers();
          this.$store.getters[removeLayer[0]].eachLayer(layer => {
            this.map.removeLayer(layer);
          });
          // this.map.drawingBasinLayerGroup.clearLayers()
        }

        // if(this.basinBoundChecked) {
        //   this.$store.getters["basinBoundLayer"].eachLayer(layer => {
        //     this.map.addLayer(layer);
        //   });
        // }

        this.vectorShowGroup = this.vectorShowGroup.filter(item => item !== removeLayer[0]);
        // this.vectorShowGroup.delete(removeLayer[0]);
      }
    },
    showBasinRasterDataLayer(layerName) {
      console.log("执行showBasinDataLayer");
      // var baseUrl='http://223.2.42.157:7070/geoserver/';
      var baseUrl = 'http://localhost:8081/geoserver/';
      var wmsURL = baseUrl + this.projectName + '/wms';
      //   this.basinLayer = L.tileLayer.wms('http://210.26.48.56:30122/geoserver/Basin_shp/wms',{
      var layer = new L.tileLayer.wms(wmsURL, {
        layers: layerName,
        format: 'image/png',
        transparent: true,
        noWarp: true
      }).addTo(this.basinDataLayerGroup);
      var layerId = this.basinDataLayerGroup.getLayerId(layer);
      this.rasterLayerId.set(layerName, layerId);
    },
    showBasinVectorDataLayer(layerName) {
      console.log("执行showBasinDataLayer");
      var baseUrl = 'http://localhost:8081/geoserver/';
      // var wmsURL=baseUrl + 'test7' + '/wms';
      var wmsURL = baseUrl + this.projectName + '/wms';
      //   this.basinLayer = L.tileLayer.wms('http://210.26.48.56:30122/geoserver/Basin_shp/wms',{
      var layer = new L.tileLayer.wms(wmsURL, {
        layers: layerName + '_wgs84',
        format: 'image/png',
        transparent: true,
        noWarp: true
      }).addTo(this.basinDataLayerGroup);
      var layerId = this.basinDataLayerGroup.getLayerId(layer);
      this.vectorLayerId.set(layerName, layerId);
    },
    getArrDifference(arr1, arr2) {
      let b = new Set(arr2);
      let difference = [...arr1].filter(x => !b.has(x));
      return difference;
    },
    diff(arr1, arr2) {
      var newArr = [];
      var arr3 = arr1.concat(arr2);//将arr1和arr2合并为arr3
      function isContain(value) {
        //找出arr3中不存在于arr1和arr2中的元素
        return arr1.indexOf(value) == -1 || arr2.indexOf(value) == -1;
      }
      newArr = arr3.filter(isContain);
      return newArr;
    },
    controlChart() {
      this.chartShow = !this.chartShow;

    },
    controlChartAI() {
      this.chartShow_ai = !this.chartShow_ai;
    },
    controlVisualizationFrozenSoil() {
      this.visualizationFrozenSoilShow = !this.visualizationFrozenSoilShow;
    },
    geoserverPublihRaster(name) {
      this.projectName = this.$store.getters.projectName;
      var paramObj = {
        fileName: name + ".tif",
        workSpace: this.projectName,
        styleName: name,
        dataStoreName: name,
        layerName: name,
        dataType: 2,
        crs: "EPSG:4326"
      };
      var options = {
        headers: {
          "content-type": "application/json"
        },
        method: "POST",
        data: JSON.stringify(paramObj)
      };
      request('/geoserver/publish', options)
        .then(res => {
          console.log(res);
          if (res.data.errCode == 200) {
            console.log("gerosrver publish success");
          } else {
            console.log("gerosrver publish failed");
          }
        }).catch(e => {
          console.log("gerosrver publish failed");
        })
    },
    geoserverPublihVector(name) {
      this.projectName = this.$store.getters.projectName;
      var paramObj = {
        fileName: name + ".shp",
        workSpace: this.projectName,
        styleName: name,
        dataStoreName: name,
        layerName: name,
        dataType: 1,
        crs: "EPSG:4326"
      };
      var options = {
        headers: {
          "content-type": "application/json"
        },
        method: "POST",
        data: JSON.stringify(paramObj)
      };
      request('/geoserver/publish', options)
        .then(res => {
          console.log(res);
          if (res.data.errCode == 200) {
            console.log("gerosrver publish success");
          } else {
            console.log("gerosrver publish failed");
          }
        }).catch(e => {
          console.log("gerosrver publish failed");
        })
    },
    rasterDataShowClick(v, name) {
      this[v] = false;
      this.geoserverPublihRaster(name);
    },
    vectorDataShowClick(v, name) {
      this[v] = false;
      this.geoserverPublihVector(name);
    },
    reFreshRaster() {
      //恢复初始状态
      this.disabledDem = true;
      this.disabledFlowDir = true;
      this.disabledAcc = true;
      this.disabledSubbasinR = true;
      this.disabledStreamLink = true;
      this.disabledLandcover = true;
      this.disabledSoiltype = true;
    },
    reFreshVector() {
      this.disabledBasinScope = true;
      this.disabledOutlet = true;
      this.disabledReach = true;
      this.disabledSubbasinV = true;
    }
  }
}
</script>

<style>
@import url('../../assets/css/leaflet-sidebar.min.css');
@import url('https://cdn.staticfile.org/font-awesome/4.7.0/css/font-awesome.css');
</style>
<style>
#BackgroundColor .ivu-collapse {
  background-color: rgba(247, 247, 247, 0.01);
}

#CollapseBackgroundColor .ivu-collapse-header {
  background-color: rgba(247, 247, 247, 0.7);
}

#CollapseBackgroundColor .ivu-collapse-content {
  background-color: rgba(255, 255, 255, 0.7);
}

.CheckBoxDiv {
  margin-bottom: 2px;
}
</style>