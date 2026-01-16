
const state = () => ({
  projectName: null,
  soilMapList: [
    {
      value: 'ChinaSoilType1km',
      label: 'HWSD v2.0'
    },
    // {
    //   value: 'ChinaSoilType1km',
    //   label: '中国土壤类型图'
    // },
    //{
    //  value: 'soil-2',
    //  label: 'soil-2'
    //},
  ],
  landuseMapList: [
    //{
    //  value: 'ESA_CCI_300m',
    //  label: 'ESA-CCI-300m'
    //},
    //{
    //  value: 'GLC',
    //  label: 'GLC'
    //},
    {
      value: 'MODIS',
      label: 'MODIS-500m'
    }
  ],
  fieldMapList: [
    //{
    //  value: 'ESA_CCI_300m',
    //  label: 'ESA-CCI-300m'
    //},
    //{
    //  value: 'GLC',
    //  label: 'GLC'
    //},
  ],
  overlayRangeList: [
    {
      value: 'all',
      label: 'All types'
    },
    {
      value: 'glacier',
      label: 'Glacier'
    },
    {
      value: 'exclusion_glacier',
      label: 'Except for glacier'
    },

  ],
  DEMList: [
    {
      value: 'shujuji',
      label: 'MERIT_DEM'
    },
  ],
  rainDataList: [
    {
      value: 'CMFD-pcp',
      label: 'CMFD'
    },
    //{
    //  value: 'rain-2',
    //  label: 'rain-2'
    //},
  ],
  meteoDataList: [
    {
      value: 'CMFD-meteo',
      label: 'CMFD'
    },
    //{
    //  value: 'meteo-2',
    //  label: 'meteo-2'
    //},
  ],
  observedDataList: [{
      value: 'AI',
      label: 'LSTM'
    },
  ],
  rainfallList: [],
  QList: [],
  dateList: [],
  //ai相关
  ai_rainfallList:[],
  ai_QList:[],
  ai_dateList:[],
  DOCList: [],
  POIList: [],
  POISelect: "",
  AttributeSelect: "",
})

const getters = {
  projectName: state => state.projectName,
  soilMapList: state => state.soilMapList,
  landuseMapList: state => state.landuseMapList,
  fieldMapList: state => state.fieldMapList,


  overlayRangeList: state => state.overlayRangeList,
  DEMList: state => state.DEMList,
  meteoDataList: state => state.meteoDataList,
  rainDataList: state => state.rainDataList,

  observedDataList: state => state.observedDataList,
  rainfallList: state => state.rainfallList,
  QList: state => state.QList,
  dateList: state => state.dateList,

  ai_rainfallList: state => state.ai_rainfallList,
  ai_QList: state => state.ai_QList,
  ai_dateList: state => state.ai_dateList,

  DOCList: state => state.DOCList,
  POIList: state => state.POIList,
  POISelect: state => state.POISelect,
  AttributeSelect: state => state.AttributeSelect,
}

const mutations = {
  SET_PROJECT_NAME(state, name) {
    state.projectName = name;
  },
  SET_SOIL_MAPLIST(state, name) {
    state.soilMapList = name;
  },
  SET_LANDUSE_MAPLIST(state, name) {
    state.landuseMapList = name;
  },
  SET_FIELD_MAPLIST(state, name) {
    state.fieldMapList = name;
  },



  SET_OVERLAYRANGE_LIST(state, name) {
    state.overlayRangeList = name;
  },
  SET_DEM_LIST(state, name) {
    state.DEMList = name;
  },
  SET_METEODATA_LIST(state, name) {
    state.meteoDataList = name;
  },
  SET_RAINDATA_LIST(state, name) {
    state.rainDataList = name;
  },
  SET_OBSERVEDDATA_LIST(state, name) {
    state.observedDataList = name;
  },
  SET_RAINFALL_LIST(state, name) {
    state.rainfallList = name;
  },
  SET_Q_LIST(state, name) {
    state.QList = name;
  },
  SET_DATE_LIST(state, name) {
    state.dateList = name;
  },
  // AI径流预测相关
  SET_AI_RAINFALL_LIST(state, name) {
    state.ai_rainfallList = name;
  },
  SET_AI_Q_LIST(state, name) {
    state.ai_QList = name;
  },
  SET_AI_DATE_LIST(state, name) {
    state.ai_dateList = name;
  },
  
  SET_DOC_LIST(state, name) {
    state.DOCList = name;
  },
  SET_POI_LIST(state, name) {
    state.POIList = name;
  },
  SET_POI_SELECT(state, name) {
    state.POISelect = name;
  },
  SET_ATTRIBUTE_SELECT(state, name) {
    state.AttributeSelect = name;
  },
}
const actions = {


}



export default {
  state,
  getters,
  actions,
  mutations,
  //     plugins: [createPersistedState({
  //         storage: window.sessionStorage,
  //         reducer(val) {
  //           return { // 只储存state中的
  //             storeMap: val.storeMap,

  //           }
  //         }
  //       })]
}