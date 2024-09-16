import React, { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WebUploader } from "@irys/web-upload";
import { WebAptos } from "@irys/web-upload-aptos";
 
// Radix UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import AdUploader from "./components/AdUpload";
 
function App() {
  const { connected } = useWallet();
  const wallet = useWallet();
  const [irysStatus, setIrysStatus] = useState("Not connected");
 
  const connectIrys = async () => {
    console.log("connect irys called");
    console.log({wallet})
    try {
      const irysUploader = await WebUploader(WebAptos).withProvider(wallet);
      console.log({irysUploader})
 
      setIrysStatus(`Connected to Irys: ${irysUploader.address}`);
    } catch (error) {
      console.error("Error connecting to Irys:", error);
    }
  };
 
  return (
    <>
      <Header />
      <div className="flex items-center justify-center flex-col">
        <Card className="mt-6">
          <CardHeader>
            {connected ? (
              <CardTitle>
                <button onClick={connectIrys}>
                  {irysStatus === "Not connected" ? "Connect Irys" : irysStatus}
                </button>
                <AdUploader />
              </CardTitle>
            ) : (
              <CardTitle>To get started, connect a wallet</CardTitle>
            )}
          </CardHeader>
        </Card>
      </div>
    </>
  );
}
 
export default App;
 