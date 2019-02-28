let puppeteer = require('puppeteer');
let Weather = require('../models/weather.js');



async function weather(name = '郑州') {

  let url = `http://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=${name}天气`;

  // 创建一个浏览器
  let browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    timeout: 10000,
    devtools: true,
    headless: true
  });

  // 打开一个新页面
  let page = await browser.newPage();
  console.log(`开始爬取....`);
  // 加载对应的页面
  await page.goto(url);

  // 等待页面上的加载更多(class是more)出现
  await page.waitFor(2000);
  // 执行js脚本
  let o = await page.evaluate(() => {
    var $ = window.$;
    let obj = [];
    var dom =  $('.op_weather4_twoicon').find('a')
    dom.each((index, item) => {
      var item = $(item)
      if (index === 0) {
        obj = {
          status: item.find('.op_weather4_twoicon_weath').text().trim(), // 天气的状态
          temperature: item.find('.op_weather4_twoicon_temp').text().trim(), // 温度
          wind_power : item.find('.op_weather4_twoicon_wind').text().trim(), // 风力
          epollution_count: item.find('.op_weather4_twoicon_aqi_level_3_bg span').first().text().trim(), // 污染数值
          epollution_level: item.find('.op_weather4_twoicon_aqi_level_3_bg .op_weather4_twoicon_aqi_text_today').text().trim(), //污染级别
          date:item.find('.op_weather4_twoicon_date').text().trim(), // 日期信息
          img:item.find('.op_weather4_twoicon_icon').css('background-image').split('"')[1], // 当前天气的图片
          currentTem:item.find('.op_weather4_twoicon_shishi_title').text()+item.find('.op_weather4_twoicon_shishi_sup').text()+item.find('.op_weather4_twoicon_shishi_sub').text()// 当前的温度
        }
      }
    })
    return obj;
  });
  o.address = name;
  await Weather.create(o)
  let wea = await Weather.findOne({date:o.date});
  if (!wea) {
    await Weather.create(o)
  }
  // 关闭浏览器
  await browser.close();
}

module.exports = {
  weather
}