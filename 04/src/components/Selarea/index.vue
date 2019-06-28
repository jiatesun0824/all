<template>
  <div class="selarea">
    <div class="selarea-wrapper">
      <div class="area-header">
        <div class="goArea" @click="closeArea"></div>
        <span class="headTxt">{{areaTxt}}</span>
      </div>
      <div class="area-wrapper" ref="areaWrapper">
        <ul class="content">
          <li v-for="(item,index) in info"
            @click="selProvince(index)"
            class="area-item"
            :class="index == (info.length - 1) ? 'end-li' : ''"
            :letter="item.letter"
            :key="index"
          >
            {{item.areaName}}
          </li>
        </ul>
      </div>
      <!-- <div class="letter">
        <ul>
          <li v-for="(item,index) in letter" @touchend="selInitial(index)" :class="activeLiIndex == index ? 'activeLi' : ''">{{item}}</li>
        </ul>
      </div> -->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from "better-scroll";
import { mapState } from "Vuex";

export default {
  name: 'selarea',
  props: ["selareaName"],
  data() {
    return {
      letter: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ],
      activeLiIndex: -1,
      areaScroll: null,
      allInfo: [
        {
          id: 1,
          name: "安徽省",
          code: "340000",
          letter: "A",
          city: [
            { id: 1, code: "340800", name: "安庆市", letter: "A" },
            { id: 2, code: "340300", name: "蚌埠市", letter: "B" },
            { id: 3, code: "341700", name: "池州市", letter: "C" },
            { id: 4, code: "341400", name: "巢湖市", letter: "" },
            { id: 5, code: "341100", name: "滁州市", letter: "" },
            { id: 6, code: "341200", name: "阜阳市", letter: "F" },
            { id: 7, code: "340100", name: "合肥市", letter: "H" },
            { id: 8, code: "340600", name: "淮北市", letter: "" },
            { id: 9, code: "340400", name: "淮南市", letter: "" },
            { id: 10, code: "341000", name: "黄山市", letter: "" },
            { id: 11, code: "341600", name: "亳州市", letter: "" },
            { id: 12, code: "341500", name: "六安市", letter: "L" },
            { id: 13, code: "340500", name: "马鞍山市", letter: "M" },
            { id: 14, code: "341300", name: "宿州市", letter: "S" },
            { id: 15, code: "340700", name: "铜陵市", letter: "T" },
            { id: 16, code: "340200", name: "芜湖市", letter: "W" },
            { id: 17, code: "341800", name: "宣城市", letter: "X" }
          ]
        },
        {
          id: 2,
          name: "澳门特别行政区",
          code: "820000",
          letter: "",
          city: [{ id: 1, name: "澳门", letter: "" }]
        },
        {
          id: 3,
          name: "北京市",
          code: "110000",
          letter: "B",
          city: [
            { id: 1, name: "崇文区", letter: "C" },
            { id: 2, name: "昌平区", letter: "" },
            { id: 3, name: "东城区", letter: "D" },
            { id: 4, name: "大兴区", letter: "" },
            { id: 5, name: "丰台区", letter: "F" },
            { id: 6, name: "房山区", letter: "" },
            { id: 7, name: "海淀区", letter: "H" },
            { id: 8, name: "怀柔区", letter: "" },
            { id: 9, name: "密云县", letter: "M" },
            { id: 10, name: "门头沟区", letter: "" },
            { id: 11, name: "平谷区", letter: "P" },
            { id: 12, name: "石景山区", letter: "S" },
            { id: 13, name: "顺义区", letter: "" },
            { id: 14, name: "通州区", letter: "T" },
            { id: 15, name: "西城区", letter: "X" },
            { id: 16, name: "宣武区", letter: "" },
            { id: 17, name: "延庆县", letter: "Y" },
            { id: 18, name: "朝阳区", letter: "Z" }
          ]
        },
        {
          id: 4,
          name: "重庆市",
          code: "500000",
          letter: "C",
          city: [
            { id: 1, name: "北碚区", letter: "B" },
            { id: 2, name: "巴南区", letter: "" },
            { id: 3, name: "璧山县", letter: "" },
            { id: 4, name: "城口县", letter: "C" },
            { id: 5, name: "长寿区", letter: "" },
            { id: 6, name: "大渡口区", letter: "D" },
            { id: 7, name: "大足县", letter: "" },
            { id: 8, name: "垫江县", letter: "" },
            { id: 9, name: "涪陵区", letter: "F" },
            { id: 10, name: "丰都县", letter: "" },
            { id: 11, name: "奉节县", letter: "" },
            { id: 12, name: "合川市", letter: "H" },
            { id: 13, name: "江津市", letter: "J" },
            { id: 14, name: "江北区", letter: "" },
            { id: 15, name: "九龙坡区", letter: "" },
            { id: 16, name: "开县", letter: "K" },
            { id: 17, name: "梁平县", letter: "L" },
            { id: 18, name: "南岸区", letter: "N" },
            { id: 19, name: "南川市", letter: "" },
            { id: 20, name: "彭水县", letter: "P" },
            { id: 21, name: "綦江县", letter: "Q" },
            { id: 22, name: "黔江区", letter: "" },
            { id: 23, name: "荣昌县", letter: "R" },
            { id: 24, name: "沙坪坝区", letter: "S" },
            { id: 25, name: "沙坪坝区", letter: "" },
            { id: 26, name: "双桥区", letter: "" },
            { id: 27, name: "潼南县", letter: "T" },
            { id: 28, name: "铜梁县", letter: "" },
            { id: 29, name: "万州区", letter: "W" },
            { id: 30, name: "巫山县", letter: "" },
            { id: 31, name: "巫溪县", letter: "" },
            { id: 32, name: "武隆县", letter: "" },
            { id: 33, name: "万盛区", letter: "" },
            { id: 34, name: "渝北区", letter: "Y" },
            { id: 35, name: "永川市", letter: "" },
            { id: 36, name: "酉阳县", letter: "" },
            { id: 37, name: "渝中区", letter: "" },
            { id: 38, name: "云阳县", letter: "" },
            { id: 39, name: "忠县", letter: "Z" }
          ]
        },
        {
          id: 5,
          name: "福建省",
          code: "350000",
          letter: "F",
          city: [
            { id: 1, code: "350100", name: "福州市", letter: "F" },
            { id: 2, code: "350800", name: "龙岩市", letter: "L" },
            { id: 3, code: "350700", name: "南平市", letter: "N" },
            { id: 4, code: "350900", name: "宁德市", letter: "" },
            { id: 5, code: "350300", name: "莆田市", letter: "P" },
            { id: 6, code: "350500", name: "泉州市", letter: "Q" },
            { id: 7, code: "350400", name: "三明市", letter: "S" },
            { id: 8, code: "350200", name: "厦门市", letter: "X" },
            { id: 9, code: "350600", name: "漳州市", letter: "Z" }
          ]
        },
        {
          id: 6,
          name: "广东省",
          code: "440000",
          letter: "G",
          city: [
            { id: 1, code: "445100", name: "潮州市", letter: "C" },
            { id: 2, code: "441900", name: "东莞市", letter: "D" },
            { id: 3, code: "440600", name: "佛山市", letter: "F" },
            { id: 4, code: "440100", name: "广州市", letter: "G" },
            { id: 5, code: "441600", name: "河源市", letter: "H" },
            { id: 6, code: "441300", name: "惠州市", letter: "" },
            { id: 7, code: "445200", name: "揭阳市", letter: "J" },
            { id: 8, code: "440700", name: "江门市", letter: "" },
            { id: 9, code: "441400", name: "梅州市", letter: "M" },
            { id: 10, code: "440900", name: "茂名市", letter: "" },
            { id: 11, code: "441800", name: "清远市", letter: "Q" },
            { id: 12, code: "440300", name: "深圳市", letter: "S" },
            { id: 13, code: "440500", name: "汕头市", letter: "" },
            { id: 14, code: "440200", name: "韶关市", letter: "" },
            { id: 15, code: "441500", name: "汕尾市", letter: "" },
            { id: 16, code: "441700", name: "阳江市", letter: "Y" },
            { id: 17, code: "445300", name: "云浮市", letter: "" },
            { id: 18, code: "442000", name: "中山市", letter: "Z" },
            { id: 19, code: "440400", name: "珠海市", letter: "" },
            { id: 20, code: "440800", name: "湛江市", letter: "" },
            { id: 21, code: "441200", name: "肇庆市", letter: "" }
          ]
        },
        {
          id: 7,
          name: "广西壮族自治区",
          code: "450000",
          letter: "",
          city: [
            { id: 1, code: "450500", name: "北海市", letter: "B" },
            { id: 2, code: "451000", name: "百色市", letter: "" },
            { id: 3, code: "451400", name: "崇左市", letter: "C" },
            { id: 4, code: "450600", name: "防城港市", letter: "F" },
            { id: 5, code: "450800", name: "贵港市", letter: "G" },
            { id: 6, code: "450300", name: "桂林市", letter: "" },
            { id: 7, code: "451200", name: "河池市", letter: "H" },
            { id: 8, code: "451100", name: "贺州市", letter: "" },
            { id: 9, code: "450200", name: "柳州市", letter: "L" },
            { id: 10, code: "451300", name: "来宾市", letter: "" },
            { id: 11, code: "450100", name: "南宁市", letter: "N" },
            { id: 12, code: "450700", name: "钦州市", letter: "Q" },
            { id: 13, code: "450400", name: "梧州市", letter: "W" },
            { id: 14, code: "450900", name: "玉林市", letter: "Y" }
          ]
        },
        {
          id: 8,
          name: "贵州省",
          code: "520000",
          letter: "",
          city: [
            { id: 1, code: "520400", name: "安顺市", letter: "A" },
            { id: 2, code: "522400", name: "毕节地区", letter: "B" },
            { id: 3, code: "520100", name: "贵阳市", letter: "G" },
            { id: 4, code: "520200", name: "六盘水市", letter: "L" },
            { id: 5, code: "522600", name: "黔东南州", letter: "Q" },
            { id: 6, code: "522700", name: "黔南州", letter: "" },
            { id: 7, code: "522300", name: "黔西南州", letter: "" },
            { id: 8, code: "522200", name: "铜仁地区", letter: "T" },
            { id: 9, code: "520300", name: "遵义市", letter: "Z" }
          ]
        },
        {
          id: 9,
          name: "甘肃省",
          code: "620000",
          letter: "",
          city: [
            { id: 1, code: "620400", name: "白银市", letter: "B" },
            { id: 2, code: "621100", name: "定西地区", letter: "D" },
            { id: 3, code: "623000", name: "甘南州", letter: "G" },
            { id: 4, code: "620900", name: "酒泉市", letter: "J" },
            { id: 5, code: "620200", name: "嘉峪关市", letter: "" },
            { id: 6, code: "620300", name: "金昌市", letter: "" },
            { id: 7, code: "620100", name: "兰州市", letter: "L" },
            { id: 8, code: "621200", name: "陇南地区", letter: "" },
            { id: 9, code: "622900", name: "临夏州", letter: "" },
            { id: 10, code: "620800", name: "平凉市", letter: "P" },
            { id: 11, code: "621000", name: "庆阳市", letter: "Q" },
            { id: 12, code: "620500", name: "天水市", letter: "T" },
            { id: 13, code: "620600", name: "武威市", letter: "W" },
            { id: 14, code: "620700", name: "张掖市", letter: "Z" }
          ]
        },
        {
          id: 10,
          name: "河南省",
          code: "410000",
          letter: "H",
          city: [
            { id: 1, code: "410500", name: "安阳市", letter: "A" },
            { id: 2, code: "410600", name: "鹤壁市", letter: "H" },
            { id: 3, code: "410800", name: "焦作市", letter: "J" },
            { id: 4, code: "410881", name: "济源市", letter: "" },
            { id: 5, code: "410200", name: "开封市", letter: "K" },
            { id: 6, code: "410300", name: "洛阳市", letter: "L" },
            { id: 7, code: "411100", name: "漯河市", letter: "" },
            { id: 8, code: "411300", name: "南阳市", letter: "N" },
            { id: 9, code: "410400", name: "平顶山市", letter: "P" },
            { id: 10, code: "410900", name: "濮阳市", letter: "" },
            { id: 11, code: "411400", name: "商丘市", letter: "S" },
            { id: 12, code: "411200", name: "三门峡市", letter: "" },
            { id: 13, code: "410700", name: "新乡市", letter: "X" },
            { id: 14, code: "411500", name: "信阳市", letter: "" },
            { id: 15, code: "411000", name: "许昌市", letter: "" },
            { id: 16, code: "410100", name: "郑州市", letter: "Z" },
            { id: 17, code: "411600", name: "周口市", letter: "" },
            { id: 18, code: "411700", name: "驻马店市", letter: "" }
          ]
        },
        {
          id: 11,
          name: "河北省",
          code: "130000",
          letter: "",
          city: [
            { id: 1, code: "130600", name: "保定市", letter: "B" },
            { id: 2, code: "130900", name: "沧州市", letter: "C" },
            { id: 3, code: "130800", name: "承德市", letter: "" },
            { id: 4, code: "130400", name: "邯郸市", letter: "H" },
            { id: 5, code: "139000", name: "华北区", letter: "" },
            { id: 6, code: "131100", name: "衡水市", letter: "" },
            { id: 7, code: "131000", name: "廊坊市", letter: "L" },
            { id: 8, code: "130300", name: "秦皇岛市", letter: "Q" },
            { id: 9, code: "130100", name: "石家庄市", letter: "S" },
            { id: 10, code: "130200", name: "唐山市", letter: "T" },
            { id: 11, code: "130500", name: "邢台市", letter: "X" },
            { id: 12, code: "130700", name: "张家口市", letter: "Z" }
          ]
        },
        {
          id: 12,
          name: "湖南省",
          code: "430000",
          letter: "",
          city: [
            { id: 1, code: "430100", name: "长沙市", letter: "C" },
            { id: 2, code: "430700", name: "常德市", letter: "" },
            { id: 3, code: "430200", name: "郴州市", letter: "" },
            { id: 4, code: "430400", name: "衡阳市", letter: "H" },
            { id: 5, code: "431200", name: "怀化市", letter: "" },
            { id: 6, code: "431300", name: "娄底市", letter: "L" },
            { id: 7, code: "430500", name: "邵阳市", letter: "S" },
            { id: 8, code: "430300", name: "湘潭市", letter: "X" },
            { id: 9, code: "433100", name: "湘西州", letter: "" },
            { id: 10, code: "431100", name: "永州市", letter: "Y" },
            { id: 11, code: "430600", name: "岳阳市", letter: "" },
            { id: 12, code: "430900", name: "益阳市", letter: "" },
            { id: 13, code: "430200", name: "株洲市", letter: "Z" },
            { id: 14, code: "430800", name: "张家界市", letter: "" }
          ]
        },
        {
          id: 13,
          name: "湖北省",
          code: "420000",
          letter: "",
          city: [
            { id: 1, code: "422800", name: "恩施州", letter: "E" },
            { id: 2, code: "420700", name: "鄂州市", letter: "" },
            { id: 3, code: "421100", name: "黄冈市", letter: "H" },
            { id: 4, code: "420200", name: "黄石市", letter: "" },
            { id: 5, code: "421000", name: "荆州市", letter: "J" },
            { id: 6, code: "420800", name: "荆门市", letter: "" },
            { id: 7, code: "42900", name: "潜江市", letter: "Q" },
            { id: 8, code: "420300", name: "十堰市", letter: "S" },
            { id: 9, code: "421300", name: "随州市", letter: "" },
            { id: 10, code: "429000", name: "神农架林区", letter: "" },
            { id: 11, code: "429000", name: "天门市", letter: "T" },
            { id: 12, code: "420100", name: "武汉市", letter: "W" },
            { id: 13, code: "420600", name: "襄樊市", letter: "X" },
            { id: 14, code: "420900", name: "孝感市", letter: "" },
            { id: 15, code: "421200", name: "咸宁市", letter: "" },
            { id: 16, code: "429000", name: "仙桃市", letter: "" },
            { id: 17, code: "420500", name: "宜昌市", letter: "Y" }
          ]
        },
        {
          id: 14,
          name: "海南省",
          code: "460000",
          letter: "",
          city: [
            { id: 1, code: "469000", name: "保亭县", letter: "B" },
            { id: 2, code: "469000", name: "白沙县", letter: "" },
            { id: 3, code: "469000", name: "昌江县", letter: "C" },
            { id: 4, code: "469000", name: "澄迈县", letter: "" },
            { id: 5, code: "469000", name: "东方市", letter: "D" },
            { id: 6, code: "469000", name: "儋州市", letter: "" },
            { id: 7, code: "469000", name: "定安县", letter: "" },
            { id: 8, code: "460100", name: "海口市", letter: "H" },
            { id: 9, code: "469000", name: "陵水县", letter: "L" },
            { id: 10, code: "469000", name: "乐东县", letter: "" },
            { id: 11, code: "469000", name: "临高县", letter: "" },
            { id: 12, code: "469000", name: "琼海市", letter: "Q" },
            { id: 13, code: "469000", name: "琼中县", letter: "" },
            { id: 14, code: "460200", name: "三亚市", letter: "S" },
            { id: 15, code: "469000", name: "屯昌县", letter: "T" },
            { id: 16, code: "469000", name: "文昌市", letter: "W" },
            { id: 17, code: "469000", name: "五指山市", letter: "" },
            { id: 18, code: "469000", name: "万宁市", letter: "" }
          ]
        },
        {
          id: 15,
          name: "黑龙江",
          code: "230000",
          letter: "",
          city: [
            { id: 1, code: "230600", name: "大庆市", letter: "D" },
            { id: 2, code: "232700", name: "大兴安岭地区", letter: "" },
            { id: 3, code: "230100", name: "哈尔滨市", letter: "H" },
            { id: 4, code: "231100", name: "黑河市", letter: "" },
            { id: 5, code: "230400", name: "鹤岗市", letter: "" },
            { id: 6, code: "230800", name: "佳木斯市", letter: "J" },
            { id: 7, code: "230300", name: "鸡西市", letter: "" },
            { id: 8, code: "231000", name: "牡丹江市", letter: "M" },
            { id: 9, code: "230200", name: "齐齐哈尔市", letter: "Q" },
            { id: 10, code: "230900", name: "七台河市", letter: "" },
            { id: 11, code: "230500", name: "双鸭山市", letter: "S" },
            { id: 12, code: "231200", name: "绥化市", letter: "" },
            { id: 13, code: "230700", name: "伊春市", letter: "Y" }
          ]
        },
        {
          id: 16,
          name: "江苏省",
          code: "320000",
          letter: "J",
          city: [
            { id: 1, code: "320400", name: "常州市", letter: "C" },
            { id: 2, code: "320800", name: "淮安市", letter: "H" },
            { id: 3, code: "320700", name: "连云港市", letter: "L" },
            { id: 4, code: "320100", name: "南京市", letter: "N" },
            { id: 5, code: "320600", name: "南通市", letter: "" },
            { id: 6, code: "320500", name: "苏州市", letter: "S" },
            { id: 7, code: "321300", name: "宿迁市", letter: "" },
            { id: 8, code: "321200", name: "泰州市", letter: "T" },
            { id: 9, code: "320200", name: "无锡市", letter: "W" },
            { id: 10, code: "320300", name: "徐州市", letter: "X" },
            { id: 11, code: "320900", name: "盐城市", letter: "Y" },
            { id: 12, code: "321000", name: "扬州市", letter: "" },
            { id: 13, code: "321100", name: "镇江市", letter: "Z" }
          ]
        },
        {
          id: 17,
          name: "江西省",
          code: "360000",
          letter: "",
          city: [
            { id: 1, code: "361000", name: "抚州市", letter: "F" },
            { id: 2, code: "360700", name: "赣州市", letter: "G" },
            { id: 3, code: "360800", name: "吉安市", letter: "J" },
            { id: 4, code: "360400", name: "九江市", letter: "" },
            { id: 5, code: "360200", name: "景德镇市", letter: "" },
            { id: 6, code: "360100", name: "南昌市", letter: "N" },
            { id: 7, code: "360300", name: "萍乡市", letter: "P" },
            { id: 8, code: "361100", name: "上饶市", letter: "S" },
            { id: 9, code: "360500", name: "新余市", letter: "X" },
            { id: 10, code: "360900", name: "宜春市", letter: "Y" },
            { id: 11, code: "360600", name: "鹰潭市", letter: "" }
          ]
        },
        {
          id: 18,
          name: "吉林省",
          code: "220000",
          letter: "",
          city: [
            { id: 1, code: "220600", name: "白山市", letter: "B" },
            { id: 2, code: "220800", name: "白城市", letter: "" },
            { id: 3, code: "220100", name: "长春市", letter: "C" },
            { id: 4, code: "220200", name: "吉林市", letter: "J" },
            { id: 5, code: "220400", name: "辽源市", letter: "L" },
            { id: 6, code: "220700", name: "松原市", letter: "S" },
            { id: 7, code: "220300", name: "四平市", letter: "" },
            { id: 8, code: "220500", name: "通化市", letter: "T" },
            { id: 9, code: "222400", name: "延边州", letter: "Y" }
          ]
        },
        {
          id: 19,
          name: "辽宁省",
          code: "210000",
          letter: "L",
          city: [
            { id: 1, code: "210300", name: "鞍山市", letter: "A" },
            { id: 2, code: "210500", name: "本溪市", letter: "B" },
            { id: 3, code: "210200", name: "大连市", letter: "D" },
            { id: 4, code: "210600", name: "丹东市", letter: "" },
            { id: 5, code: "210400", name: "抚顺市", letter: "F" },
            { id: 6, code: "210900", name: "阜新市", letter: "" },
            { id: 7, code: "211400", name: "葫芦岛市", letter: "H" },
            { id: 8, code: "210700", name: "锦州市", letter: "J" },
            { id: 9, code: "211000", name: "辽阳市", letter: "L" },
            { id: 10, code: "211100", name: "盘锦市", letter: "P" },
            { id: 11, code: "210100", name: "沈阳市", letter: "S" },
            { id: 12, code: "211200", name: "铁岭市", letter: "T" },
            { id: 13, code: "210800", name: "营口市", letter: "Y" },
            { id: 14, code: "211300", name: "朝阳市", letter: "Z" }
          ]
        },
        {
          id: 20,
          name: "内蒙古自治区",
          code: "150000",
          letter: "N",
          city: [
            { id: 1, code: "152900", name: "阿拉善盟", letter: "A" },
            { id: 2, code: "150200", name: "包头市", letter: "B" },
            { id: 3, code: "150800", name: "巴彦淖尔盟", letter: "" },
            { id: 4, code: "150400", name: "赤峰市", letter: "C" },
            { id: 5, code: "150600", name: "鄂尔多斯市", letter: "E" },
            { id: 6, code: "150100", name: "呼和浩特市", letter: "H" },
            { id: 7, code: "150700", name: "呼伦贝尔市", letter: "" },
            { id: 8, code: "150500", name: "通辽市", letter: "T" },
            { id: 9, code: "150300", name: "乌海市", letter: "W" },
            { id: 10, code: "150900", name: "乌兰察布盟", letter: "" },
            { id: 11, code: "152200", name: "兴安盟", letter: "X" },
            { id: 12, code: "152500", name: "锡林郭勒盟", letter: "" }
          ]
        },
        {
          id: 21,
          name: "宁夏回族自治区",
          code: "640000",
          letter: "",
          city: [
            { id: 1, code: "640400", name: "固原市", letter: "G" },
            { id: 2, code: "640200", name: "石嘴山市", letter: "S" },
            { id: 3, code: "640300", name: "吴忠市", letter: "W" },
            { id: 4, code: "640100", name: "银川市", letter: "Y" },
            { id: 5, code: "640500", name: "中卫市", letter: "Z" }
          ]
        },
        {
          id: 22,
          name: "青海省",
          code: "630000",
          letter: "Q",
          city: [
            { id: 1, code: "632600", name: "果洛州", letter: "G" },
            { id: 2, code: "632800", name: "海西州", letter: "H" },
            { id: 3, code: "632100", name: "海东地区", letter: "" },
            { id: 4, code: "632200", name: "海北州", letter: "" },
            { id: 5, code: "632300", name: "黄南藏族自治州", letter: "" },
            { id: 6, code: "630100", name: "西宁市", letter: "X" },
            { id: 7, code: "632700", name: "玉树州", letter: "Y" }
          ]
        },
        {
          id: 23,
          name: "山东省",
          code: "370000",
          letter: "S",
          city: [
            { id: 1, code: "371600", name: "滨州市", letter: "B" },
            { id: 2, code: "370500", name: "东营市", letter: "D" },
            { id: 3, code: "371400", name: "德州市", letter: "" },
            { id: 4, code: "371700", name: "菏泽市", letter: "H" },
            { id: 5, code: "370100", name: "济南市", letter: "J" },
            { id: 6, code: "370800", name: "济宁市", letter: "" },
            { id: 7, code: "371300", name: "临沂市", letter: "L" },
            { id: 8, code: "371500", name: "聊城市", letter: "" },
            { id: 9, code: "371200", name: "莱芜市", letter: "" },
            { id: 10, code: "370200", name: "青岛市", letter: "Q" },
            { id: 11, code: "371100", name: "日照市", letter: "R" },
            { id: 12, code: "370900", name: "泰安市", letter: "T" },
            { id: 13, code: "370700", name: "潍坊市", letter: "W" },
            { id: 14, code: "371000", name: "威海市", letter: "" },
            { id: 15, code: "370600", name: "烟台市", letter: "Y" },
            { id: 16, code: "370300", name: "淄博市", letter: "Z" },
            { id: 17, code: "370400", name: "枣庄市", letter: "" }
          ]
        },
        {
          id: 24,
          name: "陕西省",
          code: "610000",
          letter: "",
          city: [
            { id: 1, code: "610900", name: "安康市", letter: "A" },
            { id: 2, code: "610300", name: "宝鸡市", letter: "B" },
            { id: 3, code: "610700", name: "汉中市", letter: "H" },
            { id: 4, code: "611000", name: "商洛市", letter: "S" },
            { id: 5, code: "610200", name: "铜川市", letter: "T" },
            { id: 6, code: "610500", name: "渭南市", letter: "W" },
            { id: 7, code: "610100", name: "西安市", letter: "X" },
            { id: 8, code: "610400", name: "咸阳市", letter: "" },
            { id: 9, code: "610800", name: "榆林市", letter: "Y" },
            { id: 10, code: "610600", name: "延安市", letter: "" }
          ]
        },
        {
          id: 25,
          name: "四川省",
          code: "510000",
          letter: "",
          city: [
            { id: 1, code: "513200", name: "阿坝州", letter: "A" },
            { id: 2, code: "511900", name: "巴中市", letter: "B" },
            { id: 3, code: "510100", name: "成都市", letter: "C" },
            { id: 4, code: "511700", name: "达州市", letter: "D" },
            { id: 5, code: "510600", name: "德阳市", letter: "" },
            { id: 6, code: "510800", name: "广元市", letter: "G" },
            { id: 7, code: "511600", name: "广安市", letter: "" },
            { id: 8, code: "513300", name: "甘孜州", letter: "" },
            { id: 9, code: "513400", name: "凉山州", letter: "L" },
            { id: 10, code: "511100", name: "乐山市", letter: "" },
            { id: 11, code: "510500", name: "泸州市", letter: "" },
            { id: 12, code: "510700", name: "绵阳市", letter: "M" },
            { id: 13, code: "511400", name: "眉山市", letter: "" },
            { id: 14, code: "511300", name: "南充市", letter: "N" },
            { id: 15, code: "511000", name: "内江市", letter: "" },
            { id: 16, code: "510400", name: "攀枝花市", letter: "P" },
            { id: 17, code: "510900", name: "遂宁市", letter: "S" },
            { id: 18, code: "511800", name: "雅安市", letter: "Y" },
            { id: 19, code: "511500", name: "宜宾市", letter: "" },
            { id: 20, code: "510300", name: "自贡市", letter: "Z" },
            { id: 21, code: "512000", name: "资阳市", letter: "" }
          ]
        },
        {
          id: 26,
          name: "山西省",
          code: "140000",
          letter: "",
          city: [
            { id: 1, code: "140400", name: "长治市", letter: "C" },
            { id: 2, code: "140200", name: "大同市", letter: "D" },
            { id: 3, code: "140500", name: "晋城市", letter: "J" },
            { id: 4, code: "140700", name: "晋中市", letter: "" },
            { id: 5, code: "141000", name: "临汾市", letter: "L" },
            { id: 6, code: "141100", name: "吕梁市", letter: "" },
            { id: 7, code: "140600", name: "朔州市", letter: "S" },
            { id: 8, code: "140100", name: "太原市", letter: "T" },
            { id: 9, code: "140900", name: "忻州市", letter: "X" },
            { id: 10, code: "140800", name: "运城市", letter: "Y" },
            { id: 11, code: "140300", name: "阳泉市", letter: "" }
          ]
        },
        {
          id: 27,
          name: "上海市",
          code: "310000",
          letter: "",
          city: [
            { id: 1, name: "宝山区", letter: "B" },
            { id: 2, name: "长宁区", letter: "C" },
            { id: 3, name: "崇明县", letter: "" },
            { id: 4, name: "奉贤区", letter: "F" },
            { id: 5, name: "黄浦区", letter: "H" },
            { id: 6, name: "虹口区", letter: "" },
            { id: 7, name: "金山区", letter: "J" },
            { id: 8, name: "嘉定区", letter: "" },
            { id: 9, name: "静安区", letter: "" },
            { id: 10, name: "卢湾区", letter: "L" },
            { id: 11, name: "闵行区", letter: "M" },
            { id: 12, name: "南汇区", letter: "N" },
            { id: 13, name: "浦东新区", letter: "P" },
            { id: 14, name: "普陀区", letter: "" },
            { id: 15, name: "青浦区", letter: "S" },
            { id: 16, name: "松江区", letter: "" },
            { id: 17, name: "徐汇区", letter: "X" },
            { id: 18, name: "杨浦区", letter: "Y" },
            { id: 19, name: "闸北区", letter: "Z" }
          ]
        },
        {
          id: 28,
          name: "天津市",
          code: "120000",
          letter: "T",
          city: [
            { id: 1, name: "北辰区", letter: "B" },
            { id: 2, name: "宝坻区", letter: "" },
            { id: 3, name: "东丽区", letter: "D" },
            { id: 4, name: "大港区", letter: "" },
            { id: 5, name: "和平区", letter: "H" },
            { id: 6, name: "河北区", letter: "" },
            { id: 7, name: "河西区", letter: "" },
            { id: 8, name: "红桥区", letter: "" },
            { id: 9, name: "汉沽区", letter: "" },
            { id: 10, name: "河东区", letter: "" },
            { id: 11, name: "津南区", letter: "J" },
            { id: 12, name: "静海县", letter: "" },
            { id: 13, name: "蓟县", letter: "" },
            { id: 14, name: "宁河县", letter: "N" },
            { id: 15, name: "南开区", letter: "" },
            { id: 16, name: "塘沽区", letter: "T" },
            { id: 17, name: "武清区", letter: "W" },
            { id: 18, name: "西青区", letter: "X" }
          ]
        },
        {
          id: 29,
          name: "台湾省",
          code: "710000",
          letter: "",
          city: [
            { id: 1, name: "高雄市", letter: "G" },
            { id: 2, name: "基隆市", letter: "J" },
            { id: 3, name: "嘉义市", letter: "" },
            { id: 4, name: "台北市", letter: "T" },
            { id: 5, name: "台中市", letter: "" },
            { id: 6, name: "台南市", letter: "" },
            { id: 7, name: "新竹市", letter: "X" }
          ]
        },
        {
          id: 30,
          name: "香港特别行政区",
          code: "810000",
          letter: "X",
          city: [{ id: 1, name: "香港" }]
        },
        {
          id: 31,
          name: "新疆维吾尔自治区",
          code: "650000",
          letter: "",
          city: [
            { id: 1, code: "652900", name: "阿克苏地区", letter: "A" },
            { id: 2, code: "654300", name: "阿勒泰州", letter: "" },
            { id: 3, code: "659000", name: "阿拉尔市", letter: "" },
            { id: 4, code: "652800", name: "巴音郭楞州", letter: "B" },
            { id: 5, code: "652700", name: "博尔塔拉州", letter: "" },
            { id: 6, code: "652300", name: "昌吉州", letter: "C" },
            { id: 7, code: "652200", name: "哈密地区", letter: "H" },
            { id: 8, code: "653200", name: "和田地区", letter: "" },
            { id: 9, code: "653100", name: "喀什地区", letter: "K" },
            { id: 10, code: "650200", name: "克拉玛依市", letter: "" },
            { id: 11, code: "653000", name: "克孜勒苏州", letter: "" },
            { id: 12, code: "659000", name: "石河子市", letter: "S" },
            { id: 13, code: "654200", name: "塔城地区", letter: "T" },
            { id: 14, code: "652100", name: "吐鲁番地区", letter: "" },
            { id: 15, code: "659000", name: "图木舒克市", letter: "" },
            { id: 16, code: "650100", name: "乌鲁木齐市", letter: "W" },
            { id: 17, code: "659000", name: "五家渠市", letter: "" },
            { id: 18, code: "654000", name: "伊犁州", letter: "Y" }
          ]
        },
        {
          id: 32,
          name: "西藏区",
          code: "540000",
          letter: "",
          city: [
            { id: 1, code: "542500", name: "阿里地区", letter: "A" },
            { id: 2, code: "542100", name: "昌都地区", letter: "C" },
            { id: 3, code: "540100", name: "拉萨市", letter: "L" },
            { id: 4, code: "542600", name: "林芝地区", letter: "" },
            { id: 5, code: "542400", name: "那曲地区", letter: "N" },
            { id: 6, code: "542300", name: "日喀则地区", letter: "R" },
            { id: 7, code: "542200", name: "山南地区", letter: "S" }
          ]
        },
        {
          id: 33,
          name: "云南省",
          code: "530000",
          letter: "Y",
          city: [
            { id: 1, code: "530500", name: "保山市", letter: "B" },
            { id: 2, code: "532300", name: "楚雄州", letter: "C" },
            { id: 3, code: "532900", name: "大理州", letter: "D" },
            { id: 4, code: "533100", name: "德宏州", letter: "" },
            { id: 5, code: "533400", name: "迪庆州", letter: "" },
            { id: 6, code: "532500", name: "红河州", letter: "H" },
            { id: 7, code: "530100", name: "昆明市", letter: "K" },
            { id: 8, code: "530700", name: "丽江地区", letter: "L" },
            { id: 9, code: "530900", name: "临沧地区", letter: "" },
            { id: 10, code: "533300", name: "怒江州", letter: "N" },
            { id: 11, code: "530300", name: "曲靖市", letter: "Q" },
            { id: 12, code: "530800", name: "思茅地区", letter: "S" },
            { id: 13, code: "532600", name: "文山州", letter: "W" },
            { id: 14, code: "532800", name: "西双版纳州", letter: "X" },
            { id: 15, code: "530400", name: "玉溪市", letter: "Y" },
            { id: 16, code: "530600", name: "昭通市", letter: "Z" }
          ]
        },
        {
          id: 34,
          name: "浙江省",
          code: "330000",
          letter: "Z",
          city: [
            { id: 1, code: "330100", name: "杭州市", letter: "H" },
            { id: 2, code: "330500", name: "湖州市", letter: "" },
            { id: 3, code: "330400", name: "嘉兴市", letter: "J" },
            { id: 4, code: "330700", name: "金华市", letter: "" },
            { id: 5, code: "331100", name: "丽水市", letter: "L" },
            { id: 6, code: "330200", name: "宁波市", letter: "N" },
            { id: 7, code: "330800", name: "衢州市", letter: "Q" },
            { id: 8, code: "330600", name: "绍兴市", letter: "S" },
            { id: 9, code: "331000", name: "台州市", letter: "T" },
            { id: 10, code: "330300", name: "温州市", letter: "W" },
            { id: 11, code: "330900", name: "舟山市", letter: "Z" }
          ]
        }
      ],
      info: [],
      scrollDistance: 0,
      scrollToFlag: false,
      selFlag: true
    };
  },
  created() {
    this.activeLiIndex = -1;
    if (this.$store.state.contentFlag) {
      this.API.searchProvinceCodeAndCityCode({
        provinceCode: ""
      }).then(response => {
        if (response) {
          this.info = response.datalist;
          this.$nextTick(() => {
            this._initScroll();
          });
        }
      });
      this.$store.state.areaTxt = "请选择省份";
    } else {
      this.API.searchProvinceCodeAndCityCode({
        provinceCode: sessionStorage.getItem("provinceCode")
      }).then(response => {
        if (response) {
          this.info = response.datalist;
          this.$nextTick(() => {
            this._initScroll();
          });
        }
      });
      this.$store.state.areaTxt = "请选择城市";
    }
  },
  methods: {
    _initScroll() {
      this.areaScroll = new BScroll(this.$refs.areaWrapper, {
        startY: 0,
        click: true,
        probeType: 1
      });
    },
    closeArea() {
      this.$store.state.selareaFlag = false;
      if (this.selareaName == "sethouse") {
        return;
      }
      if (this.$store.state.comeFromPlan) {
        this.$store.commit("showComComponents", false);
      } else {
        this.$store.commit("showComComponents", true);
      }
    },
    selInitial(index) {
      this.activeLiIndex = index;
      if (screen.width > screen.height) {
        this.screenWidth = screen.height;
      } else {
        this.screenWidth = screen.width;
      }
      for (var i = 0; i < this.info.length; i++) {
        if (this.info[i].letter == this.letter[index]) {
          this.scrollToFlag = true;
          this.scrollDistance = -0.8 * this.screenWidth / 7.5 * i; // 计算在不同屏幕大小的情况下滑动的位置
        }
      }
      if (this.scrollToFlag) {
        this.areaScroll.scrollTo(0, this.scrollDistance);
        this.scrollToFlag = false;
      }
    },
    selProvince(index) {
      if (this.selFlag) {
        this.selFlag = false;
        if (this.$store.state.contentFlag) {
          this.$store.state.provinceIndex = index;
          this.$store.state.provinceName = this.info[index].areaName;
          this.API.searchProvinceCodeAndCityCode({
            provinceCode: this.info[index].areaCode
          }).then(response => {
            if (response) {
              this.$store.state.cityName = response.datalist[0].areaName;
              sessionStorage.setItem("provinceCode", this.info[index].areaCode);
              sessionStorage.setItem("cityCode", response.datalist[0].areaCode);
            }
          });
        } else {
          this.$store.state.cityIndex = index;
          this.$store.state.cityName = this.info[index].areaName;
          sessionStorage.setItem("cityCode", this.info[index].areaCode);
        }
        if (this.$store.state.comeFromPlan) {
          this.$store.commit("showComComponents", false);
        } else {
          if (this.selareaName != "sethouse") {
            this.$store.commit("showComComponents", true);
          }
        }
        this.$store.state.selareaFlag = false;
      }
    }
  },
  computed: mapState({
    areaTxt: state => state.areaTxt
  })
};
</script>

