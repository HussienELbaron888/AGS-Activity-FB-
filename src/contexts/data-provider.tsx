
'use client';

import React, { createContext, useState, useContext, useMemo } from 'react';
import type { Activity, Registration, TalentedStudent } from '@/lib/types';
import { 
    activities as initialActivities, 
    registrations as initialRegistrations, 
    talentedStudents as initialTalentedStudents 
} from '@/lib/data';

interface DataContextType {
  activities: Activity[];
  registrations: Registration[];
  talentedStudents: TalentedStudent[];
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  updateActivity: (id: string, updates: Partial<Omit<Activity, 'id'>>) => void;
  deleteActivity: (id: string) => void;
  addTalentedStudent: (student: Omit<TalentedStudent, 'id'>) => void;
  updateTalentedStudent: (id: string, updates: Partial<Omit<TalentedStudent, 'id'>>) => void;
  deleteTalentedStudent: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);
  const [talentedStudents, setTalentedStudents] = useState<TalentedStudent[]>(initialTalentedStudents);

  const addActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = { id: `act-${Date.now()}`, ...activity };
    setActivities(prev => [...prev, newActivity]);
  };

  const updateActivity = (id: string, updates: Partial<Omit<Activity, 'id'>>) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const addTalentedStudent = (student: Omit<TalentedStudent, 'id'>) => {
    const newStudent: TalentedStudent = { id: `ts-${Date.now()}`, ...student };
    setTalentedStudents(prev => [...prev, newStudent]);
  };

  const updateTalentedStudent = (id: string, updates: Partial<Omit<TalentedStudent, 'id'>>) => {
    setTalentedStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteTalentedStudent = (id: string) => {
    setTalentedStudents(prev => prev.filter(s => s.id !== id));
  };

  const value = useMemo(() => ({
    activities,
    registrations,
    talentedStudents,
    addActivity,
    updateActivity,
    deleteActivity,
    addTalentedStudent,
    updateTalentedStudent,
    deleteTalentedStudent,
  }), [activities, registrations, talentedStudents]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
