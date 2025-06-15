'use client';

import { useState, useEffect } from 'react';

interface SearchBlock {
    id: number;
    type: string;
    label: string;
    value: string;
    placeholder: string;
}

interface SearchResult {
    id: number;
    name: string;
    path: string;
    size: string;
    modified: string;
    matches: number;
}

interface Preset {
    id: number;
    name: string;
    blocks: number;
    lastUsed: string;
}

export default function Page() {
    const [searchBlocks, setSearchBlocks] = useState<SearchBlock[]>([
        {
            id: 1,
            type: 'text',
            label: 'Text contains',
            value: '',
            placeholder: 'Enter search text...',
        },
    ]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [presets, setPresets] = useState<Preset[]>([
        { id: 1, name: 'Recent Documents', blocks: 2, lastUsed: '2 hours ago' },
        { id: 2, name: 'Image Files', blocks: 3, lastUsed: '1 day ago' },
        { id: 3, name: 'Code Files', blocks: 4, lastUsed: '3 days ago' },
    ]);
    const [showPreferences, setShowPreferences] = useState(false);
    const [activeTab, setActiveTab] = useState('search');

    const blockTypes = [
        { type: 'text', label: 'Text contains', icon: '🔍' },
        { type: 'filetype', label: 'File type', icon: '📄' },
        { type: 'folder', label: 'In folder', icon: '📁' },
        { type: 'date', label: 'Modified after', icon: '📅' },
        { type: 'size', label: 'File size', icon: '📏' },
        { type: 'regex', label: 'Regex pattern', icon: '🔧' },
    ];

    const addBlock = (type: string) => {
        const newBlock: SearchBlock = {
            id: Date.now(),
            type: type,
            label: blockTypes.find((b) => b.type === type)?.label || 'Filter',
            value: '',
            placeholder: getPlaceholder(type),
        };
        setSearchBlocks([...searchBlocks, newBlock]);
    };

    const removeBlock = (id: number) => {
        setSearchBlocks(searchBlocks.filter((block) => block.id !== id));
    };

    const updateBlock = (id: number, value: string) => {
        setSearchBlocks(
            searchBlocks.map((block) => (block.id === id ? { ...block, value } : block)),
        );
    };

    const getPlaceholder = (type: string) => {
        const placeholders: { [key: string]: string } = {
            text: 'Enter search text...',
            filetype: 'e.g., .pdf, .docx, .txt',
            folder: 'Select folder path...',
            date: 'Select date...',
            size: 'e.g., >1MB, <500KB',
            regex: 'Enter regex pattern...',
        };
        return placeholders[type] || 'Enter value...';
    };

    const handleSearch = () => {
        setIsSearching(true);
        // Simulate search
        setTimeout(() => {
            const results: SearchResult[] = [
                {
                    id: 1,
                    name: 'project-notes.txt',
                    path: '/Users/john/Documents/project-notes.txt',
                    size: '2.3 KB',
                    modified: '2 hours ago',
                    matches: 3,
                },
                {
                    id: 2,
                    name: 'meeting-summary.docx',
                    path: '/Users/john/Documents/Work/meeting-summary.docx',
                    size: '45.2 KB',
                    modified: '1 day ago',
                    matches: 7,
                },
                {
                    id: 3,
                    name: 'research.pdf',
                    path: '/Users/john/Downloads/research.pdf',
                    size: '1.2 MB',
                    modified: '3 days ago',
                    matches: 12,
                },
                {
                    id: 4,
                    name: 'config.json',
                    path: '/Users/john/Projects/app/config.json',
                    size: '892 B',
                    modified: '5 hours ago',
                    matches: 2,
                },
            ];
            setSearchResults(results);
            setIsSearching(false);
        }, 1500);
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden" data-oid="nm2u0ae">
            {/* Custom Titlebar */}
            <div
                className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between drag-region"
                data-oid="8:77jwh"
            >
                <div className="flex items-center space-x-3" data-oid="30so5zn">
                    <div
                        className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
                        data-oid="ivlzgok"
                    >
                        <span className="text-white font-bold text-sm" data-oid="edto:3k">
                            fA
                        </span>
                    </div>
                    <h1 className="text-lg font-semibold text-gray-800" data-oid="ehv:.3i">
                        fAInder
                    </h1>
                </div>
                <div className="flex items-center space-x-2" data-oid="dm2svib">
                    <button
                        onClick={() => setShowPreferences(true)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        data-oid="wrqm80."
                    >
                        <span className="text-gray-500" data-oid="_yr3.pn">
                            ⚙️
                        </span>
                    </button>
                    <div className="flex space-x-1" data-oid="okgicvz">
                        <div
                            className="w-3 h-3 bg-yellow-400 rounded-full"
                            data-oid="8mbw0.t"
                        ></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full" data-oid="i9j-lrq"></div>
                        <div className="w-3 h-3 bg-red-400 rounded-full" data-oid="p:a9069"></div>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden" data-oid="w__cax2">
                {/* Sidebar */}
                <div
                    className="w-64 bg-white border-r border-gray-200 flex flex-col"
                    data-oid="ic1-qtm"
                >
                    <nav className="p-4" data-oid="farllyc">
                        <div className="space-y-1" data-oid="q8jmik_">
                            <button
                                onClick={() => setActiveTab('search')}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                    activeTab === 'search'
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                                data-oid="agh04ns"
                            >
                                🔍 Search
                            </button>
                            <button
                                onClick={() => setActiveTab('presets')}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                    activeTab === 'presets'
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                                data-oid="c9wp8gi"
                            >
                                ⭐ Presets
                            </button>
                        </div>
                    </nav>

                    {activeTab === 'presets' && (
                        <div className="flex-1 p-4 pt-0" data-oid="m2m-eyn">
                            <h3
                                className="text-sm font-medium text-gray-700 mb-3"
                                data-oid="5fu.v-4"
                            >
                                Saved Presets
                            </h3>
                            <div className="space-y-2" data-oid=":n-u4hg">
                                {presets.map((preset) => (
                                    <div
                                        key={preset.id}
                                        className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                                        data-oid="sj:627c"
                                    >
                                        <div
                                            className="font-medium text-sm text-gray-800"
                                            data-oid="mzr0ihz"
                                        >
                                            {preset.name}
                                        </div>
                                        <div
                                            className="text-xs text-gray-500 mt-1"
                                            data-oid="jg_11i7"
                                        >
                                            {preset.blocks} blocks • {preset.lastUsed}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden" data-oid="2:l_5bz">
                    {activeTab === 'search' && (
                        <>
                            {/* Search Composer */}
                            <div
                                className="bg-white border-b border-gray-200 p-6"
                                data-oid="l1mlyet"
                            >
                                <div className="w-full" data-oid="c5miq7m">
                                    <h2
                                        className="text-xl font-semibold text-gray-800 mb-4"
                                        data-oid="xy341d4"
                                    >
                                        Build Your Search
                                    </h2>

                                    {/* Search Blocks */}

                                    <div
                                        className="flex items-center justify-between mb-6"
                                        data-oid="uqv-vtc"
                                    >
                                        <div className="flex flex-wrap gap-2" data-oid="rf740t_">
                                            {blockTypes.map((blockType) => (
                                                <button
                                                    key={blockType.type}
                                                    onClick={() => addBlock(blockType.type)}
                                                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors flex items-center space-x-2"
                                                    data-oid="0:.2__0"
                                                >
                                                    <span data-oid="ackdg2s">{blockType.icon}</span>
                                                    <span data-oid="uo9cabl">
                                                        Add {blockType.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex space-x-3" data-oid=":gb5rbo">
                                            <button
                                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                                data-oid="mc.a9:j"
                                            >
                                                Save as Preset
                                            </button>
                                            <button
                                                onClick={handleSearch}
                                                disabled={isSearching}
                                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                                                data-oid="1hoxm_3"
                                            >
                                                {isSearching ? (
                                                    <>
                                                        <div
                                                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                                                            data-oid="vxsk0wt"
                                                        ></div>
                                                        <span data-oid="xtbts4v">Searching...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span data-oid="ocbd287">🔍</span>
                                                        <span data-oid="uduk4oi">Search Files</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-3 mb-6" data-oid="z10s6b5">
                                        {searchBlocks.map((block, index) => (
                                            <div
                                                key={block.id}
                                                className="flex items-center space-x-3"
                                                data-oid="5qp60dm"
                                            >
                                                {index > 0 && (
                                                    <div
                                                        className="text-sm font-medium text-gray-500 px-2"
                                                        data-oid="v4mx8ht"
                                                    >
                                                        AND
                                                    </div>
                                                )}
                                                <div
                                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                                                    data-oid="ibyiv_."
                                                >
                                                    <div
                                                        className="flex items-center justify-between mb-2"
                                                        data-oid="b9ohuc6"
                                                    >
                                                        <span
                                                            className="text-sm font-medium text-gray-700"
                                                            data-oid="_alep03"
                                                        >
                                                            {block.label}
                                                        </span>
                                                        {searchBlocks.length > 1 && (
                                                            <button
                                                                onClick={() =>
                                                                    removeBlock(block.id)
                                                                }
                                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                                data-oid="dpnrnff"
                                                            >
                                                                ✕
                                                            </button>
                                                        )}
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={block.value}
                                                        onChange={(e) =>
                                                            updateBlock(block.id, e.target.value)
                                                        }
                                                        placeholder={block.placeholder}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        data-oid="juusji9"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add Block Dropdown */}

                                    {/* AI Suggestions */}
                                    <div
                                        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                                        data-oid="dewnhbn"
                                    >
                                        <div
                                            className="flex items-start space-x-3"
                                            data-oid="g915ljq"
                                        >
                                            <div
                                                className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                                data-oid="ig1fwr6"
                                            >
                                                <span
                                                    className="text-white text-xs"
                                                    data-oid="wy7v6ep"
                                                >
                                                    AI
                                                </span>
                                            </div>
                                            <div data-oid="72u3l.:">
                                                <p
                                                    className="text-sm text-blue-800 font-medium mb-1"
                                                    data-oid="nv_-xj6"
                                                >
                                                    AI Suggestion
                                                </p>
                                                <p
                                                    className="text-sm text-blue-700"
                                                    data-oid="-._9qyz"
                                                >
                                                    Try adding a &quot;File type&quot; filter to narrow down
                                                    your search results. Based on your query, you
                                                    might be looking for text documents.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Search Results */}
                            <div className="flex-1 overflow-auto p-6" data-oid="9sld5n0">
                                <div className="w-full" data-oid="6dn_nw9">
                                    {searchResults.length > 0 && (
                                        <>
                                            <div
                                                className="flex items-center justify-between mb-4"
                                                data-oid="8i:v.xo"
                                            >
                                                <h3
                                                    className="text-lg font-semibold text-gray-800"
                                                    data-oid="dkm_1as"
                                                >
                                                    Search Results ({searchResults.length})
                                                </h3>
                                                <div
                                                    className="text-sm text-gray-500"
                                                    data-oid="n:xtgrs"
                                                >
                                                    Found in 0.23 seconds
                                                </div>
                                            </div>
                                            <div className="space-y-3" data-oid=":7jhpfi">
                                                {searchResults.map((result) => (
                                                    <div
                                                        key={result.id}
                                                        className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all"
                                                        data-oid="jqjjzc4"
                                                    >
                                                        <div
                                                            className="flex items-start justify-between"
                                                            data-oid="g_ikyt7"
                                                        >
                                                            <div
                                                                className="flex-1"
                                                                data-oid="8p_-e_1"
                                                            >
                                                                <div
                                                                    className="flex items-center space-x-2 mb-1"
                                                                    data-oid="nrek5i9"
                                                                >
                                                                    <h4
                                                                        className="font-medium text-gray-800"
                                                                        data-oid="idhp2hm"
                                                                    >
                                                                        {result.name}
                                                                    </h4>
                                                                    <span
                                                                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                                                        data-oid="1n8cbz1"
                                                                    >
                                                                        {result.matches} matches
                                                                    </span>
                                                                </div>
                                                                <p
                                                                    className="text-sm text-gray-600 mb-2"
                                                                    data-oid="l0amgpi"
                                                                >
                                                                    {result.path}
                                                                </p>
                                                                <div
                                                                    className="flex items-center space-x-4 text-xs text-gray-500"
                                                                    data-oid="b7ajdlo"
                                                                >
                                                                    <span data-oid="f0c.2v0">
                                                                        {result.size}
                                                                    </span>
                                                                    <span data-oid="i7clfi3">
                                                                        Modified {result.modified}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="flex space-x-2 ml-4"
                                                                data-oid="m6l:n7x"
                                                            >
                                                                <button
                                                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium transition-colors"
                                                                    data-oid="7_alst:"
                                                                >
                                                                    Open
                                                                </button>
                                                                <button
                                                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium transition-colors"
                                                                    data-oid="35-ma71"
                                                                >
                                                                    Reveal
                                                                </button>
                                                                <button
                                                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium transition-colors"
                                                                    data-oid="0i56h1w"
                                                                >
                                                                    Copy Path
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Preferences Modal */}
            {showPreferences && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    data-oid="27ux2uq"
                >
                    <div
                        className="bg-white rounded-lg shadow-xl w-96 max-h-96 overflow-auto"
                        data-oid="xvl38c_"
                    >
                        <div className="p-6 border-b border-gray-200" data-oid="gqdzraz">
                            <div className="flex items-center justify-between" data-oid="jv.zbut">
                                <h3
                                    className="text-lg font-semibold text-gray-800"
                                    data-oid="_7i80ho"
                                >
                                    Preferences
                                </h3>
                                <button
                                    onClick={() => setShowPreferences(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                    data-oid="6kgvkcd"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4" data-oid=".ongu4x">
                            <div data-oid="nh4flgp">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="2ym509s"
                                >
                                    Default Search Directory
                                </label>
                                <input
                                    type="text"
                                    defaultValue="/Users/john/Documents"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    data-oid="3ljxf8t"
                                />
                            </div>
                            <div data-oid="h88bgie">
                                <label
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                    data-oid="v8ix9jq"
                                >
                                    Max Results
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    data-oid="hn0dgzz"
                                >
                                    <option data-oid="qe-0639">100</option>
                                    <option data-oid="i74qgha">500</option>
                                    <option data-oid="y0t3q2p">1000</option>
                                </select>
                            </div>
                            <div className="flex items-center" data-oid="bo8b-kd">
                                <input
                                    type="checkbox"
                                    id="case-sensitive"
                                    className="mr-2"
                                    data-oid="h2.wrqn"
                                />

                                <label
                                    htmlFor="case-sensitive"
                                    className="text-sm text-gray-700"
                                    data-oid="ozvw-m8"
                                >
                                    Case sensitive search by default
                                </label>
                            </div>
                        </div>
                        <div
                            className="p-6 border-t border-gray-200 flex justify-end space-x-3"
                            data-oid=".0i:ysk"
                        >
                            <button
                                onClick={() => setShowPreferences(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                data-oid="dz6vjhb"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowPreferences(false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                                data-oid="9-4fgpl"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
