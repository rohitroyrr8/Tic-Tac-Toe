var tictactoe = artifacts.require("./TicTacToe.sol");

module.exports = function(deployer) {
  deployer.deploy(tictactoe);
};
