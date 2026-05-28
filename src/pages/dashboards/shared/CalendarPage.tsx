import { useState } from "react";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: "meeting" | "call" | "task" | "reminder";
  contact?: string;
  location?: string;
}

interface CalendarPageProps {
  mockEvents: Event[];
}

const eventTypeColors = {
  meeting: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  call: "bg-green-500/20 text-green-500 border-green-500/30",
  task: "bg-purple-500/20 text-purple-500 border-purple-500/30",
  reminder: "bg-orange-500/20 text-orange-500 border-orange-500/30",
};

export function CalendarPage({ mockEvents }: CalendarPageProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events] = useState<Event[]>(mockEvents);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad the start of the calendar
  const startDay = monthStart.getDay();
  const paddedDays = Array(startDay).fill(null).concat(days);

  const selectedDayEvents = events.filter((event) =>
    isSameDay(event.date, selectedDate)
  );

  const getEventsForDay = (date: Date) =>
    events.filter((event) => isSameDay(event.date, date));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your schedule and appointments
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 rounded-xl border border-border bg-card p-6"
        >
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentDate(new Date());
                  setSelectedDate(new Date());
                }}
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {paddedDays.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const dayEvents = getEventsForDay(day);
              const isSelected = isSameDay(day, selectedDate);
              const isTodayDate = isToday(day);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "aspect-square p-2 rounded-lg transition-colors relative",
                    "hover:bg-muted/50",
                    isSelected && "bg-primary/10 ring-2 ring-primary",
                    !isSameMonth(day, currentDate) && "text-muted-foreground/50"
                  )}
                >
                  <span
                    className={cn(
                      "text-sm",
                      isTodayDate && "font-bold text-primary"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  {dayEvents.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                      {dayEvents.slice(0, 3).map((event) => (
                        <span
                          key={event.id}
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            event.type === "meeting" && "bg-blue-500",
                            event.type === "call" && "bg-green-500",
                            event.type === "task" && "bg-purple-500",
                            event.type === "reminder" && "bg-orange-500"
                          )}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Selected Day Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card"
        >
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold">
              {format(selectedDate, "EEEE, MMMM d")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {selectedDayEvents.length} events scheduled
            </p>
          </div>

          <ScrollArea className="h-96">
            <div className="p-4 space-y-3">
              {selectedDayEvents.length > 0 ? (
                selectedDayEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge
                        variant="outline"
                        className={eventTypeColors[event.type]}
                      >
                        {event.type}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </p>
                      {event.contact && (
                        <p className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          {event.contact}
                        </p>
                      )}
                      {event.location && (
                        <p className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No events scheduled</p>
                  <Button variant="link" className="mt-2">
                    Add an event
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </motion.div>
      </div>
    </div>
  );
}
