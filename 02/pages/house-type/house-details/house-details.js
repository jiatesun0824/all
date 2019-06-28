// pages/house-type/house-detail/house-detail.js
import regeneratorRuntime from '../../../utils/runtime.js';

const API = getApp().API;
let $App = getApp();
// 下拉条件方向图标
const conditionDownIcon = 'page_icon_down.png';
const conditionUpIcon = 'page_icon_up.png';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: '1200rpx',
    staticImageUrl: getApp().staticImageUrl,
    resourcePath: getApp().resourcePath,
    pageParams: {},
    selectSpaceName: '获取中...',
    selectTemplateId: '',
    wholeHousePicData: '',
    currentSpaceIndex: '',
    showWholeHouseBtn: true,
    wholeHouseSelectIcon: {
      active: false,
      icons: ['huxing_icon_all.png', 'home_msg_all.png']
    },
    showLargePic: false,
    recomType: [
      {
        name: '推荐方案',
        active: true
      },
      {
        name: '我的收藏',
        active: false
      }
    ],
    recomConditionTab: [
      {
        key: 'style',
        label: '装修风格'
      },
      {
        key: 'mode',
        label: '装修方式'

      },
      {
        key: 'price',
        label: '装修价格'
      }
    ].map(item => Object.assign(item, {
      active: false,
      directionIcon: [conditionDownIcon, conditionUpIcon]
    })),
    showWhichKey: '',
    showConditionContent: false,
    allSpaceAndStyleList: [],
    currentSpaceInStyleList: [],
    allModeAndPriceData: [],
    modeList: [],
    currentPriceList: [{
      name: '全部',
      value: '',
      active: true
    }],
    planList: [],
    showMask: false,
    showPutInLoading: false,
    showReplaceConfirm: false,
    showSelectAreaConfirm: false,
    showGuide: false,
    selectReplaceType: 2,
    selectAreaInfo: '',
    fullHousePlanId: '',
    mainTaskId: '',
    isOnShow: 0,
    pageSize: 10,
    salcePicMultiple: 1,
    salcePicMultipleTemp: 1,
    operatingInstructionShow: false, // 操作指南弹窗
    operatingInstructionFlagShow: false, // 操作指南回调判断
    operatingInstructionActive: 1,
    atPresentUuid: '', // 与720做交互时需要跳转到的uuid
    storageCaseItemHouseName: '客餐厅', // 缓存的方案
    isWacthMyPlan: false,
    showShade: false,
    showShade1: true,
    showShade2: false,
    showShade3: false,
    templateIds: '',
    spaceTypes: '',
    types: '',
    issBindingMobile: false,
    isFingerScale: false,
    sdId: '',
    id2:'',
    progress_txt: 0,
    count: 0, // 设置 计数器 初始为0
    countTimer: null, // 设置 定时器 初始为null,
    realnum:0,
    currentSpace:'',
    putTime:0,
    scrollId:'',
    loopFlag:false,
    specifyIndex: '',

    // 埋点数据
    previousPath: '',
    nowPath: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // rzd 随选网UI优化调整，去我的方案
  goPlan() {
    this.keepDecorate()
    setTimeout(() => {
      wx.navigateTo({ url: '/pages/mine/my-favorite-fitment/my-favorite-fitment' })
    }, 500)
  },
  paymentFun2() {
    let data = {
      planRecommendedId: this.data.planInfo.planRecommendedId || this.data.planInfo.designPlanRecommendId,
      useType: 0,
      buyType: 1,
      planType: this.data.planInfo.fullHousePlanUUID ? 0 : 1
    }
    let that = this;
    that.data.planInfo.havePurchased = 1;
    that.closeFunc()
    let obj = {};
    let casess = wx.getStorageSync('caseItem')
    casess.havePurchased = 1;
    wx.setStorage({
      key: 'caseItem',
      data: casess,
    })
    that.data.templateIds ? obj.templateId = that.data.templateIds : '';
    that.data.spaceTypes ? obj.spaceType = that.data.spaceTypes : '';
    that.data.types ? obj.type = that.data.types : '';
    that.putInHouse(obj);
  },
  onLoad: function (options) {
    // rzd 埋点 190214 start
    if(options.uuid){
      this.setData({
        atPresentUuid: options.uuid
      })
    }
    let page = getCurrentPages(), previousPath = page.length > 1 ? page[page.length - 2].route : '',
      nowPath = page[page.length - 1].route;
    this.setData({
      previousPath: previousPath,
      nowPath: nowPath
    })
    // rzd 埋点 190214 end
    if (options.specifyIndex){
      this.setData({
        specifyIndex: options.specifyIndex
      })
    }
    wx.hideShareMenu();
    new $App.newNav() // 注册快速导航组件
    new $App.bindingPhone()
    this.setData({ pageParams: options })
    this.showOperatingInstruction(options) // 是否显示操作指南
    if (options.sdId) {
      this.setData({ sdId: options.sdId })
    }
    this.setData({ windowHeight: wx.getSystemInfoSync().windowHeight})
  },
  showBIndingPhoneBox() {
    this.bindingPhoneShow()
  },
  bindPhoneCallBack() {
    this.setData({ showShade1: false, showShade3: true })
  },
  getIsBindingMobile() {
    // 检验手机号是否存在
    let url = `/v2/user/center/isUserMobileBinded`
    API.getIsBindingMobile().then(res => {
      if (res.message === '已绑定') { this.setData({ issBindingMobile: false }) } else { this.setData({ issBindingMobile: true }) }
    })
  },
  showOperatingInstruction(options) { // 是否显示操作指南
    if (options.type === 'search' || options.type === 'myPlan') {
      API.getIsShowSearchPopup().then(res => {
        if (res.obj.oneKeyDesign == '0') {
          this.setData({
            operatingInstructionShow: true,
            id2: res.obj.id
          })
        } else {
          this.setData({
            operatingInstructionShow: false,
            id2: res.obj.id
          })
        }
      })
    }
  },
  userKnowoperating() { // 用户清楚操作
    if (this.data.operatingInstructionActive < 3) {
      this.setData({ operatingInstructionActive: ++this.data.operatingInstructionActive })
    } else {
      API.getCloseSearchKnow({
        id: this.data.id2,
        oneKeyDesign: 1
      }).then(res => {
        if (res.status) { this.setData({ operatingInstructionShow: false }) }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /** 
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    this.setData({
      scrollId:'backTop'
    })
    if (this.data.isWacthMyPlan) {
      this.data.isWacthMyPlan = false
      return
    }
    this.setData({
      storageCaseItemHouseName: wx.getStorageSync('caseItem') ? wx.getStorageSync('caseItem').houseTypeName : '客餐厅'
    })
    
    if (this.data.isOnShow === 1) { // 是否是720返回
      this.setData({
        ['pageParams.mainTaskId']: this.data.mainTaskId,
        ['pageParams.fullHousePlanId']: this.data.fullHousePlanId,
        ['pageParams.type']: 'myPlan'
      })
    } else if (this.data.atPresentUuid) {
    }
    console.log(this.data.pageParams.type, 'swq')
    let handleList = {
      search: this.searchEntryHandle,
      plan: this.planEntryHandle,
      myPlan: this.myPlanEntryHandle
    }[this.data.pageParams.type]();
    let { obj } = await API.gethouseDetailsTypeList();
    this.setData({ allSpaceAndStyleList: obj })
    await this.queryWholeHousePic();
    await this.queryModeAndPrice();
    this.querySpaceAndStyle();
    this.coditionQuery();
    this.getIsBindingMobile()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.countTimer);
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorageSync('taskResIdObj');
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({ pageSize: this.data.pageSize + 5 });
    this.coditionQuery();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  catchTouchMove() { },
  /**
   * 业务逻辑
   */

  // 全屋图片及坐标
  async queryWholeHousePic() {
    let planInfo = wx.getStorageSync('caseItem');
    let firstNotRerderIndex;
    let selectedSpaceType;
    let selectedSpace;

    let { obj } = await API.queryWholeHousePic({ houseId: this.data.pageParams.houseId, fullHousePlanId: this.data.pageParams.fullHousePlanId || '' });
    if (this.data.pageParams.type === 'plan' && planInfo.spaceType === 13) {
      console.log("99999")
      obj.guideInfoList.forEach(item => Object.assign(item, { active: true }))
      this.data.wholeHouseSelectIcon.icons = ['home_msg_all.png', 'huxing_icon_all.png'];
    }
    else {
      console.log("88888")
      firstNotRerderIndex = this.data.atPresentUuid ? obj.guideInfoList.findIndex(item => this.data.atPresentUuid === item.uniqueId) : obj.guideInfoList.findIndex(item => !item.renderStatus)
      selectedSpaceType = obj.guideInfoList.length && obj.guideInfoList[firstNotRerderIndex > -1 ? firstNotRerderIndex : 0];
      selectedSpace = this.data.allSpaceAndStyleList.filter(item => item.houseType === selectedSpaceType['spaceType']);
      obj.guideInfoList.length && obj.guideInfoList.forEach((item, index) => {
        if (firstNotRerderIndex > -1) {
          Object.assign(item, { active: index === firstNotRerderIndex });
          return;
        }
        Object.assign(item, { active: !index })
      });
      console.log()
    }

    let currentReplaceList = selectedSpaceType['renderStatus'] == 1 && obj.taskStates ? obj.taskStates.filter(item => item.templateId === selectedSpaceType['designTempletId']) : [];

    this.setData(this.data.pageParams.type === 'plan' && planInfo.spaceType === 13 ? {
      selectTemplateId: '',
      // pageParams: Object.assign(this.data.pageParams, { templateId: '' }),
      currentSpaceIndex: 0,
      selectSpaceName: '全屋',
      showWholeHouseBtn: !obj.guideInfoList.some(item => item.renderStatus),
      wholeHousePicData: obj,
      wholeHouseSelectIcon: this.data.wholeHouseSelectIcon
    } : {
        selectTemplateId: selectedSpaceType['designTempletId'],
        pageParams: Object.assign(this.data.pageParams, currentReplaceList.length ? {
          preRenderSceneId: currentReplaceList[0]['businessId']
        } : { preRenderSceneId: this.data.pageParams.preRenderSceneId ? this.data.pageParams.preRenderSceneId : '' }),
        currentSpaceIndex: firstNotRerderIndex > -1 ? firstNotRerderIndex : 0,
        selectSpaceName: selectedSpace.length ? selectedSpace[0]['houseName'] : '暂无',
        showWholeHouseBtn: !obj.guideInfoList.some(item => item.renderStatus),
        wholeHousePicData: obj,
       
      });
      this.setData({
        currentSpace: this.data.wholeHousePicData.guideInfoList[this.data.currentSpaceIndex].renderStatus
      })
    if (this.data.currentSpace == 2 && !this.data.loopFlag) {
      this.setData({
        loopFlag:true
      })
      this.getCurrentSpaceState();
    }
    if (firstNotRerderIndex==-1){
      let specifySpaceId;
      let data = this.data.wholeHousePicData;
      let spaceList=[];
      let index;
      if (this.data.specifyIndex!=''){//多空间选择
        index = Number(this.data.specifyIndex)
      }else if(this.data.isOnShow==1){
        index = wx.getStorageSync('specifyIndex')
      }else{
        specifySpaceId = wx.getStorageSync('specifyId');
      for (let i = 0; i < data.guideInfoList.length; i++) {
        if (data.guideInfoList[i].spaceType == specifySpaceId) {
          spaceList.push(i)
        }
      }
      index=spaceList[0]
      }
      let e = {
        index: index || 0,
        large: 0,
        enter: 'manual'
      }
      console.log(e,'eeeeeeeeeeeee')
      this.selectSpace(e)
    }
  },
  // 全屋按钮事件
  selectWholeHouse(e) {
    
    let isSelected = this.data.wholeHouseSelectIcon.active;
    let isLarge = !!Number(e.currentTarget.dataset.large);
    let selectedSpaceType = this.data.wholeHousePicData.guideInfoList[this.data.currentSpaceIndex];
    let selectedSpace = this.data.allSpaceAndStyleList.filter(item => item.houseType === selectedSpaceType['spaceType']);
    let allSpaceAndStyleList = []
    this.data.wholeHousePicData.guideInfoList.forEach((item, index) => {
      if (isSelected) {
        Object.assign(item, { active: index === this.data.currentSpaceIndex });
        return;
      }
      Object.assign(item, { active: true })
    });
    if (isSelected) {
      this.selectSpace({ currentTarget: { dataset: { index: this.data.currentSpaceIndex, large: e.currentTarget.dataset.large } } })
    } else {
      let styleList = this.data.allSpaceAndStyleList.find((n) => n.houseName === '全屋').designPlanStyleVoList
      styleList.unshift({ styleCode: '', styleName: '不限', active: true })
      this.setData({
        currentSpaceInStyleList: styleList.map((item, index) => Object.assign(item, { active: !index })),
        wholeHouseSelectIcon: { active: !this.data.wholeHouseSelectIcon.active, icons: this.data.wholeHouseSelectIcon.icons.reverse() }
      })
    }
    this.setData({
      selectTemplateId: !isSelected ? '' : selectedSpaceType['designTempletId'],
      // pageParams: Object.assign(this.data.pageParams, { templateId: !isSelected ? '' : selectedSpaceType['designTempletId'] }),
      selectSpaceName: isSelected ? selectedSpace.length ? selectedSpace[0]['houseName'] : '暂无' : '全屋',
      wholeHousePicData: this.data.wholeHousePicData,
      salcePicMultiple: 1
    });

    isLarge && this.showAndCloseMask();

    this.coditionQuery();
  },
  // 选中空间事件
  selectSpace(e) {
    $App.sellingPoint(API, 'selectSpace', this.data.nowPath, this.data.previousPath, '一键装修');
    if(e.enter == 'manual' && e.index == undefined){
      return;
    }
    let index = e.enter == 'manual' ?e.index : e.currentTarget.dataset.index
    let isLarge = e.enter == 'manual' ? !!Number(e.large) : !!Number(e.currentTarget.dataset.large)

    let currentData = this.data.wholeHousePicData.guideInfoList[index]

    let [selectedSpace] = this.data.allSpaceAndStyleList.filter(item => item.houseType === currentData.spaceType)
    this.data.wholeHousePicData.guideInfoList.forEach((item, i) => { Object.assign(item, { active: index === i }) })
    let styleList = []
    if (!selectedSpace) { styleList = [{ styleCode: '', styleName: '不限', active: true }] }
    else {
      styleList = selectedSpace.designPlanStyleVoList;
      styleList.findIndex(item => !item.styleCode) < 0 && styleList.unshift({ styleCode: '', styleName: '不限', active: true });
    }

    let allModeList = this.data.allModeAndPriceData.map(item => Object.assign({}, { name: item.name, value: item.value, valueKey: item.valueKey, active: false }));
    allModeList.unshift({ name: '全部', value: '', active: true });

    let currentReplaceList = this.data.wholeHousePicData.taskStates && this.data.wholeHousePicData.taskStates.filter(item => item.templateId === currentData['designTempletId'])[0];
    let currentSpace = currentData.renderStatus ;//选中空间下面的状态模块
    if (currentSpace == 2 && !this.data.loopFlag) {
      this.setData({
        loopFlag:true
      })
      this.getCurrentSpaceState();
    }
    this.setData({
      currentSpaceIndex: index,
      selectTemplateId: currentData['designTempletId'],
      pageParams: Object.assign(this.data.pageParams, {
        preRenderSceneId: currentReplaceList ? currentReplaceList['businessId'] : '',
      }),
      currentSpace: currentSpace,
      
      selectSpaceName: selectedSpace ? selectedSpace.houseName : '暂无',
      wholeHousePicData: this.data.wholeHousePicData,
      wholeHouseSelectIcon: { active: false, icons: ['huxing_icon_all.png', 'home_msg_all.png'] },
      currentSpaceInStyleList: styleList.map((item, index) => Object.assign(item, { active: !index })),
      modeList: allModeList,
      currentPriceList: [{
        name: '全部',
        value: '',
        active: true
      }],
      showConditionContent: false,
      recomConditionTab: this.data.recomConditionTab.map(item => Object.assign(item, { active: false, directionIcon: [conditionDownIcon, conditionUpIcon] }))
    });
    wx.setStorageSync('specifyIndex',index)
    isLarge && this.showAndCloseMask();

    this.coditionQuery();
  },
  // 切换推荐或者收藏
  switchType(e) {
    let currentAreaData = this.data.wholeHousePicData.guideInfoList[this.data.currentSpaceIndex];
    let styleList = (this.data.allSpaceAndStyleList.filter(item => item.houseType === currentAreaData && currentAreaData.spaceType || 3))[0]['designPlanStyleVoList'];
    styleList.findIndex(item => !item.styleCode) < 0 && styleList.unshift({ styleCode: '', styleName: '不限', active: true });

    let allModeList = this.data.allModeAndPriceData.map(item => Object.assign({}, { name: item.name, value: item.value, valueKey: item.valueKey, active: false }));
    allModeList.unshift({ name: '全部', value: '', active: true });

    this.setData({
      pageSize: 10,
      showConditionContent: false,
      recomType: this.data.recomType.map((item, index) => Object.assign(item, { active: index === e.currentTarget.dataset.index })),
      recomConditionTab: this.data.recomConditionTab.map(item => Object.assign(item, { active: false, directionIcon: [conditionDownIcon, conditionUpIcon] })),
      currentSpaceInStyleList: styleList.map((item, index) => Object.assign(item, { active: !index })),
      modeList: allModeList,
      currentPriceList: [{
        name: '全部',
        value: '',
        active: true
      }]
    });

    this.coditionQuery();
    if (e.currentTarget.dataset.index == 1) {
      $App.sellingPoint(API, 'housedetailcollect', this.data.nowPath, this.data.previousPath, '一键装修');
    }
  },
  // 显示条件筛选
  showCoditionPannel(e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      recomConditionTab: this.data.recomConditionTab.map((item, i) => {
        let isSelected = i === index;
        return Object.assign(item, {
          active: isSelected && !item.active,
          directionIcon: (item.active || isSelected) ? item.directionIcon.reverse() : item.directionIcon
        })
      })
    });

    this.setData({
      showWhichKey: this.data.recomConditionTab[index].active ? this.data.recomConditionTab[index].key : '',
      showConditionContent: !this.data.showConditionContent && this.data.recomConditionTab.some(item => item.active)
    })
  },
  // 关闭筛选条件pannel回调
  closePannel(e) {
    if (!this.data.showConditionContent) {
      this.setData({
        showConditionContent: this.data.recomConditionTab.some(item => item.active)
      })
    }
  },
  // 查询空间及类型
  async querySpaceAndStyle() {
    let currentAreaData = this.data.wholeHousePicData.guideInfoList[this.data.currentSpaceIndex];
    let styleList = (this.data.allSpaceAndStyleList.filter(item => item.houseType === currentAreaData.spaceType))[0]['designPlanStyleVoList'];
    styleList.unshift({ styleCode: '', styleName: '不限', active: true });
    this.setData({
      currentSpaceInStyleList: styleList
    });
  },
  // 查询装修方式和价格
  async queryModeAndPrice() {
    let { list } = await API.getFitmentQuote();
    let allModeList = list.map(item => Object.assign({}, { name: item.name, value: item.value, valueKey: item.valueKey, active: false }));
    allModeList.unshift({ name: '全部', value: '', active: true });
    this.setData({
      allModeAndPriceData: list,
      modeList: allModeList
    });
  },
  // 选择筛选条件查询
  selectConditionItem(e) {
    let index = e.currentTarget.dataset.index;
    let tabIndex = this.data.recomConditionTab.findIndex(item => item.active);
    let data = [this.data.currentSpaceInStyleList, this.data.modeList, this.data.currentPriceList][tabIndex];

    data.forEach((item, i) => Object.assign(item, { active: index === i }));

    if (tabIndex === 1) {
      let priceList = index ? [{ name: '全部', value: '', active: true }].concat(this.data.allModeAndPriceData[index - 1]['sonList'].map((item, i) => ({ name: item.name, value: item.value, active: false }))) : [{ name: '全部', value: '', active: true }];
      this.data.currentPriceList = priceList;
    }

    this.setData({
      pageSize: 10,
      showConditionContent: false,
      recomConditionTab: this.data.recomConditionTab.map(item => Object.assign(item, { active: false, directionIcon: [conditionDownIcon, conditionUpIcon] })),
      currentSpaceInStyleList: this.data.currentSpaceInStyleList,
      modeList: this.data.modeList,
      currentPriceList: this.data.currentPriceList
    });

    this.coditionQuery();
  },
  // 根据当前选中推荐方案和收藏选择
  coditionQuery() {
    let index = this.data.recomType.findIndex(item => item.active);
    [this.queryRecommandPlan, this.queryCollectPlan][index]();
  },
  // 查询推荐方案
  async queryRecommandPlan() {
    let selectedSpace = this.data.wholeHousePicData.guideInfoList[this.data.currentSpaceIndex];
    let isFullHouse = this.data.wholeHousePicData.guideInfoList.every(item => item.active);
    let [currentStyle] = this.data.currentSpaceInStyleList.filter(item => item.active);
    let [modeType] = this.data.modeList.filter(item => item.active);
    let [priceRange] = this.data.currentPriceList.filter(item => item.active);
    let pageVo = {
      start: 1,
      pageSize: this.data.pageSize,
    }
    let recommendationPlanSearchVo = {
      houseType: isFullHouse ? 13 : (selectedSpace.spaceType || selectedSpace.spaceFunctionId),
      designStyleId: currentStyle.styleCode,
      spaceArea: isFullHouse ? '' : selectedSpace && selectedSpace.spaceArea,
      displayType: 'decorate',
      decoratePriceType: modeType && modeType.value,
      decoratePriceRange: priceRange.value,
      platformCode: 'selectDecoration'
    }
    let parms = {
      "recommendationPlanSearchVo": recommendationPlanSearchVo,
      "pageVo": pageVo
    }
    let { datalist } = await API.getNewRecommendCaseList(parms);

    this.setData({ planList: datalist });
  },
  // 查询收藏方案
  async queryCollectPlan() {
    let selectedSpace = this.data.wholeHousePicData.guideInfoList[this.data.currentSpaceIndex];
    let [currentStyle] = this.data.currentSpaceInStyleList.filter(item => item.active);
    let isFullHouse = this.data.wholeHousePicData.guideInfoList.every(item => item.active);
    let datas = {
      "recommendationPlanSearchVo": {
        "houseType": isFullHouse ? 13 : selectedSpace.spaceType,
        "spaceArea": isFullHouse ? '' : selectedSpace && selectedSpace.spaceArea,
        "designStyleId": currentStyle && currentStyle.styleCode,
        'enterType': 'decorate'
      },
      "pageVo": {
        "start": 0,
        "pageSize": this.data.pageSize
      }
    }
    let { datalist } = await API.getDesignplanfavorite(datas);

    this.setData({ planList: datalist });
  },
  // 显示隐藏放大方案图选择空间
  showAndCloseMask() {
    
    let flag = false;
    if (this.data.showLargePic == true) {
      if (this.data.currentSpace == 2) {
        flag = true
      }
    }
    this.setData({
      showLargePic: !this.data.showLargePic
    });
  },
  searchEntryHandle() {
  },
  planEntryHandle() {
    switch (this.data.pageParams.matchState) {
      case 3:
      case '3':
        this.putInHouse();
        break;
      case 4:
      case '4':
        setTimeout(() => {
          this.setData({
            showMask: true,
            showReplaceConfirm: true
          });
        }, 250);
        break;
      case 5:
      case '5':
        if (!this.data.pageParams.mainTaskId) {
          let selectAreaInfo = wx.getStorageSync('matchData')['houseGuidePicInfo'];
          selectAreaInfo.guideInfoList.forEach((item, index) => {
            Object.assign(item, { active: !index });
          })
          setTimeout(() => {
            this.setData({
              showMask: true,
              showSelectAreaConfirm: true,
              selectAreaInfo: selectAreaInfo
            });
          }, 250);
          return;
        }
        setTimeout(() => {
          this.setData({
            showMask: true,
            showReplaceConfirm: true
          });
        }, 250);
        break;
    }
  },
  myPlanEntryHandle() {
  },
  /**
   * "houseId": 413485,
   * "operationSource": 1, // 1 方案进 0 我的进
   * "planHouseType": 3,
   * "planRecommendedId": 293555,
   * "renderTaskType": "panorama_render",
   * "taskSource": 1, // 0 C端
   * "taskType": 1,  // 0 自动渲染 1 产品替换
   * "totalFee": 10,
   * "fullHousePlanAction": 2,  // 1 第一次渲染 2 替换旧方案且不产生新的全屋方案 3 替换旧方案并且产生新的全屋方案
   * "templateId": 392023,
   * "groupPrimaryId": 0,
   * "houseGuidePicInfoId": 529,
   * "designTempletId": 392023,
   * "spaceFunctionId": 4,
   * "fullHousePlanId": 274,
   * "taskId": 52396,
   * "preRenderSceneId": 47560
   *  bizType
   */
  getScore: function () {
    API.getUserDuBiMessage().then((res) => {
      if (res.status) {
        this.setData({ score: parseInt(res.obj.balanceIntegral) })
      } else {
        wx.showToast({ title: '获取度币信息失败', icon: 'none', duration: 3000 })
      }
    })
  },
  paymentFun() {
    let data = {
      planRecommendedId: this.data.planInfo.planRecommendedId || this.data.planInfo.designPlanRecommendId,
      useType: 0,
      buyType: 1,
      planType: this.data.planInfo.fullHousePlanUUID ? 0 : 1
    }
    let that = this;
    API.getPayment(data).then(res => {
      if (res.obj.flag) {
        that.data.planInfo.havePurchased = 1;
        that.closeFunc();
        wx.showToast({
          title: '充值成功',
          icon: 'success'
        })
        let obj = {};
        let casess = wx.getStorageSync('caseItem')
        casess.havePurchased = 1;
        wx.setStorage({
          key: 'caseItem',
          data: casess,
        })
        that.data.templateIds ? obj.templateId = that.data.templateIds : '';
        that.data.spaceTypes ? obj.spaceType = that.data.spaceTypes : '';
        that.data.types ? obj.type = that.data.types : '';
        that.putInHouse(obj);
      } else {
        that.setData({
          showShade2: true,
          showShade1: false,
          showShade3: false
        })
      }
    })
  },
  closeFunc() {
    this.setData({
      showShade: false,
      showSelectAreaConfirm: false,
      operatingInstructionShow: false,
      showMask: false,
    })
  },
  toFunc() {
    wx.navigateTo({
      url: '/pages/buy-points/buy-points',
    })
  },
  async putInHouse(obj) {
    let objs = obj ? obj : { templateId: '', spaceType: '' };
    let planInfo = this.data.planInfo
    if (!planInfo) {
      planInfo = wx.getStorageSync('caseItem');
      this.setData({ planInfo: planInfo })
    }
    objs.templateId ? this.data.templateIds = objs.templateId : '';
    objs.spaceType ? this.data.spaceTypes = objs.spaceType : '';
    objs.type ? this.data.types = objs.type : '';
    this.getScore();
    let item = wx.getStorageSync('matchData');
    if (this.data.planInfo.copyRightPermission == 1 && (!this.data.planInfo.havePurchased || this.data.planInfo.havePurchased == 0)) {
      this.setData({
        showShade: true,
        showSelectAreaConfirm: false,
      })
    } else {
      let data = {
        taskSource: 0,
        taskType: 0,
        operationSource: 1,
        totalFee: 0,
        planHouseType: 3,
        fullHousePlanAction: objs.type ? objs.type : 1,
        renderTaskType: 'panorama_render', // only 720
        groupPrimaryId: planInfo.groupPrimaryId,
        houseId: this.data.pageParams.houseId,
        planRecommendedId: planInfo.designPlanRecommendId || planInfo.planRecommendedId,
        fullHousePlanId: this.data.pageParams.fullHousePlanId,
        taskId: objs.type == 3 ? '' : this.data.pageParams.mainTaskId,
        preRenderSceneId: this.data.pageParams.preRenderSceneId
      }

      if (!objs.templateId) {
        Object.assign(data, {
          templateId: item.templateId,
          designTempletId: item.templateId,
          spaceFunctionId: planInfo.spaceType || planInfo.spaceFunctionId
        }, this.data.pageParams.matchState == 3 && this.data.pageParams.fullHousePlanId ? {
          fullHousePlanAction: 2
        } : {}, planInfo.spaceType == 13 || planInfo.spaceFunctionId == 13 ? {
          fullHousePlanAction: 1,
          bizType: 2
        } : {})
      } else {
        Object.assign(data, {
          templateId: objs.templateId,
          designTempletId: objs.templateId,
          spaceFunctionId: objs.spaceType
        }, objs.spaceType == 13 ? {
          bizType: 2
        } : {}, this.data.pageParams.matchState == 5 && (this.data.pageParams.mainTaskId && item.taskStateList.length > 0) ? {
          preRenderSceneId: item.taskStateList.filter(item => item.templateId === objs.templateId)[0]['businessId']
        } : {})
      }
      let {
        success,
        obj,
        message
      } = await API.addRenderTask(data);
      if (success) {
        if (objs.templateId) {
          this.spaceCancel();
          wx.hideLoading();

          if (objs.type) {
            this.setData({
              showMask: false,
              showReplaceConfirm: false
            })
          }
        }
        this.setData({
          showMask: true,
          // showPutInLoading: true,
          fullHousePlanId: obj.fullHousePlanId,
          mainTaskId: obj.mainTaskId
        });
        this.submitInfo(this.data.planInfo);
        //if (wx.getStorageSync('isExperience') == 1) {
        this.isExperience();//是否体验720 砍价活动 
        // }
        wx.setStorage({
          key: 'taskResIdObj',
          data: Object.assign(obj, data),
        });
        let specifyIndex = wx.getStorageSync("specifyIndex")
        this.keepDecorate(specifyIndex);
      }
      // if (message === '户型不足,请购买户型!') {
      //   console.log(message);
      //   return;
      //   wx.showModal({
      //     title: '提示',
      //     content: '户型数量已用完，购买更多？',
      //     confirmText: '去购买',
      //     cancelText: '暂不考虑',
      //     cancelColor: '#999999',
      //     confirmColor: '#ff6419',
      //     success: (res) => {
      //       res.confirm ? wx.navigateTo({
      //         url: '/pages/purchase-house/purchase-house'
      //       }) : null
      //     }
      //   })
      // }
    }

  },
  isExperience() {
    let self = this;
    return
    wx.getStorage({
      key: 'actId',
      success: function (res) {
        API.cutPriceByDecorate({ houseId: self.data.pageParams.houseId, houseName: decodeURIComponent(self.data.pageParams.houseName), actId: res.data, formId: '', forwardPage: '' }).then(res => {
          if (res.success) {
            wx.setStorageSync('cutPrice', res.obj)
          }
        })
      },
    })
  },
  selectArea(e) {
    let index = e.currentTarget.dataset.index;
    this.data.selectAreaInfo.guideInfoList.forEach((item, i) => {
      Object.assign(item, { active: index === i })
    });
    this.setData({
      selectAreaInfo: this.data.selectAreaInfo
    });
    let data = this.data.wholeHousePicData;
    let specifyIndex;
    for(let i=0;i<data.guideInfoList.length;i++){
      if (this.data.selectAreaInfo.guideInfoList[index].designTempletId == data.guideInfoList[i].designTempletId){
        specifyIndex=i
      }
    }
    wx.setStorageSync('specifyIndex', specifyIndex)
  },
  spaceCancel() {
    this.setData({
      showMask: false,
      showSelectAreaConfirm: false
    });
  },
  spaceRender() {
    let { designTempletId, spaceType } = this.data.selectAreaInfo.guideInfoList.filter(item => item.active)[0];
    let obj1 = {
      templateId: designTempletId,
      spaceType: spaceType,
    }
    this.data.pageParams.mainTaskId ? obj1.type = this.data.selectReplaceType : ''
    this.putInHouse(obj1)
    wx.showLoading({ title: '处理中...' });
  },
  replacePlanOrMakeNewPlan(e) {
    this.setData({ showReplaceConfirm: false, showMask: false })
    let planInfo = wx.getStorageSync('caseItem');
    this.setData({
      planInfo: planInfo
    })
    let that = this;
    let type = e.currentTarget.dataset.type;
    if (this.data.pageParams.mainTaskId && this.data.pageParams.matchState == 5) {
      let selectAreaInfo = wx.getStorageSync('matchData')['houseGuidePicInfo'];

      selectAreaInfo.guideInfoList.forEach((item, index) => {
        Object.assign(item, { active: !index });
      })
      setTimeout(() => {
        that.setData({
          selectReplaceType: type,
          showReplaceConfirm: false,
          showSelectAreaConfirm: true,
          selectAreaInfo: selectAreaInfo,
          showMask: true
        });
      }, 250);
      return;
    }
    let objjj = {
      templateId: this.data.pageParams.templateId,
      spaceType: planInfo.spaceFunctionId,
      type: type
    }
    this.putInHouse(objjj);
  },
  keepDecorate(e) {
    if(e!=''){
      wx.redirectTo({
        url: '/pages/house-type/house-details/house-details?type=myPlan&houseId=' + this.data.pageParams.houseId + '&fullHousePlanId=' + this.data.fullHousePlanId + '&mainTaskId=' + this.data.mainTaskId +'&specifyIndex='+e
      })
    }else{
    wx.redirectTo({
      url: '/pages/house-type/house-details/house-details?type=myPlan&houseId=' + this.data.pageParams.houseId + '&fullHousePlanId=' + this.data.fullHousePlanId + '&mainTaskId=' + this.data.mainTaskId
    })
    }
  },
  async formToThreeD(e) {
    $App.sellingPoint(API, 'checkXiaoGuo', this.data.nowPath, this.data.previousPath, '一键装修');
    let uid = this.data.wholeHousePicData.guideInfoList[this.data.currentSpaceIndex].uniqueId
    if (!this.data.pageParams.fullHousePlanId) {
      wx.showModal({
        title: '提示',
        content: '您还没有装修完成的效果图，无法预览！'
      });
      return;
    }
    // let $App = getApp();
    let planInfo = wx.getStorageSync('caseItem');
    let { obj } = await API.queryWholeHouseUUID({ fullHousePlanId: this.data.pageParams.fullHousePlanId });
    
    if (obj.vrResourceUuid) {
      console.log(this.data.mainTaskId,'1', this.data.pageParams.mainTaskId, 'swq')
      let params = {
        uuid: obj.vrResourceUuid,
        houseId: this.data.pageParams.houseId,
        token: wx.getStorageSync('token'),
        platformCode: 'brand2c',
        operationSource: 0,
        routerQueryType: 'seven',
        customReferer: $App.wxUrl,
        platformNewCode: 'miniProgram',
        isRender: 3,
        formId: e.detail.formId,
        renderState: obj.renderState,
        planId: this.data.pageParams.fullHousePlanId,
        sdId: this.data.sdId,
        sxwUid:uid,
        mainTaskId: this.data.mainTaskId || this.data.pageParams.mainTaskId
      }
      let url = $App.wholeHouse3dUrl + Object.keys(params).map(item => `${item}=${params[item]}`).join('&');
      getApp().data.webUrl = url;
      wx.navigateTo({ url: '/pages/web-720/web-720' });
    } else {
      wx.showModal({
        title: '提示',
        content: '您还没有装修完成的效果图，无法预览！'
      });
    }
  },
  scaleValue(e) {
    if (this.data.isFingerScale) {
      this.data.salcePicMultipleTemp = e.detail.scale;
    }
  },
  clickScaleValue(e) {
    if (e.currentTarget.dataset.type == 1) {
      this.setData({
        salcePicMultiple: this.data.salcePicMultiple >= 2 ? 2 : Number((this.data.salcePicMultiple + 0.2).toFixed(1))
      })
    }
    else {
      this.setData({
        salcePicMultiple: this.data.salcePicMultiple <= 0.5 ? 0.5 : Number((this.data.salcePicMultiple - 0.2).toFixed(1))
      })
    }
  },
  picTouchStart(e) {
    this.setData({
      isFingerScale: true
    });
  },
  picTouchEnd(e) {
    this.setData({
      salcePicMultiple: this.data.salcePicMultipleTemp
    });

    setTimeout(() => {
      this.setData({
        isFingerScale: false
      })
    })
  },
  showAndHideGuide() {
   
    let flag = false;
    if (this.data.showMask == true || this.data.showGuide == true){
      if (this.data.currentSpace == 2){
        flag = true
      }
    }
    this.setData({
      showMask: !this.data.showMask,
      showGuide: !this.data.showGuide
    }) 
  },
  backpage() {
    wx.navigateBack()
  },
  submitInfo(e) { // 模板消息接口调用
    API.saveUserRenderFormId({
      designPlanId: e.planRecommendedId || e.designPlanRecommendId,//方案id
      formId: e.formId,//表单ID
      forwardPage: 'pages/home/home?navToUrl=/pages/mine/my-favorite-fitment/my-favorite-fitment',//跳转页
      renderType: 0,
      renderLevel: 4 //渲染级别：1，照片；4：720；6，视频；8，720
    }).then(res => {
    })
  },
 
  scroll() {
    this.setData({ scrollId: 'planList' })    
    $App.sellingPoint(API, 'designNow', this.data.nowPath, this.data.previousPath, '一键装修');
  },
  getCurrentSpaceState(){
    
    this.countTimer = setInterval(() => {
      var flag = false;
      
      API.queryWholeHousePic({ houseId: this.data.pageParams.houseId, fullHousePlanId: this.data.pageParams.fullHousePlanId || '' }, 'noLoading').then(res => {
        for (let i = 0; i < res.obj.guideInfoList.length; i++) {
          if (res.obj.guideInfoList[i].renderStatus == 2) {
            flag = true
          }
        }
        if (flag) {

        } else {
          this.setData({
            wholeHousePicData: res.obj,
            loopFlag:false
          })
          
          let data = this.data.wholeHousePicData;
          data.guideInfoList[this.data.currentSpaceIndex].active = true
          this.setData({
            currentSpace: this.data.wholeHousePicData.guideInfoList[this.data.currentSpaceIndex].renderStatus,
            wholeHousePicData:data
          })
          clearInterval(this.countTimer);
        } 
      });
      
    }, 10000)
  },
})