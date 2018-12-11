const l = (...args) => console.log(...args);
const ml = m => console.log(m.get());


function Just(val) {
  if (!(this instanceof Just)) {
    return new Just(val);
  }
  this.get = () => val;
}
function Nothing() {
  if (!(this instanceof Nothing)) {
    return new Nothing();
  }
  this.get = () => 'Nothing'
}

const map = fn => val => {
  if (val instanceof Just) return Just(fn(val.get()));
  return Nothing();
}

const c = (...fnArr) => arg => {
  const newFnArr = [...fnArr];
  newFnArr.reverse()
  return newFnArr.reduce((acc, fn) => fn(acc), arg)
}

const MaybeReturn = val => Just(val);

// >>=
const bind = val => fn => {
  if (val instanceof Just) return fn(val.get());
  return Nothing();
}

// <=<
const mFish = f => g => {
  return (x) => bind(g(x))(f)
}

const mdo = gen => mVal => {
  const genInstance = gen(mVal.get());
  const innerDo = (gi, vm) => {
    return bind(vm)((v) => {
      const { done, value } = gi.next(v);
      return (done)
          ? value
          : innerDo(gi, value);
    });
  }
  return innerDo(genInstance, mVal)
};




const monadFn = val => val > 3 ? Just(val) : Nothing();
const monadFn2 = val => val < 10 ? Just(val*3) : Nothing();


function* test(val) {
  const r1 = yield monadFn(val);
  yield monadFn2(r1);
  const s = yield MaybeReturn(12)
  return MaybeReturn(r1 * s);
}

ml(
  mdo(test)(MaybeReturn(5))
);
