
import { App } from "../boot/application";
import { ServiceA } from "./serviceA";
import { Injections } from "../boot/injections";
import { ServiceB } from "./serviceB";

const app = new App();

app.services([
  ServiceB
]);

let serviceA = new ServiceA();

app.start();
