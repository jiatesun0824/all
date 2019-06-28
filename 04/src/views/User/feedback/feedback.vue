<template>
    <div class="feddback">
        <header>
            <i class="icon-left" @click="$router.push('/user')"></i>
            <div class="title">意见反馈</div>
        </header>
        <div class="main">
            <div class="title">反馈内容</div>
            <textarea class="feedDetail" placeholder="输入您要反馈的内容" v-model="feedDetail"></textarea>
            <span class="feedDetail_tit">{{feedDetail.length}}/200</span>
            <div class="title">问题截图（选填，4张以内）</div>
            <div class="imgBox">
                <div class="img_item" v-for="(item, index) in upLoadImgs" :key="index" :style="index==upLoadImgs.length-1?'margin:0':''">
                    <img class="del_img" @click="delImg(index)" src="./images/pic_icon_delete.png" alt="">
                    <img class="img_val" :src="item" alt="">
                </div>
               
                <div class="upLoadImg"  @click="changeHead" v-if="upLoadImgs.length<4">
                    <img  src="./images/me_icon_add_pic.png" alt="">
                    <input  type="file" ref="headPic" style="display: none;"  @change="uploadPic($refs.headPic.files.item(0))" accept="image/png,image/gif,image/jpg,image/jpeg,image/bmp" class="file">
                </div>
            </div>
            <div class="title" v-if="!phone">联系方式（选填）</div>
            <input  v-if="!phone" class="contact_inpu" type="text" placeholder="电话/邮箱/微信" v-model="phone">

            <div class="submit" @click="submit">提交</div>
            <div class="feedRecord" @click="$router.push('/feedRecord')"> 反馈记录</div>
        </div>
        <div class="toast" v-if="toastShow">
            <img src="./images/pop_icon_mile.png" alt="">
            <div>感谢您的宝贵建议</div>
            <div>我们会尽快处理并回复你</div>
        </div>
         <select-upload-pic v-if="showUploadType" :showUploadTypeStatus.sync="showUploadType" @selectedPic="uploadPic"></select-upload-pic>
    </div>
</template>
<script>
import { uploaduserpic } from '@/api/user';
import transformIMG from 'utils/transformUploadImg';
import selectUploadPic from 'components/SelectUploadPic/index.vue';
export default {
    data() {
        return {
            feedDetail:'', // 用户输入的反馈内容
            upLoadImgs: [], // 用户上传的图片
            toastShow: false, // 提交成功，弹框提示

            upLoadImgIds: [],
            phone: JSON.parse(localStorage.getItem('userInfo')).mobile,

            showUploadType: false,
            nativeCamera: navigator.camera,
        }
    },
    components: {
			selectUploadPic
		},
    watch: {
        // 用户输入的反馈内容监听
        feedDetail(val) {
            if(val.length>200) {
                this.feedDetail = val.substr(0, 200);
                this.$toast('最多输入200字')
            } 
        }
    },
    methods: {
        submit() {
            let feedbackPics='';
            this.upLoadImgIds.map(item=> {
                feedbackPics+=item+',';
            })
            feedbackPics = feedbackPics.substr(0, feedbackPics.length-1);
            let mark = {
                "feedbackContent": this.feedDetail,
                "feedbackPics": feedbackPics,
                "phone": this.phone,
                "userId": JSON.parse(localStorage.getItem('userInfo')).id,
                "platformId": 1
                }
            this.API.feedbackAdd(mark).then(res=> {
                if(res.success)  {
                    this.toastShow = true;
                    setTimeout(()=> {
                        this.toastShow = false;
                        this.$router.push('/feedRecord')
                    },2000)
                }
            })
        },
        // 删除图片
        delImg(index) {
            this.upLoadImgs.splice(index, 1);
            this.upLoadImgIds.splice(index, 1);
        },
        changeHead() {
				if(navigator.camera) { return this.showUploadType = true; };
				this.$refs.headPic.click();
	    },
        // 上传图片
        async uploadPic(file) {
				!navigator.camera && (this.$refs.headPic.type = 'text');

				let data = await transformIMG(file);

				data && this.uploadHeadPic(data);

				!navigator.camera && (this.$refs.headPic.type = 'file');
		},
		uploadHeadPic({file, fileName}) {
				let formData = new FormData();
				formData.append('file', file);
				formData.append('platform', 'web');
				formData.append('type', 'image');
                formData.append('module', ' feedback');
                formData.append('fileKey', 'sysuser.feedback.pic ')
				this.API.feedUploadImg(formData).then(res => {
					if(res.code==200){
                        this.upLoadImgs.push(res.data.url);
                        this.upLoadImgIds.push(res.data.resId);
					}else {
						this.$toast('上传失败')
					}
				})
		},
    }
}
</script>
<style lang="scss" scoped>
  @import '../../../styles/header.scss';
  @import './styles/feedback.scss';
</style>