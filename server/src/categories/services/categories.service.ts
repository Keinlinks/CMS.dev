import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { Category } from '../entities/category.entity';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { QueryParamsDto } from 'src/common/dto/queryParams.dto';


@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async findAll(param:QueryParamsDto): Promise<Category[]> {
    const { page = 1, itemsPerPage = 20, sort = 'ASC' } = param;
    const limit = itemsPerPage;
    const offset = (page - 1) * itemsPerPage;
    
    return this.categoriesRepository.find({
      skip: offset,
      take: limit,
      order:{
        createdAt: sort
      }
    });
  }

  async findOne(id: string): Promise<Category | null> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['testimonials'],
    });
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category | null> {
    const category = await this.findOne(id);
    if(!category)
      return category;
    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async remove(id: string): Promise<boolean> {
    const category = await this.findOne(id);
    if(!category)
      return false;
    await this.categoriesRepository.remove(category);
    return true;
  }
}
