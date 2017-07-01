import { Component } from '@angular/core';
import { OrderClient } from "./clients/order.client";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  message = 'loading...';

  constructor(private orderClient:OrderClient){
    orderClient.getOrder(5).subscribe(order => {
      this.message = "found " + order.products.length + " products for order " + order.id;
    }, error => {
      this.message = 'ERROR: ' + error;
    });
  }
}
