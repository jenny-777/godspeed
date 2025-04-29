import { Component, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-enroll-course',
  imports: [FormsModule],
  templateUrl: './enroll-course.component.html',
  styleUrls: ['./enroll-course.component.scss']
})
export class EnrollCourseComponent {
  authService = inject(AuthService);
  course_id = signal('');
  sec_id = signal('');
  semester = signal('');
  year = signal(new Date().getFullYear()); // Default to current year
  grade = signal(''); // Grade is optional and can be empty

  constructor(private http: HttpClient) {}

  onSubmit() {
    const enrollment = {
      course_id: this.course_id(),
      sec_id: this.sec_id(),
      semester: this.semester(),
      year: this.year(),
      grade: this.grade() || null // Optional, can be null
    };

    this.http.post('http://localhost:5000/enroll', enrollment, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('assignment3token')}`
      }
    }).subscribe(response => {
      console.log('Enrollment successful', response);
    }, error => {
      console.error('Failed to enroll', error);
    });

    this.course_id.set('');
    this.sec_id.set('');
    this.semester.set('');
    this.year.set(new Date().getFullYear());
    this.grade.set('');
  }
}
