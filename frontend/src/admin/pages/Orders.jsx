import { useEffect } from "react";
import Parse from "../../../utils/parseClient";
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Paper, Typography, Box, Chip, Select, MenuItem
} from "@mui/material";
import { useAdminOrders } from "../adminContext/AdminOrdersContext";
import { adminFetchAllOrders } from "../adminServices";

const AdminOrders = () => {
  const { orders, setOrders } = useAdminOrders();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { result } = await adminFetchAllOrders();
    setOrders(result?.orders || []);
  };

  // Status Update
  const updateStatus = async (id, status) => {
    console.log("🚀 ~ updateStatus ~ id:", id)
    const Order = Parse.Object.extend("Order");
    const query = new Parse.Query(Order);

    const order = await query.get(id);
    order.set("status", status);
    await order.save();

    // update UI instantly
    setOrders((prev) => {
      return prev.map((o) =>
        o.id === id ? { ...o, status } : o
      );
    }
    );
  };

  // Status Colors
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      case "shipped":
        return "info";
      case "delivered":
        return "primary";
      case "processing":
        return "warning";
      case "confirmed":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
        
        {/* Title */}
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Admin Orders
        </Typography>

        <Table>
          {/* Header */}
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.200" }}>
              <TableCell><b>Order ID</b></TableCell>
              <TableCell><b>User</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Update Status</b></TableCell>
            </TableRow>
          </TableHead>

          {/* Body */}
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order.objectId}
                hover
                sx={{
                  "&:hover": {
                    bgcolor: "grey.100",
                  },
                }}
              >
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.userId}</TableCell>

                {/* Status Chip */}
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    variant="outlined"
                    sx={{ textTransform: "capitalize", fontWeight: "bold" }}
                  />
                </TableCell>

                {/* Dropdown */}
                <TableCell>
                  <Select
                    size="small"
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order.id, e.target.value)
                    }
                    sx={{ minWidth: 150 }}
                  >
                    <MenuItem value="processing">Processing</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </Paper>
    </Box>
  );
};

export default AdminOrders;