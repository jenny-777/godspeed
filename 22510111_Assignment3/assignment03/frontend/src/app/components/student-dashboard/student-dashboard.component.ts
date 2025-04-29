import { Component, input } from '@angular/core';
import { EnrollCourseComponent } from '../enroll-course/enroll-course.component';

@Component({
  selector: 'app-student-dashboard',
  imports: [EnrollCourseComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent {
  userData = input.required<any>()

  

}
