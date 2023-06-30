import { ca } from "date-fns/locale";

// Helper function to convert currency code to symbol
export const getCurrencySymbol = (currencyCode) => {
  // Add cases for other currency codes as needed
  switch (currencyCode) {
    case "GBP":
      return "£";
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "CAD":
      return "CA$";
    case "AUD":
      return "AU$";
    case "NZD":
      return "NZ$";
    case "SGD":
      return "S$";
    case "HKD":
      return "HK$";
    case "JPY":
      return "¥";
    case "CNY":
      return "CN¥";
    case "INR":
      return "₹";
    case "RUB":
      return "₽";
    case "ZAR":
      return "R";
    case "TRY":
      return "₺";
    case "BRL":
      return "R$";
    case "MXN":
      return "MX$";
    case "IDR":
      return "Rp";
    case "MYR":
      return "RM";
    case "THB":
      return "฿";

    default:
      return currencyCode;
  }
};

// Helper function to format price with commas
export const formatPriceWithCommas = (price) => {
  return price.toLocaleString(); // Adds commas to the price
};
