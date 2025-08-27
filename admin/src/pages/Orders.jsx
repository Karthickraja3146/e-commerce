import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import assets from "../assets/assets"; 
import { backend_url, currency } from "../App";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllOrders = async () => {
    if (!token) {
      console.log("No token provided");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(`${backend_url}/api/order/list`, {
        headers: { token },
      });

      console.log("Response from backend:", response.data);

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Axios error:", error.response || error.message);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        `${backend_url}/api/order/status`,
        { orderId, status: event.target.value }, 
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Order status updated");
        fetchAllOrders(); 
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="orders">
      <h2 className="text-xl font-bold mb-4">All Orders</h2>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div key={index} className="border p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p className="text-sm">{order.address.street}, {order.address.city}</p>
                  <p className="text-sm">Payment: {order.payment ? "Paid" : "Pending"}</p>
                </div>

                <select
                  value={order.status}
                  onChange={(e) => statusHandler(e, order._id)}
                  className="border rounded px-2 py-1"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div className="mt-3">
                <p className="font-semibold">Items:</p>
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>
                      {currency}{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
