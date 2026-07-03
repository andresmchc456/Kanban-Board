import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanService, Task } from './services/kanban';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class AppComponent implements OnInit {
  title = 'kanban-firebase';
  // Inyectamos nuestro servicio Kanban
  private KanbanServises = inject(KanbanService);
  // Creamos el Observable para las tareas
  tasks$!: Observable<Task[]>;

  ngOnInit(): void {
    this.tasks$ = this.KanbanServises.getTasks();// Obtenemos las tareas en tiempo real al cargar el componente

  }
}
