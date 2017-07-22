
import { EventDispatcher } from "../events/event-dispatcher";
import { Observable } from "rxjs/Observable";
import { Exchange } from "../events/decorators/exchange";

@Exchange({
  name: '',
  queue: {
    name: ''
  },
  server: {
    host: 'localhost',
    port: 11234
  }
})
@RoutingKey("com.maxxton")
export class TestDispatcher extends EventDispatcher {

  @RoutingKey("customer.create")
  public createCustomer():Observable<Customer>{
    return null;
  }

}
