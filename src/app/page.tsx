import { AppProvider } from "@/lib/store";
import { App } from "@/components/App";

export default function Page() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}
