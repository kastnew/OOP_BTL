import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Activities.css';

const Activities = ({ activities, setActivities }) => {
  const [params] = useSearchParams();
  const selectedDate = params.get('date') || new Date().toISOString().split('T')[0];

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name:'', startTime:'', endTime:'', kcal:'' });
  const [editingId, setEditingId] = useState(null);

  const dayActivities = activities.filter(a => a.date === selectedDate);

  const handleSubmit = e => {
    e.preventDefault();
    if (editingId) {
      setActivities(activities.map(a =>
        a.id === editingId ? { ...a, ...formData } : a
      ));
    } else {
      setActivities([...activities, {
        id: Date.now(),
        ...formData,
        date: selectedDate
      }]);
    }
    setShowModal(false);
  };

  return (
    <div className="page-container">
      <h1>🏃 Hoạt động ngày {selectedDate}</h1>
      {/* UI giữ nguyên, chỉ đổi source dữ liệu */}
    </div>
  );
};

export default Activities;
