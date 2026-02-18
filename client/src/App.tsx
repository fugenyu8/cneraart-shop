import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import ProductForm from "./pages/admin/ProductForm";
import Checkout from "./pages/Checkout";
import AdminOrders from "./pages/admin/Orders";
import AdminOrderDetail from "./pages/admin/OrderDetail";
import Account from "./pages/Account";
import OrderDetail from "./pages/OrderDetail";
import FortuneServices from "./pages/FortuneServices";
import Destiny from "./pages/Destiny";
import Prayer from "./pages/Prayer";
import ServiceOrders from "./pages/admin/ServiceOrders";
import BatchShipmentUpload from "./pages/admin/BatchShipmentUpload";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/products"} component={Products} />
      <Route path={"/products/:slug"} component={ProductDetail} />
      <Route path={"/cart"} component={Cart} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/products"} component={AdminProducts} />
      <Route path={"/admin/products/new"} component={ProductForm} />
      <Route path={"/admin/products/:id/edit"} component={ProductForm} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/admin/orders"} component={AdminOrders} />
      <Route path={"/admin/orders/:id"} component={AdminOrderDetail} />
      <Route path={"/account"} component={Account} />
      <Route path={"/orders/:id"} component={OrderDetail} />
      <Route path={"/fortune"} component={FortuneServices} />
      <Route path={"/destiny"} component={Destiny} />
      <Route path={"/prayer"} component={Prayer} />
      <Route path={"/admin/service-orders"} component={ServiceOrders} />
      <Route path={"/admin/batch-shipment"} component={BatchShipmentUpload} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
