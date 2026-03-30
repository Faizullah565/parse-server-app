import { useEffect, useState } from "react";
import Parse from "../../../utils/parseClient";
import { Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";
import { useAdminOrders } from "../adminContext/AdminOrdersContext";
import { adminFetchAllOrders } from "../adminServices";
// import useAdminOrders from "../adminContext/AdminOrdersContext"
const AdminOrders = () => {
  // const [orders, setOrders] = useState([]);
  const { orders, setOrders} = useAdminOrders()

  console.log("🚀 ~ AdminOrders ~ orders:", orders)

  useEffect(()=>{
    fetchOrders()
  }, [])
  
  const fetchOrders=async()=>{
    const {result} = await adminFetchAllOrders()
    console.log("🚀 ~ fetchOrders ~ orders:", result)
    setOrders(result?.orders)
  }
  // status update
  const updateStatus = async (id, status) => {
    const Order = Parse.Object.extend("Order");
    const query = new Parse.Query(Order);

    const order = await query.get(id);
    order.set("status", status);
    await order.save();
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Order ID</TableCell>
          <TableCell>User</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.orderId}>
            <TableCell>{order.orderId}</TableCell>
            <TableCell>{order.userId}</TableCell>
            <TableCell>{order.status}</TableCell>

            <TableCell>
              <Button onClick={() => updateStatus(order.objectId, "completed")}>
                Complete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AdminOrders;