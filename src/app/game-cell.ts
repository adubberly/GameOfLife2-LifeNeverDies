import { LifecycleHooks } from "@angular/compiler/src/lifecycle_reflector";

export class Cell
{
  static width = 20;
  static height = 20;
  //Vars
  private xPos : number;
  private yPos : number;
  private spawnRate : number;
  private roundsSinceDeath : number;
  private roundsAlive      : number;
  public isAlive : boolean;
  private nextState : boolean;
  private context: CanvasRenderingContext2D;


  /*************************************************************
  *                    Cell Class Constructor
  * Purpose: Takes in and sets x, y position information for
  * where the cell belongs on the grid. Takes in spawn rate.
  * Takes in context (Canvas element)
  *
  * Determines whether a cell randomly starts off alive. Sets
  * inital default variables.
  **************************************************************/
  constructor (x, y, spawnRate, context) {
    //Set x and y pos
    this.xPos = x;
    this.yPos = y;

    //Set canvas context
    this.context = context;

    //Set default 0 for rounds alive and dead
    this.roundsSinceDeath = 6;
    this.roundsAlive      = 0;

    //Set spawnRate and determine isAlive
    this.spawnRate = spawnRate;
    this.isAlive = Math.random() > this.spawnRate;
  }


  /*************************************************************
  *                     setCellState
  * Purpose: Takes in the new cell state value and update the
  * cell state.
  *
  * Keeps track of cell life metadata (rounds since death/life)
  **************************************************************/
  setCellState() {
    //Current state
    let currentLifeState = this.isAlive;
    //Next state
    let nextLifeState = this.nextState;

    //If currently already alive
    if(currentLifeState){

      if(nextLifeState){
        //Cell remains alive
        this.roundsAlive++;
      } else {
        //Cell dies
        this.isAlive = false;
        this.roundsAlive = 0;
        this.roundsSinceDeath++;
      }
    } else { //If cell is currently dead

      if(nextLifeState)
      {
        //Cell comes to life
        this.isAlive = true;
        this.roundsAlive++;
        this.roundsSinceDeath = 0;
      }else {
        //Cell remains dead
        this.roundsSinceDeath++;
      }
    }
  }


  /*************************************************************
  *                 setCellClickedCellState
  * Purpose: Instantly changes and draws a cell to the opposite
  * of it's current state. This happens when the user clicks on
  * the cell area, toggling it's life/death state
  *
  **************************************************************/
  setCellClickedCellState(lifeColor: string, deathColor: string) {
    this.roundsAlive      = 0;
    this.roundsSinceDeath = 0;
    //Set cell to new clicked state
    if(this.isAlive){
      //Kill cell
      this.isAlive = false;
    }else {
      this.isAlive = true;
    }

    //Draw cell
    this.draw(lifeColor, deathColor);
  }


  /*************************************************************
  *                     clearCellState
  * Purpose: Completely clears the cell, resetting all values
  * and setting the isAlive state to false
  *
  **************************************************************/
  clearCellState(){
    //Set default 0 for rounds alive and dead
    this.roundsSinceDeath = 5;
    this.roundsAlive      = 0;

    this.isAlive = false;


  }


  /*************************************************************
  *                     getCellState
  * Purpose: Returns the current state of the cell
  *
  **************************************************************/
  getCellState() {
    return this.isAlive;
  }


  /*************************************************************
  *                     setNextState
  * Purpose: Sets the nextState variable to true or false
  *
  **************************************************************/
  setNextState(state:boolean){
    this.nextState = state;
  }


  /*************************************************************
  *                         draw
  * Purpose: Draws the cell to the canvas(context), in respect
  * to it's state.
  *
  **************************************************************/
  draw(lifeColor: string, deathColor: string) {
    // lifeColor  = '#6d0991';
    // deathColor = '#ff05e6';
    // let testColor  = '#ff0000';

    let radius = Cell.width / 2;


    //Set fillstyle
    this.context.fillStyle = this.isAlive?lifeColor:deathColor;

    //X,Y coords for center of a cell, used for circle drawing coords
    let circleX = (this.xPos * Cell.width) + (Cell.width / 2);
    let circleY = (this.yPos * Cell.height)  + (Cell.height / 2);


    //fillRect(x, y, width, height);
    //this.context.fillRect(this.xPos * Cell.width, this.yPos * Cell.height, Cell.width, Cell.height);

    //arc(x, y, radius, startAngle, endAngle [, counterclockwise])
    if(this.isAlive){
      //Draw cell background
      this.context.fillStyle = deathColor;
      this.context.fillRect(this.xPos * Cell.width, this.yPos * Cell.height, Cell.width, Cell.height);
      this.context.fillStyle = lifeColor;

      this.context.globalAlpha = 1;

      //Draw Circle
      this.context.beginPath();
      this.context.arc(circleX, circleY, radius, 0, 2 * Math.PI, false);
      this.context.fill();

      this.context.globalAlpha = 1;

    } else{
      //fillRect(x, y, width, height);
      this.context.fillRect(this.xPos * Cell.width, this.yPos * Cell.height, Cell.width, Cell.height);

      //If recenty dead, draw death animation
      if(this.roundsSinceDeath <= 5 && this.roundsSinceDeath > 0) {
        this.context.fillStyle = lifeColor;

        let newRadius = radius / this.roundsSinceDeath;

        if(this.roundsSinceDeath == 1){
          newRadius = newRadius / 1.5;
        }

        //Draw Circle
        this.context.beginPath();
        this.context.arc(circleX, circleY, newRadius, 0, 2 * Math.PI, false);
        this.context.fill();
      }
    }

  }
}
