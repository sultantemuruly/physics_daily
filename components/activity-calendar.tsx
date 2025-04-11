import React, { useMemo } from "react";
import { format, addDays, startOfYear, isSameDay } from "date-fns";

interface ActivityCalendarProps {
  activityDates: Date[];
  startYear?: number;
  endYear?: number;
}

const ActivityCalendar: React.FC<ActivityCalendarProps> = ({
  activityDates,
  startYear = new Date().getFullYear(),
  endYear = new Date().getFullYear(),
}) => {
  const calendarData = useMemo(() => {
    const result = [];

    for (let year = startYear; year <= endYear; year++) {
      const yearStart = startOfYear(new Date(year, 0, 1));
      const daysInYear = year % 4 === 0 ? 366 : 365;

      const weeks = [];
      let currentWeek = [];

      for (let i = 0; i < daysInYear; i++) {
        const currentDate = addDays(yearStart, i);
        const dayOfWeek = currentDate.getDay();

        const hasActivity = activityDates.some((date) =>
          isSameDay(date, currentDate)
        );

        currentWeek[dayOfWeek] = {
          date: currentDate,
          hasActivity,
        };

        if (dayOfWeek === 6 || i === daysInYear - 1) {
          weeks.push([...currentWeek]);
          currentWeek = Array(7).fill(null);
        }
      }

      result.push({
        year,
        weeks,
      });
    }

    return result;
  }, [activityDates, startYear, endYear]);

  return (
    <div>
      {calendarData.map((yearData) => (
        <div key={yearData.year} className="mb-8">
          <h3 className="text-lg font-medium mb-2">{yearData.year}</h3>
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col justify-between pr-2 text-[10px] text-gray-500 h-[64px] mt-5">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Calendar grid */}
            <div className="flex flex-nowrap overflow-x-auto">
              {yearData.weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col mr-[3px]">
                  {Array(7)
                    .fill(0)
                    .map((_, dayIndex) => {
                      const dayData = week[dayIndex];
                      if (!dayData)
                        return (
                          <div
                            key={dayIndex}
                            className="w-[11px] h-[11px] m-[1px]"
                          ></div>
                        );

                      return (
                        <div
                          key={dayIndex}
                          className={`w-[11px] h-[11px] m-[1px] ${
                            dayData.hasActivity ? "bg-green-500" : "bg-gray-200"
                          }`}
                          title={
                            dayData.date
                              ? format(dayData.date, "yyyy-MM-dd")
                              : ""
                          }
                        />
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityCalendar;
