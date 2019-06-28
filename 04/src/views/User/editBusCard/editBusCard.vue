<template>
  <div class="editBusCard">
    <header>
      <i class="icon-left" @click="$router.back()"></i>
      <div class="title">编辑名片</div>
      <!--<div class="right" v-if="isAllIn" style="color:#ff6419;" @click="save">保存</div>-->
      <!--<div class="right" v-else style="color:#666">保存</div>-->
    </header>
    <scroll class="wrapper" :listenScroll="listenScroll" :probeType="probeType" :pullup="true" :beforeScroll="true"
      :scrollX="true" :refreshScroll="true" ref="wrapperScroll">
      <div class="box">
        <div class="head">
          <div class="content" @click="changeHead">
            <div class="imgbox">
              <img v-if="mark.userHeadPicPath!=''" class="port" :src="bduserHeadPicPath?bduserHeadPicPath:(resourceURL+mark.userHeadPicPath)" alt="">
              <img v-else class="pto" src="./images/PNOTO.png" alt="">
              <input type="file" ref="headPic" style="display: none;" @change="uploadPic($refs.headPic.files.item(0))"
                accept="image/png,image/gif,image/jpg,image/jpeg,image/bmp">
            </div>
            <div class="head_tit">{{mark.userHeadPicPath?'更改图片':'上传图片'}}</div>
          </div>
        </div>
        <div class="inpuBox">
          <div class="box-item" @click="inpuShow(0, '姓名')">
            <div class="box-item-left">
              <span class="hd">*</span> 姓名
            </div>
            <div class="box-item-right">
              <span>{{mark.userName}}</span>
              <img class="icon" src="../images/porfile_icon_open.png">
            </div>
          </div>
          <!--<div class="inpu_item">-->
            <!--<div class="inpu_item_tit" @click="inpuShow(0, '姓名')">-->
              <!--<span class="hd">*</span> 姓名-->
              <!--<img class="fr icon" src="../images/porfile_icon_open.png">-->
            <!--</div>-->
            <!--<div class="inpu_item_val" @click="inpuShow(0, '姓名')">-->
              <!--<span class="fl" :style="mark.userName?'color:#333':'color:#999'">{{mark.userName?mark.userName:"请输入"}}</span>-->
              <!--<img class="fr icon" src="../images/porfile_icon_open.png">-->
            <!--</div>-->
          <!--</div>-->
          <div class="box-item" @click="inpuShow(1, '职位')">
            <div class="box-item-left">
              <span class="hd">*</span> 职位
            </div>
            <div class="box-item-right">
              <span>{{mark.companyPost}}</span>
              <img class="icon" src="../images/porfile_icon_open.png">
            </div>
          </div>
          <!--<div class="inpu_item">-->
            <!--<div class="inpu_item_tit">-->
              <!--<span class="hd">*</span> 职位-->
            <!--</div>-->
            <!--<div class="inpu_item_val" @click="inpuShow(1, '职位')">-->
              <!--<span class="fl" :style="mark.companyPost?'color:#333':'color:#999'">{{mark.companyPost?mark.companyPost:"请输入"}}</span>-->
              <!--<img class="fr icon" src="../images/porfile_icon_open.png">-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="br"></div>-->
          <div class="box-item" @click="inpuShow(2, '手机')">
            <div class="box-item-left">
              <span class="hd">*</span> 手机
            </div>
            <div class="box-item-right">
              <span>{{mark.phone}}</span>
              <img class="icon" src="../images/porfile_icon_open.png">
            </div>
          </div>
          <!--<div class="inpu_item">-->
            <!--<div class="inpu_item_tit">-->
              <!--<span class="hd">*</span> 手机-->
            <!--</div>-->
            <!--<div class="inpu_item_val" @click="inpuShow(2, '手机')">-->
              <!--<span class="fl" :style="mark.phone?'color:#333':'color:#999'">{{mark.phone?mark.phone:"请输入"}}</span>-->
              <!--<img class="fr icon" src="../images/porfile_icon_open.png">-->
            <!--</div>-->
          <!--</div>-->
          <div class="box-item" @click="inpuShow(3, '微信')">
            <div class="box-item-left">
              <span class="hd">*</span> 微信
            </div>
            <div class="box-item-right">
              <span>{{mark.userWechat}}</span>
              <img class="icon" src="../images/porfile_icon_open.png">
            </div>
          </div>
          <!--<div class="inpu_item">-->
            <!--<div class="inpu_item_tit">-->
              <!--<span class="hd">*</span> 微信-->
            <!--</div>-->
            <!--<div class="inpu_item_val" @click="inpuShow(3, '微信')">-->
              <!--<span class="fl" :style="mark.userWechat?'color:#333':'color:#999'">{{mark.userWechat?mark.userWechat:"请输入"}}</span>-->
              <!--<img class="fr icon" src="../images/porfile_icon_open.png">-->
            <!--</div>-->
          <!--</div>-->
          <div class="box-item marginTop" @click="inpuShow(4, '邮箱')">
            <div class="box-item-left">
              <span class="hd">*</span> 邮箱
            </div>
            <div class="box-item-right">
              <span>{{mark.email}}</span>
              <img class="icon" src="../images/porfile_icon_open.png">
            </div>
          </div>
          <!--<div class="inpu_item">-->
            <!--<div class="inpu_item_tit">-->
              <!--<span class="hd">*</span> 邮箱-->
            <!--</div>-->
            <!--<div class="inpu_item_val" @click="inpuShow(4, '邮箱')">-->
              <!--<span class="fl" :style="mark.email?'color:#333':'color:#999'">{{mark.email?mark.email:"请输入"}}</span>-->
              <!--<img class="fr icon" src="../images/porfile_icon_open.png">-->
            <!--</div>-->
          <!--</div>-->
          <div class="box-item" @click="inpuShow(5, '地址')">
            <div class="box-item-left">
              <span class="hd">*</span> 地址
            </div>
            <div class="box-item-right">
              <span>{{mark.address}}</span>
              <img class="icon" src="../images/porfile_icon_open.png">
            </div>
          </div>
          <!--<div class="inpu_item">-->
            <!--<div class="inpu_item_tit">-->
              <!--<span class="hd">*</span> 地址-->
            <!--</div>-->
            <!--<div class="inpu_item_val" @click="inpuShow(5, '地址')">-->
              <!--<span class="fl" :style="mark.address?'color:#333':'color:#999'">{{mark.address?mark.address:"请输入"}}</span>-->
              <!--<img class="fr icon" src="../images/porfile_icon_open.png">-->
            <!--</div>-->
          <!--</div>-->
          <!--<div class="br" :style="mark.address.length>19?'margin-top:1.2rem':''"></div>-->
          <div class="box-item marginTop" @click="inpuShow(7, '设置按钮名称')">
            <div class="box-item-left">
              <span class="hd"></span> 设置按钮名称
            </div>
            <div class="box-item-right">
              <span>{{mark.buttonName}}</span>
              <img class="icon" src="../images/porfile_icon_open.png">
            </div>
          </div>
          <div class="box-item" @click="inpuShow(8, '个性签名')">
            <div class="box-item-left">
              <span class="hd"></span> 个性签名
            </div>
            <div class="box-item-right">
              <span>{{mark.signature}}</span>
              <img class="icon" src="../images/porfile_icon_open.png">
            </div>
          </div>
          <div class="box-item" @click="inpuShow(6, '个人介绍')">
            <div class="box-item-left">
              <span class="hd"></span> 介绍
            </div>
            <div class="box-item-right">
              <!--<span>{{mark.resume}}</span>-->
              <img class="icon" src="../images/porfile_icon_open.png">
            </div>
          </div>
           <div class="box-item">
            <div class="box-item-left">
              <span class="hd"></span> 上传海报封面图
            </div>
            <div class="box-item-right">
              <img v-if="mark.posterPath!=''" class="but_icon" :src="bdposterPath?bdposterPath:(resourceURL+mark.posterPath)" @click="upImg" alt="">
              <img v-else class="but_icon" src="../images/iconCard_upic.png" @click="upImg" alt="">
               <input type="file" ref="userPic" style="display: none;" @change="uploadPic($refs.userPic.files.item(0))"
                accept="image/png,image/gif,image/jpg,image/jpeg,image/bmp">
              <img class="icon" src="../images/porfile_icon_open.png">
              <img class="but_icon_del" v-if="mark.posterPath!=''" src="../../../assets/images/release_icon_delete.png" @click="mark.posterPath='';bdposterPath=''" alt="">
            </div>
          </div>
          <!--<div class="inpu_item">-->
            <!--<div class="inpu_item_tit">-->
              <!--个人介绍（200个字为佳）-->
            <!--</div>-->
            <!--<div class="inpu_item_val" @click="inpuShow(6, '个人介绍')">-->
              <!--<span class="fl" :style="mark.resume?'color:#333':'color:#999'">{{mark.resume?mark.resume:"请输入"}}</span>-->
              <!--<img class="fr icon" src="../images/porfile_icon_open.png">-->
            <!--</div>-->
          <!--</div>-->

          <!--<div class="br" style="margin-top:1.2rem"></div>-->
          <!--<div class="uploadImg">-->
            <!--<div class="uploadImg_tit">照片展示（最多可添加10张照片）</div>-->
            <!--<div class="uploadImg_box">-->
              <!--<div class="imgBox" v-for="(item, index) in mark.resPicVoList" :key="index">-->
                <!--<img class="user_img" :src="item.bdpicPath?item.bdpicPath:(resourceURL+item.picPath)" alt="">-->
                <!--<img class="del" @click="del(index)" src="./images/release_icon_delete.png" alt="">-->
              <!--</div>-->
              <!--<div class="imgBox" @click="upImg" v-if="mark.resPicVoList.length<10">-->
                <!--<img class="upImg" src="./images/PNOTO.png" alt="">-->
                <!--<input type="file" ref="userPic" style="display: none;" @change="uploadPic($refs.userPic.files.item(0))"-->
                  <!--accept="image/png,image/gif,image/jpg,image/jpeg,image/bmp">-->
              <!--</div>-->
            <!--</div>-->
          <!--</div>-->
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </scroll>
    <div class="footer">
      <div class="footer_but"  @click="save" v-if="isAllIn">
          保存
      </div>
      <div class="footer_but" v-else style="opacity: .3">
        保存
      </div>
    </div>
    <!-- 图片上传控件 -->
    <select-upload-pic v-if="showUploadType" :showUploadTypeStatus.sync="showUploadType" @selectedPic="uploadPic"></select-upload-pic>
    <div class="inpuToast" v-if="showInpuToast">
      <div class="inpu_tab">
        <img class="fl" src="./images/close.png" alt="" @click="cancle">
        <div class="tab_but fr" @click="saveInpu">保存</div>
      </div>
      <div class="inpu_title">
        {{inpuTitle}}　<span v-if="inpuType==6"></span>
      </div>
      <div class="inpu_box">
        <input v-if="inpuType==0" v-model="markInpu.userName" type="text" @input="inpuVal(markInpu.userName)" :style="isInpu?'border-color: #ff6419;':'border-color: #ebebeb;'"
          placeholder="请在这里输入">
        <input v-else-if="inpuType==1" v-model="markInpu.companyPost" type="text" @input="inpuVal(markInpu.companyPost)"
          :style="isInpu?'border-color: #ff6419;':'border-color: #ebebeb;'" placeholder="请在这里输入">
        <input v-else-if="inpuType==2" v-model="markInpu.phone" type="number" @input="inpuVal(markInpu.phone)" :style="isInpu?'border-color: #ff6419;':'border-color: #ebebeb;'"
          placeholder="请在这里输入">
        <input v-else-if="inpuType==3" v-model="markInpu.userWechat" type="text" @input="inpuVal(markInpu.userWechat)"
          :style="isInpu?'border-color: #ff6419;':'border-color: #ebebeb;'" placeholder="请在这里输入">
        <input v-else-if="inpuType==4" v-model="markInpu.email" type="text" @input="inpuVal(markInpu.email)" :style="isInpu?'border-color: #ff6419;':'border-color: #ebebeb;'"
          placeholder="请在这里输入">
        <textarea v-else-if="inpuType==5" v-model="markInpu.address"  type="text" @input="inpuVal(markInpu.address)" :style="isInpu?'border-color: #ff6419;':'border-color: #ebebeb;'"
          placeholder="请在这里输入"></textarea>
        <input v-else-if="inpuType==7" v-model="markInpu.buttonName" type="text" @input="inpuVal(markInpu.buttonName)" :style="isInpu?'border-color: #ff6419;':'border-color: #ebebeb;'"
               placeholder="请在这里输入">
        <input v-else-if="inpuType==8" v-model="markInpu.signature" maxlength="20" type="text" @input="inpuVal(markInpu.signature)" :style="isInpu?'border-color: #ff6419;':'border-color: #ebebeb;'"
               placeholder="请在这里输入">
        <!--<div class="rich-editor" v-else>-->
           <!--<div class="editor-container" id="editor-container" contentEditable="true"></div>-->
           <!--<div class="editor-content">-->
                <!--<div @click="changeStyle($event,'bold')">粗体</div>-->
                <!--<div @click="changeStyle($event,'selectAll')">全选</div>-->
           <!--</div>-->
           <!--<div class="footer-editor">-->
             <!--<a href="#" class="footer-editor-item"><i class="icon-addphoto"></i></a>-->
             <!--<a href="#" class="footer-editor-item" @click="changeStyle($event,'Bold')"><i class="icon-jiacu" :class="{'active':isBold}"></i></a>-->
             <!--<div class="footer-editor-item" @click="changeStyle($event,'insertUnorderedList')"><i class="icon-fengexian"></i></div>-->
           <!--</div>-->
        <!--</div>-->
        <!--<ZxEditor id="editorContainer"></ZxEditor>-->
        <!--<div class="editor-container"></div>-->
          <!-- 编辑器容器 -->
        <!--<textarea v-else name="" id="" v-model="markInpu.resume" placeholder="请在这里输入" maxlength="200" cols="30" rows="20"></textarea>-->
        <!--<div class="textarea_tit" v-if="inpuType==6"><span>{{markInpu.resume.length}}</span>/200</div>-->
      </div>
    </div>
  </div>
