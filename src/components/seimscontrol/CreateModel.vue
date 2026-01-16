<!--
 * @Author: your name
 * @Date: 2022-04-28 13:53:55
 * @LastEditTime: 2023-06-14 17:23:52
 * @LastEditors: BinjieYuan yuanbj9035@163.com
 * @Description: data preprocess for creating model 
 * @FilePath: \WebBasin\front\src\components\seimscontrol\CreateModel.vue
-->
<template>
  <div>
    <transition name="fade">
      <Modal v-model="createModelShowTemp" draggable scrollable footer-hide :mask="false" :styles="{top: '300px'}" title="Modeling" width="920px" 
        @on-visible-change="modalVisible">
        <Tabs type="card" :animated="false" name="createModelTab">
          <!--0、工程项目-->
          <TabPane label="Project management" tab="createModelTab">
            <div>
              <Divider orientation="left">
                <Icon type="ios-arrow-dropdown" size="20" />Create project
              </Divider>
              <div class="selectFlex" style="margin-left: 50px;">
                <Form :model="formProjectItem" :label-width="110" :rules="ruleProject" ref="formProjectItem" inline>
                  <FormItem label="Project name" prop='projectName'>
                    <Input v-model="formProjectItem.projectName" placeholder="Please enter project name" clearable
                      style="width: 350px"></Input>
                    <!-- <Button @click="namedProject('formProjectItem')" :loading="namedProjectBtnStatus">确定</Button> -->
                  </FormItem>
                  <!-- <FormItem>
                      <Button @click="handleSubmitProject('formProjectItem')">确定</Button>
                    </FormItem> -->
                </Form>
              </div>
              <Divider />
              <div class="finishBtn">
                <Button v-if="createProjectStatus == 'modelSetting'" type="info" ghost
                  @click="createProject">Create project</Button>
                <div v-else-if="createProjectStatus == 'modelRunning'" style="width:85%">
                  <i-progress :percent="99.99" status="active" hide-info></i-progress>
                  <span>新建项目运行中...</span>
                </div>
                <div v-else-if="createProjectStatus == 'modelRunSuccessed'" style="width:100%">
                  <p class="finishFont">Project created</p>
                  <div class="finishBtn">
                    <Button type="info" ghost @click="giveUpCurrentProject">Cancel</Button>
                  </div>
                </div>
              </div>
            </div>
            <br>
          </TabPane>
          <!--1、流域划分-->
          <TabPane label="Subbasin delineation" tab="createModelTab">
            <div>
              <Divider orientation="left">
                <Icon type="ios-arrow-dropdown" size="20" />Watershed extent
              </Divider>
              <!-- <Tabs v-model="basinScopeType" name="basinDelineation" style="margin: 0 25px">
                <TabPane :label="tabRenderSystem('指定流域出口', basinScopeType)" name="basinScopeFromSystem"
                  tab="basinDelineation" style=""> -->
              <div style="margin:0px">
                <!-- <Checkbox v-model="basinCkb" @on-change="showBasinsLayer" 
                          :disabled="basinScopeType!=='basinScopeFromSystem'">
                            显示流域图层
                        </Checkbox>
                        <Select v-model="levelSelect" size="small" style="width:90px"
                          :disabled="!basinCkb" :transfer=true @on-change="changeStandardBasinsLevel">
                            <Option v-for="item in levelLayerList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        &nbsp;&nbsp;&nbsp;
                        <span>开启流域选择</span>
                        <i-switch v-model="querySwitch" :disabled="!basinCkb" @change="querySwitchChange">
                          <Icon slot="open" type="md-pin" size="14"></Icon>
                          <Icon slot="close" type="md-close" size="14"></Icon>
                        </i-switch><br>
                        <div v-if="basinScopeSelectSystem" style="margin-top:4px">
                          <Icon type="ios-checkmark-circle-outline" color="#19be6b" size="20"/>
                          <span>已选中流域范围</span>
                          <ButtonGroup size="small">
                            <Button type="success" ghost @click="basinScopeSelectSystemApply" :loading="basinScopeSelectLoadingStatus">确定</Button>
                            <Button type="error" ghost @click="basinScopeSelectSystemReselect">重选</Button>
                          </ButtonGroup>
                        </div> -->

                <!-- <div style="margin: 0px 0px 10px 33px;">
                  <Space>
                    当前河网层级
                    <Select v-model="levelSelect" size="small" style="width:90px" :disabled="!basinCkb" :transfer=true
                      @on-change="changeStandardBasinsLevel">
                      <Option v-for="item in levelLayerList" :value="item.value" :key="item.value">{{ item.label }}
                      </Option>
                    </Select>
                  </Space>
                </div> -->

                <div style="margin: 0px 0px 10px 55px;">
                  <div v-if="!completeBasinScopeSelection">

                    <div style="margin-top: 5px;float: left;">
                      <span>DEM：</span>
                    </div>
                    <div class="selectFlex">
                      <Select clearable v-model="DEMSelect" style="width:380px" placeholder="Please select DEM" :transfer=true
                        @on-change="DEMselectChange">
                        <Option v-for="item in DEMList" :value="item.value" :key="item.value">{{ item.label }}
                        </Option>
                      </Select>
                    </div>

                    <div v-if="DEMSelect != '' && DEMSelect != undefined" style="margin-bottom: 5px;margin-top: 15px">
                      <Space>Define outlet by click on the map
                        <i-switch v-model="upstreamByClickSwitch" @on-change="upstreamByClickSwitchChange">
                          <Icon slot="open" type="md-pin" size="14"></Icon>
                          <Icon slot="close" type="md-close" size="14"></Icon>
                        </i-switch>
                      </Space>
                    </div>

                    <!-- <div v-if="DEMSelect != 'shujuji' && DEMSelect != '' && DEMSelect != undefined" style="margin-bottom: 5px;margin-top: 5px">
                      lon:
                      <Input v-model="outletlon" size="small" placeholder="small size" />
                      lat:
                      <Input v-model="outletlat" size="small" placeholder="small size" />
                      <Button type="primary" @click="outletok">确定</Button>
                    </div> -->


                  </div>
                </div>
                <div v-if="basinScopeSelectSystem && !completeBasinScopeSelection"
                  style="margin-top:4px;margin-left: 32px;">
                  <ButtonGroup size="small">
                    <Button type="success" ghost :loading="basinScopeSelectLoadingStatus"
                      @click="basinScopeSelectSystemApply">Complete</Button>
                    <Button type="error" ghost @click="basinScopeSelectSystemReselect">Click again</Button>
                  </ButtonGroup>
                </div>
                <div v-if="completeBasinScopeSelection" style="margin-top:4px;margin-left: 30px;">
                  <Icon type="ios-checkmark-circle-outline" color="#19be6b" size="20" />
                  <span>Complete the selection of watershed extent
                  </span>
                </div>
              </div>
              <!-- </TabPane> -->
              <!-- <TabPane :label="tabRenderLocal('指定子流域出口', basinScopeType)" name="basinScopeFromLocal"
                  tab="basinDelineation">
                  <div style="margin:0px 10px">
                    <Upload action="" class="upload">
                      <Button icon="ios-cloud-upload-outline"
                        :disabled="basinScopeType == 'basinScopeFromSystem'">上传DEM数据</Button>
                    </Upload>
                  </div>
                </TabPane> -->
              <!-- </Tabs> -->

              <Divider orientation="left">
                <Icon type="ios-arrow-dropdown" size="20" />Subbasin delineation
              </Divider>
              <Tabs v-model="basinScopeType" name="basinDelineation" style="margin: 0 30px">
                <TabPane :label="tabRenderSystem('Set threshold for stream extraction', basinScopeType)" name="basinScopeFromSystem"
                  tab="basinDelineation" style="">
                  <!-- <div class="selectFlex">
                    <Form id="streamValueForm" :model="formStreamNetworkValue" :label-width="0" :rules="ruleStreamNetwork"
                      ref="formStreamNetworkValue" inline>
                      <span>输入生成河网阈值：</span><br><br>
                      <FormItem prop='streamValueCell' style="margin-bottom: 10px;">
                        <Input :min="0" v-model="formStreamNetworkValue.streamValueCell" style="width: 90px"
                          @on-change="convertCellArea('cell')"></Input>
                        <span>（单位：cell）</span>
                      </FormItem>
                      <FormItem prop='streamValueArea' style="margin-bottom: 10px;">
                        <Input :min="0" v-model="formStreamNetworkValue.streamValueArea" style="width: 90px"
                          @on-change="convertCellArea('area')"></Input>
                        <span>（单位：km<sup>2</sup>）</span>
                      </FormItem>
                    </Form>
                  </div> -->

                  <!-- <div style="margin-left: 25px;">
                    河网阈值
                    <Input :min="0" v-model="streamValue" style="width: 90px"></Input>
                    <span>（单位：km<sup>2</sup>）</span>
                  </div> -->
                  <div style="margin-top: 5px;margin-left: 25px;float: left;">
                    <span>Threshold</span>
                  </div>
                  <Input :min="0" v-model="streamValue" style="width: 90px;margin-left: 20px;" @on-change=""></Input>
                  <span>(Unit: cell)</span>
                  <br>

                  <div style="margin-top: 15px;margin-left: 25px;float: left;">
                    <Checkbox v-model="selectLake">Consider lakes/reservoirs/wetlands</Checkbox>
                  </div>


                  <!-- <div style="margin-left: 25px;">
                    <Button @click="streamNetValueCommit" :loading="StreamNetValueCommitLoading">生成河网</Button>
                  </div>
                  <div v-if="completeStreamNetValueCommit" style="margin-top:4px">
                    <Icon type="ios-checkmark-circle-outline" color="#19be6b" size="20" />
                    <span>已生成河网</span>
                  </div> -->
                </TabPane>
                <TabPane :label="tabRenderLocal('Define subbasin outlet', basinScopeType)" name="basinScopeFromLocal"
                  tab="basinDelineation">
                  <div style="margin-bottom: 10px;margin-left: 20px;">
                    <!-- <Upload action="" class="upload">
                      <Button icon="ios-cloud-upload-outline"
                        :disabled="basinScopeType == 'basinScopeFromSystem'">上传DEM数据</Button>
                    </Upload> -->
                    <Space>点击指定子流域出口（可选）
                      <i-switch v-model="selectSubOutletsSwitch" @on-change="upstreamByClickSwitchChange">
                        <Icon slot="open" type="md-pin" size="14"></Icon>
                        <Icon slot="close" type="md-close" size="14"></Icon>
                      </i-switch>
                    <!-- http://172.21.187.93:8083/api/infboy/upload -->
                    <!-- http://localhost:8083/infboy/upload -->
                    <Upload action="http://172.21.187.93:8083/api/infboy/upload" :data="uploaddata" :show-upload-list="false" :on-success="inputSubbasinOutlet"
                    :on-progress="onProgress" >上传：
                      <Button icon="ios-cloud-upload-outline">Upload files</Button>
                    </Upload>
                    </Space>
                  </div>
                  <div style="margin-right: 25px;margin-left: 20px">
                    <Table size="small" border highlight-row :columns="subBasinOutletColumns" :data="subBasinOutlet"
                      max-height="100">
                      <template #action="{ row, index }">
                        <Button type="primary" size="small" style="margin-right: 5px"
                          @click="locate(index)">View</Button>
                        <Button type="error" size="small" @click="remove(index)">Delete</Button>
                      </template>
                    </Table>
                  </div>

                </TabPane>
              </Tabs>
              <!-- <div v-if="completeRunSubBasin" style="margin-top:4px;margin-left: 30px;">
                <Icon type="ios-checkmark-circle-outline" color="#19be6b" size="20" />
              </div> -->
              <Divider />
              <div class="finishBtn">
                <Button @click="runSubBasin" :disabled="!completeBasinScopeSelection"
                  :style="runSubBasinButtonDynamicStyle" ghost type="info" :loading="runSubBasinLoading">Subbasin delineation</Button>
                <!-- <Button @click="" ghost type="info" :disabled="!completeStreamNetValueCommit">坡面划分</Button> -->
              </div>

              <!-- <Divider orientation="left">
                <Icon type="ios-arrow-dropdown" size="20" />HLU划分
              </Divider>
              <div style="margin:0 30px">
                <Form id="streamValueForm" :model="formStreamNetworkValue" :label-width="0" :rules="ruleStreamNetwork"
                  ref="formStreamNetworkValue" inline>
                  <span>输入HAND分带数：</span><br>
                  <FormItem prop='streamValueCell' style="margin-bottom: 5px;">
                    <Input :min="0" v-model="HANDNum" style="width: 90px" @on-change=""></Input>
                    <span>（单位：个/坡面）</span>
                  </FormItem>
                </Form>
              </div>
              <div class="finishBtn">
                <Button :disabled="!completeRunSubBasin" @click="HLUDivision" :style="HLUDivisionButtonDynamicStyle" ghost
                  type="info" :loading="HLUDivisionLoading">HLU划分</Button>
              </div> -->

              <!-- <Divider orientation="left"><Icon type="ios-arrow-dropdown" size="20"/>坡面划分</Divider>
                  <Tabs v-model="outletType" name="outlet" style="margin: 0 25px">
                    <TabPane :label="tabRenderSystem('使用绘图工具在页面上绘制',outletType)" name="outletFromSystemMapDraw" tab="outlet">
                      <div style="width:210px;margin:0 10px;display: inline;">
                        <div style="display: inline;">
                          <span>在地图上指定流域出口</span>
                          <i-switch v-model="outletDrawSwitch" :disabled="outletType=='outletFromLocal'">
                            <Icon slot="open" type="md-pin" size="14"></Icon>
                            <Icon slot="close" type="md-close" size="14"></Icon>
                          </i-switch>
                        </div>&nbsp;&nbsp;&nbsp;&nbsp;
                        <div style="display: inline;" v-if="outletOnMap"  >
                          <span style="vertical-align:middle;"><Icon type="ios-checkmark-circle-outline" color="#19be6b" size="20"/>已选中流域出口</span>
                          <ButtonGroup size="small" >
                            <Button type="success" ghost @click="basinOutletSelectApply" :loading="basinOutletSelectLoadingStatus">确定</Button>
                            <Button type="error" ghost @click="basinOutletReselect">重选</Button>
                          </ButtonGroup>
                          
                        </div>
                      </div>
                      <Button type="info" ghost @click="sdDelineation">统计流域土地利用</Button>
                    </TabPane>
                    <TabPane :label="tabRenderLocal('使用本地上传的outlet数据',outletType)" name="outletFromLocal" tab="outlet">
                      <div style="margin:0 0 10px 10px;">
                        <Upload 
                          ref="outletUpload"
                          :show-upload-list='false'
                          :on-success="uploadSuccess"
                          :format="['shp','shx','dbf','prj']"
                          :on-format-error="handleFormatError"
                          :max-size="102400"
                          :on-exceeded-size="handleMaxSize"
                          :before-upload="handleBeforeUpload"
                          :multiple='true'
                          action="/upload">
                          <Button icon="ios-cloud-upload-outline" :disabled="outletType=='outletFromSystemMapDraw'">上传outlet文件</Button>
                        </Upload>
                        <div v-if="uploadList.length > 0" >
                          <span>待上传文件:</span><br>
                          <Tag type="border" closable color="primary" 
                              v-for="(file,index) in uploadList" :key="index" :name="file.name" @on-close="outletUploadClose">
                            {{ file.name }}
                          </Tag>
                          <Button @click="upload" :loading="loadingStatus">{{ loadingStatus ? '上传中' : '点击上传' }}</Button>
                        </div>
                      </div>
                    </TabPane>
                  </Tabs> -->

              <!-- <div class="finishBtn">
                    <Button v-if="subbasinDelineationStatus=='modelSetting'" type="info" >生成流域划分结果</Button>
                    <div v-else-if="subbasinDelineationStatus=='modelRunning'" style="width:85%">
                      <i-progress :percent="99.99" status="active" hide-info></i-progress>
                      <span>流域划分运行中...</span>
                    </div>
                    <div v-else-if="subbasinDelineationStatus=='modelRunSuccessed'" style="width:100%">
                      <p class="finishFont">流域划分结果已生成</p>
                      <div class="finishBtn">
                        <Button type="info" ghost @click="sdDelineation">重新生成流域划分结果</Button>
                      </div>
                    </div>
                  </div> -->
            </div>
            <br>
          </TabPane>
          <!-- 2、HRU划分 模拟单元 -->
          <!-- <TabPane label="模拟单元划分" tab="createModelTab"> -->
          <TabPane label="Subarea generation & parameters" tab="createModelTab">
            <div>

              <Divider orientation="left">
                <Icon type="ios-arrow-dropdown" size="20" />Subarea generation
              </Divider>
              <div style="margin:0 70px;width: 100%;">
                <RadioGroup v-model="subareaType">
                  <Radio label="Overlay soil + landuse + slope" border style="width: 370px;"></Radio>
                  <Radio label="Overlay Subslope + HAND" border style="width: 370px;"></Radio>
                </RadioGroup>
              </div>

              <div v-if="subareaType == 'Overlay Subslope + HAND'" style="margin:10px 70px">
                <Form id="streamValueForm" :model="formStreamNetworkValue" :label-width="0" :rules="ruleStreamNetwork"
                  ref="formStreamNetworkValue" inline>
                  <div style="margin-top: 5px;float: left;">
                    <span>HAND分带数：</span>
                  </div>
                  <FormItem prop='streamValueCell' style="margin-bottom: 5px;">
                    <Input :min="0" v-model="HANDNum" style="width: 135px" @on-change=""></Input>
                    <span>（单位：个/坡面）</span>
                  </FormItem>
                </Form>
              </div>

              <!-- <Divider orientation="left">
                <Icon type="ios-arrow-dropdown" size="20" />土地利用数据
              </Divider> -->
              <div v-if="subareaType == 'Overlay soil + landuse + slope'" class="selectFlex" style="margin: 10px 70px 10px 70px;">
                <Checkbox v-model="isLanduseMapSelect" style="line-height: 30px;"></Checkbox>
                <p style="width: 15%;line-height: 30px;">Landuse:</p>
                <Select clearable v-model="landuseMapSelect" style="margin-right: 10px;width:28%"
                  :disabled="!isLanduseMapSelect" placeholder="Please select a landuse map" :transfer=true>
                  <Option v-for="item in landuseMapList" :value="item.value" :key="item.value">{{ item.label }}
                  </Option>
                </Select>
                <p style="width: 15%;line-height: 30px;">Overlay extent:</p>
                <Select clearable v-model="landuseOverlayRangeSelect" style="width:34%" :disabled="!isLanduseMapSelect"
                  placeholder="Please select the Overlay extent" :transfer=true>
                  <Option v-for="item in overlayRangeList" :value="item.value" :key="item.value">{{ item.label }}
                  </Option>
                </Select>
              </div>

              <!-- <Divider orientation="left">
                <Icon type="ios-arrow-dropdown" size="20" />土壤类型数据(可选)
              </Divider> -->
              <div v-if="subareaType == 'Overlay soil + landuse + slope'" class="selectFlex" style="margin: 10px 70px 10px 70px;">
                <Checkbox v-model="isSoilMapSelect" style="line-height: 30px;"></Checkbox>
                <p style="width: 15%;line-height: 30px;">Soiltype:</p>
                <Select clearable v-model="soilMapSelect" style="margin-right: 10px;width:28%"
                  :disabled="!isSoilMapSelect" placeholder="Please select a soiltype map" :transfer=true>
                  <Option v-for="item in soilMapList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <p style="width: 15%;line-height: 30px;">Overlay extent:</p>
                <Select clearable v-model="soilOverlayRangeSelect" style="width:34%" :disabled="!isSoilMapSelect"
                  placeholder="Please select the Overlay extent" :transfer=true>
                  <Option v-for="item in overlayRangeList" :value="item.value" :key="item.value">{{ item.label }}
                  </Option>
                </Select>
              </div>

              <div v-if="subareaType == 'Overlay soil + landuse + slope'" class="selectFlex" style="margin: 10px 70px 10px 70px;">
                <Checkbox v-model="isFieldSelect" style="line-height: 30px;"></Checkbox>
                <p style="width: 15%;line-height: 30px;">field:</p>
                <Select clearable v-model="fieldSelect" style="margin-right: 10px;width:28%"
                  :disabled="!isFieldSelect" placeholder="Please select a soiltype map" :transfer=true>
                  <Option v-for="item in fieldMapList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <p style="width: 15%;line-height: 30px;">Overlay extent:</p>
                <Select clearable v-model="fieldOverlayRangeSelect" style="width:34%" :disabled="!isSoilMapSelect"
                  placeholder="Please select the Overlay extent" :transfer=true>
                  <Option v-for="item in overlayRangeList" :value="item.value" :key="item.value">{{ item.label }}
                  </Option>
                </Select>
              </div>

              <div v-if="subareaType == 'Overlay soil + landuse + slope'" class="selectFlex" style="margin: 10px 70px 10px 70px;">
                <Checkbox style="line-height: 30px;" v-model="isSlopeSelect"></Checkbox>
                <p style="width: 15%;line-height: 30px;">Slope:</p>
                <Select clearable v-model="aspectTypeSelect" style="margin-right: 10px;width:28%"
                  :disabled="!isSlopeSelect" placeholder="Please select slope direction classification" :transfer=true>
                  <Option v-for="item in aspectTypeList" :value="item.value" :key="item.value">{{ item.label }}
                  </Option>
                </Select>
                <p style="width: 15%;line-height: 30px;">Overlay extent:</p>
                <Select clearable v-model="slopeOverlayRangeSelect" style="width:34%" :disabled="!isSlopeSelect"
                  placeholder="Please select the Overlay extent" :transfer=true>
                  <Option v-for="item in overlayRangeList" :value="item.value" :key="item.value">{{ item.label }}
                  </Option>
                </Select>
              </div>
              
              <div style="margin-left: 70px;margin-top: 10px;">
                Merge threshold:
                <Input v-model="threshold" style="width: auto" />
              </div>

              <div class="finishBtn">
                <Button :disabled="!completeRunSubBasin" @click="HLUDivision" :style="HLUDivisionButtonDynamicStyle"
                  ghost type="info" :loading="HLUDivisionLoading">Subarea generation</Button>
              </div>

              <Divider />

              <Divider orientation="left">
                <Icon type="ios-arrow-dropdown" size="20" />Extract parameters for subareas
              </Divider>
              <div class="finishBtn">
                <Button :disabled="!completeRunSubBasin" v-if="simulationUnitDelineationStatus == 'modelSetting'"
                  type="info" ghost @click="sdSimulationUnit">Extract parameters for subareas</Button>
                <div v-else-if="simulationUnitDelineationStatus == 'modelRunning'" style="width:85%">
                  <i-progress :percent="99.99" status="active" hide-info></i-progress>
                  <span>Subarea parameter extraction is running...</span>
                </div>
                <div v-else-if="simulationUnitDelineationStatus == 'modelRunSuccessed'" style="width:100%">
                  <p class="finishFont">Subarea parameter extraction completed</p>
                  <div class="finishBtn">
                    <Button type="info" ghost @click="sdSimulationUnit">Re extract subarea parameters</Button>
                  </div>
                </div>
              </div>


              <Divider orientation="left">
                <Icon type="ios-arrow-dropdown" size="20" />Extract environmental factors
              </Divider>
              <div class="finishBtn">
                <Button v-if="extractEnvStatus == 'modelSetting'"
                  type="info" ghost @click="extractEnv">Extract environmental factors for basin</Button>
                <div v-else-if="extractEnvStatus == 'modelRunning'" style="width:85%">
                  <i-progress :percent="99.99" status="active" hide-info></i-progress>
                  <span>Environmental factors extraction is running...</span>
                </div>
                <div v-else-if="extractEnvStatus == 'modelRunSuccessed'" style="width:100%">
                  <p class="finishFont">Environmental factors extraction completed</p>
                  <div class="finishBtn">
                    <Button type="info" ghost @click="extractEnv">Re extract environmental factors extraction</Button>
                  </div>
                </div>
              </div>

            </div>
            <br>
          </TabPane>

          <!-- 3、气象数据 -->
          <TabPane label="Meteorological data" tab="createModelTab">
            
            <!-- </TabPane> -->
            <!-- <TabPane :label="tabRenderLocal('使用本地上传的降雨数据', rainDataType)" name="rainFromLocal" tab="rainDataType">
                <div style="margin-left:24px">
                  <Upload action="" class="upload">
                    <Button icon="ios-cloud-upload-outline" :disabled="rainDataType == 'rainFromSystem'">上传降雨数据</Button>
                  </Upload>
                </div>
              </TabPane> -->
            <!-- </Tabs> -->
            <!-- <div class="selectFlex">
                <div>
                  <Select v-model="rainDataSelect" :transfer=true style="width:200px" :disabled="rainDataType=='rainFromLocal'" clearable>
                    <Option v-for="item in rainDataList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select><br>
                  <div v-if=" rainDataSelect !== undefined && rainDataSelect!=='' && rainDataType!=='rainFromLocal'">
                    <span>请选择降雨数据起止时间</span><br>
                    <DatePicker type="datetimerange" :options="climateOptions" format="yyyy-MM-dd HH:mm" v-model="rainDateRange" placeholder="Select date and time" style="width: 274px" transfer split-panels @on-change="climateTimeChange('rain')"/>
                  </div>
                </div>
                <div>
                  <Upload action="" class="upload" >
                    <Button icon="ios-cloud-upload-outline" :disabled="rainDataType=='rainFromSystem'">上传降雨数据</Button>
                  </Upload>
                </div>
              </div> -->
            <Divider orientation="left">
              <Icon type="ios-arrow-dropdown" size="20" /> Meteorological data
            </Divider>
            <!-- <Tabs v-model="meteoDataType" name="meteoDataType" style="margin: 0 25px"> -->
            <!-- <TabPane :label="tabRenderSystem('使用系统提供的气象数据', meteoDataType)" name="meteoFromSystem" tab="meteoDataType"> -->
            <div class="selectFlex">
              <Select v-model="meteoDataSelect" placeholder="Please select" :transfer=true style="width:410px" clearable>
                <Option v-for="item in meteoDataList" :value="item.value" :key="item.value">{{ item.label }}
                </Option>
              </Select>
            </div>
            <div class="selectFlex">
              <div v-if="meteoDataSelect !== undefined && meteoDataSelect !== ''">
                <span>Please select the start and end time of Meteorological data</span><br>
                <DatePicker type="datetimerange" :start-date="new Date(1994, 0, 1)" :options="climateOptions" format="yyyy-MM-dd HH:mm"
                  v-model="rainDateRange" placeholder="Select date and time" style="width: 410px" transfer split-panels
                  @on-change="climateTimeChange('rain')" />
              </div>
            </div>
            <!-- <div class="selectFlex">
              <div v-if="meteoDataSelect !== undefined && meteoDataSelect !== ''">
                <span>请选择气象数据起止时间</span><br>
                <DatePicker type="datetimerange" format="yyyy-MM-dd HH:mm" v-model="meteoDateRange"
                  placeholder="Select date and time" style="width: 410px" transfer split-panels
                  @on-change="climateTimeChange('meteo')" />
              </div>
            </div> -->

            <Divider orientation="left">
              <Icon type="ios-arrow-dropdown" size="20" />Precipitation data
            </Divider>
            <!-- <Tabs v-model="rainDataType" name="rainDataType" style="margin: 0 25px"> -->
            <!-- <TabPane :label="tabRenderSystem('使用系统提供的降雨数据', rainDataType)" name="rainFromSystem" tab="rainDataType"> -->
            <div class="selectFlex">
              <Select v-model="rainDataSelect" placeholder="Please select" :transfer=true style="width:410px" clearable>
                <Option v-for="item in rainDataList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="selectFlex">
              <div v-if="rainDataSelect !== undefined && rainDataSelect !== ''">
                <span>Please select the start and end time of Precipitation data</span><br>
                <DatePicker type="datetimerange" :start-date="new Date(1994, 0, 1)" :options="climateOptions" format="yyyy-MM-dd HH:mm"
                  v-model="rainDateRange" placeholder="Select date and time" style="width: 410px" transfer split-panels
                  @on-change="climateTimeChange('rain')" />
              </div>
            </div>


            <!-- </TabPane> -->
            <!-- <TabPane :label="tabRenderLocal('使用本地上传的气象数据', meteoDataType)" name="meteoFromLocal" tab="meteoDataType">
                <div style="margin-left:24px">
                  <Upload action="" class="upload">
                    <Button icon="ios-cloud-upload-outline"
                      :disabled="meteoDataType == 'meteoFromSystem'">上传气象数据</Button>
                  </Upload>
                </div>
              </TabPane> -->
            <!-- </Tabs> -->
            <Divider />
            <div class="finishBtn">
              <Button v-if="climatePreprocessStatus == 'modelSetting'" type="info" ghost
                @click="climatePreprocess">Extract data</Button>
              <div v-else-if="climatePreprocessStatus == 'modelRunning'" style="width:85%">
                <i-progress :percent="99.99" status="active" hide-info></i-progress>
                <span>Data extraction is running...</span>
              </div>
              <div v-else-if="climatePreprocessStatus == 'modelRunSuccessed'" style="width:100%">
                <p class="finishFont">Data extraction is completed</p>
                <div class="finishBtn">
                  <Button type="info" ghost @click="climatePreprocess">Re perform data extraction</Button>
                </div>
              </div>
            </div>
            <br>
          </TabPane>


          <!-- 水文观测 -->
          <TabPane label="Hydrological data" tab="createModelTab">
            <Divider orientation="left">
              <Icon type="ios-arrow-dropdown" size="20" />Hydrological observation / AI data
            </Divider>

            <div class="selectFlex">
              <Select v-model="observedDataSelect" placeholder="Please select" :transfer=true style="width:410px" clearable>
                <Option v-for="item in observedDataList" :value="item.value" :key="item.value">{{ item.label }}
                </Option>
              </Select>
            </div>
            <!-- <div v-if="observedDataSelect == 'AI'" class="finishBtn">
              <Button type="info" ghost @click="observedDataSet">Run AI</Button>
            </div> -->
            <Divider />
            <div class="finishBtn">
              <Button type="info" ghost @click="observedDataSet" :loading="observeLoading">Extract data</Button>
            </div>
          </TabPane>



          <!-- 水文观测 -->
          <!-- <TabPane label="水文观测" tab="createModelTab">
            <Divider orientation="left">
              <Icon type="ios-arrow-dropdown" size="20" />水文观测数据
            </Divider>

            <div class="selectFlex">
              <Select v-model="observedDataSelect" :transfer=true style="width:410px" clearable>
                <Option v-for="item in observedDataList" :value="item.value" :key="item.value">{{ item.label }}
                </Option>
              </Select>
            </div>
            <Divider />
            <div class="finishBtn">
              <Button type="info" ghost @click="observedDataSet">水文观测数据提取</Button>
            </div> -->


            <!-- <span>观测数据类型：</span>
            <Tag v-for="item in obsDataTypeSelect" :key="item" :name="item" closable @on-close="handleCloseObs">{{ item
              }}
            </Tag>
            <CheckboxGroup v-model="obsDataResource" style="margin:5px 0px 5px 10px">
              <Checkbox label="obsFromSystem">
                <span>观测数据选择：</span>
              </Checkbox>
              <Checkbox label="obsFromLocal" style="padding-left:90px">
                <span>使用本地上传的观测数据：</span>
              </Checkbox>
            </CheckboxGroup>
            <div class="selectFlex">
              <div style="margin:0px 10px">
                <Select v-model="obsDataTypeSelectSystem" :transfer=true style="width:200px"
                  @on-change='addObsDataTypeSelectSystem' :disabled='obsSelectShow(obsFromSystem)'>
                  <Option v-for="item in obsDataTypeList" :value="item" :key="item">{{ item }}</Option>
                </Select>
              </div>
              <div style="margin:0px 10px ">
                <Input v-model="obsDataTypeLocal.name" placeholder="请输入观测数据类型名" :disabled='obsSelectShow(obsFromLocal)'
                  style="width:180px"></Input>
                <Button @click="obsDataTypeLocalSubmit" :disabled='obsSelectShow(obsFromLocal)'>添加</Button>
                <Upload ref="observedUpload" :show-upload-list='false' :on-success="uploadSuccess" :format="['csv']"
                  :on-format-error="handleFormatError" :max-size="102400" :on-exceeded-size="handleMaxSize"
                  :before-upload="handleBeforeObservedUpload" :multiple='true' action="/upload">
                  <Button icon="ios-cloud-upload-outline" :disabled='obsSelectShow(obsFromLocal)'
                    style="margin-top:10px ">上传本地观测数据</Button>
                </Upload>
                <Button @click="downloadObserverdExample" :disabled='obsSelectShow(obsFromLocal)'
                  :loading="downloadObserverdExampleLoadingStatus">下载示例</Button>
                <div v-if="observedUploadList.length > 0">
                  <span>待上传文件:</span><br>
                  <Tag type="border" closable color="primary" v-for="(file, index) in observedUploadList" :key="index"
                    :name="file.name" @on-close="outletUploadClose">
                    {{ file.name }}
                  </Tag>
                  <Button @click="observedUpload" :loading="observedLoadingStatus">{{ observedLoadingStatus ? '上传中' :
        '点击上传' }}</Button>
                </div>
              </div>
            </div>
            <br>
            <div class="finishBtn">
              <Button v-if="observedPreprocessStatus == 'modelSetting'" type="info" ghost
                @click="observedPreprocess">完成观测数据设置</Button>
              <div v-else-if="observedPreprocessStatus == 'modelRunning'" style="width:85%">
                <i-progress :percent="99.99" status="active" hide-info></i-progress>
                <span>保存观测数据...</span>
              </div>
              <div v-else-if="observedPreprocessStatus == 'modelRunSuccessed'" style="width:100%">
                <p class="finishFont">观测数据处理完成</p>
                <div class="finishBtn">
                  <Button type="info" ghost @click="climatePreprocess">重新保存观测数据</Button>
                  <Button type="success" ghost @click="saveProjectPreprocess">保存当前预处理设置</Button>
                </div>
              </div>
            </div>
            <br> -->
          <!-- </TabPane> -->
        </Tabs>
      </Modal>
    </transition>
    <Modal v-model="preprocessToMongoDB" :mask-closable="false">
      <template #header>
        <p style="color:#2d8cf0;text-align:center;font-size:20px">
          <Icon type="gear-b" size="20"></Icon>
          <span>是否提交当前建模选项</span>
        </p>
      </template>
      <div>
        <List header="当前项目设置" border size="small">
          <ListItem>项目名称：{{ formProjectItem.projectName }}</ListItem>
          <ListItem>流域范围：{{ basinScopeTypeDes }}</ListItem>
          <ListItem>
            河网阈值：{{ formStreamNetworkValue.streamValueArea }}km<sup>2</sup>;{{ formStreamNetworkValue.streamValueCell
            }}Cell
          </ListItem>
          <ListItem>HAND分带数：{{ HANDNum }}</ListItem>
          <ListItem>流域出口：{{ outletTypeDes }}</ListItem>
          <ListItem>土壤类型：{{ soilMapDataTypeDes }}</ListItem>
          <ListItem>土壤属性：{{ soilParaDataTypeDes }}</ListItem>
          <ListItem>土地利用：{{ landuseDataTypeDes }}</ListItem>
          <ListItem>降雨数据：{{ rainDataTypeDes }}<br>{{ rainStartTime }}-{{ rainEndTime }}</ListItem>
          <ListItem>气象数据：{{ meteoDataTypeDes }}<br>{{ meteoStartTime }}-{{ meteoEndTime }}</ListItem>
          <ListItem>观测数据：{{ obsDataTypeSelectSystem }}</ListItem>
        </List>
      </div>
      <template #footer>
        <Button type="success" size="large" :loading="submitProjectDetailStatus"
          @click="submitProjectDetail">提交</Button>
        <Button type="error" size="large" :loading="dropProjectDetailStatus" @click="dropProjectDetail">取消</Button>
      </template>
    </Modal>
  </div>
