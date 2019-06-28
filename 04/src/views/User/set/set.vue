<template>
	<div class="set">
		<header>
			<i class="icon-left" @click="$router.back()"></i>
			<div class="title">个人信息</div>
			<div class="right" :style="isSubmit ? '' : 'color:#999;'" @click="save">保存</div>
		</header>
		<div class="line"></div>
		<div class="port">
				<div class="portBox bb">
					<div class="tit">头像</div>
					<img class="port-img needsclick" @click="changeHead" :src="headPicURL ? (!headPicServerURL ? (commonUserInfo.resourcesUrl + headPicURL) : headPicURL) : require('../images/headpic.png')">
					<img class="icon" src="../images/porfile_icon_open.png">
					<input type="file" ref="headPic" style="display: none;" @change="uploadPic($refs.headPic.files.item(0))" accept="image/png,image/gif,image/jpg,image/jpeg,image/bmp" class="file">
				</div>
		</div>
		<div class="item" @click="edit_nik('昵称')">
			<div class="box bb">
				<span class="tit">昵称</span>
				<span class="content">{{userInfo.userName}}</span>
				<img class="icon" src="../images/porfile_icon_open.png">
			</div>
		</div>
		<div class="item bb" @click="selsex">
			<div class="box">
				<span class="tit">性别</span>
				<span class="content">{{userInfo.sex===1?'男':'女'}}</span>
				<img class="icon" src="../images/porfile_icon_open.png">
			</div>
		</div>
    <div class="item" @click="selectSourceCompany" v-if="isIntermediary == 11">
      <div class="box">
        <span class="tit">所属企业</span>
        <span class="content">{{sourceCompany}}</span>
        <img class="icon" src="../images/porfile_icon_open.png">
      </div>
    </div>
		<!-- <div class="item" v-show="userInfo.userType == 11">
			<div class="box">
				<span class="tit">工作年限</span>
				<input class="workyear" type="number" placeholder="请输入工作年限">
			</div>
		</div> -->
		<div class="line"></div>
		<div class="item" @click="citySelectPicker">
			<div class="box bb">
				<span class="tit">城市</span>
				<span class="content">{{userInfo.cityName}}</span>
				<img class="icon" src="../images/porfile_icon_open.png">
			</div>
		</div>
    <div class="item" @click="edit_nik('邀请码')" v-if="isIntermediary == 11">
      <div class="box bb">
        <span class="tit">邀请码</span>
        <span class="content">{{InvitationCode}}</span>
        <img class="icon" src="../images/porfile_icon_open.png">
      </div>
    </div>
		<div class="item" v-show="userInfo.userType == 11" @click="$router.push('/ia')">
			<div class="box">
				<span class="tit" style="width: 2.5rem;">身份认证</span>
				<span class="content ml0">{{checkStatus}}</span>
				<img class="icon" src="../images/porfile_icon_open.png">
			</div>
		</div>

		<div class="sexSelBox" v-show="sexSel" @click="closeSexSel">

		</div>
		<div class="sexsel" v-show="sexSel">
			<div class="sexitem" v-for="(item, index) in list1" :class="{'active':item.active}" :key="index" @click="sexChange(index)">
				{{item.title}}
			</div>
			<div class="close" @click="closeSexSel">取消</div>
		</div>
    <select-upload-pic v-if="showUploadType" :showUploadTypeStatus.sync="showUploadType" @selectedPic="uploadPic"></select-upload-pic>
    <awesome-picker
      style="z-index: 1000002"
      ref="sourceCompanyPicker"
      colorConfirm="#ff6419"
      colorCancel="#333333"
      :data="sourceCompanyPickerList"
      @cancel="() => {}"
      @confirm="sureSelectCompany">
    </awesome-picker>
	</div>
