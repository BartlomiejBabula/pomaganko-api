import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Res,
  Req,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotosService } from './photos.service';
import { diskStorage } from 'multer';
import { fileName, imgFilter } from './multer/photos.utils';
import { CreatePhotoDto } from './dto/createPhoto';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post(':id/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploadedPhotos',
        filename: fileName,
      }),
      fileFilter: imgFilter,
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  uploadFile(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    if (req.fileValidationError)
      throw new BadRequestException('Only image files are allowed!');
    const photo = new CreatePhotoDto();
    photo.name = file.filename;
    photo.url = file.path;
    photo.state = 'active';
    photo.userId = id;
    return this.photosService.create(photo);
  }

  @Get(':imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './uploadedPhotos' });
  }
}
