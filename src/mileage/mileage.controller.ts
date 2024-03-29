import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { MileageService } from './mileage.service';
import { UpdateMileageDto } from './dto/update-mileage.dto';
import { CreateMileageDto } from './dto/create-mileage.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('mileage')
@Controller('mileage')
export class MileageController {
  constructor(private readonly mileageService: MileageService) {}

  @Post('reset')
  @ApiBody({
    type: CreateMileageDto,
    examples: {
      example1: {
        summary: 'Example 1',
        value: {
          from: 0,
          to: 0,
          gas: true,
        },
      },
    },
  })
  reset(@Body() createMileageDto: CreateMileageDto) {
    return this.mileageService.reset(createMileageDto);
  }
  @Post('checkin')
  checkin() {
    return this.mileageService.checkIN();
  }

  @Put('checkout')
  @ApiBody({
    type: UpdateMileageDto,
    examples: {
      example1: {
        summary: 'Example 1',
        value: {
          to: 0,
          gas: true,
          totalCost: 0,
        },
      },
      example2: {
        summary: 'Example 2',
        value: {
          to: 0,
          gas: false,
        },
      },
    },
  })
  checkout(@Body() updateMileageDto: UpdateMileageDto) {
    return this.mileageService.checkOUT(updateMileageDto);
  }

  @Get('all')
  findAll() {
    return this.mileageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mileageService.findOne(id);
  }

  @Delete('remove/:id')
  delete(@Param('id') id: string) {
    console.log(id);
    return this.mileageService.deleteMileageById(id);
  }
}
