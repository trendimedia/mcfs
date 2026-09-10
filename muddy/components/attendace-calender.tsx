// components/attendance-calendar.tsx
"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, DateSelectArg, EventClickArg, EventContentArg } from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import { markAttendance } from "@/app/profile/action";
//import { markAttendance } from "@/app/dashboard/profile/action";

interface AttendanceCalendarEvent extends EventInput {
  extendedProps: { calendar: string };
}

const statusToColor: Record<string, string> = {
  Present: "Success",
  Absent: "Danger",
  "Half Day": "Warning",
};

export default function AttendanceCalendar({
  initialEvents,
  employeeCode,
  isAdmin,
}: {
  initialEvents: { date: string; status: "present" | "absent" | "half_day" }[];
  employeeCode: string;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Present");
  const [targetEmployeeCode, setTargetEmployeeCode] = useState(employeeCode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusLabel: Record<string, "Present" | "Absent" | "Half Day"> = {
    present: "Present",
    absent: "Absent",
    half_day: "Half Day",
  };

  const events: AttendanceCalendarEvent[] = initialEvents.map((e) => ({
    id: e.date,
    title: statusLabel[e.status],
    start: e.date,
    allDay: true,
    extendedProps: { calendar: statusToColor[statusLabel[e.status]] },
  }));

  const todayStr = new Date().toISOString().split("T")[0];

  const resetModalFields = () => {
    setSelectedStatus("Present");
    setTargetEmployeeCode(employeeCode);
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    if (!isAdmin && selectInfo.startStr !== todayStr) {
      alert("You can only mark today's attendance.");
      return;
    }
    resetModalFields();
    setSelectedDate(selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const dateStr = clickInfo.event.startStr;
    if (!isAdmin && dateStr !== todayStr) return;
    setSelectedDate(dateStr);
    openModal();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const statusMap: Record<string, "present" | "absent" | "half_day"> = {
      Present: "present",
      Absent: "absent",
      "Half Day": "half_day",
    };
    try {
      await markAttendance(selectedDate, statusMap[selectedStatus], isAdmin ? targetEmployeeCode : employeeCode);
      router.refresh();
      closeModal();
      resetModalFields();
    } catch (err) {
      console.error("Failed to mark attendance:", err);
      alert("Failed to mark attendance — check console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,timeGridWeek",
          }}
          events={events}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
        />
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] p-6 lg:p-10">
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              Mark Attendance
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">{selectedDate}</p>
          </div>

          <div className="mt-8">
            {isAdmin && (
              <div className="mb-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Employee Code
                </label>
                <input
                  type="text"
                  value={targetEmployeeCode}
                  onChange={(e) => setTargetEmployeeCode(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:text-white/90"
                />
              </div>
            )}

            <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
              Status
            </label>
            <div className="flex flex-wrap items-center gap-4 sm:gap-5">
              {Object.keys(statusToColor).map((key) => (
                <div key={key} className="n-chk">
                  <label className="flex items-center text-sm text-gray-700 dark:text-gray-400" htmlFor={`status-${key}`}>
                    <span className="relative">
                      <input
                        className="sr-only"
                        type="radio"
                        name="attendance-status"
                        value={key}
                        id={`status-${key}`}
                        checked={selectedStatus === key}
                        onChange={() => setSelectedStatus(key)}
                      />
                      <span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full dark:border-gray-700">
                        <span className={`h-2 w-2 rounded-full bg-white ${selectedStatus === key ? "block" : "hidden"}`}></span>
                      </span>
                    </span>
                    {key}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 sm:w-auto"
            >
              Close
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              type="button"
              className="flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60 sm:w-auto"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const renderEventContent = (eventInfo: EventContentArg) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}>
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};