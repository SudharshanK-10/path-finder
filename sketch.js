var rows = 5;
var cols = rows;
var sx=0;
var sy=0;
var ex=rows-1;
var ey=cols-1;
var whichone = -1;
var lock = 0;

var grid;
var openset = [];
var closedset = [];
var start;
var end;
var w,h;
var path = [];

function removeFromArray(arr,elt){
     for(var i=arr.length-1;i>=0;i--){
          if(arr[i]==elt){
               arr.splice(i,1);
          }
     }
}

function mouseDragged() {
     var wallchecked = select("#walls").checked();
     var opti,optj;
     //get the mouse pointer position
     opti = 400 - int(mouseX);
     optj = 400 - int(mouseY);

     //scale it down to the grid size
     opti = int(opti / w )%rows;
     optj = int(optj / w )%rows;
     opti = rows-1-opti;
     optj = rows-1-optj;

     if(wallchecked){
          if(mouseX > 400 || mouseY > 400 || mouseX < 0 || mouseY < 0) {
               return;
          }
          grid[opti][optj].wall = 1;
          grid[opti][optj].show(color(0,0,0));
          return;
     }
     else {
          if(mouseX > 400 || mouseY > 400 || mouseX < 0 || mouseY < 0) {
               return;
          }
          grid[opti][optj].wall = 0;
          grid[opti][optj].show(color(255));
          return;
     }
}

function mousePressed(){
     var wallchecked = select("#walls").checked();
     var startchecked = select("#start").checked();
     var endchecked = select("#end").checked();

     //calucating the grid position
     //console.log(w);
     //console.log(mouseX);
     //console.log(mouseY);
     var opti,optj;
     opti = 400 - int(mouseX);
     optj = 400 - int(mouseY);
     //console.log(opti);
     //console.log(optj);
     opti = int(opti / w )%rows;
     optj = int(optj / w )%rows;
     //console.log(opti);
     //console.log(optj);
     opti = rows-1-opti;
     optj = rows-1-optj;

     //console.log(wallchecked);
     if(wallchecked){
          if(mouseX > 400 || mouseY > 400 || mouseX < 0 || mouseY < 0) {
               return;
          }
          removeFromArray(openset,grid[opti][optj]);
          sx = opti+1;
          sy = optj;
          start = grid[sx][sy];
          grid[opti][optj].wall = 1;
          grid[opti][optj].show(color(0,0,0));
          return;
     }
     else if(startchecked){
          if(mouseX > 400 || mouseY > 400 || mouseX < 0 || mouseY < 0) {
               return;
          }
          removeFromArray(openset,grid[sx][sy]);
          grid[sx][sy].show(color(255));
          sx = opti;
          sy = optj;
          start = grid[sx][sy];
          console.log(sx,sy);
          grid[sx][sy].show(color(105,105,105));
          openset.push(grid[sx][sy]);
          return;
     }
     else if(endchecked){
          if(mouseX > 400 || mouseY > 400 || mouseX < 0 || mouseY < 0) {
               return;
          }
          grid[ex][ey].show(color(255));
          ex = opti;
          ey = optj;
          end = grid[ex][ey];
          grid[ex][ey].show(color(105,105,105));
          return;
     }
     else {
          if(mouseX > 400 || mouseY > 400 || mouseX < 0 || mouseY < 0) {
               return;
          }
          grid[opti][optj].wall = 0;
          grid[opti][optj].show(color(255));
          return;
     }
}

function heuristic(a,b){
     //when heuristic is 0, that's djikstra
     //return 0;
     //euclidean
     //var d = dist(a.i,a.j,b.i,b.j);
     var d = abs(a.i-b.i)+abs(a.j-b.j);
     return d*whichone;
}

//f(n) = g(n) + h(n)
function Spot(i,j){
     this.i = i;
     this.j = j;
     this.f = 0;
     this.g = 0;
     this.h = 0;
     this.neighbours = [];
     this.previous = undefined;
     this.wall = false;

     this.show = function(color){
          fill(color);
          if(this.wall){
               fill(0);
          }
          noStroke();
          rect(this.i*w,this.j*h,w-1,h-1);
     }

     this.addneighbours = function(grid){
          if(i<rows-1){
               this.neighbours.push(grid[i+1][j]);
          }
          if(i>0){
               this.neighbours.push(grid[i-1][j]);
          }
          if(j<cols-1){
               this.neighbours.push(grid[i][j+1]);
          }
          if(j>0) {
               this.neighbours.push(grid[i][j-1]);
          }
          if(i>0 && j>0){
               this.neighbours.push(grid[i-1][j-1]);
          }
          if(i>0 && j<cols-1){
               this.neighbours.push(grid[i-1][j+1]);
          }
          if(i<rows-1 && j<cols-1){
               this.neighbours.push(grid[i+1][j+1]);
          }
          if(i<rows-1 && j>0){
               this.neighbours.push(grid[i+1][j-1]);
          }
     }
}

function run(){
     var chosen = select("#algo").value();
     //console.log(chosen);
     if(chosen==="djikstra"){
          whichone = 0;
     }
     else if(chosen==="a*"){
          whichone = 1;
     }
     else {
          alert("Choose an Algorithm!");
     }
     if(whichone!=-1){
          lock=0;
     }
}

