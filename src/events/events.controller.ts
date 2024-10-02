import { Body, Controller, NotFoundException, Post } from '@nestjs/common'
import { PostEventDto } from './dto/post-event.dto'
import { EventsService } from './events.service'

@Controller('events')
export class EventsController {
  constructor(private readonly service: EventsService) { }

  @Post()
  async post(@Body() postConsentDto: PostEventDto) {
    try {
      await this.service.post(postConsentDto)
      await this.service.saveHistory(postConsentDto)
    } catch (_error) {
      console.dir(_error, { depth: null })
      throw new NotFoundException('User not found')
    }
  }
}
