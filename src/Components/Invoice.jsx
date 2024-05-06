import React, { useState,useEffect,useRef} from 'react';
import './Invoice.css';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, push,onValue } from 'firebase/database';
import { app } from './firebase'; 
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { set } from 'firebase/database';
import { TbEdit } from "react-icons/tb";

const database = getDatabase(app); 


export default function Invoice() {
  const navigate = useNavigate();
  const [ourInfo, setOurInfo] = useState({ seller: '', mobile: '', email: '', paymentMethod: '', web: '', address: '', date: '', dueDate: '' });
  const [clientInfo, setClientInfo] = useState({ client: '', clientMobile: '', clientEmail: '', clientWeb: '', clientAddress: '' });
  const [products, setProducts] = useState([{ productName: '', price: '', unitPrice: '', quantity: '', discount: '',total:'' }]);
  const [showModal, setShowModal] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [editedOurInfo, setEditedOurInfo] = useState({});
  const [note, setNote] = useState([{note:''}]);
 // State for controlling whether to show the note
  // Other states and useEffects remain the same
 
  const [ourInfo1, setOurInfo1] = useState({
    address: '',
    email: '',
    mobile: '',
    paymentMethod: '',
    salePerson: '',
    web: '',
    note:'',
    address1:'',
  });
  const handleCheckboxChange = (event) => {
    setShowNote(event.target.checked); // Update showNote state based on checkbox status
  };
  
  const handleOpenModal = () => {
    setShowModal(true);
    // Set edited ourInfo to the current ourInfo data
    setEditedOurInfo(ourInfo1);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setShowModal(false);
    // Clear edited ourInfo when modal is closed
    setEditedOurInfo({});
  };

  // Function to handle saving the edited ourInfo
  const handleSaveOurInfo = () => {
    // Save edited ourInfo to Firebase
    const ourInfoRef = ref(database, 'ourInfo');
    set(ourInfoRef, editedOurInfo)
      .then(() => {
        console.log('Edited Our Info successfully saved to Firebase');
        // Close the modal after saving
        setShowModal(false);
      })
      .catch((error) => {
        console.error('Error saving edited Our Info to Firebase: ', error);
      });
  };

  // Function to handle changes in the editable fields inside the modal
  const handleModalInputChange = (event) => {
    const { name, value } = event.target;
    setEditedOurInfo((prev) => ({ ...prev, [name]: value }));
  };

  const [showNote, setShowNote] = useState(() => {
    const storedShowNote = localStorage.getItem('showNote');
    return storedShowNote ? JSON.parse(storedShowNote) : false;
  });

  const [checked, setChecked] = useState(() => {
    const storedChecked = localStorage.getItem('checked');
    return storedChecked ? JSON.parse(storedChecked) : { vehicle1: false, vehicle2: true };
  });
  
 

  useEffect(() => {
    // Update local storage whenever showNote state changes
    localStorage.setItem('showNote', JSON.stringify(showNote));
  }, [showNote]);

 
  useEffect(() => {
    const ourInfoRef = ref(database, 'ourInfo');
    onValue(ourInfoRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setOurInfo1(data);
      }
    });
  }, []);
  
  // Update local storage whenever checked state changes
  useEffect(() => {
    const valueToSave = checked.vehicle1 ? 'Quotation' : 'Invoice';
    localStorage.setItem('invoiceType', valueToSave);
  }, [checked]);



  const handleChange = (event) => {
    const { name } = event.target;
    const updatedChecked = {};
    
    // Uncheck all checkboxes
    Object.keys(checked).forEach(key => {
      updatedChecked[key] = false;
    });
  
    // Check the clicked checkbox
    updatedChecked[name] = true;
  
    setChecked(updatedChecked);
  };
  const screen=window.innerWidth
  console.log(screen)
  //let [eSignature,setEsignature]=useState("")
  // let eSignature=localStorage.getItem("signature")
  
 // const signatureCanvasRef = useRef();



   {/*const handleResetSignature = () => {
    setEsignature(null);
  signatureCanvasRef.current.clear();
  };*/}
  useEffect(() => {
    // Save ourInfo1 to local storage
    localStorage.setItem('ourInfo', JSON.stringify(ourInfo1));
  }, [ourInfo1]);

  useEffect(() => {
    const savedFormData = JSON.parse(sessionStorage.getItem('invoiceFormData'));
    if (savedFormData) {
      setOurInfo(savedFormData.ourInfo);
      setClientInfo(savedFormData.clientInfo);
      setProducts(savedFormData.products);
      setNote(savedFormData.note);
      setChecked(savedFormData.checked);
      setOurInfo1(savedFormData.ourInfo1)
      setShowNote(savedFormData.showNote)
      setDiscount(savedFormData.discount)
      setDiscountedTotal(savedFormData.discountedTotal)
      setDiscountPercentage(savedFormData.discountPercentage)
    }
  }, []);
  const handleResetForm = () => {
    sessionStorage.removeItem('invoiceFormData');
    setOurInfo({ seller: '', mobile: '', email: '', paymentMethod: '', web: '', address: '', date: '', dueDate: '' });
    setClientInfo({ client: '', clientMobile: '', clientEmail: '', clientWeb: '', clientAddress: '' });
    setProducts([{ productName: '', price: '', unitPrice: '', quantity: '', discount: '', total: '' }]);
    setNote(''); 
    setChecked({vehicle1: false, vehicle2: false });

    {/* localStorage.removeItem('signature');
    handleResetSignature();*/}
    
  };
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [totalBill, setTotalBill] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountedTotal, setDiscountedTotal] = useState("");

  // Assuming products state is set elsewhere

  // Calculate total bill whenever products or discount percentage changes
  useEffect(() => {
    const calculateTotalBill = () => {
      let total = 0;
      products.forEach((product) => {
        if (!isNaN(parseFloat(product.total))) {
          total += parseFloat(product.total);
        }
      });
      return Math.max(total, 0);
    };

    const calculateDiscount = (totalBill, discountPercentage) => {
      return (totalBill * discountPercentage) / 100;
    };

    const newTotalBill = calculateTotalBill();
    const newDiscount = calculateDiscount(newTotalBill, discountPercentage);
    const newDiscountedTotal = newTotalBill - newDiscount;

    setTotalBill(newTotalBill.toFixed(2));
    setDiscount(newDiscount.toFixed(2));
    setDiscountedTotal(newDiscountedTotal.toFixed(2));
  }, [products, discountPercentage]);

  const handleDiscountChange = (event) => {
    const { value } = event.target;
    setDiscountPercentage(value);
  };

  const handleAddProduct = () => {
    setProducts([...products, { productName: '', price: '', unitPrice: '', quantity: '', discount: '' }]);
  };

  const handleDeleteProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  };

  const handleProductInputChange = (index, event) => {
    const { name, value } = event.target;
    const updatedProducts = [...products];
    updatedProducts[index][name] = value;
  
    // Calculate total based on price and discount
    if (name === "price" || name === "discount") {
      const price = parseFloat(updatedProducts[index].price) || 0;
      const discount = parseFloat(updatedProducts[index].discount) || 0;
      const quantity = parseFloat(updatedProducts[index].quantity) || 0;
  
      const totalPrice = price * quantity * (1 - discount / 100);
      updatedProducts[index].total = totalPrice.toFixed(2); 
    }
  
    setProducts(updatedProducts);
  };

  const handleOurInfoChange = (event) => {
    const { name, value } = event.target;
    setOurInfo({ ...ourInfo, [name]: value });
  };

  const handleClientInfoChange = (event) => {
    const { name, value } = event.target;
    setClientInfo({ ...clientInfo, [name]: value });
  };
  
  
  const handleFormSubmit = (event) => {
    event.preventDefault();
  
    if (products.length === 0 || products.every(product => product.productName === '')) {
      // If no products added, show alert message and return
      alert('Please add at least one product before submitting the form.');
      return;
    }
    const formData = {
      ourInfo: ourInfo,
      clientInfo: clientInfo,
      products: products,
      note: note,
      checked:checked,
      ourInfo1:ourInfo1,
      showNote:showNote,
      discount: discount, // Include discount value in formData
    discountedTotal: discountedTotal,
    discountPercentage:discountPercentage,
      //signature: signatureCanvasRef.current?.toDataURL() ? signatureCanvasRef.current.toDataURL() : eSignature
    };
   
    
    // Pushing form data to Firebase
    push(ref(database, 'invoices'), formData)
      .then(() => {
       
        navigate('/invoice-summary', { state: { formData } });
      })
      .catch((error) => {
        alert('Error saving form data to Firebase: ' + error.message);
      });
      //localStorage.setItem('signature', formData.signature);
    // Clearing form data and note
    sessionStorage.setItem('invoiceFormData', JSON.stringify(formData));
    setOurInfo({ seller: '', mobile: '', email: '', paymentMethod: '', web: '', address: '', date: '', dueDate: '' });
    setClientInfo({ client: '', clientMobile: '', clientEmail: '', clientWeb: '', clientAddress: '' });
    setProducts([{ productName: '', price: '', unitPrice: '', quantity: '', discount: '', total: '' }]);
    setNote([{note:''}]);
   setChecked([{checked:''}])
   setOurInfo1([{ address: '',
   email: '',
   mobile: '',
   paymentMethod: '',
   salePerson: '',
   web: '',
  note:'',
  address1:'',
  }])
  setShowNote([{showNote:''}])
  };

  {/* useEffect(() => {
    // Load signature data from local storage on component mount
    const savedSignature = localStorage.getItem('signature');
    if (savedSignature) {
      setEsignature(savedSignature);
    }
  }, [])*/}
 
  return (
    <>
   
    <Modal open={showModal} onClose={handleCloseModal}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4 ,width:screen <430 ?'70%':'70%',minHeight:'430px'}}>
        <h2>Edit Our Information</h2>
        <form>
          {/* Render editable fields */}
          <div style={{display:'flex',justifyContent:'center',width:'100%',flexWrap:'wrap'}}>
          <div className='inn1' style={{marginBottom:'15px',width:'48%'}}><TextField id='saleppp' label="Sales Person" variant="outlined" name="salePerson" value={editedOurInfo.salePerson || ''} onChange={handleModalInputChange} fullWidth /></div>
         {'\u00A0'} {'\u00A0'} <div className='inn1' style={{marginBottom:'10px',width:'48%'}}><TextField id='saleppp' label="Mobile No" variant="outlined" name="mobile" value={editedOurInfo.mobile || ''} onChange={handleModalInputChange} fullWidth /></div>
         <div className='inn1' style={{marginBottom:'15px',width:'48%'}}><TextField id='saleppp' label="Email" variant="outlined" name="email" value={editedOurInfo.email || ''} onChange={handleModalInputChange} fullWidth /></div>
         {'\u00A0'} {'\u00A0'}<div className='inn1' style={{marginBottom:'10px',width:'48%'}}><TextField id='saleppp' label="Payment Method" variant="outlined" name="paymentMethod" value={editedOurInfo.paymentMethod || ''} onChange={handleModalInputChange} fullWidth /></div>
          <div className='inn1' style={{marginBottom:'15px',width:'48%'}}><TextField id='saleppp' label="Website" variant="outlined" name="web" value={editedOurInfo.web || ''} onChange={handleModalInputChange} fullWidth /></div>
          {'\u00A0'} {'\u00A0'} <div className='inn1' style={{marginBottom:'10px',width:'48%'}}><TextField id='saleppp' label="Address1" variant="outlined" name="address" value={editedOurInfo.address || ''} onChange={handleModalInputChange} fullWidth /></div>
        <div className='inn1' style={{marginBottom:'10px',width:'48%'}}><TextField id='saleppp' label="Address2" variant="outlined" name="address1" value={editedOurInfo.address1 || ''} onChange={handleModalInputChange} fullWidth /></div>
          <div  style={{width:'85%',display:'flex',justifyContent:'center'}}><TextField  label="Note" id='salepppt' variant="outlined" name="note" value={editedOurInfo.note || ''} onChange={handleModalInputChange} fullWidth multiline /></div> </div>
          {/* Save and Cancel buttons */}
          <div style={{display:'flex',justifyContent:'center'}}>
          <Button variant="contained" onClick={handleCloseModal} sx={{mr: 2,mt:2 }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveOurInfo} sx={{ mt:2,width:'90px' }}>Save</Button></div>
         
        </form>
      </Box>
    </Modal>
    
      <div className='container'>
      <div className='btnq1'>
     <div className='checked'>
     <span style={{display:'flex',alignItems:'center',justifyContent:'center'}}> <input
     type="checkbox"
     id="vehicle2"
     name="vehicle2"
     value="Car"
     checked={checked.vehicle2}
     onChange={handleChange}
     style={{ transform: 'scale(0.6)' }}
   />
   <label id='checklbl' htmlFor="vehicle2">Invoice</label></span>
       <span style={{display:'flex',alignItems:'center',justifyContent:'center'}}><input
          type="checkbox"
          id="vehicle1"
          name="vehicle1"
          value="Bike"
          checked={checked.vehicle1}
          onChange={handleChange}
          style={{ transform: 'scale(0.6)' }}
        />
        <label id='checklbl' htmlFor="vehicle1">Quotation</label><br /></span> 
        </div>
      </div>
      
      <h1>{checked.vehicle1 ? 'Quotation' : 'Invoice'}</h1>
        <form id="invoice-form" style={{ marginBottom: '20px' }} onSubmit={handleFormSubmit} >
          <fieldset>
            <legend>Our Information</legend>
            <div style={{width:'100%',display:'flex',justifyContent:'flex-end',alignItems:'center',fontFamily:'sans-serif'}}>
            <Button id='btn6' onClick={handleOpenModal}>Edit Form {'\u00A0'}<TbEdit/></Button></div>
            <div className="form-group"> 
              <label htmlFor="seller">Sales Person:</label>
              <input type="text" id="seller" name="seller"  value={ourInfo1.salePerson} onChange={handleOurInfoChange} /> 
            </div>
            <div className="form-group">
              <label htmlFor="mobile">Mobile No:</label>
              <input type="text" id="mobile" name="mobile"  value={ourInfo1.mobile} onChange={handleOurInfoChange} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" className='email' name="email"  value={ourInfo1.email} onChange={handleOurInfoChange} />
            </div>
            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method:</label>
              <input type="text" id="paymentMethod" name="paymentMethod"  value={ourInfo1.paymentMethod} onChange={handleOurInfoChange} />
            </div>
            <div className="form-group">
              <label htmlFor="web">Website:</label>
              <input type="text" id="web" name="web"  value={ourInfo1.web} onChange={handleOurInfoChange} />
            </div>
         
            <div className="form-group">
              <label htmlFor="date">Date:</label>
              <input type="date"  name="date"    value={ourInfo.date} onChange={handleOurInfoChange} />
            </div>
           
            <div className="form-group" style={{width:'100%'}}>
            <label htmlFor="address">Address 1:</label>
            <input type="text" id="address" name="address"  value={ourInfo1.address} onChange={handleOurInfoChange} />
            </div>
            <div className="form-group" style={{width:'100%'}}>
            <label htmlFor="address">Address 2:</label>
            <input type="text" id="address" name="address"  value={ourInfo1.address1} onChange={handleOurInfoChange} />
            </div>
          </fieldset>
          <fieldset>
            <legend>Client Information</legend>
            <div className="form-group"> 
              <label htmlFor="client">Client Name:</label>
              <input type="text" id="client" name="client"  value={clientInfo.client} onChange={handleClientInfoChange} /> 
            </div>
            <div className="form-group">
              <label htmlFor="clientMobile">Mobile No:</label>
              <input type="text" id="clientMobile" name="clientMobile"  value={clientInfo.clientMobile} onChange={handleClientInfoChange} />
            </div>
            <div className="form-group">
              <label htmlFor="clientEmail">Email:</label>
              <input type="email" id="clientEmail" className='email' name="clientEmail"  value={clientInfo.clientEmail} onChange={handleClientInfoChange} />
            </div>
            <div className="form-group">
              <label htmlFor="clientWeb">Website:</label>
              <input type="text" id="clientWeb" name="clientWeb"  value={clientInfo.clientWeb} onChange={handleClientInfoChange} />
            </div>
            <div className="form-group" id='adr'>
              <label htmlFor="clientAddress">Address:</label>
              <input type="text" id="clientAddress" name="clientAddress"  value={clientInfo.clientAddress} onChange={handleClientInfoChange} />
            </div>
          </fieldset>
          
          <fieldset>
            <legend>Products</legend>
            <table id="products-table">
              <thead>
                <tr>
                  <th id='thp'>Product Name</th>
                  <th>Unit</th>
                  <th>Quantity</th>
                  <th>Price</th>
            
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td><input type="text" id='ii' name="productName" placeholder='Product Name' value={product.productName} onChange={(e) => handleProductInputChange(index, e)} /></td>
                    <td><input type="text" id='uu' name="unitPrice"  placeholder='kg' value={product.unitPrice} onChange={(e) => handleProductInputChange(index, e)} /></td>
                    <td><input type="text" id='uu' name="quantity" placeholder='0' value={product.quantity} onChange={(e) => handleProductInputChange(index, e)} /></td>
                    <td><input type="text" id='uu' name="price" placeholder='0' value={product.price} onChange={(e) => handleProductInputChange(index, e)} /></td>
                   
                    <td><input type="text" id='uu' name="total" placeholder='0' value={product.total} onChange={(e) => handleProductInputChange(index, e)} /></td>
                    <td>
                      <button id='btnd' type="button" className="delete-product" onClick={() => handleDeleteProduct(index)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
           
            <div>
            <label htmlFor="discount">Discount Percentage:</label>
            <input type="text" id="discount" value={discountPercentage} onChange={handleDiscountChange} />
            
            <div>
              <p>Total Bill: {totalBill}</p>
              <p>Discount: %{discountPercentage}</p>
              <p>Discounted Total: {discountedTotal}</p>
            </div>
            
            {/* Display other invoice details and products */}
          </div>
            <div style={{ width: '100%',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
              <button type="button" id="add-product" onClick={handleAddProduct}>Add Product</button>
            <span> 
            </span>
            </div>
          </fieldset>
         {/*  <fieldset>
          <legend>Signature</legend>
          {eSignature !== null ? (
            <img className='sigCanvas' src={eSignature} alt="E-Signature"/>
          ) : (
            <SignatureCanvas
              ref={signatureCanvasRef}
              penColor='green'
              canvasProps={{ width: 300, height: 130, className: 'sigCanvas' }}
            />
          )}
        <button type="button" id='btnreset' onClick={handleResetSignature}>Reset Signature</button>
          </fieldset>*/}
         
          <fieldset>
            <legend>Note</legend>
           
            {/* Note section */}
          
              <div className="form-group33">
              <div className='not' style={{fontSize:'12px',display:'flex',justifyContent:'flex-end',alignItems:'center',marginTop:'-15px'}}>
              <label style={{marginBottom:'0px',marginRight:'-10px'}} htmlFor="showNoteCheckbox">Show Note</label>
              <input
              type="checkbox"
              id="showNoteCheckbox"
              checked={showNote}
              onChange={handleCheckboxChange}
              style={{ transform: 'scale(0.6)' }}
            />
               
              </div>
                <textarea id="note" name="note" value={ourInfo1.note} onChange={handleOurInfoChange} />
              </div>
           
          </fieldset>
          <div style={{ width: '99%', display:'flex', justifyContent:'space-between',alignItems:'center' }}>
              <div></div>
            <span> 
            <button type="button" id='reset' onClick={handleResetForm}>Reset Form</button>
            {'\u00A0'}<button type="submit" >Submit</button></span>
            </div>
        </form>
       
      </div>
    </>
  );
}
