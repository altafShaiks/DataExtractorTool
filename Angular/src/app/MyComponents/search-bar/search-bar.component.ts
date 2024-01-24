import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  @Output() searchValue = new EventEmitter<string>();
  value = '';
  public getSearchValue() {
    this.searchValue.emit(this.value);
  }

  clearSearchBar() {
    this.value = '';
    this.getSearchValue();
  }

}
