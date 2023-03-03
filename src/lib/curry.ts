export function curry(f: Function) {
    function curried(args: string | any[]) {
      if (args.length >= f.length) return f(...args);
      return accumulator;
  
      function accumulator(a: any | string) {
        return curried([...args, a]);
      };
    };
  //
    return curried([]);
  };
  