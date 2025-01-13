import { useEffect, useState } from "react";
import { fetchActions } from "./http/product";

export function ActionsPage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10).toString());
  const [actions, setActions] = useState([]);

  console.log({ actions: actions.length });

  useEffect(() => {
    fetchActions(date, setActions);
  }, [date]);

  const userIdToActionsMap = {};

  actions.forEach((action) => {
    if (!userIdToActionsMap[action.generatedUserId]) {
      userIdToActionsMap[action.generatedUserId] = [];
    }
    userIdToActionsMap[action.generatedUserId].push(action);
  });

  return (
    <>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

      {Object.entries(userIdToActionsMap).map(([userId, actions]) => (
        <div key={userId}>
          <h2>User {userId}</h2>
          <ul>
            {actions.map((action) => (
              <li key={action._id}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>{action.action}</span>
                  <span>
                    {new Date(action.timestamp).getHours()}:{new Date(action.timestamp).getMinutes()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          =============================
        </div>
      ))}
    </>
  );
}