</template>

<script>
import axios from 'axios';
import { request } from "@/network/request";
import MyComponent from "@/components/MapView.vue"
import { eventBus } from "@/network/eventBus"; // 导入事件总线
// import GeoTIFF, { fromBlob } from "geotiff";
import * as geotiff from "geotiff";
import * as plotty from "plotty";

export default {
  name: 'CreateModel',
  components: {
    MyComponent,
  },
  props: {
    createModelShow: {
      type: Boolean
    }
  },
  watch: {
    createModelShow(newVal, oldVal) {
      this.createModelShowTemp = newVal
    },
    immediate: true
  },
  created() {

    this.initLevelLabel();
  },
  mounted() {
    this.mapCM = this.$store.getters.storeMap;
    this.initController();
    this.listenDraw();
  },
  computed: {
    runSubBasinButtonDynamicStyle() {
      if (this.completeRunSubBasin) return "background-color: rgb(85, 225, 85);color: blue;margin- right:5px"
    },
    HLUDivisionButtonDynamicStyle() {
      if (this.completeHLUDivision) return "background-color: rgb(85, 225, 85);color: blue;margin- right:5px"
    }
  },
  data() {
    const validateProjectName = (rule, value, callback) => {
      if (value) {
        if (!value.match(/^[\u4E00-\u9FA5A-Za-z0-9_]+?$/)) {
          callback(new Error('不可输入特殊字符'))
        } else if (value.length > 16) {
          callback(new Error('项目名称字符应少于16位'))
        } else {
          callback()
        }
      }
    };
    const validateStreamValueCell = (rule, value, callback) => {
      if (!value.match(/^\+?[1-9][0-9]*$/)) {
        callback(new Error('应输入非零正整数'))
      } else {
        callback()
      }
    };
    const validateStreamValueArea = (rule, value, callback) => {
      // if (!value.match(/^[0-9]+(\.[0-9]{1,6})?$/)) {
      if (!value.match(/^(([1-9]\d{0,6})|0)(\.\d{0,5})?$/)) {
        callback(new Error('阈值应大于零,且有最多5位小数'))
      } else {
        callback()
      }
    };
    return {
      threshold:100,
      uploaddata:{
          projectName:'',
          username:'',
          tiftype:''
      },
      selectedFile: null,
      streamValue: 30,
      selectSubOutletsSwitch: false,
      subBasinOutletColumns: [
        {
          type: 'index',
          width: 45,
          height: 10,
          align: 'center'
        },
        {
          title: '经度',
          key: 'lon',
          height: 20,
        },
        {
          title: '纬度',
          key: 'lat',
          height: 20,
        },
        {
          title: '操作',
          slot: 'action',
          width: 100,
          align: 'center',
          height: 20,
        }
      ],
      subBasinOutlet: [],//子流域出口经纬度对象数组
      tabRenderSystem: (name, value) => {
        return h => {
          let iconType;
          if (value.includes('System')) {
            iconType = 'ios-arrow-dropdown'
          } else {
            iconType = 'ios-arrow-dropright'
          }
          return h('div', [
            h('Icon', {
              props: {
                type: iconType
              },
              style: {
                fontSize: '18px'
              }
            }),
            h('span', name),
          ])
        }
      },
      tabRenderLocal: (name, value) => {
        return h => {
          let iconType;
          if (value.includes('Local')) {
            iconType = 'ios-arrow-dropdown'
          } else {
            iconType = 'ios-arrow-dropright'
          }
          return h('div', [
            h('Icon', {
              props: {
                type: iconType
              },
              style: {
                fontSize: '18px'
              }
            }),
            h('span', name),
          ])
        }
      },
      //
      createModelShowTemp: false,
      formProjectItem: {
        projectName: 'test1',
        // projectName:'',
      },
      namedProjectBtnStatus: false,
      ruleProject: {
        projectName: [
          { required: true, message: '项目名称不能为空', trigger: 'change' },
          { type: 'string', validator: validateProjectName, trigger: 'change' }
        ]
      },
      createProjectStatus: 'modelSetting',
      isProjectNameVaild: false,
      ///////
      mapCM: null,
      drawingLayerGroup: null,//绘画图层组
      drawingBasinLayerGroup: null,//流域图层组
      drawingSubBasinLayerGroup: null,//子流域图层组
      streamLayerGroup: null,//河网图层组
      HLULayerGroup: null,//HLU图层组
      HLUlayer: null,

      subBasinOutletLayerStatus: false,

      basinScopeType: 'basinScopeFromSystem',
      basinCkb: false,
      levelSelect: 7,
      runSubBasinLoading: false,
      HLUDivisionLoading: false,
      levelLayerList: [],
      basinLayer: null,
      querySwitch: false,
      basinScopeSelectSystem: false,
      completeBasinScopeSelection: false,
      completeRunSubBasin: false,
      completeHLUDivision: false,
      basinScopeSelectLoadingStatus: false,
      completeStreamNetValueCommit: false,
      StreamNetValueCommitLoading: false,
      spinShow: false,
      DEMDataSize: 90,
      formStreamNetworkValue: {
        streamValueArea: '1.62',
        streamValueCell: '200',
      },
      HANDNum: 5,
      subareaType: null,
      selectLake: false,
      ruleStreamNetwork: {
        streamValueCell: [
          { required: true, message: '河网阈值不能为空', trigger: 'blur' },
          // {type:'number',pattern:/^\+?[1-9][0-9]*$/,message:'应输入非零正整数', trigger: 'blur',} //transform(value) {return Number(value);}
          { type: 'number', validator: validateStreamValueCell, trigger: 'blur', }
        ],
        streamValueArea: [
          { required: true, message: '河网阈值不能为空', trigger: 'blur' },
          // {type:'number', pattern:/^[0-9]+(\.[0-9]{1,3})?$/,message:'阈值应大于零', trigger: 'blur' }
          { type: 'number', validator: validateStreamValueArea, trigger: 'blur', }
        ]
      },
      outletType: 'outletFromSystemMapDraw',
      outletDrawSwitch: false,
      outletGeoJson: null,
      outletlon: null,
      outletlat: null,
      uploadList: [],
      outletMaxLength: 4,
      uploadMaxLength: 1,
      loadingStatus: false,
      outletOnMap: false,
      basinOutletSelectLoadingStatus: false,
      subbasinDelineationStatus: 'modelSetting',
      upstreamByClickSwitch: false,
      ucpLayer: null,//临时标记选取的上游流域范围点的图层。ucp:upstream-click-point
      subBasinOutletLayerGroup: null,//子流域出口图层组
      ////////
      DEMSelect: '',
      DEMList: this.$store.getters.DEMList,
      // [
      //   {
      //     value: 'shujuji',
      //     label: 'DEM数据集'
      //   },
      // ],
      soilMapList: this.$store.getters.soilMapList,
      // [
      //   {
      //     value: 'ChinaSoilType1km',
      //     label: '中国土壤类型图'
      //   },
      //   //{
      //   //  value: 'soil-2',
      //   //  label: 'soil-2'
      //   //},
      // ],
      landuseMapList: this.$store.getters.landuseMapList,
      // [
      //   //{
      //   //  value: 'ESA_CCI_300m',
      //   //  label: 'ESA-CCI-300m'
      //   //},
      //   //{
      //   //  value: 'GLC',
      //   //  label: 'GLC'
      //   //},
      //   {
      //     value: 'MODIS',
      //     label: 'MODIS-500m'
      //   }
      // ],
      
      fieldMapList: this.$store.getters.fieldMapList,
      isSoilMapSelect: true,
      isLanduseMapSelect: true,
      isFieldSelect: false,
      isSlopeSelect: false,
      soilMapSelect: 'ChinaSoilType1km',
      landuseMapSelect: 'MODIS',
      fieldMapSelect: '',
      soilMapDataType: 'soilMapFromSystem',
      soilParaSelect: '',
      soilParaList: [
        //{
        //  value: 'SGW_china',
        //  label: '中山大学上官微土壤属性数据集'
        //},
        {
          value: 'soilgrids',
          label: 'soilgrids土壤属性数据集'
        }
      ],
      
      overlayRangeList: this.$store.getters.overlayRangeList,
      aspectTypeList: [
        {
          value: 'aspect4',
          label: 'N,S,W,E'
        },
        {
          value: 'aspect3',
          label: 'N,S,W/E'
        },
      ],
      
      soilOverlayRangeSelect: 'all',
      landuseOverlayRangeSelect: 'all',
      fieldOverlayRangeSelect: 'all',
      slopeOverlayRangeSelect: 'all',
      landuseDataType: 'landuseFromSystem',
      simulationUnitDelineationStatus: 'modelSetting',
      extractEnvStatus: 'modelSetting',
      ///////////////
      rainDataType: 'rainFromSystem',
      rainDataList: this.$store.getters.rainDataList,
      // [
      //   {
      //     value: 'CMFD-pcp',
      //     label: 'CMFD'
      //   },
      //   //{
      //   //  value: 'rain-2',
      //   //  label: 'rain-2'
      //   //},
      // ],
      rainDataSelect: '',
      rainDateRange: '',
      // rainDateRange: ['1994-01-01', '1999-12-31'],
      rainStartTime: '',
      rainEndTime: '',
      meteoDataType: 'meteoFromSystem',
      meteoDataList: this.$store.getters.meteoDataList,
      // [
      //   {
      //     value: 'CMFD-meteo',
      //     label: 'CMFD'
      //   },
      //   //{
      //   //  value: 'meteo-2',
      //   //  label: 'meteo-2'
      //   //},
      // ],
      meteoDataSelect: '',
      meteoDateRange: '',
      meteoStartTime: '',
      meteoEndTime: '',
      observedDataSelect: '',
      observedDataList: this.$store.getters.observedDataList,

      climatePreprocessStatus: 'modelSetting',
      climateOptions: {
        //设置可选的时间范围。在CMFD数据集的时间范围
        disabledDate(date) {
          let CMFDData = new Date('2018-12-30 10:30:00').getTime()
          let timeDiff = Date.now() - CMFDData
          return date && date.valueOf() > Date.now() - timeDiff;
        }
      },
      //////////////
      obsDataTypeList: [
        'Q', 'SED', 'NO3', 'NH4'
      ],
      obsDataTypeSelect: [],
      obsDataTypeSelectSystem: [],
      obsDataTypeLocal: {
        name: '',
      },
      obsDataResource: [],
      obsFromSystem: 'obsFromSystem',
      obsFromLocal: 'obsFromLocal',
      observedUploadList: [],
      observedLoadingStatus: false,
      downloadObserverdExampleLoadingStatus: false,
      observedPreprocessStatus: 'modelSetting',
      // 
      preprocessToMongoDB: false,
      basinScopeTypeDes: '',
      outletTypeDes: '',
      soilMapDataTypeDes: '',
      soilParaDataTypeDes: '',
      landuseDataTypeDes: '',
      rainDataTypeDes: '',
      meteoDataTypeDes: '',
      submitProjectDetailStatus: false,
      dropProjectDetailStatus: false,
      observeLoading: false,
    }
  },
  methods: {
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
            // 处理后端的响应
            // 在URL后面添加随机参数
            const randomParam = Math.random();
            const randomParam2 = Math.random();
            const newURL2 = 'http://localhost:8083/infboy/downLandUseSta?rand=' + randomParam + randomParam2;
            var downloadRandName2 = 'downloadLink' + randomParam2;
            downloadRandName2 = document.createElement('a');
            downloadRandName2.href = newURL2;
            //downloadRandName2.target = '_blank'; // 在新标签页中打开下载链接

            // 模拟点击下载链接
            downloadRandName2.click();
            console.log(response);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      } else {
        alert('Please select a CSV file.');
      }
    },
    addCrossCursor() {
      this.$el.classList.add('cross-cursor');
    },
    removeCrossCursor() {
      this.$el.classList.remove('cross-cursor');
    },
    modalVisible(isVisible) {
      // console.log(isVisible);
      this.$emit('update:createModelShow', isVisible); //实现createModelShow的双向绑定
    },
    namedProject(name) {
      this.namedProjectBtnStatus = true;
      // 从sessionStorage获取数据
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.isProjectNameVaild = true
          console.log(this.formProjectItem.projectName)
          this.$store.commit("SET_PROJECT_NAME", this.formProjectItem.projectName);
          this.$Notice.success({
            title: '项目命名完成',
            duration: 3
          });
          setTimeout(() => {
            this.namedProjectBtnStatus = false;
          }, 200);
        }
      })
    },
    createProject() {
      this.namedProject('formProjectItem')
      this.createProjectStatus = 'modelRunning';
      const username = sessionStorage.getItem('username');
      console.log(username)
      const projectName = this.$store.getters.projectName;
      console.log(projectName)

      this.uploaddata['projectName'] = projectName
      this.uploaddata['username'] = username

      if (this.isProjectNameVaild) {
        let params = new URLSearchParams();
        params.append("newProjectName", this.formProjectItem.projectName);
        params.append("userName", username);
        request
          .post('/project/create', params)
          .then(res => {
            if (res.data.errCode == 200) {
              this.$Message.success({
                content: '项目创建成功！',
                duration: 3
              });
              this.createProjectStatus = 'modelRunSuccessed';
              // this.$store.commit("SET_PROJECT_NAME", this.formProjectItem.projectName);
            } else {
              this.$Message.error({
                content: '项目已存在，请重新创建！',
                duration: 3,
              });
              this.formProjectItem.projectName = '';
              this.createProjectStatus = 'modelSetting';
              this.isProjectNameVaild = false;
            }
          })
          .catch(e => {
            console.log(e)
            this.$Message.error('项目创建失败，请重新创建！');
            this.createProjectStatus = 'modelSetting';
          });
      } else {
        this.$Message.error({
          content: '项目名称错误，请重新设置！',
          duration: 3,
        });
        this.formProjectItem.projectName = '';
        this.createProjectStatus = 'modelSetting';
        this.isProjectNameVaild = true
      }
    },
    giveUpCurrentProject() {
      this.formProjectItem.projectName = ''
      this.createProjectStatus = 'modelSetting';
      //todo 后端编写删除当前项目文件
    },
    handleSubmitProject(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!');
        } else {
          this.$Message.error('Fail!');
        }
      })
    },
    initController() {
      //
      this.drawingLayerGroup = L.layerGroup([]);
      this.drawingLayerGroup.addTo(this.mapCM);
      //
      this.drawingBasinLayerGroup = L.layerGroup([]);
      this.drawingBasinLayerGroup.addTo(this.mapCM);
      //
      this.drawingSubBasinLayerGroup = L.layerGroup([]);
      this.drawingSubBasinLayerGroup.addTo(this.mapCM);
      //
      this.streamLayerGroup = L.layerGroup([]);
      this.streamLayerGroup.addTo(this.mapCM);
      //
      this.HLULayerGroup = L.layerGroup([]);
      this.HLULayerGroup.addTo(this.mapCM);
      //
      this.subBasinOutletLayerGroup = L.layerGroup([]);
      this.subBasinOutletLayerGroup.addTo(this.mapCM);


      var options = {
        position: "topright", // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
        drawMarker: true, // adds button to draw markers
        drawCircleMarker: false,
        drawPolyline: false, // adds button to draw a polyline
        drawRectangle: false, // adds button to draw a rectangle
        drawPolygon: false, // adds button to draw a polygon
        drawCircle: false, // adds button to draw a cricle
        cutPolygon: false, // adds button to cut a hole in a polygon
        editMode: true, // adds button to toggle edit mode for all layers
        dragMode: false,
        removalMode: true // adds a button to remove layers
      };
      this.mapCM.pm.addControls(options);
    },
    listenDraw() {
      const username = sessionStorage.getItem('username');
      //const username = 'infboy';
      // console.log('listenDraw Begin');
      var _this = this;
      this.mapCM.on('pm:create', e => {
        if (_this.outletDrawSwitch) {
          _this.drawingLayerGroup.clearLayers();
          _this.drawingLayerGroup.addLayer(e.layer);
          _this.outletGeoJson = e.layer._latlng//.toGeoJSON()
          console.log('create outlet point');
          _this.outletOnMap = true;
        }
      });
      this.mapCM.on('pm:remove', e => {
        _this.drawingLayerGroup.clearLayers();
        _this.outletOnMap = false;
      });
      //地图点击监听:333
      this.mapCM.on('click', e => {
        var latlng = e.latlng;
        var lon = latlng['lng'];
        var lat = latlng['lat'];
        console.log(lon)
        var type = ''
        if (this.DEMSelect == "shujuji") type = "2"
        else type = "1"
        // if(_this.querySwitch){
        if (_this.upstreamByClickSwitch && !_this.completeBasinScopeSelection && !_this.basinScopeSelectSystem) {
          console.log("流域出口监听")
          var baseUrl = "";
          baseUrl = "/basins/queryUpstreamBasinBound/" + "?lon=" + lon + "&lat=" + lat + "&projectName=" + this.formProjectItem.projectName + "&username=" + username + "&type=" + type;
          //添加流域出口点图层
          this.addUpstreamClickPoint("basinOutlet", lon, lat)
          // this.spinShow = true
          this.$Spin.show({
            render: (h) => {
              return h('div', [
                h('Icon', {
                  'class': 'demo-spin-icon-load',
                  props: {
                    type: 'ios-loading',
                    size: 18
                  }
                }),
                h('div', 'Obtaining watershed extent')
              ])
            }
          });
          request
            .get(baseUrl)
            .then(res => {
              if (res.data != 0) {
                //改指针
                eventBus.$emit("change-cursor-pointer");

                this.createModelShowTemp = true;

                //改图层组件中图层的状态
                this.$emit("changeLayerStatus", "basinbound", true)

                var tempGeoJSON = res.data;
                //添加流域范围图层
                _this.addGeoJSONToMap('basinLayer', JSON.stringify(tempGeoJSON), "red");

                _this.$Spin.hide();
                _this.basinScopeSelectSystem = true;
              }
              else {
                _this.$Message.error('No Basin Info Here.');
                // this.spinShow = false;
                _this.$Spin.hide();
              };
            })
            .catch(err => {
              confirm('Something Wrong!');
              _this.$Spin.hide();
            });
          // this.showDownloadGeoJSONBtn = true;
          // this.toDownloadGeoJSONStr = basin_scale;
          // this.addGeoJSONToMap(JSON.stringify(basin_scale), "red");  
        } else if (_this.selectSubOutletsSwitch) {
          console.log("子流域出口监听")
          //添加子流域出口点图层
          this.addUpstreamClickPoint("subBasinOutlet", lon, lat)

          let newData = {}
          newData['lat'] = lat
          newData['lon'] = lon
          this.subBasinOutlet.push(newData)
        }
      });
      this.mapCM.on('contextmenu', e => {
        console.log("右击了")
        if (this.selectSubOutletsSwitch) {
          this.createModelShowTemp = true;
          //改指针.
          eventBus.$emit("change-cursor-pointer");
          this.selectSubOutletsSwitch = false;
        } else if (this.upstreamByClickSwitch) {
          this.createModelShowTemp = true;
          eventBus.$emit("change-cursor-pointer");
          this.upstreamByClickSwitch = false;
        }
      })
    },
    initLevelLabel() {
      for (var i = 2; i < 11; i++) {
        var item = {
          value: i,
          label: 'level ' + i
        }
        this.levelLayerList.push(item);
      }
    },
    addUpstreamClickPoint(type, lon, lat) {
      if (type == 'basinOutlet') {
        this.removeUpstreamClickPoint()
        this.ucpLayer = L.marker([lat, lon], {
          icon: new L.Icon({
            className: "rivermap-icon",
            iconUrl: require('../../assets/riverpoint.png'),
            iconSize: [24, 24],
            iconAnchor: [12, 24],
          })
        })
        this.mapCM.addLayer(this.ucpLayer);
        // this.drawingBasinLayerGroup.addLayer(this.ucpLayer);
        // var id = this.drawingBasinLayerGroup.getLayerId(this.ucpLayer);
        // console.log(id);
        //更新store.
        this.$store.commit("SET_BASINOUTLETLAYER_OBJECT", this.ucpLayer);
        //改图层父组件中图层的状态
        this.$emit("changeLayerStatus", "basinoutlet", true)
      } else if (type == 'subBasinOutlet') {
        var layer = L.marker([lat, lon], {
          icon: new L.Icon({
            className: "rivermap-icon",
            iconUrl: require('../../assets/subBasinOutlet.png'),
            iconSize: [24, 24],
            iconAnchor: [12, 24],
          })
        })

        this.subBasinOutletLayerGroup.addLayer(layer)
        this.$store.commit("SET_SUBBASINOUTLETLAYER_OBJECT", this.subBasinOutletLayerGroup);
        //改图层父组件中图层的状态.千万不能提交多次
        if (this.subBasinOutletLayerStatus == false)
          this.$emit("changeLayerStatus", "subbasinoutlet", true)
        this.subBasinOutletLayerStatus = true;
      }

    },
    removeUpstreamClickPoint() {
      if (this.ucpLayer !== null) {
        this.ucpLayer.remove();
      }
    },
    showBasinsLayer(show) {
      if (show) {
        this.changeStandardBasinsLevel()
        console.log('Show Basin Layer');
      }
      else {
        console.log('Hide Basins Layer.');
        this.querySwitch = false;
        this.upstreamByClickSwitchChange(false);
        try {
          this.basinLayer.remove();
        } catch { }
      }
    },
    changeStandardBasinsLevel() {
      try {
        this.basinLayer.remove();
      } catch { }
      var level = this.levelSelect;
      //   this.basinLayer = L.tileLayer.wms('http://210.26.48.56:30122/geoserver/Basin_shp/wms',{
      this.basinLayer = L.tileLayer.wms('http://223.2.41.136:7070/geoserver/Basin_shp/wms', {
        layers: 'Asia_level_0' + level,
        format: 'image/png',
        transparent: true,
        noWarp: true
      }).addTo(this.mapCM);
      console.log('Show Standard Basin Layer in Level ' + level + '.');
    },
    changeBasinScopeDataResource() {
      if (this.basinScopeType !== 'basinScopeFromSystem') {
        this.basinCkb = false;
        // this.querySwitch=false;
        this.upstreamByClickSwitch = false;
        try {
          this.basinLayer.remove();
          this.showBasinsLayer(false)
        } catch { }
      }
    },
    //根据离散颜色及数据范围生成对应值的颜色
    getSeparatedColorByVal(minVal, maxVal, colors, val) {
      let length = colors.length;
      let avg = ((maxVal - minVal) / length).toFixed(4);
      //生成等分区间
      let regions = [];
      for (let i = 0; i < length; i++) {
        if (i === length - 1) {
          regions.push([(minVal + avg * i), maxVal]);
        } else {
          regions.push([(minVal + avg * i), (minVal + avg * (i + 1))]);
        }
      }
      //返回对应值颜色
      for (let i = 0; i < regions.length; i++) {
        if (val >= regions[i][0] && val <= regions[i][1]) {
          return colors[i];
        }
      }
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
      // switch (type) {
      //   case 'basinLayer':
      //     fillOpacity = 0;
      //     break;
      //   case 'subBasinLayer':
      //     fillOpacity = 0.2;
      //     break;
      // }

      // let separatedColors = ['#DAF7A6', '#FFC300', '#FF5733', '#C70039', '#900C3F', '#581845'];//离散颜色
      const separatedColors = [
        "#FF0000", "#FF0033", "#FF0066", "#FF0099", "#FF00CC", "#FF00FF", "#FF3300", "#FF3333", "#FF3366", "#FF3399", "#FF33CC", "#FF33FF", "#FF6600", "#FF6633", "#FF6666", "#FF6699", "#FF66CC", "#FF66FF", "#FF9900", "#FF9933", "#FF9966", "#FF9999", "#FF99CC", "#FF99FF", "#FFCC00", "#FFCC33", "#FFCC66", "#FFCC99", "#FFCCCC", "#FFCCCC", "#FFFF00", "#FFFF33", "#FFFF66", "#FFFF99", "#FFFFCC",
        "#00FF00", "#00FF33", "#00FF66", "#00FF99", "#00FFCC", "#00FFFF", "#0033FF", "#0033CC", "#003399", "#003366", "#003333", "#0033FF", "#0066FF", "#0066CC", "#006699", "#006666", "#006633", "#0099FF", "#0099CC", "#009999", "#009966", "#00CCFF", "#00CCCC", "#00CC99", "#00CC66", "#FFFF3F", "#FFFF8C", "#FFFFBF",
        "#C28F5C", "#C8B47F", "#CBCDA4", "#D1D1E1", "#D4B4A8", "#D7B7A4", "#DECBAD", "#E5C5BD", "#E8E4D4", "#EBDCD5", "#EFD8F1", "#F2F2F2", "#F4C5C4", "#F7B4B4", "#FADBDC", "#FDA5DC", "#FFFFFF", "#F7D7A8", "#F5B47D", "#F2B4B4", "#F2D1E2", "#F2D1E5", "#F5D7E2", "#F5D7E5", "#F5D7E8", "#F7D7E8", "#F7D7EC", "#FAD7E8", "#FAD7EC",
        "#A1CAF1", "#B1D1FC", "#BACED8", "#BDCDFE", "#BFC2FB", "#BFC2FC", "#BFC2FD", "#BFC2FE", "#C7DFDF", "#C7E8FE", "#CBEAF8", "#CFDEDF", "#CFE8FE", "#CFE8FD", "#CFE8FC", "#CFE8FB", "#D7E8FD", "#D7E8FE", "#D7E8FD", "#D7E8FC"

      ];
      // #FF0000: 红色
      // #00FF00: 绿色
      // #0000FF: 蓝色
      // #FFFF00: 黄色
      // #00FFFF: 青色
      // #FF00FF: 品红
      // #C0C0C0: 银色
      // #808080: 灰色
      // #FFA500: 橙色
      // #8B4513: 深棕色
      // #9400D3: 紫色
      // #A9A9A9: 中灰色
      // #B8860B: 浅黄色
      // #7789D5: 浅蓝色
      // #6B8E23: 橄榄绿
      // #CD5C5C: 砖红色
      // #DC143C: 紫红色
      // #4682B4: 深蓝色
      // #B22222: 猩红色
      // #FDBE62: 米色
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
        mouseCancelMove: false,
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
          //popup弹窗
          // layer.bindPopup(feature.properties.VALUE);
          if (type == 'HLULayer') {
            layer.on({
              click: (e) => {
                const prop = e.target.feature.properties;
                _this.clickHLUid = prop.VALUE;
                console.log(prop.VALUE)
              }
            })
          }
        }
      }).bindPopup(function (layer) {
        return layer.feature.properties.description;
      });
      this.HLUlayer = geoJsonLayer;
      this.loadFeatures(type, geoJsonLayer);
      //平移至数据位置
      this.mapCM.fitBounds(geoJsonLayer.getBounds());

      // this.mapCM.on('click', function (e) {
      //   var features = geoJsonLayer.getLayers();
      //   for (var i in features) {
      //     console.log(features[i])
      //     console.log(e)
      //     // if (features[i]._path && features[i]._path._rings[0][0] == e.latlng.lat && features[i]._path._rings[0][1] == e.latlng.lng) {
      //     //   console.log(features[i]._path._rings[0][2]);
      //     // }
      //   }
      // });
    },
    //222
    loadFeatures(type, featureCollection) {
      switch (type) {
        case 'basinLayer':
          featureCollection.eachLayer(layer => {
            this.drawingBasinLayerGroup.addLayer(layer);
          });
          this.$store.commit("SET_BASINBOUNDLAYER_OBJECT", this.drawingBasinLayerGroup);
          break;
        case 'subBasinLayer':
          this.drawingSubBasinLayerGroup.clearLayers();
          featureCollection.eachLayer(layer => {
            this.drawingSubBasinLayerGroup.addLayer(layer);
          });
          this.$store.commit("SET_SUBBASINLAYER_OBJECT", this.drawingSubBasinLayerGroup);//在getdatashowcontrol组件中相应更改
          break;
        case 'streamLayer':
          this.streamLayerGroup.clearLayers();
          featureCollection.eachLayer(layer => {
            this.streamLayerGroup.addLayer(layer);
          });
          this.$store.commit("SET_STREAMLAYER_OBJECT", this.streamLayerGroup);//在getdatashowcontrol组件中相应更改
          break;
        case 'HLULayer':
          featureCollection.eachLayer(layer => {
            this.HLULayerGroup.addLayer(layer);
          });
          this.$store.commit("SET_HLULAYER_OBJECT", this.HLULayerGroup);//在getdatashowcontrol组件中相应更改
          break;
      }
    },
    removeBasinLayer() {
      console.log('Select local data, remove basin layer');
      try {
        this.basinLayer.remove();
      } catch { }
    },
    basinScopeSelectSystemReselect() {
      this.drawingBasinLayerGroup.clearLayers();
      //改指针
      eventBus.$emit("change-cursor");

      this.createModelShowTemp = false;

      //更新store
      this.$store.commit("SET_BASINBOUNDLAYER_OBJECT", null);
      this.$store.commit("SET_BASINOUTLETLAYER_OBJECT", null);

      //更新图层状态
      this.$emit("changeLayerStatus", "basinbound", false)
      this.$emit("changeLayerStatus", "basinoutlet", false)

      this.basinScopeSelectSystem = false;
    },
    basinScopeSelectSystemApply() {
      this.completeBasinScopeSelection = true;

      //Todo： 发送请求，生成小流域


      // L.DomUtil.removeClass(map._container,'crosshair-cursor-enabled');
      // //请求后端geojson转shp
      // this.basinScopeSelectLoadingStatus=true;
      // console.log("basin scope selected apply");
      // let params = new URLSearchParams();
      // params.append("projectName",this.formProjectItem.projectName);
      // request.post('/basins/preprocess/geojson2shp',params)
      // .then(res=>{
      //   if (res.data.errCode == 200) {
      //         this.$Notice.success({
      //           title:'选择流域范围成功！',
      //           duration: 5
      //         });
      //         this.querySwitch=false;
      //   } else {
      //       this.$Notice.error({
      //       title:'选择流域范围失败，请重新选择！',
      //       duration: 5,
      //       });
      //     }
      // }).catch(e=>{
      //     this.$Notice.error({
      //     title:'选择流域范围失败，请重新选择！',
      //     duration: 5,
      //     });
      // })
      // window.setTimeout(()=>{
      //   this.basinScopeSelectLoadingStatus=false;
      // }, 5000);
    },
    upstreamByClickSwitchChange() {
      if (this.upstreamByClickSwitch || this.selectSubOutletsSwitch) {
        eventBus.$emit("change-cursor");
        this.createModelShowTemp = false;
        // console.log(L);

      } else {
        eventBus.$emit("change-cursor-pointer");
        // // 获取子组件实例
        // const childComponent = this.$refs.childComponent;
        // // 获取子组件中的<div>元素
        // const mapContainer = childComponent.$refs.mapContainer;
        // // 更改<div>元素的鼠标样式
        // mapContainer.style.cursor = "pointer";
        // this.basinScopeSelectSystem=false;
        // this.drawingBasinLayerGroup.clearLayers();
      }
    },
    streamNetValueCommit() {
      // this.completeStreamNetValueCommit = true;
      this.StreamNetValueCommitLoading = true;
      let params = new URLSearchParams();
      params.append("projectName", this.formProjectItem.projectName);
      params.append("streamNetValue", this.formStreamNetworkValue.streamValueCell);
      request.post('/basins/preprocess/streamNetworkValue', params)
        .then(res => {
          this.StreamNetValueCommitLoading = false;
          if (res.data.errCode == 200) {
            this.$Notice.success({
              title: '河网阈值设置成功，生成流域划分结果',
              duration: 10
            })
            this.completeStreamNetValueCommit = true;
          } else {
            this.$Notice.warning({
              title: '河网阈值设置失败，请重新设置！',
              desc: '失败原因： ' + res.data.msg,
              duration: 10
            });
          }
        }).catch(e => {
          this.$Notice.error({
            title: '河网阈值设置失败，请重新设置！',
          });
        })
      // this.handleSubmitProject('formStreamNetworkValue')
    },
    uploadSuccess(res, file) {
      if (res.errCode == 200) {
        this.$Notice.success({
          title: '文件上传成功',
          duration: 10
        })
      } else {
        this.$Notice.warning({
          title: '文件上传失败',
          desc: '失败原因： ' + res.msg,
          duration: 10
        });
      }
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: file.name + '的文件格式不对，请重新选择文件进行上传。',
        duration: 10
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: '超过文件大小限制',
        desc: '文件  ' + file.name + ' 超过100MB.'
      });
    },
    handleBeforeUpload(file) {
      this.uploadList.push(file);
      const FileExt = file.name.replace(/.+\./, "");//取得文件的后缀名
      const check = this.uploadList.length <= this.outletMaxLength;
      if (!check) {
        this.$Notice.warning({
          title: '最多只能上传' + this.outletMaxLength + '个文件.',
          duration: 10
        });
      } else if (['shp', 'shx', 'dbf', 'prj'].indexOf(FileExt.toLowerCase()) === -1) { //
        this.$Notice.error({ title: '请上传以shp,shx,dbf,prj结尾的文件', duration: 10 });
        var index = this.uploadList.indexOf(file.name);
        this.uploadList.splice(index, 1);
      } else if (file.size > 102400) {
        this.$Notice.warning({
          title: '超过文件大小限制',
          desc: '文件  ' + file.name + ' 超过100MB.',
          duration: 10
        });
        var index = this.uploadList.indexOf(file.name);
        this.uploadList.splice(index, 1);
      }
      return false;
    },
    upload() {
      this.loadingStatus = true;
      let requestConfig = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      }
      for (let i = 0; i < this.uploadList.length; i++) {
        let fileFormData = new FormData();
        fileFormData.append('file', this.uploadList[i]);
        request
          .post('/file/upload', fileFormData, requestConfig)
          .then(res => {
            if (res.data.errCode == 200) {
              this.$Notice.success({
                title: this.uploadList[i].name + '上传成功',
                duration: 10
              })
            } else {
              this.$Notice.warning({
                title: this.uploadList[i].name + '上传失败',
                desc: '失败原因： ' + res.data.msg,
                duration: 10
              });
            }
          }).catch(e => {
            this.$Notice.error({
              title: this.uploadList[i].name + '上传失败'
            });
          })
      }
      window.setTimeout(() => {
        this.loadingStatus = false;
      }, 3000);
    },
    outletUploadClose(event, name) {
      for (var i = this.uploadList.length - 1; i >= 0; i--) {
        if (this.uploadList[i].name == name) {
          this.uploadList.splice(i, 1);
        }
      }
    },
    changeOutletDataResource() {
      if (this.outletType === 'outletFromSystemMapDraw') {
        this.uploadList = []
      } else if (this.outletType === 'outletFromLocal') {
        this.outletGeoJson = null;
        this.outletDrawSwitch = false;
        this.outletOnMap = false;
        this.drawingLayerGroup.clearLayers();
      }
    },
    outletPointShp(lat, lon) {
      console.log("111")
      let params = new URLSearchParams();
      params.append("projectName", this.formProjectItem.projectName);
      params.append("lat", lat);
      params.append("lon", lon);
      request.post('/basins/preprocess/outletShp', params)
        .then(res => {
          if (res.data.errCode == 200) {
            this.$Notice.success({
              title: 'outlet设置成功',
              duration: 10
            })
          } else {
            this.$Notice.warning({
              title: 'outlet设置失败，请重新设置！',
              desc: '失败原因： ' + res.data.msg,
              duration: 10
            });
          }
        }).catch(e => {
          this.$Notice.error({
            title: 'outlet设置失败，请重新设置！',
          });
        })
      window.setTimeout(() => {
        this.basinOutletSelectLoadingStatus = false;
      }, 3000);
    },
    basinOutletSelectApply() {
      this.basinOutletSelectLoadingStatus = true;
      this.outletPointShp(this.outletGeoJson.lat, this.outletGeoJson.lng);
    },
    basinOutletReselect() {
      console.log("121")
      this.drawingLayerGroup.clearLayers();
      this.outletOnMap = false;
    },
    downloadFile() {
      const url = 'http://localhost:8888/static/subbasinLandUse.csv'; // 替换为后端提供下载静态文件的接口地址
      // 创建一个 <a> 标签
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.target = '_blank'; // 在新标签页中打开下载链接

      // 模拟点击下载链接
      downloadLink.click();
    },
    sdDelineation() {
      this.subbasinDelineationStatus = 'modelRunning';
      let params = new URLSearchParams();
      params.append("projectName", this.formProjectItem.projectName);
      request.post('/SEIMSDataProcessing/sdDelineation', params)
        .then(res => {
          // console.log("流域划分",res);
          if (res.data === true) {
            this.$Notice.success({
              title: '流域划分结果已生成',
              duration: 10
            })
            this.subbasinDelineationStatus = 'modelRunSuccessed';
            // this.geoserverPublih();
          } else {
            this.$Notice.warning({
              title: '流域划分失败，请重新设置！',
              duration: 10
            });
            this.subbasinDelineationStatus = 'modelSetting';
          }
        }).catch(e => {
          this.$Notice.error({
            title: '流域划分失败，请重新设置！',
          });
          this.subbasinDelineationStatus = 'modelSetting';
        });
      // 在URL后面添加随机参数
      const randomParam = Math.random();
      const randomParam2 = Math.random();
      const newURL2 = 'http://localhost:8083/infboy/downloadLandUse?rand=' + randomParam + randomParam2;
      var downloadRandName2 = 'downloadLink' + randomParam2;
      downloadRandName2 = document.createElement('a');
      downloadRandName2.href = newURL2;
      //downloadRandName2.target = '_blank'; // 在新标签页中打开下载链接

      // 模拟点击下载链接
      downloadRandName2.click();

    },
    sdSimulationUnit() {
      let _this = this;
      let params = new URLSearchParams();
      params.append("projectName", this.formProjectItem.projectName);
      params.append("username", sessionStorage.getItem('username'));

      var type = ''
      const regex_steppler = /steppler$/;
      // const regex_hulugou = /hulugou$/;
      if (this.DEMSelect == "shujuji") type = "1"
      // else if (!regex_steppler.test(this.DEMSelect) || !regex_hulugou.test(this.DEMSelect)) type = "1"
      else type = "2"
      params.append("demtype", type);

      var isSteppler = "1";
      if (regex_steppler.test(this.DEMSelect)) isSteppler = "2"
      params.append("isSteppler", isSteppler);

      _this.simulationUnitDelineationStatus = 'modelRunning';
      // let params = new URLSearchParams();
      // params.append("projectName", _this.formProjectItem.projectName);
      // // _this.simulationUnitParams(_this.landuseMapSelect,'simulationUnitLanduse')
      // axios.all([_this.simulationUnitParams(_this.landuseMapSelect, 'simulationUnitLanduse'),
      // _this.simulationUnitParams(_this.soilMapSelect, 'simulationUnitSoiltype')])
      //   .then(axios.spread(function (landuseResp, soilResp) {
      //     // .then(e=>{
      //     // if (e.data.errCode == 200 ) {
      //     if (landuseResp.data.errCode == 200 && soilResp.data.errCode == 200) {
      //       _this.$Notice.success({
      //         title: '选择模拟单元数据成功',
      //         duration: 10
      //       })
      //       _this.sdSimulationUnitSeimsApi();
      //       _this.soilLookupTableSeimsApi();
      //     } else {
      //       _this.$Notice.warning({
      //         title: '选择模拟单元数据失败,请重新选择',
      //         duration: 10
      //       })
      //       _this.simulationUnitDelineationStatus = 'modelSetting';
      //     }
      //   }));
      request.post('/basins/ExtractSoilParameters', params)
        .then(res => {
          // console.log(res);
          if (res.data.errCode === 200) {
            this.$Notice.success({
              title: 'extract parameters of subarea successfully',
              duration: 10
            })
            this.simulationUnitDelineationStatus = 'modelRunSuccessed'
            // this.geoserverPublih();
          } else {
            this.$Notice.warning({
              title: 'extract parameters of subarea failed',
              desc: '失败原因： ' + res.data.msg,
              duration: 10
            });
            this.simulationUnitDelineationStatus = 'modelSetting';
          }
        }).catch(e => {
          this.$Notice.error({
            title: 'extract parameters of subarea failed！',
          });
          this.simulationUnitDelineationStatus = 'modelSetting';
        })
    },
    extractEnv() {
      let _this = this;
      let params = new URLSearchParams();
      params.append("projectName", this.formProjectItem.projectName);
      params.append("username", sessionStorage.getItem('username'));

      _this.extractEnvStatus = 'modelRunning';
      request.post('/basins/ExtractEnvFactors', params)
        .then(res => {
          // console.log(res);
          if (res.data.errCode === 200) {
            this.$Notice.success({
              title: 'extract environmental factors for basin successfully',
              duration: 10
            })
            this.extractEnvStatus = 'modelRunSuccessed'
            // this.geoserverPublih();
          } else {
            this.$Notice.warning({
              title: 'extract environmental factors for basin failed',
              desc: '失败原因： ' + res.data.msg,
              duration: 10
            });
            this.extractEnvStatus = 'modelSetting';
          }
        }).catch(e => {
          this.$Notice.error({
            title: 'extract environmental factors for basin failed！',
          });
          this.extractEnvStatus = 'modelSetting';
        })
    },
    simulationUnitParams(selectedData, urlType) {
      let params = new URLSearchParams();
      params.append("projectName", this.formProjectItem.projectName);
      params.append("selectedData", selectedData);
      if (urlType == 'simulationUnitSoiltype') {
        params.append("soilParaSelectedData", this.soilParaSelect);
      }
      var url = '/basins/preprocess/' + urlType
      return request.post(url, params)
    },
    soilLookupTableSeimsApi() {
      let params = new URLSearchParams();
      params.append("projectName", this.formProjectItem.projectName);
      request.post('/SEIMSDataProcessing/soilLookupTable', params)
        .then(res => {
          // console.log(res);
          if (res.data === true) {
            this.$Notice.success({
              title: 'Soil Lookup Table 已生成',
              duration: 10
            })
            // this.geoserverPublih();
          } else {
            this.$Notice.warning({
              title: 'Soil Lookup Table 生成失败，请重新设置！',
              desc: '失败原因： ' + res.data.msg,
              duration: 10
            });
            this.simulationUnitDelineationStatus = 'modelSetting';
          }
        }).catch(e => {
          this.$Notice.error({
            title: 'Soil Lookup Table 生成失败，请重新设置！',
          });
          this.simulationUnitDelineationStatus = 'modelSetting';
        })
    },
    sdSimulationUnitSeimsApi() {
      let params = new URLSearchParams();
      params.append("projectName", this.formProjectItem.projectName);
      request.post('/SEIMSDataProcessing/sdField', params)
        .then(res => {
          // console.log(res);
          if (res.data === true) {
            this.$Notice.success({
              title: 'Generate subarea successfully',
              duration: 10
            })
            this.simulationUnitDelineationStatus = 'modelRunSuccessed';
            // this.geoserverPublih();
          } else {
            this.$Notice.warning({
              title: 'Generate subarea failed',
              desc: '失败原因： ' + res.data.msg,
              duration: 10
            });
            this.simulationUnitDelineationStatus = 'modelSetting';
          }
        }).catch(e => {
          this.$Notice.error({
            title: 'Generate subarea failed',
          });
          this.simulationUnitDelineationStatus = 'modelSetting';
        })
    },
    geoserverPublih() {
      var paramObj = {
        fileName: "D:/WEB/basins/test/test7/workspace/spatial_raster/dem.tif",
        workSpace: this.formProjectItem.projectName,
        styleName: "dem",
        dataSetName: "dem",
        layerName: "dem",
        dataType: 2,
        crs: 4326
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
          // console.log(res);
          if (res.data.errCode == 200) {
            console.log("gerosrver publish success");
          } else {
            console.log("gerosrver publish failed");
          }
        }).catch(e => {
          console.log("gerosrver publish failed");
        })
    },
    dataClear(val) {

    },
    climateTimeChange(type) {
      var beginDate = new Date(this.rainDateRange[0]);
      var endDate = new Date(this.rainDateRange[1]);
      if (type == 'rain') {
        this.rainStartTime = this.dateFormat("YYYY-mm-ddTHH:MM:SS", beginDate)
        this.rainEndTime = this.dateFormat("YYYY-mm-ddTHH:MM:SS", endDate)
      } else {
        this.meteoStartTime = this.dateFormat("YYYY-mm-ddTHH:MM:SS", beginDate)
        this.meteoEndTime = this.dateFormat("YYYY-mm-ddTHH:MM:SS", endDate)
      }
    },
    async climateRequest(cliamteType, startTime, endTime) {
      let params = new URLSearchParams();
      params.append("projectName", this.formProjectItem.projectName);
      params.append("climate", cliamteType);
      params.append("climateStartTime", startTime);
      params.append("climateEndTime", endTime);
      let type = cliamteType.split("-")
      let messageTitle = ''
      let messageFail = ''
      let requestStatus = ''
      if (type[1] == "pcp") {
        messageTitle = '降雨数据设置完成'
        messageFail = '降雨数据预处理失败，请重新设置'
      } else if (type[1] == "meteo") {
        messageTitle = '气象数据设置完成'
        messageFail = '气象数据预处理失败，请重新设置'
      }
      await request.post('/basins/preprocess/climate', params)
        .then(res => {
          // console.log(res);
          if (res.status == 200) {
            this.$Notice.success({
              title: messageTitle,
              duration: 10
            })
            requestStatus = 'modelRunSuccessed';
            // this.geoserverPublih();
          } else {
            this.$Notice.warning({
              title: messageFail,
              desc: '失败原因： ' + res.data.msg,
              duration: 10
            });
            requestStatus = 'modelSetting';
          }
        }).catch(e => {
          this.$Notice.error({
            title: messageFail,
          });
          requestStatus = 'modelSetting';
        })
      return requestStatus;
    },
    climatePreprocess() {
      console.log(this.meteoDataSelect)
      this.climatePreprocessStatus = 'modelRunning';
      // console.log(this.climatePreprocessStatus);
      // let pcpStatus = await this.climateRequest(this.rainDataSelect, this.rainStartTime, this.rainEndTime);
      // let meteoStatus = await this.climateRequest(this.meteoDataSelect, this.meteoStartTime, this.meteoEndTime);
      let type = ""
      if (this.meteoDataSelect == "CMFD-meteo") {
        type = "1"
      } else {
        type = "2"
      }
      let params = new URLSearchParams();
      params.append("username", sessionStorage.getItem('username'));
      params.append("projectName", this.formProjectItem.projectName);
      params.append("climateStartTime", this.rainStartTime);
      params.append("climateEndTime", this.rainEndTime);
      params.append("type", type);


      var demtype = ''
      const regex = /steppler$/;
      if (this.DEMSelect == "shujuji") demtype = "1"
      else if (!regex.test(this.DEMSelect)) demtype = "1"
      else demtype = "2"
      params.append("demtype", demtype);

      console.log(params.values)
      request.post('/basins/preprocess/climate', params)
        .then(res => {
          // console.log(res);
          if (res.data.errCode == 200) {
            this.$Notice.success({
              title: 'Meteorological data generated successfully',
              duration: 10
            })
            this.simulationUnitDelineationStatus = 'modelRunSuccessed';
            this.climatePreprocessStatus = 'modelRunSuccessed'
            // this.geoserverPublih();
          } else {
            this.$Notice.warning({
              title: 'Meteorological data generation failed',
              desc: '失败原因： ' + res.data.msg,
              duration: 10
            });
            this.simulationUnitDelineationStatus = 'modelSetting';
          }
        }).catch(e => {
          this.$Notice.error({
            title: 'Meteorological data generation failed',
          });
          this.simulationUnitDelineationStatus = 'modelSetting';
        })
      // if (pcpStatus == 'modelRunSuccessed' && meteoStatus == 'modelRunSuccessed') {
      //   this.$Notice.success({
      //     title: "气象数据设置成功",
      //     duration: 10
      //   })
      //   this.climatePreprocessStatus = 'modelRunSuccessed';
      //   // this.geoserverPublih();
      // } else {
      //   this.$Notice.warning({
      //     title: "气象数据设置失败，请重新设置",
      //     duration: 10
      //   });
      //   this.climatePreprocessStatus = 'modelSetting';
      // }


    },
    observedDataSet() {
      this.observeLoading = true
      if (this.observedDataSelect != "") {

        // 若选择的AI 需要运行LSTM
        if (this.observedDataSelect == "AI") {

          var beginDate = new Date(this.rainStartTime);
          var endDate = new Date(this.rainEndTime);
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
                  _this.observeLoading = false
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
        }


        // Todo: 将AI结果导入
        // // 导入观测数据到数据库中
        // let params = new URLSearchParams();
        // params.append("username", sessionStorage.getItem('username'));
        // params.append("projectName", this.formProjectItem.projectName);
        // request.post('/basins/preprocess/observed', params)
        //   .then(res => {
        //     // console.log(res);
        //     if (res.data.errCode == 200) {
        //       this.$Notice.success({
        //         title: 'Hydrological observation data has been generated',
        //         duration: 10
        //       })
        //     } else {
        //       this.$Notice.warning({
        //         title: 'Hydrological observation data generation failed',
        //         desc: '失败原因： ' + res.data.msg,
        //         duration: 10
        //       });
        //     }
        //   }).catch(e => {
        //     this.$Notice.error({
        //       title: 'Hydrological observation data generation failed',
        //     });
        //   })
      }
    },
    handleBeforeObservedUpload(file) {
      this.observedUploadList.push(file);
      const FileExt = file.name.replace(/.+\./, "");//取得文件的后缀名
      const check = this.observedUploadList.length <= 20;
      if (!check) {
        this.$Notice.warning({
          title: '最多只能上传20个文件.',
          duration: 10
        });
      } else if (['csv'].indexOf(FileExt.toLowerCase()) === -1) { //
        this.$Notice.error({ title: '请上传以csv结尾的文件', duration: 10 });
        var index = this.observedUploadList.indexOf(file.name);
        this.observedUploadList.splice(index, 1);
      } else if (file.size > 102400) {
        this.$Notice.warning({
          title: '超过文件大小限制',
          desc: '文件  ' + file.name + ' 超过100MB.',
          duration: 10
        });
        var index = this.observedUploadList.indexOf(file.name);
        this.observedUploadList.splice(index, 1);
      }
      return false;
    },
    observedUpload() {
      this.observedLoadingStatus = true;
      let requestConfig = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      }
      let formData = new FormData();
      for (let i = 0; i < this.observedUploadList.length; i++) {
        formData.append('file', this.observedUploadList[i]);
      }
      formData.append('projectName', this.formProjectItem.projectName);
      request
        .post('/file/observedUpload', formData, requestConfig)
        .then(res => {
          if (res.data.errCode == 200) {
            this.$Notice.success({
              title: '观测数据文件上传成功',
              duration: 10
            })
          } else {
            this.$Notice.warning({
              title: '观测数据文件上传失败',
              desc: '失败原因： ' + res.data.msg,
              duration: 10
            });
          }
        }).catch(e => {
          this.$Notice.error({
            title: '观测数据文件上传失败'
          });
        })

      window.setTimeout(() => {
        this.observedLoadingStatus = false;
      }, 3000);
    },
    outletUploadClose(event, name) {
      for (var i = this.observedUploadList.length - 1; i >= 0; i--) {
        if (this.observedUploadList[i].name == name) {
          this.observedUploadList.splice(i, 1);
        }
      }
    },
    downloadObserverdExample() {
      this.downloadObserverdExampleLoadingStatus = true;
      request.get("/file/downloadObservedExample", {
        responseType: 'blob'
      },
      )
        .then(res => {
          var fileName = "ObserverdExample.zip";
          var fileURL = window.URL.createObjectURL(new Blob([res.data], { type: 'application/zip' }));
          var fileLink = document.createElement('a');
          fileLink.href = fileURL;
          fileLink.setAttribute('download', fileName);
          document.body.appendChild(fileLink);
          fileLink.click();
          // 下载完成移除元素
          // document.body.removeChild(a);
          // 释放掉blob对象
          window.URL.revokeObjectURL(fileURL);
        })
        .catch(e => {
          this.$Notice.error('下载观测数据示例文件失败');
        })
      window.setTimeout(() => {
        this.downloadObserverdExampleLoadingStatus = false;
      }, 3000);
    },
    observedPreprocess() {
      this.observedPreprocessStatus = 'modelRunning';
      window.setTimeout(() => {
        this.observedPreprocessStatus = 'modelRunSuccessed';
      }, 3000);
    },
    ///
    saveProjectPreprocess() {
      if (this.createProjectStatus == 'modelRunSuccessed' && this.subbasinDelineationStatus == 'modelRunSuccessed' && this.simulationUnitDelineationStatus == 'modelRunSuccessed'
        && this.climatePreprocessStatus == 'modelRunSuccessed' && this.observedPreprocessStatus == 'modelRunSuccessed') {
        this.showProjectDetail()
        this.preprocessToMongoDB = true;
      } else {
        this.$Notice.warning({
          title: '建模预处理未完成，请重新设置！',
          duration: 10
        });
      }
    },
    showProjectDetail() {
      if (this.basinScopeType == 'basinScopeFromSystem') {
        this.basinScopeTypeDes = '使用系统提供流域范围'
      } else if (this.basinScopeType == 'basinScopeFromLocal') {
        this.basinScopeTypeDes = '使用本地上传的流域范围'
      };
      if (this.outletType == 'outletFromSystemMapDraw') {
        this.outletTypeDes = '在地图页面绘制生成'
      } else if (this.outletType == 'outletFromLocal') {
        this.outletTypeDes = '由本地上传'
      };
      if (this.soilMapDataType == 'soilMapFromSystem') {
        this.soilMapDataTypeDes = this.getDictValue(this.soilMapList, this.soilMapSelect)
        this.soilParaDataTypeDes = this.getDictValue(this.soilParaList, this.soilParaSelect)
      } else if (this.soilMapDataType == 'soilMapFromLocal') {
        this.soilMapDataTypeDes = '由本地上传'
        this.soilParaDataTypeDes = '由本地上传'
      };
      if (this.landuseDataType == 'landuseFromSystem') {
        this.landuseDataTypeDes = this.getDictValue(this.landuseMapList, this.landuseMapSelect)
      } else if (this.landuseDataType == 'landuseFromLocal') {
        this.landuseDataTypeDes = '由本地上传'
      };
      if (this.rainDataType == 'rainFromSystem') {
        this.rainDataTypeDes = this.getDictValue(this.rainDataList, this.rainDataSelect)
      } else if (this.rainDataType == 'rainFromLocal') {
        this.rainDataTypeDes = '由本地上传'
      };
      if (this.meteoDataType == 'meteoFromSystem') {
        this.meteoDataTypeDes = this.getDictValue(this.meteoDataList, this.meteoDataSelect)
      } else if (this.meteoDataType == 'meteoFromLocal') {
        this.meteoDataTypeDes = '由本地上传'
      };
    },
    getDictValue(jsObjects, selectValue) {
      var result = jsObjects.filter(x => x.value === selectValue);
      return result[0].label
    },
    submitProjectDetail() {
      this.submitProjectDetailStatus = true;
      let params = new URLSearchParams();
      params.append("projectName", this.formProjectItem.projectName);
      request.post('/SEIMSDataProcessing/dbBuildMongodb', params)
        .then(res => {
          if (res.data === true) {
            this.$Notice.success({
              title: '建模预处理数据已保存',
              duration: 10
            })
            this.submitProjectDetailStatus = false;
            this.preprocessToMongoDB = false;
            this.createModelShowTemp = false;
            // this.geoserverPublih();
          } else {
            this.$Notice.warning({
              title: '建模预处理数据保存失败，请重新设置！',
              desc: '失败原因： ' + res.data.msg,
              duration: 10
            });
            this.submitProjectDetailStatus = false;
          }
        }).catch(e => {
          this.$Notice.error({
            title: '建模预处理数据保存失败，请重新设置！',
          });
          this.submitProjectDetailStatus = false;
        })
    },
    dropProjectDetail() {
      this.preprocessToMongoDB = false;
    },

    transformDecimal(number, i) {
      let decimalNum = null;
      // 先转换为数值型
      let num = Number(number);
      // 判断是否为数值型
      if (!isNaN(num)) {
        // 切分整数与小数
        let arr = num.toString().split(".");
        // 是小数且小数位大于保留个数
        if (arr.length > 1 && arr[1].length > i) {
          // 小数部分字符串
          let decimal = arr[1].slice(i, i + 1);
          // toFixed 有 bug，四舍六入五随机
          // 当四舍五入的数为 5，给其 + 1
          if (decimal === '5') {
            // 这里可能会存在 0.1 ** 5 = 0.000010000000000000003 但不影响四舍五入
            num += Math.pow(0.1, i + 1);
          }
          decimalNum = num.toFixed(i);
        }
        else {
          decimalNum = num;
        }
        decimalNum = Number(decimalNum);
      }
      return String(decimalNum);
    },
    convertCellArea(type) {
      var streamValueArea = this.formStreamNetworkValue.streamValueArea;
      var streamValueCell = this.formStreamNetworkValue.streamValueCell;
      if (type == 'cell') {
        var valueAreaTmp = streamValueCell * Math.pow(this.DEMDataSize, 2) * 0.000001
        this.formStreamNetworkValue.streamValueArea = this.transformDecimal(valueAreaTmp, 4)
      } else if (type == 'area') {
        var valueCellTmp = (streamValueArea * 1000000) / Math.pow(this.DEMDataSize, 2);
        this.formStreamNetworkValue.streamValueCell = this.transformDecimal(valueCellTmp, 0)
      }
    },
    handleCloseObs(event, name) {
      const index = this.obsDataTypeSelect.indexOf(name);
      this.obsDataTypeSelect.splice(index, 1);
    },
    obsDataTypeLocalSubmit() {
      var obsName = this.obsDataTypeLocal.name;
      // console.log(obsName);
      // console.log(this.getBLen(obsName));
      // console.log(this.obsDataTypeSelect.indexOf(obsName));

      //可以分次添加多个观测数据类型
      if (this.getBLen(obsName) && this.obsDataTypeSelect.indexOf(obsName) < 0) {
        this.obsDataTypeSelect.push(obsName);
      }
    },
    addObsDataTypeSelectSystem(val) {
      if (val in this.obsDataTypeSelect) {

      } else {
        this.obsDataTypeSelect.push(val);
      }

    },
    getBLen(str) {
      if (str == null) return 0;
      if (typeof str != "string") {
        str += "";
      }
      return str.replace(/[^\x00-\xff]/g, "01").length;
    },
    obsSelectShow(obsName) {
      if (this.obsDataResource.indexOf(obsName) < 0) {
        return true
      } else {
        return false
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
    runSubBasin() {

      //改图层组件中图层的状态
      this.$emit("changeLayerStatus", "subBasin", false)
      this.$emit("changeLayerStatus", "stream", false)

      this.streamLayerGroup.clearLayers();
      this.drawingSubBasinLayerGroup.clearLayers();

      this.runSubBasinLoading = true;
      //JSON数组转字符串
      var dataStr = JSON.stringify(this.subBasinOutlet);

      let params = new URLSearchParams();
      params.append("streamValue", this.streamValue);
      params.append("subBasinOutlet", dataStr);
      params.append("projectName", this.formProjectItem.projectName);
      params.append("username", sessionStorage.getItem('username'));
      var type = ""
      if (this.selectLake) type = "2"
      else type = "1"
      console.log(type)
      params.append("type", type);
      var _this = this;
      // 调用子流域划分请求
      request.post('/basins/subBasinDivision', params)

      // request
      //   .post('/basins/subBasinDivision', params)
      //   .then(async res => {
      //     if (res.data != null) {
      //       this.runSubBasinLoading = false;
      //       this.completeRunSubBasin = true;
      //       this.$Message.success({
      //         content: '流域划分成功',
      //         duration: 3
      //       });

      //       console.log(res.data)
      //       console.log(res.data[0])

      //       // var arr = res.data.split("&&");
      //       // var tempGeoJSON = arr[0];
      //       // console.log(JSON.stringify(tempGeoJSON))
      //       // var tempGeoJSON2 = arr[1];
      //       //添加流域范围图层
      //       _this.addGeoJSONToMap('subBasinLayer', JSON.stringify(res.data[0]), "red");
      //       _this.addGeoJSONToMap('streamLayer', JSON.stringify(res.data[1]), "blue");

      //       //改图层组件中图层的状态
      //       this.$emit("changeLayerStatus", "subBasin", true)
      //       this.$emit("changeLayerStatus", "stream", true)

      //       // //加载tif
      //       // let file = "E:\\WEB\\basins\\test\\xujs\\1450\\data_prepare\\spatial\\subBasin.tif"
      //       // const tiff = await geotiff.fromUrl(file);
      //       // let image = await tiff.getImage();

      //       // let canvas = document.createElement("canvas");
      //       // const bbox = image.getBoundingBox();
      //       // const data = await image.readRasters();
      //       // const plot = new plotty.plot({
      //       //   canvas,
      //       //   data: data[0],
      //       //   width: image.getWidth(),
      //       //   height: image.getHeight(),
      //       //   domain: [0, 256],
      //       //   colorScale: "viridis",
      //       // });
      //       // plot.render();
      //       // let b64 = canvas.toDataURL("image/png");
      //       // let imageBounds = [[bbox[1], bbox[0]], [bbox[3], bbox[2]]];
      //       // L.imageOverlay(b64, imageBounds).addTo(this.mapCM);


      //       // const renderer = L.LeafletGeotiff.plotty({
      //       //   displayMin: 0,
      //       //   displayMax: 30,
      //       //   clampLow: false,
      //       //   clampHigh: true,
      //       //   colorScale: "rainbow",
      //       //   arrowSize: 20,
      //       // });
      //       // windSpeed = L.leafletGeotiff("E:\\WEB\\basins\\test\\xujs\\1450\\data_prepare\\spatial\\subBasin.tif", {
      //       //   band: 0,
      //       //   renderer: renderer,
      //       // }).addTo(this.mapCM);

      //     } else {
      //       this.$Message.error({
      //         content: '失败！',
      //         duration: 3,
      //       });
      //     }
      // })
      // .catch(e => {
      //   console.log(e)
      //   this.$Message.error('失败！！');
      // });
      // 调用运行接口后直接调用轮询接口，判断轮询接口返回值来保持前端和后端连接
      console.log("调用")
      var polling = new FormData();
      polling.append("projectname", this.formProjectItem.projectName);
      polling.append("username", sessionStorage.getItem('username'));
      polling.append('filepathandname',"subbasinfile/subbasin.shp") //子流域划分生成的最后一个文件是subbasinfile/subbasin.shp，以此作为子流域划分结束的标志

      // 测试大数据量长江子流域geosjon加载
      // request.post("/testChangjiangShp", polling)
      //   .then(res=>{
      //     console.log(res.data.errCode);
      //     if (res.data.errCode == 200) {
      //       // 添加图层
      //       this.runSubBasinLoading = false;
      //       this.completeRunSubBasin = true;
      //       this.$Message.success({
      //         content: '流域划分成功',
      //         duration: 3
      //       });

      //       console.log(res.data)
      //       console.log(res.data.data[0])

      //       // var arr = res.data.split("&&");
      //       // var tempGeoJSON = arr[0];
      //       // console.log(JSON.stringify(tempGeoJSON))
      //       // var tempGeoJSON2 = arr[1];
      //       //添加流域范围图层
      //       _this.addGeoJSONToMap('subBasinLayer', JSON.stringify(res.data.data[0]), "red");
      //       _this.addGeoJSONToMap('streamLayer', JSON.stringify(res.data.data[1]), "blue");

      //       //改图层组件中图层的状态
      //       this.$emit("changeLayerStatus", "subBasin", true)
      //       this.$emit("changeLayerStatus", "stream", true)

      //     }else if(res.data.errCode == 204){
      //       // 继续轮询
      //       console.log("继续轮询")
      //     }else {
      //       this.$Notice.success({
      //         title: "结果计算失败",
      //         duration: 10,
      //       });
      //       this.lisfloodModal = false;
      //     }
      //   })
      //   .catch(err=>{
      //     console.log(err);
      //     confirm('运行失败!');
      //     this.modelStatus = "over";
      //     this.lisfloodModal = false;
      //   });

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
              this.runSubBasinLoading = false;
              this.completeRunSubBasin = true;
              this.$Message.success({
                content: 'Delineate subbasin Successfully',
                duration: 3
              });

              // console.log(res.data)
              // console.log(res.data.data[0])

              // var arr = res.data.split("&&");
              // var tempGeoJSON = arr[0];
              // console.log(JSON.stringify(tempGeoJSON))
              // var tempGeoJSON2 = arr[1];
              //添加流域范围图层
              _this.addGeoJSONToMap('subBasinLayer', JSON.stringify(res.data.data[0]), "red");
              _this.addGeoJSONToMap('streamLayer', JSON.stringify(res.data.data[1]), "blue");

              //改图层组件中图层的状态
              this.$emit("changeLayerStatus", "subBasin", true)
              this.$emit("changeLayerStatus", "stream", true)

            }else if(res.data.errCode == 204){
              // 继续轮询
              // console.log("继续轮询")
            }else {
              this.$Notice.success({
                title: "结果计算失败",
                duration: 10,
              });
              this.lisfloodModal = false;
              // 清除定时器
              clearInterval(timer)
            }
          })
          .catch(err=>{
            console.log(err);
            confirm('运行失败!');
            this.modelStatus = "over";
            this.lisfloodModal = false;
            // 清除定时器
            clearInterval(timer)
          });
        }, 0);
      // 轮询时间间隔为20/1min/6s:1000 * 60 * 0.1
      }, 2000);

    },
    HLUDivision() {
      this.$emit("changeLayerStatus", "HLU", false)
      this.HLULayerGroup.clearLayers();


      let _this = this;
      this.HLUDivisionLoading = true;
      let params = new URLSearchParams();
      params.append("projectName", this.formProjectItem.projectName);
      params.append("username", sessionStorage.getItem('username'));
      params.append("handNum", this.HANDNum);
      params.append("threshold", this.threshold);

      //subareaType: 默认是子山坡单元 + HAND分带进行划分
      var subareaType = 1
      //指定subarea划分类型
      if (this.isSlopeSelect) {
        // 叠加坡向 + 土地利用(非冰川区) + 土壤 + 【冰川ID】
        subareaType = 2
      }
      else if (this.isSoilMapSelect) {
        // 叠加土壤 + 土地利用
        subareaType = 3
      }
      else if (this.isFieldSelect & this.isLanduseMapSelect) {
        // field + 土地利用
        subareaType = 4
      }
      else if (this.isFieldSelect & !this.isLanduseMapSelect) {
        // field
        subareaType = 5
      }
      else if (!this.isSoilMapSelect & this.isLanduseMapSelect & !this.isFieldSelect & !this.isSlopeSelect) {
        // 叠加土地利用
        subareaType = 6
      }
      else if (this.subareaType == "子山坡单元 + HAND分带") {
        subareaType = 1
      }
      console.log(subareaType)
      params.append("subareaType", subareaType);

      var landusetype = ""
      if (this.landuseMapSelect != "MODIS") landusetype = "2"
      else landusetype = "1"
      console.log(landusetype)
      params.append("landusetype", landusetype);

      var soiltypetype = ""
      if (this.soilMapSelect != "ChinaSoilType1km") soiltypetype = "2"
      else soiltypetype = "1"
      console.log(soiltypetype)
      params.append("soiltypetype", soiltypetype);

      request.post('/basins/HLUDivision', params)

      // request
      //   .post('/basins/HLUDivision', params)
      //   .then(res => {
      //     if (res.data != null) {
      //       this.HLUDivisionLoading = false;
      //       this.completeHLUDivision = true;

      //       this.$Message.success({
      //         content: 'HLU划分成功',
      //         duration: 3
      //       });
      //       console.log(res.data)
      //       //前端渲染：
      //       var tempGeoJSON = res.data;
      //       //添加流域范围图层
      //       _this.addGeoJSONToMap('HLULayer', JSON.stringify(tempGeoJSON), "red");

      //       //改图层组件中图层的状态
      //       this.$emit("changeLayerStatus", "HLU", true)

      //     } else {
      //       this.$Message.error({
      //         content: '失败！',
      //         duration: 3,
      //       });
      //     }
      //   })
      //   .catch(e => {
      //     console.log(e)
      //     this.$Message.error('失败！！');
      //   });

      //轮询
      console.log("调用")
      var polling = new FormData();
      polling.append("projectname", this.formProjectItem.projectName);
      polling.append("username", sessionStorage.getItem('username'));
      polling.append('filepathandname',"workspace/spatial_raster/soiltype.tif") //HRU划分生成的最后一个文件是 soiltype.tif，以此作为HRU划分结束的标志
      let timer = window.setInterval(() => {
        // setTimeout是自带清除定时器
        setTimeout( () =>{
          request.post("/Polling", polling)
          .then(res=>{
            // console.log(res.data.errCode);
            if (res.data.errCode == 200) {
              // 清除定时器
              clearInterval(timer)
              this.HLUDivisionLoading = false;
              this.completeHLUDivision = true;
              this.$Message.success({
                content: 'Subarea generation successfully',
                duration: 3
              });
              //添加图层。大流域暂时不添加
              console.log(res.data)
              //前端渲染：
              var tempGeoJSON = res.data.data;
              //添加流域范围图层
              _this.addGeoJSONToMap('HLULayer', JSON.stringify(tempGeoJSON), "red");
              //改图层组件中图层的状态
              this.$emit("changeLayerStatus", "HLU", true)

            }else if(res.data.errCode == 204){
              // 继续轮询
              // console.log("继续轮询")
            }else {
              this.$Notice.success({
                title: "结果计算失败",
                duration: 10,
              });
              this.lisfloodModal = false;
              // 清除定时器
              clearInterval(timer)
            }
          })
          .catch(err=>{
            console.log(err);
            confirm('运行失败!');
            this.modelStatus = "over";
            this.lisfloodModal = false;
            // 清除定时器
            clearInterval(timer)
          });
        }, 0);
      // 轮询时间间隔为1s.
      }, 1000);

    },
    locate(index) {
      var lat = this.subBasinOutlet[index].lat;
      var lon = this.subBasinOutlet[index].lon;
      this.mapCM.flyTo(new L.LatLng(lat, lon), 8)
    },
    remove(index) {
      this.subBasinOutlet.splice(index, 1);
      this.subBasinOutletLayerGroup.clearLayers();
      var arr = this.subBasinOutlet;
      for (var i = 0; i < arr.length; i++) {
        // console.log(arr[i]);
        var lat = arr[i].lat;
        var lon = arr[i].lon;
        //创建marker

        var layer = L.marker([lat, lon], {
          icon: new L.Icon({
            className: "rivermap-icon",
            iconUrl: require('../../assets/subBasinOutlet.png'),
            iconSize: [24, 24],
            iconAnchor: [12, 24],
          })
        }).addTo(this.subBasinOutletLayerGroup)//添加到图层
      }
    },
    outletok() {
      const username = sessionStorage.getItem('username');
      var lon = this.outletlon
      var lat = this.outletlat
      var baseUrl = "";
      baseUrl = "/basins/queryUpstreamBasinBound/" + "?lon=" + lon + "&lat=" + lat + "&projectName=" + this.formProjectItem.projectName + "&username=" + username + "&type=" + "1";
      //添加流域出口点图层
      this.addUpstreamClickPoint("basinOutlet", lon, lat)
      // this.spinShow = true
      this.$Spin.show({
        render: (h) => {
          return h('div', [
            h('Icon', {
              'class': 'demo-spin-icon-load',
              props: {
                type: 'ios-loading',
                size: 18
              }
            }),
            h('div', '正在获取流域范围')
          ])
        }
      });
      var _this = this
      request
        .get(baseUrl)
        .then(res => {
          if (res.data != 0) {
            //改图层组件中图层的状态
            this.$emit("changeLayerStatus", "basinbound", true)

            var tempGeoJSON = res.data;
            //添加流域范围图层
            _this.addGeoJSONToMap('basinLayer', JSON.stringify(tempGeoJSON), "red");

            _this.$Spin.hide();
            _this.basinScopeSelectSystem = true;
          }
          else {
            _this.$Message.error('No Basin Info Here.');
            // this.spinShow = false;
            _this.$Spin.hide();
          };
        })
        .catch(err => {
          confirm('Something Wrong!');
          _this.$Spin.hide();
        });
    },
    DEMselectChange(value) {
      console.log(value)
      if (value != "shujuji") {
        console.log("用户上传数据")
        // let _this = this;
        // let params = new URLSearchParams();
        // params.append("projectName", this.formProjectItem.projectName);
        // params.append("username", sessionStorage.getItem('username'));
        // request
        //   .post('/basins/HLUDivision', params)
        //   .then(res => {
        //     if (res.data != null) {
        //       this.HLUDivisionLoading = false;
        //       this.completeHLUDivision = true;

        //       this.$Message.success({
        //         content: 'HLU划分成功',
        //         duration: 3
        //       });
        //       console.log(res.data)
        //       //前端渲染：
        //       var tempGeoJSON = res.data;
        //       //添加流域范围图层
        //       _this.addGeoJSONToMap('HLULayer', JSON.stringify(tempGeoJSON), "red");

        //       //改图层组件中图层的状态
        //       this.$emit("changeLayerStatus", "HLU", true)

        //     } else {
        //       this.$Message.error({
        //         content: '失败！',
        //         duration: 3,
        //       });
        //     }
        //   })
        //   .catch(e => {
        //     console.log(e)
        //     this.$Message.error('失败！！');
        //   });
      }
    },
    inputSubbasinOutlet(response, file, fileList){
      this.subBasinOutlet = this.subBasinOutlet.concat(response)
      this.addPOIMarker();


    },
    addPOIMarker() {
      var arr = this.subBasinOutlet;
      for (var i = 0; i < arr.length; i++) {
          // console.log(arr[i]);
          var lat = arr[i].lat;
          var lon = arr[i].lon;
          this.addUpstreamClickPoint("subBasinOutlet", lon, lat)
      }
    },
  },
}
</script>

<style>
/* .ivu-divider-horizontal.ivu-divider-with-text-left{
      margin: 16px 0px 10px 0px;
  } */
.ivu-btn {
  padding: 0px 9px;
}

.ivu-tabs-nav-wrap {
  text-align: center;
}

.ivu-tabs-nav-scroll {
  display: table;
}

.upload {
  display: inline-block;
}

.selectFlex {
  margin: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.selectFlexBasin {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.finishBtn {
  display: flex;
  justify-content: center;
  margin-top: 0px;
  margin-left: 30px;
  margin-right: 30px;
  text-align: center;
}

.finishBtn>button {
  width: 90%;
}

.finishFont {
  color: #19be6b;
}

/* #streamValueForm .ivu-form-item {
    margin-bottom: 5px;
  } */
.leaflet-container.crosshair-cursor-enabled {
  cursor: crosshair;
}

.cross-cursor {
  cursor: crosshair !important;

}

.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
</style>