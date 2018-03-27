// pages/ranking/ranking.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: [{
      url:"https://mmbiz.qpic.cn/mmbiz_jpg/yVy6xPUibONKEXB24m15GExasvZFrNhGwic1NZyLtk4cT8LQteibNKDgOaNYkx2DZ5R3uBd2hFy055Aiala6hNAGiaw/0?wx_fmt=jpeg",
      nickname: "CodeId",
      bestscore: "66666"
    }, {
        url: "https://mmbiz.qpic.cn/mmbiz_jpg/yVy6xPUibONKEXB24m15GExasvZFrNhGwic1NZyLtk4cT8LQteibNKDgOaNYkx2DZ5R3uBd2hFy055Aiala6hNAGiaw/0?wx_fmt=jpeg",
      nickname: "公众号",
      bestscore: "66666"
    }, {
        url: "https://mmbiz.qpic.cn/mmbiz_jpg/yVy6xPUibONKEXB24m15GExasvZFrNhGwic1NZyLtk4cT8LQteibNKDgOaNYkx2DZ5R3uBd2hFy055Aiala6hNAGiaw/0?wx_fmt=jpeg",
      nickname: "CodeId",
      bestscore: "66666"
    }, {
        url: "https://mmbiz.qpic.cn/mmbiz_jpg/yVy6xPUibONKEXB24m15GExasvZFrNhGwic1NZyLtk4cT8LQteibNKDgOaNYkx2DZ5R3uBd2hFy055Aiala6hNAGiaw/0?wx_fmt=jpeg",
      nickname: "来一波关注",
      bestscore: "66666"
    }],
    userin: [{
      url: "https://mmbiz.qpic.cn/mmbiz_jpg/yVy6xPUibONKEXB24m15GExasvZFrNhGwic1NZyLtk4cT8LQteibNKDgOaNYkx2DZ5R3uBd2hFy055Aiala6hNAGiaw/0?wx_fmt=jpeg",
      name: "CodeId",
      best: 66666
    }],
    rankuser: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.selectUser();
    this.ranking();
    this.rankuser();
  },

  //用户排名
  rankuser: function () {
  },
  //排行榜
  ranking: function () {
    var userinfo = [];
  },
  //用户信息
  selectUser: function () {
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