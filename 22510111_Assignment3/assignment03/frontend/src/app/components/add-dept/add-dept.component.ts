import { Component, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-add-dept',
  imports: [FormsModule],
  templateUrl: './add-dept.component.html',
  styleUrls: ['./add-dept.component.scss']
})
export class AddDeptComponent {
  authService = inject(AuthService);
  dept_name = signal('');
  building = signal('');
  budget = signal(0);

  constructor(private http: HttpClient) {}

  onSubmit() {
    const department = {
      dept_name: this.dept_name(),
      building: this.building(),
      budget: this.budget()
    };

      this.http.post('http://localhost:5000/department', department, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('assignment3token')}`
      }
      }).subscribe(response => {
        console.log('Department added successfully', response);
      }, error => {
        console.error('Failed to add department', error);
      });

      this.dept_name.set('');
      this.building.set('');
      this.budget.set(0);
  }
}