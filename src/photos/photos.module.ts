import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { Photo } from 'src/entities/photos.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Photo])],
  exports: [PhotosService],
  providers: [PhotosService],
  controllers: [PhotosController],
})
export class PhotosModule {}
