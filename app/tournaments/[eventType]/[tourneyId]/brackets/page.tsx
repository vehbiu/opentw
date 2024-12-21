'use client';

import React, { useState, useEffect, use, Suspense } from 'react';
import { getBracket, getBrackets } from '@/lib/api';
import { BracketData, Weight, Template, EventType } from '@/lib/types';
import { BracketFrame } from './bracket-frame';
import { 
    ChevronDown, 
    Eye, 
    Loader2, 
    Weight as WeightIcon,
    Layout,
    FileText,
    MenuIcon,
    XIcon,
    AlertCircle
} from 'lucide-react';

// Wrapper component for select inputs with icons
const SelectWrapper = ({ children, icon: Icon }: { children: React.ReactNode; icon: React.ComponentType<any> }) => (
    <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon size={18} />
        </div>
        {children}
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
    </div>
);

// Sidebar component with complete props
const BracketSidebar = ({
    bracketData,
    selectedWeight,
    selectedTemplate,
    onWeightChange,
    onTemplateChange,
    onPageToggle,
    onViewClick,
    isMobileMenuOpen,
    loading,
    onCloseMobile
}: {
    bracketData: BracketData;
    selectedWeight: Weight | null;
    selectedTemplate: Template | null;
    onWeightChange: (weight: Weight) => void;
    onTemplateChange: (template: Template) => void;
    onPageToggle: (pageId: number, checked: boolean) => void;
    onViewClick: () => void;
    isMobileMenuOpen: boolean;
    loading: boolean;
    onCloseMobile: () => void;
}) => {
    return (
        <div className={`
            ${isMobileMenuOpen ? 'block' : 'hidden'} 
            md:block fixed md:sticky z-20 w-full md:w-80 lg:w-96 
            rounded-xl
            max-h-fit
            border-r border-gray-200 bg-white shadow-xl drop-shadow-md md:shadow-none
            h-screen md:h-auto top-0 left-0 md:top-0
            overflow-y-auto
        `}>
            <div className="p-4 space-y-4 flex flex-col md:max-h-[calc(100vh-2rem)] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between md:justify-start pb-3 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800">Bracket Options</h2>
                    <button 
                        onClick={onCloseMobile}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-full"
                    >
                        <XIcon size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Options */}
                <div className="space-y-4 flex-grow overflow-y-auto rounded-2xl">
                    <div>
                        <label className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                            <WeightIcon size={16} className="text-gray-400" />
                            <span>Weight Class</span>
                        </label>
                        <SelectWrapper icon={WeightIcon}>
                            <select
                                className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-2xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                value={selectedWeight?.weight_index ?? ''}
                                onChange={(e) => {
                                    const weight = bracketData.weights[parseInt(e.target.value)];
                                    if (weight) onWeightChange(weight);
                                }}
                            >
                                <option value="" disabled>Select Weight Class</option>
                                {bracketData.weights.map((w) => (
                                    <option key={w.weight_index} value={w.weight_index}>
                                        {w.weight_name}
                                    </option>
                                ))}
                            </select>
                        </SelectWrapper>
                    </div>

                    {selectedWeight && (
                        <div>
                            <label className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                                <Layout size={16} className="text-gray-400" />
                                <span>Template</span>
                            </label>
                            <SelectWrapper icon={Layout}>
                                <select
                                    className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    value={selectedTemplate?.template_index ?? ''}
                                    onChange={(e) => {
                                        const template = bracketData.templates[parseInt(e.target.value)];
                                        if (template) onTemplateChange(template);
                                    }}
                                >
                                    {bracketData.templates
                                        .filter(t => t.bracket_id === selectedWeight.bracket_id)
                                        .map((t) => (
                                            <option key={t.template_id} value={t.template_id}>
                                                {t.template_name}
                                            </option>
                                        ))}
                                </select>
                            </SelectWrapper>
                        </div>
                    )}

                    {selectedTemplate && (
                        <div>
                            <label className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                <FileText size={16} className="text-gray-400" />
                                <span>Pages to Display</span>
                            </label>
                            <div className="space-y-2 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                                {selectedTemplate.pages.map((page) => (
                                    <label 
                                        key={page.page_id} 
                                        className="flex items-center p-3 hover:bg-white rounded-lg transition-colors cursor-pointer group"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={page.show_page}
                                            onChange={(e) => onPageToggle(page.page_id, e.target.checked)}
                                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md transition-all"
                                        />
                                        <span className="ml-3 text-sm text-gray-700 font-medium group-hover:text-gray-900">
                                            {page.page_name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Button */}
                <div className="pt-4 border-t border-gray-100">
                    <button
                        onClick={onViewClick}
                        disabled={!selectedWeight || !selectedTemplate || loading}
                        className="w-full p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 shadow-sm"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <Eye size={20} />
                        )}
                        <span className="font-medium">{loading ? 'Loading...' : 'View Bracket'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main component with all handlers and state management
export default function BracketViewer({
    params
}: {
    params: Promise<{ eventType: EventType; tourneyId: string | number; }>
}) {
    const { eventType, tourneyId } = use(params);
    const [bracketData, setBracketData] = useState<BracketData | null>(null);
    const [selectedWeight, setSelectedWeight] = useState<Weight | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [bracketHtml, setBracketHtml] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Initial data fetching
    useEffect(() => {
        const fetchBrackets = async () => {
            try {
                setLoading(true);
                const data = await getBrackets(eventType, tourneyId.toString());
                setBracketData(data);

                // Auto-select first weight and template if available
                if (data.weights.length > 0) {
                    setSelectedWeight(data.weights[0]);
                    const matchingTemplate = data.templates.find(
                        t => t.bracket_id === data.weights[0].bracket_id
                    );
                    if (matchingTemplate) setSelectedTemplate(matchingTemplate);
                }
            } catch (err) {
                setError('Failed to load brackets');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBrackets();
    }, [eventType, tourneyId]);

    // Handle weight class change
    const handleWeightChange = (weight: Weight) => {
        setSelectedWeight(weight);
        // Reset template when weight changes
        const matchingTemplate = bracketData?.templates.find(
            t => t.bracket_id === weight.bracket_id
        );
        setSelectedTemplate(matchingTemplate || null);
        setBracketHtml(null); // Clear current bracket view
    };

    // Handle template change
    const handleTemplateChange = (template: Template) => {
        setSelectedTemplate(template);
        setBracketHtml(null); // Clear current bracket view
    };

    // Handle page toggle
    const handlePageToggle = (pageId: number, checked: boolean) => {
        if (!selectedTemplate) return;
        
        setSelectedTemplate({
            ...selectedTemplate,
            pages: selectedTemplate.pages.map(page =>
                page.page_id === pageId ? { ...page, show_page: checked } : page
            )
        });
    };

    // Handle view bracket
    const handleViewBracket = async () => {
        if (!selectedWeight || !selectedTemplate) return;

        try {
            setLoading(true);
            const html = await getBracket(
                eventType,
                tourneyId.toString(),
                selectedWeight.weight_id,
                selectedTemplate.pages.filter(p => p.show_page).map(p => p.page_id)
            );
            setBracketHtml(html);
            setIsMobileMenuOpen(false); // Close mobile menu after viewing
        } catch (err) {
            setError('Failed to load bracket');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Loading state
    if (!bracketData) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="text-center space-y-4">
                    {error ? (
                        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl max-w-md mx-auto">
                            <div className="flex items-center space-x-3 text-red-600">
                                <AlertCircle size={24} />
                                <p className="font-medium">{error}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-4">
                            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                            <p className="text-gray-600 font-medium">Loading bracket data...</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Mobile Header */}
            <div className="md:hidden h-16 border-b border-gray-200 bg-white flex items-center px-4 fixed bottom-0 left-0 w-full z-10">
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                >
                    <MenuIcon size={24} className="text-gray-600" />
                </button>
                <h1 className="ml-3 text-lg font-semibold text-gray-800">Tournament Bracket</h1>
            </div>

            <div className="flex md:pt-4">
                <BracketSidebar
                    bracketData={bracketData}
                    selectedWeight={selectedWeight}
                    selectedTemplate={selectedTemplate}
                    onWeightChange={handleWeightChange}
                    onTemplateChange={handleTemplateChange}
                    onPageToggle={handlePageToggle}
                    onViewClick={handleViewBracket}
                    isMobileMenuOpen={isMobileMenuOpen}
                    loading={loading}
                    onCloseMobile={() => setIsMobileMenuOpen(false)}
                />

                <div className="flex-1 p-4 pt-0 overflow-auto drop-shadow-md">
                    <Suspense fallback={
                        <div className="h-full flex items-center justify-center">
                            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                        </div>
                    }>
                        {bracketHtml ? (
                            <div className="h-full rounded-xl overflow-hidden shadow-sm">
                                <BracketFrame frameInnerHtml={bracketHtml} />
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-white rounded-xl shadow-sm p-8">
                                <div className="text-center space-y-3">
                                    <div className="bg-gray-50 p-4 rounded-full inline-block">
                                        <Eye className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 max-w-sm">
                                        Select your options from the sidebar and click "View Bracket" to display the tournament bracket
                                    </p>
                                </div>
                            </div>
                        )}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}