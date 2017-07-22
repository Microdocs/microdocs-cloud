/**
 * This adapter class makes it possible use an own implementation of a HTTP Web server
 */
export interface WebAdapter {

  onRequest();

  onInit();

  onConfigure();

  onStart();

  onDestroy();

}
