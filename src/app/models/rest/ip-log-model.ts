export class IPLogModel {
  thisIndex: number = 0;
  dateTime: Date = new Date();
  method: string = "";
  requestUri: string = "";
  forwardedFor?: string;
  proxyClientIp?: string;
  wlProxyClientIp?: string;
  httpClientIp?: string;
  httpForwardedFor?: string;
  remoteAddr: string = "";
  localAddr: string = "";
  serverName?: string;
  localName?: string;
  localPort: number = 0;
}
