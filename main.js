/*********************************************************************
** Program Filename:main.js
** Author: Jongwon An
** Date: 5/14/2003
** Description: Contains Javascript code for the magic number game
** Input: None
** Output: None
*********************************************************************/

window.addEventListener("DOMContentLoaded", domLoaded); // loads the javascript once domcontent is loaded

// starting values that is required for the game
numbers_avail = [0,0,0,0];  // keeps track of numbers
goal_value = 0; // value of the goal
turn = 0;   // 0, 1, 2. number -> operator -> number
inputs = [0,0,0];   // number -> operator -> number
work_line = 0;  // keeps track of which line the paper is at
scoreboard = [0,0]  // keeps track of wins and losses

/*********************************************************************
** Function: domLoaded
** Description: creates all the event listeners and starts the game
** Parameters: none
** Pre-Conditions: dom is loaded
** Post-Conditions: game has started
*********************************************************************/
function domLoaded() {
    new_game(); // starts new game

    // creates restart functionality to the "new game" button
    restart_button = document.getElementById("restart");
    restart_button.addEventListener("click", function() {restart_game();});

	// Create click-event handlers for the number buttons
	const buttons = document.querySelectorAll("#buttons > button");
	for (let button of buttons) {
		button.addEventListener("click", function () { checker_clicked(button); });
	}

    // create click-event handlers for the operators
    const operButtons = document.querySelectorAll("#operators > button");
    for (let button of operButtons) {
		button.addEventListener("click", function () { oper_clicked(button); });
	}
}

/*********************************************************************
** Function: restart_game
** Description: restarts the game to default settings except the scoreboard
** Parameters: none
** Pre-Conditions: none
** Post-Conditions: game is restarted
*********************************************************************/
function restart_game(){
    // sets the opening message
    document.getElementById("play_message").innerHTML = "Let's Play";

    // sets all the buttons to have the class "checker" and no other class
    if (document.getElementById("num1").classList.contains("finishedCheck") == true){
        document.getElementById("num1").classList.remove("finishedCheck"); 
        document.getElementById("num1").classList.add("checker"); 
    }
    if (document.getElementById("num2").classList.contains("finishedCheck") == true){
        document.getElementById("num2").classList.remove("finishedCheck"); 
        document.getElementById("num2").classList.add("checker"); 
    }
    if (document.getElementById("num3").classList.contains("finishedCheck") == true){
        document.getElementById("num3").classList.remove("finishedCheck"); 
        document.getElementById("num3").classList.add("checker"); 
    }
    if (document.getElementById("num4").classList.contains("finishedCheck") == true){
        document.getElementById("num4").classList.remove("finishedCheck"); 
        document.getElementById("num4").classList.add("checker"); 
    }

    // creates 4 random numbers for game
    for (i = 0; i < 4; i++){
        numbers_avail[i] = Math.round(Math.random() * 8 + 1);
    }
    // sets the random numbers to the buttons
    document.getElementById("num1").innerHTML = numbers_avail[0];
    document.getElementById("num2").innerHTML = numbers_avail[1];
    document.getElementById("num3").innerHTML = numbers_avail[2];
    document.getElementById("num4").innerHTML = numbers_avail[3];
    
    // sets the goal value
    // does random operation between each of the button numbers
    goal_value = decide_oper(decide_oper(decide_oper(numbers_avail[0], numbers_avail[1]),numbers_avail[2]), numbers_avail[3]);

    // makes the value visible to the user
    document.getElementById("goal").innerHTML = "Goal : " + goal_value.toString();

    // set global variables and text to nothing/default. The score doesn't get reset
    turn = 0;
    inputs = [0,0,0];
    work_line = 0;
    document.getElementById("l1").innerHTML = "";
    document.getElementById("l2").innerHTML = "";
    document.getElementById("l3").innerHTML = "";

}

