import { Component, NgZone } from '@angular/core';
import { CryptService } from '../../services/crypt.service';
import { DataService } from '../../services/data.service';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'authorized',
  templateUrl: './authorized.component.html',
})
export class AuthorizedComponent {
  public bb: Observable<string>;
  private cc;
  constructor(
    private cryptService: CryptService,
    private dataService: DataService,
    private store: Store<AppState>,
    private zone: NgZone
  ) {

    this.bb = dataService.getItem$('images/sample1.png').map((text) => {
      this.zone.run(() => { });
      return text;
    });

  }

}
