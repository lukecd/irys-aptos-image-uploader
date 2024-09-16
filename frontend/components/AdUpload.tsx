import React, { useState, ChangeEvent, FormEvent } from "react";
import { WebUploader } from "@irys/web-upload";
import { WebAptos } from "@irys/web-upload-aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const AdUploader: React.FC = () => {
  const wallet = useWallet();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState({
    title: "",
    campaignName: "",
    advertiserId: "",
    targetAudience: "",
    adType: "",
    publishDate: "",
    location: "",
    deviceTarget: "",
  });
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleMetadataChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMetadata((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getIrysUploader = async () => {
    const irysUploader = await WebUploader(WebAptos)
      .withProvider(wallet)
      .devnet()
      .withRpc("testnet");
    
    return irysUploader;
  };

  const uploadAd = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;
  
    setUploading(true);
  
    // Calculate the size of the selected image
    const imageSize = selectedImage.size; // in bytes
    const metadataSize = new Blob([JSON.stringify(metadata)]).size; // size of metadata in bytes
    const totalSize = imageSize + metadataSize;
  
    // Calculate total size in Kibibytes (1 KiB = 1024 bytes)
    const totalSizeKiB = totalSize / 1024;
    
    const contentType = selectedImage.type;
    const tags = [
      { name: "Content-Type", value: contentType },
      ...Object.entries(metadata).map(([key, value]) => ({ name: key, value })),
    ];
  
    console.log({ tags });
  
    try {
      const irysUploader = await getIrysUploader();
      console.log(`Connected to Irys from ${irysUploader.address}`);
      console.log("Uploading ad");
  
      if (totalSizeKiB < 100) {
        console.log("Upload under 100 KiB, no payment needed.");
      } else {
        console.log(`Upload size is ${totalSizeKiB.toFixed(2)} KiB, payment required.`);
  
        // Calculate the price based on the size
        const price = await irysUploader.getPrice(totalSize);
        console.log(`Funding with price: ${price}`);
  
        // Fund the transaction
        await irysUploader.fund(price);
        console.log("Funded successfully.");
      }
  
      const response = await irysUploader.uploadFile(selectedImage, { tags });
      setUploadUrl(`https://gateway.irys.xyz/${response.id}`);
    } catch (error) {
      console.error("Error uploading file", error);
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <form onSubmit={uploadAd} className="flex flex-col items-center w-full max-w-md p-4 mx-auto space-y-4 bg-white rounded shadow">
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleImageChange} 
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {previewUrl && <img src={previewUrl} alt="Ad Preview" className="w-full max-w-xs mt-4 rounded" />}
      
      {Object.keys(metadata).map((key) => (
        <input
          key={key}
          name={key}
          value={metadata[key as keyof typeof metadata]}
          onChange={handleMetadataChange}
          placeholder={key.replace(/([A-Z])/g, ' $1')}
          className="w-full p-2 mt-2 border border-gray-300 rounded"
        />
      ))}

      <button 
        type="submit" 
        className={`mt-4 px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 ${uploading ? "cursor-not-allowed opacity-50" : ""}`} 
        disabled={uploading}
      >
        {uploading ? (
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-3 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 11-8 8V12H4z"></path>
            </svg>
            Uploading...
          </div>
        ) : (
          "Upload Ad"
        )}
      </button>
      
      {uploadUrl && (
        <p className="mt-4 text-center text-green-500">
          File uploaded successfully! View at: <a href={uploadUrl} target="_blank" rel="noopener noreferrer" className="underline">{uploadUrl}</a>
        </p>
      )}
    </form>
  );
};

export default AdUploader;
