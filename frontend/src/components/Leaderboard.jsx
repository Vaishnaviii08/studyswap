import React, { useState, useEffect } from "react";
import { TrophyFill, StarFill } from "react-bootstrap-icons";
import Table from "react-bootstrap/Table";
import axios from "axios";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/leaderboard`);
        setLeaders(res.data.users);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="border-0 shadow rounded-4 overflow-hidden bg-white">
      <h3
        className="fw-bold mx-4 mt-4"
        style={{ fontSize: "2.2rem", color: "#4f46e5" }}
      >
        Leaderboard
      </h3>

      <div className="d-flex align-items-center gap-3 ms-4">
        {/* Trophy + Star */}
        <div style={{ position: "relative", width: "fit-content" }}>
          <TrophyFill size={40} color="#f5b400" />
          <StarFill
            size={15}
            color="white"
            style={{
              position: "absolute",
              top: "5px",
              left: "12.5px",
              filter: "drop-shadow(0 0 2px #00000044)",
            }}
          />
        </div>

        {/* Text Content */}
        <div>
          <h4 className="mb-1 text-dark">Top Contributors</h4>
          <p className="mb-0 text-muted">
            View the most active users in the community
          </p>
        </div>
      </div>

      <div
        className="m-4"
        style={{
          borderRadius: "0.75rem",
          overflow: "hidden",
          border: "1px solid #dee2e6",
        }}
      >
        <Table responsive bordered style={{ marginBottom: 0 }}>
          <thead>
            <tr style={{ backgroundColor: "#e0e7ff" }}>
              <th
                className="fw-semibold text-dark"
                style={{ borderRight: "none", borderLeft: "none" }}
              >
                Rank
              </th>
              <th
                className="fw-semibold text-dark"
                style={{ borderRight: "none", borderLeft: "none" }}
              >
                Name
              </th>
              <th
                className="fw-semibold text-dark"
                style={{ borderRight: "none", borderLeft: "none" }}
              >
                Reputation
              </th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((leader,index) => (
              <tr key={leader._id}>
               <td style={{ borderRight: "none", borderLeft: "none" }}>{index+1}</td>
              <td style={{ borderRight: "none", borderLeft: "none" }}>{leader.username}</td>
              <td style={{ borderRight: "none", borderLeft: "none" }}>{leader.reputationPoints}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Leaderboard;
