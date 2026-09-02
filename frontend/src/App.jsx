import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Product from './components/pages/Product'
// import CartDrawer from "./components/CartDrawer";
import Collection from './components/pages/Collection'

//user login,rgister and account routes
import {default as UserRegister} from './components/users/Register'
import {default as UserLogin} from './components/users/Login'
import {default as UserAccount} from './components/users/Account'

import { ToastContainer } from 'react-toastify'

//Admin Routes

import Login from './components/admin/Login'
import Dashboard from './components/admin/Dashboard'
import { AdminRequireAuth } from './components/admin/AdminRequireAuth'
import {default as ShowCategories} from './components/admin/category/Show'
import {default as CreateCategories} from './components/admin/category/Create'
import {default as EditCategories} from './components/admin/category/Edit'

import {default as ShowBrands} from './components/admin/brand/Show'
import {default as CreateBrands} from './components/admin/brand/Create'
import {default as EditBrands} from './components/admin/brand/Edit'

import {default as ShowShipping} from './components/admin/shipping/Show'
import {default as CreateShipping} from './components/admin/shipping/Create'

import {default as ShowProducts} from './components/admin/product/Show'
import {default as CreateProducts} from './components/admin/product/Create'
import {default as EditProducts} from './components/admin/product/Edit'

import {default as ShowOrders} from './components/admin/order/Show'
import {default as ShowDetailsOrders} from './components/admin/order/Details'

import UserRequireAuth from './components/users/UserRequireAuth'
import Cart from './components/pages/Cart'
import Confirmation from './components/pages/Confirmation'
import MyOrders from './components/pages/MyOrders'
import OrderDetails from './components/pages/OrderDetails'
import ProtectedCheckout from './components/common/ProtectedCheckout'

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
      
        <Route path='/'  element={<Home/>}/>
        <Route path="/collections/:slug" element={<Collection />}
          />
        <Route path='/product/:id'  element={<Product/>}/>

        <Route path='/register'  element={<UserRegister/>}/>
        <Route path='/login'  element={<UserLogin/>}/>
        <Route path='/cart'  element={<Cart/>}/>

        <Route element={<UserRequireAuth />}>
            <Route path='/account'  element={<UserAccount/>}/>
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path='/account/orders'  element={<MyOrders/>}/>
            <Route path='/checkout'  element={<ProtectedCheckout/>}/>
            <Route path='/order/confirmation/:id'  element={<Confirmation/>}/>
           
        </Route>

     



        {/* <Route path='/cart' element={<CartDrawer/>} /> */}
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

             {/* <Route path='/admin/shippings' element={<ShowShipping/>}/>
             <Route path='/admin/shippings/create' element={<CreateShipping/>}/> */}

              <Route path='/admin/products' element={<ShowProducts/>}/>
             <Route path='/admin/products/create' element={<CreateProducts/>}/>
             <Route path='/admin/products/edit/:id' element={<EditProducts/>}/>

              <Route path='/admin/orders' element={<ShowOrders/>}/>
              <Route path='/admin/orders/show/:id' element={<ShowDetailsOrders/>}/>

           </Route>

      </Routes>
      </BrowserRouter>
      <ToastContainer/>
    
    </>
  )
}

export default App
