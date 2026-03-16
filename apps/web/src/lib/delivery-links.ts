type DeliveryPlatform = {
  name: string;
  icon: string;
  getUrl: (restaurantName: string) => string;
};

export const DELIVERY_PLATFORMS: DeliveryPlatform[] = [
  {
    name: "UberEats",
    icon: "🟢",
    getUrl: (name) =>
      `https://www.ubereats.com/search?q=${encodeURIComponent(name)}`,
  },
  {
    name: "DoorDash",
    icon: "🔴",
    getUrl: (name) =>
      `https://www.doordash.com/search/store/${encodeURIComponent(name)}`,
  },
  {
    name: "Fantuan",
    icon: "🟡",
    getUrl: (name) =>
      `https://www.fantuanorder.com/en-US/search?keyword=${encodeURIComponent(name)}`,
  },
];
