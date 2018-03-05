var sin     = Math.sin;
var cos     = Math.cos;
var bgColor = "#F1F1F1";

/*
todo:
[]  TODO: zdjecie
[]  TODO: odwrocone osie - Y rosnie do gory, X w prawo
[X] TODO: backward
[]  TODO: initial value should be in the middle of a screen
[]  TODO: ta sama wielkosc canvasa na X jak i na Y (nie mozna zrobic kwadratu)
[]  TODO: clear doesn't really deletes all objects on canvas (they are restored when new command is given)
[]  TODO: movement a rysowanie to różne rzeczy!!!
[]  TODO: double drawing
[]  TODO: right 15 on start

krzywa kocha

forward x
*/

$(document).ready(function() {

  var INITIAL_X_VALUE = 500;
  var INITIAL_Y_VALUE = 500;

  var currentXPosition = INITIAL_X_VALUE;
  var currentYPosition = INITIAL_Y_VALUE;
  var currentAngle     = 0.0;

  var commandCounter       = 0;
  var sendButton           = document.getElementById("send-button");
  var inputField           = document.getElementById("input-field");
  var board                = document.getElementById("board");
  var context              = board.getContext("2d");
  var singleCommandsArray  = ["clear", "help", "start"];
  var doubleCommandsArray  = ["forward", "backward", "left", "right", "color", "background","square"];

  initialActions();

  function initialActions() {
    context.moveTo(INITIAL_X_VALUE, INITIAL_Y_VALUE);
    console.log(currentXPosition, currentYPosition);
    alert('moved to initial place');
  }

  $("#send-button").bind( "click", function(event) {
    performInputAction(inputField);
  });

  $('#input-field').keypress(function (event) {
    if (event.which == 13) {
      event.preventDefault();
      performInputAction(inputField);
    }
  });

  function performInputAction(inputField) {
    var input = inputField.value.toLowerCase();
    if (validateInput(input)) {
      var commandElements = filterArrayFromWhiteSpaces((input).split(" "));
      var command = commandElements[0];
      if (command === "color" || command === "background") { //the only command that requires string as a parameter is color (color "F1F1F1")
        var value = commandElements[1];
      } else {
        var value   = parseFloat(commandElements[1]);
      }
      addTextAndClearInput();
      keepCommandListScrolledOnNewInput();
      interpretCommand(command, value);
    }
  }

  function keepCommandListScrolledOnNewInput() {
    $('#commands-list').scrollTop($('#commands-list')[0].scrollHeight);
  }

  function addTextAndClearInput() {
    if (inputField.value !== "") {
      commandCounter++;
      $("#commands-list").append("<p> #" + commandCounter + ": "+ inputField.value +"</p>")
      inputField.value = ""
    }
  }

  function validateInput(input) {
    var inputParts = input.split(" ");
    inputParts = filterArrayFromWhiteSpaces(inputParts);
    var command = inputParts[0];
    var valueRegex;

    if (command !== "color" && command !== "background") {
      valueRegex = /^[0-9,.]*$/;
    } else {
      valueRegex = /#[0-9a-f]{6}|#[0-9a-f]{3}/gi;
    }
    var isValidValue = valueRegex.test(inputParts[1]);

    if (singleCommandsArray.includes(command) && inputParts.length == 1) {
      return true;
    } else if (doubleCommandsArray.includes(command) && inputParts.length == 2 && isValidValue) {
      return true;
    } else {
      return false;
    }
  }

  function interpretCommand(command, value) {
    oldX = currentXPosition;
    oldY = currentYPosition;

    switch(command) {
      case "forward":
          move(value);
      break;

      case "backward":
        move(-value);
      break;

      case "right":
        computeAngle(value);
      break;

      case "left":
        computeAngle(-value)
      break;

      case "clear":
        clearScreen(context, bgColor);
      break;

      case "help":
        showHelp();
      break;

      case "start":
        start();
      break;

      case "color":
        changeStrokeColor(value);
      break;

      case "background":
        changeBackgroundColor(value);
      break;

      case "square":
        createSquare(value, 0);
      break;
    }
  }

  function move(value) {

    if (currentAngle === 0) {

      currentXPosition = currentXPosition;
      currentYPosition = currentYPosition - value;

    } else if (currentAngle > 0 && currentAngle < 90) {
      console.log("(0;90)");

      currentXPosition += value * cos(currentAngle);
      currentYPosition -= value * sin(currentAngle);

    } else if (currentAngle === 90) {

      currentXPosition += value;
      // currentYPosition = currentYPosition;
      // context.lineTo(currentXPosition, currentYPosition);

    } else if (currentAngle > 90 && currentAngle < 180) {
        //TODO: WRONG
        currentXPosition += value * cos(currentAngle);
        currentYPosition += value * sin(currentAngle);

    } else if (currentAngle === 180) {

      currentYPosition += value;

    } else if (currentAngle > 180 && currentAngle < 270) {


    } else if (currentAngle === 270) {

      currentXPosition -= value ;

    } else if (currentAngle > 270 && currentAngle < 360) {

    }


    // var image = new Image();
    // image.onload = function(){
    //   context.drawImage(image, currentXPosition - 20,currentYPosition);
    // };
    // image.src = "wrr.png";

    console.log("("+ oldX + "," + oldY + ") => (" + currentXPosition + "," + currentYPosition + ")");
    context.lineTo(currentXPosition, currentYPosition);
    context.stroke();
  }

  function changeStrokeColor(colorHexValue) {
    context.strokeStyle = colorHexValue;
  }

  function changeBackgroundColor(colorHexValue) {
    bgColor = colorHexValue;
    context.fillStyle = colorHexValue;
    context.fillRect(0,0, context.canvas.width, context.canvas.height );
  }

  function start() {
    context.moveTo(currentXPosition, currentYPosition);
  }

  function showHelp() {
    var guide = "1. To move forward use 'forward [value]' <br>2. To move backward use 'backward [value]'<br>3. To rotate clockwise use 'right [value]', counter clockwise - 'left [value]'."
    $("#commands-list").append("<p>" + guide + "</p>")
  }

  function computeX(context, x) {
    return (x-rminx) / (rmaxx-rminx)*(context.canvas.width);
  }

  function computeY(context, y) {
    return context.canvas.height-(y-rminy)/(rmaxy-rminy)*(context.canvas.height);
  }

  function clearScreen(context, bgColorString) {
    context.globalCompositeOperation ="source-over";
    context.fillStyle = bgColorString;
    context.fillRect(0,0, context.canvas.width, context.canvas.height );
  }

  // here it will be passed as a -90 or 90 depending on a fact whether we use right or left
  function computeAngle(value) {
    naiveValue = currentAngle + value;
    if (naiveValue < 0) {
      newValue = 360 + naiveValue;
    } else {
      newValue = naiveValue % 360;
    }
    currentAngle =+ newValue;
    console.log(currentAngle);
  }

  function computeBoundsOverflow() {
    //TODO: behavior when canvas bounds are exceeded
  }

  function filterArrayFromWhiteSpaces(array) {
    var filteredArray = [];
    for (var i = 0; i < array.length; i++) {
      if (array[i] !== "") {
        filteredArray.push(array[i]);
      }
    }
    return filteredArray;
  }

  function createCircle(radius) {
    context.beginPath();
    context.arc(100,75,radius,0,2*Math.PI);
    context.stroke();
  }

  function createTriangle(value, colorHexValue) {
    // changeStrokeColor(colorHexValue)
    computeAngle(60);
    move(value);
    computeAngle(60);
    move(value);
    computeAngle(60);
    move(value);
  }

  function createSquare(value, colorHexValue) {
    // changeStrokeColor(colorHexValue)
    move(value);
    computeAngle(90);
    move(value);
    computeAngle(90);
    move(value);
    computeAngle(90);
    move(value);
  }

  function createRectangle() {
    move(value);
    computeAngle(90);
    move(value);
    computeAngle(90);
    move(value);
    computeAngle(90);
    move(value);
    computeAngle(90);
  }
});