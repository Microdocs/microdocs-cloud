
// import {Schema, ObjectId, Model, model} from "mongoose";
import * as mongoose from "mongoose";
import {Event} from "@webscale/events";

export class EventRepository {

  private event:mongoose.Model;

  constructor(){
    let schema = new mongoose.Schema({
      guid : String,
      timestamp: Date,
      body: String,
      routingKey: String
    });
    this.event = mongoose.model("Events", schema);
  }

  public async getEvents():Promise<Event[]>{
    return new Promise<Event[]>((resolve, reject) => {
      this.event.find({}, function (err, events) {
        if(err){
          reject(err);
        }else{
          resolve(events);
        }
      });
    });
  }

  public async getEvent(id:string):Promise<Event>{
    return new Promise<Event>((resolve, reject) => {
      this.event.findById(id, function (err, event) {
        if(err){
          reject(err);
        }else{
          resolve(event);
        }
      });
    });
  }

  public async addEvent(event:Event):Promise<Event>{
    return new Promise<Event>((resolve, reject) => {
      let entity = new this.event();
      entity.my.timestamp = event.timestamp;
      entity.my.routingKey = event.routingKey;
      entity.my.guid = event.guid;
      entity.my.body = JSON.stringify(event.body);
      entity.save(err => {
        if(err){
          reject(err);
        }else{
          resolve(entity);
        }
      });
    });
  }

}
