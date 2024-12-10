//SHOOTERS
//Adrian Martin
var gshooters=[];
var nshooters=10;
var randx=0;
var randy=0;
var button1;
var t=-180;
var dent=0.01;


function setup() {
  createCanvas(1200, 800);
  button1 = createButton('random');
  button1.position(19, 19);
  button1.mousePressed(randomMove);



  for(i=1;i<=nshooters;i++){
      randx=random(width/2-200, width/2+200);
      randy=random(height/2-200, height/2+200);
      gshooters[i]=new Shooter(randx, randy, 7,2, i, nshooters, 30+i/10, 0.053);
  }
}

function draw() {
  angleMode(DEGREES);
  background(51);
  textSize(15);
  text('Press mouse button to reorganize objects', 90, 35);
  fill(0, 102, 153);

  for(i=1; i<=nshooters;i++){
    gshooters[i].update();
    gshooters[i].display();
  }
}

function mouseClicked() {
  for(i=1;i<=nshooters;i++){
    gshooters[i].reorganize();
  }
}

function randomMove() {
  for(i=1;i<=nshooters;i++){
    randx=random(width/2-200, width/2+200);
    randy=random(height/2-200, height/2+200);
    gshooters[i]=new Shooter(randx, randy, 7,2, i, nshooters, 30+i/10, 0.053);
  }
}

//Parameters
//xpos: x coordinate for the initial position of the shooter
//ypos: y coordinate for the initial position of the shooter
//maximo: max number of elements (of the animation that the shooters does)
//minimo: min number of elements
//id: identification of the Shooter
//numShooters: number of Shooters generated
//radio of the Shooter (distance to the centerz<)
//speed of animation
function Shooter(xpos, ypos, maximo, minimo, id, numShooters, radio, speed){
  //variables
  this.elementos=1;
  this.radio=radio;
  this.radio_min=4;
  this.maximo=maximo;
  this.minimo=minimo;
  this.subida=0;
  this.paso=speed;
  this.id=id;
  this.numShooters=numShooters;
  this.xpos=xpos;
  this.ypos=ypos;
  this.spin=-1;
  //vectors for the acceleration, velocity and position
  this.pos=createVector(this.xpos, this.ypos);
  this.vel=createVector(0, 0);
  this.acc=p5.Vector.fromAngle(random(TWO_PI));

  if(t>=180)
    t=-180;
  else {
    t+=dent;
  }

  //update function
  this.update=function(){
    //the mouse is a vector that gives a position to each shooter around the mouse arrow (in a circle)
    this.mouse=createVector(mouseX+Math.cos(this.id*TWO_PI/this.numShooters)*170,mouseY+Math.sin(this.id*TWO_PI/this.numShooters)*170);
    //this part follows the ideas given in the Random Walker lesson
    this.acc=p5.Vector.sub(this.mouse, this.pos);
    var modulo=this.acc.mag();
    this.acc.setMag(0.01+modulo);
    this.vel.add(this.acc);
    this.vel.setMag(0.1+modulo/100);
    this.pos.add(this.vel);

    //direction control. "subida=1 means one direction. subida=-1 means the other".
    if(this.elementos>this.maximo){
      this.subida=0;
      this.spin=-1
    }
    if(this.elementos<this.minimo){
      this.subida=1;
      this.spin=1;
    }

    if(this.subida){
      this.elementos+=this.paso;
    }
    else
      this.elementos-=this.paso;
}

  this.display=function(){

    //INDIVIDUAL ANIMATION. The animation rotates a point around a center unfolding
    //a node structure that folds and unfolds smoothly
    fill(255);
    //"giro" controls the direction of circular movement (counterclock, or wiseclock). It can take values 1 or -1
    this.giro=1;
    //"entero" takes the whole part of the decimal number "elementos" which is a variable that
    //controls the advance of the animation
    this.entero=Math.floor(this.elementos);

  for(var i=0; i<=this.elementos;i++){
      //if(this.subida) this.radio+=0.005*this.radio;
      //else this.radio-=0.005*this.radio;
      push();
      fill(255);
      stroke(255);
      strokeWeight(1);
      translate(this.pos.x, this.pos.y);
      //cuando el elemento corresponde a la parte decimal mantenemos el valor de giro
      //when the number of vertex is not an integer the new vertex has to be create as
      //a part angle
      if(i==this.entero) this.giro=Math.abs(this.elementos-Math.floor(this.elementos));
      rotate(this.spin*i*360/this.elementos);
      ellipse(this.radio, 0, this.radio_min, this.radio_min);
      line(0, 0, this.radio, 0);
      line(this.radio, 0, this.radio*Math.cos(this.spin*this.giro*TWO_PI/this.elementos),   this.radio*Math.sin(this.spin*this.giro*TWO_PI/this.elementos));
      pop();
    }
  }

  this.reorganize=function(){
    if(this.id==this.numShooters)
      newid=5;
    else
      newid=this.id+5;
    this.id=newid;
  }

}
