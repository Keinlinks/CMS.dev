import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { QueryParamsDto } from 'src/common/dto/queryParams.dto';
import { ApiBearerAuth } from '@nestjs/swagger';


@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiBearerAuth()
  findAll(@Query() param:QueryParamsDto) {
    return this.categoriesService.findAll(param);
  }

  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id);
  }
}
