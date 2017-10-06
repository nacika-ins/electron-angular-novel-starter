import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CoverService } from '../../services/cover.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})

export class StartComponent implements OnInit {
  constructor(
    private router: Router,
    private coverService: CoverService
  ) {
  }

  ngOnInit() {
  }

  game() {
    this.coverService.whiteGradation().then(() => {
      this.router.navigate(["./game"]);
    });
  }

  selectData() {
    this.router.navigate(["./select-data"]);
  }

  config() {
    this.router.navigate(["./config"]);
  }

}
