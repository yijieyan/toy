const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let weatherSchema = new Schema({
  address:String, //地区
  status: String, // 天气的状态
  temperature: String, // 温度
  wind_power: String, // 风力
  epollution_count: String, // 污染数值
  epollution_level: String, //污染级别
  date: String, // 日期信息
  img:String, //当前天气的图片
  currentTem:String //当前的温度
}, {versionKey: false, timestamps: true});
module.exports = mongoose.model('weather', weatherSchema)
;