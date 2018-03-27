// pages/main/main.js
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    score: 0,
    best: 0,
    row: []
  },
  //游戏结束
  endgame: function (cells) {
    var kong = true;
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (cells[x][y] == "") {
          kong = false;
        }
      }
    }
    if (kong) {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if ((j + 1) < 4 && cells[i][j] == cells[i][j + 1]) {
            return false;
          }
          if ((j + 1) < 4 && cells[j][i] == cells[j + 1][i]) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  },

  //重新开始
  newgame: function () {
    this.mystoragesync();  //把最高成绩进行缓存
    this.init();           //初始化
    wx.showToast({
      title: '完美',
      icon: 'loading',
      mask: true,
      duration: 600
    })
  },
  touchStartX: 0,    //触点开始X
  touchStartY: 0,    //触点开始Y
  touchEndX: 0,      //触点结束X
  touchEndY: 0,      //触点结束Y
  driection: 0,      //标记移动的方向  1上，2下，3左，4右

  touchstart: function (e) {//触摸开始
    var t = e.touches[0];
    this.touchStartX = t.clientX;
    this.touchStartY = t.clientY;
  },

  touchmove: function (e) {//手指移动
    var t = e.touches[0];
    this.touchEndX = t.clientX;
    this.touchEndY = t.clientY;
  },
  touchend: function (e) {
    var x = this.touchEndX - this.touchStartX;
    var movex = Math.abs(x);
    var y = this.touchEndY - this.touchStartY;
    var movey = Math.abs(y);
    var arr = this.data.row;    //获得数据
    if (movex > movey && this.touchEndX != 0) { //判断向那个方向移动左右，上下
      if (x > 0) {//
        //右4
        this.driection = 3;
        arr = this.opserSet(arr);
      } else if (x < 0) {
        //左3
        this.driection = 4;
        arr = this.opserSet(arr);
      }
    } else if (movex < movey && this.touchEndY != 0) {
      if (y > 0) {
        //下2
        this.driection = 2;
        arr = this.opserSet(arr);
      } else if (y < 0) {
        //上1
        this.driection = 1;
        arr = this.opserSet(arr);
      }
    }
    this.setData({
      row: arr
    });
  },
  //操作的集合
  opserSet: function(arr){
    arr = this.changeDirection(arr);//转换方向
    this.merge(arr);          //合并相同值
    this.moveUnit(arr);       //移动整理
    arr = this.reChangeDirection(arr); //转换回去
    this.randomunt(arr);               //产生随机数
    if (this.endgame(arr)){
      this.gameover(arr)                 //游戏结束
    }
    return arr
  },

  //初始化数组
  init: function () {
    var result = [];
    var k = 0;
    var heightScore = wx.getStorageSync("best");
    for (let i = 0; i < 4; i++) {
      result[i] = [];
      for (let j = 0; j < 4; j++) {
        result[i][j] = "";
      }
    }
    this.randomunt(result);
    this.setData({
      score: 0,
      best: heightScore,
      row: result
    });
  },
  //随机数
  randomunt: function (cells) {
    var value = Math.random() < 0.9 ? 2 : 4;//产生随机值
    var re = [];
    var count = 0;
    for (let k = 0; k < 4; k++) {//统计有哪些格子没有数字
      for (let kk = 0; kk < 4; kk++) {
        if (cells[k][kk] == "") {
          re[count++] = { k, kk };
        }
      }
    }
    if (count > 0) {//当没有空格时就不进行随机数赋值了
      var location = parseInt(Math.random() * (re.length - 1));//随机选择位置
      cells[re[location].k][re[location].kk] = value;//进行赋值
    }
  },
  //转换方向
  changeDirection: function(cells){
    var result = [[],[],[],[]]
    for(let i = 0; i < 4; i++){
      for(let j = 0; j < 4; j++){
        if (this.driection == 1){ //   上 》》左
          result[i][j] = cells[j][3-i]
        } else if (this.driection == 2){// 下 》》左
          result[i][j] = cells[3-j][i]
        } else if (this.driection == 3){//右 》》 左
          result[i][j] = cells[i][3-j]
        } else if (this.driection == 4){//不动
          result[i][j] = cells[i][j]
        }
      }
    }
    return result;
  },
  //转换回去
  reChangeDirection: function(result){
    var cells = [[], [], [], []]
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.driection == 1) { // 左 >>>>> 上 
          cells[i][j] = result[3 - j][i];
        } else if (this.driection == 2) {//左 >>>>> 下 
          cells[i][j] = result[j][3 - i];
        } else if (this.driection == 3) {//左 >>>>> 右 
          cells[i][j] = result[i][3 - j];
        } else if (this.driection == 4) {//左 不动 
          cells[i][j] = result[i][j];
        }
      }
    }
    return cells;
  },

  //合并相等数
  merge: function(cells){
    var sscore = this.data.score;
    var heightScore = this.data.best;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (cells[i][j] != "") {
          if ((j + 1) < 4 && cells[i][j] == cells[i][j + 1] && cells[i][j] != 2048) {
            cells[i][j] += cells[i][j + 1];
            sscore += cells[i][j + 1];
            cells[i][j + 1] = "";
            j++;
          } else {
            for (let k = j + 1; k < 4; k++) {
              if (cells[i][k] != "") {
                if (cells[i][j] == cells[i][k] && cells[i][j] != 2048) {
                  cells[i][j] += cells[i][k];
                  sscore += cells[i][k];
                  cells[i][k] = "";
                  j = k;
                } else {
                  j = k - 1;
                }
                break;
              }
            }
          }
        }
      }
    }
    this.setData({  //更新成绩
      score: sscore
    });
    if(sscore > heightScore){ //更新最高成绩
      this.setData({
        best: sscore
      })
    }
  },
  
  //整理移动
  moveUnit: function(cells){
    for (let i = 0; i < 4; i++) {
      var count = 0;
      for (let j = 0; j < 4; j++) {
        if (cells[i][j] != "") {
          cells[i][count++] = cells[i][j];
          if ((count - 1) != j) {
            cells[i][j] = "";
          }
        }
      }
    }
  },

  //游戏结束
  gameover: function () {
    var that = this;
    that.mystoragesync();
    wx.showModal({
      title: '游戏结束',
      content: '你的得分是' + that.data.score,
      showCancel: false,
      confirmText: "重新开始",
      success: function (res) {
        if (res.confirm) {
          that.init();
        }
      }
    });
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
    this.init();
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
    this.mystoragesync();   //把最高成绩进行缓存
  },
  mystoragesync: function () {//缓存
    var that = this;
    var heightscore = that.data.best;
    try {
      wx.setStorageSync('best', heightscore);
    } catch (e) { }
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