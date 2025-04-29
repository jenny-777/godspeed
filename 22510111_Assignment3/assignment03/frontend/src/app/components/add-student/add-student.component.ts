import { Component, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-student',
  imports: [FormsModule],
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent {
  authService = inject(AuthService);
  ID = signal('');
  name = signal('');
  dept_name = signal('');
  tot_cred = signal(0);

  constructor(private http: HttpClient) {}

  onSubmit() {
    const student = {
      ID: this.ID(),
      name: this.name(),
      dept_name: this.dept_name(),
      tot_cred: this.tot_cred()
    };

    this.http.post('http://localhost:5000/student', student, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('assignment3token')}`
      }
    }).subscribe(response => {
      console.log('Student added successfully', response);
    }, error => {
      console.error('Failed to add student', error);
    });

    this.ID.set('');
    this.name.set('');
    this.dept_name.set('');
    this.tot_cred.set(0);
  }
}
