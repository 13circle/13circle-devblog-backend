function Stack() {
  this.stackData = [];

  this.push = function (element) {
    this.stackData.push(element);
  };

  this.pop = function () {
    if (this.stackData.length > 0) {
      return this.stackData.pop();
    }

    return null;
  };

  this.peek = function () {
    return this.stackData[this.stackData.length - 1];
  };

  this.clear = function () {
    this.stackData.length = 0;
  };
}

export default Stack;
