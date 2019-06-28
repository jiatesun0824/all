import regeneratorRuntime from '../../utils/runtime.js';
let API = getApp().API,
  myForEach = getApp().myForEach,
  mySplitUrl = getApp().mySplitUrl,
  myCompoundUrl = getApp().myCompoundUrl,
  $App = getApp(),
  ttt = '';
let bmap = require('../../lib/es6-promise/bmap-wx.min.js');
let share = require('../../utils/shareConfig.js')
import {
  shareTitle
} from '../../utils/config.js';
import {
  emptyTemplate
} from '../../component/emptyTemplate/emptyTemplate'

Page({
  emptyTemplate,
  /**
   * 页面的初始数据
   */
  data: {
    staticImageUrl: $App.staticImageUrl,
    resourcePath: getApp().resourcePath,
    // 方案
    scrollTop: 0,
    floorstatus: false,
    imageArray: [],
    spaceList: [],
    areaList: [],
    styleList: [],
    types: 0,
    favoriteRequest: true,
    collectRequest: true,
    conditionActive: -1,
    childConditionActive: [0, -1, -1],
    recommendCaseList: [],
    areaId: '',
    styleCode: '',
    oneAreaId: '',
    sevenUrl: getApp().sevenUrl,
    pageSize: 5,
    showType: false,
    getCaseParams: {
      spaceType: '',
      designPlanStyleId: '',
      spaceArea: ''
    },
    caseObj: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
    isShow: true,
    totalCount: 0,
    caseListheight: '',
    caseListOverflow: 'none',
    scroolLeft: 0,
    ifShowToTopLogo: false,
    caseListheight: '',
    newTypeName: [],
    cityItem: '',
    staticImageUrl: getApp().staticImageUrl,
    popularList1: [],
    popularList2: [],
    popularList3: [],
    praiseList: [],
    // 方案
    userid: wx.getStorageSync('id'),
    showZzc: false,
    renderNewsObj: false,
    homePopup: false,
    unreadMsg: 0,
    systemNewObj: {
      isRead: 1
    },
    // renderMessageIsRead: 0, // Socket消息
    commentIsRead: 1, //评论消息
    renderNewIsRead: 1, //渲染消息
    userChatIsRead: 1, //聊天消息
    systemNewIsRead: 1, // 系统消息
    formId: [],
    formIndex: 0,
    planCostShow: false,
    showNews: true,
    sw: 0,
    yunDanHomepop: true,
    dialogData: {},
    // 埋点数据
    previousPath: '',
    nowPath: '',
    feedback: []
  },
  getBannerList() {
    API.getIndexBanner({
      basePlatformId: 16,
      positionCode: 'xz:home:banner:interior',
    }, 'noLoading').then(res => {
      this.setData({
        imageArray: res.datalist || []
      })
    })
  },
  routerToLeiShi() { // 跳转到雷士小程序
    wx.navigateToMiniProgram({
      appId: 'wxe8455e63bb9f7c25',
      path: '/pages/goods-details/goods-details?isAssemble=true&id=639887&groupId=57',
    })
  },
  getPhoneNumber(e) {
    console.log(e, 'swq')
  },
  getEnableDialog() {
    API.getEnableDialog({
      positionCode: 'xz:home:banner:interior'
    }, 'noLoading').then(res => {
      if (res.success) {
        this.setData({
          homePopup: res.obj != undefined && res.obj.isEnable == 1,
          dialogData: res.obj || {}
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  closeYuanButton() {
    this.setData({
      yunDanHomepop: false
    })
  },
  openZzc: function() {
    this.setData({
      showZzc: !this.data.showZzc
    })
  },
  kfViewBut() {
    $App.sd.track("btnclick", { "btnid": "kfViewBut" }); 
  },
  onLoad: function(options) {

    // rzd 埋点 190214
    // let page = getCurrentPages(),
    //   previousPath = page.length > 1 ? page[page.length - 2].route : '',
    //   nowPath = page[page.length - 1].route;
    // this.setData({
    //   previousPath: previousPath,
    //   nowPath: nowPath
    // })
    let isLoginBefore = wx.getStorageSync('isLoginBefore');
    this.setData({
      homePopup: isLoginBefore == '0'
    });
   
    this.init(options) // 初始化
    
  },
  init(options) { // 初始化
    
    var that = this
    options.navToUrl && wx.navigateTo({
      url: decodeURIComponent(options.navToUrl)
    })
    // this.webSocketInit() // 初始化webSocket中的事件
    options.actId && this.toCutprice(options)
    this.posterSharePanorama(options) // 获取海报分享到砍价活动
    this.getBannerList(); // 获取banner在2登录之前    
    $App.userLoginStatus.then(() => {
      this.getEnableDialog();
      this.getUserInfoStatus();
    }) 
    if (options.shareType == '720') {
      getApp().data.webUrl = decodeURIComponent(options.url)
      console.log('weburl', options.url)
      $App.myNavigateBack('pages/web-720/web-720')
    } else if (options.shareType == 'yuandanActivity') {
      console.log('没掉接口？')
      //  rzd 181226元旦红包活动,记录邀请信息(好友通过分享链接进入时) start
      $App.userLoginStatus.then(() => {
        getApp().data.webUrl = decodeURIComponent(options.url + '&token=' + wx.getStorageSync('token'))
        $App.myNavigateBack('pages/web-720/web-720')
        API.recordInvitation({
          regId: options.yuandanRegId
        }).then(res => {
          console.log('记录邀请信息接口调用', res)
        });
      })
      //  rzd 181226元旦红包活动,记录邀请信息(好友通过分享链接进入时) end
    }
    //web-view活动页分享跳转
    if (options.shareType == 'active') {
      let url = decodeURIComponent(options.url)
      if (url.indexOf('?url=') != -1)
        url = url.slice(0, url.indexOf('?url=') + 5) + encodeURIComponent(url.slice(url.indexOf('?url=') + 5));
      wx.setStorage({
        key: 'pageTitle',
        data: options.name
      })
      wx.navigateTo({
        url: url,
      })
    }
    //同城联盟回调
    if (options.userId) {
      if (options.type == '720') {
        this.callback(options.userId, options.shareType, options.time)
        let sevenObj = {
          platformCode: options.platformCode,
          operationSource: options.operationSource,
          planId: options.planId,
          routerQueryType: options.routerQueryType,
          customReferer: options.customReferer,
          platformNewCode: options.platformNewCode
        }
        let webUrl = this.data.sevenUrl
        for (let key in sevenObj) {
          webUrl += key + '=' + sevenObj[key] + '&'
        }
        getApp().data.webUrl = webUrl
        $App.myNavigateBack('pages/web-720/web-720')
      } else {
        this.callback(options.userId, options.shareType, options.time)
      }
    }
    //渠道分享回调
    if (options.shareType == '720') {
      getApp().data.webUrl = decodeURIComponent(options.url)
      console.log('weburl', options.url)
      $App.myNavigateBack('pages/web-720/web-720')
    }
    Date.prototype.toLocaleString = function() {
      return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + " " + that.addZero(this.getHours()) + ":" + that.addZero(this.getMinutes()) + ":" + that.addZero(this.getSeconds());
    };
    if (options.scene) {
      let list = decodeURIComponent(options.scene).split(',')
      //将时间戳String转int，String的话结果会有误
      let timeStamp = parseInt(list[2])
      let inviteId = list[0],
        shareType = list[1],
        // new Date（时间戳）方法将时间戳转为标准时间，toLocaleString方法将标准时间转为需要的时间
        inviteTime = new Date(timeStamp).toLocaleString() //10位乘以1000，十三位不用动
      if (list.length > 3 && list[3] == 'union') {
        callback(inviteId, shareType, timeStamp);
      }
      this.placeCall(inviteId, shareType, inviteTime)
    }
    this.getPopular();
    // this.getUserPosition() // 获取用户地理位置  jyk暂时隐藏 11.23
    new this.emptyTemplate() // 注册组件
  },
  getUserInfoStatus(){
    API.getUserInfoStatus().then(res=>{
      wx.setStorageSync('userInfoStatus', res.obj)
    })
    
  },
  springFestival(options) {
    if (options.activityId && options.wheelId) {
      wx.navigateTo({
        url: `/pages/festivalActivity/festivalActivity?activityId=${options.activityId}&wheelId=${options.wheelId}&inviteUserId=${options.inviteUserId}&isShare=${options.isShare}`,
      })
      this.festivalSharePoster(options) //春节活动分享海报
    }
  },
  // sellingPoint(event) {
  //   let page = getCurrentPages(),
  //     previousPath = page.length > 1 ? page[page.length - 2].route : '',
  //     nowPath = page[page.length - 1].route
  //   console.log(previousPath);
  //   API.sellingPoint({
  //     uid: wx.getStorageSync('openId'),
  //     cp: nowPath,
  //     lp: previousPath,
  //     e: event ? event : '',
  //     pt: '首页'
  //   })
  // },
  webSocketInit() { // 初始化webSorket中的事件
    let timer = setInterval(() => {
      if (getApp().webSocketStatus) {
        getApp().mySocket.on('im_unread_msg_event', content => {
          this.setData({
            systemNewIsRead: 0
          })
        }) // 消息提醒
        getApp().mySocket.on('im_push_msg_event', content => {
          this.setData({
            systemNewIsRead: 0
          })
        }) // 渲染消息
        clearInterval(timer)
      }
    }, 500)
  },
  toCutprice(e) {
    wx.navigateTo({
      url: "/pages/cutprice/cutprice?actId=" + e.actId + "&regId=" + e.regId + "&isUser=" + e.isUser + "&cutPrice=&userId=" + e.userId,
    })
  },
  posterSharePanorama(options) {
    if (options.scene) {
      API.getJsonData({
        id: options.scene
      }).then(res => {
        $App.userLoginStatus.then(() => {
          if (JSON.parse(res.obj.jsonData).shareType == "cutPrice") { //砍价活动
            getApp().data.cutpriceUrl = myCompoundUrl(Object.assign(JSON.parse(res.obj.jsonData), {
              token: wx.getStorageSync('token')
            }))
            wx.navigateTo({
              url: '/pages/cutprice/cutprice'
            })
          } else if (JSON.parse(res.obj.jsonData).shareType == "festivalActivity") { //元宵活动
            getApp().data.festivalUrl = myCompoundUrl(Object.assign(JSON.parse(res.obj.jsonData), {
              token: wx.getStorageSync('token')
            }))
            wx.navigateTo({
              url: "/pages/festivalActivity/festivalActivity"
            })
          }
        })
      })
    }
  },
  getSystemNewsList() {
    API.getSystemRenderList({
      order: "gmt_modified",
      orderNum: "desc",
      limit: 1,
      start: 0,
      isRead: 0
    }, 'noLoading').then(res => {
      if (res.success && res.obj) {
        this.setData({
          systemNewIsRead: res.obj[0].isRead
        })
      } else {
        this.setData({
          systemNewIsRead: 1
        })
      }
    })
  },
  //渲染消息
  getRenderNewsList() { // 获取用户最后一次渲染的渲染消息
    API.getUserRenderList({
        order: "gmt_modified",
        orderNum: "desc",
        limit: 1,
        start: 0
      })
      .then(res => {
        if (res.success && res.obj) {
          this.setData({
            renderNewIsRead: res.obj[0].isRead
          })
        } else {
          this.setData({
            renderNewIsRead: 1
          })
        }
      })
  },
  //评论消息
  getcommentMessage() {
    API.commentMessage({
      curPage: 0,
      pageSize: 1,
      isRead: 0,
    }).then(res => {
      if (res.obj) {
        this.setData({
          commentIsRead: res.obj[0].isRead
        });
      } else {
        this.setData({
          commentIsRead: 1
        });
      }
    });
  },
  // 聊天消息
  getUserChatList() {
    API.getUserChatList({
      userSessionId: wx.getStorageSync('uuid')
    }).then(res => {
      if (res.data) {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].unreadMsg > 0) {
            this.setData({
              userChatIsRead: 0
            });
            return;
          }
        }
        this.setData({
          userChatIsRead: 1
        });
      }
    })
  },



  hideDecoratePriceBox() {
    this.setData({
      decoratePriceBox: false
    })
  },
  getCityData() {
    let nowCity = wx.getStorageSync('nowCity')
    if (!nowCity) {
      let item = wx.getStorageSync('cityLoctionItem')
      if (item) {
        this.setData({
          cityItem: item,
          city: item.areaName,
          cityCode: item.cityCode
        })
      } else {
        let data = {
          areaCode: '',
          areaName: "全国",
          baseAreaVos: [],
          id: '',
          levelId: '',
          pid: ''
        }
        this.setData({
          cityItem: data
        })
        wx.setStorageSync('nowCity', data)
      }
    } else {
      this.setData({
        cityItem: nowCity
      })
    }

    // 根据获取用户地址，再进行请求

    // this.getsupplyinfo();
  },
  toggleCitys: function() {
    wx.navigateTo({
      url: '/pages/chooseAddress/chooseAddress?cityItem=' + JSON.stringify(this.data.cityItem),
    })
  },
  hideDecoratePriceBox() {
    this.setData({
      decoratePriceBox: false
    })
  },
  showDecoratePriceBox(e) {
    let item = e.detail
    this.setData({
      decoratePriceList: item,
      decoratePriceBox: true
    })
    console.log(item, 'swq')
  },
  routerToCaseDetails(e) { // 方案详情页
    let id = e.currentTarget.dataset.id,
      type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/case-details/case-details?id=${id}&type=${type || 0}`
    })
  },
  changeType: function() {
    if (this.data.showType) {
      wx.pageScrollTo({
        scrollTop: 670,
        duration: 0
      })
    } else {
      // $App.sellingPoint(API, 'homeMoreType', this.data.nowPath, this.data.previousPath, '首页');
      $App.sd.track("btnclick", { "btnid": "changeType" }); 
    }
    this.setData({
      showType: !this.data.showType,
      newTypeName: this.data.spaceList
    })
  },
  placeCall(e1, e2, e3) {
    var that = this
    if ($App.data.loginStatus == '' & $App.data.loginFlag == false) {
      setTimeout(function() {
        that.placeCall(e1, e2, e3)
      }, 1000);
      return;
    }
    if (!$App.data.loginFlag) {
      return;
    } else {
      API.invitecallbackshare({
          userId: e1,
          shareType: e2,
          shareTime: e3,
          shareSign: 'sxw'
        })
        .then(res => {})
    }

  },
  callback(e1, e2, e3) { //e1 userId,e2 shareType,e3 time 
    var that = this
    if ($App.data.loginStatus == '' & $App.data.loginFlag == false) {
      setTimeout(function() {
        that.callback(e1, e2, e3)
      }, 1000);
      return;
    }
    if (!$App.data.loginFlag) {
      return;
    } else {

      if ($App.data.loginStatus == 0) {
        var that = this;
        Date.prototype.toLocaleString = function() {
          return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + " " + that.addZero(this.getHours()) + ":" + that.addZero(this.getMinutes()) + ":" + that.addZero(this.getSeconds());
        };
        let inviteId = e1,
          shareType = e2,
          inviteTime = new Date(e3 * 1).toLocaleString()
        let url = '/union/invite/invitecallback';
        API.invitecallback({
            inviteId: inviteId,
            shareType: shareType,
            inviteTime: inviteTime,
            shareSign: 'union'
          })
          .then(res => {})
      }
    }

  },

  addZero(num) {
    num = num.toString();
    if (num.length == 1) {
      num = '0' + num
    }
    return num
  },
  // onPageScroll(e) {
  //   e.scrollTop > 200 ? this.setData({
  //     ifShowToTopLogo: true
  //   }) : this.setData({
  //     ifShowToTopLogo: false
  //   })
  // },
  // goToTop() { // 回到顶部
  //   this.setData({
  //     ifShowToTopLogo: false
  //   })
  //   wx.pageScrollTo({
  //     scrollTop: 0,
  //     duration: 300
  //   })
  // },
  getUserPosition() { // 获取用户地理位置
    let BMap = new bmap.BMapWX({
        ak: 'eXo93TLB1GE2dnrcl1rcot18qvu2vMpG'
      }),
      cityMessage = null,
      $self = this
    BMap.regeocoding({
      success(data) { // 成功之后调用接口进行保存
        cityMessage = data.originalData.result.addressComponent // 这就是我们需要的东西 
        let cityData = $App.cityDataFilter(wx.getStorageSync('cityData')),
          allCity = [];
        //把所有市一级拿出来    
        for (let i = 0; i < cityData.length; i++) {
          allCity = allCity.concat(cityData[i].baseAreaVos)
        }
        let item;
        for (let i = 0; i < allCity.length; i++) {
          if (allCity[i].areaName == cityMessage.city) {
            item = allCity[i]
          }
        }
        wx.setStorageSync('cityMessage', cityMessage)
        wx.setStorageSync('cityLoctionItem', item)
        wx.getStorage({
          key: 'nowCity',
          fail: function() {
            wx.setStorageSync('nowCity', item)
          }
        })

      },
      fail(e) {
        // wx.showModal({
        //   title: '获取地理位置',
        //   content: '您已取消获取位置，再次获取还是继续取消？',
        //   success(res) {
        //     if (res.confirm) {
        //       wx.openSetting({
        //         success(res) {
        //           if (!res.authSetting["scope.userInfo"] || !res.authSetting["scope.userLocation"]) {
        //             $self.getUserPosition()
        //           } else {
        //             wx.showToast({
        //               title: '获取地理位置失败',
        //               icon: 'none'
        //             })
        //           }
        //         }
        //       })
        //     } else if (res.cancel) {
        //       wx.showToast({
        //         title: '获取地理位置失败',
        //         icon: 'none'
        //       }) 
        //     }
        //   },
        //   fail() {
        //     wx.showToast({
        //       title: '获取地理位置失败',
        //       icon: 'none'
        //     })
        //   }
        // })
      }
    });
  },
  async getPlanCondition() { // 获取筛选条件进而获取方案 
    let res = await API.getConditionMetadata()
    myForEach(res.obj[0].designPlanAreaList, (value) => {
      value.areaName = value.areaName.replace('~', '-')
    })
    this.setData({
      newTypeName: res.obj,
      spaceList: res.obj,
      areaList: res.obj[0].designPlanAreaList,
      oneAreaId: '',
      styleList: res.obj[0].designPlanStyleVoList,
      'getCaseParams.spaceType': res.obj[0].houseType
    })
    for (let i = 0; i < res.obj.length; i++) {
      await this.getRecommendCaseList(res.obj[i].houseType, i)
    }
  },
  getPopular() {
    API.getShopPopularityList({
      businessType: '',
      platformType: 2
    }).then(res => {
      if (res.code == 200 && res.data) {
        console.log(res, 'ssss')
        this.setData({
          popularList1: res.data.list[0].shopPopularityList.reduce((before, next, index) => {
            index % 3 ? before[before.length - 1].push(next) : before.push([next]);
            return before;
          }, []),
          popularList2: res.data.list[1].shopPopularityList,
          popularList3: res.data.list[2].shopPopularityList,
        })
        let arr = res.data.list[2].shopPopularityList.slice(1).reduce((before, next, index) => {
          index % 2 ? before[before.length - 1].push(next) : before.push([next]);
          return before;
        }, []);
        if (arr.length % 2 == 1) {
          arr.splice(-1, 1);
        }
        this.setData({
          praiseList: arr
        });
      } else {
        this.setData({
          popularList1: [],
          popularList2: [],
          popularList3: []
        })
      }
    })

  },
  shouMoreFun: function() {
    this.data.isShow ? this.setData({
      isShow: false
    }) : this.setData({
      isShow: true
    });
  },
  areaIdFun: function(e) {
    this.setData({
      areaId: e.currentTarget.dataset.info || '',
      'getCaseParams.spaceArea': e.currentTarget.dataset.info || ''
    })

  },
  addZero(num) {
    num = num.toString();
    if (num.length == 1) {
      num = '0' + num
    }
    return num
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onShowInit();
    // 获取筛选条件进而获取方案 
  },
  onShowInit() {
    this.getCityData();
    this.bigDataSellingPoints()
    $App.userLoginStatus.then(res => {
      this.getPlanList()
      this.getFeedbackList();
    })
    console.log(wx.getStorageSync('token'), '我的')
    this.getRenderNewsList()
    this.getSystemNewsList()
    this.getUserChatList()
    this.getcommentMessage()
  },
  bigDataSellingPoints() {
    $App.sd.track("pageview", {});
  },
  getPlanList() {
    API.getSuperiorPlan().then(res => {

      
      this.setData({
        caseObj: res.status ? res.obj : []
      })
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    if (res.from == 'menu') {
      let obj = share.shareUrl('/pages/home/home', '随选网')
      console.log(obj)
      return obj;
    }
  },
  navigatTo(e) {
    let url = e.currentTarget.dataset.url
    let tab = e.currentTarget.dataset.tab
    let name = e.currentTarget.dataset.name || '设计师';

    // if (tab / 1 == 3) {
    //   $App.sellingPoint(API, 'homeDesignbigcoffeeCheckMore', this.data.nowPath, this.data.previousPath, '首页');
    // } else if (tab / 1 == 4) {
    //   $App.sellingPoint(API, 'homePingPaiDesignCheckMore', this.data.nowPath, this.data.previousPath, '首页');
    // } else {
    //   $App.sellingPoint(API, 'homeKouBeinCheckMore', this.data.nowPath, this.data.previousPath, '首页');
    // }
    $App.sd.track("btnclick", { "btnid": "navigatTo" });  //大数据埋点
    wx.navigateTo({
      url: url + '?tab=' + tab + '&name=' + name,
    })
  },
  toCase() {
    // $App.sellingPoint(API, 'homeCaseCheckMore', this.data.nowPath, this.data.previousPath, '首页');
    $App.sd.track("btnclick", { "btnid": "toCase" });
    wx.switchTab({
      url: '/pages/plan/house-case/house-case',
    })
  },
  toDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/decoration/companyDetail/companyDetail?id=' + id,
    })
  },
  // navigat(e) {
  //   console.log(e)
  //   let url = e.currentTarget.dataset.url,
  //     type = e.currentTarget.dataset.type,
  //     name = e.currentTarget.dataset.name
  //   if (e.currentTarget.dataset.type == "互动区") {
  //     wx.setStorageSync('cityServiceType', 'information')
  //     wx.switchTab({
  //       url: '/pages/interaction/interactiveArea/interactiveArea'
  //     })
  //     $App.sellingPoint(API, 'homeHudongArea', this.data.nowPath, this.data.previousPath, '首页');
  //   } else {

  //     if (e.currentTarget.dataset.url == 'bHIndex') {
  //       wx.switchTab({
  //         url: '/pages/brandHall/bHIndex/bHIndex'
  //       })
  //       return;
  //     } else if (url === '/pages/my-news/my-news') {

  //     }
  //     if (e.currentTarget.dataset.type == "免费报价") {
  //       $App.sellingPoint(API, 'homeMianFeiBaoJia', this.data.nowPath, this.data.previousPath, '首页');
  //     } else {
  //       $App.sellingPoint(API, 'homeCompanyRuzhu', this.data.nowPath, this.data.previousPath, '首页');
  //     }
  //     wx.setStorage({
  //       key: 'pageTitle',
  //       data: name
  //     })
  //     wx.navigateTo({
  //       url: url,
  //     })

  //   }
  // },
  switchT(e) {
    let url = e.currentTarget.dataset.url
    wx.switchTab({
      url: url,
    })
  },

  //方案
  enlargeImage(url) { // 查看大图
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    })
  },
  toThreeD(e) { // 调转到3D界面
    let type = e.currentTarget.dataset.type,
      item = e.currentTarget.dataset.item,
      routerQueryType = null,
      webUrl = this.data.sevenUrl
    if (type === 'video') {
      API.getRecommendedVideoId({
          planRecommendedId: item.designPlanRecommendId,
          remark: type
        })
        .then(res => {
          if (res.success) {
            return res.datalist[0].id
          } else {
            return false
          }
        })
        .then(res => {
          if (res) {
            API.getRecommendedVideoMessage({
                thumbId: res
              })
              .then(res => {
                res.success ? this.toVideo(res.obj.url) : wx.showToast({
                  title: '打开失败',
                  icon: 'none'
                })
              })
          }
        })
    } else {
      type === '720' ? routerQueryType = 'seven' : routerQueryType = 'roam'
      let sevenObj = {
        token: wx.getStorageSync('token'),
        platformCode: 'brand2c',
        operationSource: 1,
        planId: item.designPlanRecommendId,
        routerQueryType: routerQueryType,
        customReferer: $App.wxUrl,
        platformNewCode: 'miniProgram'
      }
      for (let key in sevenObj) {
        webUrl += key + '=' + sevenObj[key] + '&'
      }
      getApp().data.webUrl = webUrl
      $App.myNavigateBack('pages/web-720/web-720')
    }
  },
  closeCaseCondition() {
    this.setData({
      conditionActive: -1
    })
    if (this.data.conditionActive === -1) {
      this.setData({
        caseListheight: '',
        caseListOverflow: 'none'
      })
    } else {
      let caseListheight = wx.getSystemInfoSync().windowHeight
      this.setData({
        caseListheight: caseListheight + 'px',
        caseListOverflow: 'hidden'
      })
    }
  },
  getRecommendCaseList(tpye) { // 获取方案列表
    API.getRecommendCaseList({
        curPage: 1,
        pageSize: 5,
        spaceType: tpye || 3,
        designPlanStyleId: '',
        spaceArea: '',
        displayType: 'decorate',
        isSortByReleaseTime: 0
      })
      .then(res => {
        if (res.status) {
          if (res.obj) {
            let caseObj = this.data.caseObj;
            caseObj[tpye] = res.obj;
            this.setData({
              recommendCaseList: res.obj,
              caseObj: caseObj,
              totalCount: res.totalCount
            })
          } else {
            this.setData({
              recommendCaseList: [],
              caseObj: [],
              totalCount: 0
            })
          }
        } else {
          this.setData({
            recommendCaseList: [],
            caseObj: [],
            totalCount: 0
          })
        }
      })
  },

  toVideo(url) {
    wx.navigateTo({
      url: '/pages/template/video/video?url=' + url
    })
  },
  putInMyhouse(e) { // 装进我家
    // this.renderTypeShow() // 显示组件  
    let item = e.currentTarget.dataset.item
    wx.setStorageSync('caseItem', item)
    wx.navigateTo({
      url: '/pages/plan/case-house-type/case-house-type'
    })
  },
  toPlan() {
    wx.switchTab({
      url: '/pages/plan/house-case/house-case',
    })
  },
  navigat2: function() {
    this.setData({
      homePopup: false
    })
    wx.switchTab({
      url: '/pages/plan/house-case/house-case',
    })
  },
  closeButton: function() {
    this.setData({
      homePopup: false
    })
  },
  // 通用弹框的跳转方法
  toSpringAct() {
    let url = decodeURIComponent(this.data.dialogData.url)
    if (url.indexOf('?url=') != -1)
      url = url.slice(0, url.indexOf('?url=') + 5) + encodeURIComponent(url.slice(url.indexOf('?url=') + 5));
    wx.setStorage({
      key: 'pageTitle',
      data: this.data.dialogData.dialogName
    })
    getApp().toUrl(url);
  },
  getFormId(e) {
    this.data.formId.push(e.detail.formId);
    API.collectMiniUserFormId(this.data.formId).then(res => {
      this.setData({
        formIndex: 0,
        formId: []
      })
    })
  },
  onMyEvent: function(e) {
    this.setData({
      paramBtoA: e.detail.paramBtoA,
      planCostShow: true,
    })
  },
  closePlanCost() {
    this.setData({
      planCostShow: false
    })
  },
  /**
   * 跳转体验户型页面
   */
  toDesign() {
    // $App.sellingPoint(API, 'designMyhome', this.data.nowPath, this.data.previousPath, '首页');
    $App.sd.track("btnclick", { "btnid": "toDesign" });    
    wx.switchTab({ url: "../designMyhome/designMyhome" })
  },
  toOtherPage(e) {
    let url = e.currentTarget.dataset.url;
    let type = e.currentTarget.dataset.type
    if (type == "hot") {
      $App.sd.track("btnclick", { "btnid": "toOtherPage" });
      wx.navigateTo({
        url: url,
      })
    } else {
      $App.sd.track("btnclick", { "btnid": "toOtherPage" });
      wx.switchTab({
        url: url,
      })
    }
  },
  // 页面反馈入口
  getFeedbackList() {
    console.log("qqq");
    API.getFeedback().then(res => {
      if (res.success) {
        let list = res.list;
        list.forEach(item=>{
          item.answers.forEach(items=>{
            items.rate = items.rate *100;
            items.rate = Math.round(items.rate.toFixed(1));
          })
        })
        this.setData({
          feedback: list
        });
      }
    })
  },
  feedbackChoose(e) {
    console.log();
    let params = {
      feedbackValue: e.currentTarget.dataset.feedbackvalue,
      answerValue: e.currentTarget.dataset.answervalue
    }
    console.log(params)
    API.getFeedbackCollect(params).then(res => {
      if (res.success) {
        this.getFeedbackList();
      }
    })
  },
})