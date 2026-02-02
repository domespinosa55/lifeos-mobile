// Calendar Widget - Home Screen Mini Calendar
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
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

export function CalendarWidget() {
  const router = useRouter();
  const { selectedMonth, selectedYear, selectedDate, setSelectedMonth, setSelectedYear } = useCalendarStore();
  
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const isCurrentMonth = selectedMonth === today.getMonth() && selectedYear === today.getFullYear();
  
  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
  
  // Generate calendar grid
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }
  
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
  
  const isToday = (day: number) => {
    return isCurrentMonth && day === today.getDate();
  };
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push('/calendar')}
      activeOpacity={0.8}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPrevMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-back" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
        
        <Text style={styles.monthTitle}>
          {MONTHS[selectedMonth]} {selectedYear}
        </Text>
        
        <TouchableOpacity onPress={goToNextMonth} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
      
      {/* Day headers */}
      <View style={styles.dayHeaders}>
        {DAYS.map((day) => (
          <Text key={day} style={styles.dayHeader}>{day[0]}</Text>
        ))}
      </View>
      
      {/* Calendar grid */}
      <View style={styles.grid}>
        {calendarDays.map((day, index) => (
          <View key={index} style={styles.dayCell}>
            {day !== null && (
              <View style={[styles.dayContent, isToday(day) && styles.todayContent]}>
                <Text style={[styles.dayText, isToday(day) && styles.todayText]}>
                  {day}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
      
      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.todaySummary}>
          <View style={styles.dot} />
          <Text style={styles.footerText}>Today: {today.getDate()} {MONTHS[today.getMonth()]}</Text>
        </View>
        <Ionicons name="expand-outline" size={16} color={COLORS.textTertiary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.textTertiary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  dayContent: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  todayContent: {
    backgroundColor: COLORS.accent,
  },
  dayText: {
    fontSize: 13,
    color: COLORS.text,
  },
  todayText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderSubtle,
  },
  todaySummary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accent,
  },
  footerText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
