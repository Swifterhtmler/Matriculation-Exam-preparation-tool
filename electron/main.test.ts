// import { expect, test, vi } from 'vitest';
// import fs from 'fs';
// import path from 'node:path';
// import { app, ipcMain } from 'electron';

// // Mocks
// vi.mock('electron', () => ({
//   app: {
//     getPath: vi.fn(() => '/mock/userData'),
//     quit: vi.fn(),
//     on: vi.fn(),
//   },
//   BrowserWindow: vi.fn(),
//   ipcMain: {
//     handle: vi.fn(),
//   },
// }));

// vi.mock('fs', () => ({
//   writeFileSync: vi.fn(),
//   readFileSync: vi.fn(() => '{"todoItems":{},"cards":{}}'),
//   existsSync: vi.fn(() => true),
// }));

// // Test save-file handler

// test('save-file handler writes data to disk', () => {
//   const mockData = { todoItems: { Kemia: [] }, cards: {} };
//   const mockEvent = {};
//   const dataPath = path.join('/mock/userData', 'saved.json');

//   // Simulate handler
//   fs.writeFileSync.mockClear();
//   ipcMain.handle('save-file', (mockEvent, mockData));

//   expect(fs.writeFileSync).toHaveBeenCalledWith(
//     dataPath,
//     JSON.stringify(mockData, null, 2)
//   );
// });

// test('load-file handler reads and parses data from disk', () => {
//   const mockEvent = {};
//   const dataPath = path.join('/mock/userData', 'saved.json');

//   fs.existsSync.mockReturnValue(true);
//   fs.readFileSync.mockReturnValue('{"todoItems":{"Kemia":[]},"cards":{}}');

//   const result = ipcMain.handle('load-file', mockEvent);
//   expect(fs.readFileSync).toHaveBeenCalledWith(dataPath, 'utf8');
//   expect(result).toEqual({ todoItems: { Kemia: [] }, cards: {} });
// });

// // You can add more tests for app event handlers and window creation logic as needed.
