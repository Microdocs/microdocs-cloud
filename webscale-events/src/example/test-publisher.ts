
import { EventDispatcher } from "../events/event-dispatcher";
import { Observable } from "rxjs/Observable";

@Exchange({
  name: '',
  queue: {
    name:
  }
})
@RoutingKey("com.maxxton")
export class TestPublisher extends EventPublisher {

  @RoutingKey("customer.create")
  public createCustomer(customer:Customer):void {}

}
