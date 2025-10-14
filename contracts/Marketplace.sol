
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Marketplace {
    struct Order {
        address seller;
        address token;
        uint256 amount;
        uint256 pricePerToken;
        bool open;
    }
    uint256 public orderCount;
    mapping(uint256 => Order) public orders;
    event OrderPlaced(uint256 orderId, address seller, address token, uint256 amount, uint256 pricePerToken);
    event OrderClosed(uint256 orderId);
    event OrderFilled(uint256 orderId, address buyer, uint256 amount);

    function placeOrder(address token, uint256 amount, uint256 pricePerToken) external {
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        orderCount++;
        orders[orderCount] = Order({seller: msg.sender, token: token, amount: amount, pricePerToken: pricePerToken, open: true});
        emit OrderPlaced(orderCount, msg.sender, token, amount, pricePerToken);
    }

    function buy(uint256 orderId, uint256 buyAmount) external payable {
        Order storage order = orders[orderId];
        require(order.open, "Order closed");
        require(buyAmount <= order.amount, "Not enough tokens");
        require(msg.value >= buyAmount * order.pricePerToken, "Insufficient funds");
        order.amount -= buyAmount;
        if (order.amount == 0) order.open = false;
        IERC20(order.token).transfer(msg.sender, buyAmount);
        payable(order.seller).transfer(buyAmount * order.pricePerToken);
        emit OrderFilled(orderId, msg.sender, buyAmount);
    }

    function closeOrder(uint256 orderId) external {
        Order storage order = orders[orderId];
        require(msg.sender == order.seller, "Not seller");
        require(order.open, "Already closed");
        order.open = false;
        IERC20(order.token).transfer(order.seller, order.amount);
        emit OrderClosed(orderId);
    }
}
