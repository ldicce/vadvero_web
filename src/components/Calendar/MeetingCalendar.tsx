
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Meeting } from '@/types/database';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MeetingCalendarProps {
  meetings: Meeting[];
  onMeetingClick?: (meeting: Meeting) => void;
}

const MeetingCalendar: React.FC<MeetingCalendarProps> = ({ 
  meetings, 
  onMeetingClick 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getMeetingsForDate = (date: Date) => {
    return meetings.filter(meeting => 
      isSameDay(new Date(meeting.start_date), date)
    );
  };

  const selectedDateMeetings = getMeetingsForDate(selectedDate);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Calendário de Reuniões</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            locale={ptBR}
            className="w-full"
            modifiers={{
              hasMeeting: (date) => getMeetingsForDate(date).length > 0
            }}
            modifiersStyles={{
              hasMeeting: { 
                backgroundColor: '#3b82f6', 
                color: 'white',
                fontWeight: 'bold'
              }
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Reuniões - {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDateMeetings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhuma reunião agendada para esta data
            </p>
          ) : (
            <div className="space-y-4">
              {selectedDateMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => onMeetingClick?.(meeting)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {meeting.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {format(new Date(meeting.start_date), 'HH:mm')} - {' '}
                        {format(new Date(meeting.end_date), 'HH:mm')}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        📍 {meeting.location}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {meeting.is_online && (
                        <Badge variant="secondary">Online</Badge>
                      )}
                      {meeting.is_presential && (
                        <Badge variant="outline">Presencial</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MeetingCalendar;
