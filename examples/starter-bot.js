const { Wechaty } = require('wechaty')
const request = require('superagent');
const urlencode = require('urlencode');
const common = require('../common/common');
const bot = new Wechaty()

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)

bot.start()
.then(() => console.log('Starter Bot Started.'))
.catch(e => console.error(e))

function onScan (qrcode, status) {
  require('qrcode-terminal').generate(qrcode, { small: true })  // show qrcode on console

  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('')

  console.log(qrcodeImageUrl)
}

function onLogin (user) {
  console.log(`${user} login`)
}

function onLogout(user) {
  console.log(`${user} logout`)
}

 async function onMessage (msg) {
  const contact = msg.from();
  const content = msg.content(); // 好友发送的消息
  const room = msg.room(); //群
  if (msg.self()) {
    return false;
  }
  if (content) {
    var re=/<a[^>]*href=['"]([^"]*)['"][^>]*>(.*?)<\/a>/g;
    var arr =[];
    while(re.exec(content)!=null){
  		arr.push(RegExp.$2);//如果是RegExp.$1那么匹配的就是href里的属性了!
  	}
    if (JSON.stringify(arr) != '[]') {
      console.log('true');
      const data= await request.get('http://192.168.80.16:3000/api/wechatRobot').query({url: arr[0]});
      console.log(data.text);
      msg.say(data.text);
      return false;
    } else if(content.substring(content.indexOf('https:'), content.indexOf(' 点击链接'))) {
      var url = content.substring(content.indexOf('https:'), content.indexOf(' 点击链接'));
      const data= await request.get('http://192.168.80.16:3000/api/wechatRobot').query({url: url});
      msg.say(data.text);
      return false;
    } else {
      const data= await request.get('http://192.168.80.16:3000/api/wechatRobot').query({text: content});
      msg.say(data.text);
      return false;
    }
    // const data = await request.get(url);
    // const newMsg = JSON.parse(data.text).content;
    // console.log(newMsg)
    // newMsg.replace('{br}','\n')
  }
}
