import { createContext, useContext, useEffect, useState } from "react";
import Parse from "../../../utils/parseClient";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const OrderContext = createContext();

export const AdminOrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const {user} = useAuth()
  console.log("🚀 ~ AdminOrdersProvider ~ user:", user)
  useEffect(() => {
    let subscription;

    const subscribeOrders = async () => {
      const query = new Parse.Query("Order");
      const setup = async () => {
            console.log("🚀 ~ setup ~ query:", query)
            //  include user info
            query.include("user");
            const results = await query.find();
            setOrders(results.map(o => o.toJSON()));
      
          };
      
          try {
            // 🔥 admin ko sab orders chahiye
            subscription = await query.subscribe();
            
            console.log("✅ Admin LiveQuery Connected");
            
            // CREATE
            subscription.on("create", (order) => {
              const newOrder = order.toJSON();
              
              setOrders(prev => [newOrder, ...prev]);
              
              toast.success(`🆕Admin New Order #${order.id}`);
            });
            
            // UPDATE
            subscription.on("update", (order) => {
          const updated = order.toJSON();

          setOrders(prev =>
            prev.map(o =>
              o.objectId === order.id ? { ...o, ...updated } : o
            )
          );
          
          toast.info(`🔄Admin Order Updated #${order.id} (${order.get("status")})`);
        });

        setup();
      } catch (err) {
        console.error(err);
      }
    };
    console.log(`🚀 ~ AdminOrdersProvider ~ user?.role==="admin":`, user?.role==="admin")

    
    if(user?.role==="admin"){
      subscribeOrders();
    }

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  return (
    <OrderContext.Provider value={{ orders, setOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useAdminOrders = () => useContext(OrderContext);