class Formula {
  constructor() {
    this.reservedWord = ['sum', 'average'];
    this.opt = {
      '{': 1,
      '}': 1,
      '.': 2,
      '(': 2,
      ')': 2,
      '*': 3,
      '/': 3,
      '%': 3,
      '+': 4,
      '-': 4,
      '<': 5,
      '>': 5,
      '<=': 5,
      '>=': 5,
      '!=': 6,
      '==': 6,
      '&': 7,
      '=': 8,
      ',': 9,
    };
  }

  process(str) {
    str = this.pretreatment(str);
    let token = [];
    let optStack = [];
    let numStack = [];
    for (const char of str) {
      if (isNumber(char)) {
        numStack.push(char);
      } else if (this.opt[char]) {
        if (optStack.length) {
          const lastOpt = optStack[optStack.length - 1];
          if (this.opt[char] < this.opt[lastOpt]) {
            if (numStack.length < 2) throw new Error('illegal formula');
            const result = eval(numStack.pop() + optStack.pop() + numStack.pop());
            numStack.push(result);
          } else if (this.opt[char] > this.opt[lastOpt]) {
            optStack.push(char);
          } else {
          }
        } else {
          optStack.push(char);
        }
      }
    }
  }

  pretreatment(str) {
    if (typeof str !== 'string') throw new Error('The argument must be a string');
    str = str.replace(/\s+/g, '').toLowerCase();
    return str;
  }

  isNumber(char) {
    return new RegExp(/^[0-9]$/).test(char);
  }

  isLetter(char) {
    return new RegExp(/^[a-z]$/).test(char);
  }
}

module.exports = Formula;
