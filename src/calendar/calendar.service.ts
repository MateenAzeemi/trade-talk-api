import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class CalendarService {
  private oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  constructor() {}

  async createEvent(accessToken: string, eventDetails: any) {
    try {
        console.log("Access Token:", accessToken);
        console.log("Event Details:", eventDetails);

        if (!eventDetails) {
            throw new Error("eventDetails is undefined");
        }

        this.oauth2Client.setCredentials({ access_token: accessToken });

        const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

        const event = {
            summary: eventDetails.summary || "No title",
            description: eventDetails.description || "",
            start: {
                dateTime: eventDetails.startTime, 
                timeZone: 'America/New_York',
            },
            end: {
                dateTime: eventDetails.endTime,
                timeZone: 'America/New_York',
            },
            attendees: eventDetails.attendees || [],
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
        });

        console.log("Event Created:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating event:", error.message);
        throw new Error(error.message);
    }
}

}
