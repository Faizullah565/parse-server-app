import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Parse from "../../../utils/parseClient";
import { adminFetchAllUsers } from "../adminServices";

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    
    const {result}= await adminFetchAllUsers()

    setUsers(result.users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔥 Toggle Status
  const toggleStatus = async (id) => {
    const query = new Parse.Query(Parse.User);
    const user = await query.get(id, { useMasterKey: true });

    user.set("isActive", !user.get("isActive"));
    await user.save(null, { useMasterKey: true });

    fetchUsers();
  };

  // 🔥 Delete User
  const deleteUser = async (id) => {
    const query = new Parse.Query(Parse.User);
    const user = await query.get(id, { useMasterKey: true });

    await user.destroy({ useMasterKey: true });

    fetchUsers();
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    {
      field: "isActive",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        return params.row.status ? "Active" : "Block";
      },
    },
    { field: "role", headerName: "Role", flex: 1 },

    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            size="small"
            onClick={() => toggleStatus(params.row.id)}
            sx={{ mr: 1 }}
          >
            Toggle
          </Button>

          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => deleteUser(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        Users Management
      </Typography>

      <DataGrid
        rows={users}
        columns={columns}
        autoHeight
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </Box>
  );
};

export default UsersPage;