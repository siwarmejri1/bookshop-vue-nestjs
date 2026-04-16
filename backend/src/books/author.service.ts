import {
  ConflictException, Injectable, NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AuthorEntity } from './entities/author.entity'

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(AuthorEntity)
    private authorRepo: Repository<AuthorEntity>
  ) {}

  async getAllAuthors() {
    return this.authorRepo.find()
  }

  async addAuthor(body) {
    const author = this.authorRepo.create(body)
    return this.authorRepo.save(author)
  }

  async updateAuthor(id: number, body) {
    const author = await this.authorRepo.preload({  ...body ,id })
    if (!author) throw new NotFoundException('Auteur introuvable')
    return this.authorRepo.save(author)
  }

  async deleteAuthor(id: number) {
    const author = await this.authorRepo.findOneBy({ id })
    if (!author) throw new NotFoundException('Auteur introuvable')
    await this.authorRepo.remove(author)
    return { message: `Auteur supprimé avec succès` }
  }
}