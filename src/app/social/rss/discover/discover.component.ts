import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['../rss/rss.component.css']
})
export class DiscoverComponent implements OnInit {
  featuredCategories = [
    { 'name': 'Tech', 'image': 'assets/images/social/rss/1.png' },
    { 'name': 'Cyber Security', 'image': 'assets/images/social/rss/2.png' },
    { 'name': 'Marketing', 'image': 'assets/images/social/rss/3.png' },
    { 'name': 'Business', 'image': 'assets/images/social/rss/4.png' },
    { 'name': 'Design', 'image': 'assets/images/social/rss/5.png' },
    { 'name': 'Politics', 'image': 'assets/images/social/rss/6.png' },
    { 'name': 'Science', 'image': 'assets/images/social/rss/7.png' },
    { 'name': 'Comics', 'image': 'assets/images/social/rss/8.png' }
  ];

  otherCategories = [
    { 'name': 'INDUSTRIES', 'value': ['Advertising', 'Areospace', 'Agriculture', 'Education', 'Healthcare', 'Travel & Hospitality', 'Media', 'Oil & Gas', 'Pharma', 'Private Equity', 'Retail'] },
    { 'name': 'TRENDS', 'value': ['Cryptocurrency', 'Mixed Reality', 'Internet of Things', 'Machine Learning', 'Clean Energy'] },
    { 'name': 'SKIILS', 'value': ['Entrepreneurship', 'Leadership', 'Economics', 'Programming', 'SEO', 'Management', 'Photography', 'Data Science', 'Writing', 'Creativity', 'Content Marketing'] },
    { 'name': 'FUN', 'value': ['Comics', 'Gaming', 'Food', 'Fashion', 'Travel', 'Music', 'Culture', 'Crafts', 'Dating'] }
  ]
  constructor() { }

  ngOnInit() {
  }

}
