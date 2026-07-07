import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore'; // Importaciones de Firestore 
import { Observable } from 'rxjs';

export interface Task { // interface define la estructura de los datos
  id?: string;
  title: string;
  status?: 'todo' | 'doing' | 'done'; // es una union de tipos, solo puede tener uno de estos valores
}

@Injectable({
  providedIn: 'root' // el servicio se inyectara en toda la aplicacion
})
export class KanbanService { // exporta la clase para que pueda ser utilizada en otros modulos
  private firestore = inject(Firestore); // injecta el servicio de Firestore
  private taskCollection = collection(this.firestore, 'tasks'); // crea una referencia a la coleccion 'tasks'

  //FUNCIONES 

  // Obtener tareas en tiempo real
  getTasks(): Observable<Task[]> {
    return collectionData(this.taskCollection, { idField: 'id' }) as Observable<Task[]>;
  }

  // agrega una tarea 
  addTask(task: Task) {
    return addDoc(this.taskCollection, task);
  }

  // Actualiza el estado de una tarea en Firestore
  updateTaskStatus(taskId: string, newStatus: 'todo' | 'doing' | 'done') {
    const taskDocRef = doc(this.firestore, `tasks/${taskId}`);
    return updateDoc(taskDocRef, { status: newStatus });
  }

  // Eliminar una tarea de Firestore usando su ID
  deleteTask(taskId: string) {
    const taskDocRef = doc(this.firestore, `tasks/${taskId}`);
    return deleteDoc(taskDocRef);
  }
} 