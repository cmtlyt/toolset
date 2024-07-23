import { Service } from '.';

const service = new Service({
  base: 'http://localhost:3300/',
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
  getImage: {
    api: '/uploads/receivedFile.png',
    defaultQuery: {
      aaa: '123',
    },
  },
  test: {
    api: '/test',
    cache: {
      cacheTime: 1000,
    },
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
    withCredentials: true,
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
api.test({ aaa: '1' }).then(console.log, console.error);
api.test({ aaa: '1' }).then(console.log, console.error);
api.test({ aaa: '1' }).then(console.log, console.error);
api
  .test({ aaa: '1' })
  .then(console.log, console.error)
  .then(() => {
    api.test({ aaa: '1' }).then(console.log, console.error);
    api
      .test({ aaa: '2' })
      .then(console.log, console.error)
      .then(() => {
        api.test({ aaa: '2' }).then(console.log.bind(console, '3'), console.error);
      });
    api.test({ aaa: '1' }).then(console.log, console.error);
    api.test({ aaa: '2' }).then(console.log, console.error);
  });

api.postTest(new FormData()).then(console.log, console.error);

api.getImage().then((res) => {
  console.log(res);
  const { data } = res;
  const url = URL.createObjectURL(data);
  const img = new Image();
  img.src = url;
  document.body.appendChild(img);
}, console.error);
