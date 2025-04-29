import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-add-course',
    imports: [FormsModule],
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent {
  course_id =signal('');
  title = signal('');
  dept_name = signal('');
  credits = signal(null);

  constructor(private http: HttpClient) {}

  onSubmit() {
    if (!this.course_id || !this.title || !this.dept_name || this.credits === null) {
      alert("Please fill in all fields.");
      return;
    }

    const course = {
      course_id: this.course_id(),
      title: this.title(),
      dept_name: this.dept_name(),
      credits: this.credits()
    };

    this.http.post('http://localhost:5000/course', course, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('assignment3token')}`
      }
    }).subscribe(response => {
      console.log('Course added successfully', response);
      alert('Course added successfully!');
    }, error => {
      console.error('Failed to add course', error);
      alert('Failed to add course. Please try again.');
    });

    this.course_id.set('');
    this.title.set('');
    this.dept_name.set('');
    this.credits.set(null);
  }
}
