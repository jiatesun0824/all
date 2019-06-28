<template>
  <div class="area__container">
    <div class="banner" v-if="searchVillageList.length < 1 && isIntermediary == 11">
      <swiper class="swiper-wrapper" :options="swiperOption">
        <swiper-slide class="swiper-box" v-for="(item, index) in bannerList" :key="index">
          <img :src="filterImg(item.picPath)" alt="">
        </swiper-slide>
      </swiper>
    </div>
    <scroll beforeScroll pullup :data="searchVillageList" @scrollToEnd="loadMore">
      <div class="area__searchinfo">
        <div class="search__form">
          <div class="form__condition">
            <div class="form__condition--item">
              <span class="form__label">所在地区：</span>
              <house-address></house-address>
            </div>
            <div class="form__condition--item">
              <span class="form__label">所在小区：</span>
              <input class="form__input" type="text" placeholder="输入所在小区" v-model="villageName">
            </div>
            <div class="form__search">
              <a class="form__search--btn" @click="search">搜索</a>
            </div>
          </div>

        </div>
        <div class="area__upload">
          <span class="area__upload--tip">没有找到户型?</span>
          <a class="area__upload--page" @click="toSetHouse">提交户型资料</a>
          <em @click="$router.push('/myModule')">我的户型</em>
          <!-- <router-link class="" to="/sethouse"></router-link> -->
        </div>
        <!-- 户型搜索历史记录 -->
        <div class='search-history' v-if="historySearchList.length > 0 && historySearchListShow">
          <div class='history-title clearfix'>
            <div class='title-text fl'>历史搜索</div>
            <div class='title-icon fr' @click='deleteHistorySearchList'>
              <img src='../../images/huxing_icon_delete.png'>
            </div>
          </div>
          <div class='history-list clearfix'>
            <div  class='list-item fl' @click='historySearch(item)'
           v-for="(item, index) in historySearchList" :key="index" v-if="deletenull(item.livingName)">{{item.livingName}}</div>
          </div>
        </div>
         <!-- 户型搜索历史记录 -->
        <div class="area__searchlist">
          <div v-if="searchVillageList && searchVillageList.length" v-load-more="!isAllData" v-all-loaded="isAllData">
            <div class="search__result" v-text="`共搜索到${searchVillageCount}个小区`"></div>
            <ul class="search__list">
              <li class="list__item" v-for="(item, index) in searchVillageList" :key="index" @click="toTypeChange(item)">
                <span class="list__item--name" v-text="item.livingName"></span>
                <span class="list__item--count" v-text="`${item.houseCount}个户型`"></span>
              </li>
            </ul>
          </div>
          <empty v-if="searchVillageList && !searchVillageList.length" :text="'暂无此小区，可自行上传户型！'"></empty>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import HouseAddress from 'components/HouseAddress';
import { mapGetters, mapActions } from 'Vuex';
import { find, isEmpty, isArray, debounce } from 'lodash';
import { queryVillageList } from 'api/area';
import { getBannerList } from 'api/home';
export default {
  name: 'house-area',
  data() {
    return {
      isIntermediary: JSON.parse(localStorage.getItem('userInfo')).userType,
      bannerListShow: true,
      bannerList: [],
      swiperOption: {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        initialSlide: 0, // 默认页面
        // loop: true,
        observer: true,
        observeParents: true,
        coverflowEffect: {
          rotate: 0,
          stretch: 35,
          depth: 100,
          modifier: 1,
          slideShadows: false
        }
      },
      villageName: '',
      start: 0,
      historySearchList: [],
      historySearchListShow: false
    }
  },
  computed: {
    ...mapGetters('area', ['searchVillageList', 'searchVillageCount']),
    ...mapGetters('common', ['userInfo']),
    isAllData() {
      return isArray(this.searchVillageList) && (this.searchVillageList.length === this.searchVillageCount);
    }
  },
  created() {
    getBannerList({positionCode: 'mobile2B:housetype:top:banner', basePlatformId: 1}).then(res => {
      if (res.datalist) {
        this.bannerList = res.datalist;
      }
    });
    if(this.searchVillageList && this.searchVillageList.length) {
      this.historySearchListShow = false;
    }
    else if(JSON.parse(localStorage.getItem('areaHosDataArr'))) {
       let hisList = JSON.parse(localStorage.getItem('areaHosDataArr'));
       let msgIdHisList = [];
       hisList.map(item=> {
         if(this.userInfo.id == item.msgId) {
           msgIdHisList.push(item);
         }
       })
      for (let k=0; k<msgIdHisList.length;k++) {
          for(let i = 0; i < msgIdHisList.length-1; i++) {
          let m1 = msgIdHisList[i];
          let m2 = msgIdHisList[i+1];
          if(m1.cityCode==m2.cityCode&&m1.provinceCode==m2.provinceCode&&m1.livingName==m2.livingName) {
            msgIdHisList.splice(i, 1)
          }
        }
      }
      this.historySearchList = msgIdHisList;
      this.historySearchListShow = true;
    }

    if(this.searchVillageList && !this.searchVillageList.length) {
      this.historySearchListShow = false;
    }
  },
  methods: {
    ...mapActions('area', ['queryVillageList', 'setSearchVillageList']),
    filterImg(img) {
      return this.userInfo.resourcesUrl + img;
    },
    deletenull(str){
      str = str.replace(/\s+/g,"");
      return str
    },
    historySearch(item) {
      queryVillageList(item).then(res=> {
        let data = {
          datalist: res.datalist,
          totalCount: res.totalCount,
          start: 0
        }
        this.bannerListShow = false
        this.historySearchListShow = false;
        this.setSearchVillageList(data)
      })
    },
    deleteHistorySearchList() {
      this.$confirm({
        title: '提示',
        msg: '是否清空所有历史记录'
      })
        .success(instance => {
          instance.close();
          this.historySearchListShow = false;
          localStorage.setItem('areaHosDataArr', JSON.stringify([]))
        })
    },
    toSetHouse: debounce(function() {
      this.$router.push('/sethouse');
    }, 20),
    search() {
      console.log(this.villageName)
      this.historySearchListShow = false;
      // this.bannerListShow = false;
      // if (!this.villageName) return this.$toast('请输入小区名！');
      this.queryVillageList({villageName: this.villageName})
    },
    toTypeChange: debounce(function(item) {
      if(this.$route.query.planId) {
        return this.$router.push({name: 'typechange', params: {title: item.livingName, id: item.livingId}, query: {planId: this.$route.query.planId}})
      }
      this.$router.push({name: 'typechange', params: {title: item.livingName, id: item.livingId}})
    }, 20),
    loadMore() {
      if(isArray(this.searchVillageList) && !this.isAllData) {
        this.start++;
        this.queryVillageList({start: this.start, villageName: this.villageName})
      }
    }
  },
  components: {
    HouseAddress
  }
}
</script>

