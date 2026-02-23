import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/config";
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
import ReportView from "./pages/ReportView";
import ServiceOrders from "./pages/admin/ServiceOrders";
import BatchShipmentUpload from "./pages/admin/BatchShipmentUpload";
import SystemMonitor from "./pages/admin/SystemMonitor";
import DailyReport from "./pages/admin/DailyReport";
import AdminCustomers from "./pages/admin/Customers";
import AdminCoupons from "./pages/admin/Coupons";
import AdminReviews from "./pages/admin/Reviews";
import AdminDestinyReports from "./pages/admin/DestinyReports";

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
      <Route path={"/report/:bookingId"} component={ReportView} />
      <Route path={"/admin/service-orders"} component={ServiceOrders} />
      <Route path={"/admin/batch-shipment"} component={BatchShipmentUpload} />
      <Route path={"/admin/system-monitor"} component={SystemMonitor} />
      <Route path={"/admin/daily-report"} component={DailyReport} />
      <Route path={"/admin/customers"} component={AdminCustomers} />
      <Route path={"/admin/coupons"} component={AdminCoupons} />
      <Route path={"/admin/reviews"} component={AdminReviews} />
      <Route path={"/admin/destiny-reports"} component={AdminDestinyReports} />
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
      <I18nextProvider i18n={i18n}>
        <ThemeProvider
          defaultTheme="light"
          // switchable
        >
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </I18nextProvider>
    </ErrorBoundary>
  );
}

export default App;
