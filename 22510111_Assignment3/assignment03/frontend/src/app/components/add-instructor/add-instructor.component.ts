import { Component, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-instructor',
  imports: [FormsModule],
  templateUrl: './add-instructor.component.html',
  styleUrls: ['./add-instructor.component.scss']
})
export class AddInstructorComponent {
  authService = inject(AuthService);
  ID = signal('');
  name = signal('');
  dept_name = signal('');
  salary = signal(0);

  constructor(private http: HttpClient) {}

  onSubmit() {
    const instructor = {
      ID: this.ID(),
      name: this.name(),
      dept_name: this.dept_name(),
      salary: this.salary()
    };

    this.http.post('http://localhost:5000/instructor', instructor, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('assignment3token')}`
      }
    }).subscribe(response => {
      console.log('Instructor added successfully', response);
    }, error => {
      console.error('Failed to add instructor', error);
    });

    this.ID.set('');
    this.name.set('');
    this.dept_name.set('');
    this.salary.set(0);
  }
}
