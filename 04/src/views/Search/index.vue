<template>
  <div class="search-view">
      <div class="search-box relative">
          <i class="search-icon"></i>
          <div id="search-form">
            <input class="search-text needsclick" v-model="searchText" type="search" @keyup.13="searchSubmit"/>
          </div>
          <!-- <form id="search-form"> -->
          <!-- </form> -->
          <div class="cancle" @click="goBack">取消</div>
          <span class="divider divider-horizontal divider-bottom"></span>
      </div>
      <div class="search-hot">
            <div class="search-title relative clearfix">
              <div v-for = "(item, index) in searchTitleArr" :key="index" :class="[(index != activeTabIndex && 'active')]" @click="chooseItem(index)" class="left">{{item}}</div>
            </div>
            <div class="search-item" v-show="index == activeTabIndex" v-for="(item, index) in new Array(2)" :key="index">
              <span v-for = "(item, index) in hotSearchData" :key="index" @click="gotoDetail(index, item)">{{item.name}}</span>
            </div>
      </div>
      <div class="search-history search-hot" v-show="activeTabIndex == index && isShowHistorySearch" v-for="(item, index) in new Array(2)" :key="index">
          <div class="search-title relative">历史搜索 <i @click="delectAll"></i></div>
          <div class="search-item">
              <span class="history-item" v-for="(item, index) in activeTabIndex == 0 ? historySupplySearchData : historySearchData" :key="index" @click="searchHistory(item)">{{item.name}}</span>
          </div>
      </div>
  </div>
</template>

<script>
import { getallsupplydemandcategory } from "@/api/home";
import { mapGetters, mapActions } from 'Vuex';
import { findIndex } from 'lodash';

export default {
  name: "search-view",
  data() {
    return {
      searchTitleArr: [ "找同城商家" ,"找供求信息"],
      hotSearchData: [],
      historySearchData:
        JSON.parse(sessionStorage.getItem("historySearchData")) || [],
      historySupplySearchData:
        JSON.parse(sessionStorage.getItem("historySupplySearchData")) || [],
      keyWord: '',
      enterPage: ''
    };
  },
  computed: {
		...mapGetters('home', ['homeTypeTab']),
		activeTabIndex() {
      // return findIndex(this.homeTypeTab, {active: true})
      if(findIndex(this.homeTypeTab, { active: true }) == 0) {
        return 1;
      }else {
        return 0;
      }
		},
    isShowHistorySearch() {
      if (this.activeTabIndex == 0) {
        return this.historySupplySearchData.length > 0;
      } else {
        return this.historySearchData.length > 0;
      }
    },
    searchText: {
      get() {
        return this.keyWord;
      },
      set(newValue) {
        this.keyWord = newValue.trim();
      }
    }
  },
  methods: {
		...mapActions('home', ['changeTypeTab']),
    delectAll() {
			if(this.activeTabIndex) {
				this.historySearchData = [];
				sessionStorage.removeItem("historySearchData");
				return;
			}
			this.historySupplySearchData = [];
			sessionStorage.removeItem("historySupplySearchData");
    },
    gotoDetail(id, item) {
		  console.log(id,item)
      const routerName = `/${
        this.activeTabIndex == 0 ? "searchResult" : "searchService"
      }`;
      this.$router.push({
        path: routerName,
        query: {
          categoryId: 2,
          categorySmallId: item.id
        }
      });
      if (item.id == 19) {
        //装修设计  (注意此id与 同城服务列表id不一致)
        sessionStorage.setItem("currentTab", "5");  //装修公司
      } else if (item.id == 18) {
        //
        sessionStorage.setItem("currentTab", "4"); //设计公司
      } else if (item.id == 20) {
        //
        sessionStorage.setItem("currentTab", "3"); //设计师
      }else if (item.id == 21) {
        sessionStorage.setItem("currentTab", "6");  //施工单位
      } else {
        sessionStorage.setItem("currentTab", "2");  //家居建材
        sessionStorage.setItem("styleTile", "家居类别");
      }
    },
    chooseItem(index) {
      // 同城为2，供求为1；同城indx 0 ,供求index 1
      let type, categoryId;
      if(index == 0) {
        type = 2;
        categoryId = 15;
      } else {
         type = 1;
         categoryId = 2;
      }
      this.changeTypeTab(index);
      this.requestgetallsupplydemandcategory({
        type: type,
        categoryId: categoryId
      });
    },
    goBack() {
      this.$router.push('/');
    },
    requestgetallsupplydemandcategory(data) {
      getallsupplydemandcategory(data).then(res => {
        if (data.categoryId == 15) {
          this.hotSearchData = res.obj;
          this.hotSearchData.push({ id: 22, name: "家居建材" });
        } else {
          this.hotSearchData = res.obj;
        }
      });
    },
    searchSubmit() {
      if (this.activeTabIndex == 0) {
        this.historySupplySearchData.push({
          name: this.keyWord
        });
        this.historySupplySearchData = this.filterRepeatData(
          this.historySupplySearchData
        );
        sessionStorage.setItem(
          "historySupplySearchData",
          JSON.stringify(this.historySupplySearchData)
        );
      } else {
        this.historySearchData.push({
          name: this.keyWord
        });
        this.historySearchData = this.filterRepeatData(this.historySearchData);
        sessionStorage.setItem(
          "historySearchData",
          JSON.stringify(this.historySearchData)
        );
      }
      if (this.historySearchData.length > 7) {
        this.historySearchData = this.historySearchData.slice(0, 6);
      }

      sessionStorage.setItem("shopName", this.keyWord);
      sessionStorage.setItem('currentTab', this.$route.query.searchType ? this.$route.query.searchType : '');

      this.$router.push({
        path: `/${this.activeTabIndex == 0 ? "searchResult" : "searchService"}`,
        query: {
          keyName: this.keyWord,
          isSearch: 1
        }
      });
    },
    //数据去重
    filterRepeatData(arr) {
      let hash = {};
      arr = arr.reduce((item, next) => {
        hash[next.name] ? "" : (hash[next.name] = true && item.push(next));
        return item;
      }, []);
      return arr;
    },
    searchHistory(item) {
      this.searchText = item.name;
      this.searchSubmit();
    }
  },
  created() {
    this.requestgetallsupplydemandcategory({
      type: +this.activeTabIndex + 1,
      categoryId: this.activeTabIndex == 0 ? 2 : 15
    });
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.enterPage = from.name;
    })
  },
  beforeRouteLeave(to, from, next) {
    if(to.name === 'serviceList' && this.enterPage === 'searchService') {
      sessionStorage.removeItem('serviceAreaCode');
      sessionStorage.removeItem('serviceStreetCode');
    }
    next();
  }
};
</script>

<style lang="scss" scoped>
@import "~views/Search/styles/index.scss";
</style>

