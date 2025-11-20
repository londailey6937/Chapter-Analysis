import "./suppressBanners";
import { registerLicense } from "@syncfusion/ej2-base";

const syncfusionLicenseKey =
  import.meta.env.VITE_SYNCFUSION_LICENSE_KEY?.trim();

if (!syncfusionLicenseKey) {
  console.warn(
    "Syncfusion license key missing. Set VITE_SYNCFUSION_LICENSE_KEY in your environment to remove the popup."
  );
} else {
  try {
    registerLicense(syncfusionLicenseKey);
    if (import.meta.env.DEV) {
      console.info("Syncfusion license key registered.");
    }
  } catch (error) {
    console.error("Syncfusion license registration failed.", error);
  }
}
