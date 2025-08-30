import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const StoreContext = createContext(null)

const API_BASE = import.meta.env.VITE_API_BASE || '/api'
const CURRENCY = 'QR'
const CACHE_KEY = 'pos_cache_data';
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // Cache expires after 5 minutes

export function StoreProvider({ children }){
  const [staff, setStaff] = useState(null)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [cart, setCart] = useState([])

  const [students, setStudents] = useState([
    { id: 1, card_id: 'S100', name: 'Alice', balance: 10.0, outstanding: 0 },
    { id: 2, card_id: 'S200', name: 'Bob', balance: 5.0, outstanding: 0 },
  ])

  const loadData = async () => {
    // 1. Try to load from cache first
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
          console.log("Loading data from cache.");
          setCategories(data.categories);
          setProducts(data.products);
          return; // Exit if cached data is valid
        }
      }
    } catch (e) {
      console.error("Could not read from cache.", e);
    }

    // 2. If cache is missing or stale, fetch from the API
    try {
      const res = await fetch(`${API_BASE}/CategoriesApi`)
      const cats = await res.json()
      
      // Map categories and FILTER OUT any category named "All"
      const formattedCategories = cats
        .map(c => ({ id: c.id, name: c.categoryName }))
        .filter(c => c.name.toLowerCase() !== 'all');

      let allProducts = []
      for (let c of cats){ // Still loop through original cats to get all products
        const pres = await fetch(`${API_BASE}/CategoriesApi/products/${c.id}`)
        const prods = await pres.json()
        allProducts = [...allProducts, ...prods.map(p => ({
          id: p.id,
          name: p.name,
          price: p.unitPrice,
          category_id: p.categoryId,
          description: p.description,
          image: p.imageURL,
        }))]
      }
      setProducts(allProducts);
      setCategories(formattedCategories); // Set the filtered list of categories

      // 3. Save the newly fetched data to the cache
      try {
        const cacheData = {
          timestamp: Date.now(),
          data: {
            categories: formattedCategories, // Save the filtered list
            products: allProducts,
          },
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      } catch (e) {
        console.error("Could not write to cache.", e);
      }

    } catch(err){
      console.error('Error loading data:', err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + (item.price ?? 0) * item.qty, 0),
    [cart]
  )

  const addItemToCart = (item) => {
    const price = item.price ?? item.unitPrice ?? 0
    if (price === 0) return
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing){
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...item, price, qty: 1 }]
    })
  }

  const incrementCartItem = (item) => {
    setCart(prev => prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
  }

  const decrementCartItem = (item) => {
    setCart(prev => prev.map(i => i.id === item.id ? { ...i, qty: i.qty - 1 } : i).filter(i => i.qty > 0))
  }

  const removeCartItem = (item) => {
    setCart(prev => prev.filter(i => i.id !== item.id))
  }

  const clearCart = () => setCart([])

  const login = (staff_no, pin) => {
    if (staff_no === '1001' && pin === '1234'){
      setStaff({ id: 1, staff_no, name: 'Admin' })
      return Promise.resolve(true)
    }
    return Promise.reject(new Error('Invalid credentials'))
  }

  const logout = () => {
    setStaff(null)
    clearCart()
  }

  const findStudentByCard = (cardId) => Promise.resolve(students.find(s => s.card_id === cardId) || null)

  const updateStudentBalance = (studentId, delta, outstandingDelta = 0) => {
    setStudents(prev => prev.map(s => s.id === studentId ? {
      ...s,
      balance: parseFloat((s.balance + delta).toFixed(2)),
      outstanding: parseFloat(((s.outstanding ?? 0) + outstandingDelta).toFixed(2)),
    } : s))
    return Promise.resolve(true)
  }

  const recordTxn = (data) => {
    const student = data.student_id ? students.find(s => s.id === data.student_id) : null
    setTransactions(prev => [
      {
        id: prev.length + 1,
        ts: Date.now(),
        staff_id: staff?.id,
        staff_name: staff?.name || 'N/A',
        student_name: student?.name || 'N/A',
        ...data,
      },
      ...prev,
    ])
    clearCart()
    return Promise.resolve(true)
  }

  const getHistory = () => Promise.resolve(transactions)

  const value = useMemo(() => ({
    staff,
    products,
    categories,
    cart,
    cartTotal,
    CURRENCY,
    login,
    logout,
    findStudentByCard,
    updateStudentBalance,
    recordTxn,
    getHistory,
    loadData,
    refreshData: loadData, // alias
    addItemToCart,
    incrementCartItem,
    decrementCartItem,
    removeCartItem,
  }), [staff, products, categories, transactions, cart, cartTotal])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)