var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var { autoIncrement } = require('mongoose-plugin-autoinc');

var UserSchema = new Schema({
    username : {
        type : String,
        required: [true, '아이디는 필수입니다.']
    },
    email : String,
    displayname : String,
    phone : {
        type : String
    },
    password : {
        type : String,
        required: [true, '패스워드는 필수입니다.']
    },
    addr1 : {
        type : String
    },
    addr2 : {
        type : String
    },
    addr3 : String,
    created_at : {
        type : Date,
        default : Date.now()
    }
});

UserSchema.plugin( autoIncrement, { model : "user", field : "id" , startAt : 1 } );
module.exports = mongoose.model('user' , UserSchema);