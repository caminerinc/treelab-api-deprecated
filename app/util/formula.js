class Formula {
  constructor() {
    this.reservedWord = ['sum', 'average'];
    this.opt = ['{', '}', '(', ')', '*', '/', '%', '+', '-', '\\', '.'];
  }

  process(str, fields) {
    str = this.pretreatment(str);
    let tokenStack = [];
    let optStack = [];
    let numStack = [];
    let token = '';
    let field = '';
    let fieldFlag = false;
    let escapeFlag = false;
    let error = new Error();
    error.status = 422;
    error.message = 'invalid formula';
    for (const i in str) {
      const char = str[i];
      if (char === '\\') {
        escapeFlag = true;
        continue;
      }
      escapeFlag = false;
      console.log(char);
      //   if (fieldFlag && char !== '}') {
      //     field += char;
      //     continue;
      //   }
      if (this.isNumber(char)) {
        token += char;
      } else if (this.isLetter(char)) {
        token += char;
      } else if (char === '.') {
        if (token.indexOf('.') !== -1) throw error;
        token += char;
      } else if (char === '{') {
        fieldFlag = true;
        field = '';
      } else if (this.opt[char]) {
        if (token) {
          if (char === '(') {
            if (this.reservedWord.indexOf(token) === -1)
              throw new Error(`unsuported function ${token} in formula`);
          }
          if (this.isNumber(token[0])) {
            numStack.push(token);
          } else {
            tokenStack.push(token);
          }
          token = '';
        }
        if (optStack.length) {
          const lastOpt = optStack[optStack.length - 1];
        } else {
          optStack.push(char);
        }
      } else {
        throw error;
      }
    }
    // console.log(tokenStack, optStack, numStack);
    // for (const char of str) {
    //   if (isNumber(char)) {
    //     numStack.push(char);
    //   } else if (this.opt[char]) {
    //     if (optStack.length) {
    //       const lastOpt = optStack[optStack.length - 1];
    //       if (this.opt[char] < this.opt[lastOpt]) {
    //         if (numStack.length < 2) throw new Error('illegal formula');
    //         const result = eval(numStack.pop() + optStack.pop() + numStack.pop());
    //         numStack.push(result);
    //       } else if (this.opt[char] > this.opt[lastOpt]) {
    //         optStack.push(char);
    //       } else {
    //       }
    //     } else {
    //       optStack.push(char);
    //     }
    //   }
    // }
  }

  pretreatment(str) {
    if (typeof str !== 'string') throw new Error('The argument must be a string');
    str = str.replace(/\s+/g, '').toLowerCase();
    return str;
  }

  isNumber(s) {
    return new RegExp(/^[0-9]$/).test(char);
  }

  isLetter(char) {
    return new RegExp(/^[a-z]$/).test(char);
  }

  sum() {}
}

module.exports = Formula;
