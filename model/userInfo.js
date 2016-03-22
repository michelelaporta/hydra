var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserDetail = new mongoose.Schema({  
  username: String,
  password: String
},{timestamps: true});

UserDetail.methods.findUser = function (username,password,callback) {
    console.log('CALLED userInfo findUser username:'+username + ' password:'+password );
	var query = this.model('userInfo').find({'username':username,'password':password},callback);
	return query;
}

var UserDetails = mongoose.model('userInfo', UserDetail);

module.exports = UserDetails;