</template>
<script>
  let emailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
  import mixins from "@/mixins/mixin";
  import { uploaduserpic,uploaduserpic1 } from '@/api/user';
  import selectUploadPic from 'components/SelectUploadPic/index.vue';
  import transformIMG from 'utils/transformUploadImg';
  import { setTimeout } from 'timers';
  import { ZxEditor } from 'utils/rich-editor/js/index';
  export default {
    mixins: [mixins],
    components: {
      selectUploadPic,
    },
    data() {
      return {
        // 输入弹框
        showInpuToast: false,
        inpuTitle: '',
        inpuType: 0,
        isInpu: false,
        // 上传图片插件控制
        nativeCamera: navigator.camera,
        showUploadType: false,
        uploadImgType: 0, // 0代表上传头像，1代表上传照片
        // 用户图片
        userImgs: [],
        // 接口传输数据
        bduserHeadPicPath:'',
        bdposterPath:'',
        mark: {
          "userName": '',
          "userHeadPicId": '',
          "userHeadPicPath": '',
          "phone": '',
          "userWechat": '',
          "companyPost": '',
          "email": '',
          "address": '',
          "buttonName": '',
          "resume": '',
          "presentation": '',
          "userPicIds": '',
          signature:'',
          companyName:  JSON.parse(localStorage.getItem('userInfo')).companyName,
          resPicVoList:[],
          posterPath:""
        },
        // 用户输入数据
        markInpu: {
          "userName": '',
          "userHeadPicId": '',
          "userHeadPicPath": '',
          "phone": '',
          "userWechat": '',
          "companyPost": '',
          "email": '',
          "address": '',
          "buttonName": '',
          "resume": '',
          "userPicIds": '',
           signature:''
        },
        zxEditor:''
      }
    },
    computed: {
      isAllIn() {
        if ((this.mark.userName?true:false)&&(this.mark.userHeadPicPath?true:false)&&(this.mark.phone?true:false)&&(this.mark.userWechat?true:false)&&(this.mark.companyPost?true:false)&&(this.mark.email?true:false)&&(this.mark.address?true:false)) {
          return true;
        } else {
          return false;
        }
      }

    },
    watch: {
      "markInpu.phone"(val) {
        if (val.length > 11) {
          this.markInpu.phone = val.substr(0, 11);
        }
      },
      "markInpu.userName"(val) {
        if (val.length > 5) {
          this.markInpu.userName = val.substr(0, 5);
          this.$toast('姓名不可超过5个字');
        }
      },
      "markInpu.companyPost"(val) {
        if (val.length > 10) {
          this.markInpu.companyPost = val.substr(0, 10);
          this.$toast('职位不可超过10个字');
        }
      },
      "markInpu.buttonName"(val) {
        if (val.length > 10) {
          this.markInpu.buttonName = val.substr(0, 10);
          this.$toast('按钮名称不可超过10个字');
        }
      },
      "markInpu.address"(val) {
        if (val.length > 100) {
          this.markInpu.address = val.substr(0, 100);
          this.$toast('地址不可超过100个字');
        }
      }
    },
    created() {
      this.getUserCard();
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.wrapperScroll.refresh();
        this.richEditor();
      })
    },
    methods: {
      richEditor(){
        //富文本编辑器
        this.zxEditor = new ZxEditor('#editorContainer', {
          fixed: true,
          top:'90px',
          showToolbar:['pic'],//title 'bold'
          autoSave:0
        })

        // 上传图片模块
        this.zxEditor.on('upload',(file)=> {
          this.zxEditor.dialog.removeLoading();
          let formData = new FormData();
          formData.append('file', file[0], file[0].name);
          formData.append('platform', 'mobile2b');
          formData.append('fileKey', 'mobile2b.supplyDemand');
          formData.append('type', 'image');
          formData.append('module', 'supplyDemand');
          setTimeout(()=>{
            this.API.uploadtest(formData).then(res => {
              if(res.success){
                //let url= this.resourceURL+res.obj.url;
                let url= res.data.url;
                this.zxEditor.addImage(url)
              }
            })
          },100)
        })
      },
      del(index) {
        this.mark.resPicVoList.splice(index, 1);
      },
      cancle() {
        this.$confirm({
            title: '提示',
            msg: '是否退出当前界面？'
          })
          .success(instance => {
            instance.close();
            this.showInpuToast = false;
            document.getElementById('editorContainer').style.display="none";
          })
      },
      // 监听用户输入，下划线变色
      inpuVal(val) {
        val != '' ? this.isInpu = true : this.isInpu = false;
      },
      //  保存用户输入数据
      saveInpu() {
        switch (this.inpuType) {
          case 0:
            if (this.markInpu.userName != '') {
              this.mark.userName = this.markInpu.userName;
              this.showInpuToast = false;
            } else {
              this.$toast('请输入正确的姓名');
            }
            break;
          case 1:
            if (this.markInpu.companyPost != '') {
              this.mark.companyPost = this.markInpu.companyPost;
              this.showInpuToast = false;
            } else {
              this.$toast('请输入正确的职位');
            }
            break;
          case 2:
            if ((!/^1[0-2]/.test(this.markInpu.phone)) && this.markInpu.phone.length == 11) {
              this.mark.phone = this.markInpu.phone;
              this.showInpuToast = false;
            } else {
              this.$toast('请输入正确的手机号');
            }
            break;
          case 3:
            if(!/[\u4e00-\u9fa5]/.test(this.markInpu.userWechat)&&this.markInpu.userWechat!='') {
              this.mark.userWechat = this.markInpu.userWechat;
              this.showInpuToast = false;
            }else {
              this.$toast('请输入正确的微信号');
            }
            break;
          case 4:
            if (emailReg.test(this.markInpu.email)) {
              this.mark.email = this.markInpu.email;
              this.showInpuToast = false;
            } else {
              this.$toast('请输入正确的邮箱');
            }
            break;
          case 5:
            if (this.markInpu.address != '') {
              this.mark.address = this.markInpu.address;
              this.showInpuToast = false;
            } else {
              this.$toast('请输入正确的地址');
            }
            break;
          case 6:
            document.getElementById('editorContainer').style.display="none";
            //this.mark.resume = this.markInpu.resume;
            this.showInpuToast = false;
            //console.log(this.zxEditor.getContent())
            this.mark.presentation=this.zxEditor.getContent();
            //this.zxEditor.save();
            break;
          case 7:
            this.mark.buttonName = this.markInpu.buttonName;
            this.showInpuToast = false;
            break;
          case 8:
            this.mark.signature = this.markInpu.signature;
            this.showInpuToast = false;
            break;
        }
      },
      // 获取用户电子名片详情数据
      getUserCard() {
        this.API.getUserCard().then(res => {
          for (let key in res.obj){
            this.markInpu[key]=res.obj[key];
          }
          this.markInpu.buttonName='免费获取方案';
          this.mark.buttonName='免费获取方案';
          console.log(this.markInpu)
          if (res.success && res.message == "用户已有电子名片") {
            this.mark = res.obj;
            this.mark.companyName = JSON.parse(localStorage.getItem('userInfo')).companyName;
             this.$nextTick(()=>{
               this.zxEditor.setContent('');
               this.zxEditor.setContent(res.obj.presentation);
             })
          }
        })
      },
      inpuShow(type, str) { // 0: 姓名， 1：职位， 2：手机， 3：微信， 4：邮箱， 5：地址， 6：个人介绍 7 按钮名称
        this.inpuType = type;
        this.showInpuToast = true;
        this.inpuTitle = str;
        // this.markInpu = {
        //   "userName": '',
        //   "userHeadPicId": '',
        //   "userHeadPicPath": '',
        //   "phone": '',
        //   "userWechat": '',
        //   "companyPost": '',
        //   "email": '',
        //   "address": '',
        //   "resume": '',
        //   "buttonName":'',
        //   "resPicVoList": []
        // }
        let eDiv=document.getElementById('editorContainer');
        type==6 ?  eDiv.style.display ='block' : eDiv.style.display ='none';
      },
      save() {
        if (this.mark.resPicVoList.length > 0) {
          this.mark.userPicIds = [];
          this.mark.resPicVoList.map(item => {
            this.mark.userPicIds.push(item.picId);
          })
          this.mark.userPicIds = this.mark.userPicIds.join();
        } else {
          this.mark.userPicIds = '';
        }
        this.API.addOrUpdate(this.mark).then(res => {
          if (res.success) {
            this.zxEditor.removeSave();
            this.zxEditor.setContent('');
            this.zxEditor='';
            this.$router.back();
          } else {
            this.$toast(res.message);
          }
        })
      },
      //   上传照片
      upImg() {
        this.uploadImgType = 1;
        if (navigator.camera) {
          return this.showUploadType = true;
        };
        this.$refs.userPic.click();
      },
      //   上传头像
      changeHead() {
        this.uploadImgType = 0;
        if (navigator.camera) {
          return this.showUploadType = true;
        };
        this.$refs.headPic.click();
      },
      // 上传图片方法
      async uploadPic(file) {
        if (this.uploadImgType == 0) {
          !navigator.camera && (this.$refs.headPic.type = 'text');
          let data = await transformIMG(file);
          data && this.uploadHeadPic(data);
          !navigator.camera && (this.$refs.headPic.type = 'file');
        } else {
          !navigator.camera && (this.$refs.userPic.type = 'text');
          let data = await transformIMG(file);
          data && this.uploadHeadPic(data);
          !navigator.camera && (this.$refs.userPic.type = 'file');
        }
      },
      uploadHeadPic({
        file,
        fileName
      }) {
        let formData = new FormData();
        formData.append('file', file, fileName);
        formData.append('platform', 'mobile2b');
        formData.append('type', 'image');
        formData.append('module', 'supplyDemand');
        uploaduserpic(formData).then(res => {
          if (res.status) {
            if (this.uploadImgType == 0) {
              this.mark.userHeadPicId = res.obj.resId;
              this.mark.userHeadPicPath = res.obj.url;
              this.bduserHeadPicPath = URL.createObjectURL(file);
            } else {
              // let obj = {
              //   picPath: res.obj.url,
              //   bdpicPath:URL.createObjectURL(file),
              //   picId: res.obj.resId
              // }
              // this.mark.resPicVoList.push(obj);
              this.mark.posterPath = res.obj.url;
              this.bdposterPath = URL.createObjectURL(file);
              console.log(res.obj.url,'-------------------res.obj.url');

              this.$nextTick(() => {
                this.$refs.wrapperScroll.refresh();
              })
            }
          } else {
            this.$toast(res.message)
          }
        })
      },
    },
    destroyed(){
      this.zxEditor.setContent('');
      this.zxEditor.removeSave();
      this.zxEditor='';
      document.getElementById('editorContainer').style.display="none";
    }
  }

</script>
<style lang="scss" scoped>
  @import '../../../styles/header.scss';
  @import './styles/editBusCard.scss';

</style>

