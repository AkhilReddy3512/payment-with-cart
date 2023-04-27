import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


var Airtable = require('airtable');
var base = new Airtable({ apiKey: 'pathtvro7iNxp5yYN.69817a21c94ed77c049dca2361983216550ee535881f255333ebde130d41f299' }).base('appmLtIK7oUkAerdO');

const currentDate = new Date();
const oneYearFromNowYear = currentDate.getFullYear() + 1;
const oneYearFromNow = new Date(oneYearFromNowYear, currentDate.getMonth(), currentDate.getDate());
const month = oneYearFromNow.getMonth() + 1;
const day = oneYearFromNow.getDate();
const year = oneYearFromNow.getFullYear();
const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
localStorage.setItem('Products',JSON.stringify([]))

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

function Checkout() {
    const [products] = useState([
        { id: 1, name: "Product1", amount: 100 },
        { id: 2, name: "Product2", amount: 100 },
        { id: 3, name: "Product3", amount: 100 },
        { id: 4, name: "Product4", amount: 100 },
        { id: 5, name: "Product5", amount: 100 },
    ]);

   // localStorage.setItem("Products", JSON.stringify([]))

    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState('+91');
    const [phoneSubmitted, setPhoneSubmitted] = useState(false);

    let label = {
        'Product1': null,
        'Product2': null,
        'Product3': null,
        'Product4': null,
        'Product5': null
    };

    const updatefunc = (date) => {
        base('Table 1').select({
            filterByFormula: `{Name} = '${phoneNumber}'`
        }).eachPage(function page(records, fetchNextPage) {
            records.forEach(function (record) {
                // Update the fields of the record
                base('Table 1').update([
                    {
                        "id": record.id,
                        "fields": {
                            'Product1': date['Product1'],
                            'Product2': date['Product2'],
                            'Product3': date['Product3'],
                            'Product4': date['Product4'],
                            'Product5': date['Product5'],
                        }
                    }
                ], function (err, records) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                });
            });
            fetchNextPage();
        }, function done(err) {
            if (err) {
                console.error(err);
                return;
            }
        });
    }
    const getKey = (keyitem) => {
        const keys1 = Object.keys(keyitem);
        return keys1;
    }

    const serachrecord = async (phonenumber) => {
        base('Table 1').select({
            filterByFormula: `FIND('${phonenumber}', {Name}) = 1`
        }).firstPage(async (err, records) => {
            if (err) {
                console.error(err);
                return false;
            }
            if (records.length > 0) {
                console.log(records)
                localStorage.setItem('Products', JSON.stringify(records));
            }
        });
        return true;
    }

    const addToCart = (product) => {
        const existingItem = cartItems.find((item) => item.id === product.id);
        if (existingItem) {
            toast.warn('Product already added to cart!');
            return;
        }
        setCartItems([...cartItems, product]);
        console.log(cartItems)
        setTotalAmount(totalAmount + product.amount);
    };

    const removeCartItem = (product) => {
        const updatedCartItems = cartItems.filter((item) => item.id !== product.id);
        setCartItems(updatedCartItems);
        setTotalAmount(totalAmount - product.amount);
    };
    const navigate = useNavigate();

    const handleSubmit=async(event)=>{
        event.preventDefault();
        setPhoneSubmitted(true);
        console.log('Submitting phone number: ', phoneNumber);
    serachrecord(phoneNumber)
    }

    async function displayRazorpay() {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

        if (!res) {
            toast.error('Razorpay SDK failed to load. Are you online?')
            return
        }
        const data = await fetch(`http://localhost:1337/razorpay`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: totalAmount }),
        }).then((t) => t.json());
        console.log(data);

        const options = {
            key: 'rzp_test_A2p665XWi2QO4u',
            currency: data.currency,
            amount: data.amount.toString(),
            order_id: data.id,
            name: 'Reality AI',
            description: 'Thank you for nothing. Please give us some money',
            image: 'https://www.arm.com/-/media/global/Why%20Arm/partner/Partner%20Ecosystem/ai-catalog/reality-ai/reality-ai-logo.png?rev=03b4e9975e1540cf8141d72d011981f0&revision=03b4e997-5e15-40cf-8141-d72d011981f0',

            handler: async function (response) {
            
                if ((JSON.parse(localStorage.getItem('Products')).length!==0)) {
                    for (var i = 0; i < cartItems.length; i++) {
                        label[cartItems[i].name] = formattedDate;
                    }
                    let a = getKey(JSON.parse(localStorage.getItem('Products'))[0].fields)
                    console.log(JSON.parse(localStorage.getItem('Products'))[0].fields)
                    console.log(a)
                    for (var j = 0; j < a.length; j++) {
                        if (a[j] !== 'Name' && label[a[j]] === null) {
                            label[a[j]] = await JSON.parse(localStorage.getItem('Products'))[0].fields[a[j]]
                            console.log("hello")
                        }
                    }
                    updatefunc(label);
                    console.log(label)
                }
                navigate('/success', {
                    state: {
                        paymentId: response.razorpay_payment_id,
                        orderId: response.razorpay_order_id,
                        //signature: response.razorpay_signature
                    }
                });
            },

        }
        const paymentObject = new window.Razorpay(options);
        paymentObject.on('payment.failed', function (response) {
            paymentObject.close()
            const errorDescription = response.error.description;
            const errorReason = response.error.reason;
            const orderId = response.error.metadata.order_id;
            const paymentId = response.error.metadata.payment_id;
            const failurePageState = {
                errorDescription: errorDescription,
                errorReason: errorReason,
                orderId: orderId,
                paymentId: paymentId
            };
            // Navigate to the failure page with the state object as the second argument
            navigate('/failure', { state: failurePageState });
            window.location.reload(true);
        });
        paymentObject.open();
    }
    return (
        <div>
            <ToastContainer autoClose={4000} position="top-center" pauseOnHover={false} closeOnClick theme="colored" />
            <div className='container-main'>
                <form onSubmit={handleSubmit}>
                    <label>
                        Phone Number: <br />
                        <input type="tel" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} />
                        {/* <input type="tel" /> */}
                    </label>
                    <button type="submit">Submit</button>
                </form>
                <ul>
                <h2>Available Products</h2>
                    {products.map((product) => (
                        <li key={product.id}>
                            {product.name} - ₹ {product.amount}
                            {phoneSubmitted && <button onClick={() => addToCart(product)}>Add to Package</button>}
                        </li>
                    ))}
                </ul>
                <h2>My Package</h2>
                {cartItems.length === 0 ? (
                    <p>No items in your package, Check our products</p>
                ) : (
                    <ul>
                        {cartItems.map((item) => (
                            <li key={item.id}>
                                {item.name} - ₹ {item.amount}
                                <button onClick={() => removeCartItem(item)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                )}
                {totalAmount > 0 &&
                    <div>
                        <p>Total amount: ₹ {totalAmount}</p>
                        <button onClick={displayRazorpay}>Proceed to Payment</button>
                        <hr />
                    </div>
                }
            </div>
        </div>
    )
}

export default Checkout