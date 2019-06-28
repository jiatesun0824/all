import { mapState,mapActions} from 'Vuex'
const festivalActivity={
    data(){
        return{
          isMiniprogram: false, // 是否是小程序
        }
    },
    computed:{
      ...mapState('festivalActivity',['dialog','imgList','cardsInfo','taskStatus','awardData','taskList','inviteRecordData','successCardsInfo','urlParams','redPoint','movingInfo','originInfo','guideIndex'])
    },
    created() {
      this.isMiniprogramFn()
    },
    methods:{
      ...mapActions('festivalActivity',['setDialog','setCardsList','setTaskList','setAwardData','setGetTask','setInviteRecord','setSuccessCards','setUrlParams','setMsgTip','setGetMoving','setUnReceivedCard','setOriginInfo']),
      /**弹框出现禁止页面上下滑动 */
      stop () {
        document.body.style.overflow='hidden';
        //document.addEventListener("touchmove", (e)=>{e.preventDefault()}, false);//禁止页面滑动
      },
      /**弹框关闭开启页面上下滑动 */
      move(){
        document.body.style.overflow='';//出现滚动条
        //document.removeEventListener("touchmove", (e)=>{e.preventDefault()}, false);
      },
      /**复制 */
      copy() {
        this.$toast('复制成功');
    },
    /**跳转720 */
    go720() {
      let url = `${this.recommendCaseRouterUrl}token=${JSON.parse(sessionStorage.getItem('token'))}&customReferer=https://servicewechat.com/wx42e6b214e6cdaed3/devtools/page-frame.html&planId=106917&routerQueryType=seven&operationSource=1&platformCode=brand2c&isRender=0&platformNewCode=miniProgram`
      console.log(url)
      window.location.href = url
    },
    experience() {
      wx.miniProgram.switchTab({ url: `/pages/plan/house-case/house-case` })
    },
    isMiniprogramFn () { // 判断是否是小程序
      const $self = this
      function ready () { $self.isMiniprogram = (window.__wxjs_environment === 'miniprogram') }
      !window.WeixinJSBridge || !WeixinJSBridge.invoke ? document.addEventListener('WeixinJSBridgeReady', ready, false) : ready()
    }
  }
}
export default festivalActivity
