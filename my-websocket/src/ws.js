const {EventEmitter} = require('events');
const http = require('http');
const crypto = require('crypto');

function hashKey(key) {
    const sha1 = crypto.createHash('sha1');
    sha1.update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
    return sha1.digest('base64');
  }

class MyWebsocket extends EventEmitter {
    constructor(options) {
        super(options);
        const server = http.createServer();
        server.listen(options.port || 8080);
        server.on('upgrade', (req, socket) => {
            this.socket = socket;
            socket.setKeepAlive(true);
          
            const resHeaders = [
              'HTTP/1.1 101 Switching Protocols',
              'Upgrade: websocket',
              'Connection: Upgrade',
              'Sec-WebSocket-Accept: ' + hashKey(req.headers['sec-websocket-key']),
              '',
              ''
            ].join('\r\n');
            socket.write(resHeaders);
          
            socket.on('data', (data) => {
              console.log(data)
            });
            socket.on('close', (error) => {
                this.emit('close');
            });
          });
          
    }
    handleRealData(opcode, realDataBuffer) {
        switch (opcode) {
          case OPCODES.TEXT:
            this.emit('data', realDataBuffer.toString('utf8'));
            break;
          case OPCODES.BINARY:
            this.emit('data', realDataBuffer);
            break;
          default:
            this.emit('close');
            break;
        }
    }
    
}
processData = function(bufferData) {
    // the last 4 bit of the 1th byte is the opcode
    const byte1 = bufferData.readUInt8(0);
    console.log('byte1:', byte1)
    const offset = 0x0f;
    let opcode = byte1 & offset;
    console.log('opcode:', opcode)
  
    // the 1st bit of the 2nd byte is the MASK bit
    const byte2 = bufferData.readUInt8(1);
    console.log('byte2:', byte2)
    const str2 = byte2.toString(2);
    console.log('str2:', str2)
    const MASK = str2[0];
    console.log('MASK:', MASK)
    let payloadLength = parseInt(str2.slice(1), 2);
    let curByteIndex = 2;
    console.log('payloadLength:', payloadLength)
    if ( payloadLength === 126) {
        // use the next 2 bytes as the payload length
        payloadLength = bufferData.readUInt16BE(2);
        curByteIndex += 2;
    } else if (payloadLength === 127) {
        // use the next 8 bytes as the payload length
        payloadLength = bufferData.readUInt64BE(2);
        curByteIndex += 8;
    }
    let realData = null;

    if (MASK) {
      const maskKey = bufferData.slice(curByteIndex, curByteIndex + 4);  
      curByteIndex += 4;
      const payloadData = bufferData.slice(curByteIndex, curByteIndex + payloadLength);
      realData = handleMask(maskKey, payloadData);
    } else {
      realData = bufferData.slice(curByteIndex, curByteIndex + payloadLength);;
    }
}

function handleMask(maskBytes, data) {
    const payload = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i++) {
      payload[i] = maskBytes[i % 4] ^ data[i];
    }
}
const OPCODES = {
    CONTINUE: 0,
    TEXT: 1, // 文本
    BINARY: 2, // 二进制
    CLOSE: 8,
    PING: 9,
    PONG: 10,
  };

  

module.exports = MyWebsocket;