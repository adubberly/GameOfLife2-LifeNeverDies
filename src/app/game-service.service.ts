import { Injectable } from '@angular/core';
import { Cell }       from './game-cell';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public numberOfRows: number;
  public numberOfCols: number;
  public cells: Cell[];
  public spawnRate: number;
  public context;

  constructor() {
    //Set rows, cols, spawnRate
    this.numberOfRows = 40;
    this.numberOfCols = 40;
    this.spawnRate = 0.5;
   }


   createBoard(iContext, newSpawnRate) {
    //Get Context - Temp Solution
    this.context = iContext;

    //Set new Spawn rate
    this.spawnRate = newSpawnRate;

    //Destroy previous board
    this.cells = [];

    //Create new board
    for(let y = 0; y < this.numberOfRows; y++){
      for(let x = 0; x < this.numberOfCols; x++){
        this.cells.push(new Cell(x, y, this.spawnRate, this.context));
      }
    }
  }

  updateGameBoard() {
    //Double for loop through all cells on board
    for(let x = 0; x < this.numberOfCols; x++) {
      for(let y = 0; y < this.numberOfRows; y++){

        //Get cell index
        let cellIndex = this.getIndex(x, y);

        //Count Neighbors
        let numberOfNeighbors = this.getNeighborCount(x, y);

        //Make decision on cell
        if (numberOfNeighbors == 2)
        {
          //Cell unchanged - Ping it with it's current state
          this.cells[cellIndex].setNextState(this.cells[cellIndex].getCellState());

        } else if (numberOfNeighbors == 3)
        {
          //Bring cell to life
          this.cells[cellIndex].setNextState(true);
        }  else if (numberOfNeighbors >= 4)
        {
          //Kill cell - overpopulation
          this.cells[cellIndex].setNextState(false);
        } else if (numberOfNeighbors < 2)
        {
          //Kill cell - underpopulation
          this.cells[cellIndex].setNextState(false);
        }
      }
    }//End double for loop

    //Update cell states
    for(let i = 0; i < this.cells.length; i++){
      this.cells[i].setCellState();
    }
  }

  getIndex(x, y) {
    //Grabs the index in the array, for each row down (y) multiply by total cols (x) then add current col pos (x)
    return x + (y * this.numberOfCols);
  }

  cellLife(x, y)
  {
    //Check for invalid x,y
    if (x < 0 || x >= this.numberOfCols || y < 0 || y >= this.numberOfRows){
      return 0;
    }

    return this.cells[this.getIndex(x, y)].getCellState()?1:0;
  }

  getNeighborCount(x, y) {
    //Create vars for edge cases
    var xLowEdge  = false;
    var xHighEdge = false;
    var yLowEdge  = false;
    var yHighEdge = false;

    //Check if x edge case
    if(x == 0) {
      xLowEdge  = true;
    }else if(x == (this.numberOfCols - 1)) {
      xHighEdge = true;
    }
    //Check if y edge case
    if(y == 0) {
      yLowEdge  = true;
    } else if(y == (this.numberOfRows - 1)) {
      yHighEdge = true;
    }

    let colIndex = this.numberOfCols;
    let rowIndex = this.numberOfRows;


    //Calculate for all cases

    // let neighborsAlive = this.cellLife(Math.abs((x-1) % colIndex), Math.abs((y-1) % rowIndex)) + this.cellLife(Math.abs((x-1) % colIndex), y)  //Top-Left & Left neighbor
    //                    + this.cellLife(Math.abs((x-1) % colIndex), (y+1) % rowIndex) + this.cellLife(x, (y+1) % rowIndex)  //Bottom-Left & Bottom neighbor
    //                    + this.cellLife((x+1) % colIndex, (y+1) % rowIndex) + this.cellLife((x+1) % colIndex, y)  //Bottom-Right & Right neighbor
    //                    + this.cellLife((x+1) % colIndex, Math.abs((y-1) % rowIndex)) + this.cellLife(x, Math.abs((y-1) % rowIndex)); //Top-Right & Top Neighbor

    // return neighborsAlive;


    //Calculate for no edge case
    if(!xLowEdge && !xHighEdge && !yLowEdge && !yHighEdge)
    {
      let neighborsAlive = this.cellLife(x-1, y-1) + this.cellLife(x-1, y)  //Top-Left & Left neighbor
                         + this.cellLife(x-1, y+1) + this.cellLife(x, y+1)  //Bottom-Left & Bottom neighbor
                         + this.cellLife(x+1, y+1) + this.cellLife(x+1, y)  //Bottom-Right & Right neighbor
                         + this.cellLife(x+1, y-1) + this.cellLife(x, y-1); //Top-Right & Top Neighbor

      return neighborsAlive;
    }

    //Calculate for top left corner --Done
    if(xLowEdge && yHighEdge) {
      let neighborsAlive = this.cellLife(this.numberOfCols - 1, y+1) + this.cellLife(this.numberOfCols - 1, y)  //Bottom-Left & Left neighbor
                         + this.cellLife(this.numberOfCols - 1, this.numberOfRows - 1) + this.cellLife(x, this.numberOfRows - 1)  //Top-Left & Top neighbor
                         + this.cellLife(x+1, this.numberOfRows - 1) + this.cellLife(x+1, y)  //Top-Right & Right neighbor
                         + this.cellLife(x+1, y+1) + this.cellLife(x, y+1); //Bottom-Right & Bottom Neighbor

      return neighborsAlive;
    }

    //Calculate for bottom left corner  --Done
    if(xLowEdge && yLowEdge) {
      let neighborsAlive = this.cellLife(this.numberOfCols - 1, 0) + this.cellLife(this.numberOfCols - 1, y)  //Bottom-Left & Left neighbor
                         + this.cellLife(this.numberOfCols - 1, y-1) + this.cellLife(x, y-1)  //Top-Left & Top neighbor
                         + this.cellLife(x+1, y-1) + this.cellLife(x+1, y)  //Top-Right & Right neighbor
                         + this.cellLife(x+1, 0) + this.cellLife(x, 0); //Bottom-Right & Bottom Neighbor
      return neighborsAlive;
    }

    //Calculate for top right corner -- Done
    if(xHighEdge && yHighEdge) {
      let neighborsAlive = this.cellLife(x-1, y+1) + this.cellLife(x-1, y)  //Bottom-Left & Left neighbor
                         + this.cellLife(x-1, this.numberOfRows - 1) + this.cellLife(x, this.numberOfRows - 1)  //Top-Left & Top neighbor
                         + this.cellLife(0, this.numberOfRows - 1) + this.cellLife(0, y)  //Top-Right & Right neighbor
                         + this.cellLife(0, y+1) + this.cellLife(x, y+1); //Bottom-Right & Bottom Neighbor
      return neighborsAlive;
    }

    //Calculate for bottom right corner -- Done
    if(xHighEdge && yLowEdge) {
      let neighborsAlive = this.cellLife(x-1, 0) + this.cellLife(x-1, y)  //Bottom-Left & Left neighbor
                         + this.cellLife(x-1, y-1) + this.cellLife(x, y-1)  //Top-Left & Top neighbor
                         + this.cellLife(0, y-1) + this.cellLife(0, y)  //Top-Right & Right neighbor
                         + this.cellLife(0, 0) + this.cellLife(x, 0); //Bottom-Right & Bottom Neighbor
      return neighborsAlive;
    }



    //Calculate for left side without yEdge cases -- Done
    if(xLowEdge && !yHighEdge && !yLowEdge) {
      let neighborsAlive = this.cellLife(this.numberOfCols - 1, y+1) + this.cellLife(this.numberOfCols - 1, y)  //Bottom-Left & Left neighbor
                         + this.cellLife(this.numberOfCols - 1, y-1) + this.cellLife(x, y-1)  //Top-Left & Top neighbor
                         + this.cellLife(x+1, y-1) + this.cellLife(x+1, y)  //Top-Right & Right neighbor
                         + this.cellLife(x+1, y+1) + this.cellLife(x, y+1); //Bottom-Right & Bottom Neighbor
      return neighborsAlive;
    }



    //Calculate for right side without yEdge cases -- Done
    if(xHighEdge && !yHighEdge && !yLowEdge) {
      let neighborsAlive = this.cellLife(x-1, y+1) + this.cellLife(x-1, y)  //Bottom-Left & Left neighbor
                         + this.cellLife(x-1, y-1) + this.cellLife(x, y-1)  //Top-Left & Top neighbor
                         + this.cellLife(0, y-1) + this.cellLife(0, y)  //Top-Right & Right neighbor
                         + this.cellLife(0, y+1) + this.cellLife(x, y+1); //Bottom-Right & Bottom Neighbor
      return neighborsAlive;
    }

    //Calculute for top side without xEdge cases -- Done
    if(yLowEdge && !xLowEdge && !xHighEdge) {
      let neighborsAlive = this.cellLife(x-1, y+1) + this.cellLife(x-1, y)  //Bottom-Left & Left neighbor
                         + this.cellLife(x-1, this.numberOfRows - 1) + this.cellLife(x, this.numberOfRows - 1)  //Top-Left & Top neighbor
                         + this.cellLife(x+1, this.numberOfRows - 1) + this.cellLife(x+1, y)  //Top-Right & Right neighbor
                         + this.cellLife(x+1, y+1) + this.cellLife(x, y+1); //Bottom-Right & Bottom Neighbor
      return neighborsAlive;
    }

    //Calculate for bottom side without xEdge cases
    if(yHighEdge && !xLowEdge && !xHighEdge) {
      let neighborsAlive = this.cellLife(x-1, 0) + this.cellLife(x-1, y)  //Bottom-Left & Left neighbor
                         + this.cellLife(x-1, y-1) + this.cellLife(x, y-1)  //Top-Left & Top neighbor
                         + this.cellLife(x+1, y-1) + this.cellLife(x+1, y)  //Top-Right & Right neighbor
                         + this.cellLife(x+1, 0) + this.cellLife(x, 0); //Bottom-Right & Bottom Neighbor
      return neighborsAlive;
    }
  }

}
