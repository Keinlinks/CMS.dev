import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpCode,
  ParseFilePipeBuilder,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateTestimonialDto } from '../dto/create-testimonial.dto';
import { UpdateTestimonialDto } from '../dto/update-testimonial.dto';
import { TestimonialsService } from '../services/testimonials.service'; 
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/common/guards/roles.decorator';
import { MediaType } from '../enums/mediaType';
import { TestimonialsParamsDto } from '../dto/testimonials.params.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Testimonial } from '../entities/testimonial.entity';
import { TestimonialResponseDto } from '../dto/testimonialResponse.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { InviteTestimonialDto } from '../dto/invite-testimonial.dto';
import { WallTestimonialsParamsDto } from '../dto/wallTestimonials.params.dto';
import { ChangeStatusDto } from '../dto/change-status.dto';
import { CreateTestimonialsUseCase } from '../useCases/createTestimonial.useCase';
import { InviteTestimonialUseCase } from '../useCases/inviteTestimonial.useCase';
import { FindOneTestimonialUseCase } from '../useCases/findOneTestimonial.useCase';
import { ChangeStatusTestimonialUseCase } from '../useCases/changeStatusTestimonial.useCase';
import { RemoveTestimonialUseCase } from '../useCases/removeTestimonial.useCase';

@Controller('testimonials')
export class TestimonialsController {
  constructor(
    private readonly testimonialsService: TestimonialsService,
    private readonly createTestimonialUseCase:CreateTestimonialsUseCase,
    private readonly inviteTestimonialUseCase:InviteTestimonialUseCase,
    private readonly findOneTestimonialUseCase:FindOneTestimonialUseCase,
    private readonly changeStatusTestimonialUseCase:ChangeStatusTestimonialUseCase,
    private readonly removeTestimonialUseCase:RemoveTestimonialUseCase
  ) {
  }
  
  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a testimonial with or without media attachment' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {}))
  create(
    @Body() createTestimonialDto: CreateTestimonialDto,
    @UploadedFile(new ParseFilePipeBuilder()
      .addMaxSizeValidator({ maxSize: 50 * 1024 * 1024 })
      .build({
        fileIsRequired: false,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),) file?: Express.Multer.File) {
    if (createTestimonialDto.media_type == MediaType.TEXT)
      return this.createTestimonialUseCase.createTestimonial(createTestimonialDto);

    if (!file)
      throw new UnprocessableEntityException('Media file is required for the selected media type');

    //VALIDATE that the file type matches the media type
    const mime = file.mimetype;
    if (!mime.startsWith('image') && !mime.startsWith('video'))
      throw new UnprocessableEntityException('Only image and video files are allowed');

    const type = createTestimonialDto.media_type;
    if (!mime.startsWith(type))
      throw new UnprocessableEntityException('Media type does not match the uploaded file');

    return this.createTestimonialUseCase.createTestimonialWithMedia(createTestimonialDto, file, file.originalname);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retrieve a list of testimonials with optional filtering and pagination' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: TestimonialResponseDto,
    isArray: true,
  })
  findAll(
    @Query() param: TestimonialsParamsDto,
    @GetUser() user
  ): Promise<Testimonial[]> {
    return this.testimonialsService.findAll(param,user.id);
  }
  @Get("wall")
  @Public()
  @ApiOperation({ summary: 'Retrieve a list of published testimonials of an organization' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: TestimonialResponseDto,
    isArray: true,
  })
  wallTestimonials(
    @Query() params: WallTestimonialsParamsDto,
  ): Promise<Testimonial[]> {
    return this.testimonialsService.findAllWallTestimonials(params);
  }

  @Post('invite')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('application/json')
  @ApiBody({ type: InviteTestimonialDto })
  @ApiOperation({ summary: 'Invite an end customer (or many) to submit a testimonial.' })
  inviteTestimonials(@Body() body: InviteTestimonialDto, @GetUser() user) {
    return this.inviteTestimonialUseCase.execute(body,user.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id', ParseUUIDPipe) id: string,@GetUser() user) {
    return this.findOneTestimonialUseCase.execute(id,user.id);
  }

  @Post('change-status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change status for a testimonial' })
  changeStatus(
    @Body() body:ChangeStatusDto,
    @GetUser() user
  ) {
    return this.changeStatusTestimonialUseCase.execute(body.testimonialId, user.id, body.status);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string,@GetUser() user) {
    return this.removeTestimonialUseCase.execute(id,user.id);
  }
}
