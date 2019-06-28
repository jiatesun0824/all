import { findIndex, debounce } from "lodash";
import baseAPI from '../api/baseAPI';
var mixin = {
    data() {
        return {
            // user:'',
            file: ''
        }
    },
    methods: {
        checkStoragePermission() {
            // return new Promise((resolve, reject) => {
            try {
                let permissions = cordova.plugins.permissions;
                permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, status => {
                    if (status.hasPermission) {
                        resolve(true);
                    } else {
                        permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, () => resolve(true), e => reject(e))
                    }
                }, null);
            } catch (e) {
                console.log(e)
            }
            // });
        },
        fileChange(el) { // 图片选择完成之后触发
            this.file = el.target.files[0];
            if (!el.target.files[0].size) return
            this.fileList(el.target)
            el.target.value = ''
        },
        fileList(fileList) { // 如果是多张图片 就有多个file
            let files = fileList.files
            for (let i = 0; i < files.length; i++) {
                // console.log(files[i])
                if (files[i].type != '') {
                    this.fileAdd(files[i])
                }
            }
        },
        fileAdd(file) {
            let _this = this;
            if (this.limit !== undefined) this.limit--
                if (this.limit !== undefined && this.limit < 0) return
                    // 总大小
            this.size = this.size + file.size
                // 判断是否为图片文件
            if (file.type.indexOf('image') == -1) { // 不是图片文件
                this.$toast('请选择图片文件')
            } else { // 是图片文件
                let reader = new FileReader()
                let image = new Image()
                reader.readAsDataURL(file) // FileReader接口的readAsDataURL方法实现图片的预览。
                reader.onload = function() {
                    file.src = this.result
                    image.onload = function() {
                        let width = image.width
                        let height = image.height
                        file.width = width
                        file.height = height
                        _this.callback(file)
                            // _this.$store.state.release.imgList.push({
                            //   file
                            // })
                            // _this.$router.push('/imgBox')
                            // _this.imgList.push({ file })
                            // console.log(_this.$store.state.release.imgList)
                    }
                    image.src = file.src
                }
            }
        },

        // 返回首页
        goShop() {
            this.$router.push("/home")
        },
        timeFn(d1) { //di作为一个变量传进来
            //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
            var dateBegin = new Date(d1.replace(/-/g, "/")); //将-转化为/，使用new Date
            var dateEnd = new Date(); //获取当前时间
            var dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
            var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
            var leave1 = dateDiff % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
            var hours = Math.floor(leave1 / (3600 * 1000)) //计算出小时数
                //计算相差分钟数
            var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000)) //计算相差分钟数
                //计算相差秒数
            var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
            var seconds = Math.round(leave3 / 1000)
            var timeDiff = [dayDiff, hours, minutes, seconds];
            return timeDiff;
        },
        // 点击进入720
        go720: debounce(function(item) {
            if (this.$route.path == '/view720') return;
            this.$store.state.goBackPath = this.$route.path;
            sessionStorage.setItem('operationSource', 0);
            sessionStorage.setItem('routerQueryType', 'seven');
            sessionStorage.setItem('msgId', 'recommended');
            // this.$store.commit('audioAutoPlay');
            this.$store.state.isCollectIndex = this.index;
            this.$store.state.view720.view720Id = item.planRecommendedId;
            sessionStorage.setItem('view720Id', item.planRecommendedId);
            sessionStorage.setItem('planId', item.planId);
            sessionStorage.setItem('groupPlanId', item.planRecommendedId);
            sessionStorage.setItem('groupType', 0); // 设置组合替换类型
            sessionStorage.setItem('bid', item.bid);
            this.$store.state.detailsSeeType = ''; //recomGetPictureList之前的   planRecommendedId: item.planRecommendedId,


            sessionStorage.setItem('planRecommendedId', item.planRecommendedId);
            this.$store.state.renderSign = false;
            this.$store.commit('showComComponents', false);
            // this.$store.state.view720.view720Small = response.datalist;
            this.$store.state.view720.view720Small = item.planPicPath;
            this.$store.state.smallTitle = item.planName;
            this.$store.state.fromPath = 'recom';
            this.$store.state.view720LoadingFlag = true;
            this.$store.state.recomSelIndex = this.index;
            this.$store.state.fasttype = 'recommended';
            this.$router.push({ name: 'view720', params: { uuid: item.fullHousePlanUUID } });
        }, 20),
        collectNum(type) {
            let self = this;
            try {
                //重新获取设备信息
                if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //ios
                    this.commonTotal(type)
                } else { //android
                    device.getInfo(function(info) {
                        //alert(JSON.stringify(info))
                        localStorage.setItem('deviceInfo', JSON.stringify(info));
                        self.commonTotal(type)
                    }, function(e) {
                        console.log(e)
                    });
                }
            } catch (e) {

            }
        },
        commonTotal(type) {
            let deviceInfo = JSON.parse(localStorage.getItem('deviceInfo'));
            this.API.collectsave({
                androidId: '', //android
                uuid: deviceInfo.uuid, //android
                appIp: '',
                appName: '三度云管家',
                appVersion: '2.0.8',
                idfa: deviceInfo.idfa, //ios
                imei: deviceInfo.imei,
                mac: '',
                openId: '',
                os: deviceInfo.platform,
                osVersion: deviceInfo.version,
                phoneModel: deviceInfo.model,
                recordType: type, //1启动，2.注册 3.登录
                screenHeight: window.screen.height,
                screenWidth: window.screen.width,
                udid: '', //ios
                userAgent: navigator.userAgent,
                userId: localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).id,
                phoneBrand: deviceInfo.manufacturer
            }).then(res => {
                //alert(JSON.stringify(res))
            })
        }
    },
    filters: {
        filtersIMg(val) {
            return baseAPI.resourceURL + val;
        },
        timeFilter: function(value) {
            /*本期结束倒计时，24小时倒计时*/
            if (value == undefined) {
                return ''
            } else {
                let times = value / 1000;
                let ss = Math.floor(times / 60 / 60 % 24).toString();
                if (ss.length <= 1) {
                    ss = "0" + ss; //时
                }
                let fs = Math.floor(times / 60 % 60).toString();
                if (fs.length <= 1) {
                    fs = "0" + fs; //分
                }
                let ms = Math.floor(times % 60).toString();
                if (ms.length <= 1) {
                    ms = "0" + ms; //秒
                }
                return ss + ':' + fs + ":" + ms
            }
        },
        timeFilterFen: function(value) {
            /*本期结束倒计时,15分钟倒计时*/
            if (value == undefined) {
                return ''
            } else {
                let times = value / 1000;
                let ss = Math.floor(times / 60 / 60 % 24).toString();
                if (ss.length <= 1) {
                    ss = "0" + ss; //时
                }
                let fs = Math.floor(times / 60 % 60).toString();
                if (fs.length <= 1) {
                    fs = "0" + fs; //分
                }
                let ms = Math.floor(times % 60).toString();
                if (ms.length <= 1) {
                    ms = "0" + ms; //秒
                }
                return fs + ":" + ms
            }
        },
    },
    created() {
        this.probeType = 3 // scroll组件需要实施派发scroll事件，且支持swipe
        this.listenScroll = true // scroll组件监听scroll事件并派发滚动位置
    }
}

export default mixin