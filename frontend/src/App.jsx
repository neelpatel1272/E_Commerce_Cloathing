import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Shop from './components/Shop'
import Product from './components/Product'
import Login from './components/admin/Login'
import { ToastContainer } from 'react-toastify'
import Dashboard from './components/admin/Dashboard'
import { AdminRequireAuth } from './components/admin/AdminRequireAuth'


import {default as ShowCategories} from './components/admin/category/Show'
import {default as CreateCategories} from './components/admin/category/Create'
import {default as EditCategories} from './components/admin/category/Edit'


import {default as ShowBrands} from './components/admin/brand/Show'
import {default as CreateBrands} from './components/admin/brand/Create'
import {default as EditBrands} from './components/admin/brand/Edit'

import {default as ShowProducts} from './components/admin/product/Show'
import {default as CreateProducts} from './components/admin/product/Create'
import {default as EditProducts} from './components/admin/product/Edit'

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/'  element={<Home/>}/>
        <Route path='/shop'  element={<Shop/>}/>
        <Route path='/product/:id'  element={<Product/>}/>
        {/* <Route path='/login'  element={<Login/>}/> */}

        <Route path='/admin/login' element={<Login/>}/>

           <Route element={<AdminRequireAuth />}>
             <Route path='/admin/dashboard' element={<Dashboard/>}/>

             <Route path='/admin/categories' element={<ShowCategories/>}/>
             <Route path='/admin/categories/create' element={<CreateCategories/>}/>
             <Route path='/admin/categories/edit/:id' element={<EditCategories/>}/>

             <Route path='/admin/brands' element={<ShowBrands/>}/>
             <Route path='/admin/brands/create' element={<CreateBrands/>}/>
             <Route path='/admin/brands/edit/:id' element={<EditBrands/>}/>

              <Route path='/admin/products' element={<ShowProducts/>}/>
             <Route path='/admin/products/create' element={<CreateProducts/>}/>
             <Route path='/admin/products/edit/:id' element={<EditProducts/>}/>
           </Route>

      </Routes>
      </BrowserRouter>
      <ToastContainer/>
    
    </>
  )
}

export default App
