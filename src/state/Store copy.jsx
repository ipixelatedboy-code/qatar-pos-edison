// // import React, {
// //   createContext,
// //   useContext,
// //   useEffect,
// //   useMemo,
// //   useState,
// // } from "react";

// // const StoreContext = createContext(null);

// // const API_BASE = import.meta.env.VITE_API_BASE || "/api";
// // const CURRENCY = "QR";
// // const CACHE_KEY = "pos_cache_data";
// // const CACHE_EXPIRY_MS = 5 * 60 * 1000; // Cache expires after 5 minutes

// // export function StoreProvider({ children }) {
// //   const [staff, setStaff] = useState(null);
// //   const [categories, setCategories] = useState([]);
// //   const [products, setProducts] = useState([]);
// //   const [transactions, setTransactions] = useState([]);
// //   const [cart, setCart] = useState([]);

// //   const [branchId, setBranchId] = useState(null);
// //   const [branchName, setBranchName] = useState(null);

// //   const [students, setStudents] = useState([
// //     { id: 1, card_id: "S100", name: "Alice", balance: 10.0, outstanding: 0 },
// //     { id: 2, card_id: "S200", name: "Bob", balance: 5.0, outstanding: 0 },
// //   ]);

// //   const setBranch = (id, name = null) => {
// //     setBranchId(id);
// //     if (name) setBranchName(name);
// //     return id;
// //   };

// //   const loadData = async (branch = branchId) => {
// //     if (!branch) return;

// //     // 1. Try to load from cache first
// //     try {
// //       const cached = localStorage.getItem(`${CACHE_KEY}_${branch}`);
// //       if (cached) {
// //         const { timestamp, data } = JSON.parse(cached);
// //         if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
// //           console.log("Loading data from cache.");
// //           setCategories(data.categories);
// //           setProducts(data.products);
// //           return;
// //         }
// //       }
// //     } catch (e) {
// //       console.error("Could not read from cache.", e);
// //     }

// //     // 2. Fetch from API
// //     try {
// //       const res = await fetch(`${API_BASE}/CategoriesApi`);
// //       const cats = await res.json();

// //       const formattedCategories = cats
// //         .map((c) => ({ id: c.id, name: c.categoryName }))
// //         .filter((c) => c.name.toLowerCase() !== "all");

// //       let allProducts = [];
// //       for (let c of cats) {
// //         const pres = await fetch(
// //           `${API_BASE}/CategoriesApi/products/${c.id}?branchId=${branch}`
// //         );
// //         const prods = await pres.json();
// //         allProducts = [
// //           ...allProducts,
// //           ...prods.map((p) => ({
// //             id: p.id,
// //             name: p.name,
// //             price: p.unitPrice,
// //             category_id: p.categoryId,
// //             description: p.description,
// //             image: p.imageURL,
// //           })),
// //         ];
// //       }

// //       setProducts(allProducts);
// //       setCategories(formattedCategories);

// //       try {
// //         const cacheData = {
// //           timestamp: Date.now(),
// //           data: {
// //             categories: formattedCategories,
// //             products: allProducts,
// //           },
// //         };
// //         localStorage.setItem(
// //           `${CACHE_KEY}_${branch}`,
// //           JSON.stringify(cacheData)
// //         );
// //       } catch (e) {
// //         console.error("Could not write to cache.", e);
// //       }
// //     } catch (err) {
// //       console.error("Error loading data:", err);
// //     }
// //   };

// //   useEffect(() => {
// //     loadData();
// //   }, [branchId]);

// //   const cartTotal = useMemo(
// //     () => cart.reduce((acc, item) => acc + (item.price ?? 0) * item.qty, 0),
// //     [cart]
// //   );

// //   const addItemToCart = (item) => {
// //     const price = item.price ?? item.unitPrice ?? 0;
// //     if (price === 0) return;
// //     setCart((prev) => {
// //       const existing = prev.find((i) => i.id === item.id);
// //       if (existing) {
// //         return prev.map((i) =>
// //           i.id === item.id ? { ...i, qty: i.qty + 1 } : i
// //         );
// //       }
// //       return [...prev, { ...item, price, qty: 1 }];
// //     });
// //   };

