import React, { useEffect } from 'react';
import { useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Verify = () => {
  const { backend_url, token, setCartItems } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  const verifyPayment = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        `${backend_url}/api/order/verifyStripe`,
        { success, orderId },
        { headers: { token } }
      );

      if (response.data.success) {
        setCartItems([]);
        toast.success("Payment successful");
        navigate('/orders'); 
      } else {
        toast.error("Payment failed. Please try again.");
        navigate('/cart'); 
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong with payment verification");
      navigate('/cart'); 
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [token]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg">Verifying your payment, please wait...</p>
    </div>
  );
};

export default Verify;
