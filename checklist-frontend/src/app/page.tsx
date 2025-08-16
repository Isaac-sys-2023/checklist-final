"use client";
import "@/styles/app/homeStyles.css";
import TaskDayList from "@/components/TaskDayList/TaskDayList";

export default function Home() {
  const getLocalTodayDateString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  console.log(getLocalTodayDateString());

  return (
    <div>
      <TaskDayList date={getLocalTodayDateString()} />
    </div>
  );
}
