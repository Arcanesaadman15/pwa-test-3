import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePWA } from "@/hooks/usePWA";
import { InstallPrompt } from "@/components/Modals/InstallPrompt";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { isInstallable, promptInstall, dismissInstall, isIOS } = usePWA();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Router />
          {isInstallable && (
            <InstallPrompt 
              onInstall={promptInstall} 
              onDismiss={dismissInstall} 
              isIOS={isIOS}
            />
          )}
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
