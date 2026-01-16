<template>
    <div>
        <Modal v-model="GLiMShowTemp" draggable scrollable footer-hide :mask="false" title="地质类型统计" width="550px"
            :styles="modelStyle" @on-visible-change="modalVisible">
            <!-- <div>
                <input style="margin-left:-20px;" type="file" ref="fileInput" @change="handleFileChange">
                <button @click="uploadFile" style="margin-top: 15px;padding:1px; margin-left: -20px">上传处理</button>
            </div> -->
            <Tabs type="card" :animated="false">
                <TabPane label="POI数据导入">
                    <div>
                        <div style="margin: 10px;">
                            <Space>
                                点击指定POI
                                <i-switch v-model="selectPOISwitch">
                                    <Icon slot="open" type="md-pin" size="14"></Icon>
                                    <Icon slot="close" type="md-close" size="14"></Icon>
                                </i-switch>
                            </Space>
                        </div>
                        <div style="margin-bottom: 5px;">
                            <!-- <input style="margin-left:-20px;" type="file" ref="fileInput" @change="handleFileChange"> -->
                            <!-- http://localhost:8083/infboy/uploadDEM -->
                            <!-- http://210.26.119.46:8083/api/infboy/uploadDEM -->
                            <Upload action="http://localhost:8083/infboy/upload" show-upload-list :on-success="inidata"
                                :on-progress="onProgress">
                                <Button icon="ios-cloud-upload-outline">Upload files</Button>
                            </Upload>
                        </div>
                        <Table border height="250" highlight-row :columns="columns" :data="data" :loading="tableLoading"
                            ref="table">
                            <template #action="{ row, index }">
                                <Button type="primary" size="small" style="margin-right: 5px"
                                    @click="locate(index)">View</Button>
                                <Button type="error" size="small" @click="remove(index)">Delete</Button>
                                <!-- <Button type="primary" size="small" style="margin-left: 5px"
                                    @click="edit(index)">Edit</Button> -->
                            </template>
                        </Table>
                    </div>
                </TabPane>
                <TabPane label="统计数据导出">
                    <div>
                        <Space>
                            缓冲区半径(米)：
                            <InputNumber :min="1" v-model="radius" @on-change="radius_tableData_Change" />
                            POI点：
                            <Select v-model="pointSelect" style="width:200px" @on-change="pointSelectChange">
                                <Option v-for="item in pointList" :value="item" :key="item">{{ item }}</Option>
                            </Select>
                        </Space>
                        <!-- 图表 -->
                        <div id="GLiMChart" style="height: 300px;width: 500px;margin-top: 30px;"></div>

                        <div style="margin-top: 10px;">
                            <Button type="primary" :disabled="disabled" :loading="loading" @click="download">下载统计数据</Button>
                        </div>
                    </div>
                </TabPane>
            </Tabs>
        </Modal>
    </div>
</template>
  
