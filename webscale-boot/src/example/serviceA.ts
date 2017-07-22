import { Service } from "../boot/decorators/service";
import { ServiceB } from "./serviceB";

@Service
export class ServiceA {

  private serivceB:any = "hello";

  constructor( serviceB?: ServiceB ) {
    this.serivceB = serviceB;
  }

}
