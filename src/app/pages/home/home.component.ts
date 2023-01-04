import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/app/shared/services/configuration.service';
import { Page } from 'src/app/shared/types/Page.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  appPages: Page[] = [];

  constructor(private configurationService: ConfigurationService) {
    this.appPages = configurationService.getPages();
  }

  ngOnInit() {}
}
