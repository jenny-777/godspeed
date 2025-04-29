import { Component, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-section',
  imports: [FormsModule],
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.scss']
})
export class AddSectionComponent {
  authService = inject(AuthService);
  course_id = signal('');
  sec_id = signal('');
  semester = signal('');
  year = signal(new Date().getFullYear()); // Default to current year
  building = signal('');
  room_number = signal('');
  time_slot_id = signal('');

  constructor(private http: HttpClient) {}

  onSubmit() {
    const section = {
      course_id: this.course_id(),
      sec_id: this.sec_id(),
      semester: this.semester(),
      year: this.year(),
      building: this.building(),
      room_number: this.room_number(),
      time_slot_id: this.time_slot_id()
    };

    this.http.post('http://localhost:5000/section', section, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('assignment3token')}`
      }
    }).subscribe(response => {
      console.log('Section added successfully', response);
    }, error => {
      console.error('Failed to add section', error);
    });

    this.course_id.set('');
    this.sec_id.set('');
    this.semester.set('');
    this.year.set(new Date().getFullYear());
    this.building.set('');
    this.room_number.set('');
    this.time_slot_id.set('');
  }
}
