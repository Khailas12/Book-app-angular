import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookComponent } from './book.component';
import { BookListComponent } from './book-list/book-list.component';
import { BookCreateComponent } from './book-create/book-create.component';

const routes: Routes = [
  {
    path: '', component: BookComponent, children: [
      { path: "", redirectTo: 'list', pathMatch: "full" },
      { path: "list", component: BookListComponent },
      { path: "create", component: BookCreateComponent },
      { path: 'update/:id', component: BookCreateComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookRoutingModule { }
