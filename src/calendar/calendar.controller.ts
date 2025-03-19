import { Controller, Post, Body } from '@nestjs/common';
import { CalendarService } from './calendar.service';

@Controller('calendar')
export class CalendarController {
    constructor(private readonly calendarService: CalendarService) {}

    @Post('create-event')
    async createEvent(@Body() body: any) {
        console.log("Received Body:", body);

        if (!body.accessToken || !body.summary) {
            return { error: "Invalid request: Missing required fields" };
        }

        return this.calendarService.createEvent(body.accessToken, body);
    }
}
