import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
} from "react";

const StoreContext = createContext(null);

const API_BASE = "https://edison-qr.eagletechsolutions.co.uk/api";
const CURRENCY = "QR ";
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

  const setBranch = useCallback((id, name = null) => {
    setBranchId(id);
    if (name) setBranchName(name);
    return id;
  }, []);

  // const loadData = useCallback(async (branch) => {
  //   if (!branch) return;

  //   try {
  //     const cached = localStorage.getItem(`${CACHE_KEY}_${branch}`);
  //     if (cached) {
  //       const { timestamp, data } = JSON.parse(cached);
  //       if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
  //         setCategories(data.categories);
  //         setProducts(data.products);
  //         return;
  //       }
  //     }
  //   } catch (e) {
  //     console.error("Could not read from cache.", e);
  //   }

  //   try {
  //     const res = await fetch(
  //       `${API_BASE}/CategoriesApi/branch-categories-products/${branch}`
  //     );
  //     if (!res.ok) throw new Error("Failed to fetch products for this branch.");

  //     const catsWithProds = await res.json();

  //     if (!Array.isArray(catsWithProds)) {
  //       throw new Error("API response was not in the expected format.");
  //     }

  //     const formattedCategories = catsWithProds.map((c) => ({
  //       id: c.categoryId,
  //       name: c.categoryName,
  //     }));

  //     const allProducts = catsWithProds.flatMap(
  //       (c) =>
  //         c.products?.map((p) => ({
  //           id: p.id,
  //           name: p.name,
  //           price: p.unitPrice,
  //           category_id: p.categoryId,
  //           description: p.description ?? "",
  //           image: p.imageURL ?? "",
  //           barcodes: p.barcodes || [],
  //         })) || []
  //     );

  //     setProducts(allProducts);
  //     setCategories(formattedCategories);

  //     try {
  //       const cacheData = {
  //         timestamp: Date.now(),
  //         data: { categories: formattedCategories, products: allProducts },
  //       };
  //       localStorage.setItem(
  //         `${CACHE_KEY}_${branch}`,
  //         JSON.stringify(cacheData)
  //       );
  //     } catch (e) {
  //       console.error("Could not write to cache.", e);
  //     }
  //   } catch (err) {
  //     console.error("Error loading data:", err);
  //     setProducts([]);
  //     setCategories([]);
  //   }
  // }, []);
  const loadData = useCallback(async (branch) => {
    if (!branch) return;

    try {
      const res = await fetch(
        `${API_BASE}/CategoriesApi/branch-categories-products/${branch}`
      );
      if (!res.ok) throw new Error("Failed to fetch products for this branch.");

      const catsWithProds = await res.json();
      if (!Array.isArray(catsWithProds)) {
        throw new Error("API response was not in the expected format.");
      }

      // ✅ Keep all categories (including All)
      const formattedCategories = catsWithProds.map((c) => ({
        id: c.categoryId,
        name: c.categoryName,
        products:
          c.products?.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.unitPrice,
            category_id: p.categoryId,
            description: p.description ?? "",
            image: p.imageURL ?? "",
            barcodes: p.barcodes || [],
          })) || [],
      }));

      setCategories(formattedCategories);

      // Flatten once for global search/barcode scan
      const allProducts = formattedCategories.flatMap((c) => c.products);
      setProducts(allProducts);
    } catch (err) {
      console.error("Error loading data:", err);
      setProducts([]);
      setCategories([]);
    }
  }, []);

  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + (item.price ?? 0) * item.qty, 0),
    [cart]
  );

  const addItemToCart = useCallback((item) => {
    const price = item.price ?? item.unitPrice ?? 0;
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
      setCart((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing && existing.qty <= 1)
          return prev.filter((i) => i.id !== item.id);
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty - 1 } : i
        );
      }),
    []
  );

  const removeCartItem = useCallback(
    (item) => setCart((prev) => prev.filter((i) => i.id !== item.id)),
    []
  );

  const clearCart = useCallback(() => setCart([]), []);

  const login = useCallback((employeeId, pin) => {
    // The real auth is the API call in LoginScreen.
    // This just sets the staff member in the state.
    setStaff({ id: employeeId, name: `Staff #${employeeId}` });
    return Promise.resolve(true);
  }, []);

  const logout = useCallback(() => {
    setStaff(null);
    setBranchId(null);
    setBranchName(null);
    setCart([]);
    setProducts([]);
    setCategories([]);
  }, []);

  const findStudentByCard = useCallback(async (cardId) => {
    try {
      const res = await fetch(`${API_BASE}/StudentsApi/card/${cardId}`);
      if (!res.ok) return null;
      const student = await res.json();
      return student;
    } catch (err) {
      console.error("Failed to find student:", err);
      return null;
    }
  }, []);

  const recordTxn = useCallback(
    (data) => {
      const newTxn = {
        id: transactions.length + 1,
        ts: Date.now(),
        staff_id: staff?.id,
        staff_name: staff?.name || "N/A",
        student_name: data.student_name || "N/A",
        ...data,
      };
      setTransactions((prev) => [newTxn, ...prev]);
      clearCart();
      return Promise.resolve(newTxn);
    },
    [staff, clearCart, transactions]
  );

  const getHistory = useCallback(
    () => Promise.resolve(transactions),
    [transactions]
  );

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
      cart,
      cartTotal,
      branchId,
      branchName,
      login,
      logout,
      findStudentByCard,
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

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