<script>
import { request } from "@/network/request";
import * as echarts from 'echarts';
export default {
    name: 'GLiM',
    //父组件传来的变量
    props: {
        GLiMShow: {
            type: Boolean
        }
    },
    // 监听 GLiMShow变量
    watch: {
        GLiMShow(newVal, oldVal) {
            console.log("GLiMShow:" + newVal)
            this.GLiMShowTemp = newVal
        },
        immediate: true,
        //监听table数据变化
        data(newValue) {
            console.log('myData发生了改变', newValue);
            if (newValue.length == 0) this.disabled = true;
            else {
                if (this.$store.getters.AttributeSelect == "GLiM") this.radius_tableData_Change();
            }
            // this.$refs.table.exportCsv({
            //     filename: 'The original data'
            // });
        },
        pointList(newValue) {
            if (newValue.length == 0) this.$store.commit("SET_POI_SELECT", "");
        }
    },
    data() {
        return {
            mapCM: null,
            POILayers: null,
            selectPOISwitch: false,
            GLiMShowTemp: false,
            filename: "",
            loading: false,
            tableLoading: false,
            disabled: true,
            basinType: 2,//1:流域上游，2：湖泊流域
            radius: 100,
            pointSelect: this.$store.getters.POISelect,
            pointList: [],
            modelStyle: {},
            columns: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '经度',
                    key: 'lon'
                },
                {
                    title: '纬度',
                    key: 'lat'
                },
                {
                    title: 'Action',
                    slot: 'action',
                    width: 210,
                    align: 'center',
                }
            ],
            // data: this.$store.getters.POIList,
            data: [],
            // [
            //     // {
            //     //     lon: 111,
            //     //     lat: 18,
            //     // },
            //     // {
            //     //     lon: 111,
            //     //     lat: 18,
            //     // },
            //     // {
            //     //     lon: 111,
            //     //     lat: 18,
            //     // },
            //     // {
            //     //     lon: 111,
            //     //     lat: 18,
            //     // },
            // ],
            chartDatas: [],
            chartData: [
                { value: 0, name: 'Intermediate Volcanic Rocks' },
                { value: 0, name: 'Basic Volcanic Rocks' },
                { value: 0, name: 'Acid Plutonic Rocks' },
                { value: 0, name: 'Metamorphic Rocks' },
                { value: 0, name: 'Unconsolidated Sediments' },
                { value: 0, name: 'Siliciclastic Sedimentary Rocks' },
                { value: 0, name: 'Basic Plutonic Rocks' },
                { value: 0, name: 'Intermediate Plutonic Rocks' },
                { value: 0, name: 'Mixed Sedimentary Rocks' },
                { value: 0, name: 'Water Bodies' },
                { value: 0, name: 'Pyroclastic' },
                { value: 0, name: 'Carbonate Sedimentary Rocks' },
                { value: 0, name: 'Acid Volcanic Rocks' },
                { value: 0, name: 'No Data' },
                { value: 0, name: 'Evaporites' },
                { value: 0, name: 'Ice and Glaciers' },
            ],
        }
    },
    methods: {
        selectPOISwitchOff() {
            this.selectPOISwitch = false
        },
        getTableData() {
            if (!(JSON.stringify(this.data) === JSON.stringify(this.$store.getters.POIList))) this.data = this.$store.getters.POIList.slice()
        },
        listenDraw() {
            //地图点击监听
            this.mapCM.on('click', e => {
                if (this.selectPOISwitch) {
                    var latlng = e.latlng;
                    var lon = latlng['lng'];
                    var lat = latlng['lat'];

                    let newData = {}
                    newData['lat'] = lat
                    newData['lon'] = lon

                    if(!this.data.includes(newData)) {
                        this.data.push(newData)
                        this.$store.commit("SET_POI_LIST", this.data);
                        let marker = L.marker(new L.LatLng(lat, lon), { // 创建点
                        }).addTo(this.POILayers)//添加到图层
                    }

                    if(this.pointSelect == "") {
                        this.pointSelect = 1
                        this.$store.commit("SET_POI_SELECT", 1);
                    }
                    console.log(this.pointSelect)
                }
            });
        },
        locate(index) {
            console.log(index)
            // this.pointSelect = index + 1;
            this.$store.commit("SET_POI_SELECT", index + 1);

            // console.log(this.data[index].lat)
            var lat = this.data[index].lat;
            var lon = this.data[index].lon;

            this.pointSelectChange();
            // this.modelStyle = {right:'-450px',top:'85px'};
        },
        remove(index) {
            // let marker = L.marker(new L.LatLng(this.data[index].lat, this.data[index].lon))
            // var bool = this.POILayers.hasLayer(marker)
            // console.log(bool)//false

            this.data.splice(index, 1);
            this.POILayers.clearLayers();
            this.addPOIMarker();
        },
        initChart() {
            $('#GLiMChart').css('height', '200px')
            var chartDom = document.getElementById('GLiMChart');
            var myChart = echarts.init(chartDom);
            var option;

            option = {
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                series: [
                    {
                        name: 'Nightingale Chart',
                        type: 'pie',
                        radius: [20, 100],
                        center: ['50%', '50%'],
                        roseType: 'area',
                        itemStyle: {
                            borderRadius: 8
                        },
                        data: this.chartData
                    }
                ]
            };
            option && myChart.setOption(option);
        },
        modalVisible(isVisible) {
            console.log(isVisible);
            this.$emit('update:GLiMShow', isVisible); //实现createModelShow的双向绑定
        },
        download() {
            // const newURL2 = 'http://210.26.119.46:8083/api/infboy/downLandUseSta?radius=' + this.radius + '&filename=' + this.filename;
            // console.log(newURL2)
            // var downloadRandName2 = document.createElement('a');
            // downloadRandName2.href = newURL2;
            // //downloadRandName2.target = '_blank'; // 在新标签页中打开下载链接
            // // 模拟点击下载链接
            // downloadRandName2.click();

            const newURL2 = 'http://localhost:8083/infboy/downLandUseSta?filename=' + 'landuseStatic.csv' + '&username=' + sessionStorage.getItem('username') + '&projectname=' + this.$store.getters.projectName;
            console.log(newURL2)
            var downloadRandName2 = document.createElement('a');
            downloadRandName2.href = newURL2;
            //downloadRandName2.target = '_blank'; // 在新标签页中打开下载链接
            // 模拟点击下载链接
            downloadRandName2.click();

        },
        onProgress() {
            this.tableLoading = true
        },
        inidata(response, file, fileList) {
            console.log(fileList)

            this.$store.commit("SET_POI_LIST", this.data.concat(response));
            this.data = this.data.concat(response)

            console.log(this.data)
            // this.pointList = new Array(this.data.length).fill(1).map((v, i) => ++i);
            
            // this.pointSelect = 1;
            if(this.pointSelect == "") this.$store.commit("SET_POI_SELECT", 1);


            this.filename = fileList[0].name
            this.tableLoading = false
            //初始化图表.this.data的监听中执行
            // this.radius_tableData_Change();
            //地图添加POI标记
            this.addPOIMarker();
        },
        addPOIMarker() {
            var arr = this.data;
            for (var i = 0; i < arr.length; i++) {
                // console.log(arr[i]);
                var lat = arr[i].lat;
                var lon = arr[i].lon;
                //创建marker
                let marker = L.marker(new L.LatLng(lat, lon), { // 创建点
                }).addTo(this.POILayers)//添加到图层
            }
        },
        pointSelectChange() {
            this.$store.commit("SET_POI_SELECT", this.pointSelect);
            console.log(this.pointSelect)
            this.chartData = this.chartDatas[this.pointSelect - 1]
            var chartDom = document.getElementById('GLiMChart');
            var myChart = echarts.init(chartDom);
            var option;
            myChart.showLoading();
            option = {
                // legend: {
                //     top: 'bottom'
                // },
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                series: [
                    {
                        name: 'Nightingale Chart',
                        type: 'pie',
                        radius: [20, 100],
                        center: ['50%', '50%'],
                        roseType: 'area',
                        itemStyle: {
                            borderRadius: 8
                        },
                        data: this.chartData
                    }
                ]
            };
            option && myChart.setOption(option);
            myChart.hideLoading();

            var lat = this.data[this.pointSelect - 1].lat;
            var lon = this.data[this.pointSelect - 1].lon;
            this.mapCM.flyTo(new L.LatLng(lat, lon), 8)
        },
        radius_tableData_Change() {
            if (this.data == []) {
                this.disabled = true;
                this.pointList = []
                this.chartData = []
            }
            else {
                this.loading = true;
                var chartDom = document.getElementById('GLiMChart');
                var myChart = echarts.init(chartDom);
                myChart.showLoading();

                //JSON数组转字符串
                var dataStr = JSON.stringify(this.data);
                console.log(dataStr);

                let params = new URLSearchParams();
                params.append("basinType", this.basinType);
                params.append("radius", this.radius);
                params.append("pointdata", dataStr);
                params.append("projectName", this.$store.getters.projectName);
                params.append("username", sessionStorage.getItem('username'));
                request
                    .post('/file/statisticsGLiMSta', params)
                    .then(res => {
                        if (res != null) {
                            console.log(res.data[0])
                            this.disabled = false;
                            this.chartDatas = res.data
                            this.chartData = res.data[this.pointSelect - 1]
                            this.pointList = new Array(this.data.length).fill(1).map((v, i) => ++i);

                            var chartDom = document.getElementById('GLiMChart');
                            var myChart = echarts.init(chartDom);
                            var option;

                            option = {
                                // legend: {
                                //     top: 'bottom'
                                // },
                                tooltip: {
                                    trigger: 'item',
                                    formatter: '{b} : {d}%',
                                    textStyle:{
                                        fontSize:12 
                                    }
                                },
                                toolbox: {
                                    show: true,
                                    feature: {
                                        mark: { show: true },
                                        dataView: { show: true, readOnly: false },
                                        restore: { show: true },
                                        saveAsImage: { show: true }
                                    }
                                },
                                series: [
                                    {
                                        name: 'Nightingale Chart',
                                        type: 'pie',
                                        radius: [20, 100],
                                        center: ['50%', '50%'],
                                        roseType: 'radius',
                                        itemStyle: {
                                            borderRadius: 8
                                        },
                                        data: this.chartData
                                    }
                                ]
                            };
                            option && myChart.setOption(option);
                            myChart.hideLoading();
                            this.loading = false;
                        }
                    })
                    .catch(e => {
                        console.log(e)
                        this.$Message.error('项目创建失败，请重新创建！');
                    });
            }
        }
    },
    mounted() {
        console.log("mounted")
        this.mapCM = this.$store.getters.storeMap;
        this.POILayers = L.layerGroup([]);
        this.mapCM.addLayer(this.POILayers);
        this.listenDraw();
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