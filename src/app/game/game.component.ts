import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Cell } from '../game-cell';
import { GameService } from '../game-service.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  public gameRunning: boolean;  //Make as input to control class
  private loopInterval: number;
  private intervalTime: number;
  private cells: Cell[];
  private context;
  private lifeColor;
  private deathColor;
  @ViewChild('myCanvas', {static: true}) myCanvas: ElementRef<HTMLCanvasElement>;

  constructor(private gameService: GameService) {
    this.intervalTime = 100; //1/10 second ---- Make as an INPUT to the controls class
    this.lifeColor  = '#FFFF00';
    this.deathColor = '#134440';
   }

  ngOnInit(): void {
    this.context = this.myCanvas.nativeElement.getContext('2d');

    this.gameRunning = true;
    this.gameService.createBoard(this.context);
    //Run game loop
    this.runGame();
  }

  mouseDown(e) {
    console.log("clicked!");
    console.log(this.getMouseXY(e));

    let x = (this.getMouseXY(e)).x;
    let y = (this.getMouseXY(e)).y;

    this.getClickedCellXY(x, y)
  }

  getClickedCellXY(x :number, y :number)
  {
    //Use clicked x,y coords to determine which cell has been clicked

    //Say  x, y = 800px
    //Say height = 20px
    //800 / 20 = 40 cells
    //0-10 cell 1, 10-19 cell 2, 20-29 cell 3

    // fake vars for now
    let numOfCells = 40;  //Cell Count
    let totalHeight = 800; //pixels
    let totalWidth  = 800; //pixels
    let cellHeight  = Math.floor(totalHeight/numOfCells); //pixels
    let cellWidth   = Math.floor(totalWidth/numOfCells); //pixels


    let cellX = Math.floor((x-1)/cellWidth);
    let cellY = Math.floor((y-1)/cellHeight);

    console.log(cellX, cellY);

    let index = this.gameService.getIndex(cellX, cellY);

    this.gameService.cells[index].setCellClickedCellState(this.lifeColor, this.deathColor);
  }

  getMouseXY(e) {
    let rect = this.myCanvas.nativeElement.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  toggleGameState() {
    this.gameRunning = !this.gameRunning;
  }

  updateGameSpeed(gameSpeed: number) {
    //Change speed of game
    this.intervalTime = 1001 - (gameSpeed * 10);
  }

  changeLifeColor(newColor: string) {
    this.lifeColor = newColor;
  }

  changeDeathColor(newColor: string) {
    this.deathColor = newColor;
  }

  resetGame() {
    window.clearInterval(this.loopInterval);
    this.gameRunning = true;
    this.gameService.createBoard(this.context);
    //Run game loop
    this.runGame();
  }

  runGame() {
    this.gameRunning = true;
    this.loopInterval = window.setInterval(() => {
      this.nextCellGeneration();
    }, this.intervalTime);
  }

  nextCellGeneration() {
    //If game isn't currently running, don't update interval
    if(!this.gameRunning){
      return;
    }

    //Calculate new game generation
    this.gameService.updateGameBoard();

    // Draw all the cells
    for (let i = 0; i < this.gameService.cells.length; i++) {
      this.gameService.cells[i].draw(this.lifeColor, this.deathColor);
    }
  }
}
