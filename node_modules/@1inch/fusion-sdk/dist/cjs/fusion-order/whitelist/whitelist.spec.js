"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _limitordersdk = require("@1inch/limit-order-sdk");
var _byteutils = require("@1inch/byte-utils");
var _whitelist = require("./whitelist.js");
var _time = require("../../utils/time.js");
describe('Whitelist', function() {
    it('should encode/decode', function() {
        var whitelist = _whitelist.Whitelist.new((0, _time.now)(), [
            {
                address: _limitordersdk.Address.fromBigInt(1n),
                allowFrom: (0, _time.now)() + 10n
            },
            {
                address: _limitordersdk.Address.fromBigInt(_byteutils.UINT_160_MAX),
                allowFrom: (0, _time.now)() + 20n
            }
        ]);
        expect(_whitelist.Whitelist.decode(whitelist.encode())).toEqual(whitelist);
    });
    it('Should generate correct whitelist', function() {
        var start = 1708117482n;
        var data = _whitelist.Whitelist.new(start, [
            {
                address: _limitordersdk.Address.fromBigInt(2n),
                allowFrom: start + 1000n
            },
            {
                address: _limitordersdk.Address.ZERO_ADDRESS,
                allowFrom: start - 10n
            },
            // should be set to start
            {
                address: _limitordersdk.Address.fromBigInt(1n),
                allowFrom: start + 10n
            },
            {
                address: _limitordersdk.Address.fromBigInt(3n),
                allowFrom: start + 10n
            }
        ]);
        expect(data.whitelist).toStrictEqual([
            {
                addressHalf: _limitordersdk.Address.ZERO_ADDRESS.toString().slice(-20),
                delay: 0n
            },
            {
                addressHalf: _limitordersdk.Address.fromBigInt(1n).toString().slice(-20),
                delay: 10n
            },
            {
                addressHalf: _limitordersdk.Address.fromBigInt(3n).toString().slice(-20),
                delay: 0n
            },
            {
                addressHalf: _limitordersdk.Address.fromBigInt(2n).toString().slice(-20),
                delay: 990n
            }
        ]);
        expect(data.canExecuteAt(_limitordersdk.Address.fromBigInt(1n), start + 10n)).toEqual(true);
        expect(data.canExecuteAt(_limitordersdk.Address.fromBigInt(1n), start + 9n)).toEqual(false);
        expect(data.canExecuteAt(_limitordersdk.Address.fromBigInt(3n), start + 10n)).toEqual(true);
        expect(data.canExecuteAt(_limitordersdk.Address.fromBigInt(3n), start + 9n)).toEqual(false);
        expect(data.canExecuteAt(_limitordersdk.Address.fromBigInt(2n), start + 50n)).toEqual(false);
    });
});
