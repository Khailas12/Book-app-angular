import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BookService } from 'src/app/services/book.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.scss']
})
export class BookCreateComponent implements OnInit {
  isCreate: boolean = false;
  isUpdate: boolean = false;
  book: any = {}; // Add the book property here
  bookForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isUpdate = true;
        const bookId = +params['id'];
        this.fetchBook(bookId);
      }
    });

    this.bookForm = this.formBuilder.group({
      title: [null, Validators.required],
      description: [null, Validators.required],
      pageCount: [null, [Validators.required, Validators.min(10), Validators.max(250)]],
      excerpt: [null, Validators.required],
      publishDate: [null, Validators.required]
    });
  }
  patchFormValues(): void {
    if (this.bookForm) {
      const utcDate = new Date(
        Date.UTC(
          this.book.publishDate.getFullYear(),
          this.book.publishDate.getMonth(),
          this.book.publishDate.getDate()
        )
      );
      this.bookForm.patchValue({
        publishDate: utcDate
      });
    }
  }

  fetchBook(id: number): void {
    this.bookService.getBook(id).subscribe(
      (book) => {
        console.log('Fetched publish date:', book.publishDate);
        this.book = book;
        console.log('===', this.book);

        // Assuming the response is in the format: "2023-06-25T00:00:00.000Z"
        const dateComponents = book.publishDate.substring(0, 10).split('-'); // Extract the date components
        const year = parseInt(dateComponents[0]);
        const month = parseInt(dateComponents[1]) - 1; // Months are zero-based
        // const day = parseInt(dateComponents[2]);
        const day = parseInt(dateComponents[2]) + 1; // Increment the day by 1

        this.book.publishDate = new Date(year, month, day); // Set the date directly without UTC conversion
        console.log('Updated publish date:', this.book.publishDate);

        this.patchFormValues(); // Call the method to update form values
      },
      (error) => {
        console.log('Error retrieving book:', error);
      }
    );
  }

  createBook(): void {
    if (this.isFormEmpty()) {
      window.alert('All fields are required. Please fill them.');
      return;
    }
  
    this.bookService.createBook(this.book).subscribe(
      (response) => {
        console.log('Book created successfully:', response);
        const message = 'Book created successfully:\n\n';
        window.alert(message);

      },
      (error: HttpErrorResponse) => {
        console.log('Error creating book:', error);
        if (error.status === 400 && error.error?.errors) {
          const validationErrors = error.error.errors;
          console.log('Validation errors:', validationErrors);
          if (validationErrors['$.pageCount']) {
            const pageCountError = validationErrors['$.pageCount'][0];
            console.log('Page Count validation error:', pageCountError);
          }

        } else {
          console.log('An error occurred:', error.message);
        }
      }
    );
  }
  
  isFormEmpty(): boolean {
    return (
      !this.book.title ||
      !this.book.pageCount ||
      !this.book.description ||
      !this.book.excerpt ||
      !this.book.publishDate
    );
  }
  
  updateBook(): void {
    const bookId = this.book.id;
    const publishDateBackup = this.book.publishDate; // Store the publishDate value temporarily
  
    const utcPublishDate = new Date(this.book.publishDate.getTime() - this.book.publishDate.getTimezoneOffset() * 60000).toISOString();
    this.book.publishDate = utcPublishDate;
  
    this.bookService.updateBook(bookId, this.book).subscribe(
      (response) => {
        console.log('Book updated successfully:', response);
        this.book.publishDate = new Date(response.publishDate);
        this.book.publishDate = publishDateBackup;
      },
      (error) => {
        console.log('Error updating book:', error);
        // Restore the original publishDate value in case of an error
        this.book.publishDate = publishDateBackup;
      }
    );
  }
  
  validateTitleInput(event: any) {
    const value = event.target.value;
    const maxLength = 30;
    if (value.length > maxLength) {
      event.target.value = value.slice(0, maxLength);
      const errorElement = document.getElementById('error-message');
      if (errorElement) {
        errorElement.style.display = 'block';
        errorElement.innerHTML = 'Title cannot be more than 30 characters';
      }
    } else {
      const errorElement = document.getElementById('error-message');
      if (errorElement) {
        errorElement.style.display = 'none';
      }
    }
  }


  validateNumberInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    const numericValue = inputValue.replace(/\D/g, '');
    const numValue = Number(inputElement.value);
    this.book.pageCount = numericValue;
    inputElement.value = numericValue;


    if (inputValue.trim() === "") {
      const errorElement = document.getElementById('page-error-message');
      if (errorElement) {
        errorElement.style.display = 'none';
      }
    } else {
      if (numValue < 10) {
        const errorElement = document.getElementById('page-error-message');
        if (errorElement) {
          errorElement.style.display = 'block';
          errorElement.innerHTML = 'Page Number should be more than 10';
        }
      } else if (numValue > 250) {
        const errorElement = document.getElementById('page-error-message');
        if (errorElement) {
          errorElement.style.display = 'block';
          errorElement.innerHTML = 'Page Number should be less than 250';
        }
      } else {
        const errorElement = document.getElementById('page-error-message');
        if (errorElement) {
          errorElement.style.display = 'none';
        }
      }
    }
  }
  validateDescriptionInput(event: any) {
    const value = event.target.value;
    const maxLength = 50;
    if (value.length > maxLength) {
      event.target.value = value.slice(0, maxLength);
      const errorElement = document.getElementById('description-error');
      if (errorElement) {
        errorElement.style.display = 'block'; // Show the error message
        errorElement.innerHTML = 'Description cannot be more than 50 characters';
      }
    } else {
      const errorElement = document.getElementById('description-error');
      if (errorElement) {
        errorElement.style.display = 'none'; // Hide the error message
      }
    }
  }

  validateExcermptInput(event: any) {
    const value = event.target.value;
    const maxLength = 250;
    if (value.length > maxLength) {
      event.target.value = value.slice(0, maxLength);
      const errorElement = document.getElementById('excerpt-error');
      if (errorElement) {
        errorElement.style.display = 'block'; // Show the error message
        errorElement.innerHTML = 'Excerpt cannot be more than 250 characters';
      }
    } else {
      const errorElement = document.getElementById('excerpt-error');
      if (errorElement) {
        errorElement.style.display = 'none'; // Hide the error message
      }
    }
  }

  goBackTolist(): void {
    this.router.navigate(['book/list']);
  }
}

