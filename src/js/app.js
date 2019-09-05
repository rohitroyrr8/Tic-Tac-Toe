App = {
  web3Provider: null,
  contracts: {},
  account: '0x23ad706F0704Bc260056393b485AAff7d91EB1e8',
  contractAddress : '0xdC61D0894dE22Fc6Fd65CDfDAdf0A764928B6aA3',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    web3 = new Web3(App.web3Provider);
    /*if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }*/
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("TicTacToe.json", function(tictactoe) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.TicTacToe = TruffleContract(tictactoe);
      // Connect provider to interact with contract
      App.contracts.TicTacToe.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.TicTacToe.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      console.log(instance);
      App.stateToString();
    })
  },

  isGameOver: function() {
    App.contracts.TicTacToe.deployed().then(function(instance) {
        instance.isGameOver.call()
          .then(function(res) {
            console.log(res);
            if(res) {
              $('#gameStatus').html('Game is over.');
            } else {
              $('#gameStatus').html('Game is not over yet.')
            }
          });
    });
  },

  findWinner: function() {
    App.contracts.TicTacToe.deployed().then(function(instance) { 
      instance.findWinner.call()
        .then(function(res) {
          $('#gameWinner').html('<br>Winner Address : '+res);
        })
    });
  },

  stateToString: function() {
    App.contracts.TicTacToe.deployed().then(function(instance) { 
        instance.stateToString.call()
        .then(function(res) {
          $('#boardDiv').html('<p>'+res+'</p>');
        });
    });
  },

  joinGame: function() {
    App.contracts.TicTacToe.deployed().then(function(instance) { 
        instance.joinGame({ 
          from:web3.eth.accounts[1], 
          gas : 2131504,
          gasPrice: 200000000000
        })
        .then(function(res) {
          alert(res);
          $('#joinBtn').hide();
        });
    });
  },

  perform: function() {
    App.contracts.TicTacToe.deployed().then(function(instance) { 
        var xpos = $('#xpos').val();
        var ypos = $('#ypos').val();

        instance.performMove(ypos, xpos, {
            from:web3.eth.accounts[1], 
            gas : 2131504,
            gasPrice: 200000000000
        })
        .then(function(res) { 
          console.log(res);
          App.stateToString();

        });
    });
  }, 

  player1: function() {
    App.contracts.TicTacToe.deployed().then(function(instance) {
      return instance.player1.call();
    }).then(function(player) {
       $('#etherAddr').html('Player 1 : '+player);
       return player;
    });
  },

  player2: function() {
    App.contracts.TicTacToe.deployed().then(function(instance) {
      return instance.player2.call();
    }).then(function(player) {
      $('#etherAddr').append('<br>Player 2 : '+player);
      return player;
    });
  },  

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");
    var accountsDiv = $('#accounts');
    var etherAddrDiv = $('#etherAddr');
    var joinBtn = $('#joinBtn');
    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        accounts = web3.eth.accounts;
        App.player1();
        App.player2();
       
        App.contracts.TicTacToe.deployed().then(function(instance) {
          return instance.player2.call();
        }).then(function(player2) {
          if(player2 != '0x0000000000000000000000000000000000000000') {
            joinBtn.hide();
          }
        })


        loader.hide();
        content.show();
      }
    });
  },

};
$('#joinBtn').click(function() {
  App.joinGame();
});

$('#perform').click(function() {
  App.perform();
});

$('#gameOverBtn').click(function() {
  App.isGameOver();
});

$('#refreshBtn').click(function() {
  refresh();
  /*App.player1();
  App.player2();*/
});

function refresh() {
  App.isGameOver();
  App.stateToString();
  App.findWinner();
}

$(function() {
  $(window).load(function() {
    App.init();
  });
});