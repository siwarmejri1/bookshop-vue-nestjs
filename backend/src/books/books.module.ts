import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { AuthorEntity } from './entities/author.entity';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { FavouriteEntity } from './entities/favourite.entity'      
import { FavouriteService } from './favourite.service'              
import { FavouriteController } from './favourite.controller'        

@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity, AuthorEntity, FavouriteEntity]) 
  ],
  controllers: [BooksController, AuthorController, FavouriteController],  
  providers:   [BooksService, AuthorService, FavouriteService],            
})
export class BooksModule {}
