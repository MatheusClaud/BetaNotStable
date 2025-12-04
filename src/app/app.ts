import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Topbar } from './components/nav/topbar/topbar';
import { LeftBar } from "./components/nav/left-bar/left-bar";
import { RightBar } from "./components/nav/right-bar/right-bar";
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { GlobalStateService } from './services/state/global-state-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Topbar,
    LeftBar,
    RightBar,
    NgxSpinnerModule,
    CommonModule
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  #spinner = inject(NgxSpinnerService)
  #GSservice = inject(GlobalStateService)
  #isLoadingVisible = this.#GSservice.getIsLoadingVisible

  constructor() {
    effect(() => {
      if (this.#isLoadingVisible()) {
        this.#spinner.show()
      } else {
        this.#spinner.hide()
      }
    })
  }
}
