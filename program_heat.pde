// File for displaying the heat map in a processing window

// Highest value in the heatmap.
int heatMax = 0;

int squareWidth;
int squareHeight;

// Runs once when the program starts.
void setup(){

  // Size of the screen area.
  size(375,375);

  // turns off borders
  noStroke();


  squareWidth = width / heatMap[0].length();
  squareHeight = height / heatMap.length();
  
  
  // Loop through every value to find the highest.
  for(int y = 0; y < heatMap.length(); y++){
    for(int x = 0; x < heatMap[y].length(); x++){
      
      // If the current value is higher than the last found highest value,
      // set new highest value.
      if(heatMap[y][x] > heatMax){
        heatMax = heatMap[y][x];
        
      }
    }
  }
  
}

// Runs every frame.
void draw(){
  // Set background color to black (refresh the screen every frame).
  background(0);
  
  // Calculate the width of the "pixels" of the heatmap.
  

  // Loop through every pixel in the heatmap.
  for(int y = 0; y < heatMap.length(); y++){
    for(int x = 0; x < heatMap[y].length(); x++){

      // Fill with the value of the heatmap interpolated to be between 0 and 255.
      fill(heatMap[y][x] * 255/heatMax);
      // Plot the square at the right position.
      rect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
    }
  }

  fill(0, 255, 0);
  rect(startX * squareWidth, startY * squareHeight, squareWidth, squareHeight);

  fill(255, 0, 0);
  rect(goalX * squareWidth, goalY * squareHeight, squareWidth, squareHeight);


  
  for(int i = 1; i < closedRouteNodes.length(); i++){
    fill(0, 0, 255);
    rect(closedRouteNodes[i][0] * squareWidth, closedRouteNodes[i][1] * squareHeight, squareWidth, squareHeight);
  }
  
}


void mouseClicked(){
  if(mouseButton == LEFT){
    startX = int(mouseX / squareWidth);
    startY = int(mouseY / squareHeight);
  }

  if(mouseButton == RIGHT){
    goalX = int(mouseX / squareWidth);
    goalY = int(mouseY / squareHeight);
  }
}