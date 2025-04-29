import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
})
export class SearchComponent {
  paperA = '';
  paperB = '';
  queryType = 'citation';
  customQuery = '';
  result: any;

  constructor(private http: HttpClient) {}

  search() {
    const payload = {
      paperA: this.paperA,
      paperB: this.paperB,
      queryType: this.queryType,
      customQuery: this.customQuery,
    };

    this.http.post<any>('http://localhost:3000/query', payload)
      .subscribe(data => {
        this.result = data;
      });
  }
}