/*********************************************************************
** Function: new_game
** Description: starts game (random numbers/goals and start message)
** Parameters: none
** Pre-Conditions: none
** Post-Conditions: random numbers/goal is set
*********************************************************************/
function new_game(){
    // sets the opening message
    document.getElementById("play_message").innerHTML = "Let's Play";

    // creates 4 random numbers for game
    for (i = 0; i < 4; i++){
        numbers_avail[i] = Math.round(Math.random() * 8 + 1);
    }
    // sets the random numbers to the buttons
    document.getElementById("num1").innerHTML = numbers_avail[0];
    document.getElementById("num2").innerHTML = numbers_avail[1];
    document.getElementById("num3").innerHTML = numbers_avail[2];
    document.getElementById("num4").innerHTML = numbers_avail[3];
    
    // sets the goal value
    // does random operation between each of the button numbers
    goal_value = decide_oper(decide_oper(decide_oper(numbers_avail[0], numbers_avail[1]),numbers_avail[2]), numbers_avail[3]);

    // makes the value visible to the user
    document.getElementById("goal").innerHTML = "Goal : " + goal_value.toString();
}

/*********************************************************************
** Function: decide_oper
** Description: performs operations on two inputs randomly
** Parameters: a, b
** Pre-Conditions: none
** Post-Conditions: random operation is performed on two values
*********************************************************************/
function decide_oper(a, b){
    // creates a number from 0-2
    decider = Math.round(Math.random() * 2);

    // either adds, subtracts, or multiplies based on decider
    if (decider == 0){
        return a + b;
    }
    if (decider == 1){
        return a - b;
    }
    if (decider == 2){
        return a * b;
    }
}

/*********************************************************************
** Function:checker_clicked
** Description: performs operations when number button is clicked
** Parameters: button
** Pre-Conditions: button is clicked
** Post-Conditions: appropriate action is then taken for the button
*********************************************************************/
function checker_clicked(button){
    // button exits if wrong turn or button has already been pressed
    if (turn == 1 || button.innerHTML == "_" || button.classList.contains("clickedCheck")){
        return;
    }
    // if it is the correct turn
    if (turn == 0 || turn == 2){
        // changes styling of clicked button
        if (turn == 0){
            button.classList.remove("checker"); 
            button.classList.add("clickedCheck"); 
        }
        // sets the input to the value of the number
        inputs[turn] = button.innerHTML;
        turn = turn + 1;    // increments turn
        // updates the play_message
        document.getElementById("play_message").innerHTML = "select an operator";
        
    }
    // if it is the last turn, write the operation to the workspace
    if (turn == 3){
        // if it is the first line
        if (work_line == 0){
            work_line = work_line + 1;  // increments the line
            // writes the equation 
            document.getElementById("l1").innerHTML = inputs[0].toString() + " " + encode(inputs[1]) + " " + inputs[2].toString() + " = " + calculate();
            // sets the button's value to the new value
            button.innerHTML = calculate().toString()
            // resets turn and inputs back to starting values
            turn = 0;
            inputs = [0,0,0]
            // updates play_message
            document.getElementById("play_message").innerHTML = "select a number";
        
        // if it is the second line
        } else if (work_line == 1){
            work_line = work_line + 1;  // increments the line
            // writes the equation 
            document.getElementById("l2").innerHTML = inputs[0].toString() + " " + encode(inputs[1]) + " " + inputs[2].toString() + " = " + calculate();
            // sets the button's value to the new value
            button.innerHTML = calculate().toString()
            // resets turn and inputs back to starting values
            turn = 0;
            inputs = [0,0,0]
            // updates play_message
            document.getElementById("play_message").innerHTML = "select a number";
        // if it is the last line
        } else{
            turn = -1;  // sets turn to -1 to disable all of the buttons except new game
            // writes the equation 
            document.getElementById("l3").innerHTML = inputs[0].toString() + " " + encode(inputs[1]) + " " + inputs[2].toString() + " = " + calculate();
            // sets the button's value to the new value
            button.innerHTML = calculate().toString();
            // if the user got the correct value (win)
            if (calculate() == goal_value){
                // update player message and the scoreboard
                document.getElementById("play_message").innerHTML = "You Win";
                scoreboard[0] += 1;
                document.getElementById("score").innerHTML = "Wins : " + scoreboard[0] + "    Loss : " + scoreboard[1];
            // if the user lost
            } else {
                // update player message and the scoreboard
                document.getElementById("play_message").innerHTML = "Better Luck Next time";
                scoreboard[1] += 1;
                document.getElementById("score").innerHTML = "Wins : " + scoreboard[0] + "    Loss : " + scoreboard[1];
            }
        }
        // sets all buttons to normal or in a "finished" state
        if (document.getElementById("num1").classList.contains("clickedCheck") == true){
            document.getElementById("num1").classList.remove("clickedCheck"); 
            document.getElementById("num1").classList.add("finishedCheck"); 
            document.getElementById("num1").innerHTML = "_";
        }
        if (document.getElementById("num2").classList.contains("clickedCheck") == true){
            document.getElementById("num2").classList.remove("clickedCheck"); 
            document.getElementById("num2").classList.add("finishedCheck"); 
            document.getElementById("num2").innerHTML = "_";
        }
        if (document.getElementById("num3").classList.contains("clickedCheck") == true){
            document.getElementById("num3").classList.remove("clickedCheck"); 
            document.getElementById("num3").classList.add("finishedCheck"); 
            document.getElementById("num3").innerHTML = "_";
        }
        if (document.getElementById("num4").classList.contains("clickedCheck") == true){
            document.getElementById("num4").classList.remove("clickedCheck"); 
            document.getElementById("num4").classList.add("finishedCheck"); 
            document.getElementById("num4").innerHTML = "_";
        }

        // sets all operation buttons back to normal
        if (document.getElementById("oper1").classList.contains("clickedOper") == true){
            document.getElementById("oper1").classList.remove("clickedOper"); 
            document.getElementById("oper1").classList.add("oper"); 
        }
        if (document.getElementById("oper2").classList.contains("clickedOper") == true){
            document.getElementById("oper2").classList.remove("clickedOper"); 
            document.getElementById("oper2").classList.add("oper"); 
        }
        if (document.getElementById("oper3").classList.contains("clickedOper") == true){
            document.getElementById("oper3").classList.remove("clickedOper"); 
            document.getElementById("oper3").classList.add("oper"); 
        }

    }
}

