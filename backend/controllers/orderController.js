import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Stripe from "stripe";

const currency = 'usd'
const deliveryCharge = 10

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
    try {
        const { items, amount, address } = req.body;
        const userId = req.user.id; 

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        };

        const newOrder = new Order(orderData);
        await newOrder.save();

        await User.findByIdAndUpdate(userId, { cartData: {} });
        res.json({ success: true, message: "Order Placed Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const placeOrderStripe = async (req, res) => {
    try {
         const { items, amount, address } = req.body;
        const userId = req.user.id; 
        const {origin} = req.headers;

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: true,
            date: Date.now()
        }
        const newOrder = new Order(orderData);
        await newOrder.save();

        const line_items = items.map((item) => {
            return {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity,
            };
        });

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charges",
                },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: "payment",
        });
        res.json({ success: true, session_url: session.url });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const verifyStripe = async (req, res) => {
    const {orderId,success,userId}= req.body
    try {
        if(success === "true"){
            await Order.findByIdAndUpdate(orderId,{payment:true});
            await User.findByIdAndUpdate(userId,{cartData:{}})
            res.json({success:true})
        }
        else{
            await Order.findByIdAndDelete(orderId);
            res.json({success:false})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const allOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


const userOrders = async (req, res) => {
    try {
        const userId = req.user.id; 
        const orders = await Order.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await Order.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Status updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
   

export { placeOrder, placeOrderStripe, allOrders, userOrders, updateStatus, verifyStripe };
