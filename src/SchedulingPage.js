import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './SchedulingPage.css'; // Custom CSS for additional styling

const SchedulingPage = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    // Fetch employee list from the server
    axios.get('/api/employees')
      .then(response => setEmployees(response.data))
      .catch(error => console.error('Error fetching employees:', error));
  }, []);

  const handleEmployeeSelect = (id) => {
    setSelectedEmployees(prev => {
      if (prev.includes(id)) {
        return prev.filter(empId => empId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSubmit = () => {
    if (selectedEmployees.length === 0 || !scheduleDate || !scheduleTime || comment.length > 200) {
      alert('Please fill out all fields correctly.');
      return;
    }

    const scheduleData = {
      employees: selectedEmployees,
      date: scheduleDate,
      time: scheduleTime,
      comment,
    };

    axios.post('/api/schedule', scheduleData)
      .then(response => alert('Schedule submitted successfully!'))
      .catch(error => console.error('Error submitting schedule:', error));
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header text-center">
          <h2 className="mb-0">Schedule Employees</h2>
        </div>
        <div className="card-body">
          <div className="employee-list mb-3">
            <h5>Select Employees:</h5>
            <ul className="list-group">
              {employees.map(employee => (
                <li key={employee.id} className="list-group-item">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    checked={selectedEmployees.includes(employee.id)}
                    onChange={() => handleEmployeeSelect(employee.id)}
                  />
                  {employee.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="form-group mb-3">
            <label htmlFor="scheduleDate">Select Date:</label>
            <input
              type="date"
              className="form-control"
              id="scheduleDate"
              value={scheduleDate}
              min={new Date().toISOString().split('T')[0]} // Ensure future dates only
              onChange={(e) => setScheduleDate(e.target.value)}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="scheduleTime">Select Time:</label>
            <input
              type="time"
              className="form-control"
              id="scheduleTime"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="comment">Enter Schedule Comment (max 200 characters):</label>
            <textarea
              className="form-control"
              id="comment"
              value={comment}
              maxLength={200}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter schedule comment..."
            />
          </div>
          <button onClick={handleSubmit} className="btn btn-success w-100 rounded-0">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default SchedulingPage;
