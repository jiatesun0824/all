import {
  resourcePath,
  defaultImg
} from '../../../utils/config.js';
import {
  emptyTemplate
} from '../../../component/emptyTemplate/emptyTemplate'
import {
  pinyin
} from '../../../utils/pinyin.js'
let $App = getApp(),
  API = getApp().API;
let myForEach = $App.myForEach
Page({
  emptyTemplate, // 无数据组件
  /**
   * 页面的初始数据
   */
  data: {
    staticImageUrl: $App.staticImageUrl,
    swiperCurrent: '',
    defaultImg: defaultImg,
    condition: false,
    imgURL: getApp().data.imgURL,
    resourcePath: resourcePath,
    isShowCitys: false,
    isCitySlideTop: true,
    isCitySlideDown: false,
    bannerAutoPlay: true,
    isShowClassify: false,
    isClassifySlideDown: false,
    messTxt: false,
    sortFlag2: false,
    sortFlag3: false,
    sortFlag4: false,
    sortName2: '风格',
    sortName3: '费用',
    minValue: '',
    maxValue: '',
    sortName4: '方式',
    optionsType: '',
    isClassifySlideTop: true, //Top开始都是true down都是false
    currClassify: {
      id: "",
      name: "全部"
    }, //当前分类的内容 默认是全部
    recommendTitle: "设计师",
    brandType: "3", //3设计师 5装修公司 6施工单位 2建材家居默认是设计师, 
    priceType: 3,
    pageNo: 1, //请求数据的页码
    currCity: {},
    keyword: "",
    popularList: [],
    sortFlag: false,
    showTopView: true,
    showNoMore: false,
    sortType: 'hottest',
    sortType2: 'all',
    decorationType: '',
    sortName: '最热',
    pageSize: 10,
    areaCode:0,
    classifyList: [{
        name: "全部",
        id: ""
      },
      {
        name: "现代简约1",
        id: "1"
      },
      {
        name: "现代简约2",
        id: "2"
      },
      {
        name: "现代简约3",
        id: "3"
      },
      {
        name: "现代简约4",
        id: "4"
      },
      {
        name: "现代简约5",
        id: "5"
      }
    ],
    materialClassify: [{
      "id": 4000,
      "childs": [{
          "id": 4001,
          "name": "大家电",
          "pid": 4000,
          "level": 2
        },
        {
          "id": 4007,
          "name": "厨房电器",
          "pid": 4000,
          "level": 2
        },
        {
          "id": 4015,
          "name": "小家电",
          "pid": 4000,
          "level": 2
        }
      ],
      "name": "电器",
      "pid": 1,
      "level": 1
    }],
    styleName: [],
    sortFlag2Index: 0,
    sortFlag3Index: 0,
    serviceCitys: [],
    exampleList: [],
    cityData: [],
    provinces: [],
    province: "",
    citys: [],
    city: '全部',
    countys: [],
    county: '',
    value: [0, 0, 0],
    threeLevelValue: [0, 0, 0],
    cityCode: '',
    shareOptions: {},
    fixed: false,
    cityObj: {},
    showCityView: false,
    choosex: 0,
    lastX: 0,
    choosey: 0,
    lastY: 0,
    choosez: 0,
    choosep: 0,
    lastP: 0,
    padTop: '0',
    chooseBool: false,
    caseListheight: '',
    caseListOverflow: 'auto',
    ifShowToTopLogo: false,
    scrollY: 0,
    praiseRecommended: 0,
    praiseRecommendedFixed: false,
    provinceObj: [{
        letter: '',
        objList: []
      }, {
        letter: 'A',
        objList: []
      }, {
        letter: 'B',
        objList: []
      },
      {
        letter: 'C',
        objList: []
      }, {
        letter: 'F',
        objList: []
      }, {
        letter: 'G',
        objList: []
      },
      {
        letter: 'H',
        objList: []
      }, {
        letter: 'J',
        objList: []
      }, {
        letter: 'L',
        objList: []
      },
      {
        letter: 'N',
        objList: []
      }, {
        letter: 'Q',
        objList: []
      },
      {
        letter: 'S',
        objList: []
      }, {
        letter: 'T',
        objList: []
      }, {
        letter: 'L',
        objList: []
      },
      {
        letter: 'X',
        objList: []
      }, {
        letter: 'Y',
        objList: []
      }, {
        letter: 'Z',
        objList: []
      },
    ],
    provinceData: [{
        letter: '',
        objList: []
      }, {
        letter: 'A',
        objList: []
      }, {
        letter: 'B',
        objList: []
      },
      {
        letter: 'C',
        objList: []
      }, {
        letter: 'F',
        objList: []
      }, {
        letter: 'G',
        objList: []
      },
      {
        letter: 'H',
        objList: []
      }, {
        letter: 'J',
        objList: []
      }, {
        letter: 'L',
        objList: []
      },
      {
        letter: 'N',
        objList: []
      }, {
        letter: 'Q',
        objList: []
      },
      {
        letter: 'S',
        objList: []
      }, {
        letter: 'T',
        objList: []
      }, {
        letter: 'L',
        objList: []
      },
      {
        letter: 'X',
        objList: []
      }, {
        letter: 'Y',
        objList: []
      }, {
        letter: 'Z',
        objList: []
      },
    ]
  },
  // onPageScroll(e) {
  //   if (this.data.showCityView || this.data.sortFlag2 || this.data.sortFlag || this.data.sortFlag3 || this.data.sortFlag4) {
  //     this.setData({
  //       praiseRecommendedFixed: true
  //     });
  //     return
  //   }
  //   this.setData({
  //     praiseRecommendedFixed: (this.data.praiseRecommended != 0 && e.scrollTop >= this.data.praiseRecommended) ? true : false
  //   })
  // },
  // goToTop() { // 回到顶部
  //   //this.setData({ ifShowToTopLogo: false })
  //   wx.pageScrollTo({
  //     scrollTop: 0,
  //     duration: 300
  //   })
  // },
  getStyleName: function() {
    let that = this;
    API.getStyleName({
        styleType: this.data.brandType
      })
      .then(res => {
        let data = res.code == 200 ? res.data : [];
        data.unshift({
          shopType: this.data.businessType,
          styleId: '',
          styleName: "全部"
        })
        that.setData({
          styleName: data
        })
      })
  },
  changeFun: function() {
    let bool = this.data.showCityView
    let that = this;
    if (bool) {
      that.closeFun();
    } else {
      that.setData({
        showCityView: true,
        sortFlag: false,
        sortFlag2: false,
        sortFlag3: false,
        caseListheight: wx.getSystemInfoSync().windowHeight * 2 - 88 + 'rpx',
        padTop: '518',
        caseListOverflow: 'hidden',
        fixed: true,
        praiseRecommendedFixed: true,
        showTopView: false,
      })
    }
  },
  changePro: function(e) {
    let index = e.currentTarget.dataset.idx,
      indey = e.currentTarget.dataset.idy,
      areaCode = e.currentTarget.dataset.areacode,
      cityObjPush = []
    this.data.areaCode = areaCode;
    if(index == 0){
      cityObjPush.push({
        areaCode: '',
        areaName: '全部',
        id: 0,
        levelId: 1,
        pid: 0,
        areaNamePinyin: ''
      })
      this.setData({
        cityObj: cityObjPush,
        choosex: index,
        choosey: indey,
        choosep: (index == this.data.lastX && indey == this.data.lastY) ? this.data.lastY : -1,
      })
    }else{
      API.getAreaByPid({
        pid: areaCode,
        levelId: 2
      }).then(res => {
        this.setData({
          cityObj: res.obj,
          choosex: index,
          choosey: indey,
          choosep: (index == this.data.lastX && indey == this.data.lastY) ? this.data.lastY : -1,
        })
      })
    } 
  },
  submitFuc: function(e) {
    let index = e.currentTarget.dataset.idx,
      city = this.data.cityObj[index].areaName,
      areaCode = e.currentTarget.dataset.areacode
    city = city.split('').length > 3 ? city.split('')[0] + city.split('')[1] + city.split('')[2] + '...' : city;
    this.setData({
      showCityView: false,
      caseListheight: '',
      padTop: '0',
      sortFlag: false,
      sortFlag2: false,
      caseListOverflow: 'auto',
      lastX: this.data.choosex,
      lastY: this.data.choosey,
      lastP: this.data.choosep,
      city: city,
      praiseRecommendedFixed: false,
      choosep: index,
      cityCode: areaCode
    })
    // wx.setStorageSync('nowCity', this.data.provinceObj[this.data.choosex].objList[this.data.choosey].baseAreaVos[index])
    wx.setStorageSync('nowCity', this.data.cityObj[index])
    let choosexyp = {
      choosex: this.data.choosex,
      choosey: this.data.choosey,
      choosep: this.data.choosep,
      areaCode: this.data.areaCode
    }
    wx.setStorageSync('choosexyp', choosexyp)
    this.getList();
  },
  closeFun: function() {
    this.setData({
      showCityView: false,
      caseListheight: '',
      padTop: '0',
      caseListOverflow: 'auto',
      praiseRecommendedFixed: false,
      fixed: false,
      sortFlag: false,
      sortFlag2: false,
      sortFlag3: false,
      sortFlag4: false,
      showTopView: false,
      choosex: this.data.lastX,
      choosey: this.data.lastY,
      choosep: this.data.lastP,
    })
  },
  getPinyin: function(l1) {
    var l2 = l1.length;
    var I1 = "";
    var reg = new RegExp('[a-zA-Z0-9\- ]');
    for (var i = 0; i < l2; i++) {
      var val = l1.substr(i, 1);
      let name = this.arraySearch(val, pinyin);
      if (reg.test(val)) {
        I1 += val;
      } else if (name !== false) {
        I1 += name;
      }

    }
    I1 = I1.replace(/ /g, '-');
    while (I1.indexOf('--') > 0) {
      I1 = I1.replace('--', '-');
    }
    return I1;
  },
  arraySearch: function(l1) {
    for (let name in pinyin) {
      if (pinyin[name].indexOf(l1) != -1) {
        return name.toUpperCase().split('')[0];
        break;
      }
    }
    return false;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu();
    new $App.newNav() // 注册快速导航组件
    let shareOptions = options
    let cityDatas = wx.getStorageSync('nowCity')
    this.setData({
      priceType: options.tab
    })
    wx.getStorage({
      key: 'choosexyp',
      success: (res)=> {
        this.setData({
          choosex: res.data.choosex,
          choosey: res.data.choosey,
          choosep: res.data.choosep,
          areaCode: res.data.areaCode,
        })
        API.getAreaByPid({
          pid: this.data.areaCode, levelId: 2
        }).then(res => { console.log(res), this.setData({ cityObj : res.obj })})
      },
    })
    // let arr = new Array('设计师', '设计师', '建材家居', '设计师', '设计师', '装修公司', '施工单位')
    var tab = options.tab || 3;
    // recommendTitle: arr[tab] || arr[0] 
    switch (tab + '') {
      case '2':
        this.setData({
          sortName2: '分类',
          optionsType: '1',
        })
        break;
      case '6':
        this.setData({
          sortName2: '工种',
          optionsType: '1'
        })
        break;
      case '5':
        this.setData({
          optionsType: '0'
        })
        break;
      case '3':
        this.setData({
          optionsType: '1'
        })
        break;
      case '4':
        this.setData({
          optionsType: "1"
        })
        break;
    }
    let city = cityDatas.areaName || '全部';
    city = city.split('').length > 3 ? city.split('')[0] + city.split('')[1] + city.split('')[2] + '...' : city
    this.setData({
      brandType: tab,
      resourcePath: resourcePath,
      city: city,
      cityCode: options.code || cityDatas.areaCode || '',
      shareOptions: shareOptions,
      recommendTitle: options.name ? options.name : '设计师'
    })
    wx.setNavigationBarTitle({
      title: options.name ? options.name : '设计师',
    })
    this.reloadRecommend(tab);
    this.getList(); // 获取列表接口
    this.getCitys(); // 获取城市接口
    this.getClassify();
    this.getPopularList();
    // this.getCityData();
    new this.emptyTemplate() // 注册组件 
    this.getStyleName(); //获取风格接口
  },
  getPopularList() {
    API.getShopBannerList({
        positionCode: 'xz:shop:list:top',
        basePlatformId: 16
      })
      .then(res => {
        if (res.message === 'ok') {
          this.setData({
            popularList: res.datalist
          })
        } else {
          this.setData({
            popularList: []
          })
        }
      })
  },
  getCityData() {
    // let cityData = $App.cityDataFilter(wx.getStorageSync('cityData'))
    // console.log(cityData)
    let that = this
    API.getAreaByPid({
      pid: 0,
      levelId: 1
    }).then(res => {
      res.obj.provinces.unshift({
        areaCode: '',
        areaName: '全部',
        id: 0,
        levelId: 1,
        pid: 0,
        areaNamePinyin: ''
      });
      myForEach(res.obj.provinces, (v) => {
        v.areaNamePinyin = v.areaCode ? (v.areaName != "重庆市" ? that.getPinyin(v.areaName).split('')[0] : 'C') : '';
      })
      that.setData({
        provinces: res.obj.provinces, //省数据
      })
      myForEach(that.data.provinceData, (value, index) => {
        myForEach(that.data.provinces, (val, count) => {
          if (value.letter == val.areaNamePinyin) {
            that.data.provinceData[index].objList.push(val)
          }
        })
      })
        that.setData({
          provinceData: that.data.provinceData,
          cityObj: this.data.choosex ? this.data.provinceData[this.data.choosex].objList[this.data.choosey]: [{ areaName: '全部', areaCode: '' }]
        })
        console.log(this.data.provinceData)
    })

    //   cityData[34] = {
    //       areaCode: '',
    //       areaName: '全部',
    //       baseAreaVos: [{
    //           areaCode: '',
    //           areaName: '全部',
    //           baseAreaVos: [{
    //               areaCode: '',
    //               areaName: '全部',
    //               baseAreaVos: null,
    //               id: null,
    //               leveId: 3,
    //               pid: ''
    //           }],
    //           id: 9999,
    //           levelId: 2,
    //           pid: '0000000'
    //       }],
    //       id: '00000',
    //       levelId: 1,
    //       pid: 0,
    //       areaNamePinyin: ''
    //   }
    //   let j = cityData[34]
    //   console.log(j)    // 全部那一项  所有的
    //   for (let i = 34; i > 0; i--) {
    //       cityData[i] = cityData[i - 1]
    //   }
    //   cityData[0] = j
    // myForEach(cityData, (v) => {
    //   // v.areaNamePinyin = v.areaCode ? this.getPinyin(v.areaName).split('')[0]: '';
    //   v.areaNamePinyin = v.areaCode ? (v.areaName != "重庆市" ? this.getPinyin(v.areaName).split('')[0] : 'C') : ''
    //   myForEach(v.baseAreaVos, (val) => {
    //     val.baseAreaVos = []
    //   })
    // })
    // console.log(cityData)
    // let that = this,
    //   code = this.data.shareOptions.code;
    // myForEach(this.data.provinceData, (value, index) => {
    //   myForEach(cityData, (val, count) => {
    //     if (value.letter == val.areaNamePinyin) {
    //       this.data.provinceObj[index].objList.push(val)
    //       this.data.provinceData[index].objList.push(val)
    //     }
    //   })
    // })
    // let obj = that.data.provinceObj
    // for (let i = 0; i < obj.length; i++) {
    //   for (let j = 0; j < obj[i].objList.length; j++) {
    //     for (let p = 0; p < obj[i].objList[j].baseAreaVos.length; p++) {
    //       if (code == obj[i].objList[j].baseAreaVos[p].areaCode) {
    //         that.setData({
    //           choosex: i,
    //           lastX: i,  上一次
    //           choosey: j,
    //           lastY: j,
    //           choosep: p,
    //           lastP: p,
    //         })
    //       }
    //     }
    //   }
    // }
    //   //console.log(111 + this.data.provinceData);
    // this.setData({
    //   // provinces: provinces,
    //   provinceData: that.data.provinceData,
    //   // citys: cityData[0].baseAreaVos,
    //   // countys: cityData[0].baseAreaVos[0].baseAreaVos,
    //     cityObj: this.data.choosex ? this.data.provinceObj[this.data.choosex].objList[this.data.choosey].baseAreaVos : [{ areaName: '全部', areaCode:''}]
    // })
    // that.data.cityData = cityData
  },

  onShow: function() {
    let cityDatas = wx.getStorageSync('nowCity');
    console.log(cityDatas)
    let city = cityDatas.areaName || '全部';
    city = city.split('').length > 3 ? city.split('')[0] + city.split('')[1] + city.split('')[2] + '...' : city
    this.setData({
      city: city,
      cityCode: cityDatas.areaCode || '',
    })
  },

  onPullDownRefresh: function() {
    if (!this.data.showTopView) {
      this.setData({
        showTopView: true,
      })
    } else {
      wx.stopPullDownRefresh()
    }
  },

  onReachBottom: function() {
    if (this.data.pageSize <= this.data.count) {
      this.setData({
        pageSize: this.data.pageSize + 5,
        messTxt: false,
      })
      this.getList();
    } else {
      this.setData({
        messTxt: true,
      })
    }
  },
  onShareAppMessage: function(res) {
    // if (res.from == 'menu') {
    //   let shareOptions = this.data.shareOptions
    //   return {
    //     title: '720 3D全景图',
    //     imageUrl: imageUrl,
    //     path: '/pages/decoration/brandList/brandList?code=' + shareOptions + '&city=' + shareOptions.city + '&tab=' + shareOptions.tab ,
    //     success(res) {
    //     },
    //     fail(err) {
    //     }
    //   }
    // }
  },
  reloadRecommend: function(type) {
    // var recommendTitle = "设计师";
    // if (type == 3)
    //     recommendTitle = "3设计师";
    // else if (type == 4)
    //     recommendTitle = "热门品牌推荐";
    // this.setData({
    //     recommendTitle: recommendTitle
    // })
    this.getList();
  },

  toggleClassify: function() {
    var This = this;
    This.setData({
      isClassifySlideTop: This.data.isClassifySlideDown,
      isClassifySlideDown: This.data.isClassifySlideTop,
      isShowClassify: !This.data.isShowClassify
    })
  },
  changeClassify: function(e) {
    var classifyId = e.currentTarget.dataset.classifyid;
    var classifyname = e.currentTarget.dataset.classifyname;
    if (classifyId == undefined || classifyname == undefined)
      return;
    this.setData({
      currClassify: {
        id: classifyId,
        name: classifyname
      }
    })
    this.toggleClassify();
  },
  changeBrand: function(e) {
    var brandType = e.currentTarget.dataset.brand;
    if (brandType == undefined)
      return;
    this.setData({
      currClassify: {
        id: "",
        name: "全部"
      },
      brandType: brandType,
      pageNo: 1,
      keyword: "",
      exampleList: [],
      isShowClassify: false,
      isClassifySlideDown: false,
      isClassifySlideTop: true
    })
    this.reloadRecommend(brandType);
    this.getClassify();
    this.getList();
    this.getPopularList();
    //还要重新获取页面数据
  },
  doPreview: function(e) {
    var imgPath = e.currentTarget.dataset.imgpath;
    if (imgPath == undefined)
      return;
    wx.previewImage({
      current: imgPath, // 当前显示图片的http链接
      urls: [imgPath] // 需要预览的图片http链接列表
    })
  },
  myExtent(obj, newObj) {
    for (let key in newObj) {
      if (newObj.hasOwnProperty(key) && !obj.hasOwnProperty(key)) {
        obj[key] = newObj[key]
      }
    }
    return obj
  },
  getList: function(obj) {
    let that = this,
      params = {
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize,
        businessType: this.data.brandType || "",
        shopName: this.data.keyword || "",
        cityCode: this.data.cityCode,
        categoryIds: this.data.currClassify.id,
        platformType: 2,
        orderBy: this.data.sortType, 
        decorationType: this.data.decorationType
      }
      if(this.data.brandType ==5){
        params.shopType = 1
      }
      if(this.data.brandType ==4){
        params.shopType =1
      }
    API.getCompanyShopList(obj ? this.myExtent(params, obj) : params)
      .then(res => {
        // if (that.data.praiseRecommended == 0) {
        //   setTimeout(() => {
        //     wx.createSelectorQuery().in(that).select('.hptj').boundingClientRect(function(res) {
        //       that.data.praiseRecommended = res.top - res.height
        //       console.log(that.data.praiseRecommended);
        //     }).exec()
        //   }, 50)
        // }
        if (res.code == 200) {
          this.setData({
            exampleList: res.data.list,
            count: res.data.count,
            showNoMore: true,
          })
        } else if (res.code == 400) {
          this.setData({
            exampleList: [],
            count: 0,
            showNoMore: true,
          })
        }
        this.data.exampleList.length > 0 ? this.emptyTemplateShow('hide') : this.emptyTemplateShow('show')
      })
  },
  getCitys: function() {
    API.getCityWideXCityList()
      .then(res => {
        if (res.code == 200) {
          this.setData({
            serviceCitys: res.data || [],
            currCity: res.data[0]
          })
        } else {
          wx.showToast({
            title: res.message || "获取城市列表失败"
          })
        }
      })
  },

  getItem: function(key, val, arr) {
    //key对象的属性名 val对象的属性值 arr要搜索的数组
    if (key == undefined || val == undefined || arr == undefined)
      return;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][key] == val) {
        return arr[i];
      }
    }
    return;
  },
  getClassify: function() {
    // var This = this;
    // var reqURL = '/sandu/mini/sysdictionary/designstyles';
    // var brandType = This.data.brandType;
    // if (brandType==3)
    //   reqURL = '/sandu/mini/sysdictionary/designstyles';
    // else if(brandType==2)
    //   reqURL = '/sandu/mini/productcategory/list';
    // else if(brandType==6)
    //   reqURL = '/sandu/mini/sysdictionary/list?type=constructionType';
    // else if(brandType==5)
    //   reqURL = "/sandu/mini/sysdictionary/list?type=goodStyle";
    // if(!reqURL)
    //   return;

    // fetch(reqURL, 'get', {
    // }, 'shop').then(res => {
    //   if (res.code == 200) {
    //     if(brandType==2){
    //       This.setData({
    //         classifyList: [],
    //         materialClassify:res.data
    //       })
    //     }else{
    //       This.setData({
    //         classifyList: res.data || [],
    //         materialClassify:[]
    //       })
    //     }
    //   } else {
    //     wx.showToast({
    //       title: res.message || "获取分类失败",
    //     })
    //   }

    // }).then(res => {
    // })
  },
  doFilter: function() {
    wx.navigateTo({
      url: '/pages/decoration/search/search?type=service&code=' + this.data.cityCode + '&city=' + this.data.city + '&tab=' + this.data.brandType + '&name=' + this.data.recommendTitle,
    })
    // this.setData({
    //     pageNo: 1,
    //     exampleList: [],
    //     isClassifySlideTop: true,
    //     isClassifySlideDown: false,
    //     isShowClassify: false
    // })
    // this.getList();
  },
  setKeyword: function(e) {
    wx.navigateTo({
      url: '/pages/decoration/search/search?type=service&code=' + this.data.cityCode + '&city=' + this.data.city,
    })
    // var keyword = e.detail.value;
    // this.setData({
    //     keyword: keyword
    // })
  },
  toHref: function(e) {
    var sHref = e.currentTarget.dataset.href;
    if (sHref == undefined)
      return;
    wx.navigateTo({
      url: sHref,
    })
  },
  toDetail(e) {
    let id = e.currentTarget.dataset.id
    id ? wx.navigateTo({ url: '/pages/decoration/companyDetail/companyDetail?id=' + id }) : null
  },
  changeCity: function(e) {
    this.setData({
      condition: !this.data.condition
    })
  },
  bindChange: function(e) {

    const val = e.detail.value

    const temp = this.data.threeLevelValue
    if (temp[0] !== val[0]) {
      this.setData({
        value: [val[0], 0, 0]
      })
      val[1] = 0
    } else if (temp[1] !== val[1]) {
      this.setData({
        value: [val[0], val[1], 0]
      })
      val[2] = 0
    }
    this.setData({
      citys: this.data.cityData[val[0]].baseAreaVos,
      cityCode: this.data.cityData[val[0]].baseAreaVos[val[1]].areaCode,
      countys: this.data.cityData[val[0]].baseAreaVos[val[1]].baseAreaVos,
      threeLevelValue: val
    })
  },
  provincialLinkageHide(e) { // 确认地址接口
    let flag = e.currentTarget.dataset.flag,
      val = this.data.threeLevelValue
    this.setData({
      condition: false
    })
    let city = this.data.cityData[val[0]].baseAreaVos[val[1]].areaName;
    city = city.split('').length > 3 ? city.split('')[0] + city.split('')[1] + city.split('')[2] + '...' : city
    if (flag) {
      this.setData({
        province: this.data.cityData[val[0]].areaName,
        city: city,
        cityCode: this.data.cityData[val[0]].baseAreaVos[val[1]].areaCode,
        value: this.data.threeLevelValue
      })
      this.getList()
    }
  },
  changeSort() {
    if (!this.data.sortFlag) {
      this.setData({
        sortFlag: true,
        sortFlag2: false,
        sortFlag3: false,
        sortFlag4: false,
        showCityView: false,
        caseListheight: wx.getSystemInfoSync().windowHeight * 2 - 88 + 'rpx',
        caseListOverflow: 'hidden',
        padTop: '518',
        praiseRecommendedFixed: true,
        fixed: true,
        showTopView: false,
      })

    } else {
      this.closeFun();
    }

  },
  changeSort2() {
    if (!this.data.sortFlag2) {
      this.setData({
        sortFlag2: true,
        sortFlag: false,
        sortFlag3: false,
        sortFlag4: false,
        showCityView: false,
        caseListheight: wx.getSystemInfoSync().windowHeight * 2 - 88 + 'rpx',
        caseListOverflow: 'hidden',
        padTop: '518',
        praiseRecommendedFixed: true,
        fixed: true,
        showTopView: false,
      })
    } else {
      this.closeFun();
    }

  },
  changeSort3() {
    if (!this.data.sortFlag3) {
      this.setData({
        sortFlag3: true,
        sortFlag2: false,
        sortFlag4: false,
        sortFlag: false,
        showCityView: false,
        caseListheight: wx.getSystemInfoSync().windowHeight * 2 - 88 + 'rpx',
        caseListOverflow: 'hidden',
        padTop: '518',
        praiseRecommendedFixed: true,
        fixed: true,
        showTopView: false,
      })
    } else {
      this.closeFun();
    }
  },
  changeSort4() {
    if (!this.data.sortFlag4) {
      this.setData({
        sortFlag4: true,
        sortFlag3: false,
        sortFlag2: false,
        sortFlag: false,
        showCityView: false,
        caseListheight: wx.getSystemInfoSync().windowHeight * 2 - 88 + 'rpx',
        caseListOverflow: 'hidden',
        padTop: '518',
        praiseRecommendedFixed: true,
        fixed: true,
        showTopView: false,
      })
    } else {
      this.closeFun();
    }
  },
  commitSort(e) {
    let type = e.currentTarget.dataset.type
    let name = e.currentTarget.dataset.name
    this.setData({
      sortType: type,
      sortName: name,
      showTopView: false
    })
    this.getList();
    this.closeFun();
  },
  commitSort2(e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    let sortFlag2Index = e.currentTarget.dataset.index
    name = name.split('').length > 4 ? name.split('')[0] + name.split('')[1] + name.split('')[2] + '...' : name;
    this.setData({
      'currClassify.id': id,
      sortName2: name,
      showTopView: false,
      sortFlag2Index: sortFlag2Index,
    })
    this.getList();
    this.closeFun();
  },
  commitSort3(e) {
    let name = e.currentTarget.dataset.name
    let type = e.currentTarget.dataset.type
    let index = e.currentTarget.dataset.index
    this.setData({
      sortType2: type,
      sortName4: name,
      showTopView: false,
      decorationType: index
    })
    this.getList();
    this.closeFun();
  },
  serviceSort(e) {
    let sort = e.currentTarget.dataset.sort;
    this.setData({
      sort: sort,
      praiseRecommendedFixed: true,
    })
    wx.pageScrollTo({
      scrollTop: this.data.praiseRecommended,
      duration: 0
    })
    this.getList()
  },
  // swiperChange: function(e) {
  //   this.setData({
  //     swiperCurrent: e.detail.current
  //   })
  // },
  getMinValue: function(e) {
    this.setData({
      minValue: e.detail.value > 0 ? e.detail.value : ''
    })
  },
  getMaxValue: function(e) {
    this.setData({
      maxValue: e.detail.value > 0 ? e.detail.value : ''
    })
  },
  resetFun: function() {
    let obj = {}
    if (this.data.priceType == 3 || this.data.priceType == 4) {
      obj.designFeeStaring = ''
      obj.designFeeEnding = ''
    } else {
      obj.decorationPriceStart = ''
      obj.decorationPriceEnd = ''
    }
    this.setData({
      pageNo: 1,
      businessType: '',
      pageSize: 10,
      shopName: '',
      cityCode: '',
      categoryIds: this.data.currClassify.id,
      platformType: 2,
      orderBy: this.data.sortType,
      decorationType: this.data.decorationType,
      minValue: '',
      maxValue: ''
    })
    this.getList(obj);
  },
  submitFun: function(e) {
    let obj = {},
      minValue = this.data.minValue,
      maxValue = this.data.maxValue
    if (maxValue != '' && minValue != '') {
      if (parseInt(minValue) < parseInt(maxValue)) {
        if (this.data.priceType == 3 || this.data.priceType == 4) {
          obj.designFeeStarting = minValue
          obj.designFeeEnding = maxValue
        } else {
          obj.decorationPriceStart = minValue
          obj.decorationPriceEnd = maxValue
        }
        this.setData({
          sortFlag3: false,
          showTopView: false
        })
        this.getList(obj)
        this.closeFun()
      } else {
        wx.showToast({
          title: "请输入正确数值",
          icon: 'none'
        })
      }
    } else {
      wx.showToast({
        title: "请输入正确数值",
        icon: 'none'
      })
    }
  }
})