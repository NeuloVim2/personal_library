class Utils {
  static getRandomNumInRange(min, max) {
    return min === max ? min : Math.floor(Math.random() * (max - min)) + min;
  }
}

module.exports = Utils;
