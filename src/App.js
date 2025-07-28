import React, { useState, useCallback, useEffect, useMemo } from 'react';

// --- Helper Components ---

// A simple, reusable component to display JSON with syntax highlighting.
const JsonViewer = ({ title, data }) => (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
        <h3 className="text-lg font-semibold text-gray-700 p-3 border-b bg-white rounded-t-lg">{title}</h3>
        <pre className="p-4 overflow-auto text-sm text-gray-800 flex-grow">
            {JSON.stringify(data, null, 2)}
        </pre>
    </div>
);

// --- Core Logic ---

// Helper function to recursively extract all keys and build a hierarchical structure
const buildKeyTree = (obj, prefix = '', level = 0, parentPath = null) => {
    let keys = [];
    let currentId = 0;

    const processNode = (node, currentPrefix, currentLevel, currentParentPath) => {
        if (typeof node !== 'object' || node === null) return;

        if (Array.isArray(node)) {
            if (currentPrefix) {
                keys.push({ id: currentId++, path: currentPrefix, displayName: currentPrefix.split('.').pop(), level: currentLevel, parentPath: currentParentPath });
            }
            node.forEach((item) => processNode(item, `${currentPrefix}.[]`, currentLevel + 1, currentPrefix));
        } else {
            for (const key in node) {
                if (Object.prototype.hasOwnProperty.call(node, key)) {
                    const fullPath = currentPrefix ? `${currentPrefix}.${key}` : key;
                    const displayName = currentPrefix.endsWith('[]') ? `[].${key}` : key;
                    keys.push({ id: currentId++, path: fullPath, displayName, level: currentLevel, parentPath: currentParentPath });
                    processNode(node[key], fullPath, currentLevel + 1, fullPath);
                }
            }
        }
    };

    processNode(obj, prefix, level, parentPath);
    const uniqueKeysMap = new Map();
    keys.forEach(key => {
        if (!uniqueKeysMap.has(key.path)) uniqueKeysMap.set(key.path, key);
    });
    return Array.from(uniqueKeysMap.values()).sort((a, b) => a.path.localeCompare(b.path));
};

