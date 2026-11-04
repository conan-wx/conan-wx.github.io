// page-flip 2.0.7 ships TypeScript sources but no declarations for its ESM bundle.

  export class PageFlip {
    constructor(host: HTMLElement, settings: {
      width: number; height: number; size: "stretch" | "fixed";
      minWidth: number; maxWidth: number; minHeight: number; maxHeight: number;
      showCover: boolean; usePortrait: boolean; autoSize: boolean;
      drawShadow: boolean; maxShadowOpacity: number; flippingTime: number;
      mobileScrollSupport: boolean; useMouseEvents: boolean; showPageCorners: boolean;
      disableFlipByClick: boolean; clickEventForward: boolean; startPage: number;
    });
    on(event: string, callback: (event: { data: unknown; object: PageFlip }) => void): PageFlip;
    loadFromHTML(pages: NodeListOf<HTMLElement> | HTMLElement[]): void;
    getOrientation(): "landscape" | "portrait";
    getCurrentPageIndex(): number;
    turnToPage(index: number): void;
    turnToNextPage(): void;
    turnToPrevPage(): void;
    flip(index: number, corner?: "top" | "bottom"): void;
    flipNext(corner?: "top" | "bottom"): void;
    flipPrev(corner?: "top" | "bottom"): void;
    update(): void;
    destroy(): void;
  }
