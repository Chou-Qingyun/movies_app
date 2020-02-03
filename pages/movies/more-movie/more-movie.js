// pages/movies/more-movie/more-movie.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigateTitle: '',
    movies: {},
    requestUrl: '',
    totalCount: 0,
    isEmpty: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var category = options.category;
    this.data.navigateTitle = options.category;
    console.log(category);
    var dataUrl = '';
    switch(category) {
      case "正在上映":
        dataUrl = app.globalData.doubanBaseUrl + '/v2/movie/in_theaters';
        break;
        case "即将上映":
        dataUrl = app.globalData.doubanBaseUrl + '/v2/movie/coming_soon';
        break;
        case "豆瓣Top250":
        dataUrl = app.globalData.doubanBaseUrl + '/v2/movie/top250';
        break;
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData);
  },

  // onScrollToLower: function() {
  //   var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
  //   wx.showNavigationBarLoading();
  //   util.http(nextUrl, this.processDoubanData);
  // },
  processDoubanData: function (moviesDouban) {
    console.log("下拉刷新");
    var subjects = moviesDouban.subjects;
    var movies = [];
    for (var index in subjects) {
      var movie = subjects[index];
      var temp = {};
      temp.coverageUrl = movie.images.large;
      temp.title = movie.title;
      temp.average = movie.rating.average;
      temp.stars = util.convertToStarsArray(movie.rating.stars);
      temp.movieId = movie.id;
      movies.push(temp);
    }
    var totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    });
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();

  },
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl +
      "?star=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  onReachBottom: function () {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    wx.showNavigationBarLoading();
    util.http(nextUrl, this.processDoubanData);
  },
  onReady: function() {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
    })
  },
  // 电影详情页跳转
  onMovieTap: function (event) {
    var id = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + id,
    })
  },
  
})