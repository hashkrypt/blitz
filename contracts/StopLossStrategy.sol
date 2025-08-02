// contracts/StopLossStrategy.sol
pragma solidity ^0.8.0;

contract StopLossStrategy {
    struct ConditionalOrder {
        address maker;
        address makerAsset;
        address takerAsset;
        uint256 makingAmount;
        uint256 takingAmount;
        uint256 triggerPrice;
        bool isStopLoss; // true = stop-loss, false = take-profit
        bool isActive;
    }
    
    mapping(bytes32 => ConditionalOrder) public orders;
    
    function createStopLossOrder(
        address makerAsset,
        address takerAsset,
        uint256 makingAmount,
        uint256 stopPrice
    ) external returns (bytes32 orderId) {
        orderId = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        orders[orderId] = ConditionalOrder({
            maker: msg.sender,
            makerAsset: makerAsset,
            takerAsset: takerAsset,
            makingAmount: makingAmount,
            takingAmount: makingAmount * stopPrice / 1e18,
            triggerPrice: stopPrice,
            isStopLoss: true,
            isActive: true
        });
    }
    
    function checkExecutable(bytes32 orderId, uint256 currentPrice) 
        external view returns (bool) {
        ConditionalOrder memory order = orders[orderId];
        if (!order.isActive) return false;
        
        if (order.isStopLoss) {
            return currentPrice <= order.triggerPrice;
        } else {
            return currentPrice >= order.triggerPrice;
        }
    }
}