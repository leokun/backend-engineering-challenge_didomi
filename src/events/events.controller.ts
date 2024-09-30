import { Body, Controller, NotFoundException, Post } from '@nestjs/common'
import { PostEventDto } from './dto/post-event.dto'
import { EventsService } from './events.service'

@Controller('consents')
export class EventsController {
  constructor(private readonly service: EventsService) { }

  @Post()
  post(@Body() postConsentDto: PostEventDto) {
    try {
      this.service.post(postConsentDto)
      this.service.saveHistory(postConsentDto)
    } catch (_error) {
      throw new NotFoundException('User not found')
    }
  }
}
