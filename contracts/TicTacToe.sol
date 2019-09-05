pragma solidity^0.5.8;

contract TicTacToe {

    address public player1;
    address public player2;
    address public winner;
    
    uint public player1Escrow;
    uint public player2Escrow;
    
    uint current_move  = 0;
    enum SquareState {Empty, X, O}
    SquareState[3][3] board;
    
    constructor() public payable {
        //require(msg.value > 0, 'value should be more than 0');
        player1 = msg.sender;
        player1Escrow = 100; // need to update this with msg.value
        
    }
    
    function joinGame() public payable {
        //require(msg.value > 0, 'value should be more than 0');
        require(msg.sender != player1, 'both player cant be same');
        player2 = msg.sender;

        player2Escrow = msg.value;
        
    }
    
    function performMove(uint8 xpos, uint8 ypos) public {
        require(msg.sender == player1 || msg.sender == player2);
        require(!isGameOver(), 'game is over');
        /*require(msg.sender == currentPlayerAddress(), 'not your turn....');*/
        require(positionIsInBound(xpos, ypos), 'in-valid move');
        require(board[xpos][ypos] == SquareState.Empty, 'already occupied');
        
        board[xpos][ypos] = currentPlayerShape();
        current_move += 1;

        if(isGameOver()) {
            /*address payable tmp = findWinner();
            address(tmp).transfer(player2Escrow + player1Escrow);*/
            /*address(msg.sender).transfer(player1Escrow + player2Escrow);*/
            player1Escrow = 0;
            player2Escrow = 0;
            winner = findWinner();
        }
       
    }
    
    function findWinner() public payable returns (address) {
        SquareState shape = winningPlayerShape();
        if(shape == SquareState.X) {
            winner = player2;
        } if(shape == SquareState.O) {
            winner = player1;
        }
        
        return winner;
    }
    
    //returns true is the game has been finished
    function isGameOver() public view returns (bool) {
        return (winningPlayerShape() != SquareState.Empty || current_move > 8 );
    }
    
    function currentPlayerAddress() public view returns (address) {
        if(current_move % 2 == 0) {
            return player2;
        }
        return player1;
    }
    
    
    function currentPlayerShape() public view returns (SquareState) {
        if(current_move % 2 == 0) {
            return SquareState.X;
        }
        return SquareState.O;
    }
    
    function winningPlayerShape() private view returns (SquareState) {
        //Columns
        if(board[0][0] != SquareState.Empty && board[0][0] == board[0][1] && board[0][0] == board[0][2]) {
            return board[0][0];
        }
        if(board[1][0] != SquareState.Empty && board[1][0] == board[1][1] && board[1][0] == board[1][2]) {
            return board[1][0];
        }
        if(board[2][0] != SquareState.Empty && board[2][0] == board[2][1] && board[2][0] == board[2][2]) {
            return board[2][0];
        }
        
        //rows
        if(board[0][0] != SquareState.Empty && board[0][0] == board[1][0] && board[0][0] == board[2][0]) {
            return board[0][0];
        }
        if(board[0][1] != SquareState.Empty && board[0][1] == board[1][1] && board[0][1] == board[2][1]) {
            return board[0][1];
        }
        if(board[0][2] != SquareState.Empty && board[0][2] == board[1][2] && board[0][2] == board[2][2]) {
            return board[0][2];
        }
        
        //diagonal
        if(board[1][1] != SquareState.Empty && board[1][1] == board[0][0] && board[1][1] == board[2][2]) {
            return board[1][1];
        }
        if(board[1][1] != SquareState.Empty && board[1][1] == board[0][2] && board[1][1] == board[2][0]) {
            return board[1][1];
        }
        
        return SquareState.Empty;
    }
    
    
    function stateToString() public returns (string memory) {
        return string(abi.encodePacked("\n",
            rowToString(0),"<br>",
            rowToString(1),"<br>",
            rowToString(2),"<br>"
        ));
    }
    
    //String representation of board row
    function rowToString(uint ypos) public payable returns (string memory) {
        return string(abi.encodePacked(squareToString(0, ypos), " | ", squareToString(1, ypos), " | ", squareToString(2, ypos)))  ;
    }
    
    function squareToString(uint xpos, uint ypos) public view returns (string memory) {
        require(positionIsInBound(xpos, ypos));
        
        if(board[xpos][ypos] == SquareState.Empty) {
            return " ";
        }
        if(board[xpos][ypos] == SquareState.X) {
            return "X";
        } 
        if(board[xpos][ypos] == SquareState.O) {
            return "O";
        }
    }
    
    function positionIsInBound(uint xpos, uint ypos) private pure returns (bool) {
        return (xpos >= 0 && xpos < 3 && ypos >= 0 && ypos < 3);
    }
    
}