import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { GoMail } from "react-icons/go";
import { FaWhatsapp } from "react-icons/fa";
import { TbWorldWww } from "react-icons/tb";
import './InvoiceSummary.css';
import Invoice from './Invoice';

export default function InvoiceSummary({totalBill, discount, discountedTotal}) {
  const [currentDate, setCurrentDate] = useState('');
  const [productPages, setProductPages] = useState([]);
  const location = useLocation();
  const formData = location.state?.formData;
  const invoiceRef = useRef([]);

  const invoiceNumber = Math.floor(Math.random() * 10000000);
 
  useEffect(() => {
    const getCurrentDate = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    setCurrentDate(getCurrentDate());
  }, []);
  useEffect(() => {
    if (formData) {
      const products = formData.products;
      const pages = [];
  
      // First Page Logic
      const firstPageProducts = products.slice(0, 9); // Show first 9 products on the first page
      pages.push(firstPageProducts);
  
      // Check if more than 6 products exist and showNote is not present
      if (!formData.showNote && products.length > 6) {
        // Second Page Logic
        const remainingProducts = products.slice(9); // Start from the 10th product
        const secondPageProducts = remainingProducts.slice(0, 14); // Show next 14 products on the second page
        pages.push(secondPageProducts);
  
        // Additional Pages Logic
        const remainingProductsAfterSecondPage = remainingProducts.slice(14);
        const totalPages = Math.ceil(remainingProductsAfterSecondPage.length / 14);
  
        for (let i = 0; i < totalPages; i++) {
          const startIndex = i * 14;
          const endIndex = Math.min(startIndex + 14, remainingProductsAfterSecondPage.length);
          const pageProducts = remainingProductsAfterSecondPage.slice(startIndex, endIndex);
          pages.push(pageProducts);
        }
      }
      // Check if more than 4 products exist and showNote is present
      else if (formData.showNote && products.length > 4) {
        // Second Page Logic
        const remainingProducts = products.slice(9); // Start from the 6th product
        const secondPageProducts = remainingProducts.slice(0, 14); // Show next 14 products on the second page
        pages.push(secondPageProducts);
  
        // Additional Pages Logic
        const remainingProductsAfterSecondPage = remainingProducts.slice(14);
        const totalPages = Math.ceil(remainingProductsAfterSecondPage.length / 14);
  
        for (let i = 0; i < totalPages; i++) {
          const startIndex = i * 14;
          const endIndex = Math.min(startIndex + 14, remainingProductsAfterSecondPage.length);
          const pageProducts = remainingProductsAfterSecondPage.slice(startIndex, endIndex);
          pages.push(pageProducts);
        }
      }
  
      setProductPages(pages);
    }
  }, [formData]);
  
  
  
  

  const handleDownloadPDF = async () => {
    try {
      const pdf = new jsPDF();
      const scale = 2; // Adjust scale as needed
      const totalPages = productPages.length;
      let pageCount = 1; // Track page count

      for (let index = 0; index < productPages.length; index++) {
        const canvas = await html2canvas(invoiceRef.current[index], { scale: scale });
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Use canvas dimensions for height
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        // Add page number at the top
        if (totalPages > 1) {
          pdf.setFontSize(10);
          pdf.text(`Page ${pageCount}`, pdfWidth / 2, 10, { align: 'center' });
        }

        if (index !== productPages.length - 1) {
          pdf.addPage();
          pageCount++;
        }
      }

      pdf.save('invoice.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };



  function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  }
 


  const calculateTotalBill = () => {
    let totalBill = 0;
    formData.products.forEach((product) => {
      if (!isNaN(parseFloat(product.total))) {
        totalBill += parseFloat(product.total);
      }
    });
    return Math.max(totalBill, 0).toFixed(2);
  };
  const handlePrint = () => {
    window.print();
  };
  return (
    <>
   
    <div className="download-container">
    <button id='dwn' onClick={handlePrint}>Download PDF</button>
  </div>

      {productPages.map((products, pageIndex) => (
        <div key={pageIndex} className="invoice-container"  ref={el => invoiceRef.current[pageIndex] = el}>
        {pageIndex === 0 && (   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',marginTop:'-30px' }}>
            <div  style={{width:'17%'}}></div>
           <img height={170} width={"50%"} src='images/pool.png' />
           <span style={{display:'flex',alignItems:'flex-start',flexDirection:'column'}}> {formData && (
              <h1 style={{ color: '#2a68b2' }}>
                {formData.checked.vehicle1 ? 'Quotation' : 'Invoice'}
              </h1>
            )}
            <p style={{margin:'0px'}}>{formData.checked.vehicle1 ? 'Quotation' : 'Invoice'} # {invoiceNumber}</p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Date:
            <input
              type="text"
              id="currentdate"
              name="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
            />
          </div>
          </span>
          </div>)}
     
         
         
          {formData && (
            <>
            {pageIndex === 0 && (
              <div className='main'>
                <div className='main1'>
                  <h2 style={{ color: '#2a68b2' }}>Mr POOL TECH</h2>
                  {formData.ourInfo1.salePerson && (
                    <p><span id='hed'>Sales Person:</span> {formData.ourInfo1.salePerson}</p>
                  )}
                  {formData.ourInfo1.mobile && (
                    <p><span id='hed'>Mobile No:</span> {formData.ourInfo1.mobile}</p>
                  )}
                  {formData.ourInfo1.website && (
                    <p><span id='hed'>Website:</span> {formData.ourInfo1.website}</p>
                  )}
                </div>
                <div className='main2'>
                  <h2 style={{ color: '#2a68b2' }}>CLIENT INFORMATION</h2>
                  <p><span id='hed'>Client Name: </span>{formData.clientInfo.client}</p>
                  {formData.clientInfo.clientMobile && (
                  <p><span id='hed'>Mobile No:</span> {formData.clientInfo.clientMobile}</p>
                  )}
                  {formData.clientInfo.clientEmail && (
                  <p><span id='hed'>Email: </span>{formData.clientInfo.clientEmail}</p>
                  )}
                  {formData.clientInfo.clientWeb && (
                    <p><span id='hed'>Website:</span> {formData.clientInfo.clientWeb}</p>
                  )}
                  {formData.clientInfo.clientAddress && (
                  <p><span id='hed'>Address: </span>{formData.clientInfo.clientAddress}</p>
                  )}
                </div>
              </div>
            )}
            {pageIndex === 0 && (
              <div id="seller-data">
                <table>
                  <tbody>
                    <tr>
                      <th id='ee'>Seller</th>
                      <th id='ee'>Buyer</th>
                      <th id='ee'>Payment Method</th>
                      <th id='ee'>Date</th>
                    
                    </tr>
                    {formData && (
                      <tr>
                        <td id='ee'>{formData.ourInfo1.salePerson}</td>
                        <td id='ee'>{formData.clientInfo.client}</td>
                        <td id='ee'>{formData.ourInfo1.paymentMethod}</td>
                        <td id='ee'>{formData.ourInfo.date ? (formData.ourInfo.date) : currentDate}</td>
                       
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              )}
              <h2 id='hed'>Products</h2>
              <table>
                <thead>
                  <tr>
                    <th id='ee'>Product Name</th>
                    <th id='ee'>Unit</th>
                    <th id='ee'>Quantity</th>
                    <th id='ee'>Price</th>
                  
                    <th id='ee'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index}>
                      <td id='ee'>{product.productName}</td>
                      <td id='ee'>{product.unitPrice}</td>
                      <td id='ee'>{product.quantity}</td>
                      <td id='ee'>{product.price}</td>
                     
                      <td id='ee'>{product.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pageIndex === productPages.length - 1 && (
              <div style={{ width: '100%', display: 'flex', alignItems: 'flex-end',flexDirection:'column' }}>
                <p style={{ borderBottom: '1px solid', fontSize: '18px',marginBottom:'-5px',width:'100%',display:'flex',justifyContent:'space-between'}}>  <div>Total Bill:</div> {calculateTotalBill()}</p>
                {formData.discountPercentage && parseFloat(formData.discountPercentage) !== 0 && (
                  <>
                <p style={{ borderBottom: '1px solid', fontSize: '18px',marginBottom:'-5px',width:'100%',display:'flex',justifyContent:'space-between'}}> <div>Discount:</div> {formData.discountPercentage}%</p>
                <p style={{ borderBottom: '1px solid', fontSize: '18px',marginBottom:'-5px',width:'100%',display:'flex',justifyContent:'space-between'}}><div> Grand Total:</div> {formData.discountedTotal}</p>
                </>
                )}
                <div>
  
    </div>
              </div>
              )}
              {pageIndex === productPages.length - 1 && (
                <>
              {formData.showNote ? (
                <p id='pp' style={{ textAlign: 'center',  }}>
                  <span id='hed1' style={{ textAlign: 'center', fontSize:'18px' }}>Note:</span>
                  <span style={{ width: '100%' }}>{formData.ourInfo1.note}</span>
                </p>
              ) : null}
            </>
              )}
     
        
          
              <div className='footer' style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column',width:'190mm',left:'50%',position:'fixed',bottom:"0px" ,marginLeft:"-95mm",background:'white'}}>
                <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', marginBottom:'-15px' }}>
                  {formData && (
                    <p style={{ display: 'flex', justifyContent: 'center', fontSize: '15px', marginTop: "10px", alignItems: 'center',fontWeight:'600' }}><span id='hed' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', height: '30px', width: "30px" }}><img height={20} width={20} src='images/whatsp.png'/></span> {formData.ourInfo1.mobile}{'\u00A0'}</p>
                  )}
                  {formData && (
                    <p style={{ display: 'flex', justifyContent: 'center', fontSize: '15px', marginTop: "10px", alignItems: 'center',fontWeight:'600' }}><span id='hed' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', height: '30px', width: "30px" }}><img height={20} width={20} src='images/mail.png'/></span>{formData.ourInfo1.email}{'\u00A0'}</p>
                  )}
                  {formData && (
                    <p style={{ display: 'flex', justifyContent: 'center', fontSize: '15px', marginTop: "10px", alignItems: 'center',fontWeight:'600' }}><span id='hed' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', height: '30px', width: "30px" }}><img height={20} width={20} src='images/web.png'/></span> {formData.ourInfo1.web}</p>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',flexDirection:'column', height: '60px',width:'100%' }}>
                  {formData && (
                    <p style={{ width: '100%',margin:"0px", display: 'flex', justifyContent: 'center', fontSize: '18px', alignItems: 'center', textAlign: 'center', fontWeight: '600' }}> {formData.ourInfo1.address}</p>
                  )}
                  {formData && (
                    <p style={{ width: '100%',margin:"0px", display: 'flex', justifyContent: 'center', fontSize: '18px', alignItems: 'center', textAlign: 'center', fontWeight: '600', }}> {formData.ourInfo1.address1}</p>
                  )}
                </div>
              </div>
       
            </>
          )}
        </div>
    
      
   
      ))}

    </>
  );
}