<style lang="scss" scoped>
.area {
  @at-root #{&}__container {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .banner{
      width: 100%;
      position: absolute;
      bottom: 100px;
      .swiper-wrapper{
        .swiper-box{
          box-sizing: border-box;
          height: 200px;
          width: 690px;
          img{
            height: 200px;
            width: 690px;
          }
        }
      }
    }
  }

  @at-root #{&}__searchinfo {
  .search-history{
    margin-top: 60px;
     padding: 0 30px;
  }
  .search-history .history-title{
    color: #999;
    font-size: 28px;
  }
  .history-title .title-icon img{
    width: 44px;
    height: 44px;
  }
  .search-history .history-list .list-item{
    padding: 15px 30px;
    background-color: #e8e8e8;
    border-radius: 30px;
    color: #666;
    font-size: 26px;
    margin: 28px 20px 0 0;
  }
    @at-root .form {

      @at-root #{&}__condition {
        padding-left: 30px;
        background-color: #fff;

        @at-root #{&}--item {
          display: flex;
          height: 120px;
          line-height: 120px;
          font-size: 30px;
          border-bottom: 1px solid #eee;
          /*&:first-child {*/
            /*border-bottom: 1px solid #eee;*/
          /*}*/
        }
      }

      @at-root #{&}__label {
        color: #333333;
        margin-right: 40px;
      }

      @at-root #{&}__input {
        color: #333333;
        flex-grow: 1;
      }

      @at-root #{&}__search {
        padding: 42px 30px;

        @at-root #{&}--btn {
          display: block;
          width: 100%;
          border: none;
          height: 80px;
          line-height: 80px;
          text-align: center;
          font-size: 36px;
          color: #fff;
          border-radius: 50px;
          background-color: #ff6419;
        }
      }
    }
  }

  @at-root #{&}__upload {
    padding-top: 40px;
    font-size: 28px;
    padding-left: 30px;
    position: relative;
    @at-root #{&}--tip {
      color: #999;
    }

    @at-root #{&}--page {
      /*color: #ff6419;*/
      color: #333333;
    }
    em{
      font-size: 28px;
      font-style: normal;
       position: absolute;
       right:30px;
      color: #333333;
    }
  }

  @at-root #{&}__searchlist {
    padding-bottom: 100px;

    @at-root .search {

      @at-root #{&}__result {
        margin-bottom: 30px;
        text-indent: 30px;
        font-size: 24px;
        color: #8e8e8e;
        margin-top: 20px;
      }

      @at-root #{&}__list {
        padding-left: 30px;
        background-color: #fff;
      }
    }

    @at-root .list {

      @at-root #{&}__item {
        display: flex;
        justify-content: space-between;
        height: 90px;
        line-height: 90px;
        padding-right: 30px;

        &:not(:nth-last-of-type(1)) {
          border-bottom: 1px solid #eee;/*no*/
        }

        @at-root #{&}--name {
          font-size: 30px;
          color: #494949;
          height: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @at-root #{&}--count {
          font-size: 24px;
          color: #8e8e8e;
        }
      }
    }
  }

}
</style>

