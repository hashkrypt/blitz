import { FeeTakerExt, Address, Bps } from '@1inch/limit-order-sdk';
import { AmountCalculator } from './amount-calculator.js';
import { AuctionCalculator } from './auction-calculator/index.js';
import { SurplusParams, Whitelist } from '../fusion-order/index.js';
import { now } from '../utils/time.js';
import { Fees, IntegratorFee } from '../fusion-order/fees/index.js';
describe('AmountCalculator', function() {
    it('should correct extract fee', function() {
        var integratorFeeBps = new Bps(6n);
        // 60% from 10bps
        var calculator = new AmountCalculator(new AuctionCalculator(1738650250n, 180n, 1218519n, [
            {
                coefficient: 609353,
                delay: 180
            }
        ], {
            gasBumpEstimate: 609353n,
            gasPriceEstimate: 1526n
        }), new FeeTakerExt.FeeCalculator(Fees.integratorFee(new IntegratorFee(new Address('0x8e097e5e0493de033270a01b324caf31f464dc67'), new Address('0x90cbe4bdd538d6e9b379bff5fe72c3d67a521de5'), new Bps(10n), new Bps(6000n))), Whitelist.new(1738650226n, [
            {
                address: Address.fromBigInt(1n),
                allowFrom: 0n
            }
        ])));
        var takingAmount = 100000n;
        var requiredTakingAmount = calculator.getRequiredTakingAmount(Address.ZERO_ADDRESS, takingAmount, now(), 10n);
        var integratorFee = calculator.getIntegratorFee(Address.ZERO_ADDRESS, takingAmount, now(), 10n);
        expect(AmountCalculator.extractFeeAmount(requiredTakingAmount, integratorFeeBps)).toEqual(integratorFee);
    });
    it('should apply surplus', function() {
        var startTime = 1738650250n;
        var execTime = startTime + 180n;
        // end of auction
        var auction = new AuctionCalculator(startTime, 180n, 1218519n, [
            {
                coefficient: 609353,
                delay: 180
            }
        ], {
            gasBumpEstimate: 609353n,
            gasPriceEstimate: 1526n
        });
        var taker = Address.fromBigInt(1n);
        var feeCalculator = new FeeTakerExt.FeeCalculator(Fees.integratorFee(new IntegratorFee(new Address('0x8e097e5e0493de033270a01b324caf31f464dc67'), new Address('0x90cbe4bdd538d6e9b379bff5fe72c3d67a521de5'), new Bps(10n), new Bps(6000n))), Whitelist.new(1738650226n, [
            {
                address: taker,
                allowFrom: 0n
            }
        ]));
        var calculatorNoSurplusFee = new AmountCalculator(auction, feeCalculator);
        var takingAmount = 100000n;
        var makingAmount = 1000n;
        var surplus = takingAmount / 3n;
        var estimatedTakingAmount = takingAmount - surplus;
        var calculator = new AmountCalculator(auction, feeCalculator, new SurplusParams(estimatedTakingAmount, Bps.fromPercent(50)));
        var userAmount = calculatorNoSurplusFee.getUserTakingAmount(taker, makingAmount, takingAmount, makingAmount, execTime);
        var userAmountWithChargedSurplus = calculator.getUserTakingAmount(taker, makingAmount, takingAmount, makingAmount, execTime);
        expect(userAmount).toBeGreaterThan(userAmountWithChargedSurplus);
        expect(userAmount - userAmountWithChargedSurplus).toEqual(surplus / 2n);
    });
}) // fee is 50%
;
