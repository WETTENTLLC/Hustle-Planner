'use client';

import { useState, useEffect } from 'react';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';

interface AppointmentFormData {
  id: string;
  clientName: string;
  serviceType: string;
  date: string;
  time: string;
  notes: string;
}

const initialAppointmentData: Omit<AppointmentFormData, 'id'> = {
  clientName: '',
  serviceType: '',
  date: '',
  time: '',
  notes: ''
};

export default function PlannerForm() {
  const [appointments, setAppointments] = useState<AppointmentFormData[]>([]);
  const [formData, setFormData] = useState<Omit<AppointmentFormData, 'id'>>(initialAppointmentData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedAppointments = getLocalStorage<AppointmentFormData[]>('hustle-appointments', []);
    setAppointments(savedAppointments);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setLocalStorage('hustle-appointments', appointments);
  }, [appointments]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.time || !formData.clientName) {
      alert('Date, time and client name are required');
      return;
    }

    if (editingId) {
      setAppointments(appointments.map(appointment => 
        appointment.id === editingId 
          ? { ...formData, id: editingId } 
          : appointment
      ));
      setEditingId(null);
    } else {
      const newAppointment = {
        ...formData,
        id: Date.now().toString()
      };
      setAppointments([...appointments, newAppointment]);
    }

    setFormData(initialAppointmentData);
    setIsFormOpen(false);
  };

  const handleEdit = (appointment: AppointmentFormData) => {
    setFormData({
      clientName: appointment.clientName,
      serviceType: appointment.serviceType,
      date: appointment.date,
      time: appointment.time,
      notes: appointment.notes
    });
    setEditingId(appointment.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(appointments.filter(appointment => appointment.id !== id));
    }
  };

  // Format date for calendar display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dateString)) return dateString;
      
      const [year, month, day] = dateString.split('-').map(part => parseInt(part, 10));
      
      // Check if parts are valid numbers
      if (isNaN(year) || isNaN(month) || isNaN(day)) return dateString;
      
      return `${month}/${day}/${year}`;
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateString;
    }
  };

  // Group appointments by date for calendar view

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const startDay = firstDay.getDay(); // 0 (Sunday) to 6 (Saturday)
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }
    
    return days;
  };

  // Get month and year for display
  const getMonthYearDisplay = () => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    return currentDate.toLocaleDateString('en-US', options);
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Get appointments for a specific day
  const getAppointmentsForDay = (day: number) => {
    if (!day) return [];
    
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(appointment => appointment.date === dateStr);
  };

  return (
    <div className="space-y-6">
      {/* Header and actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Appointment Planner</h2>
        <div className="flex space-x-3 items-center">
          <div className="flex bg-gray-800/20 dark:bg-white/20 rounded-lg overflow-hidden">
            <button
              onClick={() => setView('calendar')}
              className={`px-3 py-1 text-sm ${view === 'calendar' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' : ''}`}
            >
              Calendar
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1 text-sm ${view === 'list' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' : ''}`}
            >
              List
            </button>
          </div>
          
          <button
            onClick={() => {
              setIsFormOpen(!isFormOpen);
              if (!isFormOpen) {
                setEditingId(null);
                setFormData(initialAppointmentData);
              }
            }}
            className="px-4 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-md text-sm"
          >
            {isFormOpen ? 'Cancel' : 'Add Appointment'}
          </button>
        </div>
      </div>
      
      {/* Appointment Form */}
      {isFormOpen && (
        <form 
          onSubmit={handleSubmit}
          className="bg-gray-800/30 dark:bg-white/30 rounded-lg p-4 mb-6"
        >
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Appointment' : 'New Appointment'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">
                Client Name *
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-800/50 border border-gray-700 dark:bg-white/50 dark:border-gray-300 rounded-lg px-3 py-2 text-white dark:text-gray-800"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">
                Service Type
              </label>
              <input
                type="text"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleInputChange}
                className="w-full bg-gray-800/50 border border-gray-700 dark:bg-white/50 dark:border-gray-300 rounded-lg px-3 py-2 text-white dark:text-gray-800"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-800/50 border border-gray-700 dark:bg-white/50 dark:border-gray-300 rounded-lg px-3 py-2 text-white dark:text-gray-800"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">
                Time *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-800/50 border border-gray-700 dark:bg-white/50 dark:border-gray-300 rounded-lg px-3 py-2 text-white dark:text-gray-800"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 dark:text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-gray-800/50 border border-gray-700 dark:bg-white/50 dark:border-gray-300 rounded-lg px-3 py-2 text-white dark:text-gray-800"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-md"
            >
              {editingId ? 'Update Appointment' : 'Save Appointment'}
            </button>
          </div>
        </form>
      )}
      
      {/* Calendar View */}
      {view === 'calendar' && (
        <div className="bg-gray-800/20 dark:bg-white/20 rounded-lg overflow-hidden">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700/30 dark:border-gray-300/30">
            <button onClick={prevMonth} className="p-1.5 rounded-full hover:bg-gray-700/30 dark:hover:bg-gray-300/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="text-lg font-medium">{getMonthYearDisplay()}</h3>
            <button onClick={nextMonth} className="p-1.5 rounded-full hover:bg-gray-700/30 dark:hover:bg-gray-300/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 border-b border-gray-700/30 dark:border-gray-300/30">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center py-2 text-sm font-medium text-gray-400 dark:text-gray-600">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7">
            {generateCalendarDays().map((day, index) => {
              const appointmentsForDay = day ? getAppointmentsForDay(day) : [];
              return (
                <div 
                  key={index} 
                  className={`min-h-[100px] p-2 border border-gray-700/30 dark:border-gray-300/30 ${!day ? 'bg-gray-900/20 dark:bg-gray-100/20' : ''}`}
                >
                  {day && (
                    <>
                      <div className="text-right text-sm mb-1">
                        {day}
                      </div>
                      <div className="space-y-1">
                        {appointmentsForDay.length > 0 ? (
                          appointmentsForDay.map((appointment) => (
                            <div 
                              key={appointment.id} 
                              className="bg-gradient-to-r from-pink-500/70 to-purple-600/70 rounded px-2 py-1 text-xs cursor-pointer"
                              onClick={() => handleEdit(appointment)}
                            >
                              {appointment.time} - {appointment.clientName}
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-gray-500">No appointments</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* List View */}
      {view === 'list' && (
        <div className="space-y-4">
          {appointments.length > 0 ? (
            appointments
              .sort((a, b) => {
                // Sort by date first, then by time
                if (a.date !== b.date) {
                  return a.date.localeCompare(b.date);
                }
                return a.time.localeCompare(b.time);
              })
              .map((appointment) => (
                <div 
                  key={appointment.id} 
                  className="bg-gray-800/20 dark:bg-white/20 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">
                        {appointment.clientName}
                        {appointment.serviceType && ` - ${appointment.serviceType}`}
                      </h4>
                      <div className="text-sm text-gray-400 dark:text-gray-600 mt-1">
                        {formatDate(appointment.date)} at {appointment.time}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(appointment)}
                        className="text-xs px-2 py-1 bg-blue-600/80 hover:bg-blue-700 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="text-xs px-2 py-1 bg-red-600/80 hover:bg-red-700 text-white rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {appointment.notes && (
                    <p className="text-sm mt-2 border-t border-gray-700/50 dark:border-gray-300/50 pt-2">
                      {appointment.notes}
                    </p>
                  )}
                </div>
              ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-500">
                No appointments scheduled yet
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}