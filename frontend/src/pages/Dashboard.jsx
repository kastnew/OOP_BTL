// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // ✅ THÊM
import { 
  USERS, 
  HEALTH_INDICATORS, 
  MOCK_MEALS, 
  MOCK_ACTIVITIES 
} from '../services/mockData';
import './Dashboard.css';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState({
    firstName: '', lastName: '', age: '', gender: '',
    height: '', weight: '', heartRate: '', bloodPressure: ''
  });

  const [calories, setCalories] = useState({ consumed: 0, burned: 0 });
  const [bmi, setBmi] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
