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

        const activitiesForDay = activityDates.filter((date) =>
          isSameDay(date, currentDate)
        );
        const hasActivity = activitiesForDay.length > 0;
        const hasMultipleActivities = activitiesForDay.length > 1; // Check for multiple activities on the same day

        currentWeek[dayOfWeek] = {
          date: currentDate,
          hasActivity,
          hasMultipleActivities,
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
    <div className="w-full max-w-screen-lg mx-auto">
      <div className="sticky left-0">
        <h1 className="text-2xl font-bold my-2">Activity Calendar</h1>
      </div>

      {calendarData.map((yearData) => (
        <div key={yearData.year} className="mb-8">
          <div className="sticky left-0">
            <h3 className="text-base sm:text-lg font-medium mb-2">
              {yearData.year}
            </h3>
          </div>

          <div className="flex">
            <div className="sticky left-0 pr-2 text-[10px] text-gray-500 mt-2 min-w-[20px] z-10">
              <div className="flex flex-col h-[70px] lg:h-[80px] justify-between">
                <div className="flex items-center"></div>
                <div className="flex items-center">Mon</div>
                <div className="flex items-center"></div>
                <div className="flex items-center">Wed</div>
                <div className="flex items-center"></div>
                <div className="flex items-center">Fri</div>
                <div className="flex items-center"></div>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="flex justify-start md:justify-center">
                <div className="flex flex-nowrap">
                  {yearData.weeks.map((week, weekIndex) => (
                    <div
                      key={weekIndex}
                      className="flex flex-col mr-[2px] sm:mr-[3px]"
                    >
                      {Array(7)
                        .fill(0)
                        .map((_, dayIndex) => {
                          const dayData = week[dayIndex];
                          return (
                            <div
                              key={dayIndex}
                              className={`w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] m-[1px] ${
                                dayData?.hasMultipleActivities
                                  ? "bg-yellow-500"
                                  : dayData?.hasActivity
                                  ? "bg-green-500"
                                  : "bg-gray-200"
                              }`}
                              title={
                                dayData?.date
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityCalendar;
