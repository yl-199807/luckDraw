class Game {
  // 后期优化，抽奖滚动速度
  constructor(idx) {
    this.idx = idx;
    this.speed = 400;
    this.oil = true;
    this.isFinish = false;
    this.endIdx = null;
    this.finishCb = function() {}
    // 常量
    this.Max_Speed = 100;
    this.Min_Speed = 500;
    this.Order_List = [0,1,2,5,8,7,6,3];
    this.Game_Box_Num = 8;
  }

  speedUp() {
    this.speed -= 60;
  }

  speedDown() {
    this.speed += 200;
  }

  speedControl() {
    if (this.speed > this.Max_Speed) {
      if (this.oil) {
        this.speedUp();
      }
    }
    if (!this.oil) {
      if (this.speed < this.Min_Speed) {
        this.speedDown();
      } else if (this.endIdx === this.idx) {
        this.isFinish = true;
        typeof this.finishCb === 'function' && this.finishCb();
      }
    }
  }

  finish(num, finishCb) {
    this.oil = false;
    this.endIdx = num;
    this.finishCb = finishCb;
  }

  addIdx() {
    this.idx = (++this.idx % this.Game_Box_Num);
  }

  run(cb) {
    this.addIdx();
    typeof cb === 'function' && cb(this.Order_List[this.idx]);
    this.speedControl();
    setTimeout(() => {
      !this.isFinish && this.run(cb);
    }, this.speed);
  }
}

export default Game;

