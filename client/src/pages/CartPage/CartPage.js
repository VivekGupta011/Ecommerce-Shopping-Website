import React, {useEffect} from 'react';
import "./CartPage.scss";
import { useSelector, useDispatch } from 'react-redux';
import {Link, useNavigate} from "react-router-dom";
import {formatPrice} from "../../utils/helpers";
import { addToCartt,removeFromCartt,decreaseCartt,clearCartt,getTotals } from '../../store/cartDataSlice';
import axios from 'axios';

const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const {data: cartProducts, totalItems, totalAmount, deliveryCharge} = useSelector(state => state.cart);
    const {cartItem:cartProducts,cartTotlQuantity,cartTotalAmout}=useSelector(state=>state.cartData);
    const {isLoggedIn} = useSelector(state => state.user);

    useEffect(()=>{
        dispatch(getTotals());
    },[cartProducts]);

    // useEffect(() => {
    //     dispatch(getCartTotal());
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [useSelector(state => state.cart)]); 

    function RemoveHandler(product){
        dispatch(removeFromCartt(product));
        console.log("remove from array!");
    }

    function addToCartHandler(product){
        dispatch(addToCartt(product));
    }

    function DecreaseHandler(product){
        dispatch(decreaseCartt(product));
    }

    function GetTotalHandler(){
        const call=getTotals();
        console.log("Call");
        console.log(call);
        dispatch(getTotals());
        console.log("total item:")
    //    console.log( GetTotalHandler());
    }
    const checkoutHandler = async (amount) => {
        const {data:{key}} = await axios.get("/api/getkey")
       const {data:{order}} = await axios.post("/transaction/checkout", {
            amount:cartTotalAmout
        })
       
        const options = {
            key,
            amount: order.amount,
            currency: "INR",
            name: "Shopping Website",
            description: "Ecommerce Website",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-TSGXWw3VSjCXBAV2bUSw8F3FlxTOC9H5Azn48NPW_Q&usqp=CAU&ec=48665698",
            order_id: order.id,
            callback_url: "http://localhost:5000/transaction/paymentverification",
            prefill: {
                name: "",
                email: "",
                contact: ""
            },
            notes: {
                "address": "Razorpay Corporate Office"
            },
            theme: {
                "color": "#121212"
            }
        };
        const razor = new window.Razorpay(options);
        razor.open();
    }

    
    const emptyCartMsg = <h4 className='text-red fw-6'>No items found!</h4>;

    return (
      <div className = "cart-page">
        {/* <div className = "container">
          <div className = "breadcrumb">
            <ul className = "breadcrumb-items flex">
              <li className = "breadcrumb-item">
                <Link to = "/">
                  <i className = "fas fa-home"></i>
                  <span className = "breadcrumb-separator">
                    <i className = "fas fa-chevron-right"></i>
                  </span>
                </Link>
              </li>
              <li>Cart</li>
            </ul>
          </div>
        </div> */}
        <div className='bg-ghost-white py-5'>
            <div className='container'>
                <div className='section-title bg-ghost-white'>
                    <h3 className = "text-uppercase fw-7 text-regal-blue ls-1">My Cart</h3>
                </div>
                {
                    cartProducts.length === 0 ? emptyCartMsg : (
                        <div className = "cart-content grid">
                            <div className='cart-left'>
                                <div className = "cart-items grid">
                                    {
                                        cartProducts.map(cartProduct => (
                                            <div className='cart-item grid' key = {cartProduct.id}>
                                                <div className='cart-item-img flex flex-column bg-white'>
                                                    <img src = {cartProduct.images[0]} alt = {cartProduct.title} />
                                                    <button type = "button" className='btn-square rmv-from-cart-btn' onClick={() =>RemoveHandler(cartProduct)}>
                                                        <span className='btn-square-icon'><i className='fas fa-trash'></i></span>
                                                    </button>
                                                </div>

                                                <div className='cart-item-info'>
                                                    <h6 className='fs-16 fw-5 text-light-blue'>{cartProduct.title}</h6>
                                                    <div className = "qty flex">
                                                        <span className = "text-light-blue qty-text">Qty: </span>
                                                        <div className = "qty-change flex">
                                                        <button type = "button" className='qty-dec fs-14' onClick={() =>DecreaseHandler(cartProduct.id)}>
                                                            <i className = "fas fa-minus text-light-blue"></i>
                                                        </button>
                                                        <span className = "qty-value flex flex-center">{cartProduct.cartQuantity}</span>
                                                        <button type = "button" className='qty-inc fs-14 text-light-blue' onClick={() =>addToCartHandler(cartProduct)}>
                                                            <i className = "fas fa-plus"></i>
                                                        </button>
                                                        </div>
                                                    </div>
                                                    <div className = "flex flex-between">
                                                        <div className='text-pine-green fw-4 fs-15 price'>₹ {cartProduct.price}.00</div>
                                                        <div className='sub-total fw-6 fs-18 text-regal-blue'>
                                                            <span>Sub Total: </span>
                                                            <span className=''>₹{cartProduct.cartQuantity*cartProduct.price}.00</span>
                                                          
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <button type = "button" className='btn-danger' onClick={()=>dispatch(clearCartt())}>
                                    <span className = "fs-16">Clear Cart</span> 
                                </button>
                            </div>
                            <div className='cart-right bg-white'>
                                <div className = 'cart-summary text-light-blue'>
                                    <div className='cart-summary-title'>
                                        <h6 className='fs-20 fw-5'>Order Summary</h6>
                                    </div>
                                    <ul className = 'cart-summary-info'>
                                        <li className = "flex flex-between">
                                            <span className='fw-4'>Selected {cartTotlQuantity} items(s) Price</span>
                                            <span className='fw-7'>₹{cartTotalAmout}</span>
                                        </li>
                                        <li className='flex flex-between'>
                                            
                                            <span className='fw-4'>Delivery Cost</span>
                                            <span className='fw-7'>
                                                <span className='fw-5 text-gold'>+&nbsp;</span>₹{119}
                                            </span>
                                        </li>
                                    </ul>
                                    <div className='cart-summary-total flex flex-between fs-18'>
                                        <span className='fw-6'>Grand Total: </span>
                                        <span className='fw-6'>₹{119+cartTotalAmout}.00</span>
                                        {/* <button onClick={GetTotalHandler}>Click me!</button> */}
                                    </div>
                                    <div className='cart-summary-btn'>
                                    {isLoggedIn? (
                                        <button type = "button" className='btn-secondary' onClick={checkoutHandler}>Proceed to Checkout</button>
                                       ) : (
                                        <button type = "button" className='btn-secondary btn-danger' onClick={()=>{navigate('/login',{replace:true})}}>Login to Checkout</button>
                                       )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
      </div>
    // <h1>Hello vivek!</h1>
    )
}

export default CartPage;