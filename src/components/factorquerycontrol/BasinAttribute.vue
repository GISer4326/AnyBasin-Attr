<template>
    <div>
        <Modal v-model="basinAttributeShowTemp" draggable scrollable footer-hide :mask="false" title="流域属性提取" width="550px"
            :styles="modelStyle" @on-visible-change="modalVisible">
            <!-- <div>
                <input style="margin-left:-20px;" type="file" ref="fileInput" @change="handleFileChange">
                <button @click="uploadFile" style="margin-top: 15px;padding:1px; margin-left: -20px">上传处理</button>
            </div> -->
            <Tabs type="card" :animated="false">
                <TabPane label="Landcover">
                    <div>
                        <Button @click="LC">提取</Button>
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
                <TabPane label="Carbonstorage">
                    <div>
                        <Button @click="LC">提取</Button>
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
                <TabPane label="Croplands">
                    <div>
                        <Button @click="LC">提取</Button>
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
                <TabPane label="GHS_SMOD">
                    <div>
                        <Button @click="LC">提取</Button>
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
            </Tabs>
        </Modal>
    </div>
</template>
  
<script>
import { request } from "@/network/request";
import * as echarts from 'echarts';
export default {
    name: 'basinAttribute',
    //父组件传来的变量
    props: {
        basinAttributeShow: {
            type: Boolean
        }
    },
    watch: {
        basinAttributeShow(newVal, oldVal) {
            console.log("landUseShow:" + newVal)
            this.basinAttributeShowTemp = newVal
        },
        immediate: true,
        //监听table数据变化
        data(newValue) {
            console.log('myData发生了改变', newValue);
            if (newValue.length == 0) this.disabled = true;
            else {
                this.radius_tableData_Change();
            }
            // this.$refs.table.exportCsv({
            //     filename: 'The original data'
            // });
        },
        pointList(newValue) {
            if (newValue.length == 0) this.pointSelect = "";
        }
    },
    data() {
        return {
            basinAttributeShowTemp: false,
            downloadLoading: false,
            tableLoading: false,
            downloadLoadDisabled: true,
            columns: [
                {
                    type: 'index',
                    width: 60,
                    align: 'center'
                },
                {
                    title: 'Type',
                    key: 'type'
                },
                {
                    title: 'Percentage(%)',
                    key: 'percentage'
                },
            ],
            data: [
                // {
                //     lon: 111,
                //     lat: 18,
                // },
                // {
                //     lon: 111,
                //     lat: 18,
                // },
                // {
                //     lon: 111,
                //     lat: 18,
                // },
                // {
                //     lon: 111,
                //     lat: 18,
                // },
            ],
            chartDatas: [],
            chartData: [
                { value: 0, name: 'Cropland' },
                { value: 0, name: 'Forest' },
                { value: 0, name: 'Grassland' },
                { value: 0, name: 'Shrubland' },
                { value: 0, name: 'Wetland' },
                { value: 0, name: 'Water' },
                { value: 0, name: 'Tundra' },
                { value: 0, name: 'Impervious surface' },
                { value: 0, name: 'Bareland' },
                { value: 0, name: 'Snow/Ice' },
            ],
        }
    },
    methods: {
        modalVisible(isVisible) {
            console.log(isVisible);
            this.$emit('update:landUseShow', isVisible); //实现createModelShow的双向绑定
        },
        download() {
            const newURL2 = 'http://localhost:8083/infboy/downLandUseSta?radius=' + this.radius + '&filename=' + this.filename;
            console.log(newURL2)
            var downloadRandName2 = document.createElement('a');
            downloadRandName2.href = newURL2;
            //downloadRandName2.target = '_blank'; // 在新标签页中打开下载链接
            // 模拟点击下载链接
            downloadRandName2.click();
        },
        LC() {
            let params = new URLSearchParams();
            const username = sessionStorage.getItem('username');
            const projectname = this.$store.getters.projectName;
            params.append("username", username);
            params.append("projectname", projectname);
            request
                .post('/file/statisticsBasinLandUseSta', params)
                .then(res => {
                    if (res != null) {
                        console.log(res.data)
                        this.disabled = false;
                        this.chartData = res.data
                       
                        var chartDom = document.getElementById('pieChart');
                        var myChart = echarts.init(chartDom);
                        var option;

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
                        this.loading = false;
                    }
                })
                .catch(e => {
                    console.log(e)
                    this.$Message.error('项目创建失败，请重新创建！');
                });
        },
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