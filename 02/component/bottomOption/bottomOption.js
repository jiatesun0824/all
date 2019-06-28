const $App = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    disscussEdit: {
      type: Boolean,
      value: false
    },
    issue: {
      type: Boolean,
      value: false
    },
    height:{
      type: Number,
      value: 0
    },
    send:{
      type: Boolean,
      value: true
    },
    userInfoStatus:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    staticImageUrl: $App.staticImageUrl
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toSend(){
      
      this.triggerEvent('toSend');
    },
    reTract(){
      this.triggerEvent('reTract');
    },
    addImg(){
      this.triggerEvent('addImg');
    }
  },
  onLoad(){
    
  }
})
