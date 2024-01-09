import { Component, OnInit } from '@angular/core';
import { faTrash, faPen, faMagnifyingGlass, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersDataService } from '../Services/users-data.service';
import { Router } from '@angular/router'
import { UserDataInterface } from '../Interfaces/user-data-interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { end } from '@popperjs/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrl: './body.component.css',
})



export class BodyComponent implements OnInit {

  faTrash = faTrash;
  faPen = faPen;
  faMagnifyingGlass = faMagnifyingGlass;
  faSquarePlus = faSquarePlus;

  public dataOfUsers: any;
  users: UserDataInterface[] | any = [];

  userToDelete: any;

  isUserPageOpend: boolean = false;

  updateUserFormValue: FormGroup;

  // Pagination
  pageSize: number = 15;
  currentPage: number = 0;

  getPaginatedUsers(): any[] {
    const startIndex = this.currentPage * this.pageSize;
    return this.users.slice(startIndex, startIndex + this.pageSize);
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.pageSize = pageEvent.pageSize;
    this.currentPage = pageEvent.pageIndex;
  }


  // Get all Users
  constructor(private usersData: UsersDataService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router) {
    // this.usersData.allUsers('').subscribe((data) => {
    //   console.log(data)
    //   this.dataOfUsers = data;
    // });

    this.updateUserFormValue = this.fb.group({
      user_id: [''],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      dob: [''],
      gender: [''],
      country: ['']
    });
  }

  ngOnInit(): void {
    this.fetchData();
    // this.usersData.getAllUsers().subscribe((result: any) => {
    //   this.users = result.users;
    // });
  }

  // Search Bar
  searchValue = '';

  fetchData(): void {
    if (this.searchValue == '') {
      this.usersData.getAllUsers().subscribe((usersFetched: any) => {
        this.users = usersFetched.userDetails;
      });
    }
    else {
      this.usersData.getAllUsers().subscribe((usersFetched: any) => {
        this.users = usersFetched.userDetails.filter((user: any) =>
          user.user_id.toLowerCase().includes(this.searchValue.toLowerCase())
        );
      });
    }
  }
  searchForm = this.fb.nonNullable.group({
    searchValue: '',
  })

  onSearchSubmit(): void {
    this.searchValue = this.searchForm.value.searchValue ?? '';
    this.fetchData();
  }



  // For Check boxes
  public checkboxEntry: any = new Set('');

  checkEntryForCheckedbox(user: any) {
    if (this.checkboxEntry.has(user))
      this.checkboxEntry.delete(user);
    else {
      this.checkboxEntry.add(user);
    }
  }


  isCheckedAll: boolean = false;
  toggleAllCheckboxes() {
    for (const user of this.users) {
      user.isChecked = this.isCheckedAll;
      if (this.checkboxEntry.has(user))
        this.checkboxEntry.delete(user);
      else
        this.checkboxEntry.add(user);
    }
  }


  // Add user

  getFormData(dataToAdd: any) {
    this.usersData.addUser(dataToAdd).subscribe(() => {
      this.fetchData();
      this.openSnackBar('User Added Successfully: ' + dataToAdd.user_id, 'okay');
    })
  }


  // getValuesToUpdateFromDatabase

  patchValue(id: any) {
    this.usersData.getUserById(id).subscribe((dataAtDatabase: any) => {
      const userDetails = dataAtDatabase.userDetails[0];
      this.updateUserFormValue.patchValue(userDetails);
      this.updateUserFormValue.updateValueAndValidity();
    });
  }


  //  Update user data
  getUpdatedUser(updatedUser: any) {
    this.usersData.updateUser(updatedUser).subscribe(() => {

      this.fetchData();
      this.openSnackBar('Updated User Successfully: ' + updatedUser.user_id, 'okay');
    });

  }



  // Delete single User
  deleteMessage: any;

  setUserToDelete(user: any) {
    this.userToDelete = user;
    if (this.checkboxEntry.size >= 1) {
      this.deleteMessage = 'Are you Sure you want to delete user(s)';
    }
    else {
      this.deleteMessage = 'Are you Sure you want to delete user with ID: ' + this.userToDelete.user_id;
    }
  }

  deleteUser(user: any) {
    this.usersData.deleteUser(user).subscribe((result) => {
      this.fetchData();
    });
    this.openSnackBar('User Deleted Successfully: ' + user.user_id, 'okay');
  }


  confirmDelete() {
    if (this.checkboxEntry.size >= 1) {
      this.deleteUsers();
    }
    else {
      this.deleteUser(this.userToDelete);
    }

  }


  // Delete Multiple Users
  // Select checkboxes opening modal
  anyCheckboxSelected: boolean = false;

  getBsToggle() {
    if (this.checkboxEntry.size <= 0) {
      this.anyCheckboxSelected = true;
      return {
        'data-bs-toggle': 'modal'
      };
    }
    return {
      'data-bs-toggle': 'modal'
    };
  }

  getBsTarget() {
    if (this.checkboxEntry.size <= 0) {
      this.anyCheckboxSelected = true;
      return {
        'data-bs-target': '#deleteUsersModal'
      };
    }
    return {
      'data-bs-target': '#confirmDeleteUserModal'
    };
  }

  async deleteUsers() {
    let singleUser: any;

    if (this.anyCheckboxSelected && this.checkboxEntry.size > 0) {
      for (let i = 0; i < this.checkboxEntry.size; ++i) {
        const user = Array.from(this.checkboxEntry.values())[i] as UserDataInterface;
        this.usersData.deleteUser(user).subscribe();
        await new Promise(f => setTimeout(f, 50));
      }
      singleUser = Array.from(this.checkboxEntry.values())[0] as UserDataInterface;
    }
    if (this.checkboxEntry.size == 1) {
      this.openSnackBar('Deleted User Successfully: ' + singleUser.user_id, 'okay');
    }
    else if (this.checkboxEntry.size > 1) {
      this.openSnackBar('Deleted Multiple User Successfully', 'okay');
    }
    this.checkboxEntry.clear();
    this.anyCheckboxSelected = false;
    this.fetchData();
  }


  // Snackbar
  openSnackBar(message: string, action: any) {
    this._snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: end,
    });
  }



  //  Navigation
  showUserDetails(user: any) {
    this.router.navigate(['user', user]);
  }
}
