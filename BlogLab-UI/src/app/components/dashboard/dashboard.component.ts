import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Blog } from 'src/app/models/blog/blog.model';
import { AccountService } from 'src/app/services/account.service';
import { BlogService } from 'src/app/services/blog.service';
import { Sort } from '@angular/material/sort';
// import { FlexLayoutModule } from '@angular/flex-layout';
import { ApplicationUser } from 'src/app/models/account/application-user.model';
import { BlogPaging } from 'src/app/models/blog/blog-paging.model';
import { PagedResult } from 'src/app/models/blog/paged-result.model';

import { Chart ,registerables} from 'node_modules/chart.js';

interface CommentData{
  blogId:number,
  title:string,
  brojKomenatara:number
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {



  pagedBlogResult: PagedResult<Blog>;
  userBlogs: Blog[];
  sortedData: Blog[];
  searchTerm: string;
  user: ApplicationUser;
  chart = [];
  comments :CommentData[]
  post:string[] = []
  broj:number[] =  []
  constructor(
    private blogService: BlogService,
    private router: Router,
    private toastr: ToastrService,
    private accountService: AccountService,
  ) { }

  ngOnInit(): void {
    this.user = this.accountService.currentUserValue;

    this.blogService.getNumber(this.user.applicationUserId).subscribe(comments => {
      this.comments = comments;
      console.log(comments);
  

      this.comments.forEach(element => {
        this.post.push(element.title);
        this.broj.push(element.brojKomenatara);
      });
      console.log(this.broj);
      console.log(this.post);





      Chart.register(...registerables);
    var myChart = new Chart("myChart", {
      type: 'bar',
      data: {
          labels: this.post ,
          datasets: [{
              label: '# of Comments',
              data: this.broj,
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
    });
    
  
    

    this.userBlogs = [];

    let currentApplicationUserId = this.accountService.currentUserValue.applicationUserId;

    

    if (this.user.admin) {
      let blogPaging = new BlogPaging(1, 10);
      this.blogService.getAll(blogPaging).subscribe(pagedBlogs => {
        this.pagedBlogResult = pagedBlogs;

        this.userBlogs = pagedBlogs.items;
        this.sortedData = pagedBlogs.items;
      });
    } else {
      this.blogService.getByApplicationUserId(currentApplicationUserId).subscribe(userBlogs => {
        this.userBlogs = userBlogs;
        this.sortedData = userBlogs;
      });


    }
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

      for (let i = 0; i < blogs.length; i++) {
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

  sort() {
    console.log(this.sortedData);
    for (let i = 0; i < this.sortedData.length - 1; i++) {

      for (let j = 0; j < this.sortedData.length - i - 1; j++) {

        if (this.sortedData[j].title > this.sortedData[j + 1].title) {
          let temp = this.sortedData[j];
          this.sortedData[j] = this.sortedData[j + 1];
          this.sortedData[j + 1] = temp;
        }
      }
    }
    console.log("Nakon: " + this.sortedData);
  }

  search() {
    if (this.searchTerm == "" || this.searchTerm == " " || this.searchTerm == undefined) {
      this.sortedData = this.userBlogs;
      return;
    }
    this.sortedData.forEach(element => {
      if (!element.title.includes(this.searchTerm)) {
        this.sortedData = this.sortedData.filter(item => item !== element);
      }
    });
  }
  users() {
    this.router.navigate(['/user-management']);
  }
}
