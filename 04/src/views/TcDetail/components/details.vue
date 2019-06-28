<template>
  <div class="details">
    <div class="header">
      <span @click="goBack"></span>{{headerTxt}}
    </div>
    <scroll class="scroll" ref="scroller">
      <div class="details-box">
        <div class="blog-article" v-if="type == 4">
          <h1>{{blogArticleList.articleTitle}}</h1>
          <div class="date">
            <div class="date-left"><span></span>{{blogArticleList.releaseTimeStr}}</div>
            <div class="date-right"><span></span>{{(blogArticleList.browseCount || blogArticleList.browseCount != null)?blogArticleList.browseCount: 0}}</div>
          </div>
          <!--<p>{{blogArticleList.content}}</p>-->
          <div v-html="blogArticleList.content" class="content"></div>
        </div>
        <div class="plan" v-if="type == 3 ">
          <img v-if="blogArticleList.picPath" :src="filterImg(blogArticleList.picPath)" alt="">
          <img v-else v-lazy="require('../../../assets/images/no_img.jpg')">
          <h1>作品简介</h1>
          <div v-html="blogArticleList.content" class="content"></div>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
  import { debounce } from 'lodash';
  import { blogArticleDetails, caseList } from 'api/tcdetail';
  import { mapGetters } from 'Vuex';
  export default {
    data() {
      return {
        headerTxt: '',
        type: false,
        id: '',
        blogArticleList: {}
      };
    },
    computed: {
      ...mapGetters('common', ['userInfo']),
    },
    created() {
      this.id = this.$route.params.id;
      this.type = sessionStorage.getItem('type')
      this.getDetails(sessionStorage.getItem('type'));
    },
    methods: {
      goBack: debounce(function() {
        this.$router.back();
      }, 20),
      filterImg(img) {
        return this.userInfo.resourcesUrl + img;
      },
      getDetails(type) {
        if (type == 4) {
          this.headerTxt = '博文详情';
          blogArticleDetails({articleId: this.id}).then(res => {
            if (res.obj) {
              this.blogArticleList = res.obj;
              setTimeout(() => {
                this.$refs.scroller.refresh();
              }, 200);
            }
          });
        }
        if (type == 3) {
          caseList({pageType: 'detail', caseId: this.id}).then(res => {
            if (res.data) {
              this.blogArticleList = res.data[0];
              this.headerTxt = res.data[0].caseTitle;
              setTimeout(() => {
                this.$refs.scroller.refresh();
              }, 200);
            }
          });
        }
      }
    }
  };
</script>

<style lang="scss" scoped>

  .details{
    .header{
      height: 88px;
      line-height: 88px;
      font-size: 34px;
      color: #333333;
      text-align: center;
      border-bottom: 1px solid #f5f5f5;
      position: relative;
      span{
        display: inline-block;
        width: 44px;
        height: 44px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background-size: 100% 100%;
        background-image: url('../../../assets/images/nav_icon_back_black.png');
        left: 30px;
      }
    }
    .scroll{
      position: absolute;
      top: 90px;
      left: 0;
      height: 92%;
      .details-box{
        .blog-article{
          padding: 30px;
          h1{
            font-size: 30px;
            color: #333333;
            line-height: 36px;
          }
          p{
            font-size: 24px;
            color: #999999;
            line-height: 30px;
            padding: 35px 0;
          }
          .content{
            margin-top: 30px;
          }
          .date{
            height: 20px;
            display: flex;
            justify-content: space-between;
            font-size: 24px;
            color: #999999;
            padding: 30px 0;
            border-bottom: 1px solid #f5f5f5;
            .date-left{
              height: 20px;
              line-height: 20px;
              span{
                display: inline-block;
                margin-right: 10px;
                width: 20px;
                height: 20px;
                background-size: 100% 100%;
                background-image: url("../images/list_icon_time.png");
              }
            }
            .date-right{
              height: 20px;
              line-height: 20px;
              span{
                display: inline-block;
                margin-right: 10px;
                width: 20px;
                height: 20px;
                background-size: 100% 100%;
                background-image: url('../images/list_icon_see.png');
              }
            }
          }
        }
        .plan{
          img{
            display: block;
            width: 100%;
            height: 422px;
          }
          h1{
            font-size: 30px;
            color: #333333;
            padding: 50px 30px 30px 35px;
          }
          P{
            font-size: 28px;
            color: #333333;
            line-height: 36px;
            padding: 0 30px 45px;
          }
          .content{
            padding: 0 30px;
          }
        }
      }
    }
  }
</style>
