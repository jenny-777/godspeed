import { Component } from '@angular/core';
import { UserListComponent } from "../user-list/user-list.component";
import { ReportGeneratorComponent } from "../report-generator/report-generator.component";
import {AddDeptComponent} from "../add-dept/add-dept.component";
import { AddCourseComponent } from '../add-course/add-course.component';
import { AddInstructorComponent } from '../add-instructor/add-instructor.component';
import { AddStudentComponent } from '../add-student/add-student.component';

@Component({
  selector: 'app-admin-dashboard',
  imports: [UserListComponent, ReportGeneratorComponent, UserListComponent, AddDeptComponent, AddCourseComponent, AddInstructorComponent, AddStudentComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {

}
