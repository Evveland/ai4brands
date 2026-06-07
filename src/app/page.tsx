import { AppProvider } from "@/lib/store";
import { UserProvider } from "@/components/UserProvider";
import { App } from "@/components/App";

export default function Page() {
  return (
    <AppProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </AppProvider>
  );
}
