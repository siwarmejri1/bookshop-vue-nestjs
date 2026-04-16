import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FavouriteEntity } from './entities/favourite.entity'

@Injectable()
export class FavouriteService {

  constructor(
    @InjectRepository(FavouriteEntity)
    private favRepo: Repository<FavouriteEntity>
  ) {}

  // Ajouter un favori
  async addFavourite(userId: number, bookId: number) {
    const exists = await this.favRepo.findOne({
      where: { user: { id: userId }, book: { id: bookId } }
    })
    if (exists) return exists
    const fav = this.favRepo.create({
      user: { id: userId },
      book: { id: bookId }
    })
    return this.favRepo.save(fav)
  }

  // Supprimer un favori
  async removeFavourite(userId: number, bookId: number) {
    const fav = await this.favRepo.findOne({
      where: { user: { id: userId }, book: { id: bookId } }
    })
    if (fav) await this.favRepo.remove(fav)
    return { message: 'Favori supprimé' }
  }

  // Récupérer les favoris d'un user
  async getUserFavourites(userId: number) {
    return this.favRepo.find({
      where: { user: { id: userId } },
      relations: { book: true }
    })
  }
async getFavouriteStats() {
  return this.favRepo
    .createQueryBuilder('fav')
    .select('book.id',          'bookId')
    .addSelect('book.title',    'bookTitle')
    .addSelect('book.image',    'bookImage')
    .addSelect('COUNT(fav.id)', 'totalLikes')
    .leftJoin('fav.book', 'book')
    .groupBy('book.id')
    .orderBy('totalLikes', 'DESC')
    .getRawMany()
}
}