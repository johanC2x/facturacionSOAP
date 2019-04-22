const fs = require('fs');
const path = require('path');

let util = {};

util.base64_encode = (file, logger) => {
    logger.error('============== INICIO METHOD [util => base64_encode] ===============');
    let bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
};

util.base64_decode = (base64str, file, logger) => {
    logger.error('============== INICIO METHOD [util => base64_decode] ===============');
    let bitmap = new Buffer(base64str, 'base64');
    fs.writeFileSync(file, bitmap);
    logger.error('============== File created from base64 encoded string ===============');
};

util.Decodeuint8arr = (uint8array) => {
    logger.error('============== INICIO METHOD [util => Decodeuint8arr] ===============');
    return new TextDecoder("utf-8").decode(uint8array);
};

util.Encodeuint8arr = (myString) => {
    logger.error('============== INICIO METHOD [util => Encodeuint8arr] ===============');
    return new TextEncoder("utf-8").encode(myString);
};

module.exports = util;