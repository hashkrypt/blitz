"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Quote", {
    enumerable: true,
    get: function() {
        return Quote;
    }
});
var _limitordersdk = require("@1inch/limit-order-sdk");
var _byteutils = require("@1inch/byte-utils");
var _orderparams = require("./order-params.js");
var _types = require("../types.js");
var _preset = require("../preset.js");
var _index = require("../../../fusion-order/index.js");
var _constants = require("../../../fusion-order/constants.js");
var _index1 = require("../../../fusion-order/fees/index.js");
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
var Quote = /*#__PURE__*/ function() {
    "use strict";
    function Quote(params, response) {
        _class_call_check(this, Quote);
        _define_property(this, "params", void 0);
        /**
     * Fusion extension address
     * @see https://github.com/1inch/limit-order-settlement
     */ _define_property(this, "settlementAddress", void 0);
        _define_property(this, "fromTokenAmount", void 0);
        _define_property(this, "presets", void 0);
        _define_property(this, "recommendedPreset", void 0);
        _define_property(this, "toTokenAmount", void 0);
        _define_property(this, "marketReturn", void 0);
        _define_property(this, "prices", void 0);
        _define_property(this, "volume", void 0);
        _define_property(this, "whitelist", void 0);
        _define_property(this, "quoteId", void 0);
        _define_property(this, "slippage", void 0);
        _define_property(this, "resolverFeePreset", void 0);
        _define_property(this, "surplusFee", void 0);
        this.params = params;
        this.fromTokenAmount = BigInt(response.fromTokenAmount);
        var _obj;
        this.presets = (_obj = {}, _define_property(_obj, _types.PresetEnum.fast, new _preset.Preset(response.presets.fast)), _define_property(_obj, _types.PresetEnum.medium, new _preset.Preset(response.presets.medium)), _define_property(_obj, _types.PresetEnum.slow, new _preset.Preset(response.presets.slow)), _define_property(_obj, _types.PresetEnum.custom, response.presets.custom ? new _preset.Preset(response.presets.custom) : undefined), _obj);
        this.toTokenAmount = response.toTokenAmount;
        this.marketReturn = BigInt(response.marketAmount);
        this.prices = response.prices;
        this.volume = response.volume;
        this.quoteId = response.quoteId;
        this.whitelist = response.whitelist.map(function(a) {
            return new _limitordersdk.Address(a);
        });
        this.recommendedPreset = response.recommended_preset;
        this.slippage = response.autoK;
        this.settlementAddress = new _limitordersdk.Address(response.settlementAddress);
        this.resolverFeePreset = {
            receiver: new _limitordersdk.Address(response.fee.receiver),
            whitelistDiscountPercent: _limitordersdk.Bps.fromPercent(response.fee.whitelistDiscountPercent),
            bps: new _limitordersdk.Bps(BigInt(response.fee.bps))
        };
        this.surplusFee = response.surplusFee;
    }
    _create_class(Quote, [
        {
            key: "createFusionOrder",
            value: function createFusionOrder(paramsData) {
                var params = _orderparams.FusionOrderParams.new({
                    preset: (paramsData === null || paramsData === void 0 ? void 0 : paramsData.preset) || this.recommendedPreset,
                    receiver: paramsData === null || paramsData === void 0 ? void 0 : paramsData.receiver,
                    permit: this.params.permit,
                    isPermit2: this.params.isPermit2,
                    nonce: paramsData === null || paramsData === void 0 ? void 0 : paramsData.nonce,
                    network: paramsData.network
                });
                var preset = this.getPreset(params.preset);
                var auctionDetails = preset.createAuctionDetails(params.delayAuctionStartTimeBy);
                var _paramsData_allowPartialFills;
                var allowPartialFills = (_paramsData_allowPartialFills = paramsData === null || paramsData === void 0 ? void 0 : paramsData.allowPartialFills) !== null && _paramsData_allowPartialFills !== void 0 ? _paramsData_allowPartialFills : preset.allowPartialFills;
                var _paramsData_allowMultipleFills;
                var allowMultipleFills = (_paramsData_allowMultipleFills = paramsData === null || paramsData === void 0 ? void 0 : paramsData.allowMultipleFills) !== null && _paramsData_allowMultipleFills !== void 0 ? _paramsData_allowMultipleFills : preset.allowMultipleFills;
                var isNonceRequired = !allowPartialFills || !allowMultipleFills;
                var _params_nonce;
                var nonce = isNonceRequired ? (_params_nonce = params.nonce) !== null && _params_nonce !== void 0 ? _params_nonce : (0, _limitordersdk.randBigInt)(_byteutils.UINT_40_MAX) : params.nonce;
                var takerAsset = this.params.toTokenAddress.isNative() ? _constants.CHAIN_TO_WRAPPER[paramsData.network] : this.params.toTokenAddress;
                return _index.FusionOrder.new(this.settlementAddress, {
                    makerAsset: this.params.fromTokenAddress,
                    takerAsset: takerAsset,
                    makingAmount: this.fromTokenAmount,
                    takingAmount: preset.auctionEndAmount,
                    maker: this.params.walletAddress,
                    receiver: params.receiver
                }, {
                    auction: auctionDetails,
                    whitelist: this.getWhitelist(auctionDetails.startTime, preset.exclusiveResolver),
                    surplus: new _index.SurplusParams(this.marketReturn, _limitordersdk.Bps.fromPercent(this.surplusFee || 0))
                }, {
                    nonce: nonce,
                    unwrapWETH: this.params.toTokenAddress.isNative(),
                    permit: params.permit,
                    allowPartialFills: allowPartialFills,
                    allowMultipleFills: allowMultipleFills,
                    orderExpirationDelay: paramsData === null || paramsData === void 0 ? void 0 : paramsData.orderExpirationDelay,
                    source: this.params.source,
                    enablePermit2: params.isPermit2,
                    fees: buildFees(this.resolverFeePreset, this.params.integratorFee, this.surplusFee)
                });
            }
        },
        {
            key: "getPreset",
            value: function getPreset() {
                var type = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : _types.PresetEnum.fast;
                return this.presets[type];
            }
        },
        {
            key: "getWhitelist",
            value: function getWhitelist(auctionStartTime, exclusiveResolver) {
                if (exclusiveResolver) {
                    return _index.Whitelist.fromNow(this.whitelist.map(function(resolver) {
                        var isExclusive = resolver.equal(exclusiveResolver);
                        return {
                            address: resolver,
                            allowFrom: isExclusive ? 0n : auctionStartTime
                        };
                    }));
                }
                return _index.Whitelist.fromNow(this.whitelist.map(function(resolver) {
                    return {
                        address: resolver,
                        allowFrom: 0n
                    };
                }));
            }
        }
    ]);
    return Quote;
}();
function buildFees(resolverFeePreset, integratorFee, surplusFee) {
    var protocolReceiver = resolverFeePreset.receiver;
    var hasIntegratorFee = integratorFee && !integratorFee.value.isZero();
    var hasProtocolFee = !resolverFeePreset.bps.isZero() || (surplusFee || 0) > 0;
    if (!hasProtocolFee && !hasIntegratorFee) {
        return undefined;
    }
    return new _index1.Fees(new _index1.ResolverFee(protocolReceiver, resolverFeePreset.bps, resolverFeePreset.whitelistDiscountPercent), integratorFee ? new _index1.IntegratorFee(integratorFee.receiver, protocolReceiver, integratorFee.value, integratorFee.share) : _index1.IntegratorFee.ZERO);
}
