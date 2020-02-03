// pages/movies/movies.js
var app = getApp();
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: [],
    comingSoon: [],
    top250: [],
    containerShow: true,
    searchPanelShow: false,
    inputValue: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var inTheatersUrl = app.globalData.doubanBaseUrl + "/v2/movie/in_theaters";
    var comingSoonUrl = app.globalData.doubanBaseUrl + "/v2/movie/coming_soon";
    var top250Url = app.globalData.doubanBaseUrl + "/v2/movie/top250";
    this.getMovieListData(inTheatersUrl, "inTheaters", "正在上映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "豆瓣Top250");
  },

  getMovieListData: function (url, attribute, title) {
    var _this = this;
    wx.request({
      url: url,
      method: "GET",
      header: {
        "Content-Type": ""
      },
      success: function(res) {
        _this.processDoubanData(res, attribute, title);
      },
      fail: function(fail) {
        console.log(fail);
      }
    })
  },

  processDoubanData: function(movies, attribute, title) {
    var object = {};
    var subjects = movies.data.subjects;
    var arr = [];
    for(var index in subjects) {
      var movie = subjects[index];
      var temp = {};
      temp.coverageUrl = movie.images.large;
      temp.title = movie.title;
      temp.average = movie.rating.average;
      temp.stars = util.convertToStarsArray(movie.rating.stars);
      temp.movieId = movie.id;
      arr.push(temp);
    }
    var data = {};
    data[attribute] = { "movies": arr, title };
    this.setData(data);
  },

  // 更多页面跳转
  onMoreTap: function(event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: './more-movie/more-movie?category=' + category,
    });
  },

  // 聚焦输入框，显示搜索面板
  onBindFocus: function(event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true
    });
  },

  onCancelImgTap: function(event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {},
      inputValue: ""
    });
  },
  onBindConfirm: function(event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBaseUrl + '/v2/movie/search?q=' + text;
    this.getMovieListData(searchUrl, "searchResult", "");
  },
  // 电影详情页跳转
  onMovieTap: function(event) {
    var id = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + id,
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