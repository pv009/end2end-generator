import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { User } from 'parse';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserModel } from 'src/app/auth/model/user.model';
import { AuthState } from 'src/app/auth/state/auth.state';
import { UpdateProfileComponent } from 'src/app/auth/update-profile/update-profile.component';

@Component({
  selector: 'app-profile-overview',
  templateUrl: './profile-overview.component.html',
  styleUrls: ['./profile-overview.component.scss']
})
export class ProfileOverviewComponent implements OnInit {
  @Select(AuthState.getUser) currentUser$: Observable<User>;

  currentRate: string;

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.currentRate = this.getRateFromUser(user);
      }
    });
  }

  editProfile() {
    this.dialog.open(UpdateProfileComponent, {
      minHeight: '800px',
      minWidth: '600px',
      disableClose: true,
      data: { desktopDialog: true }
    });
  }

  getRateFromUser(user: any): string {
    const currentUser: UserModel = user.toJSON();
    const rate = currentUser.rate ? currentUser.rate : 'basic';
    switch (rate) {
      case 'basic':
        return 'Free';
      case 'premium':
        return 'Edecy Premium';
      case 'premium-plus':
        return 'Edecy Premium Plus';
    }
  }

}