// //   const incrementCartItem = (item) => {
// //     setCart((prev) =>
// //       prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
// //     );
// //   };

// //   const decrementCartItem = (item) => {
// //     setCart((prev) =>
// //       prev
// //         .map((i) => (i.id === item.id ? { ...i, qty: i.qty - 1 } : i))
// //         .filter((i) => i.qty > 0)
// //     );
// //   };

// //   const removeCartItem = (item) => {
// //     setCart((prev) => prev.filter((i) => i.id !== item.id));
// //   };

// //   const clearCart = () => setCart([]);

// //   const login = async (staff_no, pin) => {
// //     const res = await fetch(
// //       `${API_BASE}/CategoriesApi/staff-branches?employeeId=${staff_no}&pin=${pin}`
// //     );
// //     if (!res.ok) throw new Error("Invalid credentials");

// //     const data = await res.json();
// //     if (!data || data.length === 0) throw new Error("No branches assigned");

// //     // Set staff info (can just take first branch as placeholder)
// //     setStaff({ id: staff_no, staff_no, name: `Staff ${staff_no}` });
// //     return true; // credentials valid
// //   };

// //   const logout = () => {
// //     setStaff(null);
// //     setBranchId(null);
// //     setBranchName(null);
// //     clearCart();
// //   };

// //   const findStudentByCard = (cardId) =>
// //     Promise.resolve(students.find((s) => s.card_id === cardId) || null);

// //   const updateStudentBalance = (studentId, delta, outstandingDelta = 0) => {
// //     setStudents((prev) =>
// //       prev.map((s) =>
// //         s.id === studentId
// //           ? {
// //               ...s,
// //               balance: parseFloat((s.balance + delta).toFixed(2)),
// //               outstanding: parseFloat(
// //                 ((s.outstanding ?? 0) + outstandingDelta).toFixed(2)
// //               ),
// //             }
// //           : s
// //       )
// //     );
// //     return Promise.resolve(true);
// //   };

// //   const recordTxn = (data) => {
// //     const student = data.student_id
// //       ? students.find((s) => s.id === data.student_id)
// //       : null;
// //     setTransactions((prev) => [
// //       {
// //         id: prev.length + 1,
// //         ts: Date.now(),
// //         staff_id: staff?.id,
// //         staff_name: staff?.name || "N/A",
// //         student_name: student?.name || "N/A",
// //         ...data,
// //       },
// //       ...prev,
// //     ]);
// //     clearCart();
// //     return Promise.resolve(true);
// //   };

// //   const getHistory = () => Promise.resolve(transactions);

// //   const value = useMemo(
// //     () => ({
// //       staff,
// //       products,
// //       categories,
// //       cart,
// //       cartTotal,
// //       CURRENCY,
// //       login,
// //       logout,
// //       findStudentByCard,
// //       updateStudentBalance,
// //       recordTxn,
// //       getHistory,
// //       loadData,
// //       refreshData: loadData,
// //       addItemToCart,
// //       incrementCartItem,
// //       decrementCartItem,
// //       removeCartItem,
// //       branchId,
// //       branchName,
// //       setBranch,
// //     }),
// //     [
// //       staff,
// //       products,
// //       categories,
// //       transactions,
// //       cart,
// //       cartTotal,
// //       branchId,
// //       branchName,
// //     ]
// //   );

// //   return (
// //     <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
// //   );
// // }

// // export const useStore = () => useContext(StoreContext);

// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// const StoreContext = createContext(null);

// const API_BASE = import.meta.env.VITE_API_BASE || "/api";
// const CURRENCY = "QR";
// const CACHE_KEY = "pos_cache_data";
// const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

// export function StoreProvider({ children }) {
//   const [staff, setStaff] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [transactions, setTransactions] = useState([]);
//   const [cart, setCart] = useState([]);
//   const [branchId, setBranchId] = useState(null);
//   const [branchName, setBranchName] = useState(null);

