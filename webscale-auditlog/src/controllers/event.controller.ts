import { JsonController, Get, Param } from "routing-controllers";
import { Injectable } from "@webscale/boot";
import { Event } from "@webscale/events";
import { EventService } from "../services/event.service";

@JsonController("/api/v1")
@Injectable
export class EventController {

  constructor( private eventService: EventService ) {
  }

  @Get("/events")
  public async getEvents(): Promise<Event[]> {
    return this.eventService.getEvents();
  }

  @Get("/events/:id")
  public async getEvent( @Param('id') id: string ): Promise<Event> {
    return this.eventService.getEvent(id);
  }

}
