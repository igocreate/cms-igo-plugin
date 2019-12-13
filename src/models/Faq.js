
const Page        = require('./Page');

class Faq extends Page {

  get question() {
    return this.parts[0];
  }

  get answer() {
    return this.parts[1];
  }
}

module.exports = Faq;
