import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from 'src/app/services/book.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})

export class BookListComponent implements OnInit {
  books: any[] = [];
  filteredBooks: any[] = [];
  searchQuery: string = '';
  claims: any[] = [];

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
        console.log('books----', this.books);
        this.filteredBooks = response;
      },
      (error) => {
        console.log('Error fetching books:', error);
      }
    );
  }

  deleteBook(id: number): void {
    this.bookService.getBook(id).subscribe(
      (book) => {
        const confirmDelete = confirm(`Are you sure you want to delete "${book.title}"?`);
        if (confirmDelete) {
          this.bookService.deleteBook(id).subscribe(
            () => {
              console.log('Book deleted successfully');
              this.fetchBooks();
              window.alert(`"${book.title}" deleted successfully`);
            },
            (error) => {
              console.log('Error deleting book:', error);
            }
          );
        }
      },
      (error) => {
        console.log('Error retrieving book:', error);
      }
    );
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
    if (field) {
      this.claims.sort((claim1, claim2) => {
        const value1 = this.getPropertyValue(claim1, field);
        const value2 = this.getPropertyValue(claim2, field);
        return this.compareValues(value1, value2, order);
      });
    }
  }

  compareValues(value1: any, value2: any, order: number): number {
    return order * (value1.localeCompare(value2));
  }

  getPropertyValue(obj: any, field: string): any {
    return obj[field];
  }
}  
