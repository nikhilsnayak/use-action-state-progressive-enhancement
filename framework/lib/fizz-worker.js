const { parentPort } = require('worker_threads');
const { register } = require('module');
const { Writable, PassThrough } = require('stream');
const { pathToFileURL } = require('url');
const { createElement } = require('react');
const { createFromNodeStream } = require('react-server-dom-webpack/client');
const { renderToPipeableStream } = require('react-dom/server');
const { getReactSSRManifest } = require('./manifests');
const { injectRSCPayload } = require('../rsc-html-stream/server');

register('./framework/loaders/jsx.js', pathToFileURL('./'));

parentPort.on('message', async (request) => {
  const htmlConsumerRSCStream = new PassThrough();
  const payloadConsumerRSCStream = new PassThrough();

  request.port.on('message', (message) => {
    if (message.type === 'data') {
      htmlConsumerRSCStream.write(message.data);
      payloadConsumerRSCStream.write(message.data);
    } else if (message.type === 'end') {
      htmlConsumerRSCStream.end();
      payloadConsumerRSCStream.end();
    }
  });

  const writableStream = new Writable({
    write(chunk, encoding, callback) {
      request.port.postMessage({
        type: 'data',
        data: chunk,
      });
      callback();
    },
    final(callback) {
      request.port.postMessage({ type: 'end' });
      callback();
    },
  });

  const serverConsumerManifest = await getReactSSRManifest();

  const { tree } = await createFromNodeStream(
    htmlConsumerRSCStream,
    serverConsumerManifest
  );

  const { SSRRouter } = await import('../client/ssr-router.js');

  const htmlStream = renderToPipeableStream(
    createElement(SSRRouter, { initialState: { tree } }),
    {
      bootstrapScripts: ['/client.js'],
      onShellReady: () => {
        htmlStream
          .pipe(injectRSCPayload(payloadConsumerRSCStream))
          .pipe(writableStream);
      },
    }
  );
});
