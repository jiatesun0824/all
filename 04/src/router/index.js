import Vue from 'vue';
import Router from 'vue-router';
import store from 'store';
import {get } from 'lodash';
import toast from 'components/Toast';
import loading from 'components/Loading';

const { importComponent, importView } = require(`./_import_${process.env.NODE_ENV}`);

Vue.use(Router);

let routerConf = {
    linkActiveClass: 'active',
    routes: [
        // 登陆
        {
            path: '/',
            redirect: '/home',
            component: importComponent('Layout/MenuLayout'),
            children: [
                // 同城
                {
                    path: '/home',
                    name: 'home',
                    meta: {
                        tab: 0,
                        keepNotAlive: true
                    },
                    component: importView('Home/index')
                },
                // 方案
                {
                    path: '/recom',
                    name: 'recom',
                    meta: {
                        tab: 1,
                        keepNotAlive: true
                    },
                    component: importView('Recom/main') // recom
                },
                // 户型
                {
                    path: '/search',
                    name: 'search',
                    component: importView('HouseType/main'), // search
                    redirect: '/search/area',
                    children: [
                        // 区域
                        {
                            path: 'area',
                            name: 'area',
                            meta: {
                                tab: 2,
                                keepNotAlive: true
                            },
                            component: importView('HouseType/views/area/main') // area
                        },
                        // 空间
                        {
                            path: 'space',
                            name: 'space',
                            meta: {
                                tab: 2,
                                keepNotAlive: true
                            },
                            component: importView('HouseType/views/space/main') // space
                        }
                    ]
                },
                // 设计
                {
                    path: '/design',
                    name: 'design',
                    meta: {
                        tab: 3
                    },
                    component: importView('Design/index') // design
                },
                // 我的
                {
                    path: '/user',
                    name: 'user',
                    meta: {
                        tab: 4,
                        title: '我的'
                    },
                    component: importView('User/User')
                }
            ]
        },
        {
            path: '/brokerage/:id',
            name: 'brokerage',
            meta: {
                title: '佣金明细'
            },
            component: importView('brokerage/index') // brokerage
        },
        {
            path: '/caseDetails',
            name: 'caseDetails',
            meta: {
                title: '方案详情'
            },
            component: importView('caseDetails/caseDetails') // caseDetails
        },
        {
            path: '/myModule',
            name: 'myModule',
            meta: {
                title: '我的戶型',
                keepNotAlive: true
            },
            component: importView('myModule/myModule') // setAccount
        },
        {
            path: '/ia',
            name: 'ia',
            meta: {
                title: '中介认证',
                keepNotAlive: true
            },
            component: importView('User/set/ia/ia') // setAccount
        },
        {
            path: '/Userprotocol',
            name: 'Userprotocol',
            meta: {
                title: '用户协议',
                keepNotAlive: true
            },
            component: importView('Userprotocol/Userprotocol') // Userprotocol
        },
        {
            path: '/BuiAment',
            name: 'BuiAment',
            meta: {
                title: '三度服务使用协议',
                keepNotAlive: true
            },
            component: importView('Userprotocol/BuiAment') // Userprotocol
        },
        {
            path: '/setAccount',
            name: 'setAccount',
            meta: {
                title: '设置账号',
                keepNotAlive: true
            },
            component: importView('setAccount/setAccount') // setAccount
        },
        {
            path: '/cumstomer',
            name: 'cumstomer',
            meta: {
                title: '客服页面',
                keepNotAlive: true
            },
            component: importView('cumstomer/cumstomer') // setAccount
        },
        {
            path: '/login',
            name: 'login',
            meta: {
                keepNotAlive: true
            },
            component: importView('Login/main') // login
        },
        {
            path: '/account',
            name: 'account',
            component: importView('Account/account')
        },
        // 首次登陆
        {
            path: '/firstLogin',
            name: 'firstLogin',
            component: importView('FirstLogin/index') // firstLogin
        },
        // 修改手机号
        {
            path: '/setPhone',
            name: 'setPhone',
            component: importView('SetPhone/index') // setPhone
        },
        // 注册
        {
            path: '/register',
            name: 'register',
            meta: {
                title: '账号注册',
                keepNotAlive: true
            },
            component: importView('Register/index')
        },
        // 搜索
        {
            path: '/unionSearch',
            name: 'unionSearch',
            meta: {
                title: '搜索',
                keepNotAlive: true
            },
            component: importView('Search/index')
        },
        // 搜索结果
        {
            path: '/searchResult',
            name: 'searchResult',
            meta: {
                title: '搜索结果',
                keepNotAlive: true
            },
            component: importView('Search/result')
        },
        {
            path: '/searchService',
            name: 'searchService',
            meta: {
                title: '搜索结果',
                keepNotAlive: true
            },
            component: importView('Search/serviceResult')
        },
        // 充值结果
        {
            path: '/payresult',
            name: 'payresult',
            component: importView('PayResult/index') // payresult
        },
        // 重新充值
        {
            path: '/rechargeresult',
            name: 'rechargeresult',
            component: importView('RechargeResult/index') // rechargeresult
        },
        // 积分充值
        {
            path: '/payopen',
            name: 'payopen',
            component: importView('PayOpen/index') // payopen
        },
        // 充值页面
        {
            path: '/paypage',
            name: 'paypage',
            component: importView('PayPage/index') // paypage
        },
        // 户型区域搜索详情
        {
            path: '/typechange/:id?/:title?',
            name: 'typechange',
            meta: {
                keepNotAlive: true
            },
            component: importView('AreaDetail/main'), // typechange
            props: true
        },
        // 一键装修
        {
            path: '/fastDecorate/:id',
            name: 'fastDecorate',
            meta: {
                keepNotAlive: true
            },
            component: importView('FastDecorate/main') // fastDecorate
        },
        // 装进我家渲染
        {
            path: '/putInHouse/:id?/:houseId?/:houseType?/:groupPrimaryId?',
            name: 'putInHouse',
            meta: {
                keepNotAlive: true
            },
            component: importView('PutInHouse/index') // putinhouse
        },
        // 装进我家
        {
            path: '/recomsearch',
            name: 'recomsearch',
            component: importView('RecomSearch/index'), // recomsearch,
            redirect: '/recomsearch/area'
        },

        // 按区域
        {
            path: '/detail/:id',
            name: 'detail',
            meta: {
                title: '详情页',
                keepNotAlive: true
            },
            component: importView('Detail/index')
        },
        // 同城详情
        {
            path: '/tcdetail/:id',
            name: 'tcdetail',
            meta: {
                title: '同城详情页',
                keepNotAlive: true
            },
            component: importView('TcDetail/tcdetail')
        },
        // 供求列表
        {
            path: '/supplyList',
            name: 'supplyList',
            meta: {
                title: '供求列表',
                keepNotAlive: true
            },
            component: importView('List/supplyList')
        },
        // 服务列表
        {
            path: '/serviceList',
            name: 'serviceList',
            meta: {
                title: '',
                keepNotAlive: true
            },
            component: importView('List/serviceList')
        },
        // 博文/案例详情
        {
            path: '/details/:id',
            name: 'details',
            meta: {
                title: '',
                keepNotAlive: true
            },
            component: importView('TcDetail/components/details')
        },
        // 分享
        {
            path: '/share',
            name: 'share',
            meta: {
                title: ''
            },
            component: importView('Share/index')
        },
        // 家装服务发布
        {
            path: '/homeService/:type',
            name: 'homeService',
            meta: {
                title: '家装服务发布',
                keepNotAlive: true
            },
            component: importView('Release/index'),
            props: true
        },
        // 发布
        {
            path: '/chooseRelease',
            name: 'chooseRelease',
            meta: {
                title: '选择发布类型'
            },
            component: importView('Release/chooseRelease')
        },
        // 图片
        {
            path: '/imgBox',
            name: 'imgBox',
            meta: {
                title: ''
            },
            component: importView('Release/imgBox')
        },
        // 图片裁剪
        {
            path: '/cutImg',
            name: 'cutImg',
            meta: {
                title: '图片编辑器'
            },
            component: importView('Release/cutImg')
        },
        { // 发布子模块
            path: '/user/issue',
            name: 'issue',
            meta: {
                title: '我的发布'
            },
            component: importView('User/Issue/Issue')
        },
        { // 钱包子模块
            path: '/user/wallet',
            name: 'wallet',
            meta: {
                title: '钱包',
                keepNotAlive: true
            },
            component: importView('User/Wallet/Wallet')
        },
        { // 钱包子模块银行
            path: '/user/wallet/bank',
            name: 'bank',
            meta: {
                title: '银行',
                keepNotAlive: true
            },
            component: importView('User/Wallet/Bank/Bank')
        },
        { // 钱包子模块添加银行卡
            path: '/user/wallet/addbank',
            name: 'addbank',
            meta: {
                title: '添加银行卡',
                keepNotAlive: true
            },
            component: importView('User/Wallet/Bank/AddBank/AddBank')
        },
        { // 钱包子模块选择银行卡
            path: '/user/wallet/selbankcard',
            name: 'selbankcard',
            meta: {
                title: '选择银行卡',
                keepNotAlive: true
            },
            component: importView('User/Wallet/Bank/selBankCard/selBankCard')
        },
        { // 钱包子模块添加银行卡信息
            path: '/user/wallet/addbankinfo',
            name: 'addbankinfo',
            meta: {
                title: '添加银行卡信息',
                keepNotAlive: true
            },
            component: importView('User/Wallet/Bank/AddBank/AddBankInfo/AddBankInfo')
        },
        { // 钱包子模块验证银行卡手机号
            path: '/user/wallet/addbankphone',
            name: 'addbankphone',
            meta: {
                title: '验证银行卡手机号',
                keepNotAlive: true
            },
            component: importView('User/Wallet/Bank/AddBank/AddBankInfo/AddBankPhone/AddBankPhone')
        },
        { // 钱包子模块佣金明细
            path: '/user/wallet/commission',
            name: 'commission',
            meta: {
                title: '佣金明细',
                keepNotAlive: true
            },
            component: importView('User/Wallet/Commission/Commission')
        },
        { // 钱包子模块收支明细
            path: '/user/wallet/inex',
            name: 'inex',
            meta: {
                title: '收支明细',
                keepNotAlive: true
            },
            component: importView('User/Wallet/InEx/InEx')
        },
        { // 钱包子模块充值
            path: '/user/wallet/recharge',
            name: 'recharge',
            meta: {
                title: '充值',
                keepNotAlive: true
            },
            component: importView('User/Wallet/Recharge/Recharge')
        },
        { // 钱包子模块充值结果
            path: '/user/wallet/rechargereseut',
            name: 'rechargereseut',
            meta: {
                title: '充值结果',
                keepNotAlive: true
            },
            component: importView('User/Wallet/Recharge/RechargeReseut/RechargeReseut')
        },
        { // 钱包子模块提现
            path: '/user/wallet/withdraw',
            name: 'withdraw',
            meta: {
                title: '提现',
                keepNotAlive: true
            },
            component: importView('User/Wallet/Withdraw/Withdraw')
        },
        { // 钱包子模块提现结果
            path: '/user/wallet/withdrawreseut',
            name: 'withdrawreseut',
            meta: {
                title: '提现结果',
                keepNotAlive: true
            },
            component: importView('User/Wallet/Withdraw/WithdrawReseut/WithdrawReseut')
        },
        { // 设置子模块
            path: '/user/set',
            name: 'userSet',
            meta: {
                title: '设置',
                keepNotAlive: true
            },
            component: importView('User/set/set')
        },
        { // 修改密码
            path: '/changepwd',
            name: 'changepwd',
            meta: {
                title: '修改密码',
                keepNotAlive: true
            },
            component: importView('User/checkOut/changepwd')
        },
        { // 设置子模块编辑昵称
            path: '/user/edit_nick/:type',
            name: 'edit_nick',
            meta: {
                title: '设置'
            },
            component: importView('User/set/edit_nick/edit_nick')
        },
        { // 退出登录
            path: '/checkout',
            name: 'checkout',
            meta: {
                title: '退出登录',
                keepNotAlive: true
            },
            component: importView('User/checkOut/index')
        },
        { // 设置子模块更换手机号
            path: '/user/change_phone',
            name: 'change_phone',
            meta: {
                title: '更换手机号',
                keepNotAlive: true
            },
            component: importView('User/set/change_phone/change_phone')
        },
        { // 邀请子模块
            path: '/user/invite',
            name: 'invite',
            meta: {
                title: '我的邀请',
                keepNotAlive: true
            },
            component: importView('User/invite/main')
        },
        { // 留言子模块
            path: '/user/message',
            name: 'message',
            meta: {
                title: '我的留言',
                keepNotAlive: true
            },
            component: importView('User/message/message')
        },
        { // 留言子模块
            path: '/user/chat',
            name: 'chat',
            meta: {
                title: '留言详情',
                keepNotAlive: true
            },
            component: importView('User/message/chat/chat')
        },
        { // 收藏子模块
            path: '/collect',
            name: 'collect',
            meta: {
                title: '收藏',
                keepNotAlive: true
            },
            component: importView('User/collect/collect')
        },
        { // 意见反馈
            path: '/feedback',
            name: 'feedback',
            meta: {
                title: '意见反馈',
                keepNotAlive: true
            },
            component: importView('User/feedback/feedback')
        },
        { // 反馈记录
            path: '/feedRecord',
            name: 'feedRecord',
            meta: {
                title: '反馈记录',
                keepNotAlive: true
            },
            component: importView('User/feedRecord/feedRecord')
        },
        { // 反馈详情
            path: '/feedDeatil',
            name: 'feedDeatil',
            meta: {
                title: '反馈详情',
                keepNotAlive: true
            },
            component: importView('User/feedDeatil/feedDeatil')
        },
        { // 任务子模块
            path: '/replace',
            name: 'replace',
            meta: {
                title: '任务',
                keepNotAlive: false,
                isCache:false
            },
            component: importView('User/replace/replace')
        },
        // 修改密码
        {
            path: '/reset',
            name: 'reset',
            component: importView('Reset/index') // reset
        },
        // 公司列表
        {
            path: '/company',
            name: 'company',
            component: importView('Company/index') // company
        },
        // 一键装修里的
        {
            path: '/landscape',
            name: 'landscape',
            component: importView('LandScape/index') // landscape
        },
        // 上传户型
        {
            path: '/sethouse',
            name: 'sethouse',
            meta: {
                keepNotAlive: true
            },
            component: importView('UploadHouseInfo/main') // sethouse
        },
        // 720视图
        {
            path: '/view720/:uuid?',
            name: 'view720',
            meta: {
                keepNotAlive: true
            },
            component: importView('View720/index') // view720
        },
        // 图片视图
        {
            path: '/photoview/:page/:id',
            name: 'photoview',
            meta: {
                keepNotAlive: true
            },
            component: importView('PhotoView/main'), // photoview
            props: true
        },
        // 视频视图
        {
            path: '/videoview',
            name: 'videoview',
            component: importView('VideoView/main') // videoview
        },
        // 全屏视图
        {
            path: '/fullview',
            name: 'fullview',
            component: importView('FullView/index') // fullview
        },
        // 形状改变
        {
            path: '/shapechange',
            name: 'shapechange',
            component: importView('ShapeChange/index') // shapechange
        },
        // 城市选择
        {
            path: '/CitySelector',
            name: 'CitySelector',
            component: importComponent('CitySelector/index') // CitySelector
        },
        // 活动页面
        {
            path: '/ActivePage',
            name: 'ActivePage',
            component: importView('ActivePage/index') // ActivePage
        },
        //平台派单
        {
            path: '/robOrder',
            name: 'robOrder',
            component: importView('robOrder/index') // robOrder
        },
        //报价
        {
            path: '/offerPrice/:id',
            name: 'offerPrice',
            component: importView('robOrder/offerPrice') // offerPrice
        },
        {
            path: '/orderDetail/:id',
            name: 'orderDetail',
            meta: {
                keepNotAlive: true
            },
            component: importView('robOrder/detail') // detail
        },
        // 我的客户
        {
            path: '/mycumser',
            name: 'mycumser',
            meta: {
                keepNotAlive: true
            },
            component: importView('Mycumser/mycumser') // mycumser
        },
        { // 我的客户——设置
            path: '/mycumser_set',
            name: 'mycumser_set',
            component: importView('Mycumser/myCumserSet/myCumserSet') // mycumser_set
        },
        { // 我的客户详情
            path: '/mycumser_detail',
            name: 'mycumser_detail',
            meta: {
                keepNotAlive: true
            },
            component: importView('Mycumser/myCumserDeatil/myCumserDeatil') // mycumser_detail
        },
        { // 我的客户——编辑
            path: '/myCumserEdit',
            name: 'myCumserEdit',
            component: importView('Mycumser/myCumserEdit/myCumserEdit') // myCumserEdit
        },
        { // 限时快抢
            path: '/timerob',
            name: 'timerob',
            meta: {
                keepNotAlive: true
            },
            component: importView('TimeRob/TimeRob') // TimeRob
        },
        { // 限时快抢详情
            path: '/timerobdetail',
            name: 'timerobdetail',
            component: importView('TimeRob/TimeRobDetail/TimeRobDetail') // TimeRobDetail
        }, ,
        { // 我的名片
            path: '/busCard',
            name: 'busCard',
            meta: {
                keepNotAlive: true
            },
            component: importView('User/busCard/busCard') // busCard
        },
        { // 编辑名片
            path: '/editBusCard',
            name: 'editBusCard',
            meta: {
                keepNotAlive: true
            },
            component: importView('User/editBusCard/editBusCard') // editBusCard
        },
        { // 名片访问
            path: '/visitCard',
            name: 'visitCard',
            meta: {
                keepNotAlive: true
            },
            component: importView('User/visitCard/visitCard') // visitCard
        },
        { // 意向客户
            path: '/intenCumer',
            name: 'intenCumer',
            meta: {
                keepNotAlive: true
            },
            component: importView('User/intenCumer/intenCumer') // intenCumer
        },
        { // 名片详情
            path: '/cardDetail',
            name: 'cardDetail',
            meta: {
                keepNotAlive: true
            },
            component: importView('User/cardDetail/cardDetail') // cardDetail
        },
        // {
        //     //退款流程详情页面
        //     path: '/refundDetail',
        //     name: 'refundDetail',
        //     component: importView('refundProcess/index') // refundDetail
        // },
        {
            //退款原因
            path: '/refundWhy',
            name: 'refundWhy',
            component: importView('refundWhy/index') // refundDetail
        },
        // {
        //   //订单备注页面
        //   path: '/orderRemark',
        //   name: 'orderRemark',
        //   component: importView('orderRemark/index') // refundDetail
        // }

    ]
};
process.env.BUILD_TYPE === 'web' && (routerConf.mode = 'history');
const router = new Router(routerConf);

router.beforeEach((to, from, next) => {
    if (to.name !== 'login') {
        if (store.state.common.token) {
            if (store.state.common.userInfo.tipsFlag && (new Date(new Date(new Date().toLocaleDateString()) - new Date(store.state.common.userInfo.loginDay)).getDate() - (store.state.common.userInfo.remainingDays + 1) >= 0)) {
                console.log(1);
                store.dispatch('common/clearToken');
                toast('套餐到期，请联系客服！');
                next('/cumstomer');
            } else {
                (get(to.meta, 'tab') || get(to.meta, 'tab') === 0) && store.dispatch('bottomMenu/changeActiveTab', to.meta.tab);
                from.name !== to.name && next();
            }
        } else {
            let str = 'register|resetpw|404|share|changepwd|cumstomer|setAccount|Userprotocol|BuiAment'
            str.indexOf(to.name) !== -1 ? next() : next('/login')
        }
    } else {
        store.state.common.token ? next(from.name) : next();
    }
});

router.afterEach((to, from) => { loading.close(); });

export default router;
