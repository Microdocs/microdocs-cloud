import { Service } from "@webscale/boot";
import { Event } from "@webscale/events";
import { EventRepository } from "../repositories/event.repo";

@Service
export class EventService {

  constructor(private eventRepository:EventRepository){

  }

  public async getEvents(): Promise<Event[]> {
    return this.eventRepository.getEvents();
  }

  public async getEvent(id:string): Promise<Event> {
    return this.eventRepository.getEvent(id);
  }

  public async storeEvent( event: Event ): Promise<Event> {
    return this.eventRepository.addEvent(event);
  }

}
