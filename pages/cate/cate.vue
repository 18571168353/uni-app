<template>
  <view>
    <view class="scroll-view-container">
      <!-- 左侧的滑动区域 -->
      <scroll-view scroll-y="true" :style="{height:wh+'px'}" class="left-scroll-view">
        <block v-for="(item, i) in cateList" :key="i">
          <view :class="['left-scroll-view-item', i === active ? 'active' : '']" @click="activeChanged(i)">
            {{item.cat_name}}
          </view>
        </block>
      </scroll-view>
      <!-- 右侧滑动区域 -->
      <scroll-view scroll-y="true" :style="{height:wh+'px'}" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
          <view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
          <!-- 动态渲染三级分类的列表数据 -->
          <view class="cate-lv3-list">
            <!-- 三级分类 Item 项 -->
            <view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
              <!-- 图片 -->
              <image :src="item3.cat_icon"></image>
              <!-- 文本 -->
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        wh: 0,
        // 当前选中项的索引，默认让第一项被选中
        active: 0,
        cateList: [],
        // 二级分类列表
        cateLevel2: [],
        // 滚动条距离顶部的距离
        scrollTop: 0
      };
    },
    onLoad() {
      const sysInfo = uni.getSystemInfoSync()
      this.wh = sysInfo.windowHeight
      this.getCateList()
    },
    methods: {
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories')
        if (res.meta.status !== 200) return uni.$showMsg()
        this.cateList = res.message
        // 为二级分类赋值
        this.cateLevel2 = res.message[0].children
      },
      // 选中项改变的事件处理函数
      activeChanged(i) {
        this.active = i
        // 为二级分类列表重新赋值
        this.cateLevel2 = this.cateList[i].children
        // 让 scrollTop 的值在 0 与 1 之间切换
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      // 点击三级分类项跳转到商品列表页面
      gotoGoodsList(item3) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?cid=' + item3.cat_id
        })
      }
    }
  }
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;

    .left-scroll-view {
      width: 120px;

      .left-scroll-view-item {
        background-color: #f7f7f7;
        line-height: 60px;
        text-align: center;
        font-size: 12px;

        &.active {
          background-color: #ffffff;
          position: relative;

          &::before {
            content: '';
            display: block;
            width: 3px;
            height: 30px;
            background-color: #C00000;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translate(0, -50%);
          }
        }
      }
    }

    .cate-lv2-title {
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      padding: 15px 0;
    }
  }

  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;

    .cate-lv3-item {
      width: 33.33%;
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;

      image {
        width: 60px;
        height: 60px;
      }

      text {
        font-size: 12px;
      }
    }
  }
</style>
