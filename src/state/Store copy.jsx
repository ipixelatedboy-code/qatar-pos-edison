import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const StoreContext = createContext(null)

const API_BASE = import.meta.env.VITE_API_BASE || '/api'
const CURRENCY = 'QR'

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
    try {
      const res = await fetch(`${API_BASE}/CategoriesApi`)
      const cats = await res.json()
      setCategories(cats.map(c => ({ id: c.id, name: c.categoryName })))

      let allProducts = []
      for (let c of cats){
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
      setProducts(allProducts)
    } catch(err){
      console.error('Error loading data:', err)
    }
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 5000)
    return () => clearInterval(interval)
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
    refreshData: loadData, // alias to match original usage
    addItemToCart,
    incrementCartItem,
    decrementCartItem,
    removeCartItem,
  }), [staff, products, categories, transactions, cart, cartTotal])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
