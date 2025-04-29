import { Component, input } from '@angular/core';
import { AssignCourseComponent } from '../assign-course/assign-course.component';

@Component({
  selector: 'app-instructor-dashboard',
  imports: [AssignCourseComponent],
  templateUrl: './instructor-dashboard.component.html',
  styleUrl: './instructor-dashboard.component.scss'
})
export class InstructorDashboardComponent {
  userData = input.required<any>()

  
}
