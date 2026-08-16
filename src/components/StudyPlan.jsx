import { useEffect, useState } from "react";
export default function StudyPlan({ plan = [], storageKey }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || plan;
    } catch {
      return plan;
    }
  });
  useEffect(
    () => localStorage.setItem(storageKey, JSON.stringify(items)),
    [items, storageKey],
  );
  const update = (i, status) =>
    setItems((a) => a.map((x, j) => (j === i ? { ...x, status } : x)));
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Skill</th>
            <th>Topic</th>
            <th>Task</th>
            <th>Priority</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((x, i) => (
            <tr key={i}>
              <td>Day {x.day}</td>
              <td>{x.skill}</td>
              <td>{x.topic}</td>
              <td>{x.task}</td>
              <td>
                <span
                  className={`priority ${String(x.priority).toLowerCase()}`}
                >
                  {x.priority}
                </span>
              </td>
              <td>
                <select
                  value={x.status}
                  onChange={(e) => update(i, e.target.value)}
                >
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
