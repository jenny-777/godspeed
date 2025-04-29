import { Component, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-assign-course',
  imports: [FormsModule],
  templateUrl: './assign-course.component.html',
  styleUrls: ['./assign-course.component.scss']
})
export class AssignCourseComponent {
  authService = inject(AuthService);
  course_id = signal('');
  sec_id = signal('');
  semester = signal('');
  year = signal(new Date().getFullYear()); // Default to current year

  constructor(private http: HttpClient) {}

  onSubmit() {
    const assignment = {
      course_id: this.course_id(),
      sec_id: this.sec_id(),
      semester: this.semester(),
      year: this.year()
    };

    this.http.post('http://localhost:5000/assign', assignment, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('assignment3token')}`
      }
    }).subscribe(response => {
      console.log('Course assigned successfully', response);
    }, error => {
      console.error('Failed to assign course', error);
    });

    this.course_id.set('');
    this.sec_id.set('');
    this.semester.set('');
    this.year.set(new Date().getFullYear());
  }
}
