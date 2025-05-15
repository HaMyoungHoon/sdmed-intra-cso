export const MAP_GOOGLE_ID = "e3ab2c4c1d5bfc9a12de95c8";
export const MAP_GOOGLE_GRAY_ID = "e3ab2c4c1d5bfc9a80e68750";
export const MAP_GOOGLE_NIGHT_ID = "e3ab2c4c1d5bfc9a4f522bbf";

declare global {
  interface Window {
    openWebsite: (data: string) => void;
  }
}

export function hospitalContent(orgName: string, address: string, phoneNumber: string, websiteUrl: string): string {
  let websiteClass = "click-item";
  if (websiteUrl.length <= 0) {
    websiteClass = "collapse";
  }
  window.openWebsite = openWebsite;
  return `
<div id="content" class="card flex-row">
    <div>${orgName}</div>
    <div>${address}</div>
    <div>${phoneNumber}</div>
    <div class="${websiteClass}" onclick="openWebsite(${websiteUrl})">${websiteUrl}</div>
</div>`;
}
export function pharmacyContent(orgName: string, address: string, phoneNumber: string): string {
  return `
<div id="content" class="card flex-row">
    <div>${orgName}</div>
    <div>${address}</div>
    <div>${phoneNumber}</div>
</div>`;
}

export function openWebsite(url: string): void {
  if (url && url.trim().length > 0) {
    window.open(url, "_blank");
  }
}

export function googleThemeList(): any {
  return [
    {
      label: "standard",
      id: MAP_GOOGLE_ID,
    },
    {
      label: "gray",
      id: MAP_GOOGLE_GRAY_ID,
    },
    {
      label: "night",
      id: MAP_GOOGLE_NIGHT_ID,
    }
  ];
}
