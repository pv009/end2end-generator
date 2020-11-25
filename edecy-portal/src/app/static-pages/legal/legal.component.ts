import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Select } from '@ngxs/store';
import { User } from 'parse';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { LoginComponent } from 'src/app/auth/login/login.component';
import { RegisterComponent } from 'src/app/auth/register/register.component';
import { AuthState } from 'src/app/auth/state/auth.state';
import { UpdateProfileComponent } from 'src/app/auth/update-profile/update-profile.component';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.scss']
})
export class LegalComponent implements OnInit {
  @Select(AuthState.getUser) currentUser$: Observable<User>;

  activeTab = 'imprint';

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.params.pipe(take(1)).subscribe(route => {
      this.activeTab = route.page;
    });
  }

  showTab(tab: string) {
    this.activeTab = tab;
  }

  editProfile() {
    this.dialog.open(UpdateProfileComponent, {
      minHeight: '800px',
      minWidth: '600px',
      disableClose: true,
      data: { desktopDialog: true }
    });
  }



}
