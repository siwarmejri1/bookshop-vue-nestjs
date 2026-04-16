import { Body, ConflictException, Controller,Delete, Get, Inject, Param,ParseIntPipe, Post, Put} from '@nestjs/common'
import { AuthorService } from './author.service'

@Controller('author')
export class AuthorController {

  @Inject(AuthorService)
  private authService: AuthorService

  @Get('all')
  async recupererTousLesAuteurs() {
    try {
      return await this.authService.getAllAuthors()
    } catch {
      throw new ConflictException()
    }
  }

  @Post('add')
  async ajouterAuteur( @Body() body ) {
    try {
      return await this.authService.addAuthor(body)
    } catch {
      throw new ConflictException()
    }
  }
  @Put('edit/:id')
  async modifierAuteur(
    @Param('id', ParseIntPipe) id: number, @Body() body ) {
    return await this.authService.updateAuthor(id, body)
  }

  @Delete('delete/:id')
  async supprimerAuteur(@Param('id', ParseIntPipe) id: number) {
    return await this.authService.deleteAuthor(id)
  }
}