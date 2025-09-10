
'use client';

import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
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
  addRegistration: (registration: Omit<Registration, 'id' | 'registrationDate'>) => void;
  addTalentedStudent: (student: Omit<TalentedStudent, 'id'>) => void;
  updateTalentedStudent: (id: string, updates: Partial<Omit<TalentedStudent, 'id'>>) => void;
  deleteTalentedStudent: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper function to get data from localStorage
const getFromStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    // If the stored item is an empty array string, return the fallback to ensure initial data is loaded once.
    if (item === '[]' && fallback.length > 0) {
        setInStorage(key, fallback);
        return fallback;
    }
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return fallback;
  }
};

// Helper function to set data in localStorage
const setInStorage = <T>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage key “${key}”:`, error);
  }
};


export function DataProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>(() => getFromStorage('activitiesData', initialActivities));
  const [registrations, setRegistrations] = useState<Registration[]>(() => getFromStorage('registrationsData', initialRegistrations));
  const [talentedStudents, setTalentedStudents] = useState<TalentedStudent[]>(() => getFromStorage('talentedStudentsData', initialTalentedStudents));

  useEffect(() => {
    setInStorage('activitiesData', activities);
  }, [activities]);

  useEffect(() => {
    setInStorage('registrationsData', registrations);
  }, [registrations]);

  useEffect(() => {
    setInStorage('talentedStudentsData', talentedStudents);
  }, [talentedStudents]);


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
  
  const addRegistration = (registration: Omit<Registration, 'id' | 'registrationDate'>) => {
    const newRegistration: Registration = {
        id: `reg-${Date.now()}`,
        ...registration,
        registrationDate: new Date().toISOString().split('T')[0] // 'YYYY-MM-DD'
    };
    setRegistrations(prev => [newRegistration, ...prev]);
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
    addRegistration,
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
