
// function fro making a map list from a csv file
function createMap(link){

  // Reading magic (maybe van mijn oudere project gestolen).
  // This stores the data from the csv file in a long string. 
  var f = new XMLHttpRequest();
  var data = "error";
  while(data == "error"){
    f.open("GET", link, false);
    f.onreadystatechange = function ()
    {
        if(f.readyState === 4)
        {
            if(f.status === 200 || f.status == 0)
            {
                data = f.responseText;
            }
        }
    }
    f.send(null);
  }
  
  
  // Split the string into rows (each row ends with "], ").
  var tempMap = data.split("], ");
  
  // Split each row into the individual data-pieces (they are separated with ", ").
  for(let i = 0; i < tempMap.length; i++){
    tempMap[i] = tempMap[i].split(", ");
  }
  
  // Delete all occurences of "[" and "]" from the data. These are remnants of how it is stored.
  // This is repeated twice for good measures.
  for(let i = 0; i < 2; i++){
    for(let y = 0; y < tempMap.length; y++){
      for(let x = 0; x < tempMap.length; x++){
        tempMap[y][x] = tempMap[y][x].replace("[", "");
        tempMap[y][x] = tempMap[y][x].replace("]", "");
      }
    }
  }

  return tempMap
}

var heatMap = createMap("heatmap.csv");

// end of map formatting


// set a starting point
var startX = 10;
var startY = 15;

var goalX = 3;
var goalY = 4;

// list of nodes (pixels) the program is looking at 
var openRouteNodes = [];
var closedRouteNodes = [];
var successorNodeList = [];

var weight;
var successorCurrentCost;


function routeAlgorithm(){
  // initialise the variables
  openRouteNodes = [[startX, startY]]
  closedRouteNodes = []
  successorNodeList = []
  
  weight = 1;
  successorCurrentCost = 0;
  
  // main program loop
  for(let i = 0; i < 20; i++){ //while(openRouteNodes != []){


    var nodeCurrent = [];
    var nodeCurrentIndex = 0;
    //searches for the node in the open nodes with the lowest cost and sets that as the selected node
    var cost = 0;
    for(let n = 0; n < openRouteNodes.length; n++){
  
      if(f(openRouteNodes[n][0], openRouteNodes[n][1]) < cost){
        nodeCurrentIndex = n;
      }
      cost = f(openRouteNodes[n][0], openRouteNodes[n][1]);
    }

    
    // select the node with that index
    nodeCurrent = openRouteNodes[nodeCurrentIndex]

    // if the found node is the goal, end the program
    if(nodeCurrent[0] == goalX && nodeCurrent[1] == goalY){
      break
    }


    // if the found node is the goal, end the program
    if(nodeCurrent == [goalX, goalY]){
      break
    }

    // selects all nodes around a node using the "eenheidscirkel" and puts them in the list with next nodes
    var amountPi = 0;
    
    while (amountPi < 2){
    
      let thisX = Math.round(Math.cos(amountPi * Math.PI));
      let thisY = Math.round(Math.sin(amountPi * Math.PI));
      successorNodeList.push([nodeCurrent[0]+thisX, nodeCurrent[1]+thisY]);
  
      amountPi += 0.25;
    }

    
    // for every next node
    for(let i = 0; i < successorNodeList.length; i++){

      // calculate the cost using the cost to get from the start to the current node (function g()) + the cost to get from the current node to the next one (function w())
      successorCurrentCost = g(nodeCurrent[0], nodeCurrent[1]) + w(nodeCurrent[0], nodeCurrent[1], successorNodeList[i][0], successorNodeList[i][1])

      // if the next node is already in the open nodes
      if(openRouteNodes.includes(successorNodeList[i])){

        // if the cost to get to the next node is smaller than (the cost from the start to the current node) + (the cost from the current to the next node), continue.
        if( g(successorNodeList[i]) <= successorCurrentCost){
          continue
        }
      }
      // if the next node is not in the open nodes but in the closed nodes.
      else if(closedRouteNodes.includes(successorNodeList[i])){

        // if the cost to get to the next node is smaller than (the cost from the start to the current node) + (the cost from the current to the next node), continue.
        if( g(successorNodeList[i]) <= successorCurrentCost){
          continue
        }
        //else remove the node from the open nodes and push it into the closed nodes
        else{
          openRouteNodes.splice(openRouteNodes.indexOf(successorNodeList[i]));
          closedRouteNodes.push(successorNodeList[i]);
        }
      }
      // if the node is nor in the open, nor in the closed nodes, push it into the open nodes.
      else{
        openRouteNodes.push(successorNodeList[i]);
      }
    }
    closedRouteNodes.push(nodeCurrent);
  }

}




function f(nodeX, nodeY){
  
  return g(nodeX, nodeY) + h(nodeX, nodeY)
  
}



function g(nodeX, nodeY){

  let gValue = 0;

  for (let i = 1; i <= openRouteNodes.length; i++){

    if(i == openRouteNodes.length){
      gValue += Math.sqrt(Math.pow(nodeX - openRouteNodes[i-1][0], 2) + Math.pow(nodeY - openRouteNodes[i-1][1], 2));
    }
      
    else{
      gValue += Math.sqrt(Math.pow(openRouteNodes[i][0] - openRouteNodes[i-1][0], 2) + Math.pow(openRouteNodes[i][1] - openRouteNodes[i-1][1], 2));
    }
  }
  
  return gValue
}


function w(node1X, node1Y, node2X, node2Y){
  
  let wValue = Math.sqrt(Math.pow(node1X - node2X, 2) + Math.pow(node1Y - node2Y, 2));
  
  return wValue
}


function h(nodeX, nodeY){

  let hValue = Math.sqrt(Math.pow(nodeX - goalX, 2) + Math.pow(nodeY - goalY, 2));
  
  return hValue
  
}