//   const [students, setStudents] = useState([
//     { id: 1, card_id: "S100", name: "Alice", balance: 10.0, outstanding: 0 },
//     { id: 2, card_id: "S200", name: "Bob", balance: 5.0, outstanding: 0 },
//   ]);

//   const setBranch = (id, name = null) => {
//     setBranchId(id);
//     if (name) setBranchName(name);
//     return id;
//   };

//   const loadData = async (branch = branchId) => {
//     if (!branch) return;

//     // Try cache
//     try {
//       const cached = localStorage.getItem(`${CACHE_KEY}_${branch}`);
//       if (cached) {
//         const { timestamp, data } = JSON.parse(cached);
//         if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
//           setCategories(data.categories);
//           setProducts(data.products);
//           return;
//         }
//       }
//     } catch (e) {
//       console.error("Could not read from cache.", e);
//     }

//     // Fetch categories
//     try {
//       const res = await fetch(`${API_BASE}/CategoriesApi`);
//       const cats = await res.json();

//       const formattedCategories = cats
//         .map((c) => ({ id: c.id, name: c.categoryName }))
//         .filter((c) => c.name.toLowerCase() !== "all");

//       let allProducts = [];
//       for (let c of cats) {
//         const pres = await fetch(
//           `${API_BASE}/CategoriesApi/products/${c.id}?branchId=${branch}`
//         );
//         const prods = await pres.json();
//         allProducts = [
//           ...allProducts,
//           ...prods.map((p) => ({
//             id: p.id,
//             name: p.name,
//             price: p.unitPrice,
//             category_id: p.categoryId,
//             description: p.description,
//             image: p.imageURL,
//           })),
//         ];
//       }

//       setProducts(allProducts);
//       setCategories(formattedCategories);

//       try {
//         const cacheData = {
//           timestamp: Date.now(),
//           data: { categories: formattedCategories, products: allProducts },
//         };
//         localStorage.setItem(
//           `${CACHE_KEY}_${branch}`,
//           JSON.stringify(cacheData)
//         );
//       } catch (e) {
//         console.error("Could not write to cache.", e);
//       }
//     } catch (err) {
//       console.error("Error loading data:", err);
//     }
//   };

//   useEffect(() => {
//     if (branchId) loadData(branchId);
//   }, [branchId]);

//   const cartTotal = useMemo(
//     () => cart.reduce((acc, item) => acc + (item.price ?? 0) * item.qty, 0),
//     [cart]
//   );

//   const addItemToCart = (item) => {
//     const price = item.price ?? item.unitPrice ?? 0;
//     if (price === 0) return;
//     setCart((prev) => {
//       const existing = prev.find((i) => i.id === item.id);
//       if (existing)
//         return prev.map((i) =>
//           i.id === item.id ? { ...i, qty: i.qty + 1 } : i
//         );
//       return [...prev, { ...item, price, qty: 1 }];
//     });
//   };

//   const incrementCartItem = (item) =>
//     setCart((prev) =>
//       prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
//     );

//   const decrementCartItem = (item) =>
//     setCart((prev) =>
//       prev
//         .map((i) => (i.id === item.id ? { ...i, qty: i.qty - 1 } : i))
//         .filter((i) => i.qty > 0)
//     );

//   const removeCartItem = (item) =>
//     setCart((prev) => prev.filter((i) => i.id !== item.id));

//   const clearCart = () => setCart([]);

//   const login = async (staff_no, pin, branch = null) => {
//     const res = await fetch(
//       `${API_BASE}/CategoriesApi/staff-branches?employeeId=${staff_no}&pin=${pin}`
//     );
//     if (!res.ok) throw new Error("Invalid credentials");

//     const data = await res.json();
//     if (!data || data.length === 0) throw new Error("No branches assigned");

//     setStaff({ id: staff_no, staff_no, name: `Staff ${staff_no}` });

//     if (branch) setBranch(branch.branchId, branch.branchName);
//     else if (data.length === 1) setBranch(data[0].branchId, data[0].branchName);

