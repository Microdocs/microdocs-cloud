import { Injectable } from "./injectable";

/**
 * Decorator to resolve the constructor arguments from the Injections store
 * @param target
 * @return {{new(...args:any[])=>{}}}
 * @constructor
 */
export const Service = Injectable;
