import Deasyncify from "deasyncify";

const doSomething = async (name: string) => {
  const [result, error] = await Deasyncify.watch(Promise.resolve(name));

  if (error) throw error;
  return result;
};

const add = (a: number, b: number) => a + b;

const a: any = 1;
const b = 2;

add(a, b);

const doManyThings = async () => {
  const [result, error] = await Deasyncify.watchAll([
    Promise.resolve(1),
    async () => 3,
  ]);

  result?.map(add);
};
