import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const stripeService = {
  // Create a payment intent
  createPaymentIntent: async (orderData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/create-payment-intent`, {
        amount: orderData.total,
        currency: 'pkr',
        orderId: orderData.objectId,
        orderNumber: orderData.orderId || orderData.orderNumber,
        customerEmail: orderData.customerEmail,
        customerName: orderData.customerName
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  },

  // Verify payment after successful charge
  verifyPayment: async (paymentIntentId, orderId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/verify-payment`, {
        paymentIntentId,
        orderId
      });
      
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  },

  // Refund payment (if needed)
  refundPayment: async (paymentIntentId, amount) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/refund-payment`, {
        paymentIntentId,
        amount
      });
      
      return response.data;
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw error;
    }
  }
};