//     return data; // return branches for selection
//   };

//   const logout = () => {
//     setStaff(null);
//     setBranchId(null);
//     setBranchName(null);
//     clearCart();
//   };

//   const findStudentByCard = (cardId) =>
//     Promise.resolve(students.find((s) => s.card_id === cardId) || null);

//   const updateStudentBalance = (studentId, delta, outstandingDelta = 0) => {
//     setStudents((prev) =>
//       prev.map((s) =>
//         s.id === studentId
//           ? {
//               ...s,
//               balance: parseFloat((s.balance + delta).toFixed(2)),
//               outstanding: parseFloat(
//                 ((s.outstanding ?? 0) + outstandingDelta).toFixed(2)
//               ),
//             }
//           : s
//       )
//     );
//     return Promise.resolve(true);
//   };

//   const recordTxn = (data) => {
//     const student = data.student_id
//       ? students.find((s) => s.id === data.student_id)
//       : null;
//     setTransactions((prev) => [
//       {
//         id: prev.length + 1,
//         ts: Date.now(),
//         staff_id: staff?.id,
//         staff_name: staff?.name || "N/A",
//         student_name: student?.name || "N/A",
//         ...data,
//       },
//       ...prev,
//     ]);
//     clearCart();
//     return Promise.resolve(true);
//   };

//   const getHistory = () => Promise.resolve(transactions);

//   const value = useMemo(
//     () => ({
//       staff,
//       products,
//       categories,
//       cart,
//       cartTotal,
//       CURRENCY,
//       login,
//       logout,
//       findStudentByCard,
//       updateStudentBalance,
//       recordTxn,
//       getHistory,
//       loadData,
//       refreshData: loadData,
//       addItemToCart,
//       incrementCartItem,
//       decrementCartItem,
//       removeCartItem,
//       branchId,
//       branchName,
//       setBranch,
//     }),
//     [
//       staff,
//       products,
//       categories,
//       transactions,
//       cart,
//       cartTotal,
//       branchId,
//       branchName,
//     ]
//   );

//   return (
//     <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
//   );
// }

// export const useStore = () => useContext(StoreContext);
import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
} from "react";

const StoreContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_BASE || "/api";
const CURRENCY = "QR";
const CACHE_KEY = "pos_cache_data";
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

