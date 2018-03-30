### 0.开篇看图
![主页](https://mmbiz.qpic.cn/mmbiz_png/yVy6xPUibONK4O3JZ1oVAOibNevbOgeiaZaR4ia80YDgiaP7YOiaL9ro70aFSL4c6xKu9KdSs2BSNMmwiby0bHQ4TUVrQ/0?wx_fmt=png)
### 1. `2048`分析
`2048`小游戏的规则想必大家已经知道了吧，简单的说就是*你通过上下左右的滑动一个4\*4的表格，表格中相同的数字进行求和，使它们的和接近2048*。下面我们取出其中的一个方向（其他方向类似），对它的过程进行简单的分析：
```js
//选取向左滑到的方向
2 0 0 2             4 0 0 0             4 0 0 0
0 2 2 0   相同求和   0 4 0 0  位置移动   4 0 0 0
2 4 2 0   ------>   2 4 2 0  ----->     2 4 2 0
0 2 4 0             0 2 4 0             2 4 0 0
//起始                                    结束
```
通过上面的分析我们知道，当我们的手指向某一个方向滑动表格时，它的内部至少要经历两步操作，一个是`相同求和`，另一个是`位置移动`。接下来对着两步进行分析
### 2.相同的求和
`相同求和`是指在某一方向上，对值相等并且中间没有其他值的两个数，进行相加求和，看下面代码：
```js
merge: function(cells){
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (cells[i][j] != "") {//排除前面的空格  标记一
          if ((j + 1) < 4 && cells[i][j] == cells[i][j + 1] && cells[i][j] != 2048) {  //标记二
            cells[i][j] += cells[i][j + 1];//求和
            cells[i][j + 1] = "";//清空原有值
            j++;//把坐标移到两个数的后面
          } else {
            for (let k = j + 1; k < 4; k++) { //标记三
              if (cells[i][k] != "") {
                if (cells[i][j] == cells[i][k] && cells[i][j] != 2048) {//标记二
                  cells[i][j] += cells[i][k];//求和
                  cells[i][k] = ""; //清空原有值
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
 }
```
简单解读一下上面的代码：`标记一`是用来排除前面的空值的，例如`0  0 2 2`,直接排除前面的两个空值(0)。`标记二`是用来判断两个值是否相等的，相等时就进行里面的一些列操作。`标记三`是用来排除两个数之间是空值的情况的，例如`2 0 0 2`，排除中间的两个空值(0)。其他的就不用多说，都有注释。
### 3.位置移动
`位置移动`是指让表格中所有的数字在不变顺序的情况下，统一移动到某一方向上，数与数之间和数与某一方向的边之间不允许有空值。看下面代码：
```js
moveUnit: function(cells){
    for (let i = 0; i < 4; i++) {
      var count = 0;
      for (let j = 0; j < 4; j++) {
        if (cells[i][j] != "") {
          cells[i][count++] = cells[i][j];//标记一
          if ((count - 1) != j) {//标记二
            cells[i][j] = "";//把当前值清空
          }
        }
      }
    }
  }
```
在上述代码中`标记一`表示把当前值赋值到前面去。`标记二`表示如果当前值的位置和你赋值到前面去的位置 相同时，就不把当前值清空。
### 4.转变方向
读完上面的几步，你会发现完成某一方向（上面讲的是向左移动）的移动和求和，已经基本完事，只要把上边的代码稍加改变就可以把其他三个方向的代码敲出来了（我一开始就是这么干的）。但是这样会出现一个问题，就是很多的代码都会重复出现，代码量也很大。后来我通过`转变方向`的方法把代码就行了简单优化。
`转变方向`就是把所有方向上的表格按照一定的规则统一转换到同一个方向上去操作，等操作完毕后再按照一定的规则转换到原来的方向。看下面代码：
#### 4.1 转换到同一方向
```js
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
  }
```
在上面代码中 `1`表示方向上、`2`表示方向下、`3`表示方向右、`4`表示方向左(本篇通用)。
#### 4.2 转回到以前的方向
```js
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
```
以上两段代码 都是有关表格方向的转变，里面没有涉及到什么算法，如何理解比较困难，就自己找几个样例在纸上写一写、画一画。
### 5.产生随机数
上面我们基本解决了表格的合并和移动问题，接下来是看如何产生随机的`2`或`4`。看下面代码：
```js
randomunt: function (cells) {
    var value = Math.random() < 0.9 ? 2 : 4;//产生随机值，90%概率产生 2
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
  }
```
在上述代码中 注释已经解释的比较明白。我这里简单说一下思路：首先随机产生一个值`2`或`4`，然后通过循环把所有`空值`的坐标存入数组(re)中，再从数组中随机选取一个`空值`坐标，通过坐标对相应元素进行赋值。
### 6.游戏结束
游戏的基本操作终于要结束了，接下来我们判断游戏是如何结束的。看下面代码：
```js
endgame: function (cells) {
    var isNULL = false;  //判断是否有空元素
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (cells[x][y] == "") {
          isNULL = true;
        }
      }
    }
    if (!isNULL) {  //没有空元素时 进入
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if ((j + 1) < 4 && cells[i][j] == cells[i][j + 1]) {//判断横向是否有相等的元素
            return false;
          }
          if ((j + 1) < 4 && cells[j][i] == cells[j + 1][i]) {//判断纵向是否有相等的元素
            return false;
          }
        }
      }
      return true;
    }
    return false;
  }
```
简述上面的代码：首先判断是否表格中是否存有`空值`,有 就证明游戏没有结束，没有 就判断表格中的上下左右是否有相等的元素，没有 证明游戏已经结束，有 就继续进行游戏。

>下面是我的**[公众号:CodeId](https://mp.weixin.qq.com/s?__biz=MzIzMTcwNzQ4MQ==&mid=2247483716&idx=1&sn=b65fa95afea291efa81c3d1ee9788f38&chksm=e8a14772dfd6ce6464c89121c711f9911fe95e97c39acf0144d371e5a392322ffb84c4599d31#rd)**  欢迎关注

![CodeId](https://mmbiz.qpic.cn/mmbiz_jpg/yVy6xPUibONKEXB24m15GExasvZFrNhGwic1NZyLtk4cT8LQteibNKDgOaNYkx2DZ5R3uBd2hFy055Aiala6hNAGiaw/0?wx_fmt=jpeg)
