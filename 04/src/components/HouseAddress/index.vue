<template>
  <div @click="showPicker" v-html="selectCity.join('&emsp;')" class="address-area"></div>
  <!--'&emsp;|&emsp;'-->
</template>

<script>
import Vue from 'vue';
import { Style, CascadePicker } from 'cube-ui';
import { mapGetters, mapActions } from 'Vuex';
import { isEmpty, get, debounce } from 'lodash';
Vue.use(CascadePicker);

export default {
  name: 'house-address',
  data() {
    return {
      instance: '',
      parentindex:2
    }
  },
  computed: {
    ...mapGetters('area', ['provinces', 'selectIndex', 'selectCity'])
  },
  methods: {
    ...mapActions('area', ['queryProvincesAndCities', 'setSelectCityInfo', 'setSelectIndex']),
    showPicker: debounce(function(e) {
      this.instance.setData(this.provinces, this.selectIndex)
      this.instance.show()
    }, 20),
    async changeProvince(i, newIndex) {
      if (i === 0) { //省
        this.parentindex=newIndex;
        this.setSelectIndex([newIndex, 0, 0])
        if (isEmpty(this.provinces[newIndex]['children'])) { //省
          await this.queryProvincesAndCities({provinceCode: get(this.provinces, `${newIndex}.value`), index: newIndex});
        }
        if(isEmpty(this.provinces[newIndex]['children'][0].children)){ //市
          await this.queryProvincesAndCities({cityCode: get(this.provinces, `${this.parentindex}.children.0.value`), index: 0});
        }
        this.instance.setData(this.provinces, this.selectIndex)
      }else if(i === 1){ //区
        this.setSelectIndex([this.parentindex, newIndex, 0]);
        await this.queryProvincesAndCities({cityCode: get(this.provinces, `${this.parentindex}.children.${newIndex}.value`), index: newIndex});
        this.instance.setData(this.provinces, this.selectIndex)
      }
    },
    selectHandle(...data) {
      this.setSelectCityInfo(data);
    }
  },
  async created() {
    await this.queryProvincesAndCities({isCity: false});
    await this.queryProvincesAndCities({provinceCode: '440000', index: 2});
    this.queryProvincesAndCities({cityCode: '440300', index: 1});
    this.instance = this.$createCascadePicker({
      swipeTime: 1000,
      async: true,
      data: this.provinces,
      selectedIndex: this.selectIndex,
      alias: { text: 'name' },
      onChange: this.changeProvince,
      onSelect: this.selectHandle
    })
  }
}
</script>

<style lang="scss">
.cube-picker {
  z-index: 11000!important;
}
  .address-area{
     flex: 1;
     overflow: hidden;
     text-overflow: ellipsis;
     white-space: nowrap;
  }
</style>

