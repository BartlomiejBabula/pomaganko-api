import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from 'src/entities/photos.entity';
import { CreatePhotoDto } from './dto/createPhoto';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private photosRepository: Repository<Photo>,
  ) {}

  async create(createPhotoDto: CreatePhotoDto): Promise<Photo> {
    const photo = new Photo();
    photo.userId = createPhotoDto.userId;
    photo.name = createPhotoDto.name;
    photo.state = createPhotoDto.state;
    photo.url = createPhotoDto.url;
    return this.photosRepository.save(photo).catch((e) => {
      throw new BadRequestException("User with that id doesn't exist");
    });
  }
}
