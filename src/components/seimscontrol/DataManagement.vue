<template>
  <div>
    <Modal v-model="dataModelShowTemp" draggable scrollable footer-hide :mask="false" :styles="{top: '250px'}" title="Data management" width="755px"
      @on-visible-change="modalVisible">
      <div>
        <Tabs type="card" :animated="false">
          <TabPane label="Subbasin delineation">
            <Divider orientation="left">
              <Icon type="ios-arrow-dropdown" size="20" />DEM
            </Divider>
            <div style="margin: 0px 0px 10px 33px;">
              <div style="margin-top: 5px;margin-right: 20px;float: left;">
                <span>DEM TIF: </span>
              </div>
              
              <!-- http://localhost:8083/infboy/uploadDEM -->
              <!-- http://172.21.187.93:8083/api/infboy/uploadDEM -->
              <Upload action="http://172.21.187.93:8083/api/infboy/uploadDEM" :data="uploaddata" show-upload-list :on-success="uploaddem">
                <Button icon="ios-cloud-upload-outline">Upload</Button>
              </Upload>
              
              <div style="margin-top: 5px;margin-right: 20px;float: left;clear: both">
                <span>River SHP: </span>
              </div>
              <Upload multiple action="http://172.21.187.93:8083/api/infboy/uploadStream" :data="uploaddata" show-upload-list
                :on-success="addStream">
                <Button icon="ios-cloud-upload-outline">Upload</Button>
              </Upload>
              <span style="float: left;clear: both">(If River uploaded, perform BRUN-IN processing on the DEM)</span>
              <div style="margin-top: 5px;float: left;clear: both">
                Threshold: 
                <Input :min="0" v-model="threshold" style="width: 90px;margin-left: 20px;margin-right:5px"></Input>
              </div>

              <div style="margin-top: 5px;float: left;clear: both">
                <span>Naming DEM:</span>
                <!-- （请以流域名称结尾，如：dem_steppler） -->
                <Input :min="0" v-model="newDEMname" style="width: 90px;margin-left: 20px;margin-right:20px"></Input>
                <Button type="primary" @click="BURNIN" :disabled="BURNINisok" :loading="burninLoading">DEM processing</Button>
              </div>

            </div>

            <Divider orientation="left">
              <Icon type="ios-arrow-dropdown" size="20" />Lake/wetland/reservoir data
            </Divider>
            <div style="margin: 0px 0px 10px 33px;">
              <div style="margin-top: 5px;float: left;">
                <span>Lake/wetland/reservoir TIF：</span>
              </div>
              <Upload action="http://172.21.187.93:8083/api/infboy/uploadLakeTIF" :data="uploaddata" show-upload-list>
                <Button icon="ios-cloud-upload-outline">Upload</Button>
              </Upload>
              <!-- <div style="margin-top: 5px;float: left;">
                <span>水库：</span>
              </div>
              <Upload action="http://172.21.187.93:8083/api/api/infboy/upload" show-upload-list :on-success="inidata"
                :on-progress="onProgress">
                <Button icon="ios-cloud-upload-outline">上传</Button>
              </Upload> -->
            </div>
          </TabPane>

          <TabPane label="Subarea generation & parameters">
            <div>
              <div style="margin: 0px 0px 10px 33px;">
                <div style="margin-top: 5px;margin-right: 20px;float: left;">
                  <span>Soiltype TIF：</span>
                </div>
                <Upload action="http://172.21.187.93:8083/api/infboy/uploadSoiltypeTIF" :data="uploaddata" show-upload-list
                  :on-success="addSolitypeList">
                  <Button icon="ios-cloud-upload-outline">Upload</Button>
                </Upload>

                <div style="margin-top: 5px;margin-right: 20px;float: left;">
                  <span>Landuse TIF:</span>
                </div>
                <Upload action="http://172.21.187.93:8083/api/infboy/uploadLanduseTIF" :data="uploaddata" show-upload-list
                  :on-success="addLanduseList">
                  <Button icon="ios-cloud-upload-outline">Upload</Button>
                </Upload>

                <div style="margin-top: 5px;margin-right: 20px;float: left;">
                  <span>Field TIF:</span>
                </div>
                <Upload action="http://172.21.187.93:8083/api/infboy/uploadFieldTIF" :data="uploaddata" show-upload-list
                  :on-success="addfieldList">
                  <Button icon="ios-cloud-upload-outline">Upload</Button>
                </Upload>

              </div>
            </div>
          </TabPane>


          <TabPane label="Hydrological data">
            <div>
              <div style="margin: 0px 0px 10px 33px;">
                <div style="margin-top: 5px;margin-right: 20px;float: left;">
                  <span>Hydrological observation stations:</span>
                </div>
                <Upload action="http://172.21.187.93:8083/api/infboy/uploadSites_O" :data="uploaddata" show-upload-list>
                  <Button icon="ios-cloud-upload-outline">Upload</Button>
                </Upload>

                <div style="margin-top: 5px;margin-right: 20px;float: left;">
                  <span>Hydrological observation data:</span>
                </div>
                <Upload action="http://172.21.187.93:8083/api/infboy/uploadData_O" :data="uploaddata" show-upload-list
                  :on-success="addOList">
                  <Button icon="ios-cloud-upload-outline">Upload</Button>
                </Upload>

              </div>
            </div>
          </TabPane>

          <TabPane label="Meteorological data">
            <div>
              <div style="margin: 0px 0px 10px 33px;">
                <div style="margin-top: 5px;margin-right: 20px;float: left;">
                  <span>Meteorological stations:</span>
                </div>
                <Upload action="http://172.21.187.93:8083/api/infboy/uploadSites_M" :data="uploaddata" show-upload-list>
                  <Button icon="ios-cloud-upload-outline">Upload</Button>
                </Upload>

                <div style="margin-top: 5px;margin-right: 20px;float: left;">
                  <span>Precipitation stations:</span>
                </div>
                <Upload action="http://172.21.187.93:8083/api/infboy/uploadSites_P" :data="uploaddata" show-upload-list>
                  <Button icon="ios-cloud-upload-outline">Upload</Button>
                </Upload>

                <div style="margin-top: 5px;margin-right: 20px;float: left;">
                  <span>Meteorological data:</span>
                </div>
                <Upload action="http://172.21.187.93:8083/api/infboy/uploadData_M" :data="uploaddata" show-upload-list
                  :on-success="addMList">
                  <Button icon="ios-cloud-upload-outline">Upload</Button>
                </Upload>

                <div style="margin-top: 5px;margin-right: 20px;float: left;">
                  <span>Precipitation data:</span>
                </div>
                <Upload action="http://172.21.187.93:8083/api/infboy/uploadData_P" :data="uploaddata" show-upload-list
                  :on-success="addPList">
                  <Button icon="ios-cloud-upload-outline">Upload</Button>
                </Upload>

              </div>
            </div>
          </TabPane>

          



          <!-- <TabPane label="模型输出设置">
              <div>
                <Form :model="outputFormValue" :label-width="110" :rules="outputRules" ref="outputFormValue" inline>
                  <FormItem label="模型输出选择" prop="output">
                    
                  </FormItem>
                  <FormItem>
                    
                  </FormItem>
                  <FormItem>
                    
                  </FormItem>
                </Form>

              </div>
            </TabPane> -->
        </Tabs>
      </div>
    </Modal>

  </div>
