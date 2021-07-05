import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Blog } from 'src/app/models/blog/blog.model';
import { AccountService } from 'src/app/services/account.service';
import { BlogService } from 'src/app/services/blog.service';
import {Sort} from '@angular/material/sort';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userBlogs: Blog[];
sortedData :Blog[]
  constructor(
    private blogService: BlogService,
    private router: Router,
    private toastr: ToastrService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.userBlogs = [];

    let currentApplicationUserId = this.accountService.currentUserValue.applicationUserId;

    this.blogService.getByApplicationUserId(currentApplicationUserId).subscribe(userBlogs => {
      this.userBlogs = userBlogs;
      this.sortedData = userBlogs;
    });
  }

  confirmDelete(blog: Blog) {
    blog.deleteConfirm = true;
  }

  cancelDeleteConfirm(blog: Blog) {
    blog.deleteConfirm = false;
  }

  deleteConfirmed(blog: Blog, blogs: Blog[]) {
    this.blogService.delete(blog.blogId).subscribe(() => {

      let index = 0;

      for (let i=0; i<blogs.length; i++) {
        if (blogs[i].blogId === blog.blogId) {
          index = i;
        }
      }

      if (index > -1) {
        blogs.splice(index, 1);
      }

      this.toastr.info("Blog deleted.");
    });
  }

  editBlog(blogId: number) {
    this.router.navigate([`/dashboard/${blogId}`]);
  }

  createBlog() {
    this.router.navigate(['/dashboard/-1']);
  }

  sort(){
    console.log(this.sortedData);
    for (let i = 0; i < this.sortedData.length-1; i++) {
      
      for (let j = 0; j < this.sortedData.length-i-1; j++) {
        
        if(this.sortedData[j].title> this.sortedData[j+1].title){
          let temp = this.sortedData[j];
          this.sortedData[j] = this.sortedData[j+1];
          this.sortedData[j+1] = temp;
        }
      }
    }
    console.log("Nakon: " + this.sortedData);
  }

  // sortData(sort: Sort) {
  //   const data = this.userBlogs.slice();
  //   if (!sort.active || sort.direction === '') {
  //     this.sortedData = data;
  //     return;
  //   }

  //   this.sortedData = data.sort((a, b) => {
  //     const isAsc = sort.direction === 'asc';
  //     switch (sort.active) {
  //       case 'Title': return this.compare(a.title, b.title, isAsc);
  //       // case 'calories': return compare(a.calories, b.calories, isAsc);
  //       // case 'fat': return compare(a.fat, b.fat, isAsc);
  //       // case 'carbs': return compare(a.carbs, b.carbs, isAsc);
  //       // case 'protein': return compare(a.protein, b.protein, isAsc);
  //       default: return 0;
  //     }
  //   });
  // }

  //   compare(a: number | string, b: number | string, isAsc: boolean) {
  //   return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  // }
}
