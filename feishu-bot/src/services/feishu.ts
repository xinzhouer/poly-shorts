import * as lark from '@larksuiteoapi/node-sdk';
import { config } from '../config';

if (!config.feishu.appId || !config.feishu.appSecret) {
  console.error('Feishu configuration is missing');
}

export const client = new lark.Client({
  appId: config.feishu.appId,
  appSecret: config.feishu.appSecret,
  appType: lark.AppType.SelfBuild,
  domain: lark.Domain.Feishu,
});

export const wsClient = new lark.WSClient({
  appId: config.feishu.appId,
  appSecret: config.feishu.appSecret,
});

export const eventDispatcher = new lark.EventDispatcher({
  encryptKey: config.feishu.encryptKey,
  verificationToken: config.feishu.verificationToken,
});
