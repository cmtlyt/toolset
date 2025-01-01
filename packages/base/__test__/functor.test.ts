import { describe, expect, it } from 'vitest';
import { withResolvers } from '../src';
import { functor } from '../src/fp';

describe('functor', () => {
  it('container', () => {
    const con1 = functor.container(1)
      .map((v) => {
        expect(v).toBe(1);
        return v.toString();
      })
      .map((v) => {
        expect(v).toBe('1');
        return Boolean(v);
      })
      .flatMap((v) => {
        expect(v).toBe(true);
        return functor.container([v]);
      });
    expect(con1.inspect()).toBe('Container { true }');
    expect(con1.valueOf()).toEqual([true]);
  });

  it('maybe', () => {
    const maybe1 = functor.maybe(1)
      .map((v) => {
        expect(v).toBe(1);
        return v.toString();
      })
      .map((v) => {
        expect(v).toBe('1');
        return Boolean(v);
      })
      .flatMap((v) => {
        expect(v).toBe(true);
        return functor.maybe([v]);
      })
      .map(() => null)
      .map(() => 1)
      .flatMap((v) => {
        expect(v).toBe(true);
        return functor.maybe([v]);
      });
    expect(maybe1.inspect()).toBe('Maybe { null }');
    expect(maybe1.valueOf()).toBe(null);
  });

  it('either', () => {
    const either1 = functor.either(1)
      .map((v) => {
        expect(v).toBe(1);
        return v.toString();
      })
      .map((v) => {
        expect(v).toBe('1');
        return Boolean(v);
      })
      .flatMap((v) => {
        expect(v).toBe(true);
        return functor.either([v]);
      });
    expect(either1.inspect()).toBe('Either { true }');
    expect(either1.valueOf()).toEqual([true]);
    const either2 = either1
      .map(() => {
        throw new Error('自定义错误');
      })
      .map(() => 123);
    expect(either2.inspect()).toBe('Left { Error: 自定义错误 }');
    const either2Inspect = either2.flatMap(() => {
      throw new Error('自定义错误2');
    }).inspect();
    expect(either2Inspect).toBe('Left { Error: 自定义错误 }');
    const either3 = either1.flatMap(() => {
      throw new Error('自定义错误3');
    });
    expect(either3.inspect()).toBe('Left { Error: 自定义错误3 }');
  });

  it('right and left', () => {
    const test = (flag: boolean) => {
      try {
        if (flag) {
          throw new Error('自定义错误');
        }
        return functor.right(1);
      }
      catch (e) {
        return functor.left(e);
      }
    };
    const left1 = test(true).map(() => 123).flatMap(() => functor.right(1));
    expect(left1.inspect()).toBe('Left { Error: 自定义错误 }');
    const right1 = test(false).map((v: number) => {
      expect(v).toBe(1);
      return 123 + v;
    }).flatMap((v: number) => {
      expect(v).toBe(124);
      return functor.right(v + 2);
    });
    expect(right1.inspect()).toBe('Right { 126 }');
  });

  it('io', () => {
    const io1 = functor.io((a: number) => a + 1)
      .map((v) => {
        expect(v).toBe(2);
        return v.toString();
      })
      .map((v) => {
        expect(v).toBe('2');
        return Boolean(v);
      })
      .flatMap((v) => {
        expect(v).toBe(true);
        return functor.container([v]);
      });
    expect(io1.run(1)).toEqual([true]);
  });

  const sleep = (t: number) => new Promise(r => setTimeout(r, t));

  it('task', async ({ expect }) => {
    const { promise, resolve, reject } = withResolvers<void>();

    const task1 = functor.task<number>((resolver) => {
      sleep(100).then(() => resolver.resolve(1));
    })
      .map((v) => {
        expect(v).toBe(1);
        return v.toString();
      })
      .map((v) => {
        expect(v).toBe('1');
        return Boolean(v);
      })
      .flatMap((v) => {
        expect(v).toBe(true);
        return functor.container([v]);
      });
    task1.run().listen({
      onResolved: (v) => {
        expect(v).toEqual([true]);
        task1.listen({
          onResolved: (v) => {
            expect(v).toEqual([true]);
            resolve();
          },
          onRejected: reject,
        });
      },
      onRejected: reject,
    });
    const { promise: promise2, resolve: resolve2, reject: reject2 } = withResolvers<void>();
    task1.flatMap(() => {
      return functor.either(null).map(() => {
        throw new Error('自定义错误');
      });
    })
      .then((v) => {
        expect(v.message).toBe('自定义错误');
        resolve2();
      }, () => {
        reject2();
      });
    const { promise: promise3, resolve: resolve3 } = withResolvers<void>();
    task1.map(() => {
      throw new Error('自定义错误2');
    }).catch((e) => {
      expect(e.message).toBe('自定义错误2');
      resolve3();
    });
    const result = await task1.map((v) => {
      expect(v).toEqual([true]);
      return v[0];
    }).then((v) => {
      expect(v).toBe(true);
      return '123';
    });
    expect(result).toBe('123');
    await task1.then().then((v) => {
      expect(v).toEqual([true]);
    });
    await task1.map(() => {
      throw new Error('自定义错误3');
    }).then().catch((e) => {
      expect(e.message).toBe('自定义错误3');
    });
    await promise;
    await promise2;
    await promise3;

    const task3 = functor.task((resolver) => {
      sleep(100).then(() => resolver.reject(new Error('自定义错误4')));
    }).run();

    const task4 = functor.task<number>((resolver) => {
      sleep(100).then(() => resolver.resolve(1));
    }).map((v) => {
      expect(v).toBe(1);
      return v + 2;
    }).run();

    await sleep(110);

    expect(() => task3.listen({})).toThrowErrorMatchingInlineSnapshot(`[Error: 自定义错误4]`);
    task3.listen({ onRejected: e => expect(e.message).toBe('自定义错误4') });
    task3.listen({});

    task4.listen({
      onResolved(result) {
        expect(result).toBe(3);
      },
    }).listen({
      onRejected() {
        throw new Error('不应该执行');
      },
    }).then((v) => {
      expect(v).toBe(3);
    });
  });

  it('task is async function', async () => {
    const task = functor.task(async () => {
      return 1;
    }).map(v => v + 1).listen({
      onResolved(v) {
        expect(v).toBe(2);
      },
    });

    await task.then((v) => {
      expect(v).toBe(2);
    });
  });

  it('task map async function', async () => {
    const task = functor.task(async () => 1)
      .map(async v => v + 1)
      .map(async v => v + 1);

    await task.then((v) => {
      expect(v).toBe(3);
    });
  });

  it('task catch', async () => {
    await functor.task(async () => {
      throw new Error('自定义错误');
    }).map(() => {
      throw new Error('自定义错误2');
    }).then(() => {
      throw new Error('自定义错误3');
    }).catch((e) => {
      expect(e.message).toBe('自定义错误');
      return 1;
    }).then((v) => {
      expect(v).toBe(1);
    });

    await functor.task(async () => {
      throw new Error('自定义错误');
    }).map(() => {
      throw new Error('不应该执行到');
    }).then(() => {
      throw new Error('不应该执行到');
    }, (e) => {
      expect(e.message).toBe('自定义错误');
      return 1;
    }).catch(() => {
      throw new Error('不应该执行到');
    }).then((v) => {
      expect(v).toBe(1);
    });

    await functor.task(async () => {
      throw new Error('自定义错误');
    }).map(() => {
      throw new Error('不应该执行到');
    }).then(() => {
      throw new Error('不应该执行到');
    }, (e) => {
      expect(e.message).toBe('自定义错误');
      throw new Error('自定义错误2');
    }).catch((e) => {
      expect(e.message).toBe('自定义错误2');
      return 2;
    }).then((v) => {
      expect(v).toBe(2);
    });

    await functor.task(async () => {
      return 1;
    }).then(async () => {
      throw new Error('1');
    }, () => {
      throw new Error('2');
    }).catch((e) => {
      expect(e.message).toBe('1');
    });
  });
});
