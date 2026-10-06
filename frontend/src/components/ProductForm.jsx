import { useEffect, useState } from 'react';

const empty = { product_name: '', product_code: '', category: '', price: '', quantity: '', date_added: new Date().toISOString().slice(0, 10), status: 'Available' };
const categories = ['Electronics', 'Stationery', 'Home', 'Grocery', 'Clothing', 'Agriculture', 'Other'];

export default function ProductForm({ product, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  useEffect(() => setForm(product ? { ...product, price: String(product.price), quantity: String(product.quantity) } : empty), [product]);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const validate = () => {
    const e = {};
    ['product_name','product_code','category','price','quantity','date_added','status'].forEach(k => { if (!String(form[k] ?? '').trim()) e[k] = 'Required'; });
    if (form.price && (!Number.isFinite(Number(form.price)) || Number(form.price) <= 0)) e.price = 'Enter a positive number';
    if (form.quantity && (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 0)) e.quantity = 'Enter a valid non-negative number';
    setErrors(e); return !Object.keys(e).length;
  };
  const submit = (e) => { e.preventDefault(); if (validate()) onSubmit({ ...form, price: Number(form.price), quantity: Number(form.quantity) }); };
  return <form className="product-form" onSubmit={submit}>
    <div className="form-header"><div><h2>{product ? 'Edit Product' : 'Add Product'}</h2><p>Enter the product details below.</p></div><button type="button" className="icon-btn" onClick={onCancel}>×</button></div>
    <div className="form-grid">
      <Field label="Product Name" name="product_name" value={form.product_name} onChange={change} error={errors.product_name}/>
      <Field label="Product Code" name="product_code" value={form.product_code} onChange={change} error={errors.product_code}/>
      <label>Category<select name="category" value={form.category} onChange={change}><option value="">Select category</option>{categories.map(c=><option key={c}>{c}</option>)}</select>{errors.category&&<small>{errors.category}</small>}</label>
      <Field label="Price" name="price" type="number" step="0.01" min="0.01" value={form.price} onChange={change} error={errors.price}/>
      <Field label="Quantity" name="quantity" type="number" min="0" value={form.quantity} onChange={change} error={errors.quantity}/>
      <Field label="Date Added" name="date_added" type="date" value={form.date_added} onChange={change} error={errors.date_added}/>
      <label>Status<select name="status" value={form.status} onChange={change}><option>Available</option><option>Unavailable</option></select>{errors.status&&<small>{errors.status}</small>}</label>
    </div>
    <div className="form-actions"><button type="button" className="secondary" onClick={onCancel}>Cancel</button><button type="submit" className="primary">{product ? 'Update Product' : 'Add Product'}</button></div>
  </form>;
}
function Field({ label, error, ...props }) { return <label>{label}<input {...props}/>{error&&<small>{error}</small>}</label>; }
