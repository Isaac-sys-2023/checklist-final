"use client";
import React, { useEffect, useState } from "react";
import "@/styles/app/tasksStyles.css";
import { Task } from "@/types/Tasks";

interface DayData {
  day: number;
  completed: number;
  pending: number;
}

const monthColors = [
  "#00ffff", // Cyan
  "#ff00ff", // Magenta
  "#ffff00", // Amarillo
  "#00bfff", // Azul cielo
  "#ff9900", // Naranja
  "#ff66cc", // Rosa
  "#9933ff", // Púrpura
  "#66ffcc", // Turquesa
  "#ffcc00", // Dorado
  "#66ccff", // Azul claro
  "#ff6699", // Rosa fuerte
  "#ccff33", // Lima
];

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthName = today.toLocaleString("default", { month: "long" });

  // Generar días del mes
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Color neón del mes (evitando los prohibidos)
  const neonColor = monthColors[month];

  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = domingo

  // Crear días vacíos para empezar en el día correcto
  const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => (
    <div key={`empty-${i}`} className="calendar-day empty"></div>
  ));

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    console.log(API_URL);
    try {
      fetch(`${API_URL}/tasks`)
        .then((res) => res.json())
        .then((data) => {
          {
            console.log(data);
            setTasks(
              data.filter(
                (task: Task) =>
                  task.day &&
                  Number(task.day.split("-")[1]) - 1 === new Date().getMonth()
              ) as Task[]
            );
          }
        });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, []);

  const daysData: DayData[] = Array.from({ length: daysInMonth }, (_, i) => {
    const dayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      i + 1
    ).padStart(2, "0")}`;

    return {
      day: i + 1,
      completed: tasks.filter((task) => task.day === dayStr && task.completed)
        .length,
      pending: tasks.filter((task) => task.day === dayStr && !task.completed)
        .length,
    };
  });

  return (
    <div className="calendar-container">
      <h1 className="calendar-title">
        TAREAS DEL MES {monthName.toUpperCase()} DE {year}
      </h1>
      <div className="calendar-grid">
        {emptyDays}
        {daysData.map(({ day, completed, pending }) => {
          const isToday = day === today.getDate();
          return (
            <div
              key={day}
              className={`calendar-day ${isToday ? "today" : ""}`}
              style={{
                borderColor: isToday ? "#fff" : neonColor,
                boxShadow: isToday
                  ? `0 0 8px #fff, 0 0 16px #fff`
                  : `0 0 5px ${neonColor}, 0 0 15px ${neonColor}`,
              }}
            >
              <div className="day-number">{day}</div>
              {pending > 0 && (
                <div className="tasks-info pending">
                  {pending} faltantes{" "}
                  <span style={{ color: "#ff0044" }}>⬤</span>
                </div>
              )}
              {completed > 0 && (
                <div className="tasks-info completed">
                  {completed} hechas <span style={{ color: "#00ff88" }}>⬤</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Page;
