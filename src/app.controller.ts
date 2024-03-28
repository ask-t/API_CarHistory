import { Controller, Redirect } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Redirect('http://localhost:3100/api', 301)
  // Fix for Problem 1 and Problem 2
  handleGetRequest(): void {}
}
