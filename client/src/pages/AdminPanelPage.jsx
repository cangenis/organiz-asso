import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { hostRoute } from "../utils/APIRoutes";
import "../styles/AdminPanelPage.css";

function AdminPanel() {
  const [unapprovedUsers, setUnapprovedUser] = useState([]);
  const [users, setUsers] = useState([]);
  const { userId, token } = useAuth();

  const fetchUnapprovedUsers = async () => {
    try {
      const result = await axios.get(`${hostRoute}/admin/unapproved-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnapprovedUser(result.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUnapprovedUsers();
      await fetchUsers();
    };
    fetchData();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const result = await axios.get(`${hostRoute}/user/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter out unapproved users before setting them to the state
      const approvedUsers = result.data.filter((user) => user.isApproved);
      setUsers(approvedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const approveUser = async (id) => {
    try {
      const result = await axios.patch(
        `${hostRoute}/admin/approve-user/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (result.status === 200) {
        // Remove the user from the list of unapproved users
        const updatedUnapproved = unapprovedUsers.filter(
          (user) => user._id !== id
        );
        setUnapprovedUser(updatedUnapproved);

        // Find the approved user in the unapproved list and add to the approved list
        const approvedUser = unapprovedUsers.find((user) => user._id === id);
        if (approvedUser) {
          setUsers((prevUsers) => [
            ...prevUsers,
            { ...approvedUser, isApproved: true },
          ]);
        }

        console.log("User approved:", result.data);
      } else {
        throw new Error("Failed to approve user");
      }
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const refuseUser = async (id) => {
    try {
      const result = await axios.delete(
        `${hostRoute}/admin/refuse-user/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (result.status === 200) {
        // Remove the user from the list of unapproved users
        setUnapprovedUser(unapprovedUsers.filter((user) => user._id !== id));
        console.log("User refused:", result.data.message);
      } else {
        throw new Error("Failed to refuse user");
      }
    } catch (error) {
      console.error(
        "Error refusing user:",
        error.response ? error.response.data : error
      );
    }
  };

  const toggleAdmin = async (id, currentIsAdmin) => {
    try {
      const response = await axios.patch(
        `${hostRoute}/admin/set-admin/${id}`,
        { isAdmin: !currentIsAdmin },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setUsers(
          users.map((user) =>
            user._id === id ? { ...user, isAdmin: response.data.isAdmin } : user
          )
        );
      } else {
        console.error("Failed to update admin status:", response.data.message);
      }
    } catch (error) {
      console.error(
        "Failed to update admin status:",
        error.response ? error.response.data : error
      );
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <div className="section">
        <p>Waiting for approval:</p>
        <ul>
          {unapprovedUsers.map((user) => (
            <li key={user._id}>
              {user.firstName} {user.lastName}
              <button onClick={() => approveUser(user._id)}>Approve</button>
              <button onClick={() => refuseUser(user._id)}>Refuse</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="section">
        <p>Admins:</p>
        <ul>
          {users
            .filter((user) => user.isAdmin)
            .map((user) => (
              <li key={user._id}>
                {user.firstName} {user.lastName}
                {user._id === userId ? (
                  " (You)"
                ) : (
                  <button onClick={() => toggleAdmin(user._id, user.isAdmin)}>
                    Mark as User
                  </button>
                )}
              </li>
            ))}
        </ul>
      </div>
      <div className="section">
        <p>Users:</p>
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.firstName} {user.lastName}
              {user.isAdmin
                ? " (Admin)"
                : user._id !== userId && (
                    <button
                      onClick={() => toggleAdmin(user._id, !user.isAdmin)}
                    >
                      Mark as Admin
                    </button>
                  )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminPanel;
