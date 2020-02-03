// pages/posts/post-detail/post-detail.js
var postsData = require('../../../data/posts-data.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    isPlayingStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const postId = options.id;
    this.setData({
      id: postId
    });
    this.data.id = postId;
    const postData = postsData.postList[postId];
    this.setData(postData);
   
    var postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      var collected = postsCollected[postId];
      this.setData({collected});
    } else {
      postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    }

    if (app.globalData.g_isPlayingStatus && app.globalData.g_playingPostId === this.data.id) {
      this.setData({
        isPlayingStatus: true
      });
    }

    // 监听背景音乐
    this.setMusicMonitor();

  },

  setMusicMonitor: function() {
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    const _this = this;
    backgroundAudioManager.onPlay(function () {
      _this.setData({
        isPlayingStatus: true
      });
      app.globalData.g_isPlayingStatus = true;
      app.globalData.g_playingPostId = _this.data.id;
    });

    backgroundAudioManager.onPause(function (evt) {
      _this.setData({
        isPlayingStatus: false
      });
      app.globalData.g_isPlayingStatus = false;
      app.globalData.g_playingPostId = null;
    });
    backgroundAudioManager.onStop(function (evt) {
      _this.setData({
        isPlayingStatus: false
      });
      app.globalData.g_isPlayingStatus = false;
      app.globalData.g_playingPostId = null;
    });
  },

  onCollectionTap: function(evt) {
    var postId = this.data.id;
    var posts_collected = wx.getStorageSync('posts_collected');
    console.log(posts_collected);
    var post_collected = posts_collected[postId];
    var collected = !post_collected;
    this.setData({ collected });
    posts_collected[postId] = collected;
    wx.setStorageSync('posts_collected', posts_collected);
    this.onShowToast(collected);
  },
  onShowToast: function(collected) {
    wx.showToast({
      title: collected ? '收藏成功': '取消成功',
      icon: 'success',
      duration: 2000
    });
  },
  // 分享按钮
  onShareTap:function(evt) {
    wx.showActionSheet({
      itemList: [
        '分享给微信好友','分享到朋友圈','分享到QQ','分享到微博'
      ],
      itemColor: '#405f80',
      success: function(res) {
        // res.cancel 用户是不是点击了取消按钮
        // res.tapIndex 数组元素的序号，从0开始
      }
    })
  }, 

  // 背景音乐播放
  onMusicTap: function(evt) {
    var id = this.data.id;
    var music = postsData.postList[id].music;
    var isPlayingStatus = this.data.isPlayingStatus;
    if (isPlayingStatus) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingStatus: false
      });
    } else {
      // 只能用网络流媒体
      wx.playBackgroundAudio({
        dataUrl: music.url,
        title: music.title,
        coverImgUrl: music.coverImg
      })
      this.setData({
        isPlayingStatus: true
      });
    }
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

  }
})