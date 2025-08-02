"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _limitordersdk = require("@1inch/limit-order-sdk");
var _ethers = require("ethers");
var _fusionorder = require("./fusion-order.js");
var _index = require("./auction-details/index.js");
var _index1 = require("./whitelist/index.js");
var _surplusparams = require("./surplus-params.js");
var _index2 = require("./fees/index.js");
var _index3 = require("../amount-calculator/index.js");
var _time = require("../utils/time.js");
describe('Fusion Order', function() {
    it('should create fusion order', function() {
        var extensionContract = new _limitordersdk.Address('0x8273f37417da37c4a6c3995e82cf442f87a25d9c');
        var order = _fusionorder.FusionOrder.new(extensionContract, {
            makerAsset: new _limitordersdk.Address('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'),
            takerAsset: new _limitordersdk.Address('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'),
            makingAmount: 1000000000000000000n,
            takingAmount: 1420000000n,
            maker: new _limitordersdk.Address('0x00000000219ab540356cbb839cbe05303d7705fa'),
            salt: 10n
        }, {
            auction: new _index.AuctionDetails({
                duration: 180n,
                startTime: 1673548149n,
                initialRateBump: 50000,
                points: [
                    {
                        coefficient: 20000,
                        delay: 12
                    }
                ]
            }),
            whitelist: _index1.Whitelist.new(1673548139n, [
                {
                    address: new _limitordersdk.Address('0x00000000219ab540356cbb839cbe05303d7705fa'),
                    allowFrom: 0n
                }
            ]),
            surplus: _surplusparams.SurplusParams.NO_FEE
        });
        var builtOrder = order.build();
        expect(builtOrder).toStrictEqual({
            maker: '0x00000000219ab540356cbb839cbe05303d7705fa',
            makerAsset: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            makingAmount: '1000000000000000000',
            receiver: '0x0000000000000000000000000000000000000000',
            // as there is no fee
            takerAsset: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            takingAmount: '1420000000',
            makerTraits: '33471150795161712739625987854073848363835856965607525350783622537007396290560',
            salt: '14806972048616591160256394064723634084331321369214'
        });
        var makerTraits = new _limitordersdk.MakerTraits(BigInt(builtOrder.makerTraits));
        expect(makerTraits.isNativeUnwrapEnabled()).toEqual(false);
        expect(makerTraits.nonceOrEpoch()).toEqual(0n);
        expect(makerTraits.isPartialFillAllowed()).toEqual(true);
    });
    it('should create fusion order with fees', function() {
        var extensionContract = new _limitordersdk.Address('0x8273f37417da37c4a6c3995e82cf442f87a25d9c');
        var order = _fusionorder.FusionOrder.new(extensionContract, {
            makerAsset: new _limitordersdk.Address('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'),
            takerAsset: new _limitordersdk.Address('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'),
            makingAmount: 1000000000000000000n,
            takingAmount: 1420000000n,
            maker: new _limitordersdk.Address('0x00000000219ab540356cbb839cbe05303d7705fa'),
            salt: 10n
        }, {
            auction: new _index.AuctionDetails({
                duration: 180n,
                startTime: 1673548149n,
                initialRateBump: 50000,
                points: [
                    {
                        coefficient: 20000,
                        delay: 12
                    }
                ]
            }),
            whitelist: _index1.Whitelist.new(1673548139n, [
                {
                    address: new _limitordersdk.Address('0x00000000219ab540356cbb839cbe05303d7705fa'),
                    allowFrom: 0n
                }
            ]),
            surplus: _surplusparams.SurplusParams.NO_FEE
        }, {
            fees: _index2.Fees.integratorFee(new _index2.IntegratorFee(_limitordersdk.Address.fromBigInt(1n), _limitordersdk.Address.fromBigInt(2n), _limitordersdk.Bps.fromPercent(1), _limitordersdk.Bps.fromPercent(50)))
        });
        var builtOrder = order.build();
        expect(builtOrder).toStrictEqual({
            maker: '0x00000000219ab540356cbb839cbe05303d7705fa',
            makerAsset: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            makingAmount: '1000000000000000000',
            receiver: extensionContract.toString(),
            // as there are fees
            takerAsset: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            takingAmount: '1420000000',
            makerTraits: '33471150795161712739625987854073848363835856965607525350783622537007396290560',
            salt: '15235559042146644103405359194784496869858870199717'
        });
        var makerTraits = new _limitordersdk.MakerTraits(BigInt(builtOrder.makerTraits));
        expect(makerTraits.isNativeUnwrapEnabled()).toEqual(false);
        expect(makerTraits.nonceOrEpoch()).toEqual(0n);
        expect(makerTraits.isPartialFillAllowed()).toEqual(true);
    });
    it('should decode fusion order from order + extension', function() {
        var extensionContract = new _limitordersdk.Address('0x8273f37417da37c4a6c3995e82cf442f87a25d9c');
        var order = _fusionorder.FusionOrder.new(extensionContract, {
            makerAsset: new _limitordersdk.Address('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'),
            takerAsset: new _limitordersdk.Address('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'),
            makingAmount: 1000000000000000000n,
            takingAmount: 1420000000n,
            maker: new _limitordersdk.Address('0x00000000219ab540356cbb839cbe05303d7705fa'),
            salt: 10n
        }, {
            auction: new _index.AuctionDetails({
                duration: 180n,
                startTime: 1673548149n,
                initialRateBump: 50000,
                points: [
                    {
                        coefficient: 20000,
                        delay: 12
                    }
                ]
            }),
            whitelist: _index1.Whitelist.new(0n, [
                {
                    address: new _limitordersdk.Address('0x00000000219ab540356cbb839cbe05303d7705fa'),
                    allowFrom: 0n
                }
            ]),
            surplus: _surplusparams.SurplusParams.NO_FEE
        });
        expect(_fusionorder.FusionOrder.fromDataAndExtension(order.build(), order.extension)).toStrictEqual(order);
    });
    it('should decode fusion order from order + extension with provided source', function() {
        var extensionContract = new _limitordersdk.Address('0x8273f37417da37c4a6c3995e82cf442f87a25d9c');
        var order = _fusionorder.FusionOrder.new(extensionContract, {
            makerAsset: new _limitordersdk.Address('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'),
            takerAsset: new _limitordersdk.Address('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'),
            makingAmount: 1000000000000000000n,
            takingAmount: 1420000000n,
            maker: new _limitordersdk.Address('0x00000000219ab540356cbb839cbe05303d7705fa'),
            salt: 10n
        }, {
            auction: new _index.AuctionDetails({
                duration: 180n,
                startTime: 1673548149n,
                initialRateBump: 50000,
                points: [
                    {
                        coefficient: 20000,
                        delay: 12
                    }
                ]
            }),
            whitelist: _index1.Whitelist.new(0n, [
                {
                    address: new _limitordersdk.Address('0x00000000219ab540356cbb839cbe05303d7705fa'),
                    allowFrom: 0n
                }
            ]),
            surplus: _surplusparams.SurplusParams.NO_FEE
        }, {
            source: 'test'
        });
        expect(_fusionorder.FusionOrder.fromDataAndExtension(order.build(), order.extension)).toStrictEqual(order);
    });
    it('Should calculate taking amount', function() {
        var now = 10000n;
        var order = _fusionorder.FusionOrder.new(new _limitordersdk.Address('0x8273f37417da37c4a6c3995e82cf442f87a25d9c'), {
            makerAsset: new _limitordersdk.Address('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'),
            // USDC
            takerAsset: new _limitordersdk.Address('0x111111111117dc0aa78b770fa6a738034120c302'),
            // 1INCH
            maker: _limitordersdk.Address.fromBigInt(1n),
            makingAmount: (0, _ethers.parseUnits)('150', 6),
            takingAmount: (0, _ethers.parseUnits)('200')
        }, {
            auction: new _index.AuctionDetails({
                startTime: now,
                duration: 120n,
                initialRateBump: 10000000,
                // 100%,
                points: []
            }),
            whitelist: _index1.Whitelist.new(0n, [
                {
                    address: new _limitordersdk.Address('0x00000000219ab540356cbb839cbe05303d7705fa'),
                    allowFrom: 0n
                }
            ]),
            surplus: _surplusparams.SurplusParams.NO_FEE
        }, {
            source: 'some_id'
        });
        expect(order.calcTakingAmount(_limitordersdk.Address.fromBigInt(1n), order.makingAmount, now)).toEqual(2n * order.takingAmount);
    });
    // because init rate bump is 100%
    it('Should calculate fees', function() {
        var order = _fusionorder.FusionOrder.fromDataAndExtension({
            salt: '88244613754032523633323406134225422628418021814470407656044833909440411473904',
            maker: '0x6edc317f3208b10c46f4ff97faa04dd632487408',
            receiver: '0xabd4e5fb590aa132749bbf2a04ea57efbaac399e',
            makerAsset: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            takerAsset: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            makerTraits: '62419173104490761595518734106935910747442209877250655105498008304728645042176',
            makingAmount: '7340000000000000',
            takingAmount: '17733698'
        }, new _limitordersdk.Extension({
            makerAssetSuffix: '0x',
            takerAssetSuffix: '0x',
            makingAmountData: '0xabd4e5fb590aa132749bbf2a04ea57efbaac399e094c49000005f667a1b28a0000b41297d701094c4900b400643c00006402d1a23c3abeed63c51b86b5636af8f99b8e85dc9f',
            takingAmountData: '0xabd4e5fb590aa132749bbf2a04ea57efbaac399e094c49000005f667a1b28a0000b41297d701094c4900b400643c00006402d1a23c3abeed63c51b86b5636af8f99b8e85dc9f',
            predicate: '0x',
            makerPermit: '0x',
            preInteraction: '0x',
            postInteraction: '0xabd4e5fb590aa132749bbf2a04ea57efbaac399e008e097e5e0493de033270a01b324caf31f464dc6790cbe4bdd538d6e9b379bff5fe72c3d67a521de500643c00006467a1b27202d1a23c3abeed63c51b860000b5636af8f99b8e85dc9f0000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00',
            customData: '0x'
        }));
        var userAmount = order.getAmountCalculator().getUserTakingAmount(_limitordersdk.Address.ZERO_ADDRESS, order.makingAmount, order.takingAmount, order.makingAmount, 1738650311n, 1533984564n);
        var integratorFee = order.getAmountCalculator().getIntegratorFee(_limitordersdk.Address.ZERO_ADDRESS, order.takingAmount, 1738650311n, 1533984564n);
        var protocolFee = order.getAmountCalculator().getProtocolFee(_limitordersdk.Address.ZERO_ADDRESS, order.takingAmount, 1738650311n, 1533984564n);
        expect(integratorFee).toEqual(11065n);
        expect(protocolFee).toEqual(7377n);
        expect(userAmount).toEqual(18442228n);
    });
    it('should calculate surplus fee - no surplus', function() {
        var currentTime = (0, _time.now)();
        var takerAddress = _limitordersdk.Address.fromBigInt(1000n);
        var order = _fusionorder.FusionOrder.new(_limitordersdk.Address.ZERO_ADDRESS, {
            maker: _limitordersdk.Address.fromBigInt(10n),
            makerAsset: _limitordersdk.Address.fromBigInt(1n),
            takerAsset: _limitordersdk.Address.fromBigInt(1n),
            makingAmount: (0, _ethers.parseEther)('0.1'),
            takingAmount: (0, _ethers.parseUnits)('100', 6)
        }, // will be 200 at time of fill because of rate bump
        {
            auction: new _index.AuctionDetails({
                duration: 120n,
                startTime: currentTime,
                points: [],
                initialRateBump: Number(_index3.AuctionCalculator.RATE_BUMP_DENOMINATOR)
            }),
            whitelist: _index1.Whitelist.new(0n, [
                {
                    address: takerAddress,
                    allowFrom: 0n
                }
            ]),
            surplus: new _surplusparams.SurplusParams((0, _ethers.parseUnits)('250', 6), _limitordersdk.Bps.fromPercent(50))
        }, {
            fees: new _index2.Fees(new _index2.ResolverFee(_limitordersdk.Address.fromBigInt(123n), _limitordersdk.Bps.fromPercent(1)), new _index2.IntegratorFee(_limitordersdk.Address.fromBigInt(123n), _limitordersdk.Address.fromBigInt(123n), _limitordersdk.Bps.fromPercent(0.1), _limitordersdk.Bps.fromPercent(10)))
        });
        var makingAmount = (0, _ethers.parseEther)('0.1') / 2n;
        var userAmount = order.getUserReceiveAmount(takerAddress, makingAmount, currentTime);
        var surplus = order.getSurplusFee(takerAddress, makingAmount, currentTime);
        expect(userAmount).toEqual(100000000n);
        expect(surplus).toEqual(0n);
    });
    it('should calculate surplus fee - have surplus', function() {
        var currentTime = (0, _time.now)();
        var takerAddress = _limitordersdk.Address.fromBigInt(1000n);
        var order = _fusionorder.FusionOrder.new(_limitordersdk.Address.ZERO_ADDRESS, {
            maker: _limitordersdk.Address.fromBigInt(10n),
            makerAsset: _limitordersdk.Address.fromBigInt(1n),
            takerAsset: _limitordersdk.Address.fromBigInt(1n),
            makingAmount: (0, _ethers.parseEther)('0.1'),
            takingAmount: (0, _ethers.parseUnits)('100', 6)
        }, // will be 200 at time of fill because of rate bump
        {
            auction: new _index.AuctionDetails({
                duration: 120n,
                startTime: currentTime,
                points: [],
                initialRateBump: Number(_index3.AuctionCalculator.RATE_BUMP_DENOMINATOR)
            }),
            whitelist: _index1.Whitelist.new(0n, [
                {
                    address: takerAddress,
                    allowFrom: 0n
                }
            ]),
            surplus: new _surplusparams.SurplusParams((0, _ethers.parseUnits)('100', 6), _limitordersdk.Bps.fromPercent(50))
        }, {
            fees: new _index2.Fees(new _index2.ResolverFee(_limitordersdk.Address.fromBigInt(123n), _limitordersdk.Bps.fromPercent(1)), new _index2.IntegratorFee(_limitordersdk.Address.fromBigInt(123n), _limitordersdk.Address.fromBigInt(123n), _limitordersdk.Bps.fromPercent(0.1), _limitordersdk.Bps.fromPercent(10)))
        });
        var makingAmount = (0, _ethers.parseEther)('0.1') / 2n;
        var userAmount = order.getUserReceiveAmount(takerAddress, makingAmount, currentTime);
        var surplus = order.getSurplusFee(takerAddress, makingAmount, currentTime);
        expect(userAmount).toEqual(75000000n);
        expect(surplus).toEqual(25000000n);
    });
});