/*********************************************************************
** Function: oper_clicked
** Description: performs operations when operation is clicked
** Parameters: button
** Pre-Conditions: operation button is clicked
** Post-Conditions: respective action is taken
*********************************************************************/
function oper_clicked(button){
    // does nothing if wrong turn
    if (turn != 1){
        return;
    } else{
        // sets which operation was used
        inputs[turn] = encode(button.innerHTML);
        turn = turn + 1;    // increments the turn
        // updates the player message
        document.getElementById("play_message").innerHTML = "select a number";
        // changes the shade of the button
        button.classList.remove("oper"); 
        button.classList.add("clickedOper"); 
    }
}

/*********************************************************************
** Function: encode
** Description: converts operation to int and vice versa
** Parameters: a
** Pre-Conditions: none
** Post-Conditions: value is incoded
*********************************************************************/
function encode(a){
    // returns a value depending on a. translates number or 
    // the operation to either a string or a number
    if (a == "+"){
        return 0;
    }
    if (a == "-"){
        return 1;
    }
    if (a == "*"){
        return 2;
    }
    if (a == 0){
        return "+";
    }
    if (a == 1){
        return "-";
    }
    if (a == 2){
        return "*";
    }
}

/*********************************************************************
** Function: calculate
** Description: performs operation on inputs[0] and inputs[2] depending on inputs[1]
** Parameters: none
** Pre-Conditions: input array is filled out
** Post-Conditions: operation on two user inputs is completed
*********************************************************************/
function calculate(){
    // depending on the operation used, performs different operation
    // on the first and second number inputted by the user
    if (inputs[1] == 0){
        return parseInt(inputs[0]) + parseInt(inputs[2]);
    }
    if (inputs[1] == 1){
        return parseInt(inputs[0]) - parseInt(inputs[2]);
    }
    if (inputs[1] == 2){
        return parseInt(inputs[0]) * parseInt(inputs[2]);
    }
}