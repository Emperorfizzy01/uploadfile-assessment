import { Controller, Get, Param, Headers, Put, UseInterceptors, UploadedFile, Body, Res } from '@nestjs/common';
import { FileInterceptor } from "@nestjs/platform-express";
import { AppService } from './app.service';
import { Helper } from '../sharedhelper';
import { diskStorage } from 'multer';


@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  getMime(@Headers('mime') mime: string): Promise<any> {
    return this.appService.getMime(mime);
  }

  @Put('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: Helper.destinationPath,
        filename: Helper.customFileName,
      }),
    }),)

  uploadFile(@UploadedFile() file, @Headers('token') token: string,): Promise<any> {
    console.log(file)
     return this.appService.uploadFile(token, file);
  }

  @Get(':filepath')
  seeUploadedFile(@Param('filepath') file, @Res() res) {
    return res.sendFile(file, { root: './uploads' });
  }
}
