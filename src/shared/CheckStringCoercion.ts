/**/

function testStringCoercion(value: mixed) {
  // 简单来说, 不允许 obj｜Symbl作为key. 这里 '' + Symbol 直接报错
  return "" + value;
}

export function checkKeyStringCoercion(value: mixed) {
  return testStringCoercion(value);
}
