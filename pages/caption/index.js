const app = getApp()

// pages/caption/index.js
var pageNum = 1,
  pageNum_arr = [1];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,
    captionlist: [],
    scrollTop: 0,
    scrollHeight: 0,
    hasmore: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')

  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  loadList(){
    var that=this;
    pageNum = 1;
    pageNum_arr = [1]
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight)
        that.setData({
          scrollTop: 0,
          scrollHeight: res.windowHeight,
          imgHeight: res.windowWidth / 750 * (554 + 60),
          chaheight: res.windowWidth / 750 * (554 + 60)

        });
        that.getCaptionlist()
        //wx.hideNavigationBarLoading()
      }
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        openid: app.globalData.openid,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(app.globalData.userInfo, this.data.canIUse)
        app.userInfoOReadyCallback = lres => {
          //console.log(lres.data.openid, this.data.canIUse)
          this.setData({
            openid: lres.data.openid,
            userInfo: res.userInfo,
            hasUserInfo: true
          })

        }

      }

    }
    
    that.loadList()
  },

  getCaptionlist: function () {
    var that = this;
    
    wx.request({
      url: 'https://h5.yunplus.com.cn/cases/weChatApplet/caption/do/getListBydate.php',
      data: {
        pageNum: pageNum

      },
      success: function (res) {
        if (typeof (res.data) == 'string') {

          res.data = res.data.replace(/(^\s*)|(\s*$)/g, "");
          res.data = JSON.parse(res.data);
        }

        if (res.data.success) {
          console.log(res.data)
          var captionlist = that.data.captionlist;
          for (var i = 0; i < res.data.items.length; i++) {
            captionlist.push(res.data.items[i]);


          }
          console.log(pageNum,captionlist)
          that.setData({
            captionlist: captionlist,
            hasmore: res.data.hasmore
          });
          pageNum++;

         
        }
      }
    })
  },

  //页面滑动到顶部
  bindTopLoad(){
    var that=this;
    wx.showNavigationBarLoading()
    setTimeout(function () {
      
      wx.hideNavigationBarLoading() //完成停止加载
      that.loadList()
    }, 1000);

  },


  //页面滑动到底部
  bindDownLoad: function () {
    var that = this;
    if (that.data.hasmore == true && pageNum_arr[pageNum_arr.length - 1] != pageNum) {
      console.log(pageNum, pageNum_arr)
      pageNum_arr.push(pageNum)
      that.getCaptionlist();
    }

    console.log("lower", that.data.hasmore, pageNum_arr[pageNum_arr.length - 1] != pageNum, pageNum_arr);

  },
  scroll: function (event) {
    var that = this;
    //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    if (that.data.scrollTop < event.detail.scrollTop) {
      this.setData({
        scrollTop: event.detail.scrollTop
      })
    }



  },
  bindDetailpic: function (e) {
    var that = this;
    console.log(e)
    wx.navigateTo({
      url: '../captionDetail/index?id=' + e.currentTarget.dataset.key
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    return {
      title: '图说时讯，带你一起看天下！',
      path: '/pages/caption/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})