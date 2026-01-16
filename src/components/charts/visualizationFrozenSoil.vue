<template>
    <Modal v-model="visualizationFrozenSoilShowTemp" draggable scrollable footer-hide :mask="false" title="冻土三维可视化"
        width="1020px" height="500px">
        <Row>
            <Col id="" span="12" order="1">
            <div id="chart111" style="height:350px;width:500px;"></div>
            </Col>
            <Col id="container" span="12" order="2">
            </Col>
        </Row>
        <Button type="info" style="position: relative;left: 860px;bottom: 40px" @click="play">
            <Icon size="30" type="md-play" />
        </Button>
        <Button type="info" style="position: relative;left: 880px;bottom: 40px" @click="pause">
            <Icon size="30" type="ios-pause-outline" />
        </Button>
        <!-- <div id="chart111" style="height:350px;width:500px;"></div> -->
        <!-- <div id="chart" style="position: relative;height:350px;width:450px;"></div>
        <div id="container" style="position: relative;left: 500px;height:350px;width:500px;"></div> -->
    </Modal>



</template>

<script>
//three.js
import * as THREE from 'three';
// import * as echarts from 'echarts';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Lut, ColorMapKeywords } from 'three/examples/jsm/math/Lut.js';

export default {
    name: "visualizationFrozenSoil",
    props: {
        visualizationFrozenSoilShow: {
            type: Boolean
        }
    },
    watch: {
        visualizationFrozenSoilShow(newVal, oldVal) {
            this.visualizationFrozenSoilShowTemp = newVal
            if (newVal) {
                //1、three.js模型
                this.initChart();
                //2、echarts图表
                this.initChart2();
            }
            else {
                //清除three.js的画布和对象
                if (this.renderer) {
                    this.renderer.dispose();
                    this.renderer.forceContextLoss();
                    this.renderer.content = null;
                    let gl = this.renderer.domElement.getContext("webgl");
                    if (gl && gl.getExtension("WEBGL_lose_context")) {
                        gl.getExtension("WEBGL_lose_context").loseContext();
                    }
                    this.renderer = null;
                    this.camera = null;
                    this.scene.traverse((child) => {
                        if (child.material) {
                            child.material.dispose();
                        }
                        if (child.geometry) {
                            child.geometry.dispose();
                        }
                        child = null;
                    });
                    this.scene = null;
                    // 检查div中是否有canvas元素
                    let container = document.getElementById('container');
                    if (container.getElementsByTagName('canvas').length > 0) {
                        // 有canvas，删除它们
                        var canvases = container.getElementsByTagName('canvas');
                        for (var i = 0; i < canvases.length; i++) {
                            container.removeChild(canvases[i]);
                        }
                    }

                    // let container = document.getElementById('container');
                    // console.log(this.render.domElement)
                    // container.removeChild(this.render.domElement)

                    // this.scene.remove(this.mesh)
                    // this.renderer.clear();
                }


            }

        },
        immediate: true
    },
    mounted() {
        console.log("执行")
        // this.initChart();
        // this.initChart2();
    },
    data() {
        return {
            visualizationFrozenSoilShowTemp: false,
            scene: null,
            perpCamera: null,
            mesh: null,
            renderer: null,
            lut: null,
            isPlay: false,

            chart111: null,
            date: ["a", "b", "c", "d", "e", "f", "g", "h", "j"],
            maxdata: [50, 40, 30, 20, 10, 0, 20, 0, 40],
            mindata: [-50, -40, -30, -20, -10, 0, -10, -20, -30],

        }
    },
    methods: {
        play() {
            this.isPlay = true;
            var _this = this;
            shijian(_this);

            async function shijian(_this) {
                for (let i = 0; i < _this.mindata.length; i++) {
                    if (_this.isPlay) {
                        console.log("时间序列")
                        let soilmin = _this.mindata[i]
                        let soilmax = _this.maxdata[i]
                        console.log(soilmin)
                        _this.updataGraphicAndMarkpointBydata(i)//先更新折线图，再更新threejs模型。因为折线图有延迟。
                        await _this.updateColors(soilmin, soilmax);
                        // _this.updataGraphicAndMarkpointBydata(i)
                        // setTimeout(
                        //     () => {
                        //         render();
                        //     }, 100000
                        // );
                    }
                }
            }
        },
        pause() {
            this.isPlay = false;
        },
        initChart() {
            console.log("渲染图表")
            //1、three.js模型
            let container;
            let perpCamera, renderer, lut;
            let mesh1;
            let scene;
            let params;
            var _this = this;
            init();
            function init() {
                container = document.getElementById('container');
                // 模型窗口
                scene = new THREE.Scene();
                _this.scene = scene;
                scene.background = new THREE.Color(0x808080);
                // 图例窗口
                // uiScene = new THREE.Scene();
                //颜色查找表
                lut = new Lut();
                _this.lut = lut;
                //场景宽高。和div的宽高一致。
                const width = 500;
                const height = 350;
                //模型摄像机
                perpCamera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
                perpCamera.position.set(1, 1, 100);
                _this.perpCamera = perpCamera;
                scene.add(perpCamera);
                //图例摄像机
                // orthoCamera = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 1, 2);
                // orthoCamera.position.set(0.5, 0, 1);
                //图例图片
                // sprite = new THREE.Sprite(new THREE.SpriteMaterial({
                //     map: new THREE.CanvasTexture(lut.createCanvas())
                // }));
                // sprite.material.map.colorSpace = THREE.SRGBColorSpace;
                // sprite.scale.x = 0.125;
                // uiScene.add(sprite);
                //冻土模型材质
                const url = '/textture/dirt.png'
                const mapTexture = new THREE.TextureLoader().load(url)

                // mesh = new THREE.Mesh(undefined, new THREE.MeshLambertMaterial({
                //     map: mapTexture,
                //     side: THREE.DoubleSide,
                //     color: 0xF5F5F5,
                //     vertexColors: true
                // }));
                // scene.add(mesh);

                // let geometry = new THREE.BoxGeometry(1, 1, 1);
                //冻土模型是一个圆柱，且圆柱要有足够的三角形面片。
                let geometry = new THREE.CylinderGeometry(12, 12, 100, 15, 50);
                geometry.center();
                geometry.computeVertexNormals();
                mesh1 = new THREE.Mesh(undefined, new THREE.MeshLambertMaterial({
                    map: mapTexture,
                    side: THREE.DoubleSide,
                    // color: 0xF5F5F5,
                    vertexColors: true,
                    geometry
                }));
                _this.mesh = mesh1;
                scene.add(mesh1);
                //添加颜色查找表。Todo:在模型上渲染的蓝色查找表会变成绿色，这里用绿色的查找表。
                ColorMapKeywords.bluescale = [[0.0, 0xE6F2FF], [0.1, 0xADD8E6], [0.2, 0xADD8E6], [0.3, 0x87CEEB], [0.4, 0x00BFFF], [0.5, 0x00B2EE], [0.6, 0x1E90FF], [0.7, 0x0066FF], [0.8, 0x0033FF], [0.9, 0x00008B], [1.0, 0x191970]]
                ColorMapKeywords.greenscale = [[0.0, 0xFFFFFF], [0.1, 0xF0FFF0], [0.2, 0xC8FFC8], [0.3, 0xB2FFB2], [0.4, 0x87FF87], [0.5, 0x66FF66], [0.6, 0x66FF66], [0.7, 0x00FF00], [0.8, 0x00A800], [0.9, 0x006400], [1.0, 0x003300]]
                // 颜色查找表选择参数
                params = {
                    colorMap: 'greenscale',
                };

                //将渲染器添加到div中
                if (!_this.renderer) {
                    //渲染器
                    renderer = new THREE.WebGLRenderer({ antialias: true });
                    renderer.autoClear = false;
                    renderer.setClearColor(new THREE.Color(0xF5F5F5), 1)
                    renderer.setPixelRatio(window.devicePixelRatio);
                    renderer.setSize(width, height);
                    _this.renderer = renderer;
                    container.appendChild(renderer.domElement);
                }
                //渲染模型并分层设色。
                loadModel(geometry);
                //添加光线
                const pointLight = new THREE.PointLight(0xffffff, 3, 0, 0);
                perpCamera.add(pointLight);
                //窗口大小改变时执行，这里不需要
                // window.addEventListener( 'resize', onWindowResize );

                //摄像机控制
                const controls = new OrbitControls(perpCamera, renderer.domElement);
                controls.addEventListener('change', _this.render);

                // const gui = new GUI();

                const min = _this.mindata;//-50
                const max = _this.maxdata;//-50

                // shijian();

                // async function shijian() {
                //     for (let i = 0; i < min.length; i++) {
                //         console.log("时间序列")
                //         let soilmin = min[i]
                //         let soilmax = max[i]
                //         await _this.updateColors(soilmin, soilmax);
                //         _this.updataGraphicAndMarkpointBydata(i)
                //         // setTimeout(
                //         //     () => {
                //         //         render();
                //         //     }, 100000
                //         // );
                //     }

                // }

                // gui.add(params, 'colorMap', ['rainbow', 'cooltowarm', 'blackbody', 'greenscale']).onChange(function () {
                //     updateColors(-20, 20);
                //     render();
                // });
            }

            function onWindowResize() {
                const width = window.innerWidth;
                const height = window.innerHeight;
                perpCamera.aspect = width / height;
                perpCamera.updateProjectionMatrix();
                renderer.setSize(width, height);
                _this.render();
            }

            function loadModel(geometry) {
                // console.log("加载模型")
                // const loader = new THREE.BufferGeometryLoader();
                // loader.load('/models/pressure.json', function (geometry) {
                console.log(geometry)

                geometry.center();
                geometry.computeVertexNormals();

                // default color attribute
                const colors = [];
                for (let i = 0, n = geometry.attributes.position.count; i < n; ++i) {

                    colors.push(1, 1, 1);
                }
                geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
                mesh1.geometry = geometry;

                //根据position的z或者attributes更新颜色
                _this.updateColors(-50, 50);
                // //渲染更新
                // render();
                // });
            }

        },
        render() {
            this.renderer.clear();
            this.renderer.render(this.scene, this.perpCamera);
        },
        updateColors(soilmin, soilmax) {
            var _this = this
            return new Promise((resolve, reject) => {
                setTimeout(
                    () => {
                        _this.lut.setColorMap('greenscale');

                        _this.lut.setMax(100);
                        _this.lut.setMin(0);

                        const geometry = _this.mesh.geometry;
                        // const pressures = geometry.attributes.pressure;
                        const positions = geometry.attributes.position;

                        // console.log(positions)

                        const colors = geometry.attributes.color;
                        const color = new THREE.Color();
                        let z = []
                        for (let i = 1; i < positions.array.length; i = i + 3) {
                            // console.log(i)
                            // mesh的高度值
                            const colorValue = positions.array[i];
                            z.push(50 - colorValue)
                            let newcolor = 50 - colorValue
                            // console.log((newcolor / 100).toFixed(1))
                            // console.log(newcolor)
                            if (soilmin <= colorValue && colorValue <= soilmax) {
                                console.log("渲染颜色")
                                // color.copy(lut.getColor((newcolor/100).toFixed(1))).convertSRGBToLinear();
                                color.copy(_this.lut.getColor(newcolor + 0.1)).convertSRGBToLinear();
                                // console.log(color)
                                colors.setXYZ((i + 1) / 3 - 1, color.g, color.r, color.b);
                            }
                            else {
                                color.copy(new THREE.Color(0xffffff));
                                colors.setXYZ((i + 1) / 3 - 1, color.g, color.r, color.b);
                            }
                        }
                        // 最大值
                        const max = Math.max(...z);
                        // 最小值
                        const min = Math.min(...z);
                        // console.log(max)
                        // console.log(min)
                        colors.needsUpdate = true;
                        // const map = sprite.material.map;
                        // lut.updateCanvas(map.image);
                        // map.needsUpdate = true;
                        //渲染更新
                        _this.render();
                        // resolve()
                    }, 100
                )
                setTimeout(() => {
                    resolve()
                }, 900)
            });

        },
        initChart2() {
            const date = this.date
            const mindata = this.mindata
            const maxdata = this.maxdata

            //2、echarts图表
            const symbolSize = 20;
            var data1 = [['a', 50]]
            var data2 = [['a', -50]]
            // const data = [
            //     ['a', -10],
            //     ['b', -5],
            //     ['c', 20],
            //     ['d', 40],
            //     ['e', 50]
            // ];
            const data = [50, 40, 30, 20, 10];
            var myChart = this.$echarts.init(document.getElementById("chart111"));
            this.chart111 = myChart;
            var option = {
                title: {
                    text: '',
                    left: 'center'
                },
                grid: {
                    top: '8%',
                    bottom: '12%'
                },
                xAxis: {
                    type: "category",
                    axisLine: { onZero: false },
                    data: date
                },
                yAxis: {
                    type: 'value',
                    axisLine: { onZero: false }
                },
                dataZoom: [
                    {
                        type: 'slider',
                        xAxisIndex: 0,
                        filterMode: 'none'
                    },
                    // {
                    //     type: 'slider',
                    //     yAxisIndex: 0,
                    //     filterMode: 'none'
                    // },
                    {
                        type: 'inside',
                        xAxisIndex: 0,
                        filterMode: 'none'
                    },
                    {
                        type: 'inside',
                        yAxisIndex: 0,
                        filterMode: 'none'
                    }
                ],
                series: [
                    {
                        id: 'max',
                        type: 'line',
                        symbolSize: symbolSize,
                        data: maxdata,
                        markPoint: {
                            data: [
                                {
                                    name: 'Draggable Point',
                                    coord: data1[0], // 初始位置
                                    symbol: 'circle',
                                    symbolSize: 20,

                                }
                            ]
                        }
                    },
                    {
                        id: 'min',
                        type: 'line',
                        symbolSize: symbolSize,
                        data: mindata,
                        markPoint: {
                            data: [
                                {
                                    name: 'Draggable Point',
                                    coord: data2[0], // 初始位置
                                    symbol: 'circle',
                                    symbolSize: 20,

                                }
                            ]
                        }
                    }
                ]
            };
            var _this = this
            myChart.setOption(option);
            myChart.setOption({
                graphic: data1.map(function (item, dataIndex) {
                    return {
                        type: 'circle',
                        position: myChart.convertToPixel('grid', item),
                        shape: {
                            cx: 0,
                            cy: 0,
                            r: symbolSize / 2
                        },
                        // invisible: true,
                        draggable: true,
                        ondrag: function (dx, dy) {
                            onPointDragging(dataIndex, [this.x, this.y]);
                        },
                        onmousemove: function () {
                            // showTooltip(dataIndex);
                        },
                        onmouseup: function (dx, dy) {
                            console.log("鼠标松开")
                            // hideTooltip(dataIndex);
                            _this.updataGraphicByPosition(dataIndex, [this.x, this.y])
                        },
                        z: 100
                    };
                })
            });

            function onPointDragging(dataIndex, pos) {
                var newmarkpoint = []
                newmarkpoint = myChart.convertFromPixel('grid', pos);
                var dataindex = newmarkpoint[0]
                console.log(dataindex)
                var x1 = date[dataindex]
                var y1 = maxdata[dataindex]
                data1 = [[x1, y1]]

                var x2 = date[dataindex]
                var y2 = mindata[dataindex]
                data2 = [[x2, y2]]

                console.log(data1)
                console.log(data2)

                // Update data
                myChart.setOption({
                    series: [
                        {
                            id: 'max',
                            markPoint: {
                                data: [
                                    {
                                        name: 'Draggable Point',
                                        coord: data1[0], // 初始位置
                                        symbol: 'circle',
                                        symbolSize: 20,

                                    }
                                ]
                            }
                        },
                        {
                            id: 'min',
                            markPoint: {
                                data: [
                                    {
                                        name: 'Draggable Point',
                                        coord: data2[0], // 初始位置
                                        symbol: 'circle',
                                        symbolSize: 20,
                                    }
                                ]
                            }
                        }
                    ]
                });

                _this.updateColors(y2, y1)
            }
        },

        updataGraphicByPosition(dataIndex, pos) {
            var myChart = this.chart111;
            var newmarkpoint = []
            newmarkpoint = myChart.convertFromPixel('grid', pos);
            var dataindex = newmarkpoint[0]
            var x = this.date[dataindex]
            var y = this.maxdata[dataindex]
            var y2 = this.mindata[dataindex]
            var data1 = [[x, y]]
            var _this = this
            // console.log(data1)
            // Update data
            myChart.setOption({
                graphic: data1.map(function (item, dataIndex) {
                    return {
                        type: 'circle',
                        position: myChart.convertToPixel('grid', item),
                        shape: {
                            cx: 0,
                            cy: 0,
                            r: 10
                        },
                        // invisible: true,
                        draggable: true,
                        // ondrag: function (dx, dy) {
                        //     this.onPointDragging(dataIndex, [this.x, this.y]);
                        // },
                        // onmousemove: function () {
                        //     // showTooltip(dataIndex);
                        // },
                        // onmouseout: function () {
                        //     // hideTooltip(dataIndex);
                        // },
                        z: 100
                    };
                })
            });
            // _this.updateColors(y2, y)
        },
        updataGraphicAndMarkpointBydata(dataIndex) {
            console.log("更新图表")
            console.log(dataIndex)
            var myChart = this.chart111;
            // var newmarkpoint = []
            // newmarkpoint = myChart.convertFromPixel('grid', pos);
            // var dataindex = newmarkpoint[0]
            var y = this.maxdata[dataIndex]
            var x = this.date[dataIndex]
            var data1 = [[x, y]]
            // console.log(data1)

            var y = this.mindata[dataIndex]
            var x = this.date[dataIndex]
            var data2 = [[x, y]]
            console.log(y)

            // Update data
            myChart.setOption({
                series: [
                    {
                        id: 'max',
                        markPoint: {
                            data: [
                                {
                                    name: 'Draggable Point',
                                    coord: data1[0], // 初始位置
                                    symbol: 'circle',
                                    symbolSize: 20,

                                }
                            ]
                        }
                    },
                    {
                        id: 'min',
                        markPoint: {
                            data: [
                                {
                                    name: 'Draggable Point',
                                    coord: data2[0], // 初始位置
                                    symbol: 'circle',
                                    symbolSize: 20,
                                }
                            ]
                        }
                    }
                ]
            });

            myChart.setOption({
                graphic: data1.map(function (item, dataIndex) {
                    return {
                        type: 'circle',
                        position: myChart.convertToPixel('grid', item),
                        shape: {
                            cx: 0,
                            cy: 0,
                            r: 10
                        },
                        // invisible: true,
                        draggable: true,
                        z: 100
                    };
                })
            });
        },

        requestFlowData() {
            this.projectName = this.$store.getters.projectName;
            let params = new URLSearchParams();
            params.append("projectName", this.projectName);
            params.append("chartDataType", "flow");
            request.post('/chartsData/flowData', params)
                .then(res => {
                    if (res.data.errCode == 200) {
                        myChart.setOption({
                            xAxis: {
                                data: res.data
                            },
                            series: [
                                {
                                    // 根据名字对应到相应的系列
                                    name: 'Flow',
                                    data: res.data
                                },
                                {
                                    name: 'Rainfall',
                                    data: res.data
                                }
                            ]
                        });
                        this.$Notice.success({
                            title: '显示图表数据成功！',
                            duration: 5
                        });
                        this.querySwitch = false;
                    } else {
                        this.$Notice.error({
                            title: '图表显示失败，请检查设置！',
                            duration: 5,
                        });
                    }
                }).catch(e => {
                    this.$Notice.error({
                        title: '图表显示失败，请检查设置！',
                        duration: 5,
                    });
                })
        },

    },
}
</script>

<style></style>