const utils = require('../../../utils/utils.js');
const API = getApp().API;
const $App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText: '',
    staticImageUrl: $App.staticImageUrl,
    resourcePath: $App.resourcePath,
    keyWordExist: true,
    searchResult: [],
    keyword: [],
    noData: false,
    type: ''
  },
  keyWordArr: [],
  page: 1,


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let searchtype;
    switch (options.type) {
      case 'askAndAnswer':
        searchtype = 'askAndAnswer';
        wx.setNavigationBarTitle({
          title: '搜索问答',
        });
        break;
      case 'share':
        searchtype = 'post';
        wx.setNavigationBarTitle({
          title: '搜索大咖分享',
        });
        break;
      case 'designReform':
        searchtype = 'designReform';
        wx.setNavigationBarTitle({
          title: '搜索设计改造',
        });
        break;
      case 'topic':
        searchtype = 'topic';
        wx.setNavigationBarTitle({
          title: '搜索话题',
        });
        break;
    }
    this.setData({
      type: options.type,
      searchtype: searchtype,
      noData: false,
    });
    this.page = 1;
    if (wx.getStorageSync('keyWord')) {
      console.log("111");
      this.keyWordArr = wx.getStorageSync('keyWord');
      this.setData({
        keyword: that.keyWordArr
      });
    }

  },
  inputFocus(e) {
    this.setData({
      searchText: e.detail.value.replace(/\s+/g, '')
    });

  },
  /**
   * 搜索事件
   */
  toSearch() {
    console.log(this.data.searchText)
    if (this.data.searchText) {
      this.keyWordArr.unshift(this.data.searchText);
      let set = new Set(this.keyWordArr);
      let newArr = Array.from(set);
      wx.setStorageSync('keyWord', newArr);
      let that = this;
      let params = {
        blockTypeValueKey: this.data.type,
        Start: 1,
        Limit: 6
      }
      if (this.data.type == 'designReform') {
        params.content = this.data.searchText;
      } else {
        params.title = this.data.searchText;
      }
      API.getTopicList(params).then(res => {
        if (res.success) {
          if (res.totalCount != 0) {
            res.datalist.forEach(item => utils.changeTime(item.gmtModified));
            that.setData({
              keyWordExist: false,
              searchResult: res.datalist
            });
          } else {
            this.setData({
              keyWordExist: false,
              noData: true, // 如果没有数据
              searchResult: []
            });
          }
        }
      })

    } else {
      wx.showToast({
        icon: 'none',
        title: '请输入关键词',
      })
    }

  },
  /**删除关键字 */
  deleteWord() {
    wx.setStorageSync('keyWord', null);
    wx.showToast({
      title: '删除成功',
    });
    this.keyWordArr = [];
    this.setData({
      keyword: []
    })
  },
  keyWordSearch(e) {
    this.setData({
      searchText: e.currentTarget.dataset.keyword
    });
    this.toSearch();

  },
  navigate(e) {
    let type = e.currentTarget.dataset.type;
    let id = e.currentTarget.dataset.id;

    if (type == 'share') {
      wx.navigateTo({
        url: `/pages/casesDetail/casesDetail?id=${id}`,
      })
    } else if (type == 'post') {
      let articletype = e.currentTarget.dataset.articletype;
      console.log(articletype);
      if (articletype == 'article') {
        wx.navigateTo({
          url: `/pages/articlesDetail/articlesDetail?id=${id}`,
        })
      } else if (articletype == 'tag') {
        wx.navigateTo({
          url: `/pages/casesDetail/casesDetail?id=${id}`,
        })

      }

    } else if (type == 'designReform') {
      wx.navigateTo({
        url: `/pages/desginDetail/desginDetail?id=${id}`,
      })
    } else if (type == 'askAndAnswer') {
      let answerCount = e.currentTarget.dataset.count;
      wx.navigateTo({
        url: `../interlocutionDetail/interlocutionDetail?id=${id}`,
      })
    } else if (type == 'topic') {
      wx.navigateTo({
        url: `../topic/topic?id=${id}`,
      })
    }
  },
  goBack() {
    wx.navigateBack();
  },
  onReachBottom() {
    if (!this.data.noData) {
      this.page++;
      if (this.data.searchText) {
        let that = this;
        let params = {
          blockTypeValueKey: this.data.searchtype,
          Start: this.page,
          Limit: 6
        }
        if (this.data.type == 'designReform') {
          params.content = this.data.searchText;
        } else {
          params.title = this.data.searchText;
        }
        API.getTopicList(params).then(res => {
          if (res.success) {
            if (res.totalCount != 0) {
              res.datalist.forEach(item => utils.changeTime(item.gmtModified));
              that.setData({
                keyWordExist: false,
                searchResult: that.data.searchResult ? that.data.searchResult.concat(res.datalist) : res.datalist
              });
            } else {
              this.setData({
                keyWordExist: false,
                noData: true, // 如果没有数据
                searchResult: []
              });
            }
          }
        })

      } else {
        wx.showToast({
          icon: 'none',
          title: '请输入关键词',
        })
      }
    }
  }
})