</template>
<script>
  import Vue from 'vue';
	import { Style, CascadePicker } from 'cube-ui';
	import { getUserInfo, editUserInfo2b, uploaduserpic } from '@/api/user';
	import { queryProvincesAndCitiesList } from '@/api/area';
	import { find, get } from 'lodash';
	import { mapGetters, mapActions} from 'Vuex';
	import selectUploadPic from 'components/SelectUploadPic/index.vue';
	import transformIMG from 'utils/transformUploadImg';
	import { check, checkinfo, reCheck, isauthorize } from '@/api/check';

	Vue.use(CascadePicker);

  export default {
		data() {
			return {
        isIntermediary: JSON.parse(localStorage.getItem('userInfo')).userType,
        InvitationCode: '',
        sourceCompany: '',
				checkStatus:'已认证',
				nativeCamera: navigator.camera,
				headPicURL: '',
				headPicServerURL: '',
				sexSel: false,
				list1: [{title:'男',active:false},{title:'女',active:false}],
				sexValue: '男',
				allArea: '',
				visible: false,
				items: [],
				citySelectInstance: '',
				userInfo: {},
				userdata: {
					nickName: null,
					sex: null,
					// age: null,
					mobile: null,
					password: null,
					provinceCode: undefined,
					cityCode: undefined,
					// areaId: null,
					picId: null,
					// usedInvitationCode: null, // 邀请码
					sourceCompany: null // 公司名称
				},
				showUploadType: false,
				checkInfo: {}
			}
		},
		computed: {
			...mapGetters('common', {commonUserInfo: 'userInfo'}),
			...mapGetters('register', ['sourceCompanyList']),
			isSubmit() {
				return !!Object.keys(this.userdata).map(item => this.userdata[item] && this.userdata[item]).filter(item => item).length;
			},
			sourceCompanyPickerList() {
				return this.sourceCompanyList.map((item, index) => { return {index, value: item.name}});
			}
		},
		async created() {
			this.cCheck();
			await this.getCityData();
			this.getCityData('110000');
			this.headPicURL = this.commonUserInfo.userPic;
			getUserInfo().then(res=> {
				if(res.success) {
					this.userInfo = res.obj;
					this.sourceCompany = res.obj.sourceCompanyName;
					if (res.obj.usedInvitationCode) {
            			this.InvitationCode = res.obj.usedInvitationCode;
          			}
					this.headPicURL = res.obj.picPath;
					this.userInfo.sex===1?this.sexValue= '男':this.sexValue= '女';
					['nickName', 'sex', 'mobile', 'password', 'areaId', 'picId'].forEach(item => {
						this.userdata[item] = this.userInfo[item]
					})
				}
			})
		},
		methods: {
			...mapActions('register', ['queryCompanyList']),
			async selectSourceCompany() {
				await this.queryCompanyList();
				this.$refs.sourceCompanyPicker.show();
			},
			sureSelectCompany([selectCompany]) {
				this.userdata.sourceCompany = selectCompany.index + 1;
				this.sourceCompany = selectCompany.value; //
			},
			cCheck() {
				isauthorize().then(res=> {
						this.checkStatus = res.message;
				})
			},
			closeSexSel() {
				this.sexSel  = false;
			},
			selsex() {
				this.sexSel  = true;
			},
			sexChange(index) {
				this.userdata.sex = this.userInfo.sex = index ? 0 : 1;
				this.sexSel = false;
			},
			changeHead() {
				if(navigator.camera) { return this.showUploadType = true; };
				this.$refs.headPic.click();
			},
			save() {
				var that =this;
				if(this.isSubmit) {
					this.userdata.nickName = this.userInfo.userName;
					editUserInfo2b(this.userdata).then(res=> {
						if(res.success) {
							this.$toast('修改成功');
							this.commonUserInfo.userPic = !this.headPicServerURL ? this.userInfo.picPath : this.headPicServerURL;
							let userInfo = JSON.parse(localStorage.getItem('userInfo'));
							userInfo.userPic = !this.headPicServerURL ? this.userInfo.picPath : this.headPicServerURL;
							localStorage.setItem('userInfo', JSON.stringify(userInfo));
							setTimeout(function() {
								that.$router.back();
							}, 2000)
						}
						else {
							this.$toast(res.message);
						}
					})
				}
			},
			// 去编辑昵称
			edit_nik(type) {
				if (type == '邀请码' && this.InvitationCode != '') {
				return;
				}
				this.$router.push(`/user/edit_nick/${type}`);
			},
			// 去更换手机号
			changePhone() {
				this.$router.push("/user/change_phone")
			},
			async uploadPic(file) {
				!navigator.camera && (this.$refs.headPic.type = 'text');

				let data = await transformIMG(file);

				data && this.uploadHeadPic(data);

				!navigator.camera && (this.$refs.headPic.type = 'file');
			},
			uploadHeadPic({file, fileName}) {
				let formData = new FormData();
				formData.append('file', file, fileName);
				formData.append('platform', 'mobile2b');
				formData.append('type', 'image');
				formData.append('module', 'supplyDemand');
				uploaduserpic(formData).then(res => {
					if(res.status){
						this.headPicURL = URL.createObjectURL(file);
						this.headPicServerURL = res.obj.url
						this.userdata.picId = res.obj.resId;
					}else {
						this.$toast(res.message)
					}
				})
			},
			citySelectPicker() {
				if(!this.citySelectInstance) {
					this.citySelectInstance = this.$createCascadePicker({
						swipeTime: 1000,
						async: true,
						data: this.allArea,
						selectedIndex: [0, 0],
						alias: { text: 'name' },
						onChange: this.changeProvince,
						onSelect: this.selectHandle
					}).show()
				}
				this.citySelectInstance.show();
			},
			async getCityData(provinceCode) {
				if(provinceCode && find(this.allArea, {value: provinceCode})['children'].length) return;
				let { datalist } = await (provinceCode ? queryProvincesAndCitiesList(provinceCode) : queryProvincesAndCitiesList());
				if(!provinceCode) { return this.allArea = datalist.map(item => { return {name: item.areaName, value: item.areaCode, children: []}});}
				let cityData = datalist.map(item => { return {name: item.areaName, value: item.areaCode}})
				find(this.allArea, {value: provinceCode})['children'] = cityData;
			},
			async changeProvince(i, newIndex) {
				if (i === 0) {
					await this.getCityData(get(this.allArea, `${newIndex}.value`));
					this.citySelectInstance.setData(this.allArea, [newIndex, 0])
				}
			},
			selectHandle([provinceCode, cityId, cityCode], indexArr, [provinceName, cityName]) {
				this.userdata.cityCode = cityId;
				this.userdata.provinceCode = provinceCode
				this.userInfo.cityName = cityName;
			}
		},
		components: {
			selectUploadPic
		}
	}

</script>
<style lang="scss" scoped>
@import '../../../styles/header.scss';
@import './set.scss';
</style>

