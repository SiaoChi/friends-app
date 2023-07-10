import http from 'k6/http';
import { check, sleep } from 'k6';

// export default function () {
//   http.get('https://test.k6.io');
//   sleep(1);
// }


export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'constant-arrival-rate',
      rate: 300,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 50,
      maxVUs: 100,
    },
  },
};

  export default function  () {
    const res = http.get('https://chichi-lab.com/api/v1/friends/recommend');
    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1);
  }

// export default function post ()  {
//     const url = 'https://chichi-lab.com/user/signin';
//     const body = JSON.stringify({
//         email: 'test@gmail.com',
//         password: '1111',
//       });
//     const params = {
//       headers: { 'Content-Type': 'application/json', },
//     };
//     const res = http.post(url, body, params);
//     // const res = http.post('http://{your url}/api/1.0/report/payments');
//     check(res, { 'status was 200': (r) => r.status == 200 });
//     sleep(1);
//   }


