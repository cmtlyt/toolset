import { Service } from '.';

const service = new Service({
  base: 'https://localhost:3000/',
  // dataType: {
  //   aaa: 'string',
  //   ccc: 'number',
  // },
  queryType: {
    aaa: 'string',
    bbb: 'number',
  },
  defaultQuery: {
    bbb: 1,
  },
  web: {
    // defaultData: {
    //   aaa: 'string',
    // },
  },
  taobao: {
    defaultData: {
      bbb: 'string',
    },
  },
});

const api = service.batchCreateService({
  test: {
    api: '/test',
    dataType: {
      array: [{ a: 'number' }],
      array2: ['number'],
    },
    web: {
      defaultData: {
        ccc: 'string',
      },
    },
  },
  postTest: {
    api: '/post-test',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    interceptors: {
      request: (config) => {
        config.headers['Content-Type'] = 'application/json';
        console.log(config);
        return config;
      },
    },
  },
});

api.test({ aaa: '1' }).then(console.log, console.error);

api.postTest(new FormData()).then(console.log, console.error);
