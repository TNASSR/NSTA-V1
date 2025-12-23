import React, { useEffect, useState, useRef } from 'react';
import { User, ViewState, SystemSettings, Subject, Chapter, MCQItem, RecoveryRequest, ActivityLogEntry, LeaderboardEntry, RecycleBinItem, Stream, Board, ClassLevel, GiftCode, SubscriptionPlan, CreditPackage } from '../types';
import { Users, Search, Trash2, Save, X, Eye, Shield, Megaphone, CheckCircle, ListChecks, Database, FileText, Monitor, Sparkles, Banknote, BrainCircuit, AlertOctagon, ArrowLeft, Key, Bell, ShieldCheck, Lock, Globe, Layers, Zap, PenTool, RefreshCw, RotateCcw, Plus, LogOut, Download, Upload, CreditCard, Ticket, Video, Image as ImageIcon, Type, Link, FileJson, Activity, AlertTriangle, Gift, Book, Mail, Edit3, MessageSquare, ShoppingBag, Cloud, Rocket, Code2, Layers as LayersIcon, Wifi, WifiOff, Copy, Crown } from 'lucide-react';
import { getSubjectsList, DEFAULT_SUBJECTS } from '../constants';
import { fetchChapters } from '../services/gemini';
import { saveChapterData, bulkSaveLinks, checkFirebaseConnection, saveSystemSettings, subscribeToUsers } from '../firebase'; // IMPORT FIREBASE
// @ts-ignore
import JSZip from 'jszip';

interface Props {
  onNavigate: (view: ViewState) => void;
  settings?: SystemSettings;
  onUpdateSettings?: (s: SystemSettings) => void;
  onImpersonate?: (user: User) => void;
  logActivity: (action: string, details: string) => void;
}

// --- TAB DEFINITIONS ---
type AdminTab =
  | 'DASHBOARD'
  | 'USERS'
  | 'SUBSCRIPTION_MANAGER'
  | 'CODES'
  | 'SUBJECTS_MGR'
  | 'LEADERBOARD'
  | 'NOTICES'
  | 'DATABASE'
  | 'DEPLOY'
  | 'ACCESS'
  | 'LOGS'
  | 'DEMAND'
  | 'RECYCLE'
  | 'SYLLABUS_MANAGER'
  | 'CONTENT_PDF'
  | 'CONTENT_VIDEO'
  | 'CONTENT_MCQ'
  | 'CONTENT_TEST'
  | 'BULK_UPLOAD'
  | 'CONFIG_GENERAL'
  | 'CONFIG_SECURITY'
  | 'CONFIG_VISIBILITY'
  | 'CONFIG_AI'
  | 'CONFIG_ADS'
  | 'CONFIG_PAYMENT'
  | 'PRICING_MGMT'
  | 'SUBSCRIPTION_PLANS_EDITOR';

interface ContentConfig {
    freeLink?: string;
    premiumLink?: string;
    freeVideoLink?: string;
    premiumVideoLink?: string;
    videoCreditsCost?: number;
    price?: number;
    manualMcqData?: MCQItem[];
    weeklyTestMcqData?: MCQItem[];
}