</template>

<script>
import { request } from "@/network/request";

export default {
  name: 'DataManagement',
  props: {
    dataModelShow: {
      type: Boolean
    }
  },
  watch: {
    dataModelShow(newVal, oldVal) {
      this.dataModelShowTemp = newVal
    },
    immediate: true,
    projectNameState(newValue, oldValue) {
      // 当store中的状态变化时，你可以根据需要进行相应的处理
      this.projectName = newValue;
      this.username=sessionStorage.getItem('username');
      console.log(this.projectName)
      console.log(this.username)
      this.uploaddata['projectName'] = this.projectName
      this.uploaddata['username'] = this.username
    },
  },
  data() {
    return {
      dataModelShowTemp: false,
      projectName: this.$store.getters.projectName,
      username: sessionStorage.getItem('username'),
      demName: '',
      newDEMname: '',
      streamName: '',
      // BURNINisok: 'true',
      mapCM: null,
      tempStreamLayerGroup: [],
      burninLoading: false,
      threshold: '',
      uploaddata:{
        projectName:'',
        username:''
      }
    }
  },
  mounted()  {
    this.init()
  },
  computed: {
    BURNINisok() {
      console.log(this.newDEMname)
      console.log(this.streamName)
      console.log(this.demName)
      if (this.newDEMname != "" && this.demName != "") {
        return false;
      } else {
        return true;
      }
    },
    // 使用计算属性将store中的状态绑定到组件的数据属性
    projectNameState() {
      return this.$store.getters.projectName;
    }
  },
  methods: {
    init() {
      this.mapCM = this.$store.getters.storeMap,
      this.tempStreamLayerGroup = L.layerGroup([]);
      this.tempStreamLayerGroup.addTo(this.mapCM);
    },

    addfieldList(name){
      var oldList = this.$store.getters.fieldMapList
      let newItem = { value: name, label: name };
      oldList.push(newItem);
      this.$store.commit("SET_FIELD_MAPLIST", oldList);
    },

    addLanduseList(name) {
      var oldList = this.$store.getters.landuseMapList
      let newItem = { value: name, label: name };
      oldList.push(newItem);
      this.$store.commit("SET_LANDUSE_MAPLIST", oldList);
    },
    addSolitypeList(name) {
      var oldList = this.$store.getters.soilMapList
      let newItem = { value: name, label: name };
      oldList.push(newItem);
      this.$store.commit("SET_SOIL_MAPLIST", oldList);
    },
    uploaddem(name) {
      console.log(name)
      this.demName = name
    },
    addDEMList(name) {
      // this.demName = name
      var oldList = this.$store.getters.DEMList
      let newItem = { value: name, label: name };
      oldList.push(newItem);
      this.$store.commit("SET_DEM_LIST", oldList);
    },
    addPList(name) {
      var oldList = this.$store.getters.rainDataList
      let newItem = { value: name, label: name };
      oldList.push(newItem);
      this.$store.commit("SET_RAINDATA_LIST", oldList);
    },
    addMList(name) {
      var oldList = this.$store.getters.meteoDataList
      let newItem = { value: name, label: name };
      oldList.push(newItem);
      this.$store.commit("SET_METEODATA_LIST", oldList);
    },
    addOList(name) {
      var oldList = this.$store.getters.observedDataList
      let newItem = { value: name, label: name };
      oldList.push(newItem);
      this.$store.commit("SET_OBSERVEDDATA_LIST", oldList);
    },
    addStream(name) {
      this.streamName = name
    },
    // 随机生成是十六进制颜色
    getRandomHexColor() {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
    addGeoJSONToMap(type, GeoJSONStr, color) {
      var file = JSON.parse(GeoJSONStr);
      var fillOpacity = 0;
      var stroke = false;
      const separatedColors = [
        "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF6666", "#FF6699", "#FF66CC", "#FF66FF", "#FF9900", "#FF9933", "#FF9966", "#FF9999", "#FF99CC", "#FF99FF", "#FFCC00", "#FFCC33", "#FFCC66", "#FFCC99", "#FFCCCC", "#FFCCCC", "#FFFF00", "#FFFF33", "#FFFF66", "#FFFF99", "#FFFFCC",
        "#00FF00", "#00FF33", "#00FF66", "#00FF99", "#00FFCC", "#00FFFF", "#0033FF", "#0033CC", "#003399", "#003366", "#003333", "#0033FF", "#0066FF", "#0066CC", "#006699", "#006666", "#006633", "#0099FF", "#0099CC", "#009999", "#009966", "#00CCFF", "#00CCCC", "#00CC99", "#00CC66", "#FFFF3F", "#FFFF8C", "#FFFFBF",
        "#C28F5C", "#C8B47F", "#CBCDA4", "#D1D1E1", "#D4B4A8", "#D7B7A4", "#DECBAD", "#E5C5BD", "#E8E4D4", "#EBDCD5", "#EFD8F1", "#F2F2F2", "#F4C5C4", "#F7B4B4", "#FADBDC", "#FDA5DC", "#FFFFFF", "#F7D7A8", "#F5B47D", "#F2B4B4", "#F2D1E2", "#F2D1E5", "#F5D7E2", "#F5D7E5", "#F5D7E8", "#F7D7E8", "#F7D7EC", "#FAD7E8", "#FAD7EC",
        "#A1CAF1", "#B1D1FC", "#BACED8", "#BDCDFE", "#BFC2FB", "#BFC2FC", "#BFC2FD", "#BFC2FE", "#C7DFDF", "#C7E8FE", "#CBEAF8", "#CFDEDF", "#CFE8FE", "#CFE8FD", "#CFE8FC", "#CFE8FB", "#D7E8FD", "#D7E8FE", "#D7E8FD", "#D7E8FC"

      ];
      let minVal = 1;
      let maxVal = 49;
      let _this = this

      if (type == "subBasinLayer") {
        stroke = true
      }

      if (type == "basinLayer" || type == "streamLayer") {
        fillOpacity = 0;
        stroke = true;
      }
      else fillOpacity = 0.3;

      var geoJsonLayer = L.geoJSON(file, {
        // style: function (feature) {
        //   feature.properties.value = random(1, 100);
        //   feature.properties.color = getSeparatedColorByVal(minVal, maxVal, separatedColors, feature.properties.value);
        //   return { color: color, fillColor: feature.properties.color, fillOpacity: fillOpacity };
        //   // return { color: color, fillColor: color, fillOpacity: fillOpacity };
        // }

        onEachFeature: function (feature, layer) {

          // console.log(feature.properties.VALUE)
          // if (feature.properties.VALUE == null) {
          //   console.log("feature.properties.VALUE == null")
          //   feature.properties.VALUE = 1//红色
          // }
          feature.properties.color = _this.getRandomHexColor();
          // feature.properties.color = _this.getSeparatedColorByVal(minVal, maxVal, separatedColors, feature.properties.VALUE);
          console.log(feature.properties.color)

          layer.setStyle({
            stroke: stroke,//取消边框
            color: color,
            fillColor: feature.properties.color,
            fillOpacity: fillOpacity,//默认0.2
            weight: 1,
          });
        }
      }).bindPopup(function (layer) {
        return layer.feature.properties.description;
      });
      this.tempStreamLayerGroup.addLayer(geoJsonLayer);
      //平移至数据位置
      this.mapCM.fitBounds(geoJsonLayer.getBounds());
    },
    BURNIN() {
      this.burninLoading = true;
      let params = new URLSearchParams();
      params.append("projectName", this.projectName);
      params.append("username", this.username);
      params.append("threshold", this.threshold);
      request
        .post('/basins/BurnIn', params)
        .then(res => {
          if (res.data) {
            this.$Message.success({
              content: 'BURN-IN成功！',
              duration: 3
            });
            this.burninLoading = false;
            this.addDEMList(this.newDEMname)
            this.tempStreamLayerGroup.clearLayers();
            this.addGeoJSONToMap('streamLayer', JSON.stringify(res.data), "blue");
          } else {
            this.$Message.error({
              content: 'BURN-IN失败！',
              duration: 3,
            });
          }
        })
        .catch(e => {
          console.log(e)
          this.$Message.error('BURN-IN失败！');
          this.createProjectStatus = 'modelSetting';
        });
    }

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