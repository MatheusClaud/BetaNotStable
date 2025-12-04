import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogStateService } from '../../../services/dialog/dialog-state-service';
import { IDialog } from '../../../models/shared/dialog-enum';
import { ActivatedRoute } from '@angular/router';
import { TrendingService } from '../../../services/api/trending-service';
import { TrendingHomeItem } from '../../elements/trending-home-item/trending-home-item';

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TrendingHomeItem
],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {

  items: Array<any> = ["0","2","3","4","10","22","33","44","0","2","3","4","10","22"]
  inputValue: string = '';
  route = inject(ActivatedRoute)
  #dialogService = inject(DialogStateService)
  trendingService = inject(TrendingService)


  constructor() {
    let token = this.route.snapshot.queryParamMap.get('resetToken');
    if (token !== null) {
      this.#dialogService.setCurrentDialogVisibility(IDialog.ValidatePasswordToken)
    }
    this.trendingService.getTrending()
  }

  onEnterPressed() {}

  getTest(): any {
    return [
      {...this.trendingService.getTrendingProduct()[0]},
      {...this.trendingService.getTrendingProduct()[0]},
      {...this.trendingService.getTrendingProduct()[0]},
      {...this.trendingService.getTrendingProduct()[0]},
      {...this.trendingService.getTrendingProduct()[0]},
      {...this.trendingService.getTrendingProduct()[0]},
      {...this.trendingService.getTrendingProduct()[0]},
      {...this.trendingService.getTrendingProduct()[0]},
      {...this.trendingService.getTrendingProduct()[0]},
      {...this.trendingService.getTrendingProduct()[0]},
    ]
  }

  getTest2(): any {
    return [
      {...this.trendingService.getTrendingStores()[0]},
      {...this.trendingService.getTrendingStores()[0]},
      {...this.trendingService.getTrendingStores()[0]},
      {...this.trendingService.getTrendingStores()[0]},
      {...this.trendingService.getTrendingStores()[0]},
      {...this.trendingService.getTrendingStores()[0]},
      {...this.trendingService.getTrendingStores()[0]},
      {...this.trendingService.getTrendingStores()[0]},
      {...this.trendingService.getTrendingStores()[0]},
    ]
  }
}
