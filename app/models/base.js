'use strict';

var Mongo = require('mongodb');
var _ = require('lodash');

class Base{
  static findById(id, collection, model, fn){
    if(!id){fn(null); return;}
    if(typeof id === 'string'){
      if(id.length !== 24){ fn(null); return; }
      id = Mongo.ObjectID(id);
    }
    if(!(id instanceof Mongo.ObjectID)){ fn(null); return;}
    collection.findOne({_id: id}, (e, record)=>{
      if(record){
        record = _.create(model.prototype, record);
        fn(record);
      }else{
        fn(null);
      }
    });
  }

  static findAll(collection, model, fn){
    if(!collection){fn(null); return;}
    collection.find({}).toArray((e, records)=>{
      if(!records){fn(null); return;}
      records = records.map(r=>_.create(model.prototype, r));
      fn(records);
    });
  }
}

module.exports = Base;
