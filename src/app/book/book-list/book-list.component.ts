import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from 'src/app/services/book.service';
import { SortEvent } from 'primeng/api';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit {
  books: any[] = [];
  filteredBooks: any[] = [];
  tableHeaders: string[] = ['Title', 'Description', 'Page Count', 'Excerpt', 'Publish Date', 'Action'];
  searchQuery: string = '';

  constructor(
    private bookService: BookService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.fetchBooks();
  }

  create(): void {
    this.router.navigate(['book/create']);
  }

  update(id: number): void {
    this.router.navigate(['book/update', id]);
  }

  fetchBooks(): void {
    this.bookService.getBooks().subscribe(
      (response) => {
        this.books = response;
        this.filteredBooks = response;
      },
      (error) => {
        console.log('Error fetching books:', error);
      }
    );
  }

  deleteBook(id: number): void {
    const confirmDelete = confirm('Are you sure you want to delete?');
    if (confirmDelete) {
      this.bookService.deleteBook(id).subscribe(
        (response) => {
          console.log('Book deleted successfully');
          this.fetchBooks();
        },
        (error) => {
          console.log('Error deleting book:', error);
        }
      );
    }
  }
  
  search(): void {
    if (this.searchQuery.trim() !== '') {
      this.filteredBooks = this.books.filter((book) => {
        const searchTerm = this.searchQuery.toLowerCase();
        const publishDateString = new Date(book.publishDate).toString().toLowerCase();
        return (
          book.title.toLowerCase().includes(searchTerm) ||
          book.description.toLowerCase().includes(searchTerm) ||
          book.pageCount.toString().includes(searchTerm) ||
          book.excerpt.toLowerCase().includes(searchTerm) ||
          publishDateString.includes(searchTerm)
        );
      });
    } else {
      this.filteredBooks = this.books;
    }
  }
  
  onSort(event: any) {
    const { field, order } = event;
    if (field !== 'Action') {
      this.filteredBooks.sort((book1, book2) => {
        const value1 = this.getPropertyValue(book1, field);
        const value2 = this.getPropertyValue(book2, field);
  
        if (value1 === value2) {
          return 0;
        }
  
        if (value1 === null || value1 === undefined) {
          return order === -1 ? 1 : -1;
        }
  
        if (value2 === null || value2 === undefined) {
          return order === -1 ? -1 : 1;
        }
  
        if (typeof value1 === 'string' && typeof value2 === 'string') {
          return order === -1 ? value1.localeCompare(value2) : value2.localeCompare(value1);
        }
  
        if (typeof value1 === 'number' && typeof value2 === 'number') {
          return order === -1 ? value1 - value2 : value2 - value1;
        }
  
        if (value1 instanceof Date && value2 instanceof Date) {
          return order === -1 ? value1.getTime() - value2.getTime() : value2.getTime() - value1.getTime();
        }
  
        return 0;
      });
    }
  }
  
  getPropertyValue(obj: any, field: string): any {
    if (field === 'publishDate') {
      return new Date(obj[field]);
    } else {
      return obj[field];
    }
  }
}  
