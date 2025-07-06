declare global {
  interface Window {
    Kakao: {
      init: (key?: string) => void;
      isInitialized: () => boolean;
      cleanup: () => void;
      Auth: {
        authorize: (options: { redirectUri: string }) => void;
      };
      Share: {
        cleanup: () => void;
        createCustomButton: (settings: {
          container: string | HTMLElement;
          templateId: number;
          templateArgs?: Record<string, string>;
          installTalk?: boolean;
          serverCallbackArgs?: Record<string, string> | string;
        }) => void;
        createDefaultButton: (settings: object) => void;
        createScrapButton: (settings: {
          container: string | HTMLElement;
          requestUrl: string;
          templateId?: number;
          templateArgs?: Record<string, string>;
          installTalk?: boolean;
          serverCallbackArgs?: Record<string, string> | string;
        }) => void;
        deleteImage: (settings: { imageUrl: string }) => Promise<void>;
        scrapImage: (settings: { imageUrl: string }) => Promise<void>;
        sendCustom: (settings: {
          templateId: number;
          templateArgs?: Record<string, string>;
          installTalk?: boolean;
          serverCallbackArgs?: Record<string, string> | string;
        }) => void;
        sendDefault: (settings?: object) => void;
        sendScrap: (settings: {
          requestUrl: string;
          templateId?: number;
          templateArgs?: Record<string, string>;
          installTalk?: boolean;
          serverCallbackArgs?: Record<string, string> | string;
        }) => void;
      };
    };
  }
}

export {};
