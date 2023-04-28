import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

var Airtable = require('airtable');
var base = new Airtable({ apiKey: 'pathtvro7iNxp5yYN.69817a21c94ed77c049dca2361983216550ee535881f255333ebde130d41f299' }).base('appmLtIK7oUkAerdO');

const currentDate = new Date();
const oneYearFromNowYear = currentDate.getFullYear() + 1;
const oneYearFromNow = new Date(oneYearFromNowYear, currentDate.getMonth(), currentDate.getDate());
const month = oneYearFromNow.getMonth() + 1;
const day = oneYearFromNow.getDate();
const year = oneYearFromNow.getFullYear();
const formattedDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
localStorage.setItem('Products', JSON.stringify([]))

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

    const [open1, setOpen1] = useState(false);
    const handleOpen = () => setOpen1(true);
    const handleClose = () => setOpen1(false);
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

    const handleSubmit = async (event) => {
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
        const data = await fetch(`https://rose-modern-cobra.cyclic.app/razorpay`, {
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

                if ((JSON.parse(localStorage.getItem('Products')).length !== 0)) {
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
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    return (
        <>
            <nav class="navbar sticky navbar-light bg-light justify-content-between">
                <href class="text1 text3"><b>RealtyAi</b></href>
            </nav>
            <div style={{ margin: "1rem" }} class="text-center">
                <div class="row">
                    <div class="col">
                        <center>
                            <img style={{ marginTop: "10vw", marginBottom: "2vw", height: "65vw", maxHeight:"425px"}} src="Group13393.jpg" alt="buy now" />
                        </center>
                    </div>
                    <div style={{ backgroundColor: "rgb(62, 196, 249)", color: "white" }} class="col">
                        <div>
                            <div class="line"></div>
                            <ToastContainer autoClose={4000} position="top-center" pauseOnHover={false} closeOnClick theme="colored" />
                            <div className='container-main'>
                            <h4 style={{ textAlign:"left",marginLeft:"15vw"}}> Enter Mobile Number</h4>
                                <form onSubmit={handleSubmit}>
                                    <label>
                                    
                                        <input type="tel" style={{ margin: "2vw" }} value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} />
                                        {/* <input type="tel" /> */}
                                    </label>
                                    <button className="btn btn-outline-light" type="submit">Submit</button>
                                </form>
                                <ul>
                                    <h2>Available Products</h2>

                                    {products.map((product) => (

                                        <div class="dropdown" key={product.id}>
                                            <button style={{ width: "50%", margin: "3px" }} class="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                {product.name}
                                            </button>
                                            <ul style={{ width: "50%" }} class="dropdown-menu">
                                                <li><div class="dropdown-item" >{product.name} - ₹ {product.amount}</div></li>
                                                <li><div class="dropdown-item" >{phoneSubmitted && <button style={{ width: "100%", marginLeft: "0px" }} className="btn btn-outline-info" onClick={() => addToCart(product)}>Add to Package</button>}</div></li>
                                            </ul>
                                        </div>
                                    ))}
                                </ul>
                                <button style={{ width: "60%" , marginLeft:"4%", marginTop:"2vw", marginBottom:"6vw"}} className="btn btn-light" onClick={handleOpen}>View Cart</button>
                                <Modal
                                    open={open1}
                                    onClose={handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box style={{ borderRadius: "5%", backgroundColor: "rgb(3, 129, 178)", color: "white", borderColor: "white" }} sx={style}>
                                        <Typography id="modal-modal-title" variant="h6" component="h2">
                                            <h5>My Package</h5>
                                        </Typography>
                                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                            {cartItems.length === 0 ? (
                                                <p>No items in your package, Check our products</p>
                                            ) : (
                                                <ul>
                                                    {cartItems.map((item) => (
                                                        <li key={item.id}>
                                                            {item.name} - ₹ {item.amount}
                                                            <button className="btn btn-outline-light" style={{marginLeft:"3%"}} onClick={() => removeCartItem(item)}>Remove</button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </Typography>
                                        <Typography id="modal-modal-title" variant="h6" component="h2">
                                            <hr />
                                            {totalAmount > 0 &&
                                                <div>
                                                    <p>Total amount: ₹ {totalAmount}</p>
                                                    <center><button style={{ width: "90%", paddingLeft: "0px" }} className="btn btn-outline-light" onClick={displayRazorpay}>Proceed to Payment</button></center>
                                                </div>
                                            }
                                        </Typography>
                                    </Box>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Checkout