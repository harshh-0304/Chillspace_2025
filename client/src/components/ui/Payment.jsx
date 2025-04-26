import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axios';

const Payment = ({ place, bookingDetails, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  
  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        // Check if already loaded
        if (window.Razorpay) {
          return resolve();
        }
        
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          console.log("Razorpay script loaded successfully");
          resolve();
        };
        script.onerror = () => {
          console.error("Failed to load Razorpay script");
          toast.error("Payment gateway failed to load");
        };
        document.body.appendChild(script);
      });
    };

      
      const initiatePayment = async () => {
        const res = await loadRazorpayScript();
      
        if (!res) {
          alert('Razorpay SDK failed to load. Are you online?');
          return;
        }
      
        // Call your backend to create the order
        const orderData = await fetch('http://localhost:5000/api/payment/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: 500, // Amount in INR paisa (e.g., 500 means ₹5)
          }),
        }).then((res) => res.json());
      
        const options = {
          key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your actual key
          amount: orderData.amount,
          currency: 'INR',
          name: 'ChillSpace',
          description: 'Booking Payment',
          order_id: orderData.id,
          handler: async function (response) {
            // Send response.razorpay_payment_id and order_id to backend to verify
            const verify = await fetch('http://localhost:4000/payment/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
      
            const verifyResponse = await verify.json();
            console.log('Payment verified:', verifyResponse);
          },
          theme: {
            color: '#3399cc',
          },
        };
      
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      




    loadRazorpayScript()
      .then(() => setScriptLoaded(true))
      .catch(() => toast.error("Failed to initialize payment gateway"));
  }, []);

  const handlePayment = async () => {
    if (!bookingDetails) {
      toast.error("Booking details are missing");
      return;
    }
    
    if (!scriptLoaded || !window.Razorpay) {
      toast.error("Payment gateway is not loaded yet. Please try again.");
      return;
    }
    
    setLoading(true);
    
    try {
      // Create booking first
      console.log("Creating booking...");
      const bookingResponse = await axiosInstance.post('/bookings', {
        checkIn: bookingDetails.checkIn,
        checkOut: bookingDetails.checkOut,
        noOfGuests: bookingDetails.noOfGuests,
        name: bookingDetails.name,
        phone: bookingDetails.phone,
        place: bookingDetails.place,
        price: bookingDetails.price,
        paymentStatus: 'pending'
      });
      
      const bookingId = bookingResponse.data.booking._id;
      console.log("Booking created with ID:", bookingId);
      
      // Create payment order
      console.log("Creating payment order...");
      const paymentResponse = await axiosInstance.post('/payment/create-order', {
        amount: bookingDetails.price,
        bookingId: bookingId
      });
      
      console.log("Payment order created:", paymentResponse.data);

      // Extract the order ID based on the actual response structure
      // The logs show that the response has { success: true, order: {...} }
      const orderId = paymentResponse.data.order?.id || paymentResponse.data.id;
      
      if (orderId) {
        console.log("Using order ID:", orderId);
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: bookingDetails.price * 100,
          currency: 'INR',
          name: place.title,
          description: `${bookingDetails.numberOfNights} night(s) at ${place.title}`,
          order_id: orderId,
          handler: function(response) {
            console.log("Payment successful:", response);
            verifyPayment(response, bookingId);
          },
          prefill: {
            name: bookingDetails.name || '',
            contact: bookingDetails.phone || '',
          },
          theme: {
            color: '#F37254',
          },
          modal: {
            ondismiss: function() {
              console.log("Payment modal dismissed");
              setLoading(false);
              toast.warning("Payment cancelled");
            }
          }
        };

        console.log("Opening Razorpay with options:", options);
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function(response) {
          console.error("Payment failed:", response.error);
          toast.error(`Payment failed: ${response.error.description}`);
          setLoading(false);
        });
        
        rzp.open();
      } else {
        console.error("Order ID not found in response:", paymentResponse.data);
        throw new Error("Invalid payment order response: Order ID not found");
      }
    } catch (error) {
      console.error("Payment process failed:", error);
      toast.error(error.response?.data?.message || "Failed to process payment");
      setLoading(false);
    }
  };

  // const verifyPayment = async (paymentDetails, bookingId) => {
  //   console.log("Verifying payment...");
  //   try {
  //     const response = await axiosInstance.post('/payment/verify-payment', {
  //       razorpay_order_id: paymentDetails.razorpay_order_id,
  //       razorpay_payment_id: paymentDetails.razorpay_payment_id,
  //       razorpay_signature: paymentDetails.razorpay_signature,
  //       bookingId: bookingId
  //     });

  //     console.log("Payment verification response:", response.data);
      
  //     if (response.data.success) {
  //       // Update booking payment status
  //       await axiosInstance.put(`/bookings/${bookingId}`, {
  //         paymentStatus: 'completed',
  //         paymentId: paymentDetails.razorpay_payment_id
  //       });
        
  //       toast.success('Payment successful! Booking confirmed.');
        
  //       if (onPaymentSuccess) {
  //         onPaymentSuccess();
  //       }
        
  //       setRedirect(`/account/bookings/${bookingId}`);
  //     } else {
  //       toast.error('Payment verification failed!');
  //     }
  //   } catch (error) {
  //     console.error("Payment verification failed:", error);
  //     toast.error(error.response?.data?.message || "Payment verification failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const verifyPayment = async (paymentDetails) => {
    console.log("Verifying payment...");
    try {
      const response = await axiosInstance.post('/payment/verify-payment', {
        razorpay_order_id: paymentDetails.razorpay_order_id,
        razorpay_payment_id: paymentDetails.razorpay_payment_id,
        razorpay_signature: paymentDetails.razorpay_signature,
      });
  
      console.log("Payment verification response:", response.data);
  
      if (response.data.success) {
        toast.success('Payment successful! Booking confirmed.');
  
        // Handle payment success, call any callback function passed as prop (onPaymentSuccess)
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
  
        // Redirect to the booking confirmation page
        setRedirect(`/account/bookings`);
      } else {
        toast.error('Payment verification failed!');
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      toast.error(error.response?.data?.message || "Payment verification failed");
    } finally {
      setLoading(false);
    }
  };
  
  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-xl">
      <h2 className="text-xl font-semibold mb-4">Complete Your Payment</h2>
      
      {place && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h3 className="font-medium">Booking Summary</h3>
          <div className="text-sm text-gray-600 mt-1">
            <p>{place.title}</p>
            <p>Check-in: {bookingDetails?.checkIn ? new Date(bookingDetails.checkIn).toLocaleDateString() : ''}</p>
            <p>Check-out: {bookingDetails?.checkOut ? new Date(bookingDetails.checkOut).toLocaleDateString() : ''}</p>
            <p>Guests: {bookingDetails?.noOfGuests}</p>
            <p className="mt-2 font-medium text-black">
              Total: ₹{bookingDetails?.price}
            </p>
          </div>
        </div>
      )}
      
      <div className="flex flex-col items-center">
        <p className="mb-4 text-sm text-gray-600">
          You'll be redirected to Razorpay's secure payment gateway
        </p>
        
        <button 
          onClick={handlePayment} 
          disabled={loading || !scriptLoaded}
          className="primary w-full max-w-xs"
        >
          {loading ? 'Processing...' : `Pay ₹${bookingDetails?.price || place?.price}`}
        </button>
        
        {!scriptLoaded && (
          <p className="text-xs text-red-500 mt-2">Loading payment gateway...</p>
        )}
        
        <p className="text-xs text-gray-500 mt-4 text-center">
          Your payment information is secure and encrypted
        </p>
      </div>
    </div>
  );
};

export default Payment;