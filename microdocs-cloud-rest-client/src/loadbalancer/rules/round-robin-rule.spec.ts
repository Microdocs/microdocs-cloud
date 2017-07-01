import { assert } from 'chai';
import { RoundRobinRule } from "./round-robin-rule";
import { ServerList } from "../server-list";
import { Server } from "../server";
import { Request } from '../../http/request';

beforeEach(() => {
  RoundRobinRule.resetCounter();
});

describe( 'RoundRobinRule', () => {

  it( "Return server", () => {
    // Arrange
    let rule       = new RoundRobinRule();
    let server     = new Server( {
      ip: "localhost",
      port: 5050,
      serviceName: "order-service",
      instanceName: "order-service-1"
    } );
    let serverList = new ServerList( "order-service", [ server ] );

    // Act
    let result = rule.findNextServer( serverList, new Request() );

    // Assert
    assert.isTrue(result === server);
  } );

  it( "Loop over serverList", () => {
    // Arrange
    let rule       = new RoundRobinRule();
    let server1     = new Server( {
      ip: "localhost",
      port: 5050,
      serviceName: "order-service",
      instanceName: "order-service-1"
    } );
    let server2     = new Server( {
      ip: "localhost",
      port: 5051,
      serviceName: "order-service",
      instanceName: "order-service-2"
    } );
    let serverList = new ServerList( "order-service", [ server1, server2 ] );

    // Act
    let result1 = rule.findNextServer( serverList, new Request() );
    let result2 = rule.findNextServer( serverList, new Request() );
    let result3 = rule.findNextServer( serverList, new Request() );
    let result4 = rule.findNextServer( serverList, new Request() );
    let result5 = rule.findNextServer( serverList, new Request() );

    // Assert
    assert.isTrue(result1 === server1);
    assert.isTrue(result2 === server2);
    assert.isTrue(result3 === server1);
    assert.isTrue(result4 === server2);
    assert.isTrue(result5 === server1);
  } );

  it( "Loop over multiple servers", () => {
    // Arrange
    let rule       = new RoundRobinRule();
    let server1     = new Server( {
      ip: "localhost",
      port: 5050,
      serviceName: "order-service",
      instanceName: "order-service-1"
    } );
    let server2     = new Server( {
      ip: "localhost",
      port: 5051,
      serviceName: "order-service",
      instanceName: "order-service-2"
    } );
    let server3     = new Server( {
      ip: "localhost",
      port: 5052,
      serviceName: "order-service",
      instanceName: "order-service-3"
    } );
    let server4     = new Server( {
      ip: "localhost",
      port: 5053,
      serviceName: "order-service",
      instanceName: "order-service-4"
    } );
    let serverList = new ServerList( "order-service", [ server1, server2, server3, server4 ] );

    // Act
    let result1 = rule.findNextServer( serverList, new Request() );
    let result2 = rule.findNextServer( serverList, new Request() );
    let result3 = rule.findNextServer( serverList, new Request() );
    let result4 = rule.findNextServer( serverList, new Request() );
    let result5 = rule.findNextServer( serverList, new Request() );

    // Assert
    assert.isTrue(result1 === server1);
    assert.isTrue(result2 === server2);
    assert.isTrue(result3 === server3);
    assert.isTrue(result4 === server4);
    assert.isTrue(result5 === server1);
  } );

  it( "Loop over only available servers", () => {
    // Arrange
    let rule       = new RoundRobinRule();
    let server1     = new Server( {
      ip: "localhost",
      port: 5050,
      serviceName: "order-service",
      instanceName: "order-service-1"
    } );
    let server2     = new Server( {
      ip: "localhost",
      port: 5051,
      serviceName: "order-service",
      instanceName: "order-service-2",
      available: false
    } );
    let server3     = new Server( {
      ip: "localhost",
      port: 5052,
      serviceName: "order-service",
      instanceName: "order-service-3"
    } );
    let server4     = new Server( {
      ip: "localhost",
      port: 5053,
      serviceName: "order-service",
      instanceName: "order-service-4"
    } );
    let serverList = new ServerList( "order-service", [ server1, server2, server3, server4 ] );

    // Act
    let result1 = rule.findNextServer( serverList, new Request() );
    let result2 = rule.findNextServer( serverList, new Request() );
    let result3 = rule.findNextServer( serverList, new Request() );
    let result4 = rule.findNextServer( serverList, new Request() );
    let result5 = rule.findNextServer( serverList, new Request() );

    // Assert
    assert.isTrue(result1 === server1);
    assert.isTrue(result2 === server3);
    assert.isTrue(result3 === server4);
    assert.isTrue(result4 === server1);
    assert.isTrue(result5 === server3);
  } );

  it( "Separate different serviceNames", () => {
    // Arrange
    let rule       = new RoundRobinRule();
    let orderServer1     = new Server( {
      ip: "localhost",
      port: 5050,
      serviceName: "order-service",
      instanceName: "order-service-1"
    } );
    let orderServer2     = new Server( {
      ip: "localhost",
      port: 5051,
      serviceName: "order-service",
      instanceName: "order-service-2"
    } );
    let productServer1     = new Server( {
      ip: "localhost",
      port: 5052,
      serviceName: "product-service",
      instanceName: "product-service-1"
    } );
    let productServer2     = new Server( {
      ip: "localhost",
      port: 5053,
      serviceName: "product-service",
      instanceName: "product-service-2"
    } );
    let orderServerList = new ServerList( "order-service", [ orderServer1, orderServer2 ] );
    let productServerList = new ServerList( "product-service", [ productServer1, productServer2 ] );

    // Act
    let result1 = rule.findNextServer( orderServerList, new Request() );
    let result2 = rule.findNextServer( productServerList, new Request() );
    let result3 = rule.findNextServer( productServerList, new Request() );
    let result4 = rule.findNextServer( orderServerList, new Request() );
    let result5 = rule.findNextServer( productServerList, new Request() );
    let result6 = rule.findNextServer( orderServerList, new Request() );

    // Assert
    assert.isTrue(result1 === orderServer1);
    assert.isTrue(result2 === productServer1);
    assert.isTrue(result3 === productServer2);
    assert.isTrue(result4 === orderServer2, `expected: ${orderServer2.instanceName}, actual ${result4.instanceName}`);
    assert.isTrue(result5 === productServer1);
    assert.isTrue(result6 === orderServer1);
  } );

} );
