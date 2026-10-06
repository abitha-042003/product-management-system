import { useEffect, useState } from 'react';
import { productApi } from './api';
import ProductForm from './components/ProductForm';
import ProductTable from './components/ProductTable';

export default function App() {
  const [products,setProducts]=useState([]), [editing,setEditing]=useState(null), [showForm,setShowForm]=useState(false);
  const [filters,setFilters]=useState({search:'',category:'',status:'',sortBy:'product_name',sortOrder:'ASC'}), [page,setPage]=useState(1);
  const [pagination,setPagination]=useState({page:1,total:0,totalPages:0}), [message,setMessage]=useState(null), [loading,setLoading]=useState(false);
  const load = async () => { setLoading(true); try { const {data}=await productApi.list({...filters,page,limit:10}); setProducts(data.products); setPagination(data.pagination); } catch(e) { notify(e.response?.data?.message||'Unable to load products','error'); } finally {setLoading(false);} };
  useEffect(()=>{load()},[filters,page]);
  const notify=(text,type='success')=>{setMessage({text,type}); setTimeout(()=>setMessage(null),3000)};
  const save=async(data)=>{try{if(editing) await productApi.update(editing.product_id,data); else await productApi.create(data); notify(editing?'Product updated successfully':'Product added successfully'); setShowForm(false);setEditing(null);load();}catch(e){notify(e.response?.data?.message||'Operation failed','error')}};
  const remove=async(p)=>{if(!window.confirm(`Delete "${p.product_name}"? This action cannot be undone.`))return;try{await productApi.remove(p.product_id);notify('Product deleted successfully');if(products.length===1&&page>1)setPage(page-1);else load();}catch(e){notify(e.response?.data?.message||'Delete failed','error')}};
  const updateFilter=(key,value)=>{setPage(1);setFilters(f=>({...f,[key]:value}))};
  return <div className="app"><header><div><div className="eyebrow">ADMIN CONSOLE</div><h1>Product Management</h1><p>Manage your product inventory efficiently.</p></div><button className="primary add" onClick={()=>{setEditing(null);setShowForm(true)}}>＋ Add Product</button></header>
    {message&&<div className={`toast ${message.type}`}>{message.type==='success'?'✓':'!'} {message.text}</div>}
    <main><section className="panel controls"><div className="search"><span>⌕</span><input placeholder="Search by product name or code..." value={filters.search} onChange={e=>updateFilter('search',e.target.value)}/></div><select value={filters.category} onChange={e=>updateFilter('category',e.target.value)}><option value="">All Categories</option>{['Electronics','Stationery','Home','Grocery','Clothing','Agriculture','Other'].map(x=><option key={x}>{x}</option>)}</select><select value={filters.status} onChange={e=>updateFilter('status',e.target.value)}><option value="">All Status</option><option>Available</option><option>Unavailable</option></select><select value={`${filters.sortBy}:${filters.sortOrder}`} onChange={e=>{const [sortBy,sortOrder]=e.target.value.split(':');setFilters(f=>({...f,sortBy,sortOrder}));setPage(1)}}><option value="product_name:ASC">Name A–Z</option><option value="product_name:DESC">Name Z–A</option><option value="price:ASC">Price Low–High</option><option value="price:DESC">Price High–Low</option></select></section>
    <section className="panel"><div className="panel-title"><div><h2>Products</h2><span>{pagination.total} total records</span></div>{loading&&<span className="loading">Loading...</span>}</div><ProductTable products={products} onEdit={p=>{setEditing(p);setShowForm(true)}} onDelete={remove}/><div className="pagination"><button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>← Previous</button><span>Page {pagination.page} of {Math.max(pagination.totalPages,1)}</span><button disabled={page>=pagination.totalPages} onClick={()=>setPage(p=>p+1)}>Next →</button></div></section></main>
    {showForm&&<div className="modal-backdrop"><div className="modal"><ProductForm product={editing} onSubmit={save} onCancel={()=>{setShowForm(false);setEditing(null)}}/></div></div>}
  </div>;
}
