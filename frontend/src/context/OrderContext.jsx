import { createContext, useContext, useEffect, useState } from "react";
import Parse from "../../utils/parseClient";
import { getUserOrders } from "../services/orderService";
import restoreUser from "../../utils/restoreUser";
import { toast } from "react-toastify";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH ORDERS =================
  const fetchOrders = async () => {
    try {
      const res = await getUserOrders();
      setOrders(res.result || []);
    } catch (err) {
      console.error("Fetch Orders Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= LIVE QUERY =================
  useEffect(() => {
    let subscription;

    const setupLiveQuery = async () => {
      try {
        const currentUser = await restoreUser();
        if (!currentUser) {
          console.log("No user found");
          return;
        }

        const query = new Parse.Query("Order");
        query.equalTo("user", currentUser);

        subscription = await query.subscribe();
        console.log(" LiveQuery Connected");

        //  CREATE
        subscription.on("create", (order) => {
          console.log("Order Created:", order.toJSON());
          setOrders((prev) => [order.toJSON(), ...prev]);
          toast.success(`Order #${order.get("orderId")} created (${order.get("status")})`);
        });

        // UPDATE
        subscription.on("update", (updatedOrder) => {
          console.log("Order Updated:", updatedOrder.toJSON());
          toast.info(`Order #${updatedOrder.get("orderId")} updated → ${updatedOrder.get("status")}`);
          setOrders((prev) =>
            prev.map((order) =>
              order.objectId === updatedOrder.id
                ? { ...order, ...updatedOrder.toJSON() }
                : order
            )
          );
        });

      } catch (err) {
        console.error("LiveQuery Error:", err);
      }
    };

    fetchOrders();       // initial load
    setupLiveQuery();    // realtime updates

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  return (
    <OrderContext.Provider value={{ orders, loading }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);