// Extend the Window interface for Electron APIs
interface ElectronAPI {
  saveFile: (data: any) => void;
  loadFile: () => Promise<any>;
  openFile: () => Promise<any>;
}

interface OpenaiAPI {
  chat: (messages: any) => Promise<any>;
}

declare global {
  interface Window {
	electronAPI?: ElectronAPI;
	openaiAPI?: OpenaiAPI;
  }
}

export {};
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
