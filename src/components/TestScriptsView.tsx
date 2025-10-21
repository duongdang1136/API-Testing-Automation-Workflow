import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import {
  CheckCircle2,
  Download,
  Eye,
  Copy,
  Code2,
  FileJson,
  Loader2,
  Search,
  User,
  FileText,
  Clock,
  Circle,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Input } from './ui/input';
import { TestScript, PostmanCollection, Project, Feature, AuthUser } from '../types/models';
import { toast } from 'sonner@2.0.3';

interface TestScriptsViewProps {
  testScripts: TestScript[];
  postmanCollection?: PostmanCollection;
  onGenerateJSON: () => void;
  isGenerating?: boolean;
  project: Project;
  feature: Feature;
  currentUser: AuthUser;
  onSelectFeature?: (feature: Feature) => void;
  onBack: () => void;
  onComplete?: () => void;
}

export function TestScriptsView({
  testScripts,
  postmanCollection,
  onGenerateJSON,
  isGenerating = false,
  project,
  feature,
  currentUser,
  onSelectFeature,
  onBack,
  onComplete,
}: TestScriptsViewProps) {
  const [selectedScript, setSelectedScript] = useState(testScripts[0] || null);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        toast.success('Code copied to clipboard!');
      })
      .catch((err) => {
        // Fallback for browsers without clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          toast.success('Code copied to clipboard!');
        } catch (e) {
          toast.error('Failed to copy code. Please copy manually.');
        }
        document.body.removeChild(textArea);
      });
  };

  const handleDownloadJSON = () => {
    if (!postmanCollection) return;

    const dataStr = JSON.stringify(postmanCollection, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${postmanCollection.info.name.replace(/\s+/g, '_')}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success('JSON file downloaded successfully!');
  };

  const handleViewJSON = () => {
    if (!postmanCollection) return;
    const dataStr = JSON.stringify(postmanCollection, null, 2);
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write('<pre>' + dataStr + '</pre>');
      newWindow.document.title = 'Postman Collection JSON';
    }
  };

  const handleComplete = () => {
    toast.success('Feature generation completed successfully!');
    if (onComplete) {
      onComplete();
    }
  };

  const recentFeatures = project.features.slice(0, 5);
  const credits = 1250;
  const maxCredits = 2000;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div
        className={`bg-white border-r border-cyan-200 transition-all duration-300 ${
          sidebarExpanded ? 'w-64' : 'w-16'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Project Header */}
          <div className="p-4 border-b border-cyan-200">
            {sidebarExpanded ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-cyan-900 truncate">{project.name}</h3>
                  <button
                    onClick={() => setSidebarExpanded(false)}
                    className="text-gray-400 hover:text-cyan-600"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
              </div>
            ) : (
              <button
                onClick={() => setSidebarExpanded(true)}
                className="w-full flex justify-center text-gray-400 hover:text-cyan-600"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {sidebarExpanded && (
            <>
              {/* Search */}
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search features..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 border-cyan-200 focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Recent Features */}
              <div className="flex-1 px-4 overflow-hidden">
                <p className="text-sm text-gray-500 mb-3">Recent features</p>
                <ScrollArea className="h-full max-h-96">
                  {recentFeatures.length > 0 ? (
                    <div className="space-y-2">
                      {recentFeatures.map((feat) => (
                        <button
                          key={feat.id}
                          onClick={() => onSelectFeature?.(feat)}
                          className="w-full p-3 rounded-lg border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50 cursor-pointer transition-colors text-left"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">{feat.name}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(feat.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge
                              className={
                                feat.status === 'completed'
                                  ? 'bg-green-100 text-green-700 border-green-200'
                                  : feat.status === 'in-progress'
                                  ? 'bg-cyan-100 text-cyan-700 border-cyan-200'
                                  : 'bg-gray-100 text-gray-700 border-gray-200'
                              }
                            >
                              {feat.status}
                            </Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No features yet</p>
                    </div>
                  )}
                </ScrollArea>
              </div>

              {/* Footer - Account & Credits */}
              <div className="p-4 border-t border-cyan-200 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Credits</span>
                    <span className="text-sm text-cyan-600">
                      {credits} / {maxCredits}
                    </span>
                  </div>
                  <Progress value={(credits / maxCredits) * 100} className="h-2" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">{currentUser.role}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-cyan-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-cyan-900">Step 2: AI Gen Test Scripts</h2>
              <p className="text-sm text-gray-600">{feature.name}</p>
            </div>
            <Button variant="outline" onClick={onBack} className="border-cyan-300">
              ← Back to Project
            </Button>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-8 space-y-6">
            {/* Success Alert */}
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Successfully generated {testScripts.length} test script{testScripts.length !== 1 ? 's' : ''}!
                {postmanCollection
                  ? ' Postman collection is ready for download.'
                  : ' Click Generate JSON to create Postman collection.'}
              </AlertDescription>
            </Alert>

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-cyan-900">Generated Test Scripts</h3>
                <p className="text-sm text-gray-600">
                  {testScripts.length} test script{testScripts.length !== 1 ? 's' : ''} generated
                </p>
              </div>
              <div className="flex items-center gap-3">
                {postmanCollection ? (
                  <>
                    <Button
                      onClick={handleViewJSON}
                      variant="outline"
                      className="border-cyan-300 text-cyan-700"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View JSON
                    </Button>
                    <Button
                      onClick={handleDownloadJSON}
                      className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download JSON
                    </Button>
                    <Button
                      onClick={handleComplete}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Hoàn tất
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={onGenerateJSON}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating JSON...
                      </>
                    ) : (
                      <>
                        <FileJson className="w-4 h-4 mr-2" />
                        Generate JSON
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Scripts Display */}
            <div className="grid grid-cols-12 gap-6">
              {/* Left: Script List */}
              <div className="col-span-4">
                <Card className="border-cyan-200">
                  <div className="p-4 border-b border-cyan-200 bg-cyan-50">
                    <h4 className="text-cyan-900">Test Scripts</h4>
                  </div>
                  <ScrollArea className="h-600" style={{height: '600px'}}>
                    <div className="p-3 space-y-2">
                      {testScripts.map((script) => (
                        <button
                          key={script.id}
                          onClick={() => setSelectedScript(script)}
                          className={`w-full p-3 rounded-lg border text-left transition-all ${
                            selectedScript?.id === script.id
                              ? 'border-cyan-400 bg-cyan-50'
                              : 'border-gray-200 hover:border-cyan-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-sm line-clamp-2">{script.title}</p>
                            <Badge className="bg-cyan-100 text-cyan-700 border-cyan-200 flex-shrink-0">
                              {script.language}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500">{script.framework}</p>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              </div>

              {/* Right: Script Details */}
              <div className="col-span-8">
                {selectedScript ? (
                  <Card className="border-cyan-200">
                    <div className="p-4 border-b border-cyan-200 bg-cyan-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-cyan-900 mb-1">{selectedScript.title}</h4>
                          <p className="text-sm text-gray-600">{selectedScript.description}</p>
                        </div>
                        <Button
                          onClick={() => handleCopyCode(selectedScript.code)}
                          variant="outline"
                          size="sm"
                          className="border-cyan-300 text-cyan-700"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>

                    <Tabs defaultValue="code" className="w-full">
                      <div className="border-b border-cyan-200 px-4">
                        <TabsList className="bg-transparent">
                          <TabsTrigger value="code" className="data-[state=active]:border-cyan-600">
                            <Code2 className="w-4 h-4 mr-2" />
                            Code
                          </TabsTrigger>
                          <TabsTrigger value="steps" className="data-[state=active]:border-cyan-600">
                            Steps
                          </TabsTrigger>
                          <TabsTrigger value="mockdata" className="data-[state=active]:border-cyan-600">
                            Mock Data
                          </TabsTrigger>
                        </TabsList>
                      </div>

                      <TabsContent value="code" className="p-0 m-0">
                        <ScrollArea className="h-550" style={{height: '550px'}}>
                          <pre className="p-4 text-sm bg-gray-900 text-gray-100 overflow-x-auto">
                            <code>{selectedScript.code}</code>
                          </pre>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent value="steps" className="p-4 m-0">
                        <ScrollArea className="h-550" style={{height: '550px'}}>
                          <div className="space-y-4">
                            {selectedScript.steps.map((step) => (
                              <div key={step.order} className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center">
                                  {step.order}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-900 mb-1">{step.action}</p>
                                  {step.input && (
                                    <p className="text-xs text-gray-600">
                                      Input: {typeof step.input === 'string' ? step.input : JSON.stringify(step.input)}
                                    </p>
                                  )}
                                  {step.expectedOutput && (
                                    <p className="text-xs text-gray-600">
                                      Expected: {typeof step.expectedOutput === 'string' ? step.expectedOutput : JSON.stringify(step.expectedOutput)}
                                    </p>
                                  )}
                                  {step.assertion && (
                                    <p className="text-xs text-cyan-700 mt-1">
                                      ✓ {step.assertion}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>

                      <TabsContent value="mockdata" className="p-4 m-0">
                        <ScrollArea className="h-550" style={{height: '550px'}}>
                          <pre className="text-sm bg-gray-50 p-4 rounded border border-gray-200 overflow-x-auto">
                            <code>{JSON.stringify(selectedScript.mockData, null, 2)}</code>
                          </pre>
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>
                  </Card>
                ) : (
                  <Card className="border-cyan-200 h-650 flex items-center justify-center" style={{height: '650px'}}>
                    <div className="text-center text-gray-400">
                      <Code2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Select a script to view details</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* JSON Preview (if generated) */}
            {postmanCollection && (
              <Card className="border-cyan-200">
                <div className="p-4 border-b border-cyan-200 bg-cyan-50">
                  <h4 className="text-cyan-900">Postman Collection JSON</h4>
                  <p className="text-sm text-gray-600">Ready to import into Postman</p>
                </div>
                <ScrollArea className="h-300" style={{height: '300px'}}>
                  <pre className="p-4 text-xs bg-gray-900 text-gray-100 overflow-x-auto">
                    <code>{JSON.stringify(postmanCollection, null, 2)}</code>
                  </pre>
                </ScrollArea>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Sidebar - Progress Tracker */}
      <div className="w-64 bg-white border-l border-cyan-200 p-6">
        <h3 className="text-cyan-900 mb-6">Generation Progress</h3>
        
        <div className="space-y-4">
          {/* Step 1 - Completed */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-green-100 border-2 border-green-500">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-900">
                Test Requirements Generated
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Completed
              </p>
            </div>
          </div>

          <Separator className="bg-cyan-200" />

          {/* Step 2 - Current/Completed */}
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              postmanCollection 
                ? 'bg-green-100 border-2 border-green-500' 
                : 'bg-cyan-600 text-white'
            }`}>
              {postmanCollection ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Code2 className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <p className={postmanCollection ? 'text-gray-900' : 'text-cyan-900'}>
                Test Scripts Generated
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {postmanCollection ? 'Completed' : `${testScripts.length} scripts ready`}
              </p>
            </div>
          </div>

          <Separator className="bg-cyan-200" />

          {/* Step 3 - Pending/Current */}
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              postmanCollection 
                ? 'bg-green-100 border-2 border-green-500' 
                : isGenerating
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-100 border-2 border-gray-300'
            }`}>
              {postmanCollection ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <p className={postmanCollection ? 'text-gray-900' : isGenerating ? 'text-cyan-900' : 'text-gray-500'}>
                Convert to JSON
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {postmanCollection ? 'Completed' : isGenerating ? 'Processing...' : 'Pending'}
              </p>
            </div>
          </div>
        </div>

        <Card className={`mt-6 p-4 ${postmanCollection ? 'bg-green-50 border-green-200' : 'bg-cyan-50 border-cyan-200'}`}>
          <div className="flex items-start gap-3">
            {postmanCollection ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-green-900">All Steps Completed!</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Download your Postman collection or click Hoàn tất to finish
                  </p>
                </div>
              </>
            ) : (
              <>
                <Clock className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-cyan-900">Step 2 Complete</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Click Generate JSON to create Postman collection
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
