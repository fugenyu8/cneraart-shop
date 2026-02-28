import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, ShoppingBag } from "lucide-react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
      <Card className="w-full max-w-lg mx-4 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-100 rounded-full animate-pulse" />
              <AlertCircle className="relative h-16 w-16 text-amber-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-slate-700 mb-4">
            {t("notFound.title", "Page Not Found")}
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            {t("notFound.description", "Sorry, the page you are looking for doesn't exist. It may have been moved or deleted.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => setLocation("/")}
              className="bg-amber-700 hover:bg-amber-800 text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Home className="w-4 h-4 mr-2" />
              {t("notFound.goHome", "Go Home")}
            </Button>
            <Button
              onClick={() => setLocation("/products")}
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-50 px-6 py-2.5 rounded-lg"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {t("notFound.browseProducts", "Browse Products")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
