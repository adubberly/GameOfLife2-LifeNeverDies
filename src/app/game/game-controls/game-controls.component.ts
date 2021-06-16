import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-game-controls',
  templateUrl: './game-controls.component.html',
  styleUrls: ['./game-controls.component.css']
})
export class GameControlsComponent implements OnInit {
  @Output() toggleGameStateEvent = new EventEmitter<void>();
  @Output() resetGameEvent = new EventEmitter<void>();
  @Output() changeGenSpeedEvent = new EventEmitter<number>();
  @Output() changeDeathColorEvent = new EventEmitter<string>();
  @Output() changeLifeColorEvent  = new EventEmitter<string>();

  gameState: boolean;

  maxSliderVal = 100;
  minSliderVal = 1;
  sliderVal = 50;
  lifeColor  = '#FFFF00';
  deathColor = '#134440';

  constructor() { }

  ngOnInit(): void {
    this.gameState = true;

  }

  lifeColorChange() {
    this.changeLifeColorEvent.emit(this.lifeColor);
  }

  deathColorChange() {
    this.changeDeathColorEvent.emit(this.deathColor);
  }

  toggleGameState() {
    this.gameState = !this.gameState;
    this.toggleGameStateEvent.emit();
  }

  resetGame(){
    this.gameState = true;
    this.resetGameEvent.emit();
  }

  setSpeed(event)
  {
    this.sliderVal = event.value;
    this.changeGenSpeedEvent.emit(this.sliderVal);
  }

  formatThumbLabel(value: number){
    if(value >= 100){
      return Math.round(value / 100) + 'Generations';
    }
    return value;
  }


}
