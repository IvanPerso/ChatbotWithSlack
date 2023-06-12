const { RTMClient } = require('@slack/rtm-api');
const fs = require('fs');
const regex = new RegExp('/');  // eslint-disable-line
const regex4 = new RegExp(' - ');  //eslint-disable-line
let token = ""; // eslint-disable-line
global.Channels = {};
global.Channels_F4 = {};
global.data = {};
global.office = [];
global.modified_ofiice = [];
global.loc = [];
global.result = [];

token = '';
try {
  const data = fs.readFileSync('./token', 'utf8');
  const [first] = data.toString().split('\n');
  token = first;
} catch (err) {
  console.error(err);
}
console.log(token);

const rtm = new RTMClient(token);
rtm.start();

const { channel } = require('diagnostics_channel'); // eslint-disable-line
const square = require('./square');
const readdata = require('../OSS-JBNU-2022/read_data'); // eslint-disable-line
const Feature1 = require('./Feature1');  // eslint-disable-line
const Feature2 = require('./Feature2');   // eslint-disable-line
const Scrapping = require('./Scraping'); // eslint-disable-line
const Feature3 = require('./Feature3'); // eslint-disable-line
const Feature4 = require('./Feature4'); // eslint-disable-line

rtm.on('message', (message) => {
  const { channel } = message; // eslint-disable-line
  const { text } = message;
  console.log(global.result);
  num = Math.floor(Math.random() * 3);
  console.log(num);
  if (!isNaN(text)) {// eslint-disable-line
    square(rtm, text, channel);
  } else if (regex.test(text)) {
    Feature2(rtm, channel, text);
  } else if (global.Channels_F4[channel] == 1) {
    console.log('피처4 학과입력');
    Feature4(rtm, channel, text);
  } else {
    switch (text) {
      case '테스트를 시작한다.':
        break;
      case '테스트 완료':
        rtm.sendMessage('FIN', test_channel);
        break;
      case 'Hi':
        Feature1(rtm, channel, num);
        break;
      case '학사일정':
        (async () => {
          rtm.sendMessage('안내 받을 날짜를 이야기해주세요. (예, 12/21)', channel);
          global.Channels[channel] = 0;
          await Feature2(rtm, channel, text);
        })();
        break;
      case '오늘 밥 뭐야':
      case '이번주 뭐 나와':
        (async () => {
          await Feature3(rtm, channel, text);
        })();
        break;
      case '학과 안내':
        (async () => {
          rtm.sendMessage('안내 받을 학과 이름을 이야기해주세요.', channel);
          global.Channels_F4[channel] = 0;
          await Feature4(rtm, channel, text);
        })();
        break;
      default:
        rtm.sendMessage(channel, channel);
        break;
    }
  }

  // 두번째 query를 날리는 경우.
  if (global.Channels[channel] === 0) {
    delete global.Channels[channel];
  }
  if (global.Channels_F4[channel] === 0) {
    delete global.Channels_F4[channel];
  }
});
