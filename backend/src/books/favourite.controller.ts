import {
  Controller, Post, Delete, Get,
  Param, ParseIntPipe, Req, UseGuards
} from '@nestjs/common'
import { FavouriteService } from './favourite.service'
import { JwtAuthGuard } from 'src/guards/jwt-auth/jwt-auth.guard'


@Controller('favourites')
export class FavouriteController {

  constructor(private favService: FavouriteService) {}

  
  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getStats() {
    return this.favService.getFavouriteStats()
  }
  @UseGuards(JwtAuthGuard)
  @Get('mine')
  getMine(@Req() req) {
    return this.favService.getUserFavourites(req.user.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Post(':bookId')
  add(@Param('bookId', ParseIntPipe) bookId: number, @Req() req) {
    return this.favService.addFavourite(req.user.userId, bookId)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':bookId')
  remove(@Param('bookId', ParseIntPipe) bookId: number, @Req() req) {
    return this.favService.removeFavourite(req.user.userId, bookId)
  }
}