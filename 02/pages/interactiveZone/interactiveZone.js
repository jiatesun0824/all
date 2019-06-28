const utils = require('../../utils/utils.js');
import {
  resourcePath,
  defaultImg
} from '../../utils/config.js'
const API = getApp().API;
const $App = getApp();
let animate = false;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabIndex: '0',
    searchIconShow: true,
    resourcePath: getApp().resourcePath,
    staticImageUrl: getApp().staticImageUrl,
    windowHeight: 0,
    windowWidth: 0,
    isInteractive: false, // 互动按钮
    animationData: {},
    rotateAnimation: {},
    animateSwitch: false,
    questionListOne: [],
    questionListTwo: [],
    disscuss: null,
    noMore: false,
    shareList: [],
    designList: [],
    sharePageSize: 5,
    desginPageSize: 5,
    routerType:0,
    userInfoStatus: wx.getStorageSync('userInfoStatus')
  },
  y: -120,
  page: 1,
  topicPage: 1,

  animate() {

    const animation = wx.createAnimation({

      timingFunction: 'ease',
    });
    this.animation = animation
    animation.translateY(this.y).step({
      duration: 300
    }).translateY(this.y + 5).step({
      duration: 70
    }).translateY(this.y).step({
      duration: 70
    })
    this.setData({
      animationData: animation.export()
    });
    setTimeout(function() {
      animation.translateY(this.y).step({
        duration: 300
      }).translateY(this.y + 5).step({
        duration: 70
      }).translateY(this.y).step({
        duration: 70
      })
      this.setData({
        animationData2: animation.export()
      })
    }.bind(this), 100);


  },

  recover() {
    const animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    });
    this.animation = animation
    setTimeout(() => {
      animation.translateY(100).step()
      this.setData({
        animationData2: animation.export()
      });
    }, 200);
    setTimeout(() => {
      animation.translateY(100).step()
      this.setData({
        animationData: animation.export()
      });
    }, 300);


  },

  btnRotate(deg) {
    const animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
    })

    this.animation = animation
    animation.rotate(deg).step()
    this.setData({
      rotateAnimation: animation.export()
    })

  },
  topNoMore: false,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let status=wx.getStorageSync('userInfoStatus')
    this.setData({
      userInfoStatus: status
    })
    if (options.navigateType) {
      if (options.navigateType == 'desgin') {
        this.setData({
          tabIndex: 2
        })
      }
    }
    let that = this;
    this.page = 1;
    this.topicPage = 1;

    this.setData({
      noMore: false
    })
    if (options.tabIndex == 1) {
      this.setData({
        tabIndex: 1
      })
    } else if (options.tabIndex == 2) {
      this.setData({
        tabIndex: 2
      })
    }
    this.getTopicList();
    this.getQuestionList();
    this.init(options); //初始化方法，初始赋值、接口
    wx.getSystemInfo({
      success: function(res) {
        if (res.screenWidth <= 320 && res.screenHeight <= 568) {
          that.y = -103;
        } else if (res.screenWidth > 374 && res.screenHeight > 667 && res.screenHeight < 810) {
          that.y = -132;
        } else if (res.screenWidth >= 360 && res.screenWidth < 374 && res.screenHeight < 810 && res.screenHeight >= 640) {
          that.y = -115;
        } 
        else if (res.screenWidth > 374 && res.screenWidth > 415 && res.screenHeight > 665 && res.screenHeight < 740) {
          that.y = -105;
        } else if (res.screenWidth > 374 && res.screenHeight > 810) {
          that.y = -120;
        }
      },
    })
  },
  init(e) {
    this.getList(); //大咖分享、设计改造列表
  },
  getList() {
    let param1 = {
      blockTypeValueKey: 'share',
      Start: 1,
      Limit: this.data.sharePageSize,
      status: 1
    }
    API.getTopicList(param1).then(res => {
      if (res.success) {
        this.setData({
          shareList: res.datalist
        })
      }
    })
    let param2 = {
      blockTypeValueKey: 'designReform',
      Start: 1,
      Limit: this.data.desginPageSize,

    }
    API.getTopicList(param2).then(res => {
      if (res.success) {
        this.setData({
          designList: res.datalist
        })
      }
    })
  },
  onReachBottom() {
    if (this.data.tabIndex == 1 || this.data.tabIndex == 2) {
      if (this.data.tabIndex == 1) {
        this.setData({
          sharePageSize: this.data.sharePageSize + 5,
        })
      }
      if (this.data.tabIndex == 2) {
        this.setData({
          desginPageSize: this.data.desginPageSize + 5
        })
      }
      this.getList();
    }
    let that = this;
    wx.showNavigationBarLoading();
    if (!this.data.noMore) {
      this.page++;
      let params = {
        blockTypeValueKey: 'askAndAnswer',
        Start: this.page,
        Limit: 10
      }
      API.getTopicList(params).then(res => {
        if (res.success) {
          wx.hideNavigationBarLoading();
          if (res.totalCount != 0) {
            let questionList = res.datalist;
            questionList.forEach(item => {
              item.publishTime = utils.changeTime(item.publishTime);
            });
            that.setData({
              questionListTwo: that.data.questionListTwo ? that.data.questionListTwo.concat(questionList) : questionList
            });
          } else {
            that.setData({
              noMore: true
            });

          }


        }
      })
    }



  },
  getQuestionList() {
    wx.showNavigationBarLoading();
    let that = this;
    let params = {
      blockTypeValueKey: 'askAndAnswer',
      Start: 1,
      Limit: 10
    }
    API.getTopicList(params).then(res => {
      if (res.success) {
        wx.hideNavigationBarLoading();
        let questionList = res.datalist;
        questionList.forEach(item => {
          item.publishTime = utils.changeTime(item.publishTime);
        });

        let questionListOne = questionList.splice(0, 2)
        that.setData({
          questionListOne: questionListOne,
          questionListTwo: questionList
        });
      }
    })
  },
  getTopicList() {
    let that = this;
    let params = {
      blockTypeValueKey: 'topic',
      Start: 1,
      Limit: 10
    }
    API.getTopicList(params).then(res => {
      if (res.success) {
        if (res.totalCount != 0) {
          if (res.success) {
            let disscuss = res.datalist.filter(item => {
              if (item.status == 1) {
                return item;
              }
            });
            this.setData({
              disscuss: disscuss
            });
          }
        } else {
          this.topNoMore = true
        }
      }

    })
  },
  getMoreTopic() {
    let that = this;
    if (!this.topNoMore) {
      wx.showNavigationBarLoading();
      this.topicPage++;
      let params = {
        blockTypeValueKey: 'topic',
        Start: this.topicPage,
        Limit: 10
      }
      API.getTopicList(params).then(res => {
        if (res.success) {
          wx.hideNavigationBarLoading();
          if (res.totalCount != 0) {
            let disscuss = res.datalist.filter(item => {
              if (item.status == 1) {
                return item;
              }
            })
            if (res.success) {
              this.setData({
                disscuss: that.data.disscuss ? that.data.disscuss.concat(disscuss) : disscuss
              });
            }
          } else {
            that.topNoMore = true
          }
        }

      })
    } else {
      this.topNoMore = true;
    }

  },
  /**
   * tab点击
   */
  tabClick(e) {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    let index = e.currentTarget.dataset.index,type = e.currentTarget.dataset.type
    $App.sd.track("btnclick", { "btnid": type });
    if (index == 0) {
      if(this.data.tabIndex != 0){
        this.page = 1;
        this.topicPage = 1;
        this.setData({
          noMore: false
        })
        this.getTopicList();
        this.getQuestionList();
      }
    } else if (index == 1) {
      this.getList()
    } else if (index == 2) {
      this.getList()
    }
    this.setData({
      tabIndex: index
    })
  },
  /**
   * 搜索跳转
   */
  searchFocus() {
    let type;
    switch (this.data.tabIndex) {
      case '0':
        type = "askAndAnswer";
        break;
      case '1':
        type = "share";
        break;
      case '2':
        type = "designReform";
        break;
      default:
        type = "topic";
        break;
    }
    $App.sd.track("btnclick", { "btnid": "searchFocus" }); 
    wx.navigateTo({
      url: `./search/search?type=${type}`,
    })
  },
  /**
   * 点击互动按钮打开弹窗
   */
  interactiveBtnClick() {
    let that = this;
    this.setData({
      isInteractive: true,
      animateSwitch: !that.data.animateSwitch,

    });
    $App.sd.track("btnclick", { "btnid": "interactiveBtnClick" }); 
    if (that.data.animateSwitch) {
      this.btnRotate(225);
      this.animate();
    } else {
      this.btnRotate(0);
      this.recover();
      setTimeout(() => {
        this.setData({
          isInteractive: false,
        });
      }, 400)
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  navigate(e) {
    let type = e.currentTarget.dataset.type;
    let id = e.currentTarget.dataset.id;
    if (type == 'plan') {
      $App.sd.track("btnclick", { "btnid": "plan" });
      wx.navigateTo({
        url: '/pages/casesDetail/casesDetail?id=' + id,
      })
    } else if (type == 'post') {
      $App.sd.track("btnclick", { "btnid": "post" });
      wx.navigateTo({
        url: '/pages/articlesDetail/articlesDetail?id=' + id,
      })
    } else if (type == 'design') {
      $App.sd.track("btnclick", { "btnid": "design" });
      wx.navigateTo({
        url: '/pages/desginDetail/desginDetail?id=' + id,
      })
    } else if (type == 'question') {
      $App.sd.track("btnclick", { "btnid": "question" });
      wx.navigateTo({
        url: `./interlocutionDetail/interlocutionDetail?id=${id}`,
      })
    } else if (type == 'topic') {
      $App.sd.track("btnclick", { "btnid": "topic" });
      wx.navigateTo({
        url: `./topic/topic?id=${id}`,
      })

    }
  },
  publish(e) {
    wx.setStorageSync('userInfoStatus', 1)
    this.setData({ userInfoStatus: 1})
    if (e.detail.userInfo) {
      API.saveMinProNickName({
        nickName: e.detail.userInfo.nickName,
        headPic: e.detail.userInfo.avatarUrl,
        sex: e.detail.userInfo.gender,
        province: e.detail.userInfo.province,
        city: e.detail.userInfo.city
      })
    }
    $App.sd.track("btnclick", { "btnid": "publish" });
    let type = e.currentTarget.dataset.type;
    // this.recover();
    // this.btnRotate(0);
    // this.setData({
    //   isInteractive: false
    // })
   
    if (type == 'articles') {
      wx.navigateTo({
        url: '/pages/publishArticles/publishArticles',
      });
      
    } else if (type == 'case') {
      wx.navigateTo({
        url: '/pages/publishArticles/publishArticles?type=case',
      })
    } else if (type == 'question') {
      wx.navigateTo({
        url: './issue/issue',
      });

    } else if (type == 'desgin') {
      wx.navigateTo({
        url: '/pages/desginType/desginType',
      });
    }
   setTimeout(()=>{
     this.interactiveBtnClick();
   },500)
   

  },
  onPullDownRefresh() {
    this.page = 1;
    this.setData({
      noMore: false
    })
    setTimeout(() => {
      this.getQuestionList();
      this.getTopicList();
      this.getList();
      wx.stopPullDownRefresh();
    }, 200)
  },
  // 大数据埋点
  bigDataSellingPoints() {
    $App.sd.track("pageview", {});
  },
  onShow() {
    this.setData({
      userInfoStatus: wx.getStorageSync('userInfoStatus')
    })
    if (this.data.routerType == 1){
      this.setData({ tabIndex:0 })
      wx.pageScrollTo({ scrollTop: 0 })
    }
    this.getTopicList();
    this.getQuestionList();
    this.getList();
    this.bigDataSellingPoints()
  }
})