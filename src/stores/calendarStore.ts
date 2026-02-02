// Calendar Store - Zustand
import { create } from 'zustand';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  type: 'deal' | 'health' | 'task' | 'meeting' | 'note';
  details?: string;
}

export interface DayData {
  date: string;
  events: CalendarEvent[];
  health?: {
    meals: string[];
    workout?: string;
  };
  deals?: string[];
}

interface CalendarState {
  // Current view
  viewMode: 'year' | 'month' | 'week' | 'day';
  selectedDate: string; // YYYY-MM-DD
  selectedMonth: number; // 0-11
  selectedYear: number;
  
  // Data
  events: CalendarEvent[];
  dayData: Record<string, DayData>; // keyed by YYYY-MM-DD
  
  // Actions
  setViewMode: (mode: 'year' | 'month' | 'week' | 'day') => void;
  setSelectedDate: (date: string) => void;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  addEvent: (event: CalendarEvent) => void;
  setDayData: (date: string, data: DayData) => void;
  
  // Navigation helpers
  goToToday: () => void;
  goToMonth: (month: number, year: number) => void;
}

const today = new Date();

export const useCalendarStore = create<CalendarState>((set) => ({
  // Initial state
  viewMode: 'month',
  selectedDate: today.toISOString().split('T')[0],
  selectedMonth: today.getMonth(),
  selectedYear: today.getFullYear(),
  events: [],
  dayData: {},
  
  // Actions
  setViewMode: (mode) => set({ viewMode: mode }),
  
  setSelectedDate: (date) => set({ selectedDate: date }),
  
  setSelectedMonth: (month) => set({ selectedMonth: month }),
  
  setSelectedYear: (year) => set({ selectedYear: year }),
  
  addEvent: (event) => set((state) => ({
    events: [...state.events, event],
  })),
  
  setDayData: (date, data) => set((state) => ({
    dayData: { ...state.dayData, [date]: data },
  })),
  
  goToToday: () => {
    const now = new Date();
    set({
      selectedDate: now.toISOString().split('T')[0],
      selectedMonth: now.getMonth(),
      selectedYear: now.getFullYear(),
    });
  },
  
  goToMonth: (month, year) => set({
    selectedMonth: month,
    selectedYear: year,
  }),
}));

// Helper functions
export function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(month: number, year: number): number {
  return new Date(year, month, 1).getDay();
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