export function StoreProvider({ children }) {
  const [staff, setStaff] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [cart, setCart] = useState([]);
  const [branchId, setBranchId] = useState(null);
  const [branchName, setBranchName] = useState(null);

  const [students, setStudents] = useState([
    { id: 1, card_id: "S100", name: "Alice", balance: 10.0, outstanding: 0 },
    { id: 2, card_id: "S200", name: "Bob", balance: 5.0, outstanding: 0 },
  ]);

  const setBranch = useCallback((id, name = null) => {
    setBranchId(id);
    if (name) setBranchName(name);
    return id;
  }, []);

  const loadData = useCallback(async (branch) => {
    if (!branch) return;

    // Try cache
    try {
      const cached = localStorage.getItem(`${CACHE_KEY}_${branch}`);
      if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
          setCategories(data.categories);
          setProducts(data.products);
          return;
        }
      }
    } catch (e) {
      console.error("Could not read from cache.", e);
    }

    // Fetch categories
    try {
      const res = await fetch(`${API_BASE}/CategoriesApi`);
      const cats = await res.json();

      const formattedCategories = cats
        .map((c) => ({ id: c.id, name: c.categoryName }))
        .filter((c) => c.name.toLowerCase() !== "all");

      let allProducts = [];
      for (let c of cats) {
        const pres = await fetch(
          `${API_BASE}/CategoriesApi/products/${c.id}?branchId=${branch}`
        );
        const prods = await pres.json();
        allProducts = [
          ...allProducts,
          ...prods.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.unitPrice,
            category_id: p.categoryId,
            description: p.description,
            image: p.imageURL,
          })),
        ];
      }

      setProducts(allProducts);
      setCategories(formattedCategories);

      try {
        const cacheData = {
          timestamp: Date.now(),
          data: { categories: formattedCategories, products: allProducts },
        };
        localStorage.setItem(
          `${CACHE_KEY}_${branch}`,
          JSON.stringify(cacheData)
        );
      } catch (e) {
        console.error("Could not write to cache.", e);
      }
    } catch (err) {
      console.error("Error loading data:", err);
    }
  }, []);

  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + (item.price ?? 0) * item.qty, 0),
    [cart]
  );

  const addItemToCart = useCallback((item) => {
    const price = item.price ?? item.unitPrice ?? 0;
    if (price === 0) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing)
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      return [...prev, { ...item, price, qty: 1 }];
    });
  }, []);

  const incrementCartItem = useCallback(
    (item) =>
      setCart((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
      ),
    []
  );

  const decrementCartItem = useCallback(
    (item) =>
      setCart((prev) =>
        prev
          .map((i) => (i.id === item.id ? { ...i, qty: i.qty - 1 } : i))
          .filter((i) => i.qty > 0)
      ),
    []
  );

  const removeCartItem = useCallback(
    (item) => setCart((prev) => prev.filter((i) => i.id !== item.id)),
    []
  );

  const clearCart = useCallback(() => setCart([]), []);

  const login = useCallback(
    async (staff_no, pin, branch = null) => {
      const res = await fetch(
        `${API_BASE}/CategoriesApi/staff-branches?employeeId=${staff_no}&pin=${pin}`
      );
      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();
      if (!data || data.length === 0) throw new Error("No branches assigned");

      setStaff({ id: staff_no, staff_no, name: `Staff ${staff_no}` });

      if (branch) setBranch(branch.branchId, branch.branchName);
      else if (data.length === 1)
        setBranch(data[0].branchId, data[0].branchName);

      return data; // return branches for selection
    },
    [setBranch]
  );

  const logout = useCallback(() => {
    setStaff(null);
    setBranchId(null);
    setBranchName(null);
    clearCart();
  }, [clearCart]);

  const findStudentByCard = useCallback(
    (cardId) =>
      Promise.resolve(students.find((s) => s.card_id === cardId) || null),
    [students]
  );

  const updateStudentBalance = useCallback(
    (studentId, delta, outstandingDelta = 0) => {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId
            ? {
                ...s,
                balance: parseFloat((s.balance + delta).toFixed(2)),
                outstanding: parseFloat(
                  ((s.outstanding ?? 0) + outstandingDelta).toFixed(2)
                ),
              }
            : s
        )
      );
      return Promise.resolve(true);
    },
    []
  );

  const recordTxn = useCallback(
    (data) => {
      const student = data.student_id
        ? students.find((s) => s.id === data.student_id)
        : null;
      setTransactions((prev) => [
        {
          id: prev.length + 1,
          ts: Date.now(),
          staff_id: staff?.id,
          staff_name: staff?.name || "N/A",
          student_name: student?.name || "N/A",
          ...data,
        },
        ...prev,
      ]);
      clearCart();
      return Promise.resolve(true);
    },
    [students, staff, clearCart]
  );

  const getHistory = useCallback(() => Promise.resolve(transactions), [
    transactions,
  ]);

  const value = useMemo(
    () => ({
      staff,
      products,
      categories,
      cart,
      cartTotal,
      CURRENCY,
      branchId,
      branchName,
      login,
      logout,
      findStudentByCard,
      updateStudentBalance,
      recordTxn,
      getHistory,
      loadData,
      refreshData: loadData,
      addItemToCart,
      incrementCartItem,
      decrementCartItem,
      removeCartItem,
      setBranch,
    }),
    [
      staff,
      products,
      categories,
      transactions,
      cart,
      cartTotal,
      branchId,
      branchName,
      login,
      logout,
      findStudentByCard,
      updateStudentBalance,
      recordTxn,
      getHistory,
      loadData,
      addItemToCart,
      incrementCartItem,
      decrementCartItem,
      removeCartItem,
      setBranch,
    ]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);