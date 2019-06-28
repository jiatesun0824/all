<template>
    <div class="checkOut">
        <header>
            <i class="icon-left" @click="$router.go(-1)"></i>
            <div class="title">设置</div>
        </header>
        <div class="item" @click="changePhone">
			<div class="box bb">
				<span class="tit">手机号</span>
                <span class="content">
                    <span style="vertical-align: middle;">{{phone}}</span>
                    <img class="icon" src="../images/porfile_icon_open.png">
                </span>
			</div>
		</div>
       <div class="item" @click="changePwd">
			<div class="box bb">
				<span class="tit">修改密码</span>
                <span class="content">
                    <img class="icon" src="../images/porfile_icon_open.png">
                </span>
			</div>
		</div>
        <div class="item" @click="showSex" v-if="userInfo.isVirtual != 1">
			<div class="box bb">
				<span class="tit">所属企业</span>
                <span class="content">
                    <span class="left_tit" style="vertical-align: middle;">{{userInfo.companyName}}</span>
                    <img class="icon" src="../images/porfile_icon_open.png">
                </span>
			</div>
		</div>
        <div class="item">
            <div class="box bb">
				<span class="tit">版本</span>
                <span class="content">2.0.10</span>
			</div>
        </div>
         <div class="item" @click="$router.push({path:'/BuiAment',query:{title:'三度服务使用协议'}})">
            <div class="box bb">
				<span class="tit" style="width: auto">三度服务使用协议</span>
                <span class="content">
                    <img class="icon" src="../images/porfile_icon_open.png">
                </span>
			</div>
        </div>
        <div class="butBox">
            <span class="butSp"  @click="clearTokenAndRouter">退出登录</span>
        </div>
        <div class="sexSelBox" v-show="sexSel" @click="closeSexSel">

		</div>
		<div class="sexsel" v-show="sexSel">
			<div :style="item.active? 'color: #ff6419;': 'color: #333'" class="sexitem" v-for="(item, index) in list1" :key="index" @click="switchCompany(index)">
				{{item.name}}
			</div>
			<div class="close" @click="closeSexSel">取消</div>
		</div>
    </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'Vuex'
import { setTimeout } from 'timers';
export default {
    data() {
        return {
            phone: JSON.parse(localStorage.getItem('userInfo')).loginPhone,
            sexSel: false,
            list1: [], // 经销商企业列表
            userType: 11,
            userInfo: {}
        }
    },
    created() {
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
        this.userType = this.userInfo.userType;
        var from = new FormData();
        from.append('account', this.userInfo.mobile);
        from.append('password', localStorage.getItem('pwd'));
        if(this.userType === 3 ||this.userType === 14) {
            console.log(1);
            this.API.getFranchiserCompanyList(from).then(res=> {
                var datalist =res.datalist;
                datalist.map(item=> {
                    item.active  =false;
                    if(item.id == this.userInfo.companyId) {
                        item.active = true;
                    }
                })
                this.list1 = datalist;
            })
        }
    },
    methods: {
         ...mapActions('common', ['clearToken']),
         ...mapMutations('common', ['SET_TOKEN', 'SET_USER_INFO']),
         closeSexSel() {
             this.sexSel = false;
         },
         clearTokenAndRouter() {
            this.clearToken();
            setTimeout(() => {
                this.$router.push('/login')
            }, 500)
         },
         switchCompany(index) {
            var from = new FormData();
            from.append('account', this.userInfo.mobile);
            from.append('password', localStorage.getItem('pwd'));
            from.append('loginCompanyId', this.list1[index].id);
             this.API.switchCompany(from).then(res => {
                 if(res.success) {
                    this.list1.map(item=> {
                        item.active = false;
                    });
                    this.list1.splice(index, 1, {...this.list1[index], active: true});
                    this.sexSel = false;
                    this.userInfo = res.obj;
                    localStorage.setItem("token", res.obj.token);
                    this.SET_TOKEN(res.obj.token);
                    this.SET_USER_INFO(res.obj);
                    localStorage.setItem("userId", res.obj.id);
                 }
             })
         },
         showSex() {
             if(this.userType === 3|| this.userType === 14) {
                  this.sexSel = true;
             }
         },
         changePwd() {
             this.$router.push({
                 path:'/changepwd',
                 query: {
                     phone: this.phone
                 }
             })
         },
         // 去更换手机号
		changePhone() {
			this.$router.push("/user/change_phone")
		}
    }
}
</script>
<style lang="sass" scoped>
   @import '../../../styles/header.scss'
   @import 'checkOut.scss'
</style>
