import express from 'express';
import * as lark from '@larksuiteoapi/node-sdk';
import { config } from './config';
import { eventDispatcher, wsClient } from './services/feishu';
import { messageHandler } from './controllers/messageController';
import { startScheduler } from './services/scheduler';

const app = express();

// Start scheduler
startScheduler();

// Start WebSocket Client
wsClient.start({
  eventDispatcher: eventDispatcher
}).then(() => {
    console.log('Feishu WebSocket Client started');
});

// Register event handler
eventDispatcher.register({
  'im.message.receive_v1': messageHandler,
});

app.get('/', (req, res) => {
  res.send('Feishu Bot is running (WebSocket Mode)!');
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