function dup_setup(){
     //setting up the environment
     var canvas = createCanvas(400,400);
     canvas.parent('canvasForHTML');

     grid = new Array(rows);
     cols = rows;
     openset = [];
     closedset = [];
     path = [];
     sx = 0;
     sy = 0;
     ex = rows-1;
     ey = rows-1;

     //console.log(width);
     //console.log(height);
     w = width/cols;
     h = height/rows;
     [rows,cols] = [cols,rows];

     //making a 2d array/grid which are basically the nodes
     for(var i=0;i<rows;i++){
          grid[i] = new Array(cols);
     }

     for(var i=0;i<rows;i++){
          for(var j=0;j<cols;j++){
               grid[i][j] = new Spot(i,j);
          }
     }

     for(var i=0;i<rows;i++){
          for(var j=0;j<cols;j++){
               grid[i][j].addneighbours(grid);
          }
     }

     [sx,sy] = [sy,sx];
     [ex,ey] = [ey,ex];

     //console.log(sx);
     //console.log(sy);
     start = grid[sx][sy];
     //console.log(ex);
     //console.log(ey);
     end = grid[ex][ey];

     //end = grid[3][cols-1];
     openset.push(start);

     background(0);
     for(var i=0;i<rows;i++){
          for(var j=0;j<cols;j++){
               grid[i][j].show(color(255));
          }
     }
     lock = 1;
     return;
}
function setup(){
     //setting up the environment
     var canvas = createCanvas(400,400);
     canvas.parent('canvasForHTML');

     grid = new Array(rows);
     cols = rows;
     openset = [];
     closedset = [];
     path = [];
     sx = 0;
     sy = 0;
     ex = rows-1;
     ey = rows-1;

     //console.log(width);
     //console.log(height);
     w = width/cols;
     h = height/rows;
     [rows,cols] = [cols,rows];

     //making a 2d array/grid which are basically the nodes
     for(var i=0;i<rows;i++){
          grid[i] = new Array(cols);
     }

     for(var i=0;i<rows;i++){
          for(var j=0;j<cols;j++){
               grid[i][j] = new Spot(i,j);
          }
     }

     for(var i=0;i<rows;i++){
          for(var j=0;j<cols;j++){
               grid[i][j].addneighbours(grid);
          }
     }

     [sx,sy] = [sy,sx];
     [ex,ey] = [ey,ex];
     //console.log(sx);
     //console.log(sy);
     start = grid[sx][sy];
     //console.log(ex);
     //console.log(ey);
     end = grid[ex][ey];

     //end = grid[3][cols-1];
     openset.push(start);

     background(0);
     for(var i=0;i<rows;i++){
          for(var j=0;j<cols;j++){
               grid[i][j].show(color(255));
          }
     }
     lock = 1;
}

function draw(){
     var new_rows = int(select("#slide").value());
     //console.log(new_rows);
     if(rows != new_rows){
          rows = new_rows;
          //console.log(rows);
          dup_setup();
     }
     if(lock){
          return;
     }

     background(0);

     for(var i=0;i<rows;i++){
          for(var j=0;j<cols;j++){
               grid[i][j].show(color(255));
          }
     }

     for(var i=0;i<closedset.length;i++){
          closedset[i].show(color(255,0,0));
     }

     for(var i=0;i<openset.length;i++){
          openset[i].show(color(0,255,0));
     }

     for(var i=0;i<path.length;i++){
          path[i].show(color(0,0,255));
     }

     if(openset.length > 0){
          //look for possibilities
          //current node is the node with lowest f(n)
          var winner = 0;
          for(var i=0;i<openset.length;i++){
               if(openset[i].f < openset[winner].f){
                    winner=i;
               }
          }
          var current = openset[winner];
          if(current===end){
               console.log("Finished!");
               lock = 1;
          }

          removeFromArray(openset,current);
          closedset.push(current);

          //look for neighbours
          var neighbours = current.neighbours;
          for(var i=0;i<neighbours.length;i++){
               var neighbour = neighbours[i];
               if(!closedset.includes(neighbour) && !neighbour.wall){
                    var tempg = current.g + 1;
                    var foundpath = 0;
                    //look for better g
                    if(openset.includes(neighbour)){
                         if(tempg < neighbour.g){
                              neighbour.g = tempg;
                              foundpath = 1;
                         }
                    }
                    else {
                         neighbour.g = tempg;
                         foundpath = 1;
                         openset.push(neighbour);
                    }
                    if(foundpath) {
                         //figuring out the heuristics
                         neighbour.h = heuristic(neighbour,end);
                         //actual a* formula
                         neighbour.f = neighbour.g + neighbour.h;
                         neighbour.previous = current;
                    }
               }
          }
     }
     else {
          //cannot reach destination
          alert("No Solution!");
          noLoop();
          return;
     }



     //optimal path
     path = [];
     var temp = current;
     path.push(temp);
     while(temp.previous){
          path.push(temp.previous);
          temp=temp.previous;
     }

     for(var i=0;i<rows;i++){
          for(var j=0;j<cols;j++){
               grid[i][j].show(color(255));
          }
     }

     for(var i=0;i<closedset.length;i++){
          closedset[i].show(color(255,0,0));
     }

     for(var i=0;i<openset.length;i++){
          openset[i].show(color(0,255,0));
     }

     for(var i=0;i<path.length;i++){
          path[i].show(color(0,0,255));
     }
}
