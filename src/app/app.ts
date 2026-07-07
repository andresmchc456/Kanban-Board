import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KanbanService, Task } from './services/kanban';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],//imports de los modulos necesarios
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class AppComponent implements OnInit {
  private kanbanServices = inject(KanbanService)

  //columnas indepemndientes
  todo: Task[] = [];
  doing: Task[] = [];
  done: Task[] = [];

  newTaskTitle: string = '';
  loading: boolean = true;
  errorMessage: string = '';

  ngOnInit() {
    // Escuchamos los cambios de Firestore en tiempo real
    this.kanbanServices.getTasks().subscribe({
      next: (tasks) => {
        this.loading = false;
        this.errorMessage = '';

        // clasificacion de las tareas en sus respectivas columnas 
        this.todo = tasks.filter(t => t.status == 'todo');
        this.doing = tasks.filter(t => t.status == 'doing');
        this.done = tasks.filter(t => t.status == 'done');
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = `Error al conectar con Firestore: ${err.message || err}`;
        console.error('Firestore Error:', err);
      }
    });
  }

  // crear una nueva tarea en la base de datos
  createTask() {
    if (!this.newTaskTitle.trim()) return;
    const newTask: Task = {
      title: this.newTaskTitle,
      status: 'todo'
    };

    this.kanbanServices.addTask(newTask).then(() => {
      this.newTaskTitle = ''; // LIMPIAR INPUTS DEPUES DE AGREGAR
    });
  }

  // Lógica que se ejecuta al soltar una tarjeta
  drop(event: CdkDragDrop<Task[]>, columnName: 'todo' | 'doing' | 'done') {
    if (event.previousContainer === event.container) {
      // Si se mueve dentro de la misma columna
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {// Si se mueve a otra columna diferente
      transferArrayItem(
        event.previousContainer.data, // array de origen
        event.container.data, // array de destino
        event.previousIndex, // indice de origen
        event.currentIndex // indice de destino
      );

      // Actualizamos la tarea en Firestore con su nuevo estado
      const movedTask = event.container.data[event.currentIndex];
      if (movedTask.id) {
        this.kanbanServices.updateTaskStatus(movedTask.id, columnName)
      }
    }
  }
}