// Main App component
const App = () => {
    const [jsonData, setJsonData] = useState(null);
    const [filteredJsonData, setFilteredJsonData] = useState(null);
    const [allKeysFlat, setAllKeysFlat] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState(new Set());
    const [expandedKeys, setExpandedKeys] = useState(new Set());
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // The core filtering logic, rewritten for robustness.
    const filterJson = useCallback((data, selectedPaths, path = '') => {
        if (typeof data !== 'object' || data === null) {
            return selectedPaths.has(path) ? data : null;
        }

        if (Array.isArray(data)) {
            const arrayPath = path;
            const itemPath = path + '.[]';
            const filteredItems = data
                .map(item => filterJson(item, selectedPaths, itemPath))
                .filter(item => item !== null);
            return (filteredItems.length > 0 || selectedPaths.has(arrayPath)) ? filteredItems : null;
        }

        const newObj = {};
        let hasContent = false;
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const childPath = path ? `${path}.${key}` : key;
                const shouldProcessChild = [...selectedPaths].some(p => p.startsWith(childPath));
                if (shouldProcessChild) {
                    const filteredChild = filterJson(data[key], selectedPaths, childPath);
                    if (filteredChild !== null) {
                        newObj[key] = filteredChild;
                        hasContent = true;
                    }
                }
            }
        }
        return (hasContent || selectedPaths.has(path)) ? newObj : null;
    }, []);

    // Effect to update the filtered JSON view whenever selections change
    useEffect(() => {
        if (jsonData) {
            const filtered = filterJson(jsonData, selectedKeys);
            setFilteredJsonData(filtered);
        }
    }, [jsonData, selectedKeys, filterJson]);

    // Handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setFileName(file.name);
        setError('');
        setIsProcessing(true);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsedData = JSON.parse(e.target.result);
                const extracted = buildKeyTree(parsedData);
                if (extracted.length === 0) throw new Error('No keys found in JSON.');
                
                setJsonData(parsedData);
                setAllKeysFlat(extracted);
                setSelectedKeys(new Set(extracted.map(key => key.path)));
                setExpandedKeys(new Set());
            } catch (err) {
                setError(`Error: ${err.message}`);
                setJsonData(null);
                setAllKeysFlat([]);
            } finally {
                setIsProcessing(false);
            }
        };
        reader.onerror = () => {
            setError('Failed to read file.');
            setIsProcessing(false);
        };
        reader.readAsText(file);
    };

    // Handle key selection/deselection
    const handleKeyToggle = useCallback((keyPath, isParent) => {
        setSelectedKeys(prev => {
            const newSet = new Set(prev);
            const isSelected = newSet.has(keyPath);

            if (isSelected) {
                allKeysFlat.filter(k => k.path.startsWith(keyPath)).forEach(d => newSet.delete(d.path));
            } else {
                newSet.add(keyPath);
                let keyObj = allKeysFlat.find(k => k.path === keyPath);
                let parent = keyObj?.parentPath;
                while (parent) {
                    newSet.add(parent);
                    const parentKey = allKeysFlat.find(k => k.path === parent);
                    parent = parentKey?.parentPath;
                }
                if (isParent) {
                    allKeysFlat.filter(k => k.path.startsWith(keyPath + '.')).forEach(d => newSet.add(d.path));
                }
            }
            return newSet;
        });
    }, [allKeysFlat]);

    const handleToggleExpand = useCallback((keyPath) => {
        setExpandedKeys(prev => {
            const newSet = new Set(prev);
            newSet.has(keyPath) ? newSet.delete(keyPath) : newSet.add(keyPath);
            return newSet;
        });
    }, []);

    const handleSelectAll = useCallback(() => setSelectedKeys(new Set(allKeysFlat.map(k => k.path))), [allKeysFlat]);
    const handleDeselectAll = useCallback(() => setSelectedKeys(new Set()), []);

    const handleDownload = useCallback(() => {
        if (!filteredJsonData) {
            setError('No data to download.');
            return;
        }
        const jsonString = JSON.stringify(filteredJsonData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `filtered_${fileName || 'data'}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [filteredJsonData, fileName]);

    const filteredKeys = useMemo(() => {
        if (!searchTerm) return allKeysFlat;
        const lowerCaseSearch = searchTerm.toLowerCase();
        const matching = new Set();
        allKeysFlat.forEach(key => {
            if (key.path.toLowerCase().includes(lowerCaseSearch)) {
                matching.add(key.path);
                let parent = key.parentPath;
                while (parent) {
                    matching.add(parent);
                    const parentKey = allKeysFlat.find(k => k.path === parent);
                    parent = parentKey?.parentPath;
                }
            }
        });
        return allKeysFlat.filter(key => matching.has(key.path));
    }, [allKeysFlat, searchTerm]);

    const renderKeyItem = useCallback((keyObj) => {
        const isSelected = selectedKeys.has(keyObj.path);
        const hasChildren = allKeysFlat.some(k => k.parentPath === keyObj.path);
        const isExpanded = expandedKeys.has(keyObj.path);

        return (
            <div key={keyObj.id} style={{ paddingLeft: `${keyObj.level * 20}px` }}>
                <div className="flex items-center p-1 my-1 rounded-md">
                    {hasChildren ? (
                        <button onClick={() => handleToggleExpand(keyObj.path)} className="mr-2 text-gray-500 w-6 text-center">{isExpanded ? '▼' : '►'}</button>
                    ) : <div className="w-6 mr-2"></div>}
                    <input type="checkbox" checked={isSelected} onChange={() => handleKeyToggle(keyObj.path, hasChildren)} className="form-checkbox h-5 w-5 rounded mr-3 text-purple-600" />
                    <span className={`font-medium ${isSelected ? 'text-gray-800' : 'text-gray-400'}`}>{keyObj.displayName}</span>
                </div>
                {isExpanded && hasChildren && (
                    <div className="border-l-2 border-purple-200 ml-5">
                        {filteredKeys.filter(k => k.parentPath === keyObj.path).map(renderKeyItem)}
                    </div>
                )}
            </div>
        );
    }, [selectedKeys, expandedKeys, filteredKeys, handleToggleExpand, handleKeyToggle]);

    return (
        <div className="min-h-screen bg-gray-100 font-sans flex flex-col p-4">
            <header className="bg-white rounded-xl shadow-md p-4 mb-4 border border-gray-200">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-purple-800">JSON Side-by-Side Filter</h1>
                    <div className="flex items-center space-x-4">
                        <label htmlFor="json-upload" className="cursor-pointer px-4 py-2 bg-purple-500 text-white rounded-full shadow-md hover:bg-purple-600 transition">
                            {fileName ? `Loaded: ${fileName}` : 'Upload JSON'}
                        </label>
                        <input type="file" id="json-upload" accept=".json" onChange={handleFileUpload} className="hidden" />
                        <button onClick={handleDownload} disabled={!jsonData} className="px-4 py-2 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed">
                            Download Filtered
                        </button>
                    </div>
                </div>
                {error && <p className="mt-2 text-red-600 font-medium text-sm p-2 bg-red-50 rounded-md">{error}</p>}
            </header>

            <main className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-120px)]">
                {jsonData ? (
                    <>
                        {/* Left Column: Original JSON */}
                        <JsonViewer title="Original JSON" data={jsonData} />

                        {/* Center Column: Filter Controls */}
                        <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-md">
                            <h3 className="text-lg font-semibold text-gray-700 p-3 border-b">Filter Keys</h3>
                            <div className="p-3 border-b">
                                <input type="text" placeholder="Search keys..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
                                <div className="flex space-x-2 mt-2">
                                    <button onClick={handleSelectAll} className="flex-1 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition text-sm">Select All</button>
                                    <button onClick={handleDeselectAll} className="flex-1 px-3 py-1.5 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition text-sm">Deselect All</button>
                                </div>
                            </div>
                            <div className="flex-grow overflow-y-auto p-2">
                                {filteredKeys.filter(key => key.level === 0).map(renderKeyItem)}
                            </div>
                        </div>

                        {/* Right Column: Filtered JSON */}
                        <JsonViewer title="Filtered JSON" data={filteredJsonData} />
                    </>
                ) : (
                    <div className="md:col-span-3 flex items-center justify-center bg-white rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-gray-600">Upload a JSON file to begin</h2>
                            <p className="text-gray-400 mt-1">Your interactive filtering experience awaits.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
