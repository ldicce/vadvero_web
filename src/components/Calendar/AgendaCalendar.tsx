
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Reuniao } from '@/types/database';
import { Badge } from '@/components/ui/badge';

interface AgendaCalendarProps {
  reunioes: Reuniao[];
  onDayClick: (date: Date, reunioes: Reuniao[]) => void;
  onCreateReuniao: () => void;
}

const AgendaCalendar: React.FC<AgendaCalendarProps> = ({ 
  reunioes, 
  onDayClick,
  onCreateReuniao 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getReuniaoesForDate = (date: Date) => {
    return reunioes.filter(reuniao => 
      isSameDay(new Date(reuniao.data_inicial), date)
    );
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getWeeks = () => {
    const weeks = [];
    let currentWeek = [];
    
    // Add empty cells for days before month start
    const firstDayOfWeek = monthStart.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }
    
    // Add all days of the month
    calendarDays.forEach((day, index) => {
      currentWeek.push(day);
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    // Add empty cells for remaining days
    while (currentWeek.length < 7 && currentWeek.length > 0) {
      currentWeek.push(null);
    }
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            Agenda - {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="hover:bg-[#4d8d6e]/10 hover:border-[#4d8d6e]"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="hover:bg-[#4d8d6e]/10 hover:border-[#4d8d6e]"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button onClick={onCreateReuniao} className="ml-4 bg-[#4d8d6e] hover:bg-[#3a6b54]">
              <Plus className="h-4 w-4 mr-2" />
              Nova Reunião
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {/* Header with week days */}
          {weekDays.map((day) => (
            <div key={day} className="p-2 text-center font-semibold text-gray-600 border-b">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {getWeeks().map((week, weekIndex) => 
            week.map((day, dayIndex) => {
              if (!day) {
                return <div key={`empty-${weekIndex}-${dayIndex}`} className="p-2 h-24" />;
              }
              
              const dayReunioes = getReuniaoesForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div
                  key={day.toISOString()}
                  className={`
                    p-2 h-24 border cursor-pointer transition-colors hover:bg-[#4d8d6e]/5
                    ${isCurrentMonth ? 'bg-white' : 'bg-gray-100 opacity-50'}
                    ${isToday ? 'bg-[#4d8d6e]/10 border-[#4d8d6e]' : 'border-gray-200'}
                  `}
                  onClick={() => onDayClick(day, dayReunioes)}
                >
                  <div className={`font-medium text-sm mb-1 ${isToday ? 'text-[#4d8d6e] font-bold' : 'text-gray-700'}`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayReunioes.slice(0, 2).map((reuniao) => (
                      <Badge 
                        key={reuniao.id} 
                        variant="secondary" 
                        className="text-xs p-1 h-auto bg-[#4d8d6e]/10 text-[#4d8d6e] border-[#4d8d6e]/20 block truncate"
                      >
                        {reuniao.titulo}
                      </Badge>
                    ))}
                    {dayReunioes.length > 2 && (
                      <Badge variant="outline" className="text-xs p-1 h-auto border-[#4d8d6e]/30 text-[#4d8d6e]">
                        +{dayReunioes.length - 2} mais
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgendaCalendar;
