import { mapActions } from 'vuex'

export const indexMixin = {
  data () {
    return {
      isMiniprogram: false, // 是否是小程序
      masterList: [],
      more: []
    }
  },
  created () {
    this.commonInit() // 初始化
  },
  methods: {
    ...mapActions(['setToken', 'setReferer', 'setUserId']),
    commonInit () {
      let query = this.$route.query;
      this.setToken(query.token);
      this.setReferer(query.referer);
      this.setUserId(query.userId);
      this.isMiniprogramFn();
      if (this.$route.path == '/personalPublicity') {
        this.more = [
          {
            img: 'https://show.sanduspace.com/AA/c_companyShop/2018/08/09/13/company/companyShop/logoPic/573432_1533793966247_1.png',
            name: '李卫',
            region: '天津',
            id: 82
          },
          {
            img: 'https://show.sanduspace.com/AA/c_companyShop/2018/08/31/18/company/companyShop/logoPic/744933_1535709876120_1.jpg',
            name: '廖亮亮',
            region: '浙江 · 衢州',
            id: 157
          },
          {
            img: 'https://show.sanduspace.com/AA/c_companyShop/2018/10/11/11/company/companyShop/logoPic/659347_1539227100056_1.png',
            name: '何虹霏',
            region: '广西 · 柳州',
            id: 1183
          },
          {
            img: 'https://show.sanduspace.com/AA/c_companyShop/2018/08/08/17/company/companyShop/logoPic/550819_1533721627648_1.jpg',
            name: '肖冰',
            region: '湖南 · 株洲',
            id: 76
          },
          {
            img: 'https://show.sanduspace.com/AA/c_companyShop/2018/08/09/16/company/companyShop/logoPic/272698_1533803695086_1.png',
            name: '卢婷',
            region: '江苏 · 南京',
            id: 98
          },
          {
            img: 'https://show.sanduspace.com/AA/c_companyShop/2018/08/09/15/company/companyShop/logoPic/565954_1533800035338_1.png',
            name: '刘飞路明',
            region: '湖北 · 武汉',
            id: 94
          },
        ]
        this.masterList = [
          {
            name: '光胜男',
            gender: '女',
            shopId: "1487",
            companyId: '6531',
            headImg: '../../static/image/head1.png',
            profession: '高级室内设计师',
            company: '深圳上森室内建筑设计有限公司',
            experience: '95后设计新咖<br>随选网新星设计师',
            plan: [],
            al: []
          },
          {
            name: '芦晴',
            gender: '女',
            shopId: "85",
            companyId: '3278',
            headImg: '../../static/image/head2.png',
            profession: '创始人及设计总监',
            company: '金朗枫设计事务所及金朗枫软装设计工作室',
            experience: '设计经验：14年以上<br>擅长风格：现代简约、现代奢华、北欧<br>荣誉：中国建筑装饰协会高级建筑师<br>中国国际装饰协会会员<br>《家居大变身》节目特约设计师',
            plan: [],
            al: []
          },
          {
            name: '杨海涛',
            gender: '男',
            shopId: "78",
            companyId: '3274',
            headImg: '../../static/image/head3.png',
            profession: '创始人及首席设计师',
            company: '武汉海尚建筑装饰设计公司',
            experience: '设计经验：15年以上<br>擅长风格：现代简约、现代奢华、简欧、中式<br>荣誉：亚太空间设计师国际代表<br>中国建筑协会高级室内设计师&建筑师<br>湖北建筑装饰协会会员',
            plan: [],
            al: []
          },
          {
            name: '周莉莉',
            gender: '女',
            shopId: "106",
            companyId: '3312',
            headImg: '../../static/image/head4.png',
            profession: '南京分公司主任设计师',
            company: '东易日盛装饰集团',
            experience: '擅长风格：现代简约、现代奢华、新古典、中式<br>荣誉：中建装协会高级室内建筑师<br>中建装协会高级住宅设计师<br>2007年全国品味空间感<br>2008年度南京十佳设计师金奖<br/>2014年“金外滩奖”最佳别墅空间设计感<br/>2016年“总评榜”最佳住宅设计奖',
            plan: [],
            al: []
          },
          {
            name: '宋阳',
            gender: '男',
            shopId: "101",
            companyId: '3320',
            headImg: '../../static/image/head5.png',
            profession: '首席设计师',
            company: '湖北武汉顶层设计',
            experience: '设计经验：10年以上<br>擅长风格：现代简约、地中海、新中式、美式<br>荣誉：中建装协会高级室内建筑师<br>中建装协会高级室内住宅设计师',
            plan: [],
            al: []
          }
        ]
      }
    },
    isMiniprogramFn () { // 判断是否是小程序
      const $self = this
      function ready () { $self.isMiniprogram = (window.__wxjs_environment === 'miniprogram') }
      !window.WeixinJSBridge || !WeixinJSBridge.invoke ? document.addEventListener('WeixinJSBridgeReady', ready, false) : ready()
    }
  },
  computed: {
  }
}
