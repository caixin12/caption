const app = getApp()

// pages/captionDetail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hidemask: true,
    up: false,
    upindex: -1,
    downindex: -1,
    down: false,
    hasmore: true,
    Tcount: 0,
    showcount: false,
    iswhite: 0,
    showtip: false,
    showComment: false,
    hascomment: false

  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;


    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          wHeight: res.windowHeight,
        });

      }
    });

    that.setData({
      model: wx.getSystemInfoSync().model.replace(/\<.*?\>/g, ''),
    });

    that.setData({
      id: options.id,
      share: options.share
    })//options.id;

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        openid: app.globalData.openid,
        hasUserInfo: true
      })
      that.setPre(app.globalData.openid, that.data.id, app.globalData.userInfo.avatarUrl);

    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoOReadyCallback = lres => {
        console.log(app.globalData.userInfo)
        this.setData({
          openid: lres.data.openid,
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })

        that.setPre(app.globalData.openid, that.data.id, app.globalData.userInfo.avatarUrl);
        app.userInfoReadyCallback = res => {
          //console.log(lres.data.openid, this.data.canIUse)

        }

      }

    }

    //that.getDetail(that.data.id);
    that.loadpic()
  },

  loadpic: function () {
    var that = this;
    wx.request({
      url: 'https://h5.yunplus.com.cn/cases/weChatApplet/caption/do/getlistAll.php',
      success: function (res) {
        if (typeof (res.data) == 'string') {

          res.data = res.data.replace(/(^\s*)|(\s*$)/g, "");
          res.data = JSON.parse(res.data);
        }

        if (res.data.success) {

          var current = 0, current_title = "", topTitle = "";
          for (var ii = 0; ii < res.data.items.length; ii++) {
            if (res.data.items[ii].id == that.data.id) {
              current = ii;
              current_title = res.data.items[ii].title;
              res.data.items[ii].blur = 'blur';
              res.data.items[ii].show = true;
              if(ii!=0){
                res.data.items[ii - 1].show = true;
              }
              if (ii != res.data.items.length-1) {
                res.data.items[ii + 1].show = true;
              }

              topTitle = res.data.items[ii].topTitle;
              break;
            }
          }
          that.setData({
            items: res.data.items,
            current: current,
            current_key: that.data.id,
            current_title: current_title,
            topTitle: topTitle
          });
          wx.setNavigationBarTitle({
            title: that.data.topTitle
          })

        }
      }
    })

  },
  touchstart: function (e) {
    var that = this;
    that.oclientY = e.changedTouches[0].clientY;
    that.oclientX = e.changedTouches[0].clientX;

  },
  slide: function (e) {

    var that = this;
    that.nclientY = e.changedTouches[0].clientY;
    that.nclientX = e.changedTouches[0].clientX;


    var dir = that.data.isleftW == 0 ? (that.nclientY - that.oclientY) : (that.nclientX - that.oclientX);

    var items = that.data.items;
    //console.log(Math.abs(that.nclientX - that.oclientX))
    //if (Math.abs(that.nclientX -that.oclientX) < 80){
    var hasmore = true;
    that.setData({
      isleft: that.data.isleftW,
      hasmore: hasmore
    })

    if (dir < -80) {

      if (that.data.current == (items.length - 1)) {
        hasmore = false;
      }
      that.setData({
        upindex: that.data.current + 1,
        up: true,
        down: false,
        hasmore: hasmore
      })
      for (var ii = 0; ii < items.length; ii++) {
        items[ii].show = false;
        if ((that.data.upindex) == ii) {
          items[ii].blur = 'blur';
          items[ii].show = true;
          if (ii != 0) {
            items[ii - 1].show = true;
          }
          if (ii != (items.length - 1)) {
            items[ii + 1].show = true;
          }
          that.setData({
            items: items,
            current_title: items[ii].title,
            current_key: items[ii].id,
            topTitle: items[ii].topTitle
          });
          that.setPre(app.globalData.openid, items[ii].id, that.data.userInfo.avatarUrl);
          //this.audioCtx.seek(0)
          //setTimeout(function () { that.audioCtx.play() }, 180)
          break;
        }
      }
    } else if (dir > 80) {
      if (that.data.current == 0) {
        hasmore = false;
        console.log(hasmore, that.data.current)

      }
      that.setData({
        downindex: that.data.current - 1,
        down: true,
        up: false,
        hasmore: hasmore

      })
      for (var ii = 0; ii < items.length; ii++) {
        items[ii].show = false;
      }
      for (var ii = 0; ii < items.length; ii++) {
        
        if ((that.data.downindex) == ii) {
          items[ii].blur = 'blur';
          items[ii].show = true;
          if (ii != 0) {
            items[ii - 1].show = true;
          }
          if (ii !=(items.length-1)) {
            items[ii + 1].show = true;
          }
          that.setData({
            items: items,
            current_title: items[ii].title,
            current_key: items[ii].id,
            topTitle: items[ii].topTitle,
          });
          that.setPre(app.globalData.openid, items[ii].id, that.data.userInfo.avatarUrl);
          //this.audioCtx.seek(0)
          //setTimeout(function () { that.audioCtx.play() }, 180)

          break;
        }
      }
    }
    wx.setNavigationBarTitle({
      title: that.data.topTitle
    })
    
    //}

  },
  animationend: function () {
    var that = this;
    if (that.data.up == true) {
      that.setData({
        current: that.data.current + 1
      })
    } else {
      that.setData({
        current: that.data.current - 1
      })
    }



  },
  /*slide: function (e) {
    var that = this;
    var items = that.data.items;
    for (var ii = 0; ii < items.length; ii++) {
      if (e.detail.current == ii) {
        items[ii].blur = 'blur';

        that.setData({
          items: items,
          current_title: items[ii].title,
          current_key: items[ii].id
        });
        that.setPre(app.globalData.openid, items[ii].id, that.data.userInfo.avatarUrl);
        this.audioCtx.seek(0)
        that.audioCtx.play()
        break;
      }
    }
    

  },*/

  setPre: function (openid, tushuo_id, logo) {
    var that = this;
    wx.request({
      url: 'https://h5.yunplus.com.cn/cases/weChatApplet/caption/do/addPre.php',
      data: {
        openid: openid,
        tushuo_id: tushuo_id,
        logo: logo
      },
      success: function (res) {
        if (typeof (res.data) == 'string') {
          res.data = res.data.replace(/(^\s*)|(\s*$)/g, "");
          res.data = JSON.parse(res.data);
        }
        if (res.data.success) {
          that.setData({
            list: res.data.list,
            hidemask: res.data.haspre,
            Tcount: res.data.Tcount,
            isleft: res.data.isleft,
            isleftW: res.data.isleft,
            iswhite: res.data.iswhite,
            id: tushuo_id,
            hascomment: res.data.hascomment
          });
          wx.setNavigationBarColor({
            frontColor: res.data.iswhite == 0 ? '#000000' : '#ffffff',
            backgroundColor: res.data.iswhite == 1 ? '#000000' : '#ffffff'
          })
        }
      }
    })
  },

  getDetail: function (id) {
    var that = this;
    wx.request({
      url: 'https://h5.yunplus.com.cn/cases/weChatApplet/caption/do/getonecaption.php',
      data: {
        id: id,
        isPC: 'false'

      },
      success: function (res) {
        if (typeof (res.data) == 'string') {

          res.data = res.data.replace(/(^\s*)|(\s*$)/g, "");
          res.data = JSON.parse(res.data);
        }

        if (res.data.success) {
          that.setData({
            items: res.data.items
          });
          wx.setNavigationBarTitle({
            title: res.data.items.title
          })
        }
      }
    })
  },
  bindpreviewImage: function (e) {
    var that = this;
    var pic = e.currentTarget.dataset.pic;
    wx.previewImage({
      current: pic, // 当前显示图片的http链接
      urls: [pic] // 需要预览的图片http链接列表
    })

  },
  bindmask: function () {
    var that = this;
    that.setData({
      hidemask: true
    });
  },
  bindshowcount: function () {
    var that = this;
    that.setData({
      showcount: true
    });
    setTimeout(function () {
      that.setData({
        showcount: false
      });
    }, 1500)
  },
  bindBack: function (e) {
    var that = this;
    console.log(that.data.share)
    if (that.data.share == "1") {
      wx.navigateTo({
        url: '../caption/index?shareD=1'
      })
    } else {
      wx.navigateBack({
        url: '../caption/index'
      })
    }
  },
  bindshare: function () {
    var that = this;
    that.onShareAppMessage()
  },

  bindchangedir() {
    var that = this;
    var isleft = that.data.isleft == 0 ? 1 : 0;

    wx.request({
      url: 'https://h5.yunplus.com.cn/cases/weChatApplet/caption/do/updataSet.php',
      data: {
        isleft: isleft,
        openid: app.globalData.openid,
        type: 'chagedir'

      },
      success: res => {
        if (typeof (res.data) == 'string') {

          res.data = res.data.replace(/(^\s*)|(\s*$)/g, "");
          res.data = JSON.parse(res.data);
        }


        that.setData({
          isleft: isleft,
          showtip: true
        })
        setTimeout(function () {
          that.setData({
            showtip: false
          });
        }, 1500)
      }
    })
  },

  bindchangebg() {
    var that = this;
    var iswhite = that.data.iswhite == 0 ? 1 : 0;



    wx.request({
      url: 'https://h5.yunplus.com.cn/cases/weChatApplet/caption/do/updataSet.php',
      data: {
        iswhite: iswhite,
        openid: app.globalData.openid,
        type: 'chagebg'

      },
      success: function (res) {
        if (typeof (res.data) == 'string') {

          res.data = res.data.replace(/(^\s*)|(\s*$)/g, "");
          res.data = JSON.parse(res.data);
        }
        that.setData({
          iswhite: iswhite
        })
        wx.setNavigationBarColor({
          frontColor: iswhite == 0 ? '#000000' : '#ffffff',
          backgroundColor: iswhite == 1 ? '#000000' : '#ffffff'
        })
      }
    })
  },
  bindLikeComment: function (event) {
    var that = this;
    var id = event.target.dataset.cid;

    wx.request({
      url: 'https://h5.yunplus.com.cn/cases/weChatApplet/caption/do/addcommentLike.php',
      data: {
        id
      },
      success: function (res) {
        if (typeof (res.data) == 'string') {

          res.data = res.data.replace(/(^\s*)|(\s*$)/g, "");
          res.data = JSON.parse(res.data);
        }
        var commentlist = that.data.commentlist;
        for (var i = 0; i < commentlist.length; i++) {
          if (commentlist[i].id == id) {
            commentlist[i].likeNum = parseInt(commentlist[i].likeNum) + 1;
            commentlist[i].islike = true
          }
        }
        that.setData({
          commentlist: commentlist
        })

      }
    })


  },
  bindcomment() {
    var that = this;
    var id = that.data.id;

    wx.request({
      url: 'https://h5.yunplus.com.cn/cases/weChatApplet/caption/do/getcomment.php',
      data: {
        id
      },
      success: function (res) {
        if (typeof (res.data) == 'string') {

          res.data = res.data.replace(/(^\s*)|(\s*$)/g, "");
          res.data = JSON.parse(res.data);
        }
        that.setData({
          commentlist: res.data.list
        })

      }
    })

    that.setData({
      showComment: !that.data.showComment
    })
  },
  bindCloseComment() {
    var that = this;
    that.setData({
      showComment: !that.data.showComment
    })
  },
  bindsends(event) {
    var that = this;
    var id = that.data.id;
    var logo = app.globalData.userInfo.avatarUrl;
    var nick = app.globalData.userInfo.nickName;
    var brand = that.data.model;
    var comment = event.detail.value;

    if (comment == '') {
      wx.showModal({
        title: '提示',
        content: '不能发送空字符',
        showCancel: false,
        success: function (res) {

        }
      })
    } else {

      wx.request({
        url: 'https://h5.yunplus.com.cn/cases/weChatApplet/caption/do/addcomment.php',
        data: {
          id, logo, nick, brand, comment
        },
        success: function (res) {
          if (typeof (res.data) == 'string') {

            res.data = res.data.replace(/(^\s*)|(\s*$)/g, "");
            res.data = JSON.parse(res.data);
          }
          if (res.data.success) {
            that.setData({
              commentlist: res.data.list
            })
          }


        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    this.audioCtx = wx.createAudioContext('myAudio')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
      title: that.data.userInfo.nickName + '带你一起看天下：' + that.data.current_title,
      path: '/pages/captionDetail/index?id=' + that.data.id + "&share=1",
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})