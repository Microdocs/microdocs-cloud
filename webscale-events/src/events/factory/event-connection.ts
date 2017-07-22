import { Event } from "../event";
import { PartialObserver } from "rxjs/Observer";

/**
 * COnnection with an event bus for publishing and subscribing to events
 */
export abstract class EventConnection {

  public abstract onNext(event:Event);

  public abstract onError(event:Event, e:Error);

  public abstract subscribe(observer: PartialObserver<Event>);

}
