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
import ReportView from "./pages/ReportView";
import ServiceOrders from "./pages/admin/ServiceOrders";
import BatchShipmentUpload from "./pages/admin/BatchShipmentUpload";
import SystemMonitor from "./pages/admin/SystemMonitor";
import DailyReport from "./pages/admin/DailyReport";
import AdminCustomers from "./pages/admin/Customers";
import AdminCoupons from "./pages/admin/Coupons";
import AdminReviews from "./pages/admin/Reviews";
import AdminDestinyReports from "./pages/admin/DestinyReports";
import PendingPayments from "./pages/admin/PendingPayments";
import BatchImport from "./pages/admin/BatchImport";
import AdminSettings from "./pages/admin/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/products"} component={Products} />
      <Route path={"/products/:slug"} component={ProductDetail} />
      <Route path={"/cart"} component={Cart} />
      <Route path={"/login"} component={Login} />
      <Route path={"/register"} component={Register} />
      <Route path={"/wobifa888"} component={AdminDashboard} />
      <Route path={"/wobifa888/products"} component={AdminProducts} />
      <Route path={"/wobifa888/products/new"} component={ProductForm} />
      <Route path={"/wobifa888/products/:id/edit"} component={ProductForm} />
      <Route path={"/checkout"} component={Checkout} />
      <Route path={"/wobifa888/orders"} component={AdminOrders} />
      <Route path={"/wobifa888/orders/:id"} component={AdminOrderDetail} />
      <Route path={"/account"} component={Account} />
      <Route path={"/orders/:id"} component={OrderDetail} />
      <Route path={"/report/:bookingId"} component={ReportView} />
      <Route path={"/wobifa888/service-orders"} component={ServiceOrders} />
      <Route path={"/wobifa888/batch-shipment"} component={BatchShipmentUpload} />
      <Route path={"/wobifa888/system-monitor"} component={SystemMonitor} />
      <Route path={"/wobifa888/daily-report"} component={DailyReport} />
      <Route path={"/wobifa888/customers"} component={AdminCustomers} />
      <Route path={"/wobifa888/coupons"} component={AdminCoupons} />
      <Route path={"/wobifa888/reviews"} component={AdminReviews} />
      <Route path={"/wobifa888/destiny-reports"} component={AdminDestinyReports} />
      <Route path={"/wobifa888/pending-payments"} component={PendingPayments} />
      <Route path={"/wobifa888/batch-import"} component={BatchImport} />
      <Route path={"/wobifa888/settings"} component={AdminSettings} />
      <Route path={"/404"} component={NotFound} />
      {/* Removed routes: /fortune, /destiny, /prayer - services migrated to VIP platform */}
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
