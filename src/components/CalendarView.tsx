// Full Calendar View - Year/Month/Week/Day
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CONFIG } from '../constants/config';
import {
  useCalendarStore,
  getDaysInMonth,
  getFirstDayOfMonth,
  MONTHS,
  DAYS,
} from '../stores/calendarStore';

const { COLORS, SPACING, RADIUS } = CONFIG;

// Year View - 12 month grid
function YearView() {
  const { selectedYear, setViewMode, setSelectedMonth, setSelectedYear } = useCalendarStore();
  
  const goToPrevYear = () => setSelectedYear(selectedYear - 1);
  const goToNextYear = () => setSelectedYear(selectedYear + 1);
  
  const selectMonth = (month: number) => {
    setSelectedMonth(month);
    setViewMode('month');
  };
  
  return (
    <View style={styles.yearContainer}>
      <View style={styles.yearHeader}>
        <TouchableOpacity onPress={goToPrevYear}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.yearTitle}>{selectedYear}</Text>
        <TouchableOpacity onPress={goToNextYear}>
          <Ionicons name="chevron-forward" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.monthsGrid}>
        {MONTHS.map((month, index) => (
          <TouchableOpacity
            key={month}
            style={styles.monthCard}
            onPress={() => selectMonth(index)}
          >
            <Text style={styles.monthName}>{month.slice(0, 3)}</Text>
            <MiniMonth month={index} year={selectedYear} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Mini month for year view
function MiniMonth({ month, year }: { month: number; year: number }) {
  const today = new Date();
  const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();
  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);
  
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  
  return (
    <View style={styles.miniMonth}>
      {days.slice(0, 35).map((day, index) => (
        <View key={index} style={styles.miniDay}>
          {day !== null && (
            <Text style={[
              styles.miniDayText,
              isCurrentMonth && day === today.getDate() && styles.miniDayToday
            ]}>
              {day}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

// Month View - Full month calendar
function MonthView() {
  const { 
    selectedMonth, 
    selectedYear, 
    selectedDate,
    setSelectedMonth, 
    setSelectedYear,
    setSelectedDate,
    setViewMode 
  } = useCalendarStore();
  
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const isCurrentMonth = selectedMonth === today.getMonth() && selectedYear === today.getFullYear();
  
  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
  
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);
  
  const goToPrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };
  
  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };
  
  const selectDay = (day: number) => {
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setViewMode('day');
  };
  
  const isToday = (day: number) => isCurrentMonth && day === today.getDate();
  const isSelected = (day: number) => {
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateStr === selectedDate;
  };
  
  return (
    <View style={styles.monthContainer}>
      <View style={styles.monthHeader}>
        <TouchableOpacity onPress={goToPrevMonth}>
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setViewMode('year')}>
          <Text style={styles.monthHeaderTitle}>
            {MONTHS[selectedMonth]} {selectedYear}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goToNextMonth}>
          <Ionicons name="chevron-forward" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.dayHeadersRow}>
        {DAYS.map((day) => (
          <Text key={day} style={styles.dayHeaderText}>{day}</Text>
        ))}
      </View>
      
      <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={styles.calendarCell}
            onPress={() => day && selectDay(day)}
            disabled={day === null}
          >
            {day !== null && (
              <View style={[
                styles.calendarDayContent,
                isToday(day) && styles.todayCell,
                isSelected(day) && styles.selectedCell,
              ]}>
                <Text style={[
                  styles.calendarDayText,
                  isToday(day) && styles.todayText,
                  isSelected(day) && styles.selectedText,
                ]}>
                  {day}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Day View - Single day details
function DayView() {
  const { selectedDate, setViewMode, dayData } = useCalendarStore();
  const data = dayData[selectedDate];
  
  const date = new Date(selectedDate + 'T12:00:00');
  const dayName = DAYS[date.getDay()];
  const monthName = MONTHS[date.getMonth()];
  
  return (
    <ScrollView style={styles.dayContainer}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => setViewMode('month')}
      >
        <Ionicons name="chevron-back" size={20} color={COLORS.accent} />
        <Text style={styles.backText}>Back to Month</Text>
      </TouchableOpacity>
      
      <View style={styles.dayHeader}>
        <Text style={styles.dayDateLarge}>{date.getDate()}</Text>
        <View>
          <Text style={styles.dayName}>{dayName}</Text>
          <Text style={styles.dayMonth}>{monthName} {date.getFullYear()}</Text>
        </View>
      </View>
      
      {/* Health Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="heart" size={18} color={COLORS.success} />
          <Text style={styles.sectionTitle}>Health</Text>
        </View>
        {data?.health?.meals?.map((meal, i) => (
          <Text key={i} style={styles.sectionItem}>• {meal}</Text>
        )) || <Text style={styles.sectionEmpty}>No meals logged</Text>}
        {data?.health?.workout && (
          <Text style={styles.sectionItem}>🏋️ {data.health.workout}</Text>
        )}
      </View>
      
      {/* Deals Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="briefcase" size={18} color={COLORS.accent} />
          <Text style={styles.sectionTitle}>Deals</Text>
        </View>
        {data?.deals?.map((deal, i) => (
          <Text key={i} style={styles.sectionItem}>• {deal}</Text>
        )) || <Text style={styles.sectionEmpty}>No deal activity</Text>}
      </View>
      
      {/* Events Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="calendar" size={18} color={COLORS.warning} />
          <Text style={styles.sectionTitle}>Events</Text>
        </View>
        {data?.events?.map((event, i) => (
          <View key={i} style={styles.eventItem}>
            <Text style={styles.eventTime}>{event.time || 'All day'}</Text>
            <Text style={styles.eventTitle}>{event.title}</Text>
          </View>
        )) || <Text style={styles.sectionEmpty}>No events</Text>}
      </View>
    </ScrollView>
  );
}

// Main Calendar View component
export function CalendarView() {
  const { viewMode, goToToday } = useCalendarStore();
  
  return (
    <SafeAreaView style={styles.container}>
      {/* View mode tabs */}
      <View style={styles.viewTabs}>
        <ViewModeTab mode="year" label="Year" />
        <ViewModeTab mode="month" label="Month" />
        <ViewModeTab mode="week" label="Week" />
        <ViewModeTab mode="day" label="Day" />
        
        <TouchableOpacity style={styles.todayButton} onPress={goToToday}>
          <Text style={styles.todayButtonText}>Today</Text>
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      <ScrollView style={styles.content}>
        {viewMode === 'year' && <YearView />}
        {viewMode === 'month' && <MonthView />}
        {viewMode === 'week' && <MonthView />} {/* TODO: Week view */}
        {viewMode === 'day' && <DayView />}
      </ScrollView>
    </SafeAreaView>
  );
}

function ViewModeTab({ mode, label }: { mode: 'year' | 'month' | 'week' | 'day'; label: string }) {
  const { viewMode, setViewMode } = useCalendarStore();
  const isActive = viewMode === mode;
  
  return (
    <TouchableOpacity
      style={[styles.viewTab, isActive && styles.viewTabActive]}
      onPress={() => setViewMode(mode)}
    >
      <Text style={[styles.viewTabText, isActive && styles.viewTabTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  viewTabs: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSubtle,
  },
  viewTab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
  },
  viewTabActive: {
    backgroundColor: COLORS.accent,
  },
  viewTabText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  viewTabTextActive: {
    color: COLORS.text,
  },
  todayButton: {
    marginLeft: 'auto',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  todayButtonText: {
    fontSize: 13,
    color: COLORS.accent,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  
  // Year View
  yearContainer: {
    padding: SPACING.base,
  },
  yearHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  yearTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  monthCard: {
    width: '31%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  monthName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  miniMonth: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  miniDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniDayText: {
    fontSize: 7,
    color: COLORS.textTertiary,
  },
  miniDayToday: {
    color: COLORS.accent,
    fontWeight: '700',
  },
  
  // Month View
  monthContainer: {
    padding: SPACING.base,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  monthHeaderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  dayHeadersRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  dayHeaderText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textTertiary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  calendarDayContent: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  todayCell: {
    backgroundColor: COLORS.accent,
  },
  selectedCell: {
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  calendarDayText: {
    fontSize: 16,
    color: COLORS.text,
  },
  todayText: {
    fontWeight: '700',
  },
  selectedText: {
    color: COLORS.accent,
  },
  
  // Day View
  dayContainer: {
    flex: 1,
    padding: SPACING.base,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  backText: {
    fontSize: 14,
    color: COLORS.accent,
    marginLeft: 4,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.base,
    marginBottom: SPACING.xl,
  },
  dayDateLarge: {
    fontSize: 48,
    fontWeight: '700',
    color: COLORS.text,
  },
  dayName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  dayMonth: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginBottom: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  sectionItem: {
    fontSize: 14,
    color: COLORS.text,
    paddingVertical: 4,
  },
  sectionEmpty: {
    fontSize: 14,
    color: COLORS.textTertiary,
    fontStyle: 'italic',
  },
  eventItem: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingVertical: 6,
  },
  eventTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
    width: 60,
  },
  eventTitle: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
  },
});
