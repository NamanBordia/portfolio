// Create React App loads this file in Node, never in the browser bundle.
// Serve the same handler locally that Vercel uses in production.
const chatHandler = require('../api/chat');

module.exports = function setupProxy(app) {
  app.all('/api/chat', (req, res, next) => {
    const handleChat = () => Promise.resolve(chatHandler(req, res)).catch(next);

    if (req.method !== 'POST' || req.body !== undefined) {
      return handleChat();
    }

    let body = '';
    let tooLarge = false;
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      if (tooLarge) return;
      body += chunk;
      if (Buffer.byteLength(body, 'utf8') > 16384) {
        tooLarge = true;
        res.status(413).json({ answer: 'Please send a shorter message.' });
      }
    });
    req.on('end', () => {
      if (tooLarge) return;
      req.body = body;
      handleChat();
    });
    req.on('error', next);
  });
};
