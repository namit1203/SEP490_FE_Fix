import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

// import * as XLSX from 'sheetjs-style'
const fileExtension = ".xlsx";

export const exportDataToExcel = (csvData, fileName) => {
  const ws = XLSX.utils.json_to_sheet(csvData);
  const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });
  FileSaver.saveAs(data, fileName + fileExtension);
};

/**
 * Checks and validates the JWT token stored in localStorage
 * @returns {string|null} Valid token or null if invalid/expired
 */
export const checkLoginToken = () => {
  // Constants for storage keys to avoid typos and enable easy updates
  const STORAGE_KEYS = {
    TOKEN: 'token',
    PROFILE: 'profile'
  };

  // Helper function to clear auth data
  const clearAuthData = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
  };

  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    if (!token) {
      return null;
    }

    // Validate token format
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Invalid token format');
    }

    // Decode and parse token payload
    const payload = tokenParts[1];
    const tokenData = JSON.parse(atob(payload));

    // Add buffer time (e.g., 60 seconds) to handle slight time differences
    const EXPIRATION_BUFFER = 60 * 1000; // 60 seconds in milliseconds
    const currentTime = Date.now();
    const expirationTime = tokenData.exp * 1000;

    if (!tokenData.exp) {
      throw new Error('Token missing expiration');
    }

    if (expirationTime - EXPIRATION_BUFFER < currentTime) {
      throw new Error('Token expired');
    }

    return token;

  } catch (error) {
    // Log error for debugging but don't expose details to client
    console.error('Token validation failed:', error.message);
    clearAuthData();
    return null;
  }
};

export const getProfileFromLS = () => {
  const result = localStorage.getItem("profile");
  return result ? JSON.parse(result) : null;
};

export const getTripDetailId = (array, startPoint, endPoint) => {
  for (let i = 0; i < array.length; i++) {
    const trip = array[i];
    if (
      trip.pointStartDetails === startPoint &&
      trip.pointEndDetails === endPoint
    ) {
      return trip.id;
    }
  }
  return null; // Or you can throw an error if no match is found
};
