self.__uv$config = {
    prefix: '/ultra/',
    bare: '/o/',
    encodeUrl:  Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/m/handler.js',
    bundle: '/m/bundle.js',
    config: '/m/config.js',
    sw: '/m/sw.js',
};