<style lang="scss">
@import "styles/mixin.scss";
.selarea {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #f8f8f8;
}

.selarea .selarea-wrapper {
  width: 100%;
  height: 100%;
}

.selarea .selarea-wrapper .area-header {
  width: 100%;
  text-align: 0;
  height: 88px;
  font-size: 36px;
  background: #fff;
  color: #494949;
  line-height: 88px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.selarea .selarea-wrapper .area-header .goArea {
  position: absolute;
  left: 30px;
  top: 50%;
  transform: translateY(-50%);
  width: 25px;
  height: 41px;
  background-size: 25px 41px;
  background-image: url("./images/back_nor.png");
}

.selarea .selarea-wrapper .area-header .headTxt {
  margin: 0 auto;
}

.selarea .selarea-wrapper .area-wrapper {
  position: absolute;
  top: 112.00000000000001px;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 100%;
  background: #fff;
  font-size: 30px;
  overflow: hidden;
}

.selarea .selarea-wrapper .area-wrapper .content {
  position: relative;
}

.selarea .selarea-wrapper .area-wrapper .content .area-item {
  text-align: 112.00000000000001px;
  height: 80px;
  font-size: 30px;
  line-height: 80px;
  margin: 0 30px;
  border-bottom: 1px solid #eee;
}

.selarea .selarea-wrapper .area-wrapper .content .end-li {
  margin: 0;
  padding: 0 30px;
}

@media screen and (max-width: 750px) {
  .selarea .letter {
    position: fixed;
    font-size: 30px;
    top: 50%;
    transform: translateY(-50%);
    right: 30px;
  }

  .selarea .letter li {
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 15px;
    margin-top: 11px;
  }

  .selarea .letter .activeLi {
    background: #ccc;
  }
}

@media screen and (min-width: 750px) {
  .selarea .letter {
    position: fixed;
    font-size: 15px;
    top: 50%;
    transform: translateY(-50%);
    right: 30px;
  }

  .selarea .letter li {
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 15px;
  }

  .selarea .letter .activeLi {
    background: #ccc;
  }
}
</style>