export const AdminDashboard: React.FC<Props> = ({ onNavigate, settings, onUpdateSettings, onImpersonate, logActivity }) => {
  // --- GLOBAL STATE ---
  const [activeTab, setActiveTab] = useState<AdminTab>('DASHBOARD');
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  
  // --- DATA LISTS ---
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [recycleBin, setRecycleBin] = useState<RecycleBinItem[]>([]);
  const [recoveryRequests, setRecoveryRequests] = useState<RecoveryRequest[]>([]);
  const [demands, setDemands] = useState<{id:string, details:string, timestamp:string}[]>([]);
  const [giftCodes, setGiftCodes] = useState<GiftCode[]>([]);

  // --- DATABASE EDITOR ---
  const [dbKey, setDbKey] = useState('nst_users');
  const [dbContent, setDbContent] = useState('');

  // --- SETTINGS STATE ---
  const [localSettings, setLocalSettings] = useState<SystemSettings>(settings || {
      appName: 'NST',
      themeColor: '#3b82f6',
      maintenanceMode: false,
      maintenanceMessage: 'We are upgrading our servers.',
      customCSS: '',
      apiKeys: [],
      adminCode: '', adminEmail: '', adminPhones: [{id: '1', number: '8227070298', name: 'Admin', isDefault: true}], footerText: 'Developed by Nadim Anwar',
      welcomeTitle: 'Unlock Smart Learning',
      welcomeMessage: 'Experience the power of AI-driven education. NST AI filters out the noise of traditional textbooks to deliver only the essential, high-yield topics you need for success. Study smarter, not harder.',
      termsText: 'Terms...', supportEmail: 'support@nst.com', aiModel: 'gemini-2.5-flash',
      aiInstruction: '',
      marqueeLines: ["Welcome to NST App"],
      liveMessage1: '', liveMessage2: '',
      wheelRewards: [0,1,2,5],
      chatCost: 1, dailyReward: 3, signupBonus: 2,
      isChatEnabled: true, isGameEnabled: true, allowSignup: true, loginMessage: '',
      allowedClasses: ['6', '7', '8', '9', '10', '11', '12'],
      allowedBoards: ['CBSE', 'BSEB'], allowedStreams: ['Science', 'Commerce', 'Arts'],
      hiddenSubjects: [], storageCapacity: '100 GB',
      isPaymentEnabled: true, upiId: '', upiName: '', qrCodeUrl: '', paymentInstructions: '',
      packages: Array.from({ length: 10 }).map((_, i) => ({
          id: `pkg-${i+1}`,
          name: `Pack ${i+1}`,
          credits: (i + 1) * 10,
          price: (i + 1) * 20
      })),
      subscriptionPlans: [
          { id: 'weekly', name: 'Weekly', duration: '7 days', price: 99, originalPrice: 129, features: ['All Premium Notes', 'MCQ Practice', 'Daily Tests'] },
          { id: 'monthly', name: 'Monthly', duration: '30 days', price: 299, originalPrice: 399, features: ['All Premium Notes', 'MCQ Practice', 'Weekly Tests', 'Live Chat'], popular: true },
          { id: 'quarterly', name: 'Quarterly', duration: '90 days', price: 799, originalPrice: 1200, features: ['Everything in Monthly', 'Priority Support', 'Analysis Reports'] },
          { id: 'lifetime', name: 'Lifetime', duration: 'Forever', price: 4999, originalPrice: 9999, features: ['Unlimited Access', 'All Features', 'Priority Support', 'Free Updates'], popular: true }
      ],
      startupAd: { enabled: true, duration: 3, title: "Premium App", features: ["Notes", "MCQ"], bgColor: "#1e293b", textColor: "#ffffff" }
  });

  // --- PACKAGE MANAGER STATE ---
  const [newPkgName, setNewPkgName] = useState('');
  const [newPkgPrice, setNewPkgPrice] = useState('');
  const [newPkgCredits, setNewPkgCredits] = useState('');

  // --- CONTENT SELECTION STATE ---
  const [selBoard, setSelBoard] = useState<Board>('CBSE');
  const [selClass, setSelClass] = useState<ClassLevel>('10');
  const [selStream, setSelStream] = useState<Stream>('Science');
  const [selSubject, setSelSubject] = useState<Subject | null>(null);
  const [selChapters, setSelChapters] = useState<Chapter[]>([]);
  const [isLoadingChapters, setIsLoadingChapters] = useState(false);
  
  // --- BULK UPLOAD STATE ---
  const [bulkData, setBulkData] = useState<Record<string, {free: string, premium: string, price: number}>>({});

  // --- EDITING STATE ---
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [editConfig, setEditConfig] = useState<ContentConfig>({ freeLink: '', premiumLink: '', price: 0 });
  const [editingMcqs, setEditingMcqs] = useState<MCQItem[]>([]);
  const [editingTestMcqs, setEditingTestMcqs] = useState<MCQItem[]>([]);
  const [importText, setImportText] = useState('');
  
  // --- PRICING MANAGEMENT STATE ---
  const [editingPlanIdx, setEditingPlanIdx] = useState<number | null>(null);
  const [editingPkg, setEditingPkg] = useState<{id: string, name: string, credits: number, price: number} | null>(null);
  
  // --- USER EDIT MODAL STATE ---
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserCredits, setEditUserCredits] = useState(0);
  const [editUserPass, setEditUserPass] = useState('');
  const [dmText, setDmText] = useState('');
  const [dmUser, setDmUser] = useState<User | null>(null);
  const [editSubscriptionTier, setEditSubscriptionTier] = useState<'FREE' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'LIFETIME'>('FREE');
  const [editSubscriptionDays, setEditSubscriptionDays] = useState(30);
  const [editSubscriptionPrice, setEditSubscriptionPrice] = useState(999);

  // SUBSCRIPTION PRICES (ADMIN CUSTOMIZABLE)
  const [subPrices, setSubPrices] = useState<{WEEKLY: number, MONTHLY: number, YEARLY: number, LIFETIME: number}>({
      WEEKLY: 49,
      MONTHLY: 199,
      YEARLY: 999,
      LIFETIME: 4999
  });

  // --- GIFT CODE STATE ---
  const [newCodeAmount, setNewCodeAmount] = useState(10);
  const [newCodeCount, setNewCodeCount] = useState(1);

  // --- SUBJECT MANAGER STATE ---
  const [customSubjects, setCustomSubjects] = useState<any>({});
  const [newSubName, setNewSubName] = useState('');
  const [newSubIcon, setNewSubIcon] = useState('book');
  const [newSubColor, setNewSubColor] = useState('bg-slate-50 text-slate-600');

  // --- WEEKLY TEST CREATION STATE ---
  const [testName, setTestName] = useState('');
  const [testDesc, setTestDesc] = useState('');
  const [testDuration, setTestDuration] = useState(120);
  const [testPassScore, setTestPassScore] = useState(50);
  const [testSelectedSubjects, setTestSelectedSubjects] = useState<string[]>([]);
  const [testSelectedChapters, setTestSelectedChapters] = useState<string[]>([]);
  const [testClassLevel, setTestClassLevel] = useState<ClassLevel>('10');

  // --- WEEKLY TEST SAVE HANDLER (NEW) ---
  const handleSaveWeeklyTest = () => {
      if (!testName || editingTestMcqs.length === 0) {
          alert("Please provide a Test Name and add at least one question.");
          return;
      }

      const newTest = {
          id: `test-${Date.now()}`,
          name: testName,
          description: testDesc,
          isActive: true,
          classLevel: testClassLevel,
          questions: editingTestMcqs,
          totalQuestions: editingTestMcqs.length,
          passingScore: testPassScore,
          createdAt: new Date().toISOString(),
          durationMinutes: testDuration,
          selectedSubjects: testSelectedSubjects,
          selectedChapters: testSelectedChapters,
          autoSubmitEnabled: true
      };

      const updatedTests = [...(localSettings.weeklyTests || []), newTest];
      setLocalSettings({...localSettings, weeklyTests: updatedTests});

      // Save immediately
      localStorage.setItem('nst_system_settings', JSON.stringify({...localSettings, weeklyTests: updatedTests}));

      // Reset Form
      setTestName('');
      setTestDesc('');
      setEditingTestMcqs([]);
      setTestSelectedSubjects([]);
      setTestSelectedChapters([]);
      alert("✅ Weekly Test Created Successfully!");
  };

  // --- INITIAL LOAD & AUTO REFRESH ---
  useEffect(() => {
      loadData();

      // Initial Check
      setIsFirebaseConnected(checkFirebaseConnection());

      const interval = setInterval(() => {
          loadData();
          // Poll Connection Status
          setIsFirebaseConnected(checkFirebaseConnection());
      }, 5000);

      // SUBSCRIBE TO USERS (Live Sync)
      const unsubUsers = subscribeToUsers((cloudUsers) => {
          if (cloudUsers && cloudUsers.length > 0) {
              setUsers(cloudUsers);
              localStorage.setItem('nst_users', JSON.stringify(cloudUsers));
          }
      });

      return () => {
          clearInterval(interval);
          unsubUsers();
      };
  }, []);

  useEffect(() => {
      if (activeTab === 'DATABASE') {
          setDbContent(localStorage.getItem(dbKey) || '');
      }
  }, [activeTab, dbKey]);

  // Clear selections when switching main tabs
  useEffect(() => {
      if (!['SYLLABUS_MANAGER', 'CONTENT_PDF', 'CONTENT_VIDEO', 'CONTENT_MCQ', 'CONTENT_TEST', 'BULK_UPLOAD'].includes(activeTab)) {
          setSelSubject(null);
          setEditingChapterId(null);
      }
  }, [activeTab]);

  const loadData = () => {
      const storedUsersStr = localStorage.getItem('nst_users');
      if (storedUsersStr) setUsers(JSON.parse(storedUsersStr));

      const demandStr = localStorage.getItem('nst_demand_requests');
      if (demandStr) setDemands(JSON.parse(demandStr));

      const reqStr = localStorage.getItem('nst_recovery_requests');
      if (reqStr) setRecoveryRequests(JSON.parse(reqStr));

      const logsStr = localStorage.getItem('nst_activity_log');
      if (logsStr) setLogs(JSON.parse(logsStr));

      const codesStr = localStorage.getItem('nst_admin_codes');
      if (codesStr) setGiftCodes(JSON.parse(codesStr));

      const subStr = localStorage.getItem('nst_custom_subjects_pool');
      if (subStr) setCustomSubjects(JSON.parse(subStr));

      const binStr = localStorage.getItem('nst_recycle_bin');
      if (binStr) {
          const binItems: RecycleBinItem[] = JSON.parse(binStr);
          const now = new Date();
          const validItems = binItems.filter(item => new Date(item.expiresAt) > now);
          if (validItems.length !== binItems.length) {
              localStorage.setItem('nst_recycle_bin', JSON.stringify(validItems));
          }
          setRecycleBin(validItems);
      }
  };

  // --- SETTINGS HANDLERS ---
  const handleSaveSettings = () => {
      if (onUpdateSettings) {
          onUpdateSettings(localSettings);
          localStorage.setItem('nst_system_settings', JSON.stringify(localSettings));

          // SYNC TO FIREBASE
          if (isFirebaseConnected) {
             saveSystemSettings(localSettings);
          }

          logActivity("SETTINGS_UPDATE", "Updated system settings");
          alert("Settings Saved to Cloud!");
      }
  };

  const toggleSetting = (key: keyof SystemSettings) => {
      const newVal = !localSettings[key];
      const updated = { ...localSettings, [key]: newVal };
      setLocalSettings(updated);
      if(onUpdateSettings) onUpdateSettings(updated);
      localStorage.setItem('nst_system_settings', JSON.stringify(updated));
      logActivity("SETTINGS_TOGGLED", `Toggled ${key} to ${newVal}`);
  };

  const toggleItemInList = <T extends string>(list: T[] | undefined, item: T): T[] => {
      const current = list || [];
      return current.includes(item) ? current.filter(i => i !== item) : [...current, item];
  };

  // --- DEPLOYMENT HANDLER (ZIP GENERATOR - VERSIONED) ---
  const handleDownloadSource = async () => {
      const zip = new JSZip();

      // 1. Gather Data & Add Version
      const currentData: any = {};
      const dataVersion = Date.now().toString(); // New Version ID
      currentData['nst_data_version'] = dataVersion;

      for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('nst_')) {
              const rawValue = localStorage.getItem(key);
              try {
                  currentData[key] = JSON.parse(rawValue || 'null');
              } catch (e) {
                  currentData[key] = rawValue;
              }
          }
      }

      // 2. Project Config
      const packageJson = {
        "name": "nst-ai-app",
        "private": true,
        "version": "3.1.0",
        "type": "module",
        "scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview" },
        "dependencies": {
          "@google/genai": "^1.33.0",
          "lucide-react": "^0.344.0",
          "react": "^18.2.0",
          "react-dom": "^18.2.0",
          "react-markdown": "^9.0.1",
          "remark-math": "^6.0.0",
          "rehype-katex": "^7.0.0",
          "katex": "^0.16.9",
          "jszip": "^3.10.1",
          "firebase": "^10.8.0"
        },
        "devDependencies": {
          "@types/react": "^18.2.66",
          "@types/react-dom": "^18.2.22",
          "@vitejs/plugin-react": "^4.2.1",
          "autoprefixer": "^10.4.18",
          "postcss": "^8.4.35",
          "tailwindcss": "^3.4.1",
          "typescript": "^5.2.2",
          "vite": "^5.2.0"
        }
      };

      const tsConfig = {
        "compilerOptions": {
          "target": "ES2020",
          "useDefineForClassFields": true,
          "lib": ["ES2020", "DOM", "DOM.Iterable"],
          "module": "ESNext",
          "skipLibCheck": true,
          "moduleResolution": "bundler",
          "allowImportingTsExtensions": true,
          "resolveJsonModule": true,
          "isolatedModules": true,
          "noEmit": true,
          "jsx": "react-jsx",
          "strict": true,
          "noUnusedLocals": true,
          "noUnusedParameters": true,
          "noFallthroughCasesInSwitch": true
        },
        "include": ["src"],
        "references": [{ "path": "./tsconfig.node.json" }]
      };

      const viteConfig = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
      `;

      const tailwindConfig = `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
      `;

      const postcssConfig = `export default { plugins: { tailwindcss: {}, autoprefixer: {}, }, }`;

      const indexHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NST AI App</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
      `;

      // 3. Add Config Files
      zip.file("package.json", JSON.stringify(packageJson, null, 2));
      zip.file("tsconfig.json", JSON.stringify(tsConfig, null, 2));
      zip.file("vite.config.ts", viteConfig);
      zip.file("tailwind.config.js", tailwindConfig);
      zip.file("postcss.config.js", postcssConfig);
      zip.file("index.html", indexHtml);
      zip.file("README.md", `# NST AI Assistant\nDeployed Version: ${dataVersion}`);

      // 4. Source Files with AUTO UPDATE LOGIC
      const src = zip.folder("src");
      src?.file("initialData.json", JSON.stringify(currentData, null, 2));

      const restoreScript = `
        export const loadInitialData = () => {
            try {
                // @ts-ignore
                import data from './initialData.json';

                const currentVersion = localStorage.getItem('nst_data_version');
                const newVersion = data['nst_data_version'];

                // If this is a new deployment (new version found in code) OR no data exists
                // We overwrite LocalStorage with the Admin's deployed data
                if (!currentVersion || (newVersion && Number(newVersion) > Number(currentVersion))) {
                    console.log("New Admin Data Detected! Updating App...");

                    // Preserve Student's User ID/Progress if possible (Merge Strategy)
                    const currentUser = localStorage.getItem('nst_current_user');
                    const userHistory = localStorage.getItem('nst_user_history');

                    // Clear old data to prevent conflicts
                    localStorage.clear();

                    // Load new Admin Data
                    Object.keys(data).forEach(key => {
                        const val = data[key];
                        const storedValue = (typeof val === 'object' && val !== null) ? JSON.stringify(val) : val;
                        localStorage.setItem(key, storedValue);
                    });

                    // Restore Student Login if it exists
                    if (currentUser) localStorage.setItem('nst_current_user', currentUser);
                    if (userHistory) localStorage.setItem('nst_user_history', userHistory);

                    console.log("App Updated Successfully to version " + newVersion);

                    // Reload page to apply changes cleanly
                    window.location.reload();
                }
            } catch (e) { console.log("No initial data found"); }
        };
      `;
      src?.file("restoreData.ts", restoreScript);

      src?.file("main.tsx", `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nimport './index.css';\nimport { loadInitialData } from './restoreData';\n\n// Run Data Sync before App Mounts\nloadInitialData();\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);`);

      src?.file("index.css", `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n/* Paste your custom CSS here */`);

      // Generate Zip
      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `NST_App_Live_Update_${new Date().toISOString().slice(0,10)}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert("✅ UPDATE PACKAGE READY!\n\n1. Upload this ZIP to Vercel.\n2. ALL Students will get the new PDF links automatically.");
  };

  // --- RECYCLE BIN HANDLERS ---
  const softDelete = (type: RecycleBinItem['type'], name: string, data: any, originalKey?: string, originalId?: string) => {
      if (!window.confirm(`DELETE "${name}"?\n(Moved to Recycle Bin for 90 days)`)) return false;

      const newItem: RecycleBinItem = {
          id: Date.now().toString(),
          originalId: originalId || Date.now().toString(),
          type,
          name,
          data,
          deletedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          restoreKey: originalKey
      };

      const newBin = [...recycleBin, newItem];
      setRecycleBin(newBin);
      localStorage.setItem('nst_recycle_bin', JSON.stringify(newBin));
      return true;
  };

  const handleRestoreItem = (item: RecycleBinItem) => {
      if (!window.confirm(`Restore "${item.name}"?`)) return;

      if (item.type === 'USER') {
          const stored = localStorage.getItem('nst_users');
          const users: User[] = stored ? JSON.parse(stored) : [];
          if (!users.some(u => u.id === item.data.id)) {
              users.push(item.data);
              localStorage.setItem('nst_users', JSON.stringify(users));
          } else {
              alert("User ID already exists. Cannot restore.");
              return;
          }
      } else if (item.restoreKey) {
          if (item.type === 'CHAPTER') {
              const listStr = localStorage.getItem(item.restoreKey);
              const list = listStr ? JSON.parse(listStr) : [];
              list.push(item.data);
              localStorage.setItem(item.restoreKey, JSON.stringify(list));
          } else {
              localStorage.setItem(item.restoreKey, JSON.stringify(item.data));
          }
      }

      const newBin = recycleBin.filter(i => i.id !== item.id);
      setRecycleBin(newBin);
      localStorage.setItem('nst_recycle_bin', JSON.stringify(newBin));
      alert("Item Restored!");
      loadData();
  };

  const handlePermanentDelete = (id: string) => {
      if (window.confirm("PERMANENTLY DELETE? This cannot be undone.")) {
          const newBin = recycleBin.filter(i => i.id !== id);
          setRecycleBin(newBin);
          localStorage.setItem('nst_recycle_bin', JSON.stringify(newBin));
      }
  };

  // --- USER MANAGEMENT (Enhanced) ---
  const deleteUser = (userId: string) => {
      const userToDelete = users.find(u => u.id === userId);
      if (!userToDelete) return;
      if (softDelete('USER', userToDelete.name, userToDelete, undefined, userToDelete.id)) {
          const updated = users.filter(u => u.id !== userId);
          setUsers(updated);
          localStorage.setItem('nst_users', JSON.stringify(updated));
          logActivity("USER_DELETE", `Moved user ${userId} to Recycle Bin`);
      }
  };

  const openEditUser = (user: User) => {
      setEditingUser(user);
      setEditUserCredits(user.credits);
      setEditUserPass(user.password);
      setEditSubscriptionTier(user.subscriptionTier || 'FREE');
      setEditSubscriptionDays(30);
      setEditSubscriptionPrice(user.subscriptionPrice || 999);
  };

  const saveEditedUser = () => {
      if (!editingUser) return;
      const endDate = editSubscriptionTier === 'FREE' ? undefined : new Date(Date.now() + editSubscriptionDays * 24 * 60 * 60 * 1000).toISOString();
      const updatedUser = {
          ...editingUser,
          credits: editUserCredits,
          password: editUserPass,
          subscriptionTier: editSubscriptionTier,
          subscriptionEndDate: endDate,
          subscriptionPrice: editSubscriptionPrice,
          grantedByAdmin: true,
          isPremium: editSubscriptionTier !== 'FREE'
      };
      const updatedList = users.map(u => u.id === editingUser.id ? updatedUser : u);
      setUsers(updatedList);
      localStorage.setItem('nst_users', JSON.stringify(updatedList));
      setEditingUser(null);
      alert(`✅ ${editingUser.name} now has ${editSubscriptionTier} subscription until ${endDate ? new Date(endDate).toLocaleDateString() : 'N/A'}`);
  };

  const sendDirectMessage = () => {
      if (!dmUser || !dmText) return;
      const newMsg = { id: Date.now().toString(), text: dmText, date: new Date().toISOString(), read: false };
      const updatedUser = { ...dmUser, inbox: [newMsg, ...(dmUser.inbox || [])] };
      const updatedList = users.map(u => u.id === dmUser.id ? updatedUser : u);
      setUsers(updatedList);
      localStorage.setItem('nst_users', JSON.stringify(updatedList));
      setDmUser(null);
      setDmText('');
      alert("Message Sent!");
  };

  // --- GIFT CODE MANAGER (New) ---
  const generateCodes = () => {
      const newCodes: GiftCode[] = [];
      for (let i = 0; i < newCodeCount; i++) {
          const code = `NST-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${newCodeAmount}`;
          newCodes.push({
              id: Date.now().toString() + i,
              code,
              amount: newCodeAmount,
              createdAt: new Date().toISOString(),
              isRedeemed: false,
              generatedBy: 'ADMIN'
          });
      }
      const updated = [...newCodes, ...giftCodes];
      setGiftCodes(updated);
      localStorage.setItem('nst_admin_codes', JSON.stringify(updated));
      alert(`${newCodeCount} Codes Generated!`);
  };

  const deleteCode = (id: string) => {
      const updated = giftCodes.filter(c => c.id !== id);
      setGiftCodes(updated);
      localStorage.setItem('nst_admin_codes', JSON.stringify(updated));
  };

  // --- SUBJECT MANAGER (New) ---
  const addSubject = () => {
      if (!newSubName) return;
      const id = newSubName.toLowerCase().replace(/\s+/g, '');
      const newSubject = { id, name: newSubName, icon: newSubIcon, color: newSubColor };
      const updatedPool = { ...DEFAULT_SUBJECTS, ...customSubjects, [id]: newSubject };
      setCustomSubjects(updatedPool); // This only stores custom ones technically in state, but logic handles merge
      localStorage.setItem('nst_custom_subjects_pool', JSON.stringify(updatedPool));
      setNewSubName('');
      alert("Subject Added!");
  };

  // --- PACKAGE MANAGER (New) ---
  const addPackage = () => {
      if (!newPkgName || !newPkgPrice || !newPkgCredits) return;
      const newPkg = {
          id: `pkg-${Date.now()}`,
          name: newPkgName,
          price: Number(newPkgPrice),
          credits: Number(newPkgCredits)
      };
      const currentPkgs = localSettings.packages || [];
      const updatedPkgs = [...currentPkgs, newPkg];
      setLocalSettings({ ...localSettings, packages: updatedPkgs });
      setNewPkgName(''); setNewPkgPrice(''); setNewPkgCredits('');
  };

  const removePackage = (id: string) => {
      const currentPkgs = localSettings.packages || [];
      setLocalSettings({ ...localSettings, packages: currentPkgs.filter(p => p.id !== id) });
  };

  // --- CONTENT & SYLLABUS LOGIC ---
  const handleSubjectClick = async (s: Subject) => {
      setSelSubject(s);
      setIsLoadingChapters(true);
      try {
          const ch = await fetchChapters(selBoard, selClass, selStream, s, 'English');
          setSelChapters(ch);

          if (activeTab === 'BULK_UPLOAD') {
              const streamKey = (selClass === '11' || selClass === '12') ? `-${selStream}` : '';
              const tempBulk: any = {};
              ch.forEach(c => {
                  const key = `nst_content_${selBoard}_${selClass}${streamKey}_${s.name}_${c.id}`;
                  const stored = localStorage.getItem(key);
                  if (stored) {
                      const d = JSON.parse(stored);
                      tempBulk[c.id] = { free: d.freeLink || '', premium: d.premiumLink || '', price: d.price || 5 };
                  } else {
                      tempBulk[c.id] = { free: '', premium: '', price: 5 };
                  }
              });
              setBulkData(tempBulk);
          }

      } catch (e) { console.error(e); setSelChapters([]); }
      setIsLoadingChapters(false);
  };

  const loadChapterContent = (chId: string) => {
      const streamKey = (selClass === '11' || selClass === '12') ? `-${selStream}` : '';
      const key = `nst_content_${selBoard}_${selClass}${streamKey}_${selSubject?.name}_${chId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
          const data = JSON.parse(stored);
          setEditConfig(data);
          setEditingMcqs(data.manualMcqData || []);
          setEditingTestMcqs(data.weeklyTestMcqData || []);
      } else {
          setEditConfig({ freeLink: '', premiumLink: '', price: 5 });
          setEditingMcqs([]);
          setEditingTestMcqs([]);
      }
      setEditingChapterId(chId);
  };

  // --- UPDATED SAVE FUNCTION (WRITES TO FIREBASE) ---
  const saveChapterContent = () => {
      if (!editingChapterId || !selSubject) return;
      const streamKey = (selClass === '11' || selClass === '12') ? `-${selStream}` : '';
      const key = `nst_content_${selBoard}_${selClass}${streamKey}_${selSubject.name}_${editingChapterId}`;
      const existing = localStorage.getItem(key);
      const existingData = existing ? JSON.parse(existing) : {};

      const newData = {
          ...existingData,
          freeLink: editConfig.freeLink,
          premiumLink: editConfig.premiumLink,
          freeVideoLink: editConfig.freeVideoLink,
          premiumVideoLink: editConfig.premiumVideoLink,
          videoCreditsCost: editConfig.videoCreditsCost,
          price: editConfig.price,
          manualMcqData: editingMcqs,
          weeklyTestMcqData: editingTestMcqs
      };

      // Save locally AND to Firebase
      localStorage.setItem(key, JSON.stringify(newData));
      if (isFirebaseConnected) {
          saveChapterData(key, newData); // <--- FIREBASE SAVE
          alert("✅ Content Saved to Firebase Database!");
      } else {
          alert("⚠️ Saved Locally ONLY. Firebase is NOT Connected. Check services/firebase.ts");
      }
  };

  // --- UPDATED BULK SAVE FUNCTION (WRITES TO FIREBASE) ---
  const saveBulkData = async () => {
      if (!selSubject) return;
      const streamKey = (selClass === '11' || selClass === '12') ? `-${selStream}` : '';

      const updates: Record<string, any> = {};

      Object.keys(bulkData).forEach(chId => {
          const d = bulkData[chId];
          const key = `nst_content_${selBoard}_${selClass}${streamKey}_${selSubject.name}_${chId}`;
          const existing = localStorage.getItem(key);
          const existingData = existing ? JSON.parse(existing) : {};

          const newData = {
              ...existingData,
              freeLink: d.free,
              premiumLink: d.premium,
              price: d.price
          };
          localStorage.setItem(key, JSON.stringify(newData));
          updates[key] = newData;
      });

      if (isFirebaseConnected) {
          await bulkSaveLinks(updates);
          alert(`✅ Saved links for ${Object.keys(bulkData).length} chapters to CLOUD!\n\nStudents will see these updates instantly without redownloading the app.`);
      } else {
          alert("⚠️ Saved Locally ONLY. Please Configure Firebase in services/firebase.ts to enable Cloud Sync.");
      }
  };

  const saveSyllabusList = () => {
      if (!selSubject) return;
      const streamKey = (selClass === '11' || selClass === '12') ? `-${selStream}` : '';
      const cacheKey = `nst_custom_chapters_${selBoard}-${selClass}${streamKey}-${selSubject.name}-English`;
      localStorage.setItem(cacheKey, JSON.stringify(selChapters));
      // Save Hindi fallback
      const cacheKeyHindi = `nst_custom_chapters_${selBoard}-${selClass}${streamKey}-${selSubject.name}-Hindi`;
      localStorage.setItem(cacheKeyHindi, JSON.stringify(selChapters));
      alert("Syllabus Structure Saved!");
  };

  const deleteChapter = (idx: number) => {
      const ch = selChapters[idx];
      const streamKey = (selClass === '11' || selClass === '12') ? `-${selStream}` : '';
      const cacheKey = `nst_custom_chapters_${selBoard}-${selClass}${streamKey}-${selSubject?.name}-English`;

      if (softDelete('CHAPTER', ch.title, ch, cacheKey)) {
          const updated = selChapters.filter((_, i) => i !== idx);
          setSelChapters(updated);
      }
  };

  // --- MCQ EDITING HELPERS ---
  const updateMcq = (isTest: boolean, idx: number, field: keyof MCQItem, val: any) => {
      const list = isTest ? editingTestMcqs : editingMcqs;
      const updated = [...list];
      updated[idx] = { ...updated[idx], [field]: val };
      isTest ? setEditingTestMcqs(updated) : setEditingMcqs(updated);
  };
  const updateMcqOption = (isTest: boolean, qIdx: number, oIdx: number, val: string) => {
      const list = isTest ? editingTestMcqs : editingMcqs;
      const updated = [...list];
      updated[qIdx].options[oIdx] = val;
      isTest ? setEditingTestMcqs(updated) : setEditingMcqs(updated);
  };
  const addMcq = (isTest: boolean) => {
      const newItem: MCQItem = { question: 'New Question', options: ['A','B','C','D'], correctAnswer: 0, explanation: '' };
      isTest ? setEditingTestMcqs([...editingTestMcqs, newItem]) : setEditingMcqs([...editingMcqs, newItem]);
  };
  const removeMcq = (isTest: boolean, idx: number) => {
      const list = isTest ? editingTestMcqs : editingMcqs;
      const updated = list.filter((_, i) => i !== idx);
      isTest ? setEditingTestMcqs(updated) : setEditingMcqs(updated);
  };

  // --- GOOGLE SHEET IMPORT HANDLER ---
  const handleGoogleSheetImport = (isTest: boolean) => {
      if (!importText.trim()) {
          alert("Please paste data first!");
          return;
      }

      try {
          const rows = importText.trim().split('\n');

          const newQuestions: MCQItem[] = rows.map((row, idx) => {
              let cols = row.split(/\t/);

              if (cols.length < 2) {
                  cols = row.split(',');
              }

              cols = cols.map(c => c.trim());

              if (cols.length < 7) {
                  throw new Error(`Row ${idx + 1} is invalid. It needs 7 columns: Question | Option A | Option B | Option C | Option D | Correct (1-4) | Explanation`);
              }

              return {
                  question: cols[0],
                  options: [cols[1], cols[2], cols[3], cols[4]],
                  correctAnswer: parseInt(cols[5]) - 1,
                  explanation: cols[6] || 'No explanation provided.'
              };
          });

          if (isTest) {
              setEditingTestMcqs([...editingTestMcqs, ...newQuestions]);
          } else {
              setEditingMcqs([...editingMcqs, ...newQuestions]);
          }

          setImportText('');
          alert(`Success! ${newQuestions.length} questions imported.`);

      } catch (error: any) {
          alert("Import Failed: " + error.message);
      }
  };

  // --- ACCESS REQUEST HANDLERS ---
  const handleApproveRequest = (req: RecoveryRequest) => {
      const updatedReqs = recoveryRequests.map(r => r.id === req.id ? { ...r, status: 'RESOLVED' } : r);
      setRecoveryRequests(updatedReqs as RecoveryRequest[]);
      localStorage.setItem('nst_recovery_requests', JSON.stringify(updatedReqs));
  };

  // --- SUB-COMPONENTS (RENDER HELPERS) ---
  const DashboardCard = ({ icon: Icon, label, onClick, color, count }: any) => (
      <button onClick={onClick} className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 bg-white border-slate-200 hover:border-${color}-400 hover:bg-${color}-50`}>
          <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
              <Icon size={24} />
          </div>
          <span className="font-bold text-xs uppercase text-slate-600">{label}</span>
          {count !== undefined && <span className={`text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 text-slate-500`}>{count}</span>}
      </button>
  );

  const SubjectSelector = () => (
      <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <select value={selBoard} onChange={e => setSelBoard(e.target.value as Board)} className="p-2 rounded border text-sm font-bold text-slate-700">
                  <option value="CBSE">CBSE</option>
                  <option value="BSEB">BSEB</option>
              </select>
              <select value={selClass} onChange={e => setSelClass(e.target.value as ClassLevel)} className="p-2 rounded border text-sm font-bold text-slate-700">
                  {['6','7','8','9','10','11','12'].map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
              <select value={selStream} onChange={e => setSelStream(e.target.value as Stream)} className="p-2 rounded border text-sm font-bold text-slate-700">
                  <option value="Science">Science</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Arts">Arts</option>
              </select>
              <button onClick={() => { setSelSubject(null); setSelChapters([]); }} className="p-2 bg-blue-600 text-white rounded text-xs font-bold shadow flex items-center justify-center gap-1">
                  <RefreshCw size={14} /> Reset
              </button>
          </div>
          {!selSubject && (
              <div className="flex flex-wrap gap-2">
                  {getSubjectsList(selClass, selStream).map(s => (
                      <button key={s.id} onClick={() => handleSubjectClick(s)} className="px-4 py-2 rounded-lg text-sm font-bold border hover:bg-blue-50 transition-colors bg-white border-slate-200 text-slate-700">
                          {s.name}
                      </button>
                  ))}
              </div>
          )}
          {isLoadingChapters && <div className="text-slate-500 text-sm font-bold py-4 animate-pulse">Loading Chapters...</div>}
      </div>
  );

  // --- MAIN RENDER ---
  return (
    <div className="pb-20 bg-slate-50 min-h-screen">

      {/* 1. DASHBOARD HOME */}
      {activeTab === 'DASHBOARD' && (
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-6 animate-in fade-in">
              <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                      <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg"><Shield size={20} /></div>
                      <div>
                          <h2 className="font-black text-slate-800 text-lg leading-none">Admin Console</h2>
                          <div className="flex items-center gap-2 mt-1">
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Control System</p>
                              {/* FIREBASE STATUS INDICATOR */}
                              {isFirebaseConnected ? (
                                  <span className="flex items-center gap-1 bg-green-100 text-green-700 text-[9px] px-2 py-0.5 rounded-full font-bold">
                                      <Wifi size={10} /> Online
                                  </span>
                              ) : (
                                  <span className="flex items-center gap-1 bg-red-100 text-red-700 text-[9px] px-2 py-0.5 rounded-full font-bold">
                                      <WifiOff size={10} /> Offline
                                  </span>
                              )}
                          </div>
                      </div>
                  </div>
                  <button onClick={() => onNavigate('STUDENT_DASHBOARD')} className="text-slate-400 hover:text-blue-600 transition-colors">
                      <LogOut size={20} />
                  </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="col-span-2 md:col-span-4 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white shadow-xl flex items-center justify-between relative overflow-hidden">
                      <div className="relative z-10">
                          <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Total Users</p>
                          <h1 className="text-4xl font-black">{users.length}</h1>
                      </div>
                      <Users size={48} className="text-white opacity-20 relative z-10" />
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  </div>

                  <DashboardCard icon={Users} label="Users" onClick={() => setActiveTab('USERS')} color="blue" />
                  <DashboardCard icon={Megaphone} label="Notices" onClick={() => setActiveTab('NOTICES')} color="orange" />
                  <DashboardCard icon={Database} label="DB Edit" onClick={() => setActiveTab('DATABASE')} color="red" />
                  <DashboardCard icon={ShieldCheck} label="Access" onClick={() => setActiveTab('ACCESS')} color="green" count={recoveryRequests.filter(r => r.status === 'PENDING').length} />

                  <DashboardCard icon={ListChecks} label="Syllabus" onClick={() => setActiveTab('SYLLABUS_MANAGER')} color="purple" />
                  <DashboardCard icon={FileText} label="Content" onClick={() => setActiveTab('CONTENT_PDF')} color="pink" />
                  <DashboardCard icon={Video} label="Videos" onClick={() => setActiveTab('CONTENT_VIDEO')} color="red" />
                  <DashboardCard icon={BrainCircuit} label="MCQ" onClick={() => setActiveTab('CONTENT_MCQ')} color="indigo" />

                  <DashboardCard icon={Upload} label="Bulk Link" onClick={() => setActiveTab('BULK_UPLOAD')} color="cyan" />
                  <DashboardCard icon={AlertOctagon} label="Issues" onClick={() => setActiveTab('LOGS')} color="amber" />
                  <DashboardCard icon={MessageSquare} label="Demands" onClick={() => setActiveTab('DEMAND')} color="teal" />
                  <DashboardCard icon={Trash2} label="Bin" onClick={() => setActiveTab('RECYCLE')} color="slate" />

                  <DashboardCard icon={Gift} label="Codes" onClick={() => setActiveTab('CODES')} color="fuchsia" />
                  <DashboardCard icon={Book} label="Subjects" onClick={() => setActiveTab('SUBJECTS_MGR')} color="emerald" />
                  <DashboardCard icon={Rocket} label="Deploy" onClick={() => setActiveTab('DEPLOY')} color="blue" />
                  <DashboardCard icon={CreditCard} label="Payments" onClick={() => setActiveTab('CONFIG_PAYMENT')} color="yellow" />
              </div>

              {/* SETTINGS SHORTCUTS */}
              <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => setActiveTab('CONFIG_GENERAL')} className="p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 flex flex-col items-center gap-1 hover:bg-slate-100">
                      <Monitor size={16} /> App Config
                  </button>
                  <button onClick={() => setActiveTab('CONFIG_AI')} className="p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 flex flex-col items-center gap-1 hover:bg-slate-100">
                      <Sparkles size={16} /> AI Settings
                  </button>
                  <button onClick={() => setActiveTab('PRICING_MGMT')} className="p-3 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 flex flex-col items-center gap-1 hover:bg-slate-100">
                      <Banknote size={16} /> Pricing
                  </button>
              </div>
          </div>
      )}

      {/* 2. DEPLOYMENT (ZIP) */}
      {activeTab === 'DEPLOY' && (
          <div className="p-6">
              <div className="flex items-center gap-2 mb-6 text-slate-800">
                  <button onClick={() => setActiveTab('DASHBOARD')}><ArrowLeft /></button>
                  <h2 className="font-bold text-xl">Deploy Updates</h2>
              </div>

              <div className="bg-white p-8 rounded-3xl text-center shadow-lg border border-slate-100">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
                      <Rocket size={40} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2">Push Update to Students</h3>
                  <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
                      This will generate a new ZIP file with all your latest database changes, links, and settings.
                      Upload this ZIP to Vercel to update the live app for everyone.
                  </p>
                  <button onClick={handleDownloadSource} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto">
                      <Download size={20} /> Download Deployment Package
                  </button>
              </div>
          </div>
      )}

      {/* 3. SYLLABUS MANAGER */}
      {activeTab === 'SYLLABUS_MANAGER' && (
          <div className="p-6">
               <div className="flex items-center gap-2 mb-6 text-slate-800">
                  <button onClick={() => setActiveTab('DASHBOARD')}><ArrowLeft /></button>
                  <h2 className="font-bold text-xl">Syllabus Manager</h2>
              </div>
              <SubjectSelector />

              {selSubject && (
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="font-bold text-lg">{selSubject.name} Chapters</h3>
                          <button onClick={saveSyllabusList} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold shadow hover:bg-green-700">
                              <Save size={16} /> Save Order
                          </button>
                      </div>
                      
                      <div className="space-y-2">
                          {selChapters.map((ch, idx) => (
                              <div key={ch.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between group">
                                  <div className="flex items-center gap-3">
                                      <span className="font-mono text-xs text-slate-400 font-bold">#{idx + 1}</span>
                                      <input 
                                          type="text"
                                          value={ch.title}
                                          onChange={e => {
                                              const updated = [...selChapters];
                                              updated[idx].title = e.target.value;
                                              setSelChapters(updated);
                                          }}
                                          className="bg-transparent font-medium text-slate-700 outline-none w-64"
                                      />
                                  </div>
                                  <button onClick={() => deleteChapter(idx)} className="text-red-400 hover:text-red-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Trash2 size={16} />
                                  </button>
                              </div>
                          ))}
                          <button
                              onClick={() => setSelChapters([...selChapters, { id: `ch-${Date.now()}`, title: 'New Chapter' }])}
                              className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-400 font-bold text-sm hover:bg-slate-50 hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
                          >
                              <Plus size={16} /> Add Chapter
                          </button>
                      </div>
                  </div>
              )}
          </div>
      )}

      {/* 4. CONTENT EDITORS (PDF / VIDEO / MCQ) */}
      {['CONTENT_PDF', 'CONTENT_VIDEO'].includes(activeTab) && (
          <div className="p-6">
              <div className="flex items-center gap-2 mb-6 text-slate-800">
                  <button onClick={() => setActiveTab('DASHBOARD')}><ArrowLeft /></button>
                  <h2 className="font-bold text-xl">{activeTab === 'CONTENT_PDF' ? 'PDF Content' : 'Video Content'}</h2>
              </div>
              <SubjectSelector />

              {selSubject && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* CHAPTER LIST */}
                      <div className="bg-white p-4 rounded-2xl shadow-sm max-h-[600px] overflow-y-auto">
                          <h3 className="font-bold text-slate-500 text-xs uppercase mb-4">Select Chapter</h3>
                          <div className="space-y-2">
                              {selChapters.map(ch => (
                                  <button
                                      key={ch.id}
                                      onClick={() => loadChapterContent(ch.id)}
                                      className={`w-full text-left p-3 rounded-xl text-sm font-bold transition-all ${editingChapterId === ch.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-blue-50'}`}
                                  >
                                      {ch.title}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* EDITOR */}
                      {editingChapterId && (
                          <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 animate-in slide-in-from-right-10">
                              <h3 className="font-black text-xl text-slate-800 mb-6 flex items-center gap-2">
                                  {activeTab === 'CONTENT_PDF' ? <FileText className="text-blue-600" /> : <Video className="text-red-600" />}
                                  Edit Content
                              </h3>

                              <div className="space-y-4 mb-6">
                                  {activeTab === 'CONTENT_PDF' ? (
                                      <>
                                          <div>
                                              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Free PDF Link</label>
                                              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                                  <Link size={16} className="text-slate-400" />
                                                  <input
                                                      type="text"
                                                      value={editConfig.freeLink}
                                                      onChange={e => setEditConfig({...editConfig, freeLink: e.target.value})}
                                                      className="bg-transparent w-full text-sm font-medium outline-none"
                                                      placeholder="Paste Google Drive / PDF Link..."
                                                  />
                                              </div>
                                          </div>
                                          <div>
                                              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Premium PDF Link (Locked)</label>
                                              <div className="flex items-center gap-2 bg-amber-50 p-2 rounded-lg border border-amber-200">
                                                  <Lock size={16} className="text-amber-500" />
                                                  <input
                                                      type="text"
                                                      value={editConfig.premiumLink}
                                                      onChange={e => setEditConfig({...editConfig, premiumLink: e.target.value})}
                                                      className="bg-transparent w-full text-sm font-medium outline-none text-amber-900"
                                                      placeholder="Paste Premium Link..."
                                                  />
                                              </div>
                                          </div>
                                      </>
                                  ) : (
                                      <>
                                           <div>
                                              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Video URL (YouTube/MP4)</label>
                                              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                                                  <Video size={16} className="text-slate-400" />
                                                  <input
                                                      type="text"
                                                      value={editConfig.freeVideoLink}
                                                      onChange={e => setEditConfig({...editConfig, freeVideoLink: e.target.value})}
                                                      className="bg-transparent w-full text-sm font-medium outline-none"
                                                      placeholder="Paste Video URL..."
                                                  />
                                              </div>
                                          </div>
                                      </>
                                  )}

                                  <div>
                                      <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Unlock Price (Credits)</label>
                                      <input
                                          type="number"
                                          value={editConfig.price}
                                          onChange={e => setEditConfig({...editConfig, price: Number(e.target.value)})}
                                          className="w-full p-2 bg-slate-50 rounded-lg border border-slate-200 font-bold text-slate-700"
                                      />
                                  </div>
                              </div>

                              <button onClick={saveChapterContent} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                                  <Save size={20} /> Save Changes
                              </button>
                          </div>
                      )}
                  </div>
              )}
          </div>
      )}

      {/* 5. BULK UPLOAD */}
      {activeTab === 'BULK_UPLOAD' && (
          <div className="p-6">
              <div className="flex items-center gap-2 mb-6 text-slate-800">
                  <button onClick={() => setActiveTab('DASHBOARD')}><ArrowLeft /></button>
                  <h2 className="font-bold text-xl">Bulk Link Manager</h2>
              </div>
              <SubjectSelector />

              {selSubject && (
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                       <div className="flex justify-between items-center mb-6">
                          <h3 className="font-bold text-lg">Quick Edit: {selSubject.name}</h3>
                          <button onClick={saveBulkData} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-bold shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all">
                              <Save size={18} /> Save All
                          </button>
                      </div>

                      <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                              <thead className="text-xs text-slate-400 uppercase bg-slate-50 border-b">
                                  <tr>
                                      <th className="px-4 py-3">Chapter</th>
                                      <th className="px-4 py-3">Free Link</th>
                                      <th className="px-4 py-3">Premium Link</th>
                                      <th className="px-4 py-3 w-24">Price</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                  {selChapters.map(ch => (
                                      <tr key={ch.id} className="hover:bg-slate-50 transition-colors">
                                          <td className="px-4 py-3 font-bold text-slate-700">{ch.title}</td>
                                          <td className="px-4 py-3">
                                              <input
                                                  className="w-full bg-slate-100 p-2 rounded border border-transparent focus:border-blue-400 focus:bg-white outline-none transition-all text-xs"
                                                  placeholder="Paste link..."
                                                  value={bulkData[ch.id]?.free || ''}
                                                  onChange={e => setBulkData({...bulkData, [ch.id]: { ...bulkData[ch.id], free: e.target.value }})}
                                              />
                                          </td>
                                          <td className="px-4 py-3">
                                              <input
                                                  className="w-full bg-amber-50 p-2 rounded border border-transparent focus:border-amber-400 focus:bg-white outline-none transition-all text-xs text-amber-900"
                                                  placeholder="Paste premium link..."
                                                  value={bulkData[ch.id]?.premium || ''}
                                                  onChange={e => setBulkData({...bulkData, [ch.id]: { ...bulkData[ch.id], premium: e.target.value }})}
                                              />
                                          </td>
                                          <td className="px-4 py-3">
                                              <input
                                                  type="number"
                                                  className="w-full bg-slate-100 p-2 rounded font-bold text-center outline-none focus:bg-white border focus:border-blue-400"
                                                  value={bulkData[ch.id]?.price || 5}
                                                  onChange={e => setBulkData({...bulkData, [ch.id]: { ...bulkData[ch.id], price: Number(e.target.value) }})}
                                              />
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}
          </div>
      )}

      {/* 6. MCQ EDITOR & TEST MAKER (Combined Logic) */}
      {['CONTENT_MCQ', 'CONTENT_TEST'].includes(activeTab) && (
          <div className="p-6">
              <div className="flex items-center gap-2 mb-6 text-slate-800">
                  <button onClick={() => setActiveTab('DASHBOARD')}><ArrowLeft /></button>
                  <h2 className="font-bold text-xl">{activeTab === 'CONTENT_MCQ' ? 'MCQ Editor' : 'Weekly Test Creator'}</h2>
              </div>

              {activeTab === 'CONTENT_MCQ' && <SubjectSelector />}

              {/* WEEKLY TEST FORM */}
              {activeTab === 'CONTENT_TEST' && (
                  <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 border border-indigo-100">
                      <h3 className="font-bold text-lg mb-4 text-indigo-900">Test Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <input className="p-3 bg-slate-50 rounded-lg border font-bold" placeholder="Test Name (e.g., Weekly Science Test 5)" value={testName} onChange={e => setTestName(e.target.value)} />
                          <input className="p-3 bg-slate-50 rounded-lg border" placeholder="Description (Optional)" value={testDesc} onChange={e => setTestDesc(e.target.value)} />
                          <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-500">Duration (Min):</span>
                              <input type="number" className="p-3 bg-slate-50 rounded-lg border w-24 font-bold" value={testDuration} onChange={e => setTestDuration(Number(e.target.value))} />
                          </div>
                          <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-500">Pass Score (%):</span>
                              <input type="number" className="p-3 bg-slate-50 rounded-lg border w-24 font-bold" value={testPassScore} onChange={e => setTestPassScore(Number(e.target.value))} />
                          </div>
                           <select value={testClassLevel} onChange={e => setTestClassLevel(e.target.value as ClassLevel)} className="p-3 bg-slate-50 rounded-lg border font-bold text-slate-700">
                              {['6','7','8','9','10','11','12'].map(c => <option key={c} value={c}>Class {c}</option>)}
                          </select>
                      </div>
                      <button onClick={handleSaveWeeklyTest} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2">
                          <Save size={18} /> Create & Publish Test
                      </button>
                  </div>
              )}

              {/* EDITOR AREA */}
              {(activeTab === 'CONTENT_TEST' || (selSubject && editingChapterId)) && (
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                      {/* IMPORT TOOL */}
                      <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="flex justify-between items-center mb-2">
                              <h4 className="font-bold text-sm text-slate-600 flex items-center gap-2"><FileJson size={16} /> Import from Excel/Sheets</h4>
                              <button onClick={() => handleGoogleSheetImport(activeTab === 'CONTENT_TEST')} className="text-xs font-bold text-blue-600 hover:underline">Process Import</button>
                          </div>
                          <textarea
                              className="w-full h-24 p-2 text-xs font-mono bg-white border rounded mb-2"
                              placeholder={`Paste columns:\nQuestion | Option A | Option B | Option C | Option D | Correct Answer (1-4) | Explanation`}
                              value={importText}
                              onChange={e => setImportText(e.target.value)}
                          />
                      </div>

                      {/* QUESTIONS LIST */}
                      <div className="space-y-6">
                          {(activeTab === 'CONTENT_TEST' ? editingTestMcqs : editingMcqs).map((mcq, qIdx) => (
                              <div key={qIdx} className="p-4 rounded-xl border-2 border-slate-100 hover:border-blue-200 transition-colors relative group bg-white">
                                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button onClick={() => removeMcq(activeTab === 'CONTENT_TEST', qIdx)} className="p-1 text-red-400 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                                  </div>

                                  <div className="mb-3">
                                      <span className="text-xs font-black text-slate-300 mr-2">Q{qIdx + 1}</span>
                                      <textarea
                                          className="w-full font-bold text-slate-800 outline-none resize-none bg-transparent"
                                          value={mcq.question}
                                          onChange={e => updateMcq(activeTab === 'CONTENT_TEST', qIdx, 'question', e.target.value)}
                                          rows={2}
                                      />
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                                      {mcq.options.map((opt, oIdx) => (
                                          <div key={oIdx} className={`flex items-center gap-2 p-2 rounded-lg border ${mcq.correctAnswer === oIdx ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-transparent'}`}>
                                              <button
                                                  onClick={() => updateMcq(activeTab === 'CONTENT_TEST', qIdx, 'correctAnswer', oIdx)}
                                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${mcq.correctAnswer === oIdx ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}
                                              >
                                                  {['A','B','C','D'][oIdx]}
                                              </button>
                                              <input
                                                  className="w-full bg-transparent outline-none text-sm"
                                                  value={opt}
                                                  onChange={e => updateMcqOption(activeTab === 'CONTENT_TEST', qIdx, oIdx, e.target.value)}
                                              />
                                          </div>
                                      ))}
                                  </div>

                                  <div>
                                      <label className="text-[10px] font-bold text-slate-400 uppercase">Explanation</label>
                                      <input
                                          className="w-full text-sm text-slate-600 bg-slate-50 p-2 rounded outline-none"
                                          value={mcq.explanation}
                                          onChange={e => updateMcq(activeTab === 'CONTENT_TEST', qIdx, 'explanation', e.target.value)}
                                      />
                                  </div>
                              </div>
                          ))}
                      </div>

                      <div className="mt-6 flex gap-4">
                          <button onClick={() => addMcq(activeTab === 'CONTENT_TEST')} className="flex-1 py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:bg-slate-50 hover:border-blue-400 hover:text-blue-500 transition-all flex items-center justify-center gap-2">
                              <Plus size={18} /> Add Question
                          </button>
                          {activeTab === 'CONTENT_MCQ' && (
                              <button onClick={saveChapterContent} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700">
                                  Save MCQ Set
                              </button>
                          )}
                      </div>
                  </div>
              )}
          </div>
      )}

      {/* 7. SETTINGS & CONFIG */}
      {activeTab === 'CONFIG_GENERAL' && (
          <div className="p-6">
              <div className="flex items-center gap-2 mb-6 text-slate-800">
                  <button onClick={() => setActiveTab('DASHBOARD')}><ArrowLeft /></button>
                  <h2 className="font-bold text-xl">App Configuration</h2>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">App Name</label>
                      <input className="w-full p-3 bg-slate-50 rounded-xl font-bold border" value={localSettings.appName} onChange={e => setLocalSettings({...localSettings, appName: e.target.value})} />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Welcome Message</label>
                      <textarea className="w-full p-3 bg-slate-50 rounded-xl font-medium border h-24" value={localSettings.welcomeMessage} onChange={e => setLocalSettings({...localSettings, welcomeMessage: e.target.value})} />
                  </div>
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Login Screen Message</label>
                      <textarea className="w-full p-3 bg-slate-50 rounded-xl font-medium border h-24" value={localSettings.loginMessage} onChange={e => setLocalSettings({...localSettings, loginMessage: e.target.value})} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                          <h4 className="font-bold text-slate-800">Maintenance Mode</h4>
                          <p className="text-xs text-slate-500">Close app for everyone except admins</p>
                      </div>
                      <button
                          onClick={() => toggleSetting('maintenanceMode')}
                          className={`w-12 h-6 rounded-full relative transition-colors ${localSettings.maintenanceMode ? 'bg-blue-600' : 'bg-slate-300'}`}
                      >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${localSettings.maintenanceMode ? 'left-7' : 'left-1'}`} />
                      </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                          <h4 className="font-bold text-slate-800">Allow New Signups</h4>
                          <p className="text-xs text-slate-500">Enable or disable new user registration</p>
                      </div>
                      <button
                          onClick={() => toggleSetting('allowSignup')}
                          className={`w-12 h-6 rounded-full relative transition-colors ${localSettings.allowSignup ? 'bg-green-600' : 'bg-slate-300'}`}
                      >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${localSettings.allowSignup ? 'left-7' : 'left-1'}`} />
                      </button>
                  </div>

                  <button onClick={handleSaveSettings} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg">Save Configuration</button>
              </div>
          </div>
      )}

      {/* 8. PAYMENT CONFIG */}
      {activeTab === 'CONFIG_PAYMENT' && (
          <div className="p-6">
              <div className="flex items-center gap-2 mb-6 text-slate-800">
                  <button onClick={() => setActiveTab('DASHBOARD')}><ArrowLeft /></button>
                  <h2 className="font-bold text-xl">Payment Settings</h2>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                          <h4 className="font-bold text-slate-800">Enable Payments</h4>
                          <p className="text-xs text-slate-500">Show payment options in app</p>
                      </div>
                      <button
                          onClick={() => toggleSetting('isPaymentEnabled')}
                          className={`w-12 h-6 rounded-full relative transition-colors ${localSettings.isPaymentEnabled ? 'bg-green-600' : 'bg-slate-300'}`}
                      >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${localSettings.isPaymentEnabled ? 'left-7' : 'left-1'}`} />
                      </button>
                  </div>

                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">UPI ID</label>
                      <input className="w-full p-3 bg-slate-50 rounded-xl font-bold border" value={localSettings.upiId} onChange={e => setLocalSettings({...localSettings, upiId: e.target.value})} placeholder="e.g. name@upi" />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Payee Name</label>
                      <input className="w-full p-3 bg-slate-50 rounded-xl font-bold border" value={localSettings.upiName} onChange={e => setLocalSettings({...localSettings, upiName: e.target.value})} />
                  </div>
                  <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">QR Code Image URL</label>
                      <input className="w-full p-3 bg-slate-50 rounded-xl font-bold border" value={localSettings.qrCodeUrl} onChange={e => setLocalSettings({...localSettings, qrCodeUrl: e.target.value})} placeholder="https://..." />
                  </div>

                  <button onClick={handleSaveSettings} className="w-full py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg">Save Payment Settings</button>
              </div>
          </div>
      )}

      {/* 9. PRICING MANAGEMENT */}
      {activeTab === 'PRICING_MGMT' && (
          <div className="p-6">
              <div className="flex items-center gap-2 mb-6 text-slate-800">
                  <button onClick={() => setActiveTab('DASHBOARD')}><ArrowLeft /></button>
                  <h2 className="font-bold text-xl">Pricing & Packages</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* CREDIT PACKAGES */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><CreditCard size={20} /> Credit Packages</h3>
                      <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
                          {localSettings.packages.map(pkg => (
                              <div key={pkg.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                  <div>
                                      <p className="font-bold text-slate-800">{pkg.name}</p>
                                      <p className="text-xs text-slate-500">{pkg.credits} Credits • ₹{pkg.price}</p>
                                  </div>
                                  <button onClick={() => removePackage(pkg.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                              </div>
                          ))}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                          <input className="p-2 bg-slate-50 rounded border text-sm" placeholder="Name" value={newPkgName} onChange={e => setNewPkgName(e.target.value)} />
                          <input className="p-2 bg-slate-50 rounded border text-sm" placeholder="Credits" type="number" value={newPkgCredits} onChange={e => setNewPkgCredits(e.target.value)} />
                          <input className="p-2 bg-slate-50 rounded border text-sm" placeholder="Price" type="number" value={newPkgPrice} onChange={e => setNewPkgPrice(e.target.value)} />
                      </div>
                      <button onClick={addPackage} className="w-full mt-3 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm">Add Package</button>
                  </div>

                  {/* SUBSCRIPTION PLANS */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Crown size={20} /> Subscription Plans</h3>
                      <div className="space-y-4">
                          {localSettings.subscriptionPlans.map((plan, idx) => (
                              <div key={plan.id} className="p-4 border rounded-xl bg-slate-50 hover:bg-white hover:shadow-md transition-all cursor-pointer" onClick={() => setEditingPlanIdx(idx)}>
                                  <div className="flex justify-between items-center mb-1">
                                      <h4 className="font-bold text-slate-800">{plan.name}</h4>
                                      <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">₹{plan.price}</span>
                                  </div>
                                  <p className="text-xs text-slate-500">{plan.duration}</p>
                              </div>
                          ))}
                      </div>

                      {editingPlanIdx !== null && (
                          <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100 animate-in fade-in">
                              <h4 className="font-bold text-indigo-900 mb-2">Edit {localSettings.subscriptionPlans[editingPlanIdx].name}</h4>
                              <div className="grid grid-cols-2 gap-2 mb-2">
                                  <div>
                                      <label className="text-[10px] font-bold text-indigo-400 uppercase">Price</label>
                                      <input
                                          type="number"
                                          className="w-full p-2 rounded border border-indigo-200"
                                          value={localSettings.subscriptionPlans[editingPlanIdx].price}
                                          onChange={e => {
                                              const updated = [...localSettings.subscriptionPlans];
                                              updated[editingPlanIdx] = { ...updated[editingPlanIdx], price: Number(e.target.value) };
                                              setLocalSettings({ ...localSettings, subscriptionPlans: updated });
                                          }}
                                      />
                                  </div>
                                  <div>
                                      <label className="text-[10px] font-bold text-indigo-400 uppercase">Original Price</label>
                                      <input
                                          type="number"
                                          className="w-full p-2 rounded border border-indigo-200"
                                          value={localSettings.subscriptionPlans[editingPlanIdx].originalPrice}
                                          onChange={e => {
                                              const updated = [...localSettings.subscriptionPlans];
                                              updated[editingPlanIdx] = { ...updated[editingPlanIdx], originalPrice: Number(e.target.value) };
                                              setLocalSettings({ ...localSettings, subscriptionPlans: updated });
                                          }}
                                      />
                                  </div>
                              </div>
                              <button onClick={handleSaveSettings} className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-sm">Save Changes</button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* 10. USER MANAGEMENT (Clean Table) */}
      {activeTab === 'USERS' && (
          <div className="p-6">
              <div className="flex items-center gap-2 mb-6 text-slate-800">
                  <button onClick={() => setActiveTab('DASHBOARD')}><ArrowLeft /></button>
                  <h2 className="font-bold text-xl">User Database</h2>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="p-4 border-b bg-slate-50 flex items-center gap-2">
                      <Search className="text-slate-400" size={20} />
                      <input
                          className="bg-transparent font-bold text-slate-700 outline-none w-full"
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                      />
                  </div>
                  <div className="overflow-x-auto max-h-[600px]">
                      <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500 sticky top-0">
                              <tr>
                                  <th className="p-4">User</th>
                                  <th className="p-4">Contact</th>
                                  <th className="p-4">Credits</th>
                                  <th className="p-4">Plan</th>
                                  <th className="p-4">Joined</th>
                                  <th className="p-4 text-right">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                              {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.mobile.includes(searchTerm)).map(user => (
                                  <tr key={user.id} className="hover:bg-blue-50 transition-colors group">
                                      <td className="p-4">
                                          <div className="font-bold text-slate-800">{user.name}</div>
                                          <div className="text-xs text-slate-400 font-mono">{user.id}</div>
                                      </td>
                                      <td className="p-4">
                                          <div className="font-medium text-slate-600">{user.mobile}</div>
                                          <div className="text-xs text-slate-400">{user.email}</div>
                                      </td>
                                      <td className="p-4">
                                          <span className="font-black text-blue-600 bg-blue-100 px-2 py-1 rounded-lg">{user.credits}</span>
                                      </td>
                                      <td className="p-4">
                                          {user.isPremium ? (
                                              <span className="text-[10px] font-black bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-1 rounded shadow-sm flex items-center gap-1 w-fit">
                                                  <Crown size={10} /> {user.subscriptionTier}
                                              </span>
                                          ) : (
                                              <span className="text-xs font-bold text-slate-400">Free</span>
                                          )}
                                      </td>
                                      <td className="p-4 text-slate-500 text-xs">
                                          {new Date(user.createdAt).toLocaleDateString()}
                                      </td>
                                      <td className="p-4 text-right">
                                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                              <button onClick={() => { setDmUser(user); setDmText(''); }} className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200" title="Message"><MessageSquare size={16} /></button>
                                              <button onClick={() => openEditUser(user)} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200" title="Edit"><Edit3 size={16} /></button>
                                              <button onClick={() => deleteUser(user.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" title="Delete"><Trash2 size={16} /></button>
                                          </div>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                  <div className="p-6 bg-slate-50 border-b">
                      <h3 className="font-black text-xl text-slate-800">Edit User</h3>
                      <p className="text-sm text-slate-500">{editingUser.name}</p>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="text-xs font-bold text-slate-400 uppercase">Credits</label>
                          <input type="number" className="w-full p-3 rounded-xl border bg-slate-50 font-bold" value={editUserCredits} onChange={e => setEditUserCredits(Number(e.target.value))} />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
                          <input type="text" className="w-full p-3 rounded-xl border bg-slate-50 font-bold" value={editUserPass} onChange={e => setEditUserPass(e.target.value)} />
                      </div>

                      <div className="pt-4 border-t">
                          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Subscription Override</label>
                          <div className="grid grid-cols-3 gap-2 mb-2">
                              {['FREE', 'WEEKLY', 'MONTHLY', 'LIFETIME'].map(t => (
                                  <button
                                      key={t}
                                      onClick={() => setEditSubscriptionTier(t as any)}
                                      className={`p-2 rounded-lg text-xs font-bold border transition-all ${editSubscriptionTier === t ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                                  >
                                      {t}
                                  </button>
                              ))}
                          </div>
                          {editSubscriptionTier !== 'FREE' && (
                               <div className="flex gap-2">
                                  <input type="number" className="w-20 p-2 rounded border bg-slate-50 text-sm" value={editSubscriptionDays} onChange={e => setEditSubscriptionDays(Number(e.target.value))} placeholder="Days" />
                                  <span className="flex items-center text-sm font-bold text-slate-500">Days Validity</span>
                               </div>
                          )}
                      </div>
                  </div>
                  <div className="p-4 bg-slate-50 border-t flex gap-2">
                      <button onClick={() => setEditingUser(null)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                      <button onClick={saveEditedUser} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-colors">Save Changes</button>
                  </div>
              </div>
          </div>
      )}

      {/* DM MODAL */}
      {dmUser && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
                  <div className="p-6 bg-slate-50 border-b">
                      <h3 className="font-bold text-lg text-slate-800">Message {dmUser.name}</h3>
                  </div>
                  <div className="p-4">
                      <textarea
                          className="w-full h-32 p-3 bg-slate-50 rounded-xl border resize-none font-medium outline-none focus:border-blue-500"
                          placeholder="Type your message here..."
                          value={dmText}
                          onChange={e => setDmText(e.target.value)}
                      />
                  </div>
                  <div className="p-4 flex gap-2">
                      <button onClick={() => setDmUser(null)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl">Cancel</button>
                      <button onClick={sendDirectMessage} className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg">Send</button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};
