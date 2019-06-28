<template>
	<div class="set">
		<header>
			<i class="icon-left" @click="$router.go(-1)"></i>
			<div class="title">身份认证</div>
		</header>
		<div class="line"></div>
		<div class="item">
			<div class="box bb">
				<span class="tit">认证状态</span>
				<span class="content">{{checkStatusTit}}</span>

			</div>
		</div>
		<div class="item" v-if="checkStatus">
			<div class="box bb">
				<span class="tit">申请时间</span>
				<span class="content">{{checkInfo.createTime}}</span>

			</div>
		</div>
        <div class="item" v-if="checkStatus">
			<div class="box bb">
				<span class="tit">认证时间</span>
				<span class="content">{{checkInfo.gmtModified}}</span>

			</div>
		</div>
		<div class="item">
			<div class="box bb">
				<span class="tit">真实姓名</span>
				<input v-model="check.cardName" @input="showChange()" class="workyear" type="text" placeholder="请输入姓名">
			</div>
		</div>
    <div class="item" @click="selectSourceCompany" v-if="isIntermediary == 11">
      <div class="box bb">
        <span class="tit">所属企业</span>
        <span class="content">{{sourceCompany}}</span>
      </div>
    </div>
    <div class="item">
			<div class="box bb">
				<span class="tit">证件类型</span>
				<span class="content">工作证</span>
      </div>
		</div>
		<div class="item">
			<div class="box">
				<span class="tit">证件号码</span>
				<input maxlength="18" v-model="check.cardNumber" @input="showChange()" class="workyear" type="text" placeholder="请输入证件号">
			</div>
		</div>
		<div class="line"></div>
        <div class="imgbox">
            <div class="title">
                <span class="tit">证件照片</span><span class="tit_t">(请上传证件正面)</span>
            </div>
			<ul>
				<li v-if="checkImgUrl!=''">
						<img :src="checkImgUrl">
						<i class="ic-del" @click="delImg"></i>
				</li>
				<li v-else class="add-box needsclick" @click="showSelectUpload">
						<input type="file" ref="uploadField" style="display: none;" @change="uploadPic($refs.uploadField.files.item(0))" class="upload-img needsclick" accept="image/png,image/gif,image/jpg,image/jpeg,image/bmp">
						<img src="./images/release_icon_add.png" class="add-img">
				</li>
        	</ul>
        </div>
		<div class="line" v-if="checkStatusTit=='认证失败'"></div>
		<div class="checkFaile" v-if="checkStatusTit=='认证失败'">
			<div class="failetitle">备注</div>
			<div class="failetit">{{checkInfo.remark}}</div>
		</div>
		<select-upload-type v-if="showUploadType" :showUploadTypeStatus.sync="showUploadType" @selectedPic="uploadPic"></select-upload-type>
		<div class="saveBut" v-if="!checkStatus&&isOk" style="background:#ff6419" @click="scheck">提交审核</div>
		<div class="saveBut" v-if="!checkStatus&&!isOk" style="background:#ccc" >提交审核</div>
		<div class="saveBut" v-if="checkStatus&&isChange&&checkStatusTit!='待审核'" style="background:#ff6419" @click="resCheck">重新提交审核</div>
		<div class="saveBut" v-if="checkStatus&&!isChange&&checkStatusTit!='待审核'" style="background:#ccc">重新提交审核</div>
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
import selectUploadType from 'components/SelectUploadPic/index.vue';
import transformIMG from 'utils/transformUploadImg';
import { uploaduserpic } from '@/api/user';
import { check, checkinfo, reCheck, isauthorize } from '@/api/check';
import { mapGetters, mapActions} from 'Vuex';
  export default {
		data() {
			return {
        isIntermediary: JSON.parse(localStorage.getItem('userInfo')).userType,
				showUploadType: false,
				uploadImageList: [],
				checkImgUrl: '',
				checkImgServerURL: '',
				check: {
					'sourceCompany': undefined,
					"cardType":3, //认证证件类型
					"cardNumber": '', //认证证件号码 JSON.parse(this.$route.query.checkInfo).cardNumber
					"cardName": '', //认证证件任姓名 JSON.parse(this.$route.query.checkInfo).cardName
					"cardPicId": '' //认证证件照片 JSON.parse(this.$route.query.checkInfo).cardPicId
				},
				checkStatus: false,
				checkStatusTit: '',
				checkInfo: {},
				isChange: false,
				sourceCompany: '',
				sourceCompanyCode: ''
			}
        },
        components: {
            selectUploadType
		},
		computed: {
      ...mapGetters('register', ['sourceCompanyList']),
			isOk() {
				if(this.check.cardName!=''&&this.check.cardNumber!=''&&this.check.cardPicId!='') {
					return true;
				}else {
					return false;
				}
			},
      sourceCompanyPickerList() {
        return this.sourceCompanyList.map((item, index) => { return {index, value: item.name}});
      }
		},
		created() {
			this.cCheck();
		},
		methods: {
      ...mapActions('register', ['queryCompanyList']),
      async selectSourceCompany() {
        await this.queryCompanyList();
        this.$refs.sourceCompanyPicker.show();
      },
      sureSelectCompany([selectCompany]) {
				this.sourceCompany = selectCompany.value; //
				this.sourceCompanyCode = selectCompany.index + 1;
				console.log(this.sourceCompanyCode);
      },
			showChange() {
				if( (this.check.cardName!=''
					&&this.check.cardName!=this.checkInfo.cardName)
					||(this.check.cardNumber!=''
					&&this.check.cardNumber!=this.checkInfo.cardNumber)
					||(this.check.cardPicId!=''
					&&this.check.cardPicId!=this.checkInfo.cardPicId)
				  ) {
					  console.log(1)
					  return this.isChange = true;
				}else {
					console.log(0)
					return this.isChange = false;
				}
			},
			cCheck() {
				isauthorize().then(res=> {
					this.checkStatus = res.status;
					this.checkStatusTit = res.message;
					if(res.status) {
						checkinfo({id: res.obj.id}).then(res=> {
							this.sourceCompany = res.obj.sourceCompany;
							this.checkInfo = res.obj;
							this.check.cardNumber = res.obj.cardNumber;
							this.check.cardName = res.obj.cardName;
							this.check.cardPicId = res.obj.cardPicId;
							this.checkImgUrl = JSON.parse(localStorage.getItem('userInfo')).resourcesUrl + res.obj.cardPicPath;
						})
					}
				})
			},
			scheck() {
				this.check.sourceCompany = this.sourceCompanyCode;
				check(this.check).then(res=> {
					this.$toast(res.message);
					if(res.message === '提交审核成功') {
						this.$router.go(-1);
					}
				})
			},
			resCheck() {
				this.check.sourceCompany = this.sourceCompanyCode;
				this.check.authorizeId = this.checkInfo.id;
				reCheck(this.check).then(res=> {
					this.$toast(res.message);
					if(res.message === '重新提交审核成功') {
						this.$router.go(-1);
					}
				})
			},
			showSelectUpload() {
				if(this.uploadImageList.length === 1) { return this.$toast("最多只能上传1张！"); }
				if(navigator.camera) { return this.showUploadType = true; };
				return this.$refs.uploadField.click();
			},
			delImg() {
				this.checkImgUrl = '';
				this.check.cardPicId = '';
			},
            async uploadPic(file) {
				!navigator.camera && (this.$refs.uploadField.type = 'text');

				let data = await transformIMG(file);

				data && this.uploadHeadPic(data);

				!navigator.camera && (this.$refs.uploadField.type = 'file');
			},
			uploadHeadPic({file, fileName}) {
				let formData = new FormData();
				formData.append('file', file, fileName);
				formData.append('platform', 'mobile2b');
				formData.append('type', 'image');
				formData.append('module', 'supplyDemand');
				uploaduserpic(formData).then(res => {
					if(res.status){
						this.checkImgUrl = URL.createObjectURL(file);
						this.checkImgServerURL = res.obj.url
						this.check.cardPicId = res.obj.resId;
						this.showChange();
					}else {
						this.$toast(res.message)
					}
				})
			},
        }
	}

</script>
<style lang="scss" scoped>
@import '../../../../styles/header.scss';
@import './styles/ia.scss';
</style>

