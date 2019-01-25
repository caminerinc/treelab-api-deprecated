class Formula {
  constructor() {
    this.reservedWord = ['sum', 'average'];
    this.operatorOrDelimiter = ['{', '}', '(', ')', '*', '/', '%', '+', '-', '\\', '.', ','];
    this.priority = { '*': 10, '/': 10, '%': 10, '+': 9, '-': 9 };
  }

  /**
   * process formulaText
   * @param {String} str - formulaText
   * @param {Object} fields - field names should be lower case, example: { fieldname1: 'Field 1', fieldname2: 'Field 2' }
   */
  process(str, fields) {
    const { preStr, preFields } = this.pretreatment(str, fields);
    const scanResult = this.scan(preStr, preFields);
    return this.processScanResult(scanResult);
  }

  scan(str, fields) {
    let scanResult = [];
    let token = '';
    let fieldFlag = false;
    let escapeFlag = false;
    let funcFlag = '';
    let lIndexForFunc = 0;
    let rIndexForFunc = 0;
    let error = new Error('invalid formula');
    error.status = 422;
    for (const i in str) {
      const char = str[i];
      if (escapeFlag) {
        token += char;
        escapeFlag = false;
        continue;
      }
      if (this.isNumber(char)) {
        token += char;
      } else if (this.isLetter(char)) {
        token += char;
      } else if (char === ' ') {
        if (fieldFlag) token += char;
      } else if (this.operatorOrDelimiter.indexOf(char) !== -1) {
        if (fieldFlag && char !== '}') {
          token += char;
          continue;
        }
        if (char === '\\') {
          escapeFlag = true;
          continue;
        } else if (char === '.') {
          if (token.indexOf('.') !== -1) throw error;
          token += char;
        } else if (char === '{') {
          if (token.length) {
            error.message = `invalid formula, numbers or letters cannot be next to braces`;
            throw error;
          }
          fieldFlag = true;
        } else if (char === '}') {
          fieldFlag = false;
          if (fields[token] === undefined) {
            error.message = `invalid formula, field(${token}) dose not exist`;
            throw error;
          }
          if (funcFlag) {
            funcFlag += `"${fields[token]}"`;
          } else {
            scanResult.push(fields[token]);
          }
          token = '';
        } else if (char === '(') {
          if (token.length) {
            if (this.reservedWord.indexOf(token) === -1) {
              error.message = `invalid formula, unsupported function: ${token}`;
              throw error;
            }
            funcFlag += token + '(';
            lIndexForFunc++;
            token = '';
          } else {
            scanResult.push(char);
          }
        } else if (char === ',') {
          if (!funcFlag) {
            error.message = 'invalid formula, the comma can only be used inside the method';
            throw error;
          }
          funcFlag += token + ',';
          token = '';
        } else if (char === ')') {
          if (funcFlag) {
            funcFlag += `${token}` + ')';
            rIndexForFunc++;
            if (lIndexForFunc === rIndexForFunc) {
              try {
                scanResult.push(eval(funcFlag));
              } catch (e) {
                console.error(e);
                throw error;
              }
              funcFlag = '';
              lIndexForFunc = 0;
              rIndexForFunc = 0;
            }
          } else {
            if (token.length) scanResult.push(token);
            scanResult.push(char);
          }
          token = '';
        } else if (['*', '/', '%', '+', '-'].indexOf(char) !== -1) {
          if (token.length) scanResult.push(token);
          scanResult.push(char);
          token = '';
        } else {
          throw error;
        }
      } else {
        error.message = 'invalid formula,unsupported operator or delimiter';
        throw error;
      }
    }
    if (token) scanResult.push(token);
    if (funcFlag || fieldFlag || escapeFlag || lIndexForFunc !== rIndexForFunc) throw error;
    return scanResult;
  }

  processScanResult(scanResult) {
    console.log(scanResult);
    let opStack = [];
    let operandStack = [];
    let error = new Error('invalid formula');
    error.status = 422;
    for (const i in scanResult) {
      const token = scanResult[i];
      if (this.priority[token] !== undefined) {
        const lastOp = opStack.length ? opStack[opStack.length - 1] : null;
        if (!lastOp || this.priority[lastOp] < this.priority[token]) {
          opStack.push(token);
        } else if (lastOp === '(' && (token === '*' || token === '/' || token === '%')) {
          throw error;
        } else if (lastOp === '(') {
          if (token === '-') operandStack.push(0);
          opStack.push(token);
        } else if (this.priority[lastOp] > this.priority[token]) {
          const op = opStack.pop();
          const operand2 = operandStack.pop();
          const operand1 = operandStack.pop();
          const calculateResult = this.calculate(op, operand1, operand2);
          operandStack.push(calculateResult);
        } else if (token === '(') {
          opStack.push(token);
        } else if (token === ')') {
          while (opStack.length && opStack[opStack.length - 1] !== '(') {
            const op = opStack.pop();
            const operand2 = operandStack.pop();
            const operand1 = operandStack.pop();
            const calculateResult = this.calculate(op, operand1, operand2);
            operandStack.push(calculateResult);
            opStack.pop();
          }
        } else if (this.priority[lastOp] === this.priority[token]) {
          const op = opStack.pop();
          const operand2 = operandStack.pop();
          const operand1 = operandStack.pop();
          const calculateResult = this.calculate(op, operand1, operand2);
          operandStack.push(calculateResult);
          opStack.push(token);
        }
      } else {
        operandStack.push(token);
      }
    }
  }

  calculate(op, operand1, operand2) {
    if (['+', '-', '*', '/', '%']) {
      return eval(operand1 + op + operand2);
    } else {
      throw new Error(`invalid operator: ${op}`);
    }
  }

  pretreatment(str, fields) {
    if (typeof str !== 'string') throw new Error('The first argument should be a string');
    if (typeof fields !== 'object') throw new Error('The last argument should be an object');
    let newFields = {};
    for (const fieldName in fields) {
      newFields[fieldName.toLowerCase()] = fields[fieldName];
    }
    return { preStr: str.toLowerCase(), preFields: newFields };
  }

  isNumber(char) {
    return new RegExp(/^[0-9]$/).test(char);
  }

  isLetter(char) {
    return new RegExp(/^[a-z]$/).test(char);
  }

  isNumberString(s) {
    return new RegExp(/^(-?\d+)(\.\d+)?$/).test(s);
  }
}

function sum(...params) {
  return [...params].reduce((s, i) => (s += Number(i)), 0);
}

function average(...params) {
  return sum(...params) / [...params].length;
}

module.exports = Formula;
