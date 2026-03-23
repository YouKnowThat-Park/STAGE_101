import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://stage101.shop/",
      priority: 1.0,
    },
    {
      url: "https://stage101.shop/theater",
      priority: 0.9,
    },
    {
      url: "https://stage101.shop/shop",
      priority: 0.9,
    },
  ];
}
