import { Component, OnInit } from '@angular/core';
import { UsersDataService } from '../Services/users-data.service';
import { ActivatedRoute } from '@angular/router';
import { UserDataInterface } from '../Interfaces/user-data-interface';
import { faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-details-page',
  templateUrl: './user-details-page.component.html',
  styleUrl: './user-details-page.component.css'
})
export class UserDetailsPageComponent implements OnInit {

  faCircleArrowLeft = faCircleArrowLeft;
  
  userDataToShow: any;
  userInformation: UserDataInterface[] | any = [];
  
  constructor(private userData: UsersDataService,
    private route:ActivatedRoute,
    private router: Router) { 
   }



  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.userData.getUserById(id).subscribe((result:any) => {
      this.userInformation = result.userDetails;
      console.warn(this.userInformation);
    });
  }

  getGender() {
    if(this.userInformation[0].gender == 'male' || this.userInformation[0].gender == 'Male') {
      return {'src': '../assets/profileIconMale.png'};
    }
    return {'src': '../assets/profileIconFemale.png'}
  }

  // Navigation
  goBackToHomePage() {
    this.router.navigate(['']);
  }